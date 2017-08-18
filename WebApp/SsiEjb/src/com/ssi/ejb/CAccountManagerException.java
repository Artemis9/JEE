package com.ssi.ejb;
import com.ssi.exception.ABusinessException;

public class CAccountManagerException extends ABusinessException {

	private static final long serialVersionUID = 4462719083671029920L;
	public CAccountManagerException(){}
   
   public CAccountManagerException(String msg) 
	{
	   super (msg);
	} 
   public CAccountManagerException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	} 
  public CAccountManagerException(Throwable cause) 
	{
	   super(cause);
	} 
}
