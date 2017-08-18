package com.ssi.persistence;


/**
 * @author AAO
 *
 */
public class CWsmData implements IPersistenceObject {

	private static final long serialVersionUID = -1465041534925037861L;
	private Long id;
	private Short value;
	private String dataCode;
	private CListenerEvent listenerEvent;
	
	public CWsmData() {;}
	
	public CWsmData(Long id) {
		this.id = id;
	}

	public CWsmData(Long id, Short value, String dataCode, CListenerEvent listenerEvent) {
		this.id = id;
		this.value = value;
		this.dataCode = dataCode;
		this.listenerEvent = listenerEvent;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getDataCode() {
		return dataCode;
	}

	public void setDataCode(String dataCode) {
		this.dataCode = dataCode;
	}

	public Short getValue() {
		return value;
	}

	public void setValue(Short value) {
		this.value = value;
	}

	public CListenerEvent getListenerEvent() {
		return listenerEvent;
	}

	public void setListenerEvent(CListenerEvent listenerEvent) {
		this.listenerEvent = listenerEvent;
	}

}
