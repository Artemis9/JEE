/**
 * 
 */
package com.ssi.persistence;
import java.util.*;
/**
 * @author AAO
 *
 */
public class CSensorData implements IPersistenceObject {
private static final long serialVersionUID = -229953073076430510L;
private Long id;

private Float value;
private CMeasurement measurement;
private CListenerEvent listenerEvent;
private Short order;
private Set alarms;

public CListenerEvent getListenerEvent() {
	return listenerEvent;
}

public void setListenerEvent(CListenerEvent listenerEvent) {
	this.listenerEvent = listenerEvent;
}

public CMeasurement getMeasurement() {
	return measurement;
}

public void setMeasurement(CMeasurement measurement) {
	this.measurement = measurement;
}

public CSensorData() {}
public CSensorData(Long id) {this.id=id;}

public Long getId() {
	return id;
}
public void setId(Long id) {
	this.id = id;
}
/**
 * @return Returns the value.
 */
public Float getValue() {
	return value;
}
/**
 * @param value The value to set.
 */
public void setValue(Float value) {
	this.value = value;
}

public Short getOrder() {
	return order;
}

public void setOrder(Short order) {
	this.order = order;
}

public Set getAlarms() {
	return alarms;
}

public void setAlarms(Set alarms) {
	this.alarms = alarms;
}

public void addAlarm(CAlarm alarm) {
	if (this.alarms == null)
		this.alarms = new HashSet();
	this.alarms.add(alarm);
	if (alarm != null) {
		alarm.setSd(this);
	}
}


public void deleteAlarm(CAlarm alarm){
	if (this.alarms == null || this.alarms.isEmpty())
		return;
	alarms.remove(alarm);
	//alarm.setListenerEvent(null);//??
}

}
