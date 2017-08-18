package com.ssi.persistence;

import java.util.*;


/**
 * @author AAO
 *
 */
public class CAccount  implements IPersistenceObject {

	private static final long serialVersionUID = 4952787758877483459L;
	
	private Long id;
	private String name; 
	private String notes;
	
    private String streetNo;
    private String city;
    private String state;
    private String zip;
    
    private String country;
    
    private String tel;
    private String fax;
    private Short serviceLevel;
	
	private Set contacts;
	private Set gateways;
	private int version;
	
	public CAccount() {;}
	public CAccount(Long id) {
		this.id = id;
	}
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
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getStreetNo() {
		return streetNo;
	}

	public void setStreetNo(String streetNo) {
		this.streetNo = streetNo;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public Set getContacts() {
		return contacts;
	}

	public void setContacts(Set contacts) {
		this.contacts = contacts;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public Set getGateways() {
		return gateways;
	}

	public void setGateways(Set gateways) {
		this.gateways = gateways;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public Short getServiceLevel() {
		return serviceLevel;
	}

	public void setServiceLevel(Short serviceLevel) {
		this.serviceLevel = serviceLevel;
	}


    // The following is used for associating two objects that maybe coming from different sessions
    // and/or need to be differentiated in a set.
	/*
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof CGateway)) return false;
        final CGateway gw = (CGateway) other;
        return this.eui.equals(gw.getEui());
    }

    public int hashCode() {
        return this.eui.hashCode();
    }
    */
	
	
}
