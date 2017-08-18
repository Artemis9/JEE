package com.ssi.ejb;

import java.rmi.RemoteException;
import java.util.List;
import java.sql.*;
import com.ssi.persistence.CAlarmDefinition;
import com.ssi.persistence.IPersistenceObject;
import com.ssi.bean.AlarmHistoryDetails;

public interface IAlarmManagerRemote extends javax.ejb.EJBObject {
	
	public IPersistenceObject GetAlarmDefinition(Long measurId)throws RemoteException, CAlarmManagerException;
	public IPersistenceObject UpdateOrInsertAlarmDefinition(CAlarmDefinition aDef, Long measurId)throws RemoteException, CAlarmManagerException;
	
	public void PutAlarmsInHistory(List idList) throws RemoteException, CAlarmManagerException;
	public AlarmHistoryDetails GetAlarmHistory(Long gwId, Timestamp first, Timestamp last, int from, int max) throws RemoteException, CAlarmManagerException;
}
