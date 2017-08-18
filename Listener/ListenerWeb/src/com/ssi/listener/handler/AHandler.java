package com.ssi.listener.handler;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;

import com.ssi.common.IErrorCodes;
import com.ssi.common.IResponseMessages;
import com.ssi.exception.ABusinessException;
import com.ssi.listener.util.CRequestParamHandler;
import com.ssi.util.CTextUtil;



/**
 * This class standardizes the following handler properties:
 * 1.  error exception handling
 * 2.  error logging for handlers
 * 3.  return codes
 */
public abstract class AHandler implements IHandler {

static Logger LOG = Logger.getLogger(AHandler.class.getName());
/**
 * Standard error codes from process ()
 * Add custom error codes in your derived class
 */
public static final int HANDLE_RET_FAILED = 0;
public static final int HANDLE_RET_OK = 1;

/**
 * The IHandler interface
 */
public int process (ServletContext cxt,HttpServletRequest req,HttpServletResponse res){
    try {
        return process2 (cxt, req, res);
    } catch (Exception e){
	    LOG.error("\nHandler error: "+getExceptionMessage(e));
	    LOG.error("\nURL Query String: "+req.getQueryString());
	    LOG.error("\nException Stack: "+CTextUtil.getStackTrace(e));
	   
        if (e instanceof ABusinessException) {
        	Throwable t = e.getCause();
        	if (t instanceof ABusinessException) {
             	ABusinessException at=(ABusinessException)t;
             	CRequestParamHandler.addError(req, at.getReasonCode() ,at.getReasonMsg());
             } else {
	        	ABusinessException at=(ABusinessException)e;
	        	CRequestParamHandler.addError(req, at.getReasonCode() ,at.getReasonMsg());
             }
        }
        else 
        	 CRequestParamHandler.addError(req, IErrorCodes.TRANSACTION_EXCEPTION,IResponseMessages.TRANSACTION_EXCEPTION);
        return HANDLE_RET_FAILED;
    } //catch
}

/**
 * @param ServletContext cxt: The servlet context
 * @param HttpServletRequest req: The request object
 * @param HttpServletResponse res: The response object
 * @return int: on of the HANDLE_RET_xxx return codes
 */
public abstract int process2 (ServletContext cxt,HttpServletRequest req,HttpServletResponse res)
        throws Exception;

/**
 * Called by the process function in the catch (Exception) block
 * This will return a specific error message for each handler within which
 * any exception generated and the error message gets displayed on info.jsp
 */
public abstract String getExceptionMessage (Exception e);

}