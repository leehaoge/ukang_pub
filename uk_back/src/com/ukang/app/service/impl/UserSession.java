package com.ukang.app.service.impl;

import java.util.HashMap;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ukang.app.entity.User;
import com.ukang.utils.MD5Util;

public class UserSession {
	
	public static final String KEY_SSN_USER = "SSN_USER";
	

	/**
	 * not to be constructed publicly
	 */
	protected UserSession() {
		touch();
	}

	@SuppressWarnings("unused")
	private long latestTouch = -1;
	private HashMap<String, Object> attributes = new HashMap<>();
	
	private void touch() {
		latestTouch = System.currentTimeMillis();
	}
	
	public Object getAttribute(String key) {
		return attributes.get(key);
	}
	
	public void setAttribute(String key, Object value) {
		attributes.put(key, value);
	}
	
	public static HashMap<String, UserSession> sessionPool;

	/**
	 * 检验该令牌是不是有效的会话
	 * @param token
	 * @return
	 */
	public static boolean isValidSession(String token) {
		boolean ret = sessionPool.containsKey(token);
		if (ret) sessionPool.get(token).touch();
		return ret;
	}
	
	public static UserSession get(String token) {
		UserSession session = null;
		if (sessionPool.containsKey(token)) {
			session = sessionPool.get(token);
			session.touch();
		}
		return session;
	}
	
	private static Long rolling = 0L;
	
	private static String genNewToken() {
		long currTick;
		synchronized (rolling) {
			rolling++;
			currTick = System.currentTimeMillis();
		}
		boolean done = false;
		String newToken = "";
		while (!done) {
			String s = Long.toHexString(rolling) + Long.toHexString(currTick);
			newToken = MD5Util.md5(s);
			done = newToken.length() > 0 && !sessionPool.containsKey(newToken);
		}
		return newToken;
	}
	
	/**
	 * 创建新的用户会话
	 * @return 会话的令牌
	 */
	public static String createSession() {
		String token = genNewToken();
		UserSession session = new UserSession();
		sessionPool.put(token, session);
		return token;
	}
	
	private static UserSession devUserSession(HttpServletRequest request, HttpServletResponse response) {
		if (sessionPool.size() == 0) {
			String token = createSession();
			UserSession session = sessionPool.get(token);
			User user = new User();
			user.setId(1);
			user.setUserName("user1");
			session.setAttribute(KEY_SSN_USER, user);
			return session;
		} else {
			Iterator<UserSession> it = sessionPool.values().iterator();
			return it.next();
		}
	}
	
	public static UserSession checkUserSession(HttpServletRequest request, HttpServletResponse response) {
		UserSession session = null;

		//开发用。
		session = devUserSession(request, response);
		return session;
	}
	
	
	/**
	 * 用户会话完毕
	 * @param token
	 */
	public static void sessionEnded(String token) {
		sessionPool.remove(token);
	}
		
	private static boolean threadRunning = false;
	
	private static void startRecycleThread() {
		new Thread(new Runnable() {
			@Override
			public void run() {
				threadRunning = true;
				while (threadRunning) {
					try {
						Thread.sleep(500);
					} catch (InterruptedException e) {
						threadRunning = false;
					}
				}
			}
		}).start();
	}
	
	static {
		sessionPool = new HashMap<>();
		startRecycleThread();
	}
	
}
