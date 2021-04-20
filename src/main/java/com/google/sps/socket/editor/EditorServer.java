package com.google.sps.socket.editor;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.sps.socket.message.Message;
import com.google.sps.socket.project.SocketProject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.OnError;

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
    }

    @OnClose
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        conns.remove(conn);
        // When connection is closed, remove the project.
        projects.remove(conn);
    }

    @OnMessage
    public void onMessage(WebSocket conn, String message) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Message msg = mapper.readValue(message, Message.class);
            switch (msg.getType()) {
            case "LOAD_INIT_PROJECTS":
                addProject(msg.getType(), msg.getId(), conn);
                break;
            case "COLLAB_ADD_PROJECT":
                addForeign(msg);
                break;
            case "SIGN_IN":
                addProject(msg.getType(), msg.getId(), conn);
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
    public void onError(WebSocket conn, Exception ex) {

        if (conn != null) {
            conns.remove(conn);
        }
        assert conn != null;
        ex.printStackTrace();
    }

    private void broadcastMessage(Message msg) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String messageJson = mapper.writeValueAsString(msg);
            String projectid = msg.getId();
            for (Map.Entry<WebSocket, SocketProject> entry : projects.entrySet()) {
                if (entry.getValue().checkProjectId(projectid)) {
                    entry.getKey().send(messageJson);
                }
            }
        } catch (JsonProcessingException e) {
        }
    }

    private void pingUser(Message msg) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String messageJson = mapper.writeValueAsString(msg);
            String username = msg.getId();
            for (Map.Entry<WebSocket, SocketProject> entry : projects.entrySet()) {
                if (entry.getValue().getUsername().equals(username)) {
                    entry.getKey().send(messageJson);
                    break;
                }
            }
        } catch (JsonProcessingException e) {
            logger.error("Cannot convert message to json.");
        }
    }

    private void addForeign(Message msg) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String messageJson = mapper.writeValueAsString(msg);
            String username = msg.getId();
            for (Map.Entry<WebSocket, SocketProject> entry : projects.entrySet()) {
                if (entry.getValue().getUsername().equals(username)) {
                    SocketProject usersProject = projects.get(entry.getKey());
                    usersProject.addProjectId(msg.getData());
                    entry.getKey().send(messageJson);
                    break;
                }
            }
        } catch (JsonProcessingException e) {
            logger.error("Cannot convert message to json.");
        }
    }

    private void addProject(String type, String id, WebSocket conn) throws JsonProcessingException {
        if (type.equals("SIGN_IN")) {
            projects.put(conn, new SocketProject(id));
        } else {
            SocketProject usersProject = projects.get(conn);
            usersProject.addProjectId(id);
        }
    }
}
