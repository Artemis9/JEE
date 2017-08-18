<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<html>
<%@ page language="java" import="com.ssi.web.bean.MeasurementSample"  %>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@ taglib uri="http://demo.sensitool.com/jsf/ssi" prefix="ssi" %>
<f:loadBundle basename="ssiMessages" var="msgs" />
<%

// Force reload
response.setHeader("pragma", "no-cache"); 
response.setHeader("Expires", "Mon, 1 Jan 1990 00:00:00 GMT"); 
response.setHeader("Cache-Control", "no-cache"); 

String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
int serviceLevel;
String mId;
String wsmId;
String accountId;
String loadChart;
String firstAvailTime;
String lastAvailTime;
String units;
float min, max;
boolean isAutoScale;
%>
<f:view>
<head>

<!--//
<script type="text/javascript">
	var djConfig = { isDebug: true };
</script>
//-->

<script type="text/javascript" src="js/dojo/dojo.js"></script>
<script type="text/javascript">
	dojo.require("dojo.widget.TabPane");
	dojo.require("dojo.widget.ContentPane");
	dojo.require("dojo.style");

	dojo.setModulePrefix('awl', '../awl');
	dojo.require("awl.*");
	dojo.widget.manager.registerWidgetPackage('awl.widget');
	dojo.require("awl.widget.*");
	dojo.hostenv.writeIncludes();
</script>

	<LINK REL="stylesheet" HREF="popup.css" TYPE="text/css">
	<h:form id="detailPopup" >
		<ssi:flowState bean="#{measurementSamplesBean}" />
	<title>accsense - <h:outputText  value="#{measurementSamplesBean.wsmName}"  /> : <h:outputText value="#{measurementSamplesBean.name}"  /></title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	
</head>
  
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
		
		<table class="detailsTable" width="100%" cellspacing="0" cellpadding="2" border="0">
		  <tr height="40" bgColor=#77C0E9>
		    	<td width="142"><img src="images/popup_logo.jpg" width="142" height="40"></td>
		    	<td bgcolor="#77C0E9" align="center" class="labelStyle">
		    		<h:outputText  styleClass="labelStyle" value="#{measurementSamplesBean.wsmName}"  /> : 
		    		<h:outputText  styleClass="labelStyle" value="#{measurementSamplesBean.name}"  />
		    	</td>
		    	<td width="32">
		    	<!-- 
		    	<h:commandLink  id="refresh" action="Refresh" immediate="true" >  
		          	<f:param name="measurementBeanId" value="#{measurementSamplesBean.id}" />
		          	<f:param name="wsmId" value="#{measurementSamplesBean.wsmId}" />
				  	<h:graphicImage value="images/refresh.gif"  title="Refresh graph and data"  styleClass="image"/>
	          	</h:commandLink>
	          	-->
	          	</td>
	          	<td width="32">
	          	<!-- 
	          	<h:outputLink  id="print" onclick="window.print(); return false" >  
				  	<h:graphicImage value="images/print.gif"  title="Print graph and data"  styleClass="image" />
	          	</h:outputLink>
	          	-->
	          	</td>
		  </tr>
		</table>
		
		<h:inputHidden id="measur_id" value="#{measurementSamplesBean.id}" /> 
		<h:inputHidden id="tzo" value="#{measurementSamplesBean.tzo}"  />
		<h:inputHidden id="coeff1" value="#{measurementSamplesBean.coeff1}"  />
		<h:inputHidden id="coeff2" value="#{measurementSamplesBean.coeff2}"  />
		<h:inputHidden id="coeff3" value="#{measurementSamplesBean.coeff3}"  />
		<h:inputHidden id="coeff4" value="#{measurementSamplesBean.coeff4}"  />
		<h:inputHidden id="unit" value="#{measurementSamplesBean.unit}"  />
		<h:inputHidden id="serviceLevel" value="#{measurementSamplesBean.serviceLevel}"  />
		<h:inputHidden id="firstDataTs" value="#{measurementSamplesBean.firstDataTs}" />
		<h:inputHidden id="lastDataTs" value="#{measurementSamplesBean.lastDataTs}" />
	<table width="90%" cellspacing="0" align="center" cellpadding="0" border="0">
	    <h:outputText escape="false" value="<tr><td width='700'>&nbsp;</td></tr>" rendered="#{measurementSamplesBean.updateFail1 || measurementSamplesBean.sessionFail || measurementSamplesBean.updateFail2 || measurementSamplesBean.serviceLevel==1}" />
	    <tr><td><h:outputText id="msg1" value="#{msgs.ActionFailedUnexpectedMsg}" rendered="#{measurementSamplesBean.updateFail1}" styleClass="error"/></td></tr>
		    <tr><td><h:outputText id="msg11" value="" rendered="#{!measurementSamplesBean.updateFail1}" /></td></tr>
	    <tr><td><h:outputText id="msg2" value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{measurementSamplesBean.sessionFail}" styleClass="error"/></td></tr>
		    <tr><td><h:outputText id="msg22" value="" rendered="#{!measurementSamplesBean.sessionFail}" /></td></tr>
		    <tr><td><h:outputText id="msg3" value="#{msgs.RequestInitializationMsg}" rendered="#{measurementSamplesBean.updateFail2}" /></td></tr>
		    <tr><td><h:outputText id="msg33" value="" rendered="#{!measurementSamplesBean.updateFail2}" /></td></tr>
	    <tr><td><h:outputText id="msg4" value="#{msgs.ServiceLevelGraphStandard}" rendered="#{measurementSamplesBean.serviceLevel==1}" styleClass="warningStyle"/></td></tr>
		<tr><td><h:outputText id="msg44" value="" rendered="#{measurementSamplesBean.serviceLevel==2}" /></td></tr>
	    <h:outputText escape="false" value="<tr><td width='700'>&nbsp;</td></tr>" rendered="#{measurementSamplesBean.updateFail1 || measurementSamplesBean.sessionFail || measurementSamplesBean.updateFail2 || measurementSamplesBean.serviceLevel==1}" />
	</table>
		
<% 
	MeasurementSample ms = (MeasurementSample) request.getAttribute("measurementSamplesBean");
	serviceLevel = ms.getServiceLevel().intValue(); 
	mId = ms.getId().toString();
	wsmId = request.getParameter("wsmId");
	accountId = request.getParameter("accountId");
	loadChart = (serviceLevel==2) ? "true" : "false";
	Long tmp = new Long(ms.getFirstDataTs().getTime());
	firstAvailTime = tmp.toString();
	Long tmp2 = new Long(ms.getFirstDataTs().getTime());
	lastAvailTime = tmp.toString(ms.getLastDataTs().getTime());
	min = ms.getMinYscale();
	max = ms.getMaxYscale();
	isAutoScale = ms.isAutoScale();
	units = ms.getUnit();
%>
		
<div class="detailsMainform" align="center">
  <div id="mainTabPane" dojotype="TabPane" class="detailPopupTabs" >
<%  
	if (serviceLevel == 2) {
%>  
	<div dojotype="ContentPane" label="Chart" class="detailTabContents" id="chartTab">
        
        <div align="center">		
      		
      		<span dojoType="statsbar"></span>         
			<!--// Insert chart widget here -->
			<jsp:include page="GuiWidgetsChart.jsp" >
				<jsp:param name="measurementBeanId" value="<%= mId %>" /> 
				<jsp:param name="chartNo" value="1" /> 
			</jsp:include>
			<!--// End of chart widget insert -->
          	
          	<div dojoType="chartLegend"></div>
        
		</div>		
	</div> <!--  end chart tab -->
<% 
	} 
%>	
 	<div dojotype="ContentPane" label="Data Table" class="detailTabContents">
		<table border="0" cellpadding="0" cellspacing="0">
		<tr>
		<td class="dataTableTopCap" align="center">				
		</td>
		</tr>
		<tr>
		<td class="dataTableNavColumn" align="center">				
			<div dojoType="dateRangeNav" ></div>
		</td>
		</tr>
		<tr>
		<td align="center">
			<div dojoType="dataTable" pointsPerPage="480"></div>
		</td>
		</tr>
		<tr>
		<td class="dataTableBottomCap" align="center">				
		</td>
		</tr>
		</table>		
	</div> 
</div>
</div>

<div align="center">
	<div dojoType="datanavbar" 
		 sensorId="<%= mId %>" 
		 podId="<%= wsmId %>"
		 gatewayId="<%= accountId %>"
		 updateChart="<%= loadChart %>" 
		 firstDateAvail="<%= firstAvailTime %>"
		 lastDateAvail="<%= lastAvailTime %>"
		 chartTabLabel="Chart"
		 min="<%= min %>"
		 max="<%= max %>"
		 autoScale="<%= isAutoScale %>"
		 level="<%= serviceLevel %>" 
		 yAxisUnits="<%= units %>" >
	</div>
</div>

</h:form>
</body>
</f:view>
</html>