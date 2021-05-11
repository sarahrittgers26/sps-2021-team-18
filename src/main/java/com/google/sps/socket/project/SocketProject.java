package com.google.sps.socket.project;

import java.io.Serializable;
import java.util.Objects;
import java.util.HashSet;
import java.util.Set;

public class SocketProject implements Serializable {
    private Set<String> projects;
    private String username;

    public SocketProject() {
    }

    public SocketProject(String username) {
        projects = new HashSet<>();
        this.username = username;
    }

    public void addProjectId(String projectid) {
        projects.add(projectid);
    }

    public void removeProjectId(String projectid) {
        projects.remove(projectid);
    }

    public boolean checkProjectId(String projectid) {
        return projects.contains(projectid);
    }

    public String getUsername() {
        return username;
    }

    @Override
    public int hashCode() {
        return Objects.hash(projects);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (null == o || o.getClass() != this.getClass())
            return false;

        SocketProject other = (SocketProject) o;

        return Objects.equals(this.username, other.getUsername());

    }
}
