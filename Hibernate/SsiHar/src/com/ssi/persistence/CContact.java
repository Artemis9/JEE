package com.ssi.persistence;

import java.util.*;


/**
 * @author AAO
 *
 */
public class CContact  implements IPersistenceObject {

	private static final long serialVersionUID = -4704702338584790549L;
	private Long id;
	private String notes;
	private String name;
	private String lname;
	private String email;
	private CAccount account;
	private int version;
	
	private Set roles;
	
	public CContact() {;}
	public CContact(Long id) {
		this.id = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getLname() {
		return lname;
	}
	public void setLname(String lname) {
		this.lname = lname;
	}

	public Set getRoles() {
		return roles;
	}

	public void setRoles(Set roles) {
		this.roles = roles;
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

	public CAccount getAccount() {
		return account;
	}

	public void setAccount(CAccount account) {
		this.account = account;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
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
