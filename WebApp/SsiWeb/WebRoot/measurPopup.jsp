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

<title>accsense -- Measurement Properties</title>

<!-- InstanceEndEditable -->
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<LINK REL="stylesheet" HREF="popup.css" TYPE="text/css">

<script type="text/javascript" src="js/dojo/dojo.js"></script>
<script type="text/javascript">
	dojo.require("dojo.widget.TabPane");
</script>

<!-- InstanceBeginEditable name="head" -->

<script type="text/javascript" language="JavaScript1.2" src="js/validate.js"></script>
<script type="text/javascript" language="JavaScript1.2">
function  validate(form) {
     elem = document.getElementById("measurPopup:msg1")
     if (elem != null)
     	elem.style.visibility="hidden"   
     elem = document.getElementById("measurPopup:msg2")
     if (elem != null)
     	elem.style.visibility="hidden"   
     elem = document.getElementById("measurPopup:Coeff1")
     if (elem == null)
     	return true
     //alert("elem.value="+elem.value)
     var field1= elem.value
     var field2= document.getElementById("measurPopup:Coeff2").value 
     var field3= document.getElementById("measurPopup:Coeff3").value 
     var field4= document.getElementById("measurPopup:Coeff4").value  
     //alert("field1="+field1+"field2="+field2+"field3="+field3+"field4="+field4)
     
     var ret = validateFloat(field1,null,null,"Coeff-1")
     if (isNaN(ret))
     	return false
     document.getElementById("measurPopup:Coeff1").value = ret
     
     ret = validateFloat(field2,null,null,"Coeff-2")
     if (isNaN(ret))
     	return false
     document.getElementById("measurPopup:Coeff2").value = ret
     
     ret = validateFloat(field3,null,null,"Coeff-3")
     if (isNaN(ret))
     	return false
     document.getElementById("measurPopup:Coeff3").value = ret	
     
     ret = validateFloat(field4,null,null,"Coeff-4")
     if (isNaN(ret))
     	return false
     document.getElementById("measurPopup:Coeff4").value = ret
     return ret
    }
function disableFields() {
		var adminElement = document.getElementById("measurPopup:measur_admin");
		if (adminElement) {
			var adminBool = adminElement.value;
			//alert("adminBool="+adminBool);
			document.getElementById("measurPopup:measur_name").disabled = !eval(adminBool);
			document.getElementById("measurPopup:measur_notes").disabled = document.getElementById("measurPopup:measur_name").disabled;
			document.getElementById("measurPopup:measur_update_b").disabled = document.getElementById("measurPopup:measur_name").disabled;
			//document.getElementById("measurPopup:measur_cancel_b").disabled = document.getElementById("measurPopup:measur_name").disabled;
			//document.getElementById("measurPopup:measur_ok_b").disabled = document.getElementById("measurPopup:measur_name").disabled;
			var unitBool = document.getElementById("measurPopup:measur_changeableUnit").value;
			var coeffBool = document.getElementById("measurPopup:measur_changeableCoeffs").value;
			var multipleUnitBool = document.getElementById("measurPopup:measur_multipleUnits").value;
	    	//alert("unitBool="+unitBool+" coeffBool="+coeffBool);
	    	if (eval(unitBool) && !eval(multipleUnitBool)) {
	    		//alert("in if unitBool="+unitBool);
	    		document.getElementById("measurPopup:measur_unit").disabled = document.getElementById("measurPopup:measur_name").disabled;
	    	}
	    	if (eval(unitBool) && eval(multipleUnitBool)) {
				document.getElementById("measurPopup:measur_unit1").disabled = document.getElementById("measurPopup:measur_name").disabled;
	    	}
			if (eval(coeffBool)) {
				//alert("in if coeffBool="+coeffBool);
				document.getElementById("measurPopup:Coeff1").disabled = document.getElementById("measurPopup:measur_name").disabled;
				document.getElementById("measurPopup:Coeff2").disabled = document.getElementById("measurPopup:measur_name").disabled;
				document.getElementById("measurPopup:Coeff3").disabled = document.getElementById("measurPopup:measur_name").disabled;
				document.getElementById("measurPopup:Coeff4").disabled = document.getElementById("measurPopup:measur_name").disabled;
			}
		}
}

function updateMainPage() {
    var elementId = window.openerFormId;
    if (elementId) {
        var thatName = opener.document.getElementById(elementId + ":measur_name");
        var thisName = document.getElementById("measurPopup:measur_name");
        thatName.innerHTML = thisName.value;
        
        var thatUnits = opener.document.getElementById(elementId + ":measur_unit");
        var thisUnits = document.getElementById("measurPopup:measur_unit");
        if (!eval(thisUnits)) {
           thisUnits = document.getElementById("measurPopup:measur_unit1");
        }
        thatUnits.innerHTML = thisUnits.value;
    }
    
   /* var gatewayForm = opener.document.getElementById("gwRefresh");
    if (gatewayForm) {
    	gatewayForm.submit();
    }
  */
}

dojo.addOnLoad(disableFields);  
</script>
	
<!-- InstanceEndEditable -->
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<!-- InstanceBeginEditable name="FormHeader" -->
<ssi:flowState bean="#{measurementBean}" />
<h:form id="measurPopup" onsubmit="return validate(this)">
<!-- InstanceEndEditable -->  
  <table cellspacing=0 cellpadding=2 width="100%"  border="0">
    <tr height="40" bgcolor=#77C0E9>
      <td width="142"><img src="images/popup_logo.jpg" width="142" height="40" /></td>
      <td bgcolor="#77C0E9" align="center" class="labelStyle">
	  <!-- InstanceBeginEditable name="TitleBar" -->
	  MEASUREMENT PREFERENCES
	  <!-- InstanceEndEditable -->
	  </td>
    </tr>
  </table>
  <!-- InstanceBeginEditable name="JSFVars" -->
  <table width="460" align="center" border="0" cellspacing="0" cellpadding="0">
	<tr><td width="460">&nbsp;</td></tr>
	<tr><td width="460" align="center">
	  <h:outputText styleClass="labelStyle" value="#{measurementBean.name}"/>
	</td></tr>
	<tr><td width="460">&nbsp;</td></tr>
	<tr><td><h:inputHidden id="measur_id" value="#{measurementBean.id}" /></td></tr> 
	<tr><td><h:inputHidden id="measur_changeableCoeffs" value="#{measurementBean.changeableCoeffs}" />
	</td></tr>
	<tr><td><h:inputHidden id="measur_changeableUnit" value="#{measurementBean.changeableUnit}" />
	</td></tr>
	<tr><td><h:inputHidden id="measur_typeName" value="#{measurementBean.typeName}" /></td></tr>
	<tr><td><h:inputHidden id="measur_origUnit" value="#{measurementBean.origUnit}" /></td></tr>
	<tr><td><h:inputHidden id="measur_origCoeff1" value="#{measurementBean.origCoeff1}" /></td></tr>
	<tr><td><h:inputHidden id="measur_origCoeff2" value="#{measurementBean.origCoeff2}" /></td></tr>
	<tr><td><h:inputHidden id="measur_origCoeff3" value="#{measurementBean.origCoeff3}" /></td></tr>
	<tr><td><h:inputHidden id="measur_origCoeff4" value="#{measurementBean.origCoeff4}" /></td></tr>
	<tr><td><h:inputHidden id="measur_admin" value="#{measurementBean.admin}" /></td></tr>
	<tr><td><h:inputHidden id="measur_multipleUnits" value="#{measurementBean.multipleUnits}" /></td></tr>
	<tr><td><h:inputHidden id="measur_changeableSingleUnit" value="#{measurementBean.changeableSingleUnit}" /></td></tr>
	
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
            <td class="itemLabel measItemLabel">
                <h:outputText value="Name:" />
            </td>
            <td>
                <h:inputText id="measur_name"
                             value="#{measurementBean.name}" 
                             styleClass="measInputName" 
                             maxlength="#{measurementBean.maxNameLength}">
                </h:inputText>
            </td>
            <td>
            </td>
        </tr>

        <tr>
            <td class="itemLabel measItemLabel">
                <h:outputText value="Unit:" rendered="#{measurementBean.changeableUnit}" />
            </td>
            <td>
			    <h:inputText id="measur_unit"
						 value="#{measurementBean.unit}" 
						 title="Original value: #{measurementBean.origUnit}" 
						 maxlength="#{measurementBean.maxUnitLength}" 
						 size="#{measurementBean.maxUnitLength}" 
						 rendered="#{measurementBean.changeableSingleUnit}"
						 styleClass="measInputUnit">
				</h:inputText>
				<h:selectOneMenu id="measur_unit1" 
				value="#{measurementBean.unit}" 
				rendered="#{measurementBean.multipleUnits}" 
				styleClass="measInputUnit">
					<f:selectItem itemValue="#{measurementBean.unitValue[0]}" itemLabel="#{measurementBean.unitValue[0]}" />
					<f:selectItem itemValue="#{measurementBean.unitValue[1]}" itemLabel="#{measurementBean.unitValue[1]}" />
				</h:selectOneMenu> 
            </td>
            <td>
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
                <h:inputTextarea id="measur_notes"
                             value="#{measurementBean.notes}" 
                             styleClass="inputFieldNotes measNotes"
                             cols="45" >
                </h:inputTextarea>
            </td>                
            <td></td>
            <td></td>
        </tr>
        </table>
        </div>
	
<!-- InstanceEndEditable -->
		</div>		
 
		<!-- InstanceBeginEditable name="OtherTabs" -->
  		
        <div dojotype="ContentPane" label="Info" class="tabContents">
        <div align="left"> 
        <table border="0" cellspacing="0" cellpadding="1">
            <tr>
                <td class="itemLabel measInfoItemLabel">
                <h:outputText value="Sensor Type:" />
                </td>
                <td>
                <h:outputText value="#{measurementBean.typeName}" />
                </td>
            </tr>    
        </table> 
        </div>
        </div>
        
        <h:outputText value="<div dojoType='ContentPane' label='Advanced' class='tabContents'>"
			rendered="#{measurementBean.changeableCoeffs}" 
			escape="false" />
		  
			<table width="100%" border="0" class="measCoeffTable">
			<tbody>
			<tr>
			<td>
				<h:outputText value="Calibration Coefficient-1:" rendered="#{measurementBean.changeableCoeffs}"/>
			</td>
			<td>
				<h:inputText id="Coeff1" 
							 value="#{measurementBean.coeff1}" 
							 title="Original value: #{measurementBean.origCoeff1}" 
							 rendered="#{measurementBean.changeableCoeffs}"
							 styleClass="measInputCoeff">
				</h:inputText>
			</td>
			<td>
			</td>
			</tr>
			<tr>
			<td>
				<h:outputText value="Calibration Coefficient-2:" rendered="#{measurementBean.changeableCoeffs}" />
			</td>
			<td>
				<h:inputText id="Coeff2"
							 value="#{measurementBean.coeff2}" 
							 title="Original value: #{measurementBean.origCoeff2}" 
							 rendered="#{measurementBean.changeableCoeffs}" 
							 styleClass="measInputCoeff">
				</h:inputText>
			</td>
			<td>
			</td>
			</tr>
			<tr>
			<td>
				<h:outputText value="Calibration Coefficient-3:" rendered="#{measurementBean.changeableCoeffs}" />
			</td>
			<td>
				<h:inputText id="Coeff3"
							 value="#{measurementBean.coeff3}" 
							 title="Original value: #{measurementBean.origCoeff3}" 
							 rendered="#{measurementBean.changeableCoeffs}" 
							 styleClass="measInputCoeff">
				</h:inputText>
			</td>
			<td>
			</td>
			</tr>
			<tr>
			<td>
				<h:outputText value="Calibration Coefficient-4:" rendered="#{measurementBean.changeableCoeffs}" />
			</td>
			<td>
				<h:inputText id="Coeff4"
							 value="#{measurementBean.coeff4}" 
							 title="Original value #{measurementBean.origCoeff4}" 
							 rendered="#{measurementBean.changeableCoeffs}" 
							 styleClass="measInputCoeff">
				</h:inputText>
			</td>
			<td>
			</td>
			</tr>
			</tbody>
			</table>
			
	<h:outputText value="</div>" escape="false" rendered="#{measurementBean.changeableCoeffs}" />

  <!-- InstanceEndEditable -->
	  </div>
    </div>
  </center>
  <span class="buttons">
	  <!-- InstanceBeginEditable name="Buttons" -->
      <!--	<h:commandButton value="OK"  id="measur_ok_b" styleClass="buttonStyle" action="#{measurementBean.doUpdateAndClose}" onclick="updateMainPage();" />-->
      <!--	<h:commandButton value="Cancel" id="measur_cancel_b" styleClass="buttonStyle" action="Cancel" /> -->	
      	<h:commandButton value="Apply"  id="measur_update_b" styleClass="buttonStyle" action="#{measurementBean.doUpdate}"  />	
      <!-- InstanceEndEditable -->
	  </span>  
  <center>
    <div class="response">
	<!-- InstanceBeginEditable name="ResponseRegion" -->
      
	  	<table border="0" cellspacing="0" cellpadding="0" width="90%">
        <tr><td align="left"><h:outputText id="msg1" value="#{msgs.UpdateSuccessfulMsg}" rendered="#{measurementBean.updateOk}" styleClass="message"/></td></tr>
        <tr><td align="left"><h:outputText id="msg11" value="" rendered="#{!measurementBean.updateOk}" /></td></tr>
        <tr><td align="left"><h:outputText id="msg2" value="#{msgs.UpdateFailedUnexpectedMsg}" rendered="#{measurementBean.updateFail1}" styleClass="error"/></td></tr>
        <tr><td align="left"><h:outputText id="msg22" value="" rendered="#{!measurementBean.updateFail1}" /></td></tr>
        <tr><td align="left"><h:outputText id="msg3" value="#{msgs.RefreshSessionExpiredMsg}" rendered="#{measurementBean.sessionFail}" styleClass="error"/></td></tr>
      	<tr><td align="left"><h:outputText id="msg33" value="" rendered="#{!measurementBean.sessionFail}" /></td></tr>
      </table>
	  
    <!-- InstanceEndEditable -->
	</div>
  </center>
</h:form>
<table width="460" border="0" cellspacing="0" cellpadding="0">	
	<h:form id="measurPopupClose" target="mainWindow" onsubmit="setTimeout('self.close()',2000)" >
		<tr valign="bottom" align="right" > <td width="460" style="height:50px;"><h:commandButton styleClass="linkStyle measCloseWindow" action="Close" value="Close Window" type="submit"/></td></tr>
	</h:form>
</table>	
</body>
</f:view>
<!-- InstanceEnd --></html>