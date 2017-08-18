package com.ssi.web.bean;
/**
* Author: Artemis Ozten
* Date: 10/18/2005
* Description: The main page (gatewayContents.jsp) component of backing bean.
*/
import com.ssi.persistence.CMeasurement;

public abstract class AMeasurement extends ABusinessObject {
    static int MAX_FORM_MEASUREMENT_UNIT_LENGHT=10;
    static String ALARM_STATE_DISABLED="disabled";
    static String ALARM_STATE_ENABLED="enabled";
    static String ALARM_STATE_TRIGGERED="triggered";
    
     
	
	protected Double coeff1;
	protected Double coeff2;
	protected Double coeff3;
	protected Double coeff4;
	protected String unit;

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

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}
	
//	 Set up the bean from DB
	protected void setBean(CMeasurement m){
		this.id = m.getId();
		this.name=m.getName();
		this.coeff1 = m.getCoeff1();
		this.coeff2 = m.getCoeff2();
		this.coeff3 = m.getCoeff3();
		this.coeff4 = m.getCoeff4();
		this.unit = m.getUnit();
	}
	public int getMaxUnitLength() {
		return MAX_FORM_MEASUREMENT_UNIT_LENGHT;
	}
}