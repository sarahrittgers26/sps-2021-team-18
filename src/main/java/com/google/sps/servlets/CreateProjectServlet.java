package com.google.sps.servlets;

import java.io.IOException;
import java.time.LocalDateTime;
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
import com.google.sps.data.Project;
import java.util.UUID;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import com.google.cloud.datastore.DatastoreException;
		
@WebServlet("/create")
public class CreateProjectServlet extends HttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws IOException {
    		 // Allow CORS so frontend can access it			
		 response.addHeader("Access-Control-Allow-Origin", "*");
		 response.addHeader("Access-Control-Allow-Headers", 
				"Origin, X-Requested-With, Content-Type, Accept, Authorization");
		 response.addHeader("Access-Control-Allow-Credentials", "true");
		 response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");
		 
		 // Get the username, partner name from user
		 String username = Jsoup.clean(request.getParameter("username"), Whitelist.none());
		 String partner = Jsoup.clean(request.getParameter("partner"), Whitelist.none());
		 String title = Jsoup.clean(request.getParameter("title"), Whitelist.none());

		 Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
		 
		 // Check that partner is a valid username
		 boolean partnerExists = checkIfFieldExists("username", partner, datastore, "User");

		 if (partnerExists) {
			 // Generate projectid for project
			 String projectid = generateProjectID(datastore);
			
			 // Add project to datastore 
			 Key projectKey = datastore.newKeyFactory()
				.setKind("Project")
				.newKey(projectid);
			 FullEntity project = 
				 Entity.newBuilder(projectKey)
					.set("user1", username)
					.set("user2", partner)
					.set("projectid", projectid)
					.set("title", title)
					.set("html", "")
					.set("css", "")
					.set("js", "")
					.set("user1Selected", true)
					.set("user2Selected", true)
					.build();
			 datastore.put(project);	
		 }

		 Gson gson = new Gson();	

		 // Let frontend know whether there were errors adding project to datastore
		 response.setContentType("application/json");
		 response.getWriter().println(gson.toJson(partnerExists));
	}

	// Check if user with specified field exists
	private boolean checkIfFieldExists(String field, String value, Datastore datastore, String kind) 
			throws DatastoreException {
		 // Check if value already exists within Datastore
		 Query<Entity> fieldQuery = Query.newEntityQueryBuilder()
			 .setKind(kind)
			 .setFilter(PropertyFilter.eq(field, value))
			 .build();
		 QueryResults<Entity> entities = datastore.run(fieldQuery);
		 return entities.hasNext();
	}

	private String generateProjectID(Datastore datastore) 
		throws DatastoreException {
		// Check if projectid has been used, if so recursively call function
		String uniqueID = UUID.randomUUID().toString();
		if (checkIfFieldExists("projectid", uniqueID, datastore, "Project")) {
			uniqueID = generateProjectID(datastore);
		}
		return uniqueID;
	}
}
