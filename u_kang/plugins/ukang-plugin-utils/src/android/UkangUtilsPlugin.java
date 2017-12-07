package com.lec.u_kang;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.text.TextUtils;
import android.webkit.WebSettings.PluginState;

public class UkangUtilsPlugin extends CordovaPlugin {

	private Activity mActivity;

	public UkangUtilsPlugin() {
	}

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

		switch (action) {
		case getDensity:
			getDensity(cbc);
			break;
		}
		return status;
	}

	private void getDensity(CallbackContext cbc) throws JSONException {

	}

	private static enum Action {
		getDensity
	}
	
}
