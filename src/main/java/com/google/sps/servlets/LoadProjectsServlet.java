package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.FullEntity;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.gson.Gson;
import com.google.sps.data.FormattedProject;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

@WebServlet("/load")
public class LoadProjectsServlet extends HttpServlet {

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// Allow CORS so frontend can access it
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		response.addHeader("Access-Control-Allow-Credentials", "true");
		response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");

		// Get the username from user
		String username = Jsoup.clean(request.getParameter("username"), Whitelist.none());

		Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
		FormattedProject[] userProjects = loadProjects(username, datastore);

		Gson gson = new Gson();

		// Return project objects to frontend
		response.setContentType("application/json");
		response.getWriter().println(gson.toJson(userProjects));
	}

	// Get projects associated with user from Datastore
	private FormattedProject[] loadProjects(String username, Datastore datastore) throws DatastoreException {
		// Initialize Array list of formatted projects
		ArrayList<FormattedProject> formattedProjects = new ArrayList<>();
		formattedProjects.addAll(queryProjects(username, "user1", datastore));
		formattedProjects.addAll(queryProjects(username, "user2", datastore));

		// Return all projects where user is either user1 or user2
		return formattedProjects.toArray(new FormattedProject[formattedProjects.size()]);
	}

	// Get project by username equality
	private ArrayList<FormattedProject> queryProjects(String username, String field, Datastore datastore)
			throws DatastoreException {
		// Query for projects where username == field
		ArrayList<FormattedProject> projectResults = new ArrayList<>();
		Query<Entity> projectQuery = Query.newEntityQueryBuilder().setKind("Project")
				.setFilter(PropertyFilter.eq(field, username)).build();
		QueryResults<Entity> projects = datastore.run(projectQuery);

		while (projects.hasNext()) {
			// Get project user has started
			Entity project = projects.next();

			// Extract information about project
			String user1 = project.getString("user1");
			String user2 = project.getString("user2");
			String projectid = project.getString("projectid");
			String title = project.getString("title");
			String html = project.getString("html");
			String css = project.getString("css");
			String js = project.getString("js");

			// Determine whether collaborator is stored as user1 or user2
			String collaborator = user1.equals(username) ? user2 : user1;

			// Get collaborators name on for frotend
			Key key = datastore.newKeyFactory().setKind("User").newKey(collaborator);
			Entity partner = datastore.get(key);
			String cname = partner.getString("name");
			String collaboratorAvatar = partner.getString("avatar");
			boolean bothActive = userIsActive(collaborator, datastore);

			projectResults.add(
					new FormattedProject(collaborator, cname, projectid, title, bothActive, html, css, js, collaboratorAvatar));
		}
		return projectResults;
	}

	// Check if user is active
	private boolean userIsActive(String username, Datastore datastore) throws DatastoreException {
		// Get key using username
		Key key = datastore.newKeyFactory().setKind("User").newKey(username);
		Entity user = datastore.get(key);
		String lastActive = user.getString("lastActive");

		// Convert to LocalDateTime and check if within 1 minute
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
		LocalDateTime loginTime = LocalDateTime.parse(lastActive, formatter);
		LocalDateTime now = LocalDateTime.now().minusSeconds(10);
		return loginTime.isAfter(now);
	}
}
