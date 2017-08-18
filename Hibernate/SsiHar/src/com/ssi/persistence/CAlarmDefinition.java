package com.ssi.persistence;
import java.util.*;

import com.ssi.util.CMathUtil;
public class CAlarmDefinition implements IPersistenceObject {

	private static final long serialVersionUID = -6806278293073981689L;
	private Long id;
	private String notes;
	private String name;
	private Float operand1;
	private Float operand2;
	private Short operator1;
	private Short operator2;
	private Short connector;
	
	private Short filterLimit;
	private Short filterLength;
	private String notifyList;
	private String message;
	private Boolean enabled;
	private String description;
	
	private Boolean voiceNotified;
	private String  voiceNotifyList;
	
	private CMeasurement measurement;
	private Set alarms;
	private Set alarmHistory;
	
	private int version;
	
	public CAlarmDefinition() {}
	public CAlarmDefinition(Long id) {this.id=id;}
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

	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getNotifyList() {
		return notifyList;
	}
	public void setNotifyList(String notifyList) {
		this.notifyList = notifyList;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Boolean getEnabled() {
		return enabled;
	}
	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}
	public CMeasurement getMeasurement() {
		return measurement;
	}
	public void setMeasurement(CMeasurement measurement) {
		this.measurement = measurement;
	}
	public Set getAlarms() {
		return alarms;
	}
	public void setAlarms(Set alarms) {
		this.alarms = alarms;
	}
	public Float getOperand1() {
		return operand1;
	}
	public void setOperand1(Float operand1) {
		this.operand1 = operand1;
	}
	public Float getOperand2() {
		return operand2;
	}
	public void setOperand2(Float operand2) {
		this.operand2 = operand2;
	}
	public Short getConnector() {
		return connector;
	}
	public void setConnector(Short connector) {
		this.connector = connector;
	}
	public Short getOperator1() {
		return operator1;
	}
	public void setOperator1(Short operator1) {
		this.operator1 = operator1;
	}
	public Short getOperator2() {
		return operator2;
	}
	public void setOperator2(Short operator2) {
		this.operator2 = operator2;
	}
	public Short getFilterLength() {
		return filterLength;
	}
	public void setFilterLength(Short filterLength) {
		this.filterLength = filterLength;
	}
	public Short getFilterLimit() {
		return filterLimit;
	}
	public void setFilterLimit(Short filterLimit) {
		this.filterLimit = filterLimit;
	}
	public void deleteAlarm(CAlarm alarm){
		if (this.alarms == null || this.alarms.isEmpty())
			return;
		alarms.remove(alarm);
		//alarm.setDefinition(null);//??
	}
	
	public int getVersion() {
		return version;
	}
	public void setVersion(int version) {
		this.version = version;
	}
	public Set getAlarmHistory() {
		return alarmHistory;
	}
	public void setAlarmHistory(Set alarmHistory) {
		this.alarmHistory = alarmHistory;
	}
	public void deleteAlarmHistory(CAlarmHistory alarmHist){
		if (this.alarmHistory == null || this.alarmHistory.isEmpty())
			return;
		alarmHistory.remove(alarmHist);
		//alarmHist.setDefinition(null);//??
	}
//	 The following is used for associating two objects that maybe coming from different sessions
    // and/or need to be differentiated in a set.
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof CAlarmDefinition)) return false;
        final CAlarmDefinition a = (CAlarmDefinition) other;
        if(this.id != null)
        	return this.id.equals(a.getId());
        return false;
    }

    public int hashCode() {
    	if (this.id!=null)
    		return this.id.hashCode();
    	return 0;
    }
    
    public void convertCOperandsToF() {
    	this.operand1=CMathUtil.CelciusToFahrenheit(this.operand1);
		if (this.operand2!=null)
			this.operand2=CMathUtil.CelciusToFahrenheit(this.operand2);
    }
    public void convertFOperandsToC() {
	    this.operand1=CMathUtil.FahrenheitToCelcius(this.operand1);
		if (this.operand2!=null)
			this.operand2=CMathUtil.FahrenheitToCelcius(this.operand2);
    }
	public Boolean getVoiceNotified() {
		return voiceNotified;
	}
	public void setVoiceNotified(Boolean voiceNotified) {
		this.voiceNotified = voiceNotified;
	}
	public String getVoiceNotifyList() {
		return voiceNotifyList;
	}
	public void setVoiceNotifyList(String voiceNotifyList) {
		this.voiceNotifyList = voiceNotifyList;
	}

}
