<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><!-- InstanceBegin template="/Templates/measurPopup.dwt.jsp" codeOutsideHTMLIsLocked="false" -->
<%@ page language="java" errorPage="error.jsp"%>
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
   
<!-- InstanceBeginEditable name="doctitle" -->

<title>accsense -- Sensor Pod Properties</title>

<!-- InstanceEndEditable -->
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<LINK REL="stylesheet" HREF="popup.css" TYPE="text/css">

<script type="text/javascript" src="js/dojo/dojo.js"></script>
<script type="text/javascript">
	dojo.require("dojo.widget.TabPane");
</script>

<!-- InstanceBeginEditable name="head" -->
<script type="text/javascript" language="JavaScript1.2">
	function disableFields() {
	    var adminBool = document.getElementById("wsmPopup:wsm_admin").value;
	    //alert("adminBool="+adminBool);
	    document.getElementById("wsmPopup:wsm_name").disabled = !eval(adminBool);
	    document.getElementById("wsmPopup:wsm_notes").disabled = document.getElementById("wsmPopup:wsm_name").disabled;
		document.getElementById("wsmPopup:wsm_ok_b").disabled = document.getElementById("wsmPopup:wsm_name").disabled;
		document.getElementById("wsmPopup:wsm_apply_b").disabled = document.getElementById("wsmPopup:wsm_name").disabled;
	}
	
	function updateMainPage() {
		var elementId = window.openerFormId;
		if (elementId) {
			var thatName = opener.document.getElementById(elementId + ":wsm_name");
			var thisName = document.getElementById("wsmPopup:wsm_name");
			thatName.innerHTML = thisName.value;
		}
	}
	
dojo.addOnLoad(disableFields); 	
</script>
	
<!-- InstanceEndEditable -->
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<!-- InstanceBeginEditable name="FormHeader" -->

<h:form id="wsmPopup">
<ssi:flowState bean="#{wsmBean}" />

<!-- InstanceEndEditable -->  
  <table cellspacing=0 cellpadding=2 width="100%"  border="0">
    <tr height="40" bgcolor=#77C0E9>
      <td width="142"><img src="images/popup_logo.jpg" width="142" height="40" /></td>
      <td bgcolor="#77C0E9" align="center" class="labelStyle">
	  <!-- InstanceBeginEditable name="TitleBar" -->
	  
	  SENSOR POD PREFERENCES
	  
	  <!-- InstanceEndEditable -->
	  </td>
    </tr>
  </table>
  <!-- InstanceBeginEditable name="JSFVars" -->
  
  	<table width="460" border="0" cellspacing="0" cellpadding="0">
        <tr> 
          <td width="460">&nbsp;</td>
        </tr>
        <tr> 
          <td width="460" align="center">
		  	<h:outputText styleClass="labelStyle" value="#{wsmBean.name}"/>
		  </td>
        </tr>
        <tr> 
          <td width="460">&nbsp;</td>
        </tr>
        <tr><td><h:inputHidden id="wsm_id" value="#{wsmBean.id}" /></td></tr>
		<tr><td><h:inputHidden id="wsm_eui" value="#{wsmBean.eui}" /></td></tr>
		<tr><td><h:inputHidden id="wsm_hwVersion" value="#{wsmBean.hwversion}" /></td></tr>
		<tr><td><h:inputHidden id="wsm_fwVersion" value="#{wsmBean.fwversion}" /></td></tr>
		<tr><td><h:inputHidden id="wsm_typeName" value="#{wsmBean.typeName}" /></td></tr>
		<tr><td><h:inputHidden id="wsm_admin" value="#{wsmBean.admin}" /></td></tr>
	</table>
  
  <!-- InstanceEndEditable -->
  <center>
    <div class="mainform">
      <div id="mainTabPane" dojotype="TabPane" class="measPopupTabs">
        <div dojotype="ContentPane" label="General" class="tabContents">
		<!-- InstanceBeginEditable name="GeneralTab" -->
	 	
		<table border="0" cellspacing="0" cellpadding="1">
		<tr>
			<td class="itemLabel wsmItemLabel">
				<h:outputText value="Name:" />
			</td>
			<td>
				<h:inputText id="wsm_name"
						 value="#{wsmBean.name}" 
						 styleClass="wsmInputName" 
						 maxlength="#{wsmBean.maxNameLength}">
				</h:inputText>
			</td>
			<td></td>
		</tr>
      
		<tr>			
			<td class="itemLabelNotes">
				<h:outputText value="Notes:" />
			</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
			<td colspan="3">
				<h:inputTextarea id="wsm_notes"
					     value="#{wsmBean.notes}" 
						 styleClass="inputFieldNotes wsmNotes"
						 cols="45">
				</h:inputTextarea>
			</td>                
            <td></td>
            <td></td>
        </tr>
        </table>
	
<!-- InstanceEndEditable -->
		</div>		
 
		<!-- InstanceBeginEditable name="OtherTabs" -->
		<div dojotype="ContentPane" label="Info" class="tabContents">
        <div align="left">
			<table border="0" cellspacing="0" cellpadding="3">
            <tr>
                <td class="itemLabel wsmItemLabel">
                    <h:outputText value="Type:" />
                </td>
                <td>
                    <h:outputText value="#{wsmBean.typeName}" />
                </td>           
            </tr>
			<tr>
				<td class="itemLabel wsmItemLabel">
					<h:outputText value="Serial Number:" />
				</td>
				<td>
					<h:outputText value="#{wsmBean.eui}" />
				</td>
			</tr>
            <tr>
                <td class="itemLabel wsmItemLabel">
        			<h:outputText value="Hardware version:" />
                </td>
                <td>
        			<h:outputText value="#{wsmBean.hwversion}" /> 
                </td>
            </tr>
            <tr>
                <td class="itemLabel wsmItemLabel">
                    <h:outputText value="Firmware version:" /> 
                </td>
                <td>
        			<h:outputText value="#{wsmBean.fwversion}" /> 
                </td>
            </tr>
        </table>
        </div>
		</div>

  <!-- InstanceEndEditable -->
	  </div>
    </div>
  </center>
  <span class="buttons">
	  <!-- InstanceBeginEditable name="Buttons" -->
      <h:commandButton value="OK"  id="wsm_ok_b" styleClass="buttonStyle" action="#{wsmBean.doUpdateAndClose}" onclick="updateMainPage();" />
     	<h:commandButton value="Cancel" id="wsm_cancel_b" styleClass="buttonStyle" action="Close" />	
      	<h:commandButton value="Apply"  id="wsm_apply_b" styleClass="buttonStyle" action="#{wsmBean.doUpdate}" onclick="updateMainPage();" />	
      <!-- InstanceEndEditable -->
	  </div>
	  </td>
    </tr>
  </span>
  <center>
    <div class="response">
	<!-- InstanceBeginEditable name="ResponseRegion" -->
   
     <table border="0" cellspacing="0" cellpadding="0" width="90%">
        <tr><td align="left">
			<h:outputText value="#{msgs.UpdateSuccessfulMsg}" 
						  rendered="#{wsmBean.updateOk}" 
						  styleClass="message"/>
		</td></tr>
      	<tr><td align="left">
			<h:outputText value="" rendered="#{!wsm.updateOk}" />
		</td></tr>
      	<tr><td align="left">
			<h:outputText value="#{msgs.RefreshSessionExpiredMsg}" 
					  rendered="#{wsmBean.sessionFail}" 
					  styleClass="error"/>
		</td></tr>
      	<tr><td align="left">
			<h:outputText value="" rendered="#{!wsm.sessionFail}" />
		</td></tr>
      </table>
	  
    <!-- InstanceEndEditable -->
	</div>
  </center>
</h:form>
	
</body>
</f:view>
<!-- InstanceEnd --></html>