package com.ukang.app.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ukang.app.dao.UserDao;
import com.ukang.app.entity.User;
import com.ukang.app.service.UserService;
import com.ukang.utils.MiscUtil;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	UserDao userDao;

	@Override
	public User findUserByName(String name) {
		return userDao.selectByName(name);
	}

	/**
	 * 用户验证。
	 * @see UserService
	 * returns   UserService.USER_NOT_EXISTS=>用户不存在
	 */
	@Override
	public int checkUserAuthorization(String userName, String password) {
		int ret = UserService.USER_AUTHORIZED;
		User user = findUserByName(userName);
		if (user == null) return UserService.USER_NOT_EXISTS;
		String enc = MiscUtil.encUserPswd(userName, password);
		if (!enc.equals(user.getPassword())) ret = UserService.PASSWORD_NOT_CORRECT;
		return ret;
	}

}
