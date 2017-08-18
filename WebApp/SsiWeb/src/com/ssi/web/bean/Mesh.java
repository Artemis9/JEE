/**
* Author: Artemis Ozten
* Date: 10/18/2005
* Description: The main page (gatewayContents.jsp) backing bean.
*/
package com.ssi.web.bean;

import java.util.*;
import java.net.SocketException;
import java.sql.Timestamp;

import javax.faces.context.FacesContext;
import javax.faces.context.ExternalContext;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletOutputStream;

import javax.servlet.http.HttpServletRequest;

import com.ssi.util.CDateUtil;
import com.ssi.util.CMathUtil;
import com.ssi.util.CTextUtil;
import com.ssi.persistence.*;
import com.ssi.common.IApplicationConstants;
import com.ssi.web.common.*;
import com.ssi.bean.DownloadReadings;
import com.ssi.ejb.ISsiManagerLocal;
import com.ssi.ejb.IAlarmManagerLocal;
public class Mesh extends ABusinessObject
{
private static final long serialVersionUID = -3803522420899175173L;
private Long nextMeasurementInterval;
private Long measurementinterval;
private Long lastMeasurementinterval;
private Long nextfetchinterval;
private Long tzo;
private String saluName;
private Long accountId;
private List wsms;
private long lastRefreshMs;
private Short serviceLevel; // standard=1, premium=2

public Mesh () { sessionFail=false; updateFail1=false;}

public Long getMeasurementinterval() {
	return measurementinterval;
}

public synchronized void setMeasurementinterval(Long measurementinterval) {
	this.measurementinterval = measurementinterval;
}

public Long getTzo() {
	return tzo;
}

public void setTzo(Long tzo) {
	this.tzo = tzo;
}

public Long getAccountId() {
	return accountId;
}

public void setAccountId(Long accountId) {
	this.accountId = accountId;
}

public String getSaluName() {
	return saluName;
}

public void setSaluName(String saluName) {
	this.saluName = saluName;
}

private  CGateway initMeshFromDB(Long id, boolean checkAlarms) throws Exception { //make sure eui is coverted to uppercase!!!
	CGateway gw=null;
    try {
		ISsiManagerLocal sm = initSsiEjbLocal();
		
		gw = (CGateway)sm.GetGatewayInfo(id, true, checkAlarms); // deep fetch
		
		setBean(gw);
	
    } catch (Exception e){
    	logExceptionMessage(e,"initMeshFromDB(id)");
	    throw (e);
    }
	return(gw);
}//initMeshFromDB


public List getWsms() {
	return wsms;
}

public synchronized void  setWsms(List wsms) {
	this.wsms = wsms;
}
protected String getExceptionMessage (Exception e) {
	return "Error in Mesh business object";
}

public Long getNextfetchinterval() {
	return nextfetchinterval;
}

public synchronized void setNextfetchinterval(Long nextfetchinterval) {
	this.nextfetchinterval = nextfetchinterval;
}

// Should be synchronized but not currently, need to revisit
private  void setBean(CGateway gw){
	this.id = gw.getId();
	this.name = gw.getName();
	this.measurementinterval = gw.getMeasurementInterval();
}
protected synchronized void init()   {
	LOG.info("XXXXXXXX In Init()  lastRefreshMs = "+ lastRefreshMs);
	this.lastRefreshMs = CDateUtil.getCurrentDSTmslong();
	this.sessionFail = false;
	try {	
		ExternalContext eCtx = FacesContext.getCurrentInstance().getExternalContext();
		if (this.id == null)  { // initialize session,etc
			Map session = eCtx.getSessionMap();
			this.id= (Long) session.get(IURLConstants.GATEWAY_ID);
			if (this.id == null) {// session expired
				sessionFail=true;
				return;
			}
			// keep the session as clean as possible
			session.remove(IURLConstants.GATEWAY_ID);
			
			this.tzo = (Long) session.get(IURLConstants.USER_TZO);
			LOG.debug("XXXXXXXX In Mesh.init()userTz = "+this.tzo);
			this.tzo = ((this.tzo == null)?Long.valueOf(0): this.tzo);
			session.remove(IURLConstants.USER_TZO);
			Boolean b = (Boolean)session.get(IURLConstants.ROLE_ADMIN);
			//LOG.info("XXXXXXXX In Mesh.init()ROLE_ADMIN = "+b);
			if (b != null ) this.admin = b.booleanValue();
			session.remove(IURLConstants.ROLE_ADMIN);
			
			this.accountId = (Long)session.get(IURLConstants.ACCOUNT_ID);
			session.remove(IURLConstants.ACCOUNT_ID);
			
			this.saluName = (String)session.get(IURLConstants.SALU_NAME);
			session.remove(IURLConstants.SALU_NAME);
			
			this.serviceLevel = (Short)session.get(IURLConstants.SERVICE_LEVEL);
			LOG.debug("XXXXXXXX In Mesh.init()service level = "+this.serviceLevel);
			session.remove(IURLConstants.SERVICE_LEVEL);
		}
		
		HttpServletRequest request = (HttpServletRequest) eCtx.getRequest();
		String strId=request.getParameter(IURLConstants.MEASUREMENT_ID);
		
		if (strId == null) {
			updateFail1 = false;
		}

		Set pWsms = initMeshFromDB(this.id, this.serviceLevel.shortValue() == IApplicationConstants.SERVICE_LEVEL_PREMIUM).getWsms();
		if (pWsms == null){
			LOG.error("Can't instantiate Mesh object wsms from persistence object; pWsms = null");
		} else {
			this.wsms = new Vector();
			Iterator iter = pWsms.iterator();
			while (iter.hasNext()){
				this.wsms.add( new MeshWsm((CWirelessSensorModule) iter.next(), this.tzo));
			}
			//Collections.sort(this.wsms);
		} //else

		//Start syncronizing the server and the gateway
		// 1. Obtain gateway's last measurement time
		Timestamp gatewayTs=getLatestPodTime();
		long nextfetchint;
		// 2. Obtain server's current time
		// 3. Set servers next fetch time to just about 5 seconds after gateway's data update time
		//   ( 5 seconds cover internet/network delays and Listener's DB operations )
		// 4. If there have been no new gateway data coming in just keep fetching every measurementinterval ms.
		LOG.info("XXXXXXXX In Gateway.init() measurement interval="+this.measurementinterval.longValue()+" this.lastMeasurementinterval="+this.lastMeasurementinterval);
		if (gatewayTs != null) {	
			// if the inerval has been reduced wait until Gateway cathes up...
			if (this.lastMeasurementinterval !=null ) 
				nextfetchint = this.lastMeasurementinterval.longValue();
			else {
				nextfetchint = this.measurementinterval.longValue() ;
				this.lastMeasurementinterval = this.measurementinterval;
			}
			// Calculate the next next fetxh interval that is only a prediction of the future arrival
			nextfetchint =  gatewayTs.getTime() + nextfetchint + IApplicationConstants.MAX_SERVER_LAG_TIME_MS - lastRefreshMs;		
			this.nextMeasurementInterval = Long.valueOf(nextfetchint);
			// Logically next measurement interval must be equal to next fetch interval
			this.nextfetchinterval = Long.valueOf(nextfetchint);
			LOG.info("XXXXXXXX In Gateway.init() nextfetchint = nextMeasurementInterval =" + nextfetchint);
			// ...however, next fetch interval can not be shorter than 30 seconds or greater than session expiration time
			if (this.nextfetchinterval.longValue() < IApplicationConstants.MIN_MEASUREMENT_INTERVAL_MS) {
				// Now make the next measurement interval (display clock) equal to next fetch interval if, it is a positive number
				// if it is a negative number, then no measurements have been arriving. That is a diffrent case that need to be caugt in javascript
				this.nextfetchinterval = this.lastMeasurementinterval;
				if (this.nextMeasurementInterval.longValue() >= 0) this.nextMeasurementInterval = this.lastMeasurementinterval;
			}
			if (this.nextfetchinterval.longValue() > IWebConstants.MIN_SESSION_LIFETIME_MS)
		    	this.nextfetchinterval = Long.valueOf(IWebConstants.MIN_SESSION_LIFETIME_MS);
		}
		else {
			this.nextfetchinterval = (this.measurementinterval.longValue() > IWebConstants.MIN_SESSION_LIFETIME_MS ? Long.valueOf(IWebConstants.MIN_SESSION_LIFETIME_MS) : this.measurementinterval);
			this.nextMeasurementInterval = this.nextfetchinterval;
		}
		//Last measurement interval is nolonger different from the measurement interval after only 1 cycle.
		this.lastMeasurementinterval = this.measurementinterval;
		LOG.info("XXXXXXXX In Gateway.init() this.nextfetchinterval = "+ this.nextfetchinterval);
	} //try
	catch (Exception e){
		logExceptionMessage(e,"init()");
    }
}
private Timestamp getLatestPodTime() {
	Timestamp gatewayTs=null;
	Timestamp tempTs = null;
	if (this.wsms != null) {
		Iterator iter = this.wsms.iterator();
		while ( iter.hasNext()) {
			MeshWsm mWsm = (MeshWsm) iter.next();
		    tempTs = mWsm.getLastDataTs();
		    if (gatewayTs == null || (tempTs != null && tempTs.after(gatewayTs))) 
		    	gatewayTs = tempTs;
		}//while
	}
	return gatewayTs;
}
public String getLastRefreshTime()  {
	if (this.tzo == null)
		return null;
	LOG.debug("\ntzo.longValue(): "+this.tzo.longValue());		
	Timestamp clientTs = CDateUtil.getCurrentLocalTime(this.lastRefreshMs,this.tzo.longValue());
	LOG.debug("\nclientTs: "+clientTs);
	return (clientTs.toString()); 
}

public synchronized String  putToHistory() {
	LOG.info("XXXXXXXXX  IN put to history()  XXXXXXXXX ");
	updateFail1 = false;
	try {  
		HttpServletRequest request = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();
		String strId=request.getParameter(IURLConstants.MEASUREMENT_ID);
		Long mId = Long.valueOf(strId);
		LOG.info("strId="+strId);
		List idList = new Vector();
		idList.add(mId);
		// call ejb to push list of alarms to history
		IAlarmManagerLocal am = initAlarmEjbLocal();
		am.PutAlarmsInHistory(idList);
		MeshMeasurement mm = getMeshMeasurement(mId);
		mm.setAlarmActive(Boolean.valueOf(false));
		mm.setAlarmName(null);
		mm.setAlarmTs(null);
		mm.setAlarmValue(null);

	} catch (Exception e){
		updateFail1 = true;
		logExceptionMessage(e,"putToHistory()");
		return(ACTION_RET_FAILED);
    }
	//this.updateOk = true;
	return(ACTION_RET_MOVE_HIST);
}
public MeshMeasurement getMeshMeasurement(Long mId){
	Iterator iter = this.getWsms().iterator();
	while (iter.hasNext()) {
		MeshWsm wsm = (MeshWsm) iter.next();
		List ms = wsm.getMeasurements();
		if (ms != null){
			Iterator iter1 = ms.iterator();
			while (iter1.hasNext()){
				MeshMeasurement m = (MeshMeasurement) iter1.next();
				if (m.getId().longValue() == mId.longValue()) {
					return m;
				}//if
			} //while	
		} //if
	}//while	
	return null;
}
public MeshWsm getMeshWsm(Long wId){
	Iterator iter = this.getWsms().iterator();
	while (iter.hasNext()) {
		MeshWsm w = (MeshWsm) iter.next();
		if (w.getId().longValue() == wId.longValue()) {
			return(w);			
		} //if
	}//while
	return null;
}

public String doDownload() {
	LOG.info("XXXXXIn mesh.DoDownload()");
	updateFail1 = false;
	FacesContext ctx = FacesContext.getCurrentInstance();
	MeshMeasurement mm=null;
	ISsiManagerLocal sm=null;
	Timestamp first=null;
	Long mId=null;
	Long wsmId=null;
	try {
		if (!ctx.getResponseComplete()) {
			
			HttpServletRequest request = (HttpServletRequest) ctx.getExternalContext().getRequest();
			String strId=request.getParameter(IURLConstants.MEASUREMENT_ID);
			mId = Long.valueOf(strId);
			
			strId=request.getParameter(IURLConstants.WSM_ID);
			wsmId = Long.valueOf(strId);
			LOG.info("mId="+mId+" wsmId="+wsmId);
			
			mm = this.getMeshMeasurement(mId);			
			sm = initSsiEjbLocal();			
			first =  CDateUtil.get365DayDST();
			//LOG.info("first="+first);
			//LOG.info("days90_ms="+CDateUtil.days90_ms);
			//LOG.info("getCurrentDSTmslong()="+CDateUtil.getCurrentDSTmslong());
			//LOG.info("getCurrentDSTmslong()-CDateUtil.days90_ms="+ (CDateUtil.getCurrentDSTmslong()- CDateUtil.days90_ms));
			//LOG.info("Timestamp(getCurrentDSTmslong()-CDateUtil.days90_ms)="+ new Timestamp(CDateUtil.getCurrentDSTmslong()- CDateUtil.days90_ms));
			this.download(sm, ctx, mm, mId, wsmId, first);
			ctx.responseComplete();
		}
		else return(ACTION_RET_FAILED); 
	} catch (SocketException e) {
		logExceptionMessage(e,"Socket exception in doDownload(); retrying");
		try {	
			if (ctx != null && !ctx.getResponseComplete()) { 
				this.download(sm, ctx, mm, mId, wsmId, first);	
				ctx.responseComplete();
			} else return(ACTION_RET_FAILED); 
		} catch (Exception ex) {
	    	updateFail1 = true;
			logExceptionMessage(ex,"doDownload(); Second Try");
			return(ACTION_RET_FAILED);
	    }
	} catch (Exception e) {
    	updateFail1 = true;
		logExceptionMessage(e,"doDownload()");
		return(ACTION_RET_FAILED);
    } /*finally {
    	if (ctx != null && !ctx.getResponseComplete())
    		ctx.responseComplete();
    }*/
	//updateOk = true;
	return(ACTION_RET_DOWNLOAD);
}
private void download (ISsiManagerLocal sm, FacesContext ctx, MeshMeasurement mm, Long mId, Long wsmId, Timestamp first) throws Exception
{
	HttpServletResponse response = null;
	ServletOutputStream out = null;
	try {
		DownloadReadings dr = sm.GetSensorDataInit(mId, wsmId, first, null);		// first inclusive, last is now	
		List sdList = dr.getSensorDataList();
		
		String fileName = mm.getName() +"_data.csv";
		String contentType = "csv/plain"; //"text/plain";
	
		response = (HttpServletResponse)ctx.getExternalContext().getResponse();
		response.setContentType(contentType);
		response.setHeader("Content-Disposition","attachment;filename=\"" + fileName + "\""); 
	
	    out = response.getOutputStream(); 
		out.flush(); // just clean up
		//LOG.info("list size="+sdList.size()+" total="+dr.getTotal());
		long total = dr.getTotal().longValue();
		while  (sdList !=null && sdList.size() > 0 ) {
			SensorData sd=null;
			Iterator iter = sdList.iterator();
			do  {
				sd = (SensorData) iter.next();
				String str = CTextUtil.DateFormat(CDateUtil.CalcLocalTime(sd.getTs(), this.tzo),"MM/dd/yy HH:mm:ss");
				out.println(str+","+CMathUtil.CalcMeasurement(sd.getValue().floatValue(),
					 mm.getCoeff1().floatValue(),
					 mm.getCoeff2().floatValue(),
					 mm.getCoeff3().floatValue(),
					 mm.getCoeff4().floatValue()));
			} while (iter.hasNext());
			
			if (total > sdList.size()) {
				total -= sdList.size();
				sdList = sm.GetSensorData(mId, wsmId,first,sd.getTs()); 
			}
			else 
				sdList=null;
			out.flush();
		} //while
	} catch (Exception e) {
		throw (e);
	} finally {
		if (out != null)
			out.close();
	}
}
public synchronized String  doLogout() {
	LOG.info("XXXXXXXXX  IN doLogout()  XXXXXXXXX ");
	updateFail1 = false;
	try {  
		Map session = FacesContext.getCurrentInstance().getExternalContext().getSessionMap();
		//session.clear();
		session.remove(IURLConstants.GATEWAY_ID); 
		session.remove(IURLConstants.ACCOUNT_ID);
		session.remove(IURLConstants.ROLE_ADMIN);
	    session.remove(IURLConstants.USER_TZO);
	    session.remove(IURLConstants.SALU_NAME);
	    session.remove(IURLConstants.SERVICE_LEVEL);
	    session.remove(IURLConstants.MESH_BEAN);
	} catch (Exception e){
		updateFail1 = true;
		logExceptionMessage(e,"doLogout()");
		return(ACTION_RET_FAILED);
    }
	//this.updateOk = true;
	return(ACTION_RET_SESSION_LOGOFF);
}

public Short getServiceLevel() {
	return serviceLevel;
}

public void setServiceLevel(Short serviceLevel) {
	this.serviceLevel = serviceLevel;
}

public Long getNextMeasurementInterval() {
	return nextMeasurementInterval;
}

public void setNextMeasurementInterval(Long nextMeasurmentInterval) {
	this.nextMeasurementInterval = nextMeasurmentInterval;
}

public void setLastRefreshTime(String lastRefreshT) {

}

public Long getLastMeasurementinterval() {
	return lastMeasurementinterval;
}

public void setLastMeasurementinterval(Long lastMeasurementinterval) {
	this.lastMeasurementinterval = lastMeasurementinterval;
}

}//Mesh
