package com.google.sps.data;

public final class FormattedUser {
	private final String username;
	private final String name;
	private final String email;
	private final boolean isActive;
	private final boolean isContact;

	public FormattedUser(String username, String name, String email, boolean isActive, boolean isContact) {
		this.username = username;
		this.name = name;
		this.email = email;
		this.isActive = isActive;
		this.isContact = isContact;
	}
}
