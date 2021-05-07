package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.FullEntity;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.UUID;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

@WebServlet("/create")
public class CreateProjectServlet extends HttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// Allow CORS so frontend can access it
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", 
				"Origin, X-Requested-With, Content-Type, Accept, Authorization");
		response.addHeader("Access-Control-Allow-Credentials", "true");
		response.addHeader("Access-Control-Allow-Methods", 
				"GET,POST,PUT,DELETE,OPTIONS,HEAD");

		// Get the username, partner name and title from user
		String username = Jsoup.clean(request.getParameter("username"), 
				Whitelist.none());
		String partner = Jsoup.clean(request.getParameter("partner"), 
				Whitelist.none());
		String title = request.getParameter("title");

		Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
		// Check that partner is a valid username
		boolean partnerExists = checkIfFieldExists("username", partner, datastore, "User");
		String projectid = "none";
		if (partnerExists) {
			// Generate projectid for project
			projectid = generateProjectID(datastore);

			// Load default editor text
			String html = "<h1>Hello World</h1>";
			String css = "h1 {\n  font-size: 24px;\n}";
		        String image = "https://storage.googleapis.com/spring21-sps-18.appspot.com/css.jpg";

			// Add project to datastore
			Key projectKey = datastore.newKeyFactory()
				.setKind("Project")
				.newKey(projectid);
			FullEntity project = Entity.newBuilder(projectKey)
				.set("user1", username)
				.set("user2", partner)
				.set("projectid", projectid)
				.set("title", title)
				.set("html", html)
				.set("css", css)
				.set("image", image)
				.set("js", "").build();
			datastore.put(project);
		}

		Gson gson = new Gson();

		// Return project objects to frontend
		response.setContentType("application/json");
		response.getWriter().println(gson.toJson(projectid));
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

	private String generateProjectID(Datastore datastore) throws DatastoreException {
		// Check if projectid has been used, if so recursively call function
		String uniqueID = UUID.randomUUID().toString();
		if (checkIfFieldExists("projectid", uniqueID, datastore, "Project")) {
			uniqueID = generateProjectID(datastore);
		}
		return uniqueID;
	}
}
