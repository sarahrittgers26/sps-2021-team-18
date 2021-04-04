package com.google.sps.data;

public final class FormattedProject {
	private final String user1;
	private final String user2;
	private final String projectid;
	private final boolean bothActive;
	private final String title;

	public FormattedProject(String user1, String user2, String projectid, 
			boolean bothActive, String title) {
		this.user1 = user1;
		this.user2 = user2;
		this.projectid = projectid;
		this.botherActive = bothActive;
		this.title = title;
	}
}
