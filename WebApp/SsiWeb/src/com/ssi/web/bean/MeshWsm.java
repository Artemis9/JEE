/**
* Author: Artemis Ozten
* Date: 10/18/2005
* Description: The main page (gatewayContents.jsp) component of backing bean.
*/
package com.ssi.web.bean;

import java.sql.Timestamp;
import java.util.*;

import com.ssi.persistence.*;
import com.ssi.util.CDateUtil;

public class MeshWsm extends ADBObject implements Comparable {

	private static final long serialVersionUID = 3918419611689161436L;
	protected List measurements;
	private Timestamp lastDataTs;
	private Long tzo;
	
	public Timestamp getLastDataTs() {
		return lastDataTs;
	}
	public Timestamp getLastDataLocalTs() {
		return CDateUtil.CalcLocalTime(lastDataTs, this.tzo);
	}
	public synchronized void setLastDataTs(Timestamp lastDataTs) {
		this.lastDataTs = lastDataTs;
	}
	//Create shallow bean for properties view/update.
	public MeshWsm()  { 
		;
	}
	
	// Creates deep object for main screen
	protected MeshWsm(IPersistenceObject ipo, Long tzo) {
		if (ipo == null) {
			LOG.error("Can't instantiate MeshWsm object from persistence object; ipo=null");
			// throw an exception  ???
			return;
		}

		List pMeasurements = ((CWirelessSensorModule) ipo).getMeasurements();
		
		if (pMeasurements == null){
			LOG.error("Can't instantiate MeshWsm object measurements from persistence object; pMeasurements = null");
			// throw an exception  ???
			return;
		}
		Iterator iter = pMeasurements.iterator();
		this.measurements=  new Vector();
		while (iter.hasNext()){
			this.measurements.add( new MeshMeasurement((CMeasurement) iter.next(), tzo));
		}
		Collections.sort(this.measurements);
		setBean((CWirelessSensorModule)ipo, tzo);
	}
		
	public List getMeasurements() {
		return measurements;
	}

	public void setMeasurements(List measurements) {
		this.measurements = measurements;
	}

	private void setBean(CWirelessSensorModule wsm, Long tzo){
		this.id = wsm.getId();
		this.name=wsm.getName();
		this.tzo = tzo;
		this.lastDataTs = wsm.getLastDataLogTs();
	}
	public synchronized void setName(String name) {
		this.name = name;
	}
	public int compareTo(Object other){
		MeshWsm measurement = (MeshWsm) other;
		return this.getName().compareToIgnoreCase(measurement.getName());
	}
}
