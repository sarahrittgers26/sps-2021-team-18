package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreException;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Key;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

@WebServlet("/del-project")
public class DeleteProjectServlet extends HttpServlet {
  @Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// Allow CORS so frontend can access it
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", 
				"Origin, X-Requested-With, Content-Type, Accept, Authorization");
		response.addHeader("Access-Control-Allow-Credentials", "true");
		response.addHeader("Access-Control-Allow-Methods", 
				"GET,POST,PUT,DELETE,OPTIONS,HEAD");

		// Get the username, partner name and title from user
		String projectid = Jsoup.clean(request.getParameter("projectid"), 
				Whitelist.none());

		Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
		// Check that partner is a valid username
    deleteIfProjectExists(projectid, datastore);
  }

  private void deleteIfProjectExists(String projectid, Datastore datastore)
			throws DatastoreException {
		// Check if value already exists within Datastore
		Key projectKey = datastore.newKeyFactory()
				.setKind("Project")
				.newKey(projectid);
    datastore.delete(projectKey);
    String gcpProjectId = "spring21-sps-18";
    String bucketName = "spring21-sps-18.appspot.com";
    Storage storage = StorageOptions.newBuilder()
	    .setProjectId(gcpProjectId)
	    .build()
	    .getService();
    storage.delete(bucketName, projectid);
	}
}
