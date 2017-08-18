package com.ssi.util;

/**
 * @author AAO
 *
 */
public class CEmailException extends Exception {
	
	private static final long serialVersionUID = -8285467384434587402L;
	public CEmailException(){}
   
   public CEmailException(String msg) 
	{
	   super (msg);
	} 
   public CEmailException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	} 
  public CEmailException(Throwable cause) 
	{
	   super(cause);
	} 

}
