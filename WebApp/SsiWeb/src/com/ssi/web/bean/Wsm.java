package com.ssi.web.bean;

import java.util.*;

import javax.servlet.http.HttpServletRequest;

import javax.faces.context.FacesContext;
import javax.faces.context.ExternalContext;

import com.ssi.ejb.ISsiManagerLocal;
import com.ssi.persistence.*;
import com.ssi.web.common.*;

/**
 * @author AAO
 *
 */
public class Wsm extends ABusinessObject implements IDescribableObject {

	private static final long serialVersionUID = 3946769224089025715L;
	public static final String[] jsSpecialChars={"'","\\"};
	public static final String[] jsSpecialCharsConv={"\'","\\\\"};
	
	protected String eui;
	protected String description;
	protected String notes;
	protected String hwversion;
	protected String fwversion;
	protected String typeName;

	//Create shallow bean for properties view/update.
	public Wsm()  {updateFail1=false;updateOk=false;}
    
	protected void init() {
		this.sessionFail=false;
		try {
			LOG.debug("XXXXXXXXX  IN init()  XXXXXXXXX this.id="+this.id);
			if (this.id==null){
				ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
				Map session = context.getSessionMap();
				Mesh mesh= (Mesh) session.get(IURLConstants.MESH_BEAN);
				if (mesh==null || mesh.id == null) {
					this.sessionFail = true;
					return;
				}
				else {
					HttpServletRequest request = (HttpServletRequest) context.getRequest();
					String strIndex = request.getParameter(IURLConstants.WSM_ID);
					if (strIndex==null) {
						LOG.error("Could not find the wsm_id in request (null)");
					}
					else 
					{ //A particular wsm is asked to be seen. Properties popup
						Long index = Long.valueOf(strIndex);
						LOG.info("id of wsm="+index);
						ISsiManagerLocal sm = initSsiEjbLocal();
						CWirelessSensorModule wsm = (CWirelessSensorModule)sm.GetWsmInfo(index);
						setBean(wsm);
						this.admin = mesh.isAdmin();
					} //else
				}//else
			}//if
		} catch (Exception e){
			logExceptionMessage(e,"Wsm.init()");
		}
	}
	public String getEui() {
		return this.eui;
	}

	public void setEui(String eui) {
		this.eui=eui;
	}
		
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getHwversion() {
		return hwversion;
	}

	public void setHwversion(String hwversion) {
		this.hwversion = hwversion;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes.length() > MAX_FORM_NOTES_LENGTH ? notes.substring(0,MAX_FORM_NOTES_LENGTH): notes;
	}

	public String getFwversion() {
		return fwversion;
	}

	public void setFwversion(String swversion) {
		this.fwversion = swversion;
	}

	protected String getExceptionMessage (Exception e) {
		return "Error in Wsm business object";
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String doUpdate()  {
		LOG.info("XXXXXXXXX  IN WSM DO-UPDATE()  XXXXXXXXX id="+this.id);
		
		try {  
			//The following condition should never met because of front-end control.
			if (!this.admin) {return  ACTION_RET_FAILED;}
			ISsiManagerLocal sm = initSsiEjbLocal();
			
			CWirelessSensorModule pWsm= new CWirelessSensorModule();
			//required for update
			pWsm.setId(this.id);
			//only updateable fields
			pWsm.setDescription(this.description);
			pWsm.setName(this.name);
			pWsm.setNotes(this.notes);
						
			pWsm = (CWirelessSensorModule) sm.UpdateWsmInfo(pWsm);
			//ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
			//Map session = context.getSessionMap();
			//	think about performance and side effects here but have to sych session to prevent change regressions
			// the following synch block may not be helping, because session is a local var.
			//synchronized (session) {
				//Mesh sGw= (Mesh) session.get(IURLConstants.MESH_BEAN);
				
                //MeshWsm sWsm=sGw.getMeshWsm(this.id);
                
                /*
                List sWsms = sGw.getWsms();
                Iterator iter = sWsms.iterator();
                while (iter.hasNext()){
                	
                	sWsm=(MeshWsm) iter.next();
                	
                	if (sWsm.getId().longValue() == this.id.longValue()){
                		break;
                	}
                }
                */
               // if (sWsm !=null)	{
               // 	LOG.info("swsm is not null id="+sWsm.getId());
				//	sWsm.setName(pWsm.getName());
				//}//else something is messed up
				// To Be Synchronized
				//session.put(IURLConstants.MESH_BEAN ,sGw);
			//} // synchronized
			//Map requestMap = context.getRequestMap();
			//requestMap.put(IURLConstants.WSM_BEAN, this);
		} catch (Exception e){
			updateFail1 = true;
			logExceptionMessage(e,"doUpdate()");
			return ACTION_RET_FAILED;
	    }
		this.updateOk = true;
		return (ACTION_RET_UPDATE);
	  }
	// Call this only after a DB fetch (Currently update does not allow WsmType() to be refreshed)
	private void setBean(CWirelessSensorModule wsm){
		LOG.debug("XXXXXXXXX  IN setBean()  XXXXXXXXX");
		this.id = wsm.getId();
		this.eui = wsm.getEui();
		this.name=wsm.getName();
		this.description = wsm.getDescription();
		this.notes = wsm.getNotes();
		this.hwversion = wsm.getHwVersion();
		this.fwversion = wsm.getFwVersion();
		this.typeName = wsm.getWsmType().getDefaultName();
	}
	
	public int getMaxDescriptionLength() { return MAX_FORM_DESCRIPTION_LENGTH;}
	public int getMaxNotesLength(){return MAX_FORM_NOTES_LENGTH;}
}
