package com.ukang.app.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.ukang.app.entity.Article;
import com.ukang.app.entity.Resource;
import com.ukang.app.entity.User;
import com.ukang.app.service.ArticleService;
import com.ukang.app.service.ResourceService;
import com.ukang.app.service.impl.UserSession;

@Controller
@RequestMapping("/app")
public class AppController {
	
	@Autowired
	ArticleService articleService;
	@Autowired
	ResourceService resourceService;
	
	
	@RequestMapping(value="/article/add", method={RequestMethod.GET})
	public ModelAndView addArticle() throws IOException {
		ModelAndView mv = new ModelAndView("/addArticle");
		return mv;
	}
	
	@RequestMapping(value="/article/list", method={RequestMethod.GET})
	public ModelAndView articleList() throws IOException {
		ModelAndView mv = new ModelAndView("/articleList");
		List<Article> artList = articleService.selectAll();
		mv.addObject("artList", artList);
		return mv;
	}
	
	@ResponseBody
	@RequestMapping(value="/article/highlights", method={RequestMethod.GET})
	public Object getHighlights(HttpServletRequest request, HttpServletResponse response) throws IOException {
		return articleService.getHighLights();
	}
	
	@ResponseBody
	@RequestMapping(value="/article/{id}", method={RequestMethod.GET})
	public Object getArticle(@PathVariable Long id, 
			HttpServletRequest request, HttpServletResponse response) throws IOException {
		return articleService.selectById(id);
	}
	
	
	@RequestMapping(value="/resource", method={RequestMethod.GET})
	public void getResource(@RequestParam("path") String path, HttpServletResponse response) throws IOException {
		Resource res = resourceService.findByPath(path);
		if (res != null) {
			if (res.getMime() != null) response.setContentType(res.getMime());
			OutputStream out = response.getOutputStream();
			resourceService.putResource(res, out);
			out.flush();
		}
	}
	
	@ResponseBody
	@RequestMapping(value="/test", method={RequestMethod.GET})
	public Object test(HttpServletRequest request, HttpServletResponse response) throws IOException {
		UserSession ssn = UserSession.checkUserSession(request, response);
		if (ssn != null) {
			User user = (User) ssn.getAttribute(UserSession.KEY_SSN_USER);
			return user;
		}
		return new HashMap<String, String>();
	}

}
