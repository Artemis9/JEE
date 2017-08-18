package com.ssi.web.bean;

import com.ssi.ejb.IAccountManagerLocal;
import com.ssi.bean.AccountSummary;
import com.ssi.persistence.CAccount;
import com.ssi.persistence.CContact;
import com.ssi.persistence.CRole;
import com.ssi.web.common.*;

import java.util.*;

import javax.faces.context.FacesContext;

/**
 * @author AAO
 *
 */
public class Account extends ABusinessObject {
	private Short serviceLevel;
    private String uname1;
    private String uname2;
    private String pw1;
    private String pw2;
    private String pw12;
    private String pw22;
    private Boolean admin1;
    private Boolean admin2;
    private String name1;
    private String name2;
    private String lname1;
    private String lname2;
    private Long contactId1;
    private Long contactId2;
    private boolean updateFail2;
    private boolean updateFail3;
    private boolean updateFail4;
    private boolean updateFail5;

	public Account(){LOG.debug("In Account()"); updateFail1=false; updateOk=false; updateFail2=false; updateFail3=false; updateFail4=false; updateFail5=false;}
    
	protected void init() {
		LOG.debug("XXXXXXXXX  IN init()  XXXXXXXXX");
		sessionFail = false;
		try {
			if (this.id == null) {
				Map session = FacesContext.getCurrentInstance().getExternalContext().getSessionMap();
				Mesh mesh = (Mesh)session.get(IURLConstants.MESH_BEAN);
				//!!! when session dies on the server, but not in browser, mesh object is recreated but not initialized.
				if (mesh==null || mesh.id==null){
					sessionFail=true;
					return;
				}
				this.admin = mesh.isAdmin();
				this.id=mesh.getAccountId();
				//LOG.info("this.id="+this.id);
				IAccountManagerLocal am = initAccountEjbLocal();
				CAccount pAcc = (CAccount) am.GetAccountInfo(this.id);
				setBean(pAcc);
			} // if
		} catch (Exception e){
			logExceptionMessage(e,"init()");
		}
	}
	public String  doUpdate() {
		LOG.info("XXXXXXXXX  IN DO-UPDATE()  XXXXXXXXX");
		// the following condition should never be met because of front-end control.
        
		try {
			if (!this.admin) return ACTION_RET_FAILED;
			// Check to make sure Uname1 & Uname2 are not empty
			// use validators 
			
			//Check to make sure at least one user is administrator
			if (!this.admin1.booleanValue() && !this.admin2.booleanValue()) {
				LOG.debug("!!!!!!!!!!!!!!!!both users are non-administrators");
				this.updateFail1=true;
				return ACTION_RET_FAILED;
			}
			
			// Check to make sure pw1 & pw12 are identical 
			if (!this.pw1.contentEquals(this.pw12)) {
				LOG.debug("!!!!!!!!!!!!!!!!pw1!=pw12");
				this.updateFail2=true;
				return ACTION_RET_FAILED;
			}
			//	Check to make sure pw2 & pw22 are identical 
			if ( !this.pw2.contentEquals(this.pw22)) {
				LOG.debug("!!!!!!!!!!!!!!!! pw2!=pw22");
				this.updateFail3=true;
				return ACTION_RET_FAILED;
			}
			
			// Check to make sure login names are not identical
			if (this.uname1.contentEquals(this.uname2)) {
				LOG.debug("!!!!!!!!!!!!!!!!Uname1=Uname2");
				this.updateFail4=true;
				return ACTION_RET_FAILED;
			}
			
			//set the bean for update
			AccountSummary as1 = new AccountSummary(null, this.id, this.contactId1, this.name1, this.lname1,this.admin1,this.serviceLevel);
			AccountSummary as2 = new AccountSummary(null, this.id, this.contactId2, this.name2, this.lname2,this.admin2,this.serviceLevel);
			
			IAccountManagerLocal am = initAccountEjbLocal();
			am.UpdateAccountInfo(as1,as2,this.uname1,this.uname2,this.pw1,this.pw2);
			Map session = FacesContext.getCurrentInstance().getExternalContext().getSessionMap();
			Mesh mesh = (Mesh)session.get(IURLConstants.MESH_BEAN);
			mesh.setSaluName(this.admin1.booleanValue() ? as1.getName()+" "+as1.getLname() : as2.getName()+" "+as2.getLname());
		} catch (Exception e){
			this.updateFail5 = true;
			LOG.error("Exception in Account.doUpdate()");
			return ACTION_RET_FAILED;
		}
		this.updateOk = true;
	    return ACTION_RET_UPDATE;
	}
	private void setBean(CAccount acc) {
		
		this.id=acc.getId();
		this.name=acc.getName();
		this.serviceLevel=acc.getServiceLevel();
		
		Set s = acc.getContacts();
		Iterator iter = s.iterator();
		CContact  contact = (CContact)iter.next();
		
		Set roles = contact.getRoles();
		Iterator iter2 = roles.iterator();
		CRole role = (CRole) iter2.next();
		this.uname1 = role.getUname();
		this.pw1 = role.getPw();
		this.pw12 = this.pw1;
		this.admin1 = role.getAdmin();
		this.contactId1 = contact.getId();
		this.name1 = contact.getName();
		this.lname1 = contact.getLname();
		
		contact= (CContact)iter.next();	
		
		roles = contact.getRoles();
		iter2 = roles.iterator();
		role = (CRole) iter2.next();
		this.uname2 = role.getUname();
		this.pw2 = role.getPw();
		this.pw22 = this.pw2;
		this.admin2 = role.getAdmin();
		this.contactId2 = contact.getId();
		this.name2 = contact.getName();
		this.lname2 = contact.getLname();
	}

	public Boolean getAdmin1() {
		return admin1;
	}

	public void setAdmin1(Boolean admin1) {
		this.admin1 = admin1;
	}

	public Boolean getAdmin2() {
		return admin2;
	}

	public void setAdmin2(Boolean admin2) {
		this.admin2 = admin2;
	}

	public String getLname1() {
		return lname1;
	}

	public void setLname1(String lname1) {
		this.lname1 = lname1;
	}

	public String getLname2() {
		return lname2;
	}

	public void setLname2(String lname2) {
		this.lname2 = lname2;
	}

	public String getName1() {
		return name1;
	}

	public void setName1(String name1) {
		this.name1 = name1;
	}

	public String getName2() {
		return name2;
	}

	public void setName2(String name2) {
		this.name2 = name2;
	}

	public String getPw1() {
		return pw1;
	}

	public void setPw1(String pw1) {
		this.pw1 = pw1;
	}

	public String getPw12() {
		return pw12;
	}

	public void setPw12(String pw12) {
		this.pw12 = pw12;
	}

	public String getPw2() {
		return pw2;
	}

	public void setPw2(String pw2) {
		this.pw2 = pw2;
	}

	public String getPw22() {
		return pw22;
	}

	public void setPw22(String pw22) {
		this.pw22 = pw22;
	}

	public String getUname1() {
		return uname1;
	}

	public void setUname1(String uname1) {
		this.uname1 = uname1;
	}

	public String getUname2() {
		return uname2;
	}

	public void setUname2(String uname2) {
		this.uname2 = uname2;
	}
	protected String getExceptionMessage (Exception e) {
		return "Error in Account business object";
	}
	public Long getContactId2() {
		return contactId2;
	}

	public void setContactId2(Long contactId2) {
		this.contactId2 = contactId2;
	}

	public Long getContactId1() {
		return contactId1;
	}

	public void setContactId1(Long contactId1) {
		this.contactId1 = contactId1;
	}
	public boolean isUpdateFail2() {
		return updateFail2;
	}

	public void setUpdateFail2(boolean updateFail2) {
		this.updateFail2 = updateFail2;
	}

	public boolean isUpdateFail3() {
		return updateFail3;
	}

	public void setUpdateFail3(boolean updateFail3) {
		this.updateFail3 = updateFail3;
	}

	public boolean isUpdateFail4() {
		return updateFail4;
	}

	public void setUpdateFail4(boolean updateFail4) {
		this.updateFail4 = updateFail4;
	}

	public boolean isUpdateFail5() {
		return updateFail5;
	}

	public void setUpdateFail5(boolean updateFail5) {
		this.updateFail5 = updateFail5;
	}

	public Short getServiceLevel() {
		return serviceLevel;
	}

	public void setServiceLevel(Short serviceLevel) {
		this.serviceLevel = serviceLevel;
	}
	
}
