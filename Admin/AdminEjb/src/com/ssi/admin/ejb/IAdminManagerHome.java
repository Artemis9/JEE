package com.ssi.admin.ejb;

import javax.ejb.EJBException;
import javax.ejb.CreateException;

public interface IAdminManagerHome extends javax.ejb.EJBLocalHome {
	public IAdminManagerLocal create() throws EJBException, CreateException;
}