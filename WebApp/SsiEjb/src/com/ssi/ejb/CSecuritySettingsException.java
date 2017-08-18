package com.ssi.ejb;
import com.ssi.exception.ABusinessException;
public class CSecuritySettingsException extends ABusinessException {

	private static final long serialVersionUID = 4462719083671029920L;
	public CSecuritySettingsException(){}
   
   public CSecuritySettingsException(String msg) 
	{
	   super (msg);
	} 
   public CSecuritySettingsException(String msg, Throwable cause) 
	{
	   super(msg,cause);
	} 
  public CSecuritySettingsException(Throwable cause) 
	{
	   super(cause);
	} 
}
