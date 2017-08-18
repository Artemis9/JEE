package com.ssi.persistence;

import java.util.*;


/**
 * @author AAO
 *
 */
public class CGateway  implements IPersistenceObject {

	private static final long serialVersionUID = 6438844742888058938L;

	private Long id;
	
	private String eui;
	private String notes;
	
	private String description;
	private String name; 
	private String mac;
	private Long measurementInterval;
	private Long wakeupInterval;
	private Long maxHeartBeatInterval;
	private String hwVersion;
	private String fwVersion;
	private String radioFwVersion;
	private Set wsms;
	private Boolean active;
	private CAccount account;
	private int version;
	
	public CGateway() {}
	public CGateway(Long id) {this.id=id;}
	public CGateway(String eui) {this.eui=eui;}
	
	public Boolean getActive() {
		return active;
	}
	
	public Boolean isActive() {
		return getActive();
	}
	public void setActive(Boolean active) {
		this.active = active;
	}
	
	public String getFwVersion() {
		return fwVersion;
	}

	public void setFwVersion(String fwVersion) {
		this.fwVersion = fwVersion;
	}

	public String getHwVersion() {
		return hwVersion;
	}

	public void setHwVersion(String hwVersion) {
		this.hwVersion = hwVersion;
	}

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public Long getMaxHeartBeatInterval() {
		return maxHeartBeatInterval;
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

	public void setMaxHeartBeatInterval(Long maxHeartBeatInterval) {
		this.maxHeartBeatInterval = maxHeartBeatInterval;
	}

	public Long getMeasurementInterval() {
		return measurementInterval;
	}

	public void setMeasurementInterval(Long measurementInterval) {
		this.measurementInterval = measurementInterval;
	}

	public String getRadioFwVersion() {
		return radioFwVersion;
	}

	public void setRadioFwVersion(String radioFwVersion) {
		this.radioFwVersion = radioFwVersion;
	}

	public Long getWakeupInterval() {
		return wakeupInterval;
	}

	public void setWakeupInterval(Long wakeupInterval) {
		this.wakeupInterval = wakeupInterval;
	}
	
	public Set getWsms() { return wsms; }
    public void setWsms(Set wsms) { this.wsms=wsms; }
    

    public CAccount getAccount() {
		return account;
	}
	public void setAccount(CAccount account) {
		this.account = account;
	}
	// The following is used for associating two objects that maybe coming from different sessions
    // and/or need to be differentiated in a set.
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof CGateway)) return false;
        final CGateway gw = (CGateway) other;
        if (this.eui != null)
        	return this.eui.equals(gw.getEui());
        if(this.id != null)
        	return this.id.equals(gw.getId());
        return false;
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
    
	public void addWsm(CWirelessSensorModule wsm) {
		if (this.wsms == null) 
			this.wsms = new HashSet();
		this.wsms.add(wsm);
		if (wsm!=null) 
			wsm.setGateway(this);
			
	}
}
