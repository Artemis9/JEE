package com.ssi.web.jsf;


import java.io.IOException;

import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;
import javax.faces.el.ValueBinding;

import org.apache.log4j.Logger;


/**
 * This JSF UI component lets backing beans track the request life cycle and
 * save their state within the component tree itself. (These two aspects could
 * be separated with a "saveState" Boolean attribute if we ever need to let
 * a session-scoped bean track the request life cycle.)
 *
 * Like the MyFaces x:saveState tag, this passes the bean's state from request
 * to request without use of session scope. That in turn enables request-thread
 * functionality such as "what if?" scenarios and multiple active
 * application views from a single session.
 *
 * <p>
 * Usage:
 *
 * &lt;gbx:flowState bean="#{phaseAwareBean}" /&gt
 *
 * should be placed in the JSP file before any other bean references are made.
 *
 * <p>
 * The bean must implement the IPhaseAware interface and be serializable.
 * Any non-transient fields in the bean will be saved and restored from this component.
 */
public class FlowState extends UIComponentBase {
	private static final Logger LOG = Logger.getLogger(FlowState.class.getName());
	
	public static final String COMPONENT_TYPE = "com.ssi.web.jsf.FlowState";

	private IPhaseAware _bean;

	public FlowState() {
	}

	public void setBean(IPhaseAware bean) {
		LOG.debug("setBean " + bean);
		_bean = bean;
	}
	public IPhaseAware getBean() {
		LOG.debug("getBean " + _bean);
		if (_bean != null) return _bean;

		IPhaseAware returnObject = null;
		ValueBinding vb = getValueBinding("bean");
		if (vb != null) {
			returnObject = (IPhaseAware)vb.getValue(getFacesContext());
		}
		LOG.debug("  returning " + returnObject);
		return returnObject;
	}

	public Object saveState(FacesContext context) {
		LOG.debug("saveState " + _bean);
		Object values[] = new Object[2];
		values[0] = super.saveState(context);
		values[1] = getBean();
		return ((Object)values);
	}

	public void restoreState(FacesContext context, Object state) {
		LOG.debug("restoreState " + state);
		Object values[] = (Object[])state;
		super.restoreState(context, values[0]);
		_bean = (IPhaseAware)values[1];
		ValueBinding vb = getValueBinding("bean");
		if (vb != null) {
			vb.setValue(context, _bean);
		}
	}

	public void processRestoreState(FacesContext context, Object state) {
		LOG.debug("processRestoreState " + _bean);
		super.processRestoreState(context, state);
	}

	public void processDecodes(FacesContext context) {
		LOG.debug("processDecodes " + _bean);
		super.processDecodes(context);
	}

	public void processValidators(FacesContext context) {
		LOG.debug("processValidators " + _bean);
		super.processValidators(context);
		if (_bean != null) {
			_bean.endProcessValidators();
		}
	}

	public void processUpdates(FacesContext context) {
		LOG.debug("processUpdates " + _bean);
		super.processUpdates(context);
		if (_bean != null) {
			_bean.endProcessUpdates();
		}
	}

	public void encodeBegin(FacesContext context) throws IOException {
		IPhaseAware bean = getBean();
		LOG.debug("  getBean=" + bean);
		if (bean != null) {
			bean.startRenderResponse();
		}
		super.encodeBegin(context);
	}

	public String getFamily() {
		LOG.debug("getFamily " + _bean);
		return "javax.faces.Data";
	}

}
