package com.ssi.persistence;

import java.sql.Timestamp;

public class CUserEvent implements IPersistenceObject {
	/**
	 * AAO
	 */
	private static final long serialVersionUID = 3231884855815252893L;
	private Long id;
	private Integer eventCode;
    private Boolean active;
	private Timestamp ts;
	private Timestamp updateTs;

	private CGateway gateway; // many to one
	private CWirelessSensorModule wsm; // many to one
	
	public CUserEvent() {}
	
	public Integer getEventCode() {
		return eventCode;
	}
	public void setEventCode(Integer eventCode) {
		this.eventCode = eventCode;
	}
	public CGateway getGateway() {
		return gateway;
	}
	public void setGateway(CGateway gateway) {
		this.gateway = gateway;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Timestamp getTs() {
		return ts;
	}
	public void setTs(Timestamp ts) {
		this.ts = ts;
	}
	public CWirelessSensorModule getWsm() {
		return wsm;
	}
	public void setWsm(CWirelessSensorModule wsm) {
		this.wsm = wsm;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Timestamp getUpdateTs() {
		return updateTs;
	}

	public void setUpdateTs(Timestamp updateTs) {
		this.updateTs = updateTs;
	}
    
}
