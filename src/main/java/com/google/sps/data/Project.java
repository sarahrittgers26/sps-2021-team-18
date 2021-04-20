package com.google.sps.data;

public class Project {
	private final String user1;
	private final String user2;
	private final String projectid;
	private final String title;
	private final String html;
	private final String css;
	private final String js;

	public Project(String user1, String user2, String projectid, String title, String html, String css, String js) {
		this.user1 = user1;
		this.user2 = user2;
		this.projectid = projectid;
		this.title = title;
		this.html = html;
		this.css = css;
		this.js = js;
	}
}
