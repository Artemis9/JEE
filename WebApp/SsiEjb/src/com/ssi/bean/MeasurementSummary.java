package com.ssi.bean;


import java.sql.Timestamp;

import com.ssi.persistence.CMeasurement;
import com.ssi.persistence.CWirelessSensorModule;

public class MeasurementSummary {
	private static final long serialVersionUID = 851243168266264615L;
	private CMeasurement measurement;
	private Timestamp firstTs;
	private Timestamp lastTs;
	
	public MeasurementSummary() {
		;
	}
	public MeasurementSummary (CMeasurement m, Timestamp first, Timestamp last) {
		this.setMeasurement(m);
		this.firstTs = first;
		this.lastTs = last;
	}
	public CMeasurement getMeasurement() {
		return measurement;
	}
	public void setMeasurement(CMeasurement measurement) {
		this.measurement = measurement;
	}
	public CWirelessSensorModule getWsm() {
		return measurement.getWsm();
	}
	public Timestamp getFirstDataGwTs() {
		return this.firstTs;
	}
	public Timestamp getLastDataGwTs() {
		return this.lastTs;
	}
}
