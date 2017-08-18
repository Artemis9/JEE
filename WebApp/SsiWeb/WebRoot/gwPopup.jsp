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

<title>accsense -- Gateway Properties</title>

<!-- InstanceEndEditable -->
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<LINK REL="stylesheet" HREF="popup.css" TYPE="text/css">

<script type="text/javascript" src="js/dojo/dojo.js"></script>
<script type="text/javascript">
	dojo.require("dojo.widget.TabPane");
</script>

<!-- InstanceBeginEditable name="head" -->

<script type="text/javascript" src="js/validate.js"></script>
<script type="text/javascript" >
    function  validate(form) {
     elem = document.getElementById("gwPopup:msg1")
     if (elem != null)
     	elem.style.visibility="hidden"   
     elem = document.getElementById("gwPopup:msg2")
     if (elem != null)
     	elem.style.visibility="hidden"   
     var field1= document.getElementById("gwPopup:Interval").value 
     //alert("field1="+field1)
     var val = validateInt(field1,30,999999,"Measurement Interval")
     if (isNaN(val))
     	return false
     document.getElementById("gwPopup:Interval").value = val
     //alert("document.getElementById(gwPopup:Interval).value is becoming="+document.getElementById("gwPopup:Interval").value)	
     return true
    }
    
	function updateParent() {
		opener.document.forms["gatewayContents"]["gatewayContents:gw_name"].value=document.forms["gwPopup"]["gwPopup:gw_name"].value;
	}
	function disableFields() {
	    var adminBool = document.getElementById("gwPopup:gw_admin").value;
	    //alert("adminBool="+adminBool);
	    document.getElementById("gwPopup:gw_name").disabled = !eval(adminBool);
	    document.getElementById("gwPopup:gw_notes").disabled = document.getElementById("gwPopup:gw_name").disabled;
		document.getElementById("gwPopup:Interval").disabled = document.getElementById("gwPopup:gw_name").disabled;
		document.getElementById("gwPopup:gw_ok_b").disabled = document.getElementById("gwPopup:gw_name").disabled;
		document.getElementById("gwPopup:gw_apply_b").disabled = document.getElementById("gwPopup:gw_name").disabled;
	}
	function closeTimely() {
		setTimeout("window.close()",2000);
	}
	
	function updateMainPage() {
		var elementId = window.openerFormId;
		if (elementId) {
			var thatName = opener.document.getElementById(elementId + ":gw_name");
			var thisName = document.getElementById("gwPopup:gw_name");
			thatName.value = thisName.value;
		}
	}
	
	dojo.addOnLoad(disableFields);
</script>

<!-- InstanceEndEditable -->
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<!-- InstanceBeginEditable name="FormHeader" -->

<h:form id="gwPopup" onsubmit="return validate(this)">
<ssi:flowState bean="#{gatewayBean}" />

<!-- InstanceEndEditable -->  
  <table cellspacing=0 cellpadding=2 width="100%"  border="0">
    <tr height="40" bgcolor=#77C0E9>
      <td width="142"><img src="images/popup_logo.jpg" width="142" height="40" /></td>
      <td bgcolor="#77C0E9" align="center" class="labelStyle">
	  <!-- InstanceBeginEditable name="TitleBar" -->
	  
	   GATEWAY PREFERENCES
	  
	  <!-- InstanceEndEditable -->
	  </td>
    </tr>
  </table>
  <!-- InstanceBeginEditable name="JSFVars" -->
  
  <table width="460" border="0" cellspacing="0" cellpadding="0">
    <tr><td width="460">&nbsp;</td></tr>
	<tr><td width="460" align="center">
	  <h:outputText styleClass="labelStyle" value="#{gatewayBean.name}"/>
	</td></tr>
	<tr><td width="460">&nbsp;</td></tr>
	<tr><td><h:inputHidden value="#{gatewayBean.id}" /></td></tr>
	<tr><td><h:inputHidden value="#{gatewayBean.hwversion}" /></td></tr>
	<tr><td><h:inputHidden value="#{gatewayBean.fwversion}" /></td></tr>
	<tr><td><h:inputHidden value="#{gatewayBean.radiofwversion}" /></td></tr>
	<tr><td><h:inputHidden value="#{gatewayBean.mac}" /></td></tr>
	<tr><td><h:inputHidden id="gw_admin" value="#{gatewayBean.admin}" /></td></tr>
  </table> 
  
  <!-- InstanceEndEditable -->
  <center>
    <div class="mainform">
      <div id="mainTabPane" dojotype="TabPane" class="measPopupTabs">
        <div dojotype="ContentPane" label="General" class="tabContents">
		<!-- InstanceBeginEditable name="GeneralTab" -->
    	
		<div align="left">
		<table border="0" cellspacing="0" cellpadding="1">
		<tr>
			<td class="itemLabel gwItemLabel">
				<h:outputText value="Name:" />
			</td>
			<td>
				<h:inputText id="gw_name"
							 value="#{gatewayBean.name}" 
							 styleClass="gwInputName" 
							 maxlength="#{gatewayBean.maxNameLength}">
				</h:inputText>
			</td>
			<td>
			</td>
		</tr>

		<tr>
			<td class="itemLabel gwItemLabel">
				<h:outputText value="Sample Interval (secs):" />
			</td>
			<td>
				<h:inputText id="Interval" 
						value="#{gatewayBean.measurementIntervalSeconds}" 
						styleClass="gwInputInterval"
						required="true">
						<f:validateLongRange minimum="30"  maximum="999999" />     
				</h:inputText>
			</td>
			<td>
				<h:message for="Interval" styleClass="errorMini" showDetail="true"/>
			</td>
			
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
				<h:inputTextarea id="gw_notes"
						     value="#{gatewayBean.notes}" 
						     styleClass="inputFieldNotes gwNotes"
                             cols="45" rows="20" >
				</h:inputTextarea>
			</td>                
            <td></td>
            <td></td>
        </tr>
		</tr>
        </table>
		</div>
	
<!-- InstanceEndEditable -->
		</div>		
 
		<!-- InstanceBeginEditable name="OtherTabs" -->
		
		<div dojotype="ContentPane" label="Info" class="tabContents">
		<div align="left">
		<table border="0" cellspacing="0" cellpadding="3">
			<tr>
				<td class="itemLabel gwInfoItemLabel">
					<h:outputText value="MAC Address:" />
				</td>
				<td>
					<h:outputText value="#{gatewayBean.mac}" />
				</td>
			</tr>
            <tr>
                <td class="itemLabel gwInfoItemLabel">
        			<h:outputText value="Hardware Version:" />
                </td>
                <td>
        			<h:outputText value="#{gatewayBean.hwversion}" /> 
                </td>
            </tr>
            <tr>
                <td class="itemLabel gwInfoItemLabel">
                    <h:outputText value="Firmware Version:" /> 
                </td>
                <td>
        			<h:outputText value="#{gatewayBean.fwversion}" /> 
                </td>
            </tr>
            <tr>
                <td class="itemLabel gwInfoItemLabel">
        			<h:outputText value="Radio Firmware Version:" />
                </td>
                <td>
        			<h:outputText value="#{gatewayBean.radiofwversion}" />
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
      	<h:commandButton value="OK"  id="gw_ok_b" styleClass="buttonStyle" action="#{gatewayBean.doUpdateAndClose}" onclick="updateMainPage();" />
     	<h:commandButton value="Cancel" id="gw_cancel_b" styleClass="buttonStyle" action="Close" />	
      	<h:commandButton value="Apply"  id="gw_apply_b" styleClass="buttonStyle" action="#{gatewayBean.doUpdate}" onclick="updateMainPage();" />	
      <!-- InstanceEndEditable -->
	  </div>
	  </td>
    </tr>
  </span>
  <center>
    <div class="response">
	<!-- InstanceBeginEditable name="ResponseRegion" -->
     
	 <table border="0" cellspacing="0" cellpadding="0" width="90%">
	 	<tr><td align="left"><h:outputText id="msg1" value="#{msgs.UpdateSuccessfulMsg}" rendered="#{gatewayBean.updateOk}" styleClass="message"/></td></tr>
        <tr><td align="left"><h:outputText id="msg11" value="" rendered="#{!gatewayBean.updateOk}" /></td></tr>
        <tr><td align="left"><h:outputText id="msg2" value="#{msgs.UpdateFailedUnexpectedMsg}" rendered="#{gatewayBean.updateFail1}" styleClass="error"/></td></tr>
        <tr><td align="left"><h:outputText id="msg22" value="" rendered="#{!gatewayBean.updateFail1}" /></td></tr>
        <tr><td align="left"><h:outputText id="msg3" value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{gatewayBean.sessionFail}" styleClass="error"/></td></tr>
      	<tr><td align="left"><h:outputText id="msg33" value="" rendered="#{!gatewayBean.sessionFail}" /></td></tr>
      </table> 
	  
    <!-- InstanceEndEditable -->
	</div>
  </center>
</h:form>
	
</body>
</f:view>
<!-- InstanceEnd --></html>