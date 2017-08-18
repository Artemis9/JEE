/**
 * 
 */
package com.ssi.common;

/**
 * @author AAO
 *
 */
public interface IResponseMessages {
	String MISSING_REQUEST_PARAMETER="Missing Request Parameter";
	String INVALID_REQUEST_CODE="Invalid Request Code";
	String DB_EXCEPTION="DB or System Exception Occured";
	String GATEWAY_NOT_FOUND = "Gateway Not Found";
	String WSM_NOT_FOUND = "WSM Not Found";
	String WSM_TYPE_NOT_FOUND = "WSM Type Not Found";
	String WSM_TYPE_MEASUREMENTS_NOT_FOUND = "WSM Type Measurements Not Found";
	String DATA_MEASUREMENT_COUNT_MISMATCH = "Data And Measurement Counts Do Not Match";
	String TRANSACTION_EXCEPTION = "DB Transaction Rolledback Due to Possible Constraint Violation";
}
