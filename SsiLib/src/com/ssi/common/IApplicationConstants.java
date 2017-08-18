/**
 * 
 */
package com.ssi.common;

/**
 * @author AAO
 *
 */
public interface IApplicationConstants {
	
	long MIN_MEASUREMENT_INTERVAL_MS=30000;
	long MIN_HEARTBEAT_INTERVAL_MS=300000;
	long MAX_WAKEUP_INTERVAL_MS=300000;
	long DEFAULT_MEASUREMENT_INTERVAL_MS=60000;
	
	long MAX_SERVER_LAG_TIME_MS=20000;
	
	String WSM_TYPE_ANALOG0 = "0200";
	String WSM_TYPE_ANALOG1 = "0201";
	String WSM_TYPE_ANALOG4 = "0204";
	String WSM_TYPE_TEMP0 = "0100";
	
	String MEASUREMENT_TYPE_DIGITAL_INPUT = "113";
	String MEASUREMENT_TYPE_EVENT_COUNTER = "112";
	String MEASUREMENT_TYPE_SUPPLY_VOLTAGE = "108";
	
	String MEASUREMENT_TYPE_HUMIDITY = "100";
	String MEASUREMENT_TYPE_TEMPERATURE = "101";
	String MEASUREMENT_TYPE_AMBIENT_TEMPERATURE = "103";
	String MEASUREMENT_TYPE_RTD = "109";
	String MEASUREMENT_TYPE_THERMISTOR = "111";
	String MEASUREMENT_TYPE_THERMOCOUPLE = "110";
	
	String MEASUREMENT_UNIT_FAHRENHEIT = "F";
	String MEASUREMENT_UNIT_CELCIUS ="C";
	
	String GATEWAY_NAME_PREFIX = "GW-";
	
	String DEFAULT_VIEWER_NAME = "Reader";
	String DEFAULT_ADMIN_NAME = "Admin";
	
	short MAX_ALARM_SAMPLE = 10;
	short MIN_ALARM_OCCURRENCE = 1;
	
	short ALARM_CONNECTOR_AND = 0;
	short ALARM_CONNECTOR_OR = 1;
	
	short ALARM_OPERATOR_GT = 1;
	short ALARM_OPERATOR_LT = -1;
	short ALARM_OPERATOR_EQ = 0;
	
	short DEFAULT_SUPPLY_VOLTAGE_ALARM_FILTER_LENGHT=2;
	short DEFAULT_SUPPLY_VOLTAGE_ALARM_FILTER_LIMIT=2;
	float DEFAULT_SUPPLY_VOLTAGE_ALARM_VALUE_33= (float)3.3;
	float DEFAULT_SUPPLY_VOLTAGE_ALARM_VALUE_31= (float)3.1;

	String DEFAULT_SUPPLY_VOLTAGE_ALARM_DESCRIPTION="Predefined alarm for low supply voltage";
	String DEFAULT_SUPPLY_VOLTAGE_ALARM_NAME="System alarm: Low supply voltage";
	
	short MAX_TOTAL_WSM_SENSORS = 16;
	
	short SERVICE_LEVEL_STANDARD = 1;
	short SERVICE_LEVEL_PREMIUM = 2;
	
	short DELETED_OBJECT_KEY = -1;
	
}
