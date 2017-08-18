package com.ssi.web.common;

/**
 *  Interface for algorithms to fit 2-D data points.
 *
 */
public class Fit
{
  /**
   *  Returns an array with the fit parameters, e.g.
   *  slope and intercept for a straight line, to 2-D
   *  data.
   */
  public static void fit(double [] parameters, double [] x, double [] y,
                       double [] sigmaX, double [] sigmaY, int numPoints){};

}