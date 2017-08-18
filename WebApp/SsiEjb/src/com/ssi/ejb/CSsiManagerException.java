package com.ssi.ejb;
import com.ssi.exception.ABusinessException;
public class CSsiManagerException extends ABusinessException {

	private static final long serialVersionUID = 2706195374291502064L;
	public CSsiManagerException(){}
	   
	   public CSsiManagerException(String msg) 
		{
		   super(msg);
		} 
	   public CSsiManagerException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		} 
	   public CSsiManagerException(Throwable cause) 
		{
		   super(cause);
		} 
}
