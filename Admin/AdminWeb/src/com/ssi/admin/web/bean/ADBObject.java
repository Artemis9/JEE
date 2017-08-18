package com.ssi.admin.web.bean;

import org.apache.log4j.Logger;
import com.ssi.util.CTextUtil;

/**
 * @author AAO
 *
 */
public abstract class ADBObject implements IBusinessObject {

static Logger LOG = Logger.getLogger(ADBObject.class.getName());
static int MAX_FORM_NAME_LENGHT=40;

    protected Long id;
    protected String name;
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getNameJsStr(){
		return CTextUtil.GetStrAsJSVal(name);
	}
	public int getMaxNameLength() {
		return MAX_FORM_NAME_LENGHT;
	}
}   
