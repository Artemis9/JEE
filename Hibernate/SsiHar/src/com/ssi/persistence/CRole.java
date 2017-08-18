package com.ssi.persistence;

/**
 * @author AAO
 *
 */
public class CRole  implements IPersistenceObject {

	private static final long serialVersionUID = -9175826419246397911L;
	private Long id;
	private String uname;
	private String pw;
	private Boolean admin;
	private CContact owner;
	private int version;
	
	public CRole() {;}
	public CRole (Long id) {
		this.id = id;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Boolean getAdmin() {
		return admin;
	}
	public void setAdmin(Boolean admin) {
		this.admin = admin;
	}
	public String getPw() {
		return pw;
	}
	public void setPw(String pw) {
		this.pw = pw;
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}

	public CContact getOwner() {
		return owner;
	}

	public void setOwner(CContact owner) {
		this.owner = owner;
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

