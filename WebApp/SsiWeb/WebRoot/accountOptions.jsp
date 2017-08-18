<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%@ page language="java" errorPage="error.jsp"%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@ taglib uri="http://demo.sensitool.com/jsf/ssi" prefix="ssi" %>
<f:loadBundle basename="ssiMessages" var="msgs" />
<f:loadBundle basename="ssiNames" var="names" />
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<f:view>
<head>
	<title>accsense Account Options</title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<LINK REL="stylesheet" HREF="popup.css" TYPE="text/css">
<script type="text/javascript" language="JavaScript1.2">	
</script>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  >
<h:form id="accountOptions" >
<ssi:flowState bean="#{account}" />
<table cellspacing=0 cellpadding=2 width="100%"  border="0">
  <tr height="40" bgColor=#77C0E9>
    <td width="142"><img src="images/popup_logo.jpg" width="142" height="40"></td>
    <td bgcolor="#77C0E9" align="center" class="labelStyle"><h:outputText value="#{account.serviceLevel==1?names.ServiceLevelStandard:names.ServiceLevelPremium}"  /> ACCOUNT OPTIONS
    </td>
  </tr>
</table>
<table width="100%" cellspacing="0" align="center" cellpadding="0" border="0">
    <td valign="top" align="center"> 
      <table width="460" border="0" cellspacing="0" cellpadding="0">
        <tr > 
          <td width="460">&nbsp;</td>
        </tr>
        <tr > 
          <td width="460">&nbsp;</td>
        </tr>
        <tr > 
          <td width="460">
          	<h:inputHidden id="acc_id" value="#{account.id}" />
  			<h:inputHidden id="con1_id" value="#{account.contactId1}" />
  			<h:inputHidden id="con2_id" value="#{account.contactId2}" />
  			<h:inputHidden id="account_admin" value="#{account.admin}" />
          </td>
        </tr>
        <tr valign="bottom"> 
        <td width="460">    	
			<h:panelGrid columns="3" border="0" width="460">
				<h:outputText value="User - 1" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="*Login Name:" />
				<h:inputText id="LoginName1"
							 value="#{account.uname1}" required="true" >
				</h:inputText>
				<h:message for="LoginName1" styleClass="errorMini"/>
				<h:outputText value="Password:"/>
				<h:inputSecret id="Password-1" value="#{account.pw1}" >
					<f:validateLength minimum="5"/>
				</h:inputSecret>
				<h:message for="Password-1" styleClass="errorMini"/>
				<h:outputText value="Repeat Password:" />
				<h:inputSecret 
						     value="#{account.pw12}" >
				</h:inputSecret>
				<h:outputText value="" />
				<h:outputText value="Name:" />
				<h:inputText id="SalutName1"
							 value="#{account.name1}" >
				</h:inputText>
				<h:outputText value="" />
				<h:outputText value="Last Name:" />
				<h:inputText id="SalutLName1"
							 value="#{account.lname1}" >
				</h:inputText>
				<h:outputText value="" />
				<h:outputText value="Administrator:" />
				<h:selectBooleanCheckbox value="#{account.admin1}"/>
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="User - 2" />
				<h:outputText value="" />
				<h:outputText value="" />
				<h:outputText value="*Login Name:" />
				<h:inputText id="LoginName2"
							 value="#{account.uname2}" required="true" >
				</h:inputText>
				<h:message for="LoginName2" styleClass="errorMini"/>
				<h:outputText value="Password:" />
				<h:inputSecret id="Password-2" value="#{account.pw2}">
					<f:validateLength minimum="5"/>
				</h:inputSecret>
				<h:message for="Password-2" styleClass="errorMini"/>
				<h:outputText value="Repeat Password:" />
				<h:inputSecret 
						     value="#{account.pw22}" >
				</h:inputSecret>
				<h:outputText value="" />
				<h:outputText value="Name:" />
				<h:inputText id="SalutName2"
							 value="#{account.name2}" >
				</h:inputText>
				<h:outputText value="" />
				<h:outputText value="Last Name:" />
				<h:inputText id="SalutLName2"
							 value="#{account.lname2}" >
				</h:inputText>
				<h:outputText value="" />
				<h:outputText value="Administrator:" />
				<h:selectBooleanCheckbox value="#{account.admin2}"/>
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
		       <h:commandButton  value="Update"   action="#{account.doUpdate}"   />
			   <h:commandButton value=" Reset" type="reset" />
			   <h:outputText value="" />
			   <h:outputText value="" />
			   <h:outputText value="" />
			   <h:outputText value="" />
			   <h:outputText value="" />
			   <h:outputText value="" />
			   <h:outputText value="" />		 
		</h:panelGrid>
		</td>
        </tr>
        <tr><td><h:outputText value="#{msgs.UpdateSuccessfulMsg}" rendered="#{account.updateOk}" styleClass="message"/></td></tr>
        <tr><td><h:outputText value="#{msgs.UpdateFailedNoAdminMsg}" rendered="#{account.updateFail1}" styleClass="error"/></td></tr>
        <tr><td><h:outputText value="#{msgs.UpdateFailedPwRepeatMsg1}" rendered="#{account.updateFail2}" styleClass="error"/></td></tr>
        <tr><td><h:outputText value="#{msgs.UpdateFailedPwRepeatMsg2}" rendered="#{account.updateFail3}" styleClass="error"/></td></tr>
        <tr><td><h:outputText value="#{msgs.UpdateFailedSameLoginMsg}" rendered="#{account.updateFail4}" styleClass="error"/></td></tr>
        <tr><td><h:outputText value="#{msgs.UpdateFailedUnexpectedMsg}" rendered="#{account.updateFail5}" styleClass="error"/></td></tr>
		<tr><td><h:outputText value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{account.sessionFail}" styleClass="error"/></td></tr>      
      </table>
    </td>
    </tr>
</table>	
</h:form>
<table width="460" border="0" cellspacing="0" cellpadding="0">	
		<tr valign="bottom" align="right"> <td width="460"><h:commandButton styleClass="linkStyle" value="Close Window" onclick="window.close();return false;" /></tr> </td>
</table>	
</body>
</f:view>
</html>