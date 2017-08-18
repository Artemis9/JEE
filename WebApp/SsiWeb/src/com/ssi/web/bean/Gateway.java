package com.ssi.web.bean;

import java.util.*;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import com.ssi.ejb.ISsiManagerLocal;

import com.ssi.web.common.IURLConstants;

import com.ssi.persistence.*;

/**
 * @author AAO
 *
 */
public class Gateway extends ABusinessObject implements IDescribableObject {
private static final long serialVersionUID = -4679116304903713737L;

private String description;
private String notes;
private String mac;
private Long measurementinterval;
private String hwversion;
private String fwversion;
private String radiofwversion;

public Gateway () {updateOk=false; updateFail1=false; measurementinterval=Long.valueOf(0);}

public String getDescription() {
	return description;
}

public void setDescription(String description) {
	this.description = description;
}

public String getFwversion() {
	return fwversion;
}

public void setFwversion(String fwversion) {
	this.fwversion = fwversion;
}

public String getHwversion() {
	return hwversion;
}

public void setHwversion(String hwversion) {
	this.hwversion = hwversion;
}

public String getMac() {
	return mac;
}

public void setMac(String mac) {
	this.mac = mac;
}

public Long getMeasurementinterval() {
	return measurementinterval;
}

public void setMeasurementinterval(Long measurementinterval) {
	this.measurementinterval = measurementinterval;
}

public String getNotes() {
	return notes;
}

public void setNotes(String notes) {
	this.notes = notes.length() > MAX_FORM_NOTES_LENGTH ? notes.substring(0,MAX_FORM_NOTES_LENGTH): notes;
}

public String getRadiofwversion() {
	return radiofwversion;
}

public void setRadiofwversion(String radiofwversion) {
	this.radiofwversion = radiofwversion;
}

public Long getMeasurementIntervalSeconds() {
	if (this.measurementinterval!=null)
		return new Long (measurementinterval.longValue()/1000);
	return null;
}

public void setMeasurementIntervalSeconds(Long secs) {
	this.measurementinterval = new Long(secs.longValue()*1000);
}

protected String getExceptionMessage (Exception e) {
	return "Error in Gateway business object";
}

protected void init() {
	try {
		//LOG.info("XXXXXXXXX  IN init()  XXXXXXXXX this.id="+this.id);
		sessionFail = false;
		if (this.id == null) {
			//LOG.info("XXXXXXXXX  this.id=null  XXXXXXXXX");
			FacesContext instance = FacesContext.getCurrentInstance();
	    	ExternalContext context = instance.getExternalContext();
		    Map session = context.getSessionMap();
			Mesh mesh= (Mesh) session.get(IURLConstants.MESH_BEAN);
			if (mesh==null || mesh.id == null) {
				sessionFail = true;
				return;
			}
			else {
				//LOG.info("XXXXXXXXX  mesh!=null  XXXXXXXXX");
				/* instance.getApplication()
				.createValueBinding("#{gatewayBean}" )
				.setValue(instance, null);
				
			    UIViewRoot viewRoot= instance.getViewRoot();
			    List childList=viewRoot.getChildren();*/

				
				ISsiManagerLocal sm = initSsiEjbLocal();		
				CGateway gw = (CGateway)sm.GetGatewayInfo(mesh.getId(), false, false);
				setBean(gw);
				this.admin = mesh.isAdmin();
			}
		} //if 
	 } //try
	 catch (Exception e) {
	    logExceptionMessage(e,"init()");
	 }
}
public String doUpdate() {
	LOG.info("XXXXXXXXX  IN DO-UPDATE()  XXXXXXXXX");
	
	try {  
		//the following condition should never be true because front-end controls.
		if (!this.admin)  return ACTION_RET_FAILED;

		ISsiManagerLocal sm = initSsiEjbLocal();

		CGateway pGw= new CGateway();
		pGw.setId(this.id);
		pGw.setDescription(this.description);
		pGw.setName(this.name);
		pGw.setNotes(this.notes);
		pGw.setMeasurementInterval(this.measurementinterval);
		
		pGw = (CGateway) sm.UpdateGatewayInfo(pGw);
		// Business logic in the ejb method may overwrite the user setting for 
		// measurement interval which can not be less than 30 secs
		//this.measurementinterval = pGw.getMeasurementInterval();(see the call for setBean())

		
		//	think about performance and side effects here but have to sych session to prevent change regressions
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		Map session = context.getSessionMap();
		//synchronized (session) {
		Mesh sGw= (Mesh) session.get(IURLConstants.MESH_BEAN);
		sGw.setName(pGw.getName());
		session.put(IURLConstants.MESH_BEAN,sGw);
		//} // synchronized
		//Reset bean from DB because disabled fields do not come back from client, do not show up in the secreen after update
		// However this did not seem to be a problem for this bean (why?)
		//setBean(pGw);
		//Map requestMap = this.context.getRequestMap();
		//requestMap.put(IURLConstants.GATEWAY_BEAN,this);
	} catch (Exception e){
		updateFail1 = true;
		logExceptionMessage(e,"doUpdate()");
		return ACTION_RET_FAILED;
    }
	this.updateOk = true;
	return (ACTION_RET_UPDATE);
  }

private void setBean(CGateway gw){
	//LOG.info("XXXXXXXXX  IN setBean()  XXXXXXXXX this.measurementinterval="+this.measurementinterval);
	this.id = gw.getId();
	this.name = gw.getName();
	this.description = gw.getDescription();
	this.notes = gw.getNotes();
	this.mac = gw.getMac();
	this.fwversion = gw.getFwVersion();
	this.hwversion = gw.getHwVersion();
	this.radiofwversion = gw.getRadioFwVersion();
	this.measurementinterval = gw.getMeasurementInterval();
	//LOG.info("XXXXXXXXX  IN setBean()  XXXXXXXXX this.measurementinterval="+this.measurementinterval);
}
public int getMaxDescriptionLength() { return MAX_FORM_DESCRIPTION_LENGTH;}
public int getMaxNotesLength(){return MAX_FORM_NOTES_LENGTH;}
}//Gateway
