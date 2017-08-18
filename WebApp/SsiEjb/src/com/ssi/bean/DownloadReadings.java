package com.ssi.bean;

import java.util.List;

/**
 * @author AAO
 *
 */
public class DownloadReadings implements java.io.Serializable {

	private static final long serialVersionUID = 742086466894781755L;
	private List sensorDataList;
	private Integer total;
	
	public DownloadReadings(List sdList, Integer tot) {
		this.sensorDataList = sdList;
		this.total = tot;
	}
	public List getSensorDataList() {
		return sensorDataList;
	}
	public void setSensorDataList(List sensorDataList) {
		this.sensorDataList = sensorDataList;
	}
	public Integer getTotal() {
		return total;
	}
	public void setTotal(Integer total) {
		this.total = total;
	}
}
