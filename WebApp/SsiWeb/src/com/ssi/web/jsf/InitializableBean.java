package com.ssi.web.jsf;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public abstract class InitializableBean implements IPhaseAware {
	private static final Log logger = LogFactory.getLog(InitializableBean.class);

	private transient boolean notValidated;

	/**
	 * JSF doesn't provide a way to configure an initialization method which will
	 * be called after the contructor and all framework setters. By convention,
	 * our backing beans use this method. It's triggered either by a Faces configuration
	 * file setting "configured" to true, or by a JSF component directly calling "startRenderResponse".
	 *
	 * For greater subclassing flexibility, the init method is not declared to be
	 * abstract.
	 */
	protected void init() {
	}

	/**
	 * Remember if JSF entered the Validations phase. If so, and if we never
	 * reach the Update Model Values phase, then validation failed. That may
	 * be of interest to the backing bean. For example, the backing bean
	 * may choose not to requery and reload data on a validation error.
	 */
	public void endProcessValidators() {
		setNotValidated(true);
		if (logger.isDebugEnabled()) logger.debug("endProcessValidators");
	}

	public void endProcessUpdates() {
		setNotValidated(false);
		if (logger.isDebugEnabled()) logger.debug("endProcessUpdates");
	}

	/**
	 * Call init() at the beginning of every request rendering.
	 * (This should also work to refresh session-scoped beans, but it's
	 * only been tested with request scope.)
	 */
	public void startRenderResponse() {
		if (logger.isDebugEnabled()) logger.debug("startRenderResponse notValidated=" + isNotValidated());
		init();
	}

	public boolean isNotValidated() {
		return notValidated;
	}
	public void setNotValidated(boolean notValidated) {
		this.notValidated = notValidated;
	}

	/**
	 * Signals that configuration is finished.
	 */
	public void setConfigured(boolean isConfigured) {
		if (logger.isDebugEnabled()) logger.debug("setConfigured " + isConfigured);
		if (isConfigured) {
			init();
		}
	}

}

