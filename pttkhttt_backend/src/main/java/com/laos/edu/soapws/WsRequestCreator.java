
package com.laos.edu.soapws;


import org.apache.http.HttpHost;

import java.io.Serializable;


public class WsRequestCreator implements Serializable{
    private String wsAddress;
    private String targetNameSpace;
    private int connectionTimeout = 0;
    private int receiveTimeout = 0;
    private String passwordType;
    private int maxRetry = 1;
    private String systemName;
    private String serviceName;
    private String username;
    private String password;
    private String brandname;

    /*
    close httClient after get the response
     */
    private boolean closeOnResponse;

    private HttpHost proxy;

    public WsRequestCreator(){

    }


    public WsRequestCreator(String wsAddress, String targetNameSpace, String serviceName, String username, String password) {
        this.wsAddress = wsAddress;
        this.targetNameSpace = targetNameSpace;
        setServiceName(serviceName);
    }

    public WsRequestCreator(String wsAddress, String targetNameSpace, String serviceName) {
        this.wsAddress = wsAddress;
        this.targetNameSpace = targetNameSpace;
        setServiceName(serviceName);
    }

    public String getWsAddress() {
        return wsAddress;
    }

    public void setWsAddress(String wsAddress) {
        this.wsAddress = wsAddress;
    }

    public String getTargetNameSpace() {
        return targetNameSpace;
    }

    public void setTargetNameSpace(String targetNameSpace) {
        this.targetNameSpace = targetNameSpace;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public boolean isCloseOnResponse() {
        return closeOnResponse;
    }

    public void setCloseOnResponse(boolean closeOnResponse) {
        this.closeOnResponse = closeOnResponse;
    }

    public int getConnectionTimeout() {
        return connectionTimeout;
    }

    public void setConnectionTimeout(int connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    public int getReceiveTimeout() {
        return receiveTimeout;
    }

    public void setReceiveTimeout(int receiveTimeout) {
        this.receiveTimeout = receiveTimeout;
    }

    public HttpHost getProxy() {
        return proxy;
    }

    public void setProxy(HttpHost proxy) {
        this.proxy = proxy;
    }

    public String getPasswordType() {
        return passwordType;
    }

    public void setPasswordType(String passwordType) {
        this.passwordType = passwordType;
    }

    public int getMaxRetry() {
        return maxRetry;
    }

    public void setMaxRetry(int maxRetry) {
        this.maxRetry = maxRetry;
    }

    public String getSystemName() {
        return systemName;
    }

    public void setSystemName(String systemName) {
        this.systemName = systemName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBrandname() {
        return brandname;
    }

    public void setBrandname(String brandname) {
        this.brandname = brandname;
    }
}
