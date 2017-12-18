package com.ukang.app.entity;

public class User {

	public static enum UserType {
		APP_USER(1),
		BACK_USER(2);
		
		private int value;
		UserType(int value) {
			this.value = value;
		}
		
		public int getValue() {
			return this.value;
		}
	}
	
	int id;
	String userName;
	String password;
	int userType;
	
	public User() {
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public int getUserType() {
		return userType;
	}
	public void setUserType(int userType) {
		this.userType = userType;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
}
