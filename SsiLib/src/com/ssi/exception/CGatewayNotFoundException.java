package com.ssi.exception;

import com.ssi.common.IErrorCodes;
import com.ssi.common.IResponseMessages;
import com.ssi.exception.ABusinessException;

public class CGatewayNotFoundException extends ABusinessException {

	private static final long serialVersionUID = -9001269864384510803L;
	public CGatewayNotFoundException(){
		this.reasonCode = IErrorCodes.GATEWAY_NOT_FOUND;
		this.reasonMsg = IResponseMessages.GATEWAY_NOT_FOUND;
	}
   
   public CGatewayNotFoundException(String msg) 
	{
	   super (msg);
	   this.reasonCode = IErrorCodes.GATEWAY_NOT_FOUND;
	   this.reasonMsg = IResponseMessages.GATEWAY_NOT_FOUND;
	} 
   public CGatewayNotFoundException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	   this.reasonCode = IErrorCodes.GATEWAY_NOT_FOUND;
	   this.reasonMsg = IResponseMessages.GATEWAY_NOT_FOUND;
	} 
  public CGatewayNotFoundException(Throwable cause) 
	{
	   super(cause);
	   this.reasonCode = IErrorCodes.GATEWAY_NOT_FOUND;
	   this.reasonMsg = IResponseMessages.GATEWAY_NOT_FOUND;
	} 
}


	