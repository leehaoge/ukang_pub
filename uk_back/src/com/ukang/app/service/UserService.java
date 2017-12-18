package com.ukang.app.service;

import com.ukang.app.entity.User;

public interface UserService {
	
	/** 用户验证结果：*/
	public static final int USER_AUTHORIZED = 0;        //=> 用户验证成功 
	public static final int USER_NOT_EXISTS = 1;    	//=> 用户不存在
	public static final int PASSWORD_NOT_CORRECT = 2;   //=> 密码不正确
	
	User findUserByName(String name);
	int checkUserAuthorization(String userName, String password);
	
}
