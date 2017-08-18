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
import com.ssi.persistence.CWirelessSensorModule;

public class CLogSensorData extends AHandler {
	public  int process2 (ServletContext cxt, HttpServletRequest request, HttpServletResponse response)
    throws Exception {
		LOG.info("In CLogSensorData handler");
		// Parse the specific request parameters
		String gw_eui = CRequestParamHandler.checkParameter(request, IRequestParamNames.GATEWAY_EUI);
		String wsm_eui = CRequestParamHandler.checkParameter(request, IRequestParamNames.WSM_EUI);
        //String wsm_type = CRequestParamHandler.checkParameter(request, IRequestParamNames.WSM_TYPE);
        String wsm_data = CRequestParamHandler.checkParameter(request, IRequestParamNames.WSM_DATA);
        String gw_time =  CRequestParamHandler.checkParameter(request, IRequestParamNames.GW_TIME); 
        
        String wsm_lqi =  CRequestParamHandler.checkOptionalParameter(request, IRequestParamNames.WSM_LQI);  
        
        LOG.info("gw_eui = "+gw_eui);
        LOG.info("wsm_eui = "+wsm_eui);
        //LOG.info("wsm_type="+wsm_type);
        LOG.info("wsm_data = "+wsm_data);
        LOG.info("gw_time = "+gw_time);
        LOG.info("wsm_to_gw_lqi (opt) ="+wsm_lqi);
        
        Object err =  request.getAttribute(IRequestParamNames.ERROR_LIST);
        
        if (err!=null) return HANDLE_RET_FAILED;
        // All needed parameters are there
        LOG.debug("All expected parameters are found in the query string");
        
        CGateway gw=new CGateway(gw_eui.toLowerCase());
        
        CWirelessSensorModule wsm = new CWirelessSensorModule(wsm_eui.toLowerCase());

        Integer eventCode = (new Integer(IRequestCodes.UPDATE_SENSOR_DATA));
        
        long timeMs= (new Long(gw_time)).longValue() * 1000;
        Long time =  new Long(timeMs);
        // Prepare to call EJB
        Context jndiContext      = new InitialContext();
        IListenerManagerHome home = (IListenerManagerHome) jndiContext.lookup("ListenerManagerLocal");
		
		//IListenerManagerHome home = (IListenerManagerHome) PortableRemoteObject.narrow(ref, IListenerManagerHome.class);
		IListenerManagerLocal lm = home.create();
		
		gw = lm.LogSensorData(gw, wsm, wsm_data, time, eventCode, wsm_lqi);
		
		//always return gateway parameters!!!
		request.setAttribute(IRequestParamNames.GATEWAY_OBJECT, gw);
		LOG.debug("Exiting CLogSensorData handler gw="+gw);
		return HANDLE_RET_OK;
    }
	
	public String getExceptionMessage (Exception e) {
		return "Error in (CLogSensorData) handler "+e.getMessage();
	}

}
