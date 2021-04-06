package com.google.sps.data;

public final class FormattedProject {
	private final String partner;
	private final String projectid;
	private final String title;
	private final boolean bothActive;
	private final String html;
	private final String css;
	private final String js;

	public FormattedProject(String partner, String projectid, String title, 
			boolean bothActive, String html, String css, String js) {
		this.partner = partner;
		this.projectid = projectid;
		this.title = title;
		this.bothActive = bothActive;
		this.html = html;
		this.css = css;
		this.js = js;
	}
}
