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

</script>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  >
<h:form id="podPopup" target="adminWindow" onsubmit="setTimeout('self.close()',2000)" >

<table width="400" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#CCCCCC" >
	  <tr>
	  <td>
	  	<h:outputText id="init" value="#{Pod.init}" />
	  	<h:inputHidden id="podIdHidden" value="#{Pod.id}" />
	  	<h:inputHidden id="podNameHidden" value="#{Pod.name}" />
	  	<h:inputHidden id="podGwIdHidden" value="#{Pod.gwId}" />
	  </td>
	  </tr>
	  <tr>
	  <td>
	  	<h:panelGrid columns="2" border="0" width="400" >
	  	        <h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
				<h:outputText value="Are you sure to delete the pod " style="text-align: center; font-weight: bold" />
				<h:outputText value="" />
				<h:outputText value="	'#{Pod.name}' ?" style="text-align: center; font-weight: bold" />
				<h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
				<h:commandButton value="Delete"   title="Delete the Pod" action="#{Pod.doDelete}"   />
			    <h:commandButton value="Cancel"   title="Cancel & Close" onclick="window.close();return false;"/>
	   			<h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
			    <h:outputText value="" />
	   </h:panelGrid>
	  </td>
	  </tr>
</table>
</h:form>
</body>
</f:view>
</html>
