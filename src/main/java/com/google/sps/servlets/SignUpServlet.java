package com.google.sps.servlets;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.FullEntity;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;
import com.google.sps.data.User;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
		
@WebServlet("/sign-up")
public class SignUpServlet extends HttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws IOException {		    
		// Get the username, password and email from user
		 String username = Jsoup.clean(request.getParameter("username"), Whitelist.none());
		 String password = Jsoup.clean(request.getParameter("password"), Whitelist.none());
		 String email = Jsoup.clean(request.getParameter("email"), Whitelist.none());

		 Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

		 // Check if username already exists within Datastore
		 Query<Entity> usernameQuery = Query.newEntityQueryBuilder()
			 .setKind("User")
			 .setFilter(PropertyFilter.eq("username", username))
			 .build();
		 QueryResults<Entity> usernames = datastore.run(usernameQuery);
		 boolean usernameExists = false;

		 while(usernames.hasNext() && !usernameExists){
			 usernameExists = true;
		 }

		 // Check if email already exists within Datastore
		 Query<Entity> emailQuery = Query.newEntityQueryBuilder()
			 .setKind("User")
			 .setFilter(PropertyFilter.eq("email", email))
			 .build();
		 QueryResults<Entity> emails = datastore.run(emailQuery);
		 boolean emailExists = false;

		 while(emails.hasNext() && !emailExists){
			 emailExists = true;
		 }
		
		 Boolean[] errors = new Boolean[] {usernameExists, emailExists};
		 if (!usernameExists && !emailExists) {
			 // Add new user to datastore with information
			 KeyFactory keyFactory = datastore.newKeyFactory().setKind("User");
			 
			 // Log last login time as current time
			 LocalDateTime now = LocalDateTime.now();
			 DateTimeFormatter formatter =  DateTimeFormatter.ISO_DATE_TIME;
			 String newLogin = now.format(formatter);
			 Key userKey = datastore.newKeyFactory()
			 	.setKind("User")
				.newKey(username);
			 FullEntity user = 
				 Entity.newBuilder(userKey)
					.set("username", username)
					.set("password", password)
					.set("email", email)
					.set("lastLogin", newLogin)
					.build();
			 datastore.put(user);
		 }
		// Print that user was added successfully
		response.getWriter().println("You submitted " + username 
						+ " successfully!");
		Gson gson = new Gson();	
		// Let frontend know whether there were errors adding user to datastore
		response.setContentType("application/json");
		response.getWriter().println(gson.toJson(errors));
	}
}
