function  validateInt(value, min, max, varName) {
	    //alert("value=" + value + " min=" + min + " max=" + max + " varName=" + varName)
		
		// check if first character is +; javascript function parseInt() 
		// doesn't mind it but server (JSF) does.
		//var str = value.substring(0,1)
		// check if last character is a non-numeric; javascript function parseInt() 
		// ignores it but, server (JSF) does not.
		//var len = value.length
		//var code = value.charCodeAt(len-1)
		
		var val = parseInt(value);

		//alert("val="+val+" str="+str+" code="+code+" len="+len)
		//|| (str == "+") || (code > 31 && (code<48 || code>57 ))
		if (isNaN(val) || (min!==null && min>val) || (max!==null && max<val) ) {
		    var msg = " should be an integer ";
		    if (min!==null && max!==null) {
				msg = msg + "between " + min + " and " + max;
			}
			else if (min!==null) {
				msg = msg + "greater than or equal to " + min;
			} else if (max !==null) {
				msg = msg + "less than or equal to " + max;
			} 
			alert(varName+msg);
			return NaN;
		}	
		return val;
	}
	function  validateFloat(value, min, max, varName) {
	    //alert("value=" + value + " min=" + min + " max=" + max + " varName=" + varName)
		// check if first character is +; javascript function parseFloat() 
		// doesn't mind it but server (JSF) does.
		//var str = value.substring(0,1)
		// check if last character is a non-numeric; javascript function parseInt() 
		// ignores it but, server (JSF) does not.
		//var len = value.length
		//var code = value.charCodeAt(len-1)
		
		var val = parseFloat(value);
		
		//alert("val="+val+" str="+str+" code="+code+" len="+len)
		if (isNaN(val) || (min!==null && min>val) || (max!==null && max<val)) {
			var msg = " should be a decimal number ";
			if (min!==null && max!==null) {
				msg = msg + "between " + min + " and " + max;
			}
			else if (min!==null) {
				msg = msg + "greater than or equal to " + min;
			} else if (max !==null) {
				msg = msg + "less than or equal to " + max;
			} 
			alert(varName+msg);
			return NaN;
		}	
		return val;
	}