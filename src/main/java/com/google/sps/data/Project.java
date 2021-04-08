package com.google.sps.data;

public final class Project {
	private final String user1;
	private final String user2;
	private final String projectid;
	private final String title;
	private final String html;
	private final String css;
	private final String js;
	private final boolean user1Selected;
	private final boolean user2Selected;

	public Project(String user1, String user2, String projectid, String title,
			String html, String css, String js, boolean user1Selected,
			boolean user2Selected) {
		this.user1 = user1;
		this.user2 = user2;
		this.projectid = projectid;
		this.title = title;
		this.html = html;
		this.css = css;
		this.js = js;
		this.user1Selected = user1Selected;
		this.user2Selected = user2Selected;
	}
}
