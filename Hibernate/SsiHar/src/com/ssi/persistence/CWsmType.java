package com.ssi.persistence;

import java.util.*;

public class CWsmType implements IPersistenceObject {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7323262039942715071L;

	private Long id;
	
	private String typeId;
	private String defaultName;
	
	private String name;
	private String description;
	
	private List measurementTypes;
	
	
	public CWsmType(){}
	public CWsmType(String typeId){this.typeId=typeId;}
	
	public List getMeasurementTypes() {
		return measurementTypes;
	}
	public void setMeasurementTypes(List measurementTypes) {
		this.measurementTypes = measurementTypes;
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

	public Long getId() {
		return id;
	}
    public void setId(Long id) {
    	this.id = id;
    }
    public String getTypeId() {
    	return typeId;
    }
    public void setTypeId(String tid) {
    	this.typeId = tid;
    }
    public String getDefaultName() {
    	return defaultName;
    }
    public void setDefaultName(String defaultName){
    	this.defaultName = defaultName;
    }
	
    
}
