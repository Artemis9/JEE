package com.ssi.ejb;

import java.rmi.RemoteException;

import com.ssi.bean.AccountSummary;
import com.ssi.persistence.IPersistenceObject;

/**
 * @author AAO
 *
 */
public interface IAccountManagerRemote extends javax.ejb.EJBObject {
	public IPersistenceObject GetAccountInfo(Long id) throws RemoteException, CAccountManagerException;
	public AccountSummary GetGatewayAccount (String mac, String name, String password) throws RemoteException, CAccountManagerException;
	public void UpdateAccountInfo(AccountSummary as1, AccountSummary as2, String uname1, String uname2, String pw1, String pw2)
		throws RemoteException, CAccountManagerException;
}
