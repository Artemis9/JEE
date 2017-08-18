package com.ssi.exception;

import com.ssi.common.IErrorCodes;
import com.ssi.common.IResponseMessages;

public abstract class ABusinessException extends Exception { 
	
	int reasonCode = IErrorCodes.DB_EXCEPTION ;
	String reasonMsg = IResponseMessages.DB_EXCEPTION;
	
	public ABusinessException() {} 
	
	public ABusinessException(String msg) 
	{
	   super (msg);
	} 
    public ABusinessException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	} 
	public ABusinessException(Throwable cause) 
	{
	   super(cause);
	} 
	public int getReasonCode() 
	{
		return reasonCode;
	}
	public void setReasonCode(int reasonCode) 
	{
		this.reasonCode = reasonCode;
	}

	public String getReasonMsg() {
		return reasonMsg;
	}

	public void setReasonMsg(String reasonMsg) {
		this.reasonMsg = reasonMsg;
	}
	
}
