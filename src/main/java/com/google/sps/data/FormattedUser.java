package com.google.sps.data;

public final class FormattedUser {
	private final String username;
	private final String name;
	private final boolean isActive;
	private final boolean isContact;
	private final int avatar;

	public FormattedUser(String username, String name, boolean isActive, boolean isContact, int avatar) {
		this.username = username;
		this.name = name;
		this.isActive = isActive;
		this.isContact = isContact;
		this.avatar = avatar;
	}
}
