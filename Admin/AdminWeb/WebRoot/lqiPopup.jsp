<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%@ page language="java" errorPage="error.jsp"  %>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<f:view>
<head>
<script type="text/javascript" language="JavaScript">
</script>
	<title>Accsense Pod LQI History</title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<LINK REL="stylesheet" HREF="styles.css" TYPE="text/css">
    <LINK REL="stylesheet" HREF="settings.css" TYPE="text/css">
</head>
  
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" ">
		<h:form id="lqiPopup" >
		<table width="100%" cellspacing="0" cellpadding="2" border="0">
		<tr height="40" bgColor=#77C0E9>
		    <td bgcolor="#77C0E9" align="center" class="labelStyle">POD LQI HISTORY</td>
		  </tr>
		  </table>
		<table width="100%" cellspacing="0" align="center" cellpadding="0" border="0">
		<tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
  		  <tr> 
    		<td valign="top" align="center"> 
      		<table width="620" border="0" cellspacing="0" cellpadding="0">
      		<tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
	        <tr valign="bottom" align="right"> <td width="620"><h:commandButton styleClass="linkStyle"  value="Close Window" onclick="window.close();return false;"/></td> </tr> 
	        
	        <tr > 
	          <td width="620">&nbsp;</td>
	          <h:outputText id="init" value="#{LqiHistBean.init}" />
			  	<h:inputHidden id="podIdHidden" value="#{LqiHistBean.id}" />
			  	<b><h:outputText id="podName" value="#{LqiHistBean.name}" /><b/>
	        </tr>
	        <tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
	        <tr valign="bottom"> 
	        <td width="620" align="center">

			<h:dataTable id="lqiHistory" 
					 value="#{LqiHistBean.dataList}" 
					 var="data" 
					 rowClasses="evenRowLqi,oddRowLqi" 
					 border="0" headerClass="sensorHeader" width="620">
			<h:column>
			  <f:facet name="header">
			    <h:outputText value="LQI Value(%)" />
			  </f:facet>
			  <h:outputText   value="#{data.valuePercent}">
			  	<f:convertNumber minFractionDigits="2" maxFractionDigits="2" />
			  </h:outputText>
		  	</h:column>
		  	<h:column>
			  <f:facet name="header">
			    <h:outputText value="Server Time" />
			  </f:facet>
			  <h:outputText   value="#{data.localTimestamp}">
			  	<f:convertDateTime pattern="MM/dd/yy hh:mm:ss a"/> 
			  </h:outputText>
		  	</h:column>
		  	<h:column>
			  <f:facet name="header">
			    <h:outputText value="Server time-Gateway time (Secs) " />
			  </f:facet>
			  <h:outputText   value="#{data.deltaTs}">
			  </h:outputText>
		  	</h:column>
	   	  </h:dataTable>
		</td>
        </tr>
        	<tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
	        <tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
		<tr><td><h:outputText value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{LqiHistBean.sessionFail}" styleClass="error"/></td></tr>      
        	<tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
	        <tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
	        <tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
	        <tr > 
	          <td width="620">&nbsp;</td>
	        </tr>
        <tr valign="bottom" align="right"> <td width="620"><h:commandButton styleClass="linkStyle"  value="Close Window" onclick="window.close();return false;"/></td> </tr> 
      </table>
      </td>
  	</tr>
</table>	   
</h:form>
</body>
</f:view>
</html>