<jsp:useBean id="chartDataBean" scope="session" class="com.ssi.web.bean.GuiWidgetsChart" /><jsp:setProperty property="startDate" value="<%= request.getParameter("startDate") %>" name="chartDataBean" /><jsp:setProperty property="endDate" value="<%= request.getParameter("endDate") %>" name="chartDataBean" /><jsp:setProperty property="podId" value="<%= request.getParameter("podId") %>" name="chartDataBean" /><jsp:setProperty property="measurementBeanId" value="<%= request.getParameter("measurementBeanId") %>" name="chartDataBean" /><jsp:setProperty property="session" value="<%= session %>" name="chartDataBean" /><jsp:setProperty property="dataTablePointsPerPage" value="<%= request.getParameter("pointsPerPage") %>" name="chartDataBean" /><jsp:setProperty property="firstAvailTs" value="<%= request.getParameter("firstAvailTs") %>" name="chartDataBean" /><jsp:setProperty property="tablePageIndex" value="<%= request.getParameter("tablePageIndex") %>" name="chartDataBean" /><jsp:setProperty property="autoScaleFlag" param="autoScaleFlag" name="chartDataBean" /><jsp:setProperty property="chartMin" param="chartMin" name="chartDataBean" /><jsp:setProperty property="chartMax" param="chartMax" name="chartDataBean" /><jsp:setProperty property="unit" param="yScaleUnit" name="chartDataBean" /><jsp:getProperty property="xmlHeader" name="chartDataBean"/>
<jsp:getProperty property="chartHeader" name="chartDataBean"/><jsp:getProperty property="chartCategories" name="chartDataBean"/><jsp:getProperty property="chartDataset" name="chartDataBean"/><jsp:getProperty property="chartTrendlines" name="chartDataBean"/><jsp:getProperty property="chartFooter" name="chartDataBean"/>
<jsp:getProperty property="xmlStateInfo" name="chartDataBean"/>
<jsp:getProperty property="xmlStatistics" name="chartDataBean"/>
<jsp:getProperty property="xmlTableDataPage" name="chartDataBean"/>
<jsp:getProperty property="xmlTableDataIndex" name="chartDataBean"/>
<jsp:getProperty property="xmlChartLegend" name="chartDataBean"/>
<jsp:getProperty property="xmlFooter" name="chartDataBean"/>
<jsp:directive.page contentType="text/xml" />