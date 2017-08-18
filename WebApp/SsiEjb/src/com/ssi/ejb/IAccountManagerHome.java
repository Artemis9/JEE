package com.ssi.ejb;

import javax.ejb.EJBException;
import javax.ejb.CreateException;

public interface IAccountManagerHome extends javax.ejb.EJBLocalHome {
	public IAccountManagerLocal create() throws EJBException, CreateException;
}
