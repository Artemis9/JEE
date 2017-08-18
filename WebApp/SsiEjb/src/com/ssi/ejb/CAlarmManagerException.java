package com.ssi.ejb;
import com.ssi.exception.ABusinessException;

/**
 * @author AAO
 *
 */
public class CAlarmManagerException extends ABusinessException {

	private static final long serialVersionUID = 3861329285759012104L;
	public CAlarmManagerException(){}
	   
	   public CAlarmManagerException(String msg) 
		{
		   super(msg);
		} 
	   public CAlarmManagerException(String msg, Throwable cause) 
		{
		   super(msg,cause);
		} 
	   public CAlarmManagerException(Throwable cause) 
		{
		   super(cause);
		} 
}
