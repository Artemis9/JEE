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
import com.ssi.persistence.*;

public class CWsmConfig extends AHandler{
	public  int process2 (ServletContext cxt, HttpServletRequest request, HttpServletResponse response)
    throws Exception {
		LOG.info("In CWsmConfig handler");
		// Parse the specific request parameters
		String gw_eui = CRequestParamHandler.checkParameter(request, IRequestParamNames.GATEWAY_EUI);
		String wsm_eui = CRequestParamHandler.checkParameter(request, IRequestParamNames.WSM_EUI);
        String wsm_type = CRequestParamHandler.checkParameter(request, IRequestParamNames.WSM_TYPE);
        String wsmhw_version = CRequestParamHandler.checkParameter(request, IRequestParamNames.WSMHW_VERSION);
        String wsmfw_version = CRequestParamHandler.checkParameter(request, IRequestParamNames.WSMFW_VERSION);
           
        LOG.info("gw_eui="+gw_eui);
        LOG.info("wsm_eui="+wsm_eui);
        LOG.info("wsm_type="+wsm_type);
        LOG.info("wsmhw_version="+wsmhw_version);
        LOG.info("wsmfw_version="+wsmfw_version);
        
        Object err =  request.getAttribute(IRequestParamNames.ERROR_LIST);
        
        if (err!=null) return HANDLE_RET_FAILED;
        // All needed parameters are there
        LOG.debug("All expected parameters are found in the query string");
        
        CGateway gw=new CGateway(gw_eui.toLowerCase());
        
        CWirelessSensorModule wsm = new CWirelessSensorModule(wsm_eui.toLowerCase());

        wsm.setFwVersion(wsmfw_version);
        wsm.setHwVersion(wsmhw_version);
        
        CWsmType wsmType = new CWsmType();
        wsmType.setTypeId(wsm_type.toLowerCase());
        
        Integer eventCode = (new Integer(IRequestCodes.UPDATE_WSM_CONFIG));
        // Prepare to call EJB
        Context jndiContext      = new InitialContext();
        IListenerManagerHome home = (IListenerManagerHome) jndiContext.lookup("ListenerManagerLocal");
		
		//IListenerManagerHome home = (IListenerManagerHome) PortableRemoteObject.narrow(ref, IListenerManagerHome.class);
		IListenerManagerLocal lm = home.create();
		
		gw = lm.ConfigureWsm(gw, wsm, wsmType, eventCode);
		
		//always return gateway parameters!!!
		request.setAttribute(IRequestParamNames.GATEWAY_OBJECT, gw);
		LOG.debug("Exiting CWsmConfig handler gw="+gw);
		return HANDLE_RET_OK;
    }
	
	public String getExceptionMessage (Exception e) {
		return "Error in (CWsmConfig) handler "+e.getMessage();
	}

}
