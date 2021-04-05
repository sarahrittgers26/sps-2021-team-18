package com.google.sps.data;

public final class FormattedProject {
	private final String partner;
	private final String projectid;
	private final boolean bothActive;
	private final String title;

	public FormattedProject(String partner, String projectid, 
			boolean bothActive, String title) {
		this.partner = partner;
		this.projectid = projectid;
		this.bothActive = bothActive;
		this.title = title;
	}
}
