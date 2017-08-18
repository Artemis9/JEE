package com.ssi.listener.ejb;

import com.ssi.common.IErrorCodes;
import com.ssi.common.IResponseMessages;
import com.ssi.exception.ABusinessException;

public class CWsmTypeMeasurementsNotFoundException extends ABusinessException {
	
	   /**
	 * 
	 */
	private static final long serialVersionUID = 8878380974780098082L;
	public CWsmTypeMeasurementsNotFoundException(){
		this.setReasonCode(IErrorCodes.WSM_TYPE_MEASUREMENTS_NOT_FOUND);
		this.setReasonMsg(IResponseMessages.WSM_TYPE_MEASUREMENTS_NOT_FOUND);
		}
	   
	   public CWsmTypeMeasurementsNotFoundException(String msg) 
		{
		   super (msg);
		   this.setReasonCode(IErrorCodes.WSM_TYPE_MEASUREMENTS_NOT_FOUND);
		   this.setReasonMsg(IResponseMessages.WSM_TYPE_MEASUREMENTS_NOT_FOUND);
		} 
	   public CWsmTypeMeasurementsNotFoundException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		   this.setReasonCode(IErrorCodes.WSM_TYPE_MEASUREMENTS_NOT_FOUND);
		   this.setReasonMsg(IResponseMessages.WSM_TYPE_MEASUREMENTS_NOT_FOUND);
		} 
	  public CWsmTypeMeasurementsNotFoundException(Throwable cause) 
		{
		   super(cause);
		   this.setReasonCode(IErrorCodes.WSM_TYPE_MEASUREMENTS_NOT_FOUND);
		   this.setReasonMsg(IResponseMessages.WSM_TYPE_MEASUREMENTS_NOT_FOUND);
		} 
}
