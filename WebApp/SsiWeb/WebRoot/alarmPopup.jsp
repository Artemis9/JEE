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

<title>accsense Alarm Definition</title>

<!-- InstanceEndEditable -->
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<LINK REL="stylesheet" HREF="popup.css" TYPE="text/css">

<script type="text/javascript" src="js/dojo/dojo.js"></script>
<script type="text/javascript">
	dojo.require("dojo.widget.TabPane");
</script>
<script type="text/javascript">
	dojo.setModulePrefix('awl', '../awl');
	dojo.require("awl.*");
	dojo.hostenv.writeIncludes();
</script>

<!-- InstanceBeginEditable name="head" -->
<script type="text/javascript" language="JavaScript1.2" src="js/validate.js"></script>
<script type="text/javascript" language="JavaScript1.2">

function toggleSecondCond(elemId) {
	var target = document.getElementById(elemId);
	var block  = document.getElementById("secondCond");
	var operand = document.getElementById("alarmPopup:Operand2");
	
	if (target.value == "") {
		block.style.visibility = "hidden";
		operand.value = "";
	}
	else {
		block.style.visibility = "visible";	
	}
}

var doValidate = true;
var doClose = false;
var alarmDisabled = false;

function  validate(form, initialState) {
	 if (!doValidate) return true;
	 
	 // Don't submit a disabled and undefined alarm
	 var alarmId = document.getElementById("alarmPopup:alarm_id").value;
	 if ((alarmDisabled)&&(alarmId == "")) {
	 	if (doClose) window.close();
	 	return false;
	 }
	 
	 var saveState = alarmDisabled;
	 alarmDisabled = false; 
	 setAlarmState();
	 
     elem = document.getElementById("alarmPopup:msg1");
     if (elem != null)
     	elem.style.visibility="hidden";  

     elem = document.getElementById("alarmPopup:msg2");
     if (elem != null)
     	elem.style.visibility="hidden" ;  

     elem = document.getElementById("alarmPopup:msg3");
     if (elem != null)
     	elem.style.visibility="hidden";   

     elem = document.getElementById("alarmPopup:msg4");
     if (elem != null)
     	elem.style.visibility="hidden";  
     	  
     var field1= document.getElementById("alarmPopup:Operand1").value;
     var field2= document.getElementById("alarmPopup:Operand2").value;
     var field3= document.getElementById("alarmPopup:Occurrence").value; 
     var field4= document.getElementById("alarmPopup:Samples").value;
      
     //alert("field1="+field1+"field2="+field2+"field3="+field3+"field4="+field4)
     
     var val = validateFloat(field1,null,null,"Sensor value (Trigger Condition 1)");
     if (isNaN(val)) {
     	alarmDisabled = saveState; 
	    setAlarmState();
     	return false;
     }
     document.getElementById("alarmPopup:Operand1").value = val;
     
     var cond = document.getElementById("alarmPopup:Connector").value;
     
     if ((cond != "") && (field2=="")) {
     	alert("Condition #2 must have a value if AND or OR is selected");
     	alarmDisabled = saveState; 
	    setAlarmState();
     	return false;
     }
     
     if (field2!="") {
	     val = validateFloat(field2,null,null,"Sensor value (Trigger Condition 2)");
	     if (isNaN(val)){
		     alarmDisabled = saveState; 
		    setAlarmState();
	     	return false;
	     }
	     document.getElementById("alarmPopup:Operand2").value = val;
     }
     
     if (cond!="") {
     	 var X = eval(field1);
     	 var Y = eval(field2);
         var opX = eval(document.getElementById("alarmPopup:Operator1").value);
	     var opY = eval(document.getElementById("alarmPopup:Operator2").value);
	     cond = eval(cond);
 	
 		//alert("opX="+opX+" opY="+opY+" X="+X+" Y="+Y+" cond="+cond+" (X>Y)="+(X>Y)+ " (X<Y)="+(X<Y));
     	//logical validation
     	
     	if (((opX == "1") && // >			//case0 X>Y
     		(cond == "0") && //AND
     		(opY == "-1") && // <
     		(X > Y))
     		||
     		((opX == "-1") && // <			//case0 X<Y
     		(cond == "0") && //AND
     		(opY == "1") && // >
     		(X < Y))
     		||
     		((opX == "0") && // =			//case1
     		(cond == "0") && //AND
     		(opY == "0") &&  // =
     		(X != Y))) {
     		
     		alert("The trigger condition will never occur.  Please recheck your trigger settings."); 
     		alarmDisabled = saveState; 
		    setAlarmState();
	     	return false;
     	}
     	// > == 1; < == -1

     	if (((opX == "-1") && // <		//case2 X>Y
     		(cond == "1") && //OR
     		(opY == "1") &&  // >
     		(X > Y))
     		||
     		((opX == "1") && // >		//case2 X<Y
     		(cond == "1") && //OR
     		(opY == "-1") &&  // <
     		(X < Y))) {
     		
     		alert("The trigger condition will always be true.  Please recheck your trigger settings."); 
     		alarmDisabled = saveState; 
		    setAlarmState();
	     	return false;
     	}
     }
     
     val = validateInt(field3,1,10,"Number of occurrences");
     if (isNaN(val)) {
     	alarmDisabled = saveState; 
	    setAlarmState();
     	return false;
     }
     document.getElementById("alarmPopup:Occurrence").value = val;
     
     val = validateInt(field4,1,10,"Consecutive samples");
     if (isNaN(val)){
     	alarmDisabled = saveState; 
	    setAlarmState();
     	return false;
     }
     document.getElementById("alarmPopup:Samples").value = val;
     
     updateMainPage(initialState);
     return true;
    }
    
    function setAlarmState() {
	    document.getElementById("alarmPopup:alarm_name").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:alarm_notes").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:Operand1").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:Operand2").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:Operator1").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:Operator2").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:Connector").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:Occurrence").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:Samples").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:Message").disabled = alarmDisabled;
	    document.getElementById("alarmPopup:NotifyList").disabled = alarmDisabled;
	}
    
	function disableFields() {
	    var adminBool = document.getElementById("alarmPopup:alarm_admin").value;
	    var serviceBool = document.getElementById("alarmPopup:alarm_service_level").value == '1';
	    //alert("serviceBool="+serviceBool);
		var disableBool = !eval(adminBool) || eval(serviceBool);
	    document.getElementById("alarmPopup:alarm_enable").disabled = disableBool;
	    document.getElementById("alarmPopup:alarm_ok_b").disabled = disableBool;
		document.getElementById("alarmPopup:alarm_apply_b").disabled = disableBool;
		
		if ((disableBool) || !(document.getElementById("alarmPopup:alarm_enable").checked)) {
			alarmDisabled = true;
			setAlarmState();
		}
	}

	function updateMainPage(initialState) {
		var mainPageElement = null;
		var mainpageElementId = window.openerFormId;
		
		// if initialState is triggered, skip icon update
		if (initialState === "triggered") {
			return;
		}
		
		//determine mainpage tag id 
		if (mainpageElementId) {
			alarmId = 
				(initialState === "enabled") 
					? ":alarm_icon_green"
					: ":alarm_icon_grey";
					
			mainPageElement = 
				opener.document.getElementById(mainpageElementId + alarmId);
		}
		
		// Set to green if enables or grey if disabled.
		var localEnable = document.getElementById("alarmPopup:alarm_enable");
		var newIconName = "alarm_grey.png";
		if ((localEnable) && (localEnable.checked)) {
				newIconName = "alarm_green.png";	
		}
		if (mainPageElement !== null) {
			mainPageElement.src = "images/"+newIconName;
			awl.common.fixPngIE(mainPageElement);
		}
	}

dojo.addOnLoad(disableFields);

</script>
	
	

<!-- InstanceEndEditable -->
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<!-- InstanceBeginEditable name="FormHeader" -->

<ssi:flowState bean="#{alarmBean}" />
<h:form id="alarmPopup" onsubmit="return validate(this, '#{alarmBean.initialState}')" >

<!-- InstanceEndEditable -->  
  <table cellspacing=0 cellpadding=2 width="100%"  border="0">
    <tr height="40" bgcolor=#77C0E9>
      <td width="142"><img src="images/popup_logo.jpg" width="142" height="40" /></td>
      <td bgcolor="#77C0E9" align="center" class="labelStyle">
	  <!-- InstanceBeginEditable name="TitleBar" -->
	  
	  ALARM DEFINITION
	  
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
          <h:outputText styleClass="labelStyle" value="#{alarmBean.wsmName} - #{alarmBean.measurementName}" />
          </td>
        </tr>
        <tr> 
          <td width="460">&nbsp;</td>
        </tr>
        <tr><td><h:inputHidden id="alarm_id" value="#{alarmBean.id}" /></td></tr> 
		<tr><td><h:inputHidden id="alarm_measurement_name" value="#{alarmBean.measurementName}" /></td></tr>
		<tr><td><h:inputHidden id="alarm_wsm_name" value="#{alarmBean.wsmName}" /></td></tr>
		<tr><td><h:inputHidden id="alarm_admin" value="#{alarmBean.admin}" /></td></tr>
		<tr><td><h:inputHidden id="alarm_service_level" value="#{alarmBean.serviceLevel}" /></td></tr> 
		<tr><td><h:inputHidden id="alarm_measur_id" value="#{alarmBean.measurId}" /></td></tr> 
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
			<td class="itemLabel alarmItemLabel">
				<h:outputText value="Name:" />
			</td>
			<td>
				<h:inputText id="alarm_name"
						 value="#{alarmBean.name}" 
						 styleClass="alarmInputName"
						 maxlength="#{alarmBean.maxNameLength}">
				</h:inputText>
                <span class="alarmEnabled"> 
                <span class="alarmEnabledLabel">
                    <h:outputText value="Enabled" />
                </span>         
                <h:selectBooleanCheckbox 
                            id="alarm_enable" 
                            value="#{alarmBean.enabled}"
                            onclick="alarmDisabled=!(this.checked);setAlarmState();"/>      
               </span>
			</td>
			<td>
			</td>
		</tr>
      
		<tr>			
			<td class="itemLabelNotes">
				<h:outputText value="Notes:" />
			</td>
            <td>
            
           </td>
            <td></td>
        </tr>
        <tr>
			<td colspan="3">
				<h:inputTextarea id="alarm_notes"
					     value="#{alarmBean.notes}"
						 styleClass="inputFieldNotes alarmNotes"
                         cols="45" >
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
		
		<div dojotype="ContentPane" label="Trigger" class="tabContents">
		<div align="left">
        <table border="0" cellspacing="0" cellpadding="3">
            <tr>
                <td class="itemLabel alarmTriggerItemLabel">
                    <h:outputText value="Sensor value*:"  />
                </td>
                <td>
                    <h:panelGrid columns="2" border="0">
                        <h:selectOneMenu id="Operator1" value="#{alarmBean.operator1}" >
                            <f:selectItem itemValue="#{alarmBean.operatorValue[0]}" itemLabel=">" />
                            <f:selectItem itemValue="#{alarmBean.operatorValue[1]}" itemLabel="<" />
                            <f:selectItem itemValue="#{alarmBean.operatorValue[2]}" itemLabel="=" />
                        </h:selectOneMenu>
                        <h:inputText id="Operand1"
                                 value="#{alarmBean.operand1}" maxlength="10" size="10">
                                 <f:validateDoubleRange />
                        </h:inputText>
                    </h:panelGrid>
                </td>
                <td>
                    <h:message for="Operand1" styleClass="errorMini" />
                </td>
            </tr>
            <tr>
            	<td class="itemLabel alarmTriggerItemLabel">
                    <h:outputText value="And/Or:"  />
                </td>
                <td>
                    <h:selectOneMenu id="Connector" value="#{alarmBean.connector}" styleClass="alarmSelectLogic" onchange="toggleSecondCond('alarmPopup:Connector')" >
                        <f:selectItem itemValue="#{alarmBean.connectorValue[0]}" 
                        				itemLabel="n/a" />
                        <f:selectItem itemValue="#{alarmBean.connectorValue[1]}" 
                        				itemLabel="AND" />
                        <f:selectItem itemValue="#{alarmBean.connectorValue[2]}" itemLabel="OR" />
                    </h:selectOneMenu>
                </td>
                <td>
                </td>
            </tr>
            <tr id="secondCond" style="visibility:hidden">
                <td class="itemLabel alarmTriggerItemLabel">
                    <h:outputText value="Sensor value*:" />
                </td>
                <td>
                    <h:panelGrid columns="2" border="0">
                        <h:selectOneMenu id="Operator2" value="#{alarmBean.operator2}" >
                            <f:selectItem itemValue="#{alarmBean.operatorValue[0]}" itemLabel=">" />
                            <f:selectItem itemValue="#{alarmBean.operatorValue[1]}" itemLabel="<" />
                            <f:selectItem itemValue="#{alarmBean.operatorValue[2]}" itemLabel="=" />
                        </h:selectOneMenu>
                        <h:inputText id="Operand2" value="#{alarmBean.operand2}" maxlength="10" size="10">
                        <f:validateDoubleRange />
                        </h:inputText>
                    </h:panelGrid>
                </td>
                <td>
                <h:message for="Operand2" styleClass="errorMini" /> 
                </td>
                <script type="text/javascript">
                	// make second condition visible if condition is set
                	toggleSecondCond('alarmPopup:Connector');
                </script>
            </tr>
            <tr>
                <td class="itemLabel alarmFilterItemLabel">
                    <h:outputText value="Filter:" />
                </td>
                <td>
                    <h:panelGrid columns="4" border="0">
						<h:inputText id="Occurrence"
								 value="#{alarmBean.filterLimit}" maxlength="2" size="2" required="true">
								 <f:validateLongRange  minimum="#{alarmBean.minAlarmOccurrence}" maximum="#{alarmBean.maxAlarmSample}"/>
						</h:inputText>
						<h:outputText value="occurrences in" />
						<h:inputText id="Samples"
								 value="#{alarmBean.filterLength}" maxlength="2" size="2" required="true">
								 <f:validateLongRange minimum="#{alarmBean.minAlarmOccurrence}" maximum="#{alarmBean.maxAlarmSample}" />
						</h:inputText>
						<h:outputText value="consecutive samples"  />
					</h:panelGrid>
                </td>
                <td>
                    <h:panelGroup>
                        <h:message for="Occurrence" styleClass="errorMini" />
                        <h:message for="Samples" styleClass="errorMini" />
                    </h:panelGroup>
                </td>
            </tr>
        </table>
        <div class="requiredFields">
            * = required field
        </div>
        </div>
		</div>
        
        <div dojotype="ContentPane" label="Notify" class="tabContents">
        <div align="left">
        <table border="0" cellspacing="0" cellpadding="3">
            <tr>
                <td class="itemLabel alarmNotifyItemLabel">
                    <h:outputText value="Notify List:" />
                    <h:outputText value="(Enter ';' separated e-mail addresses)" 
                        styleClass="alarmNotifyMessage"/>
                </td>
            </tr>
            <tr>
                <td>           
                    <h:inputTextarea id="NotifyList"
                         value="#{alarmBean.notifyList}" 
                         styleClass="inputFieldNotes alarmNotifyListBox">
                    </h:inputTextarea>
                </td>
            </tr>
            <tr>
                <td class="itemLabel alarmNotifyItemLabel">
                    <h:outputText value="Message:" />
                </td>
            </tr>
            <tr>
                <td>
                    <h:inputTextarea id="Message"
                         value="#{alarmBean.message}" 
                         styleClass="inputFieldNotes alarmNotifyMsgBox">
                    </h:inputTextarea>
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
      	<h:commandButton value="OK"  id="alarm_ok_b" styleClass="buttonStyle" action="#{alarmBean.doUpdateAndClose}" />
     	<h:commandButton value="Cancel" id="alarm_cancel_b" styleClass="buttonStyle" action="Close" onclick="doValidate=false;"/>	
      	<h:commandButton value="Apply"  id="alarm_apply_b" styleClass="buttonStyle" action="#{alarmBean.doUpdate}" />	
      <!-- InstanceEndEditable -->
	  </div>
	  </td>
    </tr>
  </span>
  <center>
    <div class="response">
	<!-- InstanceBeginEditable name="ResponseRegion" -->
      <table border="0" cellspacing="0" cellpadding="0" width="90%">
	  <tr><td align="left"><h:outputText id="msg1" value="#{msgs.UpdateSuccessfulMsg}" rendered="#{alarmBean.updateOk}" styleClass="message"/></td></tr>
        <tr><td align="left"><h:outputText id="msg11" value="" rendered="#{!alarmBean.updateOk}" /></td></tr>
        <tr><td align="left"><h:outputText id="msg2" value="#{msgs.UpdateFailedUnexpectedMsg}" rendered="#{alarmBean.updateFail1}" styleClass="error"/></td></tr>
        <tr><td align="left"><h:outputText id="msg22" value="" rendered="#{!alarmBean.updateFail1}" /></td></tr>
        <tr><td align="left"><h:outputText id="msg3" value="#{msgs.UpdateFailedAlarmFilterBoundry}" rendered="#{alarmBean.updateFail2}" styleClass="error"/></td></tr>
        <tr><td align="left"><h:outputText id="msg33" value="" rendered="#{!alarmBean.updateFail2}" /></td></tr>
        <tr><td align="left"><h:outputText id="msg4" value="#{msgs.UpdateFailedAlarmSecondCondition}" rendered="#{alarmBean.updateFail3}" styleClass="error"/></td></tr>
        <tr><td align="left"><h:outputText id="msg44" value="" rendered="#{!alarmBean.updateFail3}" /></td></tr>
        <tr><td align="left"><h:outputText id="msg5" value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{alarmBean.sessionFail}" styleClass="error"/></td></tr>
      	<tr><td align="left"><h:outputText id="msg55" value="" rendered="#{!alarmBean.sessionFail}" /></td></tr>
      	<tr><td align="left"><h:outputText id="msg6" value="#{msgs.ServiceLevelAlarmStandard}" rendered="#{alarmBean.serviceLevel==1}" styleClass="warningStyle"/></td></tr>
      	<tr><td align="left"><h:outputText id="msg66" value="" rendered="#{alarmBean.serviceLevel==2}" /></td></tr>
		</table>
	  
    <!-- InstanceEndEditable -->
	</div>
  </center>
</h:form>
	
</body>
</f:view>
<!-- InstanceEnd --></html>