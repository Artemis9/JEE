/**
 * 
 */
package com.ssi.listener.util;

import java.util.List;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;

import com.ssi.common.IErrorCodes;
import com.ssi.common.IResponseMessages;
import com.ssi.listener.common.IRequestParamNames;
import com.ssi.listener.common.IStatusCodes;


/**
 * @author AAO
 *
 */
public class CRequestParamHandler {
	public static String checkParameter(HttpServletRequest request, String paramName)
	 {
     String param = request.getParameter(paramName);
     if ( param==null || param.length()==0 ) {
      addError(request,IErrorCodes.MISSING_REQUEST_PARAMETER,IResponseMessages.MISSING_REQUEST_PARAMETER);
   	  param=null;
     }
     return(param);
    }
	public static String checkOptionalParameter(HttpServletRequest request, String paramName)
	{
    String param = request.getParameter(paramName);
    return(param);
   }
	public static void addError(HttpServletRequest request, int errCode, String errMsg)
	 {
  	  List errList = (Vector) request.getAttribute(IRequestParamNames.ERROR_LIST);
  	  if (errList == null) {
  		  errList = new Vector();
  	  } 
  	  errList.add(new Integer(errCode));
  	  request.setAttribute(IRequestParamNames.ERROR_LIST, errList);
  	  request.setAttribute(IRequestParamNames.ERROR_MSG, errMsg);
  	  request.setAttribute(IRequestParamNames.STATUS, IStatusCodes.ERROR);
   }
}
