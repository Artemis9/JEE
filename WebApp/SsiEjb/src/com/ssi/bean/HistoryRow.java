package com.ssi.bean;
import java.sql.Timestamp;

import com.ssi.util.CDateUtil;
import com.ssi.util.CMathUtil;
public class HistoryRow implements java.io.Serializable {

	private static final long serialVersionUID = 4049254079871863368L;
	
	private String alarmName;
	private String wsmName;
	private String measurName;
	private String measurUnit;
	private Float value;
	private Double coeff1, coeff2, coeff3, coeff4;
	private Timestamp timestamp;
	private Long tzo;

	public HistoryRow(){}
	
	public HistoryRow(Object aDefName, Object wName, Object mName, Object mUnit, 
			Object val, Object ts, Object coeff1, Object coeff2, Object coeff3, Object coeff4){
		this.alarmName = (String)aDefName;
		this.wsmName = (String)wName;
		this.measurName = (String)mName;
		this.measurUnit = (String)mUnit;
		this.value = (Float)val;
		this.timestamp = (Timestamp)ts;
		this.coeff1=(Double)coeff1;
		this.coeff2=(Double)coeff2;
		this.coeff3=(Double)coeff3;
		this.coeff4=(Double)coeff4;
	}

	public String getAlarmName() {
		return alarmName;
	}

	public void setAlarmName(String alarmName) {
		this.alarmName = alarmName;
	}

	public String getMeasurName() {
		return measurName;
	}

	public void setMeasurName(String measurName) {
		this.measurName = measurName;
	}

	public String getMeasurUnit() {
		return measurUnit;
	}

	public void setMeasurUnit(String measurUnit) {
		this.measurUnit = measurUnit;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp) {
		this.timestamp = timestamp;
	}

	public Float getValue() {
		return value;
	}

	public void setValue(Float value) {
		this.value = value;
	}

	public String getWsmName() {
		return wsmName;
	}

	public void setWsmName(String wsmName) {
		this.wsmName = wsmName;
	}

	public Long getTzo() {
		return tzo;
	}

	public void setTzo(Long tzo) {
		this.tzo = tzo;
	}

	public Double getCoeff1() {
		return coeff1;
	}

	public void setCoeff1(Double coeff1) {
		this.coeff1 = coeff1;
	}

	public Double getCoeff2() {
		return coeff2;
	}

	public void setCoeff2(Double coeff2) {
		this.coeff2 = coeff2;
	}

	public Double getCoeff3() {
		return coeff3;
	}

	public void setCoeff3(Double coeff3) {
		this.coeff3 = coeff3;
	}

	public Double getCoeff4() {
		return coeff4;
	}

	public void setCoeff4(Double coeff4) {
		this.coeff4 = coeff4;
	}
	public Double getValueCalc(){
		return CMathUtil.CalcMeasurement( this.value.floatValue(),
				 this.coeff1.floatValue(),
				 this.coeff2.floatValue(),
				 this.coeff3.floatValue(),
				 this.coeff4.floatValue());
		
	}
	public Timestamp getLocalTimestamp() {
		return CDateUtil.CalcLocalTime(this.timestamp, this.tzo);
	}
}
