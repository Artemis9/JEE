package com.ssi.ejb;
import com.ssi.exception.ABusinessException;
public class CContactNotFoundException extends ABusinessException {
	  
	private static final long serialVersionUID = 4966599303479998925L;
	public CContactNotFoundException(){}
   
   public CContactNotFoundException(String msg) 
	{
	   super (msg);
	} 
   public CContactNotFoundException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	} 
  public CContactNotFoundException(Throwable cause) 
	{
	   super(cause);
	} 
}