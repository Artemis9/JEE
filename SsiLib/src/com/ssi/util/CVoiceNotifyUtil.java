package com.ssi.util;

import java.net.*;
import java.util.StringTokenizer;
import java.io.*;

public class CVoiceNotifyUtil {
	static String _URIString = "http://ws.cdyne.com/NotifyWS/PhoneNotify.asmx/NotifyPhoneEnglishBasic?PhoneNumberToDial=";
	static String _license = "2AC0489B-54FF-4ABE-A574-72BBE6C783C3";
	
	public static String VoiceNotify(String phoneList, String message) {
		String retStr = null;
		String strMsg = message.replaceAll("[^a-zA-Z_0-9]","%20");
		//System.out.println("strMsg " + strMsg);
		
		StringTokenizer st = new StringTokenizer(phoneList,";,"); // \t\n\r\f - ( )
	    while (st.hasMoreTokens()) {
	    	String str = st.nextToken();
	    	//System.out.println("str:" + str);
	    	retStr = issueHttpGet(str, strMsg);
	    }
		return retStr;
	}

	private static String issueHttpGet(String phone, String message) {
		String uriString = _URIString + phone + "&TextToSay=" + message + "&LicenseKey="+_license;
		//System.out.println("uriString " + uriString);
		   URI theURI = null;
		   URL theURL = null;
		   try { theURI = new URI(uriString); theURL = theURI.toURL(); }
		   
		   catch ( URISyntaxException e) {
			     //System.out.println("Bad URI: " + theURI);
		   }
		   catch ( MalformedURLException e) {
			     //System.out.println("Bad URL: " + theURL);
		   }
		   
		   //System.out.println("URL=" + theURL.toString());
		   
		   URLConnection conn = null;
		   DataInputStream data = null;
		   String line;
		   StringBuffer buf = new StringBuffer();

		   try {
		     conn = theURL.openConnection();
		     conn.connect();

		     //System.out.println("Connection opened...");

		     data = new DataInputStream(new BufferedInputStream(
		                    conn.getInputStream()));

		     //System.out.println("Reading data...");
		     while ((line = data.readLine()) != null) {
		       buf.append(line + "\n");
		     }
		     //System.out.println(buf.toString());
		     data.close();
		   }
		   catch (IOException e) {
		     //System.out.println("IO Error:" + e.getMessage());
		   }
		   return buf.toString();
	}


	 public static void main(String args[]) {
	   String retBuff = VoiceNotify("(805) 705-4489; (805)-705-4489, ", "Hello World 1,2,3,4,5 ???	\\");
	 }
 }
