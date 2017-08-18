package com.ssi.ejb;
import com.ssi.exception.ABusinessException;
public class CRoleNotFoundException extends ABusinessException {

	private static final long serialVersionUID = 8903731633087996270L;
	public CRoleNotFoundException(){}
   
   public CRoleNotFoundException(String msg) 
	{
	   super (msg);
	} 
   public CRoleNotFoundException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	} 
  public CRoleNotFoundException(Throwable cause) 
	{
	   super(cause);
	} 
}