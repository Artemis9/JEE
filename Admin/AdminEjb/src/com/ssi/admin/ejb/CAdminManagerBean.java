package com.ssi.admin.ejb;

import java.rmi.RemoteException;

import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import org.apache.log4j.Logger;
import org.hibernate.LockMode;
import org.hibernate.Session;

import com.ssi.common.IUserCommands;
import com.ssi.common.IRequestCodes;
import com.ssi.persistence.*;
import com.ssi.admin.bean.*;
import com.ssi.common.IApplicationConstants;
import com.ssi.persistence.util.*;
import com.ssi.util.CSecurityUtil;
import com.ssi.util.CDateUtil;

import java.util.*;
//import javax.sql.DataSource;
//import java.sql.*;
/**
 * XDoclet-based session bean.  The class must be declared
 * public according to the EJB specification.
 *
 * To generate the EJB related files to this EJB:
 *		- Add Standard EJB module to XDoclet project properties
 *		- Customize XDoclet configuration for your appserver
 *		- Run XDoclet
 *
 * Below are the xdoclet-related tags needed for this EJB.
 * 
 * @ejb.bean name="CAdminManagerBean"
 *           display-name="Name for CAdminManagerBean"
 *           description="Description for CAdminManagerBean"
 *           jndi-name="ejb/CAdminManagerBean"
 *           type="Stateless"
 *           view-type="local"
 */
public class CAdminManagerBean implements SessionBean {

	/** The session context */
	private SessionContext context;
	static Logger LOG = Logger.getLogger(CAdminManagerBean.class.getName());
	public CAdminManagerBean() {
		super(); 
		// TODO Auto-generated constructor stub
	}

	/**
	 * Set the associated session context. The container calls this method 
	 * after the instance creation.
	 * 
	 * The enterprise bean instance should store the reference to the context 
	 * object in an instance variable.
	 * 
	 * This method is called with no transaction context. 
	 * 
	 * @throws EJBException Thrown if method fails due to system-level error.
	 */
	public void setSessionContext(SessionContext newContext)
		throws EJBException {
		context = newContext;
	}

	public void ejbRemove() throws EJBException, RemoteException {
		// TODO Auto-generated method stub

	}

	public void ejbActivate() throws EJBException, RemoteException {
		// TODO Auto-generated method stub

	}

	public void ejbPassivate() throws EJBException, RemoteException {
		// TODO Auto-generated method stub

	}
	/**
	 * An ejbCreate method as required by the EJB specification.
	 * 
	 * The container calls the instance?s <code>ejbCreate</code> method whose
	 * signature matches the signature of the <code>create</code> method invoked
	 * by the client. The input parameters sent from the client are passed to
	 * the <code>ejbCreate</code> method. Each session bean class must have at
	 * least one <code>ejbCreate</code> method. The number and signatures
	 * of a session bean?s <code>create</code> methods are specific to each 
	 * session bean class.
	 * 
	 * @throws CreateException Thrown if method fails due to system-level error.
	 * 
	 * @ejb.create-method
	 * 
	 */
	public void ejbCreate() throws CreateException {
		// TODO Add ejbCreate method implementation
	}
	/**
	 * An example business method
	 *
	 * @ejb.interface-method view-type = "remote"
	 * 
	 * @throws EJBException Thrown if method fails due to system-level error.
	 */
	public void replaceWithRealBusinessMethod() throws EJBException {
		// rename and start putting your business logic here
	}

	
	public List GetGateways() throws EJBException, CAdminManagerException  {
		LOG.info("CAdminManagerBean method: GetGateways");
		Session hsession = null;
		List gws=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			gws = hsession.createQuery("from CGateway where id <> -1").list();
		}
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetGateways");
		   throw new CAdminManagerException("Unexpected exception in CAdminManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetGateways");
		}
		return gws;
	}
	
	public IAdminObject GetGatewayInfo(Long id) throws EJBException, CAdminManagerException  {
		LOG.info("CAdminManagerBean method: GetGatewayInfo");
		Session hsession = null;
		CGateway gw= null; 
		CListenerEvent leLast = null;
		CListenerEvent leFirst = null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			gw =getGatewayPods(hsession, id);
			Set contacts = gw.getAccount().getContacts();
			Iterator iter = contacts.iterator();
			while (iter.hasNext()){
				CContact c = (CContact) iter.next();
				Set roles = c.getRoles();
				Iterator iter1 = roles.iterator();
				while (iter1.hasNext()) {
					CRole role = (CRole) iter1.next();
				}
			}			
		 leLast = (CListenerEvent) hsession.createQuery("from CListenerEvent le where le.gateway = :gw and le.ts = (select max(ts) from le where le.gateway = :gw )").setEntity("gw", gw).uniqueResult();
		 leFirst = (CListenerEvent) hsession.createQuery("from CListenerEvent le where le.gateway = :gw and le.ts = (select min(ts) from le where le.gateway = :gw )").setEntity("gw", gw).uniqueResult();
		}
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetGatewayInfo");
		   throw new CAdminManagerException("Unexpected exception in CAdminManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetGatewayInfo");
		}
		return new CGatewaySummary(gw, leFirst, leLast);
	}
	
	public IPersistenceObject UpdateAdminInfo(Long gwId, CAccount acc, CRole r1, CRole r2) throws EJBException, CAdminManagerException  {
		LOG.info("CAdminManagerBean method: UpdateAdminInfo");
		Session hsession = null;
		CGateway gw=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			CAccount account =(CAccount) hsession.get(CAccount.class, acc.getId() ,LockMode.UPGRADE);
			account.setServiceLevel(acc.getServiceLevel());
			CRole role1 = (CRole) hsession.get(CRole.class, r1.getId() ,LockMode.UPGRADE);
			if (r1.getPw() != null && r1.getPw().length()!=0 ) {
				role1.setPw(CSecurityUtil.encrypt(r1.getPw()));
			}
			CRole role2 = (CRole) hsession.get(CRole.class, r2.getId() ,LockMode.UPGRADE);
			if (r2.getPw() != null && r2.getPw().length()!=0 ) {
				role2.setPw(CSecurityUtil.encrypt(r2.getPw()));
			}
			gw =getGatewayPods(hsession, gwId);
		}
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "UpdateAdminInfo");
			throw e;
		}//catch
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "UpdateAdminInfo");
		   throw new CAdminManagerException("Unexpected exception in CAdminManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from UpdateAdminInfo");
		}
		return(gw);
	}
	/*
	public void DeletePod(Long podId) throws EJBException, CAdminManagerException{
		LOG.info("CAdminManagerBean method: DeletePod");
		try {
			//	Create a Hibernate session
			Connection conn = CPersistenceUtil.getJDBCConnection();
			Statement stmt = conn.createStatement();
            String strSql = "delete from alarm where alarm_definition_id in "+
            "(select ad.id from alarm_definition ad, measurement m where ad.measurement_id = m.id and m.wsm_id="+podId.toString()+")";
            stmt.executeUpdate(strSql); 
            int count = stmt.getUpdateCount();
            LOG.info("Deleted alarm count="+count);
            
            strSql = "delete from alarm_history where alarm_definition_id in "+
            "(select ad.id from alarm_definition ad, measurement m where ad.measurement_id = m.id and m.wsm_id="+podId.toString()+")";
            stmt.executeUpdate(strSql); 
            count = stmt.getUpdateCount();           
            LOG.info("Deleted alarm_history count="+count);
            
            strSql = "delete from alarm_definition where id in "+
            "(select ad.id from alarm_definition ad, measurement m where ad.measurement_id = m.id and m.wsm_id="+podId.toString()+")";
            stmt.executeUpdate(strSql); 
            count = stmt.getUpdateCount();
            LOG.info("Deleted alarm definition count="+count);
            
            strSql = "delete from sensor_data where listener_event_id in "+
            "(select le.id from listener_event le where le.event_code = 10 and le.wsm_id="+podId.toString()+")";
            stmt.executeUpdate(strSql); 
            count = stmt.getUpdateCount();
            LOG.info("Deleted sensor_data count="+count);
            
            strSql = "delete from listener_event where wsm_id="+podId.toString();
            stmt.executeUpdate(strSql);
            count = stmt.getUpdateCount();
            LOG.info("Deleted listener_event object count="+count);
            
            strSql = "delete from measurement where wsm_id="+podId.toString();
            stmt.executeUpdate(strSql);
            count = stmt.getUpdateCount();
            LOG.info("Deleted measurement object count="+count);
            
           // strSql = "delete from wireless_sensor_module where id="+podId.toString();
            strSql = "update wireless_sensor_module set gateway_id ="+"-1"+" where id="+podId.toString();
            stmt.executeUpdate(strSql);
            count = stmt.getUpdateCount();
            LOG.info("Updated to be Deleted wsm object count="+count);
            //conn.commit();
            conn.close();
		}
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "DeletePod");
		   throw new CAdminManagerException("Unexpected exception in CAdminManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from DeletePod");
		}
	}
	*/
	public void DeletePod(Long podId) throws EJBException, CAdminManagerException{
		LOG.info("CAdminManagerBean method: DeletePod");
		Session hsession = null;
		try {
			//Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			CWirelessSensorModule wsm =(CWirelessSensorModule) hsession.get(CWirelessSensorModule.class, podId ,LockMode.UPGRADE);
			CGateway gw_parent = wsm.getGateway();
			
			CGateway gw_deleted = (CGateway) hsession.get(CGateway.class, Long.valueOf((long)IApplicationConstants.DELETED_OBJECT_KEY) ,LockMode.UPGRADE);
			wsm.setActive(Boolean.FALSE);
			wsm.setEui(wsm.getEui() + "-"+ CDateUtil.getCurrentDSTms());
			wsm.setGateway(gw_deleted);

			CUserEvent ue = CPersistenceUtil.LogUserEvent(hsession, Integer.valueOf(IUserCommands.DELETED_POD), gw_parent, wsm);
	
		}
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "DeletePod");
			throw e;
		}//catch
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "DeletePod");
		   throw new CAdminManagerException("Unexpected exception in CAdminManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from DeletePod");
		}
	}
	
	
	
	public IPersistenceObject GetGatewayPods(Long id) throws EJBException, CAdminManagerException {
		LOG.info("CAdminManagerBean method: GetGatewayPods");
		Session hsession = null;
		CGateway gw=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			gw = getGatewayPods(hsession, id);
		}
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetGatewayPods");
		   throw new CAdminManagerException("Unexpected exception in CAdminManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetGatewayPods");
		}
		return(gw);
	}
	private CGateway getGatewayPods(Session hsession, Long id) throws Exception {
		CGateway gw =(CGateway) hsession.get(CGateway.class, id ,LockMode.NONE);
		Set wsms = gw.getWsms();
		 //String str;
		 Iterator iter = wsms.iterator();
		 CWirelessSensorModule wsm;
		 // the Following is to avoid LazyInitiationException
		 while (iter.hasNext()) {
			  wsm= (CWirelessSensorModule) iter.next();
		 }
		 return gw;
	}
	
	public IPersistenceObject MarkGwPodDeleted(Long gwId, Long wsmId) throws EJBException, CAdminManagerException {
		LOG.info("CAdminManagerBean method: MarkGwPodDeleted");
		Session hsession = null;
		CUserEvent ue=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			CGateway gw = new CGateway(gwId);
			CWirelessSensorModule wsm = new CWirelessSensorModule(wsmId);
			ue= CPersistenceUtil.LogUserEvent(hsession, Integer.valueOf(IUserCommands.DELETED_POD), gw, wsm);
		}
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "MarkGwPodDeleted");
			throw e;
		}//catch
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "MarkGwPodDeleted");
		   throw new CAdminManagerException("Unexpected exception in CAdminManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from MarkGwPodDeleted");
		}
		return(ue);
	}
	
	public List GetLqiHistory(Long wsmId, Long tzo) throws EJBException, CAdminManagerException {
		LOG.info("CAdminManagerBean method: getLQI");
		Session hsession = null;
		List results = null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			String sqlStr = "select wdat.value as {wdat.value}, le.timestamp as {wdat.ts}, le.gw_timestamp as {wdat.gwTs}, wdat.id as {wdat.id}, "+ tzo.toString()+
			" as {wdat.tzo} from wsm_data wdat, " + 
			"(select id, timestamp, gw_timestamp from listener_event le0 where event_code=" + IRequestCodes.UPDATE_SENSOR_DATA +
			" and wsm_id=" + wsmId.toString()+
			" order by le0.timestamp desc limit " + Integer.valueOf(2000) + 
			") le where  wdat.listener_event_id=le.id order by le.timestamp desc";
			results = (hsession.createSQLQuery(sqlStr).addEntity("wdat", WsmData.class).list());

		}//catch
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetLqiHistory");
		   throw new CAdminManagerException("Unexpected exception in CAdminManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetLqiHistory");
		}
		return results;
	}
}
