package com.ssi.ejb;

import java.util.*;
import java.rmi.RemoteException;
import java.sql.*;

import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import javax.ejb.CreateException;


import org.hibernate.LockMode;
import org.hibernate.Session;


import org.apache.log4j.Logger;

import com.ssi.persistence.*;
import com.ssi.bean.DetailReadings;
import com.ssi.bean.DownloadReadings;
import com.ssi.bean.MeasurementSummary;
import com.ssi.persistence.util.*;
import com.ssi.common.IRequestCodes;
import com.ssi.common.IApplicationConstants;
import com.ssi.common.IWebApplicationConstants;
import com.ssi.exception.*;

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
 * @ejb.bean name="CSsiManagerBean"
 *           display-name="Name for CSsiManagerBean"
 *           description="Description for CSsiManagerBean"
 *           jndi-name="ejb/CSsiManagerBean"
 *           type="Stateless"
 *           view-type="remote"
 */
/**
 * @author AAO
 *
 */

public class CSsiManagerBean implements SessionBean {
	/** The session context */
	private SessionContext context;
	static Logger LOG = Logger.getLogger(CSsiManagerBean.class.getName());
	public CSsiManagerBean() {
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
	public IPersistenceObject GetGatewayInfo(Long  id, boolean deep, boolean alarmCheck) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: GetGatewayInfo; id="+id);
		CGateway gw=null;
		Session hsession = null;
		try {
			//	Create a Hibernate session		
			hsession = CPersistenceUtil.getHibernateSession();
			gw =(CGateway) hsession.get(CGateway.class, id ,LockMode.NONE);
			if (gw==null) {
				LOG.error("Gateway object is null(not found)");
				throw new CGatewayNotFoundException();
			}
			LOG.debug("Gateway object is found");
			if (!deep)
				return gw;
			Set wsms = gw.getWsms();
			if (wsms != null && !wsms.isEmpty()){
				Iterator iter = wsms.iterator();
				CWirelessSensorModule wsm;
				do { //wsm loop
					 wsm = (CWirelessSensorModule) iter.next();
					 List measurements = wsm.getMeasurements();
					 if (measurements == null || measurements.isEmpty())
					 {
						 LOG.error("Measurement is not found for wsm.eui="+wsm.getEui()+"wsm.id="+wsm.getId());
						 throw new CMeasurementNotFoundException();
					 }
					 List maxList = getLastWsmDataEvent(hsession, wsm);
					 if (maxList==null || maxList.size()==0){
			    		 LOG.info("!!!!!!!!!!!!Listener Event Data Log is not found for wsm.eui="+wsm.getEui()+"wsm.id="+wsm.getId());
			    	 }
			    	 else {
			    		 CListenerEvent le = (CListenerEvent) maxList.get(0);
			    		 List sds = le.getSensorData();

			    		 //LOG.info("le.id="+le.getId()+" sds.size()="+sds.size()+" measurements.size()="+measurements.size());
			    		 wsm.setLastDataLogTs(le.getGwTs());
			    		 
			    		 if (sds!=null && !sds.isEmpty() && sds.size() == measurements.size()){
							 Iterator iter2=measurements.iterator();
							 Iterator iter3=sds.iterator();
							 CMeasurement measurement=null;
							 CSensorData sd=null;
							 do { //measurement loop
								 measurement= (CMeasurement) iter2.next();
								 sd = (CSensorData) iter3.next();
							     measurement.setLastSensorData(sd);
						    	 // Alarm addition!!!!
						    	 Set aDefs = alarmCheck ? measurement.getAlarmDefinitions() : null;
						    	 if (aDefs != null && !aDefs.isEmpty()){
						    		 LOG.debug("Found alarm definition set for measurement="+measurement.getName());
						    		 Iterator sIter = aDefs.iterator();
						    		 CAlarmDefinition aDef = (CAlarmDefinition) sIter.next();
						    		 LOG.debug("aDef="+aDef);
						    		 // do not check if alarm is enabled or not...; Just pull alarms that have been created and not moved to history table
						    		 //if (aDef.getEnabled().booleanValue()){
					    			 Set alarms = aDef.getAlarms();
					    			 LOG.debug("Found enabled alarm definition for measurement="+measurement.getName());
						    		 if (alarms!=null && !alarms.isEmpty()) {
						    			 sIter = alarms.iterator();
						    			 measurement.setHasAlarm(true);
						    			 //CAlarm alarm = (CAlarm) sIter.next();
						    		 } // if
						    	 } //if  //	Alarm addition!!!!
						    	 else measurement.setHasAlarm(false);
							 } while (iter2.hasNext());	//measurement loop				 
			    		 }//if ( sds!=null && !sds.isEmpty() && ...)
						 else {
							 LOG.error("Listener event sensordata is not found for wsm.eui="+wsm.getEui()+"wsm.id="+wsm.getId());
							 throw new CSensorDataNotFoundException();
						 }
			    	 } // Data Log event was found
				} while (iter.hasNext()); // wsm loop
			}//if (wsms != null && !wsms.isEmpty())
			else {
				LOG.info("!!!!!!!!!!! Wsms is not found for gw.id="+id);
				//throw new CWsmsNotFoundException();
			}	
		} // try
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetGatewayInfo");
		   throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetGatewayInfo");
		}
		return gw;
	}// end GetGatewayInfo
	
	private List getLastWsmDataEvent (Session hsession, CWirelessSensorModule wsm){ 
		return( hsession.createQuery(
	    "from CListenerEvent le where le.eventCode= :lc and le.wsm = :wsm and le.gwTs = (select max(gwTs) from le where le.eventCode= :lc and le.wsm = :wsm )")
	    .setEntity("wsm", wsm).setShort("lc", (short)IRequestCodes.UPDATE_SENSOR_DATA)
	    .list());
	}
	
	public IPersistenceObject  UpdateGatewayInfo(CGateway gw) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: UpdateGatewayInfo");
		Session hsession = null;
		CGateway gw2= null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			gw2=(CGateway) hsession.get(CGateway.class,gw.getId(),LockMode.UPGRADE_NOWAIT);
			if (gw2==null){
				LOG.error("Gateway object is null(not found) for gw.id="+gw.getId());
				throw new CGatewayNotFoundException();	
			}
			gw2.setName(gw.getName());
			gw2.setNotes(gw.getNotes());
			gw2.setDescription(gw.getDescription());
			long newMeasurementInterval = gw.getMeasurementInterval().longValue();
			
			//Limit the measurement interval to 20 secs. Wakeup interval is 1/2 of measurement
			//interval unless, measurement interval is greater than 2 hrs, in which case, 
			//wakeup interval is set to the max of 1Hr.
			
			if ( newMeasurementInterval >= IApplicationConstants.MIN_MEASUREMENT_INTERVAL_MS) {
				gw2.setMeasurementInterval(gw.getMeasurementInterval());
				if (newMeasurementInterval <= IApplicationConstants.MAX_WAKEUP_INTERVAL_MS * 2)
					gw2.setWakeupInterval(new Long(newMeasurementInterval / 2) );
				else 
					gw2.setWakeupInterval(new Long (IApplicationConstants.MAX_WAKEUP_INTERVAL_MS));
			}
				
				/* Here call remote EJB metod to update listener data */
			
		}
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "UpdateGatewayInfo");
			throw e;
		}//catch
		catch (Exception e){
			   CPersistenceUtil.printSQLException(e, "UpdateGatewayInfo");
			   throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
			}//catch
		finally {
			LOG.debug("About to exit from UpdateGatewayInfo");
		}
		return gw2;
	}
	
	public IPersistenceObject UpdateWsmInfo(CWirelessSensorModule wsm) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: UpdateWsmInfo");
		Session hsession = null;
		CWirelessSensorModule wsm2= null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			wsm2=(CWirelessSensorModule) hsession.get(CWirelessSensorModule.class,wsm.getId(),LockMode.UPGRADE_NOWAIT);
			if (wsm2==null){
				LOG.error("!!!!!!!!!!! Wsms is not found for wsm.id="+wsm.getId());
				throw new CWsmNotFoundException();
			}
			wsm2.setName(wsm.getName());
			wsm2.setNotes(wsm.getNotes());
			wsm2.setDescription(wsm.getDescription());
		}
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "UpdateWsmInfo");
			throw e;
		}//catch
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "UpdateWsmInfo");
		   throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from UpdateWsmInfo");
		}
		return wsm2;
	}
	public IPersistenceObject GetWsmInfo(Long id) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: GetWsmInfo");
		Session hsession = null;
		CWirelessSensorModule wsm2= null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			wsm2=(CWirelessSensorModule) hsession.get(CWirelessSensorModule.class, id, LockMode.NONE);
			if (wsm2==null){
				LOG.error("!!!!!!!!!!! Wsms is not found for wsm.id="+id);
				throw new CWsmNotFoundException();
			}
			//Get the wsm type for type feching after the session closes...
			CWsmType wsmType = wsm2.getWsmType();
			if (wsmType == null) {
				LOG.error("!!!!!!!!!!! Wsms type is not found for wsm.id="+id);
				throw new CWsmTypeNotFoundException();
			}
			// do not take the following line out!! Otherwise jsf bean will get Hibernate's LazyInitilialization exception
			String defaultName = wsmType.getDefaultName(); 
			
		}
		catch (Exception e){
			   CPersistenceUtil.printSQLException(e, "GetWsmInfo");
			   throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
			}//catch
			finally {
				LOG.debug("About to exit from GetWsmInfo");
			}
			return wsm2;
	}
	public IPersistenceObject UpdateMeasurementInfo(CMeasurement m, Boolean bUserChangeableCoeffs, Boolean bUserChangeableUnit) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: UpdateMeasurementInfo");
		Session hsession = null;
		CMeasurement measurement= null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			measurement=(CMeasurement) hsession.get(m.getClass(),m.getId(),LockMode.UPGRADE_NOWAIT);
			if (measurement==null){
				LOG.error("!!!!!!!!!!! Wsms is not found for measurement.id="+m.getId());
				throw new CMeasurementNotFoundException();
			}
			
			measurement.setName(m.getName());
			measurement.setNotes(m.getNotes());
			//measurement.setDescription(m.getDescription());
			LOG.info("\n in setBean from ejb m.unit= "+m.getUnit());
			if (bUserChangeableCoeffs.booleanValue()) {
				measurement.setCoeff1(m.getCoeff1());
				measurement.setCoeff2(m.getCoeff2());
				measurement.setCoeff3(m.getCoeff3());
				measurement.setCoeff4(m.getCoeff4());
			}
			// If unit has been modified
			if (bUserChangeableUnit.booleanValue() && !measurement.getUnit().contentEquals(m.getUnit())){
				CMeasurementType mt = measurement.getMeasurementType();				
				if (mt.isTemperatureType()) {
					Set mUnits = mt.getMeasurementUnits();
					Iterator iter = mUnits.iterator();
					while(iter.hasNext()) {
						CMeasurementUnit mu = (CMeasurementUnit)iter.next();
						String muName = mu.getName();
						if (muName.contentEquals(m.getUnit())) {
							measurement.setUnit(muName);
							break;
						}//if
					}//while
					
					Set aDefs = measurement.getAlarmDefinitions();
					CAlarmDefinition aDef = null;
					if (aDefs != null && aDefs.size()>0) 
						 aDef = (CAlarmDefinition) aDefs.toArray()[0];
					if (m.hasUnitFahrenheit()) {
						measurement.covertCCoeffsToF();
						LOG.info("\n in min= "+measurement);
						measurement.convertCMinMaxToF();
						if (aDef != null)
							aDef.convertCOperandsToF();
					} 
					else {// coversion was made to Celcius
						measurement.covertFCoeffsToC();
						measurement.convertFMinMaxToC();
						if (aDef != null) 
							aDef.convertFOperandsToC();
					} //else
				} //if temperature type of measurement
				else
					measurement.setUnit(m.getUnit());
			}
			LOG.info("\n in setBean from session measurement.unit= "+measurement.getUnit());
			/*The following are for fetching the type and unit List into the bean before Hibernate session closes.
			CMeasurementType mType = measurement.getMeasurementType();
			if (mType==null){
				LOG.info("!!!!!!!!!!! Measurement type is not found for measurement.id="+measurement.getId());
				throw new CMeasurementTypeNotFoundException();
			}
			Set mUnits = measurement.getMeasurementUnits();
			if (mUnits== null || mUnits.size()==0){
				LOG.info("!!!!!!!!!!! Measurement units are not found for measurement.id="+measurement.getId());
				throw new CMeasurementUnitsNotFoundException();
			}
			*/
		}
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "UpdateMeasurementInfo");
			throw e;
		}//catch
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "UpdateMeasurementInfo");
		    throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from UpdateMeasurementInfo");
		}
		return measurement;
	}
	public IPersistenceObject GetMeasurementInfo(Long id) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: GetMeasurementInfo");
		Session hsession = null;
		CMeasurement measurement= null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			measurement=(CMeasurement) hsession.get(CMeasurement.class,id,LockMode.NONE);
			if (measurement==null){
				LOG.error("!!!!!!!!!!! Measurement is not found for measurement.id="+id);
				throw new CMeasurementNotFoundException();
			}
			// The following are for fetching the type and unit List into the bean before Hibernate session closes.
			CMeasurementType mType = measurement.getMeasurementType();
			if (mType==null){
				LOG.error("!!!!!!!!!!! Measurement type is not found for measurement.id="+id);
				throw new CMeasurementTypeNotFoundException();
			}
			Set mUnits = measurement.getMeasurementUnits();
			if (mUnits== null || mUnits.size()==0){
				LOG.error("!!!!!!!!!!! Measurement units are not found for measurement.id="+id);
				throw new CMeasurementUnitsNotFoundException();
			}
		}
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "GetMeasurementInfo");
			throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetMeasurementInfo");
		}
		return measurement;
	}
	public DetailReadings GetSensorDataInit(CMeasurement measurement, Long wsmId, Timestamp first, Timestamp last) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: GetSensorDataInit first="+first+" last="+last);
		Session hsession = null;
		CMeasurement m=null;
		List sdSample=null;
		Integer total=null;
		CAlarmDefinition aDef=null;
		Timestamp lastTs=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
		
			/* Get the data row count */
			CWirelessSensorModule wsm = new CWirelessSensorModule(wsmId);		
			StringBuffer queryStr= new StringBuffer("select count(*) from CListenerEvent le where le.eventCode = :eCode and le.wsm = :wsm ");
			
			if (first!=null) {
				queryStr.append("and le.gwTs >= :first ");
			}
			if (last!=null) {
				queryStr.append("and le.gwTs <= :last ");
			}
			org.hibernate.Query  q = hsession.createQuery(queryStr.toString())
				.setInteger("eCode", IRequestCodes.UPDATE_SENSOR_DATA)
				.setEntity("wsm", wsm);
			
			if (first != null && last!= null ) {
			    total = (Integer) q.setTimestamp("first", first).setTimestamp("last", last).uniqueResult();
			} else if (first != null && last == null) {
				total = (Integer) q.setTimestamp("first", first).uniqueResult();
			} else if (first == null && last != null) {
				total = (Integer) q.setTimestamp("last", last).uniqueResult();
			} else
				total = (Integer) q.uniqueResult();
			//	Get measurement information
			m=(CMeasurement) hsession.get(CMeasurement.class,measurement.getId(),LockMode.UPGRADE_NOWAIT);
			if (m==null){
				LOG.error("Measurement is not found for measurement.id="+measurement.getId());
				throw new CMeasurementNotFoundException();
			}
			String typeId  = m.getMeasurementType().getTypeId();
		    /* Get the data in a date range */
			sdSample = getSensorDataInTimeRange(hsession, m, wsm, first, last, true);
			LOG.debug("CSsiManagerBean method: sdSample.size="+sdSample.size());
			
			//Get the enabled alarm definition
			List aDefs = CPersistenceUtil.getEnabledAlarmDefinition(hsession, m);
			
			if (aDefs != null && !aDefs.isEmpty()) {
				aDef = (CAlarmDefinition) aDefs.get(0);
			}
			
			//Get the last time new sensore data was added
			lastTs = (Timestamp) hsession.createQuery("select max(le.gwTs) from CListenerEvent le where le.wsm = :wsm and le.eventCode = :eCode)").setEntity("wsm", wsm).setInteger("eCode", IRequestCodes.UPDATE_SENSOR_DATA).uniqueResult();
			// Finally update the measurement Y Axis Min & Max only if it's in manual scaling mode.
			m.setMinMaxAuto(measurement.getMinMaxAuto());
			if (!m.getMinMaxAuto().booleanValue() && m.getUnit().contentEquals(measurement.getUnit())) {
				m.setValueMax(measurement.getValueMax());
				m.setValueMin(measurement.getValueMin());
			}
		}
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "GetSensorDataInit");
			throw e;
		}//catch
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetSensorDataInit");
		   throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetSensorDataInit");
		}
		return new DetailReadings(sdSample, total, m, aDef, lastTs);
	}
	/*
	private List getSensorDataInTimeRange(Session hsession, CMeasurement m, CWirelessSensorModule wsm, Timestamp first, Timestamp last, boolean inclusive) throws Exception {
    	StringBuffer queryStr= new StringBuffer("select new com.ssi.persistence.SensorData(sd.value, le.gwTs) from CSensorData sd join sd.listenerEvent le where le.eventCode = :eCode and le.wsm = :wsm and sd.measurement = :measurement ");
	    if (first!=null) {
	    	queryStr.append("and le.gwTs >= :first ");
		}
	    if (last!=null) {
	    	if (inclusive) queryStr.append("and le.gwTs <= :last ");
	    	else queryStr.append("and le.gwTs < :last ");
		}
	    queryStr.append("order by le.gwTs desc");
	    
	    org.hibernate.Query q = hsession.createQuery(queryStr.toString())
	    	.setMaxResults(IWebApplicationConstants.MAX_FETCH_SIZE)
			.setInteger("eCode", IRequestCodes.UPDATE_SENSOR_DATA)
			.setEntity("wsm", wsm)
			.setEntity("measurement", m);
	    List sdSample=null;
	    if (first != null && last!= null ) {
	    	sdSample =  q.setTimestamp("first", first).setTimestamp("last", last).list();
		} else if (first != null && last == null) {
			sdSample =  q.setTimestamp("first", first).list();
		} else if (first == null && last != null) {
			sdSample =  q.setTimestamp("last", last).list();
		} else
			sdSample = q.list();
	    return sdSample;
    }
*/

    private List getSensorDataInTimeRange(Session hsession, CMeasurement m, CWirelessSensorModule wsm, Timestamp first, Timestamp last, boolean inclusive) throws Exception {
    	LOG.info("getSensorDataInTimeRange first="+first+" last="+last);
    	StringBuffer queryStr = 
    		new StringBuffer("select sd.value as {sd.value}, sub_le.gw_timestamp as {sd.ts}, sd.id as {sd.id} from ("  );
									
    	
    	StringBuffer subQueryStr = 
    		new StringBuffer("select gw_timestamp, id from listener_event le where le.event_code = " + Integer.valueOf(IRequestCodes.UPDATE_SENSOR_DATA).toString() +
							" and le.wsm_id = " + wsm.getId().toString());
			
    	if (first!=null) {
	    	subQueryStr.append(" and le.gw_timestamp >= :first " );
		}
	    if (last!=null) {
	    	if (inclusive) subQueryStr.append(" and le.gw_timestamp <= :last " );
	    	else subQueryStr.append(" and le.gw_timestamp < :last " );
		}
	    
	    
	    subQueryStr.append(" order by le.gw_timestamp desc limit " + Integer.valueOf(IWebApplicationConstants.MAX_FETCH_SIZE).toString());
 
	    queryStr.append(subQueryStr+") as sub_le, sensor_data sd where sd.measurement_id = " + m.getId().toString() +
		" and sd.listener_event_id = sub_le.id ");
	    
	    queryStr.append(" order by sub_le.gw_timestamp desc");
       
    	
    	List sdSample=null;
	    if (first != null && last!= null ) {
	    	sdSample =  hsession.createSQLQuery(queryStr.toString()).addEntity("sd",SensorData.class).setTimestamp("first", first).setTimestamp("last", last).list();
		} else if (first != null && last == null) {
			sdSample =  hsession.createSQLQuery(queryStr.toString()).addEntity("sd",SensorData.class).setTimestamp("first", first).list();
		} else if (first == null && last != null) {
			sdSample =  hsession.createSQLQuery(queryStr.toString()).addEntity("sd",SensorData.class).setTimestamp("last", last).list();
		} else
			sdSample = hsession.createSQLQuery(queryStr.toString()).addEntity("sd",SensorData.class).list();
	    
		LOG.info("getSensorDataInTimeRange sdSample size="+sdSample.size());
	    return sdSample;
    }

/*
	public List GetSensorData(Long mId) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: GetSensorData");
		Session hsession = null;
		List sdList=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			CMeasurement m=(CMeasurement) hsession.get(CMeasurement.class, mId,LockMode.NONE);
			if (m==null){
				LOG.error("Measurement is not found for measurement.id="+mId);
				throw new CMeasurementNotFoundException();
			}
			CWirelessSensorModule wsm = m.getWsm();
			sdList = hsession.createQuery(
			"select new com.ssi.persistence.SensorData(sd.value, le.gwTs) from CSensorData sd join sd.listenerEvent le where le.eventCode = 10 and le.wsm = :wsm and sd.measurement = :measurement order by le.gwTs desc")
		    .setEntity("measurement", m)
		    .setEntity("wsm",wsm)
		    .setMaxResults(IWebApplicationConstants.MAX_FETCH_SIZE).list();

			LOG.debug("CSsiManagerBean method: sdSample.size="+sdList.size());
		} //try
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "GetSensorData");
			throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetSensorData");
		}
		return sdList;
	}
*/	
	public MeasurementSummary GetMeasurementSummary(Long id) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: GetMeasurementSummary");
		Session hsession = null;
		CMeasurement measurement= null;
		Timestamp firstTs, lastTs;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			// Get the measurement 
			measurement=(CMeasurement) hsession.get(CMeasurement.class,id,LockMode.NONE);
			if (measurement==null){
				LOG.error("!!!!!!!!!!! Measurement is not found for measurement.id="+id);
				throw new CMeasurementNotFoundException();
			}
			// Get the parent POD
			CWirelessSensorModule wsm = measurement.getWsm();
			String wsmName = wsm.getName();
			// Get the enabled alarm definition
			/*aDefs = CPersistenceUtil.getEnabledAlarmDefinition(hsession, measurement);
			
			if (aDefs != null && !aDefs.isEmpty()) {
				aDef = (CAlarmDefinition) aDefs.get(0);
			}
			*/
			// Get the last and first sensor data dates.
			 lastTs = (Timestamp) hsession.createQuery("select max(le.gwTs) from CListenerEvent le where le.wsm = :wsm and le.eventCode = :eCode)").setEntity("wsm", wsm).setInteger("eCode", IRequestCodes.UPDATE_SENSOR_DATA).uniqueResult();
			 firstTs = (Timestamp) hsession.createQuery("select min(le.gwTs) from CListenerEvent le where le.wsm = :wsm and le.eventCode = :eCode)").setEntity("wsm", wsm).setInteger("eCode", IRequestCodes.UPDATE_SENSOR_DATA).uniqueResult();		
			 //leFirst = new CListenerEvent();
		    //leFirst.setGwTs(CDateUtil.get90DayDST());
		}
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "GetMeasurementSummary");
			   throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
			}//catch
		finally {
			LOG.debug("About to exit from GetMeasurementSummary");
		}
		return new MeasurementSummary(measurement, firstTs, lastTs);
	}
	
	public List GetSensorData(Long mId, Long wsmId, Timestamp first, Timestamp last) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: GetSensorData first="+first+" last="+last);
		Session hsession = null;
		List sdSample=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			CMeasurement m = new CMeasurement(mId);
			CWirelessSensorModule wsm = new CWirelessSensorModule(wsmId);
			if (m==null){
				LOG.error("Measurement is not found for measurement.id="+mId);
				throw new CMeasurementNotFoundException();
			}
			sdSample = getSensorDataInTimeRange(hsession, m, wsm, first, last,false);

			LOG.debug("CSsiManagerBean method: sdSample.size="+sdSample.size());
		}
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetSensorData");
		   throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetSensorData");
		}
		return sdSample;
	}
	
	public DownloadReadings GetSensorDataInit(Long mId, Long wsmId, Timestamp first, Timestamp last) throws EJBException, CSsiManagerException {
		LOG.info("CSsiManagerBean method: GetSensorDataInit (for download) first="+first+" last="+last);
		Session hsession = null;
		List sdSample=null;
		Integer total=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();		
			/* Get the data row count */
			CWirelessSensorModule wsm = new CWirelessSensorModule(wsmId);		
			StringBuffer queryStr= new StringBuffer("select count(*) from CListenerEvent le where le.eventCode = :eCode and le.wsm = :wsm ");		
			if (first!=null) {
				queryStr.append("and le.gwTs >= :first ");
			}
			if (last!=null) {
				queryStr.append("and le.gwTs <= :last ");
			}
			org.hibernate.Query  q = hsession.createQuery(queryStr.toString())
				.setInteger("eCode", IRequestCodes.UPDATE_SENSOR_DATA)
				.setEntity("wsm", wsm);
			
			if (first != null && last!= null ) {
			    total = (Integer) q.setTimestamp("first", first).setTimestamp("last", last).uniqueResult();
			} else if (first != null && last == null) {
				total = (Integer) q.setTimestamp("first", first).uniqueResult();
			} else if (first == null && last != null) {
				total = (Integer) q.setTimestamp("last", last).uniqueResult();
			} else
				total = (Integer) q.uniqueResult();
			//	Get measurement information
			CMeasurement m=(CMeasurement) hsession.get(CMeasurement.class,mId,LockMode.NONE);
			if (m==null){
				LOG.error("Measurement is not found for measurement.id="+mId);
				throw new CMeasurementNotFoundException();
			}
		    /* Get the data in a date range */
			sdSample = getSensorDataInTimeRange(hsession, m, wsm, first, last, true);
			LOG.debug("CSsiManagerBean method: sdSample.size="+sdSample.size());
		}
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetSensorDataInit for Download");
		   throw new CSsiManagerException("Unexpected exception in CSsiManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetSensorDataInit for download");
		}
		return new DownloadReadings(sdSample, total);
	}

}



