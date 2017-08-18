package com.ssi.ejb;
import com.ssi.exception.ABusinessException;

public class CAccountNotFoundException extends ABusinessException {
	  
	private static final long serialVersionUID = -7152851739114494688L;
	public CAccountNotFoundException(){}
   
   public CAccountNotFoundException(String msg) 
	{
	   super (msg);
	} 
   public CAccountNotFoundException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	} 
  public CAccountNotFoundException(Throwable cause) 
	{
	   super(cause);
	} 
}