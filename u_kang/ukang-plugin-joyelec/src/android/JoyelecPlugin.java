package com.lec.u_kang;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import com.joyelectronics.BluetoothLeService;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;

/**
 * Created by lhy_uk on 2018/1/9.
 */

public class JoyelecPlugin extends CordovaPlugin {

    private static enum Action {
        findDevice,
        getResult
    }

    public final static int ble_scaning = 0;
    public final static int ble_connecting = 1;
    public final static int ble_connected = 3;
    public final static int ble_on = 2;
    public final static int ble_off = -1;
    public final static int ble_disConnected = -2;

    public static final String DISCONNECTEDBLE = "com.example.urionapp.disconnected";

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


    private Activity mActivity = null;
    private final Handler mHandler = new Handler();
    public int bleState = ble_off;
    private BleBroadCastRecever myBleRecever;
    private boolean finding = false;
    protected ArrayList<BluetoothDevice> mLeDevices = new ArrayList<BluetoothDevice>();
    // 连接GATT Serveice
    protected BluetoothLeService mBluetoothLeService;
    protected BluetoothAdapter mBluetoothAdapter;
    protected BluetoothDevice mDevice;
    private boolean isBleseviceRegiste;
    private boolean isBleReceiverRegiste;
    private boolean isBindServise;

    private CallbackContext scanCallbackContext;
    private CallbackContext resultCallbackContext;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        mActivity = cordova.getActivity();
        BluetoothManager manager = (BluetoothManager) mActivity.getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = manager.getAdapter();
        myBleRecever = new JoyelecPlugin.BleBroadCastRecever();
    }

    private static final int REQCODE_OPEN_BT = 2457;

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

    private boolean executeAndPossiblyThrow(Action action, JSONArray args, CallbackContext cbc) throws JSONException {
        boolean status = true;
        boolean bluetoothEnabled = false;
        switch (action) {
            case findDevice:
                bluetoothEnabled = enableBluetooth();
                if (bluetoothEnabled && !finding) {
                    mLeDevices.clear();
                    mActivity.registerReceiver(myBleRecever, new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED));
                    isBleReceiverRegiste = true;
                    finding = true;
                    scanCallbackContext = cbc;
                    initBlue();
                    startScan();
                }
                break;
            case getResult:
                //<==启动测量
                resultCallbackContext = cbc;
                reportBluetoothState();
                bluetoothEnabled = enableBluetooth();
                if (bluetoothEnabled) {
                    finding = false;
                    reportBluetoothState();
                    getResult(args, cbc);
                } else {
                    resultCallbackContext = null;
                }
                break;
        }

        return status;
    }

    private BluetoothDevice connectDevice(String address) {
        return mBluetoothAdapter.getRemoteDevice(address);
    }

    private void sendGaugeError(final CallbackContext cbc, final int errcode, final String errmsg) {
        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (cbc != null) {
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
            }
        });
    }

    /**
     * 连接失败
     */
    public static final int ERROR_CONNECTION_FAILED = 0;
    /**
     * 连接丢失
     */
    public static final int ERROR_CONNECTION_LOST = 1;

    private void getResult(JSONArray args, CallbackContext cbc) throws JSONException {
        JSONObject descriptor = args.getJSONObject(0);
        String address = descriptor.optString("address", null);
        if (address != null) {
            mDevice = connectDevice(address);
            if (mDevice == null) {
                sendGaugeError(cbc, ERROR_CONNECTION_FAILED, "无法连接体脂秤。");
                return;
            }
            mActivity.registerReceiver(myBleRecever, new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED));
            isBleReceiverRegiste = true;
            finding = false;
            initBlue();
            startService();
        }
    }

    /*
     * 监听广播类，用来实施的接受数据
     */
    private final BroadcastReceiver mGattUpdateReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, final Intent intent) {
            final String action = intent.getAction();
            if (BluetoothLeService.ACTION_DATA_AVAILABLE.equals(action)) {
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
                    if (!finding) {
                        reportBluetoothState();
                    }
                    resultCallbackContext = null;
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
                        mActivity.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
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
                        });
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

            } else if (DISCONNECTEDBLE.equals(action)) {
            }
        }
    };

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
            isBleseviceRegiste = false;
        }
        if (isBindServise) {
            mActivity.unbindService(mServiceConnection);
            isBindServise = false;
        }
    }

    private static final int scanTime = 15 * 1000;

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
                        String devName = device.getName();
                        L.d("device-->" + devName);
                        if (devName != null && devName.startsWith("ElecScalesBH")) {
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

    private static IntentFilter makeGattUpdateIntentFilter() {
        final IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_CONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_DISCONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED);
        intentFilter.addAction(BluetoothLeService.ACTION_DATA_AVAILABLE);
        return intentFilter;
    }

    public BroadcastReceiver getBroadCastReceiver() {
        // TODO Auto-generated method stub
        return mGattUpdateReceiver;
    }

    private void reportBluetoothState() throws JSONException {
        if (resultCallbackContext != null) {
            JSONObject msg = new JSONObject();
            msg.put("typeId", 1);
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
            resultCallbackContext.sendPluginResult(pluginResult);
        }
    }

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

    private int reTryCount;

    private void reTryConected(){
        reTryCount++;
        if(reTryCount < 4){
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    // TODO Auto-generated method stub
                    boolean isOk = mBluetoothLeService.connect(mDevice.getAddress());// 根据地址通过后台services去连接BLE蓝牙
                    L.d(reTryCount+" -----connect ok  ? >"+ isOk);
                    if(!isOk){
                        reTryConected();
                    }
                }
            }, 500);
        }
    }

    private String formatF(float f) {
        DecimalFormat df = new DecimalFormat("0.#");
        return df.format(f);
    }

    /**
     * 收到数据处理
     * @param data
     */
    protected void doWithData(byte[] data) {
        if (data[0] == (byte) 0xCE) {
            final float weight = (((int) (data[1] & 0xFF) << 8) + (int) (0xFF & data[2])) / 10.0f;
            final float radiation = (((int) (data[3] & 0xFF) << 8) + (int) (0xFF & data[4])) / 10.0f;


            if (resultCallbackContext != null) {
                mActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        int age = 25; // 随用户实际年龄修改
                        int height = 178; // 随用户实际身高修改

                        float fat = (9000*6370/(11554-(30-age+(4750+radiation)*84*weight)/(height*height))-5200)/10;
                        float water = (1000-fat*10)*11/160;
                        float muscle = (water*610+1600+20*weight-height*10)/1000-3;
                        float bone = (fat*103+312*water+weight*237+height*237-154170-49*age-246*muscle)/10000+13;
                        float bmr = ageGroup(age)*9*(weight*10)/10000;
                        float bmi = weight/((height*0.01f)*(height*0.01f));

                        JSONObject msg = new JSONObject();
                        JSONObject ret = new JSONObject();
                        try {
                            ret.put("体重", formatF(weight));
                            ret.put("脂肪", formatF(fat));
                            ret.put("肌肉", formatF(muscle));
                            ret.put("骨骼", formatF(bone));
                            ret.put("基础代谢率", formatF(bmr));
                            ret.put("bmi", formatF(bmi));
                            ret.put("水分", formatF(water));

                            msg.put("typeId", 4);
                            msg.put("type", "scales");
                            msg.put("value", ret);
                            resultCallbackContext.success(msg);
                            endResults();
                        } catch (JSONException e) {
                            //shouldn't ever happen.
                            e.printStackTrace();
                        }
                    }
                });
            }
        } else
        if (data[0] == (byte) 0xCA) {
            //测量的体重还未达到稳定值
            final float weight = (((int) (data[1] & 0xFF) << 8) + (int) (0xFF & data[2])) / 10.0f;
            if (resultCallbackContext != null) {
                mActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        JSONObject msg = new JSONObject();
                        try {
                            msg.put("typeId", 3);
                            msg.put("type", "scales");
                            msg.put("value", weight);
                            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, msg);
                            pluginResult.setKeepCallback(true);
                            resultCallbackContext.sendPluginResult(pluginResult);
                        } catch (JSONException e) {
                            //shouldn't ever happen.
                            e.printStackTrace();
                        }
                    }
                });
            }
        }

    }

    private void endResults() {
        mBluetoothLeService.disconnect();
        mHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                unInitBlue();
                if (isBleReceiverRegiste) {
                    mActivity.unregisterReceiver(myBleRecever);
                    isBleReceiverRegiste = false;
                }
                try {
                    reportBluetoothState();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                resultCallbackContext = null;
            }
        }, 500);
    }



    private int ageGroup(int age) {
        int group = 0;
        if (age >= 10 && age <=12){
            group = 6500;
        }else if(age >= 13 && age <= 15){
            group = 5700;
        }else if(age >= 16 && age <= 18){
            group = 3350;
        }else if(age >= 19 && age <= 30){
            group = 3225;
        }else if(age >= 31 && age <= 50){
            group = 3100;
        }else if(age >= 51 && age <= 60){
            group = 2600;
        }else if(age >= 61 && age <= 99){
            group = 2350;
        }
        return group;
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

}
