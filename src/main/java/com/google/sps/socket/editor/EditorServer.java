package com.google.sps.socket.editor;

import java.io.IOException;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.sps.socket.message.Message;
import com.google.sps.socket.project.SocketProject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
//import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class EditorServer {

    private Logger logger = LogManager.getLogger(EditorServer.class);

    private HashMap<Session, SocketProject> projects;
    private Set<Session> sessions;

    public EditorServer() {
        sessions = new HashSet<>();
        projects = new HashMap<>();
	System.out.println("Successfully created WebSocket listener on /chat");
    }
    @OnWebSocketConnect
    public void onWebSocketConnect(Session session) {
      sessions.add(session);
    }

    @OnWebSocketClose
    public void onWebSocketClose(Session session, int code, String reason) {
        sessions.remove(session);
        // When connection is closed, remove the project.
        projects.remove(session);
    }

    @OnWebSocketMessage
    public void onWebSocketText(Session session, String text) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Message msg = mapper.readValue(text, Message.class);
            switch (msg.getType()) {
		    case "LOAD_INIT_PROJECTS":
			addProject(msg.getType(), msg.getId(), session);
			break;
		    case "COLLAB_ADD_PROJECT":
			addForeign(msg);
			break;
		    case "SIGN_IN":
			addProject(msg.getType(), msg.getId(), session);
			break;
		    case "SIGN_OUT":
			projects.remove(session);
			break;
		    case "PING_USER":
			pingUser(msg);
			break;
		    case "REC_CREATE_PING":
			pingUser(msg);
			break;
		    case "REC_CONTINUE_PING":
			pingUser(msg);
			break;
		    case "REC_DELETE_PING":
			pingUser(msg);
			break;
		    case "SEND_LEFT":
			pingUser(msg);
			break;
		    case "SEND_HTML":
			broadcastMessage(msg);
			break;
		    case "SEND_CSS":
			broadcastMessage(msg);
			break;
		    case "SEND_JS":
			broadcastMessage(msg);
			break;
		    case "SEND_TITLE":
			broadcastMessage(msg);
			break;
		    default:
            }
        } catch (IOException e) {
            // return error message to project
            logger.error("Error receiving message from client");
        }
    }

   /* @OnMessage
    public void onMessage(WebSocket session, String message) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Message msg = mapper.readValue(message, Message.class);
            switch (msg.getType()) {
		    case "LOAD_INIT_PROJECTS":
			addProject(msg.getType(), msg.getId(), session);
			break;
		    case "COLLAB_ADD_PROJECT":
			addForeign(msg);
			break;
		    case "SIGN_IN":
			addProject(msg.getType(), msg.getId(), session);
			break;
		    case "SIGN_OUT":
			projects.remove(session);
			break;
		    case "PING_USER":
			pingUser(msg);
			break;
		    case "REC_CREATE_PING":
			pingUser(msg);
			break;
		    case "REC_CONTINUE_PING":
			pingUser(msg);
			break;
		    case "REC_DELETE_PING":
			pingUser(msg);
			break;
		    case "SEND_LEFT":
			pingUser(msg);
			break;
		    case "SEND_HTML":
			broadcastMessage(msg);
			break;
		    case "SEND_CSS":
			broadcastMessage(msg);
			break;
		    case "SEND_JS":
			broadcastMessage(msg);
			break;
		    case "SEND_TITLE":
			broadcastMessage(msg);
			break;
		    default:
            }
        } catch (IOException e) {
            // return error message to project
            logger.error("Error receiving message from client");
        }
    }

    @OnError
    public void onError(WebSocket session, Exception ex) {

        if (conn != null) {
            projects.remove(session);
            sessions.remove(session);
        }
        assert conn != null;
        ex.printStackTrace();
    }
*/
    private void broadcastMessage(Message msg) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String messageJson = mapper.writeValueAsString(msg);
            String projectid = msg.getId();
            for (Map.Entry<Session, SocketProject> entry : projects.entrySet()) {
		Session userSocket = entry.getKey();
		SocketProject projectInformation = entry.getValue();
                if (projectInformation.checkProjectId(projectid)) {
                    //userSocket.send(messageJson);
		    try {
		      // echo message back to client
		      userSocket.getRemote().sendString(messageJson);
		    } catch (IOException e) {
		      logger.error("Error broadcasting message: " + e.getMessage());
		    }
                }
            }
        } catch (JsonProcessingException e) {
		logger.error("Cannot convert message to json.");
        }
    }

    private void pingUser(Message msg) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String messageJson = mapper.writeValueAsString(msg);
            String username = msg.getId();
            for (Map.Entry<Session, SocketProject> entry : projects.entrySet()) {
		Session userSocket = entry.getKey();
		SocketProject projectInformation = entry.getValue();
                if (projectInformation.getUsername().equals(username)) {
                    //userSocket.send(messageJson);
		    try {
		      // echo message back to client
		      userSocket.getRemote().sendString(messageJson);
		      break;
		    } catch (IOException e) {
		      logger.error("Error broadcasting message: " + e.getMessage());
		    }
                }
            }
        } catch (JsonProcessingException e) {
            logger.error("Cannot convert message to json.");
        }
    }

    private void addProject(String type, String id, Session session) throws JsonProcessingException {
        if (type.equals("SIGN_IN")) {
            projects.put(session, new SocketProject(id));
        } else {
            SocketProject usersProject = projects.get(session);
            usersProject.addProjectId(id);
        }
    }

    private void addForeign(Message msg) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String messageJson = mapper.writeValueAsString(msg);
            String username = msg.getId();
            for (Map.Entry<Session, SocketProject> entry : projects.entrySet()) {
		Session userSocket = entry.getKey();
		SocketProject projectInformation = entry.getValue();
                if (projectInformation.getUsername().equals(username)) {
                    projectInformation.addProjectId(msg.getData());
                    //userSocket.send(messageJson);
		    try {
		      // echo message back to client
		      userSocket.getRemote().sendString(messageJson);
		      break;
		    } catch (IOException e) {
		      logger.error("Error broadcasting message: " + e.getMessage());
		    }
                }
            }
        } catch (JsonProcessingException e) {
            logger.error("Cannot convert message to json.");
        }
    }
    
    @OnWebSocketError
    public void onWebSocketError(Session session, Throwable cause) {
	if (session != null) {
            sessions.remove(session);
        }
        assert session != null;
        cause.printStackTrace();
    }
}



