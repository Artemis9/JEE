package com.ssi.util;

import java.sql.Timestamp;
import java.util.Calendar;

import org.apache.log4j.Logger;

public class CDateUtil {
	static Logger LOG = Logger.getLogger(CDateUtil.class.getName());
	private static int gmtOffset;
	public static long days90_ms;
	public static long days365_ms;
	static { // gmt offset obtained once, does not change, determined by the locale
		Calendar cal = Calendar.getInstance(); 
		gmtOffset = cal.get(Calendar.ZONE_OFFSET);  
		days90_ms = 91L * 24L * 60L * 60L * 1000L;
		days365_ms = 365L * 24L * 60L * 60L * 1000L;
		//LOG.info("XXXXXXXXXXXX IN CDateUtil days90_ms="+days90_ms);
	}
	// DST offset may change anytime depending on the daylight savings time
	private static int getDstOffset() {
		Calendar cal = Calendar.getInstance(); // time in ms & DST_OFFSET varies by the millisecond
	    return(cal.get(Calendar.DST_OFFSET));  // a +1, during the summer
	}
	public static java.sql.Timestamp getCurrentDST()  {
		return( new java.sql.Timestamp(getCurrentDSTmslong()));
	}
	public static java.sql.Timestamp getCurrentLocalTime(long DSTms, long localTimeZoneOffset)  {
		return( new java.sql.Timestamp(DSTms+localTimeZoneOffset*1000*60*60));
	}
	public static java.sql.Timestamp getDSTTime(long localMs, long localTimeZoneOffset)  {
		return( new java.sql.Timestamp(localMs-localTimeZoneOffset*1000*60*60));
	}
	public static java.sql.Timestamp getCurrentDST(long ms)  {
		long ams = (ms - getDstOffset()) - gmtOffset ;
		return( new java.sql.Timestamp(ams));
	}
	public static Long getCurrentDSTms()  {
		return(new Long(getCurrentDSTmslong()));
	}
	
	public static long getCurrentDSTmslong(){
		Calendar cal = Calendar.getInstance() ;
		long ms = cal.getTimeInMillis();
		ms = (ms - cal.get(Calendar.DST_OFFSET)) - gmtOffset ;
		return(ms);
	}
	public static Timestamp CalcLocalTime(Timestamp udt, Long tzo){
		//JSF handles nulls well, but make sure to catch them.
		if (udt != null && tzo != null) {
			long dst = udt.getTime();
			return CDateUtil.getCurrentLocalTime(dst, tzo.longValue());
		}
		return null;
	}
	public static Timestamp CalcDSTTime(Timestamp dst, Long tzo){
		//JSF handles nulls well, but make sure to catch them.
		if (dst != null && tzo != null) {
			long udt = dst.getTime();
			return CDateUtil.getDSTTime(udt, tzo.longValue());
		}
		return null;
	}
   public static Timestamp get90DayDST() {
	   long date90dayBefore_ms = getCurrentDSTmslong() - days90_ms;
	   return( new java.sql.Timestamp(date90dayBefore_ms));
   }
   public static Timestamp get365DayDST() {
	   long date365dayBefore_ms = getCurrentDSTmslong() - days365_ms;
	   return( new java.sql.Timestamp(date365dayBefore_ms));
   }
}
