package com.urion;

import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import java.util.List;
import java.util.UUID;

public class BluetoothLeService extends Service {
	private final static String TAG = BluetoothLeService.class.getSimpleName();
	private BluetoothManager mBluetoothManager;
	private BluetoothAdapter mBluetoothAdapter;
	private String mBluetoothDeviceAddress;
	// 它是GATT profile的封装。通过这个对象，我们就能进行GATT Client端的相关操作
	private BluetoothGatt mBluetoothGatt;
	private int mConnectionState = STATE_DISCONNECTED;
	private static final int STATE_DISCONNECTED = 0;
	private static final int STATE_CONNECTING = 1;
	private static final int STATE_CONNECTED = 2;
	public final static String ACTION_GATT_CONNECTED = "ACTION_GATT_CONNECTED";
	public final static String ACTION_GATT_DISCONNECTED = "ACTION_GATT_DISCONNECTED";
	public final static String ACTION_GATT_SERVICES_DISCOVERED = "ACTION_GATT_SERVICES_DISCOVERED";
	public final static String ACTION_DATA_AVAILABLE = "ACTION_DATA_AVAILABLE";
	public final static String ACTION_GATT_WRITE_SUCCESS = "ACTION_GATT_WRITE_SUCCESS";
//	public final static UUID UUID_HEART_RATE_MEASUREMENT = UUID
//			.fromString(SampleGattAttributes.HEART_RATE_MEASUREMENT);

	// 用于传递一些连接状态及结果
	private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
		// 状态连接改变
		@Override
		public void onConnectionStateChange(BluetoothGatt gatt, int status,
				int newState) {
			String intentAction;
			if (newState == BluetoothProfile.STATE_CONNECTED) {
				intentAction = ACTION_GATT_CONNECTED;
				mConnectionState = STATE_CONNECTED;
				broadcastUpdate(intentAction);
				boolean bb = mBluetoothGatt.discoverServices();
				Log.i(TAG, "Connected to GATT server."+bb);
			} else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
				intentAction = ACTION_GATT_DISCONNECTED;
				mConnectionState = STATE_DISCONNECTED;
				Log.i(TAG, "Disconnected from GATT server.");
				broadcastUpdate(intentAction);
			}
		}

		@Override
		public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
			super.onDescriptorWrite(gatt, descriptor, status);
			if(status == BluetoothGatt.GATT_SUCCESS){
				Log.d("==","success");
				Intent intent = new Intent(ACTION_GATT_WRITE_SUCCESS);
				sendBroadcast(intent);
			}
		}



		// 发现新服务端 低功耗设备发现
		@Override
		public void onServicesDiscovered(BluetoothGatt gatt, int status) {
			if (status == BluetoothGatt.GATT_SUCCESS) {
				broadcastUpdate(ACTION_GATT_SERVICES_DISCOVERED);
			} else {
				Log.w(TAG, "onServicesDiscovered received: " + status);
			}
		}
		
		@Override
		public void onCharacteristicWrite(BluetoothGatt gatt,
				BluetoothGattCharacteristic characteristic, int status) {
			// TODO Auto-generated method stub
			
		}
		
		// 读写特性
		@Override
		public void onCharacteristicRead(BluetoothGatt gatt,
				BluetoothGattCharacteristic characteristic, int status) {
//			if (status == BluetoothGatt.GATT_SUCCESS) {
//				broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
//			}
		}

		// 数据改变通知
		@Override
		public void onCharacteristicChanged(BluetoothGatt gatt,
				BluetoothGattCharacteristic characteristic) {
			broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
		}
	};

	private void broadcastUpdate(final String action) {
		final Intent intent = new Intent(action);
		sendBroadcast(intent);
	}

	private void broadcastUpdate(final String action,
			final BluetoothGattCharacteristic characteristic) {
		final Intent intent = new Intent(action);
		// 这是心率测量配置文件。
		if (Uuids.NOTIFY_UU.equalsIgnoreCase(characteristic.getUuid().toString())) {
			final byte[] data = characteristic.getValue();
			Bundle bundle = new Bundle();
			bundle.putByteArray("data", data);
			intent.putExtras(bundle);
			sendBroadcast(intent);
		}else{

		}
	}

	public class LocalBinder extends Binder {
		public BluetoothLeService getService() {
			return BluetoothLeService.this;
		}
	}

	@Override
	public IBinder onBind(Intent intent) {
		return mBinder;
	}

	@Override
	public boolean onUnbind(Intent intent) {
		close();
		return super.onUnbind(intent);
	}

	private final IBinder mBinder = new LocalBinder();

	/**
	 * Initializes a reference to the local Bluetooth adapter.
	 * 
	 * @return Return true if the initialization is successful.
	 */
	public boolean initialize() {
		// For API level 18 and above, get a reference to BluetoothAdapter
		// through
		// BluetoothManager.
		if (mBluetoothManager == null) {
			mBluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
			if (mBluetoothManager == null) {
				Log.e(TAG, "Unable to initialize BluetoothManager.");
				return false;
			}
		}

		mBluetoothAdapter = mBluetoothManager.getAdapter();
		if (mBluetoothAdapter == null) {
			Log.e(TAG, "Unable to obtain a BluetoothAdapter.");
			return false;
		}

		return true;
	}

	/*
	 * 连接 true成功 flase失败
	 */
	public boolean connect(final String address) {
		if (mBluetoothAdapter == null || address == null) {
			Log.w(TAG,
					"BluetoothAdapter not initialized or unspecified address.");
			return false;
		}

		final BluetoothDevice device = mBluetoothAdapter
				.getRemoteDevice(address);
		if (device == null) {
			Log.w(TAG, "Device not found.  Unable to connect.");
			return false;
		}
		mBluetoothGatt = device.connectGatt(this, true, mGattCallback);

		if (mBluetoothGatt.connect()) { // 连接远程设备。
			mConnectionState = STATE_CONNECTING;// 
			Log.d(TAG, "Trying to create a new connection.");
			mBluetoothDeviceAddress = address;
			mConnectionState = STATE_CONNECTING;
			return true;
		} else {
			return false;
		}
	}
	
	public int getConnectionState(){
		return mConnectionState;
	}

	public void disconnect() {
		if (mBluetoothAdapter == null || mBluetoothGatt == null) {
			return;
		}
		mBluetoothGatt.disconnect();
	}

	public void close() {
		if (mBluetoothGatt == null) {
			return;
		}
		mBluetoothGatt.close();
		mBluetoothGatt = null;
	}

	public void readCharacteristic(BluetoothGattCharacteristic characteristic) {
		if (mBluetoothAdapter == null || mBluetoothGatt == null) {
			return;
		}
		mBluetoothGatt.readCharacteristic(characteristic);
	}

	public void setCharacteristicNotification(
			BluetoothGattCharacteristic characteristic, boolean enabled) {
		if (mBluetoothAdapter == null || mBluetoothGatt == null) {
			return;
		}
		mBluetoothGatt.setCharacteristicNotification(characteristic, enabled);

		// This is specific to Heart Rate Measurement.
		if (Uuids.NOTIFY_UU.equalsIgnoreCase(characteristic.getUuid().toString())) {
			BluetoothGattDescriptor descriptor = characteristic
					.getDescriptor(UUID.fromString(Uuids.CLIENT_CHARACTERISTIC_CONFIG));
			descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);

			mBluetoothGatt.writeDescriptor(descriptor);
		}
	}

	public List<BluetoothGattService> getSupportedGattServices() {
		if (mBluetoothGatt == null)
			return null;

		return mBluetoothGatt.getServices();
	}
	
	public BluetoothGatt getBluetoothGatt() {
		return mBluetoothGatt;
	}

	public void setBluetoothGatt(BluetoothGatt mBluetoothGatt) {
		this.mBluetoothGatt = mBluetoothGatt;
	}
}
