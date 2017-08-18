package com.ssi.web.common;

/**
 *  Fit straight line to a set of data points.
 *  Implements the Fit interface.
 *
 */
public class FitLine extends Fit
{

  /**
   *  Use the Least Squares fit method for fitting a
   *  straight line to 2-D data for measurements
   *  y[i] vs. dependent variable x[i]. This fit assumes
   *  there are errors only on the y measuresments as
   *  given by the sigmaY array.<br><br>
   *  See, e.g. Press et al., "Numerical Recipes..." for details
   *  of the algorithm.
   */
  public static void fit(double [] parameters, double [] x, double [] y,
                       double [] sigmaX, double [] sigmaY, int numPoints){

    double s=0.0,sx=0.0,sy=0.0,sxx=0.0,sxy=0.0,del;

    // Null sigmaY implies a constant error which drops
    // out of the divisions of the sums.
    if( sigmaY != null){
        for(int i=0; i < numPoints; i++){

            s   += 1.0/(sigmaY[i]*sigmaY[i]);
            sx  += x[i]/(sigmaY[i]*sigmaY[i]);
            sy  += y[i]/(sigmaY[i]*sigmaY[i]);
            sxx += (x[i]*x[i])/(sigmaY[i]*sigmaY[i]);
            sxy += (x[i]*y[i])/(sigmaY[i]*sigmaY[i]);
        }
    }else{
        s = numPoints;
        for(int i=0; i < numPoints; i++){
            sx  += x[i];
            sy  += y[i];
            sxx += x[i]*x[i];
            sxy += x[i]*y[i];
        }
    }

    del = s*sxx - sx*sx;

    // Slope
    parameters[1] = (s*sxy -sx*sy)/del;
    //parameters[1] = (s*sxy-sx*sy)/(s*sxx-((sx*sx)));

    // Intercept
    parameters[0] = (sxx*sy -sx*sxy)/del;
    //parameters[0] = (sy-parameters[1]*sx)/s;


    // Errors (sd**2) on the:
    // intercept
    parameters[2] = sxx/del;
    // and slope
    parameters[3] = s/del;

  }

}