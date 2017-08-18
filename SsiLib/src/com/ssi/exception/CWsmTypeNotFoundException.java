package com.ssi.exception;

import com.ssi.common.IErrorCodes;
import com.ssi.common.IResponseMessages;

public class CWsmTypeNotFoundException extends ABusinessException {

	private static final long serialVersionUID = 4488193333357939286L;
	public CWsmTypeNotFoundException(){
		this.reasonCode = IErrorCodes.WSM_TYPE_NOT_FOUND;
		this.reasonMsg = IResponseMessages.WSM_TYPE_NOT_FOUND;
		}
	   
	   public CWsmTypeNotFoundException(String msg) 
		{
		   super (msg);
		   this.reasonCode = IErrorCodes.WSM_TYPE_NOT_FOUND;
		   this.reasonMsg = IResponseMessages.WSM_TYPE_NOT_FOUND;
		} 
	   public CWsmTypeNotFoundException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		   this.reasonCode = IErrorCodes.WSM_TYPE_NOT_FOUND;
		   this.reasonMsg = IResponseMessages.WSM_TYPE_NOT_FOUND;
		} 
	  public CWsmTypeNotFoundException(Throwable cause) 
		{
		   super(cause);
		   this.reasonCode = IErrorCodes.WSM_TYPE_NOT_FOUND;
		   this.reasonMsg = IResponseMessages.WSM_TYPE_NOT_FOUND;
		} 
	}