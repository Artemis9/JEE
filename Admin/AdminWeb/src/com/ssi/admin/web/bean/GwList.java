package com.ssi.admin.web.bean;
import java.util.*;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import com.ssi.admin.ejb.IAdminManagerLocal;


public class GwList extends AAdminObject {
	
	private List gateways;
	private Long tzo;
	
	public GwList() {;}
	
	protected  void init() {
		LOG.info("XXXXXXXXX  IN init()  XXXXXXXXX");
		try {
			ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
			Map session = context.getSessionMap();
			session.remove("gwIdAdmin");
			IAdminManagerLocal am = initAdminEjbLocal();
			this.gateways = (List) am.GetGateways();
		}
		catch(Exception e) {
			logExceptionMessage(e,"init()");
		}
		
	} 
	
	public String doDetail() {
		LOG.info("XXXXXXXXX  DoDetail  XXXXXXXXX");
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		Map session = context.getSessionMap();
		session.put("USER_TZO", this.tzo);
		LOG.info("tzo="+this.tzo);
		return ACTION_RET_DETAIL;
	}
	public String getInit() {
		LOG.info("XXXXXXXXX  IN getInit()  XXXXXXXXX");
		init();
		return("OK");
	}
	public void setInit(String str) {
		LOG.info("XXXXXXXXX  IN getInit()  XXXXXXXXX");
	}
	public List getGateways() {
		return gateways;
	}

	public void setGateways(List gateways) {
		this.gateways = gateways;
	}
	
	public Long getTzo() {
		return tzo;
	}

	public void setTzo(Long tzo) {
		this.tzo = tzo;
	}

	protected String getExceptionMessage (Exception e) {
		return "Error in GwList admin object";
	}
}
