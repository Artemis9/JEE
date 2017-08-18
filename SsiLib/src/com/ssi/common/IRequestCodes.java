/**
 * 
 */
package com.ssi.common;

/**
 * @author AAO
 *
 */
public interface IRequestCodes {
	int UPDATE_SENSOR_DATA= 10;
	int UPDATE_WSM_CONFIG=20;
	int GATEWAY_HEARTBEAT=30;
	int GATEWAY_HELLO=40;
	// the following are sub reasons
		int GATEWAY_HELLO_RESET=42;
		int GATEWAY_HELLO_POWER=44;
		int GATEWAY_HELLO_RECOVER=46;
		int GATEWAY_HELLO_UPGRADE=48;
		int	GATEWAY_HELLO_POWER_BROWNOUT=50;
		int	GATEWAY_HELLO_CLOCK_FAILURE=52;
		int GATEWAY_HELLO_SW_RESET=54;

		int GATEWAY_HELLO_MAX_RANGE=1000;

}