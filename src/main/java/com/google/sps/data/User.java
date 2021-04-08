package com.google.sps.data;
import java.time.LocalDateTime;

public final class User {
	private final String username;
	private final String password;
	private final String email;
	private final LocalDateTime lastLogin;
	private final boolean appearingOnline;
	private final String name;

	public User(String username, String password, String email, 
			LocalDateTime lastLogin, String name,
			boolean appearingOnline) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.lastLogin = lastLogin;
		this.name = name;
		this.appearingOnline = appearingOnline;
	}
}
