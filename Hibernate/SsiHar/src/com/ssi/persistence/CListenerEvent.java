package com.ssi.persistence;
import java.sql.*;
import java.util.*;

/**
 * @author AAO
 *
 */
public class CListenerEvent implements IPersistenceObject {

private static final long serialVersionUID = -6888822135467779772L;
private Long id;
private Integer eventCode;
private Timestamp ts;
private Timestamp gwTs;

private CGateway gateway; // many to one
private CWirelessSensorModule wsm; // many to one
private List sensorData; // one to many

public CListenerEvent() {}
public CListenerEvent(Long id) {this.id=id;}
public CGateway getGateway() {
	return gateway;
}

public void setGateway(CGateway gateway) {
	this.gateway = gateway;
}

public List getSensorData() {
	return this.sensorData;
}

public void setSensorData(List sensorData) {
	this.sensorData = sensorData;
}

public void addSensorData(CSensorData sd) {
	if (this.sensorData == null)
		this.sensorData = new Vector();
	this.sensorData.add(sd);
}

public CWirelessSensorModule getWsm() {
	return wsm;
}

public void setWsm(CWirelessSensorModule wsm) {
	this.wsm = wsm;
}

public Long getId() {
	return id;
}
public void setId(Long id) {
	this.id = id;
}
/**
 * @return Returns the eventCode.
 */
public Integer getEventCode() {
	return eventCode;
}
/**
 * @param eventCode The eventCode to set.
 */
public void setEventCode(Integer eventCode) {
	this.eventCode = eventCode;
}


/**
 * @return Returns the ts.
 */
public Timestamp getTs() {
	return ts;
}
/**
 * @param ts The ts to set.
 */
public void setTs(Timestamp ts) {
	this.ts = ts;
}

public Timestamp getGwTs() {
	return gwTs;
}

public void setGwTs(Timestamp gwTs) {
	this.gwTs = gwTs;
}
public void deleteSensorData(CSensorData sd){
	if (this.sensorData == null || this.sensorData.isEmpty())
		return;
	sensorData.remove(sd);
	//sd.setListenerEvent(null);//??
}
}
