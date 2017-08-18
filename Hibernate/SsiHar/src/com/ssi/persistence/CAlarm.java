package com.ssi.persistence;

import java.sql.Timestamp;

public class CAlarm implements IPersistenceObject {

	private static final long serialVersionUID = 2291432521886626446L;
	
	private Long id;
	private CAlarmDefinition definition;
	
	private Timestamp ts;
	private Float value;
	
	private CSensorData sd;
	private Boolean active;
	
	public CAlarm() {}
	public CAlarm(Long id) {
		this.id = id;
	}
	public Timestamp getTs() {
		return ts;
	}
	public void setTs(Timestamp ts) {
		this.ts = ts;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public CAlarmDefinition getDefinition() {
		return definition;
	}
	public void setDefinition(CAlarmDefinition definition) {
		this.definition = definition;
	}

	public Float getValue() {
		return value;
	}
	public void setValue(Float value) {
		this.value = value;
	}
	public CSensorData getSd() {
		return sd;
	}
	public void setSd(CSensorData sd) {
		this.sd = sd;
	}
	public Boolean getActive() {
		return active;
	}
	public void setActive(Boolean active) {
		this.active = active;
	}

//	 The following is used for associating two objects that maybe coming from different sessions
    // and/or need to be differentiated in a set.
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof CAlarm)) return false;
        final CAlarm a = (CAlarm) other;
        if(this.id != null)
        	return this.id.equals(a.getId());
        return false;
    }

    public int hashCode() {
    	if (this.id!=null)
    		return this.id.hashCode();
    	return 0;
    }
	
}
