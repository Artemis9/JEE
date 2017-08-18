package com.ssi.web.common;

import java.util.Map;
import java.util.Hashtable;

import javax.servlet.http.*;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import org.apache.log4j.Logger;


public class CSession {
	static Logger LOG = Logger.getLogger(CSession.class.getName());
	private String clientSessionId;
	private String appId; 
	private String strKey;
	private HttpSession clientSession;
	private Map appSession;
	
	private void init(String strId)
	{
		try {
			this.appId = strId;
			this.clientSessionId = this.clientSession.getId();
			this.strKey = this.clientSessionId + this.appId;
			this.appSession = (Map) clientSession.getAttribute(this.strKey);
			LOG.info("CLIENT SESSION ID=" + this.clientSessionId);
			LOG.info("Pseudo session key =" + this.strKey);
		}
		catch (IllegalStateException e) {
			LOG.error("HTTP Session expired/invalidated");
		}
	}
	public CSession (String strId) {		
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		this.clientSession = (HttpSession) context.getSession(true);
		init(strId);
	}
	
	public CSession (HttpSession sess, String strId) {
		this.clientSession = sess;
		init(strId);
	}
	
	public  void put(Object key, Object value) {
		if (key == null || value == null)
			return;
		if (appSession == null) {
			appSession = new Hashtable();
		} 
		appSession.put(key,value);
		clientSession.setAttribute(this.strKey, appSession);
	}
	
	public Object get(Object key) {
		if (key == null)
			return null;
		if (appSession != null) {
			return appSession.get(key);
		}
		return null;
	}
    public void invalidate() {
		clientSession.removeAttribute(strKey);
    }	
	public void remove(Object key) {
		if (key == null)
			return;
		if (appSession != null) {
		    appSession.remove(key);
		    clientSession.setAttribute(this.strKey, appSession);
		}
	}
}
