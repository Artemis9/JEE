package com.ssi.persistence;

import java.sql.Timestamp;

import com.ssi.util.CDateUtil;

/**
 * @author AAO
 *
 */
public class WsmData implements IPersistenceObject {

	private static final long serialVersionUID = 4937495499848032990L;
	private Timestamp ts;
	private Timestamp gwTs;
	private Short value;
	private Long id; 
	private Long tzo;
	
	public WsmData(){;}
	
	public WsmData(Object convertedData, Object convertedTs){
		setBean((Short) convertedData, (Timestamp)convertedTs);	
	}
	public WsmData(Object convertedData, Object convertedTs, Object convertedGwTs, Object id, Object tzo) {
		setBean((Short) convertedData, (Timestamp)convertedTs, (Timestamp)convertedGwTs, (Long) id, (Long) tzo);	
	}
	protected void setBean(Short convertedData, Timestamp convertedTs, Timestamp convertedGwTs, Long id, Long tzo)
	{
		this.ts = convertedTs;
		this.value = convertedData;
		this.id = id;
		this.gwTs = convertedGwTs;
		this.tzo = tzo;
	}
	protected void setBean(Short convertedData, Timestamp convertedTs)
	{
		this.ts = convertedTs;
		this.value = convertedData;
	}
	protected String getExceptionMessage (Exception e) {
		return "Error in WsmData business object" + e.getMessage();
	}

	public Timestamp getTs() {
		return ts;
	}

	public void setTs(Timestamp ts) {
		this.ts = ts;
	}

	public Short getValue() {
		return value;
	}

	public void setValue(Short value) {
		this.value = value;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Timestamp getGwTs() {
		return gwTs;
	}

	public void setGwTs(Timestamp gwTs) {
		this.gwTs = gwTs;
	}
    
	public Long getDeltaTs() {
		return Long.valueOf((this.ts.getTime() - this.gwTs.getTime())/1000);
	}
	public Timestamp getLocalTimestamp() {
		return CDateUtil.CalcLocalTime(this.ts, this.tzo);
	}
	public Float getValuePercent() {
		return Float.valueOf(this.value.shortValue() * 100 / 255);
	}

	public Long getTzo() {
		return this.tzo;
	}

	public void setTzo(Long tzo) {
		this.tzo = tzo;
	}
	
}
