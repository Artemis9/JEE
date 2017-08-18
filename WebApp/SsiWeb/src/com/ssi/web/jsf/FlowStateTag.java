package com.ssi.web.jsf;


import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.el.ValueBinding;
import javax.faces.webapp.UIComponentTag;

import org.apache.log4j.Logger;

public class FlowStateTag extends UIComponentTag {
	
	private static final Logger LOG = Logger.getLogger(FlowStateTag.class.getName());
	
	private String bean;

	public void setBean(String bean) {
		LOG.debug("setBean " + bean);
		this.bean = bean;
	}

	protected void setProperties(UIComponent component) {
		LOG.debug("setProperties " + bean);
		super.setProperties(component);

		FacesContext context = getFacesContext();

		if (bean != null) {
			if (UIComponentTag.isValueReference(bean)) {
				ValueBinding vb = context.getApplication().createValueBinding(bean);
				component.setValueBinding("bean", vb);
			} else {
				LOG.debug("Invalid expression " + bean);
			}
		}
	}

	public String getComponentType() {
		LOG.debug("getComponentType ");
		return "com.ssi.web.jsf.FlowState";
	}

	public String getRendererType() {
		LOG.debug("getRendererType ");
		return null;
	}
}
