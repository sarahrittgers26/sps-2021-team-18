package com.google.sps.socket.editor;

import java.io.IOException;
import java.util.logging.Logger;
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
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

@WebSocket
public class EditorServer {

    private Logger logger = Logger.getLogger(EditorServer.class.getName());

    private HashMap<Session, SocketProject> projects;
    private Set<Session> sessions;

    public EditorServer() {
        sessions = new HashSet<>();
        projects = new HashMap<>();
    }

    @OnWebSocketConnect
    public void onWebSocketConnect(Session session) {
      sessions.add(session);
      System.out.println("Successful connection from new session: " 
		      + session.getRemoteAddress() + " to /chat");
      ensure(session);
    }

    @OnWebSocketClose
    public void onWebSocketClose(Session session, int code, String reason) {
        sessions.remove(session);
        // When connection is closed, remove the project.
        projects.remove(session);
        System.out.println("Successful disconnection from session: " 
		      + session.getRemoteAddress() + " from /chat");
    }

    @OnWebSocketMessage
    public void onWebSocketText(Session session, String text) {
        System.out.println(session.getRemoteAddress() + " sucessfully sent: " 
			+ text + " to server");
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
            logger.severe("Error receiving message from client");
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
		      System.out.println("Successfully sent: " + messageJson + " to " 
				      + userSocket.getRemoteAddress());
		    } catch (IOException e) {
		      logger.severe("Error broadcasting message: " + e.getMessage());
		    }
                }
            }
        } catch (JsonProcessingException e) {
		logger.severe("Cannot convert message to json.");
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
		      System.out.println("Successfully sent: " + messageJson + " to " 
				      + userSocket.getRemoteAddress());
		      break;
		    } catch (IOException e) {
		      logger.severe("Error broadcasting message: " + e.getMessage());
		    }
                }
            }
        } catch (JsonProcessingException e) {
            logger.severe("Cannot convert message to json.");
        }
    }

    private void addProject(String type, String id, Session session) throws JsonProcessingException {
        if (type.equals("SIGN_IN")) {
            projects.put(session, new SocketProject(id));
	    System.out.println("Successfully added " + session.getRemoteAddress());
        } else {
            SocketProject usersProject = projects.get(session);
            usersProject.addProjectId(id);
	    System.out.println("Successfully added " + id + " to " 
			    + session.getRemoteAddress());
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
	    	    System.out.println("Successfully added " + msg.getData() + " to " 
			    + userSocket.getRemoteAddress());
                    //userSocket.send(messageJson);
		    try {
		      // echo message back to client
		      userSocket.getRemote().sendString(messageJson);
		      System.out.println("Successfully sent: " + messageJson + " to " 
				      + userSocket.getRemoteAddress());
		      break;
		    } catch (IOException e) {
		      logger.severe("Error broadcasting message: " + e.getMessage());
		    }
                }
            }
        } catch (JsonProcessingException e) {
            logger.severe("Cannot convert message to json.");
        }
    }
    
    private void ensure(Session session) {
	try {
            session.getRemote().sendString("Ensuring connection from server");
	} catch (IOException e) {
	    e.printStackTrace();
	}
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
            logger.severe("Error receiving message from client");
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
