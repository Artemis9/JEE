package com.ssi.persistence;

import java.util.*;
import java.sql.Timestamp;


/**
 * @author AAO
 *
 */
public class CWirelessSensorModule implements IPersistenceObject {

  private static final long serialVersionUID = -6788353270469419785L;
  private Long id;
	
  private String eui;
  private String notes;
	
  private String description;
  private String name;
  private Boolean active;

  private String hwVersion;
  private String fwVersion;
  private Timestamp lastDataLogTs;
  private CGateway gateway;
  private CWsmType wsmType;
  private List measurements;
  private int version;
  private List listenerEvents;
  public CWirelessSensorModule() {}
  public CWirelessSensorModule(String eui) {this.eui = eui;}
  public CWirelessSensorModule(Long id) {this.id = id;}
/**
 * @return Returns the fwVersion.
 */
public String getFwVersion() {
	return fwVersion;
}
/**
 * @param fwVersion The fwVersion to set.
 */
public void setFwVersion(String fwVersion) {
	this.fwVersion = fwVersion;
}
/**
 * @return Returns the hwVersion.
 */
public String getHwVersion() {
	return hwVersion;
}
/**
 * @param hwVersion The hwVersion to set.
 */
public void setHwVersion(String hwVersion) {
	this.hwVersion = hwVersion;
}
public String getDescription() {
	return description;
}
public void setDescription(String description) {
	this.description = description;
}
public String getEui() {
	return eui;
}
public void setEui(String eui) {
	this.eui = eui;
}
public Long getId() {
	return id;
}
public void setId(Long id) {
	this.id = id;
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public String getNotes() {
	return notes;
}
public void setNotes(String notes) {
	this.notes = notes;
}
  
public CGateway getGateway(){
	return gateway;
}

public void setGateway(CGateway gateway){
	this.gateway = gateway;
}
public List getMeasurements() {
	return measurements;
}
public void setMeasurements(List measurements) {
	this.measurements = measurements;
}
/**
 * Called from within the session, parent has the responsability to 
 * own the child and set references.
 * @param measurement
 */
public void addMeasurement(CMeasurement measurement)
{
	if (this.measurements == null)
		this.measurements = new Vector();
	this.measurements.add(measurement);
	if (measurement != null) {
		measurement.setWsm(this);
	}
}
public CWsmType getWsmType() {
	return wsmType;
}
public void setWsmType(CWsmType wsmType) {
	this.wsmType = wsmType;
}
public Boolean isActive() {
	return getActive();
}
public void setActive(Boolean active) {
	this.active = active;
}  

public Boolean getActive() {
	return this.active ;
}  
public boolean hasGateway(CGateway gw) {
	if (gw==null) return false;
	return (gw.equals(this.getGateway()));
	}


public Timestamp getLastDataLogTs() {
	return lastDataLogTs;
}
public void setLastDataLogTs(Timestamp lastDataLogTs) {
	this.lastDataLogTs = lastDataLogTs;
}
//The following is used for associating two objects that maybe coming from different sessions
// and/or need to be differentiated in a set.
public boolean equals(Object other) {
    if (this == other) return true;
    if (!(other instanceof CWirelessSensorModule)) return false;
    final CWirelessSensorModule wsm = (CWirelessSensorModule) other;
    if (this.eui != null)
    	return this.eui.equals(wsm.getEui());
    if(this.id != null)
    	return this.id.equals(wsm.getId());
    return false;
   
}

public List getListenerEvents() {
	return listenerEvents;
}
public void setListenerEvents(List listenerEvents) {
	this.listenerEvents = listenerEvents;
}
public int hashCode() {
	if (this.eui!=null)
		return this.eui.hashCode();
	if (this.id!=null)
		return this.id.hashCode();
	return 0;
}
public int getVersion() {
	return version;
}
public void setVersion(int version) {
	this.version = version;
}
public void deleteMeasurement(CMeasurement m){
	if (this.measurements == null || this.measurements.isEmpty())
		return;
	measurements.remove(m);
	//measurements.setWsm(null);//??
}

public void deleteListenerEvent(CListenerEvent le){
	if (this.listenerEvents == null || this.listenerEvents.isEmpty())
		return;
	listenerEvents.remove(le);
	//le.setWsm(null);//??
}
public String getEuiOriginal() {
	if (this.eui != null) {
		int i = this.eui.indexOf("-");
		if (i>0) return eui.substring(0, i);
	}
	return eui;
}
}
