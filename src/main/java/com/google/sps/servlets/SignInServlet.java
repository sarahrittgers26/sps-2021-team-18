package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

@WebServlet("/sign-in")
public class SignInServlet extends HttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// Allow CORS so frontend can access it
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		response.addHeader("Access-Control-Allow-Credentials", "true");
		response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");

		// Get the username and password from user
		String username = Jsoup.clean(request.getParameter("username"), Whitelist.none());
		String password = Jsoup.clean(request.getParameter("password"), Whitelist.none());

		Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

		// Get user email from server
		String userEmail = getStringField(username, password, datastore, "email");
		String name = getStringField(username, password, datastore, "name");
		String isVisible = getBooleanField(username, password, datastore, "isVisible") ? "true" : "false";
		String avatar = getStringField(username, password, datastore, "avatar");

		// If user exists than userEmail should be an address otherwise empty
		String userExists = !userEmail.isEmpty() ? "true" : "false";

		Gson gson = new Gson();

		// Store error and user email in array to send in response
		String[] errorAndInfo = new String[] { userExists, userEmail, name, isVisible, avatar };

		// Let frontend know whether there were errors adding user to datastore
		response.setContentType("application/json");
		response.getWriter().println(gson.toJson(errorAndInfo));
	}

	// Check if user exists and retrieve their info
	private String getStringField(String username, String password, Datastore datastore, String field)
			throws DatastoreException {
		// Field will remain empty string if user does not exist
		String fieldValue = "";

		// Check if username/password combination is correct
		Query<Entity> usernameQuery = Query.newEntityQueryBuilder().setKind("User")
				.setFilter(
						CompositeFilter.and(PropertyFilter.eq("username", username), PropertyFilter.eq("password", password)))
				.build();

		// Run query and retrieve user from datastore
		QueryResults<Entity> users = datastore.run(usernameQuery);

		if (users.hasNext()) {
			Entity user = users.next();

			// Get user's string field
			fieldValue = user.getString(field);

			// Log last login time as current time
			LocalDateTime now = LocalDateTime.now();
			DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
			String login = now.format(formatter);

			Key thisUser = datastore.newKeyFactory().setKind("User").newKey(username);
			Entity loggedInUser = Entity.newBuilder(datastore.get(thisUser)).set("lastActive", login).build();
			datastore.update(loggedInUser);
		}

		return fieldValue;
	}

	// Check if user exists and retrieve their info
	private boolean getBooleanField(String username, String password, Datastore datastore, String field)
			throws DatastoreException {
		// Field will remain empty string if user does not exist
		boolean fieldValue = false;

		// Check if username/password combination is correct
		Query<Entity> usernameQuery = Query.newEntityQueryBuilder().setKind("User")
				.setFilter(
						CompositeFilter.and(PropertyFilter.eq("username", username), PropertyFilter.eq("password", password)))
				.build();

		// Run query and retrieve user from datastore
		QueryResults<Entity> users = datastore.run(usernameQuery);

		if (users.hasNext()) {
			Entity user = users.next();

			// Get user's isVisible status
			fieldValue = user.getBoolean(field);

			// Log last login time as current time
			LocalDateTime now = LocalDateTime.now();
			DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
			String login = now.format(formatter);

			Key thisUser = datastore.newKeyFactory().setKind("User").newKey(username);
			Entity loggedInUser = Entity.newBuilder(datastore.get(thisUser)).set("lastActive", login).build();
			datastore.update(loggedInUser);
		}

		return fieldValue;
	}
}
