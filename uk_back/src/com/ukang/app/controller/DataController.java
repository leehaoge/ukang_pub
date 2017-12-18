package com.ukang.app.controller;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ukang.app.entity.Article;
import com.ukang.app.entity.Resource;
import com.ukang.app.entity.User;
import com.ukang.app.service.ArticleService;
import com.ukang.app.service.ResourceService;
import com.ukang.app.service.impl.UserSession;
import com.ukang.utils.MiscUtil;

@Controller
@RequestMapping("/data")
public class DataController {

	@Autowired
	ResourceService resourceService;
	@Autowired
	ArticleService articleService;
	
	private void notValidSSN(HttpServletRequest request, 
			HttpServletResponse response) throws IOException {
		//TODO jump to login?
	}
	
	@RequestMapping(value="/article/add")
	public void articleAdd(
		@RequestParam("mainImage") MultipartFile mainImage,
		@RequestParam("title") String title,
		@RequestParam("keywords") String keywords,
		@RequestParam("author") String author,
		@RequestParam("artype") String artype,
		@RequestParam("content") String content,
		HttpServletRequest request,
		HttpServletResponse response) throws IOException {
		
		UserSession ssn = UserSession.checkUserSession(request, response);
		if (ssn == null) {
			notValidSSN(request, response);
		} else {
			String[] shouldNotEmpty = {title, keywords, author, artype, content}; 
			if (MiscUtil.anyEmpty(shouldNotEmpty)) {
				//TODO: any empty => param error!
			} else {
				User inpUser = (User) ssn.getAttribute(UserSession.KEY_SSN_USER);
				String pathName = null;
				if (mainImage != null) {
					Resource resource = new Resource();
					resource.setFileName(mainImage.getOriginalFilename());
					resource.setMime(mainImage.getContentType());
					pathName = resourceService.newFileName(mainImage.getOriginalFilename());
					resource.setPathName(pathName);
					String mainImagePath = resourceService.realFilePath(pathName);
					File resFile = new File(mainImagePath);
					mainImage.transferTo(resFile);
					resourceService.insert(resource);
				}
				Article article = new Article();
				article.setTitle(title);
				article.setAuthor(author);
				article.setKeywords(keywords);
				article.setContent(content);
				article.setMainImage(pathName);
				
				int typeId = Integer.parseInt(artype);
				article.setType(articleService.getTypeById(typeId));
				article.setPubDate(new Date());
				article.setUpdDate(new Date());
				article.setInpUser(inpUser);

				articleService.insert(article);
				
				response.sendRedirect(request.getContextPath() + "/app/article/list.htmls");
			}
		}
	}

}
