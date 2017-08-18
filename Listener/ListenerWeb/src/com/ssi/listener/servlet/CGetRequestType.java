package com.ssi.listener.servlet;




import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;


import com.ssi.common.*;
import com.ssi.listener.common.IRequestParamNames;
import com.ssi.listener.common.IStatusCodes;
import com.ssi.listener.handler.*;
import com.ssi.listener.util.CRequestParamHandler;
import com.ssi.util.CTextUtil;

import org.apache.log4j.*;




public class CGetRequestType extends HttpServlet {
	
	private static Logger LOG = Logger.getLogger(CGetRequestType.class.getName());
	

	/**
	 * Constructor of the object.
	 */
	public CGetRequestType() {
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
		//System.out.println("In the CGetRequestType");
		LOG.info("In CGetRequestType Servlet");
		LOG.debug("\nURL Query String: "+request.getRequestURI()+request.getQueryString());
		try {
			ServletContext context = getServletContext();
			int rc=-1; // unititialized; neither handler success nor failure
			request.setAttribute(IRequestParamNames.STATUS, IStatusCodes.OK);
			
			String req_code = CRequestParamHandler.checkParameter(request, IRequestParamNames.REQUEST_CODE);
	        
	        if ((req_code!=null)) {
		        try {
		        	int action = (new Integer(req_code)).intValue();
		        	
		        	LOG.info("The value of req_code="+req_code);
		        	switch (action){
			        	case IRequestCodes.UPDATE_SENSOR_DATA: {
			        		IHandler handler = new CLogSensorData();
			        		rc= handler.process(context,request,response);
			        		break;
			        		}
			        	case IRequestCodes.UPDATE_WSM_CONFIG: {
			        		IHandler handler = new CWsmConfig();
			        		rc= handler.process(context,request,response);
			        		break;
			        		}
			        	case IRequestCodes.GATEWAY_HEARTBEAT: {
			        		IHandler handler = new CGwHeartbeat();
			        		rc= handler.process(context,request,response);
			        		break;
			        		}
			        	case IRequestCodes.GATEWAY_HELLO: {
			        		IHandler handler = new CGwHello();
			        		rc= handler.process(context,request,response);
			        		break;
			        		}
			        	default:CRequestParamHandler.addError(request,IErrorCodes.INVALID_REQUEST_CODE,IResponseMessages.INVALID_REQUEST_CODE);
		        	}
		        	LOG.debug("rc="+rc);
		        } //try
		        catch (NumberFormatException e)
		        {
		        	CRequestParamHandler.addError(request,IErrorCodes.INVALID_REQUEST_CODE,IResponseMessages.INVALID_REQUEST_CODE);
		        }
	        } // if 
	        // think about whether to execute the following servlets when there request code or gateway EUI is missing.
	        //includeServlet("/AddWsmControl",context, request,response);
	        //includeServlet("/AddGwConfig",context, request,response);
	        //includeServlet("/AddWsmConfigQuery",request,response);
	        //includeServlet("/AddErrorLogQuery",request,response);
	        //includeServlet("/AddFirmwareUpdateQuery",request,response);
	        
	        IHandler handler = new CGwCommand();
	        rc = handler.process(context,request,response);
	        //Finally, render to output servlet
	        RequestDispatcher dispatcher = context.getRequestDispatcher("/ResponseXml");
	        if (dispatcher != null) {
	                dispatcher.forward(request, response);
	        }
		}
        catch (Exception e){
        	LOG.error("\nGetRequestType Error: "+e.getMessage());
            LOG.error("\nURL Query String: "+request.getQueryString());
            LOG.error("\nException Stack: "+CTextUtil.getStackTrace(e));
            //CRequestParamHandler.addError(req,IErrorCodes.APPLICATION_EXCEPTION,IResponseMessages.APPLICATION_EXCEPTION);
        }
	}
	
	private void includeServlet(String servletUrl, ServletContext context, HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException
	{
		RequestDispatcher dispatcher = context.getRequestDispatcher(servletUrl);
		if (dispatcher != null) {
            dispatcher.include(request, response);
        }
	}
	
	

	/**
	 * Returns information about the servlet, such as 
	 * author, version, and copyright. 
	 *
	 * @return String information about this servlet
	 */
	public String getServletInfo() {
		return "Controller Servlet";
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
