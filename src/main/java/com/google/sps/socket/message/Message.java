package com.google.sps.message;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Message implements Serializable{

    private String id;
    private String type;
    private String data;

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getData(){
        return data;
    }
}
