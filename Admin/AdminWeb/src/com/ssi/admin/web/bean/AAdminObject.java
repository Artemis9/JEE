package com.ssi.admin.web.bean;
import javax.naming.Context;
import javax.naming.InitialContext;
import org.apache.log4j.Logger;
import com.ssi.admin.ejb.IAdminManagerHome;
import com.ssi.admin.ejb.IAdminManagerLocal;

import com.ssi.admin.common.IJNDINames;
import com.ssi.util.CTextUtil;

/**
 * @author AAO
 *
 */
public abstract class AAdminObject extends ADBObject  {

		static Logger LOG = Logger.getLogger(AAdminObject.class.getName());
//		 status codes
		public static final String ACTION_RET_FAILED = "Failed";
		public static final String ACTION_RET_SUCCESS = "Success";
		//  action codes
		public static final String ACTION_RET_UPDATE = "Update";
		public static final String ACTION_RET_DELETE_POD = "DeletePod";
		public static final String ACTION_RET_DELETE = "Delete";
		public static final String ACTION_RET_SESSION_EXPIRED = "SessionExpired";
		public static final String ACTION_RET_DETAIL = "Detail";
		
		protected boolean updateOk=false;
		protected boolean updateFail=false;
		protected boolean updateFail1=false;
		protected boolean updateFail2=false;
		protected boolean sessionFail=false;

	    /*************************The following is from Initailizable bean ***************/
		private transient boolean notValidated;
		/*********************************************************************************/

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

		public boolean isUpdateFail() {
			return updateFail;
		}
		public void setUpdateFail(boolean updateFail) {
			this.updateFail = updateFail;
		}
		
		public boolean isUpdateFail2() {
			return updateFail2;
		}
		public void setUpdateFail2(boolean updateFail2) {
			this.updateFail2 = updateFail2;
		}
		/**
		 * Called by the process function in the catch (Exception) block
		 * This will return a specific error message for each handler within which
		 * any exception generated and the error message gets displayed on info.jsp
		 */
		protected abstract String getExceptionMessage (Exception e);
		
		//	 Prepare to call EJB
		protected IAdminManagerLocal initAdminEjbLocal() throws Exception {
		    Context jndiContext      = new InitialContext();
		    IAdminManagerHome home = (IAdminManagerHome) jndiContext.lookup(IJNDINames.ADMIN_MANAGER_LOCAL_HOME);
			
			return(home.create());
		}
	
		protected void logExceptionMessage(Exception e, String funcName) {
			LOG.error(getExceptionMessage(e)+" method: "+funcName);
		    LOG.error("\nException Stack: "+CTextUtil.getStackTrace(e));
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
		protected abstract void init() ;

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

