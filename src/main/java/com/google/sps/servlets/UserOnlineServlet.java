package com.google.sps.servlets;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.gson.Gson;
import com.google.sps.data.User;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import com.google.cloud.datastore.DatastoreException;
		
@WebServlet("/still-active")
public class UserOnlineServlet extends HttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
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
		 Gson gson = new Gson();	

		 // Return whether use is online to frontend
		 response.setContentType("application/json");
		 response.getWriter().println(gson.toJson(userIsActive(username, datastore));
	}

	// Check if user is active
	private boolean userIsActive(String username, Datastore datastore)
		throws DatastoreException {
		// Get key using username
		Key key = datastore.newKeyFactory()
			.setKind("User")
			.newKey(username);
		Entity user = datastore.get(key);
		String lastLogin = user.getString("lastLogin");

		// Convert to LocalDateTime and check if within 1 minute
		DateTimeFormatter formatter = 
			DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		LocalDateTime loginTime = LocalDateTime
			.parse(lastLogin, formatter);
		LocalDateTime now = LocalDateTime.now().minusMinutes(1);
		return loginTime.isAfter(now);
	}
}
