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
		
@WebServlet("/not-active")
public class NotActiveServlet extends HttpServlet {

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
		 
		 // Log last login time as current time
		 LocalDateTime now = LocalDateTime.now().minusMinutes(2);
		 DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
		 String login = now.format(formatter);

		 Key thisUser = datastore.newKeyFactory()
			.setKind("User")
			.newKey(username);
		 Entity loggedInUser = Entity.newBuilder(datastore.get(thisUser))
			 .set("lastLogin", login).build(); 
		 datastore.update(loggedInUser);
	}
}