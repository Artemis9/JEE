package com.ssi.ejb;
import com.ssi.exception.ABusinessException;
public class CMeasurementTypeNotFoundException extends ABusinessException {
	   /**
	 * 
	 */
	private static final long serialVersionUID = 6843099804472819437L;
	/**
	 * 
	 */
	
	public CMeasurementTypeNotFoundException(){}
   
   public CMeasurementTypeNotFoundException(String msg) 
	{
	   super (msg);
	} 
   public CMeasurementTypeNotFoundException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	} 
  public CMeasurementTypeNotFoundException(Throwable cause) 
	{
	   super(cause);
	} 
}
