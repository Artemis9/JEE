package com.ssi.web.bean;

import java.util.Map;
import java.util.StringTokenizer;


import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;


import javax.servlet.http.HttpServletRequest;

import com.ssi.ejb.IAlarmManagerLocal;
import com.ssi.persistence.CAlarmDefinition;
import com.ssi.web.common.IURLConstants;
import com.ssi.common.IApplicationConstants;

/**
 * @author AAO
 *
 */
public class AlarmDefinition extends ABusinessObject implements IDescribableObject {
	
	public  static final String operators[] = {Short.toString(IApplicationConstants.ALARM_OPERATOR_GT), Short.toString(IApplicationConstants.ALARM_OPERATOR_LT), Short.toString(IApplicationConstants.ALARM_OPERATOR_EQ)};
	public  static final String connectors[] = {"",Short.toString(IApplicationConstants.ALARM_CONNECTOR_AND), Short.toString(IApplicationConstants.ALARM_CONNECTOR_OR)};
	public  static final int MAX_FORM_MESSAGE_LENGTH=255;
	
	private String description;
	private String notes;
	private Float operand1;
	private Float operand2;
	private String operator1;
	private String operator2;
	private String connector;
	private Short filterLimit;
	private Short filterLength;
	private String notifyList;
	private String message;
	private Boolean enabled;
	private Long measurId ;
	private String measurementName;
	private String wsmName;
	private Short serviceLevel;
	private boolean updateFail2;
	private boolean updateFail3;
	private String initialState;
	private String voiceNotifyList;
	private Boolean voiceNotified;

	public AlarmDefinition () {updateOk=false; updateFail1=false; }
	
	public void init() {
		LOG.info("XXXXXXXXX  IN AlarmDefinition.init()  XXXXXXXXX");
		this.sessionFail = false;
		try {
			if (this.id==null){
				ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
				Map session = context.getSessionMap();
				Mesh mesh= (Mesh) session.get(IURLConstants.MESH_BEAN);
				if (mesh == null || mesh.id == null) {
					this.sessionFail=true;
					return;
				}
				else {
					HttpServletRequest request = (HttpServletRequest) context.getRequest();
					
					String strIndex = request.getParameter(IURLConstants.MEASUREMENT_ID);
					LOG.debug("strIndex as measurId="+strIndex);
					this.measurementName = request.getParameter(IURLConstants.MEASUREMENT_NAME);
					this.wsmName = request.getParameter(IURLConstants.WSM_NAME);
					this.initialState = request.getParameter(IURLConstants.ALARM_STATE);
					if (strIndex==null) {
						LOG.error("Could not find the measurement_id in request (null)");
					}
					else 
					{ //A particular measurement alarm is asked to be seen. Properties popup
						this.measurId = new Long(strIndex);
						IAlarmManagerLocal am = initAlarmEjbLocal();
						CAlarmDefinition ad = (CAlarmDefinition)am.GetAlarmDefinition(this.measurId);
					    	
						setBean(ad);
						this.admin=mesh.isAdmin();
						this.serviceLevel=mesh.getServiceLevel();
						LOG.debug("XXXXXXXX In alarmDefinition.init()service level = "+this.serviceLevel);
					} //else
				}//else
			}
		} catch (Exception e){
			logExceptionMessage(e,"init()");
	    }
	}
	
	public String doUpdate()  {
		LOG.info("XXXXXXXXX  IN ALARM DEFINITION DO-UPDATE()  XXXXXXXXX");

		try {  
//			 the following condition should never met, because of the front-end control.
			if (!this.admin) {return ACTION_RET_FAILED; }
			if (this.filterLength.shortValue() < this.filterLimit.shortValue()) {
				updateFail2 = true;
				return ACTION_RET_FAILED;
			}
			if ((this.connector == null ||  this.connector.length()==0) && this.operand2!=null) {
				updateFail3 = true;
				return ACTION_RET_FAILED;
			}	
			IAlarmManagerLocal am = initAlarmEjbLocal();
			
			CAlarmDefinition pAd= new CAlarmDefinition();
			pAd.setId(this.id);
			pAd.setDescription(this.description);
			pAd.setName(this.name);
			pAd.setNotes(this.notes);
			pAd.setEnabled(this.enabled);
			pAd.setFilterLength(this.filterLength);
			pAd.setFilterLimit(this.filterLimit);
			pAd.setMessage(this.message);
			pAd.setNotifyList(this.notifyList);
			pAd.setOperand1(this.operand1);
			pAd.setOperand2(this.operand2);
			pAd.setOperator1(Short.valueOf(this.operator1));
			pAd.setOperator2(Short.valueOf(this.operator2));
			if (this.connector != null && this.connector.length()!=0) {
				pAd.setConnector(Short.valueOf(this.connector));
			}
			
			pAd.setVoiceNotified(this.voiceNotified);
			pAd.setVoiceNotifyList(this.voiceNotifyList);
			
			pAd = (CAlarmDefinition) am.UpdateOrInsertAlarmDefinition(pAd, this.measurId);
			this.id = pAd.getId();
		} catch (Exception e) {
			updateFail1 = true;
			logExceptionMessage(e,"doUpdate()");
			return ACTION_RET_FAILED;
	    }
		this.updateOk = true;
		return (ACTION_RET_UPDATE);
	  }

	// Set up the bean from DB
	protected void setBean(CAlarmDefinition ad){	
		if (ad==null) {
			LOG.info("XXXXXXXXX  IN AlarmDefinition.setBean()  ad=null");
			// doing it cause validateLongCheck with min/max limits does not like null Longs!!
			this.filterLength = new Short(Integer.valueOf(1).shortValue());
			this.filterLimit = new Short(Integer.valueOf(1).shortValue());
			return;
		}
		this.id = ad.getId();
		this.name = ad.getName();
		this.description=ad.getDescription();
		this.notes = ad.getNotes();
		this.operand1 = ad.getOperand1();
		this.operand2 = ad.getOperand2();
		this.operator1 = ad.getOperator1().toString();
		this.operator2 = ad.getOperator2().toString();
		if (ad.getConnector()!=null)
			this.connector = ad.getConnector().toString();
		this.filterLength = ad.getFilterLength();
		this.filterLimit = ad.getFilterLimit();
		this.notifyList =ad.getNotifyList();
		this.message = ad.getMessage();
		this.enabled = ad.getEnabled();
		//doing it cause validateLongCheck with min/max limits does not like null Longs!!
		if (this.filterLength == null)
			this.filterLength = new Short(Integer.valueOf(1).shortValue());
		
		if (this.filterLimit == null)
			this.filterLimit = new Short(Integer.valueOf(1).shortValue());
		
		this.voiceNotifyList=ad.getVoiceNotifyList();
		this.voiceNotified=ad.getVoiceNotified();
		
		
	}
	
	public String getInitialState() {
		return initialState;
	}
	public void setInitialState(String state) {
		this.initialState = state;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Boolean getEnabled() {
		return enabled;
	}
	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message.length() > MAX_FORM_NOTES_LENGTH ? message.substring(0,MAX_FORM_NOTES_LENGTH): message;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes.length() > MAX_FORM_NOTES_LENGTH ? notes.substring(0,MAX_FORM_NOTES_LENGTH): notes;
	}
	public String getNotifyList() {
		return notifyList;
	}
	public void setNotifyList(String notifyList) {
		if (notifyList.length() > MAX_FORM_NOTES_LENGTH) {
			// FIrst concatanate the long string
			String str = notifyList.substring(0,MAX_FORM_NOTES_LENGTH);
			// Next eliminate the latest e-mail address from the list, assuming that it has been cut in middle
				// Get a string tokenizer
				StringTokenizer st = new StringTokenizer(str,";, \t\n\r\f");
				int count = st.countTokens();
				String last=null;
				for (int i=0;i<count;i++){
					last = st.nextToken();
				}
				// Got the last token in last. Now, assign the substring that excludes "last" to this.notifyList.
				if (last!=null && (count = str.lastIndexOf(last)) >= 0)
					this.notifyList = str.substring(0,count);
		}
		else {
			this.notifyList =  notifyList;
		}
	}
	
	public Float getOperand1() {
		return operand1;
	}

	public void setOperand1(Float operand1) {
		this.operand1 = operand1;
	}

	public Float getOperand2() {
		return operand2;
	}

	public void setOperand2(Float operand2) {
		this.operand2 = operand2;
	}

	protected String getExceptionMessage (Exception e) {
		return "Error in AlarmDefinition business object";
	}

	public Long getMeasurId() {
		return measurId;
	}

	public void setMeasurId(Long measurId) {
		this.measurId = measurId;
	}

	public String getConnector() {
		return connector;
	}

	public void setConnector(String connector) {
		this.connector = connector;
	}

	public Short getFilterLength() {
		return filterLength;
	}

	public void setFilterLength(Short filterLength) {
		this.filterLength = filterLength;
	}

	public Short getFilterLimit() {
		return filterLimit;
	}

	public void setFilterLimit(Short filterLimit) {
		this.filterLimit = filterLimit;
	}

	public String getOperator1() {
		return operator1;
	}

	public void setOperator1(String operator1) {
		this.operator1 = operator1;
	}

	public String getOperator2() {
		return operator2;
	}

	public void setOperator2(String operator2) {
		this.operator2 = operator2;
	}

	public String getMeasurementName() {
		return measurementName;
	}

	public void setMeasurementName(String measurementName) {
		this.measurementName = measurementName;
	}

	public String getWsmName() {
		return wsmName;
	}

	public void setWsmName(String wsmName) {
		
		this.wsmName = wsmName;
	}
	
	public int getState() {
		if (this.id == null)
			return 0; //insert
		return 1; //update
	}
	public String[] getOperatorValue() {
		return operators;
	}
	public String[] getConnectorValue() {
		return connectors;
	}
	public int getMaxAlarmSample(){
		return IApplicationConstants.MAX_ALARM_SAMPLE;
	}
	public int getMinAlarmOccurrence(){
		return IApplicationConstants.MIN_ALARM_OCCURRENCE;
	}

	public boolean isUpdateFail2() {
		return updateFail2;
	}

	public void setUpdateFail2(boolean updateFail2) {
		this.updateFail2 = updateFail2;
	}

	public boolean isUpdateFail3() {
		return updateFail3;
	}

	public void setUpdateFail3(boolean updateFail3) {
		this.updateFail3 = updateFail3;
	}
	public int getMaxMessageLength() {
		return MAX_FORM_MESSAGE_LENGTH;
	}
	public int getMaxDescriptionLength() { return MAX_FORM_DESCRIPTION_LENGTH;}
	public int getMaxNotesLength(){return MAX_FORM_NOTES_LENGTH;}

	public Short getServiceLevel() {
		return serviceLevel;
	}

	public void setServiceLevel(Short serviceLevel) {
		this.serviceLevel = serviceLevel;
	}

	public Boolean getVoiceNotified() {
		return voiceNotified;
	}

	public void setVoiceNotified(Boolean voiceNotified) {
		this.voiceNotified = voiceNotified;
	}

	public String getVoiceNotifyList() {
		return voiceNotifyList;
	}

	public void setVoiceNotifyList(String voiceNotList) {
		 
		String strClean = voiceNotList.replaceAll("[^0-9;,]","");
		
		if (strClean.length() > MAX_FORM_NOTES_LENGTH) {
			// FIrst concatanate the long string
			String str = strClean.substring(0,MAX_FORM_NOTES_LENGTH);
			// Next eliminate the latest phone number from the list, assuming that it has been cut in middle
				// Get a string tokenizer
				StringTokenizer st = new StringTokenizer(str,";,");
				int count = st.countTokens();
				String last=null;
				for (int i=0;i<count;i++){
					last = st.nextToken();
				}
				// Got the last token in last. Now, assign the substring that excludes "last" to this.notifyList.
				if (last!=null && (count = str.lastIndexOf(last)) >= 0)
					this.voiceNotifyList = str.substring(0,count);
		}
		else {
			this.voiceNotifyList =  strClean;
		}
		
	}
	
}