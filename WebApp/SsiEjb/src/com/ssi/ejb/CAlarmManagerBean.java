package com.ssi.ejb;


import java.util.*;
import java.sql.Timestamp;
import java.rmi.RemoteException;


import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import javax.ejb.CreateException;


import org.hibernate.LockMode;
import org.hibernate.Session;


import org.apache.log4j.Logger;

import com.ssi.persistence.*;
import com.ssi.persistence.util.*;
import com.ssi.bean.AlarmHistoryDetails;

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
 * @ejb.bean name="CAlarmManagerBean"
 *           display-name="Name for CAlarmManagerBean"
 *           description="Description for CAlarmManagerBean"
 *           jndi-name="ejb/CAlarmManagerBean"
 *           type="Stateless"
 *           view-type="remote"
 */
/**
 * @author AAO
 *
 */

public class CAlarmManagerBean implements SessionBean {
	/** The session context */
	private SessionContext context;
	static Logger LOG = Logger.getLogger(CAlarmManagerBean.class.getName());
	public CAlarmManagerBean() {
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
	 * An example business method event code =40
	 *
	 * @ejb.interface-method view-type = "remote"
	 * 
	 * @throws EJBException Thrown if method fails due to system-level error.
	 */
		private List GetAlarmDefByMeasurement(Session hsession, CMeasurement m){
		return( hsession.createQuery(
	    "from CAlarmDefinition ad where ad.measurement = :measurement")
	    .setEntity("measurement", m).list());
	}
	
	public IPersistenceObject GetAlarmDefinition(Long measurId)throws EJBException, CAlarmManagerException
	{
		LOG.info("CAlarmManagerBean method: GetAlarmDefinition");
		Session hsession = null;
		CAlarmDefinition aDef= null;
		List aDefs = null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			CMeasurement m = new CMeasurement(measurId);
			aDefs = GetAlarmDefByMeasurement(hsession, m);
			
			if (aDefs==null || aDefs.size()==0){
				LOG.debug("Alarm is not found for measurement.id="+measurId);
				return null;
			}
			aDef = (CAlarmDefinition)aDefs.get(0);
		}
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "GetAlarmDefinition");
			   throw new CAlarmManagerException("Unexpected exception in CAlarmManagerBean (Naming or Hibernate or?)",e);
			}//catch
			finally {
				LOG.debug("About to exit from GetAlarmDefinition");
			}
		return aDef;	
	}
	public IPersistenceObject UpdateOrInsertAlarmDefinition(CAlarmDefinition aDef, Long measurId)throws EJBException, CAlarmManagerException
	{
		LOG.info("CAlarmManagerBean method: UpdateOrInsertAlarmDefinition");
		Session hsession = null;
		CAlarmDefinition aDef1;
		CMeasurement m=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			if (aDef.getId()==null){
				LOG.debug(" AlarmDefinition is not found ");
				m=(CMeasurement) hsession.get(CMeasurement.class, measurId, LockMode.UPGRADE_NOWAIT);
				aDef.setMeasurement(m);
				m.addAlarmDefinition(aDef);
				aDef1 = aDef;
			}
			else {
				LOG.debug("AlarmDefinition is found ");
				aDef1=(CAlarmDefinition) hsession.get(CAlarmDefinition.class,aDef.getId(),LockMode.UPGRADE_NOWAIT);
				aDef1.setDescription(aDef.getDescription());
				aDef1.setName(aDef.getName());
				aDef1.setNotes(aDef.getNotes());
				aDef1.setMessage(aDef.getMessage());
				aDef1.setNotifyList(aDef.getNotifyList());
				aDef1.setOperand1(aDef.getOperand1());
				aDef1.setOperand2(aDef.getOperand2());
				aDef1.setOperator1(aDef.getOperator1());
				aDef1.setOperator2(aDef.getOperator2());
				aDef1.setFilterLimit(aDef.getFilterLimit());
				aDef1.setFilterLength(aDef.getFilterLength());
				aDef1.setEnabled(aDef.getEnabled());
				aDef1.setConnector(aDef.getConnector());
				aDef1.setVoiceNotified(aDef.getVoiceNotified());
				aDef1.setVoiceNotifyList(aDef.getVoiceNotifyList());
			}
		}
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "UpdateOrInsertAlarmDefinition");
			throw e;
		}//catch
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "UpdateOrInsertAlarmDefinition");
			throw new CAlarmManagerException("Unexpected exception in CAlarmManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from UpdateOrInsertAlarmDefinition");
		}
		return aDef1;
	}
	public void PutAlarmsInHistory(List idList) throws EJBException, CAlarmManagerException {
		LOG.info("CAlarmManagerBean method: PutAlarmsInHistory");
		Session hsession = null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			Iterator iter = idList.iterator();
			while (iter.hasNext()) {
				LOG.debug("CAlarmManagerBean method: in measurement list while");
				CMeasurement m = (CMeasurement) hsession.get(CMeasurement.class, (Long)iter.next() ,LockMode.NONE);
				Set aDefs = m.getAlarmDefinitions();
				
				if (aDefs != null && aDefs.size()>0) {
					LOG.debug("CAlarmManagerBean method: found alarm definition");
					Iterator sIter = aDefs.iterator();
					CAlarmDefinition aDef = (CAlarmDefinition) sIter.next();
					Set alarms = aDef.getAlarms();
					if (alarms != null && alarms.size()>0) {
						LOG.debug("CAlarmManagerBean method: found alarm");
						sIter = alarms.iterator();
						CAlarm alarm = (CAlarm) sIter.next();
						// Create an alarm history record in the alarm history table
						CAlarmHistory aHist = new CAlarmHistory();
						aHist.setTs(alarm.getTs());
						aHist.setValue(alarm.getValue());
						aHist.setDefinition(aDef);
						hsession.save(aHist);
						// Delete alarm from alarms table
						aDef.deleteAlarm(alarm);
						hsession.delete(alarm);
					} //if
				} //if
			} //while
		} //try
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "PutAlarmsInHistory");
			 throw e;
		}//catch
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "PutAlarmsInHistory");
			throw new CAlarmManagerException("Unexpected exception in CAlarmManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from PutAlarmsInHistory");
		}
	}
	
	public AlarmHistoryDetails GetAlarmHistory(Long gwId, Timestamp first, Timestamp last, int from, int count) throws EJBException, CAlarmManagerException {
		LOG.info("CAlarmManagerBean method: GetAlarmHistory");
		Session hsession = null;
		List subList=null;
		int maxAlarmCount=0;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			//"select new com.ssi.persistence.HistoryRow(aDef.name, wsm.name, m.name, m.unit, ah.value, ah.ts) from CAlarmDefinition aDef, CMeasurement m, CWirelessSensorModule wsm,  CAlarmHistory ah where ah.definition.measurement.wsm.gateway = :gateway")
			CGateway gw= new CGateway(gwId);
			
			/* maxAlarmCount = (Integer ) hsession.createQuery(
			"select count(*) from CAlarmHistory ah join ah.definition aDef join aDef.measurement m join m.wsm wsm where wsm.gateway = :gateway and ah.ts < :last  and ah.ts >= :first " )
		    .setTimestamp("first", first)
		    .setTimestamp("last", last)
		    .setEntity("gateway", gw).uniqueResult()  ;
			*/
			
			
			List alarmList = hsession.createQuery(
			"select new com.ssi.bean.HistoryRow(aDef.name, wsm.name, m.name, m.unit, ah.value, ah.ts, m.coeff1, m.coeff2, m.coeff3, m.coeff4) from CAlarmHistory ah join ah.definition aDef join aDef.measurement m join m.wsm wsm where wsm.gateway = :gateway and ah.ts < :last  and ah.ts >= :first order by ah.ts desc")
		    .setTimestamp("first", first)
		    .setTimestamp("last", last)
		    .setEntity("gateway", gw).list();
			//.setFirstResult(from)
		    //.setMaxResults(count)
			maxAlarmCount = alarmList.size();
			int tot = from+count;
			subList = alarmList.subList(from, (tot < maxAlarmCount ? tot : maxAlarmCount) );
			
		} //try
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "GetAlarmHistory");
			throw new CAlarmManagerException("Unexpected exception in CAlarmManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetAlarmHistory");
		}
		return new AlarmHistoryDetails(subList, Integer.valueOf(maxAlarmCount));
	}
}



