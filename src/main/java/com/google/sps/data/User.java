package com.google.sps.data;
import java.time.LocalDateTime;

public final class User {
	private final String username;
	private final String password;
	private final String email;
	private final LocalDateTime lastActive;
	private final boolean appearingOnline;
	private final String name;

	public User(String username, String password, String email, 
			LocalDateTime lastActive, String name,
			boolean appearingOnline) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.lastActive = lastActive;
		this.name = name;
		this.appearingOnline = appearingOnline;
	}
}
