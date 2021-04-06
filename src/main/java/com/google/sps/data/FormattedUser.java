package com.google.sps.data;

public final class FormattedUser {
	private final String username;
	private final String name;
	private final String email;
	private final boolean isActive;

	public FormattedUser(String username, String name, String email, 
			boolean isActive) {
		this.username = username;
		this.name = name;
		this.email = email;
		this.isActive = isActive;
	}
}
