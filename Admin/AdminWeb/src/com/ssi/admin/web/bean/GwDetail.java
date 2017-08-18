package com.ssi.admin.web.bean;

import java.util.*;

import javax.faces.context.*;
import javax.servlet.http.HttpServletRequest;

import com.ssi.admin.ejb.IAdminManagerLocal;
import com.ssi.persistence.*;
import com.ssi.util.CDateUtil;
import com.ssi.admin.bean.CGatewaySummary;
import com.ssi.common.*;


public class GwDetail extends AAdminObject {

	private String password1;
	private String password2;
	private String password12;
	private String password22;
	private String userName1;
	private String userName2;
	
	public static final String []serviceLevels = {Short.valueOf(IApplicationConstants.SERVICE_LEVEL_PREMIUM).toString(), Short.valueOf(IApplicationConstants.SERVICE_LEVEL_STANDARD).toString()};
	private Long accountId;
	private Long role1Id;
	private Long role2Id;
	private String serviceLevel;
	private String mac;
	private String firstEventTs;
	private String lastEventTs;
	private String fwVersion;
	private String hwVersion;
	private String radioFwVersion;
	private Integer firstEventCodeInt;
	private Integer lastEventCodeInt;
	private Long maxHeartbeatInterval;
	private Long measurementInterval;
	private Long wakeupInterval;
    private Long tzo;
    private boolean userAdmin1;
    private boolean userAdmin2;
    
	private Object[] wsms;
	
	public GwDetail() {//this.updateFail=false; this.updateFail1=false; this.updateFail2=false; this.updateOk=false;
	}
	
	protected  void init() {
		LOG.info("XXXXXXXXX  IN detail init()  updateOk="+updateOk+" updateFail="+updateFail+" updateFail1="+updateFail1+" updateFail2="+updateFail2);
        
		try {
			LOG.info("id="+this.id);
			
			if (this.id == null) {
				ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
				Map session = context.getSessionMap();
				this.tzo = (Long) session.get("USER_TZO");
				HttpServletRequest request = (HttpServletRequest) context.getRequest();
				LOG.info("tzo="+this.tzo);
				String strIndex = request.getParameter("gwId");
				if (strIndex==null) {
					LOG.warn("Could not find the gwId in request (null)");
					 this.id = (Long) context.getSessionMap().get("gwIdAdmin");
					LOG.info("From session  map this.id="+this.id);
				}
				if (strIndex==null && this.id == null) {
					LOG.error("Could not find the gwId in request (null) or request map");
					 LOG.error("this.id="+this.id);
				}
				else 
				{ //A particular gateay is asked to be seen. 
					if (strIndex != null) {
						Long index = Long.valueOf(strIndex);
						LOG.info("id of gw="+index);
						this.id = index;
					} //else  this.id != null 
					context.getSessionMap().put("gwIdAdmin",this.id);
					getGatewayDetails();
				}//else
			}//if
		}//try
		catch(Exception e) {
			logExceptionMessage(e,"init()");
		}
	} 
	
	private void getGatewayDetails() throws Exception {
		LOG.info("XXXXXXXXX  IN detail getGatewayDetails()  updateOk="+updateOk+" updateFail="+updateFail+" updateFail1="+updateFail1+" updateFail2="+updateFail2);
		 
		IAdminManagerLocal am = initAdminEjbLocal();
		CGatewaySummary gwSummary = (CGatewaySummary) am.GetGatewayInfo(this.id);
		CAccount account = gwSummary.getAccount();
		
		this.id = gwSummary.getId();
		this.accountId = account.getId();
		
		LOG.info("account id="+account.getId());
		Set contacts = account.getContacts();
		Iterator iter = contacts.iterator();
		CContact con = (CContact) iter.next();
		Set roles = con.getRoles();
		Iterator iter1 = roles.iterator();
		CRole role1 = (CRole)iter1.next();
		LOG.info("role1 id="+role1.getId());
		con = (CContact) iter.next();
		roles = con.getRoles();
		iter1 = roles.iterator();
		CRole role2 = (CRole)iter1.next();
		LOG.info("role2 id="+role2.getId());
		CListenerEvent fle = gwSummary.getFirstEvent();
		LOG.info("first le id="+fle.getId());
		CListenerEvent lle = gwSummary.getLastEvent();
		LOG.info("last le id="+lle.getId());
		
		this.serviceLevel = account.getServiceLevel().toString();
		this.role1Id = role1.getId();
		this.role2Id = role2.getId();
		this.userName1 = role1.getUname();
		this.userName2 = role2.getUname();
		this.userAdmin1 = role1.getAdmin().booleanValue();
		this.userAdmin2 = role2.getAdmin().booleanValue();
		this.name = gwSummary.getName();
		this.mac = gwSummary.getMac();
		this.fwVersion = gwSummary.getFwVersion();
		this.hwVersion = gwSummary.getHwVersion();
		this.radioFwVersion = gwSummary.getRadioFwVersion();
		this.wakeupInterval = Long.valueOf(gwSummary.getWakeupInterval().longValue()/1000);
		this.measurementInterval = Long.valueOf(gwSummary.getMeasurementInterval().longValue()/1000);
		this.maxHeartbeatInterval = Long.valueOf(gwSummary.getMaxHeartBeatInterval().longValue()/1000);
		this.firstEventTs = CDateUtil.CalcLocalTime(fle.getTs(),this.tzo).toString();
		this.lastEventTs = CDateUtil.CalcLocalTime(lle.getTs(),this.tzo).toString();
		this.lastEventCodeInt = lle.getEventCode();
		this.firstEventCodeInt = fle.getEventCode();
		LOG.info("lasteventcode="+this.getLastEventCode());
		LOG.info("firsteventcode="+this.getFirstEventCode());
		LOG.info("admin1="+this.isUserAdmin1());
		LOG.info("admin1="+this.isUserAdmin2());
		this.wsms = gwSummary.getWsms().toArray();
	}
	public String doUpdate() {
		LOG.info("XXXXXXXXX  IN DO-UPDATE()  XXXXXXXXX");
		this.updateOk=false; this.updateFail=false; this.updateFail1=false; this.updateFail2=false; 
		// the following condition should never be met because of front-end control.
		try {
			// Check to make sure pw1 & pw12 are identical 
			if (!this.password1.contentEquals(this.password12)) {
				LOG.debug("!!!!!!!!!!!!!!!!pw1!=pw12");
				this.updateFail=true;
				return ACTION_RET_FAILED;
			}
			//	Check to make sure pw2 & pw22 are identical 
			if ( !this.password2.contentEquals(this.password22)) {
				LOG.debug("!!!!!!!!!!!!!!!! pw2!=pw22");
				this.updateFail1=true;
				return ACTION_RET_FAILED;
			}
			LOG.info("service level="+this.getServiceLevel());
			LOG.info("account id="+this.getAccountId());
			LOG.info("role1 id="+this.getRole1Id());
			LOG.info("role2 id="+this.getRole2Id());
			CAccount acc = new CAccount();
			acc.setId(this.accountId);
			acc.setServiceLevel(Short.valueOf(this.serviceLevel));
			
			CRole role1 = new CRole();
			role1.setId(this.role1Id);
			role1.setPw(this.password1);
			
			CRole role2 = new CRole();
			role2.setId(this.role2Id);
			role2.setPw(this.password2);

			IAdminManagerLocal am = initAdminEjbLocal();
			CGateway gw = (CGateway) am.UpdateAdminInfo(this.id, acc, role1, role2);
			this.wsms = gw.getWsms().toArray();
			
		} catch (Exception e){
			this.updateFail2 = true;
			LOG.error("Exception in GwDetail.doUpdate()");
			return ACTION_RET_FAILED;
		}
		this.updateOk = true;
	    return ACTION_RET_UPDATE;
	}
	/*
	public String doDeletePod() {
		LOG.info("XXXXXXXXX  IN DO-DELETE-POD()  XXXXXXXXX");
		// the following condition should never be met because of front-end control.
		try {
			ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
			HttpServletRequest request = (HttpServletRequest) context.getRequest();
			String strIndex = request.getParameter("podId");
			if (strIndex==null) {
				LOG.error("Could not find the podId in request (null)");
			}
			else 
			{ //A particular pod is asked to be deleted. 
				Long index = Long.valueOf(strIndex);
				LOG.info("id of pod="+index);
				IAdminManagerLocal am = initAdminEjbLocal();
				am.DeletePod(index);
				CGateway gw = (CGateway) am.GetGatewayPods(this.id);
				this.wsms = gw.getWsms().toArray();
			}
			
		} catch (Exception e){
			this.updateFail2 = true;
			LOG.error("Exception in GwDetail.doDeletePod()");
			return ACTION_RET_FAILED;
		}
		this.updateOk = true;
	    return ACTION_RET_DELETE_POD;
	}
	*/
	
	
	public Long getAccountId() {
		return  this.accountId;
	}
	public void setAccountId(Long id) {
		this.accountId=id;
	}
	public Long getRole1Id() {
		return this.role1Id;
	}
	public void setRole1Id(Long id) {
		this.role1Id = id;
	}
	public Long getRole2Id() {
		return this.role2Id;
	}
	public void setRole2Id(Long id) {
		this.role2Id = id;
	}
	public String getInit() {
		//LOG.info("XXXXXXXXX  IN getInit()  XXXXXXXXX");
		init();
		return("");
	}
	public String getFinalize() {
		LOG.info("XXXXXXXXX  IN getFinalize()  XXXXXXXXX");
		this.updateFail=false; this.updateFail1=false; this.updateFail2=false; this.updateOk=false;
		return("");
	}

	public String  getLastEventCode() {	
		return getEventCode(this.lastEventCodeInt.intValue()) ;
	}
 
	public String  getFirstEventCode() {	
		return getEventCode(this.firstEventCodeInt.intValue()) ;
	}
	
	private String  getEventCode(int eCode) {	
		switch (eCode) {
			case IRequestCodes.GATEWAY_HEARTBEAT: return "(Gateway Heartbeat)";
			case IRequestCodes.GATEWAY_HELLO : 
			case IRequestCodes.GATEWAY_HELLO_POWER : 
			case IRequestCodes.GATEWAY_HELLO_RECOVER : 
			case IRequestCodes.GATEWAY_HELLO_RESET : 
			case IRequestCodes.GATEWAY_HELLO_UPGRADE : return "(Gateway Hello)";
			case IRequestCodes.UPDATE_SENSOR_DATA: return "(New Sensor Reading)";
			case IRequestCodes.UPDATE_WSM_CONFIG: return "(Configure or Update a POD)";
		}
		return "(Unknown Event)";
	}

	public String getServiceLevel() {
		return this.serviceLevel;
	}

	public void setServiceLevel(String arg0) {
		this.serviceLevel=arg0;
	}
	public String getPassword1() {
		return password1;
	}

	public void setPassword1(String password1) {
		this.password1 = password1;
	}

	public String getPassword12() {
		return password12;
	}

	public void setPassword12(String password12) {
		this.password12 = password12;
	}

	public String getPassword2() {
		return password2;
	}

	public void setPassword2(String password2) {
		this.password2 = password2;
	}

	public String getPassword22() {
		return password22;
	}

	public void setPassword22(String password22) {
		this.password22 = password22;
	}
	
	public String getUserName1() {
		return this.userName1;
	}
	public String getUserName2() {
		return this.userName2;
	}
	
	public String getFirstEventTs() {
		return firstEventTs;
	}

	public String getFwVersion() {
		return fwVersion;
	}

	public String getHwVersion() {
		return hwVersion;
	}


	public String getLastEventTs() {
		return lastEventTs;
	}

	public String getMac() {
		return mac;
	}

	public String getRadioFwVersion() {
		return radioFwVersion;
	}

	

	public Integer getFirstEventCodeInt() {
		return firstEventCodeInt;
	}

	public void setFirstEventCodeInt(Integer firstEventCodeInt) {
		this.firstEventCodeInt = firstEventCodeInt;
	}

	public Integer getLastEventCodeInt() {
		return lastEventCodeInt;
	}

	public void setLastEventCodeInt(Integer lastEventCodeInt) {
		this.lastEventCodeInt = lastEventCodeInt;
	}
    
	
	
	public void setFirstEventTs(String firstEventTs) {
		this.firstEventTs = firstEventTs;
	}

	public void setFwVersion(String fwVersion) {
		this.fwVersion = fwVersion;
	}

	public void setHwVersion(String hwVersion) {
		this.hwVersion = hwVersion;
	}

	public void setLastEventTs(String lastEventTs) {
		this.lastEventTs = lastEventTs;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}



	public void setRadioFwVersion(String radioFwVersion) {
		this.radioFwVersion = radioFwVersion;
	}

	public void setUserName1(String userName1) {
		this.userName1 = userName1;
	}

	public void setUserName2(String userName2) {
		this.userName2 = userName2;
	}



	public Long getMaxHeartbeatInterval() {
		return maxHeartbeatInterval;
	}

	public void setMaxHeartbeatInterval(Long maxHeartbeatInterval) {
		this.maxHeartbeatInterval = maxHeartbeatInterval;
	}

	public Long getMeasurementInterval() {
		return measurementInterval;
	}

	public void setMeasurementInterval(Long measurementInterval) {
		this.measurementInterval = measurementInterval;
	}

	public Long getWakeupInterval() {
		return wakeupInterval;
	}

	public void setWakeupInterval(Long wakeupInterval) {
		this.wakeupInterval = wakeupInterval;
	}

	public String[] getServiceLevels() {
		return serviceLevels;
	}
	protected String getExceptionMessage (Exception e) {
		return "Error in GwDetail admin object";
	}

	

	public boolean isUserAdmin1() {
		return userAdmin1;
	}

	public void setUserAdmin1(boolean userAdmin1) {
		this.userAdmin1 = userAdmin1;
	}

	public boolean isUserAdmin2() {
		return userAdmin2;
	}

	public void setUserAdmin2(boolean userAdmin2) {
		this.userAdmin2 = userAdmin2;
	}

	public Long getTzo() {
		return tzo;
	}

	public void setTzo(Long tzo) {
		this.tzo = tzo;
	}

	public Object[] getWsms() {
		return wsms;
	}
	
}
