package com.ssi.persistence;

import java.sql.Timestamp;

public class CAlarmHistory implements IPersistenceObject {

	private static final long serialVersionUID = -8121337169806900135L;
	private Long id;
	private CAlarmDefinition definition;
	private Timestamp ts;
	private Float value;
	
	public CAlarmHistory() {}
	public CAlarmHistory(Long id) {this.id=id;}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Timestamp getTs() {
		return ts;
	}
	public void setTs(Timestamp ts) {
		this.ts = ts;
	}
	public Float getValue() {
		return value;
	}
	public void setValue(Float value) {
		this.value = value;
	}
	public CAlarmDefinition getDefinition() {
		return definition;
	}
	public void setDefinition(CAlarmDefinition definition) {
		this.definition = definition;
	}
	
}
