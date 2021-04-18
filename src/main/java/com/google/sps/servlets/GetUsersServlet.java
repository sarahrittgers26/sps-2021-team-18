package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.FullEntity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.gson.Gson;
import com.google.sps.data.FormattedUser;
import com.google.sps.data.Project;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import com.google.cloud.datastore.DatastoreException;

@WebServlet("/get-users")
public class GetUsersServlet extends HttpServlet {

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
		FormattedUser[] users = loadUsers(username, datastore);

		Gson gson = new Gson();

		// Return project objects to frontend
		response.setContentType("application/json");
		response.getWriter().println(gson.toJson(users));
	}

	// Get users associated with user from Datastore
	private FormattedUser[] loadUsers(String username, Datastore datastore) throws DatastoreException {

		// Get all distinct usernames of project partners
		HashSet<String> collaborators = new HashSet<>();

		collaborators.addAll(queryContactFromProjects(username, "user1", datastore));
		collaborators.addAll(queryContactFromProjects(username, "user2", datastore));

		HashSet<String> nonCollaborators = queryAllUsers(datastore, collaborators);

		// Remove duplicate users from list
		List<FormattedUser> users = new ArrayList<FormattedUser>();

		for (String partner : collaborators) {
			// Pull user from database
			Key key = datastore.newKeyFactory().setKind("User").newKey(partner);
			Entity user = datastore.get(key);

			// Get display name, email and lastActive
			String name = user.getString("name");
			String lastActive = user.getString("lastActive");
			int avatar = (int) user.getLong("avatar");

			// Determine if user is active
			boolean isActive = userIsActive(lastActive);
			users.add(new FormattedUser(partner, name, isActive, true, avatar));
		}

		for (String appUser : nonCollaborators) {
			if (appUser.equals(username)) {
				continue;
			}

			// Pull user from datastore
			Key key = datastore.newKeyFactory().setKind("User").newKey(appUser);
			Entity user = datastore.get(key);

			// Get display name, email and lastActive
			String name = user.getString("name");
			int avatar = (int) user.getLong("avatar");
			users.add(new FormattedUser(appUser, name, true, false, avatar));
		}

		return users.toArray(new FormattedUser[users.size()]);
	}

	// Get project by username equality and return partner names
	private HashSet<String> queryContactFromProjects(String username, String field, Datastore datastore)
			throws DatastoreException {
		// Query for projects where username == field
		HashSet<String> collaborators = new HashSet<>();
		Query<Entity> projectQuery = Query.newEntityQueryBuilder().setKind("Project")
				.setFilter(PropertyFilter.eq(field, username)).build();
		QueryResults<Entity> projects = datastore.run(projectQuery);

		while (projects.hasNext()) {
			// Get project user has started
			Entity project = projects.next();

			// Extract information about users on project
			String user1 = project.getString("user1");
			String user2 = project.getString("user2");

			// Determine whether partner is stored as user1 or user2
			String partner = user1.equals(username) ? user2 : user1;
			collaborators.add(partner);
		}
		return collaborators;
	}

	// Load all users from database
	private HashSet<String> queryAllUsers(Datastore datastore, HashSet<String> collaborators) throws DatastoreException {
		// Set of users user has not worked with
		HashSet<String> nonCollaborators = new HashSet<>();

		// Query for all users in databas
		Query<Entity> userQuery = Query.newEntityQueryBuilder().setKind("User").build();
		QueryResults<Entity> users = datastore.run(userQuery);
		while (users.hasNext()) {
			Entity user = users.next();
			String appUser = user.getString("username");
			if (!collaborators.contains(appUser) && userIsActive(appUser, datastore)) {
				nonCollaborators.add(appUser);
			}
		}
		return nonCollaborators;
	}

	// Check if user is active
	private boolean userIsActive(String lastActive) {
		// Convert to LocalDateTime and check if within 1 minute
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

		// Login time is stored as lastActive but is also used as active status
		// lastActive is updated every minute the user is on the application with
		// useEffect()
		// only when a user logs out does this stop so an active user is one
		// still using the application
		LocalDateTime loginTime = LocalDateTime.parse(lastActive, formatter);
		LocalDateTime now = LocalDateTime.now().minusSeconds(30);
		return loginTime.isAfter(now);
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
		LocalDateTime now = LocalDateTime.now().minusSeconds(30);
		return loginTime.isAfter(now);
	}
}
