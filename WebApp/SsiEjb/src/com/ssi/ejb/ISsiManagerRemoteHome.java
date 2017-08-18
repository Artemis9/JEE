package com.ssi.ejb;

import java.rmi.RemoteException;
import javax.ejb.CreateException;

public interface ISsiManagerRemoteHome extends javax.ejb.EJBHome {
	public ISsiManagerRemote create() throws RemoteException, CreateException;
}

