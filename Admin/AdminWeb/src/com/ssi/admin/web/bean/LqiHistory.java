package com.ssi.admin.web.bean;


import java.util.List;
import java.util.Iterator;
import java.util.Map;


import javax.faces.context.FacesContext;
import javax.faces.context.ExternalContext;
import javax.servlet.http.HttpServletRequest;

import com.ssi.admin.ejb.IAdminManagerLocal;
import com.ssi.persistence.WsmData;
import com.ssi.util.CDateUtil;
/**
 * @author AAO
 *
 */
public class LqiHistory  extends AAdminObject {

	private List dataList;
	private Long tzo;
	
	public LqiHistory() {;}
	
	protected void init() {
		LOG.info("XXXXXXXXX  In LqiHistory.init()  XXXXXXXXX");
		this.sessionFail = false;
		try {
			ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
			Map session = context.getSessionMap();
			this.tzo = (Long) session.get("USER_TZO");
			if (this.id == null) {					
				HttpServletRequest request = (HttpServletRequest) context.getRequest();			
				String strIndex = request.getParameter("podId");
				if (strIndex==null) {
					LOG.error("Could not find the podId in request (null)");
				}
				else 
				{ //A particular pod is asked to be seen. 
					this.id = Long.valueOf(strIndex);
					LOG.info("id of pod="+this.id);
				}//else
				strIndex = request.getParameter("podName");
				if (strIndex==null) {
					LOG.error("Could not find the podName in request (null)");
				}
				else 
				{ //A particular pod is asked to be seen. 
					this.name = strIndex;
					LOG.info("Name of pod="+this.name);
				}//else
			}//if
            
			IAdminManagerLocal am = initAdminEjbLocal();		
			this.dataList = am.GetLqiHistory(this.id, this.tzo);
			if (this.dataList != null) {
				Iterator iter = this.dataList.iterator();
				while (iter.hasNext()){
					WsmData wd = (WsmData) iter.next();
					LOG.debug("XXXXXXXXX  In LqiHistory.init()  wd.getValue="+wd.getValue());
					LOG.debug("XXXXXXXXX  In LqiHistory.init()  wd.getTs="+wd.getTs()+" wd.tzo="+wd.getTzo());
					LOG.debug("XXXXXXXXX  In LqiHistory.init()  wd.getGwTs="+wd.getGwTs());
				}//while
			}//if
		} //try
	 catch (Exception e) {
	    logExceptionMessage(e,"init()");
	 }
	}
	
	public Long getTzo() {
		return tzo;
	}

	public void setTzo(Long tzo) {
		this.tzo = tzo;
	}

	public List getDataList() {
		return dataList;
	}

	public void setDataList(List dataList) {
		this.dataList = dataList;
	}
	public String getInit() {
		init();
		return("");
	}
	public void setInit(String str) {
		LOG.info("XXXXXXXXX  IN setInit()  XXXXXXXXX");
	}
	protected String getExceptionMessage (Exception e) {
		return "Error in LqiHistory business object";
	}
}
