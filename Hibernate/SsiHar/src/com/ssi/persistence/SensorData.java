package com.ssi.persistence;

import java.sql.Timestamp;

/**
 * @author AAO
 *
 */
public class SensorData implements IPersistenceObject, Comparable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -88327785892348308L;
	private Timestamp ts;
	private Float value;
	private Long id; 
	
	public SensorData(){;}
	
	public SensorData(Object convertedData, Object convertedTs){
		setBean((Float) convertedData, (Timestamp)convertedTs);	
	}
	public SensorData(Object convertedData, Object convertedTs, Object id){
		setBean((Float) convertedData, (Timestamp)convertedTs, (Long) id);	
	}
	protected void setBean(Float convertedData, Timestamp convertedTs, Long id)
	{
		this.ts = convertedTs;
		this.value = convertedData;
		this.id = id;
	}
	protected void setBean(Float convertedData, Timestamp convertedTs)
	{
		this.ts = convertedTs;
		this.value = convertedData;
	}
	protected String getExceptionMessage (Exception e) {
		return "Error in SensorData business object";
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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public int compareTo(Object other){
		SensorData sd = (SensorData) other;
		float diff = this.value.floatValue() - sd.getValue().floatValue();
		if (diff > 0)
			return 1;
		else if (diff < 0)
			return -1;
		return 0;
	}
}
