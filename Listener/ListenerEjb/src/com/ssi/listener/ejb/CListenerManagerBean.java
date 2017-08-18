package com.ssi.listener.ejb;

import java.util.*;
import java.sql.Timestamp;
import java.rmi.RemoteException;

import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import javax.ejb.CreateException;

import org.hibernate.Session;
import org.hibernate.LockMode;
import org.apache.log4j.Logger;

import javax.naming.InitialContext;

import com.ssi.util.*;
import com.ssi.common.*;
import com.ssi.exception.*;
import com.ssi.persistence.*;
import com.ssi.persistence.util.CPersistenceUtil;

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
 * @ejb.bean name="CListenerManagerBean"
 *           display-name="Name for CListenerManagerBean"
 *           description="Description for CListenerManagerBean"
 *           jndi-name="ejb/CListenerManagerBean"
 *           type="Stateless"
 *           view-type="remote"
 */
public class CListenerManagerBean implements SessionBean {

	/** The session context */
	private SessionContext context;
	static Logger LOG = Logger.getLogger(CListenerManagerBean.class.getName());

	public CListenerManagerBean() {
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
	public CGateway PowerOnGateway(CGateway gw, Integer eventCode) throws EJBException, CListenerManagerException {
		// gw comes with EUI, MAC, and sw/hw versions 
		
		LOG.info("CListenerManagerBean method: PowerOnGateway"+" eventCode="+eventCode);
		CGateway gw2=null;
		Session hsession = null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			gw2 = CPersistenceUtil.getGatewayByEui(hsession, gw.getEui());
			
			if (gw2==null) {
				LOG.debug("Gateway object is null(not found)");
				CAccount acc = createAccount(hsession,gw.getMac());
				// Here get these intervals from a singleton!!!!!!
				gw.setAccount(acc);
				gw.setMaxHeartBeatInterval(Long.valueOf(IApplicationConstants.MIN_HEARTBEAT_INTERVAL_MS));
				gw.setMeasurementInterval(Long.valueOf(IApplicationConstants.DEFAULT_MEASUREMENT_INTERVAL_MS));
				gw.setName(IApplicationConstants.GATEWAY_NAME_PREFIX+" "+gw.getMac());
				gw.setActive(Boolean.valueOf(true)); 
				gw.setWakeupInterval(Long.valueOf(IApplicationConstants.DEFAULT_MEASUREMENT_INTERVAL_MS/2));
				gw2=gw;
				hsession.save(gw2);
			}
			else {
				LOG.debug("Gateway object is found");
				if ((gw2.getFwVersion().compareToIgnoreCase(gw.getFwVersion())!=0) ||
						(gw2.getHwVersion().compareToIgnoreCase(gw.getHwVersion())!=0) ||
						(gw2.getRadioFwVersion().compareToIgnoreCase(gw.getRadioFwVersion())!=0)) {
					gw2.setFwVersion(gw.getFwVersion());
					gw2.setHwVersion(gw.getHwVersion());
					gw2.setRadioFwVersion(gw.getRadioFwVersion());
					hsession.update(gw2);
				}
			}
			LOG.debug("Gateway object is about to be saved/updated (saveOrUpdate)");
			
			CListenerEvent event = logEvent(hsession, eventCode, gw2,null,null);
		} // try
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "PowerOnGateway");
			throw e;
		}//catch
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "PowerOnGateway");
		   throw new CListenerManagerException("Unexpected exception in CListenerManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from PowerOnGateway");
		}
		return gw2;
	}// end PowerOnGateway 
	
	private CAccount createAccount(Session hsession, String gwMac) {
		LOG.info("In createAccount");
		
		CAccount account = new CAccount();
		account.setName(gwMac);
		account.setServiceLevel(Short.valueOf(IApplicationConstants.SERVICE_LEVEL_PREMIUM));
		hsession.save(account);
		
		CContact c1 = createContact(hsession, account, IApplicationConstants.DEFAULT_ADMIN_NAME,true);
		CContact c2 = createContact(hsession, account, IApplicationConstants.DEFAULT_VIEWER_NAME, false);
		
		return (account);
	}
	private CContact createContact(Session hsession, CAccount account, String uNamePw, boolean admin){
		CContact contact = new CContact();
	    contact.setAccount(account);
	    hsession.save(contact);
	    //@TO-DO Encrypt the password
		CRole role = new CRole();
		role.setAdmin(Boolean.valueOf(admin));
		role.setUname(uNamePw);
		String strPw = CSecurityUtil.encrypt(uNamePw);
		role.setPw(strPw);
		role.setOwner(contact);
		hsession.save(role);
		return(contact);
	}
	
	// throws HibernateException which is a RuntimeException
	private CListenerEvent logEvent(Session hsession, Integer eventCode, CGateway gw, CWirelessSensorModule wsm, Timestamp gwTs)
	{   
		LOG.info("In logEvent eventCode="+eventCode+" gw="+gw+" wsm="+wsm+" geTs="+gwTs);
		CListenerEvent event = new CListenerEvent();
		event.setEventCode(eventCode);
		event.setGateway(gw);
		event.setWsm(wsm);
		event.setGwTs(gwTs);
		event.setTs(CDateUtil.getCurrentDST());
		hsession.save(event);
		LOG.debug("Exiting logEvent(...) event id="+event.getId());
		return event;
	}
	
	private CListenerEvent logEvent( Integer eventCode, CGateway gw, CWirelessSensorModule wsm, Timestamp gwTs)
	{   
		LOG.info("In logEvent eventCode="+eventCode+" gw="+gw+" wsm="+wsm+" geTs="+gwTs);
		CListenerEvent event = new CListenerEvent();
		event.setEventCode(eventCode);
		event.setGateway(gw);
		event.setWsm(wsm);
		event.setGwTs(gwTs);
		event.setTs(CDateUtil.getCurrentDST());
		LOG.debug("Exiting logEvent(...) event id="+event.getId());
		return event;
	}
	// event code = 30
	public CGateway HeartbeatGateway(CGateway gw, Integer eventCode) throws EJBException, CListenerManagerException {
		// gw comes with EUI, MAC
		
		LOG.info("In HeartbeatGateway eventCode="+eventCode);
		CGateway gw2=null;
		Session hsession = null;       
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			gw2=CPersistenceUtil.getGatewayByEui(hsession, gw.getEui());
			
			if (gw2==null) {
				LOG.error("gw2 is null for heartbeat");
				throw new CGatewayNotFoundException("Gateway object is not found for heartbeat");
			}
			LOG.debug("gw2 is found for heartbeat");
			CListenerEvent event = logEvent(hsession, eventCode, gw2, null,null);
		} // try
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "HeartbeatGateway");
			throw e;
		}//catch
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "HeartbeatGateway");
		   throw new CListenerManagerException("Unexpected exception in CListenerManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from HeartbeatGateway");
		}
		return gw2;
	}// end HeartbeatGateway

	public CGateway ConfigureWsm(CGateway gw, CWirelessSensorModule wsm, CWsmType wsmType, Integer eventCode) throws EJBException, CListenerManagerException {
		// gw comes with EUI, MAC, and sw/hw versions 
		LOG.info("CListenerManagerBean method: ConfigureWsm"+" gw="+gw+" eventCode="+eventCode);
		CGateway gw2=null;
		Session   hsession=null;     
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			gw2 = CPersistenceUtil.getGatewayByEui(hsession, gw.getEui());
			
			if (gw2==null) {
				LOG.error("gw2 is null for WSM configuration");
				throw new CGatewayNotFoundException("Gateway object is not found for WSM configuration");
			}
			LOG.debug("gw2 is found for WSM configuration");
			CWsmType wsmType2 = getWsmTypeById(hsession,wsmType.getTypeId());
			
			if (wsmType2==null) {
				LOG.error("wsmType2 is null for WSM configuration");
				throw new CWsmTypeNotFoundException("WsmType object is not found for WSM configuration");
			}	
			LOG.debug("wsmType2 is found for WSM configuration");	
			
			CWirelessSensorModule wsm2 = getWsmByEui(hsession,wsm.getEui());

			if (wsm2==null) { //insert
				LOG.debug("wsm2 is null for WSM configuration");				
				wsm2 = createNewWsm(wsm, wsmType2, gw2);
				hsession.save(wsm2);
				hsession.lock(wsm2, LockMode.UPGRADE);
			}
			else {  // update only if something is changed
				CGateway oldGw = null;
				//int oldGwId = 0;
				if (!wsm2.hasGateway(gw2)){
					LOG.info("wsm2 has a different (or null) gateway for WSM config gw2="+gw2);
					//throw new CWsmNotFoundException("WSM's gateway object is not found/verified for logging sensor data gw2="+gw2);
				    
					oldGw = wsm2.getGateway();
					// the following commented out section should never occur since the EUI of deleted pod is modified to unique identifier 
				    /*oldGwId = oldGw.getId().intValue();
				    
				    if ( oldGwId == IApplicationConstants.DELETED_OBJECT_KEY) { // (-1) Bring the pod from dead!!!
				    	LOG.info("wsm2 has been deleted before");
				    	wsm2=createNewWsm(wsm2,wsmType2,gw2); // creates gw-pod association also
				    }
				    else */
					// Just move it to another gateway
				    	//wsm2.setGateway(gw2);
					     gw2.addWsm(wsm2);
				}
				LOG.debug("wsm2 is found for WSM configuration");
				
				if ((wsm2.getFwVersion().compareToIgnoreCase(wsm.getFwVersion())!=0) ||
					(wsm2.getHwVersion().compareToIgnoreCase(wsm.getHwVersion())!=0) ){
					wsm2.setFwVersion(wsm.getFwVersion());
					wsm2.setHwVersion(wsm.getHwVersion());					
				}//if
				hsession.update(wsm2);
				hsession.lock(wsm2, LockMode.UPGRADE);
				if (oldGw != null ){ //&& oldGwId != -1
					CUserEvent ue= CPersistenceUtil.LogUserEvent(hsession, Integer.valueOf(IUserCommands.MOVED_POD), oldGw, wsm2);
				}
			} // else
			CListenerEvent event = logEvent(hsession, eventCode, gw2, wsm2, null);
		} // try
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "ConfigWsm");
			throw e;
		}//catch
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "ConfigWsm");
		   throw new CListenerManagerException("Unexpected exception in CListenerManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from ConfigWsm");
		}    
		return gw2;
	}// end ConfigWsm
	private CWirelessSensorModule createNewWsm(CWirelessSensorModule wsm, CWsmType wsmType, CGateway gw) throws Exception {
		//before createing a pod, make sure that it's type is well defined (BusinessException does not cause rollback
		List measurementTypes = wsmType.getMeasurementTypes();
		if (measurementTypes == null || measurementTypes.size()== 0){
			LOG.error("No measurement types found for the wsm type");
			throw new CWsmTypeMeasurementsNotFoundException("Measurement Type objects are not found for WSM type");
		}
		
		wsm.setActive(Boolean.valueOf(true));
		//wsm.setName(wsmType2.getDefaultName()+" "+wsm.getEui());
		String sep;
		if (wsmType.getTypeId().compareTo(IApplicationConstants.WSM_TYPE_TEMP0) != 0)
			sep = " - ";
		else
			sep = "-";
		wsm.setName(wsmType.getDefaultName()+sep+wsm.getEui().substring(wsm.getEui().length()-5));

		//wsm.setGateway(gw);
		gw.addWsm(wsm);
		wsm.setWsmType(wsmType);
		// Description field nolonger used.
		//wsm.setDescription(wsmType.getDescription());
		
		List measurements = generateWsmMeasurements(wsm, measurementTypes, wsmType);
		return wsm;
	}
	//	 throws HibernateException which is a RuntimeException
	private CWirelessSensorModule getWsmByEui(Session hsession, String strWsmEui) {
		LOG.info("In getWsmByEui strWsmEui="+strWsmEui);
		CWirelessSensorModule wsm = (CWirelessSensorModule) hsession.createQuery(
	    "from CWirelessSensorModule as wsm where wsm.eui = ?")
	    .setString(0, strWsmEui)
	    .uniqueResult();
		LOG.debug("Exiting getWsmByEui, wsm="+wsm);
		return wsm;
		
	}
	
	//	 throws HibernateException which is a RuntimeException
	private CWsmType getWsmTypeById(Session hsession, String strId) {
		LOG.info("In getWsmTypeById strId="+strId);
		CWsmType wsmType = (CWsmType) hsession.createQuery(
	    "from CWsmType as wsmType where wsmType.typeId = ?")
	    .setString(0, strId)
	    .setCacheable(true)
	    .uniqueResult();
		LOG.debug("Exiting getWsmTypeById, wsmType="+wsmType);
		return wsmType;
	}
//	 throws HibernateException which is a RuntimeException
	private List generateWsmMeasurements(CWirelessSensorModule wsm, List measurmentTypes, CWsmType wsmType){
		Iterator iter = measurmentTypes.iterator();
		CMeasurementType mType = null;
		short index = 0;
		while (iter.hasNext())
		{
			mType = (CMeasurementType) iter.next();
			
			LOG.debug("default coeff1="+mType.getDefaultCoeff1());
			LOG.debug("default coeff2="+mType.getDefaultCoeff2());
			LOG.debug("default coeff3="+mType.getDefaultCoeff3());
			LOG.debug("default coeff4="+mType.getDefaultCoeff4());
			LOG.debug("default Name="+mType.getDefaultName());
			LOG.debug("default Unit="+mType.getDefaultUnit().getName());
			CMeasurement m = new CMeasurement(mType);
			m.setOrdering(new Short(index));
			wsm.addMeasurement(m);
			if (mType.getTypeId().contentEquals(IApplicationConstants.MEASUREMENT_TYPE_SUPPLY_VOLTAGE)){
				defineSupplyVoltageAlarm(m,wsmType);
			}
			index++;
		}
		return wsm.getMeasurements();
	} //generateWsmMeasurements
	// event code =10
	private void defineSupplyVoltageAlarm(CMeasurement m, CWsmType wsmType){
		try {
			CAlarmDefinition aDef = new CAlarmDefinition();
			aDef.setEnabled(Boolean.valueOf(true));
			aDef.setFilterLength(Short.valueOf(IApplicationConstants.DEFAULT_SUPPLY_VOLTAGE_ALARM_FILTER_LENGHT));
			aDef.setFilterLimit(Short.valueOf(IApplicationConstants.DEFAULT_SUPPLY_VOLTAGE_ALARM_FILTER_LIMIT));
			if (wsmType.getTypeId().contentEquals(IApplicationConstants.WSM_TYPE_ANALOG0) || 
					wsmType.getTypeId().contentEquals(IApplicationConstants.WSM_TYPE_ANALOG1))
				aDef.setOperand1(Float.valueOf(IApplicationConstants.DEFAULT_SUPPLY_VOLTAGE_ALARM_VALUE_33));		
			else
				aDef.setOperand1(Float.valueOf(IApplicationConstants.DEFAULT_SUPPLY_VOLTAGE_ALARM_VALUE_31));	
			aDef.setOperator1(Short.valueOf(IApplicationConstants.ALARM_OPERATOR_LT));
			aDef.setOperator2(Short.valueOf(IApplicationConstants.ALARM_OPERATOR_GT)); //default in the UI
			aDef.setDescription(IApplicationConstants.DEFAULT_SUPPLY_VOLTAGE_ALARM_DESCRIPTION);
			aDef.setName(IApplicationConstants.DEFAULT_SUPPLY_VOLTAGE_ALARM_NAME);
			// add aDef to parent (measurement)
			m.addAlarmDefinition(aDef);
		}//try
		catch (Exception e) {
			CPersistenceUtil.printException(e, "*Ignoring Supply voltage alarm definition exception caught in defineSupplyVoltageAlarm()*\n"+" measurement id="+m.getId());
		}
	}
	
	public CGateway LogSensorData(CGateway gw, CWirelessSensorModule wsm, String wsmData, Long time, Integer eventCode, String wsmLqi) throws EJBException, CListenerManagerException {
		// gw comes with EUI, MAC, and sw/hw versions 
		LOG.info("CListenerManagerBean method: LogSensorData"+" gw="+gw+" eventCode="+eventCode);
		CGateway gw2=null;
		Session hsession=null;
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			gw2 = CPersistenceUtil.getGatewayByEui(hsession, gw.getEui());
			
			if (gw2==null) {
				LOG.error("gw2 is null for logging sensor data");
				throw new CGatewayNotFoundException("Gateway object is not found for logging sensor data");
			}
			LOG.info("gw2 is found for logging sensor data");
			
			CWirelessSensorModule wsm2 = getWsmByEui(hsession,wsm.getEui());

			if (wsm2==null) { //error
				LOG.error("wsm2 is null for logging sensor data");
				throw new CWsmNotFoundException("WSM object is not found for logging sensor data");
			}
			if (!wsm2.hasGateway(gw2)){
				LOG.error("wsm2 has a different (or null) gateway for logging sensor data gw2="+gw2);
				throw new CWsmNotFoundException("WSM's gateway object is not found/verified for logging sensor data gw2="+gw2);
			}
			
			CWsmType wsmType = wsm2.getWsmType();

			// insert sensor data
			LOG.info("wsm2 is found for logging sensor data");
			List measurements = wsm2.getMeasurements();
			int mSize= measurements.size();
			// A Weird case...
			if (mSize==0)return gw2;
			
			StringTokenizer st = new StringTokenizer(wsmData," \t\n\r\f,");
			
			int tokenCount = st.countTokens() - 
			(wsmType.getTypeId().equals(IApplicationConstants.WSM_TYPE_ANALOG0) 
			 || wsmType.getTypeId().equals(IApplicationConstants.WSM_TYPE_ANALOG1)
			 || wsmType.getTypeId().equals(IApplicationConstants.WSM_TYPE_ANALOG4) ? 1 : 0);
			
			if (mSize != tokenCount){
				LOG.error("wsm data count does not match to wsm measurement count for logging sensor data");
				throw new CDataAndMeasurementCountNotMacthException("wsm data count does not match to wsm measurement count for logging sensor data");
			}
			Timestamp ts = CDateUtil.getCurrentDST(time.longValue());
			// Create an event w/o saving & flushing as th eparent of all measurements
			CListenerEvent event = logEvent(eventCode, gw2, wsm2,ts);
			
			Iterator iter = measurements.iterator();
			Long lData;
			String strLowData, strHighData;
			short i=0;
			CSensorData []sdArr = new CSensorData[16];
			CMeasurement measurement=null;
			CMeasurementType mType=null;
			// get all measurement readings at once w/o saving or flushing
			while (iter.hasNext()) {
				measurement = (CMeasurement)iter.next();				
				mType = measurement.getMeasurementType();
			    strLowData = st.nextToken();				 
				if (mType.getTypeId().equals(IApplicationConstants.MEASUREMENT_TYPE_EVENT_COUNTER)) {
					 strHighData = st.nextToken();
					lData = Long.valueOf(strHighData+strLowData,16);
				} else {
					lData = Long.valueOf(strLowData,16);
				}	
				sdArr[i] = new CSensorData();
				sdArr[i].setValue(Float.valueOf(lData.floatValue()));
				sdArr[i].setMeasurement(measurement);
				sdArr[i].setOrder(Short.valueOf(i));		
				event.addSensorData(sdArr[i]);
				sdArr[i].setListenerEvent(event);
				i++;
			}//while
		
			//////////////////////////////////////////////////////////////////
			// save all measurement readings and the event in the narrowest window at once & 
			// lock so that web app does not pick up the partial data
			hsession.save(event);
			hsession.lock(event, LockMode.UPGRADE);
            short j=0;
			while (j < i) {			
				hsession.save(sdArr[j]);
				hsession.lock(sdArr[j], LockMode.UPGRADE);
				j++;
			}
			//////////////////////////////////////////////////////////////////
		    hsession.flush(); // at this point the event and the measurements are in DB!!!
	        // process alarms by commiting and locking one at a time.   
		   
		    generateAlarms(hsession, gw2, wsm2, measurements);
		    
			if (wsmLqi != null) 		
				logWsmLqi(hsession, event, wsmLqi);
		} // try
		catch (RuntimeException e){
			CPersistenceUtil.printException(e, "LogSensorData");
			throw e;
		}//catch
		catch (Exception e){
			CPersistenceUtil.printSQLException(e, "LogSensorData");
		   throw new CListenerManagerException("Unexpected exception in CListenerManagerBean (Naming or Hibernate or Application)",e);
		}//catch
		finally {
			LOG.debug("About to exit from LogSensorData");
		}
		return gw2;
	}// end ConfigWsm
	private void generateAlarms (Session hsession, CGateway gw, CWirelessSensorModule wsm, List measurements) {
		try {
			CMeasurement measurement=null;
			Iterator iter = measurements.iterator();
		    short serviceLevel = gw.getAccount().getServiceLevel().shortValue();
		    iter = measurements.iterator();
			while (iter.hasNext()) {
			    //check if alarms defined
				measurement = (CMeasurement)iter.next();	
				List aDefs = (serviceLevel == IApplicationConstants.SERVICE_LEVEL_STANDARD)? null : CPersistenceUtil.getEnabledAlarmDefinition(hsession, measurement);
				LOG.debug("aDefs="+aDefs);
				if (aDefs!=null && !aDefs.isEmpty()) {
					CAlarmDefinition aDef = (CAlarmDefinition) aDefs.get(0);
					
					LOG.debug("aDefs.size="+aDefs.size());
					LOG.debug("aDef.id="+aDef.getId());
					if (aDef != null )  //if any alarm is defined, call alarm trigger
						checkAlarm(hsession, wsm, measurement, aDef);
				}
			}// alarm while		
	   }
	   catch (Exception e){
		   CPersistenceUtil.printException(e, "Ignoring ALL Alarm generation in generateAlarms () wsm.id = "+wsm.getId()+" gw.id="+gw.getId());
	   }//catch
	}
	private void checkAlarm(Session hsession, CWirelessSensorModule wsm, CMeasurement m, CAlarmDefinition aDef)  throws Exception{
		{
		LOG.info("In checkAlarm");
		SensorData sdSaved=null;
		try {
		    sdSaved = testAlarmCondition(hsession, wsm, m, aDef);
			Set alarms = aDef.getAlarms(); 
			CAlarm alarm = null;
			Iterator iter;
			LOG.info("sdSaved="+sdSaved);
			if (sdSaved != null) {
				if (alarms == null || alarms.isEmpty()){ // if no alarms create one
					LOG.info("Alarms is Empty sdSaved.id="+sdSaved.getId());
					alarm = new CAlarm();
					alarm.setDefinition(aDef); 
					CSensorData pSd = (CSensorData) hsession.get(CSensorData.class, sdSaved.getId());
					
					alarm.setTs(sdSaved.getTs());
					alarm.setValue(sdSaved.getValue());
					alarm.setActive(Boolean.valueOf(true));
					LOG.info("pSd="+pSd);
					pSd.addAlarm(alarm); 
					
					hsession.save(alarm);
					hsession.lock(alarm, LockMode.UPGRADE);
					if (aDef.getNotifyList() != null && aDef.getNotifyList().length()!=0)
						mailAlarm(m,aDef,sdSaved);
				} else {
					LOG.debug("Alarms is not Empty");
					iter = alarms.iterator();
					
					alarm = (CAlarm)iter.next();
					alarm.setTs(sdSaved.getTs());
					alarm.setValue(sdSaved.getValue());
					alarm.setActive(Boolean.valueOf(true));
					hsession.lock(alarm, LockMode.UPGRADE);
					hsession.update(alarm);
				}
			} else { // alarm is not active
				if (alarms != null && !alarms.isEmpty() ){ 
					LOG.debug("alarm is not active & alarms is not empty");
					iter = alarms.iterator();
					alarm = (CAlarm)iter.next();
					alarm.setActive(Boolean.valueOf(false));
					hsession.lock(alarm, LockMode.UPGRADE);
					hsession.update(alarm);
				}
				//else // no alarm, no inactive alarm
			}
		} catch (Exception e){
			CPersistenceUtil.printException(e, "*Ignoring Exception In Check Alarm*\n"+
												  " measurement id="+ m.getId() +
												  " alarm definition id=" + aDef.getId() +
												  " sdSaved id = " + ((sdSaved == null) ? "null" : sdSaved.getId().toString()));
			//throw(e);
			}
		} //try
	}
	
	private SensorData testAlarmCondition(Session hsession, CWirelessSensorModule wsm, CMeasurement m, CAlarmDefinition ad) {
		LOG.info("In testAlarmCondition");
		LOG.debug("wsm.id="+wsm.getId()+" m.id="+m.getId()+" filter lenght="+ad.getFilterLength().shortValue());
		List dataSample = getAlarmDataSample(hsession, wsm, m, ad.getFilterLength().shortValue());
		LOG.debug("dataSample.size="+dataSample.size());
		Iterator iter = dataSample.iterator();
		short count = ad.getFilterLimit().shortValue();
		short operator1 = ad.getOperator1().shortValue();
		short operator2 = ad.getOperator2().shortValue();
		
		float operand1 = ad.getOperand1().floatValue();
		float operand2 = 0;
		boolean secondConditionExists = true;
		if (ad.getOperand2() != null){
			operand2 = ad.getOperand2().floatValue();
		}
		else { secondConditionExists=false; }
		boolean p1,p2,p0;
		SensorData sd = null;
		SensorData sdSaved = null;
		boolean connectorIsAND=false;
		if (secondConditionExists && ad.getConnector()== null) {
			LOG.error("Second alarm condition exists but AND/OR connector is null. Listener can not handle, skipping...");
			return null;
		}
		else if (secondConditionExists) {
			connectorIsAND = (ad.getConnector().shortValue() == IApplicationConstants.ALARM_CONNECTOR_AND);
		}
		while(iter.hasNext()) {
			sd = (SensorData) iter.next();
			float dataValue =  CMathUtil.CalcMeasurement(sd.getValue().floatValue(),
														m.getCoeff1().floatValue(),
														m.getCoeff2().floatValue(),
														m.getCoeff3().floatValue(),
														m.getCoeff4().floatValue()).floatValue();
			LOG.debug("in while sd.time="+sd.getTs()+" id="+sd.getId());
			LOG.debug("in while sd.value="+sd.getValue()+" dataValue="+dataValue+" secondConditionExists="+secondConditionExists+" count="+count);
			p1 = testCondition(dataValue, operand1, operator1);
			LOG.debug("in while p1="+p1+" operand1="+operand1+" operator1"+operator1);
			if (secondConditionExists && ( p1 && connectorIsAND || !p1 && !connectorIsAND) ) {
				p2 = testCondition(dataValue, operand2, operator2);
				//p0 = (connectorIsAND ? (p1 && p2) : (p1 || p2)) ;
				p0=p2;
			}
			else {
				p0 = p1;
			}
			LOG.debug("in while sdSaved="+sdSaved);
			if (p0) {
				count--;
				if (sdSaved == null)
					sdSaved = sd;
			}
			LOG.debug("in while sdSaved="+sdSaved);
			if (count==0) 
				return sdSaved;
		}//while
		LOG.debug("out of while sdSaved="+sdSaved+" count="+count);
		if (count!=0) sdSaved=null;
		return sdSaved;
	} //testAlarmCondition
	
	private List getAlarmDataSample(Session hsession, CWirelessSensorModule wsm, CMeasurement m, short size) {
		String sql = "select sd.value as {sd.value}, sub_le.gw_timestamp as {sd.ts}, sd.id as {sd.id} from " +
		"(select gw_timestamp, id from listener_event le where le.event_code = " + Integer.valueOf(IRequestCodes.UPDATE_SENSOR_DATA).toString() +
		" and le.wsm_id = " + wsm.getId().toString() +
		" order by le.gw_timestamp desc limit " + Short.valueOf(size).toString() +
		") as sub_le, sensor_data sd where sd.measurement_id = " + m.getId().toString() +
		" and sd.listener_event_id = sub_le.id order by sub_le.gw_timestamp desc";

		List results = (hsession.createSQLQuery(sql).addEntity("sd",SensorData.class).list());
		LOG.info("getAlarmDataSample results size="+results.size());
		return results;
		} 
	
	private CWsmData logWsmLqi(Session hsession, CListenerEvent le, String lqi) {
		CWsmData wsmData = null;
		try {
			wsmData = new CWsmData();
			wsmData.setDataCode(IWsmDataCodes.LQI);
			wsmData.setListenerEvent(le);
			wsmData.setValue(Short.valueOf(lqi,16));
			hsession.save(wsmData);
			hsession.lock(wsmData, LockMode.UPGRADE);
		} catch (Exception e){
			CPersistenceUtil.printException(e, "*Ignoring Exception In LQI entry LogSensorData*\n"+
					  " listener_event_id ="+ le.getId());
	   }//catch	
		return wsmData;
	}
/*
	private List getAlarmDataSample(Session hsession, CWirelessSensorModule wsm, CMeasurement m, short size) {
		LOG.info("getAlarmDataSample");
		
		return( hsession.createQuery(
		"select com.ssi.listener.bean.SensorData(sd.value, le.gwTs, sd.id) from CSensorData sd join sd.listenerEvent le where sd.measurement = :measurement and le.eventCode = :eventCode and le.wsm = :wsm order by le.gwTs desc")
	    .setFirstResult(0)
	    .setMaxResults(size)
	    .setEntity("wsm", wsm)
	    .setShort("eventCode", (short)IRequestCodes.UPDATE_SENSOR_DATA)
	    .setEntity("measurement", m).list());
	}	
*/
/*	private List getAlarmDataSample(Session hsession, CWirelessSensorModule wsm, CMeasurement m, short size, List eventList) {
		LOG.info("getAlarmDataSample");
		Collection leList = hsession.createQuery(
		" from CListenerEvent as le where le.eventCode = :eventCode and le.wsm = :wsm order by le.gwTs desc")
	    .setFirstResult(0)
	    .setMaxResults(size)
	    .setEntity("wsm", wsm)
	    .setShort("eventCode", (short)IRequestCodes.UPDATE_SENSOR_DATA).list();
		CSensorData sd = new CSensorData();
		List sdList = hsession.createQuery(
		" from CSensorData as sd where sd.measurement = :measurement and sd.event in (:events)")
		.setFirstResult(0)
		.setEntity("measurement", m)
		.setParameterList("events",leList, sd.getClass())
		.list();
		
		return( hsession.createQuery(
		"select new com.ssi.listener.bean.SensorData(sd.value, le.gwTs, sd.id) from CSensorData sd join sd.listenerEvent le where sd.measurement = :measurement and le.eventCode = :eventCode and le.wsm = :wsm order by le.gwTs desc")
	    .setFirstResult(0)
	    .setMaxResults(size)
	    .setEntity("wsm", wsm)
	    .setShort("eventCode", (short)IRequestCodes.UPDATE_SENSOR_DATA)
	    .setEntity("measurement", m).list());
	}	
	private List getAlarmDataSample(Session hsession, CWirelessSensorModule wsm, CMeasurement m, short size) throws CJdbcException {
		LOG.info("getAlarmDataSample");
		String sql = "select sd.value, sub_le.gw_timestamp, sd.id from " +
		"(select gw_timestamp, id from \"SSI\".listener_event le where le.event_code = " + Integer.valueOf(IRequestCodes.UPDATE_SENSOR_DATA).toString() +
		" and le.wsm_id = " + wsm.getId().toString() +
		" order by le.gw_timestamp desc limit " + Short.valueOf(size).toString() + 
		") as sub_le, \"SSI\".sensor_data sd where sd.measurement_id = " + m.getId().toString() +
		" and sd.listener_event_id = sub_le.id order by sub_le.gw_timestamp desc";
        
        List sdList = new Vector();
        try {
	        Connection conn = CPersistenceUtil.getJDBCConnection();
	        Statement stmt = conn.createStatement();
			stmt.executeQuery(sql);
	        ResultSet rs = stmt.getResultSet();
	        while (rs.next()) {//make it if...
	            Float val = new Float(rs.getFloat("value"));
	            Timestamp ts = rs.getTimestamp("gw_timestamp");
	            Long id = new Long(rs.getLong("id"));
	            SensorData sd = new SensorData(val,ts,id);
	            sdList.add(sd);
	        }
	        stmt.close();
	        conn.close();
        } catch (Exception e){
        	LOG.error("In getAlarmDataSample a DB exception occured" );
        	throw new CJdbcException(e);
        }
		return sdList;
	}

	private List getAlarmDataSample(Session hsession, CWirelessSensorModule wsm, CMeasurement m, short size, List leList) {
		LOG.info("getAlarmDataSample");
		short maxSize = (short) leList.size();
		short count = (size < maxSize) ? size : maxSize;
		LOG.info("count = "+count);
		String strFk = getFKList(leList, count);
		LOG.info("strFK = "+strFk);
		Type t1 = Long.class;
		List tupleList = hsession.createSQLQuery(
		" select sd.id as {id}, sd.value as {value}, sd.listener_event_id as {fkeyId} from Sensor_Data sd where sd.measurement_id = " + m.getId().toString() +
		" and sd.listener_event_id in (" + strFk + ")").addScalar("id",t1).list();
		
		List results = new Vector();
		
		short i = 0;
		while (i<count) {
			CListenerEvent le = (CListenerEvent)(leList.get(i));
			Object[] row = (Object[])findSdFromFk(tupleList, le.getId().longValue());
			results.add(new SensorData(row[1], le.getGwTs(), row[0])); //(val,ts,id)
			i++;
		}
		return results;
	}
	
	private String getFKList(List leList, short count) {
		StringBuffer strRet = new StringBuffer();

	    short i = 0;
	    while (i < count){
	    	Long id = ((CListenerEvent)leList.get(i)).getId();
	    	strRet.append(id);
	    	strRet.append(',');
	    	i++;
	    }
		return (strRet.deleteCharAt(strRet.length()-1)).toString();
	}
	
	private Object[] findSdFromFk(List tupleList, long id) {
		Iterator iter = tupleList.iterator();
		while (iter.hasNext()) {
			Object[] row = (Object[]) iter.next();
			LOG.info("row.lenght="+row.length);
			if (((Long)row[2]).longValue() == id) // if (fk = id) found it!!!
				return row;
		}
		return  null;
	}
	*/
	private boolean testCondition(float data, float operand, short operator) {
		LOG.info("testCondition");
		switch (operator) {
			case IApplicationConstants.ALARM_OPERATOR_GT : return (data > operand);
			case IApplicationConstants.ALARM_OPERATOR_LT : return (data < operand);
			case IApplicationConstants.ALARM_OPERATOR_EQ : return (data == operand);
		}
		return false;
	}
	
	private void mailAlarm(CMeasurement m, CAlarmDefinition aDef, SensorData sd) {
		try {
			LOG.debug("mailAlarm");
			javax.naming.Context jndiContext = new InitialContext();
			
			javax.mail.Session javaMailSession = (javax.mail.Session) jndiContext.lookup(IJNDINames.EMAIL_SESSION_NAME);
			CMailUtil email = new CMailUtil(javaMailSession);
			float data = CMathUtil.CalcMeasurement(sd.getValue().floatValue(),
					m.getCoeff1().floatValue(),
					m.getCoeff2().floatValue(),
					m.getCoeff3().floatValue(),
					m.getCoeff4().floatValue()).floatValue();
			StringBuffer buff = new StringBuffer(aDef.getMessage());
			buff.append("\r\nData value="+data+" "+m.getUnit()+" Timestamp="+CTextUtil.DateFormat(sd.getTs(),"MM/dd/yy kk:mm:ss")+"(UTC)\r\n");
			buff.append(ISystemMessages.EMAIL_NO_REPLY_MSG);
			email.setBody(buff.toString());
			email.setSubject("Alarm: "+aDef.getName()+" from sensor " + m.getName());
			//email.setSender("artemis.ozten@smartersensing.com");
			StringTokenizer st = new StringTokenizer(aDef.getNotifyList(),";, \t\n\r\f");
			while (st.hasMoreTokens()){
				email.addRecipient(st.nextToken());
			}
			LOG.debug("sending email to "+ aDef.getNotifyList()+ " on alarm " + aDef.getName()+"(id="+aDef.getId()+")"+" value="+sd.getValue()+" timestamp="+sd.getTs());
			LOG.debug("Email message "+ buff);
			email.send();
		}//try
		catch(Exception e) {
			CPersistenceUtil.printException(e, "*Ignoring Java mail or JNDI Naming exception caught in mailAlarm()* measurement id="+m.getId());
		}
	}
	
	//	 event code = 30
	public List GetUserEvent(CGateway gw) throws EJBException, CListenerManagerException {
		LOG.info("In GetUserEvent gw.id="+gw.getId());
		List ueList=null;
		Session hsession = null;       
		try {
			//	Create a Hibernate session
			hsession = CPersistenceUtil.getHibernateSession();
			CGateway gw1=null;
			if (gw.getId()!= null){
				gw1 = (CGateway) hsession.get(CGateway.class, gw.getId(),LockMode.UPGRADE);
			}
			else 
				gw1 = CPersistenceUtil.getGatewayByEui(hsession, gw.getEui());
			
			if (gw1==null) {
				LOG.error("gw1 is null for getting user event");
				throw new CGatewayNotFoundException("Gateway object is not found for getting user event");
			}
		    ueList = hsession.createQuery(
			"from CUserEvent ue where ue.gateway = :gw and ue.active='T' ")
		    .setEntity("gw", gw1)
		    .list();
			if (ueList != null) {
				Iterator iter = ueList.iterator();
				while (iter.hasNext()) {
					CUserEvent ue = (CUserEvent) iter.next();
					ue.setActive(Boolean.valueOf(false));
					ue.setUpdateTs(CDateUtil.getCurrentDST());
					hsession.update(ue);
					//!!!!!!!!!!!!!!! the following is for eliminationg lazy initialization exception
					String  name = ue.getWsm().getName();
					name = ue.getGateway().getName();
				} // while
			} // if
		} // try
		catch (RuntimeException e){
			   CPersistenceUtil.printException(e, "GetUserEvent");
			   throw e;
		}//catch
		catch (Exception e){
		   CPersistenceUtil.printSQLException(e, "GetUserEvent");
		   throw new CListenerManagerException("Unexpected exception in CListenerManagerBean (Naming or Hibernate or?)",e);
		}//catch
		finally {
			LOG.debug("About to exit from GetUserEvent");
		}
		return ueList;
	}// end HeartbeatGateway

}
