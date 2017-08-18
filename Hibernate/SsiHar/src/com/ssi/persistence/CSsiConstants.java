package com.ssi.persistence;

public class CSsiConstants implements IPersistenceObject{
	/**
	 * 
	 */
	private static final long serialVersionUID = 8707141048798512077L;
	private Long id;
	private String name;
	private String value;
	public CSsiConstants(){};
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}

}
