package com.ssi.ejb;

import java.rmi.RemoteException;
import javax.ejb.CreateException;

/**
 * @author AAO
 *
 */
public interface IAlarmManagerRemoteHome extends javax.ejb.EJBHome {
	
	public IAlarmManagerRemote create() throws RemoteException, CreateException;
}
