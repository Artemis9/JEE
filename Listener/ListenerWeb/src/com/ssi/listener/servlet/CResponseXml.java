package com.ssi.listener.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.text.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.ssi.listener.common.*;
import com.ssi.persistence.*;
import com.ssi.common.IUserCommands;

public class CResponseXml extends HttpServlet {

	private static Logger LOG = Logger.getLogger(CResponseXml.class.getName());

	/**
	 * Constructor of the object.
	 */
	public CResponseXml() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("application/xml");
        //response.setBufferSize(8192);
        
       
        String req_code = request.getParameter(IRequestParamNames.REQUEST_CODE);
        String gw_eui = request.getParameter(IRequestParamNames.GATEWAY_EUI);
        //String wsm_eui = request.getParameter(IRequestParamNames.WSM_EUI);
        //String wsm_type = request.getParameter(IRequestParamNames.WSM_TYPE);

        // Get the status 
        String strStat = (String) request.getAttribute(IRequestParamNames.STATUS);
        
        // Get the error code list
        Object errObj= request.getAttribute(IRequestParamNames.ERROR_LIST);
        List errList = (errObj == null)? null:(Vector) errObj ;
        
        // get the gateway object if exists
        Object gatewayObj= request.getAttribute(IRequestParamNames.GATEWAY_OBJECT);
        CGateway gw = (gatewayObj == null)? null:(CGateway) gatewayObj ;
        
        // get the user event list if it exists
        Object listObj=request.getAttribute(IRequestParamNames.USER_EVENT_LIST);
        List ueList = (List) listObj;
        // Get the server time for gateway synch up.
        TimeZone tz = TimeZone.getTimeZone("GMT");
	    java.util.Date date = new java.util.Date();
        DateFormat formatter= DateFormat.getDateTimeInstance(DateFormat.SHORT,DateFormat.LONG);
	    formatter.setTimeZone(tz);
        String rightNow=formatter.format(date);
        String tmpStr;
        
	    PrintWriter out = response.getWriter();
        out.println("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
	    LOG.debug("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
	    tmpStr = "<listener>" +
		    "<requestCode>" + req_code + "</requestCode>" +
 		    "<gwEui>" + gw_eui + "</gwEui>" +
            "<status>" + strStat + "</status>" ;
 		out.println(tmpStr);
 		LOG.debug(tmpStr);
 		// Put the error codes here...
 		if (errList != null) {
 			out.println("<error>");
 			LOG.debug("<error>");
 			Iterator i = errList.iterator();
 			while (i.hasNext()) {
 				tmpStr = ((Integer) i.next()).toString();
 				out.println(tmpStr);
 				LOG.debug(tmpStr);
 			}
 			out.println("</error>");
 			LOG.debug("</error>");
 			String errMsg = (String) request.getAttribute(IRequestParamNames.ERROR_MSG);
 			tmpStr = "<verbose>" + errMsg + "</verbose>";
 			out.println(tmpStr);
 			LOG.debug(tmpStr);
 		}
 		if (gw != null) {
 			out.println("<gwMeasurementPeriodMs>");
 			out.println(gw.getMeasurementInterval().longValue());		
 			out.println("</gwMeasurementPeriodMs>");
 			out.println("<gwReconfigureWakeupMs>");
 			out.println(gw.getWakeupInterval().longValue());		
 			out.println("</gwReconfigureWakeupMs>");
 			out.println("<gwTimeOutForHeartBeatMs>");
 			out.println(gw.getMaxHeartBeatInterval().longValue());		
 			out.println("</gwTimeOutForHeartBeatMs>");
 			
 			
 			LOG.debug("<gwMeasurementPeriodMs>");
 			LOG.debug(gw.getMeasurementInterval().longValue()+"");
 			LOG.debug("</gwMeasurementPeriodMs>");
 			LOG.debug("<gwReconfigureWakeupMs>");
 			LOG.debug(gw.getWakeupInterval().longValue()+"");
 			LOG.debug("</gwReconfigureWakeupMs>");
 			LOG.debug("<gwTimeOutForHeartBeatMs>");
 			LOG.debug(gw.getMaxHeartBeatInterval().longValue()+"");
 			LOG.debug("</gwTimeOutForHeartBeatMs>");
 		}

 		//Put the piggy-bagged user commands here...
 		if (ueList != null) {
 			Iterator i = ueList.iterator();
 			while (i.hasNext()) { 				
 				CUserEvent ue = (CUserEvent) i.next();
 				switch (ue.getEventCode().intValue()) {
 					case IUserCommands.DELETED_POD : 
 					case IUserCommands.MOVED_POD :
 							out.println("<removeWSM>");
 							LOG.debug("<removeWSM>");
 							tmpStr = ue.getWsm().getEuiOriginal();
 							out.println(tmpStr);
 							LOG.debug(tmpStr);
 							out.println("</removeWSM>");
 							LOG.debug("</removeWSM>");
 							break;
 					default: break;
 				} //switch
 			}//while
 		} //if
 		tmpStr = "<timestamp>" + rightNow.toString() + "</timestamp>";
 		out.println(tmpStr);
 		LOG.debug(tmpStr);
        out.println("</listener>");
	    LOG.debug("</listener>");
        out.close();
    }


	
	/**
	 * Returns information about the servlet, such as 
	 * author, version, and copyright. 
	 *
	 * @return String information about this servlet
	 */
	public String getServletInfo() {
		return "The servlet returns XML formatted gateway response contents.";
	}

	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occure
	 */
	public void init() throws ServletException {
		// Put your code here
	}

}
