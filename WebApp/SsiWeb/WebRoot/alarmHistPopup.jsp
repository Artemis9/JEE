<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%@ page language="java" errorPage="error.jsp" %>
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
<script type="text/javascript" language="JavaScript">
		function disableFields() {
	    var prevBool = document.getElementById("alarmHistPopup:hasPrev").value;
	    //alert("prevBool="+prevBool);
	    if (!eval(prevBool)) {
	    	document.getElementById("alarmHistPopup:prev").disabled = "true";
	    	document.getElementById("alarmHistPopup:prev").style.visibility = "hidden";
	    }
	    var nextBool = document.getElementById("alarmHistPopup:hasNext").value;
	    //alert("nextBool="+nextBool);
	    if (!eval(nextBool)) {
	    	document.getElementById("alarmHistPopup:next").disabled = "true";
	    	document.getElementById("alarmHistPopup:next").style.visibility = "hidden";
	    }
	  }
	  function doHighlight(node, color) {
	  	if (node){
	  		node.colorSave = node.style.color;
	  		node.style.color = color;
	  	}
	  }
	  function undoHighlight(node) {
	  	if (node) {
	  		node.style.color = node.colorSave;
	  	}
	  }
</script>
	<title>accsense Alarm History</title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<LINK REL="stylesheet" HREF="popup.css" TYPE="text/css">
</head>
  
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onload="disableFields();">
		<h:form id="alarmHistPopup" >
		<ssi:flowState bean="#{alarmHistBean}" />
		<table width="100%" cellspacing="0" cellpadding="2" border="0">
		<tr height="40" bgColor=#77C0E9>
		    <td width="142"><img src="images/popup_logo.jpg" width="142" height="40"></td>
		    <td bgcolor="#77C0E9" align="center" class="labelStyle">ALARM HISTORY</td>
		  </tr>
		</table>
		
		<table width="100%" cellspacing="0" align="center" cellpadding="0" border="0">  
  		  <tr> 
    		<td valign="top" align="center"> 
    		<center>
      		<table border="0" cellspacing="0" cellpadding="0">
	        <tr > 
	          <td >&nbsp;</td>
	        </tr>
	        <tr><td><h:inputHidden id="alarmHist_id" value="#{alarmHistBean.id}" /></td></tr> 
			<tr><td><h:inputHidden id="alarmHistMax" value="#{alarmHistBean.max}" /></td></tr>
			<tr><td><h:inputHidden id="alarmHistTzo" value="#{alarmHistBean.tzo}" /></td></tr> 
			<tr><td><h:inputHidden id="alarmHistFirst" value="#{alarmHistBean.first}" /></td></tr> 
			<tr><td><h:inputHidden id="hasNext" value="#{alarmHistBean.hasNext}" /></td></tr> 
			<tr><td><h:inputHidden id="hasPrev" value="#{alarmHistBean.hasPrev}" /></td></tr> 
			
			<tr valign="bottom" >
			<table width="95%" border="0" cellspacing="0" cellpadding="0"> 
			<tr>
        	<td align="left">
        		<h:commandButton styleClass="linkStyle" onmouseover="doHighlight(this,'red')" onmouseout="undoHighlight(this)" id="prev" value="<< Prev Alarms" action="#{alarmHistBean.doPrev}" > 
	          	</h:commandButton>
        	</td>
        	<td align="right">
        		<h:commandButton styleClass="linkStyle" onmouseover="doHighlight(this,'red')" onmouseout="undoHighlight(this)" id="next" value="Next Alarms>>" action="#{alarmHistBean.doNext}" > 
	          	</h:commandButton>
          	</td>
          	</tr>
          	</table>
        	</tr>
        	
        	
	        <tr > 
	          <td >&nbsp;</td>
	        </tr>
	        <tr valign="bottom"> 
	        <td  align="center">

			<h:dataTable id="alarmHistory" 
					 value="#{alarmHistBean.alarmList}" 
					 var="alarm" 
					 rowClasses="evenRow,oddRow" 
					 border="0" cellspacing="0" cellpadding="4" 
					 styleClass="alarmHistTable" headerClass="sensorHeader" 
					 columnClasses="columnAlarmName, columnPodName, columnMeasurName, columnValue, columnUnit, columnTs" >
			<h:column>
			  <f:facet name="header">
			    <h:outputText value="Name" />
			  </f:facet>
			  <h:outputText   value="#{alarm.alarmName}"/>
		  	</h:column>
		  	<h:column>
			  <f:facet name="header">
			    <h:outputText value="Pod" />
			  </f:facet>
			  <h:outputText   value="#{alarm.wsmName}"/>
		  	</h:column>
		  	<h:column>
			  <f:facet name="header">
			    <h:outputText value="Measurement" />
			  </f:facet>
			  <h:outputText   value="#{alarm.measurName}"/>
		  	</h:column>
		  	<h:column>
			  <f:facet name="header">
			    <h:outputText value="Value" />
			  </f:facet>
			  <h:outputText   value="#{alarm.valueCalc}" >
			  	<f:convertNumber minFractionDigits="2" maxFractionDigits="2" />
			  </h:outputText>
		  	</h:column>
		  	<h:column>
			  <f:facet name="header">
			    <h:outputText value="Unit" />
			  </f:facet>
			  <h:outputText   value="#{alarm.measurUnit}">
			  </h:outputText>
		  	</h:column>
		  	<h:column>
			  <f:facet name="header">
			    <h:outputText value="Time Stamp" />
			  </f:facet>
			  <h:outputText   value="#{alarm.localTimestamp}" >
			  	<f:convertDateTime pattern="MM/dd/yy hh:mm:ss a"/> 
			  </h:outputText>
		  </h:column>
	   	  </h:dataTable>
		</td>
        </tr>
        	<tr > 
	          <td >&nbsp;</td>
	        </tr>
	        <tr > 
	          <td >&nbsp;</td>
	        </tr>
		<tr><td><h:outputText value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{alarmHistBean.sessionFail}" styleClass="error"/></td></tr>      
        <tr > 
	          <td >&nbsp;</td>
	        </tr>
	        <tr > 
	          <td >&nbsp;</td>
	        </tr>
	            
        <tr valign="bottom" >
		<table width="97%" border="0" cellspacing="0" cellpadding="0"> 
		<tr>
    	<td align="right">
    		<h:commandButton styleClass="linkStyle" onmouseover="doHighlight(this,'red')" onmouseout="undoHighlight(this)" value="Close Window" onclick="window.close();return false;" >
    		</h:commandButton>
      	</td>
      	</tr>
      	</table>
    	</tr>
    	
      </table>
      </center>
      </td>
  	</tr>
</table>	   
</h:form>
</body>
</f:view>
</html>