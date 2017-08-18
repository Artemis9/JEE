package com.ssi.bean;
import java.util.*;

/**
 * @author AAO
 *
 */
public class AlarmHistoryDetails implements java.io.Serializable {

	private static final long serialVersionUID = 5158018381237354137L;
	private List alarmList;
	private Integer maxAlarms;
	
	public AlarmHistoryDetails() {;} 
	
	public AlarmHistoryDetails(List aList, Integer max) {
		this.alarmList = aList;
		this.maxAlarms = max;
	} 
	public List getAlarmList() {
		return alarmList;
	}
	public void setAlarmList(List alarmList) {
		this.alarmList = alarmList;
	}
	public Integer getMaxAlarms() {
		return maxAlarms;
	}
	public void setMaxAlarms(Integer maxAlarms) {
		this.maxAlarms = maxAlarms;
	}
	
	
}
