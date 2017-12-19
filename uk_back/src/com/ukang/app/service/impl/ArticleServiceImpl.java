package com.ukang.app.service.impl;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ukang.app.dao.ArticleDao;
import com.ukang.app.dao.ArticleTypeDao;
import com.ukang.app.entity.Article;
import com.ukang.app.entity.ArticleType;
import com.ukang.app.service.ArticleService;

@Service
public class ArticleServiceImpl implements ArticleService {

	@Autowired
	ArticleDao articleDao;
	@Autowired
	ArticleTypeDao artypeDao;
	
	@Override
	public Article selectById(long id) {
		return articleDao.selectById(id);
	}

	@Override
	public List<Article> selectAll() {
		return articleDao.selectAll();
	}

	@Override
	public int insert(Article article) {
		int nid = articleDao.insert(article);
		article.setId(nid);
		return nid;
	}

	@Override
	public ArticleType getTypeById(long typeId) {
		return artypeDao.selectById(typeId);
	}

	@Override
	public Map<String, Object> getHighLights() {
		Map<String, Object> ret = new LinkedHashMap<>();
		List<Article> latest = articleDao.selectLatest(2);
		ret.put("latest", latest);
		List<Map<String, ?>> validTypes = articleDao.selectValidTypes();
		if (validTypes.size() > 0) {
			Map<String, Object> hlGroups = new HashMap<>();
			for (Map<String, ?> record: validTypes) {
				long typeId = (Long) record.get("typeId");
				List<Article> artOfType = articleDao.selectLatestOfType(typeId, 3);
				hlGroups.put(Long.toString(typeId), artOfType);
			}
			ret.put("groups", hlGroups);
		}
		return ret;
	}
	
}
