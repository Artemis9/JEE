package com.ssi.listener.handler;


import javax.naming.Context;
import javax.naming.InitialContext;
//import javax.rmi.PortableRemoteObject;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssi.common.IRequestCodes;
import com.ssi.listener.common.IRequestParamNames;
import com.ssi.listener.ejb.IListenerManagerHome;
import com.ssi.listener.ejb.IListenerManagerLocal;
import com.ssi.listener.util.CRequestParamHandler;
import com.ssi.persistence.CGateway;

public class CGwHeartbeat extends AHandler {
	public  int process2 (ServletContext cxt, HttpServletRequest request, HttpServletResponse response)
    throws Exception {
		LOG.info("In CGwHeartBeat handler");
		// Parse the specific request parameters
		String gw_eui = CRequestParamHandler.checkParameter(request, IRequestParamNames.GATEWAY_EUI);
		String gw_mac = CRequestParamHandler.checkParameter(request, IRequestParamNames.GW_MAC);
        
        LOG.info("gw_eui="+gw_eui);
        LOG.info("gw_mac="+gw_mac);
        
        Object err =  request.getAttribute(IRequestParamNames.ERROR_LIST);
        
        if (err!=null) return HANDLE_RET_FAILED;
        // All needed parameters are there
        LOG.debug("All expected parameters are found in the query string");
        
        CGateway gw=new CGateway(gw_eui.toLowerCase());
        gw.setMac(gw_mac.toLowerCase());

        // Prepare to call EJB
        Context jndiContext      = new InitialContext();
        IListenerManagerHome home = (IListenerManagerHome) jndiContext.lookup("ListenerManagerLocal");

		//IListenerManagerHome home = (IListenerManagerHome) PortableLocalObject.narrow(ref, IListenerManagerHome.class);
		IListenerManagerLocal lm = home.create();
		Integer eventCode = (new Integer(IRequestCodes.GATEWAY_HEARTBEAT));
		gw = lm.HeartbeatGateway(gw,eventCode);
		// Always return gateway parameters!!!
		request.setAttribute(IRequestParamNames.GATEWAY_OBJECT, gw);
		LOG.debug("Exiting CGwHeartbeat handler gw="+gw);
		return HANDLE_RET_OK;
    }
	
	public String getExceptionMessage (Exception e) {
		return "Error in (CGwHeartbeat) handler "+e.getMessage();
	}
}