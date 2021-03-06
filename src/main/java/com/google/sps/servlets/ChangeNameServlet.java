package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

@WebServlet("/change-name")
public class ChangeNameServlet extends HttpServlet {

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// Allow CORS so frontend can access it
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		response.addHeader("Access-Control-Allow-Credentials", "true");
		response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");

		// Get the username from user
		String username = Jsoup.clean(request.getParameter("username"), Whitelist.none());
		String name = Jsoup.clean(request.getParameter("name"), Whitelist.none());

		Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

		Key thisUser = datastore.newKeyFactory().setKind("User").newKey(username);
		Entity loggedInUser = Entity.newBuilder(datastore.get(thisUser)).set("name", name).build();
		datastore.update(loggedInUser);
	}
}
