package com.ssi.web.bean;

import java.util.Iterator;
import java.util.List;

import java.util.Vector;
import java.awt.geom.Point2D;

import java.lang.Math;
import java.sql.*;
import java.math.*;


import javax.servlet.http.*;

import com.ssi.bean.DetailReadings;
import com.ssi.ejb.ISsiManagerLocal;
import com.ssi.persistence.SensorData;
import com.ssi.persistence.CAlarmDefinition;
import com.ssi.persistence.CMeasurement;
import com.ssi.web.common.IURLConstants;
import com.ssi.web.common.FitLine;
import com.ssi.util.*;
import com.ssi.common.IApplicationConstants;

public class GuiWidgetsChart extends AMeasurement {
	private static final String chartDataHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xml-body>";
	private static final String chartDataFooter = "</xml-body>";

	
	private static final String graph_head1 = "<graph showShadow='true' rotateNames='1' chartBottomMargin='17' chartTopMargin='47' chartLeftMargin='50' chartRightMargin='0' showAlternateHGridColor='1' alternateHGridAlpha='20' formatNumberScale='0' hoverCapBgColor='77C0E9' yaxisname='";
	private static final String graph_head2 = "' bgSWF='Charts/backgnd.swf'  canvasBorderThickness='2' showNames='0' showValues='0' showAnchors='1' showhovercap='1' showLimits='1' ";
	private static final String graph_head4 = " >";
	private static final String graph_end = "</graph>";
	private static final int DEFAULT_SIGNIFICANT_DIGITS=4;
	private static final int DEFAULT_DIVLINE_COUNT=4;
	private static final int DEFAULT_CHART_HEIGHT=190; //pixels
	private static final int DEFAULT_CHART_WIDTH=570;  //pixels
	private static final int DEFAULT_DATA_TABLE_POINTS_PER_PAGE=480;  //4hrs @ 30samples/sec
	
	private static final int CHART_ROUNDING_USE_SIGDIGITS=0;
	private static final int CHART_ROUNDING_USE_SIGDIGITS_DIV_2=-1;
	
	private Float alarmLine1;
	private Float alarmLine2;
	private boolean alarmEnabled;
	private Short alarmOperator1;
	private Short alarmOperator2;
	
	private Vector dataSample;
	private Vector dataSampleModified;
	private StringBuffer buffStateXml;
	private StringBuffer buffStatsXml;
	private StringBuffer buffGraphHeaderXml;
	private StringBuffer buffGraphFooterXml;
	private StringBuffer buffGraphCategoriesXml;
	private StringBuffer buffGraphDataSetXml;
	private StringBuffer buffGraphTrendlinesXml;
	private StringBuffer buffDataTablePageXml;
	private StringBuffer buffDataTableIndexXml;
	private StringBuffer buffDataChartLegendXml;
	private Long tzo;
	
	private Timestamp firstTs;
	private Timestamp lastTs;
	private Timestamp firstDataTs;
	private Timestamp lastDataTs;
	
	private boolean dataDecimated;
	private int pointCount;
	private int dataTablePointsPerPage;
	private boolean sendOneTablePageOnly;
	private Integer tablePageDataIndex;
	private float chartMin=Float.NaN, chartMax=Float.NaN;
	private float dataMin=Float.NaN, dataMax=Float.NaN;
	private double dataAverage=0;
	private String sensorType;
	
	private HttpSession session; 
	
	private boolean prevData;
	private boolean nextData;
	private boolean autoScale;
	private float minYscale;
	private float maxYscale;
	private int sigDigits;
	private int chartRoundingValue;
	private boolean decimalValue;
	
	private Long wsmId;

	/**
	 * Constructor of the object.
	 */
	public GuiWidgetsChart() {
		LOG.debug("XXXXXXXXX  IN GuiWidgetsChart()  XXXXXXXXX");
		this.dataSample = null;
		this.dataSampleModified = new Vector(DEFAULT_CHART_WIDTH);
		buffGraphHeaderXml = new StringBuffer("");
		buffGraphFooterXml = new StringBuffer("");
		buffGraphCategoriesXml = new StringBuffer("");
		buffGraphDataSetXml = new StringBuffer("");
		buffGraphTrendlinesXml = new StringBuffer("");
		buffStateXml = new StringBuffer("");
		buffStatsXml = new StringBuffer("");
		buffDataTablePageXml = new StringBuffer("");
		buffDataTableIndexXml = new StringBuffer("");
		firstTs = null;
		lastTs = null;
		pointCount = 0;
		dataDecimated = false;		
		this.nextData = true;  
		this.prevData = true;
		autoScale = true;
		minYscale=0;
		maxYscale=0;
		sigDigits = DEFAULT_SIGNIFICANT_DIGITS;
		chartRoundingValue = CHART_ROUNDING_USE_SIGDIGITS_DIV_2;;
		decimalValue = true;
		dataTablePointsPerPage = DEFAULT_DATA_TABLE_POINTS_PER_PAGE;
		sendOneTablePageOnly = false;
		tablePageDataIndex = new Integer(-1);
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
	}
	
	
	/**
	 * Initiates the query and retrieves the the XML header string.
	 *  
	 * NOTE: This property must be the first "get" property
	 * called by your JSP page.  If it is not first the other
	 * getXml* functions will return nothing or invalid XML.
	 *  
	 *  @return String containing the chart header in XML format.
	 */
	public String getXmlHeader(){
		try {
			this.makeQuery();
			return (chartDataHeader.toString());
		}
		catch (Exception e) {
			String failed = chartDataHeader.toString() + "<exception>Load Failed</exception>" ; 
			return (failed);
		}
	}
	
	/**
	 * Cleans up query and retrieves the XML footer string. 
	 * 
	 * NOTE: this property must be the last "get" property
	 * called by your JSP page.  If it is not last the other
	 * getXml* functions will return nothing or invalid XML.
	 *  
	 *  @return String containing the chart footer in XML format.
	 */
	public String getXmlFooter(){
		this.dataSample.clear();
		this.dataSampleModified.clear();
		return (chartDataFooter.toString());
	}
	
	public String getChartHeader(){
		return (buffGraphHeaderXml.toString());
	}
	
	public String getChartFooter(){
		return (buffGraphFooterXml.toString());
	}
	
	public String getChartCategories(){
		return (buffGraphCategoriesXml.toString());
	}
	
	public String getChartDataset(){
		return (buffGraphDataSetXml.toString());
	}
	
	public String getChartTrendlines(){
		return (buffGraphTrendlinesXml.toString());
	}
	
	public String getXmlStateInfo(){
		return (buffStateXml.toString());
	}
	
	public String getXmlStatistics(){
		return (buffStatsXml.toString());
	}
	
	public String getXmlTableDataPage(){
		return (buffDataTablePageXml.toString());
	}
	
	public String getXmlTableDataIndex(){
		return (buffDataTableIndexXml.toString());
	}
	public String getXmlChartLegend(){
		return (buffDataChartLegendXml.toString());
	}
	public void setTablePageIndex(String index){
		Integer pageIndex = new Integer(index);
		if (pageIndex.intValue() >= 0) {
			this.sendOneTablePageOnly = true;
			this.tablePageDataIndex = new Integer(pageIndex.intValue());
		}
		else {
			this.sendOneTablePageOnly = false;
			this.tablePageDataIndex = new Integer(0);
		}
			
	}
	public void setDataTablePointsPerPage(String pointCount) {
		if (pointCount != "") {
			Integer tmp = new Integer(pointCount);
			dataTablePointsPerPage = tmp.intValue();
		}
	}
	
	public void setStartDate(String id) {
		if (id != "") {
			Long tmp = new Long(id);
			firstTs = new Timestamp(tmp.longValue());
		}
	}
	
	public void setEndDate(String id) {
		if (id != "") {
			Long tmp = new Long(id);
			lastTs = new Timestamp(tmp.longValue());
		}
	}
	
	public void setMeasurementBeanId(String id) {
		Long tmp = new Long(id);
		this.id = tmp;
	}
	
	public void setPodId(String id) {
		Long tmp = new Long(id);
		this.wsmId = tmp;
	}
	
	public void setFirstAvailTs(String ts) {
		Long tmp = new Long(ts);
		this.firstDataTs = new Timestamp(tmp.longValue());
	}
	
	public void setSession(HttpSession session) {
		this.session = session;
	}
	
	public void setChartMax(float value) {
		this.maxYscale = value;
	}
	public void setChartMin(float value) {
		this.minYscale = value;
	}
	public void setAutoScaleFlag(boolean value) {
		this.autoScale = value;
	}
	
	/**
	 *  JSF init routine
	 */
	public void createChart() {
		LOG.info("XXXXXXXXX  IN createChart()  XXXXXXXXX");
		this.sessionFail = false;
	}
	
	
	/**
	 *  Utility methods
	 */
	public void makeQuery() throws Exception {
		LOG.info("XXXXXXXXX  IN makeQuery()  XXXXXXXXX");
		this.sessionFail = false;
		this.alarmEnabled = false;
		
		buffGraphHeaderXml = new StringBuffer("");
		buffGraphFooterXml = new StringBuffer("");
		buffGraphCategoriesXml = new StringBuffer("");
		buffGraphDataSetXml = new StringBuffer("");
		buffGraphTrendlinesXml = new StringBuffer("");
		buffStateXml = new StringBuffer("");
		buffStatsXml  = new StringBuffer("");
		buffDataTablePageXml = new StringBuffer("");
		buffDataTableIndexXml = new StringBuffer("");
		buffDataChartLegendXml = new StringBuffer("");
	
		try {
			Mesh mesh= (Mesh) this.session.getAttribute(IURLConstants.MESH_BEAN);
			if (mesh == null || mesh.id == null) {
				this.sessionFail = true;
				return;
			}
			else {
				this.tzo = mesh.getTzo();

				if (this.firstTs == null) { // if not firstTs specified, use 90days from now
					this.firstTs = CDateUtil.get90DayDST();
				}
				
				this.initSensorData(this.firstTs, this.lastTs);
				if (!sendOneTablePageOnly) {
					this.decimateData();
					this.makeGraphXML();
					this.makeStateXML();
					this.makeStatisticsXML();
					this.makeLegendXML();
					this.makeDataTableIndex();
				}
				this.makeDataTablePage();
			}//else (mesh is not null)
		} catch (Exception e){
			logExceptionMessage(e,"makeQuery()");
			LOG.info("XXXXXXXXX  Exception occured!! XXXXXXXXX");
			throw e; // this will let AJAX request know that load failed
	    }
		LOG.info("XXXXXXXXX  OUT makeQuery()  XXXXXXXXX");
	}
	
	protected void initSensorData(Timestamp first, Timestamp last) throws Exception {
		LOG.info("XXXXXXXXX  IN initSensorData()");
		
		CMeasurement m = new CMeasurement(this.id);
		m.setMinMaxAuto(Boolean.valueOf(this.autoScale));
		m.setValueMax(Float.valueOf(this.maxYscale));
		m.setValueMin(Float.valueOf(this.minYscale));
		m.setUnit(this.unit);
		// Always initialize the measurement, alarm information
		ISsiManagerLocal sm = initSsiEjbLocal();
		DetailReadings dr = sm.GetSensorDataInit(m,  this.wsmId, first, last);
		
		this.lastDataTs = dr.getLastDataGwTs();
		setNextPrev(first, last);
		this.setAlarmInfo(dr.getAlarmDefinition());
		setBean(dr.getMeasurement());

		//TODO: set significant digits and decimalValue values from 
		//      the database/EJBs in the near future
		sensorType = dr.getMeasurement().getMeasurementType().getTypeId();
		setSigDigitsForSensor();

		
		// Start mapping data to XML
		this.pointCount = dr.getTotal().intValue();	
		if (this.dataSample == null) {
			this.dataSample = new Vector(this.pointCount);	// init vector
		}
		else {
			if (this.dataSample.capacity() < this.pointCount) {
				this.dataSample.ensureCapacity(pointCount); // resize vector
			}
		}
		
		long total = this.pointCount;
		List sdList = dr.getSensorDataList();
		while  (sdList !=null && sdList.size() > 0 ) {
			LOG.info(" total="+this.pointCount+" list size="+sdList.size()+" remain="+total);
			Timestamp nextTs = setDataSampleList(sdList);
			if (total > sdList.size()) {
				total -= sdList.size();
				sdList = sm.GetSensorData(id, wsmId, first, nextTs);
			}
			else 
				sdList=null;
		} //while
		
		LOG.info("XXXXXXXXX  END initSensorData()");
	}
	
	protected void setAlarmInfo(CAlarmDefinition aDef){
		if (aDef==null) return;
		this.alarmEnabled = aDef.getEnabled().booleanValue();
		this.alarmLine1 = aDef.getOperand1();
		this.alarmLine2 = aDef.getOperand2();
		this.alarmOperator1 = aDef.getOperator1();
		this.alarmOperator2 = aDef.getOperator2();
	}

	
	private Timestamp setDataSampleList(List sdList)
	{	
		LOG.info("IN setDataSampleList()");
		SensorData pSd = null;
		if ((sdList != null) && (sdList.size()>0)) {	
			pSd = (SensorData)sdList.get(0);
			Iterator iter = sdList.iterator();
			while(iter.hasNext()){
				pSd=(SensorData)iter.next();
				this.dataSample.add(new SensorData(Float.valueOf(CMathUtil.CalcMeasurement(pSd.getValue().floatValue(),coeff1.floatValue(),coeff2.floatValue(),coeff3.floatValue(), coeff4.floatValue()).floatValue()), pSd.getTs()));
			}
			LOG.info("Sample List Size=" + this.dataSample.size());
		}
		return (pSd.getTs());
	}
	
	private void setNextPrev(Timestamp first, Timestamp last) 
	{
		if ((first.before(this.firstDataTs)) || 
			(first.equals(this.firstDataTs))) {
			this.prevData = false;
		}
		else {
			this.prevData = true;
		}
		
		if (last.after(this.lastDataTs) ||
			last.equals(this.lastDataTs)) {
			this.nextData = false;
		}
		else {
			this.nextData = true;
		}
	}
	
	private void decimateData() throws Exception {
		LOG.info("XXXXXXXXX  IN decimateData()");
		if ((this.pointCount == 0) || (this.pointCount < DEFAULT_CHART_WIDTH)){
			LOG.info("	no decimination needed");
			this.dataDecimated = false;
			return;
		}
		
		Object points[] = this.dataSample.toArray();
		this.pointCount = points.length;
		
		if (this.pointCount > DEFAULT_CHART_WIDTH) {
		try {
			LOG.info("	Performing data decimination of "+points.length+" points...");
			double windowSize = Math.floor((this.pointCount*2)/DEFAULT_CHART_WIDTH);
			double windowCount = Math.floor(this.pointCount/windowSize);
			double remainderPoints = this.pointCount - (windowCount*windowSize);
			
			int pointIndex = 0;
			
			for (int window=0; window<windowCount; window++) {
				//	add remainder points to last window
				if (window==windowCount-1) windowSize += remainderPoints; 
				
				// find min & max for window
				double max = Double.NEGATIVE_INFINITY;
		        double min = Double.POSITIVE_INFINITY;
		        int minIndex = -1;
		        int maxIndex = -1;
		        SensorData sd1, sd2; float value;
		        
				for (int point=0; point<windowSize; point++) {
					sd1 = (SensorData)points[pointIndex]; // next point
					if (sd1 == null) {
						Exception e = new Exception("ERROR: Unexpected end of dataset");
						throw (e);
					}
					value = sd1.getValue().floatValue();
					if (value > max) {maxIndex = pointIndex; max = value;}
					if (value < min) {minIndex = pointIndex; min = value;}
					pointIndex++;
				}
				
				if ((minIndex == -1) || (maxIndex == -1)) {
					Exception e = new Exception("ERROR: No Max/Mix Found");
					throw (e);
				}
				
				// add min and max to modified vector
				sd1 = (SensorData)points[minIndex];
				sd2 = (SensorData)points[maxIndex];
				
				if (sd1.getTs().before(sd2.getTs())) {
					this.dataSampleModified.add(sd2);
					//LOG.info("Value="+((SensorData)this.dataSampleModified.lastElement()).getValue());
					this.dataSampleModified.add(sd1);
					//LOG.info("Value="+((SensorData)this.dataSampleModified.lastElement()).getValue());
				}
				else {
					this.dataSampleModified.add(sd1);
					//LOG.info("Value="+((SensorData)this.dataSampleModified.lastElement()).getValue());
					this.dataSampleModified.add(sd2);
					//LOG.info("Value="+((SensorData)this.dataSampleModified.lastElement()).getValue());
				}
				
				if (((SensorData)this.dataSampleModified.lastElement()).getValue() == null) {
					Exception e = new Exception("ERROR: null sensor data value detected!");
					throw (e);
				}
				
			}
			
			this.dataDecimated = true;
			LOG.info("	 done.");
			
		} catch (Exception e){
	    	logExceptionMessage(e,"decimateData(id)");
		    throw (e);
	    }	
		}
	}
	
	protected String getExceptionMessage (Exception e) {
		return "Error in MeasurementSample business object";
	}
	
	protected void makeStateXML() {
		buffStateXml.append("<state_info>");
		buffStateXml.append("<hasPrev>");
		buffStateXml.append((this.prevData)?"true":"false");
		buffStateXml.append("</hasPrev>");
		buffStateXml.append("<hasNext>");
		buffStateXml.append((this.nextData)?"true":"false");
		buffStateXml.append("</hasNext>");
		buffStateXml.append("<lastAvailTs>");
		buffStateXml.append(this.lastDataTs.getTime());
		buffStateXml.append("</lastAvailTs>");
		buffStateXml.append("<yScaleUnits>"+this.unit+"</yScaleUnits>");
		buffStateXml.append("<autoScale>"+autoScale+"</autoScale>");
		Float min = Float.valueOf(CTextUtil.convSigDigits(minYscale, this.sigDigits, this.decimalValue, RoundingMode.DOWN));
		buffStateXml.append("<manualMin>"+min.floatValue()+"</manualMin>");
		Float max = Float.valueOf(CTextUtil.convSigDigits(maxYscale, this.sigDigits, this.decimalValue, RoundingMode.UP));
		buffStateXml.append("<manualMax>"+max.floatValue()+"</manualMax>");
		buffStateXml.append("</state_info>");
	}
	
	protected void makeStatisticsXML() {
		Vector dataList = (Vector)this.dataSample; //non-decimated data
		
		
		buffStatsXml.append("<sensor_stats>");
		if (dataList.size() > 0) {
			buffStatsXml.append("<min>"+Double.valueOf((String)CTextUtil.convSigDigits(dataMin, this.sigDigits, this.decimalValue, RoundingMode.FLOOR))+"</min>");
			buffStatsXml.append("<max>"+Double.valueOf((String)CTextUtil.convSigDigits(dataMax, this.sigDigits, this.decimalValue, RoundingMode.FLOOR))+"</max>");
			buffStatsXml.append("<ave>"+Double.valueOf((String)CTextUtil.convSigDigits(dataAverage, this.sigDigits, this.decimalValue, RoundingMode.FLOOR))+"</ave>");
			Float median = medianData(dataList);
			buffStatsXml.append("<median>"+Double.valueOf((String)CTextUtil.convSigDigits((double)(median.floatValue()), this.sigDigits, this.decimalValue, RoundingMode.FLOOR))+"</median>");
			double dataArray[] = new double[dataList.size()];
			for (int i=0; i<dataList.size(); i++) {
				dataArray[i] = ((SensorData)dataList.elementAt(i)).getValue().doubleValue();
			}
			double stdDev = CMathUtil.sdKnuth(dataArray);
			buffStatsXml.append("<stdDev>"+Double.valueOf((String)CTextUtil.convSigDigits(stdDev, this.sigDigits, this.decimalValue, RoundingMode.FLOOR))+"</stdDev>");
		}
		else {
			buffStatsXml.append("<min>N/A</min>");
			buffStatsXml.append("<max>N/A</max>");
			buffStatsXml.append("<ave>N/A</ave>");
			buffStatsXml.append("<median>N/A</median>");
			buffStatsXml.append("<stdDev>N/A</stdDev>");
		}
		
		buffStatsXml.append("</sensor_stats>");
	}
	
	protected void makeLegendXML() {
		buffDataChartLegendXml.append("<legendData>");
		if (this.alarmEnabled) {
			if (this.alarmLine1 != null) {
			buffDataChartLegendXml.append("<alarm1Label>");	 
			buffDataChartLegendXml.append(CTextUtil.GetOperatorAsXmlVal(this.alarmOperator1)+this.alarmLine1);
			buffDataChartLegendXml.append("</alarm1Label>");
			}
		
			if (this.alarmLine2 != null) {
			buffDataChartLegendXml.append("<alarm2Label>");
			buffDataChartLegendXml.append(CTextUtil.GetOperatorAsXmlVal(this.alarmOperator2)+this.alarmLine2);
			buffDataChartLegendXml.append("</alarm2Label>");
			}
		}
			
		buffDataChartLegendXml.append("<decimated>");
		buffDataChartLegendXml.append((this.dataDecimated)?"true":"false");
		buffDataChartLegendXml.append("</decimated>");
		
		buffDataChartLegendXml.append("</legendData>");
	}
	
	private List getDataSampleList() {
		return ((this.dataDecimated) ? this.dataSampleModified : this.dataSample);
	}
	
	private void makeDataTableIndex() throws Exception {
		LOG.info("XXXXXXXXX IN makeDataTableIndex()");

		Vector dataList = (Vector)this.dataSample; //non-decimated data
		if ((dataList == null) || (dataList.isEmpty())) {
			return;
		}
		//int numberOfPages = (int)Math.ceil(dataList.size()/this.dataTablePointsPerPage);
		int pointsPerPage = this.dataTablePointsPerPage;
		Object dataArr[] = dataList.toArray();
        
		buffDataTableIndexXml.append("<pageStartData>");
		
		SensorData sd1, sd2;
	    String strDate;
	    Timestamp clientStartTs, clientEndTs;
		for (int i=0; i<dataArr.length; i=i+pointsPerPage) {
			sd1 = (SensorData)dataArr[i];
			int lastIndex = i+pointsPerPage-1;
			if (lastIndex > dataArr.length-1) lastIndex = dataArr.length-1;
			sd2 = (SensorData)dataArr[lastIndex];
			clientStartTs = CDateUtil.CalcLocalTime(sd2.getTs(),this.tzo);
			clientEndTs = CDateUtil.CalcLocalTime(sd1.getTs(),this.tzo);
			strDate = CTextUtil.DateFormat(clientStartTs,"MM/dd/yy hh:mma");
			strDate += CTextUtil.DateFormat(clientEndTs," - MM/dd/yy hh:mma");
			buffDataTableIndexXml.append(" <page str='" + strDate + "' startTs='"+ sd2.getTs().getTime() + "' endTs='"+ sd1.getTs().getTime() +"'/>");
		}
		
		buffDataTableIndexXml.append("</pageStartData>");
		
		LOG.info("XXXXXXXXX OUT makeDataTableIndex() ");
	}
	
	private void makeDataTablePage() throws Exception {
		LOG.info("XXXXXXXXX IN makeDataTablePage()");

		Vector dataList = (Vector)this.dataSample; //non-decimated data
		if ((dataList == null) || (dataList.isEmpty())) {
			return;
		}
	
		int startIndex = 0;
		int endIndex = startIndex + (this.dataTablePointsPerPage-1);
		if (endIndex >= dataList.size()) {
			endIndex = dataList.size() - 1;
		}
		String subtitle = new String(makeYaxisName().toString());
		
		Object dataArr[] = dataList.toArray();
        
		buffDataTablePageXml.append("<pageIndex>"+this.tablePageDataIndex.toString()+"</pageIndex>");
		buffDataTablePageXml.append("<completeData>");
		buffDataTablePageXml.append("<valuesubtitle>"+subtitle.toString()+"</valuesubtitle>");
		buffDataTablePageXml.append("<data>");
		
		SensorData sd1;
	    String strDate;
		for (int i=startIndex; i<=endIndex; i++) {
			sd1 = (SensorData)dataArr[i];
			strDate = CTextUtil.DateFormat(CDateUtil.CalcLocalTime(sd1.getTs(),this.tzo),"MM/dd/yy hh:mm:ss a");
			buffDataTablePageXml.append(" <set y='" + sd1.getValue() + "' ts='"+ strDate +"'/>");
		}
		
		buffDataTablePageXml.append("</data>");
		buffDataTablePageXml.append("</completeData>");
		LOG.info("XXXXXXXXX OUT makeDataTablePage()");
	}
	
	private void makeCategoryXML() throws Exception {
		LOG.info("XXXXXXXXX IN makeCategoryXML()");
		
	    Timestamp lastTime = this.lastTs;
		Timestamp firstTime = this.firstTs;
	   
	    // Calculate Date difference in millisec 
	    double ms1 = lastTime.getTime();
        double ms2 = firstTime.getTime();    
	    double diffMsec = Math.abs(ms2-ms1);
	    LOG.info("	data spans "+ diffMsec/3600000 +" hours");
	    
	    int totalVerticalLines = 10;
	    double msecPerCategory = diffMsec/totalVerticalLines;  // round up to nearest msec
	    LOG.info("	time between verical lines is "+ msecPerCategory/3600000 +" hours");
	    
	    buffGraphCategoriesXml.append("<categories verticalLineThickness='1' >");
	    String strDate = CTextUtil.DateFormat(CDateUtil.CalcLocalTime(lastTime,this.tzo),"MM/dd HH:mm:ss  ");
	    buffGraphCategoriesXml.append(" <category name='" + strDate + "' x='"+ lastTime.getTime() + "' showName='1' showVerticalLine='1' />");
	    long counter = 0;
	    Timestamp thisTime = lastTime;
	    for (int i=totalVerticalLines-1; i>=0; i--)  {
	    	thisTime = new Timestamp(thisTime.getTime()-(long)msecPerCategory);;			
			strDate = CTextUtil.DateFormat(CDateUtil.CalcLocalTime(thisTime,this.tzo),"MM/dd HH:mm:ss  ");
			buffGraphCategoriesXml.append(" <category name='" + strDate + "' x='"+ thisTime.getTime() + "' showName='1' showVerticalLine='1' />");
			counter++;			
		}
	    LOG.info("	created "+ counter +" categories");
	    strDate = CTextUtil.DateFormat(CDateUtil.CalcLocalTime(firstTime,this.tzo),"MM/dd HH:mm:ss  ");
	    buffGraphCategoriesXml.append(" <category name='" + strDate + "' x='"+ firstTime.getTime() + "' showName='1' showVerticalLine='1' />");
	    buffGraphCategoriesXml.append("</categories>");
	}
	
	private StringBuffer makeYaxisName(){
		StringBuffer yAxisName = new StringBuffer();
		
		if (this.unit.indexOf('%',0) < 0 )
			yAxisName.append(CTextUtil.GetStrAsXmlVal2(this.name + " -" + (this.unit) + "-"));
        else
        	yAxisName.append(CTextUtil.GetStrAsXmlVal2(this.name + " -percent-"));
		
		return (yAxisName);
	}
	
	protected void makeGraphXML() throws Exception {
		List dataList = getDataSampleList();
		int counter=0;
		if (dataList != null) {
			int i;
			
			LOG.info("XXXXXXXXX creating graph XML datapoints="+dataList.size());
			
			this.getMinMaxData();
			if (autoScale){
				this.autoScale();
				minYscale = chartMin;
				maxYscale = chartMax;
			}
			else {
				chartMin = minYscale; 
				chartMax = maxYscale;
			}
			int yAxisPrecision = this.findDecimalPrecision();
			int numDivLines = this.calcDivLines();
			
			Object graphArr[] = dataList.toArray();
            int arrLength = graphArr.length;
            
            /* Graph Header */
            buffGraphHeaderXml.append(GuiWidgetsChart.graph_head1);
           	buffGraphHeaderXml.append(makeYaxisName().toString());  
            buffGraphHeaderXml.append("' zeroPlaneColor='000000' zeroPlaneThickness='0' zeroPlaneAlpha='0' numdivlines='"+ numDivLines + GuiWidgetsChart.graph_head2);
            buffGraphHeaderXml.append(" yAxisMinValue='" + CTextUtil.convSigDigits(chartMin, this.sigDigits, this.decimalValue, RoundingMode.DOWN)+ "'");
            buffGraphHeaderXml.append(" yAxisMaxValue='" + CTextUtil.convSigDigits(chartMax, this.sigDigits, this.decimalValue, RoundingMode.UP)+ "'");
            buffGraphHeaderXml.append(" xAxisMinValue='"+this.firstTs.getTime()+"' xAxisMaxValue='"+this.lastTs.getTime()+"' ");
            buffGraphHeaderXml.append(" divLineDecimalPrecision='"+yAxisPrecision+"' ");
            buffGraphHeaderXml.append(" decimalPrecision='"+yAxisPrecision+"' ");
            buffGraphHeaderXml.append(GuiWidgetsChart.graph_head4);
            
            /* categories -- veritical divisions */
            try {
				makeCategoryXML();
			} catch (Exception e) {
				e.printStackTrace();
				throw (e);
			}
		    
		    /* dataset */
			if (dataList.size() >0) {
				StringBuffer temp = 
					new StringBuffer("<dataSet anchorRadius='1' anchorBgColor='FF9966' anchorBorderColor='00FF33' >");		    
			    SensorData sd1;
			    String strDate;
				for (i = arrLength-1; i>=0; i--)  {
					sd1 = (SensorData)graphArr[i];
					Float yValue = sd1.getValue();
					if ((yValue.doubleValue() >= chartMin) && (yValue.doubleValue() <= chartMax)) {
						strDate = CTextUtil.DateFormat(CDateUtil.CalcLocalTime(sd1.getTs(),this.tzo),"MM/dd/yy hh:mm:ss a");
						temp.append(" <set y='" + sd1.getValue() + "' x='"+ sd1.getTs().getTime()+ "' ts='"+ strDate +"'/>");
						counter++;
					}
				}
			    temp.append("</dataSet>");
				if (counter>0) {
					buffGraphDataSetXml.append(temp);
					LOG.info("XXXXXXXXX created "+ counter +" set points");
				}
			}
			
			/* 
			 * empty set -- this puts two black points on the graph boarder just 
			 * so we always have a graph displayed.
			 */
			if ((dataList.size() <= 0) ||
		    	(counter == 0)) {
				buffGraphDataSetXml.append("<dataSet anchorRadius='1' anchorBgColor='000000' anchorBorderColor='000000' >");
		    	buffGraphDataSetXml.append(" <set y='"+chartMin+"' x='"+this.firstTs.getTime()+"' ts=''/>");
		    	buffGraphDataSetXml.append(" <set y='"+chartMax+"' x='"+this.lastTs.getTime()+"' ts=''/>");
		    	buffGraphDataSetXml.append("</dataSet>");
		    	LOG.info("XXXXXXXXX created empty data set");
		    }
			
			/* trendlines */
			if ((this.alarmEnabled) &&  
				(dataList.size()>0)) {
				if ((this.alarmLine1!=null) &&
					(this.alarmLine1.doubleValue() >= chartMin) &&
					(this.alarmLine1.doubleValue() <= chartMax)) {
					buffGraphTrendlinesXml.append("<hTrendLines>");
					buffGraphTrendlinesXml.append(" <line showOnTop='0' color='FF0000' thickness='1' alpha='100' displayValue=' ' startValue='" + this.alarmLine1 + "' />");
				
					if ((this.alarmLine2!=null) &&
						(this.alarmLine2.doubleValue() >= chartMin) &&
						(this.alarmLine2.doubleValue() <= chartMax)) {
						buffGraphTrendlinesXml.append(" <line showOnTop='0' color='FF0000' thickness='1' alpha='100' displayValue=' ' startValue='" + this.alarmLine2 + "' />");
					}
				buffGraphTrendlinesXml.append("</hTrendLines>");
				}
			}
			
			//footer
			buffGraphFooterXml.append(GuiWidgetsChart.graph_end);
			
		} //if
		else {
			buffGraphHeaderXml.append(GuiWidgetsChart.graph_head1);
			buffGraphHeaderXml.append(this.name + " -" + this.unit + "-" + GuiWidgetsChart.graph_head2);
			buffGraphHeaderXml.append(" yAxisMinValue='0'");
            buffGraphHeaderXml.append(" yAxisMaxValue='0'");
			buffGraphHeaderXml.append(GuiWidgetsChart.graph_head4);
			buffGraphFooterXml.append(GuiWidgetsChart.graph_end);
		}
		LOG.debug("XXXXXXXXX  IN MeasurementSample.getGraphXML");
	}
	
	private void autoScale() {
		
		// Determine data min and max (if not already set)
		if ((chartMin == Double.NaN) || (chartMax == Double.NaN)) {
			getMinMaxData();
		}
		
		// factor in alarm values into min and max values
		if (this.alarmEnabled) { 
			for (int i=0; i<2; i++)  {
				Float alarmVal = ((i==0)
									? this.alarmLine1 
									: this.alarmLine2);
				if (alarmVal != null) {
					float fvalue = alarmVal.floatValue();
	
					if (fvalue > chartMax) {
						chartMax = fvalue;
					}
					if (fvalue < chartMin) {
						chartMin = fvalue;
					}
				}
			}
		}
			
		// Buffer chart min and max 
		double chartDiff = chartMax - chartMin;
		if (chartDiff > 1.0) {
			// Calculate data scater. The larger the scatter, the 
			// larger the buffer we will apply.
			double scatter = calcMaxScatter();

			chartMax += (chartDiff/0.9)*0.05; // add 5% buffer to max
			chartMax += scatter;      // add buffer based on scatter
			chartMin -= (chartDiff/0.9)*0.05; // add 5% buffer to min
			chartMin -= scatter;      // add buffer based on scatter
		}
		else {
			double buffer = 0;
		
			if (chartMax > 10000) {
				buffer = 1000;
			} 
			else if (chartMax > 1000) {
				buffer = 100;
			}
			else if (chartMax > 100) {
				buffer = 10;
			}
			else {
				buffer = 1;
			}
			
			chartMax += buffer;
			chartMin -= buffer;
		}
		
		roundChartMinMax(chartRoundingValue);
	}
	
	private void roundChartMinMax(int roundTo) {
		String tmpStr;
		switch(roundTo) {
			case CHART_ROUNDING_USE_SIGDIGITS: {
				tmpStr = (String)CTextUtil.convSigDigits(chartMin, this.sigDigits, this.decimalValue, RoundingMode.DOWN);
				chartMin = Float.valueOf(tmpStr).floatValue();
				tmpStr = (String)CTextUtil.convSigDigits(chartMax, this.sigDigits, this.decimalValue, RoundingMode.UP);
				chartMax = Float.valueOf(tmpStr).floatValue();
				break;
			}
			case CHART_ROUNDING_USE_SIGDIGITS_DIV_2: {
				tmpStr = (String)CTextUtil.convSigDigits(chartMin, (this.sigDigits/2), this.decimalValue, RoundingMode.DOWN);
				chartMin = Float.valueOf(tmpStr).floatValue();
				tmpStr = (String)CTextUtil.convSigDigits(chartMax, (this.sigDigits/2), this.decimalValue, RoundingMode.UP);
				chartMax = Float.valueOf(tmpStr).floatValue();
				break;
			}
			default: {
				chartMin = CMathUtil.mround(chartMin, chartRoundingValue, false);
				chartMax = CMathUtil.mround(chartMax, chartRoundingValue, true);
			}
		}
	}
	
	private void getTrendLine(Point2D.Double startPt, 
			                  Point2D.Double endPt, 
			                  double [] fitParams) {
		List dataList = getDataSampleList();
		
		// Create x & y arrays and fill with data
		Object graphArr[] = dataList.toArray();
        int arrLength = graphArr.length; 
        if (arrLength > 0) {
	        SensorData sd1;
	        double [] yTrk = new double[arrLength];
	        double [] xTrk = new double[arrLength];
		    for (int i=0; i<arrLength; i++)  {
				sd1 = (SensorData)graphArr[arrLength-1-i];
				yTrk[i] = sd1.getValue().floatValue();
				xTrk[i] = sd1.getTs().getTime();
			}
			
		    // Fit points to a straight line
			FitLine.fit(fitParams, xTrk, yTrk, null, null, arrLength);
			double b = fitParams[0]; 
			double m = fitParams[1]; 
			
			// Calculate endpoints
			sd1 = (SensorData)(graphArr[arrLength-1]);
			startPt.x = sd1.getTs().getTime();
			startPt.y = m*(startPt.x)+b;
			endPt.x = xTrk[arrLength-1];
			endPt.y = m*xTrk[arrLength-1]+b;
        }
		
		return;
	}
	
	private double calcMaxScatter() {
		List dataList = getDataSampleList();
		
		// calculate data trendline using least squares average
		Point2D.Double startPt = new Point2D.Double(0,0);
		Point2D.Double endPt = new Point2D.Double(0,0);
		double [] fitParams = new double[4];	
		getTrendLine(startPt, endPt, fitParams);		
		double m = fitParams[1]; //slope
		double b = fitParams[0]; //intercept
		
		// Find the maximum differences between real Y axis 
		// data point and the trend line Y axis point.  
		double diffMax = Double.MIN_VALUE;
		Object graphArr[] = dataList.toArray();
		int arrLength = graphArr.length;            
		SensorData sd1;
		double y, x, yTrend, diff;	
		for (int i=0; i<arrLength; i++)  {
			sd1 = (SensorData)graphArr[arrLength-1-i];
			
			y = sd1.getValue().floatValue(); // real data			
			x = sd1.getTs().getTime();			
			yTrend = m*x+b;	// point on trend line
			diff = Math.abs(yTrend-y);
			
			if (diff > diffMax) {
				diffMax = diff; 
			}
		}
		
	return diffMax;
	}
	
	private int calcDivLines() {
		int divLines = DEFAULT_DIVLINE_COUNT;
		List dataList = getDataSampleList();
		
		if (dataList.size() > 0) {
			double chartDiff = chartMax - chartMin;
			
			if (sensorType.equals(IApplicationConstants.MEASUREMENT_TYPE_DIGITAL_INPUT)) {
				return 1;
			}
			
			if (chartDiff <= 2) {
				// scale too tight only show three div lines
				return 3;
			}
			
			// Check for zero line closer that 20px to a divline
			double divDelta = chartDiff/(DEFAULT_DIVLINE_COUNT+1);
			double pxPerUnit = DEFAULT_CHART_HEIGHT/chartDiff;
			double div0Margin = Double.POSITIVE_INFINITY;
			
			for (int i=0; i< DEFAULT_DIVLINE_COUNT; i++) {
				double currentDiv = chartMax-divDelta*i;
				if (currentDiv < 0) {
					currentDiv *= -1; // take ABS
				}
				if (currentDiv < div0Margin) {
					div0Margin = currentDiv;
				}
			}
			
			double marginPixels = pxPerUnit * div0Margin;		
			if (marginPixels < 20.0) {
				divLines = DEFAULT_DIVLINE_COUNT + 1;
			}
		    
		}
		return divLines;
	}
	
	private int findDecimalPrecision() {		
		
		if (!this.decimalValue) {
			return(0); 
		}
		
		int sdMax = calcDecimalPrecision(chartMax, this.sigDigits);
		int sdMin = calcDecimalPrecision(chartMin, this.sigDigits);
		return Math.max(sdMax, sdMin);
	}
	
	private void setSigDigitsForSensor() {
		decimalValue = true;
		if (this.sensorType.equals(IApplicationConstants.MEASUREMENT_TYPE_DIGITAL_INPUT)) {
			decimalValue = false;
			this.sigDigits = 1;
			this.chartRoundingValue=CHART_ROUNDING_USE_SIGDIGITS_DIV_2; 
		}
		else if (this.sensorType.equals(IApplicationConstants.MEASUREMENT_TYPE_EVENT_COUNTER)) {
			if ((coeff1.floatValue() == 0) &&
				(coeff2.floatValue() == 1.0) &&
				(coeff3.floatValue() == 0) &&
				(coeff4.floatValue() == 0)) {
				decimalValue = false; //integer value
				this.chartRoundingValue=10; //events
			} 
			else {
				this.chartRoundingValue=CHART_ROUNDING_USE_SIGDIGITS_DIV_2;
			}
			this.sigDigits = 10;
		}
		else if (this.sensorType.equals(IApplicationConstants.MEASUREMENT_TYPE_TEMPERATURE)) {
			this.sigDigits = 4;
			this.chartRoundingValue=5; //degrees
		}
		else if (this.sensorType.equals(IApplicationConstants.MEASUREMENT_TYPE_AMBIENT_TEMPERATURE)) {
			this.sigDigits = 4;
			this.chartRoundingValue=5; //degrees 
		}
		if (this.sensorType.equals(IApplicationConstants.MEASUREMENT_TYPE_HUMIDITY)) {
			this.sigDigits = 4;
			this.chartRoundingValue=5; //percent 
		}
	}
	
	public static int calcDecimalPrecision(double val, int sigDigits) {
		long intVal = (long) val;
		String strIntVal = Long.valueOf(intVal).toString();
		double decVal = val - intVal;
		int intValLen = (short) strIntVal.length();
		
		//CASE 0: val >= 1
		if (Math.abs(intVal) > 0) {
			int diff = sigDigits - intValLen;
			return diff;
		}
		
		//CASE 1: 1 > val > 0
		int leadingZeros = 0;
		if (decVal != 0) {
			//count leading zeros
			while (decVal < 0.1) {
				leadingZeros++;
				decVal *= 10;
			}
		}
		return (sigDigits+leadingZeros);
	}

	private void getMinMaxData() {
		List dataList = getDataSampleList();
		if (dataList.size() > 0) {
			Object graphArr[] = dataList.toArray();
	        int arrLength = graphArr.length;            
	        SensorData sd1;
	        
	        dataMax = Float.NEGATIVE_INFINITY;
	        dataMin = Float.POSITIVE_INFINITY;
	        
	        float y, sum = 0;
		    for (int i=0; i<arrLength; i++)  {
				sd1 = (SensorData)graphArr[i];
				
				y = sd1.getValue().floatValue();
				sum += y; 
					
				if (y > dataMax) {
					dataMax = y;
				}
				if (y < dataMin) {
					dataMin = y;
				}
			}
		    
		    if (sum != 0) { 
		    	dataAverage = (sum/arrLength); 
		    }
		    
		    chartMin = dataMin;
		    chartMax = dataMax;
		    //if (chartMin == 0) chartMin = -chartMax;
		    //if (chartMax == 0) chartMax = -chartMin;
		}
		return;
	}
		
	protected void setBean(CMeasurement m) {
		super.setBean(m);
		this.autoScale = m.getMinMaxAuto().booleanValue();
		this.maxYscale = m.getValueMax().floatValue();
		this.minYscale = m.getValueMin().floatValue();
	}

	public static Float medianData ( List sdList ){
		int len = (sdList == null) ? 0 : sdList.size();
		if (len == 0)
			return null;
	   Vector sortList = new Vector(sdList);
	   java.util.Collections.sort(sortList);
	
	   len = (len>1)
	   			? (Math.round(len/2))
	   			: 1; 					// insure len is at least one
	 
	   return ((SensorData)sortList.get(len-1)).getValue();   
	}
	
}
