package com.ssi.admin.bean;
import java.sql.Timestamp;
import java.util.Set;

import com.ssi.persistence.CAccount;
import com.ssi.persistence.CGateway;
import com.ssi.persistence.CListenerEvent;

public class CGatewaySummary implements IAdminObject {
	

	private static final long serialVersionUID = 7951109888177727485L;
	private CGateway gw;
	private CListenerEvent lastEvent;
	private CListenerEvent firstEvent;
	
	public CGatewaySummary(CGateway gw, CListenerEvent leFirst, CListenerEvent leLast) {
		this.gw = gw;
		this.lastEvent = leLast;
		this.firstEvent = leFirst;
	}
	public Long getId() {
		return gw.getId();
	}
    
	public void setId (Long id) {
		this.gw.setId(id);
	}
	
	public String getEui() {
		return this.gw.getEui();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CListenerEvent#getEventCode()
	 */
	public Integer getFirstEventCode() {
		return firstEvent.getEventCode();
	}

	

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CListenerEvent#getTs()
	 */
	public Timestamp getFirstTs() {
		return firstEvent.getTs();
	}



	/* (non-Javadoc)
	 * @see com.ssi.persistence.CGateway#getFwVersion()
	 */
	public String getFwVersion() {
		return gw.getFwVersion();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CGateway#getHwVersion()
	 */
	public String getHwVersion() {
		return gw.getHwVersion();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CGateway#getMac()
	 */
	public String getMac() {
		return gw.getMac();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CGateway#getMaxHeartBeatInterval()
	 */
	public Long getMaxHeartBeatInterval() {
		return gw.getMaxHeartBeatInterval();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CGateway#getMeasurementInterval()
	 */
	public Long getMeasurementInterval() {
		return gw.getMeasurementInterval();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CGateway#getName()
	 */
	public String getName() {
		return gw.getName();
	}


	/* (non-Javadoc)
	 * @see com.ssi.persistence.CGateway#getRadioFwVersion()
	 */
	public String getRadioFwVersion() {
		return gw.getRadioFwVersion();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CGateway#getWakeupInterval()
	 */
	public Long getWakeupInterval() {
		return gw.getWakeupInterval();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CListenerEvent#getEventCode()
	 */
	public Integer getLastEventCode() {
		return lastEvent.getEventCode();
	}

	/* (non-Javadoc)
	 * @see com.ssi.persistence.CListenerEvent#getTs()
	 */
	public Timestamp getLastTs() {
		return lastEvent.getTs();
	}
	public CAccount getAccount() {
		return gw.getAccount();
	}
	public void setAccount(CAccount arg0) {
		gw.setAccount(arg0);
	}
	public CListenerEvent getFirstEvent() {
		return firstEvent;
	}
	public void setFirstEvent(CListenerEvent firstEvent) {
		this.firstEvent = firstEvent;
	}
	public CListenerEvent getLastEvent() {
		return lastEvent;
	}
	public void setLastEvent(CListenerEvent lastEvent) {
		this.lastEvent = lastEvent;
	}
	public Set getWsms() {
		return gw.getWsms();
	}
	
}
