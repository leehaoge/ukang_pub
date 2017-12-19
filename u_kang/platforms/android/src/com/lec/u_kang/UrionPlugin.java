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
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.urion.Beans.*;
import com.urion.Uuids;
import com.urion.BluetoothLeService;

/**
 * Created by Lanny Lee on 2017/12/19.
 */

public class UrionPlugin extends CordovaPlugin {

    private static enum Action {
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


    private int scanTime = 6 * 1000;
    private BluetoothManager mBluetoothManager;

    private CallbackContext scanCallbackContext;
    private CallbackContext rtDataCallbackContext;
    private Activity mActivity = null;
    private boolean backStop;


    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        mActivity = cordova.getActivity();
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

        return status;
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

                // isConnected = false;

            } else if (BluetoothLeService.ACTION_GATT_CONNECTED.equals(action)) {

            } else if (BluetoothLeService.ACTION_GATT_WRITE_SUCCESS
                    .equals(action)) {
                // isNotifyAble = true;

                mState = Msg.MESSAGE_STATE_CONNECTED;
                onMessage(new Msg(mState, ""));
                backStop = false;
                isRecivced = false;
                bleState = ble_connected;
                // byte[] sends = { (-2), (-3), (-86), (-96), 13, 10 };
                // gattCharacteristicWrite.setValue(sends);
                // mBluetoothLeService.getmBluetoothGatt().writeCharacteristic(gattCharacteristicWrite);

            } else if (DISCONNECTEDBLE.equals(action)) {
                // if(intent.getBooleanExtra("stop", false)){
                // byte[] send = {(byte)0xFD,(byte)0xFD,(byte)0xFE, 0x06, 0X0D,
                // 0x0A};
                // gattCharacteristicWrite.setValue(send);
                // mBluetoothLeService.getmBluetoothGatt().writeCharacteristic(gattCharacteristicWrite);
                // }
                // else{
                // mBluetoothLeService.disconnect();
                // mBluetoothLeService.close();
                // state.setText("disconnected");
                // }

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
    private boolean isRecivced;


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

    public void startScan(){
        mDevice = null;
        mBluetoothAdapter.startLeScan(mLeScanCallback);
        bleState = ble_scaning;
        mHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                // TODO Auto-generated method stub
                stopScan();
            }
        }, 15000);
    }



    public void stopScan() {
        // mScanning = false;
        L.d("-------------------->"+mBluetoothAdapter);
        L.d("-------------------->"+mLeScanCallback);

        mBluetoothAdapter.stopLeScan(mLeScanCallback);
        // center_button.setText("停止");
        if(mDevice == null){
            bleState = ble_scaning;
            mBluetoothAdapter.startLeScan(mLeScanCallback);
        }
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
                            startService();
                        }
                    }
                }
            });
        }
    };



    protected void startService() {
        if(!isBindServise ){
            Intent gattServiceIntent = new Intent(this, BluetoothLeService.class);
            // 启动services
            isBindServise = bindService(gattServiceIntent, mServiceConnection, BIND_AUTO_CREATE);
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
                finish();
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
//				getTipText().setText("已开启蓝牙");
//				getTipText().setOnClickListener(null);
//				initBlue();
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

}
