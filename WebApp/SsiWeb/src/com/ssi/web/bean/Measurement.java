package com.ssi.web.bean;

import java.util.*;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import javax.servlet.http.HttpServletRequest;

import com.ssi.ejb.ISsiManagerLocal;
import com.ssi.common.IApplicationConstants;
import com.ssi.persistence.CMeasurement;
import com.ssi.web.common.*;

/**
 * @author AAO
 *
 */
public class Measurement extends AMeasurement implements IDescribableObject {

	private static final long serialVersionUID = 6018258763995278175L;
	public  static final String units[] = {IApplicationConstants.MEASUREMENT_UNIT_CELCIUS,IApplicationConstants.MEASUREMENT_UNIT_FAHRENHEIT};
	private String description;
	private String notes;

	// form measurement type
	private Boolean changeableCoeffs;
	private Boolean changeableUnit;
	
	private String typeName;
	private Double origCoeff1;
	private Double origCoeff2;
	private Double origCoeff3;
	private Double origCoeff4;
	private String origUnit;
	private Boolean multipleUnits;
	
	private Boolean changeableSingleUnit;

	public Measurement() {updateOk=false; updateFail1=false;}
	
	public void init() {
		LOG.info("XXXXXXXXX  IN Measurement.init()  XXXXXXXXX");
		this.sessionFail = false;
		try {
			if (this.id==null){
				ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
				Map session = context.getSessionMap();
				Mesh mesh= (Mesh) session.get(IURLConstants.MESH_BEAN);
				if (mesh == null || mesh.id == null) {

					this.sessionFail = true;
					return;
				}
				else {
					HttpServletRequest request = (HttpServletRequest) context.getRequest();
					
					String strIndex = request.getParameter(IURLConstants.MEASUREMENT_ID);
					LOG.info("strIndex="+strIndex);
					if (strIndex==null) {
						LOG.error("Could not find the measurement_id in request (null)");
					}
					else 
					{ //A particular wsm is asked to be seen. Properties popup
						this.id = new Long(strIndex);
						LOG.info("Measurement.id="+this.id);
						ISsiManagerLocal sm = initSsiEjbLocal();
						CMeasurement measur = (CMeasurement)sm.GetMeasurementInfo(id);
						setBean(measur);
						this.admin=mesh.isAdmin();
					} //else
				}//else
			}
		} catch (Exception e){
			logExceptionMessage(e,"Measurement()");
	    }
	}
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes.length() > MAX_FORM_NOTES_LENGTH ? notes.substring(0,MAX_FORM_NOTES_LENGTH): notes;
	}
	
	public void setChangeableCoeffs(Boolean changeableCoeffs) {
		this.changeableCoeffs = changeableCoeffs;
	}

	public void setChangeableUnit(Boolean changeableUnit) {
		this.changeableUnit = changeableUnit;
	}

	public Boolean getChangeableCoeffs() {
		return changeableCoeffs;
	}

	public Boolean getChangeableUnit() {
		return changeableUnit;
	}
	
	public String doUpdate()  {
		LOG.info("XXXXXXXXX  IN MEASUREMENT DO-UPDATE()  XXXXXXXXX");
		
		try {  
			//The follwong condition should never met, because of the front-end control.
	        if (!this.admin) {return ACTION_RET_FAILED; }
			ISsiManagerLocal sm = initSsiEjbLocal();
			
			CMeasurement pMeasurement= new CMeasurement();
			pMeasurement.setId(this.id);
			pMeasurement.setDescription(this.description);
			pMeasurement.setName(this.name);
			pMeasurement.setNotes(this.notes);
			pMeasurement.setCoeff1(this.coeff1);
			pMeasurement.setCoeff2(this.coeff2);
			pMeasurement.setCoeff3(this.coeff3);
			pMeasurement.setCoeff4(this.coeff4);

			pMeasurement.setUnit(this.unit);
			

			pMeasurement = (CMeasurement) sm.UpdateMeasurementInfo(pMeasurement, this.changeableCoeffs, this.changeableUnit);
			
			//ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
			//Map session = context.getSessionMap();
			//	think about performance and side effects here but have to sych session to prevent change regressions
			// it may not be helping at all, cause session is a local var.
			//synchronized (session) {
				LOG.debug("In session update this.id="+this.id);
				//Mesh sGw= (Mesh) session.get(IURLConstants.MESH_BEAN);
				//MeshMeasurement sMeasurement=sGw.getMeshMeasurement(this.id);
				
				/*List sWsms = sGw.getWsms();
                Iterator iter = sWsms.iterator();
                
                boolean breakOuter = false;
                while (iter.hasNext()){
                	List sMeasurements =((MeshWsm) iter.next()).getMeasurements();
                	Iterator iter2= sMeasurements.iterator();
    				LOG.debug("***********************In session update first while");
                	while (iter2.hasNext()) {
                		sMeasurement = (MeshMeasurement) iter2.next();
                		//LOG.info("***********************In session update first while name="+sMeasurement.name+" id="+sMeasurement.id);
	                	if (sMeasurement.getId().longValue() == this.id.longValue()){
	                		LOG.debug("***********************Found it");
	                		breakOuter = true;
	                		break;
	                	}
                	}//inner while
                	if (breakOuter) break;
                }//outer while
                */
                //if (sMeasurement !=null)	{
                //	LOG.info("sMeasurement is not null id="+sMeasurement.getId());
				//	sMeasurement.setName(pMeasurement.getName());
				//	sMeasurement.setCoeff1(pMeasurement.getCoeff1());
				//	sMeasurement.setCoeff2(pMeasurement.getCoeff2());
				//	sMeasurement.setCoeff3(pMeasurement.getCoeff3());
				//	sMeasurement.setCoeff4(pMeasurement.getCoeff4());
				//	sMeasurement.setUnit(pMeasurement.getUnit());
					// rest of the fields are not updateable and therefore do not need to be updated in session
				//}//else something is messed up
				// To Be Synchronized
				//session.put(IURLConstants.MESH_BEAN,sGw);
			//} // synchronized
			// put the following because conditionally disabled fields are not popuplated because 
			//we can not use hidden fields for them either
			//this.unit = pMeasurement.getUnit();
			this.coeff1 = pMeasurement.getCoeff1();
			this.coeff2 = pMeasurement.getCoeff2();
			this.coeff3 = pMeasurement.getCoeff3();
			this.coeff4 = pMeasurement.getCoeff4();
			//Map requestMap = context.getRequestMap();
			//requestMap.put(IURLConstants.MEASUREMENT_BEAN,this);
		} catch (Exception e){
			updateFail1 = true;
			logExceptionMessage(e,"doUpdate()");
			return ACTION_RET_FAILED;
	    }
		this.updateOk = true;
		return (ACTION_RET_UPDATE);
	  }

	// Set up the bean from DB, cuurently not usable after doUpdate()
	protected void setBean(CMeasurement m){
		super.setBean(m);
		this.description=m.getDescription();
		this.notes = m.getNotes();
		this.typeName = m.getMeasurementType().getDefaultName();
		this.origUnit = m.getMeasurementType().getDefaultUnit().getName();
		this.origCoeff1 = m.getMeasurementType().getDefaultCoeff1();
		this.origCoeff2 = m.getMeasurementType().getDefaultCoeff2();
		this.origCoeff3 = m.getMeasurementType().getDefaultCoeff3();
		this.origCoeff4 = m.getMeasurementType().getDefaultCoeff4();
		this.changeableCoeffs = m.getMeasurementType().getUserChangeableCoeffs();
		this.changeableUnit = m.getMeasurementType().getUserChangeableUnit();
		// Warning!!! Currently we are mot pulling out measurement units from DB but measurement Bean. 
		// We also assume that when there are multiple possibilityies of unit, then it can only be temperature "C" or "F"
		this.multipleUnits= Boolean.valueOf(m.getMeasurementUnits().size() > 1);

		this.changeableSingleUnit = Boolean.valueOf(this.changeableUnit.booleanValue() && !this.multipleUnits.booleanValue());
	}

	protected String getExceptionMessage (Exception e) {
		return "Error in Measurement business object";
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public Double getOrigCoeff1() {
		return origCoeff1;
	}

	public void setOrigCoeff1(Double origCoeff1) {
		this.origCoeff1 = origCoeff1;
	}

	public Double getOrigCoeff2() {
		return origCoeff2;
	}

	public void setOrigCoeff2(Double origCoeff2) {
		this.origCoeff2 = origCoeff2;
	}

	public Double getOrigCoeff3() {
		return origCoeff3;
	}

	public void setOrigCoeff3(Double origCoeff3) {
		this.origCoeff3 = origCoeff3;
	}

	public Double getOrigCoeff4() {
		return origCoeff4;
	}

	public void setOrigCoeff4(Double origCoeff4) {
		this.origCoeff4 = origCoeff4;
	}

	public String getOrigUnit() {
		return origUnit;
	}

	public void setOrigUnit(String origUnit) {
		this.origUnit = origUnit;
	}
	


	public int getMaxDescriptionLength() { return MAX_FORM_DESCRIPTION_LENGTH;}
	public int getMaxNotesLength(){return MAX_FORM_NOTES_LENGTH;}
	
	public Boolean getMultipleUnits() {
		return multipleUnits;
	}

	public void setMultipleUnits(Boolean multipleUnits) {
		this.multipleUnits = multipleUnits;
	}

	public Boolean getChangeableSingleUnit() {
		return changeableSingleUnit;
	}

	public void setChangeableSingleUnit(Boolean changeableSingleUnit) {
		this.changeableSingleUnit = changeableSingleUnit;
	}
	public String[] getUnitValue(){
		return  units;
	}
}
