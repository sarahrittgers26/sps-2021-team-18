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

@WebServlet("/save-js")
public class SaveJsServlet extends HttpServlet {

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// Allow CORS so frontend can access it
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		response.addHeader("Access-Control-Allow-Credentials", "true");
		response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");

		// Get the projectid and html text from user
		String projectid = request.getParameter("projectid");
		String js = request.getParameter("js");

		Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

		// Update stored html to new string
		Key thisProject = datastore.newKeyFactory().setKind("Project").newKey(projectid);
		Entity project = Entity.newBuilder(datastore.get(thisProject)).set("js", js).build();
		datastore.update(project);
	}
}
