package com.ssi.persistence;

/**
 * @author AAO
 *
 */
public class CMeasurementUnit implements IPersistenceObject {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -6310270552329179047L;
	private Long id;
	private String name;
	private String description;
	
	public CMeasurementUnit(){}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	//	 The following is used for associating two objects that maybe coming from different sessions
    // and/or need to be differentiated in a set.
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof CMeasurementUnit)) return false;
        final CMeasurementUnit mu = (CMeasurementUnit) other;
        return this.name.equals(mu.getName());
    }

    public int hashCode() {
        return this.name.hashCode();
    }
}
