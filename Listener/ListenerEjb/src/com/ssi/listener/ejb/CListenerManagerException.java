package com.ssi.listener.ejb;

import com.ssi.exception.ABusinessException;

public class CListenerManagerException extends ABusinessException {

	private static final long serialVersionUID = -4817153637326522413L;

	public CListenerManagerException(){}
	   
	   public CListenerManagerException(String msg) 
		{
		   super(msg);
		   
		} 
	   public CListenerManagerException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		   
		} 
	   public CListenerManagerException(Throwable cause) 
		{
		   super(cause);
		   
		} 
}
