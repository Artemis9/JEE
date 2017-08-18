package com.ssi.util;

import java.security.MessageDigest;

import org.apache.log4j.Logger;

public class CSecurityUtil
{   
	static Logger LOG = Logger.getLogger(CSecurityUtil.class.getName());
    private static MessageDigest md;
    
    static {
        try
        {
             md = MessageDigest.getInstance("SHA");
             System.out.println("md = "+md);
             System.out.println("md = "+md.getAlgorithm());
             System.out.println("md = "+md.getProvider());
             
        }
        catch (Exception e)
        {
        	LOG.error("MessageDisgest is not initialized ", e);
            e.printStackTrace();
        }
    }
    
    
    private static String  convert(byte[] data) {
    	String str;
    	StringBuffer result = new StringBuffer();
    	Byte b;
    	int iVal;
    	for (int i=0; i<data.length; i++) {
    		 b = Byte.valueOf(data[i]);
    		 iVal = b.intValue();
    		 str = Integer.toHexString(iVal);
    		 result.append(str);
    	}
    	return result.toString();
    }
    
    public static String encrypt(String str)
    {
        // Form the SHA1SUM
    	byte[] data = str.getBytes();
        md.update(data);
        byte [] digest = md.digest();
        return convert(digest);
    }
}
