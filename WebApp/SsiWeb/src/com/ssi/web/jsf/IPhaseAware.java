package com.ssi.web.jsf;

/**
 * Beans that wish to be notified of interesting transitions in the
 * JSF request life cycle should implement this interface.
 */
public interface IPhaseAware {
	/**
	 * Called after the component has finished the Process Validations
	 * phase. If validations are processed but the Update Model Values
	 * phase is never reached, then validations probably failed.
	 */
	public void endProcessValidators();

	/**
	 * Called after the component has finished the Update Model Values
	 * phase.
	 */
	public void endProcessUpdates();

	/**
	 * Called when the component is about to begin rendering.
	 */
	public void startRenderResponse();
}
