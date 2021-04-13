package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.gson.Gson;
import com.google.sps.data.User;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
		
@WebServlet("/deselect")
public class DeselectProjectServlet extends HttpServlet {

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws IOException {
    		 // Allow CORS so frontend can access it			
		 response.addHeader("Access-Control-Allow-Origin", "*");
		 response.addHeader("Access-Control-Allow-Headers", 
				"Origin, X-Requested-With, Content-Type, Accept, Authorization");
		 response.addHeader("Access-Control-Allow-Credentials", "true");
		 response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");
		 
		 // Get the projectid and html text from user
		 String projectid = Jsoup.clean(request.getParameter("projectid"), Whitelist.none());
		 String username = Jsoup.clean(request.getParameter("username"), Whitelist.none());

		 Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
		 // Get project from datastore
		 Key thisProject = datastore.newKeyFactory()
			.setKind("Project")
			.newKey(projectid);
		 Entity project = datastore.get(thisProject); 
			 
		 // Get user1 and user2 names from datastore
		 String user1 = project.getString("user1");
		 String user2 = project.getString("user2");

		 // If user is stored as user1 in project, set user1Selected to true
		 if (user1.equals(username)) {
			 project = Entity.newBuilder(datastore.get(thisProject))
				 .set("user1Selected", false).build(); 
			 datastore.update(project);
		 } else {
			 project = Entity.newBuilder(datastore.get(thisProject))
				 .set("user2Selected", false).build(); 
			 datastore.update(project);
		 }
	}
}
