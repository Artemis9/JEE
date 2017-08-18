<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%@ page language="java" errorPage="error.jsp" %>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<f:view>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Accsense Administration Portal</title>
<LINK REL="stylesheet" HREF="styles.css" TYPE="text/css">
<LINK REL="stylesheet" HREF="settings.css" TYPE="text/css">

<script language="JavaScript" type="text/javascript">
function setTz()
{
	var tzo=((new Date()).getTimezoneOffset()/60)*(-1); 
	//alert("tzo="+tzo);
	document.forms["gatewayList"]["gatewayList:user_tzo"].value = eval(tzo);
}
</script>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onload="setTz();">
<h:form id="gatewayList">

<table width="760" border="0" align="center" cellpadding="0" cellspacing="0">
	  <tr>
	  <td>
	  	<h:inputHidden id="init" value="#{GwList.init}" />
	  	<h:inputHidden id="user_tzo" value="#{GwList.tzo}" />
	  </td>
	  </tr>
	  <tr>
	  <td>
	  	&nbsp;
	  </td>
	  </tr>
	  <tr>
	  <td bgcolor="#77C0E9" align="center" class="labelStyle">
	  	Acc<b>sense</> Inc. Administrator Home Page
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
	  <tr>
	  <td align="center" >
		      <h:dataTable id="gws" 
				 value="#{GwList.gateways}" 
				 var="gw" 
				 border="0"
				 rowClasses="evenRow,oddRow"
				 width="760" cellpadding="0" cellspacing="0"
				 columnClasses="gwMacColumn,gwNameColumn" > 
				 
				 <h:column>
					  <f:facet name="header">
					  	<h:outputText value="Gateway MAC Id" />
					  </f:facet>
					  <h:outputText  value="#{gw.mac}" />
				  </h:column>
				  <h:column> 
				  	  <f:facet name="header">
					  <h:outputText value="Gateway Name" />
					  </f:facet> 
					  <h:commandLink styleClass="view" id="gw_detail" action="#{GwList.doDetail}"  > 
			          	<h:outputText value="#{gw.name}"  />
			          	<f:param name="gwId" value="#{gw.id}" />
	          		  </h:commandLink>
				  </h:column>			  
			</h:dataTable>
	  </td>
	  </tr>
</table>
</h:form>
</body>
</f:view>
</html>
