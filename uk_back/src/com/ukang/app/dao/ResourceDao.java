package com.ukang.app.dao;

import org.apache.ibatis.annotations.Param;

import com.ukang.app.entity.Resource;

public interface ResourceDao {

	int insert(Resource resource);
	Resource selectByPath(@Param("path") String path);
	
}
