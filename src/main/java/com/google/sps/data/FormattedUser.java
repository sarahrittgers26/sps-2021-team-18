package com.google.sps.data;

public class FormattedUser {
	private final String username;
	private final String name;
	private final boolean isActive;
	private final boolean isContact;
	private final String avatar;

	public FormattedUser(String username, String name, boolean isActive, 
			boolean isContact, String avatar) {
		this.username = username;
		this.name = name;
		this.isActive = isActive;
		this.isContact = isContact;
		this.avatar = avatar;
	}
}
