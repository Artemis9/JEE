<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html> 
<%@ page language="java"  %>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@ taglib uri="http://demo.sensitool.com/jsf/ssi" prefix="ssi" %>
<f:loadBundle basename="ssiMessages" var="msgs" />
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<f:view>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Accsense Measurement Portal</title>
<LINK REL="stylesheet" HREF="styles.css" TYPE="text/css">
<LINK REL="stylesheet" HREF="settings.css" TYPE="text/css">
<script type="text/javascript" src="js/dojo/dojo.js"></script>
<script type="text/javascript">
	dojo.setModulePrefix('awl', '../awl');
	dojo.require("awl.*");
	dojo.hostenv.writeIncludes();
</script>
<script type="text/javascript" src="js/cookies.js"></script>
<script language="JavaScript" type="text/javascript">
	function saveCookieValues() {
		setCookie("vertScrollPos", document.documentElement.scrollTop);
	}
	
	function applyCookieValues() {
		document.documentElement.scrollTop = (getCookie("vertScrollPos")) ? getCookie("vertScrollPos") : "";
	}
	
	function fixPngs() {
		awl.common.fixPngImagesIE(document);
	}
	
   window.name="mainWindow";
   
   var gwPopup;
   var wsmPopup;
   var measurmentPopup;
   var accPopup;
   var alarmPopup;
   var detailPopup;
   var alarmHistPopup;
   
   function closeChildren() {	
		if (gwPopup && gwPopup.open && !gwPopup.closed) gwPopup.close();
		if (wsmPopup && wsmPopup.open && !wsmPopup.closed) wsmPopup.close();
		if (measurementPopup && measurementPopup.open && !measurementPopup.closed) measurementPopup.close();
		if (accPopup && accPopup.open && !accPopup.closed) accPopup.close();
		if (alarmPopup && alarmPopup.open && !alarmPopup.closed) alarmPopup.close();
		if (detailPopup && detailPopup.open && !detailPopup.closed) detailPopup.close();
		if (alarmHistPopup && alarmHistPopup.open && !alarmHistPopup.closed) alarmHistPopup.close();
	}
	
   function getFormtId(srcId) 
    {
        var measId = "";
        
        if ((srcId.length) && (srcId.length > 0)) {
            var colonFound = false;
            for (i=srcId.length-1; i>0; i--) {
                var currentChar = srcId.charAt(i);
                if (currentChar == ":") {
                    colonFound = true;
                    break;
                }
            }
            
            if (colonFound == true) {
                measId = srcId.substring(0, i);
            }
        }
        
        return (measId);
    }
   
	function doGwPopup(source) {
		gwPopup=window.open("gwPopup.faces","gwPopup","height=500,width=500,toolbar=no,menubar=no,scrollbars=no");
		gwPopup.openerFormId=getFormtId(source.id);
		gwPopup.focus();
	}
	function doAccPopup() {
		var adminBool = document.getElementById("gatewayContents:gw_admin").value;
	    //alert("adminBool="+adminBool);
	    if (eval(adminBool)) {
			accPopup=window.open("accountOptions.faces","accountOptions","height=600,width=500,toolbar=no,menubar=no,scrollbars=no");
			accPopup.focus();
		}
	}
	function doWsmPopup(source, iWsm) {
		wsmPopup=window.open("wsmPopup.faces?wsmBeanId="+iWsm,"wsmPopup","height=500,width=500,toolbar=no,menubar=no,scrollbars=no,resizable=no");
		wsmPopup.openerFormId=getFormtId(source.id);
		wsmPopup.focus();
	}
	function doMeasurementPopup(source, iMeasurement) {
		measurementPopup=window.open("measurPopup.faces?measurementBeanId="+iMeasurement,"measurPopup","height=500,width=500,toolbar=no,menubar=no,scrollbars=no");
		measurementPopup.openerFormId=getFormtId(source.id);
		measurementPopup.focus();
	}
	function doAlarmPopup(source, iMeasurement, mName, wsmName, alarmState) {
		str = "alarmPopup.faces?measurementBeanId="+iMeasurement+"&measurementBeanName="+mName+"&wsmBeanName="+wsmName+"&state="+alarmState;
		uriStr = encodeURI(str);
		alarmPopup=window.open(uriStr,"alarmPopup","height=500,width=500,toolbar=no,menubar=no,scrollbars=no,resizable=yes");
		alarmPopup.openerFormId=getFormtId(source.id);
		alarmPopup.focus();
	}
	function doDetailPopup(iMeasurement, wsmId, accountId) {
	    str = "detailPopup.faces?measurementBeanId="+iMeasurement+"&wsmId="+wsmId+"&accountId="+accountId;
		uriStr = encodeURI(str);
		detailPopup=window.open(uriStr,"","height=550,width=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
		//popup.openerFormId=source.form.id;
		detailPopup.focus();
	}
	function doAlarmHistPopup(iFirst,iMax) {
	    str = "alarmHistPopup.faces?firstAlarmFetch="+iFirst+"&maxAlarmFetch="+iMax;
		uriStr = encodeURI(str);
		alarmHistPopup=window.open(uriStr,"alarmHistPopup","height=700,width=700,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
		alarmHistPopup.focus();
	}
	
	function countredirect() {
		var gwRefresh = document.forms.gwRefresh;
		gwRefresh.submit();
	}
	//function countredirect() {
	//	window.location.reload(true);
	//}
	var msRefreshCount;
	var msUpdateCount;
    var intId;
    function updateClock() {
    //alert("msCount="+msCount);    	
    if (msRefreshCount > 1000 && msUpdateCount > 1000 ) {
	    msRefreshCount = msRefreshCount - 1000;
	    msUpdateCount = msUpdateCount - 1000;
    	totSec = msUpdateCount / 1000;
    	seconds = (totSec % 60) | 0;
    	minutes = (totSec / 60);
    	hours = (minutes/60) | 0;
    	minutes = minutes | 0;
    	if (hours > 0) 
    		minutes = (minutes % 60);
        if (hours < 10)
          strHours = "0"+hours;
        else 
          strHours = hours;
          
        if (minutes < 10)
          strMinutes = "0"+minutes;
        else 
          strMinutes = minutes;
          
        if (seconds < 10)
          strSeconds = "0"+seconds;
        else 
          strSeconds = seconds;
          
    	//alert("totSec="+totSec+" minutes="+minutes+" seconds="+seconds);
    	document.forms["gatewayContents"]["timer_message"].value = "Time to next Update: "+strHours+":"+strMinutes+":"+strSeconds;
    	//document.forms["gatewayContents"]["clock_hr"].value=hours;
    	//document.forms["gatewayContents"]["clock_sec"].value=seconds;
  		//document.forms["gatewayContents"]["clock_min"].value=minutes;
	  	}
	 else if (msRefreshCount > 1000 && msUpdateCount <= 1000) { // stop the idsplay clock; continue the inner clock
	 	msRefreshCount = msRefreshCount - 1000;
	    if (msUpdateCount <= 0 ) document.forms["gatewayContents"]["timer_message"].value="No new sensor pod readings have been detected";
	 	else document.forms["gatewayContents"]["timer_message"].value="Loading next sensor pod readings...";
	 }
	 else { // if ( msUpdateCount > 1000 && msRefreshCount <= 1000 || && msRefreshCount <= 1000 && && msUpdateCount <= 1000) {
	 		clearInterval(intId);
		  	countredirect();
	 }
    }
    
    function startTimer(){
	    var refreshMillis = document.forms["gatewayContents"]["gatewayContents:gw_nextfetchinterval"].value;
	    var updateMillis = document.forms["gatewayContents"]["gatewayContents:gw_nextMeasurementInterval"].value;
	    
	    msRefreshCount = refreshMillis;
	    msUpdateCount = updateMillis ;
	    //alert("msRefreshCount="+msRefreshCount+" msUpdateCount="+msUpdateCount);
	    if (refreshMillis != null && refreshMillis > 0){
	    	//setTimeout('countredirect()',refreshMillis);
	    	intId = setInterval(updateClock,1000);
	    	
	    }
	 }
	 function cleanMessages() {
	 	elem = document.getElementById("gatewayContents:msg1")
        if (elem != null)
     	  elem.style.visibility="hidden" 
     	elem = document.getElementById("gatewayContents:msg2")
        if (elem != null)
     	  elem.style.visibility="hidden"    
    }

dojo.addOnLoad(applyCookieValues);
dojo.addOnLoad(fixPngs);
dojo.addOnLoad(startTimer);
</script>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onUnload="saveCookieValues();"  >
<h:form id="gatewayContents">
<ssi:flowState bean="#{meshBean}" />
<table width="760" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td><img src="images/clear.gif" width="10" height="21"></td>
    <td>
		<h:inputHidden id="gw_nextfetchinterval" value="#{meshBean.nextfetchinterval}" />
		<h:inputHidden id="gw_admin" value="#{meshBean.admin}" />
		<h:inputHidden id="gw_lastRefreshTime" value="#{meshBean.lastRefreshTime}" />
		<h:inputHidden id="gw_nextMeasurementInterval" value="#{meshBean.nextMeasurementInterval}" />
	</td>
  </tr>
  <tr>
    <td width="760">
    <table width="760" border="0" cellspacing="0" cellpadding="0">
      <tr valign="top">
        <td width="263"><img src="images/logo.jpg" width="263" ></td>
        <td width="457">
        <table width="497" border="0" cellspacing="0" cellpadding="0">
        <tr>
			<td><img src="images/clear.gif" width="10" height="39"></td>
        </tr>
        <tr valign="bottom">
        <td><img src="images/clear.gif" width="10" height="39"></td>
        <td>
        	<!-- navbar start -->
        	<div id="navbar">
			<table cellspacing="0" align="right" cellpadding="0" border="0">
				<tr>
					<td id="navLinkLeft"><a id="acc_props" href="gatewayContents.faces" onclick="javascript:doAccPopup();return false;">ACCOUNT OPTIONS</a></td>
					<td><a id="contact" href="http://www.accsense.com/findout.html" target="_blank" >CONTACT</a></td>
					<td><a id="support" href="http://www.accsense.com/cust_support.html" target="_blank" >SUPPORT</a></td>
					<td><h:commandLink action="#{meshBean.doLogout}"><f:verbatim>LOGOUT</f:verbatim></h:commandLink></td>
					<!-- <td><a id="logout" href="#{meshBean.doLogout}" onclick="return false;">LOGOUT</a></td> -->
				</tr>
			</table>
			</div>
			<!-- navbar end -->
		</td> 
      </tr>
      </table>
      </td>
     </tr>
      <tr>
        <td colspan="2"><img src="images/clear.gif"  height="24"></td>
      </tr>
      <tr width="760" valign="bottom">
        <td><h:outputText  value="Welcome #{meshBean.saluName}" styleClass="welcome" /></td>
        <td align="right"><div align="right"><input id="timer_message" name="timer_message" type="text" class="timer"></div> </td>
      </tr>
      <tr>
        <td colspan="2"><img src="images/clear.gif" width="10" height="33"></td>
     </tr>
     <tr width="760" valign="bottom"><td colspan="2" ><h:outputText id="msg1" value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{meshBean.sessionFail}" styleClass="error"/></td></tr>
     <tr width="760" valign="bottom"><td colspan="2" ><h:outputText id="msg2" value="#{msgs.ActionFailedUnexpectedMsg}" rendered="#{meshBean.updateFail1}" styleClass="error"/></td></tr>
     </table>
  </td>
  </tr>
  <tr>
  <td>
  <table width="760" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td height="30" colspan="9"><span class="style1"> TRIGGERED ALARMS</span></td>
      </tr>
      <tr>
        <td><table width="760" border="0" cellspacing="0" cellpadding="0">
            <tr  bgcolor="#77C0E9">
			  <td width="15" height="15" valign="top" bgcolor="#FFFFFF" border="0"><img src="images/lt_blue_corner.gif" width="15" height="15" ></td>
			  <td width="112" rowspan="2" bgcolor="#77C0E9" ><div align="left"><img src="images/alarm_name.jpg" width="88" height="40" border="0" ></div></td>
			  <td width="100" rowspan="2"><div align="center"><img src="images/wsm.jpg" width="39" height="40"></div></td>
			  <td width="121" rowspan="2" bgcolor="#77C0E9"><div align="center"><img src="images/measurement.jpg" width="98" height="40"></div></td>
			  <td width="94" rowspan="2" bgcolor="#77C0E9"><div align="center"><img src="images/value.jpg" width="49" height="40"></div></td>
			  <td width="128" rowspan="2"><div align="center"><img src="images/alarm_time.jpg" width="87" height="40"></div></td>
			  <td width="94" rowspan="2"> <div align="center"><img src="images/history.jpg" width="94" height="40"></div></td>
		      <td width="81" rowspan="2"><div align="center"><img src="images/send_to_history.jpg" width="81" height="40"></div></td>
		      <td width="15" height="15" valign="top"  bgcolor="#FFFFFF"><img src="images/rt_blue_corner.gif" width="15" height="15"></td>
			</tr>
			<tr class="alarmheader">
			  <td width="15" height="25" bgcolor="#77C0E9">&nbsp;</td>
			  <td width="15" height="25" bgcolor="#77C0E9">&nbsp;</td>
			</tr>
        </table></td>
      </tr>
	  <tr>
	  <td>
	  <h:dataTable id="wsms0" 
					 value="#{meshBean.wsms}" 
					 var="wsm" 
					 border="0"  
					 width="760" cellpadding="0" cellspacing="0" >
		  <h:column>
			  <f:facet name="header">
			    <h:outputText value="" />
			  </f:facet>
			  
		      <h:dataTable id="measurements0" 
				 value="#{wsm.measurements}" 
				 var="measurement" 
				 border="0" rendered="#{measurement.alarmExists}"
				 rowClasses="evenRow,oddRow"
				 width="760" cellpadding="0" cellspacing="0" 
				 columnClasses="alarmNameColumn,alarmWsmColumn,measurNameColumn,alarmValueColumn, alarmTsColumn,alarmDetailColumn,alarmHistoryColumn"> 
				 
				 <h:column rendered="#{measurement.alarmExists}" >
					  <f:facet name="header">
					  	<h:outputText value="" />
					  </f:facet>
					  <h:outputText  value="#{measurement.alarmName}" styleClass="#{measurement.alarmActive?'alarmRow':''}" />
				  </h:column>
				  <h:column rendered="#{measurement.alarmExists}"> 
				  	  <f:facet name="header2">
					  <h:outputText value="" />
					  </f:facet> 
					  <h:outputText value="#{wsm.name}"  styleClass="#{measurement.alarmActive?'alarmRow':''}" />
				  </h:column>
				  <h:column rendered="#{measurement.alarmExists}">
					  <f:facet name="header4">
					  <h:outputText value="" />
					  </f:facet>
					  <h:outputText value="#{measurement.name}" styleClass="#{measurement.alarmActive?'alarmRow':''}" />
				  </h:column>
				  <h:column rendered="#{measurement.alarmExists}">
					  <f:facet name="header">
			    	  <h:outputText value="" />
			          </f:facet>     
					  <h:outputText value="#{measurement.alarmValueCalc}" styleClass="#{measurement.alarmActive?'alarmRow':''}" >
					  	<f:convertNumber minFractionDigits="2" maxFractionDigits="2" />
					  </h:outputText>
				  </h:column>
				  <h:column rendered="#{measurement.alarmExists}" >
					  <f:facet name="header">
			    	  <h:outputText value="" />
			          </f:facet>     
					  <h:outputText value="#{measurement.alarmLocalTs}" styleClass="#{measurement.alarmActive?'alarmRow':''}" >
					  	<f:convertDateTime pattern="hh:mm:ss a"  />
					  </h:outputText>
				  </h:column>
				  <h:column rendered="#{measurement.alarmExists}" >
					  <f:facet name="header" >
			    	  <h:outputText value="" />
			          </f:facet> 
			          <h:outputLink styleClass="view" id="alarm_detail" value="gatewayContents.faces" onclick="javascript:doDetailPopup('#{measurement.id}','#{wsm.id}','#{meshBean.accountId}');return false;">  
					  <h:graphicImage value="images/charting.gif" styleClass="image" title="Measurement history & chart"/>
	          		  </h:outputLink>
				  </h:column>
				  <h:column rendered="#{measurement.alarmExists}" >
					  <f:facet name="header" >
			    	  	<h:outputText value="" />
			          </f:facet> 
			           <h:commandLink styleClass="view" id="alarm_history" action="#{meshBean.putToHistory}" immediate="true" rendered="#{meshBean.admin}"> 
			          	<f:param name="measurementBeanId" value="#{measurement.id}" />
					  	<h:graphicImage value="images/send_to_history.gif" styleClass="image" title="Send alarm to history"/>
	          		  </h:commandLink>
				  </h:column>
			</h:dataTable>
		  </h:column>
	 </h:dataTable>
	  </td>
	  </tr>
	<tr>
        <td height="20"><img src="images/clear.gif" width="20" height="20"></td>
      </tr>
      
      <tr>
        <td><table width="760" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td>
              <h:graphicImage value="images/history_clock.gif" styleClass="smallImage" title="Alarm History"/>
              <h:outputLink styleClass="history" id="view_alarm" value="gatewayContents.faces" onclick="javascript:doAlarmHistPopup('0','256');return false;">  
					  <h:outputText value="VIEW ALARM HISTORY"/>
	          </h:outputLink>
              </td>
              <td width="16"  bgcolor="#FF0000">&nbsp;</td>
    		    <td width="93">&nbsp;Active Alarm </td>
    		    <td width="16" bgcolor="#000000">&nbsp;</td>
    		    <td width="430">&nbsp;Inactive Alarm</td>
            </tr>
        </table></td>
      </tr>
      <tr><td>
      <table width="760"  border="0" cellspacing="0" cellpadding="1">
      <tr>
        <td width="411" height="100" valign="bottom"><span class="style1">LATEST MEASUREMENTS</span></td>
        <td width="91" valign="middle"><div align="center"></div>          
          <div align="right"></div>
          <div align="center"> </div>          <div align="center"></div></td>
        <td width="65" valign="middle"><img src="images/msmt_history.jpg" width="65" height="81"></td>  
        <td width="68" valign="middle"><img src="images/download_measurements.jpg" width="65" height="81"></td>
        <td width="65" valign="middle"><img src="images/msmt_alarm.jpg" width="65" height="81"></td>
        <td width="48" valign="middle"><img src="images/preferences.jpg" width="48" height="81"></td>
      </tr>
      </table>
      </td></tr>
      <tr>
		<td>
			<table width="760" border="0" cellspacing="0" cellpadding="0">
            	<tr bgcolor="#77C0E9">
				  <td width="44" rowspan="2" bgcolor="#FFFFFF"><img src="images/gateway2.gif" width="44" height="37"></td>
				  <td width="661" height="23" rowspan="2" bgcolor="#77C0E9">
					<h:inputText id="gw_name" value="#{meshBean.name}" readonly="true" styleClass="roInputText" />  		    
                  </td>
				  <td width="40" height="22" rowspan="2" bgcolor="#77C0E9"><div align="center">
					  <h:outputLink styleClass="view" id="gw_props" value="gatewayContents.faces" onclick="javascript:doGwPopup(this);return false;">
		  				<h:graphicImage value="images/preferences.gif" styleClass="image" title="Preferences" />
	    	  		</h:outputLink> 
	    	  	 </td>			      
    	  		<td width="15" bgcolor="#FFFFFF"><img src="images/rt_blue_corner.gif" width="15" height="15"></td>
            	</tr>
            	<tr bgcolor="#77C0E9">
            	  <td width="15" height="22" bgcolor="#77C0E9">&nbsp;</td>
            	</tr>
        	</table>
		</td>
	</tr>
	  <tr>
	  <td>
	  <h:dataTable id="wsms" 
		 value="#{meshBean.wsms}" 
		 var="wsm" 
		 border="0"  
		 width="760" cellpadding="0" cellspacing="0" bgcolor="#CCCCCC" >
		  <h:column>
			  <f:facet name="header">
			    <h:outputText value="" />
			  </f:facet>
			  <h:panelGrid columns="3" width="760" cellpadding="0" cellspacing="2" bgcolor="#CCCCCC" columnClasses="wsmNameColumn,wsmTsColumn,wsmPropColumn">
				  <h:panelGroup>
					  <h:graphicImage value="images/wsm.gif" styleClass="wsmImage" title="Sensor Pod"/>
					  <b class="module"><h:outputText id="wsm_name" value="#{wsm.name}" /></b>
				  </h:panelGroup>
				  <h:panelGroup>
				  	  <h:graphicImage value="images/clear.gif" styleClass="clearImage" title="time"/>
					  <h:outputText value="#{wsm.lastDataLocalTs}" styleClass="module" >
						  <f:convertDateTime pattern="MM/dd/yy hh:mm:ss a"  />
					  </h:outputText>
				  </h:panelGroup>
				  <h:outputLink styleClass="view" id="wsm_props" value="gatewayContents.faces" onclick="javascript:doWsmPopup(this,'#{wsm.id}');return false">
				  	<h:graphicImage value="images/preferences.gif" styleClass="image" title="Preferences" />
		          </h:outputLink>
			  </h:panelGrid> 	 
		      <h:dataTable id="measurements" 
				 value="#{wsm.measurements}" 
				 var="measurement" 
				 border="0"
				 rowClasses="evenRow,oddRow"
				 width="760" cellpadding="0" cellspacing="0" 
				 columnClasses="sensorNameColumn,sensorDataColumn,emptyColumn06,sensorUnitColumn,emptyColumn84,sensorDetailColumn,sensorDownloadColumn,sensorAlarmColumn,sensorPropColumn"> 
				 <h:column>
					  <f:facet name="header">
					  <h:outputText value="" />
					  </f:facet>
					  <h:outputText id="measur_name" value="#{measurement.name}" />
				  </h:column>
				  <h:column>
					  <f:facet name="header2">
					  <h:outputText value="" />
					  </f:facet>
					  <h:outputText value="#{measurement.lastDataValueCalc}" >
					  <f:convertNumber minFractionDigits="2" maxFractionDigits="2" />
					  </h:outputText>
				  </h:column>
				  <h:column>
					  <f:facet name="header">
					  <h:outputText value="" />
					  </f:facet>
					  <h:outputText value="" >
					  	<f:verbatim>&nbsp;</f:verbatim>
					  </h:outputText>
				  </h:column>
				  <h:column> 
				  	  <f:facet name="header2">
					  <h:outputText value="" />
					  </f:facet> 
					  <h:outputText id="measur_unit" value="#{measurement.lastDataValueCalc==null?null:measurement.unit}"  />
				  </h:column>
				   <h:column>
					  <f:facet name="header">
					  <h:outputText value="" />
					  </f:facet>
					  <h:outputText value="" >
					  	<f:verbatim>&nbsp;</f:verbatim>
					  </h:outputText>
				  </h:column>
				  <h:column>
					  <f:facet name="header">
			    	  <h:outputText value="" />
			          </f:facet>
			          <h:outputLink styleClass="view" id="measurement_detail" value="gatewayContents.faces" onclick="javascript:doDetailPopup('#{measurement.id}', '#{wsm.id}', '#{meshBean.accountId}');return false;">   
					  <h:graphicImage value="images/charting.gif" styleClass="image" title="Measurement history & chart"/>
	          		  </h:outputLink>
				  </h:column>
				  <h:column>
					  <f:facet name="header">
			    	  <h:outputText value="" />
			          </f:facet> 
			          <h:commandLink  styleClass="view" id="measurement_download" action="#{meshBean.doDownload}" immediate="true" onmousedown="cleanMessages();"> 
			          <f:param name="measurementBeanId" value="#{measurement.id}" />
			          <f:param name="wsmBeanId" value="#{wsm.id}" />
					  <h:graphicImage value="images/download.gif" styleClass="image" title="Download measurements"/>
	          		  </h:commandLink>
				  </h:column>
				  <h:column>
					  <f:facet name="header">
			    	  <h:outputText value="" />
			          </f:facet>     
					  <h:outputLink styleClass="view" id="alarm_def" value="gatewayContents.faces" onclick="javascript:doAlarmPopup(this,'#{measurement.id}','#{measurement.nameJsStr}','#{wsm.nameJsStr}', '#{measurement.alarmState}');return false;">  
					  <h:graphicImage id="alarm_icon_grey" value="images/alarm_grey.png" styleClass="image" title="Measurement alarm" rendered="#{measurement.alarmDisabled}"/>
					  <h:graphicImage id="alarm_icon_green" value="images/alarm_green.png" styleClass="image" title="Measurement alarm" rendered="#{measurement.alarmReady}"/>
					  <h:graphicImage id="alarm_icon_red" value="images/alarm_red.png" styleClass="image" title="Measurement alarm" rendered="#{measurement.alarmTriggered}"/>
	          		  </h:outputLink>
				  </h:column>
				  <h:column>
					  <f:facet name="header">
			    	  	<h:outputText value="" />
			          </f:facet>     
			          <h:outputLink styleClass="view" id="measurement_props" value="gatewayContents.faces" onclick="javascript:doMeasurementPopup(this,'#{measurement.id}');return false;">  
					  	<h:graphicImage value="images/preferences.gif" styleClass="image" title="Preferences" />
	          		  </h:outputLink>
				  </h:column>
			</h:dataTable>
		  </h:column>
	 </h:dataTable>
	  </td>
	  </tr>
  </table>
</td>
  </tr>
  <tr>
			<td><img src="images/clear.gif" width="10" height="20"></td>
   </tr>
   <tr width="760" valign="bottom" align="center"><td colspan="2" class="copyright">&copy;<h:outputText id="msgcpy" value="#{msgs.CopyRights}"  styleClass="copyright"/></td></tr>
</table>
</h:form>
<h:form id="gwRefresh" target="mainWindow" >
		<h:commandLink  action="#{meshBean.doRefresh}" value="" id="go" immediate="true" >
		<f:verbatim></f:verbatim>
		</h:commandLink>
</h:form>
</body>
</f:view>
</html>
