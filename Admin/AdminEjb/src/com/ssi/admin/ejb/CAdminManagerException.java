package com.ssi.admin.ejb;

import com.ssi.exception.ABusinessException;

public class CAdminManagerException extends ABusinessException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1138630956026675112L;
	public CAdminManagerException(){}
	   
	   public CAdminManagerException(String msg) 
		{
		   super(msg);
		} 
	   public CAdminManagerException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		} 
	   public CAdminManagerException(Throwable cause) 
		{
		   super(cause);
		} 
}