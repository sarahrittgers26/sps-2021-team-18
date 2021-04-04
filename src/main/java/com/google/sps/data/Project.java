package com.google.sps.data;

public final class Project {
	private final String user1;
	private final String user2;
	private final String projectid;
	private final String title;
	private final boolean user1Active;
	private final boolean user2Active;

	public Project(String user1, String user2, String projectid, String title,
			boolean user1Active, boolean user2Active) {
		this.user1 = user1;
		this.user2 = user2;
		this.projectid = projectid;
		this.title = title;
		this.user1Active = user1Active;
		this.user2Active = user2Active;
	}
}
