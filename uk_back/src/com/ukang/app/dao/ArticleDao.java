package com.ukang.app.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.ukang.app.entity.Article;

public interface ArticleDao {
	Article selectById(@Param("id") long id);
	List<Article> selectAll();
	List<Article> selectByType(@Param("typeId") long typeId);	
	int insert(Article article);
	List<Article> selectLatest(@Param("rowCount") int rowCount);
	List<Article> selectLatestOfType(@Param("typeId") long typeId, @Param("rowCount") int rowCount);
	List<Map<String, ?>> selectValidTypes();
}
