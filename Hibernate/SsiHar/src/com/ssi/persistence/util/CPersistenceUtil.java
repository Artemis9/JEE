package com.ssi.persistence.util;

import java.util.*; 

import javax.naming.*; 

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.ssi.common.IJNDINames;
import com.ssi.persistence.CGateway;
import com.ssi.persistence.CUserEvent;
import com.ssi.persistence.CMeasurement;
import com.ssi.persistence.CWirelessSensorModule;
import com.ssi.util.CDateUtil;


import java.sql.*;

import javax.sql.DataSource;

public class CPersistenceUtil {
	static Logger LOG = Logger.getLogger(CPersistenceUtil.class.getName());
	//	 throws HibernateException which is a RuntimeException
	public static CGateway getGatewayByEui(Session hsession, String strEui) {
		LOG.info("In getGatewayByEui strEui="+strEui);
		CGateway gw = (CGateway) hsession.createQuery(
	    "from CGateway as gw where gw.active = 'T' and gw.eui = ?")
	    .setString(0, strEui)
	    .uniqueResult();
		LOG.info("Exiting getGatewayEui, gw="+gw);
		return gw;
	}
	public static Session getHibernateSession() throws Exception {
		InitialContext ctx      = new InitialContext();
		SessionFactory factory  = (SessionFactory) ctx.lookup(IJNDINames.HIBERNATE_SESSION_FACTORY);
		return (factory.getCurrentSession());
	}
	
	public static void printSQLException(Exception e, String methodName) {
		LOG.error("Exception in ejb method "+methodName, e);
	   //e.printStackTrace();
	   if (e instanceof java.sql.SQLException){
		    Exception e2= ((java.sql.SQLException) e).getNextException(); 
	        if (e2!=null) { 
	        	LOG.error("SQLException in CSsiManagerBean method ");
	        	e2.printStackTrace();
	         }//if
	   }//if
	}
	public static void printException(Exception e, String methodName) {
		LOG.error("Exception in ejb method "+methodName, e);
	    e.printStackTrace();  
	}
	public static List getEnabledAlarmDefinition(Session hsession, CMeasurement m){
		return( hsession.createQuery(
	    "from CAlarmDefinition ad where ad.measurement = :measurement and ad.enabled = 'T' ")
	    .setEntity("measurement", m).list());
	}

	public static Connection getJDBCConnection() throws Exception
	{
		Connection conn = null;
		try {
		    InitialContext ic = new InitialContext();
		    DataSource ds = (DataSource) ic.lookup ("java:/PostgresDS");    
		    conn = ds.getConnection();
		    ic.close();
		} catch (Exception e) {
        	LOG.error ("JDBC connection exception");
        	throw e;
        }
	    return conn;
	}
//	 throws HibernateException which is a RuntimeException
	public static CUserEvent LogUserEvent(Session hsession, Integer eventCode, CGateway gw, CWirelessSensorModule wsm)
	{   
		CUserEvent event = new CUserEvent();
		event.setEventCode(eventCode);
		event.setGateway(gw);
		event.setWsm(wsm);
		event.setTs(CDateUtil.getCurrentDST());
		event.setActive(Boolean.valueOf(true));
		hsession.save(event);
		LOG.debug("Exiting LogUserEvent(...) event_id="+event.getId());
		return event;
	}
}
