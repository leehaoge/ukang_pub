package com.lec.u_kang;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import com.urion.Beans.Data;
import com.urion.Beans.Error;
import com.urion.Beans.Head;
import com.urion.Beans.IBean;
import com.urion.Beans.Msg;
import com.urion.Beans.Pressure;
import com.urion.BluetoothLeService;
import com.urion.Uuids;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

/**
 * Created by Lanny Lee on 2017/12/19.
 */

public class UrionPlugin extends CordovaPlugin {

    private static enum Action {
        findDevice,
        startGauge,  //<== 启动测量
        startScan,
        stopScan,
        connect,
        disconnect
    }

    public static final String DISCONNECTEDBLE = "com.example.urionapp.disconnected";

    public final static int ble_scaning = 0;
    public final static int ble_connecting = 1;
    public final static int ble_connected = 3;
    public final static int ble_on = 2;
    public final static int ble_off = -1;
    public final static int ble_disConnected = -2;


    public int bleState = ble_off;
    private boolean isBindServise;

    private final Handler mHandler = new Handler();
    protected ArrayList<BluetoothDevice> mLeDevices = new ArrayList<BluetoothDevice>();
    // 连接GATT Serveice
    protected BluetoothLeService mBluetoothLeService;
    protected BluetoothAdapter mBluetoothAdapter;
    protected BluetoothDevice mDevice;

    private BleBroadCastRecever myBleRecever;
    private boolean isBleseviceRegiste;
    private int reTryCount;


    private int scanTime = 15 * 1000;

    private CallbackContext scanCallbackContext;
    private CallbackContext rtDataCallbackContext;
    private Activity mActivity = null;
    private boolean backStop;

    private boolean finding = false;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        mActivity = cordova.getActivity();
        BluetoothManager manager = (BluetoothManager) mActivity.getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = manager.getAdapter();
        myBleRecever = new BleBroadCastRecever();
    }

    @Override
    public boolean execute(String actionAsString, JSONArray args, CallbackContext callbackContext)
            throws JSONException {

        Action action;
        try {
            action = Action.valueOf(actionAsString);
        } catch (IllegalArgumentException e) {
            // shouldn't ever happen
            return false;
        }

        try {
            return executeAndPossiblyThrow(action, args, callbackContext);
        } catch (JSONException e) {
            // TODO: signal JSON problem to JS
            return false;
        }
    }

    private CallbackContext gaugeCallbackContext = null;

    private boolean executeAndPossiblyThrow(Action action, JSONArray args, CallbackContext cbc) throws JSONException {
        boolean status = true;
        boolean bluetoothEnabled = false;
        switch (action) {
            case findDevice:
                bluetoothEnabled = enableBluetooth();
                if (bluetoothEnabled && !finding) {
                    mLeDevices.clear();
                    mActivity.registerReceiver(myBleRecever, new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED));
                    finding = true;
                    scanCallbackContext = cbc;
                    initBlue();
                    startScan();
                }
                break;
            case startGauge:
                //<==启动测量
                gaugeCallbackContext = cbc;
                reportBluetoothState();
                bluetoothEnabled = enableBluetooth();
                if (bluetoothEnabled) {
                    reportBluetoothState();
                    startGauge(args, cbc);
                } else {
                    gaugeCallbackContext = null;
                }
                break;
        }

        return status;
    }

    private BluetoothDevice connectDevice(String address) {
        return mBluetoothAdapter.getRemoteDevice(address);
    }

    private void sendGaugeError(CallbackContext cbc, int errcode, String errmsg) {
        JSONObject msg = new JSONObject();
        try {
            msg.put("errcode", errcode);
            msg.put("errmsg", errmsg);
            cbc.error(msg);
        } catch (JSONException e) {
            //this should not happen.
            e.printStackTrace();
        }
    }

    private void startGauge(JSONArray args, CallbackContext cbc) throws JSONException {
        JSONObject descriptor = args.getJSONObject(0);
        String address = descriptor.optString("address", null);
        if (address != null) {
            mDevice = connectDevice(address);
            if (mDevice == null) {
                sendGaugeError(cbc, Error.ERROR_CONNECTION_FAILED, "无法连接血压仪。");
                return;
            }
            mActivity.registerReceiver(myBleRecever, new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED));
            finding = false;
            initBlue();
            startService();
        }
    }

    private void endGauge() {
        mBluetoothLeService.disconnect();
        mHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                unInitBlue();
                mActivity.unregisterReceiver(myBleRecever);
                try {
                    reportBluetoothState();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                gaugeCallbackContext = null;
            }
        }, 500);
    }

    private static final int REQCODE_OPEN_BT = 2457;

    private static IntentFilter makeGattUpdateIntentFilter() {
        final IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_CONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_DISCONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED);
        intentFilter.addAction(BluetoothLeService.ACTION_DATA_AVAILABLE);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_WRITE_SUCCESS);
        return intentFilter;
    }

    public BroadcastReceiver getBroadCastReceiver() {
        // TODO Auto-generated method stub
        return mGattUpdateReceiver;
    }

    private void reportBluetoothState() throws JSONException {
        if (gaugeCallbackContext != null) {
            JSONObject msg = new JSONObject();
            msg.put("typeId", IBean.MESSAGE);
            msg.put("type", "message");
            msg.put("source", "bluetooth");

            switch (bleState) {
                case ble_off:
                    msg.put("value", "未打开");
                    break;
                case ble_on:
                    msg.put("value", "已打开");
                    break;
                case ble_connecting:
                    msg.put("value", "设备连接中");
                    break;
                case ble_connected:
                    msg.put("value", "设备已连接");
                    break;
                case ble_disConnected:
                    msg.put("value", "设备已断开");
                    break;
            }

            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, msg);
            pluginResult.setKeepCallback(true);
            gaugeCallbackContext.sendPluginResult(pluginResult);
        }
    }


    /*
     * 监听广播类，用来实施的接受数据
     */
    private final BroadcastReceiver mGattUpdateReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, final Intent intent) {
            final String action = intent.getAction();
            if (BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED
                    .equals(action)) {

                displayGattServices(mBluetoothLeService
                        .getSupportedGattServices());

            } else if (BluetoothLeService.ACTION_DATA_AVAILABLE.equals(action)) {
                // 获取面积图的数据
                L.d("ble get data ");
                byte[] data = intent.getExtras().getByteArray("data");
                L.d(Arrays.toString(data));
                doWithData(data);

            } else if (BluetoothLeService.ACTION_GATT_DISCONNECTED
                    .equals(action)) {
//                state.setText("disConnected");
//                bluetooth.setImageResource(R.drawable.bluetoothno);
                bleState = ble_disConnected;
                try {
                    reportBluetoothState();
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                // isConnected = false;

            } else if (BluetoothLeService.ACTION_GATT_CONNECTED.equals(action)) {
                bleState = ble_connected;
                if (finding) {
                    //found!
                    finding = false;
                    if (scanCallbackContext != null) {
                        JSONObject msg = new JSONObject();
                        try {
                            msg.put("name", mDevice.getName());
                            msg.put("address", mDevice.getAddress());
                            scanCallbackContext.success(msg);
                            scanCallbackContext = null;
                        } catch (JSONException e) {
                            //shouldn't ever happen.
                            e.printStackTrace();
                        }
                    }
                    mHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            mBluetoothLeService.disconnect();
                        }
                    }, 100);

                    mHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            unInitBlue();
                            mActivity.unregisterReceiver(myBleRecever);
                        }
                    }, 1000);
                } else {
                    try {
                        reportBluetoothState();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

            } else if (BluetoothLeService.ACTION_GATT_WRITE_SUCCESS
                    .equals(action)) {
                // isNotifyAble = true;

//                mState = Msg.MESSAGE_STATE_CONNECTED;
//                backStop = false;
//                bleState = ble_connected;
                // byte[] sends = { (-2), (-3), (-86), (-96), 13, 10 };
                // gattCharacteristicWrite.setValue(sends);
                // mBluetoothLeService.getmBluetoothGatt().writeCharacteristic(gattCharacteristicWrite);

            } else if (DISCONNECTEDBLE.equals(action)) {
                if (!finding) {
                    endGauge();
                }
            }
        }
    };

    // 设置setCharacteristicNotification 获取数据
    @SuppressLint("NewApi")
    private void displayGattServices(List<BluetoothGattService> gattServices) {
        if (gattServices == null)
            return;
        for (BluetoothGattService gattService : gattServices) {
            String uuid = gattService.getUuid().toString();
            List<BluetoothGattCharacteristic> gattCharacteristics = gattService
                    .getCharacteristics();
            if (uuid.equalsIgnoreCase(Uuids.SERVICE_UU)) {
                for (BluetoothGattCharacteristic gattCharacteristic : gattCharacteristics) {
                    String uuid1 = gattCharacteristic.getUuid().toString();
                    if (uuid1.equalsIgnoreCase(Uuids.NOTIFY_UU)) {
                        mBluetoothLeService.setCharacteristicNotification(
                                gattCharacteristic, true);
                    }
                    if (uuid1.equalsIgnoreCase(Uuids.WRITE_UU)) {
                        gattCharacteristicWrite = gattCharacteristic;
                    }
                }
            }
        }
    }
    private BluetoothGattCharacteristic gattCharacteristicWrite;
    private int mState;


    public void initBlue() {
        IntentFilter filter = makeGattUpdateIntentFilter();
        filter.addAction(DISCONNECTEDBLE);
        mActivity.registerReceiver(getBroadCastReceiver(), filter);
        isBleseviceRegiste = true;

        // 此时开始搜索蓝牙
        // FIXME 开启动画
        //getTipText().setText(R.string.ble_scan_);

        L.d("-------------------->"+mBluetoothAdapter);
        L.d("-------------------->"+mLeScanCallback);
    }

    public void unInitBlue() {
        if(isBleseviceRegiste){
            mActivity.unregisterReceiver(getBroadCastReceiver());
        }
        if (isBindServise) {
            mActivity.unbindService(mServiceConnection);
            isBindServise = false;
        }
    }

    public void startScan(){
        mDevice = null;
        mBluetoothAdapter.startLeScan(mLeScanCallback);
        bleState = ble_scaning;
        final boolean scan2find = finding;
        mHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                // TODO Auto-generated method stub
                if (!scan2find || finding)
                    stopScan();
            }
        }, scanTime);
    }

    public void stopScan() {
        // mScanning = false;
        L.d("-------------------->"+mBluetoothAdapter);
        L.d("-------------------->"+mLeScanCallback);

        mBluetoothAdapter.stopLeScan(mLeScanCallback);

        if (finding) {
            if (mDevice == null && scanCallbackContext != null) {
                scanCallbackContext.error("no device found");
            }
            mActivity.unregisterReceiver(myBleRecever);
            unInitBlue();
        }
        finding = false;
        bleState = ble_on;
        scanCallbackContext = null;

        // center_button.setText("停止");
//        if(mDevice == null){
//            bleState = ble_scaning;
//            mBluetoothAdapter.startLeScan(mLeScanCallback);
//        }
    }

    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {

        @Override
        public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {
        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!mLeDevices.contains(device)) {
                    mLeDevices.add(device);
                    L.d("device-->" + device.getName());
                    if (getDeviceName().equals(device.getName()) ||"Wileless BP".equals(device.getName()) ||"Urion BP".equals(device.getName())||"BLE to UART_2".equals(device.getName())) {
                        bleState = ble_connecting;
                        mDevice = device;
                        if (finding) {
                            mBluetoothAdapter.stopLeScan(mLeScanCallback);
                        }
                        startService();
                    }
                }
            }
        });
        }
    };

    protected void startService() {
        if(!isBindServise ){
            Intent gattServiceIntent = new Intent(mActivity, BluetoothLeService.class);
            // 启动services
            isBindServise = mActivity.bindService(gattServiceIntent, mServiceConnection, Context.BIND_AUTO_CREATE);
        }else{
            if(mBluetoothLeService != null){
                mBluetoothLeService.connect(mDevice.getAddress());// 根据地址通过后台services去连接BLE蓝牙
            }

        }
    }

    // 后台services,通过ServiceConnection找到IBinder-->service
    private final ServiceConnection mServiceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            // 获取services对象
            mBluetoothLeService = ((BluetoothLeService.LocalBinder) service).getService();
            if (!mBluetoothLeService.initialize()) {
                //TODO what will be better??
                return;
            }
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    boolean isOk = mBluetoothLeService.connect(mDevice.getAddress());// 根据地址通过后台services去连接BLE蓝牙
                    L.d("first  -----connect ok  ? >"+ isOk);
                    if(!isOk){
                        reTryConected();
                    }
                }
            });

        }

        // service因异常而断开连接的时候，这个方法才会用到。
        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            mBluetoothLeService = null;
            isBindServise = false;
        }

    };
//	private DialogFragment bleDialog;


    private void reTryConected(){
        reTryCount++;
        if(reTryCount < 4){
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    // TODO Auto-generated method stub
                    boolean isOk = mBluetoothLeService.connect(getDeviceName());// 根据地址通过后台services去连接BLE蓝牙
                    L.d(reTryCount+" -----connect ok  ? >"+ isOk);
                    if(!isOk){
                        reTryConected();
                    }
                }
            }, 500);
        }
    }

    /**
     * 让血压计开始测量的命令
     */
    private static byte[] CMD_STARTGAUGE = { (-3), (-3), -6, 5, 13, 10 }; //0xFD,0xFD,0xFA,0x05,0X0D, 0x0A
    private static byte[] CMD_TURNOFF = { (-3), (-3), -2, 6, 13, 10 }; //[0xFD,0xFD,0xFE, 0x06, 0X0D, 0x0A]

    private void sendCharacteristics(byte[] buffer) {
        if (gattCharacteristicWrite != null) {
            gattCharacteristicWrite.setValue(buffer);
            mBluetoothLeService.getBluetoothGatt().writeCharacteristic(gattCharacteristicWrite);
        }
    }



    /**
     * Urion蓝牙协议：
     * A5 => BT 闪亮时，给上位机发送此命令，等待连接;
     * [0xFD,0xFD,0xFA,0x05,0X0D, 0x0A] => 告之血压计,连接成功,并可以进行量测.
     * 同时血压计回复: [0xFD,0xFD,0x06, 0x0D, 0x0A],并开始量测.
     * 注:如果手机没有收到血压计回复,再循环发指令[0xFD,0xFD,0xFA,0x05,0X0D, 0x0A]5次.否则请关闭血压计,并重新启动连接.
     * 血压计量测过程中会发压力信号:	[0xFD,0xFD,0xFB,PressureH, PressureL,0X0D, 0x0A] FB (-5)
     *   注:Pressure信号为2bytes,所以压力为PressureH*256+PressureL,每S发送4次.
     * 量测完成后,血压计发送以下测试结果:
     * [0xFD,0xFD,0xFC, SYS,DIA,PUL, 0X0D, 0x0A]	;测试结果
     * 注: SYS为收缩压,DIA为舒张压,PUL为心率. 这个数据血压会连续传5次.  E-1,E-2,E-3,E-4,E-E,E-B为错误代码.
     * [0xFD,0xFD,0xFD,0x0E, 0X0D, 0x0A]		;E-E	 EEPROM异常  血压计异常,联系你的经销商
     * [0xFD,0xFD,0xFD,0x01, 0X0D, 0x0A]		;E-1	 人体心跳信号太小或压力突降[0xFD,0xFD,0xFD,0x02, 0X0D, 0x0A]		;E-2	 杂讯干扰
     * [0xFD,0xFD,0xFD,0x03, 0X0D, 0x0A]		;E-3 充气时间过长
     * [0xFD,0xFD,0xFD,0x05, 0X0D, 0x0A]		;E-5 测得的结果异常
     * [0xFD,0xFD,0xFD,0x0C, 0X0D, 0x0A]		;E-C 校正异常
     * 量测错误,请根据说明书,重新戴好CUFF,保持安静,重新量测. (以上5项都用这句话).
     * [0xFD,0xFD,0xFD,0x0B, 0X0D, 0x0A]		;E-B 电源低电压  电池电量低,请更换电池.
     *
     */


    /**
     * 收到数据处理
     * @param data
     */
    protected void doWithData(byte[] data) {
        if (data.length == 1 && (byte) data[0] == -91) {
            //A5 => 设备等待连接
            sendCharacteristics(CMD_STARTGAUGE); //<= 发送“开始测量”命令
        } else
        if (data.length > 2 && data[0] == data[1] && data[1] == -3) {
            //收到 [0xFD,0xFD, XXX 格式的数据了。
            Head head = new Head();
            int[] f = CodeFormat.bytesToHexStringTwo(data, data.length);
            head.analysis(f);
            if (head.getType() == Head.TYPE_ERROR) {
                // APP接收到血压仪的错误信息

                Error error = new Error();
                error.analysis(f);
                error.setHead(head);
                // 前台根据错误编码显示相应的提示

                onError(error);



            }
            if (head.getType() == Head.TYPE_RESULT) {
                // APP接收到血压仪的测量结果
                Data d = new Data();
                d.analysis(f);
                d.setHead(head);
                // 前台根据测试结果来画线性图
                onReceive(d);
//			send(IBean.DATA, data);
            }

            if (head.getType() == Head.TYPE_MESSAGE) {
                // APP接收到血压仪开始测量的通知
                Msg msg = new Msg();
                msg.analysis(f);

                msg.setHead(head);
                onReceive(msg);
                //send(IBean.MESSAGE, msg);
            }
            if (head.getType() == Head.TYPE_PRESSURE) {
                // APP接受到血压仪测量的压力数据
                Pressure pressure = new Pressure();
                pressure.analysis(f);
                pressure.setHead(head);
                // 每接收到一条数据就发送到前台，以改变进度条的显示
                onReceive(pressure);
//			send(IBean.DATA, pressure);
            }
        }
    }

    public void onReceive(IBean bean)  {
        switch (bean.getHead().getType()) {
            case Head.TYPE_PRESSURE:
                //got pressure
                Pressure pressure = (Pressure) bean;
                final int pValue = pressure.getPressure();
                if (gaugeCallbackContext != null) {
                    //发送压力数据
                    mActivity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            JSONObject msg = new JSONObject();
                            try {
                                msg.put("typeId", IBean.PRESSURE);
                                msg.put("type", "pressure");
                                msg.put("value", pValue);

                                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, msg);
                                pluginResult.setKeepCallback(true);
                                gaugeCallbackContext.sendPluginResult(pluginResult);
                            } catch (JSONException e) {
                                //shouldn't ever happen.
                                e.printStackTrace();
                            }
                        }
                    });
                }
                break;
            case Head.TYPE_RESULT:
                //got result
                Data data = (Data) bean;
                ContentValues value = new ContentValues();
                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm aaa");
                Date curDate = new Date(System.currentTimeMillis());// 获取当前时间
                String str = formatter.format(curDate);
                final int sys = data.getSys();
                final int dia = data.getDia();
                final int pul = data.getPul();
                if (gaugeCallbackContext != null) {
                    //发送压力数据
                    mActivity.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            JSONObject msg = new JSONObject();
                            JSONObject value = new JSONObject();
                            try {
                                msg.put("typeId", IBean.RESULT);
                                msg.put("type", "result");
                                value.put("sys", sys);
                                value.put("dia", dia);
                                value.put("pul", pul);
                                msg.put("value", value);

                                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, msg);
                                pluginResult.setKeepCallback(true);
                                gaugeCallbackContext.sendPluginResult(pluginResult);

                            } catch (JSONException e) {
                                //shouldn't ever happen.
                                e.printStackTrace();
                            }
                        }
                    });
                }
                //测量已经结束，此时应该关闭蓝牙
                sendCharacteristics(CMD_TURNOFF);
                endGauge();
        }
    }

    public void onError(Error error) {
        switch (error.getError()) {
            case Error.ERROR_EEPROM:
                if (gaugeCallbackContext != null) {
                    sendGaugeError(gaugeCallbackContext, Error.ERROR_EEPROM, "EEPROM异常");
                }
                break;
            case Error.ERROR_HEART:
                if (gaugeCallbackContext != null) {
                    sendGaugeError(gaugeCallbackContext, Error.ERROR_HEART, "人体心跳信号太小或压力突降");
                }
                break;
            case Error.ERROR_DISTURB:
                if (gaugeCallbackContext != null) {
                    sendGaugeError(gaugeCallbackContext, Error.ERROR_DISTURB, "杂讯干扰");
                }
                break;
            case Error.ERROR_GASING:
                if (gaugeCallbackContext != null) {
                    sendGaugeError(gaugeCallbackContext, Error.ERROR_GASING, "充气时间过长");
                }
                break;
            case Error.ERROR_TEST:
                if (gaugeCallbackContext != null) {
                    sendGaugeError(gaugeCallbackContext, Error.ERROR_TEST, "测得的结果异常");
                }
                break;
            case Error.ERROR_REVISE:
                if (gaugeCallbackContext != null) {
                    sendGaugeError(gaugeCallbackContext, Error.ERROR_REVISE, "校正异常");
                }
                break;
            case Error.ERROR_POWER:
                if (gaugeCallbackContext != null) {
                    sendGaugeError(gaugeCallbackContext, Error.ERROR_POWER, "电源低电压");
                }
                break;
        }
        mActivity.sendBroadcast(new Intent(DISCONNECTEDBLE));
    }



    /**
     * 开启蓝牙，如果已经开启，返回true；如果没，弹出对话框询问用户开启，此时返回false。
     * @return
     */
    private boolean enableBluetooth() {
        if(mBluetoothAdapter != null && mBluetoothAdapter.isEnabled()){
            return true;
        }else{
            Intent enabler = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            mActivity.startActivityForResult(enabler, REQCODE_OPEN_BT);
            return false;
        }
    }

    class BleBroadCastRecever extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String stateExtra = BluetoothAdapter.EXTRA_STATE;
            int state = intent.getIntExtra(stateExtra, -1);
            switch (state) {
                case BluetoothAdapter.STATE_TURNING_ON:
                    break;
                case BluetoothAdapter.STATE_ON:
                    bleState = ble_on;
                    startScan();
                    break;
                case BluetoothAdapter.STATE_TURNING_OFF:
                    bleState = ble_off;
                    break;
                case BluetoothAdapter.STATE_OFF:
                    bleState = ble_off;
                    break;
            }
        }
    }

    public String getDeviceName() {
        return "Bluetooth BP";
    }

    public String getUUID() {
        return Uuids.SERVICE_UU;
    }

    private static class L {

        private L() {
		/* cannot be instantiated */
            throw new UnsupportedOperationException("cannot be instantiated");
        }

        public static boolean isDebug = true;// 是否需要打印bug，可以在application的onCreate函数里面初始化
        private static final String TAG = "Terry";

        // 下面四个是默认tag的函数
        public static void i(String msg) {
            if (isDebug)
                Log.i(TAG, msg);
        }

        public static void d(String msg) {
            if (isDebug)
                Log.d(TAG, msg);
        }

        public static void e(String msg) {
            if (isDebug)
                Log.e(TAG, msg);
        }

        public static void v(String msg) {
            if (isDebug)
                Log.v(TAG, msg);
        }


        public static void e(String msg,Throwable thr){
            if (isDebug)
                Log.e(TAG,msg,thr);
        }

        // 下面是传入自定义tag的函数
        public static void i(String tag, String msg) {
            if (isDebug)
                Log.i(tag, msg);
        }

        public static void d(String tag, String msg) {
            if (isDebug)
                Log.i(tag, msg);
        }

        public static void e(String tag, String msg) {
            if (isDebug)
                Log.i(tag, msg);
        }

        public static void v(String tag, String msg) {
            if (isDebug)
                Log.i(tag, msg);
        }

    }

    private static class CodeFormat {

        static String dataOne;
        /*
         * 16进制数字字符集
         */
        private static String hexString = "0123456789ABCDEF";

        /*
         * 将字符串编码成16进制数字,适用于所有字符（包括中文）
         */
        public static String encode(String str) {
            dataOne = str;
            // 根据默认编码获取字节数组
            byte[] bytes = str.getBytes();
            StringBuilder sb = new StringBuilder(bytes.length * 2);
            // 将字节数组中每个字节拆解成2位16进制整数
            for (int i = 0; i < bytes.length; i++) {
                sb.append(hexString.charAt((bytes[i] & 0xf0) >> 4));
                sb.append(hexString.charAt((bytes[i] & 0x0f) >> 0) + " ");
            }

            return sb.toString();

        }

        /*
         * 将16进制数字解码成字符串,适用于所有字符（包括中文）
         */
        public static String decode(String bytes) {

            ByteArrayOutputStream baos = new ByteArrayOutputStream(
                    bytes.length() / 2);
            // 将每2位16进制整数组装成一个字节
            for (int i = 0; i < bytes.length(); i += 2)
                baos.write((hexString.indexOf(bytes.charAt(i)) << 4 | hexString
                        .indexOf(bytes.charAt(i + 1))));
            return new String(baos.toByteArray());

        }

        public static String StringFilter(String str) throws PatternSyntaxException {
            // 只允许字母和数字
            // String regEx = "[^a-zA-Z0-9]";
            // 清除掉所有特殊字符
            String regEx = "[`~!@#$%^&*()+=|{}':;',//[//].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]";
            Pattern p = Pattern.compile(regEx);
            Matcher m = p.matcher(str);
            return m.replaceAll("").trim();
        }

        /**
         * 　　* Convert byte[] to hex
         * string.这里我们可以将byte转换成int，然后利用Integer.toHexString(int)来转换成16进制字符串。
         *
         * 　　* @param src byte[] data
         *
         * 　　* @return hex string
         *
         *
         */

        public static String bytesToHexString(byte[] src) {

            StringBuilder stringBuilder = new StringBuilder("");
            if (src == null || src.length <= 0) {

                return null;

            }

            for (int i = 0; i < 20; i++) {

                int v = src[i] & 0xFF;

                String hv = Integer.toHexString(v);

                if (hv.length() < 2) {

                    stringBuilder.append(0);
                    System.out.println(stringBuilder);
                }

                stringBuilder.append(hv);

            }

            return stringBuilder.toString();

        }

        /** */
        /**
         * 把字节数组转换成16进制字符串
         *
         * @param bArray
         * @return
         */
        public static final int[] bytesToHexStringTwo(byte[] bArray, int count) {
            int[] fs = new int[count];
            for (int i = 0; i < count; i++) {
                fs[i] = (0xFF & bArray[i]);
            }
            return fs;
        }

        // 分割字符串
        public static String Stringspace(String str) {

            String temp = "";
            String temp2 = "";
            for (int i = 0; i < str.length(); i++) {

                if (i % 2 == 0) {
                    temp = str.charAt(i) + "";
                    temp2 += temp;
                    System.out.println(temp);
                } else {
                    temp2 += str.charAt(i) + " ";
                }

            }
            return temp2;
        }

        /**
         * Byte -> Hex
         *
         * @param bytes
         * @return
         */
        public static String byteToHex(byte[] bytes, int count) {
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < count; i++) {
                String hex = Integer.toHexString(bytes[i] & 0xFF);
                if (hex.length() == 1) {
                    hex = '0' + hex;
                }
                sb.append(hex).append(" ");
            }
            return sb.toString();
        }

        /**
         * String -> Hex
         *
         * @param s
         * @return
         */
        public static String stringToHex(String s) {
            String str = "";
            for (int i = 0; i < s.length(); i++) {
                int ch = (int) s.charAt(i);
                String s4 = Integer.toHexString(ch);
                if (s4.length() == 1) {
                    s4 = '0' + s4;
                }
                str = str + s4 + " ";
            }
            return str;
        }

    }

}
