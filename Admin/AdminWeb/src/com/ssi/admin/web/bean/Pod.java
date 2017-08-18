package com.ssi.admin.web.bean;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import com.ssi.admin.ejb.IAdminManagerLocal;

public class Pod extends AAdminObject {
    private Long gwId;
	public Pod() {;}
	
	protected  void init() {
		LOG.info("XXXXXXXXX  IN POD init()  XXXXXXXXX");
		try {
			if (this.id == null) {
				ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();				
				HttpServletRequest request = (HttpServletRequest) context.getRequest();			
				String strIndex = request.getParameter("podId");
				if (strIndex==null) {
					LOG.error("Could not find the podId in request (null)");
				}
				else 
				{ //A particular pod is asked to be seen. 
					this.id = Long.valueOf(strIndex);
					LOG.info("id of pod="+this.id);
				}//else
				strIndex = request.getParameter("podName");
				if (strIndex==null) {
					LOG.error("Could not find the podName in request (null)");
				}
				else 
				{ //A particular pod is asked to be seen. 
					this.name = strIndex;
					LOG.info("Name of pod="+this.name);
				}//else
				strIndex = request.getParameter("gwId");
				if (strIndex==null) {
					LOG.error("Could not find the gwId in request (null)");
				}
				else 
				{ //A particular pod is asked to be seen. 
					this.gwId = Long.valueOf(strIndex);
					LOG.info("Gw id of pod="+this.gwId);
				}//else
			}//if
			
		}
		catch(Exception e) {
			logExceptionMessage(e,"init()");
		}
		
	} 
	
	public String doDelete() {
		LOG.info("XXXXXXXXX  IN DO-DELETE()  XXXXXXXXX");
		String rc=ACTION_RET_DELETE;
		this.updateOk = true;
		// the following condition should never be met because of front-end control.
		try {
			IAdminManagerLocal am = initAdminEjbLocal();
			am.DeletePod(this.id);
			
		} catch (Exception e){
			this.updateFail2 = true;
			this.updateOk = false;
			LOG.error("Exception in Pod.doDelete()");
			rc= ACTION_RET_FAILED;
		}
		finally {
			// needed if another window is open and session is shared by multiple windows.
			ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();				
			context.getSessionMap().put("gwIdAdmin", this.gwId);
		}
        return rc;
	}
	
	public String getInit() {
		init();
		return("");
	}
	public void setInit(String str) {
		LOG.info("XXXXXXXXX  IN setInit()  XXXXXXXXX");
	}
	
    
	public Long getGwId() {
		return gwId;
	}

	public void setGwId(Long gwId) {
		this.gwId = gwId;
	}

	protected String getExceptionMessage (Exception e) {
		return "Error in Pod admin object";
	}
}
