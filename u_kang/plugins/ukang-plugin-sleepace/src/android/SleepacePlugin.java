package com.lec.u_kang;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.os.Handler;
import android.text.TextUtils;

public class SleepacePlugin extends CordovaPlugin {

    private final Handler mHandler = new Handler();
	private boolean mScanning;
	private int scanTime = 6 * 1000;
	private BluetoothManager mBluetoothManager;
	private BluetoothAdapter mBluetoothAdapter;
	private CallbackContext scanCallbackContext;

	public SleepacePlugin() {
	}

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		mBluetoothManager = (BluetoothManager) cordova.getActivity().getSystemService(Context.BLUETOOTH_SERVICE);
		mBluetoothAdapter = mBluetoothManager.getAdapter();
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
//		JSONObject o;
//		String echo_value;
//		String dbname;

		switch (action) {
		case startScan:
			scanCallbackContext = cbc;
			scanBleDevice();
			break;
		case stopScan:
			stopScan();
			break;

		}
		return status;
	}

    @SuppressWarnings("deprecation")
	private boolean scanBleDevice(){
		if (!mScanning) {
            mScanning = true;
            mHandler.postDelayed(stopScanTask, scanTime);
            mBluetoothAdapter.startLeScan(mLeScanCallback);
            return true;
        }
		return false;
	}
    private final Runnable stopScanTask = new Runnable() {
        @Override
        public void run() {
            stopScan();
        }
    };
    
    @SuppressWarnings("deprecation")
	public void stopScan() {
        if (mScanning) {
            mScanning = false;
            mHandler.removeCallbacks(stopScanTask);
            //由于stopScan是延时后的操作，为避免断开或其他情况时把对象置空，所以以下2个对象都需要非空判断
            if (mBluetoothAdapter != null && mLeScanCallback != null) {
                mBluetoothAdapter.stopLeScan(mLeScanCallback);
            }
        }
    }

    private final BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(final BluetoothDevice device, int rssi, final byte[] scanRecord) {// Z1-140900000
        	cordova.getActivity().runOnUiThread(new Runnable() {
				@Override
				public void run() {
					// TODO Auto-generated method stub
					String modelName = device.getName();
					if(modelName != null){
						modelName = modelName.trim();
					}
		            String deviceName = BleDeviceNameUtil.getBleDeviceName(0xff, scanRecord);
		            if(deviceName != null){
		            	deviceName = deviceName.trim();
		            }
		            
		            if(!TextUtils.isEmpty(modelName) && !TextUtils.isEmpty(deviceName)){
		            	JSONObject result = new JSONObject();
		            	try {
							result.put("modelName", modelName);
							result.put("address", device.getAddress());
							result.put("deviceName", deviceName);
							result.put("deviceId", deviceName);
							scanCallbackContext.success(result);
						} catch (JSONException e) {
							scanCallbackContext.error(e.getMessage());
						}
		            }
				}
			});
        }
    };
	
	private static enum Action {
		startScan, stopScan
	}
	
	private static class BleDeviceNameUtil {

	    public static String getBleDeviceName(int type, byte []record ) {
			byte[] data = null;
			int index = 0;
			while (index < record.length) {
				int len = record[index] & 0xFF;
				int tp = record[index + 1] & 0xFF;
				if (index + len + 1 > 31) {
					break;
				} else if (len == 0) {
					break;
				}
				if (type == tp) {
					data = new byte[len - 1];
					for (int i = 0; i < len - 1; i++) {
						data[i] = record[index + 2 + i];
					}
					break;
				}
				index += (len + 1);
			}

			if(data != null){
				return new String(data);
			}

			return null;
		}
	}

}
