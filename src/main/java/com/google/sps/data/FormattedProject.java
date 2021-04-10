package com.google.sps.data;

public final class FormattedProject {
	private final String collaborator;
	private final String cname;
	private final String projectid;
	private final String title;
	private final boolean bothActive;
	private final String html;
	private final String css;
	private final String js;

	public FormattedProject(String collaborator, String cname, String projectid, String title, 
			boolean bothActive, String html, String css, String js) {
		this.collaborator = collaborator;
		this.cname = cname;
		this.projectid = projectid;
		this.title = title;
		this.bothActive = bothActive;
		this.html = html;
		this.css = css;
		this.js = js;
	}
}
