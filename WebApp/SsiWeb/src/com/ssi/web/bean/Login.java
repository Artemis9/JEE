package com.ssi.web.bean;

import java.util.*;
import javax.faces.context.FacesContext;

import com.ssi.ejb.IAccountManagerLocal;
import com.ssi.bean.*;
import com.ssi.web.common.*;

/**
 * @author AAO
 *
 */
public class Login extends ABusinessObject {

	private String mac;
	private String password;
	private  Long tzo; // time zone difference
	private boolean accessGranted = true;

	
public  Login(){accessGranted = true;}

public void init() {
	LOG.info("In Login object, init() AccessGranted="+this.accessGranted);
}

public String getMac() {
	return mac;
}

public void setMac(String mac) {
	this.mac = mac.toLowerCase();
}

public String getPassword() {
	return password;
}

public void setPassword(String password) {
	this.password = password;
}
public void setTzo(Long tzOff)  {
	this.tzo = tzOff;
}

public Long getTzo ()  {
return this.tzo;
}

public boolean isAccessGranted() {
	return accessGranted;
}

public void setAccessGranted(boolean accessGranted) {
	this.accessGranted = accessGranted;
}

// in all action methods use try-catch block.
public String  doLogin() {
	try {
		LOG.info("In Login object, doLogin() mac= "+this.getMac());
				
		IAccountManagerLocal sm =  this.initAccountEjbLocal();
		
		AccountSummary as = (AccountSummary)sm.GetGatewayAccount(mac,this.name,this.password);
		if (as == null) {
			this.accessGranted = false;
			LOG.debug("AccessGranted="+this.accessGranted);
			return ACTION_RET_FAILED;
		}
		Map session = FacesContext.getCurrentInstance().getExternalContext().getSessionMap();
		session.put(IURLConstants.GATEWAY_ID, as.getGatewayId()); 
		session.put(IURLConstants.ACCOUNT_ID, as.getAccountId());
		session.put(IURLConstants.ROLE_ADMIN, as.getAdmin());
	    session.put(IURLConstants.USER_TZO, this.tzo);
	    if (as.getName() == null) 
	    	as.setName("");
	    if (as.getLname() == null) 
	    	as.setLname("");
	    session.put(IURLConstants.SALU_NAME, as.getName()+" "+as.getLname());
	    session.put(IURLConstants.SERVICE_LEVEL, as.getServiceLevel());
	    session.remove(IURLConstants.MESH_BEAN);
	} catch (Exception e){
		logExceptionMessage(e,"login()");
		this.accessGranted = false;
		LOG.error("AccessGranted="+this.accessGranted);
	    return ACTION_RET_FAILED;
    }
	return  ACTION_RET_SUCCESS;
}
protected String getExceptionMessage (Exception e) {
	return "Error in Login business object";
}

}
