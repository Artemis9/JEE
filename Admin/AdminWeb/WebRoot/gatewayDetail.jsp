<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%@ page language="java"  %>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
 <f:loadBundle basename="ssiMessages" var="msgs" />
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<f:view>
<head>
	<title>Accsense Gateway Detail</title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<LINK REL="stylesheet" HREF="styles.css" TYPE="text/css">
    <LINK REL="stylesheet" HREF="settings.css" TYPE="text/css">
<script type="text/javascript" language="JavaScript1.2">	
function double_check () {
var answer=confirm("Are you sure?");
if (answer)
	return true;
else 
  return false;
}
window.name="adminWindow";
var podPopup;
var lqiPopup;
function doPodPopup(source, iWsm, name, iGw) {
		podPopup=window.open("podPopup.faces?podId="+iWsm+"&podName="+name+"&gwId="+iGw,"podPopup","height=100,width=400,toolbar=no,menubar=no,scrollbars=no");
		podPopup.focus();
	}
function doLqiPopup(source, iWsm, name) {
		lqiPopup=window.open("lqiPopup.faces?podId="+iWsm+"&podName="+name,"lqiPopup","height=700,width=650,toolbar=no,menubar=no,scrollbars=yes");
		lqiPopup.focus();
	}
function closeChildren() {
	if (podPopup && podPopup.open && !podPopup.closed)
		podPopup.close();
	if (lqiPopup && lqiPopup.open && !lqiPopup.closed)
		lqiPopup.close();
}
function cleanMessages() {
	 	elem = document.getElementById("gatewayDetail:msg1")
        if (elem != null)
     	  elem.style.visibility="hidden" 
     	elem = document.getElementById("gatewayDetail:msg2")
        if (elem != null)
     	  elem.style.visibility="hidden"  
     	  elem = document.getElementById("gatewayDetail:msg3")
        if (elem != null)
     	  elem.style.visibility="hidden"  
     	  elem = document.getElementById("gatewayDetail:msg4")
        if (elem != null)
     	  elem.style.visibility="hidden"  
     	  elem = document.getElementById("gatewayDetail:msg5")
        if (elem != null)
     	  elem.style.visibility="hidden"    
    }
</script>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onUnload="closeChildren()">
<h:form id="gatewayDetail">
<table width="100%" cellspacing="0" align="center" cellpadding="0" border="0">
    <tr>
    <td valign="top" align="center"> 
      <table width="760" border="0" cellspacing="0" cellpadding="0">
      <tr>
	  <td>
	  	&nbsp;
	  </td>
	  </tr>
	  <tr>
	  <td bgcolor="#77C0E9" align="center" class="labelStyle">
	  	Acc<b>sense</> Inc. Administrator Gateway Page
	  </td>
	  </tr>
	  <tr>
	  <td>
	  	&nbsp;
	  </td>
	  </tr>
	  <tr>
	  <td>
	  	&nbsp;
	  </td>
	  </tr>
        <tr > 
          <td><h:outputText id="init" value="#{GwDetail.init}"/></td>
        </tr>
        <tr > 
          <td ><h:inputHidden id="gwId" value="#{GwDetail.id}"/></td>
          <td ><h:inputHidden id="accountId" value="#{GwDetail.accountId}"/></td>
          <td ><h:inputHidden id="role1Id" value="#{GwDetail.role1Id}"/></td>
          <td ><h:inputHidden id="role2Id" value="#{GwDetail.role2Id}"/></td>
          <td ><h:inputHidden id="firstEventCodeInt" value="#{GwDetail.firstEventCodeInt}"/></td>
          <td ><h:inputHidden id="lastEventCodeInt" value="#{GwDetail.lastEventCodeInt}"/></td>
          <td ><h:inputHidden id="macHidden" value="#{GwDetail.mac}"/></td>
          <td ><h:inputHidden id="nameHidden" value="#{GwDetail.name}"/></td>          
          <td ><h:inputHidden id="wakeupIntervalHidden" value="#{GwDetail.wakeupInterval}"/></td>
          <td ><h:inputHidden id="measurementIntervalHidden" value="#{GwDetail.measurementInterval}"/></td>
          <td ><h:inputHidden id="maxHeartbeatIntervalHidden" value="#{GwDetail.maxHeartbeatInterval}"/></td>
          <td ><h:inputHidden id="lastEventTsHidden" value="#{GwDetail.lastEventTs}"/></td>
          <td ><h:inputHidden id="firstEventTsHidden" value="#{GwDetail.firstEventTs}"/></td>          
          <td ><h:inputHidden id="userName1Hidden" value="#{GwDetail.userName1}"/></td>
          <td ><h:inputHidden id="userName2Hidden" value="#{GwDetail.userName2}"/></td>
          <td ><h:inputHidden id="userAdmin1Hidden" value="#{GwDetail.userAdmin1}"/></td>
          <td ><h:inputHidden id="userAdmin2Hidden" value="#{GwDetail.userAdmin2}"/></td>
          <td ><h:inputHidden id="hwVersionHidden" value="#{GwDetail.hwVersion}"/></td>
          <td ><h:inputHidden id="fwVersionHidden" value="#{GwDetail.fwVersion}"/></td>
          <td ><h:inputHidden id="radioFwVersionHidden" value="#{GwDetail.radioFwVersion}"/></td>
          <td ><h:inputHidden id="tzoHidden" value="#{GwDetail.tzo}"/></td>
          
        </tr>
        <tr valign="bottom"> 
        <td width="760">    	
			<h:panelGrid columns="3" border="0" width="760">
				<h:outputText value="Name:" style="font-weight: bold" />
				<h:outputText id="Name"
							 value="#{GwDetail.name}" style="font-weight: bold" />
				<h:outputText value="" />
				
				<h:outputText value="Mac Id:" style="font-weight: bold" />
				<h:outputText id="MacId"
							 value="#{GwDetail.mac}" style="font-weight: bold"/>
				<h:outputText value="" />
				
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				
				<h:outputText value="Hardware Version:"/>
				<h:outputText id="HwVersion"
							 value="#{GwDetail.hwVersion}" />
				<h:outputText value="" />
				
				<h:outputText value="Firmware Version:"/>
				<h:outputText id="FwVersion"
							 value="#{GwDetail.fwVersion}" />
				<h:outputText value="" />
				
				
				<h:outputText value="Radio Firmware Version:"/>
				<h:outputText id="RadioVersion"
							 value="#{GwDetail.radioFwVersion}" />
				<h:outputText value="" />
				
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				
				<h:outputText value="Measurement Interval:"/>
				<h:outputText id="MeasurementInterval"
							 value="#{GwDetail.measurementInterval} seconds" />
				<h:outputText value="" />
				
				<h:outputText value="Heart Beat Interval:"/>
				<h:outputText id="HeartBeatInterval"
							 value="#{GwDetail.maxHeartbeatInterval} seconds" />
				<h:outputText value="" />
				
				<h:outputText value="Wakeup Interval:"/>
				<h:outputText id="WakeupInterval"
							 value="#{GwDetail.wakeupInterval} seconds" />
				<h:outputText value="" />
				
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				
				<h:outputText value="First Mesh Event:"/>
				<h:outputText id="FirstEventDate" value="#{GwDetail.firstEventTs}" >
					
				</h:outputText>
				<h:outputText id="FirstEventCode" value="#{GwDetail.firstEventCode}" />
							 
				<h:outputText value="Last Mesh Event:"/>
				<h:outputText id="LastEventDate" value="#{GwDetail.lastEventTs}">
					
				</h:outputText>
				<h:outputText id="LastEventCode" value="#{GwDetail.lastEventCode}" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="Service Level:"/>
				<h:selectOneMenu id="ServiceLevelSelect" value="#{GwDetail.serviceLevel}" > 
    				<f:selectItem itemValue="#{GwDetail.serviceLevels[0]}" itemLabel="Premium(2)" />   
					<f:selectItem itemValue="#{GwDetail.serviceLevels[1]}" itemLabel="Standard(1)" />   					
				</h:selectOneMenu>
				<h:outputText value="" />
				
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				
				<h:outputText value="User Role-1:" style="font-weight: bold"/>
				<h:outputText id="UserRoleName1" value="#{GwDetail.userName1} #{GwDetail.userAdmin1?'(Administrator)':null}" style="font-weight: bold"/>
				<h:outputText value="" />
				
				<h:outputText value="Password:" />
				<h:inputSecret id="Password1" value="#{GwDetail.password1}" >
					<f:validateLength minimum="5"/>
				</h:inputSecret>
				<h:message for="Password1" styleClass="errorMini"/>
				
				<h:outputText value="Repeat Password:" />
				<h:inputSecret 
						     value="#{GwDetail.password12}" >
				</h:inputSecret>
				<h:outputText value="" />
				
				<h:outputText value="User Role-2:" style="font-weight: bold"/>
				<h:outputText id="UserRoleName2" value="#{GwDetail.userName2} #{GwDetail.userAdmin2?'(Administrator)':null}" style="font-weight: bold"/>
				<h:outputText value="" />
				
				<h:outputText value="Password:" />
				<h:inputSecret id="Password2" value="#{GwDetail.password2}" >
					<f:validateLength minimum="5"/>
				</h:inputSecret>
				<h:message for="Password2" styleClass="errorMini"/>
				
				<h:outputText value="Repeat Password:" />
				<h:inputSecret 
						     value="#{GwDetail.password22}" >
				</h:inputSecret>
				<h:outputText value="" />
				
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				
		       <h:commandButton value="Update"   action="#{GwDetail.doUpdate}"  onclick="cleanMessages();" />
			   <h:commandButton value="Cancel Entry" type="Reset" title="Reset to Previous" onclick="cleanMessages();" />
			   <h:commandButton value="Home"  action="Back" title="Back to Administrator Home Page" onclick="cleanMessages();"/>
			   
			   <h:outputText value="" />
			   <h:outputText value="" />
			   <h:outputText value="" />
			   
			   <h:outputText value="" />
			   <h:outputText value="" />
			   <h:outputText value="" />		 
		</h:panelGrid>
		</td>
        </tr>
        <tr><td width="760" height="15">&nbsp;</td></tr>
       <tr><td width="760" height="15">&nbsp;</td></tr>
        <tr><td><h:outputText id = "msg1" value="#{msgs.UpdateSuccessfulMsg}" rendered="#{GwDetail.updateOk}" styleClass="message"/></td></tr>
        <tr><td><h:outputText id = "msg2" value="#{msgs.UpdateFailedPwRepeatMsg1}" rendered="#{GwDetail.updateFail}" styleClass="error"/></td></tr>
        <tr><td><h:outputText id = "msg3" value="#{msgs.UpdateFailedPwRepeatMsg2}" rendered="#{GwDetail.updateFail1}" styleClass="error"/></td></tr>
        <tr><td><h:outputText id = "msg4" value="#{msgs.UpdateFailedUnexpectedMsg}" rendered="#{GwDetail.updateFail2}" styleClass="error"/></td></tr>
		<tr><td><h:outputText id = "msg5" value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{GwDetail.sessionFail}" styleClass="error"/></td></tr>      
        <tr><td width="760" height="15">&nbsp;</td></tr>
     
      <tr><td>
      <h:dataTable id="wsms" 
					 value="#{GwDetail.wsms}" 
					 var="wsm" 
					 border="0"  
					 rowClasses="evenRow,oddRow"
					 columnClasses="podEuiColumn,podNameColumn,podLqiColumn,podDeleteColumn"
					 headerClass="podHeader"
					 width="760" cellpadding="0" cellspacing="0" bgcolor="#CCCCCC" >
		  <h:column>
			  <f:facet name="header">
			    <h:outputText value="Pod EUI" />
			  </f:facet>
			  <h:outputText  value="#{wsm.eui}"  />
		   </h:column>
		   <h:column>	  
			  <f:facet name="header">
			    <h:outputText value="Name" />
			  </f:facet>
			  <h:outputText  value="#{wsm.name}"  />
		   </h:column>
		   <h:column>	  
			  <f:facet name="header">
			    <h:outputText value="LQI" />
			  </f:facet>
			 <h:outputLink  styleClass="view" value="gatewayDetail.faces" id="LQI_pod" onclick="javascript:doLqiPopup(this,'#{wsm.id}','#{wsm.name}'); return false;"  >
		      	<h:graphicImage value="images/link.png" styleClass="image" title="Pod LQI history" />
		      </h:outputLink>
		   </h:column>
		   <h:column>
			  <f:facet name="header">
			    <h:outputText value="Delete" />
			  </f:facet>		      		      
		       <h:outputLink  styleClass="view" value="gatewayDetail.faces" id="delete_pod" onclick="javascript:doPodPopup(this,'#{wsm.id}','#{wsm.name}','#{GwDetail.id}'); return false;"  >
		      	<h:graphicImage value="images/selection_delete.png" styleClass="image" title="Delete measurements, alarm definitions, sensor data and alarm history" />
		      </h:outputLink>
		  </h:column>
	 </h:dataTable>
	 </td></tr>
	
	 <tr><td ><h:outputText id="finalize" value="#{GwDetail.finalize}"/></td></tr>
      </table>
      </td></tr>
</table>	
</h:form>	
</body>
</f:view>
</html>