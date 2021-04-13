package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
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
		
@WebServlet("/select")
public class SelectProjectServlet extends HttpServlet {

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
		 
		 // Clear all other projects user has selected just in case
		 querySelectedProjects(username, "user1", datastore);
		 querySelectedProjects(username, "user2", datastore);

		 // Get project from datastore
		 Key thisProject = datastore.newKeyFactory()
			.setKind("Project")
			.newKey(projectid);
		 Entity project = datastore.get(thisProject); 
			 
		 // Get user1 and user2 names from datastore
		 String user1 = project.getString("user1");
		 String user2 = project.getString("user2");

		 // If user1, set user1Selected true otherwise set user2Selected
		 if (user1.equals(username)) {
			 project = Entity.newBuilder(datastore.get(thisProject))
				 .set("user1Selected", true).build(); 
			 datastore.update(project);
		 } else {
			 project = Entity.newBuilder(datastore.get(thisProject))
				 .set("user2Selected", true).build(); 
			 datastore.update(project);
		 }
	}

	// Deselect all other projects failsafe 
	private void querySelectedProjects(String username, String field, 
			Datastore datastore) throws DatastoreException {
		 // Query for projects where username == field
		 String selectedField = field + "Selected";
		 Query<Entity> projectQuery = Query.newEntityQueryBuilder()
			 .setKind("Project")
			 .setFilter(CompositeFilter.and(
				PropertyFilter.eq(field, username),
				PropertyFilter.eq(selectedField, true)))
			 .build();
		 QueryResults<Entity> projects = datastore.run(projectQuery);
		
		 while (projects.hasNext()) {
			// Get project user has started
			Entity project = projects.next();

			// Extract projectid and then update selected field to false
			String projectid = project.getString("projectid");
			Key key = datastore.newKeyFactory()
				.setKind("Project").newKey(projectid);
			Entity updateProject = Entity.newBuilder(datastore.get(key))
				 .set(selectedField, false).build(); 
			datastore.update(updateProject);
		 }
	}
}
