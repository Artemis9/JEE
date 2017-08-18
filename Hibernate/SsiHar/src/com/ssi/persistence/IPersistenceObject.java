package com.ssi.persistence;

import java.io.Serializable;

public interface IPersistenceObject extends Serializable {
	public Long getId();
	public void setId(Long id);
}
