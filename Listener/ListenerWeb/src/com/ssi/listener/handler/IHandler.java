package com.ssi.listener.handler;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface IHandler {
 int process(ServletContext context, HttpServletRequest request, HttpServletResponse response);
}
