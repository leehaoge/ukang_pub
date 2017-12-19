package com.ukang.app.test;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import com.ukang.app.entity.Article;
import com.ukang.app.service.ArticleService;
import com.ukang.app.service.UserService;

public class MyDummyTest extends BaseSpringJunit4Test {
	
	@Autowired
	UserService userService;
	@Autowired
	ArticleService articleService;
	
	@Test
	@Transactional
	@Rollback(true)
	public void test1() {
		System.out.println("测试Spring整合Junit4进行单元测试");  
		int checkResult = userService.checkUserAuthorization("user2", "123456");
		switch (checkResult) {
		case UserService.USER_AUTHORIZED:
			System.out.println("user1 验证成功！");
			break;
		case UserService.USER_NOT_EXISTS:
			System.out.println("user1 不存在！");
			break;
		case UserService.PASSWORD_NOT_CORRECT:
			System.out.println("user1 密码不正确！");
			break;
		}
		
	}
	
	@Test
	@Transactional
	@Rollback(true)
	public void testArticleList() {
		List<Article> articles = articleService.selectAll(); 
		System.out.println("list count: " + articles.size());
	}

}
