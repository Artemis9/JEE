package com.ssi.exception;

import com.ssi.common.IErrorCodes;
import com.ssi.common.IResponseMessages;
import com.ssi.exception.ABusinessException;

public class CWsmNotFoundException extends ABusinessException {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8898283086178595885L;
	public CWsmNotFoundException(){
		this.reasonCode = IErrorCodes.WSM_NOT_FOUND;
		this.reasonMsg = IResponseMessages.WSM_NOT_FOUND;
		}
	   
	   public CWsmNotFoundException(String msg) 
		{
		   super (msg);
		   this.reasonCode = IErrorCodes.WSM_NOT_FOUND;
		   this.reasonMsg = IResponseMessages.WSM_NOT_FOUND;
		} 
	   public CWsmNotFoundException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		   this.reasonCode = IErrorCodes.WSM_NOT_FOUND;
		   this.reasonMsg = IResponseMessages.WSM_NOT_FOUND;
		} 
	  public CWsmNotFoundException(Throwable cause) 
		{
		   super(cause);
		   this.reasonCode = IErrorCodes.WSM_NOT_FOUND;
		   this.reasonMsg = IResponseMessages.WSM_NOT_FOUND;
		} 
}
