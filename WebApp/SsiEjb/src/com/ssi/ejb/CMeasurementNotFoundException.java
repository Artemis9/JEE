package com.ssi.ejb;
import com.ssi.exception.ABusinessException;
public class CMeasurementNotFoundException extends ABusinessException {

	private static final long serialVersionUID = -805489995399586256L;
	public CMeasurementNotFoundException(){}
	   
	   public CMeasurementNotFoundException(String msg) 
		{
		   super (msg);
		} 
	   public CMeasurementNotFoundException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		} 
	  public CMeasurementNotFoundException(Throwable cause) 
		{
		   super(cause);
		} 
}
