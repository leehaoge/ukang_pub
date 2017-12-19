package com.ukang.app.dao;

import org.apache.ibatis.annotations.Param;

import com.ukang.app.entity.User;

public interface UserDao {

	User selectByName(@Param("name") String name); 
	User selectById(@Param("id") long userId);
	
}
