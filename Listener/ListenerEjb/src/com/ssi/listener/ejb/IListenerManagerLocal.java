package com.ssi.listener.ejb;

import java.util.List;

import com.ssi.persistence.*;

import javax.ejb.EJBException;

public interface IListenerManagerLocal extends javax.ejb.EJBLocalObject {	
	public CGateway PowerOnGateway(CGateway gw, Integer reason) throws EJBException, CListenerManagerException;
	public CGateway HeartbeatGateway(CGateway gw, Integer reason) throws EJBException, CListenerManagerException;
	public CGateway ConfigureWsm(CGateway gw, CWirelessSensorModule wsm, CWsmType wsmType, Integer reason) throws EJBException, CListenerManagerException;
	public CGateway LogSensorData(CGateway gw, CWirelessSensorModule wsm, String wsmData, Long time, Integer reason, String wsmLqi) throws EJBException, CListenerManagerException;
	public List GetUserEvent(CGateway gw) throws EJBException, CListenerManagerException;
}
