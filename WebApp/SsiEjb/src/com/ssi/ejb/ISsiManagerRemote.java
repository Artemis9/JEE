package com.ssi.ejb;

import com.ssi.persistence.*;
import java.rmi.RemoteException;
import java.util.List;
import java.sql.*;

import com.ssi.bean.DetailReadings;
import com.ssi.bean.DownloadReadings;
import com.ssi.bean.MeasurementSummary;

public interface ISsiManagerRemote extends javax.ejb.EJBObject {
	public IPersistenceObject GetGatewayInfo(Long id, boolean deep,boolean alarmCheck) throws RemoteException, CSsiManagerException;
	
	public IPersistenceObject  UpdateGatewayInfo(CGateway gw) throws RemoteException, CSsiManagerException;
	public IPersistenceObject UpdateMeasurementInfo(CMeasurement m, Boolean bUserChangeableCoeffs, Boolean bUserChangeableUnit) throws RemoteException, CSsiManagerException;
	public IPersistenceObject UpdateWsmInfo(CWirelessSensorModule m) throws RemoteException, CSsiManagerException;

	public IPersistenceObject GetMeasurementInfo(Long id) throws RemoteException, CSsiManagerException;
		
	public MeasurementSummary GetMeasurementSummary(Long id) throws RemoteException, CSsiManagerException ;
	// for graph
	public DetailReadings GetSensorDataInit(CMeasurement measurement, Long wsmId, Timestamp first, Timestamp last) throws RemoteException, CSsiManagerException;
	public List GetSensorData(Long mId, Long wsmId, Timestamp first, Timestamp last) throws RemoteException, CSsiManagerException;

	//public List GetSensorData(Long mId) throws RemoteException, CSsiManagerException ;
	// for download
	public DownloadReadings GetSensorDataInit(Long mId, Long wsmId, Timestamp first, Timestamp last) throws RemoteException, CSsiManagerException;
}

