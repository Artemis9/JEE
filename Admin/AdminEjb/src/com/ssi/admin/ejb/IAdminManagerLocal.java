package com.ssi.admin.ejb;
import javax.ejb.EJBException;

import com.ssi.admin.bean.*;
import com.ssi.persistence.*;

import java.util.List;

/**
 * @author AAO
 *
 */
public interface IAdminManagerLocal extends javax.ejb.EJBLocalObject {
	public IAdminObject GetGatewayInfo(Long id) throws EJBException, CAdminManagerException;
	public List GetGateways() throws EJBException, CAdminManagerException;
	public IPersistenceObject UpdateAdminInfo(Long gwId, CAccount acc, CRole r1, CRole r2) throws EJBException, CAdminManagerException;
	public void DeletePod(Long podId) throws EJBException, CAdminManagerException;
	public IPersistenceObject GetGatewayPods(Long gwId) throws EJBException, CAdminManagerException;
	public IPersistenceObject MarkGwPodDeleted(Long gwId, Long wsmId) throws EJBException, CAdminManagerException;
	public List GetLqiHistory(Long wsmId, Long tzo) throws EJBException, CAdminManagerException;
}