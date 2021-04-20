package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import java.io.InputStream;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.Part;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;

@WebServlet("/save-image")
@MultipartConfig
public class SaveImageServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    // Allow CORS so frontend can access it
    response.addHeader("Access-Control-Allow-Origin", "*");
    response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    response.addHeader("Access-Control-Allow-Credentials", "true");
    response.addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");
    response.addHeader("Content-Type", "multipart/form-data");

    String projectid = Jsoup.clean(request.getParameter("projectid"), Whitelist.none());
    Part filePart = request.getPart("image");
    InputStream fileInputStream = filePart.getInputStream();
    String link = uploadToCloudStorage(projectid + ".png", fileInputStream);

    // upload link to datastore
    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
    Key thisProject = datastore.newKeyFactory().setKind("Project").newKey(projectid);
    Entity project = Entity.newBuilder(datastore.get(thisProject)).set("image", link).build();
    datastore.update(project);
  }

  /** Uploads a file to Cloud Storage and returns the uploaded file's URL. */
  private static String uploadToCloudStorage(String fileName, InputStream fileInputStream) {
    String projectId = "spring21-sps-18";
    String bucketName = "spring21-sps-18.appspot.com";
    Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
    BlobId blobId = BlobId.of(bucketName, fileName);
    BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
    Blob blob = storage.create(blobInfo, fileInputStream);
    return blob.getMediaLink();
  }
}
