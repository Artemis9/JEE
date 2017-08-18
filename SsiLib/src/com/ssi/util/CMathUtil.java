package com.ssi.util;

public class CMathUtil {

	
	public static Double CalcMeasurement(float data, float coeff1, float coeff2, float coeff3, float coeff4){

		 float c1,c2,c3,c4;
		 c1=coeff1;
		 c2=coeff2;
		 c3=coeff3;
		 c4=coeff4;
		 
		 float dv= data;
		 float dv2=dv*dv;

		 double result = c1 + c2 * dv +c3 * dv2 + c4 * dv * dv2;
		 return  Double.valueOf(result);
		}
	
	public static Double ConvertCoeff1ToFahrenheit(Double coeff){
		return Double.valueOf(coeff.doubleValue() * 9 / 5 + 32);
	}
	public static Double ConvertCoeff2ToFahrenheit(Double coeff){
		return Double.valueOf(coeff.doubleValue() * 9 / 5);
	}
	public static Double ConvertCoeff3ToFahrenheit(Double coeff){
		return ConvertCoeff2ToFahrenheit(coeff);
	}
	public static Double ConvertCoeff4ToFahrenheit(Double coeff){
		return ConvertCoeff2ToFahrenheit(coeff);
	}
	
	
	public static Float CelciusToFahrenheit(Float celcius){
		return Float.valueOf(celcius.floatValue()*9/5+32);
	}
	
	public static Float FahrenheitToCelcius(Float fahrenheit){
		return Float.valueOf((fahrenheit.floatValue()-32)*5/9);
	}
	
	public static Double ConvertCoeff1ToCelcius(Double coeff){
		return Double.valueOf((coeff.doubleValue() - 32) * 5/9);
	}
	public static Double ConvertCoeff2ToCelcius(Double coeff){
		return Double.valueOf(coeff.doubleValue() * 5 / 9);
	}
	public static Double ConvertCoeff3ToCelcius(Double coeff){
		return ConvertCoeff2ToCelcius(coeff);
	}
	public static Double ConvertCoeff4ToCelcius(Double coeff){
		return ConvertCoeff2ToCelcius(coeff);
	}
	/**
	   * Calculates the standard deviation of an array
	   * of numbers.
	   * see http://davidmlane.com/hyperstat/A16252.html
	   *
	   * @param data Numbers to compute the standard deviation of.
	   * Array must contain two or more numbers.
	   * @return standard deviation estimate of population
	   * ( to get estimate of sample, use n instead of n-1 in last line )
	   */
	   public static double sdFast ( double[] data )
	      {
	      // sd is sqrt of sum of (values-mean) squared divided by n - 1
	      // Calculate the mean
	      double mean = 0;
	      final int n = data.length;
	      if ( n < 2 )
	         {
	         return Double.NaN;
	         }
	      for ( int i=0; i<n; i++ )
	         {
	         mean += data[i];
	         }
	      mean /= n;
	      // calculate the sum of squares
	      double sum = 0;
	      for ( int i=0; i<n; i++ )
	         {
	         final double v = data[i] - mean;
	         sum += v * v;
	         }
	      return Math.sqrt( sum / ( n - 1 ) );
	      }

	   /**
	   * Calculates the standard deviation of an array
	   * of numbers.
	   * see Knuth's The Art Of Computer Programming
	   * Volume II: Seminumerical Algorithms
	   * This algorithm is slower, but more resistant to error propagation.
	   *
	   * @param data Numbers to compute the standard deviation of.
	   * Array must contain two or more numbers.
	   * @return standard deviation estimate of population
	   * ( to get estimate of sample, use n instead of n-1 in last line )
	   */
	   public static double sdKnuth ( double[] data )
	      {
	      final int n = data.length;
	      if ( n < 2 )
	         {
	         return 0;
	         }
	      double avg = data[0];
	      double sum = 0;
	      for ( int i = 1; i < data.length; i++ )
	         {
	         double newavg = avg + ( data[i] - avg ) / ( i + 1 );
	         sum += ( data[i] - avg ) * ( data [i] -newavg ) ;
	         avg = newavg;
	         }
	      return Math.sqrt( sum / ( n - 1 ) );
	      }

	   
	   
	   public static double avarage ( double[] data )
	      {
	      // Calculate the mean
	      double mean = 0;
	      final int n = data.length;
	      if ( n < 2 )
	         {
	         return Double.NaN;
	         }
	      for ( int i=0; i<n; i++ )
	         {
	         mean += data[i];
	         }
	      return mean / n;
	      }
	   
	   public static float mround(float val, int roundTo, boolean roundUp) {
		   float roundedVal;
		   long intVal = (long)(val/roundTo); //truncate
		   float remainder = (val/roundTo) - intVal;
		   float roundAmount = (roundUp) ? (1-remainder)*roundTo : -remainder*roundTo; 
		   roundedVal = val + roundAmount;		   
		   return (roundedVal);
	   }
}
