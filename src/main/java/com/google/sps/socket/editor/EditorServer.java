package com.google.sps.socket.editor;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.sps.message.Message;
import com.google.sps.project.SocketProject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.OnError;
import javax.websocket.Session;

@ServerEndpoint(value = "/")
public class EditorServer extends WebSocketServer {

    private final static Logger logger = LogManager.getLogger(EditorServer.class);

    private HashMap<WebSocket, SocketProject> projects;
    private Set<WebSocket> conns;

    public EditorServer(int port) {
        super(new InetSocketAddress(port));
        conns = new HashSet<>();
        projects = new HashMap<>();
    }

    @OnOpen
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
        conns.add(webSocket);

        logger.info("Connection established from: " + webSocket.getRemoteSocketAddress().getHostString());
        System.out.println("New connection from " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    @OnClose
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        conns.remove(conn);
        // When connection is closed, remove the project.
        /*try {
            //removeProject(conn);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }*/

        logger.info("Connection closed to: " + conn.getRemoteSocketAddress().getHostString());
        System.out.println("Closed connection to " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    @OnMessage
    public void onMessage(WebSocket conn, String message) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Message msg = mapper.readValue(message, Message.class);

            switch (msg.getType()) {
                case "LOAD_INIT_PROJECTS":
                    addProject(new SocketProject(msg.getProjectId()), conn);
		    break;
                case "SEND_TEXT":
                    broadcastMessage(msg);
            }

            System.out.println("Message from: " + msg.getProjectId() + ", text: " 
			    + msg.getData() + ", type:" + msg.getType());
            logger.info("Message from project: " + msg.getProjectId() + ", text: " + msg.getData());
        } catch (IOException e) {
            logger.error("Wrong message format.");
            // return error message to project
        }
    }

    @OnError
    public void onError(WebSocket conn, Exception ex) {

        if (conn != null) {
            conns.remove(conn);
        }
        assert conn != null;
        System.out.println("ERROR from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
	ex.printStackTrace();
    }

    private void broadcastMessage(Message msg) {
        ObjectMapper mapper = new ObjectMapper();
        try {
	    String messageJson = mapper.writeValueAsString(msg);
	    String projectid = msg.getProjectId();
            for (Map.Entry<WebSocket, SocketProject> entry: projects.entrySet()) {
                if (entry.getValue().getProjectId().equals(projectid)) {
			entry.getKey().send(messageJson);
			break;
		}
            }
        } catch (JsonProcessingException e) {
            logger.error("Cannot convert message to json.");
        }
    }

    private void addProject(SocketProject project, WebSocket conn) throws JsonProcessingException {
        projects.put(conn, project);
    }

    private void removeProject(WebSocket conn) throws JsonProcessingException {
        projects.remove(conn);
    }
    
    public static void main(String[] args) {
        int port = 9000;
        /*try {
            port = Integer.parseInt(System.getenv("PORT"));
        } catch (NumberFormatException nfe) {
            port = 9000;
        }*/
        WebSocketServer editorSocket = new EditorServer(port);
	editorSocket.start();
	System.out.println("Socket backend started on port: " + port);
    }
}
