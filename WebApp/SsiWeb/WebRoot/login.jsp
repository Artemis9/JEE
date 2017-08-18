<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ page language="java" errorPage="error.jsp" %>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@ taglib uri="http://demo.sensitool.com/jsf/ssi" prefix="ssi" %>
<f:loadBundle basename="ssiMessages" var="msgs" />
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
 
/**
 * This code check to see if we are running the demo page
 * and, if so, automatically fills out the login information.
 */
String info = request.getRequestURI();
String[] tokens = info.split("/");
boolean isDemo = false;
for (int i=0; i<tokens.length; i++) {
	if (tokens[i].contains("demo.jsp")) {
		isDemo = true;
	}
}
%>
<f:view>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Login To accsense </title>
<LINK REL="stylesheet" HREF="styles.css" TYPE="text/css">
<LINK REL="stylesheet" HREF="settings.css" TYPE="text/css">
<script  language="JavaScript1.1">

function setTz()
{
	var tzo=((new Date()).getTimezoneOffset()/60)*(-1); 
	//alert("tzo="+tzo);
	document.forms["login"]["login:user_tzo"].value = eval(tzo);
}

function setFocus() {
<% 
	if (isDemo) {
		out.println("var elementId = 'login:loginButton'");
	}
	else {
 		out.println("var elementId = 'login:mac'");
	}
%>		
	var myControl = document.getElementById(elementId);
	myControl.select();
	myControl.focus();
}

function setupDemoFields() {
	document.getElementById("login:mac").value = "0014a0001001";
	document.getElementById("login:mac").readOnly = true;
	document.getElementById("login:loginName").value = "Reader";
	document.getElementById("login:loginName").readOnly = true;
	document.getElementById("login:password").value = "Reader";
	document.getElementById("login:password").readOnly = true;
}

</script> 
</head>
  
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onload="setFocus();">

<h:form id="login" >
<ssi:flowState bean="#{login}" />
		<h:inputHidden id="user_tzo" value="#{login.tzo}" />
		<h:inputHidden id="release" value="1.4.2.0" />
<table width="760" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td><img src="images/clear.gif" width="10" height="21"></td>
  </tr>	
  <tr valign="top" align="center">
        <td width="760" align="center"><img src="images/logo.jpg" width="263"></td>
  </tr>	
  <tr>
    <td><img src="images/clear.gif" width="10" height="30"></td>
  </tr>
  <tr>
  <td>
<%
  if (isDemo) {
	out.println("<div class=\"demoLoginInfo\">Demonstration Page Login</div>");	
	}
%>	
	</td>
  </tr>
<tr>		
<td align="center">	
        <h:panelGrid columns="2" border="0" >
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="Gateway Mac:" />
   			<h:inputText value="#{login.mac}" tabindex="1" id="mac" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="Login Name:" />
			<h:inputText  value="#{login.name}" tabindex="2" id="loginName" />
		    <h:outputText value="Password:" />
			<h:inputSecret value="#{login.password}" redisplay="true" tabindex="3" id="password" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:commandButton value="Login" action="#{login.doLogin}" onclick="setTz();" tabindex="4" id="loginButton" rendered="true" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
			<h:outputText value="" />
		</h:panelGrid>	
</td>
</tr>
<tr>		
<td align="center" ><h:outputText value="#{msgs.LoginFailedMsg}" rendered="#{!login.accessGranted}" styleClass="error"/>
</td>
</tr>
<tr>
<td align="center">
<% 
if (isDemo) {
	out.println("<script>javascript:setupDemoFields();</script>"); 
}
else {
	out.println("<br /><br /><div id=\"demoLink\">Click <a href=\"demo.faces\">HERE</a> to try the demo site.</div>"); 
}
%>			
</td>
</tr>
</table>

<table align="right" id="verisignSeal">
<tr>
  <td>
  
<!-- Verisign seal DO NOT EDIT -->
  
<table width="135" border="0" cellpadding="2" cellspacing="0">
<tr>
<td width="135" align="center" valign="top"><script src=https://seal.verisign.com/getseal?host_name=secure.sensornetworkonline.com&size=S&use_flash=YES&use_transparent=YES&lang=en></script></td>
</tr>
<tr>
<td width="135" style="font:11px/16px Helvetica,Verdana,Arial,sans-serif;padding:3px 12px;"><a href="http://www.verisign.com/ssl-certificate/" target="_blank">About SSL Certificates</a></td>
</tr>
</table>

<!-- Verisign seal end -->
  </td>
  <td width="50px">
  </td>
</tr>
<tr>
  <td colspan="2">
  <br />
  </td>
</tr>
</table>

</h:form>
</body>
</f:view>
</html>
