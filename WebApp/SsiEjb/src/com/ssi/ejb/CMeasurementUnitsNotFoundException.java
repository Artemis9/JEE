package com.ssi.ejb;
import com.ssi.exception.ABusinessException;
public class CMeasurementUnitsNotFoundException extends ABusinessException {

	private static final long serialVersionUID = 1034874029849030696L;
	public CMeasurementUnitsNotFoundException(){;}
	   
	   public CMeasurementUnitsNotFoundException(String msg) 
		{
		   super (msg);
		} 
	   public CMeasurementUnitsNotFoundException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		} 
	  public CMeasurementUnitsNotFoundException(Throwable cause) 
		{
		   super(cause);
		} 
}
