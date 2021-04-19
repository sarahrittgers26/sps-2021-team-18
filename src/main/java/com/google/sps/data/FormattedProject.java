package com.google.sps.data;

public class FormattedProject {
	private final String collaborator;
	private final String collaboratorName;
	private final String projectid;
	private final String title;
	private final boolean bothActive;
	private final String html;
	private final String css;
	private final String js;
	private final String collaboratorAvatar;
	private final String image;

	public FormattedProject(String collaborator, String collaboratorName, String projectid, String title,
			boolean bothActive, String html, String css, String js, String collaboratorAvatar, String image) {
		this.collaborator = collaborator;
		this.collaboratorName = collaboratorName;
		this.projectid = projectid;
		this.title = title;
		this.bothActive = bothActive;
		this.html = html;
		this.css = css;
		this.js = js;
		this.collaboratorAvatar = collaboratorAvatar;
		this.image = image;
	}
}
