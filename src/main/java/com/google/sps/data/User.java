package com.google.sps.data;

import java.time.LocalDateTime;

public class User {
	private final String username;
	private final String password;
	private final String email;
	private final LocalDateTime lastActive;
	private final boolean isVisible;
	private final String name;
	private final String avatar;

	public User(String username, String password, String email, LocalDateTime lastActive, String name, boolean isVisible,
			String avatar) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.lastActive = lastActive;
		this.name = name;
		this.isVisible = isVisible;
		this.avatar = avatar;
	}
}
