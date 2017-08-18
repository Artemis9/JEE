/**
* Author: Artemis Ozten
* Date: 10/18/2005
* Description: The main page (gatewayContents.jsp) component of backing bean.
*/
package com.ssi.web.bean;

import java.sql.Timestamp;
import java.util.*;

import com.ssi.persistence.CMeasurement;
import com.ssi.persistence.IPersistenceObject;
import com.ssi.persistence.CAlarmDefinition;
import com.ssi.persistence.CAlarm;
import com.ssi.persistence.CSensorData;

import com.ssi.util.*;

public class MeshMeasurement extends  AMeasurement implements Comparable{

	private static final long serialVersionUID = -6778813730675054172L;
	
	//private Timestamp lastDataTs;
	
	private Float lastDataValue;
	private Long tzo;
	
	private Timestamp alarmTs;
	private Float alarmValue;
	private Boolean alarmActive;
	private String alarmName;
	private String alarmState;
	
	public MeshMeasurement() {;}

	protected  MeshMeasurement(IPersistenceObject ipo, Long tzo) {
		if (ipo == null) {
			LOG.error("Can't instantiate Measurement object from persistence object; ipo=null");
			// throw an exception  ???
			return;
		}
		CMeasurement m = (CMeasurement) ipo;
		CSensorData sd = m.getLastSensorData();
		if (sd!=null) {
			//this.lastDataTs = sd.getTs();
			this.lastDataValue = sd.getValue();
		}
		alarmState = ALARM_STATE_DISABLED;
		//if (m.isHasAlarm()) {
			Set aDefs = m.getAlarmDefinitions();
			if (aDefs != null && ! aDefs.isEmpty()) {
				Iterator iter = aDefs.iterator();
				CAlarmDefinition aDef = (CAlarmDefinition) iter.next();
				Set alarms = aDef.getAlarms(); 
				
				if (aDef.getEnabled().booleanValue()) {
					alarmState = ALARM_STATE_ENABLED;
				}
				
				if (alarms!=null && !alarms.isEmpty()) {
					iter = alarms.iterator();
					CAlarm alarm = (CAlarm) iter.next();
					if (alarm != null){
						this.alarmActive=alarm.getActive();
						if (this.alarmActive.booleanValue()) {
							alarmState = ALARM_STATE_TRIGGERED;
						}
						this.alarmName=aDef.getName();
						this.alarmTs=alarm.getTs();
						this.alarmValue=alarm.getValue();
					}
				}
			}
		//}
		setBean(m,tzo);
	}
	
	

	public Float getLastDataValue() {
		return lastDataValue;
	}

	public synchronized void setLastDataValue(Float lastDataValue) {
		this.lastDataValue = lastDataValue;
	}

	 public Double getLastDataValueCalc(){
		 //		JSF handles nulls well, but make sure to catch them.
		 if (this.lastDataValue == null)
			return null;
		 return CMathUtil.CalcMeasurement( this.lastDataValue.floatValue(),
											 coeff1.floatValue(),
											 coeff2.floatValue(),
											 coeff3.floatValue(),
											 coeff4.floatValue());
	 }

	// Set up the bean from DB
	private void setBean(CMeasurement m, Long tzo){
		super.setBean(m);
		this.tzo = tzo;
	}
	protected String getExceptionMessage (Exception e) {
		return "Error in MeshMeasurement business object";
	}

	public Boolean getAlarmActive() {
		return alarmActive;
	}

	public synchronized void setAlarmActive(Boolean alarmActive) {
		this.alarmActive = alarmActive;
	}

	public String getAlarmName() {
		return alarmName;
	}

	public synchronized void setAlarmName(String alarmName) {
		this.alarmName = alarmName;
	}

	public Timestamp getAlarmTs() {
		return alarmTs;
	}
	public Timestamp getAlarmLocalTs() {
		return CDateUtil.CalcLocalTime(alarmTs, this.tzo);
	}
	public synchronized void setAlarmTs(Timestamp alarmTs) {
		this.alarmTs = alarmTs;
	}

	public Float getAlarmValue() {
		return alarmValue;
	}
	public Double getAlarmValueCalc() {
//		JSF handles nulls well, but make sure to catch them.
		 if (this.alarmValue == null)
			return null;
		 return CMathUtil.CalcMeasurement( this.alarmValue.floatValue(),
											 coeff1.floatValue(),
											 coeff2.floatValue(),
											 coeff3.floatValue(),
											 coeff4.floatValue());
	}
	public synchronized void setAlarmValue(Float alarmValue) {
		this.alarmValue = alarmValue;
	}

	public boolean getAlarmExists() {
		return (this.alarmValue!=null);
	}
	public Boolean getAlarmTriggered() {
		Boolean triggered = Boolean.FALSE;
		if (alarmState.compareTo(ALARM_STATE_TRIGGERED) == 0) {
			triggered = Boolean.TRUE;
		}
		return (triggered);
	}
	public void setAlarmTriggered(Boolean ready) {
		//noop
	}
	public Boolean getAlarmReady() {
		Boolean ready = Boolean.FALSE;
		if (alarmState.compareTo(ALARM_STATE_ENABLED) == 0) {
			ready = Boolean.TRUE;
		}
		return (ready);
	}
	public void setAlarmReady(Boolean ready) {
		//noop
	}
	public Boolean getAlarmDisabled() {
		Boolean disabled = Boolean.FALSE;
		if (alarmState.compareTo(ALARM_STATE_DISABLED) == 0) {
			disabled = Boolean.TRUE;
		}
		return (disabled);
	}
	public void setAlarmDisabled(Boolean disabled) {
		// noop
	}
	public String getAlarmState() {
		return (alarmState);
	}
	public void setAlarmState(String state) {
		// noop
	}
	public synchronized void setName(String name) {
		this.name = name;
	}
	public synchronized void setCoeff1(Double coeff) {
		this.coeff1 = coeff;
	}
	public synchronized void setCoeff2(Double coeff) {
		this.coeff2 = coeff;
	}
	public synchronized void setCoeff3(Double coeff) {
		this.coeff3 = coeff;
	}
	public synchronized void setCoeff4(Double coeff) {
		this.coeff4 = coeff;
	}
	public synchronized void setUnit(String unit) {
		this.unit = unit;
	}
	public int compareTo(Object other){
		MeshMeasurement measurement = (MeshMeasurement) other;
		return this.getName().compareToIgnoreCase(measurement.getName());
	}
	
}
