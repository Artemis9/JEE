package com.ssi.common;

public interface IJNDINames {
	String HIBERNATE_SESSION_FACTORY = "java:/org/hibernate/SessionFactory";
	String EMAIL_SESSION_NAME = "java:comp/env/mail/SsiJavaMailSession";
	String SSI_MANAGER_LOCAL_HOME = "SsiManagerLocal";
	String ACCOUNT_MANAGER_LOCAL_HOME = "AccountManagerLocal";
	String ALARM_MANAGER_LOCAL_HOME = "AlarmManagerLocal";
}
