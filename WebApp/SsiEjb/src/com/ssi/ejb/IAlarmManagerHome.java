package com.ssi.ejb;

import javax.ejb.CreateException;
import javax.ejb.EJBException;

public interface IAlarmManagerHome extends javax.ejb.EJBLocalHome {
	public IAlarmManagerLocal create() throws EJBException, CreateException;
}
