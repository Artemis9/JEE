package com.ssi.persistence;

import java.util.*;

import com.ssi.common.IApplicationConstants;
import com.ssi.util.CMathUtil;

/**
 * @author AAO
 *
 */
public class CMeasurement implements IPersistenceObject {

	private static final long serialVersionUID = 5844351207383669704L;
	private Long id;
	private String name;
	private Short ordering;
	private String unit;
	private Double coeff1;
	private Double coeff2;
	private Double coeff3;
	private Double coeff4;
	
	private Float valueMin;
	private Float valueMax;
	private Boolean minMaxAuto;
	
	private String description;
	private String notes;
	
	private CWirelessSensorModule wsm; 
	private CMeasurementType measurementType;
	private Set sensorDataSample;
	private CSensorData lastSensorData;
	private Set alarmDefinitions;
	private int version;
    //not persisted!!
	private boolean hasAlarm;
	
	public CMeasurement() {}
	public CMeasurement(Long id) {this.id=id;}
	/** Call this only while in an hibernate session
	 * Contructor from measurement Type
	 * @param mType
	 */
	public CMeasurement(CMeasurementType mType) {
		this.coeff1=mType.getDefaultCoeff1();
		this.coeff2=mType.getDefaultCoeff2();
		this.coeff3=mType.getDefaultCoeff3();
		this.coeff4=mType.getDefaultCoeff4();
		this.name=mType.getDefaultName();
		// Measurement description is nolonger used.
		//this.description=mType.getDescription();
		this.unit=mType.getDefaultUnit().getName();
		this.minMaxAuto=mType.getDefaultMinMaxAuto();
		this.valueMax=mType.getDefaultValueMax();
		this.valueMin=mType.getDefaultValueMin();
		this.measurementType=mType;
	}
	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return Returns the coeff1.
	 */
	public Double getCoeff1() {
		return coeff1;
	}
	/**
	 * @param coeff1 The coeff1 to set.
	 */
	public void setCoeff1(Double coeff1) {
		this.coeff1 = coeff1;
	}
	/**
	 * @return Returns the coeff2.
	 */
	public Double getCoeff2() {
		return coeff2;
	}
	/**
	 * @param coeff2 The coeff2 to set.
	 */
	public void setCoeff2(Double coeff2) {
		this.coeff2 = coeff2;
	}
	/**
	 * @return Returns the coeff3.
	 */
	public Double getCoeff3() {
		return coeff3;
	}
	/**
	 * @param coeff3 The coeff3 to set.
	 */
	public void setCoeff3(Double coeff3) {
		this.coeff3 = coeff3;
	}
	/**
	 * @return Returns the coeff4.
	 */
	public Double getCoeff4() {
		return coeff4;
	}
	/**
	 * @param coeff4 The coeff4 to set.
	 */
	public void setCoeff4(Double coeff4) {
		this.coeff4 = coeff4;
	}
	/**
	 * @return Returns the notes.
	 */
	public String getNotes() {
		return notes;
	}
	/**
	 * @param notes The notes to set.
	 */
	public void setNotes(String notes) {
		this.notes = notes;
	}
	/**
	 * @return Returns the unit.
	 */
	public String getUnit() {
		return unit;
	}
	/**
	 * @param unit The unit to set.
	 */
	public void setUnit(String unit) {
		this.unit = unit;
	}


	public Short getOrdering() {
		return ordering;
	}


	public void setOrdering(Short ordering) {
		this.ordering = ordering;
	}


	public CWirelessSensorModule getWsm() {
		return wsm;
	}


	public void setWsm(CWirelessSensorModule wsm) {
		this.wsm = wsm;
	}


	public CMeasurementType getMeasurementType() {
		return measurementType;
	}


	public void setMeasurementType(CMeasurementType measurementType) {
		this.measurementType = measurementType;
	}
    
	public Set getMeasurementUnits() {
		if (this.measurementType == null) 
			return null;
		return this.measurementType.getMeasurementUnits();
	}
	
	public Set getSensorDataSample() {
		return sensorDataSample;
	}
    
	public void setSensorDataSample(Set sensorDataSample) {
		this.sensorDataSample = sensorDataSample;
	}
	public CSensorData getLastSensorData() {
		return this.lastSensorData;
	}


	public void setLastSensorData(CSensorData lastSensorData) {
		this.lastSensorData = lastSensorData;
	}


	public Set getAlarmDefinitions() {
		return alarmDefinitions;
	}


	public void setAlarmDefinitions(Set alarmDefinitions) {
		this.alarmDefinitions = alarmDefinitions;
	}
	/**
	 * Creates persistent association between measurement (parent) and the alarm definition (child)
	 * @param ad
	 */
	public void addAlarmDefinition(CAlarmDefinition ad){
		if (this.getAlarmDefinitions() == null){
			this.alarmDefinitions = new HashSet();
		}
		this.alarmDefinitions.add(ad);
		if (ad != null) {
			ad.setMeasurement(this);
		}
	}


	public boolean isHasAlarm() {
		return (this.hasAlarm);
	}

	public void setHasAlarm(boolean hasAlarm) {
		this.hasAlarm = hasAlarm;
	}
	public int getVersion() {
		return version;
	}


	public void setVersion(int version) {
		this.version = version;
	}
	public void deleteAlarmDefinition(CAlarmDefinition alarmDef){
		if (this.alarmDefinitions == null || this.alarmDefinitions.isEmpty())
			return;
		alarmDefinitions.remove(alarmDef);
		//alarmDef.setMeasurement(null);//??
	}
	public void deleteSensorData(CSensorData sd){
		if (this.sensorDataSample == null || this.sensorDataSample.isEmpty())
			return;
		sensorDataSample.remove(sd);
		//sd.setMeasurement(null);//??
	}
	public Float getValueMax() {
		return valueMax;
	}
	public void setValueMax(Float valueMax) {
		this.valueMax = valueMax;
	}
	public Float getValueMin() {
		return valueMin;
	}
	public void setValueMin(Float valueMin) {
		this.valueMin = valueMin;
	}
	public Boolean getMinMaxAuto() {
		return minMaxAuto;
	}
	public void setMinMaxAuto(Boolean minMaxAuto) {
		this.minMaxAuto = minMaxAuto;
	}
	public void covertCCoeffsToF() {
		this.coeff1=CMathUtil.ConvertCoeff1ToFahrenheit(this.coeff1);
		this.coeff2=CMathUtil.ConvertCoeff2ToFahrenheit(this.coeff2);
		this.coeff3=CMathUtil.ConvertCoeff3ToFahrenheit(this.coeff3);
		this.coeff4=CMathUtil.ConvertCoeff4ToFahrenheit(this.coeff4);
		
	}
	public void covertFCoeffsToC() {
		this.coeff1=CMathUtil.ConvertCoeff1ToCelcius(this.coeff1);
		this.coeff2=CMathUtil.ConvertCoeff2ToCelcius(this.coeff2);
		this.coeff3=CMathUtil.ConvertCoeff3ToCelcius(this.coeff3);
		this.coeff4=CMathUtil.ConvertCoeff4ToCelcius(this.coeff4);
	}
	public void convertCMinMaxToF(){
		this.valueMax = CMathUtil.CelciusToFahrenheit(this.valueMax);
		this.valueMin = CMathUtil.CelciusToFahrenheit(this.valueMin);
	}
	public void convertFMinMaxToC() {
		this.valueMax = CMathUtil.FahrenheitToCelcius(this.valueMax);
		this.valueMin = CMathUtil.FahrenheitToCelcius(this.valueMin);
	}
	public boolean hasUnitFahrenheit() {
		return this.unit.contentEquals(IApplicationConstants.MEASUREMENT_UNIT_FAHRENHEIT);
	}
}
