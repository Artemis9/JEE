package com.ssi.listener.handler;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

import com.ssi.listener.common.IRequestParamNames;

import com.ssi.listener.ejb.IListenerManagerHome;
import com.ssi.listener.ejb.IListenerManagerLocal;
import com.ssi.listener.util.CRequestParamHandler;

import com.ssi.persistence.CGateway;
import com.ssi.persistence.CUserEvent;

public class CGwCommand extends AHandler {
	public  int process2 (ServletContext cxt, HttpServletRequest request, HttpServletResponse response)
    throws Exception {
		LOG.info("In CGwCommand handler");
		// Parse the specific request parameters
		CGateway gw = (CGateway) request.getAttribute(IRequestParamNames.GATEWAY_OBJECT);
        if (gw==null) {
    		String gw_eui = CRequestParamHandler.checkParameter(request, IRequestParamNames.GATEWAY_EUI);
    		LOG.info("gw_eui="+gw_eui);    		        
            if (gw_eui==null || gw_eui.length()==0) return HANDLE_RET_FAILED;
            // All needed parameters are there
            LOG.debug("All expected parameters are found in request");            
            gw=new CGateway(gw_eui.toLowerCase());
        }
        // Prepare to call EJB
        Context jndiContext      = new InitialContext();
        IListenerManagerHome home = (IListenerManagerHome) jndiContext.lookup("ListenerManagerLocal");
		IListenerManagerLocal lm = home.create();
		
		List ueList = lm.GetUserEvent(gw);
		// always return gateway parameters!!!
		request.setAttribute(IRequestParamNames.USER_EVENT_LIST, ueList);
		if (ueList != null && ueList.size() > 0)
			request.setAttribute(IRequestParamNames.GATEWAY_OBJECT, ((CUserEvent)ueList.get(0)).getGateway());
		
		return HANDLE_RET_OK;
    }
	
	public String getExceptionMessage (Exception e) {
		return "Error in (CGwCommand) handler "+e.getMessage();
	}

}
