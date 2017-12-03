package com.lec.u_kang;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.sleepace.sdk.core.heartbreath.domain.LoginBean;
import com.sleepace.sdk.core.heartbreath.domain.RealTimeData;
import com.sleepace.sdk.interfs.IDataCallback;
import com.sleepace.sdk.interfs.IMonitorManager;
import com.sleepace.sdk.manager.BleHelper;
import com.sleepace.sdk.manager.CallbackData;
import com.sleepace.sdk.pillow.PillowHelper;
import com.sleepace.sdk.util.LogUtil;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.text.TextUtils;
import android.webkit.WebSettings.PluginState;

public class SleepacePlugin extends CordovaPlugin {

    private final Handler mHandler = new Handler();
	private boolean mScanning;
	private int scanTime = 6 * 1000;
	private BluetoothManager mBluetoothManager;
	private BluetoothAdapter mBluetoothAdapter;
	private CallbackContext scanCallbackContext;
	private CallbackContext rtDataCallbackContext;
	private PillowHelper pillowHelper;
	private Activity mActivity = null;

	public SleepacePlugin() {
	}

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		mBluetoothManager = (BluetoothManager) cordova.getActivity().getSystemService(Context.BLUETOOTH_SERVICE);
		mBluetoothAdapter = mBluetoothManager.getAdapter();
		mActivity = cordova.getActivity();
		pillowHelper = PillowHelper.getInstance(mActivity);
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
			if (enableBluetooth()) scanBleDevice();
			break;
		case stopScan:
			stopScan();
			break;
		case connect:
			if (enableBluetooth()) connect(args, cbc);
			break;
		case disconnect:
			disconnect();
			break;
		case startCollect:
			startCollect(cbc);
			break;
		case stopCollect:
			stopCollect(cbc);
			break;
		case startRealTimeData:
			rtDataCallbackContext = cbc;
			startRealTimeData(cbc);
			break;
		case stopRealTimeData:
			stopRealTimeData(cbc);
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
        	mActivity.runOnUiThread(new Runnable() {
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
    
    private boolean isConnected = false;
    
    private void connect(JSONArray args, final CallbackContext cbc) throws JSONException {
    	JSONObject arg = args.getJSONObject(0);
    	String deviceName = arg.optString("deviceName");
    	String address = arg.optString("address");
    	String deviceCode = arg.optString("deviceCode", "3_1");
    	int userId = arg.optInt("userId", 1);
    	int timeout = 10 * 1000;
    	pillowHelper.login(deviceName, address, deviceCode, userId, timeout, new IDataCallback<LoginBean>() {
			@Override
			public void onDataCallback(final CallbackData<LoginBean> cd) {
				// TODO Auto-generated method stub
				mActivity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						try {
							JSONObject result = new JSONObject();
							result.put("connected", cd.isSuccess());
							if(cd.isSuccess()){
								isConnected = true;
								cbc.success(result);
							}else{
								cbc.error(result);
							}
						} catch (JSONException e) {
							log("error in datacallback:" + e.getMessage());
							e.printStackTrace();
						}
					}
				});
				
			}
		});
    }
    
    private void disconnect() {
    	if (isConnected) {
    		pillowHelper.disconnect();
    	}
    }
    
    private void startCollect(final CallbackContext cbc) throws JSONException {
    	pillowHelper.startCollection(1000, new IDataCallback<Void>() {
			@Override
			public void onDataCallback(final CallbackData<Void> cd) {
				final boolean isSuccess = cd.isSuccess();
				mActivity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						try {
							if (isSuccess) {
								JSONObject result = new JSONObject();
								result.put("status", "connected");
								cbc.success(result);
							} else {
								cbc.error("collect fail.");
							}
						} catch (JSONException e) {
							e.printStackTrace();
						}
					}
				});
			}
		});    	
    }
    
    private void startRealTimeData(final CallbackContext cbc) throws JSONException {
		pillowHelper.startRealTimeData(1000, new IDataCallback<RealTimeData>() {
			@Override
			public void onDataCallback(final CallbackData<RealTimeData> cd) {
				mActivity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						try {
							if (cd.isSuccess()) {
								if (cd.getType() == IMonitorManager.TYPE_REALTIME_DATA) {
									log("got real time data.");
									RealTimeData data = cd.getResult();
									JSONObject result = new JSONObject();
									result.put("status", "RealTimeData");
									JSONObject dd = new JSONObject();
									dd.put("heartRate", data.getHeartRate());
									dd.put("breathRate", data.getBreathRate());
									result.put("data", dd);
									PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, result);
									pluginResult.setKeepCallback(true);
									rtDataCallbackContext.sendPluginResult(pluginResult);
								}
							} else {
								rtDataCallbackContext.error("error collecting.");
							}
						} catch (JSONException e) {
							e.printStackTrace();
						}
						
					}
				});
			}
		});
    }
    
    
    private void stopCollect(final CallbackContext cbc) throws JSONException {
		pillowHelper.stopCollection(1000, new IDataCallback<Void>() {
			@Override
			public void onDataCallback(final CallbackData<Void> cd) {
				mActivity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						cbc.success();
					}
				});
			}
		});
    }
    
    private void stopRealTimeData(final CallbackContext cbc) throws JSONException {
		pillowHelper.stopRealTimeData(1000, new IDataCallback<Void>() {
			@Override
			public void onDataCallback(final CallbackData<Void> cd) {
				mActivity.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						if (cd.isSuccess()) cbc.success();
						else cbc.error("stopCollect fail.");
					}
				});
			}
		});
		rtDataCallbackContext = null;
    }
    
	private boolean enableBluetooth() {
    	if(mBluetoothAdapter != null && mBluetoothAdapter.isEnabled()){
    		return true;
    	}else{
    		Intent enabler = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
			mActivity.startActivityForResult(enabler, BleHelper.REQCODE_OPEN_BT);
			return false;
    	}
	}
	
	private void log(String msg) {
		LogUtil.log("LEC-SLEEPACE:" + msg);
	}		
		
	private static enum Action {
		startScan, 
		stopScan,
		connect,
		disconnect,
		startCollect,
		stopCollect,
		startRealTimeData,
		stopRealTimeData
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
