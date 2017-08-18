package com.ssi.bean;

import java.util.List;
import java.sql.Timestamp;
import com.ssi.persistence.CMeasurement;

import com.ssi.persistence.CAlarmDefinition;

public class DetailReadings extends DownloadReadings {
	private static final long serialVersionUID = 851243168266264615L;
	
	private CAlarmDefinition aDef;
	private Timestamp lastTs;
	private CMeasurement m;
	
	public DetailReadings (List sdList, Integer tot, CMeasurement m, CAlarmDefinition aDef, Timestamp lastTs) {
        super(sdList,tot);
		this.m = m;
		this.aDef = aDef;
		this.lastTs = lastTs;
	}
	
	public CAlarmDefinition getAlarmDefinition() {
		return aDef;
	}

	public Timestamp getLastDataGwTs() {
		return this.lastTs;
	}
	public CMeasurement getMeasurement() {
		return m;
	}
	
	
}
