package com.google.sps.project;

import java.io.Serializable;
import java.util.Objects;

public class SocketProject implements Serializable {
    private String projectid;

    public SocketProject() {
    }

    public SocketProject(String projectid) {
        this.projectid = projectid;
    }

    public String getProjectId() {
        return this.projectid;
    }

    public void setProjectId(String projectid) {
        this.projectid = projectid;
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectid);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if(null == o || o.getClass() != this.getClass()) return false;

        SocketProject other = (SocketProject) o;

        return Objects.equals(this.projectid, other.projectid);
    }
}
