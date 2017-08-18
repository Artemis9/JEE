package com.ssi.ejb;
import javax.ejb.EJBException;

import com.ssi.bean.AccountSummary;
import com.ssi.persistence.*;

/**
 * @author AAO
 *
 */
public interface IAccountManagerLocal extends javax.ejb.EJBLocalObject {
	public IPersistenceObject GetAccountInfo(Long id) throws EJBException, CAccountManagerException;
	public AccountSummary GetGatewayAccount (String mac, String name, String password) throws EJBException, CAccountManagerException;
	public void UpdateAccountInfo(AccountSummary as1, AccountSummary as2, String uname1, String uname2, String pw1, String pw2)
				throws EJBException, CAccountManagerException;
}
