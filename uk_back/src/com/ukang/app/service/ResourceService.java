package com.ukang.app.service;

import java.io.IOException;
import java.io.OutputStream;

import com.ukang.app.entity.Resource;

public interface ResourceService {
	String newFileName(String refName);
	String realFilePath(String path);
	int insert(Resource resource);
	Resource findByPath(String path);
	void putResource(Resource res, OutputStream out) throws IOException;
}
