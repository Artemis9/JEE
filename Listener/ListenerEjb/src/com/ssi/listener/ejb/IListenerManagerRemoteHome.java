package com.ssi.listener.ejb;

import java.rmi.RemoteException;
import javax.ejb.CreateException;

public interface IListenerManagerRemoteHome extends javax.ejb.EJBHome {
	public IListenerManagerRemote create() throws RemoteException, CreateException;
 
}
