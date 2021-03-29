package com.google.sps.servlets;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.FullEntity;
import com.google.cloud.datastore.Blob;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.datastore.DatastoreException;
import com.google.gson.Gson;
import com.google.sps.data.User;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
		
@WebServlet("/sign-in")
public class SignInServlet extends HttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws IOException {		    
		// Get the username and password from user
		String username = Jsoup.clean(request.getParameter("username"), Whitelist.none());
		String password = Jsoup.clean(request.getParameter("password"), Whitelist.none());

		Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
		 
		// Get user email from server
	        String userEmail = getUserEmail(username, password, datastore);

		// If user exists than userEmail should be an address otherwise empty	 
		String userExists = !userEmail.isEmpty() ? "true" : "false";
		 
		// Print that user was added successfully
		response.getWriter().println(username + " logged in successfully!");
		
		Gson gson = new Gson();

		// Store error and user email in array to send in response
		String[] errorAndEmail = new String[] {userExists, userEmail};

		// Let frontend know whether there were errors adding user to datastore
		response.setContentType("application/json");
		response.getWriter().println(gson.toJson(errorAndEmail));
	}

	// Check if user exists in datastore and retrieve their email
	private String getUserEmail(String username, String password, 
			Datastore datastore) throws DatastoreException {
	         // Email will remain empty string if user does not exist
		 String userEmail = "";	 

		 // Check if username/password combination is correct
		 Query<Entity> usernameQuery = Query.newEntityQueryBuilder()
			 .setKind("User")
			 .setFilter(CompositeFilter.and(
				PropertyFilter.eq("username", username),
				PropertyFilter.eq("password", password)))
			 .build();

		 // Run query and retrieve user from datastore
		 QueryResults<Entity> users = datastore.run(usernameQuery);

		 if (users.hasNext()) {
			 Entity user = users.next();
			 KeyFactory keyFactory = datastore.newKeyFactory().setKind("User");

			 // Get user's email address
			 userEmail = user.getString("email");
			 
			 // Log last login time as current time
			 LocalDateTime now = LocalDateTime.now();
			 DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
			 String login = now.format(formatter);

			 Key thisUser = datastore.newKeyFactory()
				.setKind("User")
				.newKey(username);
			 Entity loggedInUser = Entity.newBuilder(datastore.get(thisUser))
				 .set("lastLogin", login).build(); 
			 datastore.update(loggedInUser);
		 }

		 return userEmail;
	}

}