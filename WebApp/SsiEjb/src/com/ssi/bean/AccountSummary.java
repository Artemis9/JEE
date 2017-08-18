package com.ssi.bean;

/**
 * @author AAO
 *
 */
public class AccountSummary implements java.io.Serializable {
	
	private static final long serialVersionUID = -1558352916489863448L;
	private Long gatewayId;
	private Long accountId;
	private String name;
	private String lname;
	private Long contactId;
	private Boolean admin;
	private Short serviceLevel; //Standard=1, Premium=2

	public AccountSummary() {;}
	
	public AccountSummary(Long gwId, Long accId, Long contactId, String name, String lname, Boolean admin, Short serviceLevel)
	{
		this.gatewayId=gwId;
		this.accountId=accId;
		this.contactId=contactId;
		this.name=name;
		this.lname=lname;
		this.admin = admin;
		this.serviceLevel = serviceLevel;
	}
	
	public Long getContactId() {
		return contactId;
	}
	public void setContactId(Long contactId) {
		this.contactId = contactId;
	}
	public Long getAccountId() {
		return accountId;
	}
	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}
	public Boolean getAdmin() {
		return admin;
	}
	public void setAdmin(Boolean admin) {
		this.admin = admin;
	}
	public Long getGatewayId() {
		return gatewayId;
	}
	public void setGatewayId(Long gatewayId) {
		this.gatewayId = gatewayId;
	}
	public String getLname() {
		return lname;
	}
	public void setLname(String lname) {
		this.lname = lname;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public Short getServiceLevel() {
		return serviceLevel;
	}

	public void setServiceLevel(Short serviceLevel) {
		this.serviceLevel = serviceLevel;
	}
	
}
