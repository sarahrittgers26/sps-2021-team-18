package com.google.sps.servlets;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Arrays;
import com.google.cloud.datastore.Datastore;
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
import com.google.sps.data.FormattedUser;
import com.google.sps.data.Project;
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
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws IOException {
    		 // Allow CORS so frontend can access it			
		 response.addHeader("Access-Control-Allow-Origin", "*");
		 response.addHeader("Access-Control-Allow-Headers", 
				"Origin, X-Requested-With, Content-Type, Accept, Authorization");
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
	private FormattedUser[] loadUsers(String username, Datastore datastore) 
			throws DatastoreException {
		 // Initialize Array list for usernames of project partners	
		 List<String> allUsers = new ArrayList<>();
		 allUsers.addAll(queryUsersFromProjects(username, "user1", datastore));
		 allUsers.addAll(queryUsersFromProjects(username, "user2", datastore));
		
		 // Remove duplicate users from list
		 Set<String> distinctUsers = new HashSet<String>(allUsers);
		 List<FormattedUser> users = new ArrayList<FormattedUser>();

		 for (String partner: distinctUsers) {
			// Pull user from database
			Key key = datastore.newKeyFactory()
				.setKind("User")
				.newKey(partner);
			Entity user = datastore.get(key);
			
			// Get display name, email and lastLogin
			String name = user.getString("name");
			String email = user.getString("email");
			String lastLogin = user.getString("lastLogin");

			// Determine if user is active
			boolean isActive = userIsActive(lastLogin);
			users.add(new FormattedUser(partner, name, email, isActive));
		 }

		 return users
			 .toArray(new FormattedUser[users.size()]);
	}

	// Get project by username equality and return partner names
	private ArrayList<String> queryUsersFromProjects(String username, String field, 
			Datastore datastore) throws DatastoreException {
		 // Query for projects where username == field
		 ArrayList<String> collaborators = new ArrayList<>();
		 Query<Entity> projectQuery = Query.newEntityQueryBuilder()
			 .setKind("Project")
			 .setFilter(PropertyFilter.eq(field, username))
			 .build();
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

	// Check if user is active
	private boolean userIsActive(String lastLogin) {
		// Convert to LocalDateTime and check if within 1 minute
		DateTimeFormatter formatter = 
			DateTimeFormatter.ISO_DATE_TIME;
		LocalDateTime loginTime = LocalDateTime
			.parse(lastLogin, formatter);
		LocalDateTime now = LocalDateTime.now().minusMinutes(1);
		return loginTime.isAfter(now);
	}
}
