package com.ssi.listener.ejb;

import com.ssi.persistence.*;

import java.rmi.RemoteException;
import java.util.List;

public interface IListenerManagerRemote extends javax.ejb.EJBObject {
	
	public CGateway PowerOnGateway(CGateway gw, Integer reason) throws RemoteException, CListenerManagerException;
	public CGateway HeartbeatGateway(CGateway gw, Integer reason) throws RemoteException, CListenerManagerException;
	public CGateway ConfigureWsm(CGateway gw, CWirelessSensorModule wsm, CWsmType wsmType, Integer reason) throws RemoteException, CListenerManagerException;
	public CGateway LogSensorData(CGateway gw, CWirelessSensorModule wsm, String wsmData, Long time, Integer reason, String wsmLqi) throws RemoteException, CListenerManagerException;
	public List GetUserEvent(CGateway gw) throws RemoteException, CListenerManagerException;
}
