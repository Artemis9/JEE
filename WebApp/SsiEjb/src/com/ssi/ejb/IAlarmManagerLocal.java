package com.ssi.ejb;

import java.util.List;
import java.sql.*;

import javax.ejb.EJBException;

import com.ssi.persistence.CAlarmDefinition;
import com.ssi.persistence.IPersistenceObject;
import com.ssi.bean.AlarmHistoryDetails;

/**
 * @author AAO
 *
 */
public interface IAlarmManagerLocal extends javax.ejb.EJBLocalObject  {
	/** to support Alarm definition popup gets
	    * @param measurId
	    * @return
	    * @throws EJBException
	    * @throws CAlarmManagerException
	    */
		public IPersistenceObject GetAlarmDefinition(Long measurId)throws EJBException, CAlarmManagerException;
	   /** to support Alarm definition pupup update/insert
	    * @param measurId
	    * @return
	    * @throws EJBException
	    * @throws CAlarmManagerException
	    */
		public IPersistenceObject UpdateOrInsertAlarmDefinition(CAlarmDefinition aDef, Long measurId)throws EJBException, CAlarmManagerException;
		/** To put an alarm to alarm history
		 * @param idList
		 * @throws EJBException
		 * @throws CAlarmManagerException
		 */
		public void PutAlarmsInHistory(List idList) throws EJBException, CAlarmManagerException;
		/** To support the alarm history popup get
		 * 
		 * @param gwId
		 * @param first
		 * @param max
		 * @return
		 * @throws EJBException
		 * @throws CAlarmManagerException
		 */
		public AlarmHistoryDetails GetAlarmHistory(Long gwId, Timestamp first, Timestamp last, int from, int max) throws EJBException, CAlarmManagerException;

}
