package com.ssi.web.bean;

import java.util.List;
import java.util.Map;
import java.util.Iterator;
import java.sql.*;


import javax.faces.context.FacesContext;
import javax.faces.context.ExternalContext;

import com.ssi.bean.HistoryRow;
import com.ssi.bean.AlarmHistoryDetails;
import com.ssi.ejb.IAlarmManagerLocal;
import com.ssi.web.common.IURLConstants;
import com.ssi.util.*;

/**
 * @author AAO
 *
 */
public class AlarmHistory  extends ABusinessObject {
	private static int MAX_ALARM_HISTORY_PER_PAGE = 480;
	
	private List alarmList;
	private Long tzo;
	private Integer first;
	private Integer max;
	boolean hasPrev;
	boolean hasNext;
	
	public AlarmHistory() {;}
	
	protected void init() {
		LOG.info("XXXXXXXXX  In AlarmHistory.init()  XXXXXXXXX");
		this.sessionFail = false;
		try {
			if (this.id==null) {
				ExternalContext context = (ExternalContext) FacesContext.getCurrentInstance().getExternalContext();
				Map session = context.getSessionMap();			
				Mesh mesh= (Mesh) session.get(IURLConstants.MESH_BEAN);
				if (mesh==null || mesh.id == null) {
					this.sessionFail = true;
					return;
				}
				else  {
					this.tzo = mesh.getTzo();
					this.id = mesh.getId();
					this.first = Integer.valueOf(0);
					
				}//else
			}// if
			Timestamp tsFirst =  CDateUtil.get90DayDST();
			Timestamp tsLast = CDateUtil.getCurrentDST();
			IAlarmManagerLocal am = initAlarmEjbLocal();
			AlarmHistoryDetails ahd = am.GetAlarmHistory(this.id, tsFirst, tsLast, this.first.intValue(), AlarmHistory.MAX_ALARM_HISTORY_PER_PAGE );
			
			this.max = ahd.getMaxAlarms();
			this.hasPrev = (this.first.intValue() + AlarmHistory.MAX_ALARM_HISTORY_PER_PAGE) < this.max.intValue();
			this.hasNext = this.first.intValue() > 0;
			LOG.info("max="+this.max);
			this.alarmList = ahd.getAlarmList();
			if (this.alarmList !=null) {
				LOG.info("alarmHist size="+ this.alarmList.size());
				Iterator iter = this.alarmList.iterator();
				while (iter.hasNext()){
					HistoryRow hs = (HistoryRow) iter.next();
					hs.setTzo(this.tzo);
					LOG.debug("XXXXXXXXX  In AlarmHistory.init()  hs.getValue="+hs.getValue());
					LOG.debug("XXXXXXXXX  In AlarmHistory.init()  hs.getCoeff1="+hs.getCoeff1());
					LOG.debug("XXXXXXXXX  In AlarmHistory.init()  hs.getCoeff2="+hs.getCoeff2());
					LOG.debug("XXXXXXXXX  In AlarmHistory.init()  hs.getCoeff3="+hs.getCoeff3());
					LOG.debug("XXXXXXXXX  In AlarmHistory.init()  hs.getCoeff4="+hs.getCoeff4());
					LOG.debug("XXXXXXXXX  In AlarmHistory.init()  hs.getTzo="+hs.getTzo());
				}//while
			} //if
		} //try
	 catch (Exception e) {
	    logExceptionMessage(e,"init()");
	 }
	}
	
	public String doNext()  {
		LOG.info("XXXXXXXXX  IN ALARM HISTORY DO-NEXT()  XXXXXXXXX");
		try {  
			int tmp = this.first.intValue() - AlarmHistory.MAX_ALARM_HISTORY_PER_PAGE;
			if (tmp >= 0)
				this.first = Integer.valueOf(tmp);
		} catch (Exception e) {
			logExceptionMessage(e,"doNext()");
			return ACTION_RET_FAILED;
	    }
		return (ACTION_RET_REFRESH);
	  }
	public String doPrev()  {
		LOG.info("XXXXXXXXX  IN ALARM HISTORY DO-PREV()  XXXXXXXXX");

		try {  
			int tmp = this.first.intValue() + AlarmHistory.MAX_ALARM_HISTORY_PER_PAGE;
			if (tmp < this.max.intValue())
				this.first = Integer.valueOf(tmp);
		} catch (Exception e) {
			logExceptionMessage(e,"doPrev()");
			return ACTION_RET_FAILED;
	    }
		return (ACTION_RET_REFRESH);
	  }
	
	public Long getTzo() {
		return tzo;
	}

	public void setTzo(Long tzo) {
		this.tzo = tzo;
	}

	public List getAlarmList() {
		return alarmList;
	}

	public void setAlarmList(List alarmList) {
		this.alarmList = alarmList;
	}

	public Integer getFirst() {
		return first;
	}

	public void setFirst(Integer first) {
		this.first = first;
	}
	public Integer getMax() {
		return max;
	}

	public void setMax(Integer max) {
		this.max = max;
	}
    public boolean getHasNext() {
    	return hasNext;
    }
    public boolean getHasPrev() {
    	return hasPrev;
    }
    public void setHasNext(boolean next) {
    	; // no-op
    }
    public void setHasPrev(boolean prev) {
    	; // no-op
    }
	protected String getExceptionMessage (Exception e) {
		return "Error in AlarmHistory business object" + e.getMessage();
	}
}
