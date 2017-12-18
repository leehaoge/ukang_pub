package com.ukang.app.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ukang.app.entity.ArticleType;

public interface ArticleTypeDao {

	List<ArticleType> selectByPId(@Param("pid") long pid);
	ArticleType selectById(@Param("typeId") long typeId);
	
}
