package com.ssi.web.bean;

import javax.naming.Context;
import javax.naming.InitialContext;
import org.apache.log4j.Logger;
import com.ssi.ejb.ISsiManagerHome;
import com.ssi.ejb.ISsiManagerLocal;
import com.ssi.ejb.IAccountManagerHome;
import com.ssi.ejb.IAccountManagerLocal;
import com.ssi.ejb.IAlarmManagerHome;
import com.ssi.ejb.IAlarmManagerLocal;
import com.ssi.common.IJNDINames;
import com.ssi.util.CTextUtil;
import com.ssi.web.jsf.*;

/**
 * @author AAO
 *
 */
public abstract class ABusinessObject extends ADBObject implements IPhaseAware {
	static Logger LOG = Logger.getLogger(ABusinessObject.class.getName());
//	 status codes
	public static final String ACTION_RET_FAILED = "Failed";
	public static final String ACTION_RET_SUCCESS = "Success";
	//  action codes
	public static final String ACTION_RET_UPDATE = "Update";
	public static final String ACTION_RET_UPDATE_AND_CLOSE = "UpdateAndClose";
	public static final String ACTION_RET_REFRESH = "Refresh";
	public static final String ACTION_RET_DOWNLOAD = "Download";
	public static final String ACTION_RET_MOVE_HIST = "MoveHistory";
	public static final String ACTION_RET_SESSION_EXPIRED = "SessionExpired";
	public static final String ACTION_RET_SESSION_LOGOFF = "SessionLogoff";
    protected boolean admin;
	protected boolean updateOk;
	protected boolean updateFail1=false;
	protected boolean sessionFail=false;

    /*************************The following is from Initailizable bean ***************/
	private transient boolean notValidated;
	/*********************************************************************************/

	public boolean isAdmin() {
		return admin;
	}
	public void setAdmin(boolean admin) {
		this.admin = admin;
	}
	public boolean isUpdateFail1() {
		return updateFail1;
	}
	public void setUpdateFail1(boolean updateFail1) {
		this.updateFail1 = updateFail1;
	}
	public boolean isUpdateOk() {
		return updateOk;
	}
	public void setUpdateOk(boolean updateOk) {
		this.updateOk = updateOk;
	}
	public boolean isSessionFail() {
		return sessionFail;
	}

	public void setSessionFail(boolean sessionFail) {
		this.sessionFail = sessionFail;
	}


	/**
	 * Called by the process function in the catch (Exception) block
	 * This will return a specific error message for each handler within which
	 * any exception generated and the error message gets displayed on info.jsp
	 */
	protected abstract String getExceptionMessage (Exception e);
	
	//	 Prepare to call EJB
	protected ISsiManagerLocal initSsiEjbLocal() throws Exception {
	    Context jndiContext      = new InitialContext();
	    ISsiManagerHome home = (ISsiManagerHome) jndiContext.lookup(IJNDINames.SSI_MANAGER_LOCAL_HOME);
		
		return(home.create());
	}
	
//	 Prepare to call EJB
	protected IAccountManagerLocal initAccountEjbLocal() throws Exception {
	    Context jndiContext      = new InitialContext();
	    IAccountManagerHome home = (IAccountManagerHome) jndiContext.lookup(IJNDINames.ACCOUNT_MANAGER_LOCAL_HOME);
		
		return(home.create());
	}
	protected IAlarmManagerLocal initAlarmEjbLocal() throws Exception {
	    Context jndiContext      = new InitialContext();
	    IAlarmManagerHome home = (IAlarmManagerHome) jndiContext.lookup(IJNDINames.ALARM_MANAGER_LOCAL_HOME);
		
		return(home.create());
	}
	protected void logExceptionMessage(Exception e, String funcName) {
		LOG.error(getExceptionMessage(e)+" method: "+funcName);
	    LOG.error("\nException Stack: "+CTextUtil.getStackTrace(e));
	}
	
	public String doUpdateAndClose()  {
		String ret = doUpdate();
		if (ret.compareTo(ACTION_RET_UPDATE) == 0) {
			LOG.info("XXXXXXXX ACTION_RET_UPDATE_AND_CLOSE XXXXXXXXX");
			return (ACTION_RET_UPDATE_AND_CLOSE);
		}
		LOG.info("XXXXXXXX "+ ret +" XXXXXXXXX");
		return(ret);
	}
	
	public String doUpdate() {
		return(ACTION_RET_UPDATE);
	}
	
	/*************************The following is from Initailizable bean ***************/

	/**
	 * JSF doesn't provide a way to configure an initialization method which will
	 * be called after the contructor and all framework setters. By convention,
	 * our backing beans use this method. It's triggered either by a Faces configuration
	 * file setting "configured" to true, or by a JSF component directly calling "startRenderResponse".
	 *
	 * For greater subclassing flexibility, the init method is not declared to be
	 * abstract.
	 */
	protected void init() {
	}

	/**
	 * Remember if JSF entered the Validations phase. If so, and if we never
	 * reach the Update Model Values phase, then validation failed. That may
	 * be of interest to the backing bean. For example, the backing bean
	 * may choose not to requery and reload data on a validation error.
	 */
	public void endProcessValidators() {
		setNotValidated(true);
		LOG.info("endProcessValidators");
	}

	public void endProcessUpdates() {
		setNotValidated(false);
		LOG.info("endProcessUpdates");
	}

	/**
	 * Call init() at the beginning of every request rendering.
	 * (This should also work to refresh session-scoped beans, but it's
	 * only been tested with request scope.)
	 */
	public void startRenderResponse()  {
		LOG.info("startRenderResponse notValidated=" + isNotValidated());
		init();
	}

	public boolean isNotValidated() {
		return notValidated;
	}
	public void setNotValidated(boolean notValidated) {
		this.notValidated = notValidated;
	}

	/**
	 * Signals that configuration is finished.
	 */
	public void setConfigured(boolean isConfigured) throws Exception {
		LOG.info("setConfigured " + isConfigured);
		if (isConfigured) {
			init();
		}
	}
}
