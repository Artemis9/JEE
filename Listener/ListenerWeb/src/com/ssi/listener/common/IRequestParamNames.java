/**
 * 
 */
package com.ssi.listener.common;

/**
 * @author AAO
 *
 */
public interface IRequestParamNames {
	String REQUEST_CODE="req_code";
	String GATEWAY_EUI="gw_Eui";
	String WSM_EUI="wsm_Eui";
	String WSM_TYPE="wsm_type";
	String WSM_DATA="wsm_data";
	String GW_MAC="gw_mac";
	String GWHW_VERSION="gwhw_version";
	String GWFW_VERSION="gwfw_version";
	String GWRADIOFW_VERSION="gwRadiofw_version";
	String GW_INITIAL_RESET="gw_initial_reset";
	String WSMHW_VERSION="wsmhw_version";
	String WSMFW_VERSION="wsmfw_version";
	String GW_TIME="gw_time";
	String WSM_LQI="wsm_to_gw_lqi";
	// The following will be put as an attribute into the request; only by the servlets
	String STATUS="status";
	String ERROR_LIST="err_list";
	String ERROR_MSG="err_msg";
	String GATEWAY_OBJECT="gateway_object";
	String USER_EVENT_LIST="user_event_list";
}
