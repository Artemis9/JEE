package com.ssi.web.bean;


import java.util.Map;
import java.sql.*;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;

import com.ssi.bean.MeasurementSummary;
import com.ssi.ejb.ISsiManagerLocal;

import com.ssi.persistence.CAlarmDefinition;
import com.ssi.persistence.CWirelessSensorModule;
import com.ssi.persistence.CMeasurement;
import com.ssi.web.common.IURLConstants;

/**
 * @author AAO
 *
 */
public class MeasurementSample extends AMeasurement {
	private String wsmName;
	private Long wsmId;
	private Long tzo;
	private Short serviceLevel;
	private Timestamp firstDataTs;
	private Timestamp lastDataTs;
	private boolean autoScale;
	private float minYscale;
	private float maxYscale;
	private boolean updateFail2;
	
	
	
	public MeasurementSample() { 
		LOG.debug("XXXXXXXXX  IN MeasurementSample()  XXXXXXXXX");
		
	}

	public void init() {
		LOG.info("XXXXXXXXX  IN init()  XXXXXXXXX");
		this.sessionFail = false;
		try {
			ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
			Map session = context.getSessionMap();
			Mesh mesh= (Mesh) session.get(IURLConstants.MESH_BEAN);
			if (mesh == null || mesh.id == null) {
				this.sessionFail = true;
				return;
			}
			else {
				if (this.id==null) {
					HttpServletRequest request = (HttpServletRequest) context.getRequest();
					String strIndex = request.getParameter(IURLConstants.MEASUREMENT_ID);
					
					LOG.info("strIndex="+strIndex);
					this.tzo = mesh.getTzo();
					this.serviceLevel = mesh.getServiceLevel();
					if (strIndex==null || strIndex.length()==0) {
						//LOG.info("idComp="+this.idComp);
						//LOG.info("idComp.value="+this.idComp.getValue());	
						LOG.error("Could not find the measurement_id in request (null)");
						this.updateFail2=true;
						return;
					}
					else this.id = Long.valueOf(strIndex);
				} //else 
				this.initMeasurementInfo();
			}//else (mesh is not null)
		} catch (Exception e){
			this.updateFail1 = true;
			logExceptionMessage(e,"init()");
	    }
	}
	

	
	public Long getTzo() {
		return tzo;
	}

	public void setTzo(Long tzo) {
		this.tzo = tzo;
	}

	private void initMeasurementInfo() throws Exception {
		LOG.debug("XXXXXXXXX  IN initMeasurementInfo() ");
		ISsiManagerLocal sm = initSsiEjbLocal();
		MeasurementSummary ms = (MeasurementSummary)sm.GetMeasurementSummary(this.id);
		CWirelessSensorModule wsm = ms.getWsm();
		this.wsmName = wsm.getName();
		this.wsmId = wsm.getId();
		setBean(ms.getMeasurement());
		this.firstDataTs = ms.getFirstDataGwTs();
	    this.lastDataTs = ms.getLastDataGwTs();
	}
	protected String getExceptionMessage (Exception e) {
		return "Error in MeasurementSample business object";
	}

	protected void setAlarmInfo(CAlarmDefinition aDef){
		if (aDef==null) return;
		
	}
		
	public String getWsmName() {
		return (this.wsmName.toString());
	}

	public void setWsmName(String desc) {
		this.wsmName = desc;
	}

	public boolean isUpdateFail2() {
		return updateFail2;
	}
	
	public void setUpdateFail2(boolean updateFail2) {
		this.updateFail2 = updateFail2;
	}

	public Short getServiceLevel() {
		return serviceLevel;
	}

	public void setServiceLevel(Short serviceLevel) {
		this.serviceLevel = serviceLevel;
	}

	public Timestamp getFirstDataTs() {
		return firstDataTs;
	}

	public void setFirstDataTs(Timestamp firstDataTs) {
		this.firstDataTs = firstDataTs;
	}


	public Long getWsmId() {
		return wsmId;
	}

	public void setWsmId(Long wsmId) {
		this.wsmId = wsmId;
	}

	public Timestamp getLastDataTs() {
		return lastDataTs;
	}

	public void setLastDataTs(Timestamp lastDataTs) {
		this.lastDataTs = lastDataTs;
	}

	public boolean isAutoScale() {
		return autoScale;
	}

	public void setAutoScale(boolean autoScale) {
		this.autoScale = autoScale;
	}

	public float getMaxYscale() {
		return maxYscale;
	}

	public void setMaxYscale(float maxYscale) {
		this.maxYscale = maxYscale;
	}

	public float getMinYscale() {
		return minYscale;
	}

	public void setMinYscale(float minYscale) {
		this.minYscale = minYscale;
	}
	protected void setBean(CMeasurement m) {
		super.setBean(m);
		this.autoScale = m.getMinMaxAuto().booleanValue();
		this.maxYscale = m.getValueMax().floatValue();
		this.minYscale = m.getValueMin().floatValue();
	}
}
