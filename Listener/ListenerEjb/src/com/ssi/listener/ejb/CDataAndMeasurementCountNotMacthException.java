package com.ssi.listener.ejb;
import com.ssi.common.IErrorCodes;
import com.ssi.common.IResponseMessages;
import com.ssi.exception.ABusinessException;

public class CDataAndMeasurementCountNotMacthException extends ABusinessException{

	private static final long serialVersionUID = -4453852654029799931L;
	public CDataAndMeasurementCountNotMacthException(){
		this.setReasonCode(IErrorCodes.DATA_MEASUREMENT_COUNT_MISMATCH);
		this.setReasonMsg(IResponseMessages.DATA_MEASUREMENT_COUNT_MISMATCH);
		}
	   
	   public CDataAndMeasurementCountNotMacthException(String msg) 
		{
		   super (msg);
		   this.setReasonCode(IErrorCodes.DATA_MEASUREMENT_COUNT_MISMATCH);
		   this.setReasonMsg(IResponseMessages.DATA_MEASUREMENT_COUNT_MISMATCH);
		} 
	   public CDataAndMeasurementCountNotMacthException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		   this.setReasonCode(IErrorCodes.DATA_MEASUREMENT_COUNT_MISMATCH);
		   this.setReasonMsg(IResponseMessages.DATA_MEASUREMENT_COUNT_MISMATCH);
		} 
	  public CDataAndMeasurementCountNotMacthException(Throwable cause) 
		{
		   super(cause);
		   this.setReasonCode(IErrorCodes.DATA_MEASUREMENT_COUNT_MISMATCH);
		   this.setReasonMsg(IResponseMessages.DATA_MEASUREMENT_COUNT_MISMATCH);
		} 
}
