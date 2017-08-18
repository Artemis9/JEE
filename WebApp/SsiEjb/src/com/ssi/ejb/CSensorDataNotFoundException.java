package com.ssi.ejb;
import com.ssi.exception.ABusinessException;
public class CSensorDataNotFoundException extends ABusinessException {

	private static final long serialVersionUID = 1034874029849030696L;
	public CSensorDataNotFoundException(){;}
	   
	   public CSensorDataNotFoundException(String msg) 
		{
		   super (msg);
		} 
	   public CSensorDataNotFoundException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		} 
	  public CSensorDataNotFoundException(Throwable cause) 
		{
		   super(cause);
		} 
}
