package com.ssi.ejb;

import java.util.List;
import java.sql.*;

import javax.ejb.EJBException;
import com.ssi.persistence.*;
import com.ssi.bean.DetailReadings;
import com.ssi.bean.DownloadReadings;
import com.ssi.bean.MeasurementSummary;

public interface ISsiManagerLocal extends javax.ejb.EJBLocalObject {
	/** TO support Main page or GW popup
	 * @param id
	 * @param deep
	 * @param alarmCheck
	 * @return
	 * @throws EJBException
	 * @throws CSsiManagerException
	 */
	public IPersistenceObject GetGatewayInfo(Long id, boolean deep, boolean alarmCheck) throws EJBException, CSsiManagerException;
	/** Gw update to support gw popups.
	 * @param gw
	 * @return
	 * @throws EJBException
	 * @throws CSsiManagerException
	 */
	public IPersistenceObject  UpdateGatewayInfo(CGateway gw) throws EJBException, CSsiManagerException;
	/** Measurement updates to support measurement popups.
	 * @param m
	 * @param bUserChangeableCoeffs
	 * @param bUserChangeableUnit
	 * @return
	 * @throws EJBException
	 * @throws CSsiManagerException
	 */
	public IPersistenceObject UpdateMeasurementInfo(CMeasurement m, Boolean bUserChangeableCoeffs, Boolean bUserChangeableUnit) throws EJBException, CSsiManagerException;
	/** Pod updates to support pod popups.
	 * @param m
	 * @return
	 * @throws EJBException
	 * @throws CSsiManagerException
	 */
	public IPersistenceObject UpdateWsmInfo(CWirelessSensorModule m) throws EJBException, CSsiManagerException;
   /** Measurement get to support measurement popups.
    * @param id
    * @return
    * @throws EJBException
    * @throws CSsiManagerException
    */
	public IPersistenceObject GetMeasurementInfo(Long id) throws EJBException, CSsiManagerException;
   /** Pod get to support measurement popups.
    * @param id
    * @return
    * @throws EJBException
    * @throws CSsiManagerException
    */
	public IPersistenceObject GetWsmInfo(Long id) throws EJBException, CSsiManagerException;
   	/** To support the initial graph (detail) pop-up.
	 * 
	 * @param id
	 * @return
	 * @throws EJBException
	 * @throws CSsiManagerException
	 */
	public MeasurementSummary GetMeasurementSummary(Long id) throws EJBException, CSsiManagerException ;
	/** To support the AJAX javabean or mesh backing bean for graphing  sensor data
	 *  initiating
	 * @param mId
	 * @param wsmId
	 * @param first
	 * @param last
	 * @return
	 * @throws EJBException
	 * @throws CSsiManagerException
	 */
	public DetailReadings GetSensorDataInit(CMeasurement measurement, Long wsmId, Timestamp first, Timestamp last) throws EJBException, CSsiManagerException;
    /**To support the AJAX javabean or mesh backing bean for graphing or downloading sensor data
     * following
     * @param measurement
     * @param wsmId
     * @param last
     * @return
     * @throws EJBException
     * @throws CSsiManagerException
     */
	public List GetSensorData(Long mId, Long wsmId, Timestamp first, Timestamp last) throws EJBException, CSsiManagerException;
	//public List GetSensorData(Long mId) throws EJBException, CSsiManagerException ;
	/**To support the AJAX javabean or mesh backing bean for  downloading sensor data
     * following
     * @param mId
     * @param wsmId
     * @param last
     * @return
     * @throws EJBException
     * @throws CSsiManagerException
     */
	public DownloadReadings GetSensorDataInit(Long mId, Long wsmId, Timestamp first, Timestamp last) throws EJBException, CSsiManagerException;
}


