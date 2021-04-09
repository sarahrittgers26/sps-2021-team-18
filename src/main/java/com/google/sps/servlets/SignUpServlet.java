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
import com.google.gson.Gson;
import com.google.sps.data.User;
import java.io.IOException;
import javax.servlet.ServletException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
			throws ServletException, IOException {
    		 // Allow CORS so frontend can access it			
		 response.addHeader("Access-Control-Allow-Origin", "*");
		 response.addHeader("Access-Control-Allow-Headers", 
				"Origin, X-Requested-With, Content-Type, Accept, Authorization");
		 response.addHeader("Access-Control-Allow-Credentials", "true");
		 response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");

		 // Get the username, password and email from user
		 String username = Jsoup.clean(request.getParameter("username"), Whitelist.none());
		 String password = Jsoup.clean(request.getParameter("password"), Whitelist.none());
		 String email = Jsoup.clean(request.getParameter("email"), Whitelist.none());
		 String name = Jsoup.clean(request.getParameter("name"), Whitelist.none());

		 Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

		 // Check if username or email have already been used
		 boolean usernameExists = checkIfFieldExists("username", username, datastore);
		 boolean emailExists = checkIfFieldExists("email", email, datastore);
		
		 // Store whether username or email has already been used in array
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
					.set("lastActive", newLogin)
					.set("name", name)
					.set("isVisible", true)
					.build();
			 datastore.put(user);
		 }
		// Print that user was added successfully
		Gson gson = new Gson();	

		// Let frontend know whether there were errors adding user to datastore
		response.setContentType("application/json");
		response.getWriter().println(gson.toJson(errors));
	}

	// Check if user with specified field exists
	private boolean checkIfFieldExists(String field, String value, Datastore datastore) 
			throws DatastoreException {
		 // Check if value already exists within Datastore
		 Query<Entity> fieldQuery = Query.newEntityQueryBuilder()
			 .setKind("User")
			 .setFilter(PropertyFilter.eq(field, value))
			 .build();
		 QueryResults<Entity> entities = datastore.run(fieldQuery);
		 return entities.hasNext();
	}
}
