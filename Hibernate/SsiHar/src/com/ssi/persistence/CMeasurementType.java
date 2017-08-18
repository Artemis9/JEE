package com.ssi.persistence;

import java.util.Set;

import com.ssi.common.IApplicationConstants;

public class CMeasurementType implements IPersistenceObject {
    /**
	 * 
	 */
	private static final long serialVersionUID = -1283714807563452606L;

	private Long id;
	
	private String typeId;
	private String defaultName;
	private String name;
	private String description;
	
	private CMeasurementUnit defaultUnit;
	private Double defaultCoeff1;
	private Double defaultCoeff2;
	private Double defaultCoeff3;
	private Double defaultCoeff4;
	
	private Boolean userChangeableCoeffs;
	private Boolean userChangeableUnit;
	
	private Float defaultValueMin;
	private Float defaultValueMax;
	private Boolean defaultMinMaxAuto;
	
	private Set measurementUnits;
	
	public CMeasurementType(){}
	public CMeasurementType(String typeId) {this.typeId=typeId;}
	
	public void setTypeId(String typeId){
		this.typeId = typeId;
	}
    public String getTypeId(){
    	return this.typeId;
    }
    public void setDefaultName(String name) {
    	this.defaultName = name;
    }
    public void setDefaultUnit(CMeasurementUnit unit) {
    	this.defaultUnit = unit;
    }
    public void setDefaultCoeff1(Double coeff) {
    	this.defaultCoeff1 = coeff;
    }
    
    public void setDefaultCoeff2(Double coeff) {
        this.defaultCoeff2 = coeff;
    }
    public void setDefaultCoeff3(Double coeff) {
    	this.defaultCoeff3 = coeff;
    }
    public void setDefaultCoeff4(Double coeff) {
    	this.defaultCoeff4 = coeff;
    }
	/**
	 * @return Returns the description.
	 */
	public String getDescription() {
		return description;
	}
	/**
	 * @param description The description to set.
	 */
	public void setDescription(String description) {
		this.description = description;
	}
	/**
	 * @return Returns the id.
	 */
	public Long getId() {
		return id;
	}
	/**
	 * @param id The id to set.
	 */
	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * @return Returns the name.
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name The name to set.
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return Returns the defaultCoeff1.
	 */
	public Double getDefaultCoeff1() {
		return defaultCoeff1;
	}
	/**
	 * @return Returns the defaultCoeff2.
	 */
	public Double getDefaultCoeff2() {
		return defaultCoeff2;
	}
	/**
	 * @return Returns the defaultCoeff3.
	 */
	public Double getDefaultCoeff3() {
		return defaultCoeff3;
	}
	/**
	 * @return Returns the defaultCoeff4.
	 */
	public Double getDefaultCoeff4() {
		return defaultCoeff4;
	}
	/**
	 * @return Returns the defaultName.
	 */
	public String getDefaultName() {
		return defaultName;
	}
	/**
	 * @return Returns the defaultUnit.
	 */
	public CMeasurementUnit getDefaultUnit() {
		return defaultUnit;
	}
	public void setUserChangeableCoeffs(Boolean userChangeableCoeffs) {
		this.userChangeableCoeffs = userChangeableCoeffs;
	}
	public Boolean getUserChangeableCoeffs() {
		return userChangeableCoeffs;
	}
	public Boolean hasUserChangeableCoeffs() {
		return userChangeableCoeffs;
	}
	public Set getMeasurementUnits() {
		return measurementUnits;
	}
	public void setMeasurementUnits(Set measurementUnits) {
		this.measurementUnits = measurementUnits;
	}
	public Boolean getUserChangeableUnit() {
		return userChangeableUnit;
	}
	public void setUserChangeableUnit(Boolean userChangeableUnit) {
		this.userChangeableUnit = userChangeableUnit;
	}
	public Boolean hasUserChangeableUnit() {
		return userChangeableUnit;
	}
//	 The following is used for associating two objects that maybe coming from different sessions
    // and/or need to be differentiated in a set.
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof CMeasurementType)) return false;
        final CMeasurementType mt = (CMeasurementType) other;
        return this.typeId.equals(mt.getTypeId());
    }

    public int hashCode() {
        return this.typeId.hashCode();
    }
    
	public Boolean getDefaultMinMaxAuto() {
		return defaultMinMaxAuto;
	}
	public void setDefaultMinMaxAuto(Boolean defaultMinMaxAuto) {
		this.defaultMinMaxAuto = defaultMinMaxAuto;
	}
	public Float getDefaultValueMax() {
		return defaultValueMax;
	}
	public void setDefaultValueMax(Float defaultValueMax) {
		this.defaultValueMax = defaultValueMax;
	}
	public Float getDefaultValueMin() {
		return defaultValueMin;
	}
	public void setDefaultValueMin(Float defaultValueMin) {
		this.defaultValueMin = defaultValueMin;
	}
    public boolean isTemperatureType() {
    	return (this.typeId.contentEquals(IApplicationConstants.MEASUREMENT_TYPE_TEMPERATURE) || 
		    	this.typeId.contentEquals(IApplicationConstants.MEASUREMENT_TYPE_AMBIENT_TEMPERATURE) ||
		    	this.typeId.contentEquals(IApplicationConstants.MEASUREMENT_TYPE_THERMISTOR) || 
		    	this.typeId.contentEquals(IApplicationConstants.MEASUREMENT_TYPE_THERMOCOUPLE) ||
		    	this.typeId.contentEquals(IApplicationConstants.MEASUREMENT_TYPE_RTD));
    }
}
