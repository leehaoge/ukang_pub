package com.ukang.utils;

import static org.hamcrest.CoreMatchers.not;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class MiscUtil {

	public static String encUserPswd(String ident, String password) {
		try {
			byte[] idents = ident.getBytes();
			int v = 0;
			for (int i = 0; i < idents.length; i++) {
				v += (int) idents[i] & 0xFF;
			}
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			os.write(v);
			os.write(password.getBytes());
			byte[] src = os.toByteArray();
			return MD5Util.md5(src);
		} catch (IOException e) {
			e.printStackTrace();
			return password;
		}
	}
	
	public static boolean isEmpty(String s) {
		return s == null || s.trim().length() == 0;
	}
	
	public static boolean anyEmpty(String[] notEmptyStrings) {
		boolean ret = false;
		for (String s: notEmptyStrings) {
			if (isEmpty(s)) {
				ret = true;
				break;
			}
		}
		return ret;
	}
	
	
	public static void main(String[] args) {
		System.out.println(encUserPswd("user1", "123456"));
	}
}
