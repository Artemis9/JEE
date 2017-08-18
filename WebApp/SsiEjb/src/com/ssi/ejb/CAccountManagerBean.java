package com.ssi.ejb;

import java.rmi.RemoteException;
import java.util.Iterator;
import java.util.Set;

import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import org.apache.log4j.Logger;
import org.hibernate.LockMode;
import org.hibernate.Session;


import com.ssi.persistence.CGateway;
import com.ssi.persistence.IPersistenceObject;
import com.ssi.persistence.CContact;
import com.ssi.persistence.CRole;
import com.ssi.persistence.CAccount;
import com.ssi.persistence.util.*;
import com.ssi.util.CSecurityUtil;
import com.ssi.bean.AccountSummary;
/**
 * @author AAO
 *
 */
public class CAccountManagerBean implements SessionBean {

		/** The session context */
		private SessionContext context;
		static Logger LOG = Logger.getLogger(CAccountManagerBean.class.getName());
		public CAccountManagerBean() {
			super();
			// TODO Auto-generated constructor stub
		}

		/**
		 * Set the associated session context. The container calls this method 
		 * after the instance creation.
		 * 
		 * The enterprise bean instance should store the reference to the context 
		 * object in an instance variable.
		 * 
		 * This method is called with no transaction context. 
		 * 
		 * @throws EJBException Thrown if method fails due to system-level error.
		 */
		public void setSessionContext(SessionContext newContext)
			throws EJBException {
			context = newContext;
		}

		public void ejbRemove() throws EJBException, RemoteException {
			// TODO Auto-generated method stub

		}

		public void ejbActivate() throws EJBException, RemoteException {
			// TODO Auto-generated method stub

		}

		public void ejbPassivate() throws EJBException, RemoteException {
			// TODO Auto-generated method stub

		}

		/**
		 * An ejbCreate method as required by the EJB specification.
		 * 
		 * The container calls the instance?s <code>ejbCreate</code> method whose
		 * signature matches the signature of the <code>create</code> method invoked
		 * by the client. The input parameters sent from the client are passed to
		 * the <code>ejbCreate</code> method. Each session bean class must have at
		 * least one <code>ejbCreate</code> method. The number and signatures
		 * of a session bean?s <code>create</code> methods are specific to each 
		 * session bean class.
		 * 
		 * @throws CreateException Thrown if method fails due to system-level error.
		 * 
		 * @ejb.create-method
		 * 
		 */
		public void ejbCreate() throws CreateException {
			// TODO Add ejbCreate method implementation
		}
		/**
		 * Called for the Account Options Popup initailization returns all contact/role info
		 * associated with an account
		 * 
		 * @throws EJBException, CAccountManagerException Thrown if method fails due to system-level error
		 * or, if an account or two contact and role records are not found.
		 * 
		 * @ejb.GetAccountInfo
		 * 
		 */
		public IPersistenceObject GetAccountInfo(Long id) throws EJBException, CAccountManagerException {

			LOG.info("CAccountManagerBean method: GetAccountInfo; id="+id);
			CAccount acc=null;
			Session hsession = null;
			try {
				//	Create a Hibernate session		
				hsession = CPersistenceUtil.getHibernateSession();
				acc =(CAccount) hsession.get(CAccount.class, id, LockMode.NONE);
				if (acc==null) {
					LOG.error("Account object is null(not found)");
					throw new CAccountNotFoundException();
				}
				Set contacts = acc.getContacts();
				if (contacts != null && !contacts.isEmpty()){
					Iterator iter = contacts.iterator();
					CContact contact;
					do {
						 contact = (CContact) iter.next();
						 
						 Set roles = contact.getRoles();
						 if (roles!=null && !roles.isEmpty()){
							 Iterator iter2=roles.iterator();
							 CRole role=null;
							 do {
								 role= (CRole) iter2.next();
							 } while (iter2.hasNext());					 
						 }//if (roles!=null && !roles.isEmpty())
						 else {
							 LOG.error("!!!!!!!!!!!!Role is not found for contact.id="+contact.getId());
							 throw new CRoleNotFoundException();
						 }
					} while (iter.hasNext());
				}//if (contacts != null && !contacts.isEmpty())
				else {
					LOG.error("!!!!!!!!!!! Contacts is not found for account.id="+id);
					throw new CContactNotFoundException();
				}	
			} // try
			catch (Exception e){
				CPersistenceUtil.printSQLException(e, "GetAccountInfo");
			   throw new CAccountManagerException("Unexpected exception in CAccountManagerBean (Naming or Hibernate or?)",e);
			}//catch
			finally {
				LOG.debug("About to exit from GetAccountInfo");
			}
			return acc;
		}// end GetGatewayInfo
		/**
		 * Called for User login and gateway (mesh) identifiacation and authentication
		 * 
		 * @throws EJBException, CAccountManagerException Thrown if method fails due to system-level error
		 * or, if an account or any contact with a role of matching login-name and password are not found.
		 * 
		 * @ejb.GetAccountInfo
		 * 
		 */
		public AccountSummary GetGatewayAccount (String mac, String name, String password) throws EJBException, CAccountManagerException {
			LOG.info("CAccountManagerBean method: GetGatewayAccount");
			Session hsession = null;
			CGateway gw= null;
			AccountSummary as=null;
			try {
				//	Create a Hibernate session
				hsession = CPersistenceUtil.getHibernateSession();
				gw = (CGateway) hsession.createQuery(
			    "from CGateway as gw where gw.active = 'T' and gw.mac = ?")
			    .setString(0, mac)
			    .uniqueResult();
				if (gw==null){
					LOG.error("Login denied, gateway object is null(not found) for gw.mac="+mac);
				} else {
					CAccount acc = gw.getAccount();
					if (acc==null){
						LOG.error("Account object is null(not found) for gw.mac="+mac);
						throw new CAccountNotFoundException();
					}
					String passwdEnc = CSecurityUtil.encrypt(password);
					LOG.debug(" password="+password+" CSecurityUtil.encrypt(password)="+CSecurityUtil.encrypt(password));
					
					Iterator iter = acc.getContacts().iterator();
					while (iter.hasNext()){
						CContact con = (CContact)iter.next();
						Iterator iter2 = con.getRoles().iterator();
						if (iter2.hasNext()){ // not a loop 'cause one role per contact
							CRole role = (CRole)iter2.next();
							LOG.debug("Role.getPw()="+role.getPw());
							if (role.getUname().contentEquals(name) && role.getPw().contentEquals(passwdEnc)){
								as = new AccountSummary(gw.getId(),acc.getId(),con.getId(), con.getName(),con.getLname(),role.getAdmin(),acc.getServiceLevel());
								break;
							}//if
						}//if
					}//while
				}//else
			} //try
			catch (Exception e){
				  CPersistenceUtil.printSQLException(e, "GetGatewayAccount");
				  throw new CAccountManagerException("Unexpected exception in CAccountManagerBean (Naming or Hibernate or?)",e);
				}//catch
				finally {
					LOG.debug("About to exit from GetGatewayAccount");
				}
			return as;
		}
		/**
		 * Called for Account Options Update
		 * 
		 * @throws EJBException, CAccountManagerException Thrown if method fails due to system-level error
		 * or, if an account or any contact with a role of matching login-name and password are not found.
		 * 
		 * @ejb.GetAccountInfo
		 * 
		 */
		public void UpdateAccountInfo(AccountSummary as1, AccountSummary as2, String uname1, String uname2, String pw1, String pw2)
		throws EJBException, CAccountManagerException {
			LOG.info("CAccountManagerBean method: UpdateAccountInfo");
			Session hsession = null;
			try {
				//Create a Hibernate session
				hsession = CPersistenceUtil.getHibernateSession();
				if (uname1 == null || uname2 == null || uname1.length()==0 || uname2.length()==0){
					throw new CSecuritySettingsException();
				}
				if (!(as1.getAdmin().booleanValue()) && !(as2.getAdmin().booleanValue())) {
					throw new CSecuritySettingsException();
				}
				updateContact(hsession, as1, uname1, pw1);
				updateContact(hsession, as2, uname2, pw2);
			}
			catch (RuntimeException e){
				CPersistenceUtil.printException(e, "UpdateAccountInfo");
				throw e;
			}//catch
			catch (Exception e){
				  CPersistenceUtil.printSQLException(e, "UpdateAccountInfo");
				  throw new CAccountManagerException("Unexpected exception in CAccountManagerBean (Naming or Hibernate or?)",e);
			}//catch
			finally {
				LOG.debug("About to exit from UpdateAccountInfo");
			}
		}
		private void updateContact(Session hsession, AccountSummary as, String uname, String pw) throws Exception 
		{
			CContact contact= (CContact)hsession.get(CContact.class, as.getContactId(), LockMode.UPGRADE_NOWAIT);
			CRole role=null;
			if (contact == null) {
				LOG.error("No contact was found id="+as.getContactId());
				throw new CContactNotFoundException();
			}//if
			else {
				//*** always 1 to 1 relationship, so role set has only one member
				Set roles = contact.getRoles();
				Iterator iter = roles.iterator();
				if (iter.hasNext()) {
					role = (CRole)iter.next();	
					contact.setName(as.getName());
					contact.setLname(as.getLname());
					role.setAdmin(as.getAdmin());
					if (pw != null && pw.length()!=0 ) {
						role.setPw(CSecurityUtil.encrypt(pw));
					}
					role.setUname(uname);
				} else {
					LOG.error("No roles was found for the contact id="+as.getContactId());
					throw new CRoleNotFoundException();
				} //else
			} //else
		}
}
