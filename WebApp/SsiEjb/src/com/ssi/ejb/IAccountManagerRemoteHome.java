package com.ssi.ejb;

import java.rmi.RemoteException;
import javax.ejb.CreateException;

public interface IAccountManagerRemoteHome extends javax.ejb.EJBHome {
	public IAccountManagerRemote create() throws RemoteException, CreateException;
}