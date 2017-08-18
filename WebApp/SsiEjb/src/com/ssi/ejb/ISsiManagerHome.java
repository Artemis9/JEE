package com.ssi.ejb;

import javax.ejb.EJBException;
import javax.ejb.CreateException;

public interface ISsiManagerHome extends javax.ejb.EJBLocalHome {
	public ISsiManagerLocal create() throws EJBException, CreateException;
}
