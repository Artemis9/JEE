package com.ssi.listener.ejb;

import javax.ejb.EJBException;
import javax.ejb.CreateException;

public interface IListenerManagerHome extends javax.ejb.EJBLocalHome {
	public IListenerManagerLocal create() throws EJBException, CreateException;
 
}
