package com.ssi.listener.handler;

import javax.naming.Context;
import javax.naming.InitialContext;
//import javax.rmi.PortableRemoteObject;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssi.common.IErrorCodes;
import com.ssi.common.IRequestCodes;
import com.ssi.common.IResponseMessages;
import com.ssi.listener.common.IRequestParamNames;
import com.ssi.listener.ejb.IListenerManagerHome;
import com.ssi.listener.ejb.IListenerManagerLocal;
import com.ssi.listener.util.CRequestParamHandler;
import com.ssi.persistence.CGateway;

public class CGwHello extends AHandler {
	public  int process2 (ServletContext cxt, HttpServletRequest request, HttpServletResponse response)
    throws Exception {
		LOG.info("In CGwHello handler");
		// Parse the specific request parameters
		String gw_eui = CRequestParamHandler.checkParameter(request, IRequestParamNames.GATEWAY_EUI);
		String gw_mac = CRequestParamHandler.checkParameter(request, IRequestParamNames.GW_MAC);
        String gw_fwVersion = CRequestParamHandler.checkParameter(request, IRequestParamNames.GWFW_VERSION);
        String gw_hwVersion = CRequestParamHandler.checkParameter(request, IRequestParamNames.GWHW_VERSION);
        String gw_radioFwVersion = CRequestParamHandler.checkParameter(request, IRequestParamNames.GWRADIOFW_VERSION);
        String gw_hello_reason = CRequestParamHandler.checkParameter(request, IRequestParamNames.GW_INITIAL_RESET);
        
        LOG.info("gw_eui="+gw_eui);
        LOG.info("gw_mac="+gw_mac);
        LOG.info("gw_fwVersion="+gw_fwVersion);
        LOG.info("gw_hwVersion="+gw_hwVersion);
        LOG.info("gw_radioFwVersion="+gw_radioFwVersion);
        LOG.info("gw_hello_reason="+gw_hello_reason);
        
        Object err =  request.getAttribute(IRequestParamNames.ERROR_LIST);
        
        if (err!=null) return HANDLE_RET_FAILED;
        // All needed parameters are there
        LOG.debug("All expected parameters are found in the query string");
        
        CGateway gw=new CGateway(gw_eui.toLowerCase());

        gw.setMac(gw_mac.toLowerCase());
        gw.setFwVersion(gw_fwVersion);
        gw.setHwVersion(gw_hwVersion);
        gw.setRadioFwVersion(gw_radioFwVersion);
        Integer eventCode = (new Integer(gw_hello_reason));
        int iCode=eventCode.intValue();
        if (iCode <= IRequestCodes.GATEWAY_HELLO ||
        		iCode > IRequestCodes.GATEWAY_HELLO_MAX_RANGE){
        	CRequestParamHandler.addError(request,IErrorCodes.INVALID_REQUEST_CODE,IResponseMessages.INVALID_REQUEST_CODE);
        	return HANDLE_RET_FAILED;
        }
        // Prepare to call EJB
        Context jndiContext      = new InitialContext();
        IListenerManagerHome home = (IListenerManagerHome) jndiContext.lookup("ListenerManagerLocal");
		
		//IListenerManagerHome home = (IListenerManagerHome) PortableRemoteObject.narrow(ref, IListenerManagerHome.class);
		IListenerManagerLocal lm = home.create();
		
		gw = lm.PowerOnGateway(gw, eventCode);
		// always return gateway parameters!!!
		request.setAttribute(IRequestParamNames.GATEWAY_OBJECT, gw);
		LOG.debug("Exiting CGwHello handler gw="+gw);
		return HANDLE_RET_OK;
    }
	
	public String getExceptionMessage (Exception e) {
		return "Error in (CGwHello) handler "+e.getMessage();
	}
}