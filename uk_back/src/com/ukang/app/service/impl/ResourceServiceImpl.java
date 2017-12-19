package com.ukang.app.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ukang.app.UKangAppConfig;
import com.ukang.app.dao.ResourceDao;
import com.ukang.app.entity.Resource;
import com.ukang.app.service.ResourceService;

@Service
public class ResourceServiceImpl implements ResourceService {
	
	@Autowired
	ResourceDao resourceDao;
	@Autowired
	UKangAppConfig appConfig;
	
	
	private static final long ROLLING_START = 1000000L;
	private static final long ROLLING_END   = 9999999L;
	private Long rolling = ROLLING_START;
	
	private String genNewFile() {
		long currTick = System.currentTimeMillis();
		synchronized (rolling) {
			rolling++;
			if (rolling > ROLLING_END) rolling = ROLLING_START;
		}
		return Long.toHexString(currTick) + Long.toHexString(rolling);
	}
	
	@Override
	public String newFileName(String refName) {
		String suffix = "";
		String newName = genNewFile();
		int dotPos = refName.lastIndexOf('.'); 
		if (dotPos > -1) {
			suffix = refName.substring(dotPos);
		}
		return newName + suffix;
	}
	
	@Override
	public String realFilePath(String filePath) {
		String path = appConfig.getUploadPath();
		path = path.replaceAll("\\\\", "/");
		if (!path.endsWith("/") && !filePath.startsWith("/")) path += "/";
		if (filePath.startsWith("/") && path.endsWith("/")) filePath = filePath.substring(1);
		return path + filePath;
	}

	public static void main(String[] args) {
		ResourceService svc = new ResourceServiceImpl();
		System.out.println(svc.newFileName("测试.png"));
	}

	@Override
	public int insert(Resource resource) {
		return resourceDao.insert(resource);
	}

	/**
	 * 按路径获取Resource实体对象
	 */
	@Override
	public Resource findByPath(String path) {
		return resourceDao.selectByPath(path);
	}

	@Override
	/**
	 * 向OutputStream输出资源流 
	 */
	public void putResource(Resource res, OutputStream out) throws IOException {
		File resFile = new File(realFilePath(res.getPathName()));
		if (resFile.exists() && resFile.isFile()) {
			FileInputStream in = new FileInputStream(resFile);
			byte[] buffer = new byte[in.available()]; 
			in.read(buffer);
			out.write(buffer);
			in.close();
		}
	}
}
