package com.ukang.app.entity;

/**
 * 文章类别<br>
 * 文章的类别支持树状结构，以pid为上级分类，pid为空，则为一级分类
 * 
 * @author Lanny Lee
 *
 */
public class ArticleType {

	int id;
	String name;
	Integer pid;
	String description;
	String shortName;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}

	/**
	 * 分类名称
	 * @return
	 */
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * 上级分类，若为NULL则此为一级分类。
	 * @return
	 */
	public Integer getPid() {
		return pid;
	}
	public void setPid(Integer pid) {
		this.pid = pid;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
	
}
