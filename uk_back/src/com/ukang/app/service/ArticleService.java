package com.ukang.app.service;

import java.util.List;
import java.util.Map;

import com.ukang.app.entity.Article;
import com.ukang.app.entity.ArticleType;

public interface ArticleService {

	Article selectById(long id);
	List<Article> selectAll();
	int insert(Article article);	
	
	ArticleType getTypeById(long typeId);
	Map<String, Object> getHighLights();
}
