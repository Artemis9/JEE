/*
	Copyright (c) 2004-2005, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/**
* @file bootstrap1.js
*
* bootstrap file that runs before hostenv_*.js file.
*
* @author Copyright 2004 Mark D. Anderson (mda@discerning.com)
* @author Licensed under the Academic Free License 2.1 http://www.opensource.org/licenses/afl-2.1.php
*
* $Id: bootstrap1.js 2836 2006-01-16 08:36:18Z alex $
*/

/**
 * The global djConfig can be set prior to loading the library, to override
 * certain settings.  It does not exist under dojo.* so that it can be set
 * before the dojo variable exists. Setting any of these variables *after* the
 * library has loaded does nothing at all. The variables that can be set are
 * as follows:
 */

/**
 * dj_global is an alias for the top-level global object in the host
 * environment (the "window" object in a browser).
 */
var dj_global = this; //typeof window == 'undefined' ? this : window;

function dj_undef(name, obj){
	if(!obj){ obj = dj_global; }
	return (typeof obj[name] == "undefined");
}

if(dj_undef("djConfig")){
	var djConfig = {};
}

/**
 * dojo is the root variable of (almost all) our public symbols.
 */
var dojo;
if(dj_undef("dojo")){ dojo = {}; }

dojo.version = {
	major: 0, minor: 2, patch: 2, flag: "",
	revision: Number("$Rev: 2836 $".match(/[0-9]+/)[0]),
	toString: function() {
		with (dojo.version) {
			return major + "." + minor + "." + patch + flag + " (" + revision + ")";
		}
	}
};

/*
 * evaluate a string like "A.B" without using eval.
 */
dojo.evalObjPath = function(objpath, create){
	// fast path for no periods
	if(typeof objpath != "string"){ return dj_global; }
	if(objpath.indexOf('.') == -1){
		if((dj_undef(objpath, dj_global))&&(create)){
			dj_global[objpath] = {};
		}
		return dj_global[objpath];
	}

	var syms = objpath.split(/\./);
	var obj = dj_global;
	for(var i=0;i<syms.length;++i){
		if(!create){
			obj = obj[syms[i]];
			if((typeof obj == 'undefined')||(!obj)){
				return obj;
			}
		}else{
			if(dj_undef(syms[i], obj)){
				obj[syms[i]] = {};
			}
			obj = obj[syms[i]];
		}
	}
	return obj;
};


// ****************************************************************
// global public utils
// ****************************************************************

/*
 * utility to print an Error. 
 * TODO: overriding Error.prototype.toString won't accomplish this?
 * ... since natively generated Error objects do not always reflect such things?
 */
dojo.errorToString = function(excep){
	return ((!dj_undef("message", excep)) ? excep.message : (dj_undef("description", excep) ? excep : excep.description ));
};

/**
* Throws an Error object given the string err. For now, will also do a println
* to the user first.
*/
dojo.raise = function(message, excep){
	if(excep){
		message = message + ": "+dojo.errorToString(excep);
	}
	var he = dojo.hostenv;
	if((!dj_undef("hostenv", dojo))&&(!dj_undef("println", dojo.hostenv))){ 
		dojo.hostenv.println("FATAL: " + message);
	}
	throw Error(message);
};

dj_throw = dj_rethrow = function(m, e){
	dojo.deprecated("dj_throw and dj_rethrow deprecated, use dojo.raise instead");
	dojo.raise(m, e);
};

/**
 * Produce a line of debug output. 
 * Does nothing unless djConfig.isDebug is true.
 * varargs, joined with ''.
 * Caller should not supply a trailing "\n".
 */
dojo.debug = function(){
	if (!djConfig.isDebug) { return; }
	var args = arguments;
	if(dj_undef("println", dojo.hostenv)){
		dojo.raise("dojo.debug not available (yet?)");
	}
	var isJUM = dj_global["jum"] && !dj_global["jum"].isBrowser;
	var s = [(isJUM ? "": "DEBUG: ")];
	for(var i=0;i<args.length;++i){
		if(!false && args[i] instanceof Error){
			var msg = "[" + args[i].name + ": " + dojo.errorToString(args[i]) +
				(args[i].fileName ? ", file: " + args[i].fileName : "") +
				(args[i].lineNumber ? ", line: " + args[i].lineNumber : "") + "]";
		} else {
			try {
				var msg = String(args[i]);
			} catch(e) {
				if(dojo.render.html.ie) {
					var msg = "[ActiveXObject]";
				} else {
					var msg = "[unknown]";
				}
			}
		}
		s.push(msg);
	}
	if(isJUM){ // this seems to be the only way to get JUM to "play nice"
		jum.debug(s.join(" "));
	}else{
		dojo.hostenv.println(s.join(" "));
	}
}

/**
 * this is really hacky for now - just 
 * display the properties of the object
**/

dojo.debugShallow = function(obj){
	if (!djConfig.isDebug) { return; }
	dojo.debug('------------------------------------------------------------');
	dojo.debug('Object: '+obj);
	for(i in obj){
		dojo.debug(i + ': ' + obj[i]);
	}
	dojo.debug('------------------------------------------------------------');
}

var dj_debug = dojo.debug;

/**
 * We put eval() in this separate function to keep down the size of the trapped
 * evaluation context.
 *
 * Note that:
 * - JSC eval() takes an optional second argument which can be 'unsafe'.
 * - Mozilla/SpiderMonkey eval() takes an optional second argument which is the
 *   scope object for new symbols.
*/
function dj_eval(s){ return dj_global.eval ? dj_global.eval(s) : eval(s); }


/**
 * Convenience for throwing an exception because some function is not
 * implemented.
 */
dj_unimplemented = dojo.unimplemented = function(funcname, extra){
	// FIXME: need to move this away from dj_*
	var mess = "'" + funcname + "' not implemented";
	if((!dj_undef(extra))&&(extra)){ mess += " " + extra; }
	dojo.raise(mess);
}

/**
 * Convenience for informing of deprecated behaviour.
 */
dj_deprecated = dojo.deprecated = function(behaviour, extra, removal){
	var mess = "DEPRECATED: " + behaviour;
	if(extra){ mess += " " + extra; }
	if(removal){ mess += " -- will be removed in version: " + removal; }
	dojo.debug(mess);
}

/**
 * Does inheritance
 */
dojo.inherits = function(subclass, superclass){
	if(typeof superclass != 'function'){ 
		dojo.raise("superclass: "+superclass+" borken");
	}
	subclass.prototype = new superclass();
	subclass.prototype.constructor = subclass;
	subclass.superclass = superclass.prototype;
	// DEPRICATED: super is a reserved word, use 'superclass'
	subclass['super'] = superclass.prototype;
}

dj_inherits = function(subclass, superclass){
	dojo.deprecated("dj_inherits deprecated, use dojo.inherits instead");
	dojo.inherits(subclass, superclass);
}

// an object that authors use determine what host we are running under
dojo.render = (function(){

	function vscaffold(prefs, names){
		var tmp = {
			capable: false,
			support: {
				builtin: false,
				plugin: false
			},
			prefixes: prefs
		};
		for(var x in names){
			tmp[x] = false;
		}
		return tmp;
	}

	return {
		name: "",
		ver: dojo.version,
		os: { win: false, linux: false, osx: false },
		html: vscaffold(["html"], ["ie", "opera", "khtml", "safari", "moz"]),
		svg: vscaffold(["svg"], ["corel", "adobe", "batik"]),
		vml: vscaffold(["vml"], ["ie"]),
		swf: vscaffold(["Swf", "Flash", "Mm"], ["mm"]),
		swt: vscaffold(["Swt"], ["ibm"])
	};
})();

// ****************************************************************
// dojo.hostenv methods that must be defined in hostenv_*.js
// ****************************************************************

/**
 * The interface definining the interaction with the EcmaScript host environment.
*/

/*
 * None of these methods should ever be called directly by library users.
 * Instead public methods such as loadModule should be called instead.
 */
dojo.hostenv = (function(){

	// default configuration options
	var config = {
		isDebug: false,
		allowQueryConfig: false,
		baseScriptUri: "",
		baseRelativePath: "",
		libraryScriptUri: "",
		iePreventClobber: false,
		ieClobberMinimal: true,
		preventBackButtonFix: true,
		searchIds: [],
		parseWidgets: true
	};

	if (typeof djConfig == "undefined") { djConfig = config; }
	else {
		for (var option in config) {
			if (typeof djConfig[option] == "undefined") {
				djConfig[option] = config[option];
			}
		}
	}

	var djc = djConfig;
	function _def(obj, name, def){
		return (dj_undef(name, obj) ? def : obj[name]);
	}

	return {
		name_: '(unset)',
		version_: '(unset)',
		pkgFileName: "__package__",

		// for recursion protection
		loading_modules_: {},
		loaded_modules_: {},
		addedToLoadingCount: [],
		removedFromLoadingCount: [],
		inFlightCount: 0,
		// FIXME: it should be possible to pull module prefixes in from djConfig
		modulePrefixes_: {
			dojo: {name: "dojo", value: "src"}
		},


		setModulePrefix: function(module, prefix){
			this.modulePrefixes_[module] = {name: module, value: prefix};
		},

		getModulePrefix: function(module){
			var mp = this.modulePrefixes_;
			if((mp[module])&&(mp[module]["name"])){
				return mp[module].value;
			}
			return module;
		},

		getTextStack: [],
		loadUriStack: [],
		loadedUris: [],
		// lookup cache for modules.
		// NOTE: this is partially redundant a private variable in the jsdown
		// implementation, but we don't want to couple the two.
		// modules_ : {},
		post_load_: false,
		modulesLoadedListeners: [],
		/**
		 * Return the name of the hostenv.
		 */
		getName: function(){ return this.name_; },

		/**
		* Return the version of the hostenv.
		*/
		getVersion: function(){ return this.version_; },

		/**
		 * Read the plain/text contents at the specified uri.  If getText() is
		 * not implemented, then it is necessary to override loadUri() with an
		 * implementation that doesn't rely on it.
		 */
		getText: function(uri){
			dojo.unimplemented('getText', "uri=" + uri);
		},

		/**
		 * return the uri of the script that defined this function
		 * private method that must be implemented by the hostenv.
		 */
		getLibraryScriptUri: function(){
			// FIXME: need to implement!!!
			dojo.unimplemented('getLibraryScriptUri','');
		}
	};
})();

/**
 * Display a line of text to the user.
 * The line argument should not contain a trailing "\n"; that is added by the
 * implementation.
 */
//dojo.hostenv.println = function(line) {}

// ****************************************************************
// dojo.hostenv methods not defined in hostenv_*.js
// ****************************************************************

/**
 * Return the base script uri that other scripts are found relative to.
 * It is either the empty string, or a non-empty string ending in '/'.
 */
dojo.hostenv.getBaseScriptUri = function(){
	if(djConfig.baseScriptUri.length){ 
		return djConfig.baseScriptUri;
	}
	var uri = new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
	if (!uri) { dojo.raise("Nothing returned by getLibraryScriptUri(): " + uri); }

	var lastslash = uri.lastIndexOf('/');
	djConfig.baseScriptUri = djConfig.baseRelativePath;
	return djConfig.baseScriptUri;
}

/**
* Set the base script uri.
*/
// In JScript .NET, see interface System._AppDomain implemented by
// System.AppDomain.CurrentDomain. Members include AppendPrivatePath,
// RelativeSearchPath, BaseDirectory.
dojo.hostenv.setBaseScriptUri = function(uri){ djConfig.baseScriptUri = uri }

/**
 * Loads and interprets the script located at relpath, which is relative to the
 * script root directory.  If the script is found but its interpretation causes
 * a runtime exception, that exception is not caught by us, so the caller will
 * see it.  We return a true value if and only if the script is found.
 *
 * For now, we do not have an implementation of a true search path.  We
 * consider only the single base script uri, as returned by getBaseScriptUri().
 *
 * @param relpath A relative path to a script (no leading '/', and typically
 * ending in '.js').
 * @param module A module whose existance to check for after loading a path.
 * Can be used to determine success or failure of the load.
 */
dojo.hostenv.loadPath = function(relpath, module /*optional*/, cb /*optional*/){
	if((relpath.charAt(0) == '/')||(relpath.match(/^\w+:/))){
		dojo.raise("relpath '" + relpath + "'; must be relative");
	}
	var uri = this.getBaseScriptUri() + relpath;
	if(djConfig.cacheBust && dojo.render.html.capable) { uri += "?" + String(djConfig.cacheBust).replace(/\W+/g,""); }
	try{
		return ((!module) ? this.loadUri(uri, cb) : this.loadUriAndCheck(uri, module, cb));
	}catch(e){
		dojo.debug(e);
		return false;
	}
}

/**
 * Reads the contents of the URI, and evaluates the contents.
 * Returns true if it succeeded. Returns false if the URI reading failed.
 * Throws if the evaluation throws.
 * The result of the eval is not available to the caller.
 */
dojo.hostenv.loadUri = function(uri, cb){
	if(this.loadedUris[uri]){
		return;
	}
	var contents = this.getText(uri, null, true);
	if(contents == null){ return 0; }
	this.loadedUris[uri] = true;
	var value = dj_eval(contents);
	return 1;
}

// FIXME: probably need to add logging to this method
dojo.hostenv.loadUriAndCheck = function(uri, module, cb){
	var ok = true;
	try{
		ok = this.loadUri(uri, cb);
	}catch(e){
		dojo.debug("failed loading ", uri, " with error: ", e);
	}
	return ((ok)&&(this.findModule(module, false))) ? true : false;
}

dojo.loaded = function(){ }

dojo.hostenv.loaded = function(){
	this.post_load_ = true;
	var mll = this.modulesLoadedListeners;
	for(var x=0; x<mll.length; x++){
		mll[x]();
	}
	dojo.loaded();
}

/*
Call styles:
	dojo.addOnLoad(functionPointer)
	dojo.addOnLoad(object, "functionName")
*/
dojo.addOnLoad = function(obj, fcnName) {
	if(arguments.length == 1) {
		dojo.hostenv.modulesLoadedListeners.push(obj);
	} else if(arguments.length > 1) {
		dojo.hostenv.modulesLoadedListeners.push(function() {
			obj[fcnName]();
		});
	}
};

dojo.hostenv.modulesLoaded = function(){
	if(this.post_load_){ return; }
	if((this.loadUriStack.length==0)&&(this.getTextStack.length==0)){
		if(this.inFlightCount > 0){ 
			dojo.debug("files still in flight!");
			return;
		}
		if(typeof setTimeout == "object"){
			setTimeout("dojo.hostenv.loaded();", 0);
		}else{
			dojo.hostenv.loaded();
		}
	}
}

dojo.hostenv.moduleLoaded = function(modulename){
	var modref = dojo.evalObjPath((modulename.split(".").slice(0, -1)).join('.'));
	this.loaded_modules_[(new String(modulename)).toLowerCase()] = modref;
}

/**
* loadModule("A.B") first checks to see if symbol A.B is defined. 
* If it is, it is simply returned (nothing to do).
*
* If it is not defined, it will look for "A/B.js" in the script root directory,
* followed by "A.js".
*
* It throws if it cannot find a file to load, or if the symbol A.B is not
* defined after loading.
*
* It returns the object A.B.
*
* This does nothing about importing symbols into the current package.
* It is presumed that the caller will take care of that. For example, to import
* all symbols:
*
*    with (dojo.hostenv.loadModule("A.B")) {
*       ...
*    }
*
* And to import just the leaf symbol:
*
*    var B = dojo.hostenv.loadModule("A.B");
*    ...
*
* dj_load is an alias for dojo.hostenv.loadModule
*/
dojo.hostenv._global_omit_module_check = false;
dojo.hostenv.loadModule = function(modulename, exact_only, omit_module_check){
	if(!modulename){ return; }
	omit_module_check = this._global_omit_module_check || omit_module_check;
	var module = this.findModule(modulename, false);
	if(module){
		return module;
	}

	// protect against infinite recursion from mutual dependencies
	if(dj_undef(modulename, this.loading_modules_)){
		this.addedToLoadingCount.push(modulename);
	}
	this.loading_modules_[modulename] = 1;

	// convert periods to slashes
	var relpath = modulename.replace(/\./g, '/') + '.js';

	var syms = modulename.split(".");
	var nsyms = modulename.split(".");
	for (var i = syms.length - 1; i > 0; i--) {
		var parentModule = syms.slice(0, i).join(".");
		var parentModulePath = this.getModulePrefix(parentModule);
		if (parentModulePath != parentModule) {
			syms.splice(0, i, parentModulePath);
			break;
		}
	}
	var last = syms[syms.length - 1];
	// figure out if we're looking for a full package, if so, we want to do
	// things slightly diffrently
	if(last=="*"){
		modulename = (nsyms.slice(0, -1)).join('.');

		while(syms.length){
			syms.pop();
			syms.push(this.pkgFileName);
			relpath = syms.join("/") + '.js';
			if(relpath.charAt(0)=="/"){
				relpath = relpath.slice(1);
			}
			ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
			if(ok){ break; }
			syms.pop();
		}
	}else{
		relpath = syms.join("/") + '.js';
		modulename = nsyms.join('.');
		var ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
		if((!ok)&&(!exact_only)){
			syms.pop();
			while(syms.length){
				relpath = syms.join('/') + '.js';
				ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
				if(ok){ break; }
				syms.pop();
				relpath = syms.join('/') + '/'+this.pkgFileName+'.js';
				if(relpath.charAt(0)=="/"){
					relpath = relpath.slice(1);
				}
				ok = this.loadPath(relpath, ((!omit_module_check) ? modulename : null));
				if(ok){ break; }
			}
		}

		if((!ok)&&(!omit_module_check)){
			dojo.raise("Could not load '" + modulename + "'; last tried '" + relpath + "'");
		}
	}

	// check that the symbol was defined
	if(!omit_module_check){
		// pass in false so we can give better error
		module = this.findModule(modulename, false);
		if(!module){
			dojo.raise("symbol '" + modulename + "' is not defined after loading '" + relpath + "'"); 
		}
	}

	return module;
}

/**
* startPackage("A.B") follows the path, and at each level creates a new empty
* object or uses what already exists. It returns the result.
*/
dojo.hostenv.startPackage = function(packname){
	var syms = packname.split(/\./);
	if(syms[syms.length-1]=="*"){
		syms.pop();
	}
	return dojo.evalObjPath(syms.join("."), true);
}

/**
 * findModule("A.B") returns the object A.B if it exists, otherwise null.
 * @param modulename A string like 'A.B'.
 * @param must_exist Optional, defualt false. throw instead of returning null
 * if the module does not currently exist.
 */
dojo.hostenv.findModule = function(modulename, must_exist) {
	// check cache
	/*
	if(!dj_undef(modulename, this.modules_)){
		return this.modules_[modulename];
	}
	*/

	var lmn = (new String(modulename)).toLowerCase();

	if(this.loaded_modules_[lmn]){
		return this.loaded_modules_[lmn];
	}

	// see if symbol is defined anyway
	var module = dojo.evalObjPath(modulename);
	if((modulename)&&(typeof module != 'undefined')&&(module)){
		this.loaded_modules_[lmn] = module;
		return module;
	}

	if(must_exist){
		dojo.raise("no loaded module named '" + modulename + "'");
	}
	return null;
}

/**
* @file hostenv_browser.js
*
* Implements the hostenv interface for a browser environment. 
*
* Perhaps it could be called a "dom" or "useragent" environment.
*
* @author Copyright 2004 Mark D. Anderson (mda@discerning.com)
* @author Licensed under the Academic Free License 2.1 http://www.opensource.org/licenses/afl-2.1.php
*/

// make jsc shut up (so we can use jsc to sanity check the code even if it will never run it).
/*@cc_on
@if (@_jscript_version >= 7)
var window; var XMLHttpRequest;
@end
@*/

if(typeof window == 'undefined'){
	dojo.raise("no window object");
}

// attempt to figure out the path to dojo if it isn't set in the config
(function() {
	// before we get any further with the config options, try to pick them out
	// of the URL. Most of this code is from NW
	if(djConfig.allowQueryConfig){
		var baseUrl = document.location.toString(); // FIXME: use location.query instead?
		var params = baseUrl.split("?", 2);
		if(params.length > 1){
			var paramStr = params[1];
			var pairs = paramStr.split("&");
			for(var x in pairs){
				var sp = pairs[x].split("=");
				// FIXME: is this eval dangerous?
				if((sp[0].length > 9)&&(sp[0].substr(0, 9) == "djConfig.")){
					var opt = sp[0].substr(9);
					try{
						djConfig[opt]=eval(sp[1]);
					}catch(e){
						djConfig[opt]=sp[1];
					}
				}
			}
		}
	}

	if(((djConfig["baseScriptUri"] == "")||(djConfig["baseRelativePath"] == "")) &&(document && document.getElementsByTagName)){
		var scripts = document.getElementsByTagName("script");
		var rePkg = /(__package__|dojo)\.js([\?\.]|$)/i;
		for(var i = 0; i < scripts.length; i++) {
			var src = scripts[i].getAttribute("src");
			if(!src) { continue; }
			var m = src.match(rePkg);
			if(m) {
				root = src.substring(0, m.index);
				if(!this["djConfig"]) { djConfig = {}; }
				if(djConfig["baseScriptUri"] == "") { djConfig["baseScriptUri"] = root; }
				if(djConfig["baseRelativePath"] == "") { djConfig["baseRelativePath"] = root; }
				break;
			}
		}
	}

	var dr = dojo.render;
	var drh = dojo.render.html;
	var dua = drh.UA = navigator.userAgent;
	var dav = drh.AV = navigator.appVersion;
	var t = true;
	var f = false;
	drh.capable = t;
	drh.support.builtin = t;

	dr.ver = parseFloat(drh.AV);
	dr.os.mac = dav.indexOf("Macintosh") >= 0;
	dr.os.win = dav.indexOf("Windows") >= 0;
	// could also be Solaris or something, but it's the same browser
	dr.os.linux = dav.indexOf("X11") >= 0;

	drh.opera = dua.indexOf("Opera") >= 0;
	drh.khtml = (dav.indexOf("Konqueror") >= 0)||(dav.indexOf("Safari") >= 0);
	drh.safari = dav.indexOf("Safari") >= 0;
	var geckoPos = dua.indexOf("Gecko");
	drh.mozilla = drh.moz = (geckoPos >= 0)&&(!drh.khtml);
	if (drh.mozilla) {
		// gecko version is YYYYMMDD
		drh.geckoVersion = dua.substring(geckoPos + 6, geckoPos + 14);
	}
	drh.ie = (document.all)&&(!drh.opera);
	drh.ie50 = drh.ie && dav.indexOf("MSIE 5.0")>=0;
	drh.ie55 = drh.ie && dav.indexOf("MSIE 5.5")>=0;
	drh.ie60 = drh.ie && dav.indexOf("MSIE 6.0")>=0;

	dr.vml.capable=drh.ie;
	dr.svg.capable = f;
	dr.svg.support.plugin = f;
	dr.svg.support.builtin = f;
	dr.svg.adobe = f;
	if (document.implementation 
		&& document.implementation.hasFeature
		&& document.implementation.hasFeature("org.w3c.dom.svg", "1.0")
	){
		dr.svg.capable = t;
		dr.svg.support.builtin = t;
		dr.svg.support.plugin = f;
		dr.svg.adobe = f;
	}else{ 
		//	check for ASVG
		if(navigator.mimeTypes && navigator.mimeTypes.length > 0){
			var result = navigator.mimeTypes["image/svg+xml"] ||
				navigator.mimeTypes["image/svg"] ||
				navigator.mimeTypes["image/svg-xml"];
			if (result){
				dr.svg.adobe = result && result.enabledPlugin &&
					result.enabledPlugin.description && 
					(result.enabledPlugin.description.indexOf("Adobe") > -1);
				if(dr.svg.adobe) {
					dr.svg.capable = t;
					dr.svg.support.plugin = t;
				}
			}
		}else if(drh.ie && dr.os.win){
			var result = f;
			try {
				var test = new ActiveXObject("Adobe.SVGCtl");
				result = t;
			} catch(e){}
			if (result){
				dr.svg.capable = t;
				dr.svg.support.plugin = t;
				dr.svg.adobe = t;
			}
		}else{
			dr.svg.capable = f;
			dr.svg.support.plugin = f;
			dr.svg.adobe = f;
		}
	}
})();

dojo.hostenv.startPackage("dojo.hostenv");

dojo.hostenv.name_ = 'browser';
dojo.hostenv.searchIds = [];

// These are in order of decreasing likelihood; this will change in time.
var DJ_XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

dojo.hostenv.getXmlhttpObject = function(){
    var http = null;
	var last_e = null;
	try{ http = new XMLHttpRequest(); }catch(e){}
    if(!http){
		for(var i=0; i<3; ++i){
			var progid = DJ_XMLHTTP_PROGIDS[i];
			try{
				http = new ActiveXObject(progid);
			}catch(e){
				last_e = e;
			}

			if(http){
				DJ_XMLHTTP_PROGIDS = [progid];  // so faster next time
				break;
			}
		}

		/*if(http && !http.toString) {
			http.toString = function() { "[object XMLHttpRequest]"; }
		}*/
	}

	if(!http){
		return dojo.raise("XMLHTTP not available", last_e);
	}

	return http;
}

/**
 * Read the contents of the specified uri and return those contents.
 *
 * @param uri A relative or absolute uri. If absolute, it still must be in the
 * same "domain" as we are.
 *
 * @param async_cb If not specified, load synchronously. If specified, load
 * asynchronously, and use async_cb as the progress handler which takes the
 * xmlhttp object as its argument. If async_cb, this function returns null.
 *
 * @param fail_ok Default false. If fail_ok and !async_cb and loading fails,
 * return null instead of throwing.
 */ 
dojo.hostenv.getText = function(uri, async_cb, fail_ok){
	
	var http = this.getXmlhttpObject();

	if(async_cb){
		http.onreadystatechange = function(){ 
			if((4==http.readyState)&&(http["status"])){
				if(http.status==200){
					// dojo.debug("LOADED URI: "+uri);
					async_cb(http.responseText);
				}
			}
		}
	}

	http.open('GET', uri, async_cb ? true : false);
	http.send(null);
	if(async_cb){
		return null;
	}
	
	return http.responseText;
}

/*
 * It turns out that if we check *right now*, as this script file is being loaded,
 * then the last script element in the window DOM is ourselves.
 * That is because any subsequent script elements haven't shown up in the document
 * object yet.
 */
 /*
function dj_last_script_src() {
    var scripts = window.document.getElementsByTagName('script');
    if(scripts.length < 1){ 
		dojo.raise("No script elements in window.document, so can't figure out my script src"); 
	}
    var script = scripts[scripts.length - 1];
    var src = script.src;
    if(!src){
		dojo.raise("Last script element (out of " + scripts.length + ") has no src");
	}
    return src;
}

if(!dojo.hostenv["library_script_uri_"]){
	dojo.hostenv.library_script_uri_ = dj_last_script_src();
}
*/

dojo.hostenv.defaultDebugContainerId = 'dojoDebug';
dojo.hostenv._println_buffer = [];
dojo.hostenv._println_safe = false;
dojo.hostenv.println = function (line){
	if(!dojo.hostenv._println_safe){
		dojo.hostenv._println_buffer.push(line);
	}else{
		try {
			var console = document.getElementById(djConfig.debugContainerId ?
				djConfig.debugContainerId : dojo.hostenv.defaultDebugContainerId);
			if(!console) { console = document.getElementsByTagName("body")[0] || document.body; }

			var div = document.createElement("div");
			div.appendChild(document.createTextNode(line));
			console.appendChild(div);
		} catch (e) {
			try{
				// safari needs the output wrapped in an element for some reason
				document.write("<div>" + line + "</div>");
			}catch(e2){
				window.status = line;
			}
		}
	}
}

dojo.addOnLoad(function(){
	dojo.hostenv._println_safe = true;
	while(dojo.hostenv._println_buffer.length > 0){
		dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
	}
});

function dj_addNodeEvtHdlr (node, evtName, fp, capture){
	var oldHandler = node["on"+evtName] || function(){};
	node["on"+evtName] = function(){
		fp.apply(node, arguments);
		oldHandler.apply(node, arguments);
	}
	return true;
}

dj_addNodeEvtHdlr(window, "load", function(){
	if(dojo.render.html.ie){
		dojo.hostenv.makeWidgets();
	}
	dojo.hostenv.modulesLoaded();
});

dojo.hostenv.makeWidgets = function(){
	// you can put searchIds in djConfig and dojo.hostenv at the moment
	// we should probably eventually move to one or the other
	var sids = [];
	if(djConfig.searchIds && djConfig.searchIds.length > 0) {
		sids = sids.concat(djConfig.searchIds);
	}
	if(dojo.hostenv.searchIds && dojo.hostenv.searchIds.length > 0) {
		sids = sids.concat(dojo.hostenv.searchIds);
	}

	if((djConfig.parseWidgets)||(sids.length > 0)){
		if(dojo.evalObjPath("dojo.widget.Parse")){
			// we must do this on a delay to avoid:
			//	http://www.shaftek.org/blog/archives/000212.html
			// IE is such a tremendous peice of shit.
			try{
				var parser = new dojo.xml.Parse();
				if(sids.length > 0){
					for(var x=0; x<sids.length; x++){
						var tmpNode = document.getElementById(sids[x]);
						if(!tmpNode){ continue; }
						var frag = parser.parseElement(tmpNode, null, true);
						dojo.widget.getParser().createComponents(frag);
					}
				}else if(djConfig.parseWidgets){
					var frag  = parser.parseElement(document.getElementsByTagName("body")[0] || document.body, null, true);
					dojo.widget.getParser().createComponents(frag);
				}
			}catch(e){
				dojo.debug("auto-build-widgets error:", e);
			}
		}
	}
}

dojo.hostenv.modulesLoadedListeners.push(function(){
	if(!dojo.render.html.ie) {
		dojo.hostenv.makeWidgets();
	}
});

// we assume that we haven't hit onload yet. Lord help us.
try {
	if (dojo.render.html.ie) {
		document.write('<style>v\:*{ behavior:url(#default#VML); }</style>');
		document.write('<xml:namespace ns="urn:schemas-microsoft-com:vml" prefix="v"/>');
	}
} catch (e) { }

// stub, over-ridden by debugging code. This will at least keep us from
// breaking when it's not included
dojo.hostenv.writeIncludes = function(){} 

dojo.hostenv.byId = dojo.byId = function(id, doc){
	if(typeof id == "string" || id instanceof String){
		if(!doc){ doc = document; }
		return doc.getElementById(id);
	}
	return id; // assume it's a node
}

dojo.hostenv.byIdArray = dojo.byIdArray = function(){
	var ids = [];
	for(var i = 0; i < arguments.length; i++){
		if((arguments[i] instanceof Array)||(typeof arguments[i] == "array")){
			for(var j = 0; j < arguments[i].length; j++){
				ids = ids.concat(dojo.hostenv.byIdArray(arguments[i][j]));
			}
		}else{
			ids.push(dojo.hostenv.byId(arguments[i]));
		}
	}
	return ids;
}

/*
 * bootstrap2.js - runs after the hostenv_*.js file.
 */

/*
 * This method taks a "map" of arrays which one can use to optionally load dojo
 * modules. The map is indexed by the possible dojo.hostenv.name_ values, with
 * two additional values: "default" and "common". The items in the "default"
 * array will be loaded if none of the other items have been choosen based on
 * the hostenv.name_ item. The items in the "common" array will _always_ be
 * loaded, regardless of which list is chosen.  Here's how it's normally
 * called:
 *
 *	dojo.hostenv.conditionalLoadModule({
 *		browser: [
 *			["foo.bar.baz", true, true], // an example that passes multiple args to loadModule()
 *			"foo.sample.*",
 *			"foo.test,
 *		],
 *		default: [ "foo.sample.*" ],
 *		common: [ "really.important.module.*" ]
 *	});
 */
dojo.hostenv.conditionalLoadModule = function(modMap){
	var common = modMap["common"]||[];
	var result = (modMap[dojo.hostenv.name_]) ? common.concat(modMap[dojo.hostenv.name_]||[]) : common.concat(modMap["default"]||[]);

	for(var x=0; x<result.length; x++){
		var curr = result[x];
		if(curr.constructor == Array){
			dojo.hostenv.loadModule.apply(dojo.hostenv, curr);
		}else{
			dojo.hostenv.loadModule(curr);
		}
	}
}

dojo.hostenv.require = dojo.hostenv.loadModule;
dojo.require = function(){
	dojo.hostenv.loadModule.apply(dojo.hostenv, arguments);
}
dojo.requireAfter = dojo.require;

dojo.requireIf = function(){
	if((arguments[0] === true)||(arguments[0]=="common")||(dojo.render[arguments[0]].capable)){
		var args = [];
		for (var i = 1; i < arguments.length; i++) { args.push(arguments[i]); }
		dojo.require.apply(dojo, args);
	}
}

dojo.requireAfterIf = dojo.requireIf;
dojo.conditionalRequire = dojo.requireIf;

dojo.kwCompoundRequire = function(){
	dojo.hostenv.conditionalLoadModule.apply(dojo.hostenv, arguments);
}

dojo.hostenv.provide = dojo.hostenv.startPackage;
dojo.provide = function(){
	return dojo.hostenv.startPackage.apply(dojo.hostenv, arguments);
}

dojo.setModulePrefix = function(module, prefix){
	return dojo.hostenv.setModulePrefix(module, prefix);
}

// stub
dojo.profile = { start: function(){}, end: function(){}, dump: function(){} };

// determine if an object supports a given method
// useful for longer api chains where you have to test each object in the chain
dojo.exists = function(obj, name){
	var p = name.split(".");
	for(var i = 0; i < p.length; i++){
	if(!(obj[p[i]])) return false;
		obj = obj[p[i]];
	}
	return true;
}

dojo.provide("dojo.lang");
dojo.provide("dojo.AdapterRegistry");
dojo.provide("dojo.lang.Lang");

dojo.lang.mixin = function(obj, props){
	var tobj = {};
	for(var x in props){
		if(typeof tobj[x] == "undefined" || tobj[x] != props[x]) {
			obj[x] = props[x];
		}
	}
	// IE doesn't recognize custom toStrings in for..in
	if(dojo.render.html.ie && dojo.lang.isFunction(props["toString"]) && props["toString"] != obj["toString"]) {
		obj.toString = props.toString;
	}
	return obj;
}

dojo.lang.extend = function(ctor, props){
	this.mixin(ctor.prototype, props);
}

dojo.lang.extendPrototype = function(obj, props){
	this.extend(obj.constructor, props);
}

dojo.lang.anonCtr = 0;
dojo.lang.anon = {};
dojo.lang.nameAnonFunc = function(anonFuncPtr, namespaceObj){
	var nso = (namespaceObj || dojo.lang.anon);
	if((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"] == true)){
		for(var x in nso){
			if(nso[x] === anonFuncPtr){
				return x;
			}
		}
	}
	var ret = "__"+dojo.lang.anonCtr++;
	while(typeof nso[ret] != "undefined"){
		ret = "__"+dojo.lang.anonCtr++;
	}
	nso[ret] = anonFuncPtr;
	return ret;
}

/**
 * Runs a function in a given scope (thisObject), can
 * also be used to preserve scope.
 *
 * hitch(foo, "bar"); // runs foo.bar() in the scope of foo
 * hitch(foo, myFunction); // runs myFunction in the scope of foo
 */
dojo.lang.hitch = function(thisObject, method) {
	if(dojo.lang.isString(method)) {
		var fcn = thisObject[method];
	} else {
		var fcn = method;
	}

	return function() {
		return fcn.apply(thisObject, arguments);
	}
}

dojo.lang.forward = function(funcName){
	// Returns a function that forwards a method call to this.func(...)
	return function(){
		return this[funcName].apply(this, arguments);
	};
}

dojo.lang.curry = function(ns, func /* args ... */){
	var outerArgs = [];
	ns = ns||dj_global;
	if(dojo.lang.isString(func)){
		func = ns[func];
	}
	for(var x=2; x<arguments.length; x++){
		outerArgs.push(arguments[x]);
	}
	var ecount = func.length - outerArgs.length;
	// borrowed from svend tofte
	function gather(nextArgs, innerArgs, expected){
		var texpected = expected;
		var totalArgs = innerArgs.slice(0); // copy
		for(var x=0; x<nextArgs.length; x++){
			totalArgs.push(nextArgs[x]);
		}
		// check the list of provided nextArgs to see if it, plus the
		// number of innerArgs already supplied, meets the total
		// expected.
		expected = expected-nextArgs.length;
		if(expected<=0){
			var res = func.apply(ns, totalArgs);
			expected = texpected;
			return res;
		}else{
			return function(){
				return gather(arguments,// check to see if we've been run
										// with enough args
							totalArgs,	// a copy
							expected);	// how many more do we need to run?;
			}
		}
	}
	return gather([], outerArgs, ecount);
}

dojo.lang.curryArguments = function(ns, func, args, offset){
	var targs = [];
	var x = offset||0;
	for(x=offset; x<args.length; x++){
		targs.push(args[x]); // ensure that it's an arr
	}
	return dojo.lang.curry.apply(dojo.lang, [ns, func].concat(targs));
}

/**
 * Sets a timeout in milliseconds to execute a function in a given context
 * with optional arguments.
 *
 * setTimeout (Object context, function func, number delay[, arg1[, ...]]);
 * setTimeout (function func, number delay[, arg1[, ...]]);
 */
dojo.lang.setTimeout = function(func, delay){
	var context = window, argsStart = 2;
	if(!dojo.lang.isFunction(func)){
		context = func;
		func = delay;
		delay = arguments[2];
		argsStart++;
	}

	if(dojo.lang.isString(func)){
		func = context[func];
	}
	
	var args = [];
	for (var i = argsStart; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	return setTimeout(function () { func.apply(context, args); }, delay);
}

/**
 * Partial implmentation of is* functions from
 * http://www.crockford.com/javascript/recommend.html
 * NOTE: some of these may not be the best thing to use in all situations
 * as they aren't part of core JS and therefore can't work in every case.
 * See WARNING messages inline for tips.
 *
 * The following is* functions are fairly "safe"
 */

dojo.lang.isObject = function(wh) {
	return typeof wh == "object" || dojo.lang.isArray(wh) || dojo.lang.isFunction(wh);
}

dojo.lang.isArray = function(wh) {
	return (wh instanceof Array || typeof wh == "array");
}

dojo.lang.isArrayLike = function(wh) {
	if(dojo.lang.isString(wh)){ return false; }
	if(dojo.lang.isArray(wh)){ return true; }
	if(typeof wh != "undefined" && wh
        && dojo.lang.isNumber(wh.length) && isFinite(wh.length)){ return true; }
	return false;
}

dojo.lang.isFunction = function(wh) {
	return (wh instanceof Function || typeof wh == "function");
}

dojo.lang.isString = function(wh) {
	return (wh instanceof String || typeof wh == "string");
}

dojo.lang.isAlien = function(wh) {
	return !dojo.lang.isFunction() && /\{\s*\[native code\]\s*\}/.test(String(wh));
}

dojo.lang.isBoolean = function(wh) {
	return (wh instanceof Boolean || typeof wh == "boolean");
}

/**
 * The following is***() functions are somewhat "unsafe". Fortunately,
 * there are workarounds the the language provides and are mentioned
 * in the WARNING messages.
 *
 * WARNING: In most cases, isNaN(wh) is sufficient to determine whether or not
 * something is a number or can be used as such. For example, a number or string
 * can be used interchangably when accessing array items (arr["1"] is the same as
 * arr[1]) and isNaN will return false for both values ("1" and 1). Should you
 * use isNumber("1"), that will return false, which is generally not too useful.
 * Also, isNumber(NaN) returns true, again, this isn't generally useful, but there
 * are corner cases (like when you want to make sure that two things are really
 * the same type of thing). That is really where isNumber "shines".
 *
 * RECOMMENDATION: Use isNaN(wh) when possible
 */
dojo.lang.isNumber = function(wh) {
	return (wh instanceof Number || typeof wh == "number");
}

/**
 * WARNING: In some cases, isUndefined will not behave as you
 * might expect. If you do isUndefined(foo) and there is no earlier
 * reference to foo, an error will be thrown before isUndefined is
 * called. It behaves correctly if you scope yor object first, i.e.
 * isUndefined(foo.bar) where foo is an object and bar isn't a
 * property of the object.
 *
 * RECOMMENDATION: Use `typeof foo == "undefined"` when possible
 *
 * FIXME: Should isUndefined go away since it is error prone?
 */
dojo.lang.isUndefined = function(wh) {
	return ((wh == undefined)&&(typeof wh == "undefined"));
}

// end Crockford functions

dojo.lang.whatAmI = function(wh) {
	try {
		if(dojo.lang.isArray(wh)) { return "array"; }
		if(dojo.lang.isFunction(wh)) { return "function"; }
		if(dojo.lang.isString(wh)) { return "string"; }
		if(dojo.lang.isNumber(wh)) { return "number"; }
		if(dojo.lang.isBoolean(wh)) { return "boolean"; }
		if(dojo.lang.isAlien(wh)) { return "alien"; }
		if(dojo.lang.isUndefined(wh)) { return "undefined"; }
		// FIXME: should this go first?
		for(var name in dojo.lang.whatAmI.custom) {
			if(dojo.lang.whatAmI.custom[name](wh)) {
				return name;
			}
		}
		if(dojo.lang.isObject(wh)) { return "object"; }
	} catch(E) {}
	return "unknown";
}
/*
 * dojo.lang.whatAmI.custom[typeName] = someFunction
 * will return typeName is someFunction(wh) returns true
 */
dojo.lang.whatAmI.custom = {};

/**
 * See if val is in arr. Call signatures:
 *  find(array, value, identity)
*   find(value, array, identity)
**/
dojo.lang.find = function(arr, val, identity){
	// support both (arr, val) and (val, arr)
	if(!dojo.lang.isArrayLike(arr) && dojo.lang.isArrayLike(val)) {
		var a = arr;
		arr = val;
		val = a;
	}
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(identity){
		for(var i=0;i<arr.length;++i){
			if(arr[i] === val){ return i; }
		}
	}else{
		for(var i=0;i<arr.length;++i){
			if(arr[i] == val){ return i; }
		}
	}
	return -1;
}

dojo.lang.indexOf = dojo.lang.find;

dojo.lang.findLast = function(arr, val, identity) {
	// support both (arr, val) and (val, arr)
	if(!dojo.lang.isArrayLike(arr) && dojo.lang.isArrayLike(val)) {
		var a = arr;
		arr = val;
		val = a;
	}
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(identity){
		for(var i = arr.length-1; i >= 0; i--) {
			if(arr[i] === val){ return i; }
		}
	}else{
		for(var i = arr.length-1; i >= 0; i--) {
			if(arr[i] == val){ return i; }
		}
	}
	return -1;
}

dojo.lang.lastIndexOf = dojo.lang.findLast;

dojo.lang.inArray = function(arr, val){
	return dojo.lang.find(arr, val) > -1;
}

dojo.lang.getNameInObj = function(ns, item){
	if(!ns){ ns = dj_global; }

	for(var x in ns){
		if(ns[x] === item){
			return new String(x);
		}
	}
	return null;
}

// FIXME: Is this worthless since you can do: if(name in obj)
// is this the right place for this?
dojo.lang.has = function(obj, name){
	return (typeof obj[name] !== 'undefined');
}

dojo.lang.isEmpty = function(obj) {
	if(dojo.lang.isObject(obj)) {
		var tmp = {};
		var count = 0;
		for(var x in obj){
			if(obj[x] && (!tmp[x])){
				count++;
				break;
			} 
		}
		return (count == 0);
	} else if(dojo.lang.isArrayLike(obj) || dojo.lang.isString(obj)) {
		return obj.length == 0;
	}
}

dojo.lang.forEach = function(arr, unary_func, fix_length){
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	var il = arr.length;
	for(var i=0; i< ((fix_length) ? il : arr.length); i++){
		if(unary_func(arr[i], i, arr) == "break"){
			break;
		}
	}
}

dojo.lang.map = function(arr, obj, unary_func){
	var isString = dojo.lang.isString(arr);
	if(isString){
		arr = arr.split("");
	}
	if(dojo.lang.isFunction(obj)&&(!unary_func)){
		unary_func = obj;
		obj = dj_global;
	}else if(dojo.lang.isFunction(obj) && unary_func){
		// ff 1.5 compat
		var tmpObj = obj;
		obj = unary_func;
		unary_func = tmpObj;
	}

	if(Array.map){
	 	var outArr = Array.map(arr, unary_func, obj);
	}else{
		var outArr = [];
		for(var i=0;i<arr.length;++i){
			outArr.push(unary_func.call(obj, arr[i]));
		}
	}

	if(isString) {
		return outArr.join("");
	} else {
		return outArr;
	}
}

dojo.lang.tryThese = function(){
	for(var x=0; x<arguments.length; x++){
		try{
			if(typeof arguments[x] == "function"){
				var ret = (arguments[x]());
				if(ret){
					return ret;
				}
			}
		}catch(e){
			dojo.debug(e);
		}
	}
}

dojo.lang.delayThese = function(farr, cb, delay, onend){
	/**
	 * alternate: (array funcArray, function callback, function onend)
	 * alternate: (array funcArray, function callback)
	 * alternate: (array funcArray)
	 */
	if(!farr.length){ 
		if(typeof onend == "function"){
			onend();
		}
		return;
	}
	if((typeof delay == "undefined")&&(typeof cb == "number")){
		delay = cb;
		cb = function(){};
	}else if(!cb){
		cb = function(){};
		if(!delay){ delay = 0; }
	}
	setTimeout(function(){
		(farr.shift())();
		cb();
		dojo.lang.delayThese(farr, cb, delay, onend);
	}, delay);
}

dojo.lang.shallowCopy = function(obj) {
	var ret = {}, key;
	for(key in obj) {
		if(dojo.lang.isUndefined(ret[key])) {
			ret[key] = obj[key];
		}
	}
	return ret;
}

dojo.lang.every = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.every) {
		return Array.every(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { dojo.raise("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		for(var i = 0; i < arr.length; i++) {
			if(!callback.call(thisObject, arr[i], i, arr)) {
				return false;
			}
		}
		return true;
	}
}

dojo.lang.some = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.some) {
		return Array.some(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { dojo.raise("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		for(var i = 0; i < arr.length; i++) {
			if(callback.call(thisObject, arr[i], i, arr)) {
				return true;
			}
		}
		return false;
	}
}

dojo.lang.filter = function(arr, callback, thisObject) {
	var isString = dojo.lang.isString(arr);
	if(isString) { arr = arr.split(""); }
	if(Array.filter) {
		var outArr = Array.filter(arr, callback, thisObject);
	} else {
		if(!thisObject) {
			if(arguments.length >= 3) { dojo.raise("thisObject doesn't exist!"); }
			thisObject = dj_global;
		}

		var outArr = [];
		for(var i = 0; i < arr.length; i++) {
			if(callback.call(thisObject, arr[i], i, arr)) {
				outArr.push(arr[i]);
			}
		}
	}
	if(isString) {
		return outArr.join("");
	} else {
		return outArr;
	}
}

dojo.AdapterRegistry = function(){
    /***
        A registry to facilitate adaptation.

        Pairs is an array of [name, check, wrap] triples
        
        All check/wrap functions in this registry should be of the same arity.
    ***/
    this.pairs = [];
}

dojo.lang.extend(dojo.AdapterRegistry, {
    register: function (name, check, wrap, /* optional */ override){
        /***
			The check function should return true if the given arguments are
			appropriate for the wrap function.

			If override is given and true, the check function will be given
			highest priority.  Otherwise, it will be the lowest priority
			adapter.
        ***/

        if (override) {
            this.pairs.unshift([name, check, wrap]);
        } else {
            this.pairs.push([name, check, wrap]);
        }
    },

    match: function (/* ... */) {
        /***
			Find an adapter for the given arguments.

			If no suitable adapter is found, throws NotFound.
        ***/
        for(var i = 0; i < this.pairs.length; i++){
            var pair = this.pairs[i];
            if(pair[1].apply(this, arguments)){
                return pair[2].apply(this, arguments);
            }
        }
		throw new Error("No match found");
        // dojo.raise("No match found");
    },

    unregister: function (name) {
        /***
			Remove a named adapter from the registry
        ***/
        for(var i = 0; i < this.pairs.length; i++){
            var pair = this.pairs[i];
            if(pair[0] == name){
                this.pairs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
});

dojo.lang.reprRegistry = new dojo.AdapterRegistry();
dojo.lang.registerRepr = function(name, check, wrap, /*optional*/ override){
        /***
			Register a repr function.  repr functions should take
			one argument and return a string representation of it
			suitable for developers, primarily used when debugging.

			If override is given, it is used as the highest priority
			repr, otherwise it will be used as the lowest.
        ***/
        dojo.lang.reprRegistry.register(name, check, wrap, override);
    };

dojo.lang.repr = function(obj){
	/***
		Return a "programmer representation" for an object
	***/
	if(typeof(obj) == "undefined"){
		return "undefined";
	}else if(obj === null){
		return "null";
	}

	try{
		if(typeof(obj["__repr__"]) == 'function'){
			return obj["__repr__"]();
		}else if((typeof(obj["repr"]) == 'function')&&(obj.repr != arguments.callee)){
			return obj["repr"]();
		}
		return dojo.lang.reprRegistry.match(obj);
	}catch(e){
		if(typeof(obj.NAME) == 'string' && (
				obj.toString == Function.prototype.toString ||
				obj.toString == Object.prototype.toString
			)){
			return o.NAME;
		}
	}

	if(typeof(obj) == "function"){
		obj = (obj + "").replace(/^\s+/, "");
		var idx = obj.indexOf("{");
		if(idx != -1){
			obj = obj.substr(0, idx) + "{...}";
		}
	}
	return obj + "";
}

dojo.lang.reprArrayLike = function(arr){
	try{
		var na = dojo.lang.map(arr, dojo.lang.repr);
		return "[" + na.join(", ") + "]";
	}catch(e){ }
};

dojo.lang.reprString = function(str){ 
	return ('"' + str.replace(/(["\\])/g, '\\$1') + '"'
		).replace(/[\f]/g, "\\f"
		).replace(/[\b]/g, "\\b"
		).replace(/[\n]/g, "\\n"
		).replace(/[\t]/g, "\\t"
		).replace(/[\r]/g, "\\r");
};

dojo.lang.reprNumber = function(num){
	return num + "";
};

(function(){
	var m = dojo.lang;
	m.registerRepr("arrayLike", m.isArrayLike, m.reprArrayLike);
	m.registerRepr("string", m.isString, m.reprString);
	m.registerRepr("numbers", m.isNumber, m.reprNumber);
	m.registerRepr("boolean", m.isBoolean, m.reprNumber);
	// m.registerRepr("numbers", m.typeMatcher("number", "boolean"), m.reprNumber);
})();

/**
 * Creates a 1-D array out of all the arguments passed,
 * unravelling any array-like objects in the process
 *
 * Ex:
 * unnest(1, 2, 3) ==> [1, 2, 3]
 * unnest(1, [2, [3], [[[4]]]]) ==> [1, 2, 3, 4]
 */
dojo.lang.unnest = function(/* ... */) {
	var out = [];
	for(var i = 0; i < arguments.length; i++) {
		if(dojo.lang.isArrayLike(arguments[i])) {
			var add = dojo.lang.unnest.apply(this, arguments[i]);
			out = out.concat(add);
		} else {
			out.push(arguments[i]);
		}
	}
	return out;
}

/**
 * Return the first argument that isn't undefined
 */
dojo.lang.firstValued = function(/* ... */) {
	for(var i = 0; i < arguments.length; i++) {
		if(typeof arguments[i] != "undefined") {
			return arguments[i];
		}
	}
	return undefined;
}

/**
 * Converts an array-like object (i.e. arguments, DOMCollection)
 * to an array
**/
dojo.lang.toArray = function(arrayLike, startOffset) {
	var array = [];
	for(var i = startOffset||0; i < arrayLike.length; i++) {
		array.push(arrayLike[i]);
	}
	return array;
}

dojo.provide("dojo.dom");
dojo.require("dojo.lang");

dojo.dom.ELEMENT_NODE                  = 1;
dojo.dom.ATTRIBUTE_NODE                = 2;
dojo.dom.TEXT_NODE                     = 3;
dojo.dom.CDATA_SECTION_NODE            = 4;
dojo.dom.ENTITY_REFERENCE_NODE         = 5;
dojo.dom.ENTITY_NODE                   = 6;
dojo.dom.PROCESSING_INSTRUCTION_NODE   = 7;
dojo.dom.COMMENT_NODE                  = 8;
dojo.dom.DOCUMENT_NODE                 = 9;
dojo.dom.DOCUMENT_TYPE_NODE            = 10;
dojo.dom.DOCUMENT_FRAGMENT_NODE        = 11;
dojo.dom.NOTATION_NODE                 = 12;
	
dojo.dom.dojoml = "http://www.dojotoolkit.org/2004/dojoml";

/**
 *	comprehensive list of XML namespaces
**/
dojo.dom.xmlns = {
	svg : "http://www.w3.org/2000/svg",
	smil : "http://www.w3.org/2001/SMIL20/",
	mml : "http://www.w3.org/1998/Math/MathML",
	cml : "http://www.xml-cml.org",
	xlink : "http://www.w3.org/1999/xlink",
	xhtml : "http://www.w3.org/1999/xhtml",
	xul : "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
	xbl : "http://www.mozilla.org/xbl",
	fo : "http://www.w3.org/1999/XSL/Format",
	xsl : "http://www.w3.org/1999/XSL/Transform",
	xslt : "http://www.w3.org/1999/XSL/Transform",
	xi : "http://www.w3.org/2001/XInclude",
	xforms : "http://www.w3.org/2002/01/xforms",
	saxon : "http://icl.com/saxon",
	xalan : "http://xml.apache.org/xslt",
	xsd : "http://www.w3.org/2001/XMLSchema",
	dt: "http://www.w3.org/2001/XMLSchema-datatypes",
	xsi : "http://www.w3.org/2001/XMLSchema-instance",
	rdf : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	rdfs : "http://www.w3.org/2000/01/rdf-schema#",
	dc : "http://purl.org/dc/elements/1.1/",
	dcq: "http://purl.org/dc/qualifiers/1.0",
	"soap-env" : "http://schemas.xmlsoap.org/soap/envelope/",
	wsdl : "http://schemas.xmlsoap.org/wsdl/",
	AdobeExtensions : "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
};

dojo.dom.isNode = dojo.lang.isDomNode = function(wh){
	if(typeof Element == "object") {
		try {
			return wh instanceof Element;
		} catch(E) {}
	} else {
		// best-guess
		return wh && !isNaN(wh.nodeType);
	}
}
dojo.lang.whatAmI.custom["node"] = dojo.dom.isNode;

dojo.dom.getTagName = function(node){
	var tagName = node.tagName;
	if(tagName.substr(0,5).toLowerCase()!="dojo:"){
		
		if(tagName.substr(0,4).toLowerCase()=="dojo"){
			// FIXME: this assuumes tag names are always lower case
			return "dojo:" + tagName.substring(4).toLowerCase();
		}

		// allow lower-casing
		var djt = node.getAttribute("dojoType")||node.getAttribute("dojotype");
		if(djt){
			return "dojo:"+djt.toLowerCase();
		}
		
		if((node.getAttributeNS)&&(node.getAttributeNS(this.dojoml,"type"))){
			return "dojo:" + node.getAttributeNS(this.dojoml,"type").toLowerCase();
		}
		try{
			// FIXME: IE really really doesn't like this, so we squelch
			// errors for it
			djt = node.getAttribute("dojo:type");
		}catch(e){ /* FIXME: log? */ }
		if(djt){
			return "dojo:"+djt.toLowerCase();
		}

		if((!dj_global["djConfig"])||(!djConfig["ignoreClassNames"])){
			// FIXME: should we make this optionally enabled via djConfig?
			var classes = node.className||node.getAttribute("class");
			// FIXME: following line, without check for existence of classes.indexOf
			// breaks firefox 1.5's svg widgets
			if((classes)&&(classes.indexOf)&&(classes.indexOf("dojo-") != -1)){
				var aclasses = classes.split(" ");
				for(var x=0; x<aclasses.length; x++){
					if((aclasses[x].length>5)&&(aclasses[x].indexOf("dojo-")>=0)){
						return "dojo:"+aclasses[x].substr(5).toLowerCase();
					}
				}
			}
		}

	}
	return tagName.toLowerCase();
}

dojo.dom.getUniqueId = function(){
	do {
		var id = "dj_unique_" + (++arguments.callee._idIncrement);
	}while(document.getElementById(id));
	return id;
}
dojo.dom.getUniqueId._idIncrement = 0;

dojo.dom.firstElement = dojo.dom.getFirstChildElement = function(parentNode, tagName){
	var node = parentNode.firstChild;
	while(node && node.nodeType != dojo.dom.ELEMENT_NODE){
		node = node.nextSibling;
	}
	if(tagName && node && node.tagName && node.tagName.toLowerCase() != tagName.toLowerCase()) {
		node = dojo.dom.nextElement(node, tagName);
	}
	return node;
}

dojo.dom.lastElement = dojo.dom.getLastChildElement = function(parentNode, tagName){
	var node = parentNode.lastChild;
	while(node && node.nodeType != dojo.dom.ELEMENT_NODE) {
		node = node.previousSibling;
	}
	if(tagName && node && node.tagName && node.tagName.toLowerCase() != tagName.toLowerCase()) {
		node = dojo.dom.prevElement(node, tagName);
	}
	return node;
}

dojo.dom.nextElement = dojo.dom.getNextSiblingElement = function(node, tagName){
	if(!node) { return null; }
	do {
		node = node.nextSibling;
	} while(node && node.nodeType != dojo.dom.ELEMENT_NODE);

	if(node && tagName && tagName.toLowerCase() != node.tagName.toLowerCase()) {
		return dojo.dom.nextElement(node, tagName);
	}
	return node;
}

dojo.dom.prevElement = dojo.dom.getPreviousSiblingElement = function(node, tagName){
	if(!node) { return null; }
	if(tagName) { tagName = tagName.toLowerCase(); }
	do {
		node = node.previousSibling;
	} while(node && node.nodeType != dojo.dom.ELEMENT_NODE);

	if(node && tagName && tagName.toLowerCase() != node.tagName.toLowerCase()) {
		return dojo.dom.prevElement(node, tagName);
	}
	return node;
}

// TODO: hmph
/*this.forEachChildTag = function(node, unaryFunc) {
	var child = this.getFirstChildTag(node);
	while(child) {
		if(unaryFunc(child) == "break") { break; }
		child = this.getNextSiblingTag(child);
	}
}*/

dojo.dom.moveChildren = function(srcNode, destNode, trim){
	var count = 0;
	if(trim) {
		while(srcNode.hasChildNodes() &&
			srcNode.firstChild.nodeType == dojo.dom.TEXT_NODE) {
			srcNode.removeChild(srcNode.firstChild);
		}
		while(srcNode.hasChildNodes() &&
			srcNode.lastChild.nodeType == dojo.dom.TEXT_NODE) {
			srcNode.removeChild(srcNode.lastChild);
		}
	}
	while(srcNode.hasChildNodes()){
		destNode.appendChild(srcNode.firstChild);
		count++;
	}
	return count;
}

dojo.dom.copyChildren = function(srcNode, destNode, trim){
	var clonedNode = srcNode.cloneNode(true);
	return this.moveChildren(clonedNode, destNode, trim);
}

dojo.dom.removeChildren = function(node){
	var count = node.childNodes.length;
	while(node.hasChildNodes()){ node.removeChild(node.firstChild); }
	return count;
}

dojo.dom.replaceChildren = function(node, newChild){
	// FIXME: what if newChild is an array-like object?
	dojo.dom.removeChildren(node);
	node.appendChild(newChild);
}

dojo.dom.removeNode = function(node){
	if(node && node.parentNode){
		// return a ref to the removed child
		return node.parentNode.removeChild(node);
	}
}

dojo.dom.getAncestors = function(node, filterFunction, returnFirstHit) {
	var ancestors = [];
	var isFunction = dojo.lang.isFunction(filterFunction);
	while(node) {
		if (!isFunction || filterFunction(node)) {
			ancestors.push(node);
		}
		if (returnFirstHit && ancestors.length > 0) { return ancestors[0]; }
		
		node = node.parentNode;
	}
	if (returnFirstHit) { return null; }
	return ancestors;
}

dojo.dom.getAncestorsByTag = function(node, tag, returnFirstHit) {
	tag = tag.toLowerCase();
	return dojo.dom.getAncestors(node, function(el){
		return ((el.tagName)&&(el.tagName.toLowerCase() == tag));
	}, returnFirstHit);
}

dojo.dom.getFirstAncestorByTag = function(node, tag) {
	return dojo.dom.getAncestorsByTag(node, tag, true);
}

dojo.dom.isDescendantOf = function(node, ancestor, guaranteeDescendant){
	// guaranteeDescendant allows us to be a "true" isDescendantOf function
	if(guaranteeDescendant && node) { node = node.parentNode; }
	while(node) {
		if(node == ancestor){ return true; }
		node = node.parentNode;
	}
	return false;
}

dojo.dom.innerXML = function(node){
	if(node.innerXML){
		return node.innerXML;
	}else if(typeof XMLSerializer != "undefined"){
		return (new XMLSerializer()).serializeToString(node);
	}
}

dojo.dom.createDocumentFromText = function(str, mimetype){
	if(!mimetype) { mimetype = "text/xml"; }
	if(typeof DOMParser != "undefined") {
		var parser = new DOMParser();
		return parser.parseFromString(str, mimetype);
	}else if(typeof ActiveXObject != "undefined"){
		var domDoc = new ActiveXObject("Microsoft.XMLDOM");
		if(domDoc) {
			domDoc.async = false;
			domDoc.loadXML(str);
			return domDoc;
		}else{
			dojo.debug("toXml didn't work?");
		}
	/*
	}else if((dojo.render.html.capable)&&(dojo.render.html.safari)){
		// FIXME: this doesn't appear to work!
		// from: http://web-graphics.com/mtarchive/001606.php
		// var xml = '<?xml version="1.0"?>'+str;
		var mtype = "text/xml";
		var xml = '<?xml version="1.0"?>'+str;
		var url = "data:"+mtype+";charset=utf-8,"+encodeURIComponent(xml);
		var req = new XMLHttpRequest();
		req.open("GET", url, false);
		req.overrideMimeType(mtype);
		req.send(null);
		return req.responseXML;
	*/
	}else if(document.createElement){
		// FIXME: this may change all tags to uppercase!
		var tmp = document.createElement("xml");
		tmp.innerHTML = str;
		if(document.implementation && document.implementation.createDocument) {
			var xmlDoc = document.implementation.createDocument("foo", "", null);
			for(var i = 0; i < tmp.childNodes.length; i++) {
				xmlDoc.importNode(tmp.childNodes.item(i), true);
			}
			return xmlDoc;
		}
		// FIXME: probably not a good idea to have to return an HTML fragment
		// FIXME: the tmp.doc.firstChild is as tested from IE, so it may not
		// work that way across the board
		return tmp.document && tmp.document.firstChild ?
			tmp.document.firstChild : tmp;
	}
	return null;
}

dojo.dom.prependChild = function(node, parent) {
	if(parent.firstChild) {
		parent.insertBefore(node, parent.firstChild);
	} else {
		parent.appendChild(node);
	}
	return true;
}

dojo.dom.insertBefore = function(node, ref, force){
	if (force != true &&
		(node === ref || node.nextSibling === ref)){ return false; }
	var parent = ref.parentNode;
	parent.insertBefore(node, ref);
	return true;
}

dojo.dom.insertAfter = function(node, ref, force){
	var pn = ref.parentNode;
	if(ref == pn.lastChild){
		if((force != true)&&(node === ref)){
			return false;
		}
		pn.appendChild(node);
	}else{
		return this.insertBefore(node, ref.nextSibling, force);
	}
	return true;
}

dojo.dom.insertAtPosition = function(node, ref, position){
	if((!node)||(!ref)||(!position)){ return false; }
	switch(position.toLowerCase()){
		case "before":
			return dojo.dom.insertBefore(node, ref);
		case "after":
			return dojo.dom.insertAfter(node, ref);
		case "first":
			if(ref.firstChild){
				return dojo.dom.insertBefore(node, ref.firstChild);
			}else{
				ref.appendChild(node);
				return true;
			}
			break;
		default: // aka: last
			ref.appendChild(node);
			return true;
	}
}

dojo.dom.insertAtIndex = function(node, containingNode, insertionIndex){
	var siblingNodes = containingNode.childNodes;

	// if there aren't any kids yet, just add it to the beginning

	if (!siblingNodes.length){
		containingNode.appendChild(node);
		return true;
	}

	// otherwise we need to walk the childNodes
	// and find our spot

	var after = null;

	for(var i=0; i<siblingNodes.length; i++){

		var sibling_index = siblingNodes.item(i)["getAttribute"] ? parseInt(siblingNodes.item(i).getAttribute("dojoinsertionindex")) : -1;

		if (sibling_index < insertionIndex){
			after = siblingNodes.item(i);
		}
	}

	if (after){
		// add it after the node in {after}

		return dojo.dom.insertAfter(node, after);
	}else{
		// add it to the start

		return dojo.dom.insertBefore(node, siblingNodes.item(0));
	}
}
	
/**
 * implementation of the DOM Level 3 attribute.
 * 
 * @param node The node to scan for text
 * @param text Optional, set the text to this value.
 */
dojo.dom.textContent = function(node, text){
	if (text) {
		dojo.dom.replaceChildren(node, document.createTextNode(text));
		return text;
	} else {
		var _result = "";
		if (node == null) { return _result; }
		for (var i = 0; i < node.childNodes.length; i++) {
			switch (node.childNodes[i].nodeType) {
				case 1: // ELEMENT_NODE
				case 5: // ENTITY_REFERENCE_NODE
					_result += dojo.dom.textContent(node.childNodes[i]);
					break;
				case 3: // TEXT_NODE
				case 2: // ATTRIBUTE_NODE
				case 4: // CDATA_SECTION_NODE
					_result += node.childNodes[i].nodeValue;
					break;
				default:
					break;
			}
		}
		return _result;
	}
}

dojo.dom.collectionToArray = function(collection){
	dojo.deprecated("dojo.dom.collectionToArray", "use dojo.lang.toArray instead");
	return dojo.lang.toArray(collection);
}

dojo.dom.hasParent = function(node) {
	if(!node || !node.parentNode || (node.parentNode && !node.parentNode.tagName)) {
		return false;
	}
	return true;
}

/**
 * Determines if node has any of the provided tag names and
 * returns the tag name that matches, empty string otherwise.
 *
 * Examples:
 *
 * myFooNode = <foo />
 * isTag(myFooNode, "foo"); // returns "foo"
 * isTag(myFooNode, "bar"); // returns ""
 * isTag(myFooNode, "FOO"); // returns ""
 * isTag(myFooNode, "hey", "foo", "bar"); // returns "foo"
**/
dojo.dom.isTag = function(node /* ... */) {
	if(node && node.tagName) {
		var arr = dojo.lang.toArray(arguments, 1);
		return arr[ dojo.lang.find(node.tagName, arr) ] || "";
	}
	return "";
}

dojo.provide("dojo.uri.Uri");

dojo.uri = new function() {
	this.joinPath = function() {
		// DEPRECATED: use the dojo.uri.Uri object instead
		var arr = [];
		for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); }
		return arr.join("/").replace(/\/{2,}/g, "/").replace(/((https*|ftps*):)/i, "$1/");
	}
	
	this.dojoUri = function (uri) {
		// returns a Uri object resolved relative to the dojo root
		return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(), uri);
	}
		
	this.Uri = function (/*uri1, uri2, [...]*/) {
		// An object representing a Uri.
		// Each argument is evaluated in order relative to the next until
		// a conanical uri is producued. To get an absolute Uri relative
		// to the current document use
		//      new dojo.uri.Uri(document.baseURI, uri)

		// TODO: support for IPv6, see RFC 2732

		// resolve uri components relative to each other
		var uri = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			if(!arguments[i]) { continue; }

			// Safari doesn't support this.constructor so we have to be explicit
			var relobj = new dojo.uri.Uri(arguments[i].toString());
			var uriobj = new dojo.uri.Uri(uri.toString());

			if (relobj.path == "" && relobj.scheme == null &&
				relobj.authority == null && relobj.query == null) {
				if (relobj.fragment != null) { uriobj.fragment = relobj.fragment; }
				relobj = uriobj;
			} else if (relobj.scheme == null) {
				relobj.scheme = uriobj.scheme;
			
				if (relobj.authority == null) {
					relobj.authority = uriobj.authority;
					
					if (relobj.path.charAt(0) != "/") {
						var path = uriobj.path.substring(0,
							uriobj.path.lastIndexOf("/") + 1) + relobj.path;

						var segs = path.split("/");
						for (var j = 0; j < segs.length; j++) {
							if (segs[j] == ".") {
								if (j == segs.length - 1) { segs[j] = ""; }
								else { segs.splice(j, 1); j--; }
							} else if (j > 0 && !(j == 1 && segs[0] == "") &&
								segs[j] == ".." && segs[j-1] != "..") {

								if (j == segs.length - 1) { segs.splice(j, 1); segs[j - 1] = ""; }
								else { segs.splice(j - 1, 2); j -= 2; }
							}
						}
						relobj.path = segs.join("/");
					}
				}
			}

			uri = "";
			if (relobj.scheme != null) { uri += relobj.scheme + ":"; }
			if (relobj.authority != null) { uri += "//" + relobj.authority; }
			uri += relobj.path;
			if (relobj.query != null) { uri += "?" + relobj.query; }
			if (relobj.fragment != null) { uri += "#" + relobj.fragment; }
		}

		this.uri = uri.toString();

		// break the uri into its main components
		var regexp = "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
	    var r = this.uri.match(new RegExp(regexp));

		this.scheme = r[2] || (r[1] ? "" : null);
		this.authority = r[4] || (r[3] ? "" : null);
		this.path = r[5]; // can never be undefined
		this.query = r[7] || (r[6] ? "" : null);
		this.fragment  = r[9] || (r[8] ? "" : null);
		
		if (this.authority != null) {
			// server based naming authority
			regexp = "^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
			r = this.authority.match(new RegExp(regexp));
			
			this.user = r[3] || null;
			this.password = r[4] || null;
			this.host = r[5];
			this.port = r[7] || null;
		}
	
		this.toString = function(){ return this.uri; }
	}
};

dojo.provide("dojo.string");
dojo.require("dojo.lang");

/**
 * Trim whitespace from 'str'. If 'wh' > 0,
 * only trim from start, if 'wh' < 0, only trim
 * from end, otherwise trim both ends
 */
dojo.string.trim = function(str, wh){
	if(!dojo.lang.isString(str)){ return str; }
	if(!str.length){ return str; }
	if(wh > 0) {
		return str.replace(/^\s+/, "");
	} else if(wh < 0) {
		return str.replace(/\s+$/, "");
	} else {
		return str.replace(/^\s+|\s+$/g, "");
	}
}

/**
 * Trim whitespace at the beginning of 'str'
 */
dojo.string.trimStart = function(str) {
	return dojo.string.trim(str, 1);
}

/**
 * Trim whitespace at the end of 'str'
 */
dojo.string.trimEnd = function(str) {
	return dojo.string.trim(str, -1);
}

/**
 * Parameterized string function
 * str - formatted string with %{values} to be replaces
 * pairs - object of name: "value" value pairs
 * killExtra - remove all remaining %{values} after pairs are inserted
 */
dojo.string.paramString = function(str, pairs, killExtra) {
	for(var name in pairs) {
		var re = new RegExp("\\%\\{" + name + "\\}", "g");
		str = str.replace(re, pairs[name]);
	}

	if(killExtra) { str = str.replace(/%\{([^\}\s]+)\}/g, ""); }
	return str;
}

/** Uppercases the first letter of each word */
dojo.string.capitalize = function (str) {
	if (!dojo.lang.isString(str)) { return ""; }
	if (arguments.length == 0) { str = this; }
	var words = str.split(' ');
	var retval = "";
	var len = words.length;
	for (var i=0; i<len; i++) {
		var word = words[i];
		word = word.charAt(0).toUpperCase() + word.substring(1, word.length);
		retval += word;
		if (i < len-1)
			retval += " ";
	}
	
	return new String(retval);
}

/**
 * Return true if the entire string is whitespace characters
 */
dojo.string.isBlank = function (str) {
	if(!dojo.lang.isString(str)) { return true; }
	return (dojo.string.trim(str).length == 0);
}

dojo.string.encodeAscii = function(str) {
	if(!dojo.lang.isString(str)) { return str; }
	var ret = "";
	var value = escape(str);
	var match, re = /%u([0-9A-F]{4})/i;
	while((match = value.match(re))) {
		var num = Number("0x"+match[1]);
		var newVal = escape("&#" + num + ";");
		ret += value.substring(0, match.index) + newVal;
		value = value.substring(match.index+match[0].length);
	}
	ret += value.replace(/\+/g, "%2B");
	return ret;
}

// TODO: make an HTML version
dojo.string.summary = function(str, len) {
	if(!len || str.length <= len) {
		return str;
	} else {
		return str.substring(0, len).replace(/\.+$/, "") + "...";
	}
}

dojo.string.escape = function(type, str) {
	var args = [];
	for(var i = 1; i < arguments.length; i++) { args.push(arguments[i]); }
	switch(type.toLowerCase()) {
		case "xml":
		case "html":
		case "xhtml":
			return dojo.string.escapeXml.apply(this, args);
		case "sql":
			return dojo.string.escapeSql.apply(this, args);
		case "regexp":
		case "regex":
			return dojo.string.escapeRegExp.apply(this, args);
		case "javascript":
		case "jscript":
		case "js":
			return dojo.string.escapeJavaScript.apply(this, args);
		case "ascii":
			// so it's encode, but it seems useful
			return dojo.string.encodeAscii.apply(this, args);
		default:
			return str;
	}
}

dojo.string.escapeXml = function(str, noSingleQuotes) {
	str = str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;")
		.replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
	if(!noSingleQuotes) { str = str.replace(/'/gm, "&#39;"); }
	return str;
}

dojo.string.escapeSql = function(str) {
	return str.replace(/'/gm, "''");
}

dojo.string.escapeRegExp = function(str) {
	return str.replace(/\\/gm, "\\\\").replace(/([\f\b\n\t\r])/gm, "\\$1");
}

dojo.string.escapeJavaScript = function(str) {
	return str.replace(/(["'\f\b\n\t\r])/gm, "\\$1");
}

/**
 * Return 'str' repeated 'count' times, optionally
 * placing 'separator' between each rep
 */
dojo.string.repeat = function(str, count, separator) {
	var out = "";
	for(var i = 0; i < count; i++) {
		out += str;
		if(separator && i < count - 1) {
			out += separator;
		}
	}
	return out;
}

/**
 * Returns true if 'str' ends with 'end'
 */
dojo.string.endsWith = function(str, end, ignoreCase) {
	if(ignoreCase) {
		str = str.toLowerCase();
		end = end.toLowerCase();
	}
	return str.lastIndexOf(end) == str.length - end.length;
}

/**
 * Returns true if 'str' ends with any of the arguments[2 -> n]
 */
dojo.string.endsWithAny = function(str /* , ... */) {
	for(var i = 1; i < arguments.length; i++) {
		if(dojo.string.endsWith(str, arguments[i])) {
			return true;
		}
	}
	return false;
}

/**
 * Returns true if 'str' starts with 'start'
 */
dojo.string.startsWith = function(str, start, ignoreCase) {
	if(ignoreCase) {
		str = str.toLowerCase();
		start = start.toLowerCase();
	}
	return str.indexOf(start) == 0;
}

/**
 * Returns true if 'str' starts with any of the arguments[2 -> n]
 */
dojo.string.startsWithAny = function(str /* , ... */) {
	for(var i = 1; i < arguments.length; i++) {
		if(dojo.string.startsWith(str, arguments[i])) {
			return true;
		}
	}
	return false;
}

/**
 * Returns true if 'str' starts with any of the arguments 2 -> n
 */
dojo.string.has = function(str /* , ... */) {
	for(var i = 1; i < arguments.length; i++) {
		if(str.indexOf(arguments[i] > -1)) {
			return true;
		}
	}
	return false;
}

/**
 * Pad 'str' to guarantee that it is at least 'len' length
 * with the character 'c' at either the start (dir=1) or
 * end (dir=-1) of the string
 */
dojo.string.pad = function(str, len/*=2*/, c/*='0'*/, dir/*=1*/) {
	var out = String(str);
	if(!c) {
		c = '0';
	}
	if(!dir) {
		dir = 1;
	}
	while(out.length < len) {
		if(dir > 0) {
			out = c + out;
		} else {
			out += c;
		}
	}
	return out;
}

/** same as dojo.string.pad(str, len, c, 1) */
dojo.string.padLeft = function(str, len, c) {
	return dojo.string.pad(str, len, c, 1);
}

/** same as dojo.string.pad(str, len, c, -1) */
dojo.string.padRight = function(str, len, c) {
	return dojo.string.pad(str, len, c, -1);
}

dojo.string.normalizeNewlines = function (text,newlineChar) {
	if (newlineChar == "\n") {
		text = text.replace(/\r\n/g, "\n");
		text = text.replace(/\r/g, "\n");
	} else if (newlineChar == "\r") {
		text = text.replace(/\r\n/g, "\r");
		text = text.replace(/\n/g, "\r");
	} else {
		text = text.replace(/([^\r])\n/g, "$1\r\n");
		text = text.replace(/\r([^\n])/g, "\r\n$1");
	}
	return text;
}

dojo.string.splitEscaped = function (str,charac) {
	var components = [];
	for (var i = 0, prevcomma = 0; i < str.length; i++) {
		if (str.charAt(i) == '\\') { i++; continue; }
		if (str.charAt(i) == charac) {
			components.push(str.substring(prevcomma, i));
			prevcomma = i + 1;
		}
	}
	components.push(str.substr(prevcomma));
	return components;
}


// do we even want to offer this? is it worth it?
dojo.string.addToPrototype = function() {
	for(var method in dojo.string) {
		if(dojo.lang.isFunction(dojo.string[method])) {
			var func = (function() {
				var meth = method;
				switch(meth) {
					case "addToPrototype":
						return null;
						break;
					case "escape":
						return function(type) {
							return dojo.string.escape(type, this);
						}
						break;
					default:
						return function() {
							var args = [this];
							for(var i = 0; i < arguments.length; i++) {
								args.push(arguments[i]);
							}
							dojo.debug(args);
							return dojo.string[meth].apply(dojo.string, args);
						}
				}
			})();
			if(func) { String.prototype[method] = func; }
		}
	}
}

dojo.provide("dojo.math");

dojo.math.degToRad = function (x) { return (x*Math.PI) / 180; }
dojo.math.radToDeg = function (x) { return (x*180) / Math.PI; }

dojo.math.factorial = function (n) {
	if(n<1){ return 0; }
	var retVal = 1;
	for(var i=1;i<=n;i++){ retVal *= i; }
	return retVal;
}

//The number of ways of obtaining an ordered subset of k elements from a set of n elements
dojo.math.permutations = function (n,k) {
	if(n==0 || k==0) return 1;
	return (dojo.math.factorial(n) / dojo.math.factorial(n-k));
}

//The number of ways of picking n unordered outcomes from r possibilities
dojo.math.combinations = function (n,r) {
	if(n==0 || r==0) return 1;
	return (dojo.math.factorial(n) / (dojo.math.factorial(n-r) * dojo.math.factorial(r)));
}

dojo.math.bernstein = function (t,n,i) {
	return (dojo.math.combinations(n,i) * Math.pow(t,i) * Math.pow(1-t,n-i));
}

/**
 * Returns random numbers with a Gaussian distribution, with the mean set at
 * 0 and the variance set at 1.
 *
 * @return A random number from a Gaussian distribution
 */
dojo.math.gaussianRandom = function () {
	var k = 2;
	do {
		var i = 2 * Math.random() - 1;
		var j = 2 * Math.random() - 1;
		k = i * i + j * j;
	} while (k >= 1);
	k = Math.sqrt((-2 * Math.log(k)) / k);
	return i * k;
}

/**
 * Calculates the mean of an Array of numbers.
 *
 * @return The mean of the numbers in the Array
 */
dojo.math.mean = function () {
	var array = dojo.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	var mean = 0;
	for (var i = 0; i < array.length; i++) { mean += array[i]; }
	return mean / array.length;
}

/**
 * Extends Math.round by adding a second argument specifying the number of
 * decimal places to round to.
 *
 * @param number The number to round
 * @param places The number of decimal places to round to
 * @return The rounded number
 */
// TODO: add support for significant figures
dojo.math.round = function (number, places) {
	if (!places) { var shift = 1; }
	else { var shift = Math.pow(10, places); }
	return Math.round(number * shift) / shift;
}

/**
 * Calculates the standard deviation of an Array of numbers
 *
 * @return The standard deviation of the numbers
 */
dojo.math.sd = function () {
	var array = dojo.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	return Math.sqrt(dojo.math.variance(array));
}

/**
 * Calculates the variance of an Array of numbers
 *
 * @return The variance of the numbers
 */
dojo.math.variance = function () {
	var array = dojo.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	var mean = 0, squares = 0;
	for (var i = 0; i < array.length; i++) {
		mean += array[i];
		squares += Math.pow(array[i], 2);
	}
	return (squares / array.length)
		- Math.pow(mean / array.length, 2);
}

/**
 * Like range() in python
**/
dojo.math.range = function(a, b, step) {
    if(arguments.length < 2) {
        b = a;
        a = 0;
    }
    if(arguments.length < 3) {
        step = 1;
    }

    var range = [];
    if(step > 0) {
        for(var i = a; i < b; i += step) {
            range.push(i);
        }
    } else if(step < 0) {
        for(var i = a; i > b; i += step) {
            range.push(i);
        }
    } else {
        throw new Error("dojo.math.range: step must be non-zero");
    }
    return range;
}

dojo.provide("dojo.graphics.color");
dojo.require("dojo.lang");
dojo.require("dojo.string");
dojo.require("dojo.math");

// TODO: rewrite the "x2y" methods to take advantage of the parsing
//       abilities of the Color object. Also, beef up the Color
//       object (as possible) to parse most common formats

// takes an r, g, b, a(lpha) value, [r, g, b, a] array, "rgb(...)" string, hex string (#aaa, #aaaaaa, aaaaaaa)
dojo.graphics.color.Color = function(r, g, b, a) {
	// dojo.debug("r:", r[0], "g:", r[1], "b:", r[2]);
	if(dojo.lang.isArray(r)) {
		this.r = r[0];
		this.g = r[1];
		this.b = r[2];
		this.a = r[3]||1.0;
	} else if(dojo.lang.isString(r)) {
		var rgb = dojo.graphics.color.extractRGB(r);
		this.r = rgb[0];
		this.g = rgb[1];
		this.b = rgb[2];
		this.a = g||1.0;
	} else if(r instanceof dojo.graphics.color.Color) {
		this.r = r.r;
		this.b = r.b;
		this.g = r.g;
		this.a = r.a;
	} else {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
}

dojo.lang.extend(dojo.graphics.color.Color, {
	toRgb: function(includeAlpha) {
		if(includeAlpha) {
			return this.toRgba();
		} else {
			return [this.r, this.g, this.b];
		}
	},

	toRgba: function() {
		return [this.r, this.g, this.b, this.a];
	},

	toHex: function() {
		return dojo.graphics.color.rgb2hex(this.toRgb());
	},

	toCss: function() {
		return "rgb(" + this.toRgb().join() + ")";
	},

	toString: function() {
		return this.toHex(); // decent default?
	},

	toHsv: function() {
		return dojo.graphics.color.rgb2hsv(this.toRgb());
	},

	toHsl: function() {
		return dojo.graphics.color.rgb2hsl(this.toRgb());
	},

	blend: function(color, weight) {
		return dojo.graphics.color.blend(this.toRgb(), new Color(color).toRgb(), weight);
	}
});

dojo.graphics.color.named = {
	white:      [255,255,255],
	black:      [0,0,0],
	red:        [255,0,0],
	green:	    [0,255,0],
	blue:       [0,0,255],
	navy:       [0,0,128],
	gray:       [128,128,128],
	silver:     [192,192,192]
};

// blend colors a and b (both as RGB array or hex strings) with weight from -1 to +1, 0 being a 50/50 blend
dojo.graphics.color.blend = function(a, b, weight) {
	if(typeof a == "string") { return dojo.graphics.color.blendHex(a, b, weight); }
	if(!weight) { weight = 0; }
	else if(weight > 1) { weight = 1; }
	else if(weight < -1) { weight = -1; }
	var c = new Array(3);
	for(var i = 0; i < 3; i++) {
		var half = Math.abs(a[i] - b[i])/2;
		c[i] = Math.floor(Math.min(a[i], b[i]) + half + (half * weight));
	}
	return c;
}

// very convenient blend that takes and returns hex values
// (will get called automatically by blend when blend gets strings)
dojo.graphics.color.blendHex = function(a, b, weight) {
	return dojo.graphics.color.rgb2hex(dojo.graphics.color.blend(dojo.graphics.color.hex2rgb(a), dojo.graphics.color.hex2rgb(b), weight));
}

// get RGB array from css-style color declarations
dojo.graphics.color.extractRGB = function(color) {
	var hex = "0123456789abcdef";
	color = color.toLowerCase();
	if( color.indexOf("rgb") == 0 ) {
		var matches = color.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
		var ret = matches.splice(1, 3);
		return ret;
	} else {
		var colors = dojo.graphics.color.hex2rgb(color);
		if(colors) {
			return colors;
		} else {
			// named color (how many do we support?)
			return dojo.graphics.color.named[color] || [255, 255, 255];
		}
	}
}

dojo.graphics.color.hex2rgb = function(hex) {
	var hexNum = "0123456789ABCDEF";
	var rgb = new Array(3);
	if( hex.indexOf("#") == 0 ) { hex = hex.substring(1); }
	hex = hex.toUpperCase();
	if(hex.replace(new RegExp("["+hexNum+"]", "g"), "") != "") {
		return null;
	}
	if( hex.length == 3 ) {
		rgb[0] = hex.charAt(0) + hex.charAt(0)
		rgb[1] = hex.charAt(1) + hex.charAt(1)
		rgb[2] = hex.charAt(2) + hex.charAt(2);
	} else {
		rgb[0] = hex.substring(0, 2);
		rgb[1] = hex.substring(2, 4);
		rgb[2] = hex.substring(4);
	}
	for(var i = 0; i < rgb.length; i++) {
		rgb[i] = hexNum.indexOf(rgb[i].charAt(0)) * 16 + hexNum.indexOf(rgb[i].charAt(1));
	}
	return rgb;
}

dojo.graphics.color.rgb2hex = function(r, g, b) {
	if(dojo.lang.isArray(r)) {
		g = r[1] || 0;
		b = r[2] || 0;
		r = r[0] || 0;
	}
	return ["#",
		dojo.string.pad(r.toString(16), 2),
		dojo.string.pad(g.toString(16), 2),
		dojo.string.pad(b.toString(16), 2)].join("");
}

dojo.graphics.color.rgb2hsv = function(r, g, b){

	if (dojo.lang.isArray(r)) {
		b = r[2] || 0;
		g = r[1] || 0;
		r = r[0] || 0;
	}

	// r,g,b, each 0 to 255, to HSV.
	// h = 0.0 to 360.0 (corresponding to 0..360.0 degrees around hexcone)
	// s = 0.0 (shade of gray) to 1.0 (pure color)
	// v = 0.0 (black) to 1.0 {white)
	//
	// Based on C Code in "Computer Graphics -- Principles and Practice,"
	// Foley et al, 1996, p. 592. 
	//
	// our calculatuions are based on 'regular' values (0-360, 0-1, 0-1) 
	// but we return bytes values (0-255, 0-255, 0-255)

	var h = null;
	var s = null;
	var v = null;

	var min = Math.min(r, g, b);
	v = Math.max(r, g, b);

	var delta = v - min;

	// calculate saturation (0 if r, g and b are all 0)

	s = (v == 0) ? 0 : delta/v;

	if (s == 0){
		// achromatic: when saturation is, hue is undefined
		h = 0;
	}else{
		// chromatic
		if (r == v){
			// between yellow and magenta
			h = 60 * (g - b) / delta;
		}else{
			if (g == v){
				// between cyan and yellow
				h = 120 + 60 * (b - r) / delta;
			}else{
				if (b == v){
					// between magenta and cyan
					h = 240 + 60 * (r - g) / delta;
				}
			}
		}
		if (h < 0){
			h += 360;
		}
	}


	h = (h == 0) ? 360 : Math.ceil((h / 360) * 255);
	s = Math.ceil(s * 255);

	return [h, s, v];
}

dojo.graphics.color.hsv2rgb = function(h, s, v){
 
	if (dojo.lang.isArray(h)) {
		v = h[2] || 0;
		s = h[1] || 0;
		h = h[0] || 0;
	}

	h = (h / 255) * 360;
	if (h == 360){ h = 0;}

	s = s / 255;
	v = v / 255;

	// Based on C Code in "Computer Graphics -- Principles and Practice,"
	// Foley et al, 1996, p. 593.
	//
	// H = 0.0 to 360.0 (corresponding to 0..360 degrees around hexcone) 0 for S = 0
	// S = 0.0 (shade of gray) to 1.0 (pure color)
	// V = 0.0 (black) to 1.0 (white)

	var r = null;
	var g = null;
	var b = null;

	if (s == 0){
		// color is on black-and-white center line
		// achromatic: shades of gray
		r = v;
		g = v;
		b = v;
	}else{
		// chromatic color
		var hTemp = h / 60;		// h is now IN [0,6]
		var i = Math.floor(hTemp);	// largest integer <= h
		var f = hTemp - i;		// fractional part of h

		var p = v * (1 - s);
		var q = v * (1 - (s * f));
		var t = v * (1 - (s * (1 - f)));

		switch(i){
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}
	}

	r = Math.ceil(r * 255);
	g = Math.ceil(g * 255);
	b = Math.ceil(b * 255);

	return [r, g, b];
}

dojo.graphics.color.rgb2hsl = function(r, g, b){

	if (dojo.lang.isArray(r)) {
		b = r[2] || 0;
		g = r[1] || 0;
		r = r[0] || 0;
	}

	r /= 255;
	g /= 255;
	b /= 255;

	//
	// based on C code from http://astronomy.swin.edu.au/~pbourke/colour/hsl/
	//

	var h = null;
	var s = null;
	var l = null;


	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;

	l = (min + max) / 2;

	s = 0;

	if ((l > 0) && (l < 1)){
		s = delta / ((l < 0.5) ? (2 * l) : (2 - 2 * l));
	}

	h = 0;

	if (delta > 0) {
		if ((max == r) && (max != g)){
			h += (g - b) / delta;
		}
		if ((max == g) && (max != b)){
			h += (2 + (b - r) / delta);
		}
		if ((max == b) && (max != r)){
			h += (4 + (r - g) / delta);
		}
		h *= 60;
	}

	h = (h == 0) ? 360 : Math.ceil((h / 360) * 255);
	s = Math.ceil(s * 255);
	l = Math.ceil(l * 255);

	return [h, s, l];
}

dojo.graphics.color.hsl2rgb = function(h, s, l){
 
	if (dojo.lang.isArray(h)) {
		l = h[2] || 0;
		s = h[1] || 0;
		h = h[0] || 0;
	}

	h = (h / 255) * 360;
	if (h == 360){ h = 0;}
	s = s / 255;
	l = l / 255;

	//
	// based on C code from http://astronomy.swin.edu.au/~pbourke/colour/hsl/
	//


	while (h < 0){ h += 360; }
	while (h > 360){ h -= 360; }

	if (h < 120){
		r = (120 - h) / 60;
		g = h / 60;
		b = 0;
	}else if (h < 240){
		r = 0;
		g = (240 - h) / 60;
		b = (h - 120) / 60;
	}else{
		r = (h - 240) / 60;
		g = 0;
		b = (360 - h) / 60;
	}

	r = Math.min(r, 1);
	g = Math.min(g, 1);
	b = Math.min(b, 1);

	r = 2 * s * r + (1 - s);
	g = 2 * s * g + (1 - s);
	b = 2 * s * b + (1 - s);

	if (l < 0.5){
		r = l * r;
		g = l * g;
		b = l * b;
	}else{
		r = (1 - l) * r + 2 * l - 1;
		g = (1 - l) * g + 2 * l - 1;
		b = (1 - l) * b + 2 * l - 1;
	}

	r = Math.ceil(r * 255);
	g = Math.ceil(g * 255);
	b = Math.ceil(b * 255);

	return [r, g, b];
}

dojo.graphics.color.hsl2hex = function(h, s, l){
	var rgb = dojo.graphics.color.hsl2rgb(h, s, l);
	return dojo.graphics.color.rgb2hex(rgb[0], rgb[1], rgb[2]);
}

dojo.graphics.color.hex2hsl = function(hex){
	var rgb = dojo.graphics.color.hex2rgb(hex);
	return dojo.graphics.color.rgb2hsl(rgb[0], rgb[1], rgb[2]);
}

dojo.provide("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.uri.Uri");
dojo.require("dojo.graphics.color");

// values: content-box, border-box
dojo.style.boxSizing = {
	marginBox: "margin-box",
	borderBox: "border-box",
	paddingBox: "padding-box",
	contentBox: "content-box"
};

dojo.style.getBoxSizing = function(node) 
{
	if (dojo.render.html.ie || dojo.render.html.opera){ 
		var cm = document["compatMode"];
		if (cm == "BackCompat" || cm == "QuirksMode"){ 
			return dojo.style.boxSizing.borderBox; 
		}else{
			return dojo.style.boxSizing.contentBox; 
		}
	}else{
		if(arguments.length == 0){ node = document.documentElement; }
		var sizing = dojo.style.getStyle(node, "-moz-box-sizing");
		if(!sizing){ sizing = dojo.style.getStyle(node, "box-sizing"); }
		return (sizing ? sizing : dojo.style.boxSizing.contentBox);
	}
}

/*

The following several function use the dimensions shown below

    +-------------------------+
    |  margin                 |
    | +---------------------+ |
    | |  border             | |
    | | +-----------------+ | |
    | | |  padding        | | |
    | | | +-------------+ | | |
    | | | |   content   | | | |
    | | | +-------------+ | | |
    | | +-|-------------|-+ | |
    | +-|-|-------------|-|-+ |
    +-|-|-|-------------|-|-|-+
    | | | |             | | | |
    | | | |<- content ->| | | |
    | |<------ inner ------>| |
    |<-------- outer -------->|
    +-------------------------+

    * content-box

    |m|b|p|             |p|b|m|
    | |<------ offset ----->| |
    | | |<---- client --->| | |
    | | | |<-- width -->| | | |

    * border-box

    |m|b|p|             |p|b|m|
    | |<------ offset ----->| |
    | | |<---- client --->| | |
    | |<------ width ------>| |
*/

/*
	Notes:

	General:
		- Uncomputable values are returned as NaN.
		- setOuterWidth/Height return *false* if the outer size could not be computed, otherwise *true*.
		- I (sjmiles) know no way to find the calculated values for auto-margins. 
		- All returned values are floating point in 'px' units. If a non-zero computed style value is not specified in 'px', NaN is returned.

	FF:
		- styles specified as '0' (unitless 0) show computed as '0pt'.

	IE:
		- clientWidth/Height are unreliable (0 unless the object has 'layout').
		- margins must be specified in px, or 0 (in any unit) for any sizing function to work. Otherwise margins detect as 'auto'.
		- padding can be empty or, if specified, must be in px, or 0 (in any unit) for any sizing function to work.

	Safari:
		- Safari defaults padding values to 'auto'.

	See the unit tests for examples of (un)computable values in a given browser.

*/

// FIXME: these work for most elements (e.g. DIV) but not all (e.g. TEXTAREA)

dojo.style.isBorderBox = function(node)
{
	return (dojo.style.getBoxSizing(node) == dojo.style.boxSizing.borderBox);
}

dojo.style.getUnitValue = function (element, cssSelector, autoIsZero){
	var result = { value: 0, units: 'px' };
	var s = dojo.style.getComputedStyle(element, cssSelector);
	if (s == '' || (s == 'auto' && autoIsZero)){ return result; }
	if (dojo.lang.isUndefined(s)){ 
		result.value = NaN;
	}else{
		// FIXME: is regex inefficient vs. parseInt or some manual test? 
		var match = s.match(/([\d.]+)([a-z%]*)/i);
		if (!match){
			result.value = NaN;
		}else{
			result.value = Number(match[1]);
			result.units = match[2].toLowerCase();
		}
	}
	return result;		
}

dojo.style.getPixelValue = function (element, cssSelector, autoIsZero){
	var result = dojo.style.getUnitValue(element, cssSelector, autoIsZero);
	// FIXME: there is serious debate as to whether or not this is the right solution
	if(isNaN(result.value)){ return 0; }
	// FIXME: code exists for converting other units to px (see Dean Edward's IE7) 
	// but there are cross-browser complexities
	if((result.value)&&(result.units != 'px')){ return NaN; }
	return result.value;
}

dojo.style.getNumericStyle = dojo.style.getPixelValue; // backward compat

dojo.style.isPositionAbsolute = function(node){
	return (dojo.style.getComputedStyle(node, 'position') == 'absolute');
}

dojo.style.getMarginWidth = function(node){
	var autoIsZero = dojo.style.isPositionAbsolute(node);
	var left = dojo.style.getPixelValue(node, "margin-left", autoIsZero);
	var right = dojo.style.getPixelValue(node, "margin-right", autoIsZero);
	return left + right;
}

dojo.style.getBorderWidth = function(node){
	// the removed calculation incorrectly includes scrollbar
	//if (node.clientWidth){
	//	return node.offsetWidth - node.clientWidth;
	//}else
	{
		var left = (dojo.style.getStyle(node, 'border-left-style') == 'none' ? 0 : dojo.style.getPixelValue(node, "border-left-width"));
		var right = (dojo.style.getStyle(node, 'border-right-style') == 'none' ? 0 : dojo.style.getPixelValue(node, "border-right-width"));
		return left + right;
	}
}

dojo.style.getPaddingWidth = function(node){
	var left = dojo.style.getPixelValue(node, "padding-left", true);
	var right = dojo.style.getPixelValue(node, "padding-right", true);
	return left + right;
}

dojo.style.getContentWidth = function (node){
	return node.offsetWidth - dojo.style.getPaddingWidth(node) - dojo.style.getBorderWidth(node);
}

dojo.style.getInnerWidth = function (node){
	return node.offsetWidth;
}

dojo.style.getOuterWidth = function (node){
	return dojo.style.getInnerWidth(node) + dojo.style.getMarginWidth(node);
}

dojo.style.setOuterWidth = function (node, pxWidth){
	if (!dojo.style.isBorderBox(node)){
		pxWidth -= dojo.style.getPaddingWidth(node) + dojo.style.getBorderWidth(node);
	}
	pxWidth -= dojo.style.getMarginWidth(node);
	if (!isNaN(pxWidth) && pxWidth > 0){
		node.style.width = pxWidth + 'px';
		return true;
	}else return false;
}

// FIXME: these aliases are actually the preferred names
dojo.style.getContentBoxWidth = dojo.style.getContentWidth;
dojo.style.getBorderBoxWidth = dojo.style.getInnerWidth;
dojo.style.getMarginBoxWidth = dojo.style.getOuterWidth;
dojo.style.setMarginBoxWidth = dojo.style.setOuterWidth;

dojo.style.getMarginHeight = function(node){
	var autoIsZero = dojo.style.isPositionAbsolute(node);
	var top = dojo.style.getPixelValue(node, "margin-top", autoIsZero);
	var bottom = dojo.style.getPixelValue(node, "margin-bottom", autoIsZero);
	return top + bottom;
}

dojo.style.getBorderHeight = function(node){
	// this removed calculation incorrectly includes scrollbar
//	if (node.clientHeight){
//		return node.offsetHeight- node.clientHeight;
//	}else
	{		
		var top = (dojo.style.getStyle(node, 'border-top-style') == 'none' ? 0 : dojo.style.getPixelValue(node, "border-top-width"));
		var bottom = (dojo.style.getStyle(node, 'border-bottom-style') == 'none' ? 0 : dojo.style.getPixelValue(node, "border-bottom-width"));
		return top + bottom;
	}
}

dojo.style.getPaddingHeight = function(node){
	var top = dojo.style.getPixelValue(node, "padding-top", true);
	var bottom = dojo.style.getPixelValue(node, "padding-bottom", true);
	return top + bottom;
}

dojo.style.getContentHeight = function (node){
	return node.offsetHeight - dojo.style.getPaddingHeight(node) - dojo.style.getBorderHeight(node);
}

dojo.style.getInnerHeight = function (node){
	return node.offsetHeight; // FIXME: does this work?
}

dojo.style.getOuterHeight = function (node){
	return dojo.style.getInnerHeight(node) + dojo.style.getMarginHeight(node);
}

dojo.style.setOuterHeight = function (node, pxHeight){
	if (!dojo.style.isBorderBox(node)){
			pxHeight -= dojo.style.getPaddingHeight(node) + dojo.style.getBorderHeight(node);
	}
	pxHeight -= dojo.style.getMarginHeight(node);
	if (!isNaN(pxHeight) && pxHeight > 0){
		node.style.height = pxHeight + 'px';
		return true;
	}else return false;
}

dojo.style.setContentWidth = function(node, pxWidth){

	if (dojo.style.isBorderBox(node)){
		pxWidth += dojo.style.getPaddingWidth(node) + dojo.style.getBorderWidth(node);
	}

	if (!isNaN(pxWidth) && pxWidth > 0){
		node.style.width = pxWidth + 'px';
		return true;
	}else return false;
}

dojo.style.setContentHeight = function(node, pxHeight){

	if (dojo.style.isBorderBox(node)){
		pxHeight += dojo.style.getPaddingHeight(node) + dojo.style.getBorderHeight(node);
	}

	if (!isNaN(pxHeight) && pxHeight > 0){
		node.style.height = pxHeight + 'px';
		return true;
	}else return false;
}

// FIXME: these aliases are actually the preferred names
dojo.style.getContentBoxHeight = dojo.style.getContentHeight;
dojo.style.getBorderBoxHeight = dojo.style.getInnerHeight;
dojo.style.getMarginBoxHeight = dojo.style.getOuterHeight;
dojo.style.setMarginBoxHeight = dojo.style.setOuterHeight;

dojo.style.getTotalOffset = function (node, type, includeScroll){
	var typeStr = (type=="top") ? "offsetTop" : "offsetLeft";
	var typeScroll = (type=="top") ? "scrollTop" : "scrollLeft";
	
	var coord = (type=="top") ? "y" : "x";
	var offset = 0;
	if(node["offsetParent"]){
		
		// in Safari, if the node is an absolutly positioned child of the body
		// and the body has a margin the offset of the child and the body
		// contain the body's margins, so we need to end at the body
		if (dojo.render.html.safari
			&& node.style.getPropertyValue("position") == "absolute"
			&& node.parentNode == dojo.html.body())
		{
			var endNode = dojo.html.body();
		} else {
			var endNode = dojo.html.body().parentNode;
		}
		
		if(includeScroll && node.parentNode != document.body) {
			offset -= dojo.style.sumAncestorProperties(node, typeScroll);
		}
		// FIXME: this is known not to work sometimes on IE 5.x since nodes
		// soemtimes need to be "tickled" before they will display their
		// offset correctly
		do {
			offset += node[typeStr];
			node = node.offsetParent;
		} while (node != endNode && node != null);
	}else if(node[coord]){
		offset += node[coord];
	}
	return offset;
}

dojo.style.sumAncestorProperties = function (node, prop) {
	if (!node) { return 0; } // FIXME: throw an error?
	
	var retVal = 0;
	while (node) {
		var val = node[prop];
		if (val) {
			retVal += val - 0;
		}
		node = node.parentNode;
	}
	return retVal;
}

dojo.style.totalOffsetLeft = function (node, includeScroll){
	return dojo.style.getTotalOffset(node, "left", includeScroll);
}

dojo.style.getAbsoluteX = dojo.style.totalOffsetLeft;

dojo.style.totalOffsetTop = function (node, includeScroll){
	return dojo.style.getTotalOffset(node, "top", includeScroll);
}

dojo.style.getAbsoluteY = dojo.style.totalOffsetTop;

dojo.style.getAbsolutePosition = function(node, includeScroll) {
	var position = [
		dojo.style.getAbsoluteX(node, includeScroll),
		dojo.style.getAbsoluteY(node, includeScroll)
	];
	position.x = position[0];
	position.y = position[1];
	return position;
}

dojo.style.styleSheet = null;

// FIXME: this is a really basic stub for adding and removing cssRules, but
// it assumes that you know the index of the cssRule that you want to add 
// or remove, making it less than useful.  So we need something that can 
// search for the selector that you you want to remove.
dojo.style.insertCssRule = function (selector, declaration, index) {
	if (!dojo.style.styleSheet) {
		if (document.createStyleSheet) { // IE
			dojo.style.styleSheet = document.createStyleSheet();
		} else if (document.styleSheets[0]) { // rest
			// FIXME: should create a new style sheet here
			// fall back on an exsiting style sheet
			dojo.style.styleSheet = document.styleSheets[0];
		} else { return null; } // fail
	}

	if (arguments.length < 3) { // index may == 0
		if (dojo.style.styleSheet.cssRules) { // W3
			index = dojo.style.styleSheet.cssRules.length;
		} else if (dojo.style.styleSheet.rules) { // IE
			index = dojo.style.styleSheet.rules.length;
		} else { return null; } // fail
	}

	if (dojo.style.styleSheet.insertRule) { // W3
		var rule = selector + " { " + declaration + " }";
		return dojo.style.styleSheet.insertRule(rule, index);
	} else if (dojo.style.styleSheet.addRule) { // IE
		return dojo.style.styleSheet.addRule(selector, declaration, index);
	} else { return null; } // fail
}

dojo.style.removeCssRule = function (index){
	if(!dojo.style.styleSheet){
		dojo.debug("no stylesheet defined for removing rules");
		return false;
	}
	if(dojo.render.html.ie){
		if(!index){
			index = dojo.style.styleSheet.rules.length;
			dojo.style.styleSheet.removeRule(index);
		}
	}else if(document.styleSheets[0]){
		if(!index){
			index = dojo.style.styleSheet.cssRules.length;
		}
		dojo.style.styleSheet.deleteRule(index);
	}
	return true;
}

// calls css by XmlHTTP and inserts it into DOM as <style [widgetType="widgetType"]> *downloaded cssText*</style>
dojo.style.insertCssFile = function (URI, doc, checkDuplicates){
	if(!URI){ return; }
	if(!doc){ doc = document; }
	var cssStr = dojo.hostenv.getText(URI);
	var cssStr = dojo.style.fixPathsInCssText(cssStr, URI);

	if(checkDuplicates){
		var styles = doc.getElementsByTagName("style");
		var cssText = "";
		for(var i = 0; i<styles.length; i++){
			cssText = (styles[i].styleSheet && styles[i].styleSheet.cssText) ? styles[i].styleSheet.cssText : styles[i].innerHTML;
			if(cssStr == cssText){ return; }
		}
	}

	var style = dojo.style.insertCssText(cssStr);
	// insert custom attribute ex dbgHref="../foo.css" usefull when debugging in DOM inspectors, no?
	if(style && djConfig.isDebug){
		style.setAttribute("dbgHref", URI);
	}
	return style
}

// DomNode Style  = insertCssText(String ".dojoMenu {color: green;}"[, DomDoc document, dojo.uri.Uri Url ])
dojo.style.insertCssText = function(cssStr, doc, URI){
	if(!cssStr){ return; }
	if(!doc){ doc = document; }
	if(URI){// fix paths in cssStr
		cssStr = dojo.style.fixPathsInCssText(cssStr, URI);
	}
	var style = doc.createElement("style");
	style.setAttribute("type", "text/css");
	if(style.styleSheet){// IE
		style.styleSheet.cssText = cssStr;
	} else {// w3c
		var cssText = doc.createTextNode(cssStr);
		style.appendChild(cssText);
	}
	var head = doc.getElementsByTagName("head")[0];
	if(head){// must have a head tag
		head.appendChild(style);
	}
	return style;
}

// String cssText = fixPathsInCssText(String cssStr, dojo.uri.Uri URI)
// usage: cssText comes from dojoroot/src/widget/templates/HtmlFoobar.css
// 	it has .dojoFoo { background-image: url(images/bar.png);} 
//	then uri should point to dojoroot/src/widget/templates/
dojo.style.fixPathsInCssText = function(cssStr, URI){
	if(!cssStr || !URI){ return; }
	var pos = 0; var str = ""; var url = "";
	while(pos!=-1){
		pos = 0;url = "";
		pos = cssStr.indexOf("url(", pos);
		if(pos<0){ break; }
		str += cssStr.slice(0,pos+4);
		cssStr = cssStr.substring(pos+4, cssStr.length);
		url += cssStr.match(/^[\t\s\w()\/.\\'"-:#=&?]*\)/)[0]; // url string
		cssStr = cssStr.substring(url.length-1, cssStr.length); // remove url from css string til next loop
		url = url.replace(/^[\s\t]*(['"]?)([\w()\/.\\'"-:#=&?]*)\1[\s\t]*?\)/,"$2"); // clean string
		if(url.search(/(file|https?|ftps?):\/\//)==-1){
			url = (new dojo.uri.Uri(URI,url).toString());
		}
		str += url;
	};
	return str+cssStr;
}

dojo.style.getBackgroundColor = function (node) {
	var color;
	do{
		color = dojo.style.getStyle(node, "background-color");
		// Safari doesn't say "transparent"
		if(color.toLowerCase() == "rgba(0, 0, 0, 0)") { color = "transparent"; }
		if(node == document.getElementsByTagName("body")[0]) { node = null; break; }
		node = node.parentNode;
	}while(node && dojo.lang.inArray(color, ["transparent", ""]));

	if( color == "transparent" ) {
		color = [255, 255, 255, 0];
	} else {
		color = dojo.graphics.color.extractRGB(color);
	}
	return color;
}

dojo.style.getComputedStyle = function (element, cssSelector, inValue) {
	var value = inValue;
	if (element.style.getPropertyValue) { // W3
		value = element.style.getPropertyValue(cssSelector);
	}
	if(!value) {
		if (document.defaultView) { // gecko
			var cs = document.defaultView.getComputedStyle(element, "");
			if (cs) { 
				value = cs.getPropertyValue(cssSelector);
			} 
		} else if (element.currentStyle) { // IE
			value = element.currentStyle[dojo.style.toCamelCase(cssSelector)];
		} 
	}
	
	return value;
}

dojo.style.getStyle = function (element, cssSelector) {
	var camelCased = dojo.style.toCamelCase(cssSelector);
	var value = element.style[camelCased]; // dom-ish
	return (value ? value : dojo.style.getComputedStyle(element, cssSelector, value));
}

dojo.style.toCamelCase = function (selector) {
	var arr = selector.split('-'), cc = arr[0];
	for(var i = 1; i < arr.length; i++) {
		cc += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
	}
	return cc;		
}

dojo.style.toSelectorCase = function (selector) {
	return selector.replace(/([A-Z])/g, "-$1" ).toLowerCase() ;
}

/* float between 0.0 (transparent) and 1.0 (opaque) */
dojo.style.setOpacity = function setOpacity (node, opacity, dontFixOpacity) {
	node = dojo.byId(node);
	var h = dojo.render.html;
	if(!dontFixOpacity){
		if( opacity >= 1.0){
			if(h.ie){
				dojo.style.clearOpacity(node);
				return;
			}else{
				opacity = 0.999999;
			}
		}else if( opacity < 0.0){ opacity = 0; }
	}
	if(h.ie){
		if(node.nodeName.toLowerCase() == "tr"){
			// FIXME: is this too naive? will we get more than we want?
			var tds = node.getElementsByTagName("td");
			for(var x=0; x<tds.length; x++){
				tds[x].style.filter = "Alpha(Opacity="+opacity*100+")";
			}
		}
		node.style.filter = "Alpha(Opacity="+opacity*100+")";
	}else if(h.moz){
		node.style.opacity = opacity; // ffox 1.0 directly supports "opacity"
		node.style.MozOpacity = opacity;
	}else if(h.safari){
		node.style.opacity = opacity; // 1.3 directly supports "opacity"
		node.style.KhtmlOpacity = opacity;
	}else{
		node.style.opacity = opacity;
	}
}
	
dojo.style.getOpacity = function getOpacity (node){
	if(dojo.render.html.ie){
		var opac = (node.filters && node.filters.alpha &&
			typeof node.filters.alpha.opacity == "number"
			? node.filters.alpha.opacity : 100) / 100;
	}else{
		var opac = node.style.opacity || node.style.MozOpacity ||
			node.style.KhtmlOpacity || 1;
	}
	return opac >= 0.999999 ? 1.0 : Number(opac);
}

dojo.style.clearOpacity = function clearOpacity (node) {
	var h = dojo.render.html;
	if(h.ie){
		if( node.filters && node.filters.alpha ) {
			node.style.filter = ""; // FIXME: may get rid of other filter effects
		}
	}else if(h.moz){
		node.style.opacity = 1;
		node.style.MozOpacity = 1;
	}else if(h.safari){
		node.style.opacity = 1;
		node.style.KhtmlOpacity = 1;
	}else{
		node.style.opacity = 1;
	}
}

dojo.provide("dojo.html");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dojo.require("dojo.string");

dojo.lang.mixin(dojo.html, dojo.dom);
dojo.lang.mixin(dojo.html, dojo.style);

// FIXME: we are going to assume that we can throw any and every rendering
// engine into the IE 5.x box model. In Mozilla, we do this w/ CSS.
// Need to investigate for KHTML and Opera

dojo.html.clearSelection = function(){
	try{
		if(window["getSelection"]){ 
			if(dojo.render.html.safari){
				// pulled from WebCore/ecma/kjs_window.cpp, line 2536
				window.getSelection().collapse();
			}else{
				window.getSelection().removeAllRanges();
			}
		}else if(document.selection){
			if(document.selection.empty){
				document.selection.empty();
			}else if(document.selection.clear){
				document.selection.clear();
			}
		}
		return true;
	}catch(e){
		dojo.debug(e);
		return false;
	}
}

dojo.html.disableSelection = function(element){
	element = dojo.byId(element)||dojo.html.body();
	var h = dojo.render.html;
	
	if(h.mozilla){
		element.style.MozUserSelect = "none";
	}else if(h.safari){
		element.style.KhtmlUserSelect = "none"; 
	}else if(h.ie){
		element.unselectable = "on";
	}else{
		return false;
	}
	return true;
}

dojo.html.enableSelection = function(element){
	element = dojo.byId(element)||dojo.html.body();
	
	var h = dojo.render.html;
	if(h.mozilla){ 
		element.style.MozUserSelect = ""; 
	}else if(h.safari){
		element.style.KhtmlUserSelect = "";
	}else if(h.ie){
		element.unselectable = "off";
	}else{
		return false;
	}
	return true;
}

dojo.html.selectElement = function(element){
	element = dojo.byId(element);
	if(document.selection && dojo.html.body().createTextRange){ // IE
		var range = dojo.html.body().createTextRange();
		range.moveToElementText(element);
		range.select();
	}else if(window["getSelection"]){
		var selection = window.getSelection();
		// FIXME: does this work on Safari?
		if(selection["selectAllChildren"]){ // Mozilla
			selection.selectAllChildren(element);
		}
	}
}

dojo.html.isSelectionCollapsed = function(){
	if(document["selection"]){ // IE
		return document.selection.createRange().text == "";
	}else if(window["getSelection"]){
		var selection = window.getSelection();
		if(dojo.lang.isString(selection)){ // Safari
			return selection == "";
		}else{ // Mozilla/W3
			return selection.isCollapsed;
		}
	}
}

dojo.html.getEventTarget = function(evt){
	if(!evt) { evt = window.event || {} };
	if(evt.srcElement) {
		return evt.srcElement;
	} else if(evt.target) {
		return evt.target;
	}
	return null;
}

// FIXME: should the next set of functions take an optional document to operate
// on so as to be useful for getting this information from iframes?
dojo.html.getScrollTop = function(){
	return document.documentElement.scrollTop || dojo.html.body().scrollTop || 0;
}

dojo.html.getScrollLeft = function(){
	return document.documentElement.scrollLeft || dojo.html.body().scrollLeft || 0;
}

dojo.html.getDocumentWidth = function(){
	dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
	return dojo.html.getViewportWidth();
}

dojo.html.getDocumentHeight = function(){
	dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
	return dojo.html.getViewportHeight();
}

dojo.html.getDocumentSize = function(){
	dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
	return dojo.html.getViewportSize();
}

dojo.html.getViewportWidth = function(){
	var w = 0;

	if(window.innerWidth){
		w = window.innerWidth;
	}

	if(dojo.exists(document, "documentElement.clientWidth")){
		// IE6 Strict
		var w2 = document.documentElement.clientWidth;
		// this lets us account for scrollbars
		if(!w || w2 && w2 < w) {
			w = w2;
		}
		return w;
	}

	if(document.body){
		// IE
		return document.body.clientWidth;
	}

	return 0;
}

dojo.html.getViewportHeight = function(){
	if (window.innerHeight){
		return window.innerHeight;
	}

	if (dojo.exists(document, "documentElement.clientHeight")){
		// IE6 Strict
		return document.documentElement.clientHeight;
	}

	if (document.body){
		// IE
		return document.body.clientHeight;
	}

	return 0;
}

dojo.html.getViewportSize = function(){
	var ret = [dojo.html.getViewportWidth(), dojo.html.getViewportHeight()];
	ret.w = ret[0];
	ret.h = ret[1];
	return ret;
}

dojo.html.getScrollOffset = function(){
	var ret = [0, 0];

	if(window.pageYOffset){
		ret = [window.pageXOffset, window.pageYOffset];
	}else if(dojo.exists(document, "documentElement.scrollTop")){
		ret = [document.documentElement.scrollLeft, document.documentElement.scrollTop];
	} else if(document.body){
		ret = [document.body.scrollLeft, document.body.scrollTop];
	}

	ret.x = ret[0];
	ret.y = ret[1];
	return ret;
}

dojo.html.getParentOfType = function(node, type){
	dojo.deprecated("dojo.html.getParentOfType has been deprecated in favor of dojo.html.getParentByType*");
	return dojo.html.getParentByType(node, type);
}

dojo.html.getParentByType = function(node, type) {
	var parent = dojo.byId(node);
	type = type.toLowerCase();
	while((parent)&&(parent.nodeName.toLowerCase()!=type)){
		if(parent==(document["body"]||document["documentElement"])){
			return null;
		}
		parent = parent.parentNode;
	}
	return parent;
}

// RAR: this function comes from nwidgets and is more-or-less unmodified.
// We should probably look ant Burst and f(m)'s equivalents
dojo.html.getAttribute = function(node, attr){
	node = dojo.byId(node);
	// FIXME: need to add support for attr-specific accessors
	if((!node)||(!node.getAttribute)){
		// if(attr !== 'nwType'){
		//	alert("getAttr of '" + attr + "' with bad node"); 
		// }
		return null;
	}
	var ta = typeof attr == 'string' ? attr : new String(attr);

	// first try the approach most likely to succeed
	var v = node.getAttribute(ta.toUpperCase());
	if((v)&&(typeof v == 'string')&&(v!="")){ return v; }

	// try returning the attributes value, if we couldn't get it as a string
	if(v && v.value){ return v.value; }

	// this should work on Opera 7, but it's a little on the crashy side
	if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
		return (node.getAttributeNode(ta)).value;
	}else if(node.getAttribute(ta)){
		return node.getAttribute(ta);
	}else if(node.getAttribute(ta.toLowerCase())){
		return node.getAttribute(ta.toLowerCase());
	}
	return null;
}
	
/**
 *	Determines whether or not the specified node carries a value for the
 *	attribute in question.
 */
dojo.html.hasAttribute = function(node, attr){
	node = dojo.byId(node);
	return dojo.html.getAttribute(node, attr) ? true : false;
}
	
/**
 * Returns the string value of the list of CSS classes currently assigned
 * directly to the node in question. Returns an empty string if no class attribute
 * is found;
 */
dojo.html.getClass = function(node){
	node = dojo.byId(node);
	if(!node){ return ""; }
	var cs = "";
	if(node.className){
		cs = node.className;
	}else if(dojo.html.hasAttribute(node, "class")){
		cs = dojo.html.getAttribute(node, "class");
	}
	return dojo.string.trim(cs);
}

/**
 * Returns an array of CSS classes currently assigned
 * directly to the node in question. Returns an empty array if no classes
 * are found;
 */
dojo.html.getClasses = function(node) {
	node = dojo.byId(node);
	var c = dojo.html.getClass(node);
	return (c == "") ? [] : c.split(/\s+/g);
}

/**
 * Returns whether or not the specified classname is a portion of the
 * class list currently applied to the node. Does not cover cascaded
 * styles, only classes directly applied to the node.
 */
dojo.html.hasClass = function(node, classname){
	node = dojo.byId(node);
	return dojo.lang.inArray(dojo.html.getClasses(node), classname);
}

/**
 * Adds the specified class to the beginning of the class list on the
 * passed node. This gives the specified class the highest precidence
 * when style cascading is calculated for the node. Returns true or
 * false; indicating success or failure of the operation, respectively.
 */
dojo.html.prependClass = function(node, classStr){
	node = dojo.byId(node);
	if(!node){ return false; }
	classStr += " " + dojo.html.getClass(node);
	return dojo.html.setClass(node, classStr);
}

/**
 * Adds the specified class to the end of the class list on the
 *	passed &node;. Returns &true; or &false; indicating success or failure.
 */
dojo.html.addClass = function(node, classStr){
	node = dojo.byId(node);
	if (!node) { return false; }
	if (dojo.html.hasClass(node, classStr)) {
	  return false;
	}
	classStr = dojo.string.trim(dojo.html.getClass(node) + " " + classStr);
	return dojo.html.setClass(node, classStr);
}

/**
 *	Clobbers the existing list of classes for the node, replacing it with
 *	the list given in the 2nd argument. Returns true or false
 *	indicating success or failure.
 */
dojo.html.setClass = function(node, classStr){
	node = dojo.byId(node);
	if(!node){ return false; }
	var cs = new String(classStr);
	try{
		if(typeof node.className == "string"){
			node.className = cs;
		}else if(node.setAttribute){
			node.setAttribute("class", classStr);
			node.className = cs;
		}else{
			return false;
		}
	}catch(e){
		dojo.debug("dojo.html.setClass() failed", e);
	}
	return true;
}

/**
 * Removes the className from the node;. Returns
 * true or false indicating success or failure.
 */ 
dojo.html.removeClass = function(node, classStr, allowPartialMatches){
	node = dojo.byId(node);
	if(!node){ return false; }
	var classStr = dojo.string.trim(new String(classStr));

	try{
		var cs = dojo.html.getClasses(node);
		var nca	= [];
		if(allowPartialMatches){
			for(var i = 0; i<cs.length; i++){
				if(cs[i].indexOf(classStr) == -1){ 
					nca.push(cs[i]);
				}
			}
		}else{
			for(var i=0; i<cs.length; i++){
				if(cs[i] != classStr){ 
					nca.push(cs[i]);
				}
			}
		}
		dojo.html.setClass(node, nca.join(" "));
	}catch(e){
		dojo.debug("dojo.html.removeClass() failed", e);
	}

	return true;
}

/**
 * Replaces 'oldClass' and adds 'newClass' to node
 */
dojo.html.replaceClass = function(node, newClass, oldClass) {
	node = dojo.byId(node);
	dojo.html.removeClass(node, oldClass);
	dojo.html.addClass(node, newClass);
}

// Enum type for getElementsByClass classMatchType arg:
dojo.html.classMatchType = {
	ContainsAll : 0, // all of the classes are part of the node's class (default)
	ContainsAny : 1, // any of the classes are part of the node's class
	IsOnly : 2 // only all of the classes are part of the node's class
}


/**
 * Returns an array of nodes for the given classStr, children of a
 * parent, and optionally of a certain nodeType
 */
dojo.html.getElementsByClass = function(classStr, parent, nodeType, classMatchType){
	parent = dojo.byId(parent);
	if(!parent){ parent = document; }
	var classes = classStr.split(/\s+/g);
	var nodes = [];
	if( classMatchType != 1 && classMatchType != 2 ) classMatchType = 0; // make it enum
	var reClass = new RegExp("(\\s|^)((" + classes.join(")|(") + "))(\\s|$)");

	// FIXME: doesn't have correct parent support!
	if(!nodeType){ nodeType = "*"; }
	var candidateNodes = parent.getElementsByTagName(nodeType);

	outer:
	for(var i = 0; i < candidateNodes.length; i++) {
		var node = candidateNodes[i];
		var nodeClasses = dojo.html.getClasses(node);
		if(nodeClasses.length == 0) { continue outer; }
		var matches = 0;

		for(var j = 0; j < nodeClasses.length; j++) {
			if( reClass.test(nodeClasses[j]) ) {
				if( classMatchType == dojo.html.classMatchType.ContainsAny ) {
					nodes.push(node);
					continue outer;
				} else {
					matches++;
				}
			} else {
				if( classMatchType == dojo.html.classMatchType.IsOnly ) {
					continue outer;
				}
			}
		}

		if( matches == classes.length ) {
			if( classMatchType == dojo.html.classMatchType.IsOnly && matches == nodeClasses.length ) {
				nodes.push(node);
			} else if( classMatchType == dojo.html.classMatchType.ContainsAll ) {
				nodes.push(node);
			}
		}
	}
	
	return nodes;
}
dojo.html.getElementsByClassName = dojo.html.getElementsByClass;

/**
 * Calculates the mouse's direction of gravity relative to the centre
 * of the given node.
 * <p>
 * If you wanted to insert a node into a DOM tree based on the mouse
 * position you might use the following code:
 * <pre>
 * if (gravity(node, e) & gravity.NORTH) { [insert before]; }
 * else { [insert after]; }
 * </pre>
 *
 * @param node The node
 * @param e		The event containing the mouse coordinates
 * @return		 The directions, NORTH or SOUTH and EAST or WEST. These
 *						 are properties of the function.
 */
dojo.html.gravity = function(node, e){
	node = dojo.byId(node);
	var mousex = e.pageX || e.clientX + dojo.html.body().scrollLeft;
	var mousey = e.pageY || e.clientY + dojo.html.body().scrollTop;
	
	with (dojo.html) {
		var nodecenterx = getAbsoluteX(node) + (getInnerWidth(node) / 2);
		var nodecentery = getAbsoluteY(node) + (getInnerHeight(node) / 2);
	}
	
	with (dojo.html.gravity) {
		return ((mousex < nodecenterx ? WEST : EAST) |
			(mousey < nodecentery ? NORTH : SOUTH));
	}
}

dojo.html.gravity.NORTH = 1;
dojo.html.gravity.SOUTH = 1 << 1;
dojo.html.gravity.EAST = 1 << 2;
dojo.html.gravity.WEST = 1 << 3;
	
dojo.html.overElement = function(element, e){
	element = dojo.byId(element);
	var mousex = e.pageX || e.clientX + dojo.html.body().scrollLeft;
	var mousey = e.pageY || e.clientY + dojo.html.body().scrollTop;
	
	with(dojo.html){
		var top = getAbsoluteY(element);
		var bottom = top + getInnerHeight(element);
		var left = getAbsoluteX(element);
		var right = left + getInnerWidth(element);
	}
	
	return (mousex >= left && mousex <= right &&
		mousey >= top && mousey <= bottom);
}

/**
 * Attempts to return the text as it would be rendered, with the line breaks
 * sorted out nicely. Unfinished.
 */
dojo.html.renderedTextContent = function(node){
	node = dojo.byId(node);
	var result = "";
	if (node == null) { return result; }
	for (var i = 0; i < node.childNodes.length; i++) {
		switch (node.childNodes[i].nodeType) {
			case 1: // ELEMENT_NODE
			case 5: // ENTITY_REFERENCE_NODE
				var display = "unknown";
				try {
					display = dojo.style.getStyle(node.childNodes[i], "display");
				} catch(E) {}
				switch (display) {
					case "block": case "list-item": case "run-in":
					case "table": case "table-row-group": case "table-header-group":
					case "table-footer-group": case "table-row": case "table-column-group":
					case "table-column": case "table-cell": case "table-caption":
						// TODO: this shouldn't insert double spaces on aligning blocks
						result += "\n";
						result += dojo.html.renderedTextContent(node.childNodes[i]);
						result += "\n";
						break;
					
					case "none": break;
					
					default:
						if(node.childNodes[i].tagName && node.childNodes[i].tagName.toLowerCase() == "br") {
							result += "\n";
						} else {
							result += dojo.html.renderedTextContent(node.childNodes[i]);
						}
						break;
				}
				break;
			case 3: // TEXT_NODE
			case 2: // ATTRIBUTE_NODE
			case 4: // CDATA_SECTION_NODE
				var text = node.childNodes[i].nodeValue;
				var textTransform = "unknown";
				try {
					textTransform = dojo.style.getStyle(node, "text-transform");
				} catch(E) {}
				switch (textTransform){
					case "capitalize": text = dojo.string.capitalize(text); break;
					case "uppercase": text = text.toUpperCase(); break;
					case "lowercase": text = text.toLowerCase(); break;
					default: break; // leave as is
				}
				// TODO: implement
				switch (textTransform){
					case "nowrap": break;
					case "pre-wrap": break;
					case "pre-line": break;
					case "pre": break; // leave as is
					default:
						// remove whitespace and collapse first space
						text = text.replace(/\s+/, " ");
						if (/\s$/.test(result)) { text.replace(/^\s/, ""); }
						break;
				}
				result += text;
				break;
			default:
				break;
		}
	}
	return result;
}

dojo.html.setActiveStyleSheet = function(title){
	var i, a, main;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++){
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")){
			a.disabled = true;
			if (a.getAttribute("title") == title) { a.disabled = false; }
		}
	}
}

dojo.html.getActiveStyleSheet = function(){
	var i, a;
	// FIXME: getElementsByTagName returns a live collection. This seems like a
	// bad key for iteration.
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++){
		if (a.getAttribute("rel").indexOf("style") != -1 &&
			a.getAttribute("title") && !a.disabled) { return a.getAttribute("title"); }
	}
	return null;
}

dojo.html.getPreferredStyleSheet = function(){
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++){
		if(a.getAttribute("rel").indexOf("style") != -1
			&& a.getAttribute("rel").indexOf("alt") == -1
			&& a.getAttribute("title")) { return a.getAttribute("title"); }
	}
	return null;
}

dojo.html.body = function(){
	return document.body || document.getElementsByTagName("body")[0];
}

dojo.html.createNodesFromText = function(txt, trim){
	if(trim) { txt = dojo.string.trim(txt); }

	var tn = document.createElement("div");
	// tn.style.display = "none";
	tn.style.visibility= "hidden";
	document.body.appendChild(tn);
	var tableType = "none";
	if((/^<t[dh][\s\r\n>]/i).test(dojo.string.trimStart(txt))) {
		txt = "<table><tbody><tr>" + txt + "</tr></tbody></table>";
		tableType = "cell";
	} else if((/^<tr[\s\r\n>]/i).test(dojo.string.trimStart(txt))) {
		txt = "<table><tbody>" + txt + "</tbody></table>";
		tableType = "row";
	} else if((/^<(thead|tbody|tfoot)[\s\r\n>]/i).test(dojo.string.trimStart(txt))) {
		txt = "<table>" + txt + "</table>";
		tableType = "section";
	}
	tn.innerHTML = txt;
	tn.normalize();

	var parent = null;
	switch(tableType) {
		case "cell":
			parent = tn.getElementsByTagName("tr")[0];
			break;
		case "row":
			parent = tn.getElementsByTagName("tbody")[0];
			break;
		case "section":
			parent = tn.getElementsByTagName("table")[0];
			break;
		default:
			parent = tn;
			break;
	}

	/* this doesn't make much sense, I'm assuming it just meant trim() so wrap was replaced with trim
	if(wrap){ 
		var ret = [];
		// start hack
		var fc = tn.firstChild;
		ret[0] = ((fc.nodeValue == " ")||(fc.nodeValue == "\t")) ? fc.nextSibling : fc;
		// end hack
		// tn.style.display = "none";
		document.body.removeChild(tn);
		return ret;
	}
	*/
	var nodes = [];
	for(var x=0; x<parent.childNodes.length; x++){
		nodes.push(parent.childNodes[x].cloneNode(true));
	}
	tn.style.display = "none"; // FIXME: why do we do this?
	document.body.removeChild(tn);
	return nodes;
}

// FIXME: this should be removed after 0.2 release
if(!dojo.evalObjPath("dojo.dom.createNodesFromText")){
	dojo.dom.createNodesFromText = function() {
		dojo.deprecated("dojo.dom.createNodesFromText", "use dojo.html.createNodesFromText instead");
		return dojo.html.createNodesFromText.apply(dojo.html, arguments);
	}
}

dojo.html.isVisible = function(node){
	node = dojo.byId(node);
	// FIXME: this should also look at visibility!
	return dojo.style.getComputedStyle(node||this.domNode, "display") != "none";
}

dojo.html.show  = function(node){
	node = dojo.byId(node);
	if(node.style){
		node.style.display = dojo.lang.inArray(['tr', 'td', 'th'], node.tagName.toLowerCase()) ? "" : "block";
	}
}

dojo.html.hide = function(node){
	node = dojo.byId(node);
	if(node.style){
		node.style.display = "none";
	}
}

dojo.html.toggleVisible = function(node) {
	if(dojo.html.isVisible(node)) {
		dojo.html.hide(node);
		return false;
	} else {
		dojo.html.show(node);
		return true;
	}
}

/**
 * Like dojo.dom.isTag, except case-insensitive
**/
dojo.html.isTag = function(node /* ... */) {
	node = dojo.byId(node);
	if(node && node.tagName) {
		var arr = dojo.lang.map(dojo.lang.toArray(arguments, 1),
			function(a) { return String(a).toLowerCase(); });
		return arr[ dojo.lang.find(node.tagName.toLowerCase(), arr) ] || "";
	}
	return "";
}

// in: coordinate array [x,y,w,h] or dom node
// return: coordinate array
dojo.html.toCoordinateArray = function(coords, includeScroll) {
	if(dojo.lang.isArray(coords)){
		// coords is already an array (of format [x,y,w,h]), just return it
		while ( coords.length < 4 ) { coords.push(0); }
		while ( coords.length > 4 ) { coords.pop(); }
		var ret = coords;
	} else {
		// coords is an dom object (or dom object id); return it's coordinates
		var node = dojo.byId(coords);
		var ret = [
			dojo.html.getAbsoluteX(node, includeScroll),
			dojo.html.getAbsoluteY(node, includeScroll),
			dojo.html.getInnerWidth(node),
			dojo.html.getInnerHeight(node)
		];
	}
	ret.x = ret[0];
	ret.y = ret[1];
	ret.w = ret[2];
	ret.h = ret[3];
	return ret;
};

/* TODO: merge placeOnScreen and placeOnScreenPoint to make 1 function that allows you
 * to define which corner(s) you want to bind to. Something like so:
 *
 * kes(node, desiredX, desiredY, "TR")
 * kes(node, [desiredX, desiredY], ["TR", "BL"])
 *
 * TODO: make this function have variable call sigs
 *
 * kes(node, ptArray, cornerArray, padding, hasScroll)
 * kes(node, ptX, ptY, cornerA, cornerB, cornerC, paddingArray, hasScroll)
 */

/**
 * Keeps 'node' in the visible area of the screen while trying to
 * place closest to desiredX, desiredY. The input coordinates are
 * expected to be the desired screen position, not accounting for
 * scrolling. If you already accounted for scrolling, set 'hasScroll'
 * to true. Set padding to either a number or array for [paddingX, paddingY]
 * to put some buffer around the element you want to position.
 * NOTE: node is assumed to be absolutely or relatively positioned.
 *
 * Alternate call sig:
 *  placeOnScreen(node, [x, y], padding, hasScroll)
 *
 * Examples:
 *  placeOnScreen(node, 100, 200)
 *  placeOnScreen("myId", [800, 623], 5)
 *  placeOnScreen(node, 234, 3284, [2, 5], true)
 */
dojo.html.placeOnScreen = function(node, desiredX, desiredY, padding, hasScroll) {
	if(dojo.lang.isArray(desiredX)) {
		hasScroll = padding;
		padding = desiredY;
		desiredY = desiredX[1];
		desiredX = desiredX[0];
	}

	if(!isNaN(padding)) {
		padding = [Number(padding), Number(padding)];
	} else if(!dojo.lang.isArray(padding)) {
		padding = [0, 0];
	}

	var scroll = dojo.html.getScrollOffset();
	var view = dojo.html.getViewportSize();

	node = dojo.byId(node);
	var w = node.offsetWidth + padding[0];
	var h = node.offsetHeight + padding[1];

	if(hasScroll) {
		desiredX -= scroll.x;
		desiredY -= scroll.y;
	}

	var x = desiredX + w;
	if(x > view.w) {
		x = view.w - w;
	} else {
		x = desiredX;
	}
	x = Math.max(padding[0], x) + scroll.x;

	var y = desiredY + h;
	if(y > view.h) {
		y = view.h - h;
	} else {
		y = desiredY;
	}
	y = Math.max(padding[1], y) + scroll.y;

	node.style.left = x + "px";
	node.style.top = y + "px";

	var ret = [x, y];
	ret.x = x;
	ret.y = y;
	return ret;
}

/**
 * Like placeOnScreenPoint except that it attempts to keep one of the node's
 * corners at desiredX, desiredY. Also note that padding is only taken into
 * account if none of the corners can be kept and thus placeOnScreenPoint falls
 * back to placeOnScreen to place the node.
 *
 * Examples placing node at mouse position (where e = [Mouse event]):
 *  placeOnScreenPoint(node, e.clientX, e.clientY);
 */
dojo.html.placeOnScreenPoint = function(node, desiredX, desiredY, padding, hasScroll) {
	if(dojo.lang.isArray(desiredX)) {
		hasScroll = padding;
		padding = desiredY;
		desiredY = desiredX[1];
		desiredX = desiredX[0];
	}

	var scroll = dojo.html.getScrollOffset();
	var view = dojo.html.getViewportSize();

	node = dojo.byId(node);
	var w = node.offsetWidth;
	var h = node.offsetHeight;

	if(hasScroll) {
		desiredX -= scroll.x;
		desiredY -= scroll.y;
	}

	var x = -1, y = -1;
	//dojo.debug(desiredX + w, "<=", view.w, "&&", desiredY + h, "<=", view.h);
	if(desiredX + w <= view.w && desiredY + h <= view.h) { // TL
		x = desiredX;
		y = desiredY;
		//dojo.debug("TL", x, y);
	}

	//dojo.debug(desiredX, "<=", view.w, "&&", desiredY + h, "<=", view.h);
	if((x < 0 || y < 0) && desiredX <= view.w && desiredY + h <= view.h) { // TR
		x = desiredX - w;
		y = desiredY;
		//dojo.debug("TR", x, y);
	}

	//dojo.debug(desiredX + w, "<=", view.w, "&&", desiredY, "<=", view.h);
	if((x < 0 || y < 0) && desiredX + w <= view.w && desiredY <= view.h) { // BL
		x = desiredX;
		y = desiredY - h;
		//dojo.debug("BL", x, y);
	}

	//dojo.debug(desiredX, "<=", view.w, "&&", desiredY, "<=", view.h);
	if((x < 0 || y < 0) && desiredX <= view.w && desiredY <= view.h) { // BR
		x = desiredX - w;
		y = desiredY - h;
		//dojo.debug("BR", x, y);
	}

	if(x < 0 || y < 0 || (x + w > view.w) || (y + h > view.h)) {
		return dojo.html.placeOnScreen(node, desiredX, desiredY, padding, hasScroll);
	}

	x += scroll.x;
	y += scroll.y;

	node.style.left = x + "px";
	node.style.top = y + "px";

	var ret = [x, y];
	ret.x = x;
	ret.y = y;
	return ret;
}

/**
 * For IE z-index schenanigans
 * See Dialog widget for sample use
 */
dojo.html.BackgroundIframe = function() {
	if(this.ie) {
		this.iframe = document.createElement("<iframe frameborder='0' src='about:blank'>");
		var s = this.iframe.style;
		s.position = "absolute";
		s.left = s.top = "0px";
		s.zIndex = 2;
		s.display = "none";
		dojo.style.setOpacity(this.iframe, 0.0);
		dojo.html.body().appendChild(this.iframe);
	} else {
		this.enabled = false;
	}
}
dojo.lang.extend(dojo.html.BackgroundIframe, {
	ie: dojo.render.html.ie,
	enabled: true,
	visibile: false,
	iframe: null,
	sizeNode: null,
	sizeCoords: null,

	size: function(node /* or coords */) {
		if(!this.ie || !this.enabled) { return; }

		if(dojo.dom.isNode(node)) {
			this.sizeNode = node;
		} else if(arguments.length > 0) {
			this.sizeNode = null;
			this.sizeCoords = node;
		}
		this.update();
	},

	update: function() {
		if(!this.ie || !this.enabled) { return; }

		if(this.sizeNode) {
			this.sizeCoords = dojo.html.toCoordinateArray(this.sizeNode, true);
		} else if(this.sizeCoords) {
			this.sizeCoords = dojo.html.toCoordinateArray(this.sizeCoords, true);
		} else {
			return;
		}

		var s = this.iframe.style;
		var dims = this.sizeCoords;
		s.width = dims.w + "px";
		s.height = dims.h + "px";
		s.left = dims.x + "px";
		s.top = dims.y + "px";
	},

	setZIndex: function(node /* or number */) {
		if(!this.ie || !this.enabled) { return; }

		if(dojo.dom.isNode(node)) {
			this.iframe.zIndex = dojo.html.getStyle(node, "z-index") - 1;
		} else if(!isNaN(node)) {
			this.iframe.zIndex = node;
		}
	},

	show: function(node /* or coords */) {
		if(!this.ie || !this.enabled) { return; }

		this.size(node);
		this.iframe.style.display = "block";
	},

	hide: function() {
		if(!this.ie) { return; }
		var s = this.iframe.style;
		s.display = "none";
		s.width = s.height = "1px";
	},

	remove: function() {
		dojo.dom.removeNode(this.iframe);
	}
});

dojo.provide("dojo.math.curves");

dojo.require("dojo.math");

/* Curves from Dan's 13th lib stuff.
 * See: http://pupius.co.uk/js/Toolkit.Drawing.js
 *      http://pupius.co.uk/dump/dojo/Dojo.Math.js
 */

dojo.math.curves = {
	//Creates a straight line object
	Line: function(start, end) {
		this.start = start;
		this.end = end;
		this.dimensions = start.length;

		for(var i = 0; i < start.length; i++) {
			start[i] = Number(start[i]);
		}

		for(var i = 0; i < end.length; i++) {
			end[i] = Number(end[i]);
		}

		//simple function to find point on an n-dimensional, straight line
		this.getValue = function(n) {
			var retVal = new Array(this.dimensions);
			for(var i=0;i<this.dimensions;i++)
				retVal[i] = ((this.end[i] - this.start[i]) * n) + this.start[i];
			return retVal;
		}

		return this;
	},


	//Takes an array of points, the first is the start point, the last is end point and the ones in
	//between are the Bezier control points.
	Bezier: function(pnts) {
		this.getValue = function(step) {
			if(step >= 1) return this.p[this.p.length-1];	// if step>=1 we must be at the end of the curve
			if(step <= 0) return this.p[0];					// if step<=0 we must be at the start of the curve
			var retVal = new Array(this.p[0].length);
			for(var k=0;j<this.p[0].length;k++) { retVal[k]=0; }
			for(var j=0;j<this.p[0].length;j++) {
				var C=0; var D=0;
				for(var i=0;i<this.p.length;i++) {
					C += this.p[i][j] * this.p[this.p.length-1][0]
						* dojo.math.bernstein(step,this.p.length,i);
				}
				for(var l=0;l<this.p.length;l++) {
					D += this.p[this.p.length-1][0] * dojo.math.bernstein(step,this.p.length,l);
				}
				retVal[j] = C/D;
			}
			return retVal;
		}
		this.p = pnts;
		return this;
	},


	//Catmull-Rom Spline - allows you to interpolate a smooth curve through a set of points in n-dimensional space
	CatmullRom : function(pnts,c) {
		this.getValue = function(step) {
			var percent = step * (this.p.length-1);
			var node = Math.floor(percent);
			var progress = percent - node;

			var i0 = node-1; if(i0 < 0) i0 = 0;
			var i = node;
			var i1 = node+1; if(i1 >= this.p.length) i1 = this.p.length-1;
			var i2 = node+2; if(i2 >= this.p.length) i2 = this.p.length-1;

			var u = progress;
			var u2 = progress*progress;
			var u3 = progress*progress*progress;

			var retVal = new Array(this.p[0].length);
			for(var k=0;k<this.p[0].length;k++) {
				var x1 = ( -this.c * this.p[i0][k] ) + ( (2 - this.c) * this.p[i][k] ) + ( (this.c-2) * this.p[i1][k] ) + ( this.c * this.p[i2][k] );
				var x2 = ( 2 * this.c * this.p[i0][k] ) + ( (this.c-3) * this.p[i][k] ) + ( (3 - 2 * this.c) * this.p[i1][k] ) + ( -this.c * this.p[i2][k] );
				var x3 = ( -this.c * this.p[i0][k] ) + ( this.c * this.p[i1][k] );
				var x4 = this.p[i][k];

				retVal[k] = x1*u3 + x2*u2 + x3*u + x4;
			}
			return retVal;

		}


		if(!c) this.c = 0.7;
		else this.c = c;
		this.p = pnts;

		return this;
	},

	// FIXME: This is the bad way to do a partial-arc with 2 points. We need to have the user
	// supply the radius, otherwise we always get a half-circle between the two points.
	Arc : function(start, end, ccw) {
		var center = dojo.math.points.midpoint(start, end);
		var sides = dojo.math.points.translate(dojo.math.points.invert(center), start);
		var rad = Math.sqrt(Math.pow(sides[0], 2) + Math.pow(sides[1], 2));
		var theta = dojo.math.radToDeg(Math.atan(sides[1]/sides[0]));
		if( sides[0] < 0 ) {
			theta -= 90;
		} else {
			theta += 90;
		}
		dojo.math.curves.CenteredArc.call(this, center, rad, theta, theta+(ccw?-180:180));
	},

	// Creates an arc object, with center and radius (Top of arc = 0 degrees, increments clockwise)
	//  center => 2D point for center of arc
	//  radius => scalar quantity for radius of arc
	//  start  => to define an arc specify start angle (default: 0)
	//  end    => to define an arc specify start angle
	CenteredArc : function(center, radius, start, end) {
		this.center = center;
		this.radius = radius;
		this.start = start || 0;
		this.end = end;

		this.getValue = function(n) {
			var retVal = new Array(2);
			var theta = dojo.math.degToRad(this.start+((this.end-this.start)*n));

			retVal[0] = this.center[0] + this.radius*Math.sin(theta);
			retVal[1] = this.center[1] - this.radius*Math.cos(theta);

			return retVal;
		}

		return this;
	},

	// Special case of Arc (start = 0, end = 360)
	Circle : function(center, radius) {
		dojo.math.curves.CenteredArc.call(this, center, radius, 0, 360);
		return this;
	},

	Path : function() {
		var curves = [];
		var weights = [];
		var ranges = [];
		var totalWeight = 0;

		this.add = function(curve, weight) {
			if( weight < 0 ) { dojo.raise("dojo.math.curves.Path.add: weight cannot be less than 0"); }
			curves.push(curve);
			weights.push(weight);
			totalWeight += weight;
			computeRanges();
		}

		this.remove = function(curve) {
			for(var i = 0; i < curves.length; i++) {
				if( curves[i] == curve ) {
					curves.splice(i, 1);
					totalWeight -= weights.splice(i, 1)[0];
					break;
				}
			}
			computeRanges();
		}

		this.removeAll = function() {
			curves = [];
			weights = [];
			totalWeight = 0;
		}

		this.getValue = function(n) {
			var found = false, value = 0;
			for(var i = 0; i < ranges.length; i++) {
				var r = ranges[i];
				//w(r.join(" ... "));
				if( n >= r[0] && n < r[1] ) {
					var subN = (n - r[0]) / r[2];
					value = curves[i].getValue(subN);
					found = true;
					break;
				}
			}

			// FIXME: Do we want to assume we're at the end?
			if( !found ) {
				value = curves[curves.length-1].getValue(1);
			}

			for(j = 0; j < i; j++) {
				value = dojo.math.points.translate(value, curves[j].getValue(1));
			}
			return value;
		}

		function computeRanges() {
			var start = 0;
			for(var i = 0; i < weights.length; i++) {
				var end = start + weights[i] / totalWeight;
				var len = end - start;
				ranges[i] = [start, end, len];
				start = end;
			}
		}

		return this;
	}
};

dojo.provide("dojo.animation");
dojo.provide("dojo.animation.Animation");

dojo.require("dojo.lang");
dojo.require("dojo.math");
dojo.require("dojo.math.curves");

/*
Animation package based off of Dan Pupius' work on Animations:
http://pupius.co.uk/js/Toolkit.Drawing.js
*/

dojo.animation.Animation = function(curve, duration, accel, repeatCount, rate) {
	// public properties
	if(dojo.lang.isArray(curve)) {
		curve = new dojo.math.curves.Line(curve[0], curve[1]);
	}
	this.curve = curve;
	this.duration = duration;
	this.repeatCount = repeatCount || 0;
	this.rate = rate || 25;
	if(accel) {
		if(dojo.lang.isFunction(accel.getValue)) {
			this.accel = accel;
		} else {
			var i = 0.35*accel+0.5;	// 0.15 <= i <= 0.85
			this.accel = new dojo.math.curves.CatmullRom([[0], [i], [1]], 0.45);
		}
	}
}
dojo.lang.extend(dojo.animation.Animation, {
	// public properties
	curve: null,
	duration: 0,
	repeatCount: 0,
	accel: null,

	// events
	onBegin: null,
	onAnimate: null,
	onEnd: null,
	onPlay: null,
	onPause: null,
	onStop: null,
	handler: null,

	// "private" properties
	_animSequence: null,
	_startTime: null,
	_endTime: null,
	_lastFrame: null,
	_timer: null,
	_percent: 0,
	_active: false,
	_paused: false,
	_startRepeatCount: 0,

	// public methods
	play: function(gotoStart) {
		if( gotoStart ) {
			clearTimeout(this._timer);
			this._active = false;
			this._paused = false;
			this._percent = 0;
		} else if( this._active && !this._paused ) {
			return;
		}

		this._startTime = new Date().valueOf();
		if( this._paused ) {
			this._startTime -= (this.duration * this._percent / 100);
		}
		this._endTime = this._startTime + this.duration;
		this._lastFrame = this._startTime;

		var e = new dojo.animation.AnimationEvent(this, null, this.curve.getValue(this._percent),
			this._startTime, this._startTime, this._endTime, this.duration, this._percent, 0);

		this._active = true;
		this._paused = false;

		if( this._percent == 0 ) {
			if(!this._startRepeatCount) {
				this._startRepeatCount = this.repeatCount;
			}
			e.type = "begin";
			if(typeof this.handler == "function") { this.handler(e); }
			if(typeof this.onBegin == "function") { this.onBegin(e); }
		}

		e.type = "play";
		if(typeof this.handler == "function") { this.handler(e); }
		if(typeof this.onPlay == "function") { this.onPlay(e); }

		if(this._animSequence) { this._animSequence._setCurrent(this); }

		//dojo.lang.hitch(this, cycle)();
		this._cycle();
	},

	pause: function() {
		clearTimeout(this._timer);
		if( !this._active ) { return; }
		this._paused = true;
		var e = new dojo.animation.AnimationEvent(this, "pause", this.curve.getValue(this._percent),
			this._startTime, new Date().valueOf(), this._endTime, this.duration, this._percent, 0);
		if(typeof this.handler == "function") { this.handler(e); }
		if(typeof this.onPause == "function") { this.onPause(e); }
	},

	playPause: function() {
		if( !this._active || this._paused ) {
			this.play();
		} else {
			this.pause();
		}
	},

	gotoPercent: function(pct, andPlay) {
		clearTimeout(this._timer);
		this._active = true;
		this._paused = true;
		this._percent = pct;
		if( andPlay ) { this.play(); }
	},

	stop: function(gotoEnd) {
		clearTimeout(this._timer);
		var step = this._percent / 100;
		if( gotoEnd ) {
			step = 1;
		}
		var e = new dojo.animation.AnimationEvent(this, "stop", this.curve.getValue(step),
			this._startTime, new Date().valueOf(), this._endTime, this.duration, this._percent, Math.round(fps));
		if(typeof this.handler == "function") { this.handler(e); }
		if(typeof this.onStop == "function") { this.onStop(e); }
		this._active = false;
		this._paused = false;
	},

	status: function() {
		if( this._active ) {
			return this._paused ? "paused" : "playing";
		} else {
			return "stopped";
		}
	},

	// "private" methods
	_cycle: function() {
		clearTimeout(this._timer);
		if( this._active ) {
			var curr = new Date().valueOf();
			var step = (curr - this._startTime) / (this._endTime - this._startTime);
			fps = 1000 / (curr - this._lastFrame);
			this._lastFrame = curr;

			if( step >= 1 ) {
				step = 1;
				this._percent = 100;
			} else {
				this._percent = step * 100;
			}
			
			// Perform accelleration
			if(this.accel && this.accel.getValue) {
				step = this.accel.getValue(step);
			}

			var e = new dojo.animation.AnimationEvent(this, "animate", this.curve.getValue(step),
				this._startTime, curr, this._endTime, this.duration, this._percent, Math.round(fps));

			if(typeof this.handler == "function") { this.handler(e); }
			if(typeof this.onAnimate == "function") { this.onAnimate(e); }

			if( step < 1 ) {
				this._timer = setTimeout(dojo.lang.hitch(this, "_cycle"), this.rate);
			} else {
				e.type = "end";
				this._active = false;
				if(typeof this.handler == "function") { this.handler(e); }
				if(typeof this.onEnd == "function") { this.onEnd(e); }

				if( this.repeatCount > 0 ) {
					this.repeatCount--;
					this.play(true);
				} else if( this.repeatCount == -1 ) {
					this.play(true);
				} else {
					if(this._startRepeatCount) {
						this.repeatCount = this._startRepeatCount;
						this._startRepeatCount = 0;
					}
					if( this._animSequence ) {
						this._animSequence._playNext();
					}
				}
			}
		}
	}
});

dojo.animation.AnimationEvent = function(anim, type, coords, sTime, cTime, eTime, dur, pct, fps) {
	this.type = type; // "animate", "begin", "end", "play", "pause", "stop"
	this.animation = anim;

	this.coords = coords;
	this.x = coords[0];
	this.y = coords[1];
	this.z = coords[2];

	this.startTime = sTime;
	this.currentTime = cTime;
	this.endTime = eTime;

	this.duration = dur;
	this.percent = pct;
	this.fps = fps;
};
dojo.lang.extend(dojo.animation.AnimationEvent, {
	coordsAsInts: function() {
		var cints = new Array(this.coords.length);
		for(var i = 0; i < this.coords.length; i++) {
			cints[i] = Math.round(this.coords[i]);
		}
		return cints;
	}
});

dojo.animation.AnimationSequence = function(repeatCount){
	this._anims = [];
	this.repeatCount = repeatCount || 0;
}

dojo.lang.extend(dojo.animation.AnimationSequence, {
	repeateCount: 0,

	_anims: [],
	_currAnim: -1,

	onBegin: null,
	onEnd: null,
	onNext: null,
	handler: null,

	add: function() {
		for(var i = 0; i < arguments.length; i++) {
			this._anims.push(arguments[i]);
			arguments[i]._animSequence = this;
		}
	},

	remove: function(anim) {
		for(var i = 0; i < this._anims.length; i++) {
			if( this._anims[i] == anim ) {
				this._anims[i]._animSequence = null;
				this._anims.splice(i, 1);
				break;
			}
		}
	},

	removeAll: function() {
		for(var i = 0; i < this._anims.length; i++) {
			this._anims[i]._animSequence = null;
		}
		this._anims = [];
		this._currAnim = -1;
	},

	clear: function() {
		this.removeAll();
	},

	play: function(gotoStart) {
		if( this._anims.length == 0 ) { return; }
		if( gotoStart || !this._anims[this._currAnim] ) {
			this._currAnim = 0;
		}
		if( this._anims[this._currAnim] ) {
			if( this._currAnim == 0 ) {
				var e = {type: "begin", animation: this._anims[this._currAnim]};
				if(typeof this.handler == "function") { this.handler(e); }
				if(typeof this.onBegin == "function") { this.onBegin(e); }
			}
			this._anims[this._currAnim].play(gotoStart);
		}
	},

	pause: function() {
		if( this._anims[this._currAnim] ) {
			this._anims[this._currAnim].pause();
		}
	},

	playPause: function() {
		if( this._anims.length == 0 ) { return; }
		if( this._currAnim == -1 ) { this._currAnim = 0; }
		if( this._anims[this._currAnim] ) {
			this._anims[this._currAnim].playPause();
		}
	},

	stop: function() {
		if( this._anims[this._currAnim] ) {
			this._anims[this._currAnim].stop();
		}
	},

	status: function() {
		if( this._anims[this._currAnim] ) {
			return this._anims[this._currAnim].status();
		} else {
			return "stopped";
		}
	},

	_setCurrent: function(anim) {
		for(var i = 0; i < this._anims.length; i++) {
			if( this._anims[i] == anim ) {
				this._currAnim = i;
				break;
			}
		}
	},

	_playNext: function() {
		if( this._currAnim == -1 || this._anims.length == 0 ) { return; }
		this._currAnim++;
		if( this._anims[this._currAnim] ) {
			var e = {type: "next", animation: this._anims[this._currAnim]};
			if(typeof this.handler == "function") { this.handler(e); }
			if(typeof this.onNext == "function") { this.onNext(e); }
			this._anims[this._currAnim].play(true);
		} else {
			var e = {type: "end", animation: this._anims[this._anims.length-1]};
			if(typeof this.handler == "function") { this.handler(e); }
			if(typeof this.onEnd == "function") { this.onEnd(e); }
			if(this.repeatCount > 0) {
				this._currAnim = 0;
				this.repeatCount--;
				this._anims[this._currAnim].play(true);
			} else if(this.repeatCount == -1) {
				this._currAnim = 0;
				this._anims[this._currAnim].play(true);
			} else {
				this._currAnim = -1;
			}
		}
	}
});

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.animation.Animation", false, false]
});
dojo.hostenv.moduleLoaded("dojo.animation.*");

dojo.require("dojo.lang");
dojo.provide("dojo.event");

dojo.event = new function(){
	this.canTimeout = dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);

	// FIXME: where should we put this method (not here!)?
	function interpolateArgs(args){
		var dl = dojo.lang;
		var ao = {
			srcObj: dj_global,
			srcFunc: null,
			adviceObj: dj_global,
			adviceFunc: null,
			aroundObj: null,
			aroundFunc: null,
			adviceType: (args.length>2) ? args[0] : "after",
			precedence: "last",
			once: false,
			delay: null,
			rate: 0,
			adviceMsg: false
		};

		switch(args.length){
			case 0: return;
			case 1: return;
			case 2:
				ao.srcFunc = args[0];
				ao.adviceFunc = args[1];
				break;
			case 3:
				if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isString(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
				}else if((dl.isString(args[1]))&&(dl.isString(args[2]))){
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
				}else if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isFunction(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					var tmpName  = dojo.lang.nameAnonFunc(args[2], ao.adviceObj);
					ao.adviceFunc = tmpName;
				}else if((dl.isFunction(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = dj_global;
					var tmpName  = dojo.lang.nameAnonFunc(args[0], ao.srcObj);
					ao.srcFunc = tmpName;
					ao.adviceObj = args[1];
					ao.adviceFunc = args[2];
				}
				break;
			case 4:
				if((dl.isObject(args[0]))&&(dl.isObject(args[2]))){
					// we can assume that we've got an old-style "connect" from
					// the sigslot school of event attachment. We therefore
					// assume after-advice.
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((dl.isString(args[0]))&&(dl.isString(args[1]))&&(dl.isObject(args[2]))){
					ao.adviceType = args[0];
					ao.srcObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((dl.isString(args[0]))&&(dl.isFunction(args[1]))&&(dl.isObject(args[2]))){
					ao.adviceType = args[0];
					ao.srcObj = dj_global;
					var tmpName  = dojo.lang.nameAnonFunc(args[1], dj_global);
					ao.srcFunc = tmpName;
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if(dl.isObject(args[1])){
					ao.srcObj = args[1];
					ao.srcFunc = args[2];
					ao.adviceObj = dj_global;
					ao.adviceFunc = args[3];
				}else if(dl.isObject(args[2])){
					ao.srcObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else{
					ao.srcObj = ao.adviceObj = ao.aroundObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
					ao.aroundFunc = args[3];
				}
				break;
			case 6:
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundFunc = args[5];
				ao.aroundObj = dj_global;
				break;
			default:
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundObj = args[5];
				ao.aroundFunc = args[6];
				ao.once = args[7];
				ao.delay = args[8];
				ao.rate = args[9];
				ao.adviceMsg = args[10];
				break;
		}

		if((typeof ao.srcFunc).toLowerCase() != "string"){
			ao.srcFunc = dojo.lang.getNameInObj(ao.srcObj, ao.srcFunc);
		}

		if((typeof ao.adviceFunc).toLowerCase() != "string"){
			ao.adviceFunc = dojo.lang.getNameInObj(ao.adviceObj, ao.adviceFunc);
		}

		if((ao.aroundObj)&&((typeof ao.aroundFunc).toLowerCase() != "string")){
			ao.aroundFunc = dojo.lang.getNameInObj(ao.aroundObj, ao.aroundFunc);
		}

		if(!ao.srcObj){
			dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
		}
		if(!ao.adviceObj){
			dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
		}
		return ao;
	}

	this.connect = function(){
		var ao = interpolateArgs(arguments);

		// FIXME: just doing a "getForMethod()" seems to be enough to put this into infinite recursion!!
		var mjp = dojo.event.MethodJoinPoint.getForMethod(ao.srcObj, ao.srcFunc);
		if(ao.adviceFunc){
			var mjp2 = dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj, ao.adviceFunc);
		}

		mjp.kwAddAdvice(ao);

		return mjp;	// advanced users might want to fsck w/ the join point
					// manually
	}

	this.connectBefore = function() {
		var args = ["before"];
		for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
		return this.connect.apply(this, args);
	}

	this.connectAround = function() {
		var args = ["around"];
		for(var i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
		return this.connect.apply(this, args);
	}

	this._kwConnectImpl = function(kwArgs, disconnect){
		var fn = (disconnect) ? "disconnect" : "connect";
		if(typeof kwArgs["srcFunc"] == "function"){
			kwArgs.srcObj = kwArgs["srcObj"]||dj_global;
			var tmpName  = dojo.lang.nameAnonFunc(kwArgs.srcFunc, kwArgs.srcObj);
			kwArgs.srcFunc = tmpName;
		}
		if(typeof kwArgs["adviceFunc"] == "function"){
			kwArgs.adviceObj = kwArgs["adviceObj"]||dj_global;
			var tmpName  = dojo.lang.nameAnonFunc(kwArgs.adviceFunc, kwArgs.adviceObj);
			kwArgs.adviceFunc = tmpName;
		}
		return dojo.event[fn](	(kwArgs["type"]||kwArgs["adviceType"]||"after"),
									kwArgs["srcObj"]||dj_global,
									kwArgs["srcFunc"],
									kwArgs["adviceObj"]||kwArgs["targetObj"]||dj_global,
									kwArgs["adviceFunc"]||kwArgs["targetFunc"],
									kwArgs["aroundObj"],
									kwArgs["aroundFunc"],
									kwArgs["once"],
									kwArgs["delay"],
									kwArgs["rate"],
									kwArgs["adviceMsg"]||false );
	}

	this.kwConnect = function(kwArgs){
		return this._kwConnectImpl(kwArgs, false);

	}

	this.disconnect = function(){
		var ao = interpolateArgs(arguments);
		if(!ao.adviceFunc){ return; } // nothing to disconnect
		var mjp = dojo.event.MethodJoinPoint.getForMethod(ao.srcObj, ao.srcFunc);
		return mjp.removeAdvice(ao.adviceObj, ao.adviceFunc, ao.adviceType, ao.once);
	}

	this.kwDisconnect = function(kwArgs){
		return this._kwConnectImpl(kwArgs, true);
	}
}

// exactly one of these is created whenever a method with a joint point is run,
// if there is at least one 'around' advice.
dojo.event.MethodInvocation = function(join_point, obj, args) {
	this.jp_ = join_point;
	this.object = obj;
	this.args = [];
	for(var x=0; x<args.length; x++){
		this.args[x] = args[x];
	}
	// the index of the 'around' that is currently being executed.
	this.around_index = -1;
}

dojo.event.MethodInvocation.prototype.proceed = function() {
	this.around_index++;
	if(this.around_index >= this.jp_.around.length){
		return this.jp_.object[this.jp_.methodname].apply(this.jp_.object, this.args);
		// return this.jp_.run_before_after(this.object, this.args);
	}else{
		var ti = this.jp_.around[this.around_index];
		var mobj = ti[0]||dj_global;
		var meth = ti[1];
		return mobj[meth].call(mobj, this);
	}
} 


dojo.event.MethodJoinPoint = function(obj, methname){
	this.object = obj||dj_global;
	this.methodname = methname;
	this.methodfunc = this.object[methname];
	this.before = [];
	this.after = [];
	this.around = [];
}

dojo.event.MethodJoinPoint.getForMethod = function(obj, methname) {
	// if(!(methname in obj)){
	if(!obj){ obj = dj_global; }
	if(!obj[methname]){
		// supply a do-nothing method implementation
		obj[methname] = function(){};
	}else if((!dojo.lang.isFunction(obj[methname]))&&(!dojo.lang.isAlien(obj[methname]))){
		return null; // FIXME: should we throw an exception here instead?
	}
	// we hide our joinpoint instance in obj[methname + '$joinpoint']
	var jpname = methname + "$joinpoint";
	var jpfuncname = methname + "$joinpoint$method";
	var joinpoint = obj[jpname];
	if(!joinpoint){
		var isNode = false;
		if(dojo.event["browser"]){
			if( (obj["attachEvent"])||
				(obj["nodeType"])||
				(obj["addEventListener"]) ){
				isNode = true;
				dojo.event.browser.addClobberNodeAttrs(obj, [jpname, jpfuncname, methname]);
			}
		}
		obj[jpfuncname] = obj[methname];
		// joinpoint = obj[jpname] = new dojo.event.MethodJoinPoint(obj, methname);
		joinpoint = obj[jpname] = new dojo.event.MethodJoinPoint(obj, jpfuncname);
		obj[methname] = function(){ 
			var args = [];

			if((isNode)&&(!arguments.length)&&(window.event)){
				args.push(dojo.event.browser.fixEvent(window.event));
			}else{
				for(var x=0; x<arguments.length; x++){
					if((x==0)&&(isNode)&&(dojo.event.browser.isEvent(arguments[x]))){
						args.push(dojo.event.browser.fixEvent(arguments[x]));
					}else{
						args.push(arguments[x]);
					}
				}
			}
			// return joinpoint.run.apply(joinpoint, arguments); 
			return joinpoint.run.apply(joinpoint, args); 
		}
	}
	return joinpoint;
}

dojo.lang.extend(dojo.event.MethodJoinPoint, {
	unintercept: function() {
		this.object[this.methodname] = this.methodfunc;
	},

	run: function() {
		var obj = this.object||dj_global;
		var args = arguments;

		// optimization. We only compute once the array version of the arguments
		// pseudo-arr in order to prevent building it each time advice is unrolled.
		var aargs = [];
		for(var x=0; x<args.length; x++){
			aargs[x] = args[x];
		}

		var unrollAdvice  = function(marr){ 
			if(!marr){
				dojo.debug("Null argument to unrollAdvice()");
				return;
			}
		  
			var callObj = marr[0]||dj_global;
			var callFunc = marr[1];
			
			if(!callObj[callFunc]){
				dojo.raise("function \"" + callFunc + "\" does not exist on \"" + callObj + "\"");
			}
			
			var aroundObj = marr[2]||dj_global;
			var aroundFunc = marr[3];
			var msg = marr[6];
			var undef;

			var to = {
				args: [],
				jp_: this,
				object: obj,
				proceed: function(){
					return callObj[callFunc].apply(callObj, to.args);
				}
			};
			to.args = aargs;

			var delay = parseInt(marr[4]);
			var hasDelay = ((!isNaN(delay))&&(marr[4]!==null)&&(typeof marr[4] != "undefined"));
			if(marr[5]){
				var rate = parseInt(marr[5]);
				var cur = new Date();
				var timerSet = false;
				if((marr["last"])&&((cur-marr.last)<=rate)){
					if(dojo.event.canTimeout){
						if(marr["delayTimer"]){
							clearTimeout(marr.delayTimer);
						}
						var tod = parseInt(rate*2); // is rate*2 naive?
						var mcpy = dojo.lang.shallowCopy(marr);
						marr.delayTimer = setTimeout(function(){
							// FIXME: on IE at least, event objects from the
							// browser can go out of scope. How (or should?) we
							// deal with it?
							mcpy[5] = 0;
							unrollAdvice(mcpy);
						}, tod);
					}
					return;
				}else{
					marr.last = cur;
				}
			}

			// FIXME: need to enforce rates for a connection here!

			if(aroundFunc){
				// NOTE: around advice can't delay since we might otherwise depend
				// on execution order!
				aroundObj[aroundFunc].call(aroundObj, to);
			}else{
				// var tmjp = dojo.event.MethodJoinPoint.getForMethod(obj, methname);
				if((hasDelay)&&((dojo.render.html)||(dojo.render.svg))){  // FIXME: the render checks are grotty!
					dj_global["setTimeout"](function(){
						if(msg){
							callObj[callFunc].call(callObj, to); 
						}else{
							callObj[callFunc].apply(callObj, args); 
						}
					}, delay);
				}else{ // many environments can't support delay!
					if(msg){
						callObj[callFunc].call(callObj, to); 
					}else{
						callObj[callFunc].apply(callObj, args); 
					}
				}
			}
		}

		if(this.before.length>0){
			dojo.lang.forEach(this.before, unrollAdvice, true);
		}

		var result;
		if(this.around.length>0){
			var mi = new dojo.event.MethodInvocation(this, obj, args);
			result = mi.proceed();
		}else if(this.methodfunc){
			result = this.object[this.methodname].apply(this.object, args);
		}

		if(this.after.length>0){
			dojo.lang.forEach(this.after, unrollAdvice, true);
		}

		return (this.methodfunc) ? result : null;
	},

	getArr: function(kind){
		var arr = this.after;
		// FIXME: we should be able to do this through props or Array.in()
		if((typeof kind == "string")&&(kind.indexOf("before")!=-1)){
			arr = this.before;
		}else if(kind=="around"){
			arr = this.around;
		}
		return arr;
	},

	kwAddAdvice: function(args){
		this.addAdvice(	args["adviceObj"], args["adviceFunc"], 
						args["aroundObj"], args["aroundFunc"], 
						args["adviceType"], args["precedence"], 
						args["once"], args["delay"], args["rate"], 
						args["adviceMsg"]);
	},

	addAdvice: function(	thisAdviceObj, thisAdvice, 
							thisAroundObj, thisAround, 
							advice_kind, precedence, 
							once, delay, rate, asMessage){
		var arr = this.getArr(advice_kind);
		if(!arr){
			dojo.raise("bad this: " + this);
		}

		var ao = [thisAdviceObj, thisAdvice, thisAroundObj, thisAround, delay, rate, asMessage];
		
		if(once){
			if(this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr) >= 0){
				return;
			}
		}

		if(precedence == "first"){
			arr.unshift(ao);
		}else{
			arr.push(ao);
		}
	},

	hasAdvice: function(thisAdviceObj, thisAdvice, advice_kind, arr){
		if(!arr){ arr = this.getArr(advice_kind); }
		var ind = -1;
		for(var x=0; x<arr.length; x++){
			if((arr[x][0] == thisAdviceObj)&&(arr[x][1] == thisAdvice)){
				ind = x;
			}
		}
		return ind;
	},

	removeAdvice: function(thisAdviceObj, thisAdvice, advice_kind, once){
		var arr = this.getArr(advice_kind);
		var ind = this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr);
		if(ind == -1){
			return false;
		}
		while(ind != -1){
			arr.splice(ind, 1);
			if(once){ break; }
			ind = this.hasAdvice(thisAdviceObj, thisAdvice, advice_kind, arr);
		}
		return true;
	}
});

dojo.require("dojo.event");
dojo.provide("dojo.event.topic");

dojo.event.topic = new function(){
	this.topics = {};

	this.getTopic = function(topicName){
		if(!this.topics[topicName]){
			this.topics[topicName] = new this.TopicImpl(topicName);
		}
		return this.topics[topicName];
	}

	this.registerPublisher = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.registerPublisher(obj, funcName);
	}

	this.subscribe = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.subscribe(obj, funcName);
	}

	this.unsubscribe = function(topic, obj, funcName){
		var topic = this.getTopic(topic);
		topic.unsubscribe(obj, funcName);
	}

	this.publish = function(topic, message){
		var topic = this.getTopic(topic);
		// if message is an array, we treat it as a set of arguments,
		// otherwise, we just pass on the arguments passed in as-is
		var args = [];
		if((arguments.length == 2)&&(message.length)&&(typeof message != "string")){
			args = message;
		}else{
			var args = [];
			for(var x=1; x<arguments.length; x++){
				args.push(arguments[x]);
			}
		}
		topic.sendMessage.apply(topic, args);
	}
}

dojo.event.topic.TopicImpl = function(topicName){
	this.topicName = topicName;
	var self = this;

	self.subscribe = function(listenerObject, listenerMethod){
		var tf = listenerMethod||listenerObject;
		var to = (!listenerMethod) ? dj_global : listenerObject;
		dojo.event.kwConnect({
			srcObj:		self, 
			srcFunc:	"sendMessage", 
			adviceObj:	to,
			adviceFunc: tf
		});
	}

	self.unsubscribe = function(listenerObject, listenerMethod){
		var tf = (!listenerMethod) ? listenerObject : listenerMethod;
		var to = (!listenerMethod) ? null : listenerObject;
		dojo.event.kwDisconnect({
			srcObj:		self, 
			srcFunc:	"sendMessage", 
			adviceObj:	to,
			adviceFunc: tf
		});
	}

	self.registerPublisher = function(publisherObject, publisherMethod){
		dojo.event.connect(publisherObject, publisherMethod, self, "sendMessage");
	}

	self.sendMessage = function(message){
		// The message has been propagated
	}
}


dojo.provide("dojo.event.browser");
dojo.require("dojo.event");

dojo_ie_clobber = new function(){
	this.clobberNodes = [];

	function nukeProp(node, prop){
		// try{ node.removeAttribute(prop); 	}catch(e){ /* squelch */ }
		try{ node[prop] = null; 			}catch(e){ /* squelch */ }
		try{ delete node[prop]; 			}catch(e){ /* squelch */ }
		// FIXME: JotLive needs this, but I'm not sure if it's too slow or not
		try{ node.removeAttribute(prop);	}catch(e){ /* squelch */ }
	}

	this.clobber = function(nodeRef){
		var na;
		var tna;
		if(nodeRef){
			tna = nodeRef.getElementsByTagName("*");
			na = [nodeRef];
			for(var x=0; x<tna.length; x++){
				// if we're gonna be clobbering the thing, at least make sure
				// we aren't trying to do it twice
				if(tna[x]["__doClobber__"]){
					na.push(tna[x]);
				}
			}
		}else{
			try{ window.onload = null; }catch(e){}
			na = (this.clobberNodes.length) ? this.clobberNodes : document.all;
		}
		tna = null;
		var basis = {};
		for(var i = na.length-1; i>=0; i=i-1){
			var el = na[i];
			if(el["__clobberAttrs__"]){
				for(var j=0; j<el.__clobberAttrs__.length; j++){
					nukeProp(el, el.__clobberAttrs__[j]);
				}
				nukeProp(el, "__clobberAttrs__");
				nukeProp(el, "__doClobber__");
			}
		}
		na = null;
	}
}

if(dojo.render.html.ie){
	window.onunload = function(){
		dojo_ie_clobber.clobber();
		try{
			if((dojo["widget"])&&(dojo.widget["manager"])){
				dojo.widget.manager.destroyAll();
			}
		}catch(e){}
		try{ window.onload = null; }catch(e){}
		try{ window.onunload = null; }catch(e){}
		dojo_ie_clobber.clobberNodes = [];
		// CollectGarbage();
	}
}

dojo.event.browser = new function(){

	var clobberIdx = 0;

	this.clean = function(node){
		if(dojo.render.html.ie){ 
			dojo_ie_clobber.clobber(node);
		}
	}

	this.addClobberNode = function(node){
		if(!node["__doClobber__"]){
			node.__doClobber__ = true;
			dojo_ie_clobber.clobberNodes.push(node);
			// this might not be the most efficient thing to do, but it's
			// much less error prone than other approaches which were
			// previously tried and failed
			node.__clobberAttrs__ = [];
		}
	}

	this.addClobberNodeAttrs = function(node, props){
		this.addClobberNode(node);
		for(var x=0; x<props.length; x++){
			node.__clobberAttrs__.push(props[x]);
		}
	}

	this.removeListener = function(node, evtName, fp, capture){
		if(!capture){ var capture = false; }
		evtName = evtName.toLowerCase();
		if(evtName.substr(0,2)=="on"){ evtName = evtName.substr(2); }
		// FIXME: this is mostly a punt, we aren't actually doing anything on IE
		if(node.removeEventListener){
			node.removeEventListener(evtName, fp, capture);
		}
	}

	this.addListener = function(node, evtName, fp, capture, dontFix){
		if(!node){ return; } // FIXME: log and/or bail?
		if(!capture){ var capture = false; }
		evtName = evtName.toLowerCase();
		if(evtName.substr(0,2)!="on"){ evtName = "on"+evtName; }

		if(!dontFix){
			// build yet another closure around fp in order to inject fixEvent
			// around the resulting event
			var newfp = function(evt){
				if(!evt){ evt = window.event; }
				var ret = fp(dojo.event.browser.fixEvent(evt));
				if(capture){
					dojo.event.browser.stopEvent(evt);
				}
				return ret;
			}
		}else{
			newfp = fp;
		}

		if(node.addEventListener){ 
			node.addEventListener(evtName.substr(2), newfp, capture);
			return newfp;
		}else{
			if(typeof node[evtName] == "function" ){
				var oldEvt = node[evtName];
				node[evtName] = function(e){
					oldEvt(e);
					return newfp(e);
				}
			}else{
				node[evtName]=newfp;
			}
			if(dojo.render.html.ie){
				this.addClobberNodeAttrs(node, [evtName]);
			}
			return newfp;
		}
	}

	this.isEvent = function(obj){
		// FIXME: event detection hack ... could test for additional attributes
		// if necessary
		return (typeof obj != "undefined")&&(typeof Event != "undefined")&&(obj.eventPhase);
		// Event does not support instanceof in Opera, otherwise:
		//return (typeof Event != "undefined")&&(obj instanceof Event);
	}

	this.currentEvent = null;
	
	this.callListener = function(listener, curTarget){
		if(typeof listener != 'function'){
			dojo.raise("listener not a function: " + listener);
		}
		dojo.event.browser.currentEvent.currentTarget = curTarget;
		return listener.call(curTarget, dojo.event.browser.currentEvent);
	}

	this.stopPropagation = function(){
		dojo.event.browser.currentEvent.cancelBubble = true;
	}

	this.preventDefault = function(){
	  dojo.event.browser.currentEvent.returnValue = false;
	}

	this.keys = {
		KEY_BACKSPACE: 8,
		KEY_TAB: 9,
		KEY_ENTER: 13,
		KEY_SHIFT: 16,
		KEY_CTRL: 17,
		KEY_ALT: 18,
		KEY_PAUSE: 19,
		KEY_CAPS_LOCK: 20,
		KEY_ESCAPE: 27,
		KEY_SPACE: 32,
		KEY_PAGE_UP: 33,
		KEY_PAGE_DOWN: 34,
		KEY_END: 35,
		KEY_HOME: 36,
		KEY_LEFT_ARROW: 37,
		KEY_UP_ARROW: 38,
		KEY_RIGHT_ARROW: 39,
		KEY_DOWN_ARROW: 40,
		KEY_INSERT: 45,
		KEY_DELETE: 46,
		KEY_LEFT_WINDOW: 91,
		KEY_RIGHT_WINDOW: 92,
		KEY_SELECT: 93,
		KEY_F1: 112,
		KEY_F2: 113,
		KEY_F3: 114,
		KEY_F4: 115,
		KEY_F5: 116,
		KEY_F6: 117,
		KEY_F7: 118,
		KEY_F8: 119,
		KEY_F9: 120,
		KEY_F10: 121,
		KEY_F11: 122,
		KEY_F12: 123,
		KEY_NUM_LOCK: 144,
		KEY_SCROLL_LOCK: 145
	};

	// reverse lookup
	this.revKeys = [];
	for(var key in this.keys){
		this.revKeys[this.keys[key]] = key;
	}

	this.fixEvent = function(evt){
		if((!evt)&&(window["event"])){
			var evt = window.event;
		}
		
		if((evt["type"])&&(evt["type"].indexOf("key") == 0)){ // key events
			evt.keys = this.revKeys;
			// FIXME: how can we eliminate this iteration?
			for(var key in this.keys) {
				evt[key] = this.keys[key];
			}
			if((dojo.render.html.ie)&&(evt["type"] == "keypress")){
				evt.charCode = evt.keyCode;
			}
		}
	
		if(dojo.render.html.ie){
			if(!evt.target){ evt.target = evt.srcElement; }
			if(!evt.currentTarget){ evt.currentTarget = evt.srcElement; }
			if(!evt.layerX){ evt.layerX = evt.offsetX; }
			if(!evt.layerY){ evt.layerY = evt.offsetY; }
			// mouseover
			if(evt.fromElement){ evt.relatedTarget = evt.fromElement; }
			// mouseout
			if(evt.toElement){ evt.relatedTarget = evt.toElement; }
			this.currentEvent = evt;
			evt.callListener = this.callListener;
			evt.stopPropagation = this.stopPropagation;
			evt.preventDefault = this.preventDefault;
		}
		return evt;
	}

	this.stopEvent = function(ev) {
		if(window.event){
			ev.returnValue = false;
			ev.cancelBubble = true;
		}else{
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.event", "dojo.event.topic"],
	browser: ["dojo.event.browser"]
});
dojo.hostenv.moduleLoaded("dojo.event.*");

dojo.provide("dojo.fx.html");

dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.lang");
dojo.require("dojo.animation.*");
dojo.require("dojo.event.*");
dojo.require("dojo.graphics.color");

dojo.fx.duration = 500;

dojo.fx.html._makeFadeable = function(node){
	if(dojo.render.html.ie){
		// only set the zoom if the "tickle" value would be the same as the
		// default
		if( (node.style.zoom.length == 0) &&
			(dojo.style.getStyle(node, "zoom") == "normal") ){
			// make sure the node "hasLayout"
			// NOTE: this has been tested with larger and smaller user-set text
			// sizes and works fine
			node.style.zoom = "1";
			// node.style.zoom = "normal";
		}
		// don't set the width to auto if it didn't already cascade that way.
		// We don't want to f anyones designs
		if(	(node.style.width.length == 0) &&
			(dojo.style.getStyle(node, "width") == "auto") ){
			node.style.width = "auto";
		}
	}
}

dojo.fx.html.fadeOut = function(node, duration, callback, dontPlay) {
	return dojo.fx.html.fade(node, duration, dojo.style.getOpacity(node), 0, callback, dontPlay);
};

dojo.fx.html.fadeIn = function(node, duration, callback, dontPlay) {
	return dojo.fx.html.fade(node, duration, dojo.style.getOpacity(node), 1, callback, dontPlay);
};

dojo.fx.html.fadeHide = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	if(!duration) { duration = 150; } // why not have a default?
	return dojo.fx.html.fadeOut(node, duration, function(node) {
		node.style.display = "none";
		if(typeof callback == "function") { callback(node); }
	});
};

dojo.fx.html.fadeShow = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	if(!duration) { duration = 150; } // why not have a default?
	node.style.display = "block";
	return dojo.fx.html.fade(node, duration, 0, 1, callback, dontPlay);
};

dojo.fx.html.fade = function(node, duration, startOpac, endOpac, callback, dontPlay) {
	node = dojo.byId(node);
	dojo.fx.html._makeFadeable(node);
	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line([startOpac],[endOpac]),
		duration||dojo.fx.duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		dojo.style.setOpacity(node, e.x);
	});
	if(callback) {
		dojo.event.connect(anim, "onEnd", function(e) {
			callback(node, anim);
		});
	}
	if(!dontPlay) { anim.play(true); }
	return anim;
};

dojo.fx.html.slideTo = function(node, duration, endCoords, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = endCoords;
		endCoords = tmp;
	}
	node = dojo.byId(node);

	var top = node.offsetTop;
	var left = node.offsetLeft;
	var pos = dojo.style.getComputedStyle(node, 'position');

	if (pos == 'relative' || pos == 'static') {
		top = parseInt(dojo.style.getComputedStyle(node, 'top')) || 0;
		left = parseInt(dojo.style.getComputedStyle(node, 'left')) || 0;
	}

	return dojo.fx.html.slide(node, duration, [left, top],
		endCoords, callback, dontPlay);
};

dojo.fx.html.slideBy = function(node, duration, coords, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = coords;
		coords = tmp;
	}
	node = dojo.byId(node);

	var top = node.offsetTop;
	var left = node.offsetLeft;
	var pos = dojo.style.getComputedStyle(node, 'position');

	if (pos == 'relative' || pos == 'static') {
		top = parseInt(dojo.style.getComputedStyle(node, 'top')) || 0;
		left = parseInt(dojo.style.getComputedStyle(node, 'left')) || 0;
	}

	return dojo.fx.html.slideTo(node, duration, [left+coords[0], top+coords[1]],
		callback, dontPlay);
};

dojo.fx.html.slide = function(node, duration, startCoords, endCoords, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = endCoords;
		endCoords = startCoords;
		startCoords = tmp;
	}
	node = dojo.byId(node);

	if (dojo.style.getComputedStyle(node, 'position') == 'static') {
		node.style.position = 'relative';
	}

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line(startCoords, endCoords),
		duration||dojo.fx.duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		with( node.style ) {
			left = e.x + "px";
			top = e.y + "px";
		}
	});
	if(callback) {
		dojo.event.connect(anim, "onEnd", function(e) {
			callback(node, anim);
		});
	}
	if(!dontPlay) { anim.play(true); }
	return anim;
};

// Fade from startColor to the node's background color
dojo.fx.html.colorFadeIn = function(node, duration, startColor, delay, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = startColor;
		startColor = tmp;
	}
	node = dojo.byId(node);
	var color = dojo.html.getBackgroundColor(node);
	var bg = dojo.style.getStyle(node, "background-color").toLowerCase();
	var wasTransparent = bg == "transparent" || bg == "rgba(0, 0, 0, 0)";
	while(color.length > 3) { color.pop(); }

	var rgb = new dojo.graphics.color.Color(startColor).toRgb();
	var anim = dojo.fx.html.colorFade(node, duration||dojo.fx.duration, startColor, color, callback, true);
	dojo.event.connect(anim, "onEnd", function(e) {
		if( wasTransparent ) {
			node.style.backgroundColor = "transparent";
		}
	});
	if( delay > 0 ) {
		node.style.backgroundColor = "rgb(" + rgb.join(",") + ")";
		if(!dontPlay) { setTimeout(function(){anim.play(true)}, delay); }
	} else {
		if(!dontPlay) { anim.play(true); }
	}
	return anim;
};
// alias for (probably?) common use/terminology
dojo.fx.html.highlight = dojo.fx.html.colorFadeIn;
dojo.fx.html.colorFadeFrom = dojo.fx.html.colorFadeIn;

// Fade from node's background color to endColor
dojo.fx.html.colorFadeOut = function(node, duration, endColor, delay, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = endColor;
		endColor = tmp;
	}
	node = dojo.byId(node);
	var color = new dojo.graphics.color.Color(dojo.html.getBackgroundColor(node)).toRgb();

	var rgb = new dojo.graphics.color.Color(endColor).toRgb();
	var anim = dojo.fx.html.colorFade(node, duration||dojo.fx.duration, color, rgb, callback, delay > 0 || dontPlay);
	if( delay > 0 ) {
		node.style.backgroundColor = "rgb(" + color.join(",") + ")";
		if(!dontPlay) { setTimeout(function(){anim.play(true)}, delay); }
	}
	return anim;
};
// FIXME: not sure which name is better. an alias here may be bad.
dojo.fx.html.unhighlight = dojo.fx.html.colorFadeOut;
dojo.fx.html.colorFadeTo = dojo.fx.html.colorFadeOut;

// Fade node background from startColor to endColor
dojo.fx.html.colorFade = function(node, duration, startColor, endColor, callback, dontPlay) {
	if(!dojo.lang.isNumber(duration)) {
		var tmp = duration;
		duration = endColor;
		endColor = startColor;
		startColor = tmp;
	}
	node = dojo.byId(node);
	var startRgb = new dojo.graphics.color.Color(startColor).toRgb();
	var endRgb = new dojo.graphics.color.Color(endColor).toRgb();
	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line(startRgb, endRgb),
		duration||dojo.fx.duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		node.style.backgroundColor = "rgb(" + e.coordsAsInts().join(",") + ")";
	});
	if(callback) {
		dojo.event.connect(anim, "onEnd", function(e) {
			callback(node, anim);
		});
	}
	if( !dontPlay ) { anim.play(true); }
	return anim;
};

dojo.fx.html.wipeShow = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	var overflow = dojo.html.getStyle(node, "overflow");
	node.style.overflow = "hidden";
	node.style.height = 0;
	dojo.html.show(node);
	var anim = new dojo.animation.Animation([[0], [node.scrollHeight]], duration||dojo.fx.duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		node.style.height = e.x + "px";
	});
	dojo.event.connect(anim, "onEnd", function() {
		node.style.overflow = overflow;
		node.style.height = "auto";
		if(callback) { callback(node, anim); }
	});
	if(!dontPlay) { anim.play(); }
	return anim;
}

dojo.fx.html.wipeHide = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	var overflow = dojo.html.getStyle(node, "overflow");
	node.style.overflow = "hidden";
	var anim = new dojo.animation.Animation([[node.offsetHeight], [0]], duration||dojo.fx.duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		node.style.height = e.x + "px";
	});
	dojo.event.connect(anim, "onEnd", function() {
		node.style.overflow = overflow;
		dojo.html.hide(node);
		if(callback) { callback(node, anim); }
	});
	if(!dontPlay) { anim.play(); }
	return anim;
}

dojo.fx.html.wiper = function(node, controlNode) {
	this.node = dojo.byId(node);
	if(controlNode) {
		dojo.event.connect(dojo.byId(controlNode), "onclick", this, "toggle");
	}
}
dojo.lang.extend(dojo.fx.html.wiper, {
	duration: dojo.fx.duration,
	_anim: null,

	toggle: function() {
		if(!this._anim) {
			var type = "wipe" + (dojo.html.isVisible(this.node) ? "Hide" : "Show");
			this._anim = dojo.fx[type](this.node, this.duration, dojo.lang.hitch(this, "_callback"));
		}
	},

	_callback: function() {
		this._anim = null;
	}
});

dojo.fx.html.wipeIn = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	var savedHeight = dojo.html.getStyle(node, "height");
	dojo.html.show(node);
	var height = node.offsetHeight;
	var anim = dojo.fx.html.wipeInToHeight(node, duration, height, function(e) {
		node.style.height = savedHeight || "auto";
		if(callback) { callback(node, anim); }
	}, dontPlay);
};

dojo.fx.html.wipeInToHeight = function(node, duration, height, callback, dontPlay) {
	node = dojo.byId(node);
	var savedOverflow = dojo.html.getStyle(node, "overflow");
	// FIXME: should we be setting display to something other than "" for the table elements?
	node.style.height = "0px";
	node.style.display = "none";
	if(savedOverflow == "visible") {
		node.style.overflow = "hidden";
	}
	var dispType = dojo.lang.inArray(node.tagName.toLowerCase(), ['tr', 'td', 'th']) ? "" : "block";
	node.style.display = dispType;

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line([0], [height]),
		duration||dojo.fx.duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		node.style.height = Math.round(e.x) + "px";
	});
	dojo.event.connect(anim, "onEnd", function(e) {
		if(savedOverflow != "visible") {
			node.style.overflow = savedOverflow;
		}
		if(callback) { callback(node, anim); }
	});
	if( !dontPlay ) { anim.play(true); }
	return anim;
}

dojo.fx.html.wipeOut = function(node, duration, callback, dontPlay) {
	node = dojo.byId(node);
	var savedOverflow = dojo.html.getStyle(node, "overflow");
	var savedHeight = dojo.html.getStyle(node, "height");
	var height = node.offsetHeight;
	node.style.overflow = "hidden";

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line([height], [0]),
		duration||dojo.fx.duration, 0);
	dojo.event.connect(anim, "onAnimate", function(e) {
		node.style.height = Math.round(e.x) + "px";
	});
	dojo.event.connect(anim, "onEnd", function(e) {
		node.style.display = "none";
		node.style.overflow = savedOverflow;
		node.style.height = savedHeight || "auto";
		if(callback) { callback(node, anim); }
	});
	if( !dontPlay ) { anim.play(true); }
	return anim;
};

dojo.fx.html.explode = function(start, endNode, duration, callback, dontPlay) {
	var startCoords = dojo.html.toCoordinateArray(start);

	var outline = document.createElement("div");
	with(outline.style) {
		position = "absolute";
		border = "1px solid black";
		display = "none";
	}
	dojo.html.body().appendChild(outline);

	endNode = dojo.byId(endNode);
	with(endNode.style) {
		visibility = "hidden";
		display = "block";
	}
	var endCoords = dojo.html.toCoordinateArray(endNode);

	with(endNode.style) {
		display = "none";
		visibility = "visible";
	}

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line(startCoords, endCoords),
		duration||dojo.fx.duration, 0
	);
	dojo.event.connect(anim, "onBegin", function(e) {
		outline.style.display = "block";
	});
	dojo.event.connect(anim, "onAnimate", function(e) {
		with(outline.style) {
			left = e.x + "px";
			top = e.y + "px";
			width = e.coords[2] + "px";
			height = e.coords[3] + "px";
		}
	});

	dojo.event.connect(anim, "onEnd", function() {
		endNode.style.display = "block";
		outline.parentNode.removeChild(outline);
		if(callback) { callback(endNode, anim); }
	});
	if(!dontPlay) { anim.play(); }
	return anim;
};

dojo.fx.html.implode = function(startNode, end, duration, callback, dontPlay) {
	var startCoords = dojo.html.toCoordinateArray(startNode);
	var endCoords = dojo.html.toCoordinateArray(end);

	startNode = dojo.byId(startNode);
	var outline = document.createElement("div");
	with(outline.style) {
		position = "absolute";
		border = "1px solid black";
		display = "none";
	}
	dojo.html.body().appendChild(outline);

	var anim = new dojo.animation.Animation(
		new dojo.math.curves.Line(startCoords, endCoords),
		duration||dojo.fx.duration, 0
	);
	dojo.event.connect(anim, "onBegin", function(e) {
		startNode.style.display = "none";
		outline.style.display = "block";
	});
	dojo.event.connect(anim, "onAnimate", function(e) {
		with(outline.style) {
			left = e.x + "px";
			top = e.y + "px";
			width = e.coords[2] + "px";
			height = e.coords[3] + "px";
		}
	});

	dojo.event.connect(anim, "onEnd", function() {
		outline.parentNode.removeChild(outline);
		if(callback) { callback(startNode, anim); }
	});
	if(!dontPlay) { anim.play(); }
	return anim;
};

dojo.fx.html.Exploder = function(triggerNode, boxNode) {
	triggerNode = dojo.byId(triggerNode);
	boxNode = dojo.byId(boxNode);
	var _this = this;

	// custom options
	this.waitToHide = 500;
	this.timeToShow = 100;
	this.waitToShow = 200;
	this.timeToHide = 70;
	this.autoShow = false;
	this.autoHide = false;

	var animShow = null;
	var animHide = null;

	var showTimer = null;
	var hideTimer = null;

	var startCoords = null;
	var endCoords = null;

	this.showing = false;

	this.onBeforeExplode = null;
	this.onAfterExplode = null;
	this.onBeforeImplode = null;
	this.onAfterImplode = null;
	this.onExploding = null;
	this.onImploding = null;

	this.timeShow = function() {
		clearTimeout(showTimer);
		showTimer = setTimeout(_this.show, _this.waitToShow);
	}

	this.show = function() {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		//triggerNode.blur();

		if( (animHide && animHide.status() == "playing")
			|| (animShow && animShow.status() == "playing")
			|| _this.showing ) { return; }

		if(typeof _this.onBeforeExplode == "function") { _this.onBeforeExplode(triggerNode, boxNode); }
		animShow = dojo.fx.html.explode(triggerNode, boxNode, _this.timeToShow, function(e) {
			_this.showing = true;
			if(typeof _this.onAfterExplode == "function") { _this.onAfterExplode(triggerNode, boxNode); }
		});
		if(typeof _this.onExploding == "function") {
			dojo.event.connect(animShow, "onAnimate", this, "onExploding");
		}
	}

	this.timeHide = function() {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		if(_this.showing) {
			hideTimer = setTimeout(_this.hide, _this.waitToHide);
		}
	}

	this.hide = function() {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		if( animShow && animShow.status() == "playing" ) {
			return;
		}

		_this.showing = false;
		if(typeof _this.onBeforeImplode == "function") { _this.onBeforeImplode(triggerNode, boxNode); }
		animHide = dojo.fx.html.implode(boxNode, triggerNode, _this.timeToHide, function(e){
			if(typeof _this.onAfterImplode == "function") { _this.onAfterImplode(triggerNode, boxNode); }
		});
		if(typeof _this.onImploding == "function") {
			dojo.event.connect(animHide, "onAnimate", this, "onImploding");
		}
	}

	// trigger events
	dojo.event.connect(triggerNode, "onclick", function(e) {
		if(_this.showing) {
			_this.hide();
		} else {
			_this.show();
		}
	});
	dojo.event.connect(triggerNode, "onmouseover", function(e) {
		if(_this.autoShow) {
			_this.timeShow();
		}
	});
	dojo.event.connect(triggerNode, "onmouseout", function(e) {
		if(_this.autoHide) {
			_this.timeHide();
		}
	});

	// box events
	dojo.event.connect(boxNode, "onmouseover", function(e) {
		clearTimeout(hideTimer);
	});
	dojo.event.connect(boxNode, "onmouseout", function(e) {
		if(_this.autoHide) {
			_this.timeHide();
		}
	});

	// document events
	dojo.event.connect(document.documentElement || dojo.html.body(), "onclick", function(e) {
		if(_this.autoHide && _this.showing
			&& !dojo.dom.isDescendantOf(e.target, boxNode)
			&& !dojo.dom.isDescendantOf(e.target, triggerNode) ) {
			_this.hide();
		}
	});

	return this;
};

dojo.lang.mixin(dojo.fx, dojo.fx.html);

dojo.hostenv.conditionalLoadModule({
	browser: ["dojo.fx.html"]
});
dojo.hostenv.moduleLoaded("dojo.fx.*");

dojo.provide("dojo.io.IO");
dojo.require("dojo.string");

/******************************************************************************
 *	Notes about dojo.io design:
 *	
 *	The dojo.io.* package has the unenviable task of making a lot of different
 *	types of I/O feel natural, despite a universal lack of good (or even
 *	reasonable!) I/O capability in the host environment. So lets pin this down
 *	a little bit further.
 *
 *	Rhino:
 *		perhaps the best situation anywhere. Access to Java classes allows you
 *		to do anything one might want in terms of I/O, both synchronously and
 *		async. Can open TCP sockets and perform low-latency client/server
 *		interactions. HTTP transport is available through Java HTTP client and
 *		server classes. Wish it were always this easy.
 *
 *	xpcshell:
 *		XPCOM for I/O. A cluster-fuck to be sure.
 *
 *	spidermonkey:
 *		S.O.L.
 *
 *	Browsers:
 *		Browsers generally do not provide any useable filesystem access. We are
 *		therefore limited to HTTP for moving information to and from Dojo
 *		instances living in a browser.
 *
 *		XMLHTTP:
 *			Sync or async, allows reading of arbitrary text files (including
 *			JS, which can then be eval()'d), writing requires server
 *			cooperation and is limited to HTTP mechanisms (POST and GET).
 *
 *		<iframe> hacks:
 *			iframe document hacks allow browsers to communicate asynchronously
 *			with a server via HTTP POST and GET operations. With significant
 *			effort and server cooperation, low-latency data transit between
 *			client and server can be acheived via iframe mechanisms (repubsub).
 *
 *		SVG:
 *			Adobe's SVG viewer implements helpful primitives for XML-based
 *			requests, but receipt of arbitrary text data seems unlikely w/o
 *			<![CDATA[]]> sections.
 *
 *
 *	A discussion between Dylan, Mark, Tom, and Alex helped to lay down a lot
 *	the IO API interface. A transcript of it can be found at:
 *		http://dojotoolkit.org/viewcvs/viewcvs.py/documents/irc/irc_io_api_log.txt?rev=307&view=auto
 *	
 *	Also referenced in the design of the API was the DOM 3 L&S spec:
 *		http://www.w3.org/TR/2004/REC-DOM-Level-3-LS-20040407/load-save.html
 ******************************************************************************/

// a map of the available transport options. Transports should add themselves
// by calling add(name)
dojo.io.transports = [];
dojo.io.hdlrFuncNames = [ "load", "error" ]; // we're omitting a progress() event for now

dojo.io.Request = function(url, mimetype, transport, changeUrl){
	if((arguments.length == 1)&&(arguments[0].constructor == Object)){
		this.fromKwArgs(arguments[0]);
	}else{
		this.url = url;
		if(mimetype){ this.mimetype = mimetype; }
		if(transport){ this.transport = transport; }
		if(arguments.length >= 4){ this.changeUrl = changeUrl; }
	}
}

dojo.lang.extend(dojo.io.Request, {

	/** The URL to hit */
	url: "",
	
	/** The mime type used to interrpret the response body */
	mimetype: "text/plain",
	
	/** The HTTP method to use */
	method: "GET",
	
	/** An Object containing key-value pairs to be included with the request */
	content: undefined, // Object
	
	/** The transport medium to use */
	transport: undefined, // String
	
	/** If defined the URL of the page is physically changed */
	changeUrl: undefined, // String
	
	/** A form node to use in the request */
	formNode: undefined, // HTMLFormElement
	
	/** Whether the request should be made synchronously */
	sync: false,
	
	bindSuccess: false,

	/** Cache/look for the request in the cache before attempting to request?
	 *  NOTE: this isn't a browser cache, this is internal and would only cache in-page
	 */
	useCache: false,

	/** Prevent the browser from caching this by adding a query string argument to the URL */
	preventCache: false,
	
	// events stuff
	load: function(type, data, evt){ },
	error: function(type, error){ },
	handle: function(){ },

	// the abort method needs to be filled in by the transport that accepts the
	// bind() request
	abort: function(){ },
	
	// backButton: function(){ },
	// forwardButton: function(){ },

	fromKwArgs: function(kwArgs){
		// normalize args
		if(kwArgs["url"]){ kwArgs.url = kwArgs.url.toString(); }
		if(!kwArgs["method"] && kwArgs["formNode"] && kwArgs["formNode"].method) {
			kwArgs.method = kwArgs["formNode"].method;
		}
		
		// backwards compatibility
		if(!kwArgs["handle"] && kwArgs["handler"]){ kwArgs.handle = kwArgs.handler; }
		if(!kwArgs["load"] && kwArgs["loaded"]){ kwArgs.load = kwArgs.loaded; }
		if(!kwArgs["changeUrl"] && kwArgs["changeURL"]) { kwArgs.changeUrl = kwArgs.changeURL; }

		// encoding fun!
		kwArgs.encoding = dojo.lang.firstValued(kwArgs["encoding"], djConfig["bindEncoding"], "");

		kwArgs.sendTransport = dojo.lang.firstValued(kwArgs["sendTransport"], djConfig["ioSendTransport"], true);

		var isFunction = dojo.lang.isFunction;
		for(var x=0; x<dojo.io.hdlrFuncNames.length; x++){
			var fn = dojo.io.hdlrFuncNames[x];
			if(isFunction(kwArgs[fn])){ continue; }
			if(isFunction(kwArgs["handle"])){
				kwArgs[fn] = kwArgs.handle;
			}
			// handler is aliased above, shouldn't need this check
			/* else if(dojo.lang.isObject(kwArgs.handler)){
				if(isFunction(kwArgs.handler[fn])){
					kwArgs[fn] = kwArgs.handler[fn]||kwArgs.handler["handle"]||function(){};
				}
			}*/
		}
		dojo.lang.mixin(this, kwArgs);
	}

});

dojo.io.Error = function(msg, type, num){
	this.message = msg;
	this.type =  type || "unknown"; // must be one of "io", "parse", "unknown"
	this.number = num || 0; // per-substrate error number, not normalized
}

dojo.io.transports.addTransport = function(name){
	this.push(name);
	// FIXME: do we need to handle things that aren't direct children of the
	// dojo.io namespace? (say, dojo.io.foo.fooTransport?)
	this[name] = dojo.io[name];
}

// binding interface, the various implementations register their capabilities
// and the bind() method dispatches
dojo.io.bind = function(request){
	// if the request asks for a particular implementation, use it
	if(!(request instanceof dojo.io.Request)){
		try{
			request = new dojo.io.Request(request);
		}catch(e){ dojo.debug(e); }
	}
	var tsName = "";
	if(request["transport"]){
		tsName = request["transport"];
		// FIXME: it would be good to call the error handler, although we'd
		// need to use setTimeout or similar to accomplish this and we can't
		// garuntee that this facility is available.
		if(!this[tsName]){ return request; }
	}else{
		// otherwise we do our best to auto-detect what available transports
		// will handle 
		for(var x=0; x<dojo.io.transports.length; x++){
			var tmp = dojo.io.transports[x];
			if((this[tmp])&&(this[tmp].canHandle(request))){
				tsName = tmp;
			}
		}
		if(tsName == ""){ return request; }
	}
	this[tsName].bind(request);
	request.bindSuccess = true;
	return request;
}

dojo.io.queueBind = function(request){
	if(!(request instanceof dojo.io.Request)){
		try{
			request = new dojo.io.Request(request);
		}catch(e){ dojo.debug(e); }
	}

	// make sure we get called if/when we get a response
	var oldLoad = request.load;
	request.load = function(){
		dojo.io._queueBindInFlight = false;
		var ret = oldLoad.apply(this, arguments);
		dojo.io._dispatchNextQueueBind();
		return ret;
	}

	var oldErr = request.error;
	request.error = function(){
		dojo.io._queueBindInFlight = false;
		var ret = oldErr.apply(this, arguments);
		dojo.io._dispatchNextQueueBind();
		return ret;
	}

	dojo.io._bindQueue.push(request);
	dojo.io._dispatchNextQueueBind();
	return request;
}

dojo.io._dispatchNextQueueBind = function(){
	if(!dojo.io._queueBindInFlight){
		dojo.io._queueBindInFlight = true;
		dojo.io.bind(dojo.io._bindQueue.shift());
	}
}
dojo.io._bindQueue = [];
dojo.io._queueBindInFlight = false;

dojo.io.argsFromMap = function(map, encoding){
	var control = new Object();
	var mapStr = "";
	var enc = /utf/i.test(encoding||"") ? encodeURIComponent : dojo.string.encodeAscii;
	for(var x in map){
		if(!control[x]){
			mapStr+= enc(x)+"="+enc(map[x])+"&";
		}
	}

	return mapStr;
}

/*
dojo.io.sampleTranport = new function(){
	this.canHandle = function(kwArgs){
		// canHandle just tells dojo.io.bind() if this is a good transport to
		// use for the particular type of request.
		if(	
			(
				(kwArgs["mimetype"] == "text/plain") ||
				(kwArgs["mimetype"] == "text/html") ||
				(kwArgs["mimetype"] == "text/javascript")
			)&&(
				(kwArgs["method"] == "get") ||
				( (kwArgs["method"] == "post") && (!kwArgs["formNode"]) )
			)
		){
			return true;
		}

		return false;
	}

	this.bind = function(kwArgs){
		var hdlrObj = {};

		// set up a handler object
		for(var x=0; x<dojo.io.hdlrFuncNames.length; x++){
			var fn = dojo.io.hdlrFuncNames[x];
			if(typeof kwArgs.handler == "object"){
				if(typeof kwArgs.handler[fn] == "function"){
					hdlrObj[fn] = kwArgs.handler[fn]||kwArgs.handler["handle"];
				}
			}else if(typeof kwArgs[fn] == "function"){
				hdlrObj[fn] = kwArgs[fn];
			}else{
				hdlrObj[fn] = kwArgs["handle"]||function(){};
			}
		}

		// build a handler function that calls back to the handler obj
		var hdlrFunc = function(evt){
			if(evt.type == "onload"){
				hdlrObj.load("load", evt.data, evt);
			}else if(evt.type == "onerr"){
				var errObj = new dojo.io.Error("sampleTransport Error: "+evt.msg);
				hdlrObj.error("error", errObj);
			}
		}

		// the sample transport would attach the hdlrFunc() when sending the
		// request down the pipe at this point
		var tgtURL = kwArgs.url+"?"+dojo.io.argsFromMap(kwArgs.content);
		// sampleTransport.sendRequest(tgtURL, hdlrFunc);
	}

	dojo.io.transports.addTransport("sampleTranport");
}
*/

dojo.provide("dojo.io.BrowserIO");

dojo.require("dojo.io");
dojo.require("dojo.lang");
dojo.require("dojo.dom");

try {
	if((!djConfig["preventBackButtonFix"])&&(!dojo.hostenv.post_load_)){
		document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+'iframe_history.html')+"'></iframe>");
	}
}catch(e){/* squelch */}

dojo.io.checkChildrenForFile = function(node){
	var hasFile = false;
	var inputs = node.getElementsByTagName("input");
	dojo.lang.forEach(inputs, function(input){
		if(hasFile){ return; }
		if(input.getAttribute("type")=="file"){
			hasFile = true;
		}
	});
	return hasFile;
}

dojo.io.formHasFile = function(formNode){
	return dojo.io.checkChildrenForFile(formNode);
}

// TODO: Move to htmlUtils
dojo.io.encodeForm = function(formNode, encoding){
	if((!formNode)||(!formNode.tagName)||(!formNode.tagName.toLowerCase() == "form")){
		dojo.raise("Attempted to encode a non-form element.");
	}
	var enc = /utf/i.test(encoding||"") ? encodeURIComponent : dojo.string.encodeAscii;
	var values = [];

	for(var i = 0; i < formNode.elements.length; i++){
		var elm = formNode.elements[i];
		if(elm.disabled || elm.tagName.toLowerCase() == "fieldset" || !elm.name){
			continue;
		}
		var name = enc(elm.name);
		var type = elm.type.toLowerCase();

		if(type == "select-multiple"){
			for(var j = 0; j < elm.options.length; j++){
				if(elm.options[j].selected) {
					values.push(name + "=" + enc(elm.options[j].value));
				}
			}
		}else if(dojo.lang.inArray(type, ["radio", "checkbox"])){
			if(elm.checked){
				values.push(name + "=" + enc(elm.value));
			}
		}else if(!dojo.lang.inArray(type, ["file", "submit", "reset", "button"])) {
			values.push(name + "=" + enc(elm.value));
		}
	}

	// now collect input type="image", which doesn't show up in the elements array
	var inputs = formNode.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if(input.type.toLowerCase() == "image" && input.form == formNode) {
			var name = enc(input.name);
			values.push(name + "=" + enc(input.value));
			values.push(name + ".x=0");
			values.push(name + ".y=0");
		}
	}
	return values.join("&") + "&";
}

dojo.io.setIFrameSrc = function(iframe, src, replace){
	try{
		var r = dojo.render.html;
		// dojo.debug(iframe);
		if(!replace){
			if(r.safari){
				iframe.location = src;
			}else{
				frames[iframe.name].location = src;
			}
		}else{
			// Fun with DOM 0 incompatibilities!
			var idoc;
			if(r.ie){
				idoc = iframe.contentWindow.document;
			}else if(r.moz){
				idoc = iframe.contentWindow;
			}else if(r.safari){
				idoc = iframe.document;
			}
			idoc.location.replace(src);
		}
	}catch(e){ 
		dojo.debug(e); 
		dojo.debug("setIFrameSrc: "+e); 
	}
}

dojo.io.XMLHTTPTransport = new function(){
	var _this = this;

	this.initialHref = window.location.href;
	this.initialHash = window.location.hash;

	this.moveForward = false;

	var _cache = {}; // FIXME: make this public? do we even need to?
	this.useCache = false; // if this is true, we'll cache unless kwArgs.useCache = false
	this.preventCache = false; // if this is true, we'll always force GET requests to cache
	this.historyStack = [];
	this.forwardStack = [];
	this.historyIframe = null;
	this.bookmarkAnchor = null;
	this.locationTimer = null;

	/* NOTES:
	 *	Safari 1.2: 
	 *		back button "works" fine, however it's not possible to actually
	 *		DETECT that you've moved backwards by inspecting window.location.
	 *		Unless there is some other means of locating.
	 *		FIXME: perhaps we can poll on history.length?
	 *	IE 5.5 SP2:
	 *		back button behavior is macro. It does not move back to the
	 *		previous hash value, but to the last full page load. This suggests
	 *		that the iframe is the correct way to capture the back button in
	 *		these cases.
	 *	IE 6.0:
	 *		same behavior as IE 5.5 SP2
	 * Firefox 1.0:
	 *		the back button will return us to the previous hash on the same
	 *		page, thereby not requiring an iframe hack, although we do then
	 *		need to run a timer to detect inter-page movement.
	 */

	// FIXME: Should this even be a function? or do we just hard code it in the next 2 functions?
	function getCacheKey(url, query, method) {
		return url + "|" + query + "|" + method.toLowerCase();
	}

	function addToCache(url, query, method, http) {
		_cache[getCacheKey(url, query, method)] = http;
	}

	function getFromCache(url, query, method) {
		return _cache[getCacheKey(url, query, method)];
	}

	this.clearCache = function() {
		_cache = {};
	}

	// moved successful load stuff here
	function doLoad(kwArgs, http, url, query, useCache) {
		if((http.status==200)||(location.protocol=="file:" && http.status==0)) {
			var ret;
			if(kwArgs.method.toLowerCase() == "head"){
				var headers = http.getAllResponseHeaders();
				ret = {};
				ret.toString = function(){ return headers; }
				var values = headers.split(/[\r\n]+/g);
				for(var i = 0; i < values.length; i++) {
					var pair = values[i].match(/^([^:]+)\s*:\s*(.+)$/i);
					if(pair) {
						ret[pair[1]] = pair[2];
					}
				}
			}else if(kwArgs.mimetype == "text/javascript"){
				try{
					ret = dj_eval(http.responseText);
				}catch(e){
					dojo.debug(e);
					dojo.debug(http.responseText);
					ret = null;
				}
			}else if(kwArgs.mimetype == "text/json"){
				try{
					ret = dj_eval("("+http.responseText+")");
				}catch(e){
					dojo.debug(e);
					dojo.debug(http.responseText);
					ret = false;
				}
			}else if((kwArgs.mimetype == "application/xml")||
						(kwArgs.mimetype == "text/xml")){
				ret = http.responseXML;
				if(!ret || typeof ret == "string") {
					ret = dojo.dom.createDocumentFromText(http.responseText);
				}
			}else{
				ret = http.responseText;
			}

			if(useCache){ // only cache successful responses
				addToCache(url, query, kwArgs.method, http);
			}
			kwArgs[(typeof kwArgs.load == "function") ? "load" : "handle"]("load", ret, http);
		}else{
			var errObj = new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
			kwArgs[(typeof kwArgs.error == "function") ? "error" : "handle"]("error", errObj, http);
		}
	}

	// set headers (note: Content-Type will get overriden if kwArgs.contentType is set)
	function setHeaders(http, kwArgs){
		if(kwArgs["headers"]) {
			for(var header in kwArgs["headers"]) {
				if(header.toLowerCase() == "content-type" && !kwArgs["contentType"]) {
					kwArgs["contentType"] = kwArgs["headers"][header];
				} else {
					http.setRequestHeader(header, kwArgs["headers"][header]);
				}
			}
		}
	}

	this.addToHistory = function(args){
		var callback = args["back"]||args["backButton"]||args["handle"];
		var hash = null;
		if(!this.historyIframe){
			this.historyIframe = window.frames["djhistory"];
		}
		if(!this.bookmarkAnchor){
			this.bookmarkAnchor = document.createElement("a");
			(document.body||document.getElementsByTagName("body")[0]).appendChild(this.bookmarkAnchor);
			this.bookmarkAnchor.style.display = "none";
		}
		if((!args["changeUrl"])||(dojo.render.html.ie)){
			var url = dojo.hostenv.getBaseScriptUri()+"iframe_history.html?"+(new Date()).getTime();
			this.moveForward = true;
			dojo.io.setIFrameSrc(this.historyIframe, url, false);
		}
		if(args["changeUrl"]){
			hash = "#"+ ((args["changeUrl"]!==true) ? args["changeUrl"] : (new Date()).getTime());
			setTimeout("window.location.href = '"+hash+"';", 1);
			this.bookmarkAnchor.href = hash;
			if(dojo.render.html.ie){
				// IE requires manual setting of the hash since we are catching
				// events from the iframe
				var oldCB = callback;
				var lh = null;
				var hsl = this.historyStack.length-1;
				if(hsl>=0){
					while(!this.historyStack[hsl]["urlHash"]){
						hsl--;
					}
					lh = this.historyStack[hsl]["urlHash"];
				}
				if(lh){
					callback = function(){
						if(window.location.hash != ""){
							setTimeout("window.location.href = '"+lh+"';", 1);
						}
						oldCB();
					}
				}
				// when we issue a new bind(), we clobber the forward 
				// FIXME: is this always a good idea?
				this.forwardStack = []; 
				var oldFW = args["forward"]||args["forwardButton"];;
				var tfw = function(){
					if(window.location.hash != ""){
						window.location.href = hash;
					}
					if(oldFW){ // we might not actually have one
						oldFW();
					}
				}
				if(args["forward"]){
					args.forward = tfw;
				}else if(args["forwardButton"]){
					args.forwardButton = tfw;
				}
			}else if(dojo.render.html.moz){
				// start the timer
				if(!this.locationTimer){
					this.locationTimer = setInterval("dojo.io.XMLHTTPTransport.checkLocation();", 200);
				}
			}
		}

		this.historyStack.push({"url": url, "callback": callback, "kwArgs": args, "urlHash": hash});
	}

	this.checkLocation = function(){
		var hsl = this.historyStack.length;

		if((window.location.hash == this.initialHash)||(window.location.href == this.initialHref)&&(hsl == 1)){
			// FIXME: could this ever be a forward button?
			// we can't clear it because we still need to check for forwards. Ugg.
			// clearInterval(this.locationTimer);
			this.handleBackButton();
			return;
		}
		// first check to see if we could have gone forward. We always halt on
		// a no-hash item.
		if(this.forwardStack.length > 0){
			if(this.forwardStack[this.forwardStack.length-1].urlHash == window.location.hash){
				this.handleForwardButton();
				return;
			}
		}
		// ok, that didn't work, try someplace back in the history stack
		if((hsl >= 2)&&(this.historyStack[hsl-2])){
			if(this.historyStack[hsl-2].urlHash==window.location.hash){
				this.handleBackButton();
				return;
			}
		}
	}

	this.iframeLoaded = function(evt, ifrLoc){
		var isp = ifrLoc.href.split("?");
		if(isp.length < 2){ 
			// alert("iframeLoaded");
			// we hit the end of the history, so we should go back
			if(this.historyStack.length == 1){
				this.handleBackButton();
			}
			return;
		}
		var query = isp[1];
		if(this.moveForward){
			// we were expecting it, so it's not either a forward or backward
			// movement
			this.moveForward = false;
			return;
		}

		var last = this.historyStack.pop();
		// we don't have anything in history, so it could be a forward button
		if(!last){ 
			if(this.forwardStack.length > 0){
				var next = this.forwardStack[this.forwardStack.length-1];
				if(query == next.url.split("?")[1]){
					this.handleForwardButton();
				}
			}
			// regardless, we didnt' have any history, so it can't be a back button
			return;
		}
		// put it back on the stack so we can do something useful with it when
		// we call handleBackButton()
		this.historyStack.push(last);
		if(this.historyStack.length >= 2){
			if(isp[1] == this.historyStack[this.historyStack.length-2].url.split("?")[1]){
				// looks like it IS a back button press, so handle it
				this.handleBackButton();
			}
		}else{
			this.handleBackButton();
		}
	}

	this.handleBackButton = function(){
		var last = this.historyStack.pop();
		if(!last){ return; }
		if(last["callback"]){
			last.callback();
		}else if(last.kwArgs["backButton"]){
			last.kwArgs["backButton"]();
		}else if(last.kwArgs["back"]){
			last.kwArgs["back"]();
		}else if(last.kwArgs["handle"]){
			last.kwArgs.handle("back");
		}
		this.forwardStack.push(last);
	}

	this.handleForwardButton = function(){
		// FIXME: should we build in support for re-issuing the bind() call here?
		// alert("alert we found a forward button call");
		var last = this.forwardStack.pop();
		if(!last){ return; }
		if(last.kwArgs["forward"]){
			last.kwArgs.forward();
		}else if(last.kwArgs["forwardButton"]){
			last.kwArgs.forwardButton();
		}else if(last.kwArgs["handle"]){
			last.kwArgs.handle("forward");
		}
		this.historyStack.push(last);
	}

	this.inFlight = [];
	this.inFlightTimer = null;

	this.startWatchingInFlight = function(){
		if(!this.inFlightTimer){
			this.inFlightTimer = setInterval("dojo.io.XMLHTTPTransport.watchInFlight();", 10);
		}
	}

	this.watchInFlight = function(){
		for(var x=this.inFlight.length-1; x>=0; x--){
			var tif = this.inFlight[x];
			if(!tif){ this.inFlight.splice(x, 1); continue; }
			if(4==tif.http.readyState){
				// remove it so we can clean refs
				this.inFlight.splice(x, 1);
				doLoad(tif.req, tif.http, tif.url, tif.query, tif.useCache);
				if(this.inFlight.length == 0){
					clearInterval(this.inFlightTimer);
					this.inFlightTimer = null;
				}
			} // FIXME: need to implement a timeout param here!
		}
	}

	var hasXmlHttp = dojo.hostenv.getXmlhttpObject() ? true : false;
	this.canHandle = function(kwArgs){
		// canHandle just tells dojo.io.bind() if this is a good transport to
		// use for the particular type of request.

		// FIXME: we need to determine when form values need to be
		// multi-part mime encoded and avoid using this transport for those
		// requests.
		return hasXmlHttp
			&& dojo.lang.inArray((kwArgs["mimetype"]||"".toLowerCase()), ["text/plain", "text/html", "application/xml", "text/xml", "text/javascript", "text/json"])
			&& dojo.lang.inArray(kwArgs["method"].toLowerCase(), ["post", "get", "head"])
			&& !( kwArgs["formNode"] && dojo.io.formHasFile(kwArgs["formNode"]) );
	}

	this.multipartBoundary = "45309FFF-BD65-4d50-99C9-36986896A96F";	// unique guid as a boundary value for multipart posts

	this.bind = function(kwArgs){
		if(!kwArgs["url"]){
			// are we performing a history action?
			if( !kwArgs["formNode"]
				&& (kwArgs["backButton"] || kwArgs["back"] || kwArgs["changeUrl"] || kwArgs["watchForURL"])
				&& (!djConfig.preventBackButtonFix)) {
				this.addToHistory(kwArgs);
				return true;
			}
		}

		// build this first for cache purposes
		var url = kwArgs.url;
		var query = "";
		if(kwArgs["formNode"]){
			var ta = kwArgs.formNode.getAttribute("action");
			if((ta)&&(!kwArgs["url"])){ url = ta; }
			var tp = kwArgs.formNode.getAttribute("method");
			if((tp)&&(!kwArgs["method"])){ kwArgs.method = tp; }
			query += dojo.io.encodeForm(kwArgs.formNode, kwArgs.encoding);
		}

		if(url.indexOf("#") > -1) {
			dojo.debug("Warning: dojo.io.bind: stripping hash values from url:", url);
			url = url.split("#")[0];
		}

		if(kwArgs["file"]){
			// force post for file transfer
			kwArgs.method = "post";
		}

		if(!kwArgs["method"]){
			kwArgs.method = "get";
		}

		// guess the multipart value		
		if(kwArgs.method.toLowerCase() == "get"){
			// GET cannot use multipart
			kwArgs.multipart = false;
		}else{
			if(kwArgs["file"]){
				// enforce multipart when sending files
				kwArgs.multipart = true;
			}else if(!kwArgs["multipart"]){
				// default 
				kwArgs.multipart = false;
			}
		}

		if(kwArgs["backButton"] || kwArgs["back"] || kwArgs["changeUrl"]){
			this.addToHistory(kwArgs);
		}

		var content = kwArgs["content"] || {};

		if(kwArgs.sendTransport) {
			content["dojo.transport"] = "xmlhttp";
		}

		do { // break-block
			if(kwArgs.postContent){
				query = kwArgs.postContent;
				break;
			}

			if(content) {
				query += dojo.io.argsFromMap(content, kwArgs.encoding);
			}
			
			if(kwArgs.method.toLowerCase() == "get" || !kwArgs.multipart){
				break;
			}

			var	t = [];
			if(query.length){
				var q = query.split("&");
				for(var i = 0; i < q.length; ++i){
					if(q[i].length){
						var p = q[i].split("=");
						t.push(	"--" + this.multipartBoundary,
								"Content-Disposition: form-data; name=\"" + p[0] + "\"", 
								"",
								p[1]);
					}
				}
			}

			if(kwArgs.file){
				if(dojo.lang.isArray(kwArgs.file)){
					for(var i = 0; i < kwArgs.file.length; ++i){
						var o = kwArgs.file[i];
						t.push(	"--" + this.multipartBoundary,
								"Content-Disposition: form-data; name=\"" + o.name + "\"; filename=\"" + ("fileName" in o ? o.fileName : o.name) + "\"",
								"Content-Type: " + ("contentType" in o ? o.contentType : "application/octet-stream"),
								"",
								o.content);
					}
				}else{
					var o = kwArgs.file;
					t.push(	"--" + this.multipartBoundary,
							"Content-Disposition: form-data; name=\"" + o.name + "\"; filename=\"" + ("fileName" in o ? o.fileName : o.name) + "\"",
							"Content-Type: " + ("contentType" in o ? o.contentType : "application/octet-stream"),
							"",
							o.content);
				}
			}

			if(t.length){
				t.push("--"+this.multipartBoundary+"--", "");
				query = t.join("\r\n");
			}
		}while(false);

		// kwArgs.Connection = "close";

		var async = kwArgs["sync"] ? false : true;

		var preventCache = kwArgs["preventCache"] ||
			(this.preventCache == true && kwArgs["preventCache"] != false);
		var useCache = kwArgs["useCache"] == true ||
			(this.useCache == true && kwArgs["useCache"] != false );

		// preventCache is browser-level (add query string junk), useCache
		// is for the local cache. If we say preventCache, then don't attempt
		// to look in the cache, but if useCache is true, we still want to cache
		// the response
		if(!preventCache && useCache){
			var cachedHttp = getFromCache(url, query, kwArgs.method);
			if(cachedHttp){
				doLoad(kwArgs, cachedHttp, url, query, false);
				return;
			}
		}

		// much of this is from getText, but reproduced here because we need
		// more flexibility
		var http = dojo.hostenv.getXmlhttpObject();
		var received = false;

		// build a handler function that calls back to the handler obj
		if(async){
			// FIXME: setting up this callback handler leaks on IE!!!
			this.inFlight.push({
				"req":		kwArgs,
				"http":		http,
				"url":		url,
				"query":	query,
				"useCache":	useCache
			});
			this.startWatchingInFlight();
		}

		if(kwArgs.method.toLowerCase() == "post"){
			// FIXME: need to hack in more flexible Content-Type setting here!
			http.open("POST", url, async);
			setHeaders(http, kwArgs);
			http.setRequestHeader("Content-Type", kwArgs.multipart ? ("multipart/form-data; boundary=" + this.multipartBoundary) : 
				(kwArgs.contentType || "application/x-www-form-urlencoded"));
			http.send(query);
		}else{
			var tmpUrl = url;
			if(query != "") {
				tmpUrl += (tmpUrl.indexOf("?") > -1 ? "&" : "?") + query;
			}
			if(preventCache) {
				tmpUrl += (dojo.string.endsWithAny(tmpUrl, "?", "&")
					? "" : (tmpUrl.indexOf("?") > -1 ? "&" : "?")) + "dojo.preventCache=" + new Date().valueOf();
			}
			http.open(kwArgs.method.toUpperCase(), tmpUrl, async);
			setHeaders(http, kwArgs);
			http.send(null);
		}

		if( !async ) {
			doLoad(kwArgs, http, url, query, useCache);
		}

		kwArgs.abort = function(){
			return http.abort();
		}

		return;
	}
	dojo.io.transports.addTransport("XMLHTTPTransport");
}

dojo.provide("dojo.io.cookie");

dojo.io.cookie.setCookie = function(name, value, days, path, domain, secure) {
	var expires = -1;
	if(typeof days == "number" && days >= 0) {
		var d = new Date();
		d.setTime(d.getTime()+(days*24*60*60*1000));
		expires = d.toGMTString();
	}
	value = escape(value);
	document.cookie = name + "=" + value + ";"
		+ (expires != -1 ? " expires=" + expires + ";" : "")
		+ (path ? "path=" + path : "")
		+ (domain ? "; domain=" + domain : "")
		+ (secure ? "; secure" : "");
}

dojo.io.cookie.set = dojo.io.cookie.setCookie;

dojo.io.cookie.getCookie = function(name) {
	var idx = document.cookie.indexOf(name+'=');
	if(idx == -1) { return null; }
	value = document.cookie.substring(idx+name.length+1);
	var end = value.indexOf(';');
	if(end == -1) { end = value.length; }
	value = value.substring(0, end);
	value = unescape(value);
	return value;
}

dojo.io.cookie.get = dojo.io.cookie.getCookie;

dojo.io.cookie.deleteCookie = function(name) {
	dojo.io.cookie.setCookie(name, "-", 0);
}

dojo.io.cookie.setObjectCookie = function(name, obj, days, path, domain, secure, clearCurrent) {
	if(arguments.length == 5) { // for backwards compat
		clearCurrent = domain;
		domain = null;
		secure = null;
	}
	var pairs = [], cookie, value = "";
	if(!clearCurrent) { cookie = dojo.io.cookie.getObjectCookie(name); }
	if(days >= 0) {
		if(!cookie) { cookie = {}; }
		for(var prop in obj) {
			if(prop == null) {
				delete cookie[prop];
			} else if(typeof obj[prop] == "string" || typeof obj[prop] == "number") {
				cookie[prop] = obj[prop];
			}
		}
		prop = null;
		for(var prop in cookie) {
			pairs.push(escape(prop) + "=" + escape(cookie[prop]));
		}
		value = pairs.join("&");
	}
	dojo.io.cookie.setCookie(name, value, days, path, domain, secure);
}

dojo.io.cookie.getObjectCookie = function(name) {
	var values = null, cookie = dojo.io.cookie.getCookie(name);
	if(cookie) {
		values = {};
		var pairs = cookie.split("&");
		for(var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split("=");
			var value = pair[1];
			if( isNaN(value) ) { value = unescape(pair[1]); }
			values[ unescape(pair[0]) ] = value;
		}
	}
	return values;
}

dojo.io.cookie.isSupported = function() {
	if(typeof navigator.cookieEnabled != "boolean") {
		dojo.io.cookie.setCookie("__TestingYourBrowserForCookieSupport__",
			"CookiesAllowed", 90, null);
		var cookieVal = dojo.io.cookie.getCookie("__TestingYourBrowserForCookieSupport__");
		navigator.cookieEnabled = (cookieVal == "CookiesAllowed");
		if(navigator.cookieEnabled) {
			// FIXME: should we leave this around?
			this.deleteCookie("__TestingYourBrowserForCookieSupport__");
		}
	}
	return navigator.cookieEnabled;
}

// need to leave this in for backwards-compat from 0.1 for when it gets pulled in by dojo.io.*
if(!dojo.io.cookies) { dojo.io.cookies = dojo.io.cookie; }

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.io", false, false],
	rhino: ["dojo.io.RhinoIO", false, false],
	browser: [["dojo.io.BrowserIO", false, false], ["dojo.io.cookie", false, false]]
});
dojo.hostenv.moduleLoaded("dojo.io.*");

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.uri.Uri", false, false]
});
dojo.hostenv.moduleLoaded("dojo.uri.*");

dojo.provide("dojo.io.IframeIO");
dojo.require("dojo.io.BrowserIO");
dojo.require("dojo.uri.*");

dojo.io.createIFrame = function(fname, onloadstr){
	if(window[fname]){ return window[fname]; }
	if(window.frames[fname]){ return window.frames[fname]; }
	var r = dojo.render.html;
	var cframe = null;
	var turi = dojo.uri.dojoUri("iframe_history.html?noInit=true");
	var ifrstr = ((r.ie)&&(dojo.render.os.win)) ? "<iframe name='"+fname+"' src='"+turi+"' onload='"+onloadstr+"'>" : "iframe";
	cframe = document.createElement(ifrstr);
	with(cframe){
		name = fname;
		setAttribute("name", fname);
		id = fname;
	}
	(document.body||document.getElementsByTagName("body")[0]).appendChild(cframe);
	window[fname] = cframe;
	with(cframe.style){
		position = "absolute";
		left = top = "0px";
		height = width = "1px";
		visibility = "hidden";
		/*
		if(djConfig.isDebug){
			position = "relative";
			height = "300px";
			width = "600px";
			visibility = "visible";
		}
		*/
	}

	if(!r.ie){
		dojo.io.setIFrameSrc(cframe, turi, true);
		cframe.onload = new Function(onloadstr);
	}
	return cframe;
}

// thanks burstlib!
dojo.io.iframeContentWindow = function(iframe_el) {
	var win = iframe_el.contentWindow || // IE
		dojo.io.iframeContentDocument(iframe_el).defaultView || // Moz, opera
		// Moz. TODO: is this available when defaultView isn't?
		dojo.io.iframeContentDocument(iframe_el).__parent__ || 
		(iframe_el.name && document.frames[iframe_el.name]) || null;
	return win;
}

dojo.io.iframeContentDocument = function(iframe_el){
	var doc = iframe_el.contentDocument || // W3
		(
			(iframe_el.contentWindow)&&(iframe_el.contentWindow.document)
		) ||  // IE
		(
			(iframe_el.name)&&(document.frames[iframe_el.name])&&
			(document.frames[iframe_el.name].document)
		) || null;
	return doc;
}

dojo.io.IframeTransport = new function(){
	var _this = this;
	this.currentRequest = null;
	this.requestQueue = [];
	this.iframeName = "dojoIoIframe";

	this.fireNextRequest = function(){
		if((this.currentRequest)||(this.requestQueue.length == 0)){ return; }
		// dojo.debug("fireNextRequest");
		var cr = this.currentRequest = this.requestQueue.shift();
		var fn = cr["formNode"];
		var content = cr["content"] || {};
		if(cr.sendTransport) {
			content["dojo.transport"] = "iframe";
		}
		if(fn){
			if(content){
				// if we have things in content, we need to add them to the form
				// before submission
				for(var x in content){
					if(!fn[x]){
						var tn;
						if(dojo.render.html.ie){
							tn = document.createElement("<input type='hidden' name='"+x+"' value='"+content[x]+"'>");
							fn.appendChild(tn);
						}else{
							tn = document.createElement("input");
							fn.appendChild(tn);
							tn.type = "hidden";
							tn.name = x;
							tn.value = content[x];
						}
					}else{
						fn[x].value = content[x];
					}
				}
			}
			if(cr["url"]){
				fn.setAttribute("action", cr.url);
			}
			if(!fn.getAttribute("method")){
				fn.setAttribute("method", (cr["method"]) ? cr["method"] : "post");
			}
			fn.setAttribute("target", this.iframeName);
			fn.target = this.iframeName;
			fn.submit();
		}else{
			// otherwise we post a GET string by changing URL location for the
			// iframe
			var query = dojo.io.argsFromMap(this.currentRequest.content);
			var tmpUrl = (cr.url.indexOf("?") > -1 ? "&" : "?") + query;
			dojo.io.setIFrameSrc(this.iframe, tmpUrl, true);
		}
	}

	this.canHandle = function(kwArgs){
		return (
			(
				// FIXME: can we really handle text/plain and
				// text/javascript requests?
				dojo.lang.inArray(kwArgs["mimetype"], 
				[	"text/plain", "text/html", 
					"application/xml", "text/xml", 
					"text/javascript", "text/json"])
			)&&(
				// make sur we really only get used in file upload cases	
				(kwArgs["formNode"])&&(dojo.io.checkChildrenForFile(kwArgs["formNode"]))
			)&&(
				dojo.lang.inArray(kwArgs["method"].toLowerCase(), ["post", "get"])
			)&&(
				// never handle a sync request
				!  ((kwArgs["sync"])&&(kwArgs["sync"] == true))
			)
		);
	}

	this.bind = function(kwArgs){
		this.requestQueue.push(kwArgs);
		this.fireNextRequest();
		return;
	}

	this.setUpIframe = function(){

		// NOTE: IE 5.0 and earlier Mozilla's don't support an onload event for
		//       iframes. OTOH, we don't care.
		this.iframe = dojo.io.createIFrame(this.iframeName, "dojo.io.IframeTransport.iframeOnload();");
	}

	this.iframeOnload = function(){
		if(!_this.currentRequest){
			_this.fireNextRequest();
			return;
		}
		var ifr = _this.iframe;
		var ifw = dojo.io.iframeContentWindow(ifr);
		// handle successful returns
		// FIXME: how do we determine success for iframes? Is there an equiv of
		// the "status" property?
		var value;
		var success = false;

		try{
			var cmt = _this.currentRequest.mimetype;
			if((cmt == "text/javascript")||(cmt == "text/json")){
				// FIXME: not sure what to do here? try to pull some evalulable
				// text from a textarea or cdata section? 
				// how should we set up the contract for that?
				var cd = dojo.io.iframeContentDocument(_this.iframe);
				var js = cd.getElementsByTagName("textarea")[0].value;
				if(cmt == "text/json") { js = "(" + js + ")"; }
				value = dj_eval(js);
			}else if((cmt == "application/xml")||(cmt == "text/xml")){
				value = dojo.io.iframeContentDocument(_this.iframe);
			}else{ // text/plain
				value = ifw.innerHTML;
			}
			success = true;
		}catch(e){ 
			// looks like we didn't get what we wanted!
			var errObj = new dojo.io.Error("IframeTransport Error");
			if(dojo.lang.isFunction(_this.currentRequest["error"])){
				_this.currentRequest.error("error", errObj, _this.currentRequest);
			}
		}

		// don't want to mix load function errors with processing errors, thus
		// a separate try..catch
		try {
			if(success && dojo.lang.isFunction(_this.currentRequest["load"])){
				_this.currentRequest.load("load", value, _this.currentRequest);
			}
		} catch(e) {
			throw e;
		} finally {
			_this.currentRequest = null;
			_this.fireNextRequest();
		}
	}

	dojo.io.transports.addTransport("IframeTransport");
}

dojo.addOnLoad(function(){
	dojo.io.IframeTransport.setUpIframe();
});

dojo.provide("dojo.xml.Parse");

dojo.require("dojo.dom");

//TODO: determine dependencies
// currently has dependency on dojo.xml.DomUtil nodeTypes constants...

/* generic method for taking a node and parsing it into an object

TODO: WARNING: This comment is wrong!

For example, the following xml fragment

<foo bar="bar">
	<baz xyzzy="xyzzy"/>
</foo>

can be described as:

dojo.???.foo = {}
dojo.???.foo.bar = {}
dojo.???.foo.bar.value = "bar";
dojo.???.foo.baz = {}
dojo.???.foo.baz.xyzzy = {}
dojo.???.foo.baz.xyzzy.value = "xyzzy"

*/
// using documentFragment nomenclature to generalize in case we don't want to require passing a collection of nodes with a single parent
dojo.xml.Parse = function(){
	this.parseFragment = function(documentFragment) {
		// handle parent element
		var parsedFragment = {};
		// var tagName = dojo.xml.domUtil.getTagName(node);
		var tagName = dojo.dom.getTagName(documentFragment);
		// TODO: What if document fragment is just text... need to check for nodeType perhaps?
		parsedFragment[tagName] = new Array(documentFragment.tagName);
		var attributeSet = this.parseAttributes(documentFragment);
		for(var attr in attributeSet){
			if(!parsedFragment[attr]){
				parsedFragment[attr] = [];
			}
			parsedFragment[attr][parsedFragment[attr].length] = attributeSet[attr];
		}
		var nodes = documentFragment.childNodes;
		for(var childNode in nodes){
			switch(nodes[childNode].nodeType){
				case  dojo.dom.ELEMENT_NODE: // element nodes, call this function recursively
					parsedFragment[tagName].push(this.parseElement(nodes[childNode]));
					break;
				case  dojo.dom.TEXT_NODE: // if a single text node is the child, treat it as an attribute
					if(nodes.length == 1){
						if(!parsedFragment[documentFragment.tagName]){
							parsedFragment[tagName] = [];
						}
						parsedFragment[tagName].push({ value: nodes[0].nodeValue });
					}
					break;
			}
		}
		
		return parsedFragment;
	}

	this.parseElement = function(node, hasParentNodeSet, optimizeForDojoML, thisIdx){
		// TODO: make this namespace aware
		var parsedNodeSet = {};
		var tagName = dojo.dom.getTagName(node);
		parsedNodeSet[tagName] = [];
		if((!optimizeForDojoML)||(tagName.substr(0,4).toLowerCase()=="dojo")){
			var attributeSet = this.parseAttributes(node);
			for(var attr in attributeSet){
				if((!parsedNodeSet[tagName][attr])||(typeof parsedNodeSet[tagName][attr] != "array")){
					parsedNodeSet[tagName][attr] = [];
				}
				parsedNodeSet[tagName][attr].push(attributeSet[attr]);
			}
	
			// FIXME: we might want to make this optional or provide cloning instead of
			// referencing, but for now, we include a node reference to allow
			// instantiated components to figure out their "roots"
			parsedNodeSet[tagName].nodeRef = node;
			parsedNodeSet.tagName = tagName;
			parsedNodeSet.index = thisIdx||0;
		}
	
		var count = 0;
		for(var i=0; i<node.childNodes.length; i++){
			var tcn = node.childNodes.item(i);
			switch(tcn.nodeType){
				case  dojo.dom.ELEMENT_NODE: // element nodes, call this function recursively
					count++;
					var ctn = dojo.dom.getTagName(tcn);
					if(!parsedNodeSet[ctn]){
						parsedNodeSet[ctn] = [];
					}
					parsedNodeSet[ctn].push(this.parseElement(tcn, true, optimizeForDojoML, count));
					if(	(tcn.childNodes.length == 1)&&
						(tcn.childNodes.item(0).nodeType == dojo.dom.TEXT_NODE)){
						parsedNodeSet[ctn][parsedNodeSet[ctn].length-1].value = tcn.childNodes.item(0).nodeValue;
					}
					break;
				case  dojo.dom.TEXT_NODE: // if a single text node is the child, treat it as an attribute
					if(node.childNodes.length == 1) {
						parsedNodeSet[tagName].push({ value: node.childNodes.item(0).nodeValue });
					}
					break;
				default: break;
				/*
				case  dojo.dom.ATTRIBUTE_NODE: // attribute node... not meaningful here
					break;
				case  dojo.dom.CDATA_SECTION_NODE: // cdata section... not sure if this would ever be meaningful... might be...
					break;
				case  dojo.dom.ENTITY_REFERENCE_NODE: // entity reference node... not meaningful here
					break;
				case  dojo.dom.ENTITY_NODE: // entity node... not sure if this would ever be meaningful
					break;
				case  dojo.dom.PROCESSING_INSTRUCTION_NODE: // processing instruction node... not meaningful here
					break;
				case  dojo.dom.COMMENT_NODE: // comment node... not not sure if this would ever be meaningful 
					break;
				case  dojo.dom.DOCUMENT_NODE: // document node... not sure if this would ever be meaningful
					break;
				case  dojo.dom.DOCUMENT_TYPE_NODE: // document type node... not meaningful here
					break;
				case  dojo.dom.DOCUMENT_FRAGMENT_NODE: // document fragment node... not meaningful here
					break;
				case  dojo.dom.NOTATION_NODE:// notation node... not meaningful here
					break;
				*/
			}
		}
		//return (hasParentNodeSet) ? parsedNodeSet[node.tagName] : parsedNodeSet;
		return parsedNodeSet;
	}

	/* parses a set of attributes on a node into an object tree */
	this.parseAttributes = function(node) {
		// TODO: make this namespace aware
		var parsedAttributeSet = {};
		var atts = node.attributes;
		// TODO: should we allow for duplicate attributes at this point...
		// would any of the relevant dom implementations even allow this?
		for(var i=0; i<atts.length; i++) {
			var attnode = atts.item(i);
			if((dojo.render.html.capable)&&(dojo.render.html.ie)){
				if(!attnode){ continue; }
				if(	(typeof attnode == "object")&&
					(typeof attnode.nodeValue == 'undefined')||
					(attnode.nodeValue == null)||
					(attnode.nodeValue == '')){ 
					continue; 
				}
			}
			var nn = (attnode.nodeName.indexOf("dojo:") == -1) ? attnode.nodeName : attnode.nodeName.split("dojo:")[1];
			parsedAttributeSet[nn] = { 
				value: attnode.nodeValue 
			};
		}
		return parsedAttributeSet;
	}
}

dojo.provide("dojo.xml.domUtil");
dojo.require("dojo.graphics.color");
dojo.require("dojo.dom");
dojo.require("dojo.style");

dj_deprecated("dojo.xml.domUtil is deprecated, use dojo.dom instead");

// for loading script:
dojo.xml.domUtil = new function(){
	this.nodeTypes = {
		ELEMENT_NODE                  : 1,
		ATTRIBUTE_NODE                : 2,
		TEXT_NODE                     : 3,
		CDATA_SECTION_NODE            : 4,
		ENTITY_REFERENCE_NODE         : 5,
		ENTITY_NODE                   : 6,
		PROCESSING_INSTRUCTION_NODE   : 7,
		COMMENT_NODE                  : 8,
		DOCUMENT_NODE                 : 9,
		DOCUMENT_TYPE_NODE            : 10,
		DOCUMENT_FRAGMENT_NODE        : 11,
		NOTATION_NODE                 : 12
	}
	
	this.dojoml = "http://www.dojotoolkit.org/2004/dojoml";
	this.idIncrement = 0;
	
	this.getTagName = function(){return dojo.dom.getTagName.apply(dojo.dom, arguments);}
	this.getUniqueId = function(){return dojo.dom.getUniqueId.apply(dojo.dom, arguments);}
	this.getFirstChildTag = function() {return dojo.dom.getFirstChildElement.apply(dojo.dom, arguments);}
	this.getLastChildTag = function() {return dojo.dom.getLastChildElement.apply(dojo.dom, arguments);}
	this.getNextSiblingTag = function() {return dojo.dom.getNextSiblingElement.apply(dojo.dom, arguments);}
	this.getPreviousSiblingTag = function() {return dojo.dom.getPreviousSiblingElement.apply(dojo.dom, arguments);}

	this.forEachChildTag = function(node, unaryFunc) {
		var child = this.getFirstChildTag(node);
		while(child) {
			if(unaryFunc(child) == "break") { break; }
			child = this.getNextSiblingTag(child);
		}
	}

	this.moveChildren = function() {return dojo.dom.moveChildren.apply(dojo.dom, arguments);}
	this.copyChildren = function() {return dojo.dom.copyChildren.apply(dojo.dom, arguments);}
	this.clearChildren = function() {return dojo.dom.removeChildren.apply(dojo.dom, arguments);}
	this.replaceChildren = function() {return dojo.dom.replaceChildren.apply(dojo.dom, arguments);}

	this.getStyle = function() {return dojo.style.getStyle.apply(dojo.style, arguments);}
	this.toCamelCase = function() {return dojo.style.toCamelCase.apply(dojo.style, arguments);}
	this.toSelectorCase = function() {return dojo.style.toSelectorCase.apply(dojo.style, arguments);}

	this.getAncestors = function(){return dojo.dom.getAncestors.apply(dojo.dom, arguments);}
	this.isChildOf = function() {return dojo.dom.isDescendantOf.apply(dojo.dom, arguments);}
	this.createDocumentFromText = function() {return dojo.dom.createDocumentFromText.apply(dojo.dom, arguments);}

	if(dojo.render.html.capable || dojo.render.svg.capable) {
		this.createNodesFromText = function(txt, wrap){return dojo.dom.createNodesFromText.apply(dojo.dom, arguments);}
	}

	this.extractRGB = function(color) { return dojo.graphics.color.extractRGB(color); }
	this.hex2rgb = function(hex) { return dojo.graphics.color.hex2rgb(hex); }
	this.rgb2hex = function(r, g, b) { return dojo.graphics.color.rgb2hex(r, g, b); }

	this.insertBefore = function() {return dojo.dom.insertBefore.apply(dojo.dom, arguments);}
	this.before = this.insertBefore;
	this.insertAfter = function() {return dojo.dom.insertAfter.apply(dojo.dom, arguments);}
	this.after = this.insertAfter
	this.insert = function(){return dojo.dom.insertAtPosition.apply(dojo.dom, arguments);}
	this.insertAtIndex = function(){return dojo.dom.insertAtIndex.apply(dojo.dom, arguments);}
	this.textContent = function () {return dojo.dom.textContent.apply(dojo.dom, arguments);}
	this.renderedTextContent = function () {return dojo.dom.renderedTextContent.apply(dojo.dom, arguments);}
	this.remove = function (node) {return dojo.dom.removeNode.apply(dojo.dom, arguments);}
}


dojo.provide("dojo.xml.htmlUtil");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");

dj_deprecated("dojo.xml.htmlUtil is deprecated, use dojo.html instead");

dojo.xml.htmlUtil = new function(){
	this.styleSheet = dojo.style.styleSheet;
	
	this._clobberSelection = function(){return dojo.html.clearSelection.apply(dojo.html, arguments);}
	this.disableSelect = function(){return dojo.html.disableSelection.apply(dojo.html, arguments);}
	this.enableSelect = function(){return dojo.html.enableSelection.apply(dojo.html, arguments);}
	
	this.getInnerWidth = function(){return dojo.style.getInnerWidth.apply(dojo.style, arguments);}
	
	this.getOuterWidth = function(node){
		dj_unimplemented("dojo.xml.htmlUtil.getOuterWidth");
	}

	this.getInnerHeight = function(){return dojo.style.getInnerHeight.apply(dojo.style, arguments);}

	this.getOuterHeight = function(node){
		dj_unimplemented("dojo.xml.htmlUtil.getOuterHeight");
	}

	this.getTotalOffset = function(){return dojo.style.getTotalOffset.apply(dojo.style, arguments);}
	this.totalOffsetLeft = function(){return dojo.style.totalOffsetLeft.apply(dojo.style, arguments);}

	this.getAbsoluteX = this.totalOffsetLeft;

	this.totalOffsetTop = function(){return dojo.style.totalOffsetTop.apply(dojo.style, arguments);}
	
	this.getAbsoluteY = this.totalOffsetTop;

	this.getEventTarget = function(){return dojo.html.getEventTarget.apply(dojo.html, arguments);}
	this.getScrollTop = function() {return dojo.html.getScrollTop.apply(dojo.html, arguments);}
	this.getScrollLeft = function() {return dojo.html.getScrollLeft.apply(dojo.html, arguments);}

	this.evtTgt = this.getEventTarget;

	this.getParentOfType = function(){return dojo.html.getParentOfType.apply(dojo.html, arguments);}
	this.getAttribute = function(){return dojo.html.getAttribute.apply(dojo.html, arguments);}
	this.getAttr = function (node, attr) { // for backwards compat (may disappear!!!)
		dj_deprecated("dojo.xml.htmlUtil.getAttr is deprecated, use dojo.xml.htmlUtil.getAttribute instead");
		return dojo.xml.htmlUtil.getAttribute(node, attr);
	}
	this.hasAttribute = function(){return dojo.html.hasAttribute.apply(dojo.html, arguments);}

	this.hasAttr = function (node, attr) { // for backwards compat (may disappear!!!)
		dj_deprecated("dojo.xml.htmlUtil.hasAttr is deprecated, use dojo.xml.htmlUtil.hasAttribute instead");
		return dojo.xml.htmlUtil.hasAttribute(node, attr);
	}
	
	this.getClass = function(){return dojo.html.getClass.apply(dojo.html, arguments)}
	this.hasClass = function(){return dojo.html.hasClass.apply(dojo.html, arguments)}
	this.prependClass = function(){return dojo.html.prependClass.apply(dojo.html, arguments)}
	this.addClass = function(){return dojo.html.addClass.apply(dojo.html, arguments)}
	this.setClass = function(){return dojo.html.setClass.apply(dojo.html, arguments)}
	this.removeClass = function(){return dojo.html.removeClass.apply(dojo.html, arguments)}

	// Enum type for getElementsByClass classMatchType arg:
	this.classMatchType = {
		ContainsAll : 0, // all of the classes are part of the node's class (default)
		ContainsAny : 1, // any of the classes are part of the node's class
		IsOnly : 2 // only all of the classes are part of the node's class
	}

	this.getElementsByClass = function() {return dojo.html.getElementsByClass.apply(dojo.html, arguments)}
	this.getElementsByClassName = this.getElementsByClass;
	
	this.setOpacity = function() {return dojo.style.setOpacity.apply(dojo.style, arguments)}
	this.getOpacity = function() {return dojo.style.getOpacity.apply(dojo.style, arguments)}
	this.clearOpacity = function() {return dojo.style.clearOpacity.apply(dojo.style, arguments)}
	
	this.gravity = function(){return dojo.html.gravity.apply(dojo.html, arguments)}
	
	this.gravity.NORTH = 1;
	this.gravity.SOUTH = 1 << 1;
	this.gravity.EAST = 1 << 2;
	this.gravity.WEST = 1 << 3;
	
	this.overElement = function(){return dojo.html.overElement.apply(dojo.html, arguments)}

	this.insertCssRule = function(){return dojo.style.insertCssRule.apply(dojo.style, arguments)}
	
	this.insertCSSRule = function(selector, declaration, index){
		dj_deprecated("dojo.xml.htmlUtil.insertCSSRule is deprecated, use dojo.xml.htmlUtil.insertCssRule instead");
		return dojo.xml.htmlUtil.insertCssRule(selector, declaration, index);
	}
	
	this.removeCssRule = function(){return dojo.style.removeCssRule.apply(dojo.style, arguments)}

	this.removeCSSRule = function(index){
		dj_deprecated("dojo.xml.htmlUtil.removeCSSRule is deprecated, use dojo.xml.htmlUtil.removeCssRule instead");
		return dojo.xml.htmlUtil.removeCssRule(index);
	}

	this.insertCssFile = function(){return dojo.style.insertCssFile.apply(dojo.style, arguments)}

	this.insertCSSFile = function(URI, doc, checkDuplicates){
		dj_deprecated("dojo.xml.htmlUtil.insertCSSFile is deprecated, use dojo.xml.htmlUtil.insertCssFile instead");
		return dojo.xml.htmlUtil.insertCssFile(URI, doc, checkDuplicates);
	}

	this.getBackgroundColor = function() {return dojo.style.getBackgroundColor.apply(dojo.style, arguments)}

	this.getUniqueId = function() { return dojo.dom.getUniqueId(); }

	this.getStyle = function() {return dojo.style.getStyle.apply(dojo.style, arguments)}
}

dojo.require("dojo.xml.Parse");
dojo.hostenv.conditionalLoadModule({
	common:		["dojo.xml.domUtil"],
    browser: 	["dojo.xml.htmlUtil"],
    svg: 		["dojo.xml.svgUtil"]
});
dojo.hostenv.moduleLoaded("dojo.xml.*");

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.lang"]
});
dojo.hostenv.moduleLoaded("dojo.lang.*");

// FIXME: should we require JSON here?
dojo.require("dojo.lang.*");
dojo.provide("dojo.storage");
dojo.provide("dojo.storage.StorageProvider");

dojo.storage = new function(){
	this.provider = null;

	// similar API as with dojo.io.addTransport()
	this.setProvider = function(obj){
		this.provider = obj;
	}

	this.set = function(key, value, namespace){
		// FIXME: not very expressive, doesn't have a way of indicating queuing
		if(!this.provider){
			return false;
		}
		return this.provider.set(key, value, namespace);
	}

	this.get = function(key, namespace){
		if(!this.provider){
			return false;
		}
		return this.provider.get(key, namespace);
	}

	this.remove = function(key, namespace){
		return this.provider.remove(key, namespace);
	}
}

dojo.storage.StorageProvider = function(){
}

dojo.lang.extend(dojo.storage.StorageProvider, {
	namespace: "*",
	initialized: false,

	free: function(){
		dojo.unimplemented("dojo.storage.StorageProvider.free");
		return 0;
	},

	freeK: function(){
		return dojo.math.round(this.free()/1024, 0);
	},

	set: function(key, value, namespace){
		dojo.unimplemented("dojo.storage.StorageProvider.set");
	},

	get: function(key, namespace){
		dojo.unimplemented("dojo.storage.StorageProvider.get");
	},

	remove: function(key, value, namespace){
		dojo.unimplemented("dojo.storage.StorageProvider.set");
	}

});

dojo.provide("dojo.storage.browser");
dojo.require("dojo.storage");
dojo.require("dojo.uri.*");

dojo.storage.browser.StorageProvider = function(){
	this.initialized = false;
	this.flash = null;
	this.backlog = [];
}

dojo.inherits(	dojo.storage.browser.StorageProvider, 
				dojo.storage.StorageProvider);

dojo.lang.extend(dojo.storage.browser.StorageProvider, {
	storageOnLoad: function(){
		this.initialized = true;
		this.hideStore();
		while(this.backlog.length){
			this.set.apply(this, this.backlog.shift());
		}
	},

	unHideStore: function(){
		var container = dojo.byId("dojo-storeContainer");
		with(container.style){
			position = "absolute";
			overflow = "visible";
			width = "215px";
			height = "138px";
			// FIXME: make these positions dependent on screen size/scrolling!
			left = "30px"; 
			top = "30px";
			visiblity = "visible";
			zIndex = "20";
			border = "1px solid black";
		}
	},

	hideStore: function(status){
		var container = dojo.byId("dojo-storeContainer");
		with(container.style){
			left = "-300px";
			top = "-300px";
		}
	},

	set: function(key, value, ns){
		if(!this.initialized){
			this.backlog.push([key, value, ns]);
			return "pending";
		}
		return this.flash.set(key, value, ns||this.namespace);
	},

	get: function(key, ns){
		return this.flash.get(key, ns||this.namespace);
	},

	writeStorage: function(){
		var swfloc = dojo.uri.dojoUri("src/storage/Storage.swf").toString();
		// alert(swfloc);
		
		// resolve current window protocol to avoid mixed-content security warning
		var protocol = "http"; 
		var regexp = new RegExp("https:", "i"); 
		if( regexp.test(window.location.href) ) {
		    protocol = "https"; 
		}

		var storeParts = [
			'<div id="dojo-storeContainer"',
				'style="position: absolute; left: -300px; top: -300px;">'];
		if(dojo.render.html.ie){
			storeParts.push('<object');
			storeParts.push('	style="border: 1px solid black;"');
			storeParts.push('	classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"');
			storeParts.push('	codebase="'+protocol+'://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"');
			storeParts.push('	width="215" height="138" id="dojoStorage">');
			storeParts.push('	<param name="movie" value="'+swfloc+'">');
			storeParts.push('	<param name="quality" value="high">');
			storeParts.push('</object>');
		}else{
			storeParts.push('<embed src="'+swfloc+'" width="215" height="138" ');
			storeParts.push('	quality="high" ');
			storeParts.push('	pluginspage="'+protocol+'://www.macromedia.com/go/getflashplayer" ');
			storeParts.push('	type="application/x-shockwave-flash" ');
			storeParts.push('	name="dojoStorage">');
			storeParts.push('</embed>');
		}
		storeParts.push('</div>');
		document.write(storeParts.join(""));
	}
});

dojo.storage.setProvider(new dojo.storage.browser.StorageProvider());
dojo.storage.provider.writeStorage();

dojo.addOnLoad(function(){
	dojo.storage.provider.flash = (dojo.render.html.ie) ? window["dojoStorage"] : document["dojoStorage"];
});

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.storage"],
	browser: ["dojo.storage.browser"]
});
dojo.hostenv.moduleLoaded("dojo.storage.*");


dojo.provide("dojo.collections.Collections");

dojo.collections = {Collections:true};
dojo.collections.DictionaryEntry = function(k,v){
	this.key = k;
	this.value = v;
	this.valueOf = function(){ return this.value; };
	this.toString = function(){ return this.value; };
}

dojo.collections.Iterator = function(a){
	var obj = a;
	var position = 0;
	this.atEnd = (position>=obj.length-1);
	this.current = obj[position];
	this.moveNext = function(){
		if(++position>=obj.length){
			this.atEnd = true;
		}
		if(this.atEnd){
			return false;
		}
		this.current=obj[position];
		return true;
	}
	this.reset = function(){
		position = 0;
		this.atEnd = false;
		this.current = obj[position];
	}
}

dojo.collections.DictionaryIterator = function(obj){
	var arr = [] ;	//	Create an indexing array
	for (var p in obj) arr.push(obj[p]) ;	//	fill it up
	var position = 0 ;
	this.atEnd = (position>=arr.length-1);
	this.current = arr[position]||null ;
	this.entry = this.current||null ;
	this.key = (this.entry)?this.entry.key:null ;
	this.value = (this.entry)?this.entry.value:null ;
	this.moveNext = function() { 
		if (++position>=arr.length) {
			this.atEnd = true ;
		}
		if(this.atEnd){
			return false;
		}
		this.entry = this.current = arr[position] ;
		if (this.entry) {
			this.key = this.entry.key ;
			this.value = this.entry.value ;
		}
		return true;
	} ;
	this.reset = function() { 
		position = 0 ; 
		this.atEnd = false ;
		this.current = arr[position]||null ;
		this.entry = this.current||null ;
		this.key = (this.entry)?this.entry.key:null ;
		this.value = (this.entry)?this.entry.value:null ;
	} ;
};

dojo.provide("dojo.collections.SortedList");
dojo.require("dojo.collections.Collections");

dojo.collections.SortedList = function(dictionary){
	var _this = this;
	var items = {};
	var q = [];
	var sorter = function(a,b){
		if (a.key > b.key) return 1;
		if (a.key < b.key) return -1;
		return 0;
	};
	var build = function(){
		q = [];
		var e = _this.getIterator();
		while (!e.atEnd) {
			q.push(e.entry);
			e.moveNext();
		}
		q.sort(sorter);
	};

	this.count = q.length;
	this.add = function(k,v){
		if (!items[k]) {
			items[k] = new dojo.collections.DictionaryEntry(k,v);
			this.count = q.push(items[k]);
			q.sort(sorter);
		}
	};
	this.clear = function(){
		items = {};
		q = [];
		this.count = q.length;
	};
	this.clone = function(){
		return new dojo.collections.SortedList(this);
	};
	this.contains = this.containsKey = function(k){
		return (items[k] != null);
	};
	this.containsValue = function(o){
		var e = this.getIterator();
		while (!e.atEnd){
			if (e.value == o) return true;
			e.moveNext();
		}
		return false;
	};
	this.copyTo = function(arr, i){
		var e = this.getIterator();
		var idx = i;
		while (!e.atEnd){
			arr.splice(idx, 0, e.entry);
			idx++;
			e.moveNext();
		}
	};
	this.getByIndex = function(i){
		return q[i].value;
	};
	this.getIterator = function(){
		return new dojo.collections.DictionaryIterator(items);
	};
	this.getKey = function(i){
		return q[i].key;
	};
	this.getKeyList = function(){
		var arr = [];
		var e = this.getIterator();
		while (!e.atEnd){
			arr.push(e.key);
			e.moveNext();
		}
		return arr;
	};
	this.getValueList = function(){
		var arr = [];
		var e = this.getIterator();
		while (!e.atEnd){
			arr.push(e.value);
			e.moveNext();
		}
		return arr;
	};
	this.indexOfKey = function(k){
		for (var i = 0; i < q.length; i++){
			if (q[i].key == k) {
				return i;
			}
		}
		return -1;
	};
	this.indexOfValue = function(o){
		for (var i = 0; i < q.length; i++){
			if (q[i].value == o) {
				return i;
			}
		}
		return -1;
	};
	this.item = function(k){
		return items[k];
	};

	this.remove = function(k){
		delete items[k];
		build();
		this.count = q.length;
	};
	this.removeAt = function(i){
		delete items[q[i].key];
		build();
		this.count = q.length;
	};

	this.setByIndex = function(i,o){
		items[q[i].key].value = o;
		build();
		this.count = q.length;
	};

	if (dictionary){
		var e = dictionary.getIterator();
		while (!e.atEnd) {
			q[q.length] = items[e.key] = new dojo.collections.DictionaryEntry(e.key, e.value);
			e.moveNext();
		}
		q.sort(sorter);
	}
}

dojo.provide("dojo.collections.Dictionary");
dojo.require("dojo.collections.Collections");

dojo.collections.Dictionary = function(dictionary){
	var items = {};
	this.count = 0;

	this.add = function(k,v){
		items[k] = new dojo.collections.DictionaryEntry(k,v);
		this.count++;
	};
	this.clear = function(){
		items = {};
		this.count = 0;
	};
	this.clone = function(){
		return new dojo.collections.Dictionary(this);
	};
	this.contains = this.containsKey = function(k){
		return (items[k] != null);
	};
	this.containsValue = function(v){
		var e = this.getIterator();
		while (!e.atEnd) {
			if (e.value == v) return true;
			e.moveNext();
		}
		return false;
	};
	this.getKeyList = function(){
		var arr = [];
		var e = this.getIterator();
		while (!e.atEnd) {
			arr.push(e.key);
			e.moveNext();
		}
		return arr;
	};
	this.getValueList = function(){
		var arr = [];
		var e = this.getIterator();
		while (!e.atEnd) {
			arr.push(e.value);
			e.moveNext();
		}
		return arr;
	};
	this.item = function(k){
		return items[k];
	};
	this.getIterator = function(){
		return new dojo.collections.DictionaryIterator(items);
	};
	this.remove = function(k){
		delete items[k];
		this.count--;
	};

	if (dictionary){
		var e = dictionary.getIterator();
		while (!e.atEnd) {
			 this.add(e.key, e.value);
			 e.moveNext();
		}
	}
};

dojo.provide("dojo.collections.Queue");
dojo.require("dojo.collections.Collections");

dojo.collections.Queue = function(arr){
	var q = [];
	if (arr) q = q.concat(arr);
	this.count = q.length;
	this.clear = function(){
		q = [];
		this.count = q.length;
	};
	this.clone = function(){
		return new dojo.collections.Queue(q);
	};
	this.contains = function(o){
		for (var i = 0; i < q.length; i++){
			if (q[i] == o) return true;
		}
		return false;
	};
	this.copyTo = function(arr, i){
		arr.splice(i,0,q);
	};
	this.dequeue = function(){
		var r = q.shift();
		this.count = q.length;
		return r;
	};
	this.enqueue = function(o){
		this.count = q.push(o);
	};
	this.getIterator = function(){
		return new dojo.collections.Iterator(q);
	};
	this.peek = function(){
		return q[0];
	};
	this.toArray = function(){
		return [].concat(q);
	};
};

dojo.provide("dojo.collections.ArrayList");
dojo.require("dojo.collections.Collections");

dojo.collections.ArrayList = function(arr){
	var items = [];
	if (arr) items = items.concat(arr);
	this.count = items.length;
	this.add = function(obj){
		items.push(obj);
		this.count = items.length;
	};
	this.addRange = function(a){
		if (a.getIterator) {
			var e = a.getIterator();
			while (!e.atEnd) {
				this.add(e.current);
				e.moveNext();
			}
			this.count = items.length;
		} else {
			for (var i=0; i<a.length; i++){
				items.push(a[i]);
			}
			this.count = items.length;
		}
	};
	this.clear = function(){
		items.splice(0, items.length);
		this.count = 0;
	};
	this.clone = function(){
		return new dojo.collections.ArrayList(items);
	};
	this.contains = function(obj){
		for (var i = 0; i < items.length; i++){
			if (items[i] == obj) {
				return true;
			}
		}
		return false;
	};
	this.getIterator = function(){
		return new dojo.collections.Iterator(items);
	};
	this.indexOf = function(obj){
		for (var i = 0; i < items.length; i++){
			if (items[i] == obj) {
				return i;
			}
		}
		return -1;
	};
	this.insert = function(i, obj){
		items.splice(i,0,obj);
		this.count = items.length;
	};
	this.item = function(k){
		return items[k];
	};
	this.remove = function(obj){
		var i = this.indexOf(obj);
		if (i >=0) {
			items.splice(i,1);
		}
		this.count = items.length;
	};
	this.removeAt = function(i){
		items.splice(i,1);
		this.count = items.length;
	};
	this.reverse = function(){
		items.reverse();
	};
	this.sort = function(fn){
		if (fn){
			items.sort(fn);
		} else {
			items.sort();
		}
	};
	this.setByIndex = function(i, obj){
		items[i]=obj;
		this.count=items.length;
	};
	this.toArray = function(){
		return [].concat(items);
	}
	this.toString = function(){
		return items.join(",");
	};
};

dojo.provide("dojo.collections.Stack");
dojo.require("dojo.collections.Collections");

dojo.collections.Stack = function(arr){
	var q = [];
	if (arr) q = q.concat(arr);
	this.count = q.length;
	this.clear = function(){
		q = [];
		this.count = q.length;
	};
	this.clone = function(){
		return new dojo.collections.Stack(q);
	};
	this.contains = function(o){
		for (var i = 0; i < q.length; i++){
			if (q[i] == o) return true;
		}
		return false;
	};
	this.copyTo = function(arr, i){
		arr.splice(i,0,q);
	};
	this.getIterator = function(){
		return new dojo.collections.Iterator(q);
	};
	this.peek = function(){
		return q[(q.length - 1)];
	};
	this.pop = function(){
		var r = q.pop();
		this.count = q.length;
		return r;
	};
	this.push = function(o){
		this.count = q.push(o);
	};
	this.toArray = function(){
		return [].concat(q);
	};
}

dojo.provide("dojo.collections.Set");
dojo.require("dojo.collections.Collections");
dojo.require("dojo.collections.ArrayList");

//	straight up sets are based on arrays or array-based collections.
dojo.collections.Set = new function(){
	this.union = function(setA, setB){
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var result = new dojo.collections.ArrayList(setA.toArray());
		var e = setB.getIterator();
		while (!e.atEnd){
			if (!result.contains(e.current)) result.add(e.current);
		}
		return result;
	};
	this.intersection = function(setA, setB){
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var result = new dojo.collections.ArrayList();
		var e = setB.getIterator();
		while (!e.atEnd){
			if (setA.contains(e.current)) result.add(e.current);
			e.moveNext();
		}
		return result;
	};
	//	returns everything in setA that is not in setB.
	this.difference = function(setA, setB){
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var result = new dojo.collections.ArrayList();
		var e = setA.getIterator();
		while (!e.atEnd){
			if (!setB.contains(e.current)) result.add(e.current);
			e.moveNext();
		}
		return result;
	};
	this.isSubSet = function(setA, setB) {
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var e = setA.getIterator();
		while (!e.atEnd){
			if (!setB.contains(e.current)) return false;
			e.moveNext();
		}
		return true;
	};
	this.isSuperSet = function(setA, setB){
		if (setA.constructor == Array) var setA = new dojo.collections.ArrayList(setA);
		if (setB.constructor == Array) var setB = new dojo.collections.ArrayList(setB);
		if (!setA.toArray || !setB.toArray) dojo.raise("Set operations can only be performed on array-based collections.");
		var e = setB.getIterator();
		while (!e.atEnd){
			if (!setA.contains(e.current)) return false;
			e.moveNext();
		}
		return true;
	};
}();

dojo.hostenv.conditionalLoadModule({
	common: [
		"dojo.collections.Collections",
		"dojo.collections.SortedList", 
		"dojo.collections.Dictionary", 
		"dojo.collections.Queue", 
		"dojo.collections.ArrayList", 
		"dojo.collections.Stack",
		"dojo.collections.Set"
	]
});
dojo.hostenv.moduleLoaded("dojo.collections.*");

dojo.provide("dojo.graphics.htmlEffects");
dojo.require("dojo.fx.*");

dj_deprecated("dojo.graphics.htmlEffects is deprecated, use dojo.fx.html instead");

dojo.graphics.htmlEffects = dojo.fx.html;

dojo.hostenv.conditionalLoadModule({
	browser:	["dojo.graphics.htmlEffects"]
});
dojo.hostenv.moduleLoaded("dojo.graphics.*");

dojo.provide("dojo.widget.Manager");
dojo.require("dojo.lang");
dojo.require("dojo.event.*");

// Manager class
dojo.widget.manager = new function(){
	this.widgets = [];
	this.widgetIds = [];
	
	// map of widgetId-->widget for widgets without parents (top level widgets)
	this.topWidgets = {};

	var widgetTypeCtr = {};
	var renderPrefixCache = [];

	this.getUniqueId = function (widgetType) {
		return widgetType + "_" + (widgetTypeCtr[widgetType] != undefined ?
			++widgetTypeCtr[widgetType] : widgetTypeCtr[widgetType] = 0);
	}

	this.add = function(widget){
		dojo.profile.start("dojo.widget.manager.add");
		this.widgets.push(widget);
		// FIXME: the rest of this method is very slow!
		if(widget.widgetId == ""){
			if(widget["id"]){
				widget.widgetId = widget["id"];
			}else if(widget.extraArgs["id"]){
				widget.widgetId = widget.extraArgs["id"];
			}else{
				widget.widgetId = this.getUniqueId(widget.widgetType);
			}
		}
		if(this.widgetIds[widget.widgetId]){
			dojo.debug("widget ID collision on ID: "+widget.widgetId);
		}
		this.widgetIds[widget.widgetId] = widget;
		// Widget.destroy already calls removeById(), so we don't need to
		// connect() it here
		dojo.profile.end("dojo.widget.manager.add");
	}

	this.destroyAll = function(){
		for(var x=this.widgets.length-1; x>=0; x--){
			try{
				// this.widgets[x].destroyChildren();
				this.widgets[x].destroy(true);
				delete this.widgets[x];
			}catch(e){ }
		}
	}

	// FIXME: we should never allow removal of the root widget until all others
	// are removed!
	this.remove = function(widgetIndex){
		var tw = this.widgets[widgetIndex].widgetId;
		delete this.widgetIds[tw];
		this.widgets.splice(widgetIndex, 1);
	}
	
	// FIXME: suboptimal performance
	this.removeById = function(id) {
		for (var i=0; i<this.widgets.length; i++){
			if(this.widgets[i].widgetId == id){
				this.remove(i);
				break;
			}
		}
	}

	this.getWidgetById = function(id){
		return this.widgetIds[id];
	}

	this.getWidgetsByType = function(type){
		var lt = type.toLowerCase();
		var ret = [];
		dojo.lang.forEach(this.widgets, function(x){
			if(x.widgetType.toLowerCase() == lt){
				ret.push(x);
			}
		});
		return ret;
	}

	this.getWidgetsOfType = function (id) {
		dj_deprecated("getWidgetsOfType is depecrecated, use getWidgetsByType");
		return dojo.widget.manager.getWidgetsByType(id);
	}

	this.getWidgetsByFilter = function(unaryFunc){
		var ret = [];
		dojo.lang.forEach(this.widgets, function(x){
			if(unaryFunc(x)){
				ret.push(x);
			}
		});
		return ret;
	}

	this.getAllWidgets = function() {
		return this.widgets.concat();
	}

	// shortcuts, baby
	this.byId = this.getWidgetById;
	this.byType = this.getWidgetsByType;
	this.byFilter = this.getWidgetsByFilter;

	// map of previousally discovered implementation names to constructors
	var knownWidgetImplementations = {};

	// support manually registered widget packages
	var widgetPackages = ["dojo.widget", "dojo.webui.widgets"];
	for (var i=0; i<widgetPackages.length; i++) {
		// convenience for checking if a package exists (reverse lookup)
		widgetPackages[widgetPackages[i]] = true;
	}

	this.registerWidgetPackage = function(pname) {
		if(!widgetPackages[pname]){
			widgetPackages[pname] = true;
			widgetPackages.push(pname);
		}
	}
	
	this.getWidgetPackageList = function() {
		return dojo.lang.map(widgetPackages, function(elt) { return(elt!==true ? elt : undefined); });
	}
	
	this.getImplementation = function(widgetName, ctorObject, mixins){
		// try and find a name for the widget
		var impl = this.getImplementationName(widgetName);
		if(impl){ 
			// var tic = new Date();
			var ret = new impl(ctorObject);
			// dojo.debug(new Date() - tic);
			return ret;
		}
	}

	this.getImplementationName = function(widgetName){
		/*
		 * This is the overly-simplistic implemention of getImplementation (har
		 * har). In the future, we are going to want something that allows more
		 * freedom of expression WRT to specifying different specializations of
		 * a widget.
		 *
		 * Additionally, this implementation treats widget names as case
		 * insensitive, which does not necessarialy mesh with the markup which
		 * can construct a widget.
		 */

		var lowerCaseWidgetName = widgetName.toLowerCase();

		var impl = knownWidgetImplementations[lowerCaseWidgetName];
		if(impl){
			return impl;
		}

		// first store a list of the render prefixes we are capable of rendering
		if(!renderPrefixCache.length){
			for(var renderer in dojo.render){
				if(dojo.render[renderer]["capable"] === true){
					var prefixes = dojo.render[renderer].prefixes;
					for(var i = 0; i < prefixes.length; i++){
						renderPrefixCache.push(prefixes[i].toLowerCase());
					}
				}
			}
			// make sure we don't HAVE to prefix widget implementation names
			// with anything to get them to render
			renderPrefixCache.push("");
		}

		// look for a rendering-context specific version of our widget name
		for(var i = 0; i < widgetPackages.length; i++){
			var widgetPackage = dojo.evalObjPath(widgetPackages[i]);
			if(!widgetPackage) { continue; }

			for (var j = 0; j < renderPrefixCache.length; j++) {
				if (!widgetPackage[renderPrefixCache[j]]) { continue; }
				for (var widgetClass in widgetPackage[renderPrefixCache[j]]) {
					if (widgetClass.toLowerCase() != lowerCaseWidgetName) { continue; }
					knownWidgetImplementations[lowerCaseWidgetName] =
						widgetPackage[renderPrefixCache[j]][widgetClass];
					return knownWidgetImplementations[lowerCaseWidgetName];
				}
			}

			for (var j = 0; j < renderPrefixCache.length; j++) {
				for (var widgetClass in widgetPackage) {
					if (widgetClass.toLowerCase() !=
						(renderPrefixCache[j] + lowerCaseWidgetName)) { continue; }
	
					knownWidgetImplementations[lowerCaseWidgetName] =
						widgetPackage[widgetClass];
					return knownWidgetImplementations[lowerCaseWidgetName];
				}
			}
		}
		
		throw new Error('Could not locate "' + widgetName + '" class');
	}

	// FIXME: does it even belong in this name space?
	// NOTE: this method is implemented by DomWidget.js since not all
	// hostenv's would have an implementation.
	/*this.getWidgetFromPrimitive = function(baseRenderType){
		dj_unimplemented("dojo.widget.manager.getWidgetFromPrimitive");
	}

	this.getWidgetFromEvent = function(nativeEvt){
		dj_unimplemented("dojo.widget.manager.getWidgetFromEvent");
	}*/

	// Catch window resize events and notify top level widgets
	this.resizing=false;
	this.onResized = function() {
		if(this.resizing){
			return;	// duplicate event
		}
		try {
			this.resizing=true;
			for(var id in this.topWidgets) {
				var child = this.topWidgets[id];
				//dojo.debug("root resizing child " + child.widgetId);
				if ( child.onResized ) {
					child.onResized();
				}
			}
		} finally {
			this.resizing=false;
		}
	}
	if(typeof window != "undefined") {
		dojo.addOnLoad(this, 'onResized');							// initial sizing
		dojo.event.connect(window, 'onresize', this, 'onResized');	// window resize
	}

	// FIXME: what else?
}

// copy the methods from the default manager (this) to the widget namespace
dojo.widget.getUniqueId = function () { return dojo.widget.manager.getUniqueId.apply(dojo.widget.manager, arguments); }
dojo.widget.addWidget = function () { return dojo.widget.manager.add.apply(dojo.widget.manager, arguments); }
dojo.widget.destroyAllWidgets = function () { return dojo.widget.manager.destroyAll.apply(dojo.widget.manager, arguments); }
dojo.widget.removeWidget = function () { return dojo.widget.manager.remove.apply(dojo.widget.manager, arguments); }
dojo.widget.removeWidgetById = function () { return dojo.widget.manager.removeById.apply(dojo.widget.manager, arguments); }
dojo.widget.getWidgetById = function () { return dojo.widget.manager.getWidgetById.apply(dojo.widget.manager, arguments); }
dojo.widget.getWidgetsByType = function () { return dojo.widget.manager.getWidgetsByType.apply(dojo.widget.manager, arguments); }
dojo.widget.getWidgetsByFilter = function () { return dojo.widget.manager.getWidgetsByFilter.apply(dojo.widget.manager, arguments); }
dojo.widget.byId = function () { return dojo.widget.manager.getWidgetById.apply(dojo.widget.manager, arguments); }
dojo.widget.byType = function () { return dojo.widget.manager.getWidgetsByType.apply(dojo.widget.manager, arguments); }
dojo.widget.byFilter = function () { return dojo.widget.manager.getWidgetsByFilter.apply(dojo.widget.manager, arguments); }
dojo.widget.all = function (n) {
	var widgets = dojo.widget.manager.getAllWidgets.apply(dojo.widget.manager, arguments);
	if(arguments.length > 0) {
		return widgets[n];
	}
	return widgets;
}
dojo.widget.registerWidgetPackage = function () { return dojo.widget.manager.registerWidgetPackage.apply(dojo.widget.manager, arguments); }
dojo.widget.getWidgetImplementation = function () { return dojo.widget.manager.getImplementation.apply(dojo.widget.manager, arguments); }
dojo.widget.getWidgetImplementationName = function () { return dojo.widget.manager.getImplementationName.apply(dojo.widget.manager, arguments); }

dojo.widget.widgets = dojo.widget.manager.widgets;
dojo.widget.widgetIds = dojo.widget.manager.widgetIds;
dojo.widget.root = dojo.widget.manager.root;

dojo.provide("dojo.widget.Widget");
dojo.provide("dojo.widget.tags");

dojo.require("dojo.lang");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.event.*");
dojo.require("dojo.string");

dojo.widget.Widget = function(){
	// these properties aren't primitives and need to be created on a per-item
	// basis.
	this.children = [];
	// this.selection = new dojo.widget.Selection();
	// FIXME: need to replace this with context menu stuff
	this.extraArgs = {};
}
// FIXME: need to be able to disambiguate what our rendering context is
//        here!

// needs to be a string with the end classname. Every subclass MUST
// over-ride.
dojo.lang.extend(dojo.widget.Widget, {
	// base widget properties
	parent: null,
	// obviously, top-level and modal widgets should set these appropriately
	isTopLevel:  false,
	isModal: false,

	isEnabled: true,
	isHidden: false,
	isContainer: false, // can we contain other widgets?
	widgetId: "",
	widgetType: "Widget", // used for building generic widgets

	toString: function() {
		return '[Widget ' + this.widgetType + ', ' + (this.widgetId || 'NO ID') + ']';
	},

	repr: function(){
		return this.toString();
	},

	enable: function(){
		// should be over-ridden
		this.isEnabled = true;
	},

	disable: function(){
		// should be over-ridden
		this.isEnabled = false;
	},

	hide: function(){
		// should be over-ridden
		this.isHidden = true;
	},

	show: function(){
		// should be over-ridden
		this.isHidden = false;
	},

	create: function(args, fragment, parentComp){
		// dojo.debug(this.widgetType, "create");
		this.satisfyPropertySets(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> mixInProperties");
		this.mixInProperties(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> postMixInProperties");
		this.postMixInProperties(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> dojo.widget.manager.add");
		dojo.widget.manager.add(this);
		// dojo.debug(this.widgetType, "-> buildRendering");
		this.buildRendering(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> initialize");
		this.initialize(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> postInitialize");
		this.postInitialize(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "-> postCreate");
		this.postCreate(args, fragment, parentComp);
		// dojo.debug(this.widgetType, "done!");
		return this;
	},

	destroy: function(finalize){
		// FIXME: this is woefully incomplete
		this.uninitialize();
		this.destroyRendering(finalize);
		dojo.widget.manager.removeById(this.widgetId);
	},

	destroyChildren: function(testFunc){
		testFunc = (!testFunc) ? function(){ return true; } : testFunc;
		for(var x=0; x<this.children.length; x++){
			var tc = this.children[x];
			if((tc)&&(testFunc(tc))){
				tc.destroy();
			}
		}
		// this.children = [];
	},

	destroyChildrenOfType: function(type){
		type = type.toLowerCase();
		this.destroyChildren(function(item){
			if(item.widgetType.toLowerCase() == type){
				return true;
			}else{
				return false;
			}
		});
	},

	getChildrenOfType: function(type, recurse){
		var ret = [];
		type = type.toLowerCase();
		for(var x=0; x<this.children.length; x++){
			if(this.children[x].widgetType.toLowerCase() == type){
				ret.push(this.children[x]);
			}
			if(recurse){
				ret = ret.concat(this.children[x].getChildrenOfType(type, recurse));
			}
		}
		return ret;
	},

	getDescendants: function(){
		// FIXME: this does not appear to be recursive. Shouldn't a function 
		// with this signature get *all* descendants?
		var result = [];
		var stack = [this];
		var elem;
		while (elem = stack.pop()){
			result.push(elem);
			dojo.lang.forEach(elem.children, function(elem) { stack.push(elem); });
		}
		return result;
	},

	satisfyPropertySets: function(args){
		// dojo.profile.start("satisfyPropertySets");
		// get the default propsets for our component type
		/*
		var typePropSets = []; // FIXME: need to pull these from somewhere!
		var localPropSets = []; // pull out propsets from the parser's return structure

		// for(var x=0; x<args.length; x++){
		// }

		for(var x=0; x<typePropSets.length; x++){
		}

		for(var x=0; x<localPropSets.length; x++){
		}
		*/
		// dojo.profile.end("satisfyPropertySets");
		
		return args;
	},

	mixInProperties: function(args, frag){
		if((args["fastMixIn"])||(frag["fastMixIn"])){
			// dojo.profile.start("mixInProperties_fastMixIn");
			// fast mix in assumes case sensitivity, no type casting, etc...
			// dojo.lang.mixin(this, args);
			for(var x in args){
				this[x] = args[x];
			}
			// dojo.profile.end("mixInProperties_fastMixIn");
			return;
		}
		// dojo.profile.start("mixInProperties");
		/*
		 * the actual mix-in code attempts to do some type-assignment based on
		 * PRE-EXISTING properties of the "this" object. When a named property
		 * of a propset is located, it is first tested to make sure that the
		 * current object already "has one". Properties which are undefined in
		 * the base widget are NOT settable here. The next step is to try to
		 * determine type of the pre-existing property. If it's a string, the
		 * property value is simply assigned. If a function, the property is
		 * replaced with a "new Function()" declaration. If an Array, the
		 * system attempts to split the string value on ";" chars, and no
		 * further processing is attempted (conversion of array elements to a
		 * integers, for instance). If the property value is an Object
		 * (testObj.constructor === Object), the property is split first on ";"
		 * chars, secondly on ":" chars, and the resulting key/value pairs are
		 * assigned to an object in a map style. The onus is on the property
		 * user to ensure that all property values are converted to the
		 * expected type before usage.
		 */

		var undef;

		// NOTE: we cannot assume that the passed properties are case-correct
		// (esp due to some browser bugs). Therefore, we attempt to locate
		// properties for assignment regardless of case. This may cause
		// problematic assignments and bugs in the future and will need to be
		// documented with big bright neon lights.

		// FIXME: fails miserably if a mixin property has a default value of null in 
		// a widget

		// NOTE: caching lower-cased args in the prototype is only 
		// acceptable if the properties are invariant.
		// if we have a name-cache, get it
		var lcArgs = dojo.widget.lcArgsCache[this.widgetType];
		if ( lcArgs == null ){
			// build a lower-case property name cache if we don't have one
			lcArgs = {};
			for(var y in this){
				lcArgs[((new String(y)).toLowerCase())] = y;
			}
			dojo.widget.lcArgsCache[this.widgetType] = lcArgs;
		}
		var visited = {};
		for(var x in args){
			if(!this[x]){ // check the cache for properties
				var y = lcArgs[(new String(x)).toLowerCase()];
				if(y){
					args[y] = args[x];
					x = y; 
				}
			}
			if(visited[x]){ continue; }
			visited[x] = true;
			if((typeof this[x]) != (typeof undef)){
				if(typeof args[x] != "string"){
					this[x] = args[x];
				}else{
					if(dojo.lang.isString(this[x])){
						this[x] = args[x];
					}else if(dojo.lang.isNumber(this[x])){
						this[x] = new Number(args[x]); // FIXME: what if NaN is the result?
					}else if(dojo.lang.isBoolean(this[x])){
						this[x] = (args[x].toLowerCase()=="false") ? false : true;
					}else if(dojo.lang.isFunction(this[x])){

						// FIXME: need to determine if always over-writing instead
						// of attaching here is appropriate. I suspect that we
						// might want to only allow attaching w/ action items.
						
						// RAR, 1/19/05: I'm going to attach instead of
						// over-write here. Perhaps function objects could have
						// some sort of flag set on them? Or mixed-into objects
						// could have some list of non-mutable properties
						// (although I'm not sure how that would alleviate this
						// particular problem)? 

						// this[x] = new Function(args[x]);

						// after an IRC discussion last week, it was decided
						// that these event handlers should execute in the
						// context of the widget, so that the "this" pointer
						// takes correctly.
						var tn = dojo.lang.nameAnonFunc(new Function(args[x]), this);
						dojo.event.connect(this, x, this, tn);
					}else if(dojo.lang.isArray(this[x])){ // typeof [] == "object"
						this[x] = args[x].split(";");
					} else if (this[x] instanceof Date) {
						this[x] = new Date(Number(args[x])); // assume timestamp
					}else if(typeof this[x] == "object"){ 
						// FIXME: should we be allowing extension here to handle
						// other object types intelligently?

						// FIXME: unlike all other types, we do not replace the
						// object with a new one here. Should we change that?
						var pairs = args[x].split(";");
						for(var y=0; y<pairs.length; y++){
							var si = pairs[y].indexOf(":");
							if((si != -1)&&(pairs[y].length>si)){
								this[x][dojo.string.trim(pairs[y].substr(0, si))] = pairs[y].substr(si+1);
							}
						}
					}else{
						// the default is straight-up string assignment. When would
						// we ever hit this?
						this[x] = args[x];
					}
				}
			}else{
				// collect any extra 'non mixed in' args
				this.extraArgs[x] = args[x];
			}
		}
		// dojo.profile.end("mixInProperties");
	},
	
	postMixInProperties: function(){
	},

	initialize: function(args, frag){
		// dj_unimplemented("dojo.widget.Widget.initialize");
		return false;
	},

	postInitialize: function(args, frag){
		return false;
	},

	postCreate: function(args, frag){
		return false;
	},

	uninitialize: function(){
		// dj_unimplemented("dojo.widget.Widget.uninitialize");
		return false;
	},

	buildRendering: function(){
		// SUBCLASSES MUST IMPLEMENT
		dj_unimplemented("dojo.widget.Widget.buildRendering, on "+this.toString()+", ");
		return false;
	},

	destroyRendering: function(){
		// SUBCLASSES MUST IMPLEMENT
		dj_unimplemented("dojo.widget.Widget.destroyRendering");
		return false;
	},

	cleanUp: function(){
		// SUBCLASSES MUST IMPLEMENT
		dj_unimplemented("dojo.widget.Widget.cleanUp");
		return false;
	},

	addedTo: function(parent){
		// this is just a signal that can be caught
	},

	addChild: function(child){
		// SUBCLASSES MUST IMPLEMENT
		dj_unimplemented("dojo.widget.Widget.addChild");
		return false;
	},

	addChildAtIndex: function(child, index){
		// SUBCLASSES MUST IMPLEMENT
		dj_unimplemented("dojo.widget.Widget.addChildAtIndex");
		return false;
	},

	removeChild: function(childRef){
		// SUBCLASSES MUST IMPLEMENT
		dj_unimplemented("dojo.widget.Widget.removeChild");
		return false;
	},

	removeChildAtIndex: function(index){
		// SUBCLASSES MUST IMPLEMENT
		dj_unimplemented("dojo.widget.Widget.removeChildAtIndex");
		return false;
	},

	resize: function(width, height){
		// both width and height may be set as percentages. The setWidth and
		// setHeight  functions attempt to determine if the passed param is
		// specified in percentage or native units. Integers without a
		// measurement are assumed to be in the native unit of measure.
		this.setWidth(width);
		this.setHeight(height);
	},

	setWidth: function(width){
		if((typeof width == "string")&&(width.substr(-1) == "%")){
			this.setPercentageWidth(width);
		}else{
			this.setNativeWidth(width);
		}
	},

	setHeight: function(height){
		if((typeof height == "string")&&(height.substr(-1) == "%")){
			this.setPercentageHeight(height);
		}else{
			this.setNativeHeight(height);
		}
	},

	setPercentageHeight: function(height){
		// SUBCLASSES MUST IMPLEMENT
		return false;
	},

	setNativeHeight: function(height){
		// SUBCLASSES MUST IMPLEMENT
		return false;
	},

	setPercentageWidth: function(width){
		// SUBCLASSES MUST IMPLEMENT
		return false;
	},

	setNativeWidth: function(width){
		// SUBCLASSES MUST IMPLEMENT
		return false;
	},

	getDescendants: function() {
		var result = [];
		var stack = [this];
		var elem;
		while (elem = stack.pop()) {
			result.push(elem);
			dojo.lang.forEach(elem.children, function(elem) { stack.push(elem); });
		}
 
		return result;
	}
});

// Lower case name cache: listing of the lower case elements in each widget.
// We can't store the lcArgs in the widget itself because if B subclasses A,
// then B.prototype.lcArgs might return A.prototype.lcArgs, which is not what we
// want
dojo.widget.lcArgsCache = {};

// TODO: should have a more general way to add tags or tag libraries?
// TODO: need a default tags class to inherit from for things like getting propertySets
// TODO: parse properties/propertySets into component attributes
// TODO: parse subcomponents
// TODO: copy/clone raw markup fragments/nodes as appropriate
dojo.widget.tags = {};
dojo.widget.tags.addParseTreeHandler = function(type){
	var ltype = type.toLowerCase();
	this[ltype] = function(fragment, widgetParser, parentComp, insertionIndex, localProps){ 
		return dojo.widget.buildWidgetFromParseTree(ltype, fragment, widgetParser, parentComp, insertionIndex, localProps);
	}
}
dojo.widget.tags.addParseTreeHandler("dojo:widget");

dojo.widget.tags["dojo:propertyset"] = function(fragment, widgetParser, parentComp){
	// FIXME: Is this needed?
	// FIXME: Not sure that this parses into the structure that I want it to parse into...
	// FIXME: add support for nested propertySets
	var properties = widgetParser.parseProperties(fragment["dojo:propertyset"]);
}

// FIXME: need to add the <dojo:connect />
dojo.widget.tags["dojo:connect"] = function(fragment, widgetParser, parentComp){
	var properties = widgetParser.parseProperties(fragment["dojo:connect"]);
}

dojo.widget.buildWidgetFromParseTree = function(type, frag, 
												parser, parentComp, 
												insertionIndex, localProps){
	var stype = type.split(":");
	stype = (stype.length == 2) ? stype[1] : type;
	// FIXME: we don't seem to be doing anything with this!
	// var propertySets = parser.getPropertySets(frag);
	var localProperties = localProps || parser.parseProperties(frag["dojo:"+stype]);
	// var tic = new Date();
	var twidget = dojo.widget.manager.getImplementation(stype);
	if(!twidget){
		throw new Error("cannot find \"" + stype + "\" widget");
	}else if (!twidget.create){
		throw new Error("\"" + stype + "\" widget object does not appear to implement *Widget");
	}
	localProperties["dojoinsertionindex"] = insertionIndex;
	// FIXME: we loose no less than 5ms in construction!
	var ret = twidget.create(localProperties, frag, parentComp);
	// dojo.debug(new Date() - tic);
	return ret;
}

dojo.provide("dojo.widget.Parse");

dojo.require("dojo.widget.Manager");
dojo.require("dojo.string");
dojo.require("dojo.dom");

dojo.widget.Parse = function(fragment) {
	this.propertySetsList = [];
	this.fragment = fragment;

	/*	createComponents recurses over a raw JavaScript object structure,
			and calls the corresponding handler for its normalized tagName if it exists
	*/
	this.createComponents = function(fragment, parentComp){
		var djTags = dojo.widget.tags;
		var returnValue = [];
		// this allows us to parse without having to include the parent
		// it is commented out as it currently breaks the existing mechanism for
		// adding widgets programmatically.  Once that is fixed, this can be used
		/*if( (fragment["tagName"])&&
			(fragment != fragment["nodeRef"])){
			var tn = new String(fragment["tagName"]);
			// we split so that you can declare multiple
			// non-destructive widgets from the same ctor node
			var tna = tn.split(";");
			for(var x=0; x<tna.length; x++){
				var ltn = dojo.text.trim(tna[x]).toLowerCase();
				if(djTags[ltn]){
					fragment.tagName = ltn;
					returnValue.push(djTags[ltn](fragment, this, parentComp, count++));
				}else{
					if(ltn.substr(0, 5)=="dojo:"){
						dj_debug("no tag handler registed for type: ", ltn);
					}
				}
			}
		}*/
		for(var item in fragment){
			var built = false;
			// if we have items to parse/create at this level, do it!
			try{
				if( fragment[item] && (fragment[item]["tagName"])&&
					(fragment[item] != fragment["nodeRef"])){
					var tn = new String(fragment[item]["tagName"]);
					// we split so that you can declare multiple
					// non-destructive widgets from the same ctor node
					var tna = tn.split(";");
					for(var x=0; x<tna.length; x++){
						var ltn = dojo.string.trim(tna[x]).toLowerCase();
						if(djTags[ltn]){
							built = true;
							// var tic = new Date();
							fragment[item].tagName = ltn;
							var ret = djTags[ltn](fragment[item], this, parentComp, fragment[item]["index"])
							returnValue.push(ret);
						}else{
							if((dojo.lang.isString(ltn))&&(ltn.substr(0, 5)=="dojo:")){
								dojo.debug("no tag handler registed for type: ", ltn);
							}
						}
					}
				}
			}catch(e){
				dojo.debug("fragment creation error:", e);
				// throw(e);
				// IE is such a bitch sometimes
			}

			// if there's a sub-frag, build widgets from that too
			if( (!built) && (typeof fragment[item] == "object")&&
				(fragment[item] != fragment.nodeRef)&&
				(fragment[item] != fragment["tagName"])){
				returnValue.push(this.createComponents(fragment[item], parentComp));
			}
		}
		return returnValue;
	}

	/*  parsePropertySets checks the top level of a raw JavaScript object
			structure for any propertySets.  It stores an array of references to 
			propertySets that it finds.
	*/
	this.parsePropertySets = function(fragment) {
		return [];
		var propertySets = [];
		for(var item in fragment){
			if(	(fragment[item]["tagName"] == "dojo:propertyset") ) {
				propertySets.push(fragment[item]);
			}
		}
		// FIXME: should we store these propertySets somewhere for later retrieval
		this.propertySetsList.push(propertySets);
		return propertySets;
	}
	
	/*  parseProperties checks a raw JavaScript object structure for
			properties, and returns an array of properties that it finds.
	*/
	this.parseProperties = function(fragment) {
		var properties = {};
		for(var item in fragment){
			// FIXME: need to check for undefined?
			// case: its a tagName or nodeRef
			if((fragment[item] == fragment["tagName"])||
				(fragment[item] == fragment.nodeRef)){
				// do nothing
			}else{
				if((fragment[item]["tagName"])&&
					(dojo.widget.tags[fragment[item].tagName.toLowerCase()])){
					// TODO: it isn't a property or property set, it's a fragment, 
					// so do something else
					// FIXME: needs to be a better/stricter check
					// TODO: handle xlink:href for external property sets
				}else if((fragment[item][0])&&(fragment[item][0].value!="")){
					try{
						// FIXME: need to allow more than one provider
						if(item.toLowerCase() == "dataprovider") {
							var _this = this;
							this.getDataProvider(_this, fragment[item][0].value);
							properties.dataProvider = this.dataProvider;
						}
						properties[item] = fragment[item][0].value;
						var nestedProperties = this.parseProperties(fragment[item]);
						// FIXME: this kind of copying is expensive and inefficient!
						for(var property in nestedProperties){
							properties[property] = nestedProperties[property];
						}
					}catch(e){ dojo.debug(e); }
				}
			}
		}
		return properties;
	}

	/* getPropertySetById returns the propertySet that matches the provided id
	*/
	
	this.getDataProvider = function(objRef, dataUrl) {
		// FIXME: this is currently sync.  To make this async, we made need to move 
		//this step into the widget ctor, so that it is loaded when it is needed 
		// to populate the widget
		dojo.io.bind({
			url: dataUrl,
			load: function(type, evaldObj){
				if(type=="load"){
					objRef.dataProvider = evaldObj;
				}
			},
			mimetype: "text/javascript",
			sync: true
		});
	}

	
	this.getPropertySetById = function(propertySetId){
		for(var x = 0; x < this.propertySetsList.length; x++){
			if(propertySetId == this.propertySetsList[x]["id"][0].value){
				return this.propertySetsList[x];
			}
		}
		return "";
	}
	
	/* getPropertySetsByType returns the propertySet(s) that match(es) the
	 * provided componentClass
	 */
	this.getPropertySetsByType = function(componentType){
		var propertySets = [];
		for(var x=0; x < this.propertySetsList.length; x++){
			var cpl = this.propertySetsList[x];
			var cpcc = cpl["componentClass"]||cpl["componentType"]||null;
			if((cpcc)&&(propertySetId == cpcc[0].value)){
				propertySets.push(cpl);
			}
		}
		return propertySets;
	}
	
	/* getPropertySets returns the propertySet for a given component fragment
	*/
	this.getPropertySets = function(fragment){
		var ppl = "dojo:propertyproviderlist";
		var propertySets = [];
		var tagname = fragment["tagName"];
		if(fragment[ppl]){ 
			var propertyProviderIds = fragment[ppl].value.split(" ");
			// FIXME: should the propertyProviderList attribute contain #
			// 		  syntax for reference to ids or not?
			// FIXME: need a better test to see if this is local or external
			// FIXME: doesn't handle nested propertySets, or propertySets that
			// 		  just contain information about css documents, etc.
			for(propertySetId in propertyProviderIds){
				if((propertySetId.indexOf("..")==-1)&&(propertySetId.indexOf("://")==-1)){
					// get a reference to a propertySet within the current parsed structure
					var propertySet = this.getPropertySetById(propertySetId);
					if(propertySet != ""){
						propertySets.push(propertySet);
					}
				}else{
					// FIXME: add code to parse and return a propertySet from
					// another document
					// alex: is this even necessaray? Do we care? If so, why?
				}
			}
		}
		// we put the typed ones first so that the parsed ones override when
		// iteration happens.
		return (this.getPropertySetsByType(tagname)).concat(propertySets);
	}
	
	/* 
		nodeRef is the node to be replaced... in the future, we might want to add 
		an alternative way to specify an insertion point

		componentName is the expected dojo widget name, i.e. Button of ContextMenu

		properties is an object of name value pairs
	*/
	this.createComponentFromScript = function(nodeRef, componentName, properties){
		var ltn = "dojo:" + componentName.toLowerCase();
		if(dojo.widget.tags[ltn]){
			properties.fastMixIn = true;
			return [dojo.widget.tags[ltn](properties, this, null, null, properties)];
		}else{
			if(ltn.substr(0, 5)=="dojo:"){
				dojo.debug("no tag handler registed for type: ", ltn);
			}
		}
	}
}


dojo.widget._parser_collection = {"dojo": new dojo.widget.Parse() };
dojo.widget.getParser = function(name){
	if(!name){ name = "dojo"; }
	if(!this._parser_collection[name]){
		this._parser_collection[name] = new dojo.widget.Parse();
	}
	return this._parser_collection[name];
}

/**
 * Creates widget.
 *
 * @param name     The name of the widget to create
 * @param props    Key-Value pairs of properties of the widget
 * @param refNode  If the last argument is specified this node is used as
 *                 a reference for inserting this node into a DOM tree else
 *                 it beomces the domNode
 * @param position The position to insert this widget's node relative to the
 *                 refNode argument
 * @return The new Widget object
 */
 
dojo.widget.createWidget = function (name, props, refNode, position) {

	function fromScript (placeKeeperNode, name, props) {
		var lowerCaseName = name.toLowerCase();
		var namespacedName = "dojo:" + lowerCaseName;
		props[namespacedName] = { 
			dojotype: [{value: lowerCaseName}],
			nodeRef: placeKeeperNode,
			fastMixIn: true
		};
		return dojo.widget.getParser().createComponentFromScript(
			placeKeeperNode, name, props, true);
	}

	if (typeof name != "string" && typeof props == "string") {
		dojo.deprecated("dojo.widget.createWidget", 
			"argument order is now of the form " +
			"dojo.widget.createWidget(NAME, [PROPERTIES, [REFERENCENODE, [POSITION]]])");
		return fromScript(name, props, refNode);
	}
	
	props = props||{};
	var notRef = false;
	var tn = null;
	var h = dojo.render.html.capable;
	if(h){
		tn = document.createElement("span");
	}
	if(!refNode){
		notRef = true;
		refNode = tn;
		if(h){
			dojo.html.body().appendChild(refNode);
		}
	}else if(position){
		dojo.dom.insertAtPosition(tn, refNode, position);
	}else{ // otherwise don't replace, but build in-place
		tn = refNode;
	}
	var widgetArray = fromScript(tn, name, props);
	if (!widgetArray[0] || typeof widgetArray[0].widgetType == "undefined") {
		throw new Error("createWidget: Creation of \"" + name + "\" widget failed.");
	}
	if (notRef) {
		if (widgetArray[0].domNode.parentNode) {
			widgetArray[0].domNode.parentNode.removeChild(widgetArray[0].domNode);
		}
	}
	return widgetArray[0]; // just return the widget
}
 
dojo.widget.fromScript = function(name, props, refNode, position){
	dojo.deprecated("dojo.widget.fromScript", " use " +
		"dojo.widget.createWidget instead");
	return dojo.widget.createWidget(name, props, refNode, position);
}

dojo.provide("dojo.widget.DomWidget");

dojo.require("dojo.event.*");
dojo.require("dojo.string");
dojo.require("dojo.widget.Widget");
dojo.require("dojo.dom");
dojo.require("dojo.xml.Parse");
dojo.require("dojo.uri.*");

dojo.widget._cssFiles = {};

dojo.widget.defaultStrings = {
	dojoRoot: dojo.hostenv.getBaseScriptUri(),
	baseScriptUri: dojo.hostenv.getBaseScriptUri()
};


// static method to build from a template w/ or w/o a real widget in place
dojo.widget.buildFromTemplate = function(obj, templatePath, templateCssPath, templateString) {
	var tpath = templatePath || obj.templatePath;
	var cpath = templateCssPath || obj.templateCssPath;

	if (!cpath && obj.templateCSSPath) {
		obj.templateCssPath = cpath = obj.templateCSSPath;
		obj.templateCSSPath = null;
		dj_deprecated("templateCSSPath is deprecated, use templateCssPath");
	}

	// DEPRECATED: use Uri objects, not strings
	if (tpath && !(tpath instanceof dojo.uri.Uri)) {
		tpath = dojo.uri.dojoUri(tpath);
		dj_deprecated("templatePath should be of type dojo.uri.Uri");
	}
	if (cpath && !(cpath instanceof dojo.uri.Uri)) {
		cpath = dojo.uri.dojoUri(cpath);
		dj_deprecated("templateCssPath should be of type dojo.uri.Uri");
	}
	
	var tmplts = dojo.widget.DomWidget.templates;
	if(!obj["widgetType"]) { // don't have a real template here
		do {
			var dummyName = "__dummyTemplate__" + dojo.widget.buildFromTemplate.dummyCount++;
		} while(tmplts[dummyName]);
		obj.widgetType = dummyName;
	}

	if((cpath)&&(!dojo.widget._cssFiles[cpath])){
		dojo.html.insertCssFile(cpath);
		obj.templateCssPath = null;
		dojo.widget._cssFiles[cpath] = true;
	}

	var ts = tmplts[obj.widgetType];
	if(!ts){
		tmplts[obj.widgetType] = {};
		ts = tmplts[obj.widgetType];
	}
	if(!obj.templateString){
		obj.templateString = templateString || ts["string"];
	}
	if(!obj.templateNode){
		obj.templateNode = ts["node"];
	}
	if((!obj.templateNode)&&(!obj.templateString)&&(tpath)){
		// fetch a text fragment and assign it to templateString
		// NOTE: we rely on blocking IO here!
		var tstring = dojo.hostenv.getText(tpath);
		if(tstring){
			var matches = tstring.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
			if(matches){
				tstring = matches[1];
			}
		}else{
			tstring = "";
		}
		obj.templateString = tstring;
		ts.string = tstring;
	}
	if(!ts["string"]) {
		ts.string = obj.templateString;
	}
}
dojo.widget.buildFromTemplate.dummyCount = 0;

dojo.widget.attachProperties = ["dojoAttachPoint", "id"];
dojo.widget.eventAttachProperty = "dojoAttachEvent";
dojo.widget.onBuildProperty = "dojoOnBuild";

dojo.widget.attachTemplateNodes = function(rootNode, targetObj, events){
	// FIXME: this method is still taking WAAAY too long. We need ways of optimizing:
	//	a.) what we are looking for on each node
	//	b.) the nodes that are subject to interrogation (use xpath instead?)
	//	c.) how expensive event assignment is (less eval(), more connect())
	// var start = new Date();
	var elementNodeType = dojo.dom.ELEMENT_NODE;

	if(!rootNode){ 
		rootNode = targetObj.domNode;
	}

	if(rootNode.nodeType != elementNodeType){
		return;
	}
	// alert(events.length);

	var nodes = rootNode.getElementsByTagName("*");
	var _this = targetObj;
	for(var x=-1; x<nodes.length; x++){
		var baseNode = (x == -1) ? rootNode : nodes[x];
		// FIXME: is this going to have capitalization problems?
		var attachPoint = [];
		for(var y=0; y<this.attachProperties.length; y++){
			var tmpAttachPoint = baseNode.getAttribute(this.attachProperties[y]);
			if(tmpAttachPoint){
				attachPoint = tmpAttachPoint.split(";");
				for(var z=0; z<this.attachProperties.length; z++){
					if((targetObj[attachPoint[z]])&&(dojo.lang.isArray(targetObj[attachPoint[z]]))){
						targetObj[attachPoint[z]].push(baseNode);
					}else{
						targetObj[attachPoint[z]]=baseNode;
					}
				}
				break;
			}
		}
		// continue;

		// FIXME: we need to put this into some kind of lookup structure
		// instead of direct assignment
		var tmpltPoint = baseNode.getAttribute(this.templateProperty);
		if(tmpltPoint){
			targetObj[tmpltPoint]=baseNode;
		}

		var attachEvent = baseNode.getAttribute(this.eventAttachProperty);
		if(attachEvent){
			// NOTE: we want to support attributes that have the form
			// "domEvent: nativeEvent; ..."
			var evts = attachEvent.split(";");
			for(var y=0; y<evts.length; y++){
				if((!evts[y])||(!evts[y].length)){ continue; }
				var thisFunc = null;
				// var tevt = dojo.string.trim(evts[y]);
				var tevt = dojo.string.trim(evts[y]);
				if(evts[y].indexOf(":") >= 0){
					// oh, if only JS had tuple assignment
					var funcNameArr = tevt.split(":");
					tevt = dojo.string.trim(funcNameArr[0]);
					thisFunc = dojo.string.trim(funcNameArr[1]);
				}
				if(!thisFunc){
					thisFunc = tevt;
				}

				var tf = function(){ 
					var ntf = new String(thisFunc);
					return function(evt){
						if(_this[ntf]){
							_this[ntf](dojo.event.browser.fixEvent(evt));
						}
					};
				}();
				dojo.event.browser.addListener(baseNode, tevt, tf, false, true);
			}
		}

		for(var y=0; y<events.length; y++){
			//alert(events[x]);
			var evtVal = baseNode.getAttribute(events[y]);
			if((evtVal)&&(evtVal.length)){
				var thisFunc = null;
				var domEvt = events[y].substr(4); // clober the "dojo" prefix
				thisFunc = dojo.string.trim(evtVal);
				var tf = function(){ 
					var ntf = new String(thisFunc);
					return function(evt){
						if(_this[ntf]){
							_this[ntf](dojo.event.browser.fixEvent(evt));
						}
					}
				}();
				dojo.event.browser.addListener(baseNode, domEvt, tf, false, true);
			}
		}

		var onBuild = baseNode.getAttribute(this.onBuildProperty);
		if(onBuild){
			eval("var node = baseNode; var widget = targetObj; "+onBuild);
		}

		// strip IDs to prevent dupes
		baseNode.id = "";
	}

}

dojo.widget.getDojoEventsFromStr = function(str){
	// var lstr = str.toLowerCase();
	var re = /(dojoOn([a-z]+)(\s?))=/gi;
	var evts = str ? str.match(re)||[] : [];
	var ret = [];
	var lem = {};
	for(var x=0; x<evts.length; x++){
		if(evts[x].legth < 1){ continue; }
		var cm = evts[x].replace(/\s/, "");
		cm = (cm.slice(0, cm.length-1));
		if(!lem[cm]){
			lem[cm] = true;
			ret.push(cm);
		}
	}
	return ret;
}


dojo.widget.buildAndAttachTemplate = function(obj, templatePath, templateCssPath, templateString, targetObj) {
	this.buildFromTemplate(obj, templatePath, templateCssPath, templateString);
	var node = dojo.dom.createNodesFromText(obj.templateString, true)[0];
	this.attachTemplateNodes(node, targetObj||obj, dojo.widget.getDojoEventsFromStr(templateString));
	return node;
}

dojo.widget.DomWidget = function(){
	dojo.widget.Widget.call(this);
	if((arguments.length>0)&&(typeof arguments[0] == "object")){
		this.create(arguments[0]);
	}
}
dojo.inherits(dojo.widget.DomWidget, dojo.widget.Widget);

dojo.lang.extend(dojo.widget.DomWidget, {
	templateNode: null,
	templateString: null,
	preventClobber: false,
	domNode: null, // this is our visible representation of the widget!
	containerNode: null, // holds child elements

	// Process the given child widget, inserting it's dom node as a child of our dom node
	// FIXME: should we support addition at an index in the children arr and
	// order the display accordingly? Right now we always append.
	addChild: function(widget, overrideContainerNode, pos, ref, insertIndex){
		if(!this.isContainer){ // we aren't allowed to contain other widgets, it seems
			dojo.debug("dojo.widget.DomWidget.addChild() attempted on non-container widget");
			return null;
		}else{
			this.addWidgetAsDirectChild(widget, overrideContainerNode, pos, ref, insertIndex);
			this.registerChild(widget, insertIndex);
		}
		return widget;
	},
	
	addWidgetAsDirectChild: function(widget, overrideContainerNode, pos, ref, insertIndex){
		if((!this.containerNode)&&(!overrideContainerNode)){
			this.containerNode = this.domNode;
		}
		var cn = (overrideContainerNode) ? overrideContainerNode : this.containerNode;
		if(!pos){ pos = "after"; }
		if(!ref){ ref = cn.lastChild; }
		if(!insertIndex) { insertIndex = 0; }
		widget.domNode.setAttribute("dojoinsertionindex", insertIndex);

		// insert the child widget domNode directly underneath my domNode, in the
		// specified position (by default, append to end)
		if(!ref){
			cn.appendChild(widget.domNode);
		}else{
			// FIXME: was this meant to be the (ugly hack) way to support insert @ index?
			//dojo.dom[pos](widget.domNode, ref, insertIndex);

			// CAL: this appears to be the intended way to insert a node at a given position...
			if (pos == 'insertAtIndex'){
				// dojo.debug("idx:", insertIndex, "isLast:", ref === cn.lastChild);
				dojo.dom.insertAtIndex(widget.domNode, ref.parentNode, insertIndex);
			}else{
				// dojo.debug("pos:", pos, "isLast:", ref === cn.lastChild);
				if((pos == "after")&&(ref === cn.lastChild)){
					cn.appendChild(widget.domNode);
				}else{
					dojo.dom.insertAtPosition(widget.domNode, cn, pos);
				}
			}
		}
	},

	// Record that given widget descends from me
	registerChild: function(widget, insertionIndex){

		// we need to insert the child at the right point in the parent's 
		// 'children' array, based on the insertionIndex

		widget.dojoInsertionIndex = insertionIndex;

		var idx = -1;
		for(var i=0; i<this.children.length; i++){
			if (this.children[i].dojoInsertionIndex < insertionIndex){
				idx = i;
			}
		}

		this.children.splice(idx+1, 0, widget);

		widget.parent = this;
		widget.addedTo(this);
		
		// If this widget was created programatically, then it was erroneously added
		// to dojo.widget.manager.topWidgets.  Fix that here.
		delete dojo.widget.manager.topWidgets[widget.widgetId];
	},

	// FIXME: we really need to normalize how we do things WRT "destroy" vs. "remove"
	removeChild: function(widget){
		for(var x=0; x<this.children.length; x++){
			if(this.children[x] === widget){
				this.children.splice(x, 1);
				break;
			}
		}
		return widget;
	},

	getFragNodeRef: function(frag){
		if( !frag["dojo:"+this.widgetType.toLowerCase()] ){
			dojo.raise("Error: no frag for widget type " + this.widgetType +
				", id " + this.widgetId + " (maybe a widget has set it's type incorrectly)");
		}
		return (frag ? frag["dojo:"+this.widgetType.toLowerCase()]["nodeRef"] : null);
	},
	
	// Replace source domNode with generated dom structure, and register
	// widget with parent.
	postInitialize: function(args, frag, parentComp){
		var sourceNodeRef = this.getFragNodeRef(frag);
		// Stick my generated dom into the output tree
		//alert(this.widgetId + ": replacing " + sourceNodeRef + " with " + this.domNode.innerHTML);
		if (parentComp && (parentComp.snarfChildDomOutput || !sourceNodeRef)){
			// Add my generated dom as a direct child of my parent widget
			// This is important for generated widgets, and also cases where I am generating an
			// <li> node that can't be inserted back into the original DOM tree
			parentComp.addWidgetAsDirectChild(this, "", "insertAtIndex", "",  args["dojoinsertionindex"], sourceNodeRef);
		} else if (sourceNodeRef){
			// Do in-place replacement of the my source node with my generated dom
			if(this.domNode && (this.domNode !== sourceNodeRef)){
				var oldNode = sourceNodeRef.parentNode.replaceChild(this.domNode, sourceNodeRef);
			}
		}

		// Register myself with my parent, or with the widget manager if
		// I have no parent
		// TODO: the code below erroneously adds all programatically generated widgets
		// to topWidgets (since we don't know who the parent is until after creation finishes)
		if ( parentComp ) {
			parentComp.registerChild(this, args.dojoinsertionindex);
		} else {
			dojo.widget.manager.topWidgets[this.widgetId]=this;
		}

		// Expand my children widgets
		if(this.isContainer){
			//alert("recurse from " + this.widgetId);
			// build any sub-components with us as the parent
			var fragParser = dojo.widget.getParser();
			fragParser.createComponents(frag, this);
		}
	},

	startResize: function(coords){
		dj_unimplemented("dojo.widget.DomWidget.startResize");
	},

	updateResize: function(coords){
		dj_unimplemented("dojo.widget.DomWidget.updateResize");
	},

	endResize: function(coords){
		dj_unimplemented("dojo.widget.DomWidget.endResize");
	},

	// method over-ride
	buildRendering: function(args, frag){
		// DOM widgets construct themselves from a template
		var ts = dojo.widget.DomWidget.templates[this.widgetType];
		if(	
			(!this.preventClobber)&&(
				(this.templatePath)||
				(this.templateNode)||
				(
					(this["templateString"])&&(this.templateString.length) 
				)||
				(
					(typeof ts != "undefined")&&( (ts["string"])||(ts["node"]) )
				)
			)
		){
			// if it looks like we can build the thing from a template, do it!
			this.buildFromTemplate(args, frag);
		}else{
			// otherwise, assign the DOM node that was the source of the widget
			// parsing to be the root node
			this.domNode = this.getFragNodeRef(frag);
		}
		this.fillInTemplate(args, frag); 	// this is where individual widgets
											// will handle population of data
											// from properties, remote data
											// sets, etc.
	},

	buildFromTemplate: function(args, frag){
		// var start = new Date();
		// copy template properties if they're already set in the templates object
		var ts = dojo.widget.DomWidget.templates[this.widgetType];
		if(ts){
			if(!this.templateString.length){
				this.templateString = ts["string"];
			}
			if(!this.templateNode){
				this.templateNode = ts["node"];
			}
		}
		var matches = false;
		var node = null;
		var tstr = new String(this.templateString); 
		// attempt to clone a template node, if there is one
		if((!this.templateNode)&&(this.templateString)){
			matches = this.templateString.match(/\$\{([^\}]+)\}/g);
			if(matches) {
				// if we do property replacement, don't create a templateNode
				// to clone from.
				var hash = this.strings || {};
				// FIXME: should this hash of default replacements be cached in
				// templateString?
				for(var key in dojo.widget.defaultStrings) {
					if(dojo.lang.isUndefined(hash[key])) {
						hash[key] = dojo.widget.defaultStrings[key];
					}
				}
				// FIXME: this is a lot of string munging. Can we make it faster?
				for(var i = 0; i < matches.length; i++) {
					var key = matches[i];
					key = key.substring(2, key.length-1);
					var kval = (key.substring(0, 5) == "this.") ? this[key.substring(5)] : hash[key];
					var value;
					if((kval)||(dojo.lang.isString(kval))){
						value = (dojo.lang.isFunction(kval)) ? kval.call(this, key, this.templateString) : kval;
						tstr = tstr.replace(matches[i], value);
					}
				}
			}else{
				// otherwise, we are required to instantiate a copy of the template
				// string if one is provided.
				
				// FIXME: need to be able to distinguish here what should be done
				// or provide a generic interface across all DOM implementations
				// FIMXE: this breaks if the template has whitespace as its first 
				// characters
				// node = this.createNodesFromText(this.templateString, true);
				// this.templateNode = node[0].cloneNode(true); // we're optimistic here
				this.templateNode = this.createNodesFromText(this.templateString, true)[0];
				ts.node = this.templateNode;
			}
		}
		if((!this.templateNode)&&(!matches)){ 
			dojo.debug("weren't able to create template!");
			return false;
		}else if(!matches){
			node = this.templateNode.cloneNode(true);
			if(!node){ return false; }
		}else{
			node = this.createNodesFromText(tstr, true)[0];
		}

		// recurse through the node, looking for, and attaching to, our
		// attachment points which should be defined on the template node.

		this.domNode = node;
		// dojo.profile.start("attachTemplateNodes");
		this.attachTemplateNodes(this.domNode, this);
		// dojo.profile.end("attachTemplateNodes");
		
		// relocate source contents to templated container node
		// this.containerNode must be able to receive children, or exceptions will be thrown
		if (this.isContainer && this.containerNode){
			var src = this.getFragNodeRef(frag);
			if (src){
				dojo.dom.moveChildren(src, this.containerNode);
			}
		}
	},

	attachTemplateNodes: function(baseNode, targetObj){
		if(!targetObj){ targetObj = this; }
		return dojo.widget.attachTemplateNodes(baseNode, targetObj, 
					dojo.widget.getDojoEventsFromStr(this.templateString));
	},

	fillInTemplate: function(){
		// dj_unimplemented("dojo.widget.DomWidget.fillInTemplate");
	},
	
	// method over-ride
	destroyRendering: function(){
		try{
			var tempNode = this.domNode.parentNode.removeChild(this.domNode);
			delete tempNode;
		}catch(e){ /* squelch! */ }
	},

	// FIXME: method over-ride
	cleanUp: function(){},
	
	getContainerHeight: function(){
		// FIXME: the generic DOM widget shouldn't be using HTML utils!
		return dojo.html.getInnerHeight(this.domNode.parentNode);
	},

	getContainerWidth: function(){
		// FIXME: the generic DOM widget shouldn't be using HTML utils!
		return dojo.html.getInnerWidth(this.domNode.parentNode);
	},

	createNodesFromText: function(){
		dj_unimplemented("dojo.widget.DomWidget.createNodesFromText");
	}
});
dojo.widget.DomWidget.templates = {};

dojo.provide("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.html");
dojo.require("dojo.string");

dojo.widget.HtmlWidget = function(args){
	// mixin inheritance
	dojo.widget.DomWidget.call(this);
}

dojo.inherits(dojo.widget.HtmlWidget, dojo.widget.DomWidget);

dojo.lang.extend(dojo.widget.HtmlWidget, {
	widgetType: "HtmlWidget",

	templateCssPath: null,
	templatePath: null,
	allowResizeX: true,
	allowResizeY: true,

	resizeGhost: null,
	initialResizeCoords: null,

	// for displaying/hiding widget
	toggle: "plain",
	toggleDuration: 150,

	animationInProgress: false,

	initialize: function(args, frag){
	},

	postMixInProperties: function(args, frag){
		// now that we know the setting for toggle, define show()&hide()
		dojo.lang.mixin(this,
			dojo.widget.HtmlWidget.Toggle[dojo.string.capitalize(this.toggle)] ||
			dojo.widget.HtmlWidget.Toggle.Plain);
	},

	getContainerHeight: function(){
		// NOTE: container height must be returned as the INNER height
		dj_unimplemented("dojo.widget.HtmlWidget.getContainerHeight");
	},

	getContainerWidth: function(){
		return this.parent.domNode.offsetWidth;
	},

	setNativeHeight: function(height){
		var ch = this.getContainerHeight();
	},

	startResize: function(coords){
		// get the left and top offset of our dom node
		coords.offsetLeft = dojo.html.totalOffsetLeft(this.domNode);
		coords.offsetTop = dojo.html.totalOffsetTop(this.domNode);
		coords.innerWidth = dojo.html.getInnerWidth(this.domNode);
		coords.innerHeight = dojo.html.getInnerHeight(this.domNode);
		if(!this.resizeGhost){
			this.resizeGhost = document.createElement("div");
			var rg = this.resizeGhost;
			rg.style.position = "absolute";
			rg.style.backgroundColor = "white";
			rg.style.border = "1px solid black";
			dojo.html.setOpacity(rg, 0.3);
			dojo.html.body().appendChild(rg);
		}
		with(this.resizeGhost.style){
			left = coords.offsetLeft + "px";
			top = coords.offsetTop + "px";
		}
		this.initialResizeCoords = coords;
		this.resizeGhost.style.display = "";
		this.updateResize(coords, true);
	},

	updateResize: function(coords, override){
		var dx = coords.x-this.initialResizeCoords.x;
		var dy = coords.y-this.initialResizeCoords.y;
		with(this.resizeGhost.style){
			if((this.allowResizeX)||(override)){
				width = this.initialResizeCoords.innerWidth + dx + "px";
			}
			if((this.allowResizeY)||(override)){
				height = this.initialResizeCoords.innerHeight + dy + "px";
			}
		}
	},

	endResize: function(coords){
		// FIXME: need to actually change the size of the widget!
		var dx = coords.x-this.initialResizeCoords.x;
		var dy = coords.y-this.initialResizeCoords.y;
		with(this.domNode.style){
			if(this.allowResizeX){
				width = this.initialResizeCoords.innerWidth + dx + "px";
			}
			if(this.allowResizeY){
				height = this.initialResizeCoords.innerHeight + dy + "px";
			}
		}
		this.resizeGhost.style.display = "none";
	},

	resizeSoon: function(){
		if ( this.isVisible() ) {
			dojo.lang.setTimeout(this, this.onResized, 0);
		}
	},

	createNodesFromText: function(txt, wrap){
		return dojo.html.createNodesFromText(txt, wrap);
	},

	_old_buildFromTemplate: dojo.widget.DomWidget.prototype.buildFromTemplate,

	buildFromTemplate: function(args, frag){
		if(dojo.widget.DomWidget.templates[this.widgetType]){
			var ot = dojo.widget.DomWidget.templates[this.widgetType];
			dojo.widget.DomWidget.templates[this.widgetType] = {};
		}
		if(args["templatecsspath"]){
			args["templateCssPath"] = args["templatecsspath"];
		}
		if(args["templatepath"]){
			args["templatePath"] = args["templatepath"];
		}
		dojo.widget.buildFromTemplate(this, args["templatePath"], args["templateCssPath"]);
		this._old_buildFromTemplate(args, frag);
		dojo.widget.DomWidget.templates[this.widgetType] = ot;
	},

	destroyRendering: function(finalize){
		try{
			var tempNode = this.domNode.parentNode.removeChild(this.domNode);
			if(!finalize){
				dojo.event.browser.clean(tempNode);
			}
			delete tempNode;
		}catch(e){ /* squelch! */ }
	},

	// Displaying/hiding the widget

	isVisible: function(){
		return dojo.html.isVisible(this.domNode);
	},
	doToggle: function(){
		this.isVisible() ? this.hide() : this.show();
	},
	show: function(){
		this.animationInProgress=true;
		this.showMe();
	},
	onShow: function(){
		this.animationInProgress=false;
	},
	hide: function(){
		this.animationInProgress=true;
		this.hideMe();
	},
	onHide: function(){
		this.animationInProgress=false;
	}
});


/**** 
	Strategies for displaying/hiding widget
*****/

dojo.widget.HtmlWidget.Toggle={}

dojo.widget.HtmlWidget.Toggle.Plain = {
	showMe: function(){
		dojo.html.show(this.domNode);
		if(dojo.lang.isFunction(this.onShow)){ this.onShow(); }
	},

	hideMe: function(){
		dojo.html.hide(this.domNode);
		if(dojo.lang.isFunction(this.onHide)){ this.onHide(); }
	}
}

dojo.widget.HtmlWidget.Toggle.Fade = {
	showMe: function(){
		dojo.fx.html.fadeShow(this.domNode, this.toggleDuration, dojo.lang.hitch(this, this.onShow));
	},

	hideMe: function(){
		dojo.fx.html.fadeHide(this.domNode, this.toggleDuration, dojo.lang.hitch(this, this.onHide));
	}
}

dojo.widget.HtmlWidget.Toggle.Wipe = {
	showMe: function(){
		dojo.fx.html.wipeIn(this.domNode, this.toggleDuration, dojo.lang.hitch(this, this.onShow));
	},

	hideMe: function(){
		dojo.fx.html.wipeOut(this.domNode, this.toggleDuration, dojo.lang.hitch(this, this.onHide));
	}
}

dojo.widget.HtmlWidget.Toggle.Explode = {
	showMe: function(){
		dojo.fx.html.explode(this.explodeSrc, this.domNode, this.toggleDuration,
			dojo.lang.hitch(this, this.onShow));
	},

	hideMe: function(){
		dojo.fx.html.implode(this.domNode, this.explodeSrc, this.toggleDuration,
			dojo.lang.hitch(this, this.onHide));
	}
}

dojo.hostenv.conditionalLoadModule({
	common: ["dojo.xml.Parse", 
			 "dojo.widget.Widget", 
			 "dojo.widget.Parse", 
			 "dojo.widget.Manager"],
	browser: ["dojo.widget.DomWidget",
			  "dojo.widget.HtmlWidget"],
	svg: 	 ["dojo.widget.SvgWidget"]
});
dojo.hostenv.moduleLoaded("dojo.widget.*");

dojo.provide("dojo.math.points");
dojo.require("dojo.math");

// TODO: add a Point class?
dojo.math.points = {
	translate: function(a, b) {
		if( a.length != b.length ) {
			dojo.raise("dojo.math.translate: points not same size (a:[" + a + "], b:[" + b + "])");
		}
		var c = new Array(a.length);
		for(var i = 0; i < a.length; i++) {
			c[i] = a[i] + b[i];
		}
		return c;
	},

	midpoint: function(a, b) {
		if( a.length != b.length ) {
			dojo.raise("dojo.math.midpoint: points not same size (a:[" + a + "], b:[" + b + "])");
		}
		var c = new Array(a.length);
		for(var i = 0; i < a.length; i++) {
			c[i] = (a[i] + b[i]) / 2;
		}
		return c;
	},

	invert: function(a) {
		var b = new Array(a.length);
		for(var i = 0; i < a.length; i++) { b[i] = -a[i]; }
		return b;
	},

	distance: function(a, b) {
		return Math.sqrt(Math.pow(b[0]-a[0], 2) + Math.pow(b[1]-a[1], 2));
	}
};

dojo.hostenv.conditionalLoadModule({
	common: [
		["dojo.math", false, false],
		["dojo.math.curves", false, false],
		["dojo.math.points", false, false]
	]
});
dojo.hostenv.moduleLoaded("dojo.math.*");

dojo.provide("dojo.regexp");
dojo.provide("dojo.regexp.us");

// *** Regular Expression Generators ***

/**
  Builds a RE that matches a top-level domain.

  @param flags  An object.
    flags.allowCC  Include 2 letter country code domains.  Default is true.
    flags.allowGeneric  Include the generic domains.  Default is true.
    flags.allowInfra  Include infrastructure domains.  Default is true.

  @return  A string for a regular expression for a top-level domain.
*/
dojo.regexp.tld = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.allowCC != "boolean") { flags.allowCC = true; }
	if (typeof flags.allowInfra != "boolean") { flags.allowInfra = true; }
	if (typeof flags.allowGeneric != "boolean") { flags.allowGeneric = true; }

	// Infrastructure top-level domain - only one at present
	var infraRE = "arpa";

	// Generic top-level domains RE.
	var genericRE = 
		"aero|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|xxx|jobs|mobi|post";
	
	// Country Code top-level domains RE
	var ccRE = 
		"ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|" +
		"bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|" +
		"ec|ee|eg|er|es|et|fi|fj|fk|fm|fo|fr|ga|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|" +
		"hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|" +
		"lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|" +
		"mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|" +
		"ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sk|sl|sm|sn|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|" +
		"to|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw";

	// Build top-level domain RE
	var a = [];
	if (flags.allowInfra) { a.push(infraRE); }
	if (flags.allowGeneric) { a.push(genericRE); }
	if (flags.allowCC) { a.push(ccRE); }

	var tldRE = "";
	if (a.length > 0) {
		tldRE = "(" + a.join("|") + ")";
	}

	return tldRE;
}

/**
  Builds a RE that matches an IP Address.
  Supports 5 formats for IPv4: dotted decimal, dotted hex, dotted octal, decimal and hexadecimal.
  Supports 2 formats for Ipv6.

  @param flags  An object.  All flags are boolean with default = true.
    flags.allowDottedDecimal  Example, 207.142.131.235.  No zero padding.
    flags.allowDottedHex  Example, 0x18.0x11.0x9b.0x28.  Case insensitive.  Zero padding allowed.
    flags.allowDottedOctal  Example, 0030.0021.0233.0050.  Zero padding allowed.
    flags.allowDecimal  Example, 3482223595.  A decimal number between 0-4294967295.
    flags.allowHex  Example, 0xCF8E83EB.  Hexadecimal number between 0x0-0xFFFFFFFF.
      Case insensitive.  Zero padding allowed.
    flags.allowIPv6   IPv6 address written as eight groups of four hexadecimal digits.
    flags.allowHybrid   IPv6 address written as six groups of four hexadecimal digits
      followed by the usual 4 dotted decimal digit notation of IPv4. x:x:x:x:x:x:d.d.d.d

  @return  A string for a regular expression for an IP address.
*/
dojo.regexp.ipAddress = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.allowDottedDecimal != "boolean") { flags.allowDottedDecimal = true; }
	if (typeof flags.allowDottedHex != "boolean") { flags.allowDottedHex = true; }
	if (typeof flags.allowDottedOctal != "boolean") { flags.allowDottedOctal = true; }
	if (typeof flags.allowDecimal != "boolean") { flags.allowDecimal = true; }
	if (typeof flags.allowHex != "boolean") { flags.allowHex = true; }
	if (typeof flags.allowIPv6 != "boolean") { flags.allowIPv6 = true; }
	if (typeof flags.allowHybrid != "boolean") { flags.allowHybrid = true; }

	// decimal-dotted IP address RE.
	var dottedDecimalRE = 
		// Each number is between 0-255.  Zero padding is not allowed.
		"((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])";

	// dotted hex IP address RE.  Each number is between 0x0-0xff.  Zero padding is allowed, e.g. 0x00.
	var dottedHexRE = "(0[xX]0*[\\da-fA-F]?[\\da-fA-F]\\.){3}0[xX]0*[\\da-fA-F]?[\\da-fA-F]";

	// dotted octal IP address RE.  Each number is between 0000-0377.  
	// Zero padding is allowed, but each number must have at least 4 characters.
	var dottedOctalRE = "(0+[0-3][0-7][0-7]\\.){3}0+[0-3][0-7][0-7]";

	// decimal IP address RE.  A decimal number between 0-4294967295.  
	var decimalRE =  "(0|[1-9]\\d{0,8}|[1-3]\\d{9}|4[01]\\d{8}|42[0-8]\\d{7}|429[0-3]\\d{6}|" +
		"4294[0-8]\\d{5}|42949[0-5]\\d{4}|429496[0-6]\\d{3}|4294967[01]\\d{2}|42949672[0-8]\\d|429496729[0-5])";

	// hexadecimal IP address RE. 
	// A hexadecimal number between 0x0-0xFFFFFFFF. Case insensitive.  Zero padding is allowed.
	var hexRE = "0[xX]0*[\\da-fA-F]{1,8}";

	// IPv6 address RE. 
	// The format is written as eight groups of four hexadecimal digits, x:x:x:x:x:x:x:x,
	// where x is between 0000-ffff. Zero padding is optional. Case insensitive. 
	var ipv6RE = "([\\da-fA-F]{1,4}\\:){7}[\\da-fA-F]{1,4}";

	// IPv6/IPv4 Hybrid address RE. 
	// The format is written as six groups of four hexadecimal digits, 
	// followed by the 4 dotted decimal IPv4 format. x:x:x:x:x:x:d.d.d.d
	var hybridRE = "([\\da-fA-F]{1,4}\\:){6}" + 
		"((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])";

	// Build IP Address RE
	var a = [];
	if (flags.allowDottedDecimal) { a.push(dottedDecimalRE); }
	if (flags.allowDottedHex) { a.push(dottedHexRE); }
	if (flags.allowDottedOctal) { a.push(dottedOctalRE); }
	if (flags.allowDecimal) { a.push(decimalRE); }
	if (flags.allowHex) { a.push(hexRE); }
	if (flags.allowIPv6) { a.push(ipv6RE); }
	if (flags.allowHybrid) { a.push(hybridRE); }

	var ipAddressRE = "";
	if (a.length > 0) {
		ipAddressRE = "(" + a.join("|") + ")";
	}

	return ipAddressRE;
}

/**
  Builds a RE that matches a host.
	A host is a domain name or an IP address, possibly followed by a port number.

  @param flags  An object.
    flags.allowIP  Allow an IP address for hostname.  Default is true.
    flags.allowLocal  Allow the host to be "localhost".  Default is false.
    flags.allowPort  Allow a port number to be present.  Default is true.
    flags in regexp.ipAddress can be applied.
    flags in regexp.tld can be applied.

  @return  A string for a regular expression for a host.
*/
dojo.regexp.host = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.allowIP != "boolean") { flags.allowIP = true; }
	if (typeof flags.allowLocal != "boolean") { flags.allowLocal = false; }
	if (typeof flags.allowPort != "boolean") { flags.allowPort = true; }

	// Domain names can not end with a dash.
	var domainNameRE = "([0-9a-zA-Z]([-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?\\.)+" + dojo.regexp.tld(flags);

	// port number RE
	portRE = ( flags.allowPort ) ? "(\\:" + dojo.regexp.integer({signed: false}) + ")?" : "";

	// build host RE
	var hostNameRE = domainNameRE;
	if (flags.allowIP) { hostNameRE += "|" +  dojo.regexp.ipAddress(flags); }
	if (flags.allowLocal) { hostNameRE += "|localhost"; }

	return "(" + hostNameRE + ")" + portRE;
}

/**
  Builds a regular expression that matches a URL.

  @param flags  An object.
    flags.scheme  Can be true, false, or [true, false]. 
      This means: required, not allowed, or match either one.
    flags in regexp.host can be applied.
    flags in regexp.ipAddress can be applied.
    flags in regexp.tld can be applied.

  @return  A string for a regular expression for a URL.
*/
dojo.regexp.url = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.scheme == "undefined") { flags.scheme = [true, false]; }

	// Scheme RE
	var protocalRE = dojo.regexp.buildGroupRE(flags.scheme,
		function(q) { if (q) { return "(https?|ftps?)\\://"; }  return ""; }
	);

	// Path and query and anchor RE
	var pathRE = "(/([^?#\\s/]+/)*)?([^?#\\s/]+(\\?[^?#\\s/]*)?(#[A-Za-z][\\w.:-]*)?)?";

	return (protocalRE + dojo.regexp.host(flags) + pathRE);
}

/**
  Builds a regular expression that matches an email address.

  @param flags  An object.
    flags.allowCruft  Allow address like <mailto:foo@yahoo.com>.  Default is false.
    flags in regexp.host can be applied.
    flags in regexp.ipAddress can be applied.
    flags in regexp.tld can be applied.

  @return  A string for a regular expression for an email address.
*/
dojo.regexp.emailAddress = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.allowCruft != "boolean") { flags.allowCruft = false; }
	flags.allowPort = false; // invalid in email addresses

	// user name RE - apostrophes are valid if there's not 2 in a row
	var usernameRE = "([\\da-z]+[-._+&'])*[\\da-z]+";

	// build emailAddress RE
	var emailAddressRE = usernameRE + "@" + dojo.regexp.host(flags);

	// Allow email addresses with cruft
	if ( flags.allowCruft ) {
		emailAddressRE = "<?(mailto\\:)?" + emailAddressRE + ">?";
	}

	return emailAddressRE;
}

/**
  Builds a regular expression that matches a list of email addresses.

  @param flags  An object.
    flags.listSeparator  The character used to separate email addresses.  Default is ";", ",", "\n" or " ".
    flags in regexp.emailAddress can be applied.
    flags in regexp.host can be applied.
    flags in regexp.ipAddress can be applied.
    flags in regexp.tld can be applied.

  @return  A string for a regular expression for an email address list.
*/
dojo.regexp.emailAddressList = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.listSeparator != "string") { flags.listSeparator = "\\s;,"; }

	// build a RE for an Email Address List
	var emailAddressRE = dojo.regexp.emailAddress(flags);
	var emailAddressListRE = "(" + emailAddressRE + "\\s*[" + flags.listSeparator + "]\\s*)*" + 
		emailAddressRE + "\\s*[" + flags.listSeparator + "]?\\s*";

	return emailAddressListRE;
}

/**
  Builds a regular expression that matches an integer.

  @param flags  An object.
    flags.signed  The leading plus-or-minus sign.  Can be true, false, or [true, false].
      Default is [true, false], (i.e. will match if it is signed or unsigned).
    flags.separator  The character used as the thousands separator.  Default is no separator.
      For more than one symbol use an array, e.g. [",", ""], makes ',' optional.

  @return  A string for a regular expression for an integer.
*/
dojo.regexp.integer = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.signed == "undefined") { flags.signed = [true, false]; }
	if (typeof flags.separator == "undefined") { flags.separator = ""; }

	// build sign RE
	var signRE = dojo.regexp.buildGroupRE(flags.signed,
		function(q) { if (q) { return "[-+]"; }  return ""; }
	);

	// number RE
	var numberRE = dojo.regexp.buildGroupRE(flags.separator,
		function(sep) { 
			if ( sep == "" ) { 
				return "(0|[1-9]\\d*)"; 
			}
			return "(0|[1-9]\\d{0,2}([" + sep + "]\\d{3})*)"; 
		}
	);
	var numberRE;

	// integer RE
	return (signRE + numberRE);
}

/**
  Builds a regular expression to match a real number in exponential notation.

  @param flags  An object.
    flags.places  The integer number of decimal places.
      If not given, the decimal part is optional and the number of places is unlimited.
    flags.decimal  A string for the character used as the decimal point.  Default is ".".
    flags.exponent  Express in exponential notation.  Can be true, false, or [true, false].
      Default is [true, false], (i.e. will match if the exponential part is present are not).
    flags.eSigned  The leading plus-or-minus sign on the exponent.  Can be true, false, 
      or [true, false].  Default is [true, false], (i.e. will match if it is signed or unsigned).
    flags in regexp.integer can be applied.

  @return  A string for a regular expression for a real number.
*/
dojo.regexp.realNumber = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.places != "number") { flags.places = Infinity; }
	if (typeof flags.decimal != "string") { flags.decimal = "."; }
	if (typeof flags.exponent == "undefined") { flags.exponent = [true, false]; }
	if (typeof flags.eSigned == "undefined") { flags.eSigned = [true, false]; }

	// integer RE
	var integerRE = dojo.regexp.integer(flags);

	// decimal RE
	var decimalRE = "";
	if ( flags.places == Infinity) { 
		decimalRE = "(\\" + flags.decimal + "\\d+)?"; 
	}
	else if ( flags.places > 0) { 
		decimalRE = "\\" + flags.decimal + "\\d{" + flags.places + "}"; 
	}

	// exponent RE
	var exponentRE = dojo.regexp.buildGroupRE(flags.exponent,
		function(q) { 
			if (q) { return "([eE]" + dojo.regexp.integer({signed: flags.eSigned}) + ")"; }
			return ""; 
		}
	);

	// real number RE
	return (integerRE + decimalRE + exponentRE);
}

/**
  Builds a regular expression to match a monetary value.

  @param flags  An object.
    flags.signed  The leading plus-or-minus sign.  Can be true, false, or [true, false].
      Default is [true, false], (i.e. will match if it is signed or unsigned).
    flags.symbol  A currency symbol such as Yen "¥", Pound "£", or the Euro sign "€".  
      Default is "$".  For more than one symbol use an array, e.g. ["$", ""], makes $ optional.
    flags.placement  The symbol can come "before" the number or "after".  Default is "before".
    flags.separator  The character used as the thousands separator. The default is ",".
    flags.cents  The two decimal places for cents.  Can be true, false, or [true, false].
      Default is [true, false], (i.e. will match if cents are present are not).
    flags.decimal  A string for the character used as the decimal point.  Default is ".".

  @return  A string for a regular expression for a monetary value.
*/
dojo.regexp.currency = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.signed == "undefined") { flags.signed = [true, false]; }
	if (typeof flags.symbol == "undefined") { flags.symbol = "$"; }
	if (typeof flags.placement != "string") { flags.placement = "before"; }
	if (typeof flags.separator != "string") { flags.separator = ","; }
	if (typeof flags.cents == "undefined") { flags.cents = [true, false]; }
	if (typeof flags.decimal != "string") { flags.decimal = "."; }

	// build sign RE
	var signRE = dojo.regexp.buildGroupRE(flags.signed,
		function(q) { if (q) { return "[-+]"; }  return ""; }
	);

	// build symbol RE
	var symbolRE = dojo.regexp.buildGroupRE(flags.symbol,
		function(symbol) { 
			// escape all special characters
			return "\\s?" + symbol.replace( /([.$?*!=:|\\\/^])/g, "\\$1") + "\\s?";
		}
	);

	// number RE
	var numberRE = dojo.regexp.integer( {signed: false, separator: flags.separator} );

	// build cents RE
	var centsRE = dojo.regexp.buildGroupRE(flags.cents,
		function(q) { if (q) { return "(\\" + flags.decimal + "\\d\\d)"; }  return ""; }
	);

	// build currency RE
	var currencyRE;
	if (flags.placement == "before") {
		currencyRE = signRE + symbolRE + numberRE + centsRE;
	}
	else {
		currencyRE = signRE + numberRE + centsRE + symbolRE;
	}

	return currencyRE;
}

/**
  A regular expression to match US state and territory abbreviations.

  @param flags  An object.
    flags.allowTerritories  Allow Guam, Puerto Rico, etc.  Default is true.
    flags.allowMilitary  Allow military 'states', e.g. Armed Forces Europe (AE).  Default is true.

  @return  A string for a regular expression for a US state.
*/
dojo.regexp.us.state = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.allowTerritories != "boolean") { flags.allowTerritories = true; }
	if (typeof flags.allowMilitary != "boolean") { flags.allowMilitary = true; }

	// state RE
	var statesRE = 
		"AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|" + 
		"NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY";

	// territories RE
	var territoriesRE = "AS|FM|GU|MH|MP|PW|PR|VI";

	// military states RE
	var militaryRE = "AA|AE|AP";

	// Build states and territories RE
	if (flags.allowTerritories) { statesRE += "|" + territoriesRE; }
	if (flags.allowMilitary) { statesRE += "|" + militaryRE; }

	return "(" + statesRE + ")";
}

/**
  Builds a regular expression to match any International format for time.
  The RE can match one format or one of multiple formats.

  Format
  h        12 hour, no zero padding.
  hh       12 hour, has leading zero.
  H        24 hour, no zero padding.
  HH       24 hour, has leading zero.
  m        minutes, no zero padding.
  mm       minutes, has leading zero.
  s        seconds, no zero padding.
  ss       seconds, has leading zero.
  t        am or pm, case insensitive.
  All other characters must appear literally in the expression.

  Example
    "h:m:s t"  ->   2:5:33 PM
    "HH:mm:ss" ->  14:05:33

  @param flags  An object.
    flags.format  A string or an array of strings.  Default is "h:mm:ss t".
    flags.amSymbol  The symbol used for AM.  Default is "AM".
    flags.pmSymbol  The symbol used for PM.  Default is "PM".

  @return  A string for a regular expression for a time value.
*/
dojo.regexp.time = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.format == "undefined") { flags.format = "h:mm:ss t"; }
	if (typeof flags.amSymbol != "string") { flags.amSymbol = "AM"; }
	if (typeof flags.pmSymbol != "string") { flags.pmSymbol = "PM"; }

	// Converts a time format to a RE
	var timeRE = function(format) {
		// escape all special characters
		format = format.replace( /([.$?*!=:|{}\(\)\[\]\\\/^])/g, "\\$1");
		var amRE = flags.amSymbol.replace( /([.$?*!=:|{}\(\)\[\]\\\/^])/g, "\\$1");
		var pmRE = flags.pmSymbol.replace( /([.$?*!=:|{}\(\)\[\]\\\/^])/g, "\\$1");

		// replace tokens with Regular Expressions
		format = format.replace("hh", "(0[1-9]|1[0-2])");
		format = format.replace("h", "([1-9]|1[0-2])");
		format = format.replace("HH", "([01][0-9]|2[0-3])");
		format = format.replace("H", "([0-9]|1[0-9]|2[0-3])");
		format = format.replace("mm", "([0-5][0-9])");
		format = format.replace("m", "([1-5][0-9]|[0-9])");
		format = format.replace("ss", "([0-5][0-9])");
		format = format.replace("s", "([1-5][0-9]|[0-9])");
		format = format.replace("t", "\\s?(" + amRE + "|" + pmRE + ")\\s?" );

		return format;
	};

	// build RE for multiple time formats
	return dojo.regexp.buildGroupRE(flags.format, timeRE);
}

/**
  Builds a regular expression to match any sort of number based format.
  Use it for phone numbers, social security numbers, zip-codes, etc.
  The RE can match one format or one of multiple formats.

  Format
    #        Stands for a digit, 0-9.
    ?        Stands for an optional digit, 0-9 or nothing.
    All other characters must appear literally in the expression.

  Example   
    "(###) ###-####"       ->   (510) 542-9742
    "(###) ###-#### x#???" ->   (510) 542-9742 x153
    "###-##-####"          ->   506-82-1089       i.e. social security number
    "#####-####"           ->   98225-1649        i.e. zip code

  @param flags  An object.
    flags.format  A string or an Array of strings for multiple formats.
  @return  A string for a regular expression for the number format(s).
*/
dojo.regexp.numberFormat = function(flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	if (typeof flags.format == "undefined") { flags.format = "###-###-####"; }

	// Converts a number format to RE.
	var digitRE = function(format) {
		// escape all special characters, except '?'
		format = format.replace( /([.$*!=:|{}\(\)\[\]\\\/^])/g, "\\$1");

		// Now replace '?' with Regular Expression
		format = format.replace(/\?/g, "\\d?");

		// replace # with Regular Expression
		format = format.replace(/#/g, "\\d");

		return format;
	};

	// build RE for multiple number formats
	return dojo.regexp.buildGroupRE(flags.format, digitRE);
}


/**
  This is basically a utility function used by some of the RE generators.
  Builds a regular expression that groups subexpressions.
  The subexpressions are constructed by the function, re, in the second parameter.
  re builds one subexpression for each elem in the array a, in the first parameter.

  @param a  A single value or an array of values.
  @param re  A function.  Takes one parameter and converts it to a regular expression. 
  @return  A string for a regular expression that groups all the subexpressions.
*/
dojo.regexp.buildGroupRE = function(a, re) {

	// case 1: a is a single value.
	if ( !( a instanceof Array ) ) { 
		return re(a);
	}

	// case 2: a is an array
	var b = [];
	for (var i = 0; i < a.length; i++) {
		// convert each elem to a RE
		b.push(re(a[i]));
	}

	 // join the REs as alternatives in a RE group.
	return "(" + b.join("|") + ")";
}

dojo.provide("dojo.validate");
dojo.provide("dojo.validate.us");
dojo.require("dojo.regexp");

// *** Validation Functions ****

/**
  Checks if a string has non whitespace characters. 
  Parameters allow you to constrain the length.

  @param value  A string.
  @param flags  An object.
    flags.length  If set, checks if there are exactly flags.length number of characters.
    flags.minlength  If set, checks if there are at least flags.minlength number of characters.
    flags.maxlength  If set, checks if there are at most flags.maxlength number of characters.
  @return  true or false.
*/
dojo.validate.isText = function(value, flags) {
	flags = (typeof flags == "object") ? flags : {};

	// test for text
	if ( /^\s*$/.test(value) ) { return false; }

	// length tests
	if ( typeof flags.length == "number" && flags.length != value.length ) { return false; }
	if ( typeof flags.minlength == "number" && flags.minlength > value.length ) { return false; }
	if ( typeof flags.maxlength == "number" && flags.maxlength < value.length ) { return false; }

	return true;
}

/**
  Validates an IP address.
  Supports 5 formats for IPv4: dotted decimal, dotted hex, dotted octal, decimal and hexadecimal.
  Supports 2 formats for Ipv6.

  @param value  A string.
  @param flags  An object.  All flags are boolean with default = true.
    flags.allowDottedDecimal  Example, 207.142.131.235.  No zero padding.
    flags.allowDottedHex  Example, 0x18.0x11.0x9b.0x28.  Case insensitive.  Zero padding allowed.
    flags.allowDottedOctal  Example, 0030.0021.0233.0050.  Zero padding allowed.
    flags.allowDecimal  Example, 3482223595.  A decimal number between 0-4294967295.
    flags.allowHex  Example, 0xCF8E83EB.  Hexadecimal number between 0x0-0xFFFFFFFF.
      Case insensitive.  Zero padding allowed.
    flags.allowIPv6   IPv6 address written as eight groups of four hexadecimal digits.
    flags.allowHybrid   IPv6 address written as six groups of four hexadecimal digits
      followed by the usual 4 dotted decimal digit notation of IPv4. x:x:x:x:x:x:d.d.d.d
  @return  true or false
*/
dojo.validate.isIpAddress = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.ipAddress(flags) + "$", "i");
	return re.test(value);
}

/**
  Checks if a string could be a valid URL.

  @param value  A string.
  @param flags  An object.
    flags.scheme  Can be true, false, or [true, false]. 
      This means: required, not allowed, or either.
    flags in regexp.host can be applied.
    flags in regexp.ipAddress can be applied.
    flags in regexp.tld can be applied.
  @return  true or false
*/
dojo.validate.isUrl = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.url(flags) + "$", "i");
	return re.test(value);
}

/**
  Checks if a string could be a valid email address.

  @param value  A string.
  @param flags  An object.
    flags.allowCruft  Allow address like <mailto:foo@yahoo.com>.  Default is false.
    flags in regexp.host can be applied.
    flags in regexp.ipAddress can be applied.
    flags in regexp.tld can be applied.
  @return  true or false.
*/
dojo.validate.isEmailAddress = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.emailAddress(flags) + "$", "i");
	return re.test(value);
}

/**
  Checks if a string could be a valid email address list.

  @param value  A string.
  @param flags  An object.
    flags.listSeparator  The character used to separate email addresses.  Default is ";", ",", "\n" or " ".
    flags in regexp.emailAddress can be applied.
    flags in regexp.host can be applied.
    flags in regexp.ipAddress can be applied.
    flags in regexp.tld can be applied.
  @return  true or false.
*/
dojo.validate.isEmailAddressList = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.emailAddressList(flags) + "$", "i");
	return re.test(value);
}

/**
  Check if value is an email address list. If an empty list
  is returned, the value didn't pass the test or it was empty.

  @param value	A string
  @param flags	An object (same as isEmailAddressList)
  @return array of emails
*/
dojo.validate.getEmailAddressList = function(value, flags) {
	if(!flags) { flags = {}; }
	if(!flags.listSeparator) { flags.listSeparator = "\\s;,"; }

	if ( dojo.validate.isEmailAddressList(value, flags) ) {
		return value.split(new RegExp("\\s*[" + flags.listSeparator + "]\\s*"));
	}
	return [];
}

/**
  Validates whether a string is in an integer format. 

  @param value  A string.
  @param flags  An object.
    flags.signed  The leading plus-or-minus sign.  Can be true, false, or [true, false].
      Default is [true, false], (i.e. sign is optional).
    flags.separator  The character used as the thousands separator.  Default is no separator.
      For more than one symbol use an array, e.g. [",", ""], makes ',' optional.
  @return  true or false.
*/
dojo.validate.isInteger = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.integer(flags) + "$");
	return re.test(value);
}

/**
  Validates whether a string is a real valued number. 
  Format is the usual exponential notation.

  @param value  A string.
  @param flags  An object.
    flags.places  The integer number of decimal places.
      If not given, the decimal part is optional and the number of places is unlimited.
    flags.decimal  The character used for the decimal point.  Default is ".".
    flags.exponent  Express in exponential notation.  Can be true, false, or [true, false].
      Default is [true, false], (i.e. the exponential part is optional).
    flags.eSigned  The leading plus-or-minus sign on the exponent.  Can be true, false, 
      or [true, false].  Default is [true, false], (i.e. sign is optional).
    flags in regexp.integer can be applied.
  @return  true or false.
*/
dojo.validate.isRealNumber = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.realNumber(flags) + "$");
	return re.test(value);
}

/**
  Validates whether a string denotes a monetary value. 

  @param value  A string.
  @param flags  An object.
    flags.signed  The leading plus-or-minus sign.  Can be true, false, or [true, false].
      Default is [true, false], (i.e. sign is optional).
    flags.symbol  A currency symbol such as Yen "¥", Pound "£", or the Euro sign "€".  
      Default is "$".  For more than one symbol use an array, e.g. ["$", ""], makes $ optional.
    flags.placement  The symbol can come "before" the number or "after".  Default is "before".
    flags.separator  The character used as the thousands separator. The default is ",".
    flags.cents  The two decimal places for cents.  Can be true, false, or [true, false].
      Default is [true, false], (i.e. cents are optional).
    flags.decimal  The character used for the decimal point.  Default is ".".
  @return  true or false.
*/
dojo.validate.isCurrency = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.currency(flags) + "$");
	return re.test(value);
}

/**
  Validates U.S. currency.

  @param value  A string.
  @param flags  An object.
    flags in validate.isCurrency can be applied.
  @return  true or false.
*/
dojo.validate.us.isCurrency = function(value, flags) {
	return dojo.validate.isCurrency(value, flags);
}

/**
  Validates German currency.

  @param value  A string.
  @return  true or false.
*/
dojo.validate.isGermanCurrency = function(value) {
	flags = {
		symbol: "€",
		placement: "after",
		decimal: ",",
		separator: "."
	};
	return dojo.validate.isCurrency(value, flags);
}

/**
  Validates Japanese currency.

  @param value  A string.
  @return  true or false.
*/
dojo.validate.isJapaneseCurrency = function(value) {
	flags = {
		symbol: "¥",
		cents: false
	};
	return dojo.validate.isCurrency(value, flags);
}

/**
  Validates whether a string denoting an integer, 
  real number, or monetary value is between a max and min. 

  @param value  A string.
  @param flags  An object.
    flags.max  A number, which the value must be less than or equal to for the validation to be true.
    flags.min  A number, which the value must be greater than or equal to for the validation to be true.
    flags.decimal  The character used for the decimal point.  Default is ".".
  @return  true or false.
*/
dojo.validate.isInRange = function(value, flags) {
	// assign default values to missing paramters
	flags = (typeof flags == "object") ? flags : {};
	var max = (typeof flags.max == "number") ? flags.max : Infinity;
	var min = (typeof flags.min == "number") ? flags.min : -Infinity;
	var dec = (typeof flags.decimal == "string") ? flags.decimal : ".";
	
	// splice out anything not part of a number
	var pattern = "[^" + dec + "\\deE+-]";
	value = value.replace(RegExp(pattern, "g"), "");

	// trim ends of things like e, E, or the decimal character
	value = value.replace(/^([+-]?)(\D*)/, "$1");
	value = value.replace(/(\D*)$/, "");

	// replace decimal with ".". The minus sign '-' could be the decimal!
	pattern = "(\\d)[" + dec + "](\\d)";
	value = value.replace(RegExp(pattern, "g"), "$1.$2");

	value = Number(value);
	if ( value < min || value > max ) { return false; }

	return true;
}

/**
  Validates a time value in any International format.
  The value can be validated against one format or one of multiple formats.

  Format
  h        12 hour, no zero padding.
  hh       12 hour, has leading zero.
  H        24 hour, no zero padding.
  HH       24 hour, has leading zero.
  m        minutes, no zero padding.
  mm       minutes, has leading zero.
  s        seconds, no zero padding.
  ss       seconds, has leading zero.
  All other characters must appear literally in the expression.

  Example
    "h:m:s t"  ->   2:5:33 PM
    "HH:mm:ss" ->  14:05:33

  @param value  A string.
  @param flags  An object.
    flags.format  A string or an array of strings.  Default is "h:mm:ss t".
    flags.amSymbol  The symbol used for AM.  Default is "AM".
    flags.pmSymbol  The symbol used for PM.  Default is "PM".
  @return  true or false
*/
dojo.validate.isValidTime = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.time(flags) + "$", "i");
	return re.test(value);
}

/**
  Validates 12-hour time format.
  Zero-padding is not allowed for hours, required for minutes and seconds.
  Seconds are optional.

  @param value  A string.
  @return  true or false
*/
dojo.validate.is12HourTime = function(value) {
	return dojo.validate.isValidTime(value, {format: ["h:mm:ss t", "h:mm t"]});
}

/**
  Validates 24-hour military time format.
  Zero-padding is required for hours, minutes, and seconds.
  Seconds are optional.

  @param value  A string.
  @return  true or false
*/
dojo.validate.is24HourTime = function(value) {
	return dojo.validate.isValidTime(value, {format: ["HH:mm:ss", "HH:mm"]} );
}

/**
  Returns true if the date conforms to the format given and is a valid date. Otherwise returns false.

  @param dateValue  A string for the date.
  @param format  A string, default is  "MM/DD/YYYY".
  @return  true or false

  Accepts any type of format, including ISO8601.
  All characters in the format string are treated literally except the following tokens:

  YYYY - matches a 4 digit year
  M - matches a non zero-padded month
  MM - matches a zero-padded month
  D -  matches a non zero-padded date
  DD -  matches a zero-padded date
  DDD -  matches an ordinal date, 001-365, and 366 on leapyear
  ww - matches week of year, 01-53
  d - matches day of week, 1-7

  Examples: These are all today's date.

  Date          Format
  2005-W42-3    YYYY-Www-d
  2005-292      YYYY-DDD
  20051019      YYYYMMDD
  10/19/2005    M/D/YYYY
  19.10.2005    D.M.YYYY
*/
dojo.validate.isValidDate = function(dateValue, format) {
	// Default is the American format
	if (typeof format != "string") { format = "MM/DD/YYYY"; }

	// Create a literal regular expression based on format
	var reLiteral = format.replace(/([$^.*+?=!:|\/\\\(\)\[\]\{\}])/g, "\\$1");

	// Convert all the tokens to RE elements
	reLiteral = reLiteral.replace( "YYYY", "([0-9]{4})" );
	reLiteral = reLiteral.replace( "MM", "(0[1-9]|10|11|12)" );
	reLiteral = reLiteral.replace( "M", "([1-9]|10|11|12)" );
	reLiteral = reLiteral.replace( "DDD", "(00[1-9]|0[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-6])" );
	reLiteral = reLiteral.replace( "DD", "(0[1-9]|[12][0-9]|30|31)" );
	reLiteral = reLiteral.replace( "D", "([1-9]|[12][0-9]|30|31)" );
	reLiteral = reLiteral.replace( "ww", "(0[1-9]|[1-4][0-9]|5[0-3])" );
	reLiteral = reLiteral.replace( "d", "([1-7])" );

	// Anchor pattern to begining and end of string
	reLiteral = "^" + reLiteral + "$";

	// Dynamic RE that parses the original format given
	var re = new RegExp(reLiteral);
	
	// Test if date is in a valid format
	if (!re.test(dateValue))  return false;

	// Parse date to get elements and check if date is valid
	// Assume valid values for date elements not given.
	var year = 0, month = 1, date = 1, dayofyear = 1, week = 1, day = 1;

	// Capture tokens
	var tokens = format.match( /(YYYY|MM|M|DDD|DD|D|ww|d)/g );

	// Capture date values
	var values = re.exec(dateValue);

	// Match up tokens with date values
	for (var i = 0; i < tokens.length; i++) {
		switch (tokens[i]) {
		case "YYYY":
			year = Number(values[i+1]); break;
		case "M":
		case "MM":
			month = Number(values[i+1]); break;
		case "D":
		case "DD":
			date = Number(values[i+1]); break;
		case "DDD":
			dayofyear = Number(values[i+1]); break;
		case "ww":
			week = Number(values[i+1]); break;
		case "d":
			day = Number(values[i+1]); break;
		}
	}

	// Leap years are divisible by 4, but not by 100, unless by 400
	var leapyear = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));

	// 31st of a month with 30 days
	if (date == 31 && (month == 4 || month == 6 || month == 9 || month == 11)) return false; 

	// February 30th or 31st
	if (date >= 30 && month == 2) return false; 

	// February 29th outside a leap year
	if (date == 29 && month == 2 && !leapyear) return false; 
	if (dayofyear == 366 && !leapyear)  return false;

	return true;
}

/**
  Validates US state and territory abbreviations.

	@param value  A two character string.
  @param flags  An object.
    flags.allowTerritories  Allow Guam, Puerto Rico, etc.  Default is true.
    flags.allowMilitary  Allow military 'states', e.g. Armed Forces Europe (AE).  Default is true.
  @return  true or false
*/
dojo.validate.us.isState = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.us.state(flags) + "$", "i");
	return re.test(value);
}

/**
  Validates any sort of number based format.
  Use it for phone numbers, social security numbers, zip-codes, etc.
  The value can be validated against one format or one of multiple formats.

  Format
    #        Stands for a digit, 0-9.
    ?        Stands for an optional digit, 0-9 or nothing.
    All other characters must appear literally in the expression.

  Example   
    "(###) ###-####"       ->   (510) 542-9742
    "(###) ###-#### x#???" ->   (510) 542-9742 x153
    "###-##-####"          ->   506-82-1089       i.e. social security number
    "#####-####"           ->   98225-1649        i.e. zip code

  @param value  A string.
  @param flags  An object.
    flags.format  A string or an Array of strings for multiple formats.
  @return  true or false
*/
dojo.validate.isNumberFormat = function(value, flags) {
	var re = new RegExp("^" + dojo.regexp.numberFormat(flags) + "$", "i");
	return re.test(value);
}

/**
  Validates 10 US digit phone number for several common formats:

  @param value The telephone number string
  @return true or false
*/
dojo.validate.us.isPhoneNumber = function(value) {
	flags = {
		format: [
			"###-###-####",
			"(###) ###-####",
			"(###) ### ####",
			"###.###.####",
			"###/###-####",
			"### ### ####",
			"###-###-#### x#???",
			"(###) ###-#### x#???",
			"(###) ### #### x#???",
			"###.###.#### x#???",
			"###/###-#### x#???",
			"### ### #### x#???"
		]
	};

	return dojo.validate.isNumberFormat(value, flags);
}

// Validates social security number
dojo.validate.us.isSocialSecurityNumber = function(value) {
	flags = {
		format: [
			"###-##-####",
			"### ## ####",
			"#########"
		]
	};

	return dojo.validate.isNumberFormat(value, flags);
}

// Validates U.S. zip-code
dojo.validate.us.isZipCode = function(value) {
	flags = {
		format: [
			"#####-####",
			"##### ####",
			"#########",
			"#####"
		]
	};

	return dojo.validate.isNumberFormat(value, flags);
}


/**
	Procedural API Description

		The main aim is to make input validation expressible in a simple format.
		You define profiles which declare the required and optional fields and any constraints they might have.
		The results are provided as an object that makes it easy to handle missing and invalid input.

	Usage

		var results = dojo.validate.check(form, profile);

	Profile Object

		var profile = {
			// filters change the field value and are applied before validation.
			trim: ["tx1", "tx2"],
			uppercase: ["tx9"],
			lowercase: ["tx5", "tx6", "tx7"],
			ucfirst: ["tx10"],
			digit: ["tx11"],

			// required input fields that are blank will be reported missing.
			// required radio button groups and drop-down lists with no selection will be reported missing.
			// checkbox groups and selectboxes can be required to have more than one value selected.
			// List required fields by name and use this notation to require more than one value: {checkboxgroup: 2}, {selectboxname: 3}.
			required: ["tx7", "tx8", "pw1", "ta1", "rb1", "rb2", "cb3", "s1", {"doubledip":2}, {"tripledip":3}],

			// dependant/conditional fields are required if the target field is present and not blank.
			// At present only textbox, password, and textarea fields are supported.
			dependancies:	{
				cc_exp: "cc_no",	
				cc_type: "cc_no",	
			},

			// Fields can be validated using any boolean valued function.  
			// Use arrays to specify parameters in addition to the field value.
			constraints: {
				field_name1: myValidationFunction,
				field_name2: dojo.validate.isInteger,
				field_name3: [myValidationFunction, additional parameters],
				field_name4: [dojo.validate.isValidDate, "YYYY.MM.DD"],
				field_name5: [dojo.validate.isEmailAddress, false, true],
			},

			// Confirm is a sort of conditional validation.
			// It associates each field in its property list with another field whose value should be equal.
			// If the values are not equal, the field in the property list is reported as Invalid. Unless the target field is blank.
			confirm: {
				email_confirm: "email",	
				pw2: "pw1",	
			}
		};

	Results Object

		isSuccessful(): Returns true if there were no invalid or missing fields, else it returns false.
		hasMissing():  Returns true if the results contain any missing fields.
		getMissing():  Returns a list of required fields that have values missing.
		isMissing(field):  Returns true if the field is required and the value is missing.
		hasInvalid():  Returns true if the results contain fields with invalid data.
		getInvalid():  Returns a list of fields that have invalid values.
		isInvalid(field):  Returns true if the field has an invalid value.

*/

/**
  Validates user input of an HTML form based on input profile.

	@param form  The form object to be validated.
	@param profile  The input profile that specifies how the form fields are to be validated.
	@return results  An object that contains several methods summarizing the results of the validation.
*/
dojo.validate.check = function(form, profile) {
	// Essentially private properties of results object
	var missing = [];
	var invalid = [];

	// results object summarizes the validation
	var results = {
		isSuccessful: function() {return ( !this.hasInvalid() && !this.hasMissing() );},
		hasMissing: function() {return ( missing.length > 0 );},
		getMissing: function() {return missing;},
		isMissing: function(elemname) {
			for (var i = 0; i < missing.length; i++) {
				if ( elemname == missing[i] ) { return true; }
			}
			return false;
		},
		hasInvalid: function() {return ( invalid.length > 0 );},
		getInvalid: function() {return invalid;},
		isInvalid: function(elemname) {
			for (var i = 0; i < invalid.length; i++) {
				if ( elemname == invalid[i] ) { return true; }
			}
			return false;
		}
	};

	// Filters are applied before fields are validated.
	// Trim removes white space at the front and end of the fields.
	if ( profile.trim instanceof Array ) {
		for (var i = 0; i < profile.trim.length; i++) {
			var elem = form[profile.trim[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.replace(/(^\s*|\s*$)/g, "");
		}
	}
	// Convert to uppercase
	if ( profile.uppercase instanceof Array ) {
		for (var i = 0; i < profile.uppercase.length; i++) {
			var elem = form[profile.uppercase[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.toUpperCase();
		}
	}
	// Convert to lowercase
	if ( profile.lowercase instanceof Array ) {
		for (var i = 0; i < profile.lowercase.length; i++) {
			var elem = form[profile.lowercase[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.toLowerCase();
		}
	}
	// Uppercase first letter
	if ( profile.ucfirst instanceof Array ) {
		for (var i = 0; i < profile.ucfirst.length; i++) {
			var elem = form[profile.ucfirst[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.replace(/\b\w+\b/g, function(word) { return word.substring(0,1).toUpperCase() + word.substring(1).toLowerCase(); });
		}
	}
	// Remove non digits characters from the input.
	if ( profile.digit instanceof Array ) {
		for (var i = 0; i < profile.digit.length; i++) {
			var elem = form[profile.digit[i]];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			elem.value = elem.value.replace(/\D/g, "");
		}
	}

	// See if required input fields have values missing.
	if ( profile.required instanceof Array ) {
		for (var i = 0; i < profile.required.length; i++) { 
			if ( typeof profile.required[i] != "string" ) { continue; }
			var elem = form[profile.required[i]];
			// Are textbox, textarea, or password fields blank.
			if ( (elem.type == "text" || elem.type == "textarea" || elem.type == "password") && /^\s*$/.test(elem.value) ) {	
				missing[missing.length] = elem.name;
			}
			// Does drop-down box have option selected.
			else if ( (elem.type == "select-one" || elem.type == "select-multiple") && elem.selectedIndex == -1 ) {
				missing[missing.length] = elem.name;
			}
			// Does radio button group (or check box group) have option checked.
			else if ( elem instanceof Array )  {
				var checked = false;
				for (var j = 0; j < elem.length; j++) {
					if (elem[j].checked) { checked = true; }
				}
				if ( !checked ) {	
					missing[missing.length] = elem[0].name;
				}
			}
		}
	}

	// See if checkbox groups and select boxes have x number of required values.
	if ( profile.required instanceof Array ) {
		for (var i = 0; i < profile.required.length; i++) { 
			if ( typeof profile.required[i] != "object" ) { continue; }
			var elem, numRequired;
			for (var name in profile.required[i]) { 
				elem = form[name]; 
				numRequired = profile.required[i][name];
			}
			// case 1: elem is a check box group
			if ( elem instanceof Array )  {
				var checked = 0;
				for (var j = 0; j < elem.length; j++) {
					if (elem[j].checked) { checked++; }
				}
				if ( checked < numRequired ) {	
					missing[missing.length] = elem[0].name;
				}
			}
			// case 2: elem is a select box
			else if ( elem.type == "select-multiple" ) {
				var selected = 0;
				for (var j = 0; j < elem.options.length; j++) {
					if (elem.options[j].selected) { selected++; }
				}
				if ( selected < numRequired ) {	
					missing[missing.length] = elem.name;
				}
			}
		}
	}

	// Dependant fields are required when the target field is present (not blank).
	// Todo: Support dependant and target fields that are radio button groups, or select drop-down lists.
	// Todo: Make the dependancy based on a specific value of the target field.
	// Todo: allow dependant fields to have several required values, like {checkboxgroup: 3}.
	if ( typeof profile.dependancies == "object" ) {
		// properties of dependancies object are the names of dependant fields to be checked
		for (name in profile.dependancies) {
			var elem = form[name];	// the dependant element
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; } // limited support
			if ( /\S+/.test(elem.value) ) { continue; }	// has a value already
			if ( results.isMissing(elem.name) ) { continue; }	// already listed as missing
			var target = form[profile.dependancies[name]];
			if ( target.type != "text" && target.type != "textarea" && target.type != "password" ) { continue; }	// limited support
			if ( /^\s*$/.test(target.value) ) { continue; }	// skip if blank
			missing[missing.length] = elem.name;	// ok the dependant field is missing
		}
	}

	// Find invalid input fields.
	if ( typeof profile.constraints == "object" ) {
		// constraint properties are the names of fields to be validated
		for (name in profile.constraints) {
			var elem = form[name];
			if ( elem.type != "text" && elem.type != "textarea" && elem.type != "password" ) { continue; }
			// skip if blank - its optional unless required, in which case it is already listed as missing.
			if ( /^\s*$/.test(elem.value) ) { continue; }

			var isValid = true;
			// case 1: constraint value is validation function
			if ( typeof profile.constraints[name] == "function" ) {
				isValid = profile.constraints[name](elem.value);
			}
			// case 2: constraint value is array, first elem is function, tail is parameters
			else if ( profile.constraints[name] instanceof Array ) {
				var isValidSomething = profile.constraints[name][0];
				var params = profile.constraints[name].slice(1);
				params.unshift(elem.value);
				isValid = isValidSomething.apply(null, params);
			}

			if ( !isValid ) {	
				invalid[invalid.length] = elem.name;
			}
		}
	}

	// Find unequal confirm fields and report them as Invalid.
	if ( typeof profile.confirm == "object" ) {
		for (name in profile.confirm) {
			var elem = form[name];	// the confirm element
			var target = form[profile.confirm[name]];
			if ( (elem.type != "text" && elem.type != "textarea" && elem.type != "password") 
				|| target.type != elem.type 
				|| target.value == elem.value		// it's valid
				|| results.isInvalid(elem.name)	// already listed as invalid
				|| /^\s*$/.test(target.value)	)	// skip if blank - only confirm if target has a value
			{
				continue; 
			}	
			invalid[invalid.length] = elem.name;
		}
	}

	return results;
}

dojo.provide("dojo.widget.LayoutPane");

dojo.require("dojo.widget.*");

dojo.widget.tags.addParseTreeHandler("dojo:LayoutPane");

// NOTE: there's no stub file for this widget

dojo.provide("dojo.widget.Container");


dojo.provide("dojo.widget.html.Container");

dojo.require("dojo.widget.*");
dojo.require("dojo.widget.Container");

dojo.widget.html.Container = function(){
	dojo.widget.HtmlWidget.call(this);
}

dojo.inherits(dojo.widget.html.Container, dojo.widget.HtmlWidget);

dojo.lang.extend(dojo.widget.html.Container, {
	widgetType: "Container",

	isContainer: true,
	containerNode: null,
	domNode: null,

	onResized: function() {
		// Clients should override this function to do special processing,
		// then call this.notifyChildrenOfResize() to notify children of resize
		this.notifyChildrenOfResize();
	},
	
	notifyChildrenOfResize: function() {
		for(var i=0; i<this.children.length; i++) {
			var child = this.children[i];
			//dojo.debug(this.widgetId + " resizing child " + child.widgetId);
			if ( child.onResized ) {
				child.onResized();
			}
		}
	}
});

dojo.widget.tags.addParseTreeHandler("dojo:Container");

dojo.provide("dojo.widget.LayoutPane");
dojo.provide("dojo.widget.html.LayoutPane");

//
// this widget provides Delphi-style panel layout semantics
// this is a good place to stash layout logic, then derive components from it
//
// TODO: allow more edge priority orders (e.g. t,r,l,b)
// TODO: allow percentage sizing stuff
//

dojo.require("dojo.widget.LayoutPane");
dojo.require("dojo.widget.*");
dojo.require("dojo.event.*");
dojo.require("dojo.io.*");
dojo.require("dojo.widget.Container");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.string");


dojo.widget.html.LayoutPane = function(){
	dojo.widget.html.Container.call(this);
}

dojo.inherits(dojo.widget.html.LayoutPane, dojo.widget.html.Container);

dojo.lang.extend(dojo.widget.html.LayoutPane, {
	widgetType: "LayoutPane",

	isChild: false,

	clientWidth: 0,
	clientHeight: 0,

	layoutChildPriority: 'top-bottom',

	cssPath: dojo.uri.dojoUri("src/widget/templates/HtmlLayoutPane.css"),

	// If this pane's content is external then set the url here	
	url: "inline",
	extractContent: true,
	parseContent: true,
	cacheContent: true,
	
	// To generate pane content from a java function
	handler: "none",

	minWidth: 0,
	minHeight: 0,

	fillInTemplate: function(){
		this.filterAllowed(this, 'layoutChildPriority', ['left-right', 'top-bottom']);

		// Need to include CSS manually because there is no template file/string
		dojo.style.insertCssFile(this.cssPath, null, true);
		dojo.html.addClass(this.domNode, "dojoLayoutPane");
	},

	postCreate: function(args, fragment, parentComp){
		for(var i=0; i<this.children.length; i++){
			this._injectChild(this.children[i]);
		}

		if ( this.handler != "none" ){
			this.setHandler(this.handler);
		}
		if ( this.isVisible() ){
			this.loadContents();
		}
	},

	// If the pane contents are external then load them
	loadContents: function() {
		if ( this.isLoaded ){
			return;
		}
		if ( dojo.lang.isFunction(this.handler)) {
			this._runHandler();
		} else if ( this.url != "inline" ) {
			this._downloadExternalContent(this.url, this.cacheContent);
		}
		this.isLoaded=true;
	},

	// Reset the (external defined) content of this pane
	setUrl: function(url) {
		this.url = url;
		this.isLoaded = false;
		if ( this.isVisible() ){
			this.loadContents();
		}
	},

	_downloadExternalContent: function(url, useCache) {
		dojo.deprecated("LayoutPane url parameter.", "use LinkPane to download from a URL", "0.4");
		//dojo.debug(this.widgetId + " downloading " + url);
		var node = this.containerNode || this.domNode;
		node.innerHTML = "Loading...";

		var extract = this.extractContent;
		var parse = this.parseContent;
		var self = this;

		dojo.io.bind({
			url: url,
			useCache: useCache,
			mimetype: "text/html",
			handler: function(type, data, e) {
				if(type == "load") {
					if(extract) {
						var matches = data.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
						if(matches) { data = matches[1]; }
			}
					node.innerHTML = data;
					if(parse) {
						var parser = new dojo.xml.Parse();
						var frag = parser.parseElement(node, null, true);
						dojo.widget.getParser().createComponents(frag);
					}
					self.onResized();
				} else {
					node.innerHTML = "Error loading '" + url + "' (" + e.status + " " + e.statusText + ")";
				}
			}
		});
	},

	// Generate pane content from given java function
	setHandler: function(handler) {
		var fcn = dojo.lang.isFunction(handler) ? handler : window[handler];
		if(!dojo.lang.isFunction(fcn)) {
			throw new Error("Unable to set handler, '" + handler + "' not a function.");
			return;
		}
		this.handler = function() {
			return fcn.apply(this, arguments);
		}
	},

	_runHandler: function() {
		if(dojo.lang.isFunction(this.handler)) {
			dojo.deprecated("use LinkPane to download content from a java function", "0.4");
			this.handler(this, this.domNode);
			return false;
		}
		return true;
	},

	filterAllowed: function(node, param, values){
		if ( !dojo.lang.inArray(values, node[param]) ) {
			node[param] = values[0];
		}
	},

	layoutChildren: function(){
		// find the children to arrange

		var kids = {'left':[], 'right':[], 'top':[], 'bottom':[], 'client':[], 'flood':[]};
		var hits = 0;

		for(var i=0; i<this.children.length; i++){
			if (this.hasLayoutAlign(this.children[i])){
				kids[this.children[i].layoutAlign].push(this.children[i]);
				hits++;
			}
		}

		if (!hits){
			return;
		}

		var container = this.containerNode || this.domNode;

		// calc layout space

		this.clientWidth  = dojo.style.getContentWidth(container);
		this.clientHeight = dojo.style.getContentHeight(container);

		// note: don't setup clientRect as a member of the prototype because that
		// would make the contents shared between instances
		this.clientRect={};
		this.clientRect['left']   = dojo.style.getPixelValue(container, "padding-left", true);
		this.clientRect['right']  = dojo.style.getPixelValue(container, "padding-right", true);
		this.clientRect['top']    = dojo.style.getPixelValue(container, "padding-top", true);
		this.clientRect['bottom'] = dojo.style.getPixelValue(container, "padding-bottom", true);

		// arrange them in order
		this._layoutCenter(kids, "flood");
		if (this.layoutChildPriority == 'top-bottom'){
			this._layoutFloat(kids, "top");
			this._layoutFloat(kids, "bottom");
			this._layoutFloat(kids, "left");
			this._layoutFloat(kids, "right");
		}else{
			this._layoutFloat(kids, "left");
			this._layoutFloat(kids, "right");
			this._layoutFloat(kids, "top");
			this._layoutFloat(kids, "bottom");
		}
		this._layoutCenter(kids, "client");
	},

	// Position the left/right/top/bottom aligned elements
	_layoutFloat: function(kids, position){
		var ary = kids[position];
		
		// figure out which two of the left/right/top/bottom properties to set
		var lr = (position=="right")?"right":"left";
		var tb = (position=="bottom")?"bottom":"top";

		for(var i=0; i<ary.length; i++){
			var elm=ary[i];
			
			// set two of left/right/top/bottom properties
			elm.domNode.style[lr]=this.clientRect[lr] + "px";
			elm.domNode.style[tb]=this.clientRect[tb] + "px";
			
			// adjust record of remaining space
			if ( (position=="top")||(position=="bottom") ) {
				dojo.style.setOuterWidth(elm.domNode, this.clientWidth);
				var height = dojo.style.getOuterHeight(elm.domNode);
				this.clientHeight -= height;
				this.clientRect[position] += height;
			} else {
				dojo.style.setOuterHeight(elm.domNode, this.clientHeight);
				var width = dojo.style.getOuterWidth(elm.domNode);
				this.clientWidth -= width;
				this.clientRect[position] += width;
			}
		}
	},

	// Position elements into the remaining space (in the center)
	// If multiple elements are present they overlap each other
	_layoutCenter: function(kids, position){
		var ary = kids[position];
		for(var i=0; i<ary.length; i++){
			var elm=ary[i];
			elm.domNode.style.left=this.clientRect.left + "px";
			elm.domNode.style.top=this.clientRect.top + "px";
			dojo.style.setOuterWidth(elm.domNode, this.clientWidth);		
			dojo.style.setOuterHeight(elm.domNode, this.clientHeight);
		}

	},

	hasLayoutAlign: function(child){
		return dojo.lang.inArray(['left','right','top','bottom','client', 'flood'], child.layoutAlign);
	},

	addChild: function(child, overrideContainerNode, pos, ref, insertIndex){
		this._injectChild(child);
		dojo.widget.html.LayoutPane.superclass.addChild.call(this, child, overrideContainerNode, pos, ref, insertIndex);
		this.resizeSoon();
	},

	_injectChild: function(child){
		if ( this.hasLayoutAlign(child) ){
			child.domNode.style.position = 'absolute';
			child.isChild = true;	
			this.filterAllowed(child, 'layoutAlign', ['none', 'left', 'top', 'right', 'bottom', 'client', 'flood']);
			dojo.html.addClass(child.domNode, "dojoAlign" + dojo.string.capitalize(child.layoutAlign));		
		}
	},

	removeChild: function(pane){
		dojo.widget.html.LayoutPane.superclass.removeChild.call(this,pane);
		dojo.dom.removeNode(pane.domNode);
		this.resizeSoon();
	},

	onResized: function(){
		if ( !this.isVisible() ) {
			return;
		}

		//dojo.debug(this.widgetId + ": resized");

		// set position/size for my children
		this.layoutChildren();

		// notify children that they have been moved/resized
		this.notifyChildrenOfResize();
	},

	resizeTo: function(w, h){

		w = Math.max(w, this.getMinWidth());
		h = Math.max(h, this.getMinHeight());

		dojo.style.setOuterWidth(this.domNode, w);
		dojo.style.setOuterHeight(this.domNode, h);
		this.onResized();
	},

	show: function(){
		// If this is the first time we are displaying this object,
		// and the contents are external, then download them.
		this.loadContents();

		// If this node was created while display=="none" then it
		// hasn't been laid out yet.  Do that now.
		this.domNode.style.display="";
		this.onResized();
		this.domNode.style.display="none";
		this.domNode.style.visibility="";

		dojo.widget.html.LayoutPane.superclass.show.call(this);
	},

	getMinWidth: function(){

		//
		// we need to first get the cumulative width
		//

		var w = this.minWidth;

		if ((this.layoutAlign == 'left') || (this.layoutAlign == 'right')){

			w = dojo.style.getOuterWidth(this.domNode);
		}

		for(var i=0; i<this.children.length; i++){
			var ch = this.children[i];
			var a = ch.layoutAlign;

			if ((a == 'left') || (a == 'right') || (a == 'client')){

				if (dojo.lang.isFunction(ch.getMinWidth)){
					w += ch.getMinWidth();
				}
			}
		}

		//
		// but then we need to check to see if the top/bottom kids are larger
		//

		for(var i=0; i<this.children.length; i++){
			var ch = this.children[i];
			var a = ch.layoutAlign;

			if ((a == 'top') || (a == 'bottom')){

				if (dojo.lang.isFunction(ch.getMinWidth)){
					w = Math.max(w, ch.getMinWidth());
				}
			}
		}

		return w;
	},

	getMinHeight: function(){

		//
		// we need to first get the cumulative height
		//

		var h = this.minHeight;

		if ((this.layoutAlign == 'top') || (this.layoutAlign == 'bottom')){

			h = dojo.style.getOuterHeight(this.domNode);
		}

		for(var i=0; i<this.children.length; i++){
			var ch = this.children[i];
			var a = ch.layoutAlign;

			if ((a == 'top') || (a == 'bottom') || (a == 'client')){

				if (dojo.lang.isFunction(ch.getMinHeight)){
					h += ch.getMinHeight();
				}
			}
		}

		//
		// but then we need to check to see if the left/right kids are larger
		//

		for(var i=0; i<this.children.length; i++){
			var ch = this.children[i];
			var a = ch.layoutAlign;

			if ((a == 'left') || (a == 'right')){

				if (dojo.lang.isFunction(ch.getMinHeight)){
					h = Math.max(h, ch.getMinHeight());
				}
			}
		}

		return h;
	}
});

// This arguments can be specified for the children of a LayoutPane.
// Since any widget can be specified as a LayoutPane child, mix it
// into the base widget class.  (This is a hack, but it's effective.)
dojo.lang.extend(dojo.widget.Widget, {
	layoutAlign: 'none'
});


dojo.provide("dojo.widget.TabPane");
dojo.provide("dojo.widget.html.TabPane");
dojo.provide("dojo.widget.Tab");
dojo.provide("dojo.widget.html.Tab");

dojo.require("dojo.widget.*");
dojo.require("dojo.widget.LayoutPane");
dojo.require("dojo.event.*");
dojo.require("dojo.html");
dojo.require("dojo.style");

//////////////////////////////////////////
// TabPane -- a set of Tabs
//////////////////////////////////////////
dojo.widget.html.TabPane = function() {
	dojo.widget.html.LayoutPane.call(this);
}
dojo.inherits(dojo.widget.html.TabPane, dojo.widget.html.LayoutPane);

dojo.lang.extend(dojo.widget.html.TabPane, {
	widgetType: "TabPane",

	// Constructor arguments
	labelPosition: "top",
	useVisibility: false,		// true-->use visibility:hidden instead of display:none


	templateCssPath: dojo.uri.dojoUri("src/widget/templates/HtmlTabPane.css"),

	selectedTab: "",		// initially selected tab (widgetId)

	fillInTemplate: function(args, frag) {
		dojo.widget.html.TabPane.superclass.fillInTemplate.call(this, args, frag);
		
		dojo.style.insertCssFile(this.templateCssPath, null, true);
		dojo.html.prependClass(this.domNode, "dojoTabPane");
	},

	postCreate: function(args, frag) {
		// Create <ul> with special formatting to store all the tab labels
		// TODO: set "bottom" css tag if label is on bottom
		this.ul = document.createElement("ul");
		dojo.html.addClass(this.ul, "tabs");
		dojo.html.addClass(this.ul, this.labelPosition);

		// Load all the tabs, creating a label for each one
		for(var i=0; i<this.children.length; i++){
			this._setupTab(this.children[i]);
		}
		dojo.widget.html.TabPane.superclass.postCreate.call(this, args, frag);

		// Put tab labels in a panel on the top (or bottom)
		this.filterAllowed(this, 'labelPosition', ['top', 'bottom']);
		this.labelPanel = dojo.widget.createWidget("LayoutPane", {layoutAlign: this.labelPosition});
		this.labelPanel.domNode.appendChild(this.ul);
		dojo.widget.html.TabPane.superclass.addChild.call(this, this.labelPanel);

		// workaround CSS loading race condition bug
		dojo.lang.setTimeout(this, this.onResized, 50);
	},

	addChild: function(child, overrideContainerNode, pos, ref, insertIndex){
		this._setupTab(child);
		dojo.widget.html.TabPane.superclass.addChild.call(this,child, overrideContainerNode, pos, ref, insertIndex);
	},

	_setupTab: function(tab){
		tab.layoutAlign = "client";
		tab.domNode.style.display="none";
		dojo.html.prependClass(tab.domNode, "dojoTabPanel");

		// Create label
		tab.li = document.createElement("li");
		var span = document.createElement("span");
		span.innerHTML = tab.label;
		dojo.html.disableSelection(span);
		tab.li.appendChild(span);
		this.ul.appendChild(tab.li);
		
		var self = this;
		dojo.event.connect(tab.li, "onclick", function(){ self.selectTab(tab); });
		
		if(!this.selectedTabWidget || this.selectedTab==tab.widgetId || tab.selected){
			this.selectedTabWidget=tab;
		}
	},

	selectTab: function(tab) {
		// Deselect old tab and select new one
		if (this.selectedTabWidget) {
			this._hideTab(this.selectedTabWidget);
		}
		this.selectedTabWidget = tab;
		this._showTab(tab);
	},
	
	_showTab: function(tab) {
		dojo.html.addClass(tab.li, "current");
		tab.selected=true;
		if ( this.useVisibility && !dojo.render.html.ie ) {
			tab.domNode.style.visibility="visible";
		} else {
			tab.show();
		}
	},

	_hideTab: function(tab) {
		dojo.html.removeClass(tab.li, "current");
		tab.selected=false;
		if( this.useVisibility ){
			tab.domNode.style.visibility="hidden";
		}else{
			tab.hide();
		}
	},

	onResized: function() {
		// Display the selected tab
		if(this.selectedTabWidget){
			this.selectTab(this.selectedTabWidget);
		}
		dojo.widget.html.TabPane.superclass.onResized.call(this);
	}
});
dojo.widget.tags.addParseTreeHandler("dojo:TabPane");

// These arguments can be specified for the children of a TabPane.
// Since any widget can be specified as a TabPane child, mix them
// into the base widget class.  (This is a hack, but it's effective.)
dojo.lang.extend(dojo.widget.Widget, {
	label: "",
	selected: false	// is this tab currently selected?
});

// Deprecated class.  TabPane can take any widget as input.
// Use ContentPane, LayoutPane, etc.
dojo.widget.html.Tab = function() {
	dojo.widget.html.LayoutPane.call(this);
}
dojo.inherits(dojo.widget.html.Tab, dojo.widget.html.LayoutPane);
dojo.lang.extend(dojo.widget.html.Tab, {
	widgetType: "Tab"
});
dojo.widget.tags.addParseTreeHandler("dojo:Tab");


// This widget doesn't do anything; is basically the same as <div>.
// It's useful as a child of LayoutPane, SplitPane, or TabPane.
// But note that those classes can contain any widget as a child.

dojo.provide("dojo.widget.ContentPane");


dojo.provide("dojo.widget.html.ContentPane");

dojo.require("dojo.widget.*");
dojo.require("dojo.io.*");
dojo.require("dojo.widget.Container");
dojo.require("dojo.widget.ContentPane");

dojo.widget.html.ContentPane = function(){
	dojo.widget.html.Container.call(this);
}
dojo.inherits(dojo.widget.html.ContentPane, dojo.widget.html.Container);

dojo.lang.extend(dojo.widget.html.ContentPane, {
	widgetType: "ContentPane",

	href: "",
	extractContent: true,
	parseContent: true,
	cacheContent: true,
	
	// To generate pane content from a java function
	handler: "",

	postCreate: function(args, frag, parentComp){
		if ( this.handler != "" ){
			this.setHandler(this.handler);
		}
	},

	onResized: function(){
		if(this.isVisible()){
			this.loadContents();
		}
		dojo.widget.html.ContentPane.superclass.onResized.call(this);
	},

	show: function(){
		this.loadContents();
		dojo.widget.html.ContentPane.superclass.show.call(this);
	},

	loadContents: function() {
		if ( this.isLoaded ){
			return;
		}
		this.isLoaded=true;
		if ( dojo.lang.isFunction(this.handler)) {
			this._runHandler();
		} else if ( this.href != "" ) {
			this._downloadExternalContent(this.href, this.cacheContent);
		}
	},

	// Reset the (external defined) content of this pane
	setUrl: function(url) {
		this.href = url;
		this.isLoaded = false;
		if ( this.isVisible() ){
			this.loadContents();
		}
	},

	_downloadExternalContent: function(url, useCache) {
		this.setContent("Loading...");

		var self = this;
		dojo.io.bind({
			url: url,
			useCache: useCache,
			mimetype: "text/html",
			handler: function(type, data, e) {
				if(type == "load") {
					if(self.extractContent) {
						var matches = data.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
						if(matches) { data = matches[1]; }
					}
					self.setContent.call(self, data);
				} else {
					self.setContent.call(self, "Error loading '" + url + "' (" + e.status + " " + e.statusText + ")");
				}
			}
		});
	},

	setContent: function(data){
		var node = this.containerNode || this.domNode;
		node.innerHTML = data;
		if(this.parseContent) {
			var parser = new dojo.xml.Parse();
			var frag = parser.parseElement(node, null, true);
			dojo.widget.getParser().createComponents(frag);
			this.onResized();
		}
	},

	// Generate pane content from given java function
	setHandler: function(handler) {
		var fcn = dojo.lang.isFunction(handler) ? handler : window[handler];
		if(!dojo.lang.isFunction(fcn)) {
			throw new Error("Unable to set handler, '" + handler + "' not a function.");
			return;
		}
		this.handler = function() {
			return fcn.apply(this, arguments);
		}
	},

	_runHandler: function() {
		if(dojo.lang.isFunction(this.handler)) {
			this.handler(this, this.domNode);
			return false;
		}
		return true;
	}
});

dojo.widget.tags.addParseTreeHandler("dojo:ContentPane");

/*
	Copyright (c) 2006-2007, Accsense, Inc.
	All Rights Reserved.
*/
dojo.provide("awl.common");

awl.common.fixPngIE = function(img) {
	if (document.all) { //only apply if IE detected
		img.style.width = "24px";
		img.style.height = "24px";
		img.style.filter = 		
			"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + 
			img.src +"', sizingMethod='scale')";
		img.src=
			dojo.uri.dojoUri("../awl/widget/templates/images/clear.gif");	
	}
};

awl.common.fixPngImagesIE = function(parentNode) {
	var images = document.images;
	for(var i=0; i < images.length; i=i+1) {
		var img = images[i];
		if(dojo.dom.isDescendantOf(img, parentNode)) {
			var name = img.src;
			var ext = name.substr(name.length-3, 3).toUpperCase();
			if (ext == "PNG") {
				awl.common.fixPngIE(img);																								
			}
		}
	}
};


// utility function to retrieve a future expiration date in proper format;
// pass three integer parameters for the number of days, hours,
// and minutes from now you want the cookie to expire; all three
// parameters required, so use zeros where appropriate
awl.common.getExpDate = function(days, hours, minutes) {
    var expDate = new Date();
    if (typeof days == "number" && typeof hours == "number" && typeof hours == "number") {
        expDate.setDate(expDate.getDate() + parseInt(days));
        expDate.setHours(expDate.getHours() + parseInt(hours));
        expDate.setMinutes(expDate.getMinutes() + parseInt(minutes));
        return expDate.toGMTString();
    }
};

// utility function called by getCookie()
awl.common.getCookieVal = function(offset) {
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
};

// primary function to retrieve cookie by name
awl.common.getCookie = function(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return awl.common.getCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i === 0) { break; }
    }
    return null;
};

// store cookie value with optional details as needed
awl.common.setCookie = function(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape (value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
};

// remove the cookie by setting ancient expiration date
awl.common.deleteCookie = function(name,path,domain) {
    if (awl.common.getCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};


/*
 * Used by test routines to load test data from a local file.
 */
awl.common.loadXmlFromFile = function(fileUri, myObject, handler){
		if (handler === null) { alert("awl.common.loadXmlFromFile: Invalid handler param!"); }
	
		var bindArgs = {
		    url: fileUri,
		    mimetype:   "text/xml",
		    preventCache: true,
		    error:  function(type, errObj){
				dojo.debug("Load XML from file failed: "+fileUri);
		    },
		    load: handler,
		    callingObj: myObject
		};
	
		// dispatch the request
	    dojo.io.bind(bindArgs);
};

/**
 * Util
 */
awl.common.formatDecimal = function(argvalue, addzero, decimaln) {
	  var numOfDecimal = (decimaln === null) ? 2 : decimaln;
	  var number = 1;
	
	/*
		formatDecimal function
			Print the floating point number with certain decimal point.
		
		Syntax
			  formatDecimal(number, boolean, decimal)
		
			number is the floating point number which will be formatted.
		
			boolean is used to decide whether add "0" at the end of the 
			floating point number or not.
		
			decimal is how many decimal point you wnat. (Default is 2)
	 */
	
	  number = Math.pow(10, numOfDecimal);
	
	  argvalue = Math.round(parseFloat(argvalue) * number) / number;
	  // If you're using IE3.x, you will get error with the following line.
	  // argvalue = argvalue.toString();
	  // It works fine in IE4.
	  argvalue = "" + argvalue;
	
	  if (argvalue.indexOf(".") === 0) {
		argvalue = "0" + argvalue;
	   }
	
	  if (addzero === true) {
		if (argvalue.indexOf(".") == -1) {
		  argvalue = argvalue + ".";
		 }
	
		while ((argvalue.indexOf(".") + 1) > (argvalue.length - numOfDecimal)) {
		  argvalue = argvalue + "0";
		 }
	  }
	
	  return argvalue;
};

awl.common.isKey = function(keycode, evt) {
    var charCode = (evt.charCode) ? evt.charCode :
        ((evt.which) ? evt.which : evt.keyCode);
    if (charCode !== keycode) {
    	return (false);
    }
    return (true);
};

/**
 * Form utilities
 */
awl.common.focusNodeOnReturn = function(elemNode, evt) {
    if (awl.common.isKey(13,evt)) {
        elemNode.focus();
        elemNode.select();
        return false;
    }
    return true;
}

/**
 * XML Parse utils
 */
awl.common.getXmlValue = function(xDoc, xmlNodeName){
	var xmlNode = xDoc.getElementsByTagName(xmlNodeName)[0];
	var textValue = "";
	
	if ((dojo.dom.isNode(xmlNode)) && (xmlNode.firstChild)) {
		textValue = xmlNode.firstChild.nodeValue;
	}
		  
	return (textValue);
};


dojo.hostenv.conditionalLoadModule({
	common: ["awl.common"]
});
dojo.hostenv.moduleLoaded("awl.*");

// tell the package system what classes get defined here
dojo.provide("awl.widget.ChartLegend");

// load dependencies
dojo.require("dojo.event.*");

dojo.setModulePrefix('awl', '../awl');
dojo.require("awl.*");

/**
 	ChartLegend.js consumes the following XML Data Schema:
	
	<?xml version='1.0' encoding='UTF-8'?>
	<xml-body>
	...
	<ledgendData>
		<alarm1Label>greater than 190982.0</alarm1Label>
		<alarm2Label>less than 82.0</alarm2Label>
		<decimated>true</decimated>
	</ledgendData>
	...
	</xml-body>
 
 */

// define the widget class
awl.widget.ChartLegend = function(){
    // inheritance
    dojo.widget.HtmlWidget.call(this);

    this.templatePath = dojo.uri.dojoUri("../awl/widget/templates/HtmlChartLegend.html");
    this.templateCssPath = dojo.uri.dojoUri("../awl/widget/templates/HtmlChartLegend.css");
    this.widgetType = "ChartLegend";
    
    this.Strings = {
    	DECIMATED: "* data condensed",
    	FAQ_LINK: "http://www.accsense.com/cust_support_faq.html#condensedData",
    	FOOTNOTE_TOOLTIP: "Click here for more information",
    	SCALE_MODE_AUTO: "Auto",
    	SCALE_MODE_MANUAL: "Manual",
    	SCALE_MODE_LABEL: "Y-Axis Scale:"
    };

	// parameters
	this.alarmLegendText1 = "Label1";
	this.alarmLegendText2 = "Label2";

	// public vars	
	this.xmlTestFile = "";
	
	// our DOM nodes =
	this._alarm1Label = null;
	this._alarm2Label = null;
	this._compressedMsg = null;
	this._swatch1 = null;
	this._swatch2 = null;
	this._yScaleLabel = null;
	this._yScaleMode = null;
	
	//private vars
	this.xmlDataNode = null;
	this.alarmObj1 = {};
	this.alarmObj2 = {};
		
	this.fillInTemplate  = function(){
		this._yScaleMode.style.display = "none";
	};
	
	this.postCreate = function(){
		this._registerExternalEvents();
		this._initObjects();
		if (this.xmlTestFile !== "") {
			/* load test file */
			awl.common.loadXmlFromFile(this.xmlTestFile, this, this._testLoadhandler);
		}
	};
	
	this._initObjects = function(){
		this.alarmObj1.label = this._alarm1Label;
		this.alarmObj1.swatch = this._swatch1;
		this.alarmObj2.label = this._alarm2Label;
		this.alarmObj2.swatch = this._swatch2;
	};

	// Draw table from xDoc document tree data
	this.updateLegend = function(data){
		if ((data === undefined) || (data === null)) {
			dojo.debug("ChartLegend: No legend data found"); 
			return false; 
		}
	    
   	    this._clearLegend();

		// set values
		var myText = this.getXmlValue(data, "alarm1Label");
		this._setAlarmLabel(this.alarmObj1, myText);
			  
		myText = this.getXmlValue(data, "alarm2Label");
		this._setAlarmLabel(this.alarmObj2, myText);		
			  
		myText = this.getXmlValue(data, "decimated");
		this._setFootnote(myText);			  
		
		this._yScaleLabel.innerHTML = this.Strings.SCALE_MODE_LABEL;
	};
	
	this._clearLegend = function(){
		this._setAlarmLabel(this.alarmObj1, "");
		this._setAlarmLabel(this.alarmObj2, "");
		this._compressedMsg.innerHTML = "";
		this._yScaleLabel.innerHTML = "";
		this._yScaleMode.innerHTML = "";
		this._yScaleMode.style.display = "block";	
	};
	
	this._setAlarmLabel = function(alarmNode, labelTxt){
		if (labelTxt === "") {
			alarmNode.label.innerHTML = "";
			alarmNode.swatch.style.display = "none";	
		}
		else {
			alarmNode.label.innerHTML = ": " + labelTxt;
			alarmNode.swatch.style.display = "inline";
		}
	};
	
	this._setFootnote = function (text){
		if (text == "true") {
			this._compressedMsg.innerHTML = this.Strings.DECIMATED;
			this._compressedMsg.href = this.Strings.FAQ_LINK;
			this._compressedMsg.target = "_blank";
			this._compressedMsg.title = this.Strings.FOOTNOTE_TOOLTIP;
		}
		else {
			this._compressedMsg.innerHTML = "";
		}
	};
	
	this._setScaleMode = function(isAutoBoolean) {
		if (isAutoBoolean) {
			this._yScaleMode.innerHTML = this.Strings.SCALE_MODE_AUTO;
		}
		else {
			this._yScaleMode.innerHTML = this.Strings.SCALE_MODE_MANUAL;
		}
	}
	
/**
 * test routines
 */
	this._testLoadhandler = function(type, data, ev){
		this.callingObj.updateLegend(data);
	};	
/**
 * Internal Events
 */	
 	this.onScaleModeClick = function(evt){
 		this._requestScaleFocus();
 	};
 	
/**
 * External events
 */
	this._registerExternalEvents = function(){		
		dojo.event.topic.subscribe("/onLegendData", 
				   this, 
				   this._externalLoadEvent);

		dojo.event.topic.subscribe("/onLoading", 
				   this, 
				   this._prepareToLoad);
				   
		dojo.event.topic.subscribe("/onScaleModeChange", 
				   this, 
				   this._externalScaleModeChange);

		dojo.event.topic.registerPublisher("/requestScaleFocus", 
				   this, 
				   this._requestScaleFocus);									  
	};

	this._externalLoadEvent = function(xDocLegendData){
		dojo.debug(this.widgetType, 
				   ": Received /onLegendData event",
				   xDocLegendData);
		this.updateLegend(xDocLegendData);
	};

	this._prepareToLoad = function(){
		dojo.debug(this.widgetType, 
				   ": Received /onLoading event");
		this._clearLegend();
	}; 
	
	this._externalScaleModeChange = function(isAuto){
		dojo.debug(this.widgetType, 
			   ": Received /onScaleModeChange event");
		this._setScaleMode(isAuto);
	}; 
	
	this._requestScaleFocus = function(){
		dojo.debug(this.widgetType, 
			   ": Requesting Scale focus",
			   "(/requestScaleFocus)");
	}; 
/**
 * Util
 */
 	this.getXmlValue = function(xDoc, xmlNodeName){
 		var xmlNode = xDoc.getElementsByTagName(xmlNodeName)[0];
 		var textValue = "";
		
		if ((dojo.dom.isNode(xmlNode)) && (xmlNode.firstChild)) {
			textValue = xmlNode.firstChild.nodeValue;
		}
			  
		return (textValue);
 	};
	
};

// complete the inheritance process
dojo.inherits(awl.widget.ChartLegend, dojo.widget.HtmlWidget);
// make it a tag
dojo.widget.tags.addParseTreeHandler("dojo:chartlegend");

dojo.provide("dojo.date");
dojo.require("dojo.string");

/**
 * Sets the current Date object to the time given in an ISO 8601 date/time
 * stamp
 *
 * @param string The date/time formted as an ISO 8601 string
 */
dojo.date.setIso8601 = function (dateObject, string) {
	var comps = string.split('T');
	dojo.date.setIso8601Date(dateObject, comps[0]);
	if (comps.length == 2) { dojo.date.setIso8601Time(dateObject, comps[1]); }
	return dateObject;
}

dojo.date.fromIso8601 = function (string) {
	return dojo.date.setIso8601(new Date(0), string);
}

/**
 * Sets the current Date object to the date given in an ISO 8601 date
 * stamp. The time is left unchanged.
 *
 * @param string The date formted as an ISO 8601 string
 */
dojo.date.setIso8601Date = function (dateObject, string) {
	var regexp = "^([0-9]{4})((-?([0-9]{2})(-?([0-9]{2}))?)|" +
			"(-?([0-9]{3}))|(-?W([0-9]{2})(-?([1-7]))?))?$";
	var d = string.match(new RegExp(regexp));

	var year = d[1];
	var month = d[4];
	var date = d[6];
	var dayofyear = d[8];
	var week = d[10];
	var dayofweek = (d[12]) ? d[12] : 1;

	dateObject.setYear(year);
	
	if (dayofyear) { dojo.date.setDayOfYear(dateObject, Number(dayofyear)); }
	else if (week) {
		dateObject.setMonth(0);
		dateObject.setDate(1);
		var gd = dateObject.getDay();
		var day =  (gd) ? gd : 7;
		var offset = Number(dayofweek) + (7 * Number(week));
		
		if (day <= 4) { dateObject.setDate(offset + 1 - day); }
		else { dateObject.setDate(offset + 8 - day); }
	} else {
		if (month) { dateObject.setMonth(month - 1); }
		if (date) { dateObject.setDate(date); }
	}
	
	return dateObject;
}

dojo.date.fromIso8601Date = function (string) {
	return dojo.date.setIso8601Date(new Date(0), string);
}

/**
 * Sets the current Date object to the date given in an ISO 8601 time
 * stamp. The date is left unchanged.
 *
 * @param string The time formted as an ISO 8601 string
 */
dojo.date.setIso8601Time = function (dateObject, string) {
	// first strip timezone info from the end
	var timezone = "Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$";
	var d = string.match(new RegExp(timezone));

	var offset = 0; // local time if no tz info
	if (d) {
		if (d[0] != 'Z') {
			offset = (Number(d[3]) * 60) + Number(d[5]);
			offset *= ((d[2] == '-') ? 1 : -1);
		}
		offset -= dateObject.getTimezoneOffset()
		string = string.substr(0, string.length - d[0].length);
	}

	// then work out the time
	var regexp = "^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(\.([0-9]+))?)?)?$";
	var d = string.match(new RegExp(regexp));

	var hours = d[1];
	var mins = Number((d[3]) ? d[3] : 0) + offset;
	var secs = (d[5]) ? d[5] : 0;
	var ms = d[7] ? (Number("0." + d[7]) * 1000) : 0;

	dateObject.setHours(hours);
	dateObject.setMinutes(mins);
	dateObject.setSeconds(secs);
	dateObject.setMilliseconds(ms);
	
	return dateObject;
}

dojo.date.fromIso8601Time = function (string) {
	return dojo.date.setIso8601Time(new Date(0), string);
}

/**
 * Sets the date to the day of year
 *
 * @param date The day of year
 */
dojo.date.setDayOfYear = function (dateObject, dayofyear) {
	dateObject.setMonth(0);
	dateObject.setDate(dayofyear);
	return dateObject;
}

/**
 * Retrieves the day of the year the Date is set to.
 *
 * @return The day of the year
 */
dojo.date.getDayOfYear = function (dateObject) {
	var tmpdate = new Date("1/1/" + dateObject.getFullYear());
	return Math.floor((dateObject.getTime() - tmpdate.getTime()) / 86400000);
}

dojo.date.getWeekOfYear = function (dateObject) {
	return Math.ceil(dojo.date.getDayOfYear(dateObject) / 7);
}

dojo.date.daysInMonth = function (month, year) {
	dojo.deprecated("daysInMonth(month, year)",
		"replaced by getDaysInMonth(dateObject)", "0.4");
	return dojo.date.getDaysInMonth(new Date(year, month, 1));
}

/**
 * Returns the number of days in the given month. Leap years are accounted
 * for.
 *
 * @param dateObject Date set to the month concerned
 * @return The number of days in the given month
 */
dojo.date.getDaysInMonth = function (dateObject) {
	var month = dateObject.getMonth();
	var year = dateObject.getFullYear();
	
	/*
	 * Leap years are years with an additional day YYYY-02-29, where the year
	 * number is a multiple of four with the following exception: If a year
	 * is a multiple of 100, then it is only a leap year if it is also a
	 * multiple of 400. For example, 1900 was not a leap year, but 2000 is one.
	 */
	var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if (month == 1 && year) {
		if ((!(year % 4) && (year % 100)) ||
			(!(year % 4) && !(year % 100) && !(year % 400))) { return 29; }
		else { return 28; }
	} else { return days[month]; }
}


dojo.date.months = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"];
dojo.date.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
dojo.date.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
dojo.date.shortDays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

/**
 *
 * Returns a string of the date in the version "January 1, 2004"
 *
 * @param date The date object
 */
dojo.date.toLongDateString = function(date) {
	return dojo.date.months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

/**
 *
 * Returns a string of the date in the version "Jan 1, 2004"
 *
 * @param date The date object
 */
dojo.date.toShortDateString = function(date) {
	return dojo.date.shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

/**
 *
 * Returns military formatted time
 *
 * @param date the date object
 */
dojo.date.toMilitaryTimeString = function(date){
	var h = "00" + date.getHours();
	var m = "00" + date.getMinutes();
	var s = "00" + date.getSeconds();
	return h.substr(h.length-2,2) + ":" + m.substr(m.length-2,2) + ":" + s.substr(s.length-2,2);
}

/**
 *
 * Returns a string of the date relative to the current date.
 *
 * @param date The date object
 *
 * Example returns:
 * - "1 minute ago"
 * - "4 minutes ago"
 * - "Yesterday"
 * - "2 days ago"
 */
dojo.date.toRelativeString = function(date) {
	var now = new Date();
	var diff = (now - date) / 1000;
	var end = " ago";
	var future = false;
	if(diff < 0) {
		future = true;
		end = " from now";
		diff = -diff;
	}

	if(diff < 60) {
		diff = Math.round(diff);
		return diff + " second" + (diff == 1 ? "" : "s") + end;
	} else if(diff < 3600) {
		diff = Math.round(diff/60);
		return diff + " minute" + (diff == 1 ? "" : "s") + end;
	} else if(diff < 3600*24 && date.getDay() == now.getDay()) {
		diff = Math.round(diff/3600);
		return diff + " hour" + (diff == 1 ? "" : "s") + end;
	} else if(diff < 3600*24*7) {
		diff = Math.round(diff/(3600*24));
		if(diff == 1) {
			return future ? "Tomorrow" : "Yesterday";
		} else {
			return diff + " days" + end;
		}
	} else {
		return dojo.date.toShortDateString(date);
	}
}

/**
 * Retrieves the day of the week the Date is set to.
 *
 * @return The day of the week
 */
dojo.date.getDayOfWeekName = function (date) {
	return dojo.date.days[date.getDay()];
}

/**
 * Retrieves the short day of the week name the Date is set to.
 *
 * @return The short day of the week name
 */
dojo.date.getShortDayOfWeekName = function (date) {
	return dojo.date.shortDays[date.getDay()];
}

/**
 * Retrieves the month name the Date is set to.
 *
 * @return The month name
 */
dojo.date.getMonthName = function (date) {
	return dojo.date.months[date.getMonth()];
}

/**
 * Retrieves the short month name the Date is set to.
 *
 * @return The short month name
 */
dojo.date.getShortMonthName = function (date) {
	return dojo.date.shortMonths[date.getMonth()];
}

/**
 *
 * Format datetime
 * 
 * @param date the date object
 */
dojo.date.toString = function(date, format){

	if (format.indexOf("#d") > -1) {
		format = format.replace(/#dddd/g, dojo.date.getDayOfWeekName(date));
		format = format.replace(/#ddd/g, dojo.date.getShortDayOfWeekName(date));
		format = format.replace(/#dd/g, (date.getDate().toString().length==1?"0":"")+date.getDate());
		format = format.replace(/#d/g, date.getDate());
	}

	if (format.indexOf("#M") > -1) {
		format = format.replace(/#MMMM/g, dojo.date.getMonthName(date));
		format = format.replace(/#MMM/g, dojo.date.getShortMonthName(date));
		format = format.replace(/#MM/g, ((date.getMonth()+1).toString().length==1?"0":"")+(date.getMonth()+1));
		format = format.replace(/#M/g, date.getMonth() + 1);
	}

	if (format.indexOf("#y") > -1) {
		var fullYear = date.getFullYear().toString();
		format = format.replace(/#yyyy/g, fullYear);
		format = format.replace(/#yy/g, fullYear.substring(2));
		format = format.replace(/#y/g, fullYear.substring(3));
	}

	// Return if only date needed;
	if (format.indexOf("#") == -1) {
		return format;
	}
	
	if (format.indexOf("#h") > -1) {
		var hours = date.getHours();
		hours = (hours > 12 ? hours - 12 : (hours == 0) ? 12 : hours);
		format = format.replace(/#hh/g, (hours.toString().length==1?"0":"")+hours);
		format = format.replace(/#h/g, hours);
	}
	
	if (format.indexOf("#H") > -1) {
		format = format.replace(/#HH/g, (date.getHours().toString().length==1?"0":"")+date.getHours());
		format = format.replace(/#H/g, date.getHours());
	}
	
	if (format.indexOf("#m") > -1) {
		format = format.replace(/#mm/g, (date.getMinutes().toString().length==1?"0":"")+date.getMinutes());
		format = format.replace(/#m/g, date.getMinutes());
	}

	if (format.indexOf("#s") > -1) {
		format = format.replace(/#ss/g, (date.getSeconds().toString().length==1?"0":"")+date.getSeconds());
		format = format.replace(/#s/g, date.getSeconds());
	}
	
	if (format.indexOf("#T") > -1) {
		format = format.replace(/#TT/g, date.getHours() >= 12 ? "PM" : "AM");
		format = format.replace(/#T/g, date.getHours() >= 12 ? "P" : "A");
	}

	if (format.indexOf("#t") > -1) {
		format = format.replace(/#tt/g, date.getHours() >= 12 ? "pm" : "am");
		format = format.replace(/#t/g, date.getHours() >= 12 ? "p" : "a");
	}
					
	return format;
	
}

/**
 * Convert a Date to a SQL string, optionally ignoring the HH:MM:SS portion of the Date
 */
dojo.date.toSql = function(date, noTime) {
	var sql = date.getFullYear() + "-" + dojo.string.pad(date.getMonth(), 2) + "-"
		+ dojo.string.pad(date.getDate(), 2);
	if(!noTime) {
		sql += " " + dojo.string.pad(date.getHours(), 2) + ":"
			+ dojo.string.pad(date.getMinutes(), 2) + ":"
			+ dojo.string.pad(date.getSeconds(), 2);
	}
	return sql;
}

/**
 * Convert a SQL date string to a JavaScript Date object
 */
dojo.date.fromSql = function(sqlDate) {
	var parts = sqlDate.split(/[\- :]/g);
	while(parts.length < 6) {
		parts.push(0);
	}
	return new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]);
}

dojo.provide("dojo.widget.DatePicker");
dojo.provide("dojo.widget.DatePicker.util");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.date");

dojo.widget.DatePicker = function(){
	dojo.widget.Widget.call(this);
	this.widgetType = "DatePicker";
	this.isContainer = false;
	// the following aliases prevent breaking people using 0.2.x
	this.months = dojo.date.months;
	this.weekdays = dojo.date.days;
	this.toRfcDate = dojo.widget.DatePicker.util.toRfcDate;
	this.fromRfcDate = dojo.widget.DatePicker.util.fromRfcDate;
	this.initFirstSaturday = dojo.widget.DatePicker.util.initFirstSaturday;
}

dojo.inherits(dojo.widget.DatePicker, dojo.widget.Widget);
dojo.widget.tags.addParseTreeHandler("dojo:datepicker");



dojo.widget.DatePicker.util = new function() {
	this.months = dojo.date.months;
	this.weekdays = dojo.date.days;
	
	this.toRfcDate = function(jsDate) {
		if(!jsDate) {
			jsDate = this.today;
		}
		var year = jsDate.getFullYear();
		var month = jsDate.getMonth() + 1;
		if (month < 10) {
			month = "0" + month.toString();
		}
		var date = jsDate.getDate();
		if (date < 10) {
			date = "0" + date.toString();
		}
		// because this is a date picker and not a time picker, we treat time 
		// as zero
		return year + "-" + month + "-" + date + "T00:00:00+00:00";
	}
	
	this.fromRfcDate = function(rfcDate) {
		var tempDate = rfcDate.split("-");
		if(tempDate.length < 3) {
			return new Date();
		}
		// fullYear, month, date
		return new Date(parseInt(tempDate[0]), (parseInt(tempDate[1], 10) - 1), parseInt(tempDate[2].substr(0,2), 10));
	}
	
	this.initFirstSaturday = function(month, year) {
		if(!month) {
			month = this.date.getMonth();
		}
		if(!year) {
			year = this.date.getFullYear();
		}
		var firstOfMonth = new Date(year, month, 1);
		return {year: year, month: month, date: 7 - firstOfMonth.getDay()};
	}
}

dojo.provide("dojo.widget.html.DatePicker");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DatePicker");
dojo.require("dojo.event.*");
dojo.require("dojo.html");

/*
	Some assumptions:
	- I'm planning on always showing 42 days at a time, and we can scroll by week,
	not just by month or year
	- To get a sense of what month to highlight, I basically initialize on the 
	first Saturday of each month, since that will be either the first of two or 
	the second of three months being partially displayed, and then I work forwards 
	and backwards from that point.
	Currently, I assume that dates are stored in the RFC 3339 format,
	because I find it to be most human readable and easy to parse
	http://www.faqs.org/rfcs/rfc3339.html: 		2005-06-30T08:05:00-07:00
	FIXME: scroll by week not yet implemented
*/


dojo.widget.html.DatePicker = function(){
	dojo.widget.DatePicker.call(this);
	dojo.widget.HtmlWidget.call(this);

	var _this = this;
	// today's date, JS Date object
	this.today = "";
	// selected date, JS Date object
	this.date = "";
	// rfc 3339 date
	this.storedDate = "";
	// date currently selected in the UI, stored in year, month, date in the format that will be actually displayed
	this.currentDate = {};
	// stored in year, month, date in the format that will be actually displayed
	this.firstSaturday = {};
	this.classNames = {
		previous: "previousMonth",
		current: "currentMonth",
		next: "nextMonth",
		currentDate: "currentDate",
		selectedDate: "selectedItem"
	}

	this.templatePath =  dojo.uri.dojoUri("src/widget/templates/HtmlDatePicker.html");
	this.templateCssPath = dojo.uri.dojoUri("src/widget/templates/HtmlDatePicker.css");
	
	this.fillInTemplate = function(){
		this.initData();
		this.initUI();
	}
	
	this.initData = function() {
		this.today = new Date();
		if(this.storedDate && (this.storedDate.split("-").length > 2)) {
			this.date = dojo.widget.DatePicker.util.fromRfcDate(this.storedDate);
		} else {
			this.date = this.today;
		}
		// calendar math is simplified if time is set to 0
		this.today.setHours(0);
		this.date.setHours(0);
		var month = this.date.getMonth();
		var tempSaturday = dojo.widget.DatePicker.util.initFirstSaturday(this.date.getMonth().toString(), this.date.getFullYear());
		this.firstSaturday.year = tempSaturday.year;
		this.firstSaturday.month = tempSaturday.month;
		this.firstSaturday.date = tempSaturday.date;
	}
	
	this.setDate = function(rfcDate) {
		this.storedDate = rfcDate;
	}
	
	
	this.initUI = function() {
		this.selectedIsUsed = false;
		this.currentIsUsed = false;
		var currentClassName = "";
		var previousDate = new Date();
		var calendarNodes = this.calendarDatesContainerNode.getElementsByTagName("td");
		var currentCalendarNode;
		// set hours of date such that there is no chance of rounding error due to 
		// time change in local time zones
		previousDate.setHours(8);
		var nextDate = new Date(this.firstSaturday.year, this.firstSaturday.month, this.firstSaturday.date, 8);

		
		if(this.firstSaturday.date < 7) {
			// this means there are days to show from the previous month
			var dayInWeek = 6;
			for (var i=this.firstSaturday.date; i>0; i--) {
				currentCalendarNode = calendarNodes.item(dayInWeek);
				currentCalendarNode.innerHTML = nextDate.getDate();
				dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "current"));
				dayInWeek--;
				previousDate = nextDate;
				nextDate = this.incrementDate(nextDate, false);
			}
			for(var i=dayInWeek; i>-1; i--) {
				currentCalendarNode = calendarNodes.item(i);
				currentCalendarNode.innerHTML = nextDate.getDate();
				dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "previous"));
				previousDate = nextDate;
				nextDate = this.incrementDate(nextDate, false);				
			}
		} else {
			nextDate.setDate(1);
			for(var i=0; i<7; i++) {
				currentCalendarNode = calendarNodes.item(i);
				currentCalendarNode.innerHTML = i + 1;
				dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "current"));
				previousDate = nextDate;
				nextDate = this.incrementDate(nextDate, true);				
			}
		}
		previousDate.setDate(this.firstSaturday.date);
		previousDate.setMonth(this.firstSaturday.month);
		previousDate.setFullYear(this.firstSaturday.year);
		nextDate = this.incrementDate(previousDate, true);
		var count = 7;
		currentCalendarNode = calendarNodes.item(count);
		while((nextDate.getMonth() == previousDate.getMonth()) && (count<42)) {
			currentCalendarNode.innerHTML = nextDate.getDate();
			dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "current"));
			currentCalendarNode = calendarNodes.item(++count);
			previousDate = nextDate;
			nextDate = this.incrementDate(nextDate, true);
		}
		
		while(count < 42) {
			currentCalendarNode.innerHTML = nextDate.getDate();
			dojo.html.setClass(currentCalendarNode, this.getDateClassName(nextDate, "next"));
			currentCalendarNode = calendarNodes.item(++count);
			previousDate = nextDate;
			nextDate = this.incrementDate(nextDate, true);
		}
		this.setMonthLabel(this.firstSaturday.month);
		this.setYearLabels(this.firstSaturday.year);
	}
	
	this.incrementDate = function(date, bool) {
		// bool: true to increase, false to decrease
		var time = date.getTime();
		var increment = 1000 * 60 * 60 * 24;
		time = (bool) ? (time + increment) : (time - increment);
		var returnDate = new Date();
		returnDate.setTime(time);
		return returnDate;
	}
	
	this.incrementWeek = function(date, bool) {
		dojo.unimplemented('dojo.widget.html.DatePicker.incrementWeek');
	}

	this.incrementMonth = function(date, bool) {
		dojo.unimplemented('dojo.widget.html.DatePicker.incrementMonth');
	}

	this.incrementYear = function(date, bool) {
		dojo.unimplemented('dojo.widget.html.DatePicker.incrementYear');
	}

	this.onIncrementDate = function(evt) {
		dojo.unimplemented('dojo.widget.html.DatePicker.onIncrementDate');
	}
	
	this.onIncrementWeek = function(evt) {
		// FIXME: should make a call to incrementWeek when that is implemented
		evt.stopPropagation();
		dojo.unimplemented('dojo.widget.html.DatePicker.onIncrementWeek');
		switch(evt.target) {
			case this.increaseWeekNode:
				break;
			case this.decreaseWeekNode:
				break;
		}
	}

	this.onIncrementMonth = function(evt) {
		// FIXME: should make a call to incrementMonth when that is implemented
		evt.stopPropagation();
		var month = this.firstSaturday.month;
		var year = this.firstSaturday.year;
		switch(evt.currentTarget) {
			case this.increaseMonthNode:
				if(month < 11) {
					month++;
				} else {
					month = 0;
					year++;
					
					this.setYearLabels(year);
				}
				break;
			case this.decreaseMonthNode:
				if(month > 0) {
					month--;
				} else {
					month = 11;
					year--;
					this.setYearLabels(year);
				}
				break;
			case this.increaseMonthNode.getElementsByTagName("img").item(0):
				if(month < 11) {
					month++;
				} else {
					month = 0;
					year++;
					this.setYearLabels(year);
				}
				break;
			case this.decreaseMonthNode.getElementsByTagName("img").item(0):
				if(month > 0) {
					month--;
				} else {
					month = 11;
					year--;
					this.setYearLabels(year);
				}
				break;
		}
		var tempSaturday = dojo.widget.DatePicker.util.initFirstSaturday(month.toString(), year);
		this.firstSaturday.year = tempSaturday.year;
		this.firstSaturday.month = tempSaturday.month;
		this.firstSaturday.date = tempSaturday.date;
		this.initUI();
	}
	
	this.onIncrementYear = function(evt) {
		// FIXME: should make a call to incrementYear when that is implemented
		evt.stopPropagation();
		var year = this.firstSaturday.year;
		switch(evt.target) {
			case this.nextYearLabelNode:
				year++;
				break;
			case this.previousYearLabelNode:
				year--;
				break;
		}
		var tempSaturday = dojo.widget.DatePicker.util.initFirstSaturday(this.firstSaturday.month.toString(), year);
		this.firstSaturday.year = tempSaturday.year;
		this.firstSaturday.month = tempSaturday.month;
		this.firstSaturday.date = tempSaturday.date;
		this.initUI();
	}

	this.setMonthLabel = function(monthIndex) {
		this.monthLabelNode.innerHTML = this.months[monthIndex];
	}
	
	this.setYearLabels = function(year) {
		this.previousYearLabelNode.innerHTML = year - 1;
		this.currentYearLabelNode.innerHTML = year;
		this.nextYearLabelNode.innerHTML = year + 1;
	}
	
	this.getDateClassName = function(date, monthState) {
		var currentClassName = this.classNames[monthState];
		if ((!this.selectedIsUsed) && (date.getDate() == this.date.getDate()) && (date.getMonth() == this.date.getMonth()) && (date.getFullYear() == this.date.getFullYear())) {
			currentClassName = this.classNames.selectedDate + " " + currentClassName;
			this.selectedIsUsed = 1;
		}
		if((!this.currentIsUsed) && (date.getDate() == this.today.getDate()) && (date.getMonth() == this.today.getMonth()) && (date.getFullYear() == this.today.getFullYear())) {
			currentClassName = currentClassName + " "  + this.classNames.currentDate;
			this.currentIsUsed = 1;
		}
		return currentClassName;
	}

	this.onClick = function(evt) {
		dojo.event.browser.stopEvent(evt)
	}
	
	this.onSetDate = function(evt) {
		dojo.event.browser.stopEvent(evt);
		this.selectedIsUsed = 0;
		this.todayIsUsed = 0;
		var month = this.firstSaturday.month;
		var year = this.firstSaturday.year;
		if (dojo.html.hasClass(evt.target, this.classNames["next"])) {
			month = ++month % 12;
			// if month is now == 0, add a year
			year = (month==0) ? ++year : year;
		} else if (dojo.html.hasClass(evt.target, this.classNames["previous"])) {
			month = --month % 12;
			// if month is now == 0, add a year
			year = (month==11) ? --year : year;
		}
		this.date = new Date(year, month, evt.target.innerHTML);
		this.setDate(dojo.widget.DatePicker.util.toRfcDate(this.date));
		this.initUI();
	}
}
dojo.inherits(dojo.widget.html.DatePicker, dojo.widget.HtmlWidget);

dojo.provide("dojo.widget.TimePicker");
dojo.provide("dojo.widget.TimePicker.util");
dojo.require("dojo.widget.DomWidget");

dojo.widget.TimePicker = function(){
	dojo.widget.Widget.call(this);
	this.widgetType = "TimePicker";
	this.isContainer = false;
	// the following aliases prevent breaking people using 0.2.x
	this.toRfcDateTime = dojo.widget.TimePicker.util.toRfcDateTime;
	this.fromRfcDateTime = dojo.widget.TimePicker.util.fromRfcDateTime;
	this.toAmPmHour = dojo.widget.TimePicker.util.toAmPmHour;
	this.fromAmPmHour = dojo.widget.TimePicker.util.fromAmPmHour;
}

dojo.inherits(dojo.widget.TimePicker, dojo.widget.Widget);
dojo.widget.tags.addParseTreeHandler("dojo:timepicker");



dojo.widget.TimePicker.util = new function() {
	// utility functions
	this.toRfcDateTime = function(jsDate) {
		if(!jsDate) {
			jsDate = new Date();
		}
		var year = jsDate.getFullYear();
		var month = jsDate.getMonth() + 1;
		if (month < 10) {
			month = "0" + month.toString();
		}
		var date = jsDate.getDate();
		if (date < 10) {
			date = "0" + date.toString();
		}
		var hour = jsDate.getHours();
		if (hour < 10) {
			hour = "0" + hour.toString();
		}
		var minute = jsDate.getMinutes();
		if (minute < 10) {
			minute = "0" + minute.toString();
		}
		// no way to set seconds, so set to zero
		var second = "00";
		var timeZone = jsDate.getTimezoneOffset();
		var timeZoneHour = parseInt(timeZone/60);
		if(timeZoneHour > -10 && timeZoneHour < 0) {
			timeZoneHour = "-0" + Math.abs(timeZoneHour);
		} else if(timeZoneHour < 10) {
			timeZoneHour = "+0" + timeZoneHour.toString();
		} else if(timeZoneHour >= 10) {
			timeZoneHour = "+" + timeZoneHour.toString();
		}
		var timeZoneMinute = timeZone%60;
		if(timeZoneMinute < 10) {
			timeZoneMinute = "0" + timeZoneMinute.toString();
		}
		return year + "-" + month + "-" + date + "T" + hour + ":" + minute + ":" + second + timeZoneHour +":" + timeZoneMinute;
	}

	this.fromRfcDateTime = function(rfcDate, useDefaultMinutes) {
		var tempDate = new Date();
		if(!rfcDate || !rfcDate.split("T")[1]) {
			if(useDefaultMinutes) {
				tempDate.setMinutes(Math.floor(tempDate.getMinutes()/5)*5);
			} else {
				tempDate.setMinutes(0);
			}
		} else {
			var tempTime = rfcDate.split("T")[1].split(":");
			// fullYear, month, date
			var tempDate = new Date();
			tempDate.setHours(tempTime[0]);
			tempDate.setMinutes(tempTime[1]);
		}
		return tempDate;
	}

	this.toAmPmHour = function(hour) {
		var amPmHour = hour;
		var isAm = true;
		if (amPmHour == 0) {
			amPmHour = 12;
		} else if (amPmHour>12) {
			amPmHour = amPmHour - 12;
			isAm = false;
		} else if (amPmHour == 12) {
			isAm = false;
		}
		return [amPmHour, isAm];
	}

	this.fromAmPmHour = function(amPmHour, isAm) {
		var hour = parseInt(amPmHour, 10);
		if(isAm && hour == 12) {
			hour = 0;
		} else if (!isAm && hour<12) {
			hour = hour + 12;
		}
		return hour;
	}
}

dojo.provide("dojo.widget.html.TimePicker");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.TimePicker");
dojo.require("dojo.widget.TimePicker.util");
dojo.require("dojo.event.*");
dojo.require("dojo.html");

dojo.widget.html.TimePicker = function(){
	dojo.widget.TimePicker.call(this);
	dojo.widget.HtmlWidget.call(this);


	var _this = this;
	// selected time, JS Date object
	this.time = "";
	// set following flag to true if a default time should be set
	this.useDefaultTime = false;
	// set the following to true to set default minutes to current time, false to // use zero
	this.useDefaultMinutes = false;
	// rfc 3339 date
	this.storedTime = "";
	// time currently selected in the UI, stored in hours, minutes, seconds in the format that will be actually displayed
	this.currentTime = {};
	this.classNames = {
		selectedTime: "selectedItem"
	}
	this.any = "any"
	// dom node indecies for selected hour, minute, amPm, and "any time option"
	this.selectedTime = {
		hour: "",
		minute: "",
		amPm: "",
		anyTime: false
	}

	// minutes are ordered as follows: ["12", "6", "1", "7", "2", "8", "3", "9", "4", "10", "5", "11"]
	this.hourIndexMap = ["", 2, 4, 6, 8, 10, 1, 3, 5, 7, 9, 11, 0];
	// minutes are ordered as follows: ["00", "30", "05", "35", "10", "40", "15", "45", "20", "50", "25", "55"]
	this.minuteIndexMap = [0, 2, 4, 6, 8, 10, 1, 3, 5, 7, 9, 11];

	this.templatePath =  dojo.uri.dojoUri("src/widget/templates/HtmlTimePicker.html");
	this.templateCssPath = dojo.uri.dojoUri("src/widget/templates/HtmlTimePicker.css");

	this.fillInTemplate = function(){
		this.initData();
		this.initUI();
	}

	this.initData = function() {
		// FIXME: doesn't currently validate the time before trying to set it
		// Determine the date/time from stored info, or by default don't 
		//  have a set time
		// FIXME: should normalize against whitespace on storedTime... for now 
		// just a lame hack
		if(this.storedTime.split("T")[1] && this.storedTime!=" " && this.storedTime.split("T")[1]!="any") {
			this.time = dojo.widget.TimePicker.util.fromRfcDateTime(this.storedTime, this.useDefaultMinutes);
		} else if (this.useDefaultTime) {
			this.time = dojo.widget.TimePicker.util.fromRfcDateTime("", this.useDefaultMinutes);
		} else {
			this.selectedTime.anyTime = true;
		}
	}

	this.initUI = function() {
		// set UI to match the currently selected time
		if(this.time) {
			var amPmHour = dojo.widget.TimePicker.util.toAmPmHour(this.time.getHours());
			var hour = amPmHour[0];
			var isAm = amPmHour[1];
			var minute = this.time.getMinutes();
			var minuteIndex = parseInt(minute/5);
			this.onSetSelectedHour(this.hourIndexMap[hour]);
			this.onSetSelectedMinute(this.minuteIndexMap[minuteIndex]);
			this.onSetSelectedAmPm(isAm);
		} else {
			this.onSetSelectedAnyTime();
		}
	}

	this.setDateTime = function(rfcDate) {
		this.storedTime = rfcDate;
	}
	
	this.onClearSelectedHour = function(evt) {
		this.clearSelectedHour();
	}

	this.onClearSelectedMinute = function(evt) {
		this.clearSelectedMinute();
	}

	this.onClearSelectedAmPm = function(evt) {
		this.clearSelectedAmPm();
	}

	this.onClearSelectedAnyTime = function(evt) {
		this.clearSelectedAnyTime();
		if(this.selectedTime.anyTime) {
			this.selectedTime.anyTime = false;
			this.time = dojo.widget.TimePicker.util.fromRfcDateTime("", this.useDefaultMinutes);
			this.initUI();
		}
	}

	this.clearSelectedHour = function() {
		var hourNodes = this.hourContainerNode.getElementsByTagName("td");
		for (var i=0; i<hourNodes.length; i++) {
			dojo.html.setClass(hourNodes.item(i), "");
		}
	}

	this.clearSelectedMinute = function() {
		var minuteNodes = this.minuteContainerNode.getElementsByTagName("td");
		for (var i=0; i<minuteNodes.length; i++) {
			dojo.html.setClass(minuteNodes.item(i), "");
		}
	}

	this.clearSelectedAmPm = function() {
		var amPmNodes = this.amPmContainerNode.getElementsByTagName("td");
		for (var i=0; i<amPmNodes.length; i++) {
			dojo.html.setClass(amPmNodes.item(i), "");
		}
	}

	this.clearSelectedAnyTime = function() {
		dojo.html.setClass(this.anyTimeContainerNode, "anyTimeContainer");
	}

	this.onSetSelectedHour = function(evt) {
		this.onClearSelectedAnyTime();
		this.onClearSelectedHour();
		this.setSelectedHour(evt);
		this.onSetTime();
	}

	this.setSelectedHour = function(evt) {
		if(evt && evt.target) {
			dojo.html.setClass(evt.target, this.classNames.selectedTime);
			this.selectedTime["hour"] = evt.target.innerHTML;
		} else if (!isNaN(evt)) {
			var hourNodes = this.hourContainerNode.getElementsByTagName("td");
			if(hourNodes.item(evt)) {
				dojo.html.setClass(hourNodes.item(evt), this.classNames.selectedTime);
				this.selectedTime["hour"] = hourNodes.item(evt).innerHTML;
			}
		}
		this.selectedTime.anyTime = false;
	}

	this.onSetSelectedMinute = function(evt) {
		this.onClearSelectedAnyTime();
		this.onClearSelectedMinute();
		this.setSelectedMinute(evt);
		this.selectedTime.anyTime = false;
		this.onSetTime();
	}

	this.setSelectedMinute = function(evt) {
		if(evt && evt.target) {
			dojo.html.setClass(evt.target, this.classNames.selectedTime);
			this.selectedTime["minute"] = evt.target.innerHTML;
		} else if (!isNaN(evt)) {
			var minuteNodes = this.minuteContainerNode.getElementsByTagName("td");
			if(minuteNodes.item(evt)) {
				dojo.html.setClass(minuteNodes.item(evt), this.classNames.selectedTime);
				this.selectedTime["minute"] = minuteNodes.item(evt).innerHTML;
			}
		}
	}

	this.onSetSelectedAmPm = function(evt) {
		this.onClearSelectedAnyTime();
		this.onClearSelectedAmPm();
		this.setSelectedAmPm(evt);
		this.selectedTime.anyTime = false;
		this.onSetTime();
	}

	this.setSelectedAmPm = function(evt) {
		if(evt && evt.target) {
			dojo.html.setClass(evt.target, this.classNames.selectedTime);
			this.selectedTime["amPm"] = evt.target.innerHTML;
		} else {
			evt = evt ? 0 : 1;
			var amPmNodes = this.amPmContainerNode.getElementsByTagName("td");
			if(amPmNodes.item(evt)) {
				dojo.html.setClass(amPmNodes.item(evt), this.classNames.selectedTime);
				this.selectedTime["amPm"] = amPmNodes.item(evt).innerHTML;
			}
		}
	}

	this.onSetSelectedAnyTime = function(evt) {
		this.onClearSelectedHour();
		this.onClearSelectedMinute();
		this.onClearSelectedAmPm();
		this.setSelectedAnyTime();
		this.onSetTime();
	}

	this.setSelectedAnyTime = function(evt) {
		this.selectedTime.anyTime = true;
		dojo.html.setClass(this.anyTimeContainerNode, this.classNames.selectedTime + " " + "anyTimeContainer");
	}

	this.onClick = function(evt) {
		dojo.event.browser.stopEvent(evt)
	}

	this.onSetTime = function() {
		if(this.selectedTime.anyTime) {
			this.time = new Date();
			var tempDateTime = dojo.widget.TimePicker.util.toRfcDateTime(this.time);
			this.setDateTime(tempDateTime.split("T")[0] + "T" + this.any);
		} else {
			var hour = 12;
			var minute = 0;
			var isAm = false;
			if(this.selectedTime["hour"]) {
				hour = parseInt(this.selectedTime["hour"], 10);
			}
			if(this.selectedTime["minute"]) {
				minute = parseInt(this.selectedTime["minute"], 10);
			}
			if(this.selectedTime["amPm"]) {
				isAm = (this.selectedTime["amPm"].toLowerCase() == "am");
			}
			this.time = new Date();
			this.time.setHours(dojo.widget.TimePicker.util.fromAmPmHour(hour, isAm));
			this.time.setMinutes(minute);
			this.setDateTime(dojo.widget.TimePicker.util.toRfcDateTime(this.time));
		}
	}

}
dojo.inherits(dojo.widget.html.TimePicker, dojo.widget.HtmlWidget);

// tell the package system what classes get defined here
dojo.provide("awl.widget.DateSelect");

// load dependencies
dojo.require("dojo.widget.*");
dojo.require("dojo.collections.*");
dojo.require("dojo.fx.*");
dojo.require("dojo.widget.html.DatePicker");
dojo.require("dojo.widget.html.TimePicker");

// define the widget class
awl.widget.DateSelect = function(){
    // inheritance
    // see: http://www.cs.rit.edu/~atk/JavaScript/manuals/jsobj/
    dojo.widget.HtmlWidget.call(this);

    this.templatePath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlDateSelect.html");
    this.templateCssPath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlDateSelect.css");

    this.widgetType = "DateSelect";
		
	// parameters
	this.debug = false;
	this.dateValue = "";
	this.labelString = "Enter Date:";
	this.minDateValue = "";
	this.maxDateValue = "";
	this.beforeValidDateMsg = "Out of bounds.";
	this.afterValidDateMsg = "Out of bounds.";
	
	// public vars
	this.minDate = null;
	this.maxDate = null;
	
	// our DOM nodes:
	this._popupContainerSelector = null;
	this._popupSelector = null;
	this._datePickerNode = null;
	this._timePickerNode = null;
	this.datePicker = null;
	this.timePicker = null;
	this._textFieldDate = null;
	this._textFieldTime = null;
	this._textFieldLabel = null;
	this._textFieldContainer = null;
	
	//private vars
	this._selectVisible = false;
 	this._validateDisabled=false;
		
	this.fillInTemplate = function(){
		this.minDate = 
			(this.minDateValue === "") 
					? null 
					: new Date(eval(this.minDateValue));
					
		this.maxDate = 
			(this.maxDateValue === "") 
					? null 
					: new Date(eval(this.maxDateValue));
			
		this.storedDateTime = 
			(this.dateValue === "") 
					? new Date() 
					: new Date(eval(this.dateValue));
					
		/* round up to next 5 min */
		this.roundTime(this.storedDateTime, "up");
		this.roundTime(this.maxDate, "up");
		this.roundTime(this.minDate, "down");
		
		
		if (this.debug) { alert("Date="+this.storedDateTime.toString()+" \nLast="+this.minDate.toString()); }
		
		/* text fields */
		this.updateDateField(this.storedDateTime);
		this.updateTimeField(this.storedDateTime);
		
		/* DatePicker */
		this.datePicker = dojo.widget.createWidget("datepicker",{}, this._datePickerNode,"last");
		this.datePicker.decrementMonthImageNode.src = 
				dojo.uri.dojoUri("../awl/widget/templates/images/awlDecrementMonth.gif");
		this.datePicker.incrementMonthImageNode.src = 
				dojo.uri.dojoUri("../awl/widget/templates/images/awlIncrementMonth.gif");
		this.updateDatePicker(this.storedDateTime);
		dojo.event.connect(this.datePicker, "onSetDate", this, "validateDate");
		
		/* TimePicker */
		this.timePicker = dojo.widget.createWidget("timepicker",{}, this._timePickerNode,"last");
		this.timePicker.anyTimeContainerNode.innerHTML = "Set Current Time";
		//this.timePicker.timePickerContainerNode.style.left = "-150px";
		var td = this.timePicker.anyTimeContainerNode.parentNode;
		td.colSpan = "3";
		
		td = td.previousSibling;
		while (td !== null) {
			if (td.nodeType == 1) {
				td.parentNode.removeChild(td); // remove leading <td>
				break;
			}
			td = td.previousSibling;
		}

		dojo.event.connect(this.timePicker, "onSetSelectedAnyTime", this,"onSetCurrentTime");
		dojo.event.connect(this.timePicker, "onSetTime", this, "validateTime");
		this.updateTimePicker(this.storedDateTime);
			
		this._initSelector();
	};
	
	this.postCreate = function(){
		this._initTextInputControl();
	};

/**
 * Text input control
 */
 	this._initTextInputControl = function(){
		this._textFieldLabel.innerHTML = this.labelString;	
		this._sizeTextInputContainer();
	};
	
	this._sizeTextInputContainer = function(){
		/* this does not work for embedded sub-widgets 
		var dateSize = this._textFieldDate.clientWidth;
		var timeSize = this._textFieldTime.clientWidth;
		var labelSize = this._textFieldLabel.innerHTML.length * 8;
		var totalSize = eval(dateSize) + eval(timeSize) + eval(labelSize) + 10;
		*/
		this._textFieldContainer.style.width = "235px"; //totalSize + "px";
	};

/**
 * TimePicker methods
 */
	this.updateTimePicker = function(jsDate){
	 	this._validateDisabled=true;
		var rfcDate = this.timePicker.toRfcDateTime(jsDate);
		this.timePicker.setDateTime(rfcDate);
		this.timePicker.fillInTemplate();
	 	this._validateDisabled=false;
	};
	
	this.validateTime = function(evt){
		this.validateSelection("Time");
	};
	
	this.onSetCurrentTime = function(evt){
		var jsDateNow = new Date();
		this.updateTimePicker(jsDateNow);
		this.updateDatePicker(jsDateNow);
		this.validateTime();
	};

/**
 * DatePicker methods
 */ 	
	this.updateDatePicker = function(jsDate){
	 	this._validateDisabled=true;
		var rfcDate = this.datePicker.toRfcDate(jsDate);
		this.datePicker.setDate(rfcDate);
		this.datePicker.fillInTemplate();
	 	this._validateDisabled=false;
	};

	this.validateDate = function(evt) {
		this.validateSelection("Date");
	};
	
	
/**
 *  _textFieldDate methods
 */
	this.updateDateField = function(jsDate){
		this._textFieldDate.value = this.formatDate(jsDate);
	};
	
	/*
	this.onkeypress = function(evt){
		if (evt.keyCode == 13) {
			var jsDate = new Date(this._textFieldDate.value);
			this.updateDatePicker(jsDate);
			this.hideCalendar();
		}
	};
	*/

	this.formatDate = function(jsDate){
		var day = jsDate.getDate();
		var month = jsDate.getMonth() + 1;
		var year = jsDate.getYear();
		if (year < 2000) { year += 1900; } //for Netscape
		if (day <= 9) {
			day = "0" + day;
		}
		if (month <= 9) {
			month = "0" + month;
		}
		
		var dateString =  month+ "/" + day + "/" + year;
		
		return dateString;
	};
		
/**
 * Time field methods
 */
 	this.updateTimeField = function(jsDate){
		this._textFieldTime.value = this.formatTime(jsDate);
	};
	
	/*
	this.onkeypressTime = function(evt){
		if (evt.keyCode == 13) {
			var jsDate = new Date(this._textFieldDate.value);
			this.updateTimePicker(jsDate);
			this.hideTimePicker();
		}
	};
	*/

	this.getAdjustedHours = function(jsDate){
		// adjusts hours to current timezone
		var tzCurrent = (new Date()).getTimezoneOffset();
		var tzDate = jsDate.getTimezoneOffset();
		var tzDiffHrs = (tzCurrent - tzDate)/60;
		var hours = jsDate.getHours();
		hours = hours-tzDiffHrs;
		dojo.debug("tzCurrent:"+tzCurrent+" tzDate:"+tzDate+" hoursOrig:"+jsDate.getHours()+" hoursMod:"+hours);
		return(hours);
	};

	this.formatTime = function(jsDate){
		var hour = this.getAdjustedHours(jsDate);
		var min = jsDate.getMinutes();
		var ampm = "";

		ampm = (hour < 12) ? "AM" : "PM";
		if (hour === 0) { hour = 12; }
		if (hour > 12) { hour = hour-12; }

		min = min + "";
		if (min.length == 1) {
			min = "0" + min;
		}
	
		var timeString =  hour+ ":" + min + " " + ampm;
		
		return timeString;
	};


/**
 *  Popup window
 */
	this._origX = 0;
	this._origY = 0;
	
 	this._initSelector = function(){
		dojo.style.setOpacity(this._popupContainerSelector, 0);
		this._popupContainerSelector.style.display = "none";
	};
 
	this.onCloseSelector = function(evt){	
		this.updateStoredDateTime();
	 	this.hideSelector();
	};
	
	this.onCancelSelector = function(evt){
	 	this.hideSelector();
		this.updateTimePicker(this.storedDateTime);
		this.updateDatePicker(this.storedDateTime);
	};

	this.showSelector = function(){
		if (!this._selectVisible) {
			dojo.fx.fadeShow(this._popupContainerSelector, 200);
			this._popupContainerSelector.style.zIndex = "99999";
			this._popupSelector.style.zIndex = "99999";
			this._selectVisible=true;
			this.positionSelector();
			this._textFieldTime.disabled = "disabled";
			this._textFieldDate.disabled = "disabled";
		}
	};
	
	this.hideSelector = function(){
		dojo.fx.fadeHide(this._popupContainerSelector, 
						 200, dojo.lang.hitch(this, this._restorePostion));
		this._selectVisible=false;
		this._restorePostion(this._popupContainerSelector);
		this._textFieldTime.disabled = "";
		this._textFieldDate.disabled = "";
	};
	
	this._savePosition = function(x, y){
		this._origX = x;
		this._origY = y;
	};
	
	this._restorePostion = function(node){
		node.style.left = this._origX + "px";
		this.restoreScrollPosition();
	};
		
	this.positionSelector = function(){
		var node = this._popupContainerSelector;
		var marginX = 10;
		var marginY = 25;
		var xAbs = dojo.style.totalOffsetLeft(node, false);
		var yAbs = dojo.style.totalOffsetTop(node, false);
		var relativeX = dojo.style.getPixelValue(node, "left");
		var relativeY = dojo.style.getPixelValue(node, "top");
		var objHeight = dojo.style.getOuterHeight(node);
		var objWidth = dojo.style.getOuterWidth(node);
		var windowHeight = dojo.html.getViewportHeight();
		var windowWidth = dojo.html.getViewportWidth();
		var xDiff = 0;
		
		this._savePosition(relativeX, relativeY);
		this.saveScrollPosition();
		
		if (yAbs+objHeight > windowHeight - marginY) {
			var delta =  objHeight - (windowHeight-yAbs) + marginY ;
			document.documentElement.scrollTop = 
				document.documentElement.scrollTop + delta;
		}
		
		if (xAbs+objWidth > windowWidth - marginX) {
			xAbsNew = (windowWidth - objWidth - marginX);
			xDiff = xAbs - xAbsNew;
		}
		
		node.style.left = (relativeX - xDiff) + "px";
	};
	
	this.saveScrollPosition = function(){
		this._savedScrollPos = dojo.html.getScrollOffset();
	};
	
	this.restoreScrollPosition = function(){
		if (this._savedScrollPos !== undefined) {
			document.documentElement.scrollTop = this._savedScrollPos.y;
			document.documentElement.scrollLeft = this._savedScrollPos.x;
		}
	};
	

/**
 *  Utility
 */ 
 	this.validateSelection = function(str1){
		if (!this._validateDisabled) {
			var selectedDate = this.currentlySelectedDate();

			if (this.minDate !== null) {	
				if (selectedDate.valueOf() < this.minDate.valueOf()) { 
					alert(str1 + " not valid.\n" + this.beforeValidDateMsg);
					this._validateDisabled=true;
					this.updateDatePicker(this.minDate);
					this.updateTimePicker(this.minDate);
					this._validateDisabled=false;
				}
			}
			
			var maxDate = (this.maxDate === null) ? new Date() : this.maxDate;
			if (selectedDate.valueOf() > maxDate.valueOf()) { 
				alert(str1 + " is not valid.\n" + this.afterValidDateMsg);
				this._validateDisabled=true;
				this.updateDatePicker(maxDate);
				this.updateTimePicker(maxDate);
				this._validateDisabled=false;
			}
		}
	};
	
	this.setMaxDate = function(timestampMsec){
		this.maxDate = new Date(timestampMsec);
	};
	
	this.setMinDate = function(timestampMsec){
		this.minDate = new Date(timestampMsec);
	};
	
	this.getStoredDateTime = function(){
		return (this.storedDateTime.valueOf());
	};
	
 	this.currentlySelectedDate = function(){
		var selectedJsDate;
		
		var selectedRFCDate = this.datePicker.storedDate;
		jsDate = this.datePicker.fromRfcDate(selectedRFCDate);
		
		selectedRFCDate = this.timePicker.storedTime;
		jsTime = this.timePicker.fromRfcDateTime(selectedRFCDate);

		selectedJsDate = new Date(jsDate.valueOf());
		selectedJsDate.setHours(jsTime.getHours());
		selectedJsDate.setMinutes(jsTime.getMinutes());
		
		return (selectedJsDate);
	};
	
	this.updateStoredDateTime = function(jsDate, updateListeners, roundDir){
		if (!jsDate) {
			this.storedDateTime = this.currentlySelectedDate();
		}
		else {
			this.storedDateTime = jsDate;
		}
		
		if (roundDir !== undefined) {
			this.roundTime(this.storedDateTime, roundDir);
		}
		
		if (this.debug) {
			alert("New storedDateTime: " + this.storedDateTime.toString() +"("+this.storedDateTime.valueOf()+")");
		}
		
		this.updateDateField(this.storedDateTime);
		this.updateTimeField(this.storedDateTime);
		this.updateTimePicker(this.storedDateTime);
		this.updateDatePicker(this.storedDateTime);
		
		if (!updateListeners) {
			this.updateListeners(this);
		}
	};
	
	this.updateListeners = function(dateSelectObj) {
		// place holder to propigate updateStoredDateTime event
	};
	
	this.roundTime = function(jsDateObj, direction){
		/* round time up or down to the nearest 5 minutes */
		
		if (jsDateObj === null) { return; }
		
		var minutes = jsDateObj.getMinutes();
		jsDateObj.setMilliseconds(0);
		jsDateObj.setSeconds(0);
		
		if (direction == "up") {
			minToNextFiveMinInterval = (5 - (minutes % 5));
			jsDateObj.setMinutes(minutes+minToNextFiveMinInterval);
		}
		else if (direction == "down") {
			minToNextFiveMinInterval = (minutes % 5);
			jsDateObj.setMinutes(minutes-minToNextFiveMinInterval);
		}
		else {
			alert("ERROR: DateSelect: roundTime: invalid direction");
		}	
	};
	
};

// complete the inheritance process
dojo.inherits(awl.widget.DateSelect, dojo.widget.HtmlWidget);
// make it a tag
dojo.widget.tags.addParseTreeHandler("dojo:dateSelect");


// tell the package system what classes get defined here
dojo.provide("awl.widget.ScaleSelect");

// load dependencies
dojo.require("dojo.event.*");
dojo.require("dojo.fx.*");
dojo.setModulePrefix('awl', '../awl');
dojo.require("awl.*");

/**
 	A scale selection UI component 
 */

// define the widget class
awl.widget.ScaleSelect = function(){
    dojo.widget.HtmlWidget.call(this);

    this.templatePath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlScaleSelect.html");
    this.templateCssPath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlScaleSelect.css");

    this.widgetType = "ScaleSelect";
	
	this.Strings = {
		MIN: "min",
		MAX: "max",
		ERR_NAN: "Must be a valid number.",
		ERR_OVERMAX: "Must be less than Max value.",
		ERR_UNDERMIN: "Must be greater than Min value."
	};
		
	// parameters
	this.defaultMin = "";
	this.defaultMax = "";
	this.autoScaleFlag = true;  //autoscale by default
	
	// our DOM nodes:
	this._mode = null;
	this._min = null;
	this._max = null;
	this._minMaxDiv = null;
	this._container = null;
	
	//private vars
	this._selectedMode = null;
	this._visible = true;
		
	this.fillInTemplate = function(){
		this._registerExternalEvents();	
	};
	
	this.postCreate = function(){
		this._min.value = this.defaultMin;
		this._max.value = this.defaultMax;
		this.setMode(this.autoScaleFlag);
		this._setResetValues();
	};	
	
	this._setResetValues = function(){
		this._maxChanged = this._minChanged = false;
		this._minResetValue = this._min.value;
		this._maxResetValue = this._max.value;
	};
	
/** 
 * Mode checkbox methods 
 */
	this.setMode = function(checked){
		this._mode.checked = checked;
		this._toggleMinMaxDiv();
	};
	
	this.isAutoScale = function(){
		return(this._mode.checked);
	};
	
	this._toggleMinMaxDiv = function(){
		if (this._mode.checked) {
			dojo.fx.fadeHide(this._minMaxDiv, 100, this._notifyOfHide);		
		}
		else {
			this._notifyOfShow();
			dojo.fx.fadeShow(this._minMaxDiv, 100);
		}
		this._notifyModeListeners(this._mode.checked);
	};
	
		
/**
 * Minimum Field Methods
 */
	this.getMin = function(){
		return(this._min.value);
	};

	this.setMin = function(value){
		this._min.value = value;
		this._minResetValue = this._min.value;
	};
	
	this._resetMin = function(){
		this._minChanged = false;
		this._min.value = this._minResetValue;
	};
	
	/**
	 * Validates minimum value specific properities.
	 *
	 * @param value - string to be validated.
	 *
	 * @returns int
	 */
	this._validateMin = function(){
		if (isNaN(this._min.value)) {
			return(1);	
		}
		if (this.getMax() === "") {
			return (0);
		}
		if (eval(this._min.value) >= (this.getMax())) {
			return(2);
		}
		return (0);
	};
	

/**
 * Maximum Field Methods
 */
	this.getMax = function(){
		return(this._max.value);
	};

	this.setMax = function(value){
		this._max.value = value;
		this._maxResetValue = this._max.value;
	};
		
	this._resetMax = function(){
		this._maxChanged = false;
		this._max.value = this._maxResetValue;
	};
		
	/**
	 * Validates minimum value specific properities.
	 *
	 * @param value - string to be validated.
	 *
	 * @returns int
	 */
	this._validateMax = function(){
		if (isNaN(this._max.value)) {
			return(1);	
		}
		if (this.getMin() === "") {
			return (0);
		}
		if (eval(this._max.value) <= (this.getMin())) {
			return(3);
		}
		return (0);
	};
	
	
/**
 * Internal Event Handlers
 */
	this._onChangeMin = function(evt){
		this._min.value = evt.target.value;
		this._minChanged = true;
	};

	this._onChangeMax = function(evt){
		this._max.value = evt.target.value;
		this._maxChanged = true;		
	};
	
	this._onChangeMode = function(){
		this._toggleMinMaxDiv();
	};	
	this._advanceFocus = function(evt) {
		awl.common.focusNodeOnReturn(this._max, evt);
	};
	this._submitForm = function(evt) {
		if (awl.common.isKey(13, evt)) {
			// this._requestCloseDrawer(); now navDataBar closes on all reloads
			this._requestData(); 	
		}
	};
	this._selectAll = function(evt) {
		evt.target.select();
	};
	
	
/**
 *  External event notification method.
 */
	this._registerExternalEvents = function(){
		dojo.event.topic.registerPublisher("/onMinMaxHide", 
										   this, 
										   this._notifyOfHide);
										   
		dojo.event.topic.registerPublisher("/onMinMaxShow", 
										   this, 
										   this._notifyOfShow);
										   
		dojo.event.topic.registerPublisher("/onScaleModeChange", 
										   this, 
										   this._notifyModeListeners);
										   
		dojo.event.topic.registerPublisher("/requestNavDrawerOpen", 
										   this, 
										   this._requestOpenDrawer);										   

		dojo.event.topic.subscribe("/requestScaleFocus", 
										   this, 
										   this._onRequestScaleFocus);
										   
		dojo.event.topic.registerPublisher("/requestNavDrawerClose", 
										   this, 
										   this._requestCloseDrawer);

		/* sends notfiy to DataNavBar for data request */
		dojo.event.topic.registerPublisher("/loadRequest", 
										   this, 
										   this._requestData);										   										   										   	
	 };
	 this._notifyOfHide = function(evt){
	 	dojo.debug(this.widgetType + ": Hide notify sent. (/onMinMaxHide)");
	 };
	 this._notifyOfShow = function(evt){
	 	dojo.debug(this.widgetType + ": Show notify sent. (/onMinMaxShow)");
	 };
	 this._notifyModeListeners = function(isAuto) {
	 	dojo.debug(this.widgetType + ": Notifying node listeners. (/onScaleModeChange)");
	 };
	 this._onRequestScaleFocus = function() {
		dojo.debug(this.widgetType + ": Recived scale focus request. (/requestScaleFocus)");
		if (!this.visible) {
			this._requestOpenDrawer(); 
		}
		if (this.isAutoScale()) {
			this._mode.focus();
		}
		else {
			this._min.focus();
			this._min.select();
		}
	 };
	 this._requestOpenDrawer = function() {
	 	dojo.debug(this.widgetType,
	 				": Request NavBar drawer open. (/onScaleModeChange)");
	 };
	 this._requestCloseDrawer = function() {
	 	dojo.debug(this.widgetType,
	 				": Request NavBar drawer close. (/onScaleModeChange)");
	 };
	 this._requestData = function(startTs, endTs, pageIndex){
		// placeholder for external event handlers
		dojo.debug("ExternalEvent:", "Sent /loadRequest ", startTs, " ", endTs, " ", pageIndex);
	 };

/**
 *	Validate the min and max values.
 *
 *	This will pop up a error message alert-box if 
 *  validation fails.
 */	
	this.validate = function() {
		var err;
		if (this._minChanged) {
		 	err = this._validateMin();
			if (err !== 0) {
				this._displayError("Min Value", err);
				this._resetMin();
				return (false);
			}
		}
		if (this._maxChanged) {
		 	err = this._validateMax();
			if (err !== 0) {
				this._displayError("Max Value", err);
				this._resetMax();
				return (false);
			}
		}
		this._setResetValues();
		return (true);
	 };
	
/**
 * Displays an error in a pop-up alert.
 *
 * @param label - prefix displayed before error message
 * @param errCode - code that represents error
 */
	 this._displayError = function(label, errCode){
		 var errMsg = "unknown error";
		 switch (errCode) {
			 case 1: 
			 	errMsg = this.Strings.ERR_NAN;
				break;
 			 case 2: 
			 	errMsg = this.Strings.ERR_OVERMAX;
				break;
			 case 3: 
			 	errMsg = this.Strings.ERR_UNDERMIN;
				break;
		 }
	 	 alert(label+": "+errMsg);
	 };	
};

// complete the inheritance process
dojo.inherits(awl.widget.ScaleSelect, dojo.widget.HtmlWidget);
// make it a tag
dojo.widget.tags.addParseTreeHandler("dojo:scaleselect");


// tell the package system what classes get defined here
dojo.provide("awl.widget.DataNavBar");

// load dependencies
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.collections.*");
dojo.require("dojo.fx.*");
dojo.require("dojo.validate");
dojo.require("dojo.style");
dojo.require("dojo.widget.html.DatePicker");

dojo.setModulePrefix('awl.widget', '../awl/widget');
dojo.widget.manager.registerWidgetPackage('awl.widget');
dojo.require("awl.widget.DateSelect");
dojo.require("awl.widget.ScaleSelect");
dojo.require("awl.*");


var DurationCount = {
	HOUR : 24,
    DAY : 31,
    WEEK : 12,
	MONTH : 3
};

var DurationUnits = [
	"Hour",
    "Day",
    "Week",
	"Month",
	"Custom"
];

var AwlDataNavBarStrings = {
	DRAWER_CONTROL_TOOLTIP: "Click here to set custom date range.",
	REDRAW_BUTTON: "Reload",
	ERR_DATE1_BEFORE_VAILD: "\tBeyond first available data point.\n\tSetting to first available date/time.",
	ERR_DATE1_AFTER_VAILD: "Exceeds 'Last Date'.\nSetting to 1 hour before 'Last Date'.",
	ERR_DATE2_BEFORE_VAILD: "This date cannot preceed 'First Date'.",
	ERR_DATE2_AFTER_VAILD: "\n\tThis date is in the future.\n\tSetting to the current date/time."
};


// define the widget class
awl.widget.DataNavBar = function(){
    // inheritance
    // see: http://www.cs.rit.edu/~atk/JavaScript/manuals/jsobj/
    dojo.widget.HtmlWidget.call(this);

    this.templatePath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlDataNavBar.html");
    this.templateCssPath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlDataNavBar.css");
	this.isContainer = true;

    this.widgetType = "DataNavBar";
		
	// public vars
	this.sensorId = -1;
	this.podId = -1;
	this.gatewayId = -1;
	this.drawerOpen = false; 
	this.dateRange = "24";  	// hours
	this.firstDateAvail=""; 	// UTC integer millisecond count
	this.lastDateAvail=""; 	    // UTC integer millisecond count
	this.chartTabLabel="";
	this.xmlTestFile = "";
	this.debug = false;
	this.updateChart = true;
	this.min="";
	this.max="";
	this.autoScale=true;
	this.level = 2; 		// service level
	this.yAxisUnits = "";
	
	// private vars
	this._firstDate = null;
	this._lastDate = null;
	this._tablePagePointCount = 0;
	this._lastDateValue="";    // UTC integer millisecond
	this._graphData = null; // holds the last graph data

	// our DOM nodes:
	this.drawerControl = null;
	this.drawerControlImg = null;
	this.drawerDiv = null;
	
	this.duration = null;
	this.durationUnits = null;
	this.durationCustom = null;
	
	this._redrawButton = null;
	
	this._prevButton = null;
	this._latestButton = null;
	this._nextButton = null;
	this._statusMsg = null;
	
	this.dataNavObject = this; //pointer to self for load handler
		
	this.fillInTemplate = function(){	
		if(!this._validatePublicVars()) {return false;}
		this.createYaxisScale();
		this._initDurationCookies();
		this._readDurationCookies();
		this.createDatePickers();
		this._initDurationControl();  	
		this._initDrawerControl(); 
		this._redrawButton.value = AwlDataNavBarStrings.REDRAW_BUTTON;
		if (!this.drawerOpen) { this._closeDrawer(); }
		if (this.sensorId == -1) { alert("ERROR: awl.widget.datanavbar: no sensorId defined"); }
		if (this.podId == -1) { alert("ERROR: awl.widget.datanavbar: no podId defined");	}	
		if (this.gatewayId == -1) { alert("ERROR: awl.widget.datanavbar: no gatewayId defined");	}	
		if (this.chartTabLabel !== "") { this.attachTabEvent(); }
	};
	
	this.postCreate = function(){
		this._registerExternalEvents();
		this._setYaxisScaling();
		//var dateStr = new Date(eval(this.firstDateAvail));
		if (this.debug) dojo.debug("firstDateAvail: " + Date(eval(this.firstDateAvail)).toString());
 		dojo.lang.setTimeout(this, this.getLatest, 500);
	};
		
	/**
	 *  Utility functions
	 */
	this._validatePublicVars = function() {
		//TODO: validate other params here
		if(!dojo.validate.isRealNumber(this.dateRange)) {
			alert("ERROR: datanavbar: dateRange parameter must be a valid number");
			return (false);
		}
		return (true);
	};
	
	
	/**
	 *  Nav controls
	 */
	this.redrawGraph = function(){
		//this._writeDurationCookies();
		this.loadData(this._dateSelectFirst.getStoredDateTime(), 
					  this._dateSelectLast.getStoredDateTime());
		return false;
	}
	
	this.getPrev = function(){
		this._lastDateValue = this._dateSelectFirst.getStoredDateTime();
		this._initDates();
		this.redrawGraph();
	}
	this.getNext = function(){
		this._lastDateValue = this._dateSelectLast.getStoredDateTime() +
							   this.dateRange*3600000;
		this._initDates();
		this.redrawGraph();
	}
	this.getLatest = function(){
		this._lastDateValue = this.lastDateAvail;
		this._initDates();
		this.redrawGraph();
	}
	
	/**
	 *  Y-Axis scaling
	 */
	this._yaxisScaleNode = null;
	this._vertScaleDiv = null;
	this._horizScaleDiv = null;
	this.createYaxisScale = function(){
		this._scaling = 
			dojo.widget.createWidget("scaleSelect", {}, this._yaxisScaleNode,"last");
	}
	
	this._setYaxisScaling = function() {
		this._scaling.setMin(this.min);
		this._scaling.setMax(this.max);
		this._scaling.setMode(this.autoScale);			
	};
	
	this.showScaleWidget = function() {
		this._vertScaleDiv.style.display = "block";
	};
	this.hideScaleWidget = function() {
		this._vertScaleDiv.style.display = "none";
		
		// resize custom date fieldset
		this._fs2.style.height = "22px";	//TODO: calculate these magic numbers
		this._fs2.style.width = "645px";
		this._fs2ie.style.height = "22px";
		this._fs2.style.width = "645px";
		this.drawerDiv.style.height = this.DrawerVal.smallHeight + "px";
		this._drawerHeight = this.DrawerVal.smallHeight;
		
		// shift custom date fieldset elements
		this._horizScaleDiv.style.left = "0px";
		this._dateSelect1Node.style.left = "0px";
		this._dateSelect2Node.style.left = "417px";
	};

	/**
	 *  Datepicker
	 */
	this._dateSelect1Node = null;
	this._dateSelect2Node = null;
	this._dateSelectFirst = null;
	this._dateSelectLast = null;
	this._disableOnSetEvent = false;
	
	this.createDatePickers = function(){
		this._dateSelectFirst = 
			dojo.widget.createWidget("dateselect",
						 {labelString:"First date:", 
						  minDateValue:this.firstDateAvail,
						  beforeValidDateMsg:AwlDataNavBarStrings.ERR_DATE1_BEFORE_VAILD,
						  afterValidDateMsg:AwlDataNavBarStrings.ERR_DATE1_AFTER_VAILD}, 
						  this._dateSelect1Node,"last");
			
		dojo.event.connect(this._dateSelectFirst, 
						   "updateListeners", 
						   this, 
						   "onSetDate");
		
		this._dateSelectLast = 
			dojo.widget.createWidget("dateselect",
						 {labelString:"Last date:",
						  beforeValidDateMsg:AwlDataNavBarStrings.ERR_DATE2_BEFORE_VAILD,
						  afterValidDateMsg:AwlDataNavBarStrings.ERR_DATE2_AFTER_VAILD}, 
						 this._dateSelect2Node, "last");
			
		dojo.event.connect(this._dateSelectLast, 
						   "updateListeners", 
						   this, 
						   "onSetDate");
		
		this._initDates(); 
	}
	
	this._initDates = function(){
		var rangeInHours = eval(this.dateRange);
		var lastDate = 
			(this._lastDateValue == "") 
					? new Date() 
					: new Date(eval(this._lastDateValue));
		
		var firstDate = 
			new Date(lastDate.valueOf() - this.dateRange*3600000); //60*60*1000
		
		this._disableOnSetEvent = true;
		this._dateSelectLast.updateStoredDateTime(lastDate, false);
		this.updateDateSelectLimits(this._dateSelectLast);
		this._dateSelectFirst.updateStoredDateTime(firstDate, false);
		this.updateDateSelectLimits(this._dateSelectFirst);
		this._disableOnSetEvent = false;
	}

	this.updateDateSelectLimits = function(dateSelectObj){
		var minRangeMsec = 3600000; // 1 hour
		//alert("Selected Time: " + dateSelectObj.getStoredDateTime());
		if (dateSelectObj === this._dateSelectLast){
			var tMaxMsec = this._dateSelectLast.getStoredDateTime();
			this._dateSelectFirst.setMaxDate(tMaxMsec-minRangeMsec)
		}
		if (dateSelectObj === this._dateSelectFirst){
			var tMaxMsec = this._dateSelectFirst.getStoredDateTime();
			this._dateSelectLast.setMinDate(tMaxMsec+minRangeMsec)
		}
	}

	this.onSetDate = function(dateSelectObj){
		if (!this._disableOnSetEvent) {
			this.updateDateSelectLimits(dateSelectObj);
			this.setDurationHours();
		}
	}

/**
 *  Duration control
 */
	this._currentDuration = 1;
	this._currentDurationUnits = "Day";

	this.getDurationHours = function(){
		var multiplier = 
			this.calcDurationMultiplier(this._currentDurationUnits);
		return (this._currentDuration * multiplier);
	};
	
	this.setDurationHours = function(hours) {
		if (hours == undefined) {
			hours = 
				(this._dateSelectLast.getStoredDateTime() -
				 this._dateSelectFirst.getStoredDateTime()) /
				3600000;
			//alert("Calculated Hours: " + hours);
		}
		
		this.dateRange = hours;

		if ((hours % 672 == 0) && (hours/672 <= DurationCount.MONTH)) {
			this._currentDurationUnits = "Month";
			this._currentDuration = hours/672;
		}
		else if ((hours % 168 == 0) && (hours/168 <= DurationCount.WEEK)) {
			this._currentDurationUnits = "Week";
			this._currentDuration = hours/168;
		}
		else if ((hours % 24 == 0) && (hours/24 <= DurationCount.DAY)) {
			this._currentDurationUnits = "Day";
			this._currentDuration = hours/24;
		}
		else if (hours <= DurationCount.HOUR) {
			this._currentDurationUnits = "Hour";
			this._currentDuration = hours;
		}
		else {
			this._currentDurationUnits = "Custom";
			this._currentDuration = hours;
			//alert ("custom duration: "+hours);
		}

		this.setDurationUnits();
		this.toggleDurationControl();
		this.fillDurationList();
		this.setDuration();
		this.setCustomDuration();
	}

	this._initDurationControl = function(){		
		this._durationHash = new dojo.collections.Dictionary();
		this._durationHash.add("Hour", DurationCount.HOUR);
		this._durationHash.add("Day", DurationCount.DAY);
		this._durationHash.add("Week", DurationCount.WEEK);
		this._durationHash.add("Month", DurationCount.MONTH);
		this._initDurationUnitsList();
		this.setDurationUnits();
		this.toggleDurationControl();
		this.fillDurationList();
		this.setDuration();
		this.setCustomDuration();	
	}
	
	this._initDurationCookies = function(){
		this.strCookieDuration = this.gatewayId + "_" + this.podId + "_" + this.sensorId + "_d";
		this.strCookieDurationUnits = this.gatewayId + "_" + this.podId + "_" + this.sensorId + "_dU";
	};
	
	this._readDurationCookies = function(){
		this._currentDuration = 
			(awl.common.getCookie(this.strCookieDuration)) 
					? awl.common.getCookie(this.strCookieDuration) 
					: this._currentDuration;
		this._currentDurationUnits =  
			(awl.common.getCookie(this.strCookieDurationUnits)) 
					? awl.common.getCookie(this.strCookieDurationUnits) 
					: this._currentDurationUnits;
					
		this.dateRange = this.getDurationHours();
		dojo.debug("Read cookies: duration="+this._currentDuration+" units="+this._currentDurationUnits+" RangeHrs="+this.dateRange);
	};
	
	this._writeDurationCookies = function(){	
		awl.common.setCookie(this.strCookieDuration, this._currentDuration); 
		awl.common.setCookie(this.strCookieDurationUnits, this._currentDurationUnits);
		dojo.debug("Wrote cookies: duration="+this._currentDuration+" units="+this._currentDurationUnits);
	};
	
	this.calcDurationMultiplier = function(unitsStr){
		var multiplier = 1; //hours or custom
		
		if(unitsStr == "Day") {
			multiplier = 24; //days
		} 
		else if (unitsStr == "Week") {
			multiplier = 168; // weeks
		}
		else if (unitsStr == "Month") {
			multiplier = 720; //months  TODO:detect days in months
		}
		
		return (multiplier);
	};
	
	this.toggleDurationControl = function(){
		if (this._currentDurationUnits != "Custom") {
			 this.durationCustom.style.display = "none";
			 this.duration.style.display = "inline";
		 }
		 else {
			this.duration.style.display = "none";
			this.durationCustom.style.display = "inline"; 
		 }
	}
	/* 
	 * duration 
	 */
	this.changedDuration = function(){
		this._currentDuration =  
			this.duration.options[this.duration.selectedIndex].value;
		this.modifyDurationUnits();
		this.dateRange = this.getDurationHours();
		this._initDates();
	}
	
	this.setDuration = function(){
		 /* set control to value of _currentDuration */
		 var len = this.duration.length;
		 for (i=0; i<len; i++) {
			 var durStr = this._currentDuration + "";
			 if (durStr == this.duration.options[i].text){
				 this.duration.selectedIndex = i;
				 break;
			 }
		 }
		 this.modifyDurationUnits();
	 }
	 
	 this.modifyDuration = function(){
		 var selected = this.duration.selectedIndex;
		 this.fillDurationList();
		 if (selected >= this.duration.options.length){
			 selected = this.duration.options.length-1;
		 }
		 if (selected < 0){
			 selected = 0;
		 }
		 this.duration.selectedIndex = selected;
		 this._currentDuration =  
			this.duration.options[this.duration.selectedIndex].value;
		 this.dateRange = this.getDurationHours();
	 }
	 
	 this.limitDuration = function(count, unitsStr, firstAvailTs, lastAvailTs){
		 var hrsPerCount = this.calcDurationMultiplier(unitsStr);
		 var lastAvailMsec = eval(lastAvailTs);
		 if (lastAvailMsec<=0) { lastAvailMsec = new Date(); } 
		 var firstAvailMsec = eval(firstAvailTs)
		 var diffDateMsec = lastAvailMsec - firstAvailMsec;
		 var diffHrs = diffDateMsec / 3600000;
		 if (diffHrs < 24) { diffHrs = 24; } //minimum duration limit
		 var countToFirstDate = Math.ceil(diffHrs/hrsPerCount);
		 
		 if (countToFirstDate < count) {
			 return (countToFirstDate);
		 }
		 else {
			 return (count);
		 }
	 }
	 	 
	 this.fillDurationList = function(){
		var unitsStr = this._currentDurationUnits;
		this.duration.options.length = 0;
		var count = this._durationHash.item(this._currentDurationUnits);
		
		if (count != undefined){	
			var limitedCount = this.limitDuration(count, unitsStr, this.firstDateAvail, this.lastDateAvail);
			for(i=0; i<limitedCount; i++) {
				this.duration.options[i] = new Option(i+1, i+1);
			}
		}
	 }
	
	
	/* 
	 * durationCustom 
	 */
	/*this.changedCustomDuration = function(){
		this.dateRange = this.getDurationHours();
		this._currentDuration = this.dateRange;
		this._redrawButton.focus();
		this._redrawButton.select();
		this._initDates();
	}
	
	this.onCustomDurationFocus = function(evt){
		this.durationCustom.select();
	}
	*/
	this.setCustomDuration = function(){
		/* set control to value of _currentDuration */
		var displayValue = Math.floor(this.dateRange);
		var divisor = this.calcDurationMultiplier(this._currentDurationUnits);
		this._currentDuration = eval(displayValue)/divisor+"";
		var units = (displayValue != 1) ? "Hrs" : "Hr"
		this.durationCustom.value = displayValue + units;
	}
	 
	 /* 
	  * durationUnits 
	  */
	this._addPlural = function(str){
		if (str.charAt(str.length-1) != "s") {
		str = str + "s";
		}
		return(str);
	}
	 
	this._removePlural = function(str){
		if (str.charAt(str.length-1) == "s") {
		 str = str.substr(0, str.length-1);
		}
		return (str);
	}
	
	this.changedDurationUnits = function(){
		 this._currentDurationUnits =  
		 		this.durationUnits.options[this.durationUnits.selectedIndex].text;
		 this._currentDurationUnits = this._removePlural(this._currentDurationUnits);
		 this.toggleDurationControl();
		 if (this._currentDurationUnits != "Custom") {
			 this.hideToolTip();
			 this.modifyDuration();
		 }
		 else {
			this.showToolTip();
			this.setCustomDuration();
			this.setDuration();
		 }
		this.dateRange = this.getDurationHours();
		this._initDates();
	 }

	 this.setDurationUnits = function(){
		 /* set control to value of _currentDurationUnits */
		 var setStr = this._currentDurationUnits;
		 
		 var len = this.durationUnits.length;
		 for (i=0; i<len; i++) {
			 var compareStr = this._removePlural(this.durationUnits.options[i].text);
			 if (compareStr == setStr){
				 this.durationUnits.selectedIndex = i;
				 break;
			 }
		 }
		 //this.modifyDurationUnits();
	 }

	 this.modifyDurationUnits = function(){
		 var len = this.durationUnits.length;
		 for (i=0; i<len; i++) {
			 var str = this.durationUnits.options[i].text;
			 if (str != "Custom") {
				 if (this._currentDuration == 1){
					 this.durationUnits.options[i].text= this._removePlural(str);
				 }
				 else{
					 this.durationUnits.options[i].text = this._addPlural(str);
				 }
			 }
		 }
		// this.toggleDurationControl();
	 };
	 
	 this._initDurationUnitsList = function(){
		 var len = this.durationUnits.length;
		 for (i=len-1; i>=0; i--) {
			 var str = this.durationUnits.options[i].text;
 			 str = this._removePlural(str);
			 var hasDurationList = this.limitDuration(1, str, this.firstDateAvail, this.lastDateAvail);
			 if (!hasDurationList) {
				this.durationUnits.remove(i);
			 }
		 }
	 }


/**
 * Drawer control
 *
 */
 	this.DrawerVal = {
 		smallHeight: 45,
 		bigHeight: 83
 	};
 	
	this._fs1=null;
	this._fs2=null;
	this._fsVertIE=null;
	this._fs2ie=null;
	
	this._drawerHeight = this.DrawerVal.smallHeight;  //TODO: detect this from DOM
	this._initDrawerControl = function(){
		this.drawerControl.style.display = "block";
		this.drawerControlImg.src = dojo.uri.dojoUri("../awl/widget/templates/images/less.gif");
		this.drawerControlImg.alt = "Close Advanced Drawer"
	}
	
	this._closeDrawer = function(){
		//this.drawerDiv.style.display = "none";
		dojo.fx.html.wipeOut(this.drawerDiv,
							 200,
							 dojo.lang.hitch(this, this.scrollRestoreForDrawer));
		dojo.fx.fadeHide(this._dateSelect1Node, 100);
		dojo.fx.fadeHide(this._dateSelect2Node, 100);
		

		this.drawerControlImg.src = dojo.uri.dojoUri("../awl/widget/templates/images/more.gif");
		this.drawerControlImg.alt = "Open Advanced Drawer"
		this.drawerOpen = false;
		this.duration.disabled = false;
		this.durationUnits.disabled = false;
		
		this._scaling.visible = false;
	}
	
	this._openDrawer = function() {
		this.hideToolTip();
		//this.drawerDiv.style.display = "block";
		this._drawerScrollPos = this.saveScrollPosition();
		this._dateSelectFirst.hideSelector();
		this._dateSelectLast.hideSelector();
		dojo.fx.html.wipeInToHeight(this.drawerDiv,
									200,
									this._drawerHeight,
									dojo.lang.hitch(this, this.scrollForDrawer));
		this.drawerDiv.style.overflow = "visible";
		dojo.fx.fadeShow(this._dateSelect1Node, 600);
		dojo.fx.fadeShow(this._dateSelect2Node, 600);
		dojo.fx.fadeShow(this._scaling._container, 600);
		dojo.fx.fadeShow(this._fs1, 600);
		dojo.fx.fadeShow(this._fs2, 600);
		this.drawerControlImg.src = dojo.uri.dojoUri("../awl/widget/templates/images/less.gif");
		this.drawerControlImg.alt = "Close Advanced Drawer"
		this.drawerOpen = true;

		this.duration.disabled = true;
		this.durationUnits.disabled = true;
		
		this._scaling.visible = true;
	};
		
	this.toggleDrawer = function() {
		if (this.drawerOpen) {
			this._closeDrawer();
		}
		else {
			this._openDrawer();
		}
	}
		
	this._shrinkScaleDiv = function(){
		this._fs1.style.height = "22px";
		this._fs2.style.height = "22px";
		this._fsVertIE.style.height = "22px";
		this._yaxisScaleNode.style.height = "22px";
		this._fs2ie.style.height = "22px";
		this.drawerDiv.style.height = this.DrawerVal.smallHeight + "px";
		this._drawerHeight = this.DrawerVal.smallHeight;
		this.restoreScrollPosition(this._growScrollPos);
	};
	
	this._growScaleDiv = function(){
		this._fs1.style.height = "60px";
		this._fs2.style.height = "60px";
		this._fsVertIE.style.height = "60px";
		this._yaxisScaleNode.style.height = "55px";
		this._fs2ie.style.height = "60px";
		this.drawerDiv.style.height = this.DrawerVal.bigHeight + "px";
		this._drawerHeight = this.DrawerVal.bigHeight;
		
		if (this.drawerOpen) {
			this._growScrollPos = this.saveScrollPosition();
			var scrollMargin = dojo.style.getOuterHeight(this.drawerControl) + 10;
			this.scrollForDrawer();
		}
	};
	
	this._drawerScrollPos = null;
	this.scrollForDrawer = function(){
		var scrollMargin = dojo.style.getOuterHeight(this.drawerControl) + 10;
		this._scrollForNode(this.drawerDiv, scrollMargin);
	};
	this.scrollRestoreForDrawer = function(){
			this.restoreScrollPosition(this._drawerScrollPos);
	};
	
	
	/************************************************************************************************************
	(C) www.dhtmlgoodies.com, September 2005
	
	This is a script from www.dhtmlgoodies.com. You will find this and a lot of other scripts at our website.	
	
	Terms of use:
	You are free to use this script as long as the copyright message is kept intact. However, you may not
	redistribute, sell or repost it without our permission.
	
	Thank you!
	
	www.dhtmlgoodies.com
	Alf Magne Kalleland
	
	************************************************************************************************************/
	this.toolTip = null;
	this.toolTipContent = null;
	
	this.showToolTip = function(e){
		if(document.all)e = event;
		
		this.toolTipContent.innerHTML = AwlDataNavBarStrings.DRAWER_CONTROL_TOOLTIP;
		dojo.fx.fadeShow(this.toolTip, 
						 400);
		
		var node = this.drawerControlImg;
		var relativeX = dojo.style.getPixelValue(node, "left");
		var relativeY = dojo.style.getPixelValue(node, "top");
		var leftPos = relativeX - 20;
		//if(leftPos<0)leftPos = 0;
		this.toolTip.style.left = leftPos + 'px';
		this.toolTip.style.top = relativeY  + 8  + 'px';
		
		this._toolTipScroll = this.saveScrollPosition();
		this._scrollForNode(this.toolTip,30);
	}
	
	this.hideToolTip = function()
	{
		dojo.fx.fadeHide(this.toolTip, 
						 400);
		this.restoreScrollPosition(this._toolTipScroll);
	}
	
	this.saveScrollPosition = function(){
		return(dojo.html.getScrollOffset());
	}
	
	this.restoreScrollPosition = function(saveVar){
		if (saveVar != undefined) {
			document.documentElement.scrollTop = saveVar.y;
			document.documentElement.scrollLeft = saveVar.x;
		}
	}
	
	this._scrollForNode = function(node, margin){
			var yAbs = dojo.style.totalOffsetTop(node, false);
			var objHeight = dojo.style.getOuterHeight(node);
			objHeight = objHeight + margin;
			var windowHeight = dojo.html.getViewportHeight();
			var currentScroll = document.documentElement.scrollTop;
			if (yAbs+objHeight > (windowHeight + currentScroll)) {
				var delta = ((yAbs+objHeight)-(windowHeight+currentScroll));
				document.documentElement.scrollTop = currentScroll + delta;
				dojo.debug(this.widgetType+": Setting scroll top to " + document.documentElement.scrollTop);
			}
	};
	 
 /**
  * AJAX functions (to refactor)
  */
  	this.attachTabEvent = function(){  		
  		var listItems = document.getElementsByTagName("li");
		var tabNode = null;  		
	    for (i=0; i<listItems.length; i++) {
	   		for (j=0; j<listItems[i].childNodes.length; j++) {
	   			var node = listItems[i].childNodes[j];
	   		  	if ((node.nodeName == "SPAN") &&
	   		  		(node.innerHTML == this.chartTabLabel)) {
	   		    	tabNode = node;
	   		    	break;
	   		   	}
	   		}
	   		if (tabNode !== null) { break; }
	    }   
	    
	    if (tabNode !== null) {
			dojo.event.kwConnect({
						    srcObj:     tabNode, 
						    srcFunc:    "onclick", 
						    targetObj:  this, 
						    targetFunc: "onClickChartTab",
						    delay: 500
						});									
	 	}
  	};
  	
  	this.onClickChartTab = function(evt){
  		if (this.updateChart) {
  			this.hideFlashChart('GuiWidgetsChart');
	    	this.updateFlashChart('GuiWidgetsChart', this._graphData);
	   	}
  	};
  
  	// this function should be migrated to a chart widget	
	this.updateFlashChart=function(objFlash, strXML) {
	
		try {
			//This function updates the data of a FusionCharts present on the page
			//Get a reference to the movie 
			var FCObject = (document[objFlash]) ? document[objFlash] : document.all[objFlash];
			//Set the data
			//Set dataURL to null
			FCObject.SetVariable('_root.dataURL',"");
			//Set the flag
			FCObject.SetVariable('_root.isNewData',"1");
			//Set the actual data
			FCObject.SetVariable('_root.newData',strXML);
			//Go to the required frame
			FCObject.TGotoLabel('/', 'JavaScriptHandler');
			FCObject.height=335;
			FCObject.width=720; 
		}
		catch (e) {
		}	
	}
	
	// this function should be migrated to a chart widget	
	this.hideFlashChart=function(objFlash) {
		try {
			//This function updates the data of a FusionCharts present on the page
			//Get a reference to the movie 
			var FCObject = (document[objFlash]) ? document[objFlash] : document.all[objFlash];
			FCObject.height=0;
			FCObject.width=0; 
		}
		catch (e) {
		}	
	}
	
	this.updateDataNavbar=function(xDocStateData) {
	
		// Get state information
		if (xDocStateData !== null){
			var hasPrevData = false;
			var hasNextData = false;
			
			if (this.debug) { dojo.debug(dojo.dom.innerXML(xDocStateData)); }	
			var node = dojo.dom.firstElement(xDocStateData);
			if (dojo.dom.isNode(node)) {
				do {	
					if (node.nodeName == "hasPrev") {
						if (node.firstChild.data == "true") {
							hasPrevData=true;
						}
						else {
							hasPrevData=false;
						}
					}
					if (node.nodeName == "hasNext") {
						if (node.firstChild.data == "true") {
							hasNextData=true;
						}
						else {
							hasNextData=false;
						}
					}
					if (node.nodeName == "lastAvailTs") {
						this._lastDateValue = node.firstChild.data;
						this.lastDateAvail = node.firstChild.data;
					}
					
					if (node.nodeName == "autoScale") {
						if(node.firstChild.data == "true") {
							this._scaling.setMode(true); // autoscale
						}
						else {
							this._scaling.setMode(false); // manual
						}
					}
					if (node.nodeName == "manualMin") {
						this._scaling.setMin(eval(node.firstChild.data));
					}
					if (node.nodeName == "manualMax") {
						this._scaling.setMax(eval(node.firstChild.data));
					}
					if (node.nodeName == "yScaleUnits") {
						this.yAxisUnits = node.firstChild.data;
					}
					
					node = dojo.dom.nextElement(node);
				} while (dojo.dom.isNode(node));
			}

		this._nextButton.innerHTML=(hasNextData) ? "Next >>" : "&nbsp;";
		this._latestButton.innerHTML="Latest";
		this._prevButton.innerHTML=(hasPrevData) ? "<< Prev" : "&nbsp;";
		}
	}
	
	this.loadDataHandler=function(type, data, evt) {
	
		var navDataObj = this.dataNavObject;
		
		//if (navDataObj.debug) dojo.debug(data);
		//if (navDataObj.debug) 
		//alert("DataLoaded: " + dojo.dom.innerXML(data));	
		
		navDataObj.hideServiceLevelWarning();
	
		if (data.hasChildNodes()) {
			var myGraphData = null;
			var myStateData = null; 
			var myPageIndex = null;
			var myTablePage = null;
			var myLegendData = null;
			var mySensorStats = null;
			var myPageIndexNumber = "0";
			
			var xmlData=dojo.dom.firstElement(data);
			var node = dojo.dom.firstElement(xmlData);
			if (dojo.dom.isNode(node)) {
				// Break XML stream into chunks and send to listeners
				do {
					if (node.nodeName == "exception") {
						navDataObj.loadFailedMsg();
						return;
					}
					if (node.nodeName == "graph") {
						myGraphData=node;
						navDataObj._graphData = dojo.dom.innerXML(myGraphData);
						if (navDataObj._graphData === undefined) {
							navDataObj._graphData = myGraphData.xml;
						}
						if (navDataObj.debug) alert(navDataObj._graphData);
					}
					if (node.nodeName == "pageIndex") {
						myPageIndexNumber = node.firstChild.data;
					}
					if (node.nodeName == "pageStartData") {
						myPageIndex=node; // consumed as DOM node
					}
					if (node.nodeName == "completeData") {
						myTablePage=node; // consumed as DOM node
					}
					if (node.nodeName == "state_info") {
						myStateData=node;	// consumed as DOM node
					}
					if (node.nodeName == "legendData") {
						myLegendData=node;	// consumed as DOM node
					}
					if (node.nodeName == "sensor_stats") {
						mySensorStats=node;	// consumed as DOM node
					}
					
					node = dojo.dom.nextElement(node);
				} while (dojo.dom.isNode(node));
						
				// update listeners	
				if ((myPageIndex !== null) || (myTablePage !== null)) {
					navDataObj._updateTableListeners(myPageIndex, myTablePage, myPageIndexNumber);
				}
				if (myLegendData !== null) {
					navDataObj._notifyLegendListeners(myLegendData);
				}
				if (mySensorStats != null) {
					navDataObj._notifyStatsListeners(mySensorStats);
				}
			    if (navDataObj.updateChart) { // TODO: implement dojo.event.topic for this action handler
			    	if (myGraphData  !== null){
			    		 navDataObj.updateFlashChart('GuiWidgetsChart', navDataObj._graphData);
			    	}
			   	}
 			    navDataObj.updateDataNavbar(myStateData);
			   	
				// clear user notification
				navDataObj._statusMsg.innerHTML="";
			}
	    }
	    
	    if (navDataObj.level < 2) {
			navDataObj.hideScaleWidget();
		}
	}
	
	this.loadData=function(firstDate, lastDate, pageIndex) {
		var pageOnlyFlag = false;
		var indexStr;
		
		// check parameters
		if (!this.sensorId || this.sensorId<0) { 
			alert("ERROR: loadData: invalid sensor id");
		}
		
		if (!firstDate || !lastDate) {
			firstDate=""; lastDate="";
		}
			
		if ((pageIndex) && (pageIndex !== null)) {
			pageOnlyFlag = true;
			indexStr = pageIndex + "";
		}
		else {
			indexStr = "-1";
		}
		
		if (!this._scaling.isAutoScale()){
			var pass = this._scaling.validate();
			if(!pass) { return;	}
		}
		
		// Close advanced drawer
		if (this.drawerOpen) { this._closeDrawer(); }
		
		this.showServiceLevelWarning();
		
		// Notify user that we're loading data
		this._statusMsg.innerHTML="Loading Data...";
		if (!pageOnlyFlag) { this._notifyOfLoading(); }
	
		// using dojo.io.bind package
		var bindArgs = {
		    url: (this.xmlTestFile == "") 
						? "GuiWidgetsChartService.jsp" 
						: this.xmlTestFile,
		    mimetype:   "text/xml",
		    preventCache: true,
		    content: {
		    	"measurementBeanId": this.sensorId,
		    	"podId": this.podId,
		    	"startDate": firstDate,
				"endDate": lastDate,
				"pointsPerPage": this._tablePagePointCount,
				"tablePageIndex": indexStr,
				"chartMin": this._scaling.getMin(),
				"chartMax": this._scaling.getMax(),
				"autoScaleFlag": this._scaling.isAutoScale(),
				"yScaleUnit" : this.yAxisUnits,
				"firstAvailTs": this.firstDateAvail 
		    },
		    error: this.loadFailedMsg,
		    load: this.loadDataHandler,
		    dataNavObject: this
		};
	
		// dispatch the request
	    dojo.io.bind(bindArgs);
	}
	
	this.loadFailedMsg = function(type, errObj){
		this.dataNavObject._statusMsg.innerHTML="Load Failed.";
		this.dataNavObject._statusMsg.style.textDecoration="none";
    }
	
/**
 * External events
 */
	this._registerExternalEvents = function(){
		dojo.event.topic.registerPublisher("/preLoadRequest", 
						   this, 
						   this._sendPreLoadRequest);
		
		dojo.event.topic.subscribe("/preLoadResponse", 
										   this, 
										   this._handlePreLoadResponse);
		
		dojo.event.topic.registerPublisher("/onDataLoad", 
										   this, 
										   this._updateTableListeners);
										   
		dojo.event.topic.registerPublisher("/onLegendData", 
										   this, 
										   this._notifyLegendListeners);										   		
		
		dojo.event.topic.registerPublisher("/onStatsData", 
										   this, 
										   this._notifyStatsListeners);										   		
		
		dojo.event.topic.subscribe("/loadRequest", 
										   this, 
										   this._onLoadResponse);
										   
		dojo.event.topic.registerPublisher("/onLoading", 
										   this, 
										   this._notifyOfLoading);
										   
		dojo.event.topic.subscribe("/onMinMaxHide", 
										   this, 
										   this._shrinkScaleDiv);
										   
		dojo.event.topic.subscribe("/onMinMaxShow", 
										   this, 
										   this._growScaleDiv);

		dojo.event.topic.subscribe("/requestNavDrawerOpen", 
										   this, 
										   this._onOpenDrawerRequest);
		
		dojo.event.topic.subscribe("/requestNavDrawerClose", 
										   this, 
										   this._onCloseDrawerRequest);									   										   
										   
		this._sendPreLoadRequest();
	};
	
	this._sendPreLoadRequest = function(){
		// placeholder for external event handlers
	};
	this._handlePreLoadResponse = function(xCount){
		this._tablePagePointCount = xCount;
		if (this.debug) { dojo.debug("xCount from DataTable: " + this._tablePagePointCount); }
	};
	this._notifyOfLoading = function(){
		// placeholder for external event handlers
	};
	this._updateTableListeners = function(xDocIndexData, xDocTablePageData, pageIndex){
		// placeholder for external event handlers
	};	
	this._onLoadResponse = function(startTs, endTs, pageIndex){
		if (startTs != null) {
			 this.loadData(startTs, 
						  endTs, 
						  pageIndex);
		}
		else {
			this.redrawGraph();
		}
	};
	this._notifyLegendListeners = function(xDocLegendData) {
		// placeholder for external event handlers
	};
	this._notifyStatsListeners = function(xDocStatsData) {
		// placeholder for external event handlers
	};
	this._onOpenDrawerRequest = function() {
		this._openDrawer();
	};
	this._onCloseDrawerRequest = function() {
		this._closeDrawer();
	};	
	this.showServiceLevelWarning = function() {
		var node = document.getElementById("detailPopup:msg4");
		if (node) {
			node.style.display = "block";
		}
	};
	this.hideServiceLevelWarning = function() {
		var node = document.getElementById("detailPopup:msg4");
		if (node) {
			node.style.display = "none";
		}
	};
	
	
	
}
// complete the inheritance process
dojo.inherits(awl.widget.DataNavBar, dojo.widget.HtmlWidget);
// make it a tag
dojo.widget.tags.addParseTreeHandler("dojo:datanavbar");



// tell the package system what classes get defined here
dojo.provide("awl.widget.DataTable");

// load dependencies
dojo.require("dojo.event.*");

dojo.setModulePrefix('awl', '../awl');
dojo.require("awl.*");

var Strings = {
	VALUE_HEADER: "Value",
	TIME_HEADER: "Time"
};

/**
 	Creates a table out of the following XML Data Schema:
	
	<?xml version='1.0' encoding='UTF-8'?>
	<xml-body>
	...
	<completeData>
		<valuesubtitle>Temp -C-</valuesubtitle>
		<pageIndex>0</pageIndex>
		<data>
			<set y='10.12345' ts='MM/dd/yyyy HH:mm:ss' />
			<set y='10.12345' ts='MM/dd/yyyy HH:mm:ss' />
			<set y='10.12345' ts='MM/dd/yyyy HH:mm:ss' />
			<set y='10.12345' ts='MM/dd/yyyy HH:mm:ss' />
		</data>
	</completeData>
	...
	</xml-body>
 
 */


// define the widget class
awl.widget.DataTable = function(){
    // inheritance
    // see: http://www.cs.rit.edu/~atk/JavaScript/manuals/jsobj/
    dojo.widget.HtmlWidget.call(this);

    this.templatePath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlDataTable.html");
    this.templateCssPath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlDataTable.css");

    this.widgetType = "DataTable";
		
	// parameters
	
	// public vars	
	this.xmlTestFile = "";
	this.pointsAvailable = 0;
	this.pointsPerPage = 10;
	
	// our DOM nodes:
	this._dataTableContainer = null;
	this._dataTable = null;
	this._valueHeader = null;
	this._timeHeader = null;
	this._tableBody = null;
	
	//private vars
	this.xmlDataNode = null;
		
	this.fillInTemplate = function(){	
	};
	
	this.postCreate = function(){
		this._registerExternalEvents();
		//dojo.debug(this.xmlData); 
		if (this.xmlTestFile !== "") {
			/* load test file */
			awl.common.loadXmlFromFile(this.xmlTestFile, this, this.loadhandler);
		}
	};

	// Draw table from xDoc document tree data
	this.updateTable = function(xDoc){
	    var tr, td, i, oneRecord;
	    
	    // get handle to tbody element
	    var tbody = this._tableBody;
	    if (tbody === "") {
	    	alert("ERROR: DataTable template does not contain a tbody element");
	    }
		
		if ((xDoc === undefined) || (xDoc === null)) { 
			this._fillEmptyTable(tbody);
			return false; 
		}
	   
	    this._clearTable();
	    
	    // data node tree
	    var data = xDoc.getElementsByTagName("data")[0];
   	    if ((data === undefined) || (data.childNodes.length <= 0)) { 
			this._fillEmptyTable(tbody);
			return false; 
		}
		
		//dojo.debug(dojo.dom.innerXML(data));

		// set header titles
		var headerData = xDoc.getElementsByTagName("valuesubtitle")[0];
		var subtitle = 
			((headerData === undefined) ||
			  (headerData.childNodes.length <= 0)) ? "" : headerData.firstChild.nodeValue;

		this._valueHeader.innerHTML = Strings.VALUE_HEADER;
			
		if (subtitle !== "") {
			this._valueHeader.innerHTML = this._valueHeader.innerHTML +
			" <br /><span class=\"awlValueHeaderSubtitle\">(" +
			subtitle + ")</span>";
		}
			
		this._timeHeader.innerHTML = Strings.TIME_HEADER;
		
	    // for td & tr class attributes
	    var rowclasses = ["awlDataTableValueCol","awlDataTableTimeeCol"];
	    var colclasses = ["awlDataTableEvenRow","awlDataTableOddRow"];
	    var rowCount=0;
	    for (i=0; i<data.childNodes.length; i++) {
	        // use only 1st level element nodes to skip 1st level text nodes in NN
	        if (data.childNodes[i].nodeType == 1) {
	            // one final match record
	            oneRecord = data.childNodes[i];
	            tr = tbody.insertRow(tbody.rows.length);
	           	tr.setAttribute("className",colclasses[rowCount%2]);
	          	tr.setAttribute("class",colclasses[rowCount++%2]);
	          	td = tr.insertCell(tr.cells.length);
	          	td.setAttribute("class", "awlDataTableSpacer");
	            td = tr.insertCell(tr.cells.length);
	            td.setAttribute("class",rowclasses[tr.cells.length-1]);
	            var floatVal = parseFloat(oneRecord.getAttribute("y"));
	            td.innerHTML = awl.common.formatDecimal(floatVal, true, 2);
	            td = tr.insertCell(tr.cells.length);
	            td.innerHTML = "&nbsp;";
	            td = tr.insertCell(tr.cells.length);
	            td.setAttribute("class",rowclasses[tr.cells.length-1]);
	            td.innerHTML = (oneRecord.getAttribute("ts"));
	            td = tr.insertCell(tr.cells.length);
	            td.setAttribute("class", "awlDataTableSpacer");
	        }
	    }
	};
	
	this._clearTable = function(){
		if (this._valueHeader !== null) { this._valueHeader.innerHTML = ""; }
		if (this._timeHeader !== null) {this._timeHeader.innerHTML = ""; }
		if (this._tableBody !== null) {
			while (this._tableBody.childNodes.length > 0) {
				this._tableBody.removeChild(this._tableBody.firstChild);
			}
		}
	};
	
	this._fillEmptyTable = function(tableBodyNode){
		var tbody = tableBodyNode;
		tr = tbody.insertRow(0);
		td = tr.insertCell(0);
		td.setAttribute("colSpan",3);
		td.setAttribute("height",120);
		td.setAttribute("align","center");
		td.innerHTML = "No Data Found.";
	};
	
	this._postLoadingMessage = function(tableBodyNode){
	
		this._clearTable();
	
		var tbody = tableBodyNode;
		tr = tbody.insertRow(0);
		td = tr.insertCell(0);
		td.setAttribute("colSpan",3);
		td.setAttribute("align","center");
		td.setAttribute("height",120);
		td.innerHTML = "Loading Data Table...";
	};
	
/**
 * test routines
 */
	this.loadhandler = function(type, data, ev){
		this.callingObj.updateTable(data);
	};	
	
/**
 * External events
 */
	this._registerExternalEvents = function(){
		dojo.event.topic.subscribe("/preLoadRequest", 
						   this, 
						   this._makePreLoadResponse);
		
		dojo.event.topic.registerPublisher("/preLoadResponse", 
										   this, 
										   this._sendResponse);
		
		dojo.event.topic.subscribe("/onPageDataLoad", 
				   this, 
				   this._externalLoadEvent);

		dojo.event.topic.subscribe("/onLoading", 
				   this, 
				   this._prepareToLoad);										  
	};
	
	this._sendResponse = function(xDoc){
		// placeholder for external event handlers
	};
	this._makePreLoadResponse = function(){
		this._sendResponse(this.pointsPerPage);
	};
	this._externalLoadEvent = function(xDocTablePageData){
		this.updateTable(xDocTablePageData);
	};
	this._prepareToLoad = function(){
		this._postLoadingMessage(this._tableBody);
	};
};

// complete the inheritance process
dojo.inherits(awl.widget.DataTable, dojo.widget.HtmlWidget);
// make it a tag
dojo.widget.tags.addParseTreeHandler("dojo:datatable");


// tell the package system what classes get defined here
dojo.provide("awl.widget.DateRangeNav");

// load dependencies
dojo.require("dojo.event.*");

var Strings = {
	PREV_PAGE: "<< Prev Page",
	NEXT_PAGE: "Next Page >>",
	VALUE_HEADER: "Value",
	TIME_HEADER: "Time"
};

/**
	This widget displays date/time "jumplist" navigation bar.

	OUTPUT
	======
	When an item is selected from the jump-list, an external 
	request for data is sent with the following function 
	signature:
	
		this._requestData(startTs, endTs, pageIndex);
		
	using dojo.event.topic.registerPublisher("/loadRequest")
	interface.
	

	INPUT
	=====
	The jump-list is poulated by XML data recieved from an 
	external event signature:

		this._externalLoadEvent(xDoc);
	
	using the dojo.event.topic.subscribe("/onPageDataLoad")
	interface.
	
	The recieved XML document must contain the following XML Data 
	Schema fragment:
	
	<?xml version='1.0' encoding='UTF-8'?>
	<xml-body>
	...
	<pageStartData>
	<page str='MM/dd/yyyy 12:00PM - MM/dd/yyyy 11:01PM' startTs="1144695600000" endTs="1144695600000"/>
	<page str='MM/dd/yyyy 11:00PM - MM/dd/yyyy 10:01PM' startTs="1144695600000" endTs="1144695600000"/>
	<page str='MM/dd/yyyy 10:00PM - MM/dd/yyyy 09:01PM' startTs="1144695600000" endTs="1144695600000"/>
	<page str='MM/dd/yyyy 09:00PM - MM/dd/yyyy 08:01PM' startTs="1144695600000" endTs="1144695600000"/>
	</pageStartData>
	...
	</xml-body>
 
 */


// define the widget class
awl.widget.DateRangeNav = function(){
    // inheritance
    // see: http://www.cs.rit.edu/~atk/JavaScript/manuals/jsobj/
    dojo.widget.HtmlWidget.call(this);

    this.templatePath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlDateRangeNav.html");
    this.templateCssPath = 
		dojo.uri.dojoUri("../awl/widget/templates/HtmlDateRangeNav.css");

    this.widgetType = "DateRangeNav";
		
	// public vars	
	this.xmlTestFile = "";
	this.testMode = false;
	
	// our DOM nodes:
	this._navNext = null;
	this._navPrev = null;
	this._jumpSelector=null;
	
	//private vars
	this._firstLoad=true;
	this._pageIndex = 0;
	this._xmlPageDataCache = new Array();
		
	this.fillInTemplate = function(){
		this._navNext.innerHTML = Strings.NEXT_PAGE;
		this._navPrev.innerHTML = Strings.PREV_PAGE;
	};
	
	this.postCreate = function(){
		this._registerExternalEvents();
		if (this.xmlTestFile !== "") {
			/* load test file */
			awl.common.loadXmlFromFile(this.xmlTestFile, this, this.loadhandler);
		}
	};

/**
 * Jump-List -- TODO
 */
 	this.jumpToPage = function(evt){
		var pageIndex = evt.currentTarget.selectedIndex;
		var selectedOption = evt.currentTarget.options[pageIndex];
		var dateRangeNav = selectedOption.dateRangeNavObj;
		dateRangeNav.loadPage(pageIndex);
	};
	
	this.loadPage = function(pageIndex){
		if (pageIndex<1) {return;} // don't do anything if label is selected
		this._jumpSelector.selectedIndex = pageIndex;
		
		var selectedOption = this._jumpSelector.options[pageIndex];
		var startTs = selectedOption.startTs;
		var endTs = selectedOption.endTs;
		this._pageIndex = eval(selectedOption.value);
		
		var indexStr = this._pageIndex + "";
		var cachedPageData = this._xmlPageDataCache[indexStr];
		if (!cachedPageData) {
			this._requestData(startTs, endTs, this._pageIndex);
		}
		else {
			this._updatePageLoadListeners(cachedPageData);
		}
		
		this._initNavButtons();
	};
 
	this.updateJumpList = function(xDoc){	
	    var list = this._jumpSelector;
	   
	    // data node tree
	    var data = xDoc;

   	    if ((data === undefined) || (data.childNodes.length <= 0)) { 
			this._fillEmptyList();
			return false; 
		}
	
		this._clearSelectOptions(list);
		this._clearCache(this._xmlPageDataCache);
		
		var oneRecord, i;
		this._appendListItem("Jump to date/time","-1","-1");
	    for (i=0; i < data.childNodes.length; i++) {
	        // use only 1st level element nodes to skip 1st level text nodes in NN
	        if (data.childNodes[i].nodeType == 1) {		
	            oneRecord = data.childNodes[i];
	            this._appendListItem(oneRecord.getAttribute("str"),
									 oneRecord.getAttribute("startTs"),
									 oneRecord.getAttribute("endTs"));
	        }
	    }
		
		this._pageIndex = 1;
		this._initNavButtons();
	};
	
	this._clearSelectOptions = function(selectElem){
		while (selectElem.length > 0) {
			selectElem.remove(0);
		}
	};

	this._clearCache = function(array){
		if (dojo.lang.isArray(array)){
			while (array.length > 0) {
				array.pop();
			}
		}
	};
	
	this._fillEmptyList = function(){
		this._clearSelectOptions(this._jumpSelector);
		this._appendListItem ("No data index available.",true);
	};
	
	this._postLoadingMessage = function(){
		this._clearSelectOptions(this._jumpSelector);
		this._appendListItem ("Loading index...",true);
	};
	
	this._appendListItem = function(text, startTs, endTs){
		var list = this._jumpSelector;
		list.options[list.length] = new Option(text, list.length);
		list.options[list.length-1].startTs = startTs;
		list.options[list.length-1].endTs = endTs;
		list.options[list.length-1].dateRangeNavObj = this;
	}; 
	
/**
 * External events
 */
	this._registerExternalEvents = function(){
	
		/* receives message from DataNavBar when new data is available */		
		dojo.event.topic.subscribe("/onDataLoad", 
				   this, 
				   this._externalLoadEvent);

		/* sends notfiy to DataNavBar for data request */
		dojo.event.topic.registerPublisher("/loadRequest", 
										   this, 
										   this._requestData);
		
		/* receives loading message from DataNavBar */								   
		dojo.event.topic.subscribe("/onLoading", 
				   this, 
				   this._prepareToLoad);
				   
		/* sends notify to DataTable widget */	
		dojo.event.topic.registerPublisher("/onPageDataLoad", 
										   this, 
										   this._updatePageLoadListeners);	
										   												   					   										   
	};
	this._requestData = function(startTs, endTs, pageIndex){
		// placeholder for external event handlers
		dojo.debug("ExternalEvent:", "Sent /loadRequest ", startTs, " ", endTs, " ", pageIndex);
	};
	this._externalLoadEvent = function(xDocIndexData, xDocTablePageData, pageIndex){
		dojo.debug("ExternalEvent:", 
				   "Received /onDataLoad ", 
				   xDocIndexData, " ", 
				   xDocTablePageData, " ", 
				   pageIndex);
		if (xDocIndexData !== null) {
			this.updateJumpList(xDocIndexData);
		}
		if (xDocTablePageData !== null) {
			var indexStr = pageIndex + "";
			this._xmlPageDataCache[indexStr] = xDocTablePageData;
			this._updatePageLoadListeners(xDocTablePageData);
		}
	};
	this._prepareToLoad = function(){
		this._postLoadingMessage();
		dojo.debug("ExternalEvent:", 
				   "Received /onLoading ", 
				   "Posting 'Loading...' message");
	};
	this._updatePageLoadListeners = function(xDocTablePageData){
		// placeholder for external event handlers
		dojo.debug("ExternalEvent:", 
		   "Sent /onPageDataLoad ", 
		   "Notifying listeners", xDocTablePageData);
	};		

/**
 * Test functions
 */
	this.loadhandler = function(type, data, ev){
		if (data.nodeName != "pageStartData") {
			data = data.childNodes[0];
		}
		this.callingObj.updateJumpList(data);
	};

/**
 * Navigation buttons
 */
	/* prev button */	
	this._prevDisabled = false;
	this.gotoPrevPage = function(){
		if (!this._prevDisabled) {
			this.loadPage(this._pageIndex+1);
		}
	};
	this.disablePrev = function(){
		this._navPrev.style.visibility = "hidden";
		this._prevDisabled = true;
	};
	this.enablePrev = function(){
		this._navPrev.style.visibility = "visible";
		this._prevDisabled = false;
	};
	
	
	/* next button */
	this._nextDisabled = false;
	this.gotoNextPage = function(){
		if (!this._nextDisabled) {
			this.loadPage(this._pageIndex-1);
		}
	};
	this.disableNext = function(){
		this._navNext.style.visibility = "hidden";
		this._nextDisabled = true;
	};
	this.enableNext = function(){
		this._navNext.style.visibility = "visible";
		this._nextDisabled = false;
	};
	
	this._initNavButtons = function(){
		var index = this._pageIndex;
		if (this._isAtFirstIndex(index)) {
			this.disablePrev();
		}
		else {
			this.enablePrev();
		}
		if (this._isAtLastIndex(index)) {
			this.disableNext();
		}
		else {
			this.enableNext();
		}
	};

	this._isAtFirstIndex = function(index){
		if (index >= this._jumpSelector.length-1) {
			return (true);
		}
		else {
			return (false);
		}
	};
	
	this._isAtLastIndex = function(index){
		if (index <= 1) {
			return (true);
		}
		else {
			return (false);
		}
	};

};

// complete the inheritance process
dojo.inherits(awl.widget.DateRangeNav, dojo.widget.HtmlWidget);
// make it a tag
dojo.widget.tags.addParseTreeHandler("dojo:daterangenav");


// tell the package system what classes get defined here
dojo.provide("awl.widget.StatsBar");

// load dependencies
dojo.require("dojo.event.*");

dojo.setModulePrefix('awl', '../awl');
dojo.require("awl.*");


// define the widget class
awl.widget.StatsBar = function(){
    // inheritance
    dojo.widget.HtmlWidget.call(this);

    this.templatePath = dojo.uri.dojoUri("../awl/widget/templates/HtmlStatsBar.html");
    this.templateCssPath = dojo.uri.dojoUri("../awl/widget/templates/HtmlStatsBar.css");
    this.widgetType = "StatsBar";
    
    this.Strings = {
    	LABEL_MIN: "Min:",
		LABEL_MAX: "Max:",
		LABEL_AVE: "Ave:",
		LABEL_MEAN: "Median:",
		LABEL_STDDEV: "StdDev:"
	};

	// parameters
	this.min = 0.0;
	this.max = 0.0;
	this.ave = 0.0;
	this.mean = 0.0;
	this.stddev = 0.0;
	this.xmlTestFile = "";
	
	// our DOM nodes 
	this._minVal = null;
	this._maxVal = null;
	this._aveVal = null;
	this._meanVal = null;
	this._stddevVal = null;
	
	this._minLabel = null;
	this._maxLabel = null;
	this._aveLabel = null;
	this._meanLabel = null;
	this._stddevLabel = null;
	
	//private vars
		
	this.fillInTemplate  = function(){
		this._minLabel.innerHTML = this.Strings.LABEL_MIN;
		this._maxLabel.innerHTML = this.Strings.LABEL_MAX;
		this._aveLabel.innerHTML = this.Strings.LABEL_AVE;
		this._meanLabel.innerHTML = this.Strings.LABEL_MEAN;
		this._stddevLabel.innerHTML = this.Strings.LABEL_STDDEV;
		this._minVal.innerHTML = this.min;
		this._maxVal.innerHTML = this.max;
		this._aveVal.innerHTML = this.ave;
		this._meanVal.innerHTML = this.mean;
		this._stddevVal.innerHTML = this.stddev;
	};
	
	this.postCreate = function(){
		this._registerExternalEvents();	
		if (this.xmlTestFile !== "") {
			// load test file 
			awl.common.loadXmlFromFile(this.xmlTestFile, this, this._testLoadhandler);
		}
	};
	
	// Set stats from xDoc document tree data
	this.updateStats = function(data){
		if ((data === undefined) || (data === null)) {
			dojo.debug("StatsBar: No Statstics data found"); 
			return false; 
		}
	    
   	    this._clearStats();

		// set values
		var myText = awl.common.getXmlValue(data, "min");
		this._minVal.innerHTML=myText;
			  
		var myText = awl.common.getXmlValue(data, "max");
		this._maxVal.innerHTML=myText;			  
		
		var myText = awl.common.getXmlValue(data, "ave");
		this._aveVal.innerHTML=myText;
		
		var myText = awl.common.getXmlValue(data, "median");
		this._meanVal.innerHTML=myText;
		
		var myText = awl.common.getXmlValue(data, "stdDev");
		this._stddevVal.innerHTML=myText;
		
	};
	
	this._clearStats = function(){
		this._minVal.innerHTML = "";
		this._maxVal.innerHTML = "";
		this._aveVal.innerHTML = "";
		this._meanVal.innerHTML = "";
		this._stddevVal.innerHTML = "";
	};
		
/**
 * test routines
 */
	this._testLoadhandler = function(type, data, ev){
		this.callingObj.updateStats(data);
	};	
 	
/**
 * External events
 */
	this._registerExternalEvents = function(){		
		dojo.event.topic.subscribe("/onStatsData", 
				   this, 
				   this._externalLoadEvent);

		dojo.event.topic.subscribe("/onLoading", 
				   this, 
				   this._prepareToLoad);									  
	};

	this._externalLoadEvent = function(xDocStatsData){
		dojo.debug(this.widgetType, 
				   ": Received /onStatsData event",
				   xDocStatsData);
		this.updateStats(xDocStatsData);
	};

	this._prepareToLoad = function(){
		dojo.debug(this.widgetType, 
				   ": Received /onLoading event");
		this._clearStats();
	}; 	
};

// complete the inheritance process
dojo.inherits(awl.widget.StatsBar, dojo.widget.HtmlWidget);
// make it a tag
dojo.widget.tags.addParseTreeHandler("dojo:statsbar");

dojo.widget.manager.registerWidgetPackage("awl.widget");

dojo.hostenv.conditionalLoadModule({
	browser: [
		"awl.widget.ChartLegend",
		"awl.widget.DataNavBar",
		"awl.widget.DateSelect",
		"awl.widget.DataTable",
		"awl.widget.DateRangeNav",
		"awl.widget.ScaleSelect",
		"awl.widget.StatsBar"
	]
});
dojo.hostenv.moduleLoaded("awl.widget.*");

