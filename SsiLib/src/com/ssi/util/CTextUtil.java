package com.ssi.util;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;
import java.util.List;


public class CTextUtil {
	public static final char[] xmlSpecialChars={'<','>','\'','"','\u00AA'}; //& will be replaced with feminine ordinal indicator
	public static final String[] xmlSpecialCharsConv={"&lt;","&gt;","&apos;","&quot;","&amp;"};
	// FlashCharts behaves badly when XML has &amp, &apos, &gt
	public static final String[] xmlSpecialCharsConv2={" ","&gt;"," ","&quot;"," "};
	public static final String CRLF="\r\n";
	private static final String DECIMAL_FORMAT_STR = "############"; // of lenght 12 but, 10 would be suffucient

	/**
     * This method returns the stack trace for the given exception
     */
    public static String getStackTrace (Throwable t)
    {
        java.io.StringWriter sw = new java.io.StringWriter ();
        java.io.PrintWriter pw = new java.io.PrintWriter (sw);
        t.printStackTrace (pw);
        return sw.toString ();
    }
    
    public static synchronized void reverse (List l, int first, int last)  {
    	if (first >= last)
    		return;
    	else {
    		reverse(l, first+1, last-1);
    		if (first<last) swap(l,first,last);
    	}
    }
    
    public static void swap (List l, int a, int b) {
    	Object tmp;
    	tmp = l.get(a);
    	l.set(a, l.get(b));
    	l.set(b,tmp);
    }
    
    public static String DateFormat (Timestamp ts, String pattern){
		SimpleDateFormat df = new SimpleDateFormat(pattern);
		return df.format(ts);
	}
	public static char GetOperatorAsChar(Short i){
		switch (i.shortValue()) {
			case 1: return '>';
			case -1: return '<';
		}
	return '=';
	}
	public static String GetOperatorAsXmlVal(Short i){
		switch (i.shortValue()) {
			case 1: return "greater than ";
			case -1: return "less than ";
		}
	return "equals ";
	}
	
	  /*
	   * Be careful that this function assumes str is a non-coverted string. If it has already &nnn; 
	   * as a result of a previous conversion, this will mess result string. 
	   * 
	   */
	   public static String GetStrAsXmlVal(String str) {
		   //Replace all & with a special char that will not be confused with converted charater strings
		    String newStr = str.replaceAll("&","\u00AA"); 
			
			StringBuffer buff = new StringBuffer();
			int lStr;
			int l = xmlSpecialChars.length;
			char c;
			for (int i=0; i<l; i++) {
				lStr  = newStr.length();
				for (int j=0;j<lStr;j++) {
				 c=newStr.charAt(j);
				 if (c == xmlSpecialChars[i]) 
					buff.append(xmlSpecialCharsConv[i]);
				 else
					buff.append(c);
				 } // for
				 newStr = buff.toString();
				 buff.setLength(0);
			} //for
			return newStr;
		}
	   
	   
	   /*
		   * Be careful that this function assumes str is a non-coverted string. If it has already &nnn; 
		   * as a result of a previous conversion, this will mess result string.
		   * This version handles FusionCharts XML. 
		   */
		   public static String GetStrAsXmlVal2(String str) {
			   //Replace all & with a special char that will not be confused with converted charater strings
			    String newStr = str.replaceAll("&","\u00AA"); 
				
				StringBuffer buff = new StringBuffer();
				int lStr;
				int l = xmlSpecialChars.length;
				char c;
				for (int i=0; i<l; i++) {
					lStr  = newStr.length();
					for (int j=0;j<lStr;j++) {
					 c=newStr.charAt(j);
					 if (c == xmlSpecialChars[i]) 
						buff.append(xmlSpecialCharsConv2[i]);
					 else
						buff.append(c);
					 } // for
					 newStr = buff.toString();
					 buff.setLength(0);
				} //for
				return newStr;
			}
	public static String GetStrAsJSVal(String str) {
		StringBuffer buff = new StringBuffer();
		int l = str.length();
		char c;
		 for (int i=0; i<l; i++){
			 c = str.charAt(i);
			 if (c=='\'')
				 if (i>0 && str.charAt(i-1)=='\\')
					buff.append(c);
				 else 
					 buff.append("\\'");
			 else if (c=='\\'){
				 if (i+1==l)
					 buff.append("\\\\");
				 else 
					 buff.append(c);
			 }
			 else buff.append(c);
				 
		 }//for
		 return buff.toString();
	}
	/**
	 * 
	 * @param val Number to be formatted
	 * @param sigDigits number of significant digits
	 * @param decimal decimal number or not
	 * @return
	 */
	public static String convSigDigits(double val, int sigDigits, boolean decimal, RoundingMode rMode) {
		
		if (Double.isNaN(val))
			return (String.valueOf(0.0));
		
		if (!decimal) {
			long intVal = (long) val;
			String strIntVal = Long.valueOf(intVal).toString();
			return strIntVal;
		}
	/*	String strFormat = "0."+DECIMAL_FORMAT_STR.substring(0,sigDigits-1)+"E0";
		DecimalFormat df = new DecimalFormat(strFormat);
		return df.format(val);
		*/
		
		BigDecimal tmp = new BigDecimal(val);
		MathContext mc = new MathContext(sigDigits, rMode);
		tmp = tmp.round(mc);
		return (tmp.toString());
	}
	
	
	public static void main(String[] arg) {
		double v1 = 123.4567;
		double v2 = 0.123;
		double v3 = 123456.3456;
		double v4 = 0.00003456;
		
		System.out.println(convSigDigits(v1, 4, true, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v1, 4, false, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v2, 4, true, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v2, 4, false, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v3, 4, true, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v3, 4, false, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v3, 8, true, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v3, 8, false, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v4, 5, true, RoundingMode.UNNECESSARY));
		System.out.println(convSigDigits(v4, 5, false, RoundingMode.UNNECESSARY));
	}
}
