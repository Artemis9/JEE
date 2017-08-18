package com.ssi.web.bean;

public interface IDescribableObject {
	int MAX_FORM_DESCRIPTION_LENGTH =255;
	int MAX_FORM_NOTES_LENGTH=255;
	public int getMaxDescriptionLength() ;
	public int getMaxNotesLength();
}
