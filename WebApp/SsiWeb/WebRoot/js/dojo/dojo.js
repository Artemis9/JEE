/*
	Copyright (c) 2004-2005, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

var dj_global=this;
function dj_undef(_1,_2){
if(!_2){
_2=dj_global;
}
return (typeof _2[_1]=="undefined");
}
if(dj_undef("djConfig")){
var djConfig={};
}
var dojo;
if(dj_undef("dojo")){
dojo={};
}
dojo.version={major:0,minor:2,patch:2,flag:"",revision:Number("$Rev: 2836 $".match(/[0-9]+/)[0]),toString:function(){
with(dojo.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
dojo.evalObjPath=function(_3,_4){
if(typeof _3!="string"){
return dj_global;
}
if(_3.indexOf(".")==-1){
if((dj_undef(_3,dj_global))&&(_4)){
dj_global[_3]={};
}
return dj_global[_3];
}
var _5=_3.split(/\./);
var _6=dj_global;
for(var i=0;i<_5.length;++i){
if(!_4){
_6=_6[_5[i]];
if((typeof _6=="undefined")||(!_6)){
return _6;
}
}else{
if(dj_undef(_5[i],_6)){
_6[_5[i]]={};
}
_6=_6[_5[i]];
}
}
return _6;
};
dojo.errorToString=function(_8){
return ((!dj_undef("message",_8))?_8.message:(dj_undef("description",_8)?_8:_8.description));
};
dojo.raise=function(_9,_a){
if(_a){
_9=_9+": "+dojo.errorToString(_a);
}
var he=dojo.hostenv;
if((!dj_undef("hostenv",dojo))&&(!dj_undef("println",dojo.hostenv))){
dojo.hostenv.println("FATAL: "+_9);
}
throw Error(_9);
};
dj_throw=dj_rethrow=function(m,e){
dojo.deprecated("dj_throw and dj_rethrow deprecated, use dojo.raise instead");
dojo.raise(m,e);
};
dojo.debug=function(){
if(!djConfig.isDebug){
return;
}
var _e=arguments;
if(dj_undef("println",dojo.hostenv)){
dojo.raise("dojo.debug not available (yet?)");
}
var _f=dj_global["jum"]&&!dj_global["jum"].isBrowser;
var s=[(_f?"":"DEBUG: ")];
for(var i=0;i<_e.length;++i){
if(!false&&_e[i] instanceof Error){
var msg="["+_e[i].name+": "+dojo.errorToString(_e[i])+(_e[i].fileName?", file: "+_e[i].fileName:"")+(_e[i].lineNumber?", line: "+_e[i].lineNumber:"")+"]";
}else{
try{
var msg=String(_e[i]);
}
catch(e){
if(dojo.render.html.ie){
var msg="[ActiveXObject]";
}else{
var msg="[unknown]";
}
}
}
s.push(msg);
}
if(_f){
jum.debug(s.join(" "));
}else{
dojo.hostenv.println(s.join(" "));
}
};
dojo.debugShallow=function(obj){
if(!djConfig.isDebug){
return;
}
dojo.debug("------------------------------------------------------------");
dojo.debug("Object: "+obj);
for(i in obj){
dojo.debug(i+": "+obj[i]);
}
dojo.debug("------------------------------------------------------------");
};
var dj_debug=dojo.debug;
function dj_eval(s){
return dj_global.eval?dj_global.eval(s):eval(s);
}
dj_unimplemented=dojo.unimplemented=function(_15,_16){
var _17="'"+_15+"' not implemented";
if((!dj_undef(_16))&&(_16)){
_17+=" "+_16;
}
dojo.raise(_17);
};
dj_deprecated=dojo.deprecated=function(_18,_19,_1a){
var _1b="DEPRECATED: "+_18;
if(_19){
_1b+=" "+_19;
}
if(_1a){
_1b+=" -- will be removed in version: "+_1a;
}
dojo.debug(_1b);
};
dojo.inherits=function(_1c,_1d){
if(typeof _1d!="function"){
dojo.raise("superclass: "+_1d+" borken");
}
_1c.prototype=new _1d();
_1c.prototype.constructor=_1c;
_1c.superclass=_1d.prototype;
_1c["super"]=_1d.prototype;
};
dj_inherits=function(_1e,_1f){
dojo.deprecated("dj_inherits deprecated, use dojo.inherits instead");
dojo.inherits(_1e,_1f);
};
dojo.render=(function(){
function vscaffold(_20,_21){
var tmp={capable:false,support:{builtin:false,plugin:false},prefixes:_20};
for(var x in _21){
tmp[x]=false;
}
return tmp;
}
return {name:"",ver:dojo.version,os:{win:false,linux:false,osx:false},html:vscaffold(["html"],["ie","opera","khtml","safari","moz"]),svg:vscaffold(["svg"],["corel","adobe","batik"]),vml:vscaffold(["vml"],["ie"]),swf:vscaffold(["Swf","Flash","Mm"],["mm"]),swt:vscaffold(["Swt"],["ibm"])};
})();
dojo.hostenv=(function(){
var _24={isDebug:false,allowQueryConfig:false,baseScriptUri:"",baseRelativePath:"",libraryScriptUri:"",iePreventClobber:false,ieClobberMinimal:true,preventBackButtonFix:true,searchIds:[],parseWidgets:true};
if(typeof djConfig=="undefined"){
djConfig=_24;
}else{
for(var _25 in _24){
if(typeof djConfig[_25]=="undefined"){
djConfig[_25]=_24[_25];
}
}
}
var djc=djConfig;
function _def(obj,_28,def){
return (dj_undef(_28,obj)?def:obj[_28]);
}
return {name_:"(unset)",version_:"(unset)",pkgFileName:"__package__",loading_modules_:{},loaded_modules_:{},addedToLoadingCount:[],removedFromLoadingCount:[],inFlightCount:0,modulePrefixes_:{dojo:{name:"dojo",value:"src"}},setModulePrefix:function(_2a,_2b){
this.modulePrefixes_[_2a]={name:_2a,value:_2b};
},getModulePrefix:function(_2c){
var mp=this.modulePrefixes_;
if((mp[_2c])&&(mp[_2c]["name"])){
return mp[_2c].value;
}
return _2c;
},getTextStack:[],loadUriStack:[],loadedUris:[],post_load_:false,modulesLoadedListeners:[],getName:function(){
return this.name_;
},getVersion:function(){
return this.version_;
},getText:function(uri){
dojo.unimplemented("getText","uri="+uri);
},getLibraryScriptUri:function(){
dojo.unimplemented("getLibraryScriptUri","");
}};
})();
dojo.hostenv.getBaseScriptUri=function(){
if(djConfig.baseScriptUri.length){
return djConfig.baseScriptUri;
}
var uri=new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
if(!uri){
dojo.raise("Nothing returned by getLibraryScriptUri(): "+uri);
}
var _30=uri.lastIndexOf("/");
djConfig.baseScriptUri=djConfig.baseRelativePath;
return djConfig.baseScriptUri;
};
dojo.hostenv.setBaseScriptUri=function(uri){
djConfig.baseScriptUri=uri;
};
dojo.hostenv.loadPath=function(_32,_33,cb){
if((_32.charAt(0)=="/")||(_32.match(/^\w+:/))){
dojo.raise("relpath '"+_32+"'; must be relative");
}
var uri=this.getBaseScriptUri()+_32;
if(djConfig.cacheBust&&dojo.render.html.capable){
uri+="?"+String(djConfig.cacheBust).replace(/\W+/g,"");
}
try{
return ((!_33)?this.loadUri(uri,cb):this.loadUriAndCheck(uri,_33,cb));
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.hostenv.loadUri=function(uri,cb){
if(this.loadedUris[uri]){
return;
}
var _38=this.getText(uri,null,true);
if(_38==null){
return 0;
}
this.loadedUris[uri]=true;
var _39=dj_eval(_38);
return 1;
};
dojo.hostenv.loadUriAndCheck=function(uri,_3b,cb){
var ok=true;
try{
ok=this.loadUri(uri,cb);
}
catch(e){
dojo.debug("failed loading ",uri," with error: ",e);
}
return ((ok)&&(this.findModule(_3b,false)))?true:false;
};
dojo.loaded=function(){
};
dojo.hostenv.loaded=function(){
this.post_load_=true;
var mll=this.modulesLoadedListeners;
for(var x=0;x<mll.length;x++){
mll[x]();
}
dojo.loaded();
};
dojo.addOnLoad=function(obj,_41){
if(arguments.length==1){
dojo.hostenv.modulesLoadedListeners.push(obj);
}else{
if(arguments.length>1){
dojo.hostenv.modulesLoadedListeners.push(function(){
obj[_41]();
});
}
}
};
dojo.hostenv.modulesLoaded=function(){
if(this.post_load_){
return;
}
if((this.loadUriStack.length==0)&&(this.getTextStack.length==0)){
if(this.inFlightCount>0){
dojo.debug("files still in flight!");
return;
}
if(typeof setTimeout=="object"){
setTimeout("dojo.hostenv.loaded();",0);
}else{
dojo.hostenv.loaded();
}
}
};
dojo.hostenv.moduleLoaded=function(_42){
var _43=dojo.evalObjPath((_42.split(".").slice(0,-1)).join("."));
this.loaded_modules_[(new String(_42)).toLowerCase()]=_43;
};
dojo.hostenv._global_omit_module_check=false;
dojo.hostenv.loadModule=function(_44,_45,_46){
if(!_44){
return;
}
_46=this._global_omit_module_check||_46;
var _47=this.findModule(_44,false);
if(_47){
return _47;
}
if(dj_undef(_44,this.loading_modules_)){
this.addedToLoadingCount.push(_44);
}
this.loading_modules_[_44]=1;
var _48=_44.replace(/\./g,"/")+".js";
var _49=_44.split(".");
var _4a=_44.split(".");
for(var i=_49.length-1;i>0;i--){
var _4c=_49.slice(0,i).join(".");
var _4d=this.getModulePrefix(_4c);
if(_4d!=_4c){
_49.splice(0,i,_4d);
break;
}
}
var _4e=_49[_49.length-1];
if(_4e=="*"){
_44=(_4a.slice(0,-1)).join(".");
while(_49.length){
_49.pop();
_49.push(this.pkgFileName);
_48=_49.join("/")+".js";
if(_48.charAt(0)=="/"){
_48=_48.slice(1);
}
ok=this.loadPath(_48,((!_46)?_44:null));
if(ok){
break;
}
_49.pop();
}
}else{
_48=_49.join("/")+".js";
_44=_4a.join(".");
var ok=this.loadPath(_48,((!_46)?_44:null));
if((!ok)&&(!_45)){
_49.pop();
while(_49.length){
_48=_49.join("/")+".js";
ok=this.loadPath(_48,((!_46)?_44:null));
if(ok){
break;
}
_49.pop();
_48=_49.join("/")+"/"+this.pkgFileName+".js";
if(_48.charAt(0)=="/"){
_48=_48.slice(1);
}
ok=this.loadPath(_48,((!_46)?_44:null));
if(ok){
break;
}
}
}
if((!ok)&&(!_46)){
dojo.raise("Could not load '"+_44+"'; last tried '"+_48+"'");
}
}
if(!_46){
_47=this.findModule(_44,false);
if(!_47){
dojo.raise("symbol '"+_44+"' is not defined after loading '"+_48+"'");
}
}
return _47;
};
dojo.hostenv.startPackage=function(_50){
var _51=_50.split(/\./);
if(_51[_51.length-1]=="*"){
_51.pop();
}
return dojo.evalObjPath(_51.join("."),true);
};
dojo.hostenv.findModule=function(_52,_53){
var lmn=(new String(_52)).toLowerCase();
if(this.loaded_modules_[lmn]){
return this.loaded_modules_[lmn];
}
var _55=dojo.evalObjPath(_52);
if((_52)&&(typeof _55!="undefined")&&(_55)){
this.loaded_modules_[lmn]=_55;
return _55;
}
if(_53){
dojo.raise("no loaded module named '"+_52+"'");
}
return null;
};
if(typeof window=="undefined"){
dojo.raise("no window object");
}
(function(){
if(djConfig.allowQueryConfig){
var _56=document.location.toString();
var _57=_56.split("?",2);
if(_57.length>1){
var _58=_57[1];
var _59=_58.split("&");
for(var x in _59){
var sp=_59[x].split("=");
if((sp[0].length>9)&&(sp[0].substr(0,9)=="djConfig.")){
var opt=sp[0].substr(9);
try{
djConfig[opt]=eval(sp[1]);
}
catch(e){
djConfig[opt]=sp[1];
}
}
}
}
}
if(((djConfig["baseScriptUri"]=="")||(djConfig["baseRelativePath"]==""))&&(document&&document.getElementsByTagName)){
var _5d=document.getElementsByTagName("script");
var _5e=/(__package__|dojo)\.js([\?\.]|$)/i;
for(var i=0;i<_5d.length;i++){
var src=_5d[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_5e);
if(m){
root=src.substring(0,m.index);
if(!this["djConfig"]){
djConfig={};
}
if(djConfig["baseScriptUri"]==""){
djConfig["baseScriptUri"]=root;
}
if(djConfig["baseRelativePath"]==""){
djConfig["baseRelativePath"]=root;
}
break;
}
}
}
var dr=dojo.render;
var drh=dojo.render.html;
var dua=drh.UA=navigator.userAgent;
var dav=drh.AV=navigator.appVersion;
var t=true;
var f=false;
drh.capable=t;
drh.support.builtin=t;
dr.ver=parseFloat(drh.AV);
dr.os.mac=dav.indexOf("Macintosh")>=0;
dr.os.win=dav.indexOf("Windows")>=0;
dr.os.linux=dav.indexOf("X11")>=0;
drh.opera=dua.indexOf("Opera")>=0;
drh.khtml=(dav.indexOf("Konqueror")>=0)||(dav.indexOf("Safari")>=0);
drh.safari=dav.indexOf("Safari")>=0;
var _68=dua.indexOf("Gecko");
drh.mozilla=drh.moz=(_68>=0)&&(!drh.khtml);
if(drh.mozilla){
drh.geckoVersion=dua.substring(_68+6,_68+14);
}
drh.ie=(document.all)&&(!drh.opera);
drh.ie50=drh.ie&&dav.indexOf("MSIE 5.0")>=0;
drh.ie55=drh.ie&&dav.indexOf("MSIE 5.5")>=0;
drh.ie60=drh.ie&&dav.indexOf("MSIE 6.0")>=0;
dr.vml.capable=drh.ie;
dr.svg.capable=f;
dr.svg.support.plugin=f;
dr.svg.support.builtin=f;
dr.svg.adobe=f;
if(document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("org.w3c.dom.svg","1.0")){
dr.svg.capable=t;
dr.svg.support.builtin=t;
dr.svg.support.plugin=f;
dr.svg.adobe=f;
}else{
if(navigator.mimeTypes&&navigator.mimeTypes.length>0){
var _69=navigator.mimeTypes["image/svg+xml"]||navigator.mimeTypes["image/svg"]||navigator.mimeTypes["image/svg-xml"];
if(_69){
dr.svg.adobe=_69&&_69.enabledPlugin&&_69.enabledPlugin.description&&(_69.enabledPlugin.description.indexOf("Adobe")>-1);
if(dr.svg.adobe){
dr.svg.capable=t;
dr.svg.support.plugin=t;
}
}
}else{
if(drh.ie&&dr.os.win){
var _69=f;
try{
var _6a=new ActiveXObject("Adobe.SVGCtl");
_69=t;
}
catch(e){
}
if(_69){
dr.svg.capable=t;
dr.svg.support.plugin=t;
dr.svg.adobe=t;
}
}else{
dr.svg.capable=f;
dr.svg.support.plugin=f;
dr.svg.adobe=f;
}
}
}
})();
dojo.hostenv.startPackage("dojo.hostenv");
dojo.hostenv.name_="browser";
dojo.hostenv.searchIds=[];
var DJ_XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
dojo.hostenv.getXmlhttpObject=function(){
var _6b=null;
var _6c=null;
try{
_6b=new XMLHttpRequest();
}
catch(e){
}
if(!_6b){
for(var i=0;i<3;++i){
var _6e=DJ_XMLHTTP_PROGIDS[i];
try{
_6b=new ActiveXObject(_6e);
}
catch(e){
_6c=e;
}
if(_6b){
DJ_XMLHTTP_PROGIDS=[_6e];
break;
}
}
}
if(!_6b){
return dojo.raise("XMLHTTP not available",_6c);
}
return _6b;
};
dojo.hostenv.getText=function(uri,_70,_71){
var _72=this.getXmlhttpObject();
if(_70){
_72.onreadystatechange=function(){
if((4==_72.readyState)&&(_72["status"])){
if(_72.status==200){
_70(_72.responseText);
}
}
};
}
_72.open("GET",uri,_70?true:false);
_72.send(null);
if(_70){
return null;
}
return _72.responseText;
};
dojo.hostenv.defaultDebugContainerId="dojoDebug";
dojo.hostenv._println_buffer=[];
dojo.hostenv._println_safe=false;
dojo.hostenv.println=function(_73){
if(!dojo.hostenv._println_safe){
dojo.hostenv._println_buffer.push(_73);
}else{
try{
var _74=document.getElementById(djConfig.debugContainerId?djConfig.debugContainerId:dojo.hostenv.defaultDebugContainerId);
if(!_74){
_74=document.getElementsByTagName("body")[0]||document.body;
}
var div=document.createElement("div");
div.appendChild(document.createTextNode(_73));
_74.appendChild(div);
}
catch(e){
try{
document.write("<div>"+_73+"</div>");
}
catch(e2){
window.status=_73;
}
}
}
};
dojo.addOnLoad(function(){
dojo.hostenv._println_safe=true;
while(dojo.hostenv._println_buffer.length>0){
dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
}
});
function dj_addNodeEvtHdlr(_76,_77,fp,_79){
var _7a=_76["on"+_77]||function(){
};
_76["on"+_77]=function(){
fp.apply(_76,arguments);
_7a.apply(_76,arguments);
};
return true;
}
dj_addNodeEvtHdlr(window,"load",function(){
if(dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
dojo.hostenv.modulesLoaded();
});
dojo.hostenv.makeWidgets=function(){
var _7b=[];
if(djConfig.searchIds&&djConfig.searchIds.length>0){
_7b=_7b.concat(djConfig.searchIds);
}
if(dojo.hostenv.searchIds&&dojo.hostenv.searchIds.length>0){
_7b=_7b.concat(dojo.hostenv.searchIds);
}
if((djConfig.parseWidgets)||(_7b.length>0)){
if(dojo.evalObjPath("dojo.widget.Parse")){
try{
var _7c=new dojo.xml.Parse();
if(_7b.length>0){
for(var x=0;x<_7b.length;x++){
var _7e=document.getElementById(_7b[x]);
if(!_7e){
continue;
}
var _7f=_7c.parseElement(_7e,null,true);
dojo.widget.getParser().createComponents(_7f);
}
}else{
if(djConfig.parseWidgets){
var _7f=_7c.parseElement(document.getElementsByTagName("body")[0]||document.body,null,true);
dojo.widget.getParser().createComponents(_7f);
}
}
}
catch(e){
dojo.debug("auto-build-widgets error:",e);
}
}
}
};
dojo.hostenv.modulesLoadedListeners.push(function(){
if(!dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
});
try{
if(dojo.render.html.ie){
document.write("<style>v:*{ behavior:url(#default#VML); }</style>");
document.write("<xml:namespace ns=\"urn:schemas-microsoft-com:vml\" prefix=\"v\"/>");
}
}
catch(e){
}
dojo.hostenv.writeIncludes=function(){
};
dojo.hostenv.byId=dojo.byId=function(id,doc){
if(typeof id=="string"||id instanceof String){
if(!doc){
doc=document;
}
return doc.getElementById(id);
}
return id;
};
dojo.hostenv.byIdArray=dojo.byIdArray=function(){
var ids=[];
for(var i=0;i<arguments.length;i++){
if((arguments[i] instanceof Array)||(typeof arguments[i]=="array")){
for(var j=0;j<arguments[i].length;j++){
ids=ids.concat(dojo.hostenv.byIdArray(arguments[i][j]));
}
}else{
ids.push(dojo.hostenv.byId(arguments[i]));
}
}
return ids;
};
dojo.hostenv.conditionalLoadModule=function(_85){
var _86=_85["common"]||[];
var _87=(_85[dojo.hostenv.name_])?_86.concat(_85[dojo.hostenv.name_]||[]):_86.concat(_85["default"]||[]);
for(var x=0;x<_87.length;x++){
var _89=_87[x];
if(_89.constructor==Array){
dojo.hostenv.loadModule.apply(dojo.hostenv,_89);
}else{
dojo.hostenv.loadModule(_89);
}
}
};
dojo.hostenv.require=dojo.hostenv.loadModule;
dojo.require=function(){
dojo.hostenv.loadModule.apply(dojo.hostenv,arguments);
};
dojo.requireAfter=dojo.require;
dojo.requireIf=function(){
if((arguments[0]===true)||(arguments[0]=="common")||(dojo.render[arguments[0]].capable)){
var _8a=[];
for(var i=1;i<arguments.length;i++){
_8a.push(arguments[i]);
}
dojo.require.apply(dojo,_8a);
}
};
dojo.requireAfterIf=dojo.requireIf;
dojo.conditionalRequire=dojo.requireIf;
dojo.kwCompoundRequire=function(){
dojo.hostenv.conditionalLoadModule.apply(dojo.hostenv,arguments);
};
dojo.hostenv.provide=dojo.hostenv.startPackage;
dojo.provide=function(){
return dojo.hostenv.startPackage.apply(dojo.hostenv,arguments);
};
dojo.setModulePrefix=function(_8c,_8d){
return dojo.hostenv.setModulePrefix(_8c,_8d);
};
dojo.profile={start:function(){
},end:function(){
},dump:function(){
}};
dojo.exists=function(obj,_8f){
var p=_8f.split(".");
for(var i=0;i<p.length;i++){
if(!(obj[p[i]])){
return false;
}
obj=obj[p[i]];
}
return true;
};
dojo.provide("dojo.lang");
dojo.provide("dojo.AdapterRegistry");
dojo.provide("dojo.lang.Lang");
dojo.lang.mixin=function(obj,_93){
var _94={};
for(var x in _93){
if(typeof _94[x]=="undefined"||_94[x]!=_93[x]){
obj[x]=_93[x];
}
}
if(dojo.render.html.ie&&dojo.lang.isFunction(_93["toString"])&&_93["toString"]!=obj["toString"]){
obj.toString=_93.toString;
}
return obj;
};
dojo.lang.extend=function(_96,_97){
this.mixin(_96.prototype,_97);
};
dojo.lang.extendPrototype=function(obj,_99){
this.extend(obj.constructor,_99);
};
dojo.lang.anonCtr=0;
dojo.lang.anon={};
dojo.lang.nameAnonFunc=function(_9a,_9b){
var nso=(_9b||dojo.lang.anon);
if((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"]==true)){
for(var x in nso){
if(nso[x]===_9a){
return x;
}
}
}
var ret="__"+dojo.lang.anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dojo.lang.anonCtr++;
}
nso[ret]=_9a;
return ret;
};
dojo.lang.hitch=function(_9f,_a0){
if(dojo.lang.isString(_a0)){
var fcn=_9f[_a0];
}else{
var fcn=_a0;
}
return function(){
return fcn.apply(_9f,arguments);
};
};
dojo.lang.forward=function(_a2){
return function(){
return this[_a2].apply(this,arguments);
};
};
dojo.lang.curry=function(ns,_a4){
var _a5=[];
ns=ns||dj_global;
if(dojo.lang.isString(_a4)){
_a4=ns[_a4];
}
for(var x=2;x<arguments.length;x++){
_a5.push(arguments[x]);
}
var _a7=_a4.length-_a5.length;
function gather(_a8,_a9,_aa){
var _ab=_aa;
var _ac=_a9.slice(0);
for(var x=0;x<_a8.length;x++){
_ac.push(_a8[x]);
}
_aa=_aa-_a8.length;
if(_aa<=0){
var res=_a4.apply(ns,_ac);
_aa=_ab;
return res;
}else{
return function(){
return gather(arguments,_ac,_aa);
};
}
}
return gather([],_a5,_a7);
};
dojo.lang.curryArguments=function(ns,_b0,_b1,_b2){
var _b3=[];
var x=_b2||0;
for(x=_b2;x<_b1.length;x++){
_b3.push(_b1[x]);
}
return dojo.lang.curry.apply(dojo.lang,[ns,_b0].concat(_b3));
};
dojo.lang.setTimeout=function(_b5,_b6){
var _b7=window,argsStart=2;
if(!dojo.lang.isFunction(_b5)){
_b7=_b5;
_b5=_b6;
_b6=arguments[2];
argsStart++;
}
if(dojo.lang.isString(_b5)){
_b5=_b7[_b5];
}
var _b8=[];
for(var i=argsStart;i<arguments.length;i++){
_b8.push(arguments[i]);
}
return setTimeout(function(){
_b5.apply(_b7,_b8);
},_b6);
};
dojo.lang.isObject=function(wh){
return typeof wh=="object"||dojo.lang.isArray(wh)||dojo.lang.isFunction(wh);
};
dojo.lang.isArray=function(wh){
return (wh instanceof Array||typeof wh=="array");
};
dojo.lang.isArrayLike=function(wh){
if(dojo.lang.isString(wh)){
return false;
}
if(dojo.lang.isArray(wh)){
return true;
}
if(typeof wh!="undefined"&&wh&&dojo.lang.isNumber(wh.length)&&isFinite(wh.length)){
return true;
}
return false;
};
dojo.lang.isFunction=function(wh){
return (wh instanceof Function||typeof wh=="function");
};
dojo.lang.isString=function(wh){
return (wh instanceof String||typeof wh=="string");
};
dojo.lang.isAlien=function(wh){
return !dojo.lang.isFunction()&&/\{\s*\[native code\]\s*\}/.test(String(wh));
};
dojo.lang.isBoolean=function(wh){
return (wh instanceof Boolean||typeof wh=="boolean");
};
dojo.lang.isNumber=function(wh){
return (wh instanceof Number||typeof wh=="number");
};
dojo.lang.isUndefined=function(wh){
return ((wh==undefined)&&(typeof wh=="undefined"));
};
dojo.lang.whatAmI=function(wh){
try{
if(dojo.lang.isArray(wh)){
return "array";
}
if(dojo.lang.isFunction(wh)){
return "function";
}
if(dojo.lang.isString(wh)){
return "string";
}
if(dojo.lang.isNumber(wh)){
return "number";
}
if(dojo.lang.isBoolean(wh)){
return "boolean";
}
if(dojo.lang.isAlien(wh)){
return "alien";
}
if(dojo.lang.isUndefined(wh)){
return "undefined";
}
for(var _c4 in dojo.lang.whatAmI.custom){
if(dojo.lang.whatAmI.custom[_c4](wh)){
return _c4;
}
}
if(dojo.lang.isObject(wh)){
return "object";
}
}
catch(E){
}
return "unknown";
};
dojo.lang.whatAmI.custom={};
dojo.lang.find=function(arr,val,_c7){
if(!dojo.lang.isArrayLike(arr)&&dojo.lang.isArrayLike(val)){
var a=arr;
arr=val;
val=a;
}
var _c9=dojo.lang.isString(arr);
if(_c9){
arr=arr.split("");
}
if(_c7){
for(var i=0;i<arr.length;++i){
if(arr[i]===val){
return i;
}
}
}else{
for(var i=0;i<arr.length;++i){
if(arr[i]==val){
return i;
}
}
}
return -1;
};
dojo.lang.indexOf=dojo.lang.find;
dojo.lang.findLast=function(arr,val,_cd){
if(!dojo.lang.isArrayLike(arr)&&dojo.lang.isArrayLike(val)){
var a=arr;
arr=val;
val=a;
}
var _cf=dojo.lang.isString(arr);
if(_cf){
arr=arr.split("");
}
if(_cd){
for(var i=arr.length-1;i>=0;i--){
if(arr[i]===val){
return i;
}
}
}else{
for(var i=arr.length-1;i>=0;i--){
if(arr[i]==val){
return i;
}
}
}
return -1;
};
dojo.lang.lastIndexOf=dojo.lang.findLast;
dojo.lang.inArray=function(arr,val){
return dojo.lang.find(arr,val)>-1;
};
dojo.lang.getNameInObj=function(ns,_d4){
if(!ns){
ns=dj_global;
}
for(var x in ns){
if(ns[x]===_d4){
return new String(x);
}
}
return null;
};
dojo.lang.has=function(obj,_d7){
return (typeof obj[_d7]!=="undefined");
};
dojo.lang.isEmpty=function(obj){
if(dojo.lang.isObject(obj)){
var tmp={};
var _da=0;
for(var x in obj){
if(obj[x]&&(!tmp[x])){
_da++;
break;
}
}
return (_da==0);
}else{
if(dojo.lang.isArrayLike(obj)||dojo.lang.isString(obj)){
return obj.length==0;
}
}
};
dojo.lang.forEach=function(arr,_dd,_de){
var _df=dojo.lang.isString(arr);
if(_df){
arr=arr.split("");
}
var il=arr.length;
for(var i=0;i<((_de)?il:arr.length);i++){
if(_dd(arr[i],i,arr)=="break"){
break;
}
}
};
dojo.lang.map=function(arr,obj,_e4){
var _e5=dojo.lang.isString(arr);
if(_e5){
arr=arr.split("");
}
if(dojo.lang.isFunction(obj)&&(!_e4)){
_e4=obj;
obj=dj_global;
}else{
if(dojo.lang.isFunction(obj)&&_e4){
var _e6=obj;
obj=_e4;
_e4=_e6;
}
}
if(Array.map){
var _e7=Array.map(arr,_e4,obj);
}else{
var _e7=[];
for(var i=0;i<arr.length;++i){
_e7.push(_e4.call(obj,arr[i]));
}
}
if(_e5){
return _e7.join("");
}else{
return _e7;
}
};
dojo.lang.tryThese=function(){
for(var x=0;x<arguments.length;x++){
try{
if(typeof arguments[x]=="function"){
var ret=(arguments[x]());
if(ret){
return ret;
}
}
}
catch(e){
dojo.debug(e);
}
}
};
dojo.lang.delayThese=function(_eb,cb,_ed,_ee){
if(!_eb.length){
if(typeof _ee=="function"){
_ee();
}
return;
}
if((typeof _ed=="undefined")&&(typeof cb=="number")){
_ed=cb;
cb=function(){
};
}else{
if(!cb){
cb=function(){
};
if(!_ed){
_ed=0;
}
}
}
setTimeout(function(){
(_eb.shift())();
cb();
dojo.lang.delayThese(_eb,cb,_ed,_ee);
},_ed);
};
dojo.lang.shallowCopy=function(obj){
var ret={},key;
for(key in obj){
if(dojo.lang.isUndefined(ret[key])){
ret[key]=obj[key];
}
}
return ret;
};
dojo.lang.every=function(arr,_f2,_f3){
var _f4=dojo.lang.isString(arr);
if(_f4){
arr=arr.split("");
}
if(Array.every){
return Array.every(arr,_f2,_f3);
}else{
if(!_f3){
if(arguments.length>=3){
dojo.raise("thisObject doesn't exist!");
}
_f3=dj_global;
}
for(var i=0;i<arr.length;i++){
if(!_f2.call(_f3,arr[i],i,arr)){
return false;
}
}
return true;
}
};
dojo.lang.some=function(arr,_f7,_f8){
var _f9=dojo.lang.isString(arr);
if(_f9){
arr=arr.split("");
}
if(Array.some){
return Array.some(arr,_f7,_f8);
}else{
if(!_f8){
if(arguments.length>=3){
dojo.raise("thisObject doesn't exist!");
}
_f8=dj_global;
}
for(var i=0;i<arr.length;i++){
if(_f7.call(_f8,arr[i],i,arr)){
return true;
}
}
return false;
}
};
dojo.lang.filter=function(arr,_fc,_fd){
var _fe=dojo.lang.isString(arr);
if(_fe){
arr=arr.split("");
}
if(Array.filter){
var _ff=Array.filter(arr,_fc,_fd);
}else{
if(!_fd){
if(arguments.length>=3){
dojo.raise("thisObject doesn't exist!");
}
_fd=dj_global;
}
var _ff=[];
for(var i=0;i<arr.length;i++){
if(_fc.call(_fd,arr[i],i,arr)){
_ff.push(arr[i]);
}
}
}
if(_fe){
return _ff.join("");
}else{
return _ff;
}
};
dojo.AdapterRegistry=function(){
this.pairs=[];
};
dojo.lang.extend(dojo.AdapterRegistry,{register:function(name,_102,wrap,_104){
if(_104){
this.pairs.unshift([name,_102,wrap]);
}else{
this.pairs.push([name,_102,wrap]);
}
},match:function(){
for(var i=0;i<this.pairs.length;i++){
var pair=this.pairs[i];
if(pair[1].apply(this,arguments)){
return pair[2].apply(this,arguments);
}
}
throw new Error("No match found");
},unregister:function(name){
for(var i=0;i<this.pairs.length;i++){
var pair=this.pairs[i];
if(pair[0]==name){
this.pairs.splice(i,1);
return true;
}
}
return false;
}});
dojo.lang.reprRegistry=new dojo.AdapterRegistry();
dojo.lang.registerRepr=function(name,_10b,wrap,_10d){
dojo.lang.reprRegistry.register(name,_10b,wrap,_10d);
};
dojo.lang.repr=function(obj){
if(typeof (obj)=="undefined"){
return "undefined";
}else{
if(obj===null){
return "null";
}
}
try{
if(typeof (obj["__repr__"])=="function"){
return obj["__repr__"]();
}else{
if((typeof (obj["repr"])=="function")&&(obj.repr!=arguments.callee)){
return obj["repr"]();
}
}
return dojo.lang.reprRegistry.match(obj);
}
catch(e){
if(typeof (obj.NAME)=="string"&&(obj.toString==Function.prototype.toString||obj.toString==Object.prototype.toString)){
return o.NAME;
}
}
if(typeof (obj)=="function"){
obj=(obj+"").replace(/^\s+/,"");
var idx=obj.indexOf("{");
if(idx!=-1){
obj=obj.substr(0,idx)+"{...}";
}
}
return obj+"";
};
dojo.lang.reprArrayLike=function(arr){
try{
var na=dojo.lang.map(arr,dojo.lang.repr);
return "["+na.join(", ")+"]";
}
catch(e){
}
};
dojo.lang.reprString=function(str){
return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.lang.reprNumber=function(num){
return num+"";
};
(function(){
var m=dojo.lang;
m.registerRepr("arrayLike",m.isArrayLike,m.reprArrayLike);
m.registerRepr("string",m.isString,m.reprString);
m.registerRepr("numbers",m.isNumber,m.reprNumber);
m.registerRepr("boolean",m.isBoolean,m.reprNumber);
})();
dojo.lang.unnest=function(){
var out=[];
for(var i=0;i<arguments.length;i++){
if(dojo.lang.isArrayLike(arguments[i])){
var add=dojo.lang.unnest.apply(this,arguments[i]);
out=out.concat(add);
}else{
out.push(arguments[i]);
}
}
return out;
};
dojo.lang.firstValued=function(){
for(var i=0;i<arguments.length;i++){
if(typeof arguments[i]!="undefined"){
return arguments[i];
}
}
return undefined;
};
dojo.lang.toArray=function(_119,_11a){
var _11b=[];
for(var i=_11a||0;i<_119.length;i++){
_11b.push(_119[i]);
}
return _11b;
};
dojo.provide("dojo.dom");
dojo.require("dojo.lang");
dojo.dom.ELEMENT_NODE=1;
dojo.dom.ATTRIBUTE_NODE=2;
dojo.dom.TEXT_NODE=3;
dojo.dom.CDATA_SECTION_NODE=4;
dojo.dom.ENTITY_REFERENCE_NODE=5;
dojo.dom.ENTITY_NODE=6;
dojo.dom.PROCESSING_INSTRUCTION_NODE=7;
dojo.dom.COMMENT_NODE=8;
dojo.dom.DOCUMENT_NODE=9;
dojo.dom.DOCUMENT_TYPE_NODE=10;
dojo.dom.DOCUMENT_FRAGMENT_NODE=11;
dojo.dom.NOTATION_NODE=12;
dojo.dom.dojoml="http://www.dojotoolkit.org/2004/dojoml";
dojo.dom.xmlns={svg:"http://www.w3.org/2000/svg",smil:"http://www.w3.org/2001/SMIL20/",mml:"http://www.w3.org/1998/Math/MathML",cml:"http://www.xml-cml.org",xlink:"http://www.w3.org/1999/xlink",xhtml:"http://www.w3.org/1999/xhtml",xul:"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",xbl:"http://www.mozilla.org/xbl",fo:"http://www.w3.org/1999/XSL/Format",xsl:"http://www.w3.org/1999/XSL/Transform",xslt:"http://www.w3.org/1999/XSL/Transform",xi:"http://www.w3.org/2001/XInclude",xforms:"http://www.w3.org/2002/01/xforms",saxon:"http://icl.com/saxon",xalan:"http://xml.apache.org/xslt",xsd:"http://www.w3.org/2001/XMLSchema",dt:"http://www.w3.org/2001/XMLSchema-datatypes",xsi:"http://www.w3.org/2001/XMLSchema-instance",rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",rdfs:"http://www.w3.org/2000/01/rdf-schema#",dc:"http://purl.org/dc/elements/1.1/",dcq:"http://purl.org/dc/qualifiers/1.0","soap-env":"http://schemas.xmlsoap.org/soap/envelope/",wsdl:"http://schemas.xmlsoap.org/wsdl/",AdobeExtensions:"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"};
dojo.dom.isNode=dojo.lang.isDomNode=function(wh){
if(typeof Element=="object"){
try{
return wh instanceof Element;
}
catch(E){
}
}else{
return wh&&!isNaN(wh.nodeType);
}
};
dojo.lang.whatAmI.custom["node"]=dojo.dom.isNode;
dojo.dom.getTagName=function(node){
var _11f=node.tagName;
if(_11f.substr(0,5).toLowerCase()!="dojo:"){
if(_11f.substr(0,4).toLowerCase()=="dojo"){
return "dojo:"+_11f.substring(4).toLowerCase();
}
var djt=node.getAttribute("dojoType")||node.getAttribute("dojotype");
if(djt){
return "dojo:"+djt.toLowerCase();
}
if((node.getAttributeNS)&&(node.getAttributeNS(this.dojoml,"type"))){
return "dojo:"+node.getAttributeNS(this.dojoml,"type").toLowerCase();
}
try{
djt=node.getAttribute("dojo:type");
}
catch(e){
}
if(djt){
return "dojo:"+djt.toLowerCase();
}
if((!dj_global["djConfig"])||(!djConfig["ignoreClassNames"])){
var _121=node.className||node.getAttribute("class");
if((_121)&&(_121.indexOf)&&(_121.indexOf("dojo-")!=-1)){
var _122=_121.split(" ");
for(var x=0;x<_122.length;x++){
if((_122[x].length>5)&&(_122[x].indexOf("dojo-")>=0)){
return "dojo:"+_122[x].substr(5).toLowerCase();
}
}
}
}
}
return _11f.toLowerCase();
};
dojo.dom.getUniqueId=function(){
do{
var id="dj_unique_"+(++arguments.callee._idIncrement);
}while(document.getElementById(id));
return id;
};
dojo.dom.getUniqueId._idIncrement=0;
dojo.dom.firstElement=dojo.dom.getFirstChildElement=function(_125,_126){
var node=_125.firstChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.nextSibling;
}
if(_126&&node&&node.tagName&&node.tagName.toLowerCase()!=_126.toLowerCase()){
node=dojo.dom.nextElement(node,_126);
}
return node;
};
dojo.dom.lastElement=dojo.dom.getLastChildElement=function(_128,_129){
var node=_128.lastChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.previousSibling;
}
if(_129&&node&&node.tagName&&node.tagName.toLowerCase()!=_129.toLowerCase()){
node=dojo.dom.prevElement(node,_129);
}
return node;
};
dojo.dom.nextElement=dojo.dom.getNextSiblingElement=function(node,_12c){
if(!node){
return null;
}
do{
node=node.nextSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
if(node&&_12c&&_12c.toLowerCase()!=node.tagName.toLowerCase()){
return dojo.dom.nextElement(node,_12c);
}
return node;
};
dojo.dom.prevElement=dojo.dom.getPreviousSiblingElement=function(node,_12e){
if(!node){
return null;
}
if(_12e){
_12e=_12e.toLowerCase();
}
do{
node=node.previousSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
if(node&&_12e&&_12e.toLowerCase()!=node.tagName.toLowerCase()){
return dojo.dom.prevElement(node,_12e);
}
return node;
};
dojo.dom.moveChildren=function(_12f,_130,trim){
var _132=0;
if(trim){
while(_12f.hasChildNodes()&&_12f.firstChild.nodeType==dojo.dom.TEXT_NODE){
_12f.removeChild(_12f.firstChild);
}
while(_12f.hasChildNodes()&&_12f.lastChild.nodeType==dojo.dom.TEXT_NODE){
_12f.removeChild(_12f.lastChild);
}
}
while(_12f.hasChildNodes()){
_130.appendChild(_12f.firstChild);
_132++;
}
return _132;
};
dojo.dom.copyChildren=function(_133,_134,trim){
var _136=_133.cloneNode(true);
return this.moveChildren(_136,_134,trim);
};
dojo.dom.removeChildren=function(node){
var _138=node.childNodes.length;
while(node.hasChildNodes()){
node.removeChild(node.firstChild);
}
return _138;
};
dojo.dom.replaceChildren=function(node,_13a){
dojo.dom.removeChildren(node);
node.appendChild(_13a);
};
dojo.dom.removeNode=function(node){
if(node&&node.parentNode){
return node.parentNode.removeChild(node);
}
};
dojo.dom.getAncestors=function(node,_13d,_13e){
var _13f=[];
var _140=dojo.lang.isFunction(_13d);
while(node){
if(!_140||_13d(node)){
_13f.push(node);
}
if(_13e&&_13f.length>0){
return _13f[0];
}
node=node.parentNode;
}
if(_13e){
return null;
}
return _13f;
};
dojo.dom.getAncestorsByTag=function(node,tag,_143){
tag=tag.toLowerCase();
return dojo.dom.getAncestors(node,function(el){
return ((el.tagName)&&(el.tagName.toLowerCase()==tag));
},_143);
};
dojo.dom.getFirstAncestorByTag=function(node,tag){
return dojo.dom.getAncestorsByTag(node,tag,true);
};
dojo.dom.isDescendantOf=function(node,_148,_149){
if(_149&&node){
node=node.parentNode;
}
while(node){
if(node==_148){
return true;
}
node=node.parentNode;
}
return false;
};
dojo.dom.innerXML=function(node){
if(node.innerXML){
return node.innerXML;
}else{
if(typeof XMLSerializer!="undefined"){
return (new XMLSerializer()).serializeToString(node);
}
}
};
dojo.dom.createDocumentFromText=function(str,_14c){
if(!_14c){
_14c="text/xml";
}
if(typeof DOMParser!="undefined"){
var _14d=new DOMParser();
return _14d.parseFromString(str,_14c);
}else{
if(typeof ActiveXObject!="undefined"){
var _14e=new ActiveXObject("Microsoft.XMLDOM");
if(_14e){
_14e.async=false;
_14e.loadXML(str);
return _14e;
}else{
dojo.debug("toXml didn't work?");
}
}else{
if(document.createElement){
var tmp=document.createElement("xml");
tmp.innerHTML=str;
if(document.implementation&&document.implementation.createDocument){
var _150=document.implementation.createDocument("foo","",null);
for(var i=0;i<tmp.childNodes.length;i++){
_150.importNode(tmp.childNodes.item(i),true);
}
return _150;
}
return tmp.document&&tmp.document.firstChild?tmp.document.firstChild:tmp;
}
}
}
return null;
};
dojo.dom.prependChild=function(node,_153){
if(_153.firstChild){
_153.insertBefore(node,_153.firstChild);
}else{
_153.appendChild(node);
}
return true;
};
dojo.dom.insertBefore=function(node,ref,_156){
if(_156!=true&&(node===ref||node.nextSibling===ref)){
return false;
}
var _157=ref.parentNode;
_157.insertBefore(node,ref);
return true;
};
dojo.dom.insertAfter=function(node,ref,_15a){
var pn=ref.parentNode;
if(ref==pn.lastChild){
if((_15a!=true)&&(node===ref)){
return false;
}
pn.appendChild(node);
}else{
return this.insertBefore(node,ref.nextSibling,_15a);
}
return true;
};
dojo.dom.insertAtPosition=function(node,ref,_15e){
if((!node)||(!ref)||(!_15e)){
return false;
}
switch(_15e.toLowerCase()){
case "before":
return dojo.dom.insertBefore(node,ref);
case "after":
return dojo.dom.insertAfter(node,ref);
case "first":
if(ref.firstChild){
return dojo.dom.insertBefore(node,ref.firstChild);
}else{
ref.appendChild(node);
return true;
}
break;
default:
ref.appendChild(node);
return true;
}
};
dojo.dom.insertAtIndex=function(node,_160,_161){
var _162=_160.childNodes;
if(!_162.length){
_160.appendChild(node);
return true;
}
var _163=null;
for(var i=0;i<_162.length;i++){
var _165=_162.item(i)["getAttribute"]?parseInt(_162.item(i).getAttribute("dojoinsertionindex")):-1;
if(_165<_161){
_163=_162.item(i);
}
}
if(_163){
return dojo.dom.insertAfter(node,_163);
}else{
return dojo.dom.insertBefore(node,_162.item(0));
}
};
dojo.dom.textContent=function(node,text){
if(text){
dojo.dom.replaceChildren(node,document.createTextNode(text));
return text;
}else{
var _168="";
if(node==null){
return _168;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
_168+=dojo.dom.textContent(node.childNodes[i]);
break;
case 3:
case 2:
case 4:
_168+=node.childNodes[i].nodeValue;
break;
default:
break;
}
}
return _168;
}
};
dojo.dom.collectionToArray=function(_16a){
dojo.deprecated("dojo.dom.collectionToArray","use dojo.lang.toArray instead");
return dojo.lang.toArray(_16a);
};
dojo.dom.hasParent=function(node){
if(!node||!node.parentNode||(node.parentNode&&!node.parentNode.tagName)){
return false;
}
return true;
};
dojo.dom.isTag=function(node){
if(node&&node.tagName){
var arr=dojo.lang.toArray(arguments,1);
return arr[dojo.lang.find(node.tagName,arr)]||"";
}
return "";
};
dojo.provide("dojo.uri.Uri");
dojo.uri=new function(){
this.joinPath=function(){
var arr=[];
for(var i=0;i<arguments.length;i++){
arr.push(arguments[i]);
}
return arr.join("/").replace(/\/{2,}/g,"/").replace(/((https*|ftps*):)/i,"$1/");
};
this.dojoUri=function(uri){
return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(),uri);
};
this.Uri=function(){
var uri=arguments[0];
for(var i=1;i<arguments.length;i++){
if(!arguments[i]){
continue;
}
var _173=new dojo.uri.Uri(arguments[i].toString());
var _174=new dojo.uri.Uri(uri.toString());
if(_173.path==""&&_173.scheme==null&&_173.authority==null&&_173.query==null){
if(_173.fragment!=null){
_174.fragment=_173.fragment;
}
_173=_174;
}else{
if(_173.scheme==null){
_173.scheme=_174.scheme;
if(_173.authority==null){
_173.authority=_174.authority;
if(_173.path.charAt(0)!="/"){
var path=_174.path.substring(0,_174.path.lastIndexOf("/")+1)+_173.path;
var segs=path.split("/");
for(var j=0;j<segs.length;j++){
if(segs[j]=="."){
if(j==segs.length-1){
segs[j]="";
}else{
segs.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&segs[0]=="")&&segs[j]==".."&&segs[j-1]!=".."){
if(j==segs.length-1){
segs.splice(j,1);
segs[j-1]="";
}else{
segs.splice(j-1,2);
j-=2;
}
}
}
}
_173.path=segs.join("/");
}
}
}
}
uri="";
if(_173.scheme!=null){
uri+=_173.scheme+":";
}
if(_173.authority!=null){
uri+="//"+_173.authority;
}
uri+=_173.path;
if(_173.query!=null){
uri+="?"+_173.query;
}
if(_173.fragment!=null){
uri+="#"+_173.fragment;
}
}
this.uri=uri.toString();
var _178="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
var r=this.uri.match(new RegExp(_178));
this.scheme=r[2]||(r[1]?"":null);
this.authority=r[4]||(r[3]?"":null);
this.path=r[5];
this.query=r[7]||(r[6]?"":null);
this.fragment=r[9]||(r[8]?"":null);
if(this.authority!=null){
_178="^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
r=this.authority.match(new RegExp(_178));
this.user=r[3]||null;
this.password=r[4]||null;
this.host=r[5];
this.port=r[7]||null;
}
this.toString=function(){
return this.uri;
};
};
};
dojo.provide("dojo.string");
dojo.require("dojo.lang");
dojo.string.trim=function(str,wh){
if(!dojo.lang.isString(str)){
return str;
}
if(!str.length){
return str;
}
if(wh>0){
return str.replace(/^\s+/,"");
}else{
if(wh<0){
return str.replace(/\s+$/,"");
}else{
return str.replace(/^\s+|\s+$/g,"");
}
}
};
dojo.string.trimStart=function(str){
return dojo.string.trim(str,1);
};
dojo.string.trimEnd=function(str){
return dojo.string.trim(str,-1);
};
dojo.string.paramString=function(str,_17f,_180){
for(var name in _17f){
var re=new RegExp("\\%\\{"+name+"\\}","g");
str=str.replace(re,_17f[name]);
}
if(_180){
str=str.replace(/%\{([^\}\s]+)\}/g,"");
}
return str;
};
dojo.string.capitalize=function(str){
if(!dojo.lang.isString(str)){
return "";
}
if(arguments.length==0){
str=this;
}
var _184=str.split(" ");
var _185="";
var len=_184.length;
for(var i=0;i<len;i++){
var word=_184[i];
word=word.charAt(0).toUpperCase()+word.substring(1,word.length);
_185+=word;
if(i<len-1){
_185+=" ";
}
}
return new String(_185);
};
dojo.string.isBlank=function(str){
if(!dojo.lang.isString(str)){
return true;
}
return (dojo.string.trim(str).length==0);
};
dojo.string.encodeAscii=function(str){
if(!dojo.lang.isString(str)){
return str;
}
var ret="";
var _18c=escape(str);
var _18d,re=/%u([0-9A-F]{4})/i;
while((_18d=_18c.match(re))){
var num=Number("0x"+_18d[1]);
var _18f=escape("&#"+num+";");
ret+=_18c.substring(0,_18d.index)+_18f;
_18c=_18c.substring(_18d.index+_18d[0].length);
}
ret+=_18c.replace(/\+/g,"%2B");
return ret;
};
dojo.string.summary=function(str,len){
if(!len||str.length<=len){
return str;
}else{
return str.substring(0,len).replace(/\.+$/,"")+"...";
}
};
dojo.string.escape=function(type,str){
var args=[];
for(var i=1;i<arguments.length;i++){
args.push(arguments[i]);
}
switch(type.toLowerCase()){
case "xml":
case "html":
case "xhtml":
return dojo.string.escapeXml.apply(this,args);
case "sql":
return dojo.string.escapeSql.apply(this,args);
case "regexp":
case "regex":
return dojo.string.escapeRegExp.apply(this,args);
case "javascript":
case "jscript":
case "js":
return dojo.string.escapeJavaScript.apply(this,args);
case "ascii":
return dojo.string.encodeAscii.apply(this,args);
default:
return str;
}
};
dojo.string.escapeXml=function(str,_197){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_197){
str=str.replace(/'/gm,"&#39;");
}
return str;
};
dojo.string.escapeSql=function(str){
return str.replace(/'/gm,"''");
};
dojo.string.escapeRegExp=function(str){
return str.replace(/\\/gm,"\\\\").replace(/([\f\b\n\t\r])/gm,"\\$1");
};
dojo.string.escapeJavaScript=function(str){
return str.replace(/(["'\f\b\n\t\r])/gm,"\\$1");
};
dojo.string.repeat=function(str,_19c,_19d){
var out="";
for(var i=0;i<_19c;i++){
out+=str;
if(_19d&&i<_19c-1){
out+=_19d;
}
}
return out;
};
dojo.string.endsWith=function(str,end,_1a2){
if(_1a2){
str=str.toLowerCase();
end=end.toLowerCase();
}
return str.lastIndexOf(end)==str.length-end.length;
};
dojo.string.endsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.endsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.startsWith=function(str,_1a6,_1a7){
if(_1a7){
str=str.toLowerCase();
_1a6=_1a6.toLowerCase();
}
return str.indexOf(_1a6)==0;
};
dojo.string.startsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.startsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.has=function(str){
for(var i=1;i<arguments.length;i++){
if(str.indexOf(arguments[i]>-1)){
return true;
}
}
return false;
};
dojo.string.pad=function(str,len,c,dir){
var out=String(str);
if(!c){
c="0";
}
if(!dir){
dir=1;
}
while(out.length<len){
if(dir>0){
out=c+out;
}else{
out+=c;
}
}
return out;
};
dojo.string.padLeft=function(str,len,c){
return dojo.string.pad(str,len,c,1);
};
dojo.string.padRight=function(str,len,c){
return dojo.string.pad(str,len,c,-1);
};
dojo.string.normalizeNewlines=function(text,_1b8){
if(_1b8=="\n"){
text=text.replace(/\r\n/g,"\n");
text=text.replace(/\r/g,"\n");
}else{
if(_1b8=="\r"){
text=text.replace(/\r\n/g,"\r");
text=text.replace(/\n/g,"\r");
}else{
text=text.replace(/([^\r])\n/g,"$1\r\n");
text=text.replace(/\r([^\n])/g,"\r\n$1");
}
}
return text;
};
dojo.string.splitEscaped=function(str,_1ba){
var _1bb=[];
for(var i=0,prevcomma=0;i<str.length;i++){
if(str.charAt(i)=="\\"){
i++;
continue;
}
if(str.charAt(i)==_1ba){
_1bb.push(str.substring(prevcomma,i));
prevcomma=i+1;
}
}
_1bb.push(str.substr(prevcomma));
return _1bb;
};
dojo.string.addToPrototype=function(){
for(var _1bd in dojo.string){
if(dojo.lang.isFunction(dojo.string[_1bd])){
var func=(function(){
var meth=_1bd;
switch(meth){
case "addToPrototype":
return null;
break;
case "escape":
return function(type){
return dojo.string.escape(type,this);
};
break;
default:
return function(){
var args=[this];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
dojo.debug(args);
return dojo.string[meth].apply(dojo.string,args);
};
}
})();
if(func){
String.prototype[_1bd]=func;
}
}
}
};
dojo.provide("dojo.math");
dojo.math.degToRad=function(x){
return (x*Math.PI)/180;
};
dojo.math.radToDeg=function(x){
return (x*180)/Math.PI;
};
dojo.math.factorial=function(n){
if(n<1){
return 0;
}
var _1c6=1;
for(var i=1;i<=n;i++){
_1c6*=i;
}
return _1c6;
};
dojo.math.permutations=function(n,k){
if(n==0||k==0){
return 1;
}
return (dojo.math.factorial(n)/dojo.math.factorial(n-k));
};
dojo.math.combinations=function(n,r){
if(n==0||r==0){
return 1;
}
return (dojo.math.factorial(n)/(dojo.math.factorial(n-r)*dojo.math.factorial(r)));
};
dojo.math.bernstein=function(t,n,i){
return (dojo.math.combinations(n,i)*Math.pow(t,i)*Math.pow(1-t,n-i));
};
dojo.math.gaussianRandom=function(){
var k=2;
do{
var i=2*Math.random()-1;
var j=2*Math.random()-1;
k=i*i+j*j;
}while(k>=1);
k=Math.sqrt((-2*Math.log(k))/k);
return i*k;
};
dojo.math.mean=function(){
var _1d2=dojo.lang.isArray(arguments[0])?arguments[0]:arguments;
var mean=0;
for(var i=0;i<_1d2.length;i++){
mean+=_1d2[i];
}
return mean/_1d2.length;
};
dojo.math.round=function(_1d5,_1d6){
if(!_1d6){
var _1d7=1;
}else{
var _1d7=Math.pow(10,_1d6);
}
return Math.round(_1d5*_1d7)/_1d7;
};
dojo.math.sd=function(){
var _1d8=dojo.lang.isArray(arguments[0])?arguments[0]:arguments;
return Math.sqrt(dojo.math.variance(_1d8));
};
dojo.math.variance=function(){
var _1d9=dojo.lang.isArray(arguments[0])?arguments[0]:arguments;
var mean=0,squares=0;
for(var i=0;i<_1d9.length;i++){
mean+=_1d9[i];
squares+=Math.pow(_1d9[i],2);
}
return (squares/_1d9.length)-Math.pow(mean/_1d9.length,2);
};
dojo.math.range=function(a,b,step){
if(arguments.length<2){
b=a;
a=0;
}
if(arguments.length<3){
step=1;
}
var _1df=[];
if(step>0){
for(var i=a;i<b;i+=step){
_1df.push(i);
}
}else{
if(step<0){
for(var i=a;i>b;i+=step){
_1df.push(i);
}
}else{
throw new Error("dojo.math.range: step must be non-zero");
}
}
return _1df;
};
dojo.provide("dojo.graphics.color");
dojo.require("dojo.lang");
dojo.require("dojo.string");
dojo.require("dojo.math");
dojo.graphics.color.Color=function(r,g,b,a){
if(dojo.lang.isArray(r)){
this.r=r[0];
this.g=r[1];
this.b=r[2];
this.a=r[3]||1;
}else{
if(dojo.lang.isString(r)){
var rgb=dojo.graphics.color.extractRGB(r);
this.r=rgb[0];
this.g=rgb[1];
this.b=rgb[2];
this.a=g||1;
}else{
if(r instanceof dojo.graphics.color.Color){
this.r=r.r;
this.b=r.b;
this.g=r.g;
this.a=r.a;
}else{
this.r=r;
this.g=g;
this.b=b;
this.a=a;
}
}
}
};
dojo.lang.extend(dojo.graphics.color.Color,{toRgb:function(_1e6){
if(_1e6){
return this.toRgba();
}else{
return [this.r,this.g,this.b];
}
},toRgba:function(){
return [this.r,this.g,this.b,this.a];
},toHex:function(){
return dojo.graphics.color.rgb2hex(this.toRgb());
},toCss:function(){
return "rgb("+this.toRgb().join()+")";
},toString:function(){
return this.toHex();
},toHsv:function(){
return dojo.graphics.color.rgb2hsv(this.toRgb());
},toHsl:function(){
return dojo.graphics.color.rgb2hsl(this.toRgb());
},blend:function(_1e7,_1e8){
return dojo.graphics.color.blend(this.toRgb(),new Color(_1e7).toRgb(),_1e8);
}});
dojo.graphics.color.named={white:[255,255,255],black:[0,0,0],red:[255,0,0],green:[0,255,0],blue:[0,0,255],navy:[0,0,128],gray:[128,128,128],silver:[192,192,192]};
dojo.graphics.color.blend=function(a,b,_1eb){
if(typeof a=="string"){
return dojo.graphics.color.blendHex(a,b,_1eb);
}
if(!_1eb){
_1eb=0;
}else{
if(_1eb>1){
_1eb=1;
}else{
if(_1eb<-1){
_1eb=-1;
}
}
}
var c=new Array(3);
for(var i=0;i<3;i++){
var half=Math.abs(a[i]-b[i])/2;
c[i]=Math.floor(Math.min(a[i],b[i])+half+(half*_1eb));
}
return c;
};
dojo.graphics.color.blendHex=function(a,b,_1f1){
return dojo.graphics.color.rgb2hex(dojo.graphics.color.blend(dojo.graphics.color.hex2rgb(a),dojo.graphics.color.hex2rgb(b),_1f1));
};
dojo.graphics.color.extractRGB=function(_1f2){
var hex="0123456789abcdef";
_1f2=_1f2.toLowerCase();
if(_1f2.indexOf("rgb")==0){
var _1f4=_1f2.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
var ret=_1f4.splice(1,3);
return ret;
}else{
var _1f6=dojo.graphics.color.hex2rgb(_1f2);
if(_1f6){
return _1f6;
}else{
return dojo.graphics.color.named[_1f2]||[255,255,255];
}
}
};
dojo.graphics.color.hex2rgb=function(hex){
var _1f8="0123456789ABCDEF";
var rgb=new Array(3);
if(hex.indexOf("#")==0){
hex=hex.substring(1);
}
hex=hex.toUpperCase();
if(hex.replace(new RegExp("["+_1f8+"]","g"),"")!=""){
return null;
}
if(hex.length==3){
rgb[0]=hex.charAt(0)+hex.charAt(0);
rgb[1]=hex.charAt(1)+hex.charAt(1);
rgb[2]=hex.charAt(2)+hex.charAt(2);
}else{
rgb[0]=hex.substring(0,2);
rgb[1]=hex.substring(2,4);
rgb[2]=hex.substring(4);
}
for(var i=0;i<rgb.length;i++){
rgb[i]=_1f8.indexOf(rgb[i].charAt(0))*16+_1f8.indexOf(rgb[i].charAt(1));
}
return rgb;
};
dojo.graphics.color.rgb2hex=function(r,g,b){
if(dojo.lang.isArray(r)){
g=r[1]||0;
b=r[2]||0;
r=r[0]||0;
}
return ["#",dojo.string.pad(r.toString(16),2),dojo.string.pad(g.toString(16),2),dojo.string.pad(b.toString(16),2)].join("");
};
dojo.graphics.color.rgb2hsv=function(r,g,b){
if(dojo.lang.isArray(r)){
b=r[2]||0;
g=r[1]||0;
r=r[0]||0;
}
var h=null;
var s=null;
var v=null;
var min=Math.min(r,g,b);
v=Math.max(r,g,b);
var _205=v-min;
s=(v==0)?0:_205/v;
if(s==0){
h=0;
}else{
if(r==v){
h=60*(g-b)/_205;
}else{
if(g==v){
h=120+60*(b-r)/_205;
}else{
if(b==v){
h=240+60*(r-g)/_205;
}
}
}
if(h<0){
h+=360;
}
}
h=(h==0)?360:Math.ceil((h/360)*255);
s=Math.ceil(s*255);
return [h,s,v];
};
dojo.graphics.color.hsv2rgb=function(h,s,v){
if(dojo.lang.isArray(h)){
v=h[2]||0;
s=h[1]||0;
h=h[0]||0;
}
h=(h/255)*360;
if(h==360){
h=0;
}
s=s/255;
v=v/255;
var r=null;
var g=null;
var b=null;
if(s==0){
r=v;
g=v;
b=v;
}else{
var _20c=h/60;
var i=Math.floor(_20c);
var f=_20c-i;
var p=v*(1-s);
var q=v*(1-(s*f));
var t=v*(1-(s*(1-f)));
switch(i){
case 0:
r=v;
g=t;
b=p;
break;
case 1:
r=q;
g=v;
b=p;
break;
case 2:
r=p;
g=v;
b=t;
break;
case 3:
r=p;
g=q;
b=v;
break;
case 4:
r=t;
g=p;
b=v;
break;
case 5:
r=v;
g=p;
b=q;
break;
}
}
r=Math.ceil(r*255);
g=Math.ceil(g*255);
b=Math.ceil(b*255);
return [r,g,b];
};
dojo.graphics.color.rgb2hsl=function(r,g,b){
if(dojo.lang.isArray(r)){
b=r[2]||0;
g=r[1]||0;
r=r[0]||0;
}
r/=255;
g/=255;
b/=255;
var h=null;
var s=null;
var l=null;
var min=Math.min(r,g,b);
var max=Math.max(r,g,b);
var _21a=max-min;
l=(min+max)/2;
s=0;
if((l>0)&&(l<1)){
s=_21a/((l<0.5)?(2*l):(2-2*l));
}
h=0;
if(_21a>0){
if((max==r)&&(max!=g)){
h+=(g-b)/_21a;
}
if((max==g)&&(max!=b)){
h+=(2+(b-r)/_21a);
}
if((max==b)&&(max!=r)){
h+=(4+(r-g)/_21a);
}
h*=60;
}
h=(h==0)?360:Math.ceil((h/360)*255);
s=Math.ceil(s*255);
l=Math.ceil(l*255);
return [h,s,l];
};
dojo.graphics.color.hsl2rgb=function(h,s,l){
if(dojo.lang.isArray(h)){
l=h[2]||0;
s=h[1]||0;
h=h[0]||0;
}
h=(h/255)*360;
if(h==360){
h=0;
}
s=s/255;
l=l/255;
while(h<0){
h+=360;
}
while(h>360){
h-=360;
}
if(h<120){
r=(120-h)/60;
g=h/60;
b=0;
}else{
if(h<240){
r=0;
g=(240-h)/60;
b=(h-120)/60;
}else{
r=(h-240)/60;
g=0;
b=(360-h)/60;
}
}
r=Math.min(r,1);
g=Math.min(g,1);
b=Math.min(b,1);
r=2*s*r+(1-s);
g=2*s*g+(1-s);
b=2*s*b+(1-s);
if(l<0.5){
r=l*r;
g=l*g;
b=l*b;
}else{
r=(1-l)*r+2*l-1;
g=(1-l)*g+2*l-1;
b=(1-l)*b+2*l-1;
}
r=Math.ceil(r*255);
g=Math.ceil(g*255);
b=Math.ceil(b*255);
return [r,g,b];
};
dojo.graphics.color.hsl2hex=function(h,s,l){
var rgb=dojo.graphics.color.hsl2rgb(h,s,l);
return dojo.graphics.color.rgb2hex(rgb[0],rgb[1],rgb[2]);
};
dojo.graphics.color.hex2hsl=function(hex){
var rgb=dojo.graphics.color.hex2rgb(hex);
return dojo.graphics.color.rgb2hsl(rgb[0],rgb[1],rgb[2]);
};
dojo.provide("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.uri.Uri");
dojo.require("dojo.graphics.color");
dojo.style.boxSizing={marginBox:"margin-box",borderBox:"border-box",paddingBox:"padding-box",contentBox:"content-box"};
dojo.style.getBoxSizing=function(node){
if(dojo.render.html.ie||dojo.render.html.opera){
var cm=document["compatMode"];
if(cm=="BackCompat"||cm=="QuirksMode"){
return dojo.style.boxSizing.borderBox;
}else{
return dojo.style.boxSizing.contentBox;
}
}else{
if(arguments.length==0){
node=document.documentElement;
}
var _226=dojo.style.getStyle(node,"-moz-box-sizing");
if(!_226){
_226=dojo.style.getStyle(node,"box-sizing");
}
return (_226?_226:dojo.style.boxSizing.contentBox);
}
};
dojo.style.isBorderBox=function(node){
return (dojo.style.getBoxSizing(node)==dojo.style.boxSizing.borderBox);
};
dojo.style.getUnitValue=function(_228,_229,_22a){
var _22b={value:0,units:"px"};
var s=dojo.style.getComputedStyle(_228,_229);
if(s==""||(s=="auto"&&_22a)){
return _22b;
}
if(dojo.lang.isUndefined(s)){
_22b.value=NaN;
}else{
var _22d=s.match(/([\d.]+)([a-z%]*)/i);
if(!_22d){
_22b.value=NaN;
}else{
_22b.value=Number(_22d[1]);
_22b.units=_22d[2].toLowerCase();
}
}
return _22b;
};
dojo.style.getPixelValue=function(_22e,_22f,_230){
var _231=dojo.style.getUnitValue(_22e,_22f,_230);
if(isNaN(_231.value)){
return 0;
}
if((_231.value)&&(_231.units!="px")){
return NaN;
}
return _231.value;
};
dojo.style.getNumericStyle=dojo.style.getPixelValue;
dojo.style.isPositionAbsolute=function(node){
return (dojo.style.getComputedStyle(node,"position")=="absolute");
};
dojo.style.getMarginWidth=function(node){
var _234=dojo.style.isPositionAbsolute(node);
var left=dojo.style.getPixelValue(node,"margin-left",_234);
var _236=dojo.style.getPixelValue(node,"margin-right",_234);
return left+_236;
};
dojo.style.getBorderWidth=function(node){
var left=(dojo.style.getStyle(node,"border-left-style")=="none"?0:dojo.style.getPixelValue(node,"border-left-width"));
var _239=(dojo.style.getStyle(node,"border-right-style")=="none"?0:dojo.style.getPixelValue(node,"border-right-width"));
return left+_239;
};
dojo.style.getPaddingWidth=function(node){
var left=dojo.style.getPixelValue(node,"padding-left",true);
var _23c=dojo.style.getPixelValue(node,"padding-right",true);
return left+_23c;
};
dojo.style.getContentWidth=function(node){
return node.offsetWidth-dojo.style.getPaddingWidth(node)-dojo.style.getBorderWidth(node);
};
dojo.style.getInnerWidth=function(node){
return node.offsetWidth;
};
dojo.style.getOuterWidth=function(node){
return dojo.style.getInnerWidth(node)+dojo.style.getMarginWidth(node);
};
dojo.style.setOuterWidth=function(node,_241){
if(!dojo.style.isBorderBox(node)){
_241-=dojo.style.getPaddingWidth(node)+dojo.style.getBorderWidth(node);
}
_241-=dojo.style.getMarginWidth(node);
if(!isNaN(_241)&&_241>0){
node.style.width=_241+"px";
return true;
}else{
return false;
}
};
dojo.style.getContentBoxWidth=dojo.style.getContentWidth;
dojo.style.getBorderBoxWidth=dojo.style.getInnerWidth;
dojo.style.getMarginBoxWidth=dojo.style.getOuterWidth;
dojo.style.setMarginBoxWidth=dojo.style.setOuterWidth;
dojo.style.getMarginHeight=function(node){
var _243=dojo.style.isPositionAbsolute(node);
var top=dojo.style.getPixelValue(node,"margin-top",_243);
var _245=dojo.style.getPixelValue(node,"margin-bottom",_243);
return top+_245;
};
dojo.style.getBorderHeight=function(node){
var top=(dojo.style.getStyle(node,"border-top-style")=="none"?0:dojo.style.getPixelValue(node,"border-top-width"));
var _248=(dojo.style.getStyle(node,"border-bottom-style")=="none"?0:dojo.style.getPixelValue(node,"border-bottom-width"));
return top+_248;
};
dojo.style.getPaddingHeight=function(node){
var top=dojo.style.getPixelValue(node,"padding-top",true);
var _24b=dojo.style.getPixelValue(node,"padding-bottom",true);
return top+_24b;
};
dojo.style.getContentHeight=function(node){
return node.offsetHeight-dojo.style.getPaddingHeight(node)-dojo.style.getBorderHeight(node);
};
dojo.style.getInnerHeight=function(node){
return node.offsetHeight;
};
dojo.style.getOuterHeight=function(node){
return dojo.style.getInnerHeight(node)+dojo.style.getMarginHeight(node);
};
dojo.style.setOuterHeight=function(node,_250){
if(!dojo.style.isBorderBox(node)){
_250-=dojo.style.getPaddingHeight(node)+dojo.style.getBorderHeight(node);
}
_250-=dojo.style.getMarginHeight(node);
if(!isNaN(_250)&&_250>0){
node.style.height=_250+"px";
return true;
}else{
return false;
}
};
dojo.style.setContentWidth=function(node,_252){
if(dojo.style.isBorderBox(node)){
_252+=dojo.style.getPaddingWidth(node)+dojo.style.getBorderWidth(node);
}
if(!isNaN(_252)&&_252>0){
node.style.width=_252+"px";
return true;
}else{
return false;
}
};
dojo.style.setContentHeight=function(node,_254){
if(dojo.style.isBorderBox(node)){
_254+=dojo.style.getPaddingHeight(node)+dojo.style.getBorderHeight(node);
}
if(!isNaN(_254)&&_254>0){
node.style.height=_254+"px";
return true;
}else{
return false;
}
};
dojo.style.getContentBoxHeight=dojo.style.getContentHeight;
dojo.style.getBorderBoxHeight=dojo.style.getInnerHeight;
dojo.style.getMarginBoxHeight=dojo.style.getOuterHeight;
dojo.style.setMarginBoxHeight=dojo.style.setOuterHeight;
dojo.style.getTotalOffset=function(node,type,_257){
var _258=(type=="top")?"offsetTop":"offsetLeft";
var _259=(type=="top")?"scrollTop":"scrollLeft";
var _25a=(type=="top")?"y":"x";
var _25b=0;
if(node["offsetParent"]){
if(dojo.render.html.safari&&node.style.getPropertyValue("position")=="absolute"&&node.parentNode==dojo.html.body()){
var _25c=dojo.html.body();
}else{
var _25c=dojo.html.body().parentNode;
}
if(_257&&node.parentNode!=document.body){
_25b-=dojo.style.sumAncestorProperties(node,_259);
}
do{
_25b+=node[_258];
node=node.offsetParent;
}while(node!=_25c&&node!=null);
}else{
if(node[_25a]){
_25b+=node[_25a];
}
}
return _25b;
};
dojo.style.sumAncestorProperties=function(node,prop){
if(!node){
return 0;
}
var _25f=0;
while(node){
var val=node[prop];
if(val){
_25f+=val-0;
}
node=node.parentNode;
}
return _25f;
};
dojo.style.totalOffsetLeft=function(node,_262){
return dojo.style.getTotalOffset(node,"left",_262);
};
dojo.style.getAbsoluteX=dojo.style.totalOffsetLeft;
dojo.style.totalOffsetTop=function(node,_264){
return dojo.style.getTotalOffset(node,"top",_264);
};
dojo.style.getAbsoluteY=dojo.style.totalOffsetTop;
dojo.style.getAbsolutePosition=function(node,_266){
var _267=[dojo.style.getAbsoluteX(node,_266),dojo.style.getAbsoluteY(node,_266)];
_267.x=_267[0];
_267.y=_267[1];
return _267;
};
dojo.style.styleSheet=null;
dojo.style.insertCssRule=function(_268,_269,_26a){
if(!dojo.style.styleSheet){
if(document.createStyleSheet){
dojo.style.styleSheet=document.createStyleSheet();
}else{
if(document.styleSheets[0]){
dojo.style.styleSheet=document.styleSheets[0];
}else{
return null;
}
}
}
if(arguments.length<3){
if(dojo.style.styleSheet.cssRules){
_26a=dojo.style.styleSheet.cssRules.length;
}else{
if(dojo.style.styleSheet.rules){
_26a=dojo.style.styleSheet.rules.length;
}else{
return null;
}
}
}
if(dojo.style.styleSheet.insertRule){
var rule=_268+" { "+_269+" }";
return dojo.style.styleSheet.insertRule(rule,_26a);
}else{
if(dojo.style.styleSheet.addRule){
return dojo.style.styleSheet.addRule(_268,_269,_26a);
}else{
return null;
}
}
};
dojo.style.removeCssRule=function(_26c){
if(!dojo.style.styleSheet){
dojo.debug("no stylesheet defined for removing rules");
return false;
}
if(dojo.render.html.ie){
if(!_26c){
_26c=dojo.style.styleSheet.rules.length;
dojo.style.styleSheet.removeRule(_26c);
}
}else{
if(document.styleSheets[0]){
if(!_26c){
_26c=dojo.style.styleSheet.cssRules.length;
}
dojo.style.styleSheet.deleteRule(_26c);
}
}
return true;
};
dojo.style.insertCssFile=function(URI,doc,_26f){
if(!URI){
return;
}
if(!doc){
doc=document;
}
var _270=dojo.hostenv.getText(URI);
var _270=dojo.style.fixPathsInCssText(_270,URI);
if(_26f){
var _271=doc.getElementsByTagName("style");
var _272="";
for(var i=0;i<_271.length;i++){
_272=(_271[i].styleSheet&&_271[i].styleSheet.cssText)?_271[i].styleSheet.cssText:_271[i].innerHTML;
if(_270==_272){
return;
}
}
}
var _274=dojo.style.insertCssText(_270);
if(_274&&djConfig.isDebug){
_274.setAttribute("dbgHref",URI);
}
return _274;
};
dojo.style.insertCssText=function(_275,doc,URI){
if(!_275){
return;
}
if(!doc){
doc=document;
}
if(URI){
_275=dojo.style.fixPathsInCssText(_275,URI);
}
var _278=doc.createElement("style");
_278.setAttribute("type","text/css");
if(_278.styleSheet){
_278.styleSheet.cssText=_275;
}else{
var _279=doc.createTextNode(_275);
_278.appendChild(_279);
}
var head=doc.getElementsByTagName("head")[0];
if(head){
head.appendChild(_278);
}
return _278;
};
dojo.style.fixPathsInCssText=function(_27b,URI){
if(!_27b||!URI){
return;
}
var pos=0;
var str="";
var url="";
while(pos!=-1){
pos=0;
url="";
pos=_27b.indexOf("url(",pos);
if(pos<0){
break;
}
str+=_27b.slice(0,pos+4);
_27b=_27b.substring(pos+4,_27b.length);
url+=_27b.match(/^[\t\s\w()\/.\\'"-:#=&?]*\)/)[0];
_27b=_27b.substring(url.length-1,_27b.length);
url=url.replace(/^[\s\t]*(['"]?)([\w()\/.\\'"-:#=&?]*)\1[\s\t]*?\)/,"$2");
if(url.search(/(file|https?|ftps?):\/\//)==-1){
url=(new dojo.uri.Uri(URI,url).toString());
}
str+=url;
}
return str+_27b;
};
dojo.style.getBackgroundColor=function(node){
var _281;
do{
_281=dojo.style.getStyle(node,"background-color");
if(_281.toLowerCase()=="rgba(0, 0, 0, 0)"){
_281="transparent";
}
if(node==document.getElementsByTagName("body")[0]){
node=null;
break;
}
node=node.parentNode;
}while(node&&dojo.lang.inArray(_281,["transparent",""]));
if(_281=="transparent"){
_281=[255,255,255,0];
}else{
_281=dojo.graphics.color.extractRGB(_281);
}
return _281;
};
dojo.style.getComputedStyle=function(_282,_283,_284){
var _285=_284;
if(_282.style.getPropertyValue){
_285=_282.style.getPropertyValue(_283);
}
if(!_285){
if(document.defaultView){
var cs=document.defaultView.getComputedStyle(_282,"");
if(cs){
_285=cs.getPropertyValue(_283);
}
}else{
if(_282.currentStyle){
_285=_282.currentStyle[dojo.style.toCamelCase(_283)];
}
}
}
return _285;
};
dojo.style.getStyle=function(_287,_288){
var _289=dojo.style.toCamelCase(_288);
var _28a=_287.style[_289];
return (_28a?_28a:dojo.style.getComputedStyle(_287,_288,_28a));
};
dojo.style.toCamelCase=function(_28b){
var arr=_28b.split("-"),cc=arr[0];
for(var i=1;i<arr.length;i++){
cc+=arr[i].charAt(0).toUpperCase()+arr[i].substring(1);
}
return cc;
};
dojo.style.toSelectorCase=function(_28e){
return _28e.replace(/([A-Z])/g,"-$1").toLowerCase();
};
dojo.style.setOpacity=function setOpacity(node,_290,_291){
node=dojo.byId(node);
var h=dojo.render.html;
if(!_291){
if(_290>=1){
if(h.ie){
dojo.style.clearOpacity(node);
return;
}else{
_290=0.999999;
}
}else{
if(_290<0){
_290=0;
}
}
}
if(h.ie){
if(node.nodeName.toLowerCase()=="tr"){
var tds=node.getElementsByTagName("td");
for(var x=0;x<tds.length;x++){
tds[x].style.filter="Alpha(Opacity="+_290*100+")";
}
}
node.style.filter="Alpha(Opacity="+_290*100+")";
}else{
if(h.moz){
node.style.opacity=_290;
node.style.MozOpacity=_290;
}else{
if(h.safari){
node.style.opacity=_290;
node.style.KhtmlOpacity=_290;
}else{
node.style.opacity=_290;
}
}
}
};
dojo.style.getOpacity=function getOpacity(node){
if(dojo.render.html.ie){
var opac=(node.filters&&node.filters.alpha&&typeof node.filters.alpha.opacity=="number"?node.filters.alpha.opacity:100)/100;
}else{
var opac=node.style.opacity||node.style.MozOpacity||node.style.KhtmlOpacity||1;
}
return opac>=0.999999?1:Number(opac);
};
dojo.style.clearOpacity=function clearOpacity(node){
var h=dojo.render.html;
if(h.ie){
if(node.filters&&node.filters.alpha){
node.style.filter="";
}
}else{
if(h.moz){
node.style.opacity=1;
node.style.MozOpacity=1;
}else{
if(h.safari){
node.style.opacity=1;
node.style.KhtmlOpacity=1;
}else{
node.style.opacity=1;
}
}
}
};
dojo.provide("dojo.html");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dojo.require("dojo.string");
dojo.lang.mixin(dojo.html,dojo.dom);
dojo.lang.mixin(dojo.html,dojo.style);
dojo.html.clearSelection=function(){
try{
if(window["getSelection"]){
if(dojo.render.html.safari){
window.getSelection().collapse();
}else{
window.getSelection().removeAllRanges();
}
}else{
if(document.selection){
if(document.selection.empty){
document.selection.empty();
}else{
if(document.selection.clear){
document.selection.clear();
}
}
}
}
return true;
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.html.disableSelection=function(_299){
_299=dojo.byId(_299)||dojo.html.body();
var h=dojo.render.html;
if(h.mozilla){
_299.style.MozUserSelect="none";
}else{
if(h.safari){
_299.style.KhtmlUserSelect="none";
}else{
if(h.ie){
_299.unselectable="on";
}else{
return false;
}
}
}
return true;
};
dojo.html.enableSelection=function(_29b){
_29b=dojo.byId(_29b)||dojo.html.body();
var h=dojo.render.html;
if(h.mozilla){
_29b.style.MozUserSelect="";
}else{
if(h.safari){
_29b.style.KhtmlUserSelect="";
}else{
if(h.ie){
_29b.unselectable="off";
}else{
return false;
}
}
}
return true;
};
dojo.html.selectElement=function(_29d){
_29d=dojo.byId(_29d);
if(document.selection&&dojo.html.body().createTextRange){
var _29e=dojo.html.body().createTextRange();
_29e.moveToElementText(_29d);
_29e.select();
}else{
if(window["getSelection"]){
var _29f=window.getSelection();
if(_29f["selectAllChildren"]){
_29f.selectAllChildren(_29d);
}
}
}
};
dojo.html.isSelectionCollapsed=function(){
if(document["selection"]){
return document.selection.createRange().text=="";
}else{
if(window["getSelection"]){
var _2a0=window.getSelection();
if(dojo.lang.isString(_2a0)){
return _2a0=="";
}else{
return _2a0.isCollapsed;
}
}
}
};
dojo.html.getEventTarget=function(evt){
if(!evt){
evt=window.event||{};
}
if(evt.srcElement){
return evt.srcElement;
}else{
if(evt.target){
return evt.target;
}
}
return null;
};
dojo.html.getScrollTop=function(){
return document.documentElement.scrollTop||dojo.html.body().scrollTop||0;
};
dojo.html.getScrollLeft=function(){
return document.documentElement.scrollLeft||dojo.html.body().scrollLeft||0;
};
dojo.html.getDocumentWidth=function(){
dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
return dojo.html.getViewportWidth();
};
dojo.html.getDocumentHeight=function(){
dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
return dojo.html.getViewportHeight();
};
dojo.html.getDocumentSize=function(){
dojo.deprecated("dojo.html.getDocument* has been deprecated in favor of dojo.html.getViewport*");
return dojo.html.getViewportSize();
};
dojo.html.getViewportWidth=function(){
var w=0;
if(window.innerWidth){
w=window.innerWidth;
}
if(dojo.exists(document,"documentElement.clientWidth")){
var w2=document.documentElement.clientWidth;
if(!w||w2&&w2<w){
w=w2;
}
return w;
}
if(document.body){
return document.body.clientWidth;
}
return 0;
};
dojo.html.getViewportHeight=function(){
if(window.innerHeight){
return window.innerHeight;
}
if(dojo.exists(document,"documentElement.clientHeight")){
return document.documentElement.clientHeight;
}
if(document.body){
return document.body.clientHeight;
}
return 0;
};
dojo.html.getViewportSize=function(){
var ret=[dojo.html.getViewportWidth(),dojo.html.getViewportHeight()];
ret.w=ret[0];
ret.h=ret[1];
return ret;
};
dojo.html.getScrollOffset=function(){
var ret=[0,0];
if(window.pageYOffset){
ret=[window.pageXOffset,window.pageYOffset];
}else{
if(dojo.exists(document,"documentElement.scrollTop")){
ret=[document.documentElement.scrollLeft,document.documentElement.scrollTop];
}else{
if(document.body){
ret=[document.body.scrollLeft,document.body.scrollTop];
}
}
}
ret.x=ret[0];
ret.y=ret[1];
return ret;
};
dojo.html.getParentOfType=function(node,type){
dojo.deprecated("dojo.html.getParentOfType has been deprecated in favor of dojo.html.getParentByType*");
return dojo.html.getParentByType(node,type);
};
dojo.html.getParentByType=function(node,type){
var _2aa=dojo.byId(node);
type=type.toLowerCase();
while((_2aa)&&(_2aa.nodeName.toLowerCase()!=type)){
if(_2aa==(document["body"]||document["documentElement"])){
return null;
}
_2aa=_2aa.parentNode;
}
return _2aa;
};
dojo.html.getAttribute=function(node,attr){
node=dojo.byId(node);
if((!node)||(!node.getAttribute)){
return null;
}
var ta=typeof attr=="string"?attr:new String(attr);
var v=node.getAttribute(ta.toUpperCase());
if((v)&&(typeof v=="string")&&(v!="")){
return v;
}
if(v&&v.value){
return v.value;
}
if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
return (node.getAttributeNode(ta)).value;
}else{
if(node.getAttribute(ta)){
return node.getAttribute(ta);
}else{
if(node.getAttribute(ta.toLowerCase())){
return node.getAttribute(ta.toLowerCase());
}
}
}
return null;
};
dojo.html.hasAttribute=function(node,attr){
node=dojo.byId(node);
return dojo.html.getAttribute(node,attr)?true:false;
};
dojo.html.getClass=function(node){
node=dojo.byId(node);
if(!node){
return "";
}
var cs="";
if(node.className){
cs=node.className;
}else{
if(dojo.html.hasAttribute(node,"class")){
cs=dojo.html.getAttribute(node,"class");
}
}
return dojo.string.trim(cs);
};
dojo.html.getClasses=function(node){
node=dojo.byId(node);
var c=dojo.html.getClass(node);
return (c=="")?[]:c.split(/\s+/g);
};
dojo.html.hasClass=function(node,_2b6){
node=dojo.byId(node);
return dojo.lang.inArray(dojo.html.getClasses(node),_2b6);
};
dojo.html.prependClass=function(node,_2b8){
node=dojo.byId(node);
if(!node){
return false;
}
_2b8+=" "+dojo.html.getClass(node);
return dojo.html.setClass(node,_2b8);
};
dojo.html.addClass=function(node,_2ba){
node=dojo.byId(node);
if(!node){
return false;
}
if(dojo.html.hasClass(node,_2ba)){
return false;
}
_2ba=dojo.string.trim(dojo.html.getClass(node)+" "+_2ba);
return dojo.html.setClass(node,_2ba);
};
dojo.html.setClass=function(node,_2bc){
node=dojo.byId(node);
if(!node){
return false;
}
var cs=new String(_2bc);
try{
if(typeof node.className=="string"){
node.className=cs;
}else{
if(node.setAttribute){
node.setAttribute("class",_2bc);
node.className=cs;
}else{
return false;
}
}
}
catch(e){
dojo.debug("dojo.html.setClass() failed",e);
}
return true;
};
dojo.html.removeClass=function(node,_2bf,_2c0){
node=dojo.byId(node);
if(!node){
return false;
}
var _2bf=dojo.string.trim(new String(_2bf));
try{
var cs=dojo.html.getClasses(node);
var nca=[];
if(_2c0){
for(var i=0;i<cs.length;i++){
if(cs[i].indexOf(_2bf)==-1){
nca.push(cs[i]);
}
}
}else{
for(var i=0;i<cs.length;i++){
if(cs[i]!=_2bf){
nca.push(cs[i]);
}
}
}
dojo.html.setClass(node,nca.join(" "));
}
catch(e){
dojo.debug("dojo.html.removeClass() failed",e);
}
return true;
};
dojo.html.replaceClass=function(node,_2c5,_2c6){
node=dojo.byId(node);
dojo.html.removeClass(node,_2c6);
dojo.html.addClass(node,_2c5);
};
dojo.html.classMatchType={ContainsAll:0,ContainsAny:1,IsOnly:2};
dojo.html.getElementsByClass=function(_2c7,_2c8,_2c9,_2ca){
_2c8=dojo.byId(_2c8);
if(!_2c8){
_2c8=document;
}
var _2cb=_2c7.split(/\s+/g);
var _2cc=[];
if(_2ca!=1&&_2ca!=2){
_2ca=0;
}
var _2cd=new RegExp("(\\s|^)(("+_2cb.join(")|(")+"))(\\s|$)");
if(!_2c9){
_2c9="*";
}
var _2ce=_2c8.getElementsByTagName(_2c9);
outer:
for(var i=0;i<_2ce.length;i++){
var node=_2ce[i];
var _2d1=dojo.html.getClasses(node);
if(_2d1.length==0){
continue outer;
}
var _2d2=0;
for(var j=0;j<_2d1.length;j++){
if(_2cd.test(_2d1[j])){
if(_2ca==dojo.html.classMatchType.ContainsAny){
_2cc.push(node);
continue outer;
}else{
_2d2++;
}
}else{
if(_2ca==dojo.html.classMatchType.IsOnly){
continue outer;
}
}
}
if(_2d2==_2cb.length){
if(_2ca==dojo.html.classMatchType.IsOnly&&_2d2==_2d1.length){
_2cc.push(node);
}else{
if(_2ca==dojo.html.classMatchType.ContainsAll){
_2cc.push(node);
}
}
}
}
return _2cc;
};
dojo.html.getElementsByClassName=dojo.html.getElementsByClass;
dojo.html.gravity=function(node,e){
node=dojo.byId(node);
var _2d6=e.pageX||e.clientX+dojo.html.body().scrollLeft;
var _2d7=e.pageY||e.clientY+dojo.html.body().scrollTop;
with(dojo.html){
var _2d8=getAbsoluteX(node)+(getInnerWidth(node)/2);
var _2d9=getAbsoluteY(node)+(getInnerHeight(node)/2);
}
with(dojo.html.gravity){
return ((_2d6<_2d8?WEST:EAST)|(_2d7<_2d9?NORTH:SOUTH));
}
};
dojo.html.gravity.NORTH=1;
dojo.html.gravity.SOUTH=1<<1;
dojo.html.gravity.EAST=1<<2;
dojo.html.gravity.WEST=1<<3;
dojo.html.overElement=function(_2da,e){
_2da=dojo.byId(_2da);
var _2dc=e.pageX||e.clientX+dojo.html.body().scrollLeft;
var _2dd=e.pageY||e.clientY+dojo.html.body().scrollTop;
with(dojo.html){
var top=getAbsoluteY(_2da);
var _2df=top+getInnerHeight(_2da);
var left=getAbsoluteX(_2da);
var _2e1=left+getInnerWidth(_2da);
}
return (_2dc>=left&&_2dc<=_2e1&&_2dd>=top&&_2dd<=_2df);
};
dojo.html.renderedTextContent=function(node){
node=dojo.byId(node);
var _2e3="";
if(node==null){
return _2e3;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
var _2e5="unknown";
try{
_2e5=dojo.style.getStyle(node.childNodes[i],"display");
}
catch(E){
}
switch(_2e5){
case "block":
case "list-item":
case "run-in":
case "table":
case "table-row-group":
case "table-header-group":
case "table-footer-group":
case "table-row":
case "table-column-group":
case "table-column":
case "table-cell":
case "table-caption":
_2e3+="\n";
_2e3+=dojo.html.renderedTextContent(node.childNodes[i]);
_2e3+="\n";
break;
case "none":
break;
default:
if(node.childNodes[i].tagName&&node.childNodes[i].tagName.toLowerCase()=="br"){
_2e3+="\n";
}else{
_2e3+=dojo.html.renderedTextContent(node.childNodes[i]);
}
break;
}
break;
case 3:
case 2:
case 4:
var text=node.childNodes[i].nodeValue;
var _2e7="unknown";
try{
_2e7=dojo.style.getStyle(node,"text-transform");
}
catch(E){
}
switch(_2e7){
case "capitalize":
text=dojo.string.capitalize(text);
break;
case "uppercase":
text=text.toUpperCase();
break;
case "lowercase":
text=text.toLowerCase();
break;
default:
break;
}
switch(_2e7){
case "nowrap":
break;
case "pre-wrap":
break;
case "pre-line":
break;
case "pre":
break;
default:
text=text.replace(/\s+/," ");
if(/\s$/.test(_2e3)){
text.replace(/^\s/,"");
}
break;
}
_2e3+=text;
break;
default:
break;
}
}
return _2e3;
};
dojo.html.setActiveStyleSheet=function(_2e8){
var i,a,main;
for(i=0;(a=document.getElementsByTagName("link")[i]);i++){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")){
a.disabled=true;
if(a.getAttribute("title")==_2e8){
a.disabled=false;
}
}
}
};
dojo.html.getActiveStyleSheet=function(){
var i,a;
for(i=0;(a=document.getElementsByTagName("link")[i]);i++){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")&&!a.disabled){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.getPreferredStyleSheet=function(){
var i,a;
for(i=0;(a=document.getElementsByTagName("link")[i]);i++){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("rel").indexOf("alt")==-1&&a.getAttribute("title")){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.body=function(){
return document.body||document.getElementsByTagName("body")[0];
};
dojo.html.createNodesFromText=function(txt,trim){
if(trim){
txt=dojo.string.trim(txt);
}
var tn=document.createElement("div");
tn.style.visibility="hidden";
document.body.appendChild(tn);
var _2ef="none";
if((/^<t[dh][\s\r\n>]/i).test(dojo.string.trimStart(txt))){
txt="<table><tbody><tr>"+txt+"</tr></tbody></table>";
_2ef="cell";
}else{
if((/^<tr[\s\r\n>]/i).test(dojo.string.trimStart(txt))){
txt="<table><tbody>"+txt+"</tbody></table>";
_2ef="row";
}else{
if((/^<(thead|tbody|tfoot)[\s\r\n>]/i).test(dojo.string.trimStart(txt))){
txt="<table>"+txt+"</table>";
_2ef="section";
}
}
}
tn.innerHTML=txt;
tn.normalize();
var _2f0=null;
switch(_2ef){
case "cell":
_2f0=tn.getElementsByTagName("tr")[0];
break;
case "row":
_2f0=tn.getElementsByTagName("tbody")[0];
break;
case "section":
_2f0=tn.getElementsByTagName("table")[0];
break;
default:
_2f0=tn;
break;
}
var _2f1=[];
for(var x=0;x<_2f0.childNodes.length;x++){
_2f1.push(_2f0.childNodes[x].cloneNode(true));
}
tn.style.display="none";
document.body.removeChild(tn);
return _2f1;
};
if(!dojo.evalObjPath("dojo.dom.createNodesFromText")){
dojo.dom.createNodesFromText=function(){
dojo.deprecated("dojo.dom.createNodesFromText","use dojo.html.createNodesFromText instead");
return dojo.html.createNodesFromText.apply(dojo.html,arguments);
};
}
dojo.html.isVisible=function(node){
node=dojo.byId(node);
return dojo.style.getComputedStyle(node||this.domNode,"display")!="none";
};
dojo.html.show=function(node){
node=dojo.byId(node);
if(node.style){
node.style.display=dojo.lang.inArray(["tr","td","th"],node.tagName.toLowerCase())?"":"block";
}
};
dojo.html.hide=function(node){
node=dojo.byId(node);
if(node.style){
node.style.display="none";
}
};
dojo.html.toggleVisible=function(node){
if(dojo.html.isVisible(node)){
dojo.html.hide(node);
return false;
}else{
dojo.html.show(node);
return true;
}
};
dojo.html.isTag=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
var arr=dojo.lang.map(dojo.lang.toArray(arguments,1),function(a){
return String(a).toLowerCase();
});
return arr[dojo.lang.find(node.tagName.toLowerCase(),arr)]||"";
}
return "";
};
dojo.html.toCoordinateArray=function(_2fa,_2fb){
if(dojo.lang.isArray(_2fa)){
while(_2fa.length<4){
_2fa.push(0);
}
while(_2fa.length>4){
_2fa.pop();
}
var ret=_2fa;
}else{
var node=dojo.byId(_2fa);
var ret=[dojo.html.getAbsoluteX(node,_2fb),dojo.html.getAbsoluteY(node,_2fb),dojo.html.getInnerWidth(node),dojo.html.getInnerHeight(node)];
}
ret.x=ret[0];
ret.y=ret[1];
ret.w=ret[2];
ret.h=ret[3];
return ret;
};
dojo.html.placeOnScreen=function(node,_2ff,_300,_301,_302){
if(dojo.lang.isArray(_2ff)){
_302=_301;
_301=_300;
_300=_2ff[1];
_2ff=_2ff[0];
}
if(!isNaN(_301)){
_301=[Number(_301),Number(_301)];
}else{
if(!dojo.lang.isArray(_301)){
_301=[0,0];
}
}
var _303=dojo.html.getScrollOffset();
var view=dojo.html.getViewportSize();
node=dojo.byId(node);
var w=node.offsetWidth+_301[0];
var h=node.offsetHeight+_301[1];
if(_302){
_2ff-=_303.x;
_300-=_303.y;
}
var x=_2ff+w;
if(x>view.w){
x=view.w-w;
}else{
x=_2ff;
}
x=Math.max(_301[0],x)+_303.x;
var y=_300+h;
if(y>view.h){
y=view.h-h;
}else{
y=_300;
}
y=Math.max(_301[1],y)+_303.y;
node.style.left=x+"px";
node.style.top=y+"px";
var ret=[x,y];
ret.x=x;
ret.y=y;
return ret;
};
dojo.html.placeOnScreenPoint=function(node,_30b,_30c,_30d,_30e){
if(dojo.lang.isArray(_30b)){
_30e=_30d;
_30d=_30c;
_30c=_30b[1];
_30b=_30b[0];
}
var _30f=dojo.html.getScrollOffset();
var view=dojo.html.getViewportSize();
node=dojo.byId(node);
var w=node.offsetWidth;
var h=node.offsetHeight;
if(_30e){
_30b-=_30f.x;
_30c-=_30f.y;
}
var x=-1,y=-1;
if(_30b+w<=view.w&&_30c+h<=view.h){
x=_30b;
y=_30c;
}
if((x<0||y<0)&&_30b<=view.w&&_30c+h<=view.h){
x=_30b-w;
y=_30c;
}
if((x<0||y<0)&&_30b+w<=view.w&&_30c<=view.h){
x=_30b;
y=_30c-h;
}
if((x<0||y<0)&&_30b<=view.w&&_30c<=view.h){
x=_30b-w;
y=_30c-h;
}
if(x<0||y<0||(x+w>view.w)||(y+h>view.h)){
return dojo.html.placeOnScreen(node,_30b,_30c,_30d,_30e);
}
x+=_30f.x;
y+=_30f.y;
node.style.left=x+"px";
node.style.top=y+"px";
var ret=[x,y];
ret.x=x;
ret.y=y;
return ret;
};
dojo.html.BackgroundIframe=function(){
if(this.ie){
this.iframe=document.createElement("<iframe frameborder='0' src='about:blank'>");
var s=this.iframe.style;
s.position="absolute";
s.left=s.top="0px";
s.zIndex=2;
s.display="none";
dojo.style.setOpacity(this.iframe,0);
dojo.html.body().appendChild(this.iframe);
}else{
this.enabled=false;
}
};
dojo.lang.extend(dojo.html.BackgroundIframe,{ie:dojo.render.html.ie,enabled:true,visibile:false,iframe:null,sizeNode:null,sizeCoords:null,size:function(node){
if(!this.ie||!this.enabled){
return;
}
if(dojo.dom.isNode(node)){
this.sizeNode=node;
}else{
if(arguments.length>0){
this.sizeNode=null;
this.sizeCoords=node;
}
}
this.update();
},update:function(){
if(!this.ie||!this.enabled){
return;
}
if(this.sizeNode){
this.sizeCoords=dojo.html.toCoordinateArray(this.sizeNode,true);
}else{
if(this.sizeCoords){
this.sizeCoords=dojo.html.toCoordinateArray(this.sizeCoords,true);
}else{
return;
}
}
var s=this.iframe.style;
var dims=this.sizeCoords;
s.width=dims.w+"px";
s.height=dims.h+"px";
s.left=dims.x+"px";
s.top=dims.y+"px";
},setZIndex:function(node){
if(!this.ie||!this.enabled){
return;
}
if(dojo.dom.isNode(node)){
this.iframe.zIndex=dojo.html.getStyle(node,"z-index")-1;
}else{
if(!isNaN(node)){
this.iframe.zIndex=node;
}
}
},show:function(node){
if(!this.ie||!this.enabled){
return;
}
this.size(node);
this.iframe.style.display="block";
},hide:function(){
if(!this.ie){
return;
}
var s=this.iframe.style;
s.display="none";
s.width=s.height="1px";
},remove:function(){
dojo.dom.removeNode(this.iframe);
}});
dojo.provide("dojo.math.curves");
dojo.require("dojo.math");
dojo.math.curves={Line:function(_31c,end){
this.start=_31c;
this.end=end;
this.dimensions=_31c.length;
for(var i=0;i<_31c.length;i++){
_31c[i]=Number(_31c[i]);
}
for(var i=0;i<end.length;i++){
end[i]=Number(end[i]);
}
this.getValue=function(n){
var _320=new Array(this.dimensions);
for(var i=0;i<this.dimensions;i++){
_320[i]=((this.end[i]-this.start[i])*n)+this.start[i];
}
return _320;
};
return this;
},Bezier:function(pnts){
this.getValue=function(step){
if(step>=1){
return this.p[this.p.length-1];
}
if(step<=0){
return this.p[0];
}
var _324=new Array(this.p[0].length);
for(var k=0;j<this.p[0].length;k++){
_324[k]=0;
}
for(var j=0;j<this.p[0].length;j++){
var C=0;
var D=0;
for(var i=0;i<this.p.length;i++){
C+=this.p[i][j]*this.p[this.p.length-1][0]*dojo.math.bernstein(step,this.p.length,i);
}
for(var l=0;l<this.p.length;l++){
D+=this.p[this.p.length-1][0]*dojo.math.bernstein(step,this.p.length,l);
}
_324[j]=C/D;
}
return _324;
};
this.p=pnts;
return this;
},CatmullRom:function(pnts,c){
this.getValue=function(step){
var _32e=step*(this.p.length-1);
var node=Math.floor(_32e);
var _330=_32e-node;
var i0=node-1;
if(i0<0){
i0=0;
}
var i=node;
var i1=node+1;
if(i1>=this.p.length){
i1=this.p.length-1;
}
var i2=node+2;
if(i2>=this.p.length){
i2=this.p.length-1;
}
var u=_330;
var u2=_330*_330;
var u3=_330*_330*_330;
var _338=new Array(this.p[0].length);
for(var k=0;k<this.p[0].length;k++){
var x1=(-this.c*this.p[i0][k])+((2-this.c)*this.p[i][k])+((this.c-2)*this.p[i1][k])+(this.c*this.p[i2][k]);
var x2=(2*this.c*this.p[i0][k])+((this.c-3)*this.p[i][k])+((3-2*this.c)*this.p[i1][k])+(-this.c*this.p[i2][k]);
var x3=(-this.c*this.p[i0][k])+(this.c*this.p[i1][k]);
var x4=this.p[i][k];
_338[k]=x1*u3+x2*u2+x3*u+x4;
}
return _338;
};
if(!c){
this.c=0.7;
}else{
this.c=c;
}
this.p=pnts;
return this;
},Arc:function(_33e,end,ccw){
var _341=dojo.math.points.midpoint(_33e,end);
var _342=dojo.math.points.translate(dojo.math.points.invert(_341),_33e);
var rad=Math.sqrt(Math.pow(_342[0],2)+Math.pow(_342[1],2));
var _344=dojo.math.radToDeg(Math.atan(_342[1]/_342[0]));
if(_342[0]<0){
_344-=90;
}else{
_344+=90;
}
dojo.math.curves.CenteredArc.call(this,_341,rad,_344,_344+(ccw?-180:180));
},CenteredArc:function(_345,_346,_347,end){
this.center=_345;
this.radius=_346;
this.start=_347||0;
this.end=end;
this.getValue=function(n){
var _34a=new Array(2);
var _34b=dojo.math.degToRad(this.start+((this.end-this.start)*n));
_34a[0]=this.center[0]+this.radius*Math.sin(_34b);
_34a[1]=this.center[1]-this.radius*Math.cos(_34b);
return _34a;
};
return this;
},Circle:function(_34c,_34d){
dojo.math.curves.CenteredArc.call(this,_34c,_34d,0,360);
return this;
},Path:function(){
var _34e=[];
var _34f=[];
var _350=[];
var _351=0;
this.add=function(_352,_353){
if(_353<0){
dojo.raise("dojo.math.curves.Path.add: weight cannot be less than 0");
}
_34e.push(_352);
_34f.push(_353);
_351+=_353;
computeRanges();
};
this.remove=function(_354){
for(var i=0;i<_34e.length;i++){
if(_34e[i]==_354){
_34e.splice(i,1);
_351-=_34f.splice(i,1)[0];
break;
}
}
computeRanges();
};
this.removeAll=function(){
_34e=[];
_34f=[];
_351=0;
};
this.getValue=function(n){
var _357=false,value=0;
for(var i=0;i<_350.length;i++){
var r=_350[i];
if(n>=r[0]&&n<r[1]){
var subN=(n-r[0])/r[2];
value=_34e[i].getValue(subN);
_357=true;
break;
}
}
if(!_357){
value=_34e[_34e.length-1].getValue(1);
}
for(j=0;j<i;j++){
value=dojo.math.points.translate(value,_34e[j].getValue(1));
}
return value;
};
function computeRanges(){
var _35b=0;
for(var i=0;i<_34f.length;i++){
var end=_35b+_34f[i]/_351;
var len=end-_35b;
_350[i]=[_35b,end,len];
_35b=end;
}
}
return this;
}};
dojo.provide("dojo.animation");
dojo.provide("dojo.animation.Animation");
dojo.require("dojo.lang");
dojo.require("dojo.math");
dojo.require("dojo.math.curves");
dojo.animation.Animation=function(_35f,_360,_361,_362,rate){
if(dojo.lang.isArray(_35f)){
_35f=new dojo.math.curves.Line(_35f[0],_35f[1]);
}
this.curve=_35f;
this.duration=_360;
this.repeatCount=_362||0;
this.rate=rate||25;
if(_361){
if(dojo.lang.isFunction(_361.getValue)){
this.accel=_361;
}else{
var i=0.35*_361+0.5;
this.accel=new dojo.math.curves.CatmullRom([[0],[i],[1]],0.45);
}
}
};
dojo.lang.extend(dojo.animation.Animation,{curve:null,duration:0,repeatCount:0,accel:null,onBegin:null,onAnimate:null,onEnd:null,onPlay:null,onPause:null,onStop:null,handler:null,_animSequence:null,_startTime:null,_endTime:null,_lastFrame:null,_timer:null,_percent:0,_active:false,_paused:false,_startRepeatCount:0,play:function(_365){
if(_365){
clearTimeout(this._timer);
this._active=false;
this._paused=false;
this._percent=0;
}else{
if(this._active&&!this._paused){
return;
}
}
this._startTime=new Date().valueOf();
if(this._paused){
this._startTime-=(this.duration*this._percent/100);
}
this._endTime=this._startTime+this.duration;
this._lastFrame=this._startTime;
var e=new dojo.animation.AnimationEvent(this,null,this.curve.getValue(this._percent),this._startTime,this._startTime,this._endTime,this.duration,this._percent,0);
this._active=true;
this._paused=false;
if(this._percent==0){
if(!this._startRepeatCount){
this._startRepeatCount=this.repeatCount;
}
e.type="begin";
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onBegin=="function"){
this.onBegin(e);
}
}
e.type="play";
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onPlay=="function"){
this.onPlay(e);
}
if(this._animSequence){
this._animSequence._setCurrent(this);
}
this._cycle();
},pause:function(){
clearTimeout(this._timer);
if(!this._active){
return;
}
this._paused=true;
var e=new dojo.animation.AnimationEvent(this,"pause",this.curve.getValue(this._percent),this._startTime,new Date().valueOf(),this._endTime,this.duration,this._percent,0);
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onPause=="function"){
this.onPause(e);
}
},playPause:function(){
if(!this._active||this._paused){
this.play();
}else{
this.pause();
}
},gotoPercent:function(pct,_369){
clearTimeout(this._timer);
this._active=true;
this._paused=true;
this._percent=pct;
if(_369){
this.play();
}
},stop:function(_36a){
clearTimeout(this._timer);
var step=this._percent/100;
if(_36a){
step=1;
}
var e=new dojo.animation.AnimationEvent(this,"stop",this.curve.getValue(step),this._startTime,new Date().valueOf(),this._endTime,this.duration,this._percent,Math.round(fps));
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onStop=="function"){
this.onStop(e);
}
this._active=false;
this._paused=false;
},status:function(){
if(this._active){
return this._paused?"paused":"playing";
}else{
return "stopped";
}
},_cycle:function(){
clearTimeout(this._timer);
if(this._active){
var curr=new Date().valueOf();
var step=(curr-this._startTime)/(this._endTime-this._startTime);
fps=1000/(curr-this._lastFrame);
this._lastFrame=curr;
if(step>=1){
step=1;
this._percent=100;
}else{
this._percent=step*100;
}
if(this.accel&&this.accel.getValue){
step=this.accel.getValue(step);
}
var e=new dojo.animation.AnimationEvent(this,"animate",this.curve.getValue(step),this._startTime,curr,this._endTime,this.duration,this._percent,Math.round(fps));
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onAnimate=="function"){
this.onAnimate(e);
}
if(step<1){
this._timer=setTimeout(dojo.lang.hitch(this,"_cycle"),this.rate);
}else{
e.type="end";
this._active=false;
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onEnd=="function"){
this.onEnd(e);
}
if(this.repeatCount>0){
this.repeatCount--;
this.play(true);
}else{
if(this.repeatCount==-1){
this.play(true);
}else{
if(this._startRepeatCount){
this.repeatCount=this._startRepeatCount;
this._startRepeatCount=0;
}
if(this._animSequence){
this._animSequence._playNext();
}
}
}
}
}
}});
dojo.animation.AnimationEvent=function(anim,type,_372,_373,_374,_375,dur,pct,fps){
this.type=type;
this.animation=anim;
this.coords=_372;
this.x=_372[0];
this.y=_372[1];
this.z=_372[2];
this.startTime=_373;
this.currentTime=_374;
this.endTime=_375;
this.duration=dur;
this.percent=pct;
this.fps=fps;
};
dojo.lang.extend(dojo.animation.AnimationEvent,{coordsAsInts:function(){
var _379=new Array(this.coords.length);
for(var i=0;i<this.coords.length;i++){
_379[i]=Math.round(this.coords[i]);
}
return _379;
}});
dojo.animation.AnimationSequence=function(_37b){
this._anims=[];
this.repeatCount=_37b||0;
};
dojo.lang.extend(dojo.animation.AnimationSequence,{repeateCount:0,_anims:[],_currAnim:-1,onBegin:null,onEnd:null,onNext:null,handler:null,add:function(){
for(var i=0;i<arguments.length;i++){
this._anims.push(arguments[i]);
arguments[i]._animSequence=this;
}
},remove:function(anim){
for(var i=0;i<this._anims.length;i++){
if(this._anims[i]==anim){
this._anims[i]._animSequence=null;
this._anims.splice(i,1);
break;
}
}
},removeAll:function(){
for(var i=0;i<this._anims.length;i++){
this._anims[i]._animSequence=null;
}
this._anims=[];
this._currAnim=-1;
},clear:function(){
this.removeAll();
},play:function(_380){
if(this._anims.length==0){
return;
}
if(_380||!this._anims[this._currAnim]){
this._currAnim=0;
}
if(this._anims[this._currAnim]){
if(this._currAnim==0){
var e={type:"begin",animation:this._anims[this._currAnim]};
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onBegin=="function"){
this.onBegin(e);
}
}
this._anims[this._currAnim].play(_380);
}
},pause:function(){
if(this._anims[this._currAnim]){
this._anims[this._currAnim].pause();
}
},playPause:function(){
if(this._anims.length==0){
return;
}
if(this._currAnim==-1){
this._currAnim=0;
}
if(this._anims[this._currAnim]){
this._anims[this._currAnim].playPause();
}
},stop:function(){
if(this._anims[this._currAnim]){
this._anims[this._currAnim].stop();
}
},status:function(){
if(this._anims[this._currAnim]){
return this._anims[this._currAnim].status();
}else{
return "stopped";
}
},_setCurrent:function(anim){
for(var i=0;i<this._anims.length;i++){
if(this._anims[i]==anim){
this._currAnim=i;
break;
}
}
},_playNext:function(){
if(this._currAnim==-1||this._anims.length==0){
return;
}
this._currAnim++;
if(this._anims[this._currAnim]){
var e={type:"next",animation:this._anims[this._currAnim]};
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onNext=="function"){
this.onNext(e);
}
this._anims[this._currAnim].play(true);
}else{
var e={type:"end",animation:this._anims[this._anims.length-1]};
if(typeof this.handler=="function"){
this.handler(e);
}
if(typeof this.onEnd=="function"){
this.onEnd(e);
}
if(this.repeatCount>0){
this._currAnim=0;
this.repeatCount--;
this._anims[this._currAnim].play(true);
}else{
if(this.repeatCount==-1){
this._currAnim=0;
this._anims[this._currAnim].play(true);
}else{
this._currAnim=-1;
}
}
}
}});
dojo.hostenv.conditionalLoadModule({common:["dojo.animation.Animation",false,false]});
dojo.hostenv.moduleLoaded("dojo.animation.*");
dojo.require("dojo.lang");
dojo.provide("dojo.event");
dojo.event=new function(){
this.canTimeout=dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);
function interpolateArgs(args){
var dl=dojo.lang;
var ao={srcObj:dj_global,srcFunc:null,adviceObj:dj_global,adviceFunc:null,aroundObj:null,aroundFunc:null,adviceType:(args.length>2)?args[0]:"after",precedence:"last",once:false,delay:null,rate:0,adviceMsg:false};
switch(args.length){
case 0:
return;
case 1:
return;
case 2:
ao.srcFunc=args[0];
ao.adviceFunc=args[1];
break;
case 3:
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isFunction(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
var _388=dojo.lang.nameAnonFunc(args[2],ao.adviceObj);
ao.adviceFunc=_388;
}else{
if((dl.isFunction(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=dj_global;
var _388=dojo.lang.nameAnonFunc(args[0],ao.srcObj);
ao.srcFunc=_388;
ao.adviceObj=args[1];
ao.adviceFunc=args[2];
}
}
}
}
break;
case 4:
if((dl.isObject(args[0]))&&(dl.isObject(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isString(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isFunction(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
var _388=dojo.lang.nameAnonFunc(args[1],dj_global);
ao.srcFunc=_388;
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if(dl.isObject(args[1])){
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=dj_global;
ao.adviceFunc=args[3];
}else{
if(dl.isObject(args[2])){
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
ao.srcObj=ao.adviceObj=ao.aroundObj=dj_global;
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
ao.aroundFunc=args[3];
}
}
}
}
}
break;
case 6:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundFunc=args[5];
ao.aroundObj=dj_global;
break;
default:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundObj=args[5];
ao.aroundFunc=args[6];
ao.once=args[7];
ao.delay=args[8];
ao.rate=args[9];
ao.adviceMsg=args[10];
break;
}
if((typeof ao.srcFunc).toLowerCase()!="string"){
ao.srcFunc=dojo.lang.getNameInObj(ao.srcObj,ao.srcFunc);
}
if((typeof ao.adviceFunc).toLowerCase()!="string"){
ao.adviceFunc=dojo.lang.getNameInObj(ao.adviceObj,ao.adviceFunc);
}
if((ao.aroundObj)&&((typeof ao.aroundFunc).toLowerCase()!="string")){
ao.aroundFunc=dojo.lang.getNameInObj(ao.aroundObj,ao.aroundFunc);
}
if(!ao.srcObj){
dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
}
if(!ao.adviceObj){
dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
}
return ao;
}
this.connect=function(){
var ao=interpolateArgs(arguments);
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
if(ao.adviceFunc){
var mjp2=dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj,ao.adviceFunc);
}
mjp.kwAddAdvice(ao);
return mjp;
};
this.connectBefore=function(){
var args=["before"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectAround=function(){
var args=["around"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this._kwConnectImpl=function(_390,_391){
var fn=(_391)?"disconnect":"connect";
if(typeof _390["srcFunc"]=="function"){
_390.srcObj=_390["srcObj"]||dj_global;
var _393=dojo.lang.nameAnonFunc(_390.srcFunc,_390.srcObj);
_390.srcFunc=_393;
}
if(typeof _390["adviceFunc"]=="function"){
_390.adviceObj=_390["adviceObj"]||dj_global;
var _393=dojo.lang.nameAnonFunc(_390.adviceFunc,_390.adviceObj);
_390.adviceFunc=_393;
}
return dojo.event[fn]((_390["type"]||_390["adviceType"]||"after"),_390["srcObj"]||dj_global,_390["srcFunc"],_390["adviceObj"]||_390["targetObj"]||dj_global,_390["adviceFunc"]||_390["targetFunc"],_390["aroundObj"],_390["aroundFunc"],_390["once"],_390["delay"],_390["rate"],_390["adviceMsg"]||false);
};
this.kwConnect=function(_394){
return this._kwConnectImpl(_394,false);
};
this.disconnect=function(){
var ao=interpolateArgs(arguments);
if(!ao.adviceFunc){
return;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
return mjp.removeAdvice(ao.adviceObj,ao.adviceFunc,ao.adviceType,ao.once);
};
this.kwDisconnect=function(_397){
return this._kwConnectImpl(_397,true);
};
};
dojo.event.MethodInvocation=function(_398,obj,args){
this.jp_=_398;
this.object=obj;
this.args=[];
for(var x=0;x<args.length;x++){
this.args[x]=args[x];
}
this.around_index=-1;
};
dojo.event.MethodInvocation.prototype.proceed=function(){
this.around_index++;
if(this.around_index>=this.jp_.around.length){
return this.jp_.object[this.jp_.methodname].apply(this.jp_.object,this.args);
}else{
var ti=this.jp_.around[this.around_index];
var mobj=ti[0]||dj_global;
var meth=ti[1];
return mobj[meth].call(mobj,this);
}
};
dojo.event.MethodJoinPoint=function(obj,_3a0){
this.object=obj||dj_global;
this.methodname=_3a0;
this.methodfunc=this.object[_3a0];
this.before=[];
this.after=[];
this.around=[];
};
dojo.event.MethodJoinPoint.getForMethod=function(obj,_3a2){
if(!obj){
obj=dj_global;
}
if(!obj[_3a2]){
obj[_3a2]=function(){
};
}else{
if((!dojo.lang.isFunction(obj[_3a2]))&&(!dojo.lang.isAlien(obj[_3a2]))){
return null;
}
}
var _3a3=_3a2+"$joinpoint";
var _3a4=_3a2+"$joinpoint$method";
var _3a5=obj[_3a3];
if(!_3a5){
var _3a6=false;
if(dojo.event["browser"]){
if((obj["attachEvent"])||(obj["nodeType"])||(obj["addEventListener"])){
_3a6=true;
dojo.event.browser.addClobberNodeAttrs(obj,[_3a3,_3a4,_3a2]);
}
}
obj[_3a4]=obj[_3a2];
_3a5=obj[_3a3]=new dojo.event.MethodJoinPoint(obj,_3a4);
obj[_3a2]=function(){
var args=[];
if((_3a6)&&(!arguments.length)&&(window.event)){
args.push(dojo.event.browser.fixEvent(window.event));
}else{
for(var x=0;x<arguments.length;x++){
if((x==0)&&(_3a6)&&(dojo.event.browser.isEvent(arguments[x]))){
args.push(dojo.event.browser.fixEvent(arguments[x]));
}else{
args.push(arguments[x]);
}
}
}
return _3a5.run.apply(_3a5,args);
};
}
return _3a5;
};
dojo.lang.extend(dojo.event.MethodJoinPoint,{unintercept:function(){
this.object[this.methodname]=this.methodfunc;
},run:function(){
var obj=this.object||dj_global;
var args=arguments;
var _3ab=[];
for(var x=0;x<args.length;x++){
_3ab[x]=args[x];
}
var _3ad=function(marr){
if(!marr){
dojo.debug("Null argument to unrollAdvice()");
return;
}
var _3af=marr[0]||dj_global;
var _3b0=marr[1];
if(!_3af[_3b0]){
dojo.raise("function \""+_3b0+"\" does not exist on \""+_3af+"\"");
}
var _3b1=marr[2]||dj_global;
var _3b2=marr[3];
var msg=marr[6];
var _3b4;
var to={args:[],jp_:this,object:obj,proceed:function(){
return _3af[_3b0].apply(_3af,to.args);
}};
to.args=_3ab;
var _3b6=parseInt(marr[4]);
var _3b7=((!isNaN(_3b6))&&(marr[4]!==null)&&(typeof marr[4]!="undefined"));
if(marr[5]){
var rate=parseInt(marr[5]);
var cur=new Date();
var _3ba=false;
if((marr["last"])&&((cur-marr.last)<=rate)){
if(dojo.event.canTimeout){
if(marr["delayTimer"]){
clearTimeout(marr.delayTimer);
}
var tod=parseInt(rate*2);
var mcpy=dojo.lang.shallowCopy(marr);
marr.delayTimer=setTimeout(function(){
mcpy[5]=0;
_3ad(mcpy);
},tod);
}
return;
}else{
marr.last=cur;
}
}
if(_3b2){
_3b1[_3b2].call(_3b1,to);
}else{
if((_3b7)&&((dojo.render.html)||(dojo.render.svg))){
dj_global["setTimeout"](function(){
if(msg){
_3af[_3b0].call(_3af,to);
}else{
_3af[_3b0].apply(_3af,args);
}
},_3b6);
}else{
if(msg){
_3af[_3b0].call(_3af,to);
}else{
_3af[_3b0].apply(_3af,args);
}
}
}
};
if(this.before.length>0){
dojo.lang.forEach(this.before,_3ad,true);
}
var _3bd;
if(this.around.length>0){
var mi=new dojo.event.MethodInvocation(this,obj,args);
_3bd=mi.proceed();
}else{
if(this.methodfunc){
_3bd=this.object[this.methodname].apply(this.object,args);
}
}
if(this.after.length>0){
dojo.lang.forEach(this.after,_3ad,true);
}
return (this.methodfunc)?_3bd:null;
},getArr:function(kind){
var arr=this.after;
if((typeof kind=="string")&&(kind.indexOf("before")!=-1)){
arr=this.before;
}else{
if(kind=="around"){
arr=this.around;
}
}
return arr;
},kwAddAdvice:function(args){
this.addAdvice(args["adviceObj"],args["adviceFunc"],args["aroundObj"],args["aroundFunc"],args["adviceType"],args["precedence"],args["once"],args["delay"],args["rate"],args["adviceMsg"]);
},addAdvice:function(_3c2,_3c3,_3c4,_3c5,_3c6,_3c7,once,_3c9,rate,_3cb){
var arr=this.getArr(_3c6);
if(!arr){
dojo.raise("bad this: "+this);
}
var ao=[_3c2,_3c3,_3c4,_3c5,_3c9,rate,_3cb];
if(once){
if(this.hasAdvice(_3c2,_3c3,_3c6,arr)>=0){
return;
}
}
if(_3c7=="first"){
arr.unshift(ao);
}else{
arr.push(ao);
}
},hasAdvice:function(_3ce,_3cf,_3d0,arr){
if(!arr){
arr=this.getArr(_3d0);
}
var ind=-1;
for(var x=0;x<arr.length;x++){
if((arr[x][0]==_3ce)&&(arr[x][1]==_3cf)){
ind=x;
}
}
return ind;
},removeAdvice:function(_3d4,_3d5,_3d6,once){
var arr=this.getArr(_3d6);
var ind=this.hasAdvice(_3d4,_3d5,_3d6,arr);
if(ind==-1){
return false;
}
while(ind!=-1){
arr.splice(ind,1);
if(once){
break;
}
ind=this.hasAdvice(_3d4,_3d5,_3d6,arr);
}
return true;
}});
dojo.require("dojo.event");
dojo.provide("dojo.event.topic");
dojo.event.topic=new function(){
this.topics={};
this.getTopic=function(_3da){
if(!this.topics[_3da]){
this.topics[_3da]=new this.TopicImpl(_3da);
}
return this.topics[_3da];
};
this.registerPublisher=function(_3db,obj,_3dd){
var _3db=this.getTopic(_3db);
_3db.registerPublisher(obj,_3dd);
};
this.subscribe=function(_3de,obj,_3e0){
var _3de=this.getTopic(_3de);
_3de.subscribe(obj,_3e0);
};
this.unsubscribe=function(_3e1,obj,_3e3){
var _3e1=this.getTopic(_3e1);
_3e1.unsubscribe(obj,_3e3);
};
this.publish=function(_3e4,_3e5){
var _3e4=this.getTopic(_3e4);
var args=[];
if((arguments.length==2)&&(_3e5.length)&&(typeof _3e5!="string")){
args=_3e5;
}else{
var args=[];
for(var x=1;x<arguments.length;x++){
args.push(arguments[x]);
}
}
_3e4.sendMessage.apply(_3e4,args);
};
};
dojo.event.topic.TopicImpl=function(_3e8){
this.topicName=_3e8;
var self=this;
self.subscribe=function(_3ea,_3eb){
var tf=_3eb||_3ea;
var to=(!_3eb)?dj_global:_3ea;
dojo.event.kwConnect({srcObj:self,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
self.unsubscribe=function(_3ee,_3ef){
var tf=(!_3ef)?_3ee:_3ef;
var to=(!_3ef)?null:_3ee;
dojo.event.kwDisconnect({srcObj:self,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
self.registerPublisher=function(_3f2,_3f3){
dojo.event.connect(_3f2,_3f3,self,"sendMessage");
};
self.sendMessage=function(_3f4){
};
};
dojo.provide("dojo.event.browser");
dojo.require("dojo.event");
dojo_ie_clobber=new function(){
this.clobberNodes=[];
function nukeProp(node,prop){
try{
node[prop]=null;
}
catch(e){
}
try{
delete node[prop];
}
catch(e){
}
try{
node.removeAttribute(prop);
}
catch(e){
}
}
this.clobber=function(_3f7){
var na;
var tna;
if(_3f7){
tna=_3f7.getElementsByTagName("*");
na=[_3f7];
for(var x=0;x<tna.length;x++){
if(tna[x]["__doClobber__"]){
na.push(tna[x]);
}
}
}else{
try{
window.onload=null;
}
catch(e){
}
na=(this.clobberNodes.length)?this.clobberNodes:document.all;
}
tna=null;
var _3fb={};
for(var i=na.length-1;i>=0;i=i-1){
var el=na[i];
if(el["__clobberAttrs__"]){
for(var j=0;j<el.__clobberAttrs__.length;j++){
nukeProp(el,el.__clobberAttrs__[j]);
}
nukeProp(el,"__clobberAttrs__");
nukeProp(el,"__doClobber__");
}
}
na=null;
};
};
if(dojo.render.html.ie){
window.onunload=function(){
dojo_ie_clobber.clobber();
try{
if((dojo["widget"])&&(dojo.widget["manager"])){
dojo.widget.manager.destroyAll();
}
}
catch(e){
}
try{
window.onload=null;
}
catch(e){
}
try{
window.onunload=null;
}
catch(e){
}
dojo_ie_clobber.clobberNodes=[];
};
}
dojo.event.browser=new function(){
var _3ff=0;
this.clean=function(node){
if(dojo.render.html.ie){
dojo_ie_clobber.clobber(node);
}
};
this.addClobberNode=function(node){
if(!node["__doClobber__"]){
node.__doClobber__=true;
dojo_ie_clobber.clobberNodes.push(node);
node.__clobberAttrs__=[];
}
};
this.addClobberNodeAttrs=function(node,_403){
this.addClobberNode(node);
for(var x=0;x<_403.length;x++){
node.__clobberAttrs__.push(_403[x]);
}
};
this.removeListener=function(node,_406,fp,_408){
if(!_408){
var _408=false;
}
_406=_406.toLowerCase();
if(_406.substr(0,2)=="on"){
_406=_406.substr(2);
}
if(node.removeEventListener){
node.removeEventListener(_406,fp,_408);
}
};
this.addListener=function(node,_40a,fp,_40c,_40d){
if(!node){
return;
}
if(!_40c){
var _40c=false;
}
_40a=_40a.toLowerCase();
if(_40a.substr(0,2)!="on"){
_40a="on"+_40a;
}
if(!_40d){
var _40e=function(evt){
if(!evt){
evt=window.event;
}
var ret=fp(dojo.event.browser.fixEvent(evt));
if(_40c){
dojo.event.browser.stopEvent(evt);
}
return ret;
};
}else{
_40e=fp;
}
if(node.addEventListener){
node.addEventListener(_40a.substr(2),_40e,_40c);
return _40e;
}else{
if(typeof node[_40a]=="function"){
var _411=node[_40a];
node[_40a]=function(e){
_411(e);
return _40e(e);
};
}else{
node[_40a]=_40e;
}
if(dojo.render.html.ie){
this.addClobberNodeAttrs(node,[_40a]);
}
return _40e;
}
};
this.isEvent=function(obj){
return (typeof obj!="undefined")&&(typeof Event!="undefined")&&(obj.eventPhase);
};
this.currentEvent=null;
this.callListener=function(_414,_415){
if(typeof _414!="function"){
dojo.raise("listener not a function: "+_414);
}
dojo.event.browser.currentEvent.currentTarget=_415;
return _414.call(_415,dojo.event.browser.currentEvent);
};
this.stopPropagation=function(){
dojo.event.browser.currentEvent.cancelBubble=true;
};
this.preventDefault=function(){
dojo.event.browser.currentEvent.returnValue=false;
};
this.keys={KEY_BACKSPACE:8,KEY_TAB:9,KEY_ENTER:13,KEY_SHIFT:16,KEY_CTRL:17,KEY_ALT:18,KEY_PAUSE:19,KEY_CAPS_LOCK:20,KEY_ESCAPE:27,KEY_SPACE:32,KEY_PAGE_UP:33,KEY_PAGE_DOWN:34,KEY_END:35,KEY_HOME:36,KEY_LEFT_ARROW:37,KEY_UP_ARROW:38,KEY_RIGHT_ARROW:39,KEY_DOWN_ARROW:40,KEY_INSERT:45,KEY_DELETE:46,KEY_LEFT_WINDOW:91,KEY_RIGHT_WINDOW:92,KEY_SELECT:93,KEY_F1:112,KEY_F2:113,KEY_F3:114,KEY_F4:115,KEY_F5:116,KEY_F6:117,KEY_F7:118,KEY_F8:119,KEY_F9:120,KEY_F10:121,KEY_F11:122,KEY_F12:123,KEY_NUM_LOCK:144,KEY_SCROLL_LOCK:145};
this.revKeys=[];
for(var key in this.keys){
this.revKeys[this.keys[key]]=key;
}
this.fixEvent=function(evt){
if((!evt)&&(window["event"])){
var evt=window.event;
}
if((evt["type"])&&(evt["type"].indexOf("key")==0)){
evt.keys=this.revKeys;
for(var key in this.keys){
evt[key]=this.keys[key];
}
if((dojo.render.html.ie)&&(evt["type"]=="keypress")){
evt.charCode=evt.keyCode;
}
}
if(dojo.render.html.ie){
if(!evt.target){
evt.target=evt.srcElement;
}
if(!evt.currentTarget){
evt.currentTarget=evt.srcElement;
}
if(!evt.layerX){
evt.layerX=evt.offsetX;
}
if(!evt.layerY){
evt.layerY=evt.offsetY;
}
if(evt.fromElement){
evt.relatedTarget=evt.fromElement;
}
if(evt.toElement){
evt.relatedTarget=evt.toElement;
}
this.currentEvent=evt;
evt.callListener=this.callListener;
evt.stopPropagation=this.stopPropagation;
evt.preventDefault=this.preventDefault;
}
return evt;
};
this.stopEvent=function(ev){
if(window.event){
ev.returnValue=false;
ev.cancelBubble=true;
}else{
ev.preventDefault();
ev.stopPropagation();
}
};
};
dojo.hostenv.conditionalLoadModule({common:["dojo.event","dojo.event.topic"],browser:["dojo.event.browser"]});
dojo.hostenv.moduleLoaded("dojo.event.*");
dojo.provide("dojo.fx.html");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.lang");
dojo.require("dojo.animation.*");
dojo.require("dojo.event.*");
dojo.require("dojo.graphics.color");
dojo.fx.duration=500;
dojo.fx.html._makeFadeable=function(node){
if(dojo.render.html.ie){
if((node.style.zoom.length==0)&&(dojo.style.getStyle(node,"zoom")=="normal")){
node.style.zoom="1";
}
if((node.style.width.length==0)&&(dojo.style.getStyle(node,"width")=="auto")){
node.style.width="auto";
}
}
};
dojo.fx.html.fadeOut=function(node,_41c,_41d,_41e){
return dojo.fx.html.fade(node,_41c,dojo.style.getOpacity(node),0,_41d,_41e);
};
dojo.fx.html.fadeIn=function(node,_420,_421,_422){
return dojo.fx.html.fade(node,_420,dojo.style.getOpacity(node),1,_421,_422);
};
dojo.fx.html.fadeHide=function(node,_424,_425,_426){
node=dojo.byId(node);
if(!_424){
_424=150;
}
return dojo.fx.html.fadeOut(node,_424,function(node){
node.style.display="none";
if(typeof _425=="function"){
_425(node);
}
});
};
dojo.fx.html.fadeShow=function(node,_429,_42a,_42b){
node=dojo.byId(node);
if(!_429){
_429=150;
}
node.style.display="block";
return dojo.fx.html.fade(node,_429,0,1,_42a,_42b);
};
dojo.fx.html.fade=function(node,_42d,_42e,_42f,_430,_431){
node=dojo.byId(node);
dojo.fx.html._makeFadeable(node);
var anim=new dojo.animation.Animation(new dojo.math.curves.Line([_42e],[_42f]),_42d||dojo.fx.duration,0);
dojo.event.connect(anim,"onAnimate",function(e){
dojo.style.setOpacity(node,e.x);
});
if(_430){
dojo.event.connect(anim,"onEnd",function(e){
_430(node,anim);
});
}
if(!_431){
anim.play(true);
}
return anim;
};
dojo.fx.html.slideTo=function(node,_436,_437,_438,_439){
if(!dojo.lang.isNumber(_436)){
var tmp=_436;
_436=_437;
_437=tmp;
}
node=dojo.byId(node);
var top=node.offsetTop;
var left=node.offsetLeft;
var pos=dojo.style.getComputedStyle(node,"position");
if(pos=="relative"||pos=="static"){
top=parseInt(dojo.style.getComputedStyle(node,"top"))||0;
left=parseInt(dojo.style.getComputedStyle(node,"left"))||0;
}
return dojo.fx.html.slide(node,_436,[left,top],_437,_438,_439);
};
dojo.fx.html.slideBy=function(node,_43f,_440,_441,_442){
if(!dojo.lang.isNumber(_43f)){
var tmp=_43f;
_43f=_440;
_440=tmp;
}
node=dojo.byId(node);
var top=node.offsetTop;
var left=node.offsetLeft;
var pos=dojo.style.getComputedStyle(node,"position");
if(pos=="relative"||pos=="static"){
top=parseInt(dojo.style.getComputedStyle(node,"top"))||0;
left=parseInt(dojo.style.getComputedStyle(node,"left"))||0;
}
return dojo.fx.html.slideTo(node,_43f,[left+_440[0],top+_440[1]],_441,_442);
};
dojo.fx.html.slide=function(node,_448,_449,_44a,_44b,_44c){
if(!dojo.lang.isNumber(_448)){
var tmp=_448;
_448=_44a;
_44a=_449;
_449=tmp;
}
node=dojo.byId(node);
if(dojo.style.getComputedStyle(node,"position")=="static"){
node.style.position="relative";
}
var anim=new dojo.animation.Animation(new dojo.math.curves.Line(_449,_44a),_448||dojo.fx.duration,0);
dojo.event.connect(anim,"onAnimate",function(e){
with(node.style){
left=e.x+"px";
top=e.y+"px";
}
});
if(_44b){
dojo.event.connect(anim,"onEnd",function(e){
_44b(node,anim);
});
}
if(!_44c){
anim.play(true);
}
return anim;
};
dojo.fx.html.colorFadeIn=function(node,_452,_453,_454,_455,_456){
if(!dojo.lang.isNumber(_452)){
var tmp=_452;
_452=_453;
_453=tmp;
}
node=dojo.byId(node);
var _458=dojo.html.getBackgroundColor(node);
var bg=dojo.style.getStyle(node,"background-color").toLowerCase();
var _45a=bg=="transparent"||bg=="rgba(0, 0, 0, 0)";
while(_458.length>3){
_458.pop();
}
var rgb=new dojo.graphics.color.Color(_453).toRgb();
var anim=dojo.fx.html.colorFade(node,_452||dojo.fx.duration,_453,_458,_455,true);
dojo.event.connect(anim,"onEnd",function(e){
if(_45a){
node.style.backgroundColor="transparent";
}
});
if(_454>0){
node.style.backgroundColor="rgb("+rgb.join(",")+")";
if(!_456){
setTimeout(function(){
anim.play(true);
},_454);
}
}else{
if(!_456){
anim.play(true);
}
}
return anim;
};
dojo.fx.html.highlight=dojo.fx.html.colorFadeIn;
dojo.fx.html.colorFadeFrom=dojo.fx.html.colorFadeIn;
dojo.fx.html.colorFadeOut=function(node,_45f,_460,_461,_462,_463){
if(!dojo.lang.isNumber(_45f)){
var tmp=_45f;
_45f=_460;
_460=tmp;
}
node=dojo.byId(node);
var _465=new dojo.graphics.color.Color(dojo.html.getBackgroundColor(node)).toRgb();
var rgb=new dojo.graphics.color.Color(_460).toRgb();
var anim=dojo.fx.html.colorFade(node,_45f||dojo.fx.duration,_465,rgb,_462,_461>0||_463);
if(_461>0){
node.style.backgroundColor="rgb("+_465.join(",")+")";
if(!_463){
setTimeout(function(){
anim.play(true);
},_461);
}
}
return anim;
};
dojo.fx.html.unhighlight=dojo.fx.html.colorFadeOut;
dojo.fx.html.colorFadeTo=dojo.fx.html.colorFadeOut;
dojo.fx.html.colorFade=function(node,_469,_46a,_46b,_46c,_46d){
if(!dojo.lang.isNumber(_469)){
var tmp=_469;
_469=_46b;
_46b=_46a;
_46a=tmp;
}
node=dojo.byId(node);
var _46f=new dojo.graphics.color.Color(_46a).toRgb();
var _470=new dojo.graphics.color.Color(_46b).toRgb();
var anim=new dojo.animation.Animation(new dojo.math.curves.Line(_46f,_470),_469||dojo.fx.duration,0);
dojo.event.connect(anim,"onAnimate",function(e){
node.style.backgroundColor="rgb("+e.coordsAsInts().join(",")+")";
});
if(_46c){
dojo.event.connect(anim,"onEnd",function(e){
_46c(node,anim);
});
}
if(!_46d){
anim.play(true);
}
return anim;
};
dojo.fx.html.wipeShow=function(node,_475,_476,_477){
node=dojo.byId(node);
var _478=dojo.html.getStyle(node,"overflow");
node.style.overflow="hidden";
node.style.height=0;
dojo.html.show(node);
var anim=new dojo.animation.Animation([[0],[node.scrollHeight]],_475||dojo.fx.duration,0);
dojo.event.connect(anim,"onAnimate",function(e){
node.style.height=e.x+"px";
});
dojo.event.connect(anim,"onEnd",function(){
node.style.overflow=_478;
node.style.height="auto";
if(_476){
_476(node,anim);
}
});
if(!_477){
anim.play();
}
return anim;
};
dojo.fx.html.wipeHide=function(node,_47c,_47d,_47e){
node=dojo.byId(node);
var _47f=dojo.html.getStyle(node,"overflow");
node.style.overflow="hidden";
var anim=new dojo.animation.Animation([[node.offsetHeight],[0]],_47c||dojo.fx.duration,0);
dojo.event.connect(anim,"onAnimate",function(e){
node.style.height=e.x+"px";
});
dojo.event.connect(anim,"onEnd",function(){
node.style.overflow=_47f;
dojo.html.hide(node);
if(_47d){
_47d(node,anim);
}
});
if(!_47e){
anim.play();
}
return anim;
};
dojo.fx.html.wiper=function(node,_483){
this.node=dojo.byId(node);
if(_483){
dojo.event.connect(dojo.byId(_483),"onclick",this,"toggle");
}
};
dojo.lang.extend(dojo.fx.html.wiper,{duration:dojo.fx.duration,_anim:null,toggle:function(){
if(!this._anim){
var type="wipe"+(dojo.html.isVisible(this.node)?"Hide":"Show");
this._anim=dojo.fx[type](this.node,this.duration,dojo.lang.hitch(this,"_callback"));
}
},_callback:function(){
this._anim=null;
}});
dojo.fx.html.wipeIn=function(node,_486,_487,_488){
node=dojo.byId(node);
var _489=dojo.html.getStyle(node,"height");
dojo.html.show(node);
var _48a=node.offsetHeight;
var anim=dojo.fx.html.wipeInToHeight(node,_486,_48a,function(e){
node.style.height=_489||"auto";
if(_487){
_487(node,anim);
}
},_488);
};
dojo.fx.html.wipeInToHeight=function(node,_48e,_48f,_490,_491){
node=dojo.byId(node);
var _492=dojo.html.getStyle(node,"overflow");
node.style.height="0px";
node.style.display="none";
if(_492=="visible"){
node.style.overflow="hidden";
}
var _493=dojo.lang.inArray(node.tagName.toLowerCase(),["tr","td","th"])?"":"block";
node.style.display=_493;
var anim=new dojo.animation.Animation(new dojo.math.curves.Line([0],[_48f]),_48e||dojo.fx.duration,0);
dojo.event.connect(anim,"onAnimate",function(e){
node.style.height=Math.round(e.x)+"px";
});
dojo.event.connect(anim,"onEnd",function(e){
if(_492!="visible"){
node.style.overflow=_492;
}
if(_490){
_490(node,anim);
}
});
if(!_491){
anim.play(true);
}
return anim;
};
dojo.fx.html.wipeOut=function(node,_498,_499,_49a){
node=dojo.byId(node);
var _49b=dojo.html.getStyle(node,"overflow");
var _49c=dojo.html.getStyle(node,"height");
var _49d=node.offsetHeight;
node.style.overflow="hidden";
var anim=new dojo.animation.Animation(new dojo.math.curves.Line([_49d],[0]),_498||dojo.fx.duration,0);
dojo.event.connect(anim,"onAnimate",function(e){
node.style.height=Math.round(e.x)+"px";
});
dojo.event.connect(anim,"onEnd",function(e){
node.style.display="none";
node.style.overflow=_49b;
node.style.height=_49c||"auto";
if(_499){
_499(node,anim);
}
});
if(!_49a){
anim.play(true);
}
return anim;
};
dojo.fx.html.explode=function(_4a1,_4a2,_4a3,_4a4,_4a5){
var _4a6=dojo.html.toCoordinateArray(_4a1);
var _4a7=document.createElement("div");
with(_4a7.style){
position="absolute";
border="1px solid black";
display="none";
}
dojo.html.body().appendChild(_4a7);
_4a2=dojo.byId(_4a2);
with(_4a2.style){
visibility="hidden";
display="block";
}
var _4a8=dojo.html.toCoordinateArray(_4a2);
with(_4a2.style){
display="none";
visibility="visible";
}
var anim=new dojo.animation.Animation(new dojo.math.curves.Line(_4a6,_4a8),_4a3||dojo.fx.duration,0);
dojo.event.connect(anim,"onBegin",function(e){
_4a7.style.display="block";
});
dojo.event.connect(anim,"onAnimate",function(e){
with(_4a7.style){
left=e.x+"px";
top=e.y+"px";
width=e.coords[2]+"px";
height=e.coords[3]+"px";
}
});
dojo.event.connect(anim,"onEnd",function(){
_4a2.style.display="block";
_4a7.parentNode.removeChild(_4a7);
if(_4a4){
_4a4(_4a2,anim);
}
});
if(!_4a5){
anim.play();
}
return anim;
};
dojo.fx.html.implode=function(_4ac,end,_4ae,_4af,_4b0){
var _4b1=dojo.html.toCoordinateArray(_4ac);
var _4b2=dojo.html.toCoordinateArray(end);
_4ac=dojo.byId(_4ac);
var _4b3=document.createElement("div");
with(_4b3.style){
position="absolute";
border="1px solid black";
display="none";
}
dojo.html.body().appendChild(_4b3);
var anim=new dojo.animation.Animation(new dojo.math.curves.Line(_4b1,_4b2),_4ae||dojo.fx.duration,0);
dojo.event.connect(anim,"onBegin",function(e){
_4ac.style.display="none";
_4b3.style.display="block";
});
dojo.event.connect(anim,"onAnimate",function(e){
with(_4b3.style){
left=e.x+"px";
top=e.y+"px";
width=e.coords[2]+"px";
height=e.coords[3]+"px";
}
});
dojo.event.connect(anim,"onEnd",function(){
_4b3.parentNode.removeChild(_4b3);
if(_4af){
_4af(_4ac,anim);
}
});
if(!_4b0){
anim.play();
}
return anim;
};
dojo.fx.html.Exploder=function(_4b7,_4b8){
_4b7=dojo.byId(_4b7);
_4b8=dojo.byId(_4b8);
var _4b9=this;
this.waitToHide=500;
this.timeToShow=100;
this.waitToShow=200;
this.timeToHide=70;
this.autoShow=false;
this.autoHide=false;
var _4ba=null;
var _4bb=null;
var _4bc=null;
var _4bd=null;
var _4be=null;
var _4bf=null;
this.showing=false;
this.onBeforeExplode=null;
this.onAfterExplode=null;
this.onBeforeImplode=null;
this.onAfterImplode=null;
this.onExploding=null;
this.onImploding=null;
this.timeShow=function(){
clearTimeout(_4bc);
_4bc=setTimeout(_4b9.show,_4b9.waitToShow);
};
this.show=function(){
clearTimeout(_4bc);
clearTimeout(_4bd);
if((_4bb&&_4bb.status()=="playing")||(_4ba&&_4ba.status()=="playing")||_4b9.showing){
return;
}
if(typeof _4b9.onBeforeExplode=="function"){
_4b9.onBeforeExplode(_4b7,_4b8);
}
_4ba=dojo.fx.html.explode(_4b7,_4b8,_4b9.timeToShow,function(e){
_4b9.showing=true;
if(typeof _4b9.onAfterExplode=="function"){
_4b9.onAfterExplode(_4b7,_4b8);
}
});
if(typeof _4b9.onExploding=="function"){
dojo.event.connect(_4ba,"onAnimate",this,"onExploding");
}
};
this.timeHide=function(){
clearTimeout(_4bc);
clearTimeout(_4bd);
if(_4b9.showing){
_4bd=setTimeout(_4b9.hide,_4b9.waitToHide);
}
};
this.hide=function(){
clearTimeout(_4bc);
clearTimeout(_4bd);
if(_4ba&&_4ba.status()=="playing"){
return;
}
_4b9.showing=false;
if(typeof _4b9.onBeforeImplode=="function"){
_4b9.onBeforeImplode(_4b7,_4b8);
}
_4bb=dojo.fx.html.implode(_4b8,_4b7,_4b9.timeToHide,function(e){
if(typeof _4b9.onAfterImplode=="function"){
_4b9.onAfterImplode(_4b7,_4b8);
}
});
if(typeof _4b9.onImploding=="function"){
dojo.event.connect(_4bb,"onAnimate",this,"onImploding");
}
};
dojo.event.connect(_4b7,"onclick",function(e){
if(_4b9.showing){
_4b9.hide();
}else{
_4b9.show();
}
});
dojo.event.connect(_4b7,"onmouseover",function(e){
if(_4b9.autoShow){
_4b9.timeShow();
}
});
dojo.event.connect(_4b7,"onmouseout",function(e){
if(_4b9.autoHide){
_4b9.timeHide();
}
});
dojo.event.connect(_4b8,"onmouseover",function(e){
clearTimeout(_4bd);
});
dojo.event.connect(_4b8,"onmouseout",function(e){
if(_4b9.autoHide){
_4b9.timeHide();
}
});
dojo.event.connect(document.documentElement||dojo.html.body(),"onclick",function(e){
if(_4b9.autoHide&&_4b9.showing&&!dojo.dom.isDescendantOf(e.target,_4b8)&&!dojo.dom.isDescendantOf(e.target,_4b7)){
_4b9.hide();
}
});
return this;
};
dojo.lang.mixin(dojo.fx,dojo.fx.html);
dojo.hostenv.conditionalLoadModule({browser:["dojo.fx.html"]});
dojo.hostenv.moduleLoaded("dojo.fx.*");
dojo.provide("dojo.io.IO");
dojo.require("dojo.string");
dojo.io.transports=[];
dojo.io.hdlrFuncNames=["load","error"];
dojo.io.Request=function(url,_4c9,_4ca,_4cb){
if((arguments.length==1)&&(arguments[0].constructor==Object)){
this.fromKwArgs(arguments[0]);
}else{
this.url=url;
if(_4c9){
this.mimetype=_4c9;
}
if(_4ca){
this.transport=_4ca;
}
if(arguments.length>=4){
this.changeUrl=_4cb;
}
}
};
dojo.lang.extend(dojo.io.Request,{url:"",mimetype:"text/plain",method:"GET",content:undefined,transport:undefined,changeUrl:undefined,formNode:undefined,sync:false,bindSuccess:false,useCache:false,preventCache:false,load:function(type,data,evt){
},error:function(type,_4d0){
},handle:function(){
},abort:function(){
},fromKwArgs:function(_4d1){
if(_4d1["url"]){
_4d1.url=_4d1.url.toString();
}
if(!_4d1["method"]&&_4d1["formNode"]&&_4d1["formNode"].method){
_4d1.method=_4d1["formNode"].method;
}
if(!_4d1["handle"]&&_4d1["handler"]){
_4d1.handle=_4d1.handler;
}
if(!_4d1["load"]&&_4d1["loaded"]){
_4d1.load=_4d1.loaded;
}
if(!_4d1["changeUrl"]&&_4d1["changeURL"]){
_4d1.changeUrl=_4d1.changeURL;
}
_4d1.encoding=dojo.lang.firstValued(_4d1["encoding"],djConfig["bindEncoding"],"");
_4d1.sendTransport=dojo.lang.firstValued(_4d1["sendTransport"],djConfig["ioSendTransport"],true);
var _4d2=dojo.lang.isFunction;
for(var x=0;x<dojo.io.hdlrFuncNames.length;x++){
var fn=dojo.io.hdlrFuncNames[x];
if(_4d2(_4d1[fn])){
continue;
}
if(_4d2(_4d1["handle"])){
_4d1[fn]=_4d1.handle;
}
}
dojo.lang.mixin(this,_4d1);
}});
dojo.io.Error=function(msg,type,num){
this.message=msg;
this.type=type||"unknown";
this.number=num||0;
};
dojo.io.transports.addTransport=function(name){
this.push(name);
this[name]=dojo.io[name];
};
dojo.io.bind=function(_4d9){
if(!(_4d9 instanceof dojo.io.Request)){
try{
_4d9=new dojo.io.Request(_4d9);
}
catch(e){
dojo.debug(e);
}
}
var _4da="";
if(_4d9["transport"]){
_4da=_4d9["transport"];
if(!this[_4da]){
return _4d9;
}
}else{
for(var x=0;x<dojo.io.transports.length;x++){
var tmp=dojo.io.transports[x];
if((this[tmp])&&(this[tmp].canHandle(_4d9))){
_4da=tmp;
}
}
if(_4da==""){
return _4d9;
}
}
this[_4da].bind(_4d9);
_4d9.bindSuccess=true;
return _4d9;
};
dojo.io.queueBind=function(_4dd){
if(!(_4dd instanceof dojo.io.Request)){
try{
_4dd=new dojo.io.Request(_4dd);
}
catch(e){
dojo.debug(e);
}
}
var _4de=_4dd.load;
_4dd.load=function(){
dojo.io._queueBindInFlight=false;
var ret=_4de.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
var _4e0=_4dd.error;
_4dd.error=function(){
dojo.io._queueBindInFlight=false;
var ret=_4e0.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
dojo.io._bindQueue.push(_4dd);
dojo.io._dispatchNextQueueBind();
return _4dd;
};
dojo.io._dispatchNextQueueBind=function(){
if(!dojo.io._queueBindInFlight){
dojo.io._queueBindInFlight=true;
dojo.io.bind(dojo.io._bindQueue.shift());
}
};
dojo.io._bindQueue=[];
dojo.io._queueBindInFlight=false;
dojo.io.argsFromMap=function(map,_4e3){
var _4e4=new Object();
var _4e5="";
var enc=/utf/i.test(_4e3||"")?encodeURIComponent:dojo.string.encodeAscii;
for(var x in map){
if(!_4e4[x]){
_4e5+=enc(x)+"="+enc(map[x])+"&";
}
}
return _4e5;
};
dojo.provide("dojo.io.BrowserIO");
dojo.require("dojo.io");
dojo.require("dojo.lang");
dojo.require("dojo.dom");
try{
if((!djConfig["preventBackButtonFix"])&&(!dojo.hostenv.post_load_)){
document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"'></iframe>");
}
}
catch(e){
}
dojo.io.checkChildrenForFile=function(node){
var _4e9=false;
var _4ea=node.getElementsByTagName("input");
dojo.lang.forEach(_4ea,function(_4eb){
if(_4e9){
return;
}
if(_4eb.getAttribute("type")=="file"){
_4e9=true;
}
});
return _4e9;
};
dojo.io.formHasFile=function(_4ec){
return dojo.io.checkChildrenForFile(_4ec);
};
dojo.io.encodeForm=function(_4ed,_4ee){
if((!_4ed)||(!_4ed.tagName)||(!_4ed.tagName.toLowerCase()=="form")){
dojo.raise("Attempted to encode a non-form element.");
}
var enc=/utf/i.test(_4ee||"")?encodeURIComponent:dojo.string.encodeAscii;
var _4f0=[];
for(var i=0;i<_4ed.elements.length;i++){
var elm=_4ed.elements[i];
if(elm.disabled||elm.tagName.toLowerCase()=="fieldset"||!elm.name){
continue;
}
var name=enc(elm.name);
var type=elm.type.toLowerCase();
if(type=="select-multiple"){
for(var j=0;j<elm.options.length;j++){
if(elm.options[j].selected){
_4f0.push(name+"="+enc(elm.options[j].value));
}
}
}else{
if(dojo.lang.inArray(type,["radio","checkbox"])){
if(elm.checked){
_4f0.push(name+"="+enc(elm.value));
}
}else{
if(!dojo.lang.inArray(type,["file","submit","reset","button"])){
_4f0.push(name+"="+enc(elm.value));
}
}
}
}
var _4f6=_4ed.getElementsByTagName("input");
for(var i=0;i<_4f6.length;i++){
var _4f7=_4f6[i];
if(_4f7.type.toLowerCase()=="image"&&_4f7.form==_4ed){
var name=enc(_4f7.name);
_4f0.push(name+"="+enc(_4f7.value));
_4f0.push(name+".x=0");
_4f0.push(name+".y=0");
}
}
return _4f0.join("&")+"&";
};
dojo.io.setIFrameSrc=function(_4f8,src,_4fa){
try{
var r=dojo.render.html;
if(!_4fa){
if(r.safari){
_4f8.location=src;
}else{
frames[_4f8.name].location=src;
}
}else{
var idoc;
if(r.ie){
idoc=_4f8.contentWindow.document;
}else{
if(r.moz){
idoc=_4f8.contentWindow;
}else{
if(r.safari){
idoc=_4f8.document;
}
}
}
idoc.location.replace(src);
}
}
catch(e){
dojo.debug(e);
dojo.debug("setIFrameSrc: "+e);
}
};
dojo.io.XMLHTTPTransport=new function(){
var _4fd=this;
this.initialHref=window.location.href;
this.initialHash=window.location.hash;
this.moveForward=false;
var _4fe={};
this.useCache=false;
this.preventCache=false;
this.historyStack=[];
this.forwardStack=[];
this.historyIframe=null;
this.bookmarkAnchor=null;
this.locationTimer=null;
function getCacheKey(url,_500,_501){
return url+"|"+_500+"|"+_501.toLowerCase();
}
function addToCache(url,_503,_504,http){
_4fe[getCacheKey(url,_503,_504)]=http;
}
function getFromCache(url,_507,_508){
return _4fe[getCacheKey(url,_507,_508)];
}
this.clearCache=function(){
_4fe={};
};
function doLoad(_509,http,url,_50c,_50d){
if((http.status==200)||(location.protocol=="file:"&&http.status==0)){
var ret;
if(_509.method.toLowerCase()=="head"){
var _50f=http.getAllResponseHeaders();
ret={};
ret.toString=function(){
return _50f;
};
var _510=_50f.split(/[\r\n]+/g);
for(var i=0;i<_510.length;i++){
var pair=_510[i].match(/^([^:]+)\s*:\s*(.+)$/i);
if(pair){
ret[pair[1]]=pair[2];
}
}
}else{
if(_509.mimetype=="text/javascript"){
try{
ret=dj_eval(http.responseText);
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=null;
}
}else{
if(_509.mimetype=="text/json"){
try{
ret=dj_eval("("+http.responseText+")");
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=false;
}
}else{
if((_509.mimetype=="application/xml")||(_509.mimetype=="text/xml")){
ret=http.responseXML;
if(!ret||typeof ret=="string"){
ret=dojo.dom.createDocumentFromText(http.responseText);
}
}else{
ret=http.responseText;
}
}
}
}
if(_50d){
addToCache(url,_50c,_509.method,http);
}
_509[(typeof _509.load=="function")?"load":"handle"]("load",ret,http);
}else{
var _513=new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
_509[(typeof _509.error=="function")?"error":"handle"]("error",_513,http);
}
}
function setHeaders(http,_515){
if(_515["headers"]){
for(var _516 in _515["headers"]){
if(_516.toLowerCase()=="content-type"&&!_515["contentType"]){
_515["contentType"]=_515["headers"][_516];
}else{
http.setRequestHeader(_516,_515["headers"][_516]);
}
}
}
}
this.addToHistory=function(args){
var _518=args["back"]||args["backButton"]||args["handle"];
var hash=null;
if(!this.historyIframe){
this.historyIframe=window.frames["djhistory"];
}
if(!this.bookmarkAnchor){
this.bookmarkAnchor=document.createElement("a");
(document.body||document.getElementsByTagName("body")[0]).appendChild(this.bookmarkAnchor);
this.bookmarkAnchor.style.display="none";
}
if((!args["changeUrl"])||(dojo.render.html.ie)){
var url=dojo.hostenv.getBaseScriptUri()+"iframe_history.html?"+(new Date()).getTime();
this.moveForward=true;
dojo.io.setIFrameSrc(this.historyIframe,url,false);
}
if(args["changeUrl"]){
hash="#"+((args["changeUrl"]!==true)?args["changeUrl"]:(new Date()).getTime());
setTimeout("window.location.href = '"+hash+"';",1);
this.bookmarkAnchor.href=hash;
if(dojo.render.html.ie){
var _51b=_518;
var lh=null;
var hsl=this.historyStack.length-1;
if(hsl>=0){
while(!this.historyStack[hsl]["urlHash"]){
hsl--;
}
lh=this.historyStack[hsl]["urlHash"];
}
if(lh){
_518=function(){
if(window.location.hash!=""){
setTimeout("window.location.href = '"+lh+"';",1);
}
_51b();
};
}
this.forwardStack=[];
var _51e=args["forward"]||args["forwardButton"];
var tfw=function(){
if(window.location.hash!=""){
window.location.href=hash;
}
if(_51e){
_51e();
}
};
if(args["forward"]){
args.forward=tfw;
}else{
if(args["forwardButton"]){
args.forwardButton=tfw;
}
}
}else{
if(dojo.render.html.moz){
if(!this.locationTimer){
this.locationTimer=setInterval("dojo.io.XMLHTTPTransport.checkLocation();",200);
}
}
}
}
this.historyStack.push({"url":url,"callback":_518,"kwArgs":args,"urlHash":hash});
};
this.checkLocation=function(){
var hsl=this.historyStack.length;
if((window.location.hash==this.initialHash)||(window.location.href==this.initialHref)&&(hsl==1)){
this.handleBackButton();
return;
}
if(this.forwardStack.length>0){
if(this.forwardStack[this.forwardStack.length-1].urlHash==window.location.hash){
this.handleForwardButton();
return;
}
}
if((hsl>=2)&&(this.historyStack[hsl-2])){
if(this.historyStack[hsl-2].urlHash==window.location.hash){
this.handleBackButton();
return;
}
}
};
this.iframeLoaded=function(evt,_522){
var isp=_522.href.split("?");
if(isp.length<2){
if(this.historyStack.length==1){
this.handleBackButton();
}
return;
}
var _524=isp[1];
if(this.moveForward){
this.moveForward=false;
return;
}
var last=this.historyStack.pop();
if(!last){
if(this.forwardStack.length>0){
var next=this.forwardStack[this.forwardStack.length-1];
if(_524==next.url.split("?")[1]){
this.handleForwardButton();
}
}
return;
}
this.historyStack.push(last);
if(this.historyStack.length>=2){
if(isp[1]==this.historyStack[this.historyStack.length-2].url.split("?")[1]){
this.handleBackButton();
}
}else{
this.handleBackButton();
}
};
this.handleBackButton=function(){
var last=this.historyStack.pop();
if(!last){
return;
}
if(last["callback"]){
last.callback();
}else{
if(last.kwArgs["backButton"]){
last.kwArgs["backButton"]();
}else{
if(last.kwArgs["back"]){
last.kwArgs["back"]();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("back");
}
}
}
}
this.forwardStack.push(last);
};
this.handleForwardButton=function(){
var last=this.forwardStack.pop();
if(!last){
return;
}
if(last.kwArgs["forward"]){
last.kwArgs.forward();
}else{
if(last.kwArgs["forwardButton"]){
last.kwArgs.forwardButton();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("forward");
}
}
}
this.historyStack.push(last);
};
this.inFlight=[];
this.inFlightTimer=null;
this.startWatchingInFlight=function(){
if(!this.inFlightTimer){
this.inFlightTimer=setInterval("dojo.io.XMLHTTPTransport.watchInFlight();",10);
}
};
this.watchInFlight=function(){
for(var x=this.inFlight.length-1;x>=0;x--){
var tif=this.inFlight[x];
if(!tif){
this.inFlight.splice(x,1);
continue;
}
if(4==tif.http.readyState){
this.inFlight.splice(x,1);
doLoad(tif.req,tif.http,tif.url,tif.query,tif.useCache);
if(this.inFlight.length==0){
clearInterval(this.inFlightTimer);
this.inFlightTimer=null;
}
}
}
};
var _52b=dojo.hostenv.getXmlhttpObject()?true:false;
this.canHandle=function(_52c){
return _52b&&dojo.lang.inArray((_52c["mimetype"]||"".toLowerCase()),["text/plain","text/html","application/xml","text/xml","text/javascript","text/json"])&&dojo.lang.inArray(_52c["method"].toLowerCase(),["post","get","head"])&&!(_52c["formNode"]&&dojo.io.formHasFile(_52c["formNode"]));
};
this.multipartBoundary="45309FFF-BD65-4d50-99C9-36986896A96F";
this.bind=function(_52d){
if(!_52d["url"]){
if(!_52d["formNode"]&&(_52d["backButton"]||_52d["back"]||_52d["changeUrl"]||_52d["watchForURL"])&&(!djConfig.preventBackButtonFix)){
this.addToHistory(_52d);
return true;
}
}
var url=_52d.url;
var _52f="";
if(_52d["formNode"]){
var ta=_52d.formNode.getAttribute("action");
if((ta)&&(!_52d["url"])){
url=ta;
}
var tp=_52d.formNode.getAttribute("method");
if((tp)&&(!_52d["method"])){
_52d.method=tp;
}
_52f+=dojo.io.encodeForm(_52d.formNode,_52d.encoding);
}
if(url.indexOf("#")>-1){
dojo.debug("Warning: dojo.io.bind: stripping hash values from url:",url);
url=url.split("#")[0];
}
if(_52d["file"]){
_52d.method="post";
}
if(!_52d["method"]){
_52d.method="get";
}
if(_52d.method.toLowerCase()=="get"){
_52d.multipart=false;
}else{
if(_52d["file"]){
_52d.multipart=true;
}else{
if(!_52d["multipart"]){
_52d.multipart=false;
}
}
}
if(_52d["backButton"]||_52d["back"]||_52d["changeUrl"]){
this.addToHistory(_52d);
}
var _532=_52d["content"]||{};
if(_52d.sendTransport){
_532["dojo.transport"]="xmlhttp";
}
do{
if(_52d.postContent){
_52f=_52d.postContent;
break;
}
if(_532){
_52f+=dojo.io.argsFromMap(_532,_52d.encoding);
}
if(_52d.method.toLowerCase()=="get"||!_52d.multipart){
break;
}
var t=[];
if(_52f.length){
var q=_52f.split("&");
for(var i=0;i<q.length;++i){
if(q[i].length){
var p=q[i].split("=");
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+p[0]+"\"","",p[1]);
}
}
}
if(_52d.file){
if(dojo.lang.isArray(_52d.file)){
for(var i=0;i<_52d.file.length;++i){
var o=_52d.file[i];
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}else{
var o=_52d.file;
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}
if(t.length){
t.push("--"+this.multipartBoundary+"--","");
_52f=t.join("\r\n");
}
}while(false);
var _538=_52d["sync"]?false:true;
var _539=_52d["preventCache"]||(this.preventCache==true&&_52d["preventCache"]!=false);
var _53a=_52d["useCache"]==true||(this.useCache==true&&_52d["useCache"]!=false);
if(!_539&&_53a){
var _53b=getFromCache(url,_52f,_52d.method);
if(_53b){
doLoad(_52d,_53b,url,_52f,false);
return;
}
}
var http=dojo.hostenv.getXmlhttpObject();
var _53d=false;
if(_538){
this.inFlight.push({"req":_52d,"http":http,"url":url,"query":_52f,"useCache":_53a});
this.startWatchingInFlight();
}
if(_52d.method.toLowerCase()=="post"){
http.open("POST",url,_538);
setHeaders(http,_52d);
http.setRequestHeader("Content-Type",_52d.multipart?("multipart/form-data; boundary="+this.multipartBoundary):(_52d.contentType||"application/x-www-form-urlencoded"));
http.send(_52f);
}else{
var _53e=url;
if(_52f!=""){
_53e+=(_53e.indexOf("?")>-1?"&":"?")+_52f;
}
if(_539){
_53e+=(dojo.string.endsWithAny(_53e,"?","&")?"":(_53e.indexOf("?")>-1?"&":"?"))+"dojo.preventCache="+new Date().valueOf();
}
http.open(_52d.method.toUpperCase(),_53e,_538);
setHeaders(http,_52d);
http.send(null);
}
if(!_538){
doLoad(_52d,http,url,_52f,_53a);
}
_52d.abort=function(){
return http.abort();
};
return;
};
dojo.io.transports.addTransport("XMLHTTPTransport");
};
dojo.provide("dojo.io.cookie");
dojo.io.cookie.setCookie=function(name,_540,days,path,_543,_544){
var _545=-1;
if(typeof days=="number"&&days>=0){
var d=new Date();
d.setTime(d.getTime()+(days*24*60*60*1000));
_545=d.toGMTString();
}
_540=escape(_540);
document.cookie=name+"="+_540+";"+(_545!=-1?" expires="+_545+";":"")+(path?"path="+path:"")+(_543?"; domain="+_543:"")+(_544?"; secure":"");
};
dojo.io.cookie.set=dojo.io.cookie.setCookie;
dojo.io.cookie.getCookie=function(name){
var idx=document.cookie.indexOf(name+"=");
if(idx==-1){
return null;
}
value=document.cookie.substring(idx+name.length+1);
var end=value.indexOf(";");
if(end==-1){
end=value.length;
}
value=value.substring(0,end);
value=unescape(value);
return value;
};
dojo.io.cookie.get=dojo.io.cookie.getCookie;
dojo.io.cookie.deleteCookie=function(name){
dojo.io.cookie.setCookie(name,"-",0);
};
dojo.io.cookie.setObjectCookie=function(name,obj,days,path,_54f,_550,_551){
if(arguments.length==5){
_551=_54f;
_54f=null;
_550=null;
}
var _552=[],cookie,value="";
if(!_551){
cookie=dojo.io.cookie.getObjectCookie(name);
}
if(days>=0){
if(!cookie){
cookie={};
}
for(var prop in obj){
if(prop==null){
delete cookie[prop];
}else{
if(typeof obj[prop]=="string"||typeof obj[prop]=="number"){
cookie[prop]=obj[prop];
}
}
}
prop=null;
for(var prop in cookie){
_552.push(escape(prop)+"="+escape(cookie[prop]));
}
value=_552.join("&");
}
dojo.io.cookie.setCookie(name,value,days,path,_54f,_550);
};
dojo.io.cookie.getObjectCookie=function(name){
var _555=null,cookie=dojo.io.cookie.getCookie(name);
if(cookie){
_555={};
var _556=cookie.split("&");
for(var i=0;i<_556.length;i++){
var pair=_556[i].split("=");
var _559=pair[1];
if(isNaN(_559)){
_559=unescape(pair[1]);
}
_555[unescape(pair[0])]=_559;
}
}
return _555;
};
dojo.io.cookie.isSupported=function(){
if(typeof navigator.cookieEnabled!="boolean"){
dojo.io.cookie.setCookie("__TestingYourBrowserForCookieSupport__","CookiesAllowed",90,null);
var _55a=dojo.io.cookie.getCookie("__TestingYourBrowserForCookieSupport__");
navigator.cookieEnabled=(_55a=="CookiesAllowed");
if(navigator.cookieEnabled){
this.deleteCookie("__TestingYourBrowserForCookieSupport__");
}
}
return navigator.cookieEnabled;
};
if(!dojo.io.cookies){
dojo.io.cookies=dojo.io.cookie;
}
dojo.hostenv.conditionalLoadModule({common:["dojo.io",false,false],rhino:["dojo.io.RhinoIO",false,false],browser:[["dojo.io.BrowserIO",false,false],["dojo.io.cookie",false,false]]});
dojo.hostenv.moduleLoaded("dojo.io.*");
dojo.hostenv.conditionalLoadModule({common:["dojo.uri.Uri",false,false]});
dojo.hostenv.moduleLoaded("dojo.uri.*");
dojo.provide("dojo.io.IframeIO");
dojo.require("dojo.io.BrowserIO");
dojo.require("dojo.uri.*");
dojo.io.createIFrame=function(_55b,_55c){
if(window[_55b]){
return window[_55b];
}
if(window.frames[_55b]){
return window.frames[_55b];
}
var r=dojo.render.html;
var _55e=null;
var turi=dojo.uri.dojoUri("iframe_history.html?noInit=true");
var _560=((r.ie)&&(dojo.render.os.win))?"<iframe name='"+_55b+"' src='"+turi+"' onload='"+_55c+"'>":"iframe";
_55e=document.createElement(_560);
with(_55e){
name=_55b;
setAttribute("name",_55b);
id=_55b;
}
(document.body||document.getElementsByTagName("body")[0]).appendChild(_55e);
window[_55b]=_55e;
with(_55e.style){
position="absolute";
left=top="0px";
height=width="1px";
visibility="hidden";
}
if(!r.ie){
dojo.io.setIFrameSrc(_55e,turi,true);
_55e.onload=new Function(_55c);
}
return _55e;
};
dojo.io.iframeContentWindow=function(_561){
var win=_561.contentWindow||dojo.io.iframeContentDocument(_561).defaultView||dojo.io.iframeContentDocument(_561).__parent__||(_561.name&&document.frames[_561.name])||null;
return win;
};
dojo.io.iframeContentDocument=function(_563){
var doc=_563.contentDocument||((_563.contentWindow)&&(_563.contentWindow.document))||((_563.name)&&(document.frames[_563.name])&&(document.frames[_563.name].document))||null;
return doc;
};
dojo.io.IframeTransport=new function(){
var _565=this;
this.currentRequest=null;
this.requestQueue=[];
this.iframeName="dojoIoIframe";
this.fireNextRequest=function(){
if((this.currentRequest)||(this.requestQueue.length==0)){
return;
}
var cr=this.currentRequest=this.requestQueue.shift();
var fn=cr["formNode"];
var _568=cr["content"]||{};
if(cr.sendTransport){
_568["dojo.transport"]="iframe";
}
if(fn){
if(_568){
for(var x in _568){
if(!fn[x]){
var tn;
if(dojo.render.html.ie){
tn=document.createElement("<input type='hidden' name='"+x+"' value='"+_568[x]+"'>");
fn.appendChild(tn);
}else{
tn=document.createElement("input");
fn.appendChild(tn);
tn.type="hidden";
tn.name=x;
tn.value=_568[x];
}
}else{
fn[x].value=_568[x];
}
}
}
if(cr["url"]){
fn.setAttribute("action",cr.url);
}
if(!fn.getAttribute("method")){
fn.setAttribute("method",(cr["method"])?cr["method"]:"post");
}
fn.setAttribute("target",this.iframeName);
fn.target=this.iframeName;
fn.submit();
}else{
var _56b=dojo.io.argsFromMap(this.currentRequest.content);
var _56c=(cr.url.indexOf("?")>-1?"&":"?")+_56b;
dojo.io.setIFrameSrc(this.iframe,_56c,true);
}
};
this.canHandle=function(_56d){
return ((dojo.lang.inArray(_56d["mimetype"],["text/plain","text/html","application/xml","text/xml","text/javascript","text/json"]))&&((_56d["formNode"])&&(dojo.io.checkChildrenForFile(_56d["formNode"])))&&(dojo.lang.inArray(_56d["method"].toLowerCase(),["post","get"]))&&(!((_56d["sync"])&&(_56d["sync"]==true))));
};
this.bind=function(_56e){
this.requestQueue.push(_56e);
this.fireNextRequest();
return;
};
this.setUpIframe=function(){
this.iframe=dojo.io.createIFrame(this.iframeName,"dojo.io.IframeTransport.iframeOnload();");
};
this.iframeOnload=function(){
if(!_565.currentRequest){
_565.fireNextRequest();
return;
}
var ifr=_565.iframe;
var ifw=dojo.io.iframeContentWindow(ifr);
var _571;
var _572=false;
try{
var cmt=_565.currentRequest.mimetype;
if((cmt=="text/javascript")||(cmt=="text/json")){
var cd=dojo.io.iframeContentDocument(_565.iframe);
var js=cd.getElementsByTagName("textarea")[0].value;
if(cmt=="text/json"){
js="("+js+")";
}
_571=dj_eval(js);
}else{
if((cmt=="application/xml")||(cmt=="text/xml")){
_571=dojo.io.iframeContentDocument(_565.iframe);
}else{
_571=ifw.innerHTML;
}
}
_572=true;
}
catch(e){
var _576=new dojo.io.Error("IframeTransport Error");
if(dojo.lang.isFunction(_565.currentRequest["error"])){
_565.currentRequest.error("error",_576,_565.currentRequest);
}
}
try{
if(_572&&dojo.lang.isFunction(_565.currentRequest["load"])){
_565.currentRequest.load("load",_571,_565.currentRequest);
}
}
catch(e){
throw e;
}
finally{
_565.currentRequest=null;
_565.fireNextRequest();
}
};
dojo.io.transports.addTransport("IframeTransport");
};
dojo.addOnLoad(function(){
dojo.io.IframeTransport.setUpIframe();
});
dojo.provide("dojo.xml.Parse");
dojo.require("dojo.dom");
dojo.xml.Parse=function(){
this.parseFragment=function(_577){
var _578={};
var _579=dojo.dom.getTagName(_577);
_578[_579]=new Array(_577.tagName);
var _57a=this.parseAttributes(_577);
for(var attr in _57a){
if(!_578[attr]){
_578[attr]=[];
}
_578[attr][_578[attr].length]=_57a[attr];
}
var _57c=_577.childNodes;
for(var _57d in _57c){
switch(_57c[_57d].nodeType){
case dojo.dom.ELEMENT_NODE:
_578[_579].push(this.parseElement(_57c[_57d]));
break;
case dojo.dom.TEXT_NODE:
if(_57c.length==1){
if(!_578[_577.tagName]){
_578[_579]=[];
}
_578[_579].push({value:_57c[0].nodeValue});
}
break;
}
}
return _578;
};
this.parseElement=function(node,_57f,_580,_581){
var _582={};
var _583=dojo.dom.getTagName(node);
_582[_583]=[];
if((!_580)||(_583.substr(0,4).toLowerCase()=="dojo")){
var _584=this.parseAttributes(node);
for(var attr in _584){
if((!_582[_583][attr])||(typeof _582[_583][attr]!="array")){
_582[_583][attr]=[];
}
_582[_583][attr].push(_584[attr]);
}
_582[_583].nodeRef=node;
_582.tagName=_583;
_582.index=_581||0;
}
var _586=0;
for(var i=0;i<node.childNodes.length;i++){
var tcn=node.childNodes.item(i);
switch(tcn.nodeType){
case dojo.dom.ELEMENT_NODE:
_586++;
var ctn=dojo.dom.getTagName(tcn);
if(!_582[ctn]){
_582[ctn]=[];
}
_582[ctn].push(this.parseElement(tcn,true,_580,_586));
if((tcn.childNodes.length==1)&&(tcn.childNodes.item(0).nodeType==dojo.dom.TEXT_NODE)){
_582[ctn][_582[ctn].length-1].value=tcn.childNodes.item(0).nodeValue;
}
break;
case dojo.dom.TEXT_NODE:
if(node.childNodes.length==1){
_582[_583].push({value:node.childNodes.item(0).nodeValue});
}
break;
default:
break;
}
}
return _582;
};
this.parseAttributes=function(node){
var _58b={};
var atts=node.attributes;
for(var i=0;i<atts.length;i++){
var _58e=atts.item(i);
if((dojo.render.html.capable)&&(dojo.render.html.ie)){
if(!_58e){
continue;
}
if((typeof _58e=="object")&&(typeof _58e.nodeValue=="undefined")||(_58e.nodeValue==null)||(_58e.nodeValue=="")){
continue;
}
}
var nn=(_58e.nodeName.indexOf("dojo:")==-1)?_58e.nodeName:_58e.nodeName.split("dojo:")[1];
_58b[nn]={value:_58e.nodeValue};
}
return _58b;
};
};
dojo.provide("dojo.xml.domUtil");
dojo.require("dojo.graphics.color");
dojo.require("dojo.dom");
dojo.require("dojo.style");
dj_deprecated("dojo.xml.domUtil is deprecated, use dojo.dom instead");
dojo.xml.domUtil=new function(){
this.nodeTypes={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};
this.dojoml="http://www.dojotoolkit.org/2004/dojoml";
this.idIncrement=0;
this.getTagName=function(){
return dojo.dom.getTagName.apply(dojo.dom,arguments);
};
this.getUniqueId=function(){
return dojo.dom.getUniqueId.apply(dojo.dom,arguments);
};
this.getFirstChildTag=function(){
return dojo.dom.getFirstChildElement.apply(dojo.dom,arguments);
};
this.getLastChildTag=function(){
return dojo.dom.getLastChildElement.apply(dojo.dom,arguments);
};
this.getNextSiblingTag=function(){
return dojo.dom.getNextSiblingElement.apply(dojo.dom,arguments);
};
this.getPreviousSiblingTag=function(){
return dojo.dom.getPreviousSiblingElement.apply(dojo.dom,arguments);
};
this.forEachChildTag=function(node,_591){
var _592=this.getFirstChildTag(node);
while(_592){
if(_591(_592)=="break"){
break;
}
_592=this.getNextSiblingTag(_592);
}
};
this.moveChildren=function(){
return dojo.dom.moveChildren.apply(dojo.dom,arguments);
};
this.copyChildren=function(){
return dojo.dom.copyChildren.apply(dojo.dom,arguments);
};
this.clearChildren=function(){
return dojo.dom.removeChildren.apply(dojo.dom,arguments);
};
this.replaceChildren=function(){
return dojo.dom.replaceChildren.apply(dojo.dom,arguments);
};
this.getStyle=function(){
return dojo.style.getStyle.apply(dojo.style,arguments);
};
this.toCamelCase=function(){
return dojo.style.toCamelCase.apply(dojo.style,arguments);
};
this.toSelectorCase=function(){
return dojo.style.toSelectorCase.apply(dojo.style,arguments);
};
this.getAncestors=function(){
return dojo.dom.getAncestors.apply(dojo.dom,arguments);
};
this.isChildOf=function(){
return dojo.dom.isDescendantOf.apply(dojo.dom,arguments);
};
this.createDocumentFromText=function(){
return dojo.dom.createDocumentFromText.apply(dojo.dom,arguments);
};
if(dojo.render.html.capable||dojo.render.svg.capable){
this.createNodesFromText=function(txt,wrap){
return dojo.dom.createNodesFromText.apply(dojo.dom,arguments);
};
}
this.extractRGB=function(_595){
return dojo.graphics.color.extractRGB(_595);
};
this.hex2rgb=function(hex){
return dojo.graphics.color.hex2rgb(hex);
};
this.rgb2hex=function(r,g,b){
return dojo.graphics.color.rgb2hex(r,g,b);
};
this.insertBefore=function(){
return dojo.dom.insertBefore.apply(dojo.dom,arguments);
};
this.before=this.insertBefore;
this.insertAfter=function(){
return dojo.dom.insertAfter.apply(dojo.dom,arguments);
};
this.after=this.insertAfter;
this.insert=function(){
return dojo.dom.insertAtPosition.apply(dojo.dom,arguments);
};
this.insertAtIndex=function(){
return dojo.dom.insertAtIndex.apply(dojo.dom,arguments);
};
this.textContent=function(){
return dojo.dom.textContent.apply(dojo.dom,arguments);
};
this.renderedTextContent=function(){
return dojo.dom.renderedTextContent.apply(dojo.dom,arguments);
};
this.remove=function(node){
return dojo.dom.removeNode.apply(dojo.dom,arguments);
};
};
dojo.provide("dojo.xml.htmlUtil");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dj_deprecated("dojo.xml.htmlUtil is deprecated, use dojo.html instead");
dojo.xml.htmlUtil=new function(){
this.styleSheet=dojo.style.styleSheet;
this._clobberSelection=function(){
return dojo.html.clearSelection.apply(dojo.html,arguments);
};
this.disableSelect=function(){
return dojo.html.disableSelection.apply(dojo.html,arguments);
};
this.enableSelect=function(){
return dojo.html.enableSelection.apply(dojo.html,arguments);
};
this.getInnerWidth=function(){
return dojo.style.getInnerWidth.apply(dojo.style,arguments);
};
this.getOuterWidth=function(node){
dj_unimplemented("dojo.xml.htmlUtil.getOuterWidth");
};
this.getInnerHeight=function(){
return dojo.style.getInnerHeight.apply(dojo.style,arguments);
};
this.getOuterHeight=function(node){
dj_unimplemented("dojo.xml.htmlUtil.getOuterHeight");
};
this.getTotalOffset=function(){
return dojo.style.getTotalOffset.apply(dojo.style,arguments);
};
this.totalOffsetLeft=function(){
return dojo.style.totalOffsetLeft.apply(dojo.style,arguments);
};
this.getAbsoluteX=this.totalOffsetLeft;
this.totalOffsetTop=function(){
return dojo.style.totalOffsetTop.apply(dojo.style,arguments);
};
this.getAbsoluteY=this.totalOffsetTop;
this.getEventTarget=function(){
return dojo.html.getEventTarget.apply(dojo.html,arguments);
};
this.getScrollTop=function(){
return dojo.html.getScrollTop.apply(dojo.html,arguments);
};
this.getScrollLeft=function(){
return dojo.html.getScrollLeft.apply(dojo.html,arguments);
};
this.evtTgt=this.getEventTarget;
this.getParentOfType=function(){
return dojo.html.getParentOfType.apply(dojo.html,arguments);
};
this.getAttribute=function(){
return dojo.html.getAttribute.apply(dojo.html,arguments);
};
this.getAttr=function(node,attr){
dj_deprecated("dojo.xml.htmlUtil.getAttr is deprecated, use dojo.xml.htmlUtil.getAttribute instead");
return dojo.xml.htmlUtil.getAttribute(node,attr);
};
this.hasAttribute=function(){
return dojo.html.hasAttribute.apply(dojo.html,arguments);
};
this.hasAttr=function(node,attr){
dj_deprecated("dojo.xml.htmlUtil.hasAttr is deprecated, use dojo.xml.htmlUtil.hasAttribute instead");
return dojo.xml.htmlUtil.hasAttribute(node,attr);
};
this.getClass=function(){
return dojo.html.getClass.apply(dojo.html,arguments);
};
this.hasClass=function(){
return dojo.html.hasClass.apply(dojo.html,arguments);
};
this.prependClass=function(){
return dojo.html.prependClass.apply(dojo.html,arguments);
};
this.addClass=function(){
return dojo.html.addClass.apply(dojo.html,arguments);
};
this.setClass=function(){
return dojo.html.setClass.apply(dojo.html,arguments);
};
this.removeClass=function(){
return dojo.html.removeClass.apply(dojo.html,arguments);
};
this.classMatchType={ContainsAll:0,ContainsAny:1,IsOnly:2};
this.getElementsByClass=function(){
return dojo.html.getElementsByClass.apply(dojo.html,arguments);
};
this.getElementsByClassName=this.getElementsByClass;
this.setOpacity=function(){
return dojo.style.setOpacity.apply(dojo.style,arguments);
};
this.getOpacity=function(){
return dojo.style.getOpacity.apply(dojo.style,arguments);
};
this.clearOpacity=function(){
return dojo.style.clearOpacity.apply(dojo.style,arguments);
};
this.gravity=function(){
return dojo.html.gravity.apply(dojo.html,arguments);
};
this.gravity.NORTH=1;
this.gravity.SOUTH=1<<1;
this.gravity.EAST=1<<2;
this.gravity.WEST=1<<3;
this.overElement=function(){
return dojo.html.overElement.apply(dojo.html,arguments);
};
this.insertCssRule=function(){
return dojo.style.insertCssRule.apply(dojo.style,arguments);
};
this.insertCSSRule=function(_5a1,_5a2,_5a3){
dj_deprecated("dojo.xml.htmlUtil.insertCSSRule is deprecated, use dojo.xml.htmlUtil.insertCssRule instead");
return dojo.xml.htmlUtil.insertCssRule(_5a1,_5a2,_5a3);
};
this.removeCssRule=function(){
return dojo.style.removeCssRule.apply(dojo.style,arguments);
};
this.removeCSSRule=function(_5a4){
dj_deprecated("dojo.xml.htmlUtil.removeCSSRule is deprecated, use dojo.xml.htmlUtil.removeCssRule instead");
return dojo.xml.htmlUtil.removeCssRule(_5a4);
};
this.insertCssFile=function(){
return dojo.style.insertCssFile.apply(dojo.style,arguments);
};
this.insertCSSFile=function(URI,doc,_5a7){
dj_deprecated("dojo.xml.htmlUtil.insertCSSFile is deprecated, use dojo.xml.htmlUtil.insertCssFile instead");
return dojo.xml.htmlUtil.insertCssFile(URI,doc,_5a7);
};
this.getBackgroundColor=function(){
return dojo.style.getBackgroundColor.apply(dojo.style,arguments);
};
this.getUniqueId=function(){
return dojo.dom.getUniqueId();
};
this.getStyle=function(){
return dojo.style.getStyle.apply(dojo.style,arguments);
};
};
dojo.require("dojo.xml.Parse");
dojo.hostenv.conditionalLoadModule({common:["dojo.xml.domUtil"],browser:["dojo.xml.htmlUtil"],svg:["dojo.xml.svgUtil"]});
dojo.hostenv.moduleLoaded("dojo.xml.*");
dojo.hostenv.conditionalLoadModule({common:["dojo.lang"]});
dojo.hostenv.moduleLoaded("dojo.lang.*");
dojo.require("dojo.lang.*");
dojo.provide("dojo.storage");
dojo.provide("dojo.storage.StorageProvider");
dojo.storage=new function(){
this.provider=null;
this.setProvider=function(obj){
this.provider=obj;
};
this.set=function(key,_5aa,_5ab){
if(!this.provider){
return false;
}
return this.provider.set(key,_5aa,_5ab);
};
this.get=function(key,_5ad){
if(!this.provider){
return false;
}
return this.provider.get(key,_5ad);
};
this.remove=function(key,_5af){
return this.provider.remove(key,_5af);
};
};
dojo.storage.StorageProvider=function(){
};
dojo.lang.extend(dojo.storage.StorageProvider,{namespace:"*",initialized:false,free:function(){
dojo.unimplemented("dojo.storage.StorageProvider.free");
return 0;
},freeK:function(){
return dojo.math.round(this.free()/1024,0);
},set:function(key,_5b1,_5b2){
dojo.unimplemented("dojo.storage.StorageProvider.set");
},get:function(key,_5b4){
dojo.unimplemented("dojo.storage.StorageProvider.get");
},remove:function(key,_5b6,_5b7){
dojo.unimplemented("dojo.storage.StorageProvider.set");
}});
dojo.provide("dojo.storage.browser");
dojo.require("dojo.storage");
dojo.require("dojo.uri.*");
dojo.storage.browser.StorageProvider=function(){
this.initialized=false;
this.flash=null;
this.backlog=[];
};
dojo.inherits(dojo.storage.browser.StorageProvider,dojo.storage.StorageProvider);
dojo.lang.extend(dojo.storage.browser.StorageProvider,{storageOnLoad:function(){
this.initialized=true;
this.hideStore();
while(this.backlog.length){
this.set.apply(this,this.backlog.shift());
}
},unHideStore:function(){
var _5b8=dojo.byId("dojo-storeContainer");
with(_5b8.style){
position="absolute";
overflow="visible";
width="215px";
height="138px";
left="30px";
top="30px";
visiblity="visible";
zIndex="20";
border="1px solid black";
}
},hideStore:function(_5b9){
var _5ba=dojo.byId("dojo-storeContainer");
with(_5ba.style){
left="-300px";
top="-300px";
}
},set:function(key,_5bc,ns){
if(!this.initialized){
this.backlog.push([key,_5bc,ns]);
return "pending";
}
return this.flash.set(key,_5bc,ns||this.namespace);
},get:function(key,ns){
return this.flash.get(key,ns||this.namespace);
},writeStorage:function(){
var _5c0=dojo.uri.dojoUri("src/storage/Storage.swf").toString();
var _5c1="http";
var _5c2=new RegExp("https:","i");
if(_5c2.test(window.location.href)){
_5c1="https";
}
var _5c3=["<div id=\"dojo-storeContainer\"","style=\"position: absolute; left: -300px; top: -300px;\">"];
if(dojo.render.html.ie){
_5c3.push("<object");
_5c3.push("\tstyle=\"border: 1px solid black;\"");
_5c3.push("\tclassid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\"");
_5c3.push("\tcodebase=\""+_5c1+"://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0\"");
_5c3.push("\twidth=\"215\" height=\"138\" id=\"dojoStorage\">");
_5c3.push("\t<param name=\"movie\" value=\""+_5c0+"\">");
_5c3.push("\t<param name=\"quality\" value=\"high\">");
_5c3.push("</object>");
}else{
_5c3.push("<embed src=\""+_5c0+"\" width=\"215\" height=\"138\" ");
_5c3.push("\tquality=\"high\" ");
_5c3.push("\tpluginspage=\""+_5c1+"://www.macromedia.com/go/getflashplayer\" ");
_5c3.push("\ttype=\"application/x-shockwave-flash\" ");
_5c3.push("\tname=\"dojoStorage\">");
_5c3.push("</embed>");
}
_5c3.push("</div>");
document.write(_5c3.join(""));
}});
dojo.storage.setProvider(new dojo.storage.browser.StorageProvider());
dojo.storage.provider.writeStorage();
dojo.addOnLoad(function(){
dojo.storage.provider.flash=(dojo.render.html.ie)?window["dojoStorage"]:document["dojoStorage"];
});
dojo.hostenv.conditionalLoadModule({common:["dojo.storage"],browser:["dojo.storage.browser"]});
dojo.hostenv.moduleLoaded("dojo.storage.*");
dojo.provide("dojo.collections.Collections");
dojo.collections={Collections:true};
dojo.collections.DictionaryEntry=function(k,v){
this.key=k;
this.value=v;
this.valueOf=function(){
return this.value;
};
this.toString=function(){
return this.value;
};
};
dojo.collections.Iterator=function(a){
var obj=a;
var _5c8=0;
this.atEnd=(_5c8>=obj.length-1);
this.current=obj[_5c8];
this.moveNext=function(){
if(++_5c8>=obj.length){
this.atEnd=true;
}
if(this.atEnd){
return false;
}
this.current=obj[_5c8];
return true;
};
this.reset=function(){
_5c8=0;
this.atEnd=false;
this.current=obj[_5c8];
};
};
dojo.collections.DictionaryIterator=function(obj){
var arr=[];
for(var p in obj){
arr.push(obj[p]);
}
var _5cc=0;
this.atEnd=(_5cc>=arr.length-1);
this.current=arr[_5cc]||null;
this.entry=this.current||null;
this.key=(this.entry)?this.entry.key:null;
this.value=(this.entry)?this.entry.value:null;
this.moveNext=function(){
if(++_5cc>=arr.length){
this.atEnd=true;
}
if(this.atEnd){
return false;
}
this.entry=this.current=arr[_5cc];
if(this.entry){
this.key=this.entry.key;
this.value=this.entry.value;
}
return true;
};
this.reset=function(){
_5cc=0;
this.atEnd=false;
this.current=arr[_5cc]||null;
this.entry=this.current||null;
this.key=(this.entry)?this.entry.key:null;
this.value=(this.entry)?this.entry.value:null;
};
};
dojo.provide("dojo.collections.SortedList");
dojo.require("dojo.collections.Collections");
dojo.collections.SortedList=function(_5cd){
var _5ce=this;
var _5cf={};
var q=[];
var _5d1=function(a,b){
if(a.key>b.key){
return 1;
}
if(a.key<b.key){
return -1;
}
return 0;
};
var _5d4=function(){
q=[];
var e=_5ce.getIterator();
while(!e.atEnd){
q.push(e.entry);
e.moveNext();
}
q.sort(_5d1);
};
this.count=q.length;
this.add=function(k,v){
if(!_5cf[k]){
_5cf[k]=new dojo.collections.DictionaryEntry(k,v);
this.count=q.push(_5cf[k]);
q.sort(_5d1);
}
};
this.clear=function(){
_5cf={};
q=[];
this.count=q.length;
};
this.clone=function(){
return new dojo.collections.SortedList(this);
};
this.contains=this.containsKey=function(k){
return (_5cf[k]!=null);
};
this.containsValue=function(o){
var e=this.getIterator();
while(!e.atEnd){
if(e.value==o){
return true;
}
e.moveNext();
}
return false;
};
this.copyTo=function(arr,i){
var e=this.getIterator();
var idx=i;
while(!e.atEnd){
arr.splice(idx,0,e.entry);
idx++;
e.moveNext();
}
};
this.getByIndex=function(i){
return q[i].value;
};
this.getIterator=function(){
return new dojo.collections.DictionaryIterator(_5cf);
};
this.getKey=function(i){
return q[i].key;
};
this.getKeyList=function(){
var arr=[];
var e=this.getIterator();
while(!e.atEnd){
arr.push(e.key);
e.moveNext();
}
return arr;
};
this.getValueList=function(){
var arr=[];
var e=this.getIterator();
while(!e.atEnd){
arr.push(e.value);
e.moveNext();
}
return arr;
};
this.indexOfKey=function(k){
for(var i=0;i<q.length;i++){
if(q[i].key==k){
return i;
}
}
return -1;
};
this.indexOfValue=function(o){
for(var i=0;i<q.length;i++){
if(q[i].value==o){
return i;
}
}
return -1;
};
this.item=function(k){
return _5cf[k];
};
this.remove=function(k){
delete _5cf[k];
_5d4();
this.count=q.length;
};
this.removeAt=function(i){
delete _5cf[q[i].key];
_5d4();
this.count=q.length;
};
this.setByIndex=function(i,o){
_5cf[q[i].key].value=o;
_5d4();
this.count=q.length;
};
if(_5cd){
var e=_5cd.getIterator();
while(!e.atEnd){
q[q.length]=_5cf[e.key]=new dojo.collections.DictionaryEntry(e.key,e.value);
e.moveNext();
}
q.sort(_5d1);
}
};
dojo.provide("dojo.collections.Dictionary");
dojo.require("dojo.collections.Collections");
dojo.collections.Dictionary=function(_5ef){
var _5f0={};
this.count=0;
this.add=function(k,v){
_5f0[k]=new dojo.collections.DictionaryEntry(k,v);
this.count++;
};
this.clear=function(){
_5f0={};
this.count=0;
};
this.clone=function(){
return new dojo.collections.Dictionary(this);
};
this.contains=this.containsKey=function(k){
return (_5f0[k]!=null);
};
this.containsValue=function(v){
var e=this.getIterator();
while(!e.atEnd){
if(e.value==v){
return true;
}
e.moveNext();
}
return false;
};
this.getKeyList=function(){
var arr=[];
var e=this.getIterator();
while(!e.atEnd){
arr.push(e.key);
e.moveNext();
}
return arr;
};
this.getValueList=function(){
var arr=[];
var e=this.getIterator();
while(!e.atEnd){
arr.push(e.value);
e.moveNext();
}
return arr;
};
this.item=function(k){
return _5f0[k];
};
this.getIterator=function(){
return new dojo.collections.DictionaryIterator(_5f0);
};
this.remove=function(k){
delete _5f0[k];
this.count--;
};
if(_5ef){
var e=_5ef.getIterator();
while(!e.atEnd){
this.add(e.key,e.value);
e.moveNext();
}
}
};
dojo.provide("dojo.collections.Queue");
dojo.require("dojo.collections.Collections");
dojo.collections.Queue=function(arr){
var q=[];
if(arr){
q=q.concat(arr);
}
this.count=q.length;
this.clear=function(){
q=[];
this.count=q.length;
};
this.clone=function(){
return new dojo.collections.Queue(q);
};
this.contains=function(o){
for(var i=0;i<q.length;i++){
if(q[i]==o){
return true;
}
}
return false;
};
this.copyTo=function(arr,i){
arr.splice(i,0,q);
};
this.dequeue=function(){
var r=q.shift();
this.count=q.length;
return r;
};
this.enqueue=function(o){
this.count=q.push(o);
};
this.getIterator=function(){
return new dojo.collections.Iterator(q);
};
this.peek=function(){
return q[0];
};
this.toArray=function(){
return [].concat(q);
};
};
dojo.provide("dojo.collections.ArrayList");
dojo.require("dojo.collections.Collections");
dojo.collections.ArrayList=function(arr){
var _606=[];
if(arr){
_606=_606.concat(arr);
}
this.count=_606.length;
this.add=function(obj){
_606.push(obj);
this.count=_606.length;
};
this.addRange=function(a){
if(a.getIterator){
var e=a.getIterator();
while(!e.atEnd){
this.add(e.current);
e.moveNext();
}
this.count=_606.length;
}else{
for(var i=0;i<a.length;i++){
_606.push(a[i]);
}
this.count=_606.length;
}
};
this.clear=function(){
_606.splice(0,_606.length);
this.count=0;
};
this.clone=function(){
return new dojo.collections.ArrayList(_606);
};
this.contains=function(obj){
for(var i=0;i<_606.length;i++){
if(_606[i]==obj){
return true;
}
}
return false;
};
this.getIterator=function(){
return new dojo.collections.Iterator(_606);
};
this.indexOf=function(obj){
for(var i=0;i<_606.length;i++){
if(_606[i]==obj){
return i;
}
}
return -1;
};
this.insert=function(i,obj){
_606.splice(i,0,obj);
this.count=_606.length;
};
this.item=function(k){
return _606[k];
};
this.remove=function(obj){
var i=this.indexOf(obj);
if(i>=0){
_606.splice(i,1);
}
this.count=_606.length;
};
this.removeAt=function(i){
_606.splice(i,1);
this.count=_606.length;
};
this.reverse=function(){
_606.reverse();
};
this.sort=function(fn){
if(fn){
_606.sort(fn);
}else{
_606.sort();
}
};
this.setByIndex=function(i,obj){
_606[i]=obj;
this.count=_606.length;
};
this.toArray=function(){
return [].concat(_606);
};
this.toString=function(){
return _606.join(",");
};
};
dojo.provide("dojo.collections.Stack");
dojo.require("dojo.collections.Collections");
dojo.collections.Stack=function(arr){
var q=[];
if(arr){
q=q.concat(arr);
}
this.count=q.length;
this.clear=function(){
q=[];
this.count=q.length;
};
this.clone=function(){
return new dojo.collections.Stack(q);
};
this.contains=function(o){
for(var i=0;i<q.length;i++){
if(q[i]==o){
return true;
}
}
return false;
};
this.copyTo=function(arr,i){
arr.splice(i,0,q);
};
this.getIterator=function(){
return new dojo.collections.Iterator(q);
};
this.peek=function(){
return q[(q.length-1)];
};
this.pop=function(){
var r=q.pop();
this.count=q.length;
return r;
};
this.push=function(o){
this.count=q.push(o);
};
this.toArray=function(){
return [].concat(q);
};
};
dojo.provide("dojo.collections.Set");
dojo.require("dojo.collections.Collections");
dojo.require("dojo.collections.ArrayList");
dojo.collections.Set=new function(){
this.union=function(setA,setB){
if(setA.constructor==Array){
var setA=new dojo.collections.ArrayList(setA);
}
if(setB.constructor==Array){
var setB=new dojo.collections.ArrayList(setB);
}
if(!setA.toArray||!setB.toArray){
dojo.raise("Set operations can only be performed on array-based collections.");
}
var _622=new dojo.collections.ArrayList(setA.toArray());
var e=setB.getIterator();
while(!e.atEnd){
if(!_622.contains(e.current)){
_622.add(e.current);
}
}
return _622;
};
this.intersection=function(setA,setB){
if(setA.constructor==Array){
var setA=new dojo.collections.ArrayList(setA);
}
if(setB.constructor==Array){
var setB=new dojo.collections.ArrayList(setB);
}
if(!setA.toArray||!setB.toArray){
dojo.raise("Set operations can only be performed on array-based collections.");
}
var _626=new dojo.collections.ArrayList();
var e=setB.getIterator();
while(!e.atEnd){
if(setA.contains(e.current)){
_626.add(e.current);
}
e.moveNext();
}
return _626;
};
this.difference=function(setA,setB){
if(setA.constructor==Array){
var setA=new dojo.collections.ArrayList(setA);
}
if(setB.constructor==Array){
var setB=new dojo.collections.ArrayList(setB);
}
if(!setA.toArray||!setB.toArray){
dojo.raise("Set operations can only be performed on array-based collections.");
}
var _62a=new dojo.collections.ArrayList();
var e=setA.getIterator();
while(!e.atEnd){
if(!setB.contains(e.current)){
_62a.add(e.current);
}
e.moveNext();
}
return _62a;
};
this.isSubSet=function(setA,setB){
if(setA.constructor==Array){
var setA=new dojo.collections.ArrayList(setA);
}
if(setB.constructor==Array){
var setB=new dojo.collections.ArrayList(setB);
}
if(!setA.toArray||!setB.toArray){
dojo.raise("Set operations can only be performed on array-based collections.");
}
var e=setA.getIterator();
while(!e.atEnd){
if(!setB.contains(e.current)){
return false;
}
e.moveNext();
}
return true;
};
this.isSuperSet=function(setA,setB){
if(setA.constructor==Array){
var setA=new dojo.collections.ArrayList(setA);
}
if(setB.constructor==Array){
var setB=new dojo.collections.ArrayList(setB);
}
if(!setA.toArray||!setB.toArray){
dojo.raise("Set operations can only be performed on array-based collections.");
}
var e=setB.getIterator();
while(!e.atEnd){
if(!setA.contains(e.current)){
return false;
}
e.moveNext();
}
return true;
};
}();
dojo.hostenv.conditionalLoadModule({common:["dojo.collections.Collections","dojo.collections.SortedList","dojo.collections.Dictionary","dojo.collections.Queue","dojo.collections.ArrayList","dojo.collections.Stack","dojo.collections.Set"]});
dojo.hostenv.moduleLoaded("dojo.collections.*");
dojo.provide("dojo.graphics.htmlEffects");
dojo.require("dojo.fx.*");
dj_deprecated("dojo.graphics.htmlEffects is deprecated, use dojo.fx.html instead");
dojo.graphics.htmlEffects=dojo.fx.html;
dojo.hostenv.conditionalLoadModule({browser:["dojo.graphics.htmlEffects"]});
dojo.hostenv.moduleLoaded("dojo.graphics.*");
dojo.provide("dojo.widget.Manager");
dojo.require("dojo.lang");
dojo.require("dojo.event.*");
dojo.widget.manager=new function(){
this.widgets=[];
this.widgetIds=[];
this.topWidgets={};
var _632={};
var _633=[];
this.getUniqueId=function(_634){
return _634+"_"+(_632[_634]!=undefined?++_632[_634]:_632[_634]=0);
};
this.add=function(_635){
dojo.profile.start("dojo.widget.manager.add");
this.widgets.push(_635);
if(_635.widgetId==""){
if(_635["id"]){
_635.widgetId=_635["id"];
}else{
if(_635.extraArgs["id"]){
_635.widgetId=_635.extraArgs["id"];
}else{
_635.widgetId=this.getUniqueId(_635.widgetType);
}
}
}
if(this.widgetIds[_635.widgetId]){
dojo.debug("widget ID collision on ID: "+_635.widgetId);
}
this.widgetIds[_635.widgetId]=_635;
dojo.profile.end("dojo.widget.manager.add");
};
this.destroyAll=function(){
for(var x=this.widgets.length-1;x>=0;x--){
try{
this.widgets[x].destroy(true);
delete this.widgets[x];
}
catch(e){
}
}
};
this.remove=function(_637){
var tw=this.widgets[_637].widgetId;
delete this.widgetIds[tw];
this.widgets.splice(_637,1);
};
this.removeById=function(id){
for(var i=0;i<this.widgets.length;i++){
if(this.widgets[i].widgetId==id){
this.remove(i);
break;
}
}
};
this.getWidgetById=function(id){
return this.widgetIds[id];
};
this.getWidgetsByType=function(type){
var lt=type.toLowerCase();
var ret=[];
dojo.lang.forEach(this.widgets,function(x){
if(x.widgetType.toLowerCase()==lt){
ret.push(x);
}
});
return ret;
};
this.getWidgetsOfType=function(id){
dj_deprecated("getWidgetsOfType is depecrecated, use getWidgetsByType");
return dojo.widget.manager.getWidgetsByType(id);
};
this.getWidgetsByFilter=function(_641){
var ret=[];
dojo.lang.forEach(this.widgets,function(x){
if(_641(x)){
ret.push(x);
}
});
return ret;
};
this.getAllWidgets=function(){
return this.widgets.concat();
};
this.byId=this.getWidgetById;
this.byType=this.getWidgetsByType;
this.byFilter=this.getWidgetsByFilter;
var _644={};
var _645=["dojo.widget","dojo.webui.widgets"];
for(var i=0;i<_645.length;i++){
_645[_645[i]]=true;
}
this.registerWidgetPackage=function(_647){
if(!_645[_647]){
_645[_647]=true;
_645.push(_647);
}
};
this.getWidgetPackageList=function(){
return dojo.lang.map(_645,function(elt){
return (elt!==true?elt:undefined);
});
};
this.getImplementation=function(_649,_64a,_64b){
var impl=this.getImplementationName(_649);
if(impl){
var ret=new impl(_64a);
return ret;
}
};
this.getImplementationName=function(_64e){
var _64f=_64e.toLowerCase();
var impl=_644[_64f];
if(impl){
return impl;
}
if(!_633.length){
for(var _651 in dojo.render){
if(dojo.render[_651]["capable"]===true){
var _652=dojo.render[_651].prefixes;
for(var i=0;i<_652.length;i++){
_633.push(_652[i].toLowerCase());
}
}
}
_633.push("");
}
for(var i=0;i<_645.length;i++){
var _654=dojo.evalObjPath(_645[i]);
if(!_654){
continue;
}
for(var j=0;j<_633.length;j++){
if(!_654[_633[j]]){
continue;
}
for(var _656 in _654[_633[j]]){
if(_656.toLowerCase()!=_64f){
continue;
}
_644[_64f]=_654[_633[j]][_656];
return _644[_64f];
}
}
for(var j=0;j<_633.length;j++){
for(var _656 in _654){
if(_656.toLowerCase()!=(_633[j]+_64f)){
continue;
}
_644[_64f]=_654[_656];
return _644[_64f];
}
}
}
throw new Error("Could not locate \""+_64e+"\" class");
};
this.resizing=false;
this.onResized=function(){
if(this.resizing){
return;
}
try{
this.resizing=true;
for(var id in this.topWidgets){
var _658=this.topWidgets[id];
if(_658.onResized){
_658.onResized();
}
}
}
finally{
this.resizing=false;
}
};
if(typeof window!="undefined"){
dojo.addOnLoad(this,"onResized");
dojo.event.connect(window,"onresize",this,"onResized");
}
};
dojo.widget.getUniqueId=function(){
return dojo.widget.manager.getUniqueId.apply(dojo.widget.manager,arguments);
};
dojo.widget.addWidget=function(){
return dojo.widget.manager.add.apply(dojo.widget.manager,arguments);
};
dojo.widget.destroyAllWidgets=function(){
return dojo.widget.manager.destroyAll.apply(dojo.widget.manager,arguments);
};
dojo.widget.removeWidget=function(){
return dojo.widget.manager.remove.apply(dojo.widget.manager,arguments);
};
dojo.widget.removeWidgetById=function(){
return dojo.widget.manager.removeById.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetById=function(){
return dojo.widget.manager.getWidgetById.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetsByType=function(){
return dojo.widget.manager.getWidgetsByType.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetsByFilter=function(){
return dojo.widget.manager.getWidgetsByFilter.apply(dojo.widget.manager,arguments);
};
dojo.widget.byId=function(){
return dojo.widget.manager.getWidgetById.apply(dojo.widget.manager,arguments);
};
dojo.widget.byType=function(){
return dojo.widget.manager.getWidgetsByType.apply(dojo.widget.manager,arguments);
};
dojo.widget.byFilter=function(){
return dojo.widget.manager.getWidgetsByFilter.apply(dojo.widget.manager,arguments);
};
dojo.widget.all=function(n){
var _65a=dojo.widget.manager.getAllWidgets.apply(dojo.widget.manager,arguments);
if(arguments.length>0){
return _65a[n];
}
return _65a;
};
dojo.widget.registerWidgetPackage=function(){
return dojo.widget.manager.registerWidgetPackage.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetImplementation=function(){
return dojo.widget.manager.getImplementation.apply(dojo.widget.manager,arguments);
};
dojo.widget.getWidgetImplementationName=function(){
return dojo.widget.manager.getImplementationName.apply(dojo.widget.manager,arguments);
};
dojo.widget.widgets=dojo.widget.manager.widgets;
dojo.widget.widgetIds=dojo.widget.manager.widgetIds;
dojo.widget.root=dojo.widget.manager.root;
dojo.provide("dojo.widget.Widget");
dojo.provide("dojo.widget.tags");
dojo.require("dojo.lang");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.event.*");
dojo.require("dojo.string");
dojo.widget.Widget=function(){
this.children=[];
this.extraArgs={};
};
dojo.lang.extend(dojo.widget.Widget,{parent:null,isTopLevel:false,isModal:false,isEnabled:true,isHidden:false,isContainer:false,widgetId:"",widgetType:"Widget",toString:function(){
return "[Widget "+this.widgetType+", "+(this.widgetId||"NO ID")+"]";
},repr:function(){
return this.toString();
},enable:function(){
this.isEnabled=true;
},disable:function(){
this.isEnabled=false;
},hide:function(){
this.isHidden=true;
},show:function(){
this.isHidden=false;
},create:function(args,_65c,_65d){
this.satisfyPropertySets(args,_65c,_65d);
this.mixInProperties(args,_65c,_65d);
this.postMixInProperties(args,_65c,_65d);
dojo.widget.manager.add(this);
this.buildRendering(args,_65c,_65d);
this.initialize(args,_65c,_65d);
this.postInitialize(args,_65c,_65d);
this.postCreate(args,_65c,_65d);
return this;
},destroy:function(_65e){
this.uninitialize();
this.destroyRendering(_65e);
dojo.widget.manager.removeById(this.widgetId);
},destroyChildren:function(_65f){
_65f=(!_65f)?function(){
return true;
}:_65f;
for(var x=0;x<this.children.length;x++){
var tc=this.children[x];
if((tc)&&(_65f(tc))){
tc.destroy();
}
}
},destroyChildrenOfType:function(type){
type=type.toLowerCase();
this.destroyChildren(function(item){
if(item.widgetType.toLowerCase()==type){
return true;
}else{
return false;
}
});
},getChildrenOfType:function(type,_665){
var ret=[];
type=type.toLowerCase();
for(var x=0;x<this.children.length;x++){
if(this.children[x].widgetType.toLowerCase()==type){
ret.push(this.children[x]);
}
if(_665){
ret=ret.concat(this.children[x].getChildrenOfType(type,_665));
}
}
return ret;
},getDescendants:function(){
var _668=[];
var _669=[this];
var elem;
while(elem=_669.pop()){
_668.push(elem);
dojo.lang.forEach(elem.children,function(elem){
_669.push(elem);
});
}
return _668;
},satisfyPropertySets:function(args){
return args;
},mixInProperties:function(args,frag){
if((args["fastMixIn"])||(frag["fastMixIn"])){
for(var x in args){
this[x]=args[x];
}
return;
}
var _670;
var _671=dojo.widget.lcArgsCache[this.widgetType];
if(_671==null){
_671={};
for(var y in this){
_671[((new String(y)).toLowerCase())]=y;
}
dojo.widget.lcArgsCache[this.widgetType]=_671;
}
var _673={};
for(var x in args){
if(!this[x]){
var y=_671[(new String(x)).toLowerCase()];
if(y){
args[y]=args[x];
x=y;
}
}
if(_673[x]){
continue;
}
_673[x]=true;
if((typeof this[x])!=(typeof _670)){
if(typeof args[x]!="string"){
this[x]=args[x];
}else{
if(dojo.lang.isString(this[x])){
this[x]=args[x];
}else{
if(dojo.lang.isNumber(this[x])){
this[x]=new Number(args[x]);
}else{
if(dojo.lang.isBoolean(this[x])){
this[x]=(args[x].toLowerCase()=="false")?false:true;
}else{
if(dojo.lang.isFunction(this[x])){
var tn=dojo.lang.nameAnonFunc(new Function(args[x]),this);
dojo.event.connect(this,x,this,tn);
}else{
if(dojo.lang.isArray(this[x])){
this[x]=args[x].split(";");
}else{
if(this[x] instanceof Date){
this[x]=new Date(Number(args[x]));
}else{
if(typeof this[x]=="object"){
var _675=args[x].split(";");
for(var y=0;y<_675.length;y++){
var si=_675[y].indexOf(":");
if((si!=-1)&&(_675[y].length>si)){
this[x][dojo.string.trim(_675[y].substr(0,si))]=_675[y].substr(si+1);
}
}
}else{
this[x]=args[x];
}
}
}
}
}
}
}
}
}else{
this.extraArgs[x]=args[x];
}
}
},postMixInProperties:function(){
},initialize:function(args,frag){
return false;
},postInitialize:function(args,frag){
return false;
},postCreate:function(args,frag){
return false;
},uninitialize:function(){
return false;
},buildRendering:function(){
dj_unimplemented("dojo.widget.Widget.buildRendering, on "+this.toString()+", ");
return false;
},destroyRendering:function(){
dj_unimplemented("dojo.widget.Widget.destroyRendering");
return false;
},cleanUp:function(){
dj_unimplemented("dojo.widget.Widget.cleanUp");
return false;
},addedTo:function(_67d){
},addChild:function(_67e){
dj_unimplemented("dojo.widget.Widget.addChild");
return false;
},addChildAtIndex:function(_67f,_680){
dj_unimplemented("dojo.widget.Widget.addChildAtIndex");
return false;
},removeChild:function(_681){
dj_unimplemented("dojo.widget.Widget.removeChild");
return false;
},removeChildAtIndex:function(_682){
dj_unimplemented("dojo.widget.Widget.removeChildAtIndex");
return false;
},resize:function(_683,_684){
this.setWidth(_683);
this.setHeight(_684);
},setWidth:function(_685){
if((typeof _685=="string")&&(_685.substr(-1)=="%")){
this.setPercentageWidth(_685);
}else{
this.setNativeWidth(_685);
}
},setHeight:function(_686){
if((typeof _686=="string")&&(_686.substr(-1)=="%")){
this.setPercentageHeight(_686);
}else{
this.setNativeHeight(_686);
}
},setPercentageHeight:function(_687){
return false;
},setNativeHeight:function(_688){
return false;
},setPercentageWidth:function(_689){
return false;
},setNativeWidth:function(_68a){
return false;
},getDescendants:function(){
var _68b=[];
var _68c=[this];
var elem;
while(elem=_68c.pop()){
_68b.push(elem);
dojo.lang.forEach(elem.children,function(elem){
_68c.push(elem);
});
}
return _68b;
}});
dojo.widget.lcArgsCache={};
dojo.widget.tags={};
dojo.widget.tags.addParseTreeHandler=function(type){
var _690=type.toLowerCase();
this[_690]=function(_691,_692,_693,_694,_695){
return dojo.widget.buildWidgetFromParseTree(_690,_691,_692,_693,_694,_695);
};
};
dojo.widget.tags.addParseTreeHandler("dojo:widget");
dojo.widget.tags["dojo:propertyset"]=function(_696,_697,_698){
var _699=_697.parseProperties(_696["dojo:propertyset"]);
};
dojo.widget.tags["dojo:connect"]=function(_69a,_69b,_69c){
var _69d=_69b.parseProperties(_69a["dojo:connect"]);
};
dojo.widget.buildWidgetFromParseTree=function(type,frag,_6a0,_6a1,_6a2,_6a3){
var _6a4=type.split(":");
_6a4=(_6a4.length==2)?_6a4[1]:type;
var _6a5=_6a3||_6a0.parseProperties(frag["dojo:"+_6a4]);
var _6a6=dojo.widget.manager.getImplementation(_6a4);
if(!_6a6){
throw new Error("cannot find \""+_6a4+"\" widget");
}else{
if(!_6a6.create){
throw new Error("\""+_6a4+"\" widget object does not appear to implement *Widget");
}
}
_6a5["dojoinsertionindex"]=_6a2;
var ret=_6a6.create(_6a5,frag,_6a1);
return ret;
};
dojo.provide("dojo.widget.Parse");
dojo.require("dojo.widget.Manager");
dojo.require("dojo.string");
dojo.require("dojo.dom");
dojo.widget.Parse=function(_6a8){
this.propertySetsList=[];
this.fragment=_6a8;
this.createComponents=function(_6a9,_6aa){
var _6ab=dojo.widget.tags;
var _6ac=[];
for(var item in _6a9){
var _6ae=false;
try{
if(_6a9[item]&&(_6a9[item]["tagName"])&&(_6a9[item]!=_6a9["nodeRef"])){
var tn=new String(_6a9[item]["tagName"]);
var tna=tn.split(";");
for(var x=0;x<tna.length;x++){
var ltn=dojo.string.trim(tna[x]).toLowerCase();
if(_6ab[ltn]){
_6ae=true;
_6a9[item].tagName=ltn;
var ret=_6ab[ltn](_6a9[item],this,_6aa,_6a9[item]["index"]);
_6ac.push(ret);
}else{
if((dojo.lang.isString(ltn))&&(ltn.substr(0,5)=="dojo:")){
dojo.debug("no tag handler registed for type: ",ltn);
}
}
}
}
}
catch(e){
dojo.debug("fragment creation error:",e);
}
if((!_6ae)&&(typeof _6a9[item]=="object")&&(_6a9[item]!=_6a9.nodeRef)&&(_6a9[item]!=_6a9["tagName"])){
_6ac.push(this.createComponents(_6a9[item],_6aa));
}
}
return _6ac;
};
this.parsePropertySets=function(_6b4){
return [];
var _6b5=[];
for(var item in _6b4){
if((_6b4[item]["tagName"]=="dojo:propertyset")){
_6b5.push(_6b4[item]);
}
}
this.propertySetsList.push(_6b5);
return _6b5;
};
this.parseProperties=function(_6b7){
var _6b8={};
for(var item in _6b7){
if((_6b7[item]==_6b7["tagName"])||(_6b7[item]==_6b7.nodeRef)){
}else{
if((_6b7[item]["tagName"])&&(dojo.widget.tags[_6b7[item].tagName.toLowerCase()])){
}else{
if((_6b7[item][0])&&(_6b7[item][0].value!="")){
try{
if(item.toLowerCase()=="dataprovider"){
var _6ba=this;
this.getDataProvider(_6ba,_6b7[item][0].value);
_6b8.dataProvider=this.dataProvider;
}
_6b8[item]=_6b7[item][0].value;
var _6bb=this.parseProperties(_6b7[item]);
for(var _6bc in _6bb){
_6b8[_6bc]=_6bb[_6bc];
}
}
catch(e){
dojo.debug(e);
}
}
}
}
}
return _6b8;
};
this.getDataProvider=function(_6bd,_6be){
dojo.io.bind({url:_6be,load:function(type,_6c0){
if(type=="load"){
_6bd.dataProvider=_6c0;
}
},mimetype:"text/javascript",sync:true});
};
this.getPropertySetById=function(_6c1){
for(var x=0;x<this.propertySetsList.length;x++){
if(_6c1==this.propertySetsList[x]["id"][0].value){
return this.propertySetsList[x];
}
}
return "";
};
this.getPropertySetsByType=function(_6c3){
var _6c4=[];
for(var x=0;x<this.propertySetsList.length;x++){
var cpl=this.propertySetsList[x];
var cpcc=cpl["componentClass"]||cpl["componentType"]||null;
if((cpcc)&&(propertySetId==cpcc[0].value)){
_6c4.push(cpl);
}
}
return _6c4;
};
this.getPropertySets=function(_6c8){
var ppl="dojo:propertyproviderlist";
var _6ca=[];
var _6cb=_6c8["tagName"];
if(_6c8[ppl]){
var _6cc=_6c8[ppl].value.split(" ");
for(propertySetId in _6cc){
if((propertySetId.indexOf("..")==-1)&&(propertySetId.indexOf("://")==-1)){
var _6cd=this.getPropertySetById(propertySetId);
if(_6cd!=""){
_6ca.push(_6cd);
}
}else{
}
}
}
return (this.getPropertySetsByType(_6cb)).concat(_6ca);
};
this.createComponentFromScript=function(_6ce,_6cf,_6d0){
var ltn="dojo:"+_6cf.toLowerCase();
if(dojo.widget.tags[ltn]){
_6d0.fastMixIn=true;
return [dojo.widget.tags[ltn](_6d0,this,null,null,_6d0)];
}else{
if(ltn.substr(0,5)=="dojo:"){
dojo.debug("no tag handler registed for type: ",ltn);
}
}
};
};
dojo.widget._parser_collection={"dojo":new dojo.widget.Parse()};
dojo.widget.getParser=function(name){
if(!name){
name="dojo";
}
if(!this._parser_collection[name]){
this._parser_collection[name]=new dojo.widget.Parse();
}
return this._parser_collection[name];
};
dojo.widget.createWidget=function(name,_6d4,_6d5,_6d6){
function fromScript(_6d7,name,_6d9){
var _6da=name.toLowerCase();
var _6db="dojo:"+_6da;
_6d9[_6db]={dojotype:[{value:_6da}],nodeRef:_6d7,fastMixIn:true};
return dojo.widget.getParser().createComponentFromScript(_6d7,name,_6d9,true);
}
if(typeof name!="string"&&typeof _6d4=="string"){
dojo.deprecated("dojo.widget.createWidget","argument order is now of the form "+"dojo.widget.createWidget(NAME, [PROPERTIES, [REFERENCENODE, [POSITION]]])");
return fromScript(name,_6d4,_6d5);
}
_6d4=_6d4||{};
var _6dc=false;
var tn=null;
var h=dojo.render.html.capable;
if(h){
tn=document.createElement("span");
}
if(!_6d5){
_6dc=true;
_6d5=tn;
if(h){
dojo.html.body().appendChild(_6d5);
}
}else{
if(_6d6){
dojo.dom.insertAtPosition(tn,_6d5,_6d6);
}else{
tn=_6d5;
}
}
var _6df=fromScript(tn,name,_6d4);
if(!_6df[0]||typeof _6df[0].widgetType=="undefined"){
throw new Error("createWidget: Creation of \""+name+"\" widget failed.");
}
if(_6dc){
if(_6df[0].domNode.parentNode){
_6df[0].domNode.parentNode.removeChild(_6df[0].domNode);
}
}
return _6df[0];
};
dojo.widget.fromScript=function(name,_6e1,_6e2,_6e3){
dojo.deprecated("dojo.widget.fromScript"," use "+"dojo.widget.createWidget instead");
return dojo.widget.createWidget(name,_6e1,_6e2,_6e3);
};
dojo.provide("dojo.widget.DomWidget");
dojo.require("dojo.event.*");
dojo.require("dojo.string");
dojo.require("dojo.widget.Widget");
dojo.require("dojo.dom");
dojo.require("dojo.xml.Parse");
dojo.require("dojo.uri.*");
dojo.widget._cssFiles={};
dojo.widget.defaultStrings={dojoRoot:dojo.hostenv.getBaseScriptUri(),baseScriptUri:dojo.hostenv.getBaseScriptUri()};
dojo.widget.buildFromTemplate=function(obj,_6e5,_6e6,_6e7){
var _6e8=_6e5||obj.templatePath;
var _6e9=_6e6||obj.templateCssPath;
if(!_6e9&&obj.templateCSSPath){
obj.templateCssPath=_6e9=obj.templateCSSPath;
obj.templateCSSPath=null;
dj_deprecated("templateCSSPath is deprecated, use templateCssPath");
}
if(_6e8&&!(_6e8 instanceof dojo.uri.Uri)){
_6e8=dojo.uri.dojoUri(_6e8);
dj_deprecated("templatePath should be of type dojo.uri.Uri");
}
if(_6e9&&!(_6e9 instanceof dojo.uri.Uri)){
_6e9=dojo.uri.dojoUri(_6e9);
dj_deprecated("templateCssPath should be of type dojo.uri.Uri");
}
var _6ea=dojo.widget.DomWidget.templates;
if(!obj["widgetType"]){
do{
var _6eb="__dummyTemplate__"+dojo.widget.buildFromTemplate.dummyCount++;
}while(_6ea[_6eb]);
obj.widgetType=_6eb;
}
if((_6e9)&&(!dojo.widget._cssFiles[_6e9])){
dojo.html.insertCssFile(_6e9);
obj.templateCssPath=null;
dojo.widget._cssFiles[_6e9]=true;
}
var ts=_6ea[obj.widgetType];
if(!ts){
_6ea[obj.widgetType]={};
ts=_6ea[obj.widgetType];
}
if(!obj.templateString){
obj.templateString=_6e7||ts["string"];
}
if(!obj.templateNode){
obj.templateNode=ts["node"];
}
if((!obj.templateNode)&&(!obj.templateString)&&(_6e8)){
var _6ed=dojo.hostenv.getText(_6e8);
if(_6ed){
var _6ee=_6ed.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_6ee){
_6ed=_6ee[1];
}
}else{
_6ed="";
}
obj.templateString=_6ed;
ts.string=_6ed;
}
if(!ts["string"]){
ts.string=obj.templateString;
}
};
dojo.widget.buildFromTemplate.dummyCount=0;
dojo.widget.attachProperties=["dojoAttachPoint","id"];
dojo.widget.eventAttachProperty="dojoAttachEvent";
dojo.widget.onBuildProperty="dojoOnBuild";
dojo.widget.attachTemplateNodes=function(_6ef,_6f0,_6f1){
var _6f2=dojo.dom.ELEMENT_NODE;
if(!_6ef){
_6ef=_6f0.domNode;
}
if(_6ef.nodeType!=_6f2){
return;
}
var _6f3=_6ef.getElementsByTagName("*");
var _6f4=_6f0;
for(var x=-1;x<_6f3.length;x++){
var _6f6=(x==-1)?_6ef:_6f3[x];
var _6f7=[];
for(var y=0;y<this.attachProperties.length;y++){
var _6f9=_6f6.getAttribute(this.attachProperties[y]);
if(_6f9){
_6f7=_6f9.split(";");
for(var z=0;z<this.attachProperties.length;z++){
if((_6f0[_6f7[z]])&&(dojo.lang.isArray(_6f0[_6f7[z]]))){
_6f0[_6f7[z]].push(_6f6);
}else{
_6f0[_6f7[z]]=_6f6;
}
}
break;
}
}
var _6fb=_6f6.getAttribute(this.templateProperty);
if(_6fb){
_6f0[_6fb]=_6f6;
}
var _6fc=_6f6.getAttribute(this.eventAttachProperty);
if(_6fc){
var evts=_6fc.split(";");
for(var y=0;y<evts.length;y++){
if((!evts[y])||(!evts[y].length)){
continue;
}
var _6fe=null;
var tevt=dojo.string.trim(evts[y]);
if(evts[y].indexOf(":")>=0){
var _700=tevt.split(":");
tevt=dojo.string.trim(_700[0]);
_6fe=dojo.string.trim(_700[1]);
}
if(!_6fe){
_6fe=tevt;
}
var tf=function(){
var ntf=new String(_6fe);
return function(evt){
if(_6f4[ntf]){
_6f4[ntf](dojo.event.browser.fixEvent(evt));
}
};
}();
dojo.event.browser.addListener(_6f6,tevt,tf,false,true);
}
}
for(var y=0;y<_6f1.length;y++){
var _704=_6f6.getAttribute(_6f1[y]);
if((_704)&&(_704.length)){
var _6fe=null;
var _705=_6f1[y].substr(4);
_6fe=dojo.string.trim(_704);
var tf=function(){
var ntf=new String(_6fe);
return function(evt){
if(_6f4[ntf]){
_6f4[ntf](dojo.event.browser.fixEvent(evt));
}
};
}();
dojo.event.browser.addListener(_6f6,_705,tf,false,true);
}
}
var _708=_6f6.getAttribute(this.onBuildProperty);
if(_708){
eval("var node = baseNode; var widget = targetObj; "+_708);
}
_6f6.id="";
}
};
dojo.widget.getDojoEventsFromStr=function(str){
var re=/(dojoOn([a-z]+)(\s?))=/gi;
var evts=str?str.match(re)||[]:[];
var ret=[];
var lem={};
for(var x=0;x<evts.length;x++){
if(evts[x].legth<1){
continue;
}
var cm=evts[x].replace(/\s/,"");
cm=(cm.slice(0,cm.length-1));
if(!lem[cm]){
lem[cm]=true;
ret.push(cm);
}
}
return ret;
};
dojo.widget.buildAndAttachTemplate=function(obj,_711,_712,_713,_714){
this.buildFromTemplate(obj,_711,_712,_713);
var node=dojo.dom.createNodesFromText(obj.templateString,true)[0];
this.attachTemplateNodes(node,_714||obj,dojo.widget.getDojoEventsFromStr(_713));
return node;
};
dojo.widget.DomWidget=function(){
dojo.widget.Widget.call(this);
if((arguments.length>0)&&(typeof arguments[0]=="object")){
this.create(arguments[0]);
}
};
dojo.inherits(dojo.widget.DomWidget,dojo.widget.Widget);
dojo.lang.extend(dojo.widget.DomWidget,{templateNode:null,templateString:null,preventClobber:false,domNode:null,containerNode:null,addChild:function(_716,_717,pos,ref,_71a){
if(!this.isContainer){
dojo.debug("dojo.widget.DomWidget.addChild() attempted on non-container widget");
return null;
}else{
this.addWidgetAsDirectChild(_716,_717,pos,ref,_71a);
this.registerChild(_716,_71a);
}
return _716;
},addWidgetAsDirectChild:function(_71b,_71c,pos,ref,_71f){
if((!this.containerNode)&&(!_71c)){
this.containerNode=this.domNode;
}
var cn=(_71c)?_71c:this.containerNode;
if(!pos){
pos="after";
}
if(!ref){
ref=cn.lastChild;
}
if(!_71f){
_71f=0;
}
_71b.domNode.setAttribute("dojoinsertionindex",_71f);
if(!ref){
cn.appendChild(_71b.domNode);
}else{
if(pos=="insertAtIndex"){
dojo.dom.insertAtIndex(_71b.domNode,ref.parentNode,_71f);
}else{
if((pos=="after")&&(ref===cn.lastChild)){
cn.appendChild(_71b.domNode);
}else{
dojo.dom.insertAtPosition(_71b.domNode,cn,pos);
}
}
}
},registerChild:function(_721,_722){
_721.dojoInsertionIndex=_722;
var idx=-1;
for(var i=0;i<this.children.length;i++){
if(this.children[i].dojoInsertionIndex<_722){
idx=i;
}
}
this.children.splice(idx+1,0,_721);
_721.parent=this;
_721.addedTo(this);
delete dojo.widget.manager.topWidgets[_721.widgetId];
},removeChild:function(_725){
for(var x=0;x<this.children.length;x++){
if(this.children[x]===_725){
this.children.splice(x,1);
break;
}
}
return _725;
},getFragNodeRef:function(frag){
if(!frag["dojo:"+this.widgetType.toLowerCase()]){
dojo.raise("Error: no frag for widget type "+this.widgetType+", id "+this.widgetId+" (maybe a widget has set it's type incorrectly)");
}
return (frag?frag["dojo:"+this.widgetType.toLowerCase()]["nodeRef"]:null);
},postInitialize:function(args,frag,_72a){
var _72b=this.getFragNodeRef(frag);
if(_72a&&(_72a.snarfChildDomOutput||!_72b)){
_72a.addWidgetAsDirectChild(this,"","insertAtIndex","",args["dojoinsertionindex"],_72b);
}else{
if(_72b){
if(this.domNode&&(this.domNode!==_72b)){
var _72c=_72b.parentNode.replaceChild(this.domNode,_72b);
}
}
}
if(_72a){
_72a.registerChild(this,args.dojoinsertionindex);
}else{
dojo.widget.manager.topWidgets[this.widgetId]=this;
}
if(this.isContainer){
var _72d=dojo.widget.getParser();
_72d.createComponents(frag,this);
}
},startResize:function(_72e){
dj_unimplemented("dojo.widget.DomWidget.startResize");
},updateResize:function(_72f){
dj_unimplemented("dojo.widget.DomWidget.updateResize");
},endResize:function(_730){
dj_unimplemented("dojo.widget.DomWidget.endResize");
},buildRendering:function(args,frag){
var ts=dojo.widget.DomWidget.templates[this.widgetType];
if((!this.preventClobber)&&((this.templatePath)||(this.templateNode)||((this["templateString"])&&(this.templateString.length))||((typeof ts!="undefined")&&((ts["string"])||(ts["node"]))))){
this.buildFromTemplate(args,frag);
}else{
this.domNode=this.getFragNodeRef(frag);
}
this.fillInTemplate(args,frag);
},buildFromTemplate:function(args,frag){
var ts=dojo.widget.DomWidget.templates[this.widgetType];
if(ts){
if(!this.templateString.length){
this.templateString=ts["string"];
}
if(!this.templateNode){
this.templateNode=ts["node"];
}
}
var _737=false;
var node=null;
var tstr=new String(this.templateString);
if((!this.templateNode)&&(this.templateString)){
_737=this.templateString.match(/\$\{([^\}]+)\}/g);
if(_737){
var hash=this.strings||{};
for(var key in dojo.widget.defaultStrings){
if(dojo.lang.isUndefined(hash[key])){
hash[key]=dojo.widget.defaultStrings[key];
}
}
for(var i=0;i<_737.length;i++){
var key=_737[i];
key=key.substring(2,key.length-1);
var kval=(key.substring(0,5)=="this.")?this[key.substring(5)]:hash[key];
var _73e;
if((kval)||(dojo.lang.isString(kval))){
_73e=(dojo.lang.isFunction(kval))?kval.call(this,key,this.templateString):kval;
tstr=tstr.replace(_737[i],_73e);
}
}
}else{
this.templateNode=this.createNodesFromText(this.templateString,true)[0];
ts.node=this.templateNode;
}
}
if((!this.templateNode)&&(!_737)){
dojo.debug("weren't able to create template!");
return false;
}else{
if(!_737){
node=this.templateNode.cloneNode(true);
if(!node){
return false;
}
}else{
node=this.createNodesFromText(tstr,true)[0];
}
}
this.domNode=node;
this.attachTemplateNodes(this.domNode,this);
if(this.isContainer&&this.containerNode){
var src=this.getFragNodeRef(frag);
if(src){
dojo.dom.moveChildren(src,this.containerNode);
}
}
},attachTemplateNodes:function(_740,_741){
if(!_741){
_741=this;
}
return dojo.widget.attachTemplateNodes(_740,_741,dojo.widget.getDojoEventsFromStr(this.templateString));
},fillInTemplate:function(){
},destroyRendering:function(){
try{
var _742=this.domNode.parentNode.removeChild(this.domNode);
delete _742;
}
catch(e){
}
},cleanUp:function(){
},getContainerHeight:function(){
return dojo.html.getInnerHeight(this.domNode.parentNode);
},getContainerWidth:function(){
return dojo.html.getInnerWidth(this.domNode.parentNode);
},createNodesFromText:function(){
dj_unimplemented("dojo.widget.DomWidget.createNodesFromText");
}});
dojo.widget.DomWidget.templates={};
dojo.provide("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.html");
dojo.require("dojo.string");
dojo.widget.HtmlWidget=function(args){
dojo.widget.DomWidget.call(this);
};
dojo.inherits(dojo.widget.HtmlWidget,dojo.widget.DomWidget);
dojo.lang.extend(dojo.widget.HtmlWidget,{widgetType:"HtmlWidget",templateCssPath:null,templatePath:null,allowResizeX:true,allowResizeY:true,resizeGhost:null,initialResizeCoords:null,toggle:"plain",toggleDuration:150,animationInProgress:false,initialize:function(args,frag){
},postMixInProperties:function(args,frag){
dojo.lang.mixin(this,dojo.widget.HtmlWidget.Toggle[dojo.string.capitalize(this.toggle)]||dojo.widget.HtmlWidget.Toggle.Plain);
},getContainerHeight:function(){
dj_unimplemented("dojo.widget.HtmlWidget.getContainerHeight");
},getContainerWidth:function(){
return this.parent.domNode.offsetWidth;
},setNativeHeight:function(_748){
var ch=this.getContainerHeight();
},startResize:function(_74a){
_74a.offsetLeft=dojo.html.totalOffsetLeft(this.domNode);
_74a.offsetTop=dojo.html.totalOffsetTop(this.domNode);
_74a.innerWidth=dojo.html.getInnerWidth(this.domNode);
_74a.innerHeight=dojo.html.getInnerHeight(this.domNode);
if(!this.resizeGhost){
this.resizeGhost=document.createElement("div");
var rg=this.resizeGhost;
rg.style.position="absolute";
rg.style.backgroundColor="white";
rg.style.border="1px solid black";
dojo.html.setOpacity(rg,0.3);
dojo.html.body().appendChild(rg);
}
with(this.resizeGhost.style){
left=_74a.offsetLeft+"px";
top=_74a.offsetTop+"px";
}
this.initialResizeCoords=_74a;
this.resizeGhost.style.display="";
this.updateResize(_74a,true);
},updateResize:function(_74c,_74d){
var dx=_74c.x-this.initialResizeCoords.x;
var dy=_74c.y-this.initialResizeCoords.y;
with(this.resizeGhost.style){
if((this.allowResizeX)||(_74d)){
width=this.initialResizeCoords.innerWidth+dx+"px";
}
if((this.allowResizeY)||(_74d)){
height=this.initialResizeCoords.innerHeight+dy+"px";
}
}
},endResize:function(_750){
var dx=_750.x-this.initialResizeCoords.x;
var dy=_750.y-this.initialResizeCoords.y;
with(this.domNode.style){
if(this.allowResizeX){
width=this.initialResizeCoords.innerWidth+dx+"px";
}
if(this.allowResizeY){
height=this.initialResizeCoords.innerHeight+dy+"px";
}
}
this.resizeGhost.style.display="none";
},resizeSoon:function(){
if(this.isVisible()){
dojo.lang.setTimeout(this,this.onResized,0);
}
},createNodesFromText:function(txt,wrap){
return dojo.html.createNodesFromText(txt,wrap);
},_old_buildFromTemplate:dojo.widget.DomWidget.prototype.buildFromTemplate,buildFromTemplate:function(args,frag){
if(dojo.widget.DomWidget.templates[this.widgetType]){
var ot=dojo.widget.DomWidget.templates[this.widgetType];
dojo.widget.DomWidget.templates[this.widgetType]={};
}
if(args["templatecsspath"]){
args["templateCssPath"]=args["templatecsspath"];
}
if(args["templatepath"]){
args["templatePath"]=args["templatepath"];
}
dojo.widget.buildFromTemplate(this,args["templatePath"],args["templateCssPath"]);
this._old_buildFromTemplate(args,frag);
dojo.widget.DomWidget.templates[this.widgetType]=ot;
},destroyRendering:function(_758){
try{
var _759=this.domNode.parentNode.removeChild(this.domNode);
if(!_758){
dojo.event.browser.clean(_759);
}
delete _759;
}
catch(e){
}
},isVisible:function(){
return dojo.html.isVisible(this.domNode);
},doToggle:function(){
this.isVisible()?this.hide():this.show();
},show:function(){
this.animationInProgress=true;
this.showMe();
},onShow:function(){
this.animationInProgress=false;
},hide:function(){
this.animationInProgress=true;
this.hideMe();
},onHide:function(){
this.animationInProgress=false;
}});
dojo.widget.HtmlWidget.Toggle={};
dojo.widget.HtmlWidget.Toggle.Plain={showMe:function(){
dojo.html.show(this.domNode);
if(dojo.lang.isFunction(this.onShow)){
this.onShow();
}
},hideMe:function(){
dojo.html.hide(this.domNode);
if(dojo.lang.isFunction(this.onHide)){
this.onHide();
}
}};
dojo.widget.HtmlWidget.Toggle.Fade={showMe:function(){
dojo.fx.html.fadeShow(this.domNode,this.toggleDuration,dojo.lang.hitch(this,this.onShow));
},hideMe:function(){
dojo.fx.html.fadeHide(this.domNode,this.toggleDuration,dojo.lang.hitch(this,this.onHide));
}};
dojo.widget.HtmlWidget.Toggle.Wipe={showMe:function(){
dojo.fx.html.wipeIn(this.domNode,this.toggleDuration,dojo.lang.hitch(this,this.onShow));
},hideMe:function(){
dojo.fx.html.wipeOut(this.domNode,this.toggleDuration,dojo.lang.hitch(this,this.onHide));
}};
dojo.widget.HtmlWidget.Toggle.Explode={showMe:function(){
dojo.fx.html.explode(this.explodeSrc,this.domNode,this.toggleDuration,dojo.lang.hitch(this,this.onShow));
},hideMe:function(){
dojo.fx.html.implode(this.domNode,this.explodeSrc,this.toggleDuration,dojo.lang.hitch(this,this.onHide));
}};
dojo.hostenv.conditionalLoadModule({common:["dojo.xml.Parse","dojo.widget.Widget","dojo.widget.Parse","dojo.widget.Manager"],browser:["dojo.widget.DomWidget","dojo.widget.HtmlWidget"],svg:["dojo.widget.SvgWidget"]});
dojo.hostenv.moduleLoaded("dojo.widget.*");
dojo.provide("dojo.math.points");
dojo.require("dojo.math");
dojo.math.points={translate:function(a,b){
if(a.length!=b.length){
dojo.raise("dojo.math.translate: points not same size (a:["+a+"], b:["+b+"])");
}
var c=new Array(a.length);
for(var i=0;i<a.length;i++){
c[i]=a[i]+b[i];
}
return c;
},midpoint:function(a,b){
if(a.length!=b.length){
dojo.raise("dojo.math.midpoint: points not same size (a:["+a+"], b:["+b+"])");
}
var c=new Array(a.length);
for(var i=0;i<a.length;i++){
c[i]=(a[i]+b[i])/2;
}
return c;
},invert:function(a){
var b=new Array(a.length);
for(var i=0;i<a.length;i++){
b[i]=-a[i];
}
return b;
},distance:function(a,b){
return Math.sqrt(Math.pow(b[0]-a[0],2)+Math.pow(b[1]-a[1],2));
}};
dojo.hostenv.conditionalLoadModule({common:[["dojo.math",false,false],["dojo.math.curves",false,false],["dojo.math.points",false,false]]});
dojo.hostenv.moduleLoaded("dojo.math.*");
dojo.provide("dojo.regexp");
dojo.provide("dojo.regexp.us");
dojo.regexp.tld=function(_767){
_767=(typeof _767=="object")?_767:{};
if(typeof _767.allowCC!="boolean"){
_767.allowCC=true;
}
if(typeof _767.allowInfra!="boolean"){
_767.allowInfra=true;
}
if(typeof _767.allowGeneric!="boolean"){
_767.allowGeneric=true;
}
var _768="arpa";
var _769="aero|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|xxx|jobs|mobi|post";
var ccRE="ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|"+"bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|"+"ec|ee|eg|er|es|et|fi|fj|fk|fm|fo|fr|ga|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|"+"hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|"+"lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|"+"mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|"+"ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sk|sl|sm|sn|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|"+"to|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw";
var a=[];
if(_767.allowInfra){
a.push(_768);
}
if(_767.allowGeneric){
a.push(_769);
}
if(_767.allowCC){
a.push(ccRE);
}
var _76c="";
if(a.length>0){
_76c="("+a.join("|")+")";
}
return _76c;
};
dojo.regexp.ipAddress=function(_76d){
_76d=(typeof _76d=="object")?_76d:{};
if(typeof _76d.allowDottedDecimal!="boolean"){
_76d.allowDottedDecimal=true;
}
if(typeof _76d.allowDottedHex!="boolean"){
_76d.allowDottedHex=true;
}
if(typeof _76d.allowDottedOctal!="boolean"){
_76d.allowDottedOctal=true;
}
if(typeof _76d.allowDecimal!="boolean"){
_76d.allowDecimal=true;
}
if(typeof _76d.allowHex!="boolean"){
_76d.allowHex=true;
}
if(typeof _76d.allowIPv6!="boolean"){
_76d.allowIPv6=true;
}
if(typeof _76d.allowHybrid!="boolean"){
_76d.allowHybrid=true;
}
var _76e="((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])";
var _76f="(0[xX]0*[\\da-fA-F]?[\\da-fA-F]\\.){3}0[xX]0*[\\da-fA-F]?[\\da-fA-F]";
var _770="(0+[0-3][0-7][0-7]\\.){3}0+[0-3][0-7][0-7]";
var _771="(0|[1-9]\\d{0,8}|[1-3]\\d{9}|4[01]\\d{8}|42[0-8]\\d{7}|429[0-3]\\d{6}|"+"4294[0-8]\\d{5}|42949[0-5]\\d{4}|429496[0-6]\\d{3}|4294967[01]\\d{2}|42949672[0-8]\\d|429496729[0-5])";
var _772="0[xX]0*[\\da-fA-F]{1,8}";
var _773="([\\da-fA-F]{1,4}\\:){7}[\\da-fA-F]{1,4}";
var _774="([\\da-fA-F]{1,4}\\:){6}"+"((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])";
var a=[];
if(_76d.allowDottedDecimal){
a.push(_76e);
}
if(_76d.allowDottedHex){
a.push(_76f);
}
if(_76d.allowDottedOctal){
a.push(_770);
}
if(_76d.allowDecimal){
a.push(_771);
}
if(_76d.allowHex){
a.push(_772);
}
if(_76d.allowIPv6){
a.push(_773);
}
if(_76d.allowHybrid){
a.push(_774);
}
var _776="";
if(a.length>0){
_776="("+a.join("|")+")";
}
return _776;
};
dojo.regexp.host=function(_777){
_777=(typeof _777=="object")?_777:{};
if(typeof _777.allowIP!="boolean"){
_777.allowIP=true;
}
if(typeof _777.allowLocal!="boolean"){
_777.allowLocal=false;
}
if(typeof _777.allowPort!="boolean"){
_777.allowPort=true;
}
var _778="([0-9a-zA-Z]([-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?\\.)+"+dojo.regexp.tld(_777);
portRE=(_777.allowPort)?"(\\:"+dojo.regexp.integer({signed:false})+")?":"";
var _779=_778;
if(_777.allowIP){
_779+="|"+dojo.regexp.ipAddress(_777);
}
if(_777.allowLocal){
_779+="|localhost";
}
return "("+_779+")"+portRE;
};
dojo.regexp.url=function(_77a){
_77a=(typeof _77a=="object")?_77a:{};
if(typeof _77a.scheme=="undefined"){
_77a.scheme=[true,false];
}
var _77b=dojo.regexp.buildGroupRE(_77a.scheme,function(q){
if(q){
return "(https?|ftps?)\\://";
}
return "";
});
var _77d="(/([^?#\\s/]+/)*)?([^?#\\s/]+(\\?[^?#\\s/]*)?(#[A-Za-z][\\w.:-]*)?)?";
return (_77b+dojo.regexp.host(_77a)+_77d);
};
dojo.regexp.emailAddress=function(_77e){
_77e=(typeof _77e=="object")?_77e:{};
if(typeof _77e.allowCruft!="boolean"){
_77e.allowCruft=false;
}
_77e.allowPort=false;
var _77f="([\\da-z]+[-._+&'])*[\\da-z]+";
var _780=_77f+"@"+dojo.regexp.host(_77e);
if(_77e.allowCruft){
_780="<?(mailto\\:)?"+_780+">?";
}
return _780;
};
dojo.regexp.emailAddressList=function(_781){
_781=(typeof _781=="object")?_781:{};
if(typeof _781.listSeparator!="string"){
_781.listSeparator="\\s;,";
}
var _782=dojo.regexp.emailAddress(_781);
var _783="("+_782+"\\s*["+_781.listSeparator+"]\\s*)*"+_782+"\\s*["+_781.listSeparator+"]?\\s*";
return _783;
};
dojo.regexp.integer=function(_784){
_784=(typeof _784=="object")?_784:{};
if(typeof _784.signed=="undefined"){
_784.signed=[true,false];
}
if(typeof _784.separator=="undefined"){
_784.separator="";
}
var _785=dojo.regexp.buildGroupRE(_784.signed,function(q){
if(q){
return "[-+]";
}
return "";
});
var _787=dojo.regexp.buildGroupRE(_784.separator,function(sep){
if(sep==""){
return "(0|[1-9]\\d*)";
}
return "(0|[1-9]\\d{0,2}(["+sep+"]\\d{3})*)";
});
var _787;
return (_785+_787);
};
dojo.regexp.realNumber=function(_789){
_789=(typeof _789=="object")?_789:{};
if(typeof _789.places!="number"){
_789.places=Infinity;
}
if(typeof _789.decimal!="string"){
_789.decimal=".";
}
if(typeof _789.exponent=="undefined"){
_789.exponent=[true,false];
}
if(typeof _789.eSigned=="undefined"){
_789.eSigned=[true,false];
}
var _78a=dojo.regexp.integer(_789);
var _78b="";
if(_789.places==Infinity){
_78b="(\\"+_789.decimal+"\\d+)?";
}else{
if(_789.places>0){
_78b="\\"+_789.decimal+"\\d{"+_789.places+"}";
}
}
var _78c=dojo.regexp.buildGroupRE(_789.exponent,function(q){
if(q){
return "([eE]"+dojo.regexp.integer({signed:_789.eSigned})+")";
}
return "";
});
return (_78a+_78b+_78c);
};
dojo.regexp.currency=function(_78e){
_78e=(typeof _78e=="object")?_78e:{};
if(typeof _78e.signed=="undefined"){
_78e.signed=[true,false];
}
if(typeof _78e.symbol=="undefined"){
_78e.symbol="$";
}
if(typeof _78e.placement!="string"){
_78e.placement="before";
}
if(typeof _78e.separator!="string"){
_78e.separator=",";
}
if(typeof _78e.cents=="undefined"){
_78e.cents=[true,false];
}
if(typeof _78e.decimal!="string"){
_78e.decimal=".";
}
var _78f=dojo.regexp.buildGroupRE(_78e.signed,function(q){
if(q){
return "[-+]";
}
return "";
});
var _791=dojo.regexp.buildGroupRE(_78e.symbol,function(_792){
return "\\s?"+_792.replace(/([.$?*!=:|\\\/^])/g,"\\$1")+"\\s?";
});
var _793=dojo.regexp.integer({signed:false,separator:_78e.separator});
var _794=dojo.regexp.buildGroupRE(_78e.cents,function(q){
if(q){
return "(\\"+_78e.decimal+"\\d\\d)";
}
return "";
});
var _796;
if(_78e.placement=="before"){
_796=_78f+_791+_793+_794;
}else{
_796=_78f+_793+_794+_791;
}
return _796;
};
dojo.regexp.us.state=function(_797){
_797=(typeof _797=="object")?_797:{};
if(typeof _797.allowTerritories!="boolean"){
_797.allowTerritories=true;
}
if(typeof _797.allowMilitary!="boolean"){
_797.allowMilitary=true;
}
var _798="AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|"+"NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY";
var _799="AS|FM|GU|MH|MP|PW|PR|VI";
var _79a="AA|AE|AP";
if(_797.allowTerritories){
_798+="|"+_799;
}
if(_797.allowMilitary){
_798+="|"+_79a;
}
return "("+_798+")";
};
dojo.regexp.time=function(_79b){
_79b=(typeof _79b=="object")?_79b:{};
if(typeof _79b.format=="undefined"){
_79b.format="h:mm:ss t";
}
if(typeof _79b.amSymbol!="string"){
_79b.amSymbol="AM";
}
if(typeof _79b.pmSymbol!="string"){
_79b.pmSymbol="PM";
}
var _79c=function(_79d){
_79d=_79d.replace(/([.$?*!=:|{}\(\)\[\]\\\/^])/g,"\\$1");
var amRE=_79b.amSymbol.replace(/([.$?*!=:|{}\(\)\[\]\\\/^])/g,"\\$1");
var pmRE=_79b.pmSymbol.replace(/([.$?*!=:|{}\(\)\[\]\\\/^])/g,"\\$1");
_79d=_79d.replace("hh","(0[1-9]|1[0-2])");
_79d=_79d.replace("h","([1-9]|1[0-2])");
_79d=_79d.replace("HH","([01][0-9]|2[0-3])");
_79d=_79d.replace("H","([0-9]|1[0-9]|2[0-3])");
_79d=_79d.replace("mm","([0-5][0-9])");
_79d=_79d.replace("m","([1-5][0-9]|[0-9])");
_79d=_79d.replace("ss","([0-5][0-9])");
_79d=_79d.replace("s","([1-5][0-9]|[0-9])");
_79d=_79d.replace("t","\\s?("+amRE+"|"+pmRE+")\\s?");
return _79d;
};
return dojo.regexp.buildGroupRE(_79b.format,_79c);
};
dojo.regexp.numberFormat=function(_7a0){
_7a0=(typeof _7a0=="object")?_7a0:{};
if(typeof _7a0.format=="undefined"){
_7a0.format="###-###-####";
}
var _7a1=function(_7a2){
_7a2=_7a2.replace(/([.$*!=:|{}\(\)\[\]\\\/^])/g,"\\$1");
_7a2=_7a2.replace(/\?/g,"\\d?");
_7a2=_7a2.replace(/#/g,"\\d");
return _7a2;
};
return dojo.regexp.buildGroupRE(_7a0.format,_7a1);
};
dojo.regexp.buildGroupRE=function(a,re){
if(!(a instanceof Array)){
return re(a);
}
var b=[];
for(var i=0;i<a.length;i++){
b.push(re(a[i]));
}
return "("+b.join("|")+")";
};
dojo.provide("dojo.validate");
dojo.provide("dojo.validate.us");
dojo.require("dojo.regexp");
dojo.validate.isText=function(_7a7,_7a8){
_7a8=(typeof _7a8=="object")?_7a8:{};
if(/^\s*$/.test(_7a7)){
return false;
}
if(typeof _7a8.length=="number"&&_7a8.length!=_7a7.length){
return false;
}
if(typeof _7a8.minlength=="number"&&_7a8.minlength>_7a7.length){
return false;
}
if(typeof _7a8.maxlength=="number"&&_7a8.maxlength<_7a7.length){
return false;
}
return true;
};
dojo.validate.isIpAddress=function(_7a9,_7aa){
var re=new RegExp("^"+dojo.regexp.ipAddress(_7aa)+"$","i");
return re.test(_7a9);
};
dojo.validate.isUrl=function(_7ac,_7ad){
var re=new RegExp("^"+dojo.regexp.url(_7ad)+"$","i");
return re.test(_7ac);
};
dojo.validate.isEmailAddress=function(_7af,_7b0){
var re=new RegExp("^"+dojo.regexp.emailAddress(_7b0)+"$","i");
return re.test(_7af);
};
dojo.validate.isEmailAddressList=function(_7b2,_7b3){
var re=new RegExp("^"+dojo.regexp.emailAddressList(_7b3)+"$","i");
return re.test(_7b2);
};
dojo.validate.getEmailAddressList=function(_7b5,_7b6){
if(!_7b6){
_7b6={};
}
if(!_7b6.listSeparator){
_7b6.listSeparator="\\s;,";
}
if(dojo.validate.isEmailAddressList(_7b5,_7b6)){
return _7b5.split(new RegExp("\\s*["+_7b6.listSeparator+"]\\s*"));
}
return [];
};
dojo.validate.isInteger=function(_7b7,_7b8){
var re=new RegExp("^"+dojo.regexp.integer(_7b8)+"$");
return re.test(_7b7);
};
dojo.validate.isRealNumber=function(_7ba,_7bb){
var re=new RegExp("^"+dojo.regexp.realNumber(_7bb)+"$");
return re.test(_7ba);
};
dojo.validate.isCurrency=function(_7bd,_7be){
var re=new RegExp("^"+dojo.regexp.currency(_7be)+"$");
return re.test(_7bd);
};
dojo.validate.us.isCurrency=function(_7c0,_7c1){
return dojo.validate.isCurrency(_7c0,_7c1);
};
dojo.validate.isGermanCurrency=function(_7c2){
flags={symbol:"\u20ac",placement:"after",decimal:",",separator:"."};
return dojo.validate.isCurrency(_7c2,flags);
};
dojo.validate.isJapaneseCurrency=function(_7c3){
flags={symbol:"\xa5",cents:false};
return dojo.validate.isCurrency(_7c3,flags);
};
dojo.validate.isInRange=function(_7c4,_7c5){
_7c5=(typeof _7c5=="object")?_7c5:{};
var max=(typeof _7c5.max=="number")?_7c5.max:Infinity;
var min=(typeof _7c5.min=="number")?_7c5.min:-Infinity;
var dec=(typeof _7c5.decimal=="string")?_7c5.decimal:".";
var _7c9="[^"+dec+"\\deE+-]";
_7c4=_7c4.replace(RegExp(_7c9,"g"),"");
_7c4=_7c4.replace(/^([+-]?)(\D*)/,"$1");
_7c4=_7c4.replace(/(\D*)$/,"");
_7c9="(\\d)["+dec+"](\\d)";
_7c4=_7c4.replace(RegExp(_7c9,"g"),"$1.$2");
_7c4=Number(_7c4);
if(_7c4<min||_7c4>max){
return false;
}
return true;
};
dojo.validate.isValidTime=function(_7ca,_7cb){
var re=new RegExp("^"+dojo.regexp.time(_7cb)+"$","i");
return re.test(_7ca);
};
dojo.validate.is12HourTime=function(_7cd){
return dojo.validate.isValidTime(_7cd,{format:["h:mm:ss t","h:mm t"]});
};
dojo.validate.is24HourTime=function(_7ce){
return dojo.validate.isValidTime(_7ce,{format:["HH:mm:ss","HH:mm"]});
};
dojo.validate.isValidDate=function(_7cf,_7d0){
if(typeof _7d0!="string"){
_7d0="MM/DD/YYYY";
}
var _7d1=_7d0.replace(/([$^.*+?=!:|\/\\\(\)\[\]\{\}])/g,"\\$1");
_7d1=_7d1.replace("YYYY","([0-9]{4})");
_7d1=_7d1.replace("MM","(0[1-9]|10|11|12)");
_7d1=_7d1.replace("M","([1-9]|10|11|12)");
_7d1=_7d1.replace("DDD","(00[1-9]|0[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-6])");
_7d1=_7d1.replace("DD","(0[1-9]|[12][0-9]|30|31)");
_7d1=_7d1.replace("D","([1-9]|[12][0-9]|30|31)");
_7d1=_7d1.replace("ww","(0[1-9]|[1-4][0-9]|5[0-3])");
_7d1=_7d1.replace("d","([1-7])");
_7d1="^"+_7d1+"$";
var re=new RegExp(_7d1);
if(!re.test(_7cf)){
return false;
}
var year=0,month=1,date=1,dayofyear=1,week=1,day=1;
var _7d4=_7d0.match(/(YYYY|MM|M|DDD|DD|D|ww|d)/g);
var _7d5=re.exec(_7cf);
for(var i=0;i<_7d4.length;i++){
switch(_7d4[i]){
case "YYYY":
year=Number(_7d5[i+1]);
break;
case "M":
case "MM":
month=Number(_7d5[i+1]);
break;
case "D":
case "DD":
date=Number(_7d5[i+1]);
break;
case "DDD":
dayofyear=Number(_7d5[i+1]);
break;
case "ww":
week=Number(_7d5[i+1]);
break;
case "d":
day=Number(_7d5[i+1]);
break;
}
}
var _7d7=(year%4==0&&(year%100!=0||year%400==0));
if(date==31&&(month==4||month==6||month==9||month==11)){
return false;
}
if(date>=30&&month==2){
return false;
}
if(date==29&&month==2&&!_7d7){
return false;
}
if(dayofyear==366&&!_7d7){
return false;
}
return true;
};
dojo.validate.us.isState=function(_7d8,_7d9){
var re=new RegExp("^"+dojo.regexp.us.state(_7d9)+"$","i");
return re.test(_7d8);
};
dojo.validate.isNumberFormat=function(_7db,_7dc){
var re=new RegExp("^"+dojo.regexp.numberFormat(_7dc)+"$","i");
return re.test(_7db);
};
dojo.validate.us.isPhoneNumber=function(_7de){
flags={format:["###-###-####","(###) ###-####","(###) ### ####","###.###.####","###/###-####","### ### ####","###-###-#### x#???","(###) ###-#### x#???","(###) ### #### x#???","###.###.#### x#???","###/###-#### x#???","### ### #### x#???"]};
return dojo.validate.isNumberFormat(_7de,flags);
};
dojo.validate.us.isSocialSecurityNumber=function(_7df){
flags={format:["###-##-####","### ## ####","#########"]};
return dojo.validate.isNumberFormat(_7df,flags);
};
dojo.validate.us.isZipCode=function(_7e0){
flags={format:["#####-####","##### ####","#########","#####"]};
return dojo.validate.isNumberFormat(_7e0,flags);
};
dojo.validate.check=function(form,_7e2){
var _7e3=[];
var _7e4=[];
var _7e5={isSuccessful:function(){
return (!this.hasInvalid()&&!this.hasMissing());
},hasMissing:function(){
return (_7e3.length>0);
},getMissing:function(){
return _7e3;
},isMissing:function(_7e6){
for(var i=0;i<_7e3.length;i++){
if(_7e6==_7e3[i]){
return true;
}
}
return false;
},hasInvalid:function(){
return (_7e4.length>0);
},getInvalid:function(){
return _7e4;
},isInvalid:function(_7e8){
for(var i=0;i<_7e4.length;i++){
if(_7e8==_7e4[i]){
return true;
}
}
return false;
}};
if(_7e2.trim instanceof Array){
for(var i=0;i<_7e2.trim.length;i++){
var elem=form[_7e2.trim[i]];
if(elem.type!="text"&&elem.type!="textarea"&&elem.type!="password"){
continue;
}
elem.value=elem.value.replace(/(^\s*|\s*$)/g,"");
}
}
if(_7e2.uppercase instanceof Array){
for(var i=0;i<_7e2.uppercase.length;i++){
var elem=form[_7e2.uppercase[i]];
if(elem.type!="text"&&elem.type!="textarea"&&elem.type!="password"){
continue;
}
elem.value=elem.value.toUpperCase();
}
}
if(_7e2.lowercase instanceof Array){
for(var i=0;i<_7e2.lowercase.length;i++){
var elem=form[_7e2.lowercase[i]];
if(elem.type!="text"&&elem.type!="textarea"&&elem.type!="password"){
continue;
}
elem.value=elem.value.toLowerCase();
}
}
if(_7e2.ucfirst instanceof Array){
for(var i=0;i<_7e2.ucfirst.length;i++){
var elem=form[_7e2.ucfirst[i]];
if(elem.type!="text"&&elem.type!="textarea"&&elem.type!="password"){
continue;
}
elem.value=elem.value.replace(/\b\w+\b/g,function(word){
return word.substring(0,1).toUpperCase()+word.substring(1).toLowerCase();
});
}
}
if(_7e2.digit instanceof Array){
for(var i=0;i<_7e2.digit.length;i++){
var elem=form[_7e2.digit[i]];
if(elem.type!="text"&&elem.type!="textarea"&&elem.type!="password"){
continue;
}
elem.value=elem.value.replace(/\D/g,"");
}
}
if(_7e2.required instanceof Array){
for(var i=0;i<_7e2.required.length;i++){
if(typeof _7e2.required[i]!="string"){
continue;
}
var elem=form[_7e2.required[i]];
if((elem.type=="text"||elem.type=="textarea"||elem.type=="password")&&/^\s*$/.test(elem.value)){
_7e3[_7e3.length]=elem.name;
}else{
if((elem.type=="select-one"||elem.type=="select-multiple")&&elem.selectedIndex==-1){
_7e3[_7e3.length]=elem.name;
}else{
if(elem instanceof Array){
var _7ed=false;
for(var j=0;j<elem.length;j++){
if(elem[j].checked){
_7ed=true;
}
}
if(!_7ed){
_7e3[_7e3.length]=elem[0].name;
}
}
}
}
}
}
if(_7e2.required instanceof Array){
for(var i=0;i<_7e2.required.length;i++){
if(typeof _7e2.required[i]!="object"){
continue;
}
var elem,numRequired;
for(var name in _7e2.required[i]){
elem=form[name];
numRequired=_7e2.required[i][name];
}
if(elem instanceof Array){
var _7ed=0;
for(var j=0;j<elem.length;j++){
if(elem[j].checked){
_7ed++;
}
}
if(_7ed<numRequired){
_7e3[_7e3.length]=elem[0].name;
}
}else{
if(elem.type=="select-multiple"){
var _7f0=0;
for(var j=0;j<elem.options.length;j++){
if(elem.options[j].selected){
_7f0++;
}
}
if(_7f0<numRequired){
_7e3[_7e3.length]=elem.name;
}
}
}
}
}
if(typeof _7e2.dependancies=="object"){
for(name in _7e2.dependancies){
var elem=form[name];
if(elem.type!="text"&&elem.type!="textarea"&&elem.type!="password"){
continue;
}
if(/\S+/.test(elem.value)){
continue;
}
if(_7e5.isMissing(elem.name)){
continue;
}
var _7f1=form[_7e2.dependancies[name]];
if(_7f1.type!="text"&&_7f1.type!="textarea"&&_7f1.type!="password"){
continue;
}
if(/^\s*$/.test(_7f1.value)){
continue;
}
_7e3[_7e3.length]=elem.name;
}
}
if(typeof _7e2.constraints=="object"){
for(name in _7e2.constraints){
var elem=form[name];
if(elem.type!="text"&&elem.type!="textarea"&&elem.type!="password"){
continue;
}
if(/^\s*$/.test(elem.value)){
continue;
}
var _7f2=true;
if(typeof _7e2.constraints[name]=="function"){
_7f2=_7e2.constraints[name](elem.value);
}else{
if(_7e2.constraints[name] instanceof Array){
var _7f3=_7e2.constraints[name][0];
var _7f4=_7e2.constraints[name].slice(1);
_7f4.unshift(elem.value);
_7f2=_7f3.apply(null,_7f4);
}
}
if(!_7f2){
_7e4[_7e4.length]=elem.name;
}
}
}
if(typeof _7e2.confirm=="object"){
for(name in _7e2.confirm){
var elem=form[name];
var _7f1=form[_7e2.confirm[name]];
if((elem.type!="text"&&elem.type!="textarea"&&elem.type!="password")||_7f1.type!=elem.type||_7f1.value==elem.value||_7e5.isInvalid(elem.name)||/^\s*$/.test(_7f1.value)){
continue;
}
_7e4[_7e4.length]=elem.name;
}
}
return _7e5;
};
dojo.provide("dojo.widget.LayoutPane");
dojo.require("dojo.widget.*");
dojo.widget.tags.addParseTreeHandler("dojo:LayoutPane");
dojo.provide("dojo.widget.Container");
dojo.provide("dojo.widget.html.Container");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.Container");
dojo.widget.html.Container=function(){
dojo.widget.HtmlWidget.call(this);
};
dojo.inherits(dojo.widget.html.Container,dojo.widget.HtmlWidget);
dojo.lang.extend(dojo.widget.html.Container,{widgetType:"Container",isContainer:true,containerNode:null,domNode:null,onResized:function(){
this.notifyChildrenOfResize();
},notifyChildrenOfResize:function(){
for(var i=0;i<this.children.length;i++){
var _7f6=this.children[i];
if(_7f6.onResized){
_7f6.onResized();
}
}
}});
dojo.widget.tags.addParseTreeHandler("dojo:Container");
dojo.provide("dojo.widget.LayoutPane");
dojo.provide("dojo.widget.html.LayoutPane");
dojo.require("dojo.widget.LayoutPane");
dojo.require("dojo.widget.*");
dojo.require("dojo.event.*");
dojo.require("dojo.io.*");
dojo.require("dojo.widget.Container");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.require("dojo.dom");
dojo.require("dojo.string");
dojo.widget.html.LayoutPane=function(){
dojo.widget.html.Container.call(this);
};
dojo.inherits(dojo.widget.html.LayoutPane,dojo.widget.html.Container);
dojo.lang.extend(dojo.widget.html.LayoutPane,{widgetType:"LayoutPane",isChild:false,clientWidth:0,clientHeight:0,layoutChildPriority:"top-bottom",cssPath:dojo.uri.dojoUri("src/widget/templates/HtmlLayoutPane.css"),url:"inline",extractContent:true,parseContent:true,cacheContent:true,handler:"none",minWidth:0,minHeight:0,fillInTemplate:function(){
this.filterAllowed(this,"layoutChildPriority",["left-right","top-bottom"]);
dojo.style.insertCssFile(this.cssPath,null,true);
dojo.html.addClass(this.domNode,"dojoLayoutPane");
},postCreate:function(args,_7f8,_7f9){
for(var i=0;i<this.children.length;i++){
this._injectChild(this.children[i]);
}
if(this.handler!="none"){
this.setHandler(this.handler);
}
if(this.isVisible()){
this.loadContents();
}
},loadContents:function(){
if(this.isLoaded){
return;
}
if(dojo.lang.isFunction(this.handler)){
this._runHandler();
}else{
if(this.url!="inline"){
this._downloadExternalContent(this.url,this.cacheContent);
}
}
this.isLoaded=true;
},setUrl:function(url){
this.url=url;
this.isLoaded=false;
if(this.isVisible()){
this.loadContents();
}
},_downloadExternalContent:function(url,_7fd){
dojo.deprecated("LayoutPane url parameter.","use LinkPane to download from a URL","0.4");
var node=this.containerNode||this.domNode;
node.innerHTML="Loading...";
var _7ff=this.extractContent;
var _800=this.parseContent;
var self=this;
dojo.io.bind({url:url,useCache:_7fd,mimetype:"text/html",handler:function(type,data,e){
if(type=="load"){
if(_7ff){
var _805=data.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_805){
data=_805[1];
}
}
node.innerHTML=data;
if(_800){
var _806=new dojo.xml.Parse();
var frag=_806.parseElement(node,null,true);
dojo.widget.getParser().createComponents(frag);
}
self.onResized();
}else{
node.innerHTML="Error loading '"+url+"' ("+e.status+" "+e.statusText+")";
}
}});
},setHandler:function(_808){
var fcn=dojo.lang.isFunction(_808)?_808:window[_808];
if(!dojo.lang.isFunction(fcn)){
throw new Error("Unable to set handler, '"+_808+"' not a function.");
return;
}
this.handler=function(){
return fcn.apply(this,arguments);
};
},_runHandler:function(){
if(dojo.lang.isFunction(this.handler)){
dojo.deprecated("use LinkPane to download content from a java function","0.4");
this.handler(this,this.domNode);
return false;
}
return true;
},filterAllowed:function(node,_80b,_80c){
if(!dojo.lang.inArray(_80c,node[_80b])){
node[_80b]=_80c[0];
}
},layoutChildren:function(){
var kids={"left":[],"right":[],"top":[],"bottom":[],"client":[],"flood":[]};
var hits=0;
for(var i=0;i<this.children.length;i++){
if(this.hasLayoutAlign(this.children[i])){
kids[this.children[i].layoutAlign].push(this.children[i]);
hits++;
}
}
if(!hits){
return;
}
var _810=this.containerNode||this.domNode;
this.clientWidth=dojo.style.getContentWidth(_810);
this.clientHeight=dojo.style.getContentHeight(_810);
this.clientRect={};
this.clientRect["left"]=dojo.style.getPixelValue(_810,"padding-left",true);
this.clientRect["right"]=dojo.style.getPixelValue(_810,"padding-right",true);
this.clientRect["top"]=dojo.style.getPixelValue(_810,"padding-top",true);
this.clientRect["bottom"]=dojo.style.getPixelValue(_810,"padding-bottom",true);
this._layoutCenter(kids,"flood");
if(this.layoutChildPriority=="top-bottom"){
this._layoutFloat(kids,"top");
this._layoutFloat(kids,"bottom");
this._layoutFloat(kids,"left");
this._layoutFloat(kids,"right");
}else{
this._layoutFloat(kids,"left");
this._layoutFloat(kids,"right");
this._layoutFloat(kids,"top");
this._layoutFloat(kids,"bottom");
}
this._layoutCenter(kids,"client");
},_layoutFloat:function(kids,_812){
var ary=kids[_812];
var lr=(_812=="right")?"right":"left";
var tb=(_812=="bottom")?"bottom":"top";
for(var i=0;i<ary.length;i++){
var elm=ary[i];
elm.domNode.style[lr]=this.clientRect[lr]+"px";
elm.domNode.style[tb]=this.clientRect[tb]+"px";
if((_812=="top")||(_812=="bottom")){
dojo.style.setOuterWidth(elm.domNode,this.clientWidth);
var _818=dojo.style.getOuterHeight(elm.domNode);
this.clientHeight-=_818;
this.clientRect[_812]+=_818;
}else{
dojo.style.setOuterHeight(elm.domNode,this.clientHeight);
var _819=dojo.style.getOuterWidth(elm.domNode);
this.clientWidth-=_819;
this.clientRect[_812]+=_819;
}
}
},_layoutCenter:function(kids,_81b){
var ary=kids[_81b];
for(var i=0;i<ary.length;i++){
var elm=ary[i];
elm.domNode.style.left=this.clientRect.left+"px";
elm.domNode.style.top=this.clientRect.top+"px";
dojo.style.setOuterWidth(elm.domNode,this.clientWidth);
dojo.style.setOuterHeight(elm.domNode,this.clientHeight);
}
},hasLayoutAlign:function(_81f){
return dojo.lang.inArray(["left","right","top","bottom","client","flood"],_81f.layoutAlign);
},addChild:function(_820,_821,pos,ref,_824){
this._injectChild(_820);
dojo.widget.html.LayoutPane.superclass.addChild.call(this,_820,_821,pos,ref,_824);
this.resizeSoon();
},_injectChild:function(_825){
if(this.hasLayoutAlign(_825)){
_825.domNode.style.position="absolute";
_825.isChild=true;
this.filterAllowed(_825,"layoutAlign",["none","left","top","right","bottom","client","flood"]);
dojo.html.addClass(_825.domNode,"dojoAlign"+dojo.string.capitalize(_825.layoutAlign));
}
},removeChild:function(pane){
dojo.widget.html.LayoutPane.superclass.removeChild.call(this,pane);
dojo.dom.removeNode(pane.domNode);
this.resizeSoon();
},onResized:function(){
if(!this.isVisible()){
return;
}
this.layoutChildren();
this.notifyChildrenOfResize();
},resizeTo:function(w,h){
w=Math.max(w,this.getMinWidth());
h=Math.max(h,this.getMinHeight());
dojo.style.setOuterWidth(this.domNode,w);
dojo.style.setOuterHeight(this.domNode,h);
this.onResized();
},show:function(){
this.loadContents();
this.domNode.style.display="";
this.onResized();
this.domNode.style.display="none";
this.domNode.style.visibility="";
dojo.widget.html.LayoutPane.superclass.show.call(this);
},getMinWidth:function(){
var w=this.minWidth;
if((this.layoutAlign=="left")||(this.layoutAlign=="right")){
w=dojo.style.getOuterWidth(this.domNode);
}
for(var i=0;i<this.children.length;i++){
var ch=this.children[i];
var a=ch.layoutAlign;
if((a=="left")||(a=="right")||(a=="client")){
if(dojo.lang.isFunction(ch.getMinWidth)){
w+=ch.getMinWidth();
}
}
}
for(var i=0;i<this.children.length;i++){
var ch=this.children[i];
var a=ch.layoutAlign;
if((a=="top")||(a=="bottom")){
if(dojo.lang.isFunction(ch.getMinWidth)){
w=Math.max(w,ch.getMinWidth());
}
}
}
return w;
},getMinHeight:function(){
var h=this.minHeight;
if((this.layoutAlign=="top")||(this.layoutAlign=="bottom")){
h=dojo.style.getOuterHeight(this.domNode);
}
for(var i=0;i<this.children.length;i++){
var ch=this.children[i];
var a=ch.layoutAlign;
if((a=="top")||(a=="bottom")||(a=="client")){
if(dojo.lang.isFunction(ch.getMinHeight)){
h+=ch.getMinHeight();
}
}
}
for(var i=0;i<this.children.length;i++){
var ch=this.children[i];
var a=ch.layoutAlign;
if((a=="left")||(a=="right")){
if(dojo.lang.isFunction(ch.getMinHeight)){
h=Math.max(h,ch.getMinHeight());
}
}
}
return h;
}});
dojo.lang.extend(dojo.widget.Widget,{layoutAlign:"none"});
dojo.provide("dojo.widget.TabPane");
dojo.provide("dojo.widget.html.TabPane");
dojo.provide("dojo.widget.Tab");
dojo.provide("dojo.widget.html.Tab");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.LayoutPane");
dojo.require("dojo.event.*");
dojo.require("dojo.html");
dojo.require("dojo.style");
dojo.widget.html.TabPane=function(){
dojo.widget.html.LayoutPane.call(this);
};
dojo.inherits(dojo.widget.html.TabPane,dojo.widget.html.LayoutPane);
dojo.lang.extend(dojo.widget.html.TabPane,{widgetType:"TabPane",labelPosition:"top",useVisibility:false,templateCssPath:dojo.uri.dojoUri("src/widget/templates/HtmlTabPane.css"),selectedTab:"",fillInTemplate:function(args,frag){
dojo.widget.html.TabPane.superclass.fillInTemplate.call(this,args,frag);
dojo.style.insertCssFile(this.templateCssPath,null,true);
dojo.html.prependClass(this.domNode,"dojoTabPane");
},postCreate:function(args,frag){
this.ul=document.createElement("ul");
dojo.html.addClass(this.ul,"tabs");
dojo.html.addClass(this.ul,this.labelPosition);
for(var i=0;i<this.children.length;i++){
this._setupTab(this.children[i]);
}
dojo.widget.html.TabPane.superclass.postCreate.call(this,args,frag);
this.filterAllowed(this,"labelPosition",["top","bottom"]);
this.labelPanel=dojo.widget.createWidget("LayoutPane",{layoutAlign:this.labelPosition});
this.labelPanel.domNode.appendChild(this.ul);
dojo.widget.html.TabPane.superclass.addChild.call(this,this.labelPanel);
dojo.lang.setTimeout(this,this.onResized,50);
},addChild:function(_836,_837,pos,ref,_83a){
this._setupTab(_836);
dojo.widget.html.TabPane.superclass.addChild.call(this,_836,_837,pos,ref,_83a);
},_setupTab:function(tab){
tab.layoutAlign="client";
tab.domNode.style.display="none";
dojo.html.prependClass(tab.domNode,"dojoTabPanel");
tab.li=document.createElement("li");
var span=document.createElement("span");
span.innerHTML=tab.label;
dojo.html.disableSelection(span);
tab.li.appendChild(span);
this.ul.appendChild(tab.li);
var self=this;
dojo.event.connect(tab.li,"onclick",function(){
self.selectTab(tab);
});
if(!this.selectedTabWidget||this.selectedTab==tab.widgetId||tab.selected){
this.selectedTabWidget=tab;
}
},selectTab:function(tab){
if(this.selectedTabWidget){
this._hideTab(this.selectedTabWidget);
}
this.selectedTabWidget=tab;
this._showTab(tab);
},_showTab:function(tab){
dojo.html.addClass(tab.li,"current");
tab.selected=true;
if(this.useVisibility&&!dojo.render.html.ie){
tab.domNode.style.visibility="visible";
}else{
tab.show();
}
},_hideTab:function(tab){
dojo.html.removeClass(tab.li,"current");
tab.selected=false;
if(this.useVisibility){
tab.domNode.style.visibility="hidden";
}else{
tab.hide();
}
},onResized:function(){
if(this.selectedTabWidget){
this.selectTab(this.selectedTabWidget);
}
dojo.widget.html.TabPane.superclass.onResized.call(this);
}});
dojo.widget.tags.addParseTreeHandler("dojo:TabPane");
dojo.lang.extend(dojo.widget.Widget,{label:"",selected:false});
dojo.widget.html.Tab=function(){
dojo.widget.html.LayoutPane.call(this);
};
dojo.inherits(dojo.widget.html.Tab,dojo.widget.html.LayoutPane);
dojo.lang.extend(dojo.widget.html.Tab,{widgetType:"Tab"});
dojo.widget.tags.addParseTreeHandler("dojo:Tab");
dojo.provide("dojo.widget.ContentPane");
dojo.provide("dojo.widget.html.ContentPane");
dojo.require("dojo.widget.*");
dojo.require("dojo.io.*");
dojo.require("dojo.widget.Container");
dojo.require("dojo.widget.ContentPane");
dojo.widget.html.ContentPane=function(){
dojo.widget.html.Container.call(this);
};
dojo.inherits(dojo.widget.html.ContentPane,dojo.widget.html.Container);
dojo.lang.extend(dojo.widget.html.ContentPane,{widgetType:"ContentPane",href:"",extractContent:true,parseContent:true,cacheContent:true,handler:"",postCreate:function(args,frag,_843){
if(this.handler!=""){
this.setHandler(this.handler);
}
},onResized:function(){
if(this.isVisible()){
this.loadContents();
}
dojo.widget.html.ContentPane.superclass.onResized.call(this);
},show:function(){
this.loadContents();
dojo.widget.html.ContentPane.superclass.show.call(this);
},loadContents:function(){
if(this.isLoaded){
return;
}
this.isLoaded=true;
if(dojo.lang.isFunction(this.handler)){
this._runHandler();
}else{
if(this.href!=""){
this._downloadExternalContent(this.href,this.cacheContent);
}
}
},setUrl:function(url){
this.href=url;
this.isLoaded=false;
if(this.isVisible()){
this.loadContents();
}
},_downloadExternalContent:function(url,_846){
this.setContent("Loading...");
var self=this;
dojo.io.bind({url:url,useCache:_846,mimetype:"text/html",handler:function(type,data,e){
if(type=="load"){
if(self.extractContent){
var _84b=data.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_84b){
data=_84b[1];
}
}
self.setContent.call(self,data);
}else{
self.setContent.call(self,"Error loading '"+url+"' ("+e.status+" "+e.statusText+")");
}
}});
},setContent:function(data){
var node=this.containerNode||this.domNode;
node.innerHTML=data;
if(this.parseContent){
var _84e=new dojo.xml.Parse();
var frag=_84e.parseElement(node,null,true);
dojo.widget.getParser().createComponents(frag);
this.onResized();
}
},setHandler:function(_850){
var fcn=dojo.lang.isFunction(_850)?_850:window[_850];
if(!dojo.lang.isFunction(fcn)){
throw new Error("Unable to set handler, '"+_850+"' not a function.");
return;
}
this.handler=function(){
return fcn.apply(this,arguments);
};
},_runHandler:function(){
if(dojo.lang.isFunction(this.handler)){
this.handler(this,this.domNode);
return false;
}
return true;
}});
dojo.widget.tags.addParseTreeHandler("dojo:ContentPane");
dojo.provide("awl.common");
awl.common.fixPngIE=function(img){
if(document.all){
img.style.width="24px";
img.style.height="24px";
img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+img.src+"', sizingMethod='scale')";
img.src=dojo.uri.dojoUri("../awl/widget/templates/images/clear.gif");
}
};
awl.common.fixPngImagesIE=function(_853){
var _854=document.images;
for(var i=0;i<_854.length;i=i+1){
var img=_854[i];
if(dojo.dom.isDescendantOf(img,_853)){
var name=img.src;
var ext=name.substr(name.length-3,3).toUpperCase();
if(ext=="PNG"){
awl.common.fixPngIE(img);
}
}
}
};
awl.common.getExpDate=function(days,_85a,_85b){
var _85c=new Date();
if(typeof days=="number"&&typeof _85a=="number"&&typeof _85a=="number"){
_85c.setDate(_85c.getDate()+parseInt(days));
_85c.setHours(_85c.getHours()+parseInt(_85a));
_85c.setMinutes(_85c.getMinutes()+parseInt(_85b));
return _85c.toGMTString();
}
};
awl.common.getCookieVal=function(_85d){
var _85e=document.cookie.indexOf(";",_85d);
if(_85e==-1){
_85e=document.cookie.length;
}
return unescape(document.cookie.substring(_85d,_85e));
};
awl.common.getCookie=function(name){
var arg=name+"=";
var alen=arg.length;
var clen=document.cookie.length;
var i=0;
while(i<clen){
var j=i+alen;
if(document.cookie.substring(i,j)==arg){
return awl.common.getCookieVal(j);
}
i=document.cookie.indexOf(" ",i)+1;
if(i===0){
break;
}
}
return null;
};
awl.common.setCookie=function(name,_866,_867,path,_869,_86a){
document.cookie=name+"="+escape(_866)+((_867)?"; expires="+_867:"")+((path)?"; path="+path:"")+((_869)?"; domain="+_869:"")+((_86a)?"; secure":"");
};
awl.common.deleteCookie=function(name,path,_86d){
if(awl.common.getCookie(name)){
document.cookie=name+"="+((path)?"; path="+path:"")+((_86d)?"; domain="+_86d:"")+"; expires=Thu, 01-Jan-70 00:00:01 GMT";
}
};
awl.common.loadXmlFromFile=function(_86e,_86f,_870){
if(_870===null){
alert("awl.common.loadXmlFromFile: Invalid handler param!");
}
var _871={url:_86e,mimetype:"text/xml",preventCache:true,error:function(type,_873){
dojo.debug("Load XML from file failed: "+_86e);
},load:_870,callingObj:_86f};
dojo.io.bind(_871);
};
awl.common.formatDecimal=function(_874,_875,_876){
var _877=(_876===null)?2:_876;
var _878=1;
_878=Math.pow(10,_877);
_874=Math.round(parseFloat(_874)*_878)/_878;
_874=""+_874;
if(_874.indexOf(".")===0){
_874="0"+_874;
}
if(_875===true){
if(_874.indexOf(".")==-1){
_874=_874+".";
}
while((_874.indexOf(".")+1)>(_874.length-_877)){
_874=_874+"0";
}
}
return _874;
};
awl.common.isKey=function(_879,evt){
var _87b=(evt.charCode)?evt.charCode:((evt.which)?evt.which:evt.keyCode);
if(_87b!==_879){
return (false);
}
return (true);
};
awl.common.focusNodeOnReturn=function(_87c,evt){
if(awl.common.isKey(13,evt)){
_87c.focus();
_87c.select();
return false;
}
return true;
};
awl.common.getXmlValue=function(xDoc,_87f){
var _880=xDoc.getElementsByTagName(_87f)[0];
var _881="";
if((dojo.dom.isNode(_880))&&(_880.firstChild)){
_881=_880.firstChild.nodeValue;
}
return (_881);
};
dojo.hostenv.conditionalLoadModule({common:["awl.common"]});
dojo.hostenv.moduleLoaded("awl.*");
dojo.provide("awl.widget.ChartLegend");
dojo.require("dojo.event.*");
dojo.setModulePrefix("awl","../awl");
dojo.require("awl.*");
awl.widget.ChartLegend=function(){
dojo.widget.HtmlWidget.call(this);
this.templateString="<div class=\"awlChartLegend\">\n<div class=\"awlScaleLabel\" dojoAttachPoint=\"_yScaleLabel\"></div>\n<span class=\"awlScaleFootnote\">\n	<a class=\"awlLegendFootnote\" href=\"javascript:void(0)\" \n			dojoAttachPoint=\"_yScaleMode\"\n			dojoAttachEvent=\"onClick:onScaleModeClick;\"></a>\n</span>\n<span class=\"awlLegendItem awlItem1\">\n	<span class=\"awlLegendSwatch\" \n	      dojoAttachPoint=\"_swatch1\">&nbsp;&nbsp;&nbsp;&nbsp;</span>\n	<span class=\"awlLegendLabel\" \n		  dojoAttachPoint=\"_alarm1Label\"></span>\n</span>\n<span class=\"awlLegendItem awlItem2\">\n	<span class=\"awlLegendSwatch\" \n		  dojoAttachPoint=\"_swatch2\">&nbsp;&nbsp;&nbsp;&nbsp;</span>\n	<span class=\"awlLegendLabel\"\n		  dojoAttachPoint=\"_alarm2Label\"></span>\n</span>\n<span class=\"awlCompressedFootnote\">\n	<a class=\"awlLegendFootnote\" href=\"javascript:void(0)\" \n			dojoAttachPoint=\"_compressedMsg\"></a>\n</span>\n</div>\n";
this.templateCssPath=dojo.uri.dojoUri("../awl/widget/templates/HtmlChartLegend.css");
this.widgetType="ChartLegend";
this.Strings={DECIMATED:"* data condensed",FAQ_LINK:"http://www.accsense.com/cust_support_faq.html#condensedData",FOOTNOTE_TOOLTIP:"Click here for more information",SCALE_MODE_AUTO:"Auto",SCALE_MODE_MANUAL:"Manual",SCALE_MODE_LABEL:"Y-Axis Scale:"};
this.alarmLegendText1="Label1";
this.alarmLegendText2="Label2";
this.xmlTestFile="";
this._alarm1Label=null;
this._alarm2Label=null;
this._compressedMsg=null;
this._swatch1=null;
this._swatch2=null;
this._yScaleLabel=null;
this._yScaleMode=null;
this.xmlDataNode=null;
this.alarmObj1={};
this.alarmObj2={};
this.fillInTemplate=function(){
this._yScaleMode.style.display="none";
};
this.postCreate=function(){
this._registerExternalEvents();
this._initObjects();
if(this.xmlTestFile!==""){
awl.common.loadXmlFromFile(this.xmlTestFile,this,this._testLoadhandler);
}
};
this._initObjects=function(){
this.alarmObj1.label=this._alarm1Label;
this.alarmObj1.swatch=this._swatch1;
this.alarmObj2.label=this._alarm2Label;
this.alarmObj2.swatch=this._swatch2;
};
this.updateLegend=function(data){
if((data===undefined)||(data===null)){
dojo.debug("ChartLegend: No legend data found");
return false;
}
this._clearLegend();
var _883=this.getXmlValue(data,"alarm1Label");
this._setAlarmLabel(this.alarmObj1,_883);
_883=this.getXmlValue(data,"alarm2Label");
this._setAlarmLabel(this.alarmObj2,_883);
_883=this.getXmlValue(data,"decimated");
this._setFootnote(_883);
this._yScaleLabel.innerHTML=this.Strings.SCALE_MODE_LABEL;
};
this._clearLegend=function(){
this._setAlarmLabel(this.alarmObj1,"");
this._setAlarmLabel(this.alarmObj2,"");
this._compressedMsg.innerHTML="";
this._yScaleLabel.innerHTML="";
this._yScaleMode.innerHTML="";
this._yScaleMode.style.display="block";
};
this._setAlarmLabel=function(_884,_885){
if(_885===""){
_884.label.innerHTML="";
_884.swatch.style.display="none";
}else{
_884.label.innerHTML=": "+_885;
_884.swatch.style.display="inline";
}
};
this._setFootnote=function(text){
if(text=="true"){
this._compressedMsg.innerHTML=this.Strings.DECIMATED;
this._compressedMsg.href=this.Strings.FAQ_LINK;
this._compressedMsg.target="_blank";
this._compressedMsg.title=this.Strings.FOOTNOTE_TOOLTIP;
}else{
this._compressedMsg.innerHTML="";
}
};
this._setScaleMode=function(_887){
if(_887){
this._yScaleMode.innerHTML=this.Strings.SCALE_MODE_AUTO;
}else{
this._yScaleMode.innerHTML=this.Strings.SCALE_MODE_MANUAL;
}
};
this._testLoadhandler=function(type,data,ev){
this.callingObj.updateLegend(data);
};
this.onScaleModeClick=function(evt){
this._requestScaleFocus();
};
this._registerExternalEvents=function(){
dojo.event.topic.subscribe("/onLegendData",this,this._externalLoadEvent);
dojo.event.topic.subscribe("/onLoading",this,this._prepareToLoad);
dojo.event.topic.subscribe("/onScaleModeChange",this,this._externalScaleModeChange);
dojo.event.topic.registerPublisher("/requestScaleFocus",this,this._requestScaleFocus);
};
this._externalLoadEvent=function(_88c){
dojo.debug(this.widgetType,": Received /onLegendData event",_88c);
this.updateLegend(_88c);
};
this._prepareToLoad=function(){
dojo.debug(this.widgetType,": Received /onLoading event");
this._clearLegend();
};
this._externalScaleModeChange=function(_88d){
dojo.debug(this.widgetType,": Received /onScaleModeChange event");
this._setScaleMode(_88d);
};
this._requestScaleFocus=function(){
dojo.debug(this.widgetType,": Requesting Scale focus","(/requestScaleFocus)");
};
this.getXmlValue=function(xDoc,_88f){
var _890=xDoc.getElementsByTagName(_88f)[0];
var _891="";
if((dojo.dom.isNode(_890))&&(_890.firstChild)){
_891=_890.firstChild.nodeValue;
}
return (_891);
};
};
dojo.inherits(awl.widget.ChartLegend,dojo.widget.HtmlWidget);
dojo.widget.tags.addParseTreeHandler("dojo:chartlegend");
dojo.provide("dojo.date");
dojo.require("dojo.string");
dojo.date.setIso8601=function(_892,_893){
var _894=_893.split("T");
dojo.date.setIso8601Date(_892,_894[0]);
if(_894.length==2){
dojo.date.setIso8601Time(_892,_894[1]);
}
return _892;
};
dojo.date.fromIso8601=function(_895){
return dojo.date.setIso8601(new Date(0),_895);
};
dojo.date.setIso8601Date=function(_896,_897){
var _898="^([0-9]{4})((-?([0-9]{2})(-?([0-9]{2}))?)|"+"(-?([0-9]{3}))|(-?W([0-9]{2})(-?([1-7]))?))?$";
var d=_897.match(new RegExp(_898));
var year=d[1];
var _89b=d[4];
var date=d[6];
var _89d=d[8];
var week=d[10];
var _89f=(d[12])?d[12]:1;
_896.setYear(year);
if(_89d){
dojo.date.setDayOfYear(_896,Number(_89d));
}else{
if(week){
_896.setMonth(0);
_896.setDate(1);
var gd=_896.getDay();
var day=(gd)?gd:7;
var _8a2=Number(_89f)+(7*Number(week));
if(day<=4){
_896.setDate(_8a2+1-day);
}else{
_896.setDate(_8a2+8-day);
}
}else{
if(_89b){
_896.setMonth(_89b-1);
}
if(date){
_896.setDate(date);
}
}
}
return _896;
};
dojo.date.fromIso8601Date=function(_8a3){
return dojo.date.setIso8601Date(new Date(0),_8a3);
};
dojo.date.setIso8601Time=function(_8a4,_8a5){
var _8a6="Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$";
var d=_8a5.match(new RegExp(_8a6));
var _8a8=0;
if(d){
if(d[0]!="Z"){
_8a8=(Number(d[3])*60)+Number(d[5]);
_8a8*=((d[2]=="-")?1:-1);
}
_8a8-=_8a4.getTimezoneOffset();
_8a5=_8a5.substr(0,_8a5.length-d[0].length);
}
var _8a9="^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(.([0-9]+))?)?)?$";
var d=_8a5.match(new RegExp(_8a9));
var _8aa=d[1];
var mins=Number((d[3])?d[3]:0)+_8a8;
var secs=(d[5])?d[5]:0;
var ms=d[7]?(Number("0."+d[7])*1000):0;
_8a4.setHours(_8aa);
_8a4.setMinutes(mins);
_8a4.setSeconds(secs);
_8a4.setMilliseconds(ms);
return _8a4;
};
dojo.date.fromIso8601Time=function(_8ae){
return dojo.date.setIso8601Time(new Date(0),_8ae);
};
dojo.date.setDayOfYear=function(_8af,_8b0){
_8af.setMonth(0);
_8af.setDate(_8b0);
return _8af;
};
dojo.date.getDayOfYear=function(_8b1){
var _8b2=new Date("1/1/"+_8b1.getFullYear());
return Math.floor((_8b1.getTime()-_8b2.getTime())/86400000);
};
dojo.date.getWeekOfYear=function(_8b3){
return Math.ceil(dojo.date.getDayOfYear(_8b3)/7);
};
dojo.date.daysInMonth=function(_8b4,year){
dojo.deprecated("daysInMonth(month, year)","replaced by getDaysInMonth(dateObject)","0.4");
return dojo.date.getDaysInMonth(new Date(year,_8b4,1));
};
dojo.date.getDaysInMonth=function(_8b6){
var _8b7=_8b6.getMonth();
var year=_8b6.getFullYear();
var days=[31,28,31,30,31,30,31,31,30,31,30,31];
if(_8b7==1&&year){
if((!(year%4)&&(year%100))||(!(year%4)&&!(year%100)&&!(year%400))){
return 29;
}else{
return 28;
}
}else{
return days[_8b7];
}
};
dojo.date.months=["January","February","March","April","May","June","July","August","September","October","November","December"];
dojo.date.shortMonths=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
dojo.date.days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
dojo.date.shortDays=["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
dojo.date.toLongDateString=function(date){
return dojo.date.months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
};
dojo.date.toShortDateString=function(date){
return dojo.date.shortMonths[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
};
dojo.date.toMilitaryTimeString=function(date){
var h="00"+date.getHours();
var m="00"+date.getMinutes();
var s="00"+date.getSeconds();
return h.substr(h.length-2,2)+":"+m.substr(m.length-2,2)+":"+s.substr(s.length-2,2);
};
dojo.date.toRelativeString=function(date){
var now=new Date();
var diff=(now-date)/1000;
var end=" ago";
var _8c4=false;
if(diff<0){
_8c4=true;
end=" from now";
diff=-diff;
}
if(diff<60){
diff=Math.round(diff);
return diff+" second"+(diff==1?"":"s")+end;
}else{
if(diff<3600){
diff=Math.round(diff/60);
return diff+" minute"+(diff==1?"":"s")+end;
}else{
if(diff<3600*24&&date.getDay()==now.getDay()){
diff=Math.round(diff/3600);
return diff+" hour"+(diff==1?"":"s")+end;
}else{
if(diff<3600*24*7){
diff=Math.round(diff/(3600*24));
if(diff==1){
return _8c4?"Tomorrow":"Yesterday";
}else{
return diff+" days"+end;
}
}else{
return dojo.date.toShortDateString(date);
}
}
}
}
};
dojo.date.getDayOfWeekName=function(date){
return dojo.date.days[date.getDay()];
};
dojo.date.getShortDayOfWeekName=function(date){
return dojo.date.shortDays[date.getDay()];
};
dojo.date.getMonthName=function(date){
return dojo.date.months[date.getMonth()];
};
dojo.date.getShortMonthName=function(date){
return dojo.date.shortMonths[date.getMonth()];
};
dojo.date.toString=function(date,_8ca){
if(_8ca.indexOf("#d")>-1){
_8ca=_8ca.replace(/#dddd/g,dojo.date.getDayOfWeekName(date));
_8ca=_8ca.replace(/#ddd/g,dojo.date.getShortDayOfWeekName(date));
_8ca=_8ca.replace(/#dd/g,(date.getDate().toString().length==1?"0":"")+date.getDate());
_8ca=_8ca.replace(/#d/g,date.getDate());
}
if(_8ca.indexOf("#M")>-1){
_8ca=_8ca.replace(/#MMMM/g,dojo.date.getMonthName(date));
_8ca=_8ca.replace(/#MMM/g,dojo.date.getShortMonthName(date));
_8ca=_8ca.replace(/#MM/g,((date.getMonth()+1).toString().length==1?"0":"")+(date.getMonth()+1));
_8ca=_8ca.replace(/#M/g,date.getMonth()+1);
}
if(_8ca.indexOf("#y")>-1){
var _8cb=date.getFullYear().toString();
_8ca=_8ca.replace(/#yyyy/g,_8cb);
_8ca=_8ca.replace(/#yy/g,_8cb.substring(2));
_8ca=_8ca.replace(/#y/g,_8cb.substring(3));
}
if(_8ca.indexOf("#")==-1){
return _8ca;
}
if(_8ca.indexOf("#h")>-1){
var _8cc=date.getHours();
_8cc=(_8cc>12?_8cc-12:(_8cc==0)?12:_8cc);
_8ca=_8ca.replace(/#hh/g,(_8cc.toString().length==1?"0":"")+_8cc);
_8ca=_8ca.replace(/#h/g,_8cc);
}
if(_8ca.indexOf("#H")>-1){
_8ca=_8ca.replace(/#HH/g,(date.getHours().toString().length==1?"0":"")+date.getHours());
_8ca=_8ca.replace(/#H/g,date.getHours());
}
if(_8ca.indexOf("#m")>-1){
_8ca=_8ca.replace(/#mm/g,(date.getMinutes().toString().length==1?"0":"")+date.getMinutes());
_8ca=_8ca.replace(/#m/g,date.getMinutes());
}
if(_8ca.indexOf("#s")>-1){
_8ca=_8ca.replace(/#ss/g,(date.getSeconds().toString().length==1?"0":"")+date.getSeconds());
_8ca=_8ca.replace(/#s/g,date.getSeconds());
}
if(_8ca.indexOf("#T")>-1){
_8ca=_8ca.replace(/#TT/g,date.getHours()>=12?"PM":"AM");
_8ca=_8ca.replace(/#T/g,date.getHours()>=12?"P":"A");
}
if(_8ca.indexOf("#t")>-1){
_8ca=_8ca.replace(/#tt/g,date.getHours()>=12?"pm":"am");
_8ca=_8ca.replace(/#t/g,date.getHours()>=12?"p":"a");
}
return _8ca;
};
dojo.date.toSql=function(date,_8ce){
var sql=date.getFullYear()+"-"+dojo.string.pad(date.getMonth(),2)+"-"+dojo.string.pad(date.getDate(),2);
if(!_8ce){
sql+=" "+dojo.string.pad(date.getHours(),2)+":"+dojo.string.pad(date.getMinutes(),2)+":"+dojo.string.pad(date.getSeconds(),2);
}
return sql;
};
dojo.date.fromSql=function(_8d0){
var _8d1=_8d0.split(/[\- :]/g);
while(_8d1.length<6){
_8d1.push(0);
}
return new Date(_8d1[0],_8d1[1],_8d1[2],_8d1[3],_8d1[4],_8d1[5]);
};
dojo.provide("dojo.widget.DatePicker");
dojo.provide("dojo.widget.DatePicker.util");
dojo.require("dojo.widget.DomWidget");
dojo.require("dojo.date");
dojo.widget.DatePicker=function(){
dojo.widget.Widget.call(this);
this.widgetType="DatePicker";
this.isContainer=false;
this.months=dojo.date.months;
this.weekdays=dojo.date.days;
this.toRfcDate=dojo.widget.DatePicker.util.toRfcDate;
this.fromRfcDate=dojo.widget.DatePicker.util.fromRfcDate;
this.initFirstSaturday=dojo.widget.DatePicker.util.initFirstSaturday;
};
dojo.inherits(dojo.widget.DatePicker,dojo.widget.Widget);
dojo.widget.tags.addParseTreeHandler("dojo:datepicker");
dojo.widget.DatePicker.util=new function(){
this.months=dojo.date.months;
this.weekdays=dojo.date.days;
this.toRfcDate=function(_8d2){
if(!_8d2){
_8d2=this.today;
}
var year=_8d2.getFullYear();
var _8d4=_8d2.getMonth()+1;
if(_8d4<10){
_8d4="0"+_8d4.toString();
}
var date=_8d2.getDate();
if(date<10){
date="0"+date.toString();
}
return year+"-"+_8d4+"-"+date+"T00:00:00+00:00";
};
this.fromRfcDate=function(_8d6){
var _8d7=_8d6.split("-");
if(_8d7.length<3){
return new Date();
}
return new Date(parseInt(_8d7[0]),(parseInt(_8d7[1],10)-1),parseInt(_8d7[2].substr(0,2),10));
};
this.initFirstSaturday=function(_8d8,year){
if(!_8d8){
_8d8=this.date.getMonth();
}
if(!year){
year=this.date.getFullYear();
}
var _8da=new Date(year,_8d8,1);
return {year:year,month:_8d8,date:7-_8da.getDay()};
};
};
dojo.provide("dojo.widget.html.DatePicker");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.DatePicker");
dojo.require("dojo.event.*");
dojo.require("dojo.html");
dojo.widget.html.DatePicker=function(){
dojo.widget.DatePicker.call(this);
dojo.widget.HtmlWidget.call(this);
var _8db=this;
this.today="";
this.date="";
this.storedDate="";
this.currentDate={};
this.firstSaturday={};
this.classNames={previous:"previousMonth",current:"currentMonth",next:"nextMonth",currentDate:"currentDate",selectedDate:"selectedItem"};
this.templateString="<div class=\"datePickerContainer\" dojoAttachPoint=\"datePickerContainerNode\">\n	<h3 class=\"monthLabel\">\n	<!--\n	<span \n		dojoAttachPoint=\"decreaseWeekNode\" \n		dojoAttachEvent=\"onClick: onIncrementWeek;\" \n		class=\"incrementControl\">\n		<img src=\"${dojoRoot}/src/widget/templates/decrementWeek.gif\" alt=\"&uarr;\" />\n	</span>\n	-->\n	<span \n		dojoAttachPoint=\"decreaseMonthNode\" \n		dojoAttachEvent=\"onClick: onIncrementMonth;\" class=\"incrementControl\">\n		<img src=\"${dojoRoot}/src/widget/templates/decrementMonth.gif\" \n			alt=\"&uarr;\" dojoAttachPoint=\"decrementMonthImageNode\">\n	</span>\n	<span dojoAttachPoint=\"monthLabelNode\" class=\"month\">July</span>\n	<span \n		dojoAttachPoint=\"increaseMonthNode\" \n		dojoAttachEvent=\"onClick: onIncrementMonth;\" class=\"incrementControl\">\n		<img src=\"${dojoRoot}/src/widget/templates/incrementMonth.gif\" \n			alt=\"&darr;\"  dojoAttachPoint=\"incrementMonthImageNode\">\n	</span>\n	<!--\n		<span dojoAttachPoint=\"increaseWeekNode\" \n			dojoAttachEvent=\"onClick: onIncrementWeek;\" \n			class=\"incrementControl\">\n			<img src=\"${dojoRoot}/src/widget/templates/incrementWeek.gif\" \n			alt=\"&darr;\" />\n		</span>\n	-->\n	</h3>\n	<table class=\"calendarContainer\">\n		<thead>\n			<tr>\n				<td>Su</td>\n				<td>Mo</td>\n				<td>Tu</td>\n				<td>We</td>\n				<td>Th</td>\n				<td>Fr</td>\n				<td>Sa</td>\n			</tr>\n		</thead>\n		<tbody dojoAttachPoint=\"calendarDatesContainerNode\" \n			dojoAttachEvent=\"onClick: onSetDate;\">\n			<tr dojoAttachPoint=\"calendarRow0\">\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n			</tr>\n			<tr dojoAttachPoint=\"calendarRow1\">\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n			</tr>\n			<tr dojoAttachPoint=\"calendarRow2\">\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n			</tr>\n			<tr dojoAttachPoint=\"calendarRow3\">\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n			</tr>\n			<tr dojoAttachPoint=\"calendarRow4\">\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n			</tr>\n			<tr dojoAttachPoint=\"calendarRow5\">\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n				<td></td>\n			</tr>\n		</tbody>\n	</table>\n	<h3 class=\"yearLabel\">\n		<span dojoAttachPoint=\"previousYearLabelNode\"\n			dojoAttachEvent=\"onClick: onIncrementYear;\" class=\"previousYear\"></span>\n		<span class=\"selectedYear\" dojoAttachPoint=\"currentYearLabelNode\"></span>\n		<span dojoAttachPoint=\"nextYearLabelNode\" \n			dojoAttachEvent=\"onClick: onIncrementYear;\" class=\"nextYear\"></span>\n	</h3>\n</div>\n";
this.templateCssPath=dojo.uri.dojoUri("src/widget/templates/HtmlDatePicker.css");
this.fillInTemplate=function(){
this.initData();
this.initUI();
};
this.initData=function(){
this.today=new Date();
if(this.storedDate&&(this.storedDate.split("-").length>2)){
this.date=dojo.widget.DatePicker.util.fromRfcDate(this.storedDate);
}else{
this.date=this.today;
}
this.today.setHours(0);
this.date.setHours(0);
var _8dc=this.date.getMonth();
var _8dd=dojo.widget.DatePicker.util.initFirstSaturday(this.date.getMonth().toString(),this.date.getFullYear());
this.firstSaturday.year=_8dd.year;
this.firstSaturday.month=_8dd.month;
this.firstSaturday.date=_8dd.date;
};
this.setDate=function(_8de){
this.storedDate=_8de;
};
this.initUI=function(){
this.selectedIsUsed=false;
this.currentIsUsed=false;
var _8df="";
var _8e0=new Date();
var _8e1=this.calendarDatesContainerNode.getElementsByTagName("td");
var _8e2;
_8e0.setHours(8);
var _8e3=new Date(this.firstSaturday.year,this.firstSaturday.month,this.firstSaturday.date,8);
if(this.firstSaturday.date<7){
var _8e4=6;
for(var i=this.firstSaturday.date;i>0;i--){
_8e2=_8e1.item(_8e4);
_8e2.innerHTML=_8e3.getDate();
dojo.html.setClass(_8e2,this.getDateClassName(_8e3,"current"));
_8e4--;
_8e0=_8e3;
_8e3=this.incrementDate(_8e3,false);
}
for(var i=_8e4;i>-1;i--){
_8e2=_8e1.item(i);
_8e2.innerHTML=_8e3.getDate();
dojo.html.setClass(_8e2,this.getDateClassName(_8e3,"previous"));
_8e0=_8e3;
_8e3=this.incrementDate(_8e3,false);
}
}else{
_8e3.setDate(1);
for(var i=0;i<7;i++){
_8e2=_8e1.item(i);
_8e2.innerHTML=i+1;
dojo.html.setClass(_8e2,this.getDateClassName(_8e3,"current"));
_8e0=_8e3;
_8e3=this.incrementDate(_8e3,true);
}
}
_8e0.setDate(this.firstSaturday.date);
_8e0.setMonth(this.firstSaturday.month);
_8e0.setFullYear(this.firstSaturday.year);
_8e3=this.incrementDate(_8e0,true);
var _8e6=7;
_8e2=_8e1.item(_8e6);
while((_8e3.getMonth()==_8e0.getMonth())&&(_8e6<42)){
_8e2.innerHTML=_8e3.getDate();
dojo.html.setClass(_8e2,this.getDateClassName(_8e3,"current"));
_8e2=_8e1.item(++_8e6);
_8e0=_8e3;
_8e3=this.incrementDate(_8e3,true);
}
while(_8e6<42){
_8e2.innerHTML=_8e3.getDate();
dojo.html.setClass(_8e2,this.getDateClassName(_8e3,"next"));
_8e2=_8e1.item(++_8e6);
_8e0=_8e3;
_8e3=this.incrementDate(_8e3,true);
}
this.setMonthLabel(this.firstSaturday.month);
this.setYearLabels(this.firstSaturday.year);
};
this.incrementDate=function(date,bool){
var time=date.getTime();
var _8ea=1000*60*60*24;
time=(bool)?(time+_8ea):(time-_8ea);
var _8eb=new Date();
_8eb.setTime(time);
return _8eb;
};
this.incrementWeek=function(date,bool){
dojo.unimplemented("dojo.widget.html.DatePicker.incrementWeek");
};
this.incrementMonth=function(date,bool){
dojo.unimplemented("dojo.widget.html.DatePicker.incrementMonth");
};
this.incrementYear=function(date,bool){
dojo.unimplemented("dojo.widget.html.DatePicker.incrementYear");
};
this.onIncrementDate=function(evt){
dojo.unimplemented("dojo.widget.html.DatePicker.onIncrementDate");
};
this.onIncrementWeek=function(evt){
evt.stopPropagation();
dojo.unimplemented("dojo.widget.html.DatePicker.onIncrementWeek");
switch(evt.target){
case this.increaseWeekNode:
break;
case this.decreaseWeekNode:
break;
}
};
this.onIncrementMonth=function(evt){
evt.stopPropagation();
var _8f5=this.firstSaturday.month;
var year=this.firstSaturday.year;
switch(evt.currentTarget){
case this.increaseMonthNode:
if(_8f5<11){
_8f5++;
}else{
_8f5=0;
year++;
this.setYearLabels(year);
}
break;
case this.decreaseMonthNode:
if(_8f5>0){
_8f5--;
}else{
_8f5=11;
year--;
this.setYearLabels(year);
}
break;
case this.increaseMonthNode.getElementsByTagName("img").item(0):
if(_8f5<11){
_8f5++;
}else{
_8f5=0;
year++;
this.setYearLabels(year);
}
break;
case this.decreaseMonthNode.getElementsByTagName("img").item(0):
if(_8f5>0){
_8f5--;
}else{
_8f5=11;
year--;
this.setYearLabels(year);
}
break;
}
var _8f7=dojo.widget.DatePicker.util.initFirstSaturday(_8f5.toString(),year);
this.firstSaturday.year=_8f7.year;
this.firstSaturday.month=_8f7.month;
this.firstSaturday.date=_8f7.date;
this.initUI();
};
this.onIncrementYear=function(evt){
evt.stopPropagation();
var year=this.firstSaturday.year;
switch(evt.target){
case this.nextYearLabelNode:
year++;
break;
case this.previousYearLabelNode:
year--;
break;
}
var _8fa=dojo.widget.DatePicker.util.initFirstSaturday(this.firstSaturday.month.toString(),year);
this.firstSaturday.year=_8fa.year;
this.firstSaturday.month=_8fa.month;
this.firstSaturday.date=_8fa.date;
this.initUI();
};
this.setMonthLabel=function(_8fb){
this.monthLabelNode.innerHTML=this.months[_8fb];
};
this.setYearLabels=function(year){
this.previousYearLabelNode.innerHTML=year-1;
this.currentYearLabelNode.innerHTML=year;
this.nextYearLabelNode.innerHTML=year+1;
};
this.getDateClassName=function(date,_8fe){
var _8ff=this.classNames[_8fe];
if((!this.selectedIsUsed)&&(date.getDate()==this.date.getDate())&&(date.getMonth()==this.date.getMonth())&&(date.getFullYear()==this.date.getFullYear())){
_8ff=this.classNames.selectedDate+" "+_8ff;
this.selectedIsUsed=1;
}
if((!this.currentIsUsed)&&(date.getDate()==this.today.getDate())&&(date.getMonth()==this.today.getMonth())&&(date.getFullYear()==this.today.getFullYear())){
_8ff=_8ff+" "+this.classNames.currentDate;
this.currentIsUsed=1;
}
return _8ff;
};
this.onClick=function(evt){
dojo.event.browser.stopEvent(evt);
};
this.onSetDate=function(evt){
dojo.event.browser.stopEvent(evt);
this.selectedIsUsed=0;
this.todayIsUsed=0;
var _902=this.firstSaturday.month;
var year=this.firstSaturday.year;
if(dojo.html.hasClass(evt.target,this.classNames["next"])){
_902=++_902%12;
year=(_902==0)?++year:year;
}else{
if(dojo.html.hasClass(evt.target,this.classNames["previous"])){
_902=--_902%12;
year=(_902==11)?--year:year;
}
}
this.date=new Date(year,_902,evt.target.innerHTML);
this.setDate(dojo.widget.DatePicker.util.toRfcDate(this.date));
this.initUI();
};
};
dojo.inherits(dojo.widget.html.DatePicker,dojo.widget.HtmlWidget);
dojo.provide("dojo.widget.TimePicker");
dojo.provide("dojo.widget.TimePicker.util");
dojo.require("dojo.widget.DomWidget");
dojo.widget.TimePicker=function(){
dojo.widget.Widget.call(this);
this.widgetType="TimePicker";
this.isContainer=false;
this.toRfcDateTime=dojo.widget.TimePicker.util.toRfcDateTime;
this.fromRfcDateTime=dojo.widget.TimePicker.util.fromRfcDateTime;
this.toAmPmHour=dojo.widget.TimePicker.util.toAmPmHour;
this.fromAmPmHour=dojo.widget.TimePicker.util.fromAmPmHour;
};
dojo.inherits(dojo.widget.TimePicker,dojo.widget.Widget);
dojo.widget.tags.addParseTreeHandler("dojo:timepicker");
dojo.widget.TimePicker.util=new function(){
this.toRfcDateTime=function(_904){
if(!_904){
_904=new Date();
}
var year=_904.getFullYear();
var _906=_904.getMonth()+1;
if(_906<10){
_906="0"+_906.toString();
}
var date=_904.getDate();
if(date<10){
date="0"+date.toString();
}
var hour=_904.getHours();
if(hour<10){
hour="0"+hour.toString();
}
var _909=_904.getMinutes();
if(_909<10){
_909="0"+_909.toString();
}
var _90a="00";
var _90b=_904.getTimezoneOffset();
var _90c=parseInt(_90b/60);
if(_90c>-10&&_90c<0){
_90c="-0"+Math.abs(_90c);
}else{
if(_90c<10){
_90c="+0"+_90c.toString();
}else{
if(_90c>=10){
_90c="+"+_90c.toString();
}
}
}
var _90d=_90b%60;
if(_90d<10){
_90d="0"+_90d.toString();
}
return year+"-"+_906+"-"+date+"T"+hour+":"+_909+":"+_90a+_90c+":"+_90d;
};
this.fromRfcDateTime=function(_90e,_90f){
var _910=new Date();
if(!_90e||!_90e.split("T")[1]){
if(_90f){
_910.setMinutes(Math.floor(_910.getMinutes()/5)*5);
}else{
_910.setMinutes(0);
}
}else{
var _911=_90e.split("T")[1].split(":");
var _910=new Date();
_910.setHours(_911[0]);
_910.setMinutes(_911[1]);
}
return _910;
};
this.toAmPmHour=function(hour){
var _913=hour;
var isAm=true;
if(_913==0){
_913=12;
}else{
if(_913>12){
_913=_913-12;
isAm=false;
}else{
if(_913==12){
isAm=false;
}
}
}
return [_913,isAm];
};
this.fromAmPmHour=function(_915,isAm){
var hour=parseInt(_915,10);
if(isAm&&hour==12){
hour=0;
}else{
if(!isAm&&hour<12){
hour=hour+12;
}
}
return hour;
};
};
dojo.provide("dojo.widget.html.TimePicker");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.TimePicker");
dojo.require("dojo.widget.TimePicker.util");
dojo.require("dojo.event.*");
dojo.require("dojo.html");
dojo.widget.html.TimePicker=function(){
dojo.widget.TimePicker.call(this);
dojo.widget.HtmlWidget.call(this);
var _918=this;
this.time="";
this.useDefaultTime=false;
this.useDefaultMinutes=false;
this.storedTime="";
this.currentTime={};
this.classNames={selectedTime:"selectedItem"};
this.any="any";
this.selectedTime={hour:"",minute:"",amPm:"",anyTime:false};
this.hourIndexMap=["",2,4,6,8,10,1,3,5,7,9,11,0];
this.minuteIndexMap=[0,2,4,6,8,10,1,3,5,7,9,11];
this.templateString="<div class=\"timePickerContainer\" dojoAttachPoint=\"timePickerContainerNode\">\n	<table class=\"timeContainer\" cellspacing=\"0\" >\n		<thead>\n			<tr>\n				<td dojoAttachEvent=\"onClick: onSetSelectedHour;\">Hour</td>\n				<td class=\"minutesHeading\">Minute</td>\n				<td dojoAttachEvent=\"onClick: onSetSelectedHour;\">&nbsp;</td>\n			</tr>\n		</thead>\n		<tbody>\n			<tr>\n				<td valign=\"top\">\n					<table>\n						<tbody dojoAttachPoint=\"hourContainerNode\"  \n							dojoAttachEvent=\"onClick: onSetSelectedHour;\">\n							<tr>\n								<td>12</td>\n								<td>6</td>\n							</tr>\n							<tr>\n								<td>1</td>\n								<td>7</td>\n							</tr>\n							<tr>\n								<td>2</td>\n								<td>8</td>\n							</tr>\n							<tr>\n								<td>3</td>\n								<td>9</td>\n							</tr>\n							<tr>\n								<td>4</td>\n								<td>10</td>\n							</tr>\n							<tr>\n								<td>5</td>\n								<td>11</td>\n							</tr>\n						</tbody>\n					</table>\n				</td>\n				<td valign=\"top\" class=\"minutes\">\n					<table>\n						<tbody dojoAttachPoint=\"minuteContainerNode\" \n							dojoAttachEvent=\"onClick: onSetSelectedMinute;\">\n							<tr>\n								<td>00</td>\n								<td>30</td>\n							</tr>\n							<tr>\n								<td>05</td>\n								<td>35</td>\n							</tr>\n							<tr>\n								<td>10</td>\n								<td>40</td>\n							</tr>\n							<tr>\n								<td>15</td>\n								<td>45</td>\n							</tr>\n							<tr>\n								<td>20</td>\n								<td>50</td>\n							</tr>\n							<tr>\n								<td>25</td>\n								<td>55</td>\n							</tr>\n						</tbody>\n					</table>\n				</td>\n				<td valign=\"top\">\n					<table>\n						<tbody dojoAttachPoint=\"amPmContainerNode\" \n							dojoAttachEvent=\"onClick: onSetSelectedAmPm;\">\n							<tr>\n								<td>AM</td>\n							</tr>\n							<tr>\n								<td>PM</td>\n							</tr>\n						</tbody>\n					</table>\n				</td>\n			</tr>\n			<tr>\n				<td></td>\n				<td>\n					<div dojoAttachPoint=\"anyTimeContainerNode\" \n						dojoAttachEvent=\"onClick: onSetSelectedAnyTime;\" \n						class=\"anyTimeContainer\">any</div>\n				</td>\n				<td></td>\n			</tr>\n		</tbody>\n	</table>\n</div>\n";
this.templateCssPath=dojo.uri.dojoUri("src/widget/templates/HtmlTimePicker.css");
this.fillInTemplate=function(){
this.initData();
this.initUI();
};
this.initData=function(){
if(this.storedTime.split("T")[1]&&this.storedTime!=" "&&this.storedTime.split("T")[1]!="any"){
this.time=dojo.widget.TimePicker.util.fromRfcDateTime(this.storedTime,this.useDefaultMinutes);
}else{
if(this.useDefaultTime){
this.time=dojo.widget.TimePicker.util.fromRfcDateTime("",this.useDefaultMinutes);
}else{
this.selectedTime.anyTime=true;
}
}
};
this.initUI=function(){
if(this.time){
var _919=dojo.widget.TimePicker.util.toAmPmHour(this.time.getHours());
var hour=_919[0];
var isAm=_919[1];
var _91c=this.time.getMinutes();
var _91d=parseInt(_91c/5);
this.onSetSelectedHour(this.hourIndexMap[hour]);
this.onSetSelectedMinute(this.minuteIndexMap[_91d]);
this.onSetSelectedAmPm(isAm);
}else{
this.onSetSelectedAnyTime();
}
};
this.setDateTime=function(_91e){
this.storedTime=_91e;
};
this.onClearSelectedHour=function(evt){
this.clearSelectedHour();
};
this.onClearSelectedMinute=function(evt){
this.clearSelectedMinute();
};
this.onClearSelectedAmPm=function(evt){
this.clearSelectedAmPm();
};
this.onClearSelectedAnyTime=function(evt){
this.clearSelectedAnyTime();
if(this.selectedTime.anyTime){
this.selectedTime.anyTime=false;
this.time=dojo.widget.TimePicker.util.fromRfcDateTime("",this.useDefaultMinutes);
this.initUI();
}
};
this.clearSelectedHour=function(){
var _923=this.hourContainerNode.getElementsByTagName("td");
for(var i=0;i<_923.length;i++){
dojo.html.setClass(_923.item(i),"");
}
};
this.clearSelectedMinute=function(){
var _925=this.minuteContainerNode.getElementsByTagName("td");
for(var i=0;i<_925.length;i++){
dojo.html.setClass(_925.item(i),"");
}
};
this.clearSelectedAmPm=function(){
var _927=this.amPmContainerNode.getElementsByTagName("td");
for(var i=0;i<_927.length;i++){
dojo.html.setClass(_927.item(i),"");
}
};
this.clearSelectedAnyTime=function(){
dojo.html.setClass(this.anyTimeContainerNode,"anyTimeContainer");
};
this.onSetSelectedHour=function(evt){
this.onClearSelectedAnyTime();
this.onClearSelectedHour();
this.setSelectedHour(evt);
this.onSetTime();
};
this.setSelectedHour=function(evt){
if(evt&&evt.target){
dojo.html.setClass(evt.target,this.classNames.selectedTime);
this.selectedTime["hour"]=evt.target.innerHTML;
}else{
if(!isNaN(evt)){
var _92b=this.hourContainerNode.getElementsByTagName("td");
if(_92b.item(evt)){
dojo.html.setClass(_92b.item(evt),this.classNames.selectedTime);
this.selectedTime["hour"]=_92b.item(evt).innerHTML;
}
}
}
this.selectedTime.anyTime=false;
};
this.onSetSelectedMinute=function(evt){
this.onClearSelectedAnyTime();
this.onClearSelectedMinute();
this.setSelectedMinute(evt);
this.selectedTime.anyTime=false;
this.onSetTime();
};
this.setSelectedMinute=function(evt){
if(evt&&evt.target){
dojo.html.setClass(evt.target,this.classNames.selectedTime);
this.selectedTime["minute"]=evt.target.innerHTML;
}else{
if(!isNaN(evt)){
var _92e=this.minuteContainerNode.getElementsByTagName("td");
if(_92e.item(evt)){
dojo.html.setClass(_92e.item(evt),this.classNames.selectedTime);
this.selectedTime["minute"]=_92e.item(evt).innerHTML;
}
}
}
};
this.onSetSelectedAmPm=function(evt){
this.onClearSelectedAnyTime();
this.onClearSelectedAmPm();
this.setSelectedAmPm(evt);
this.selectedTime.anyTime=false;
this.onSetTime();
};
this.setSelectedAmPm=function(evt){
if(evt&&evt.target){
dojo.html.setClass(evt.target,this.classNames.selectedTime);
this.selectedTime["amPm"]=evt.target.innerHTML;
}else{
evt=evt?0:1;
var _931=this.amPmContainerNode.getElementsByTagName("td");
if(_931.item(evt)){
dojo.html.setClass(_931.item(evt),this.classNames.selectedTime);
this.selectedTime["amPm"]=_931.item(evt).innerHTML;
}
}
};
this.onSetSelectedAnyTime=function(evt){
this.onClearSelectedHour();
this.onClearSelectedMinute();
this.onClearSelectedAmPm();
this.setSelectedAnyTime();
this.onSetTime();
};
this.setSelectedAnyTime=function(evt){
this.selectedTime.anyTime=true;
dojo.html.setClass(this.anyTimeContainerNode,this.classNames.selectedTime+" "+"anyTimeContainer");
};
this.onClick=function(evt){
dojo.event.browser.stopEvent(evt);
};
this.onSetTime=function(){
if(this.selectedTime.anyTime){
this.time=new Date();
var _935=dojo.widget.TimePicker.util.toRfcDateTime(this.time);
this.setDateTime(_935.split("T")[0]+"T"+this.any);
}else{
var hour=12;
var _937=0;
var isAm=false;
if(this.selectedTime["hour"]){
hour=parseInt(this.selectedTime["hour"],10);
}
if(this.selectedTime["minute"]){
_937=parseInt(this.selectedTime["minute"],10);
}
if(this.selectedTime["amPm"]){
isAm=(this.selectedTime["amPm"].toLowerCase()=="am");
}
this.time=new Date();
this.time.setHours(dojo.widget.TimePicker.util.fromAmPmHour(hour,isAm));
this.time.setMinutes(_937);
this.setDateTime(dojo.widget.TimePicker.util.toRfcDateTime(this.time));
}
};
};
dojo.inherits(dojo.widget.html.TimePicker,dojo.widget.HtmlWidget);
dojo.provide("awl.widget.DateSelect");
dojo.require("dojo.widget.*");
dojo.require("dojo.collections.*");
dojo.require("dojo.fx.*");
dojo.require("dojo.widget.html.DatePicker");
dojo.require("dojo.widget.html.TimePicker");
awl.widget.DateSelect=function(){
dojo.widget.HtmlWidget.call(this);
this.templateString="<div class=\"awlDateSelectContainer\">\n	  <div class=\"awlDateSelectInputContainer\" dojoAttachPoint=\"_textFieldContainer\">\n	  <span dojoAttachPoint=\"_textFieldLabel\" class=\"awlDateSelectFieldLabel\"></span>\n	  <input type=\"text\" value=\"mm/dd/yyyy\"\n		 dojoAttachPoint=\"_textFieldDate\" \n		 dojoAttachEvent=\"onMousedown: showSelector; onkeypress: showSelector;\" \n		 class=\"awlDateSelectTextField awlDateSelectDateField\" />\n	  <input type=\"text\" value=\"hh:mm\"\n		 dojoAttachPoint=\"_textFieldTime\" \n		 dojoAttachEvent=\"onMousedown: showSelector; onkeypress: showSelector;\" \n		 class=\"awlDateSelectTextField awlDateSelectTimeField\" />\n	  </div>\n	  <div dojoAttachPoint=\"_popupContainerSelector\" class=\"awlDateSelectPopupContainer\">\n\n		  <table dojoAttachPoint=\"_popupSelector\" \n				 cellpadding=\"0\" \n				 cellspacing=\"0\" \n				 border=\"0\" >\n		  <tr>\n			  <td align=\"center\" valign=\"top\" width=\"180px\">\n			  <div dojoAttachPoint=\"_datePickerNode\" class=\"awlDateSelectPopupCalendar\"></div>	\n			  </td>\n			  <td align=\"left\" valign=\"top\">\n			  <div dojoAttachPoint=\"_timePickerNode\" class=\"timepicker\"></div>\n			  </td>\n		  </tr>\n		  <tr>\n			  <td colspan=\"2\" class=\"awlDateSelectClose\" align=\"right\">\n			  <input type=\"button\" value=\"OK\" \n			  		class=\"awlDateSelectButton\"\n					dojoAttachEvent=\"onClick: onCloseSelector;\"/>\n			  <input type=\"button\" value=\"Cancel\" \n			  		class=\"awlDateSelectButton\"\n					dojoAttachEvent=\"onClick: onCancelSelector;\"/>\n			  </td>\n		  </tr>\n		  </table>\n\n	  </div>\n</div>";
this.templateCssPath=dojo.uri.dojoUri("../awl/widget/templates/HtmlDateSelect.css");
this.widgetType="DateSelect";
this.debug=false;
this.dateValue="";
this.labelString="Enter Date:";
this.minDateValue="";
this.maxDateValue="";
this.beforeValidDateMsg="Out of bounds.";
this.afterValidDateMsg="Out of bounds.";
this.minDate=null;
this.maxDate=null;
this._popupContainerSelector=null;
this._popupSelector=null;
this._datePickerNode=null;
this._timePickerNode=null;
this.datePicker=null;
this.timePicker=null;
this._textFieldDate=null;
this._textFieldTime=null;
this._textFieldLabel=null;
this._textFieldContainer=null;
this._selectVisible=false;
this._validateDisabled=false;
this.fillInTemplate=function(){
this.minDate=(this.minDateValue==="")?null:new Date(eval(this.minDateValue));
this.maxDate=(this.maxDateValue==="")?null:new Date(eval(this.maxDateValue));
this.storedDateTime=(this.dateValue==="")?new Date():new Date(eval(this.dateValue));
this.roundTime(this.storedDateTime,"up");
this.roundTime(this.maxDate,"up");
this.roundTime(this.minDate,"down");
if(this.debug){
alert("Date="+this.storedDateTime.toString()+" \nLast="+this.minDate.toString());
}
this.updateDateField(this.storedDateTime);
this.updateTimeField(this.storedDateTime);
this.datePicker=dojo.widget.createWidget("datepicker",{},this._datePickerNode,"last");
this.datePicker.decrementMonthImageNode.src=dojo.uri.dojoUri("../awl/widget/templates/images/awlDecrementMonth.gif");
this.datePicker.incrementMonthImageNode.src=dojo.uri.dojoUri("../awl/widget/templates/images/awlIncrementMonth.gif");
this.updateDatePicker(this.storedDateTime);
dojo.event.connect(this.datePicker,"onSetDate",this,"validateDate");
this.timePicker=dojo.widget.createWidget("timepicker",{},this._timePickerNode,"last");
this.timePicker.anyTimeContainerNode.innerHTML="Set Current Time";
var td=this.timePicker.anyTimeContainerNode.parentNode;
td.colSpan="3";
td=td.previousSibling;
while(td!==null){
if(td.nodeType==1){
td.parentNode.removeChild(td);
break;
}
td=td.previousSibling;
}
dojo.event.connect(this.timePicker,"onSetSelectedAnyTime",this,"onSetCurrentTime");
dojo.event.connect(this.timePicker,"onSetTime",this,"validateTime");
this.updateTimePicker(this.storedDateTime);
this._initSelector();
};
this.postCreate=function(){
this._initTextInputControl();
};
this._initTextInputControl=function(){
this._textFieldLabel.innerHTML=this.labelString;
this._sizeTextInputContainer();
};
this._sizeTextInputContainer=function(){
this._textFieldContainer.style.width="235px";
};
this.updateTimePicker=function(_93a){
this._validateDisabled=true;
var _93b=this.timePicker.toRfcDateTime(_93a);
this.timePicker.setDateTime(_93b);
this.timePicker.fillInTemplate();
this._validateDisabled=false;
};
this.validateTime=function(evt){
this.validateSelection("Time");
};
this.onSetCurrentTime=function(evt){
var _93e=new Date();
this.updateTimePicker(_93e);
this.updateDatePicker(_93e);
this.validateTime();
};
this.updateDatePicker=function(_93f){
this._validateDisabled=true;
var _940=this.datePicker.toRfcDate(_93f);
this.datePicker.setDate(_940);
this.datePicker.fillInTemplate();
this._validateDisabled=false;
};
this.validateDate=function(evt){
this.validateSelection("Date");
};
this.updateDateField=function(_942){
this._textFieldDate.value=this.formatDate(_942);
};
this.formatDate=function(_943){
var day=_943.getDate();
var _945=_943.getMonth()+1;
var year=_943.getYear();
if(year<2000){
year+=1900;
}
if(day<=9){
day="0"+day;
}
if(_945<=9){
_945="0"+_945;
}
var _947=_945+"/"+day+"/"+year;
return _947;
};
this.updateTimeField=function(_948){
this._textFieldTime.value=this.formatTime(_948);
};
this.getAdjustedHours=function(_949){
var _94a=(new Date()).getTimezoneOffset();
var _94b=_949.getTimezoneOffset();
var _94c=(_94a-_94b)/60;
var _94d=_949.getHours();
_94d=_94d-_94c;
dojo.debug("tzCurrent:"+_94a+" tzDate:"+_94b+" hoursOrig:"+_949.getHours()+" hoursMod:"+_94d);
return (_94d);
};
this.formatTime=function(_94e){
var hour=this.getAdjustedHours(_94e);
var min=_94e.getMinutes();
var ampm="";
ampm=(hour<12)?"AM":"PM";
if(hour===0){
hour=12;
}
if(hour>12){
hour=hour-12;
}
min=min+"";
if(min.length==1){
min="0"+min;
}
var _952=hour+":"+min+" "+ampm;
return _952;
};
this._origX=0;
this._origY=0;
this._initSelector=function(){
dojo.style.setOpacity(this._popupContainerSelector,0);
this._popupContainerSelector.style.display="none";
};
this.onCloseSelector=function(evt){
this.updateStoredDateTime();
this.hideSelector();
};
this.onCancelSelector=function(evt){
this.hideSelector();
this.updateTimePicker(this.storedDateTime);
this.updateDatePicker(this.storedDateTime);
};
this.showSelector=function(){
if(!this._selectVisible){
dojo.fx.fadeShow(this._popupContainerSelector,200);
this._popupContainerSelector.style.zIndex="99999";
this._popupSelector.style.zIndex="99999";
this._selectVisible=true;
this.positionSelector();
this._textFieldTime.disabled="disabled";
this._textFieldDate.disabled="disabled";
}
};
this.hideSelector=function(){
dojo.fx.fadeHide(this._popupContainerSelector,200,dojo.lang.hitch(this,this._restorePostion));
this._selectVisible=false;
this._restorePostion(this._popupContainerSelector);
this._textFieldTime.disabled="";
this._textFieldDate.disabled="";
};
this._savePosition=function(x,y){
this._origX=x;
this._origY=y;
};
this._restorePostion=function(node){
node.style.left=this._origX+"px";
this.restoreScrollPosition();
};
this.positionSelector=function(){
var node=this._popupContainerSelector;
var _959=10;
var _95a=25;
var xAbs=dojo.style.totalOffsetLeft(node,false);
var yAbs=dojo.style.totalOffsetTop(node,false);
var _95d=dojo.style.getPixelValue(node,"left");
var _95e=dojo.style.getPixelValue(node,"top");
var _95f=dojo.style.getOuterHeight(node);
var _960=dojo.style.getOuterWidth(node);
var _961=dojo.html.getViewportHeight();
var _962=dojo.html.getViewportWidth();
var _963=0;
this._savePosition(_95d,_95e);
this.saveScrollPosition();
if(yAbs+_95f>_961-_95a){
var _964=_95f-(_961-yAbs)+_95a;
document.documentElement.scrollTop=document.documentElement.scrollTop+_964;
}
if(xAbs+_960>_962-_959){
xAbsNew=(_962-_960-_959);
_963=xAbs-xAbsNew;
}
node.style.left=(_95d-_963)+"px";
};
this.saveScrollPosition=function(){
this._savedScrollPos=dojo.html.getScrollOffset();
};
this.restoreScrollPosition=function(){
if(this._savedScrollPos!==undefined){
document.documentElement.scrollTop=this._savedScrollPos.y;
document.documentElement.scrollLeft=this._savedScrollPos.x;
}
};
this.validateSelection=function(str1){
if(!this._validateDisabled){
var _966=this.currentlySelectedDate();
if(this.minDate!==null){
if(_966.valueOf()<this.minDate.valueOf()){
alert(str1+" not valid.\n"+this.beforeValidDateMsg);
this._validateDisabled=true;
this.updateDatePicker(this.minDate);
this.updateTimePicker(this.minDate);
this._validateDisabled=false;
}
}
var _967=(this.maxDate===null)?new Date():this.maxDate;
if(_966.valueOf()>_967.valueOf()){
alert(str1+" is not valid.\n"+this.afterValidDateMsg);
this._validateDisabled=true;
this.updateDatePicker(_967);
this.updateTimePicker(_967);
this._validateDisabled=false;
}
}
};
this.setMaxDate=function(_968){
this.maxDate=new Date(_968);
};
this.setMinDate=function(_969){
this.minDate=new Date(_969);
};
this.getStoredDateTime=function(){
return (this.storedDateTime.valueOf());
};
this.currentlySelectedDate=function(){
var _96a;
var _96b=this.datePicker.storedDate;
jsDate=this.datePicker.fromRfcDate(_96b);
_96b=this.timePicker.storedTime;
jsTime=this.timePicker.fromRfcDateTime(_96b);
_96a=new Date(jsDate.valueOf());
_96a.setHours(jsTime.getHours());
_96a.setMinutes(jsTime.getMinutes());
return (_96a);
};
this.updateStoredDateTime=function(_96c,_96d,_96e){
if(!_96c){
this.storedDateTime=this.currentlySelectedDate();
}else{
this.storedDateTime=_96c;
}
if(_96e!==undefined){
this.roundTime(this.storedDateTime,_96e);
}
if(this.debug){
alert("New storedDateTime: "+this.storedDateTime.toString()+"("+this.storedDateTime.valueOf()+")");
}
this.updateDateField(this.storedDateTime);
this.updateTimeField(this.storedDateTime);
this.updateTimePicker(this.storedDateTime);
this.updateDatePicker(this.storedDateTime);
if(!_96d){
this.updateListeners(this);
}
};
this.updateListeners=function(_96f){
};
this.roundTime=function(_970,_971){
if(_970===null){
return;
}
var _972=_970.getMinutes();
_970.setMilliseconds(0);
_970.setSeconds(0);
if(_971=="up"){
minToNextFiveMinInterval=(5-(_972%5));
_970.setMinutes(_972+minToNextFiveMinInterval);
}else{
if(_971=="down"){
minToNextFiveMinInterval=(_972%5);
_970.setMinutes(_972-minToNextFiveMinInterval);
}else{
alert("ERROR: DateSelect: roundTime: invalid direction");
}
}
};
};
dojo.inherits(awl.widget.DateSelect,dojo.widget.HtmlWidget);
dojo.widget.tags.addParseTreeHandler("dojo:dateSelect");
dojo.provide("awl.widget.ScaleSelect");
dojo.require("dojo.event.*");
dojo.require("dojo.fx.*");
dojo.setModulePrefix("awl","../awl");
dojo.require("awl.*");
awl.widget.ScaleSelect=function(){
dojo.widget.HtmlWidget.call(this);
this.templateString="<div class=\"awlScaleSelectContainer\" dojoAttachPoint=\"_container\">\n	  <label class=\"navLabel asLabel\">\n	  <input dojoAttachPoint=\"_mode\" \n	  		 dojoAttachEvent=\"onClick:_onChangeMode;onKeypress:_submitForm;\" \n			 type=\"checkbox\"\n			 class=\"checkbox\">\n	  Auto-Scale</label>\n        \n        <span dojoAttachPoint=\"_minMaxDiv\" \n			  class=\"awlScaleSelectMinMaxDiv\" \n			  style=\"display:none;background-color:#993366;\" >\n\n		<label class=\"navLabel minLabel\">Min:\n		<input dojoAttachPoint=\"_min\"\n			   dojoAttachEvent=\"onChange:_onChangeMin;onKeypress:_submitForm;onFocus:_selectAll\" \n				class=\"minInputField\" \n				size=\"3\" type=\"text\"> \n		</label>\n        <label class=\"navLabel maxLabel\">Max:\n		<input dojoAttachPoint=\"_max\" \n				dojoAttachEvent=\"onChange:_onChangeMax;onKeypress:_submitForm;onFocus:_selectAll\" \n				class=\"maxInputField\"\n				size=\"3\" type=\"text\">\n		</label>\n\n        </span>\n		\n</div>";
this.templateCssPath=dojo.uri.dojoUri("../awl/widget/templates/HtmlScaleSelect.css");
this.widgetType="ScaleSelect";
this.Strings={MIN:"min",MAX:"max",ERR_NAN:"Must be a valid number.",ERR_OVERMAX:"Must be less than Max value.",ERR_UNDERMIN:"Must be greater than Min value."};
this.defaultMin="";
this.defaultMax="";
this.autoScaleFlag=true;
this._mode=null;
this._min=null;
this._max=null;
this._minMaxDiv=null;
this._container=null;
this._selectedMode=null;
this._visible=true;
this.fillInTemplate=function(){
this._registerExternalEvents();
};
this.postCreate=function(){
this._min.value=this.defaultMin;
this._max.value=this.defaultMax;
this.setMode(this.autoScaleFlag);
this._setResetValues();
};
this._setResetValues=function(){
this._maxChanged=this._minChanged=false;
this._minResetValue=this._min.value;
this._maxResetValue=this._max.value;
};
this.setMode=function(_973){
this._mode.checked=_973;
this._toggleMinMaxDiv();
};
this.isAutoScale=function(){
return (this._mode.checked);
};
this._toggleMinMaxDiv=function(){
if(this._mode.checked){
dojo.fx.fadeHide(this._minMaxDiv,100,this._notifyOfHide);
}else{
this._notifyOfShow();
dojo.fx.fadeShow(this._minMaxDiv,100);
}
this._notifyModeListeners(this._mode.checked);
};
this.getMin=function(){
return (this._min.value);
};
this.setMin=function(_974){
this._min.value=_974;
this._minResetValue=this._min.value;
};
this._resetMin=function(){
this._minChanged=false;
this._min.value=this._minResetValue;
};
this._validateMin=function(){
if(isNaN(this._min.value)){
return (1);
}
if(this.getMax()===""){
return (0);
}
if(eval(this._min.value)>=(this.getMax())){
return (2);
}
return (0);
};
this.getMax=function(){
return (this._max.value);
};
this.setMax=function(_975){
this._max.value=_975;
this._maxResetValue=this._max.value;
};
this._resetMax=function(){
this._maxChanged=false;
this._max.value=this._maxResetValue;
};
this._validateMax=function(){
if(isNaN(this._max.value)){
return (1);
}
if(this.getMin()===""){
return (0);
}
if(eval(this._max.value)<=(this.getMin())){
return (3);
}
return (0);
};
this._onChangeMin=function(evt){
this._min.value=evt.target.value;
this._minChanged=true;
};
this._onChangeMax=function(evt){
this._max.value=evt.target.value;
this._maxChanged=true;
};
this._onChangeMode=function(){
this._toggleMinMaxDiv();
};
this._advanceFocus=function(evt){
awl.common.focusNodeOnReturn(this._max,evt);
};
this._submitForm=function(evt){
if(awl.common.isKey(13,evt)){
this._requestData();
}
};
this._selectAll=function(evt){
evt.target.select();
};
this._registerExternalEvents=function(){
dojo.event.topic.registerPublisher("/onMinMaxHide",this,this._notifyOfHide);
dojo.event.topic.registerPublisher("/onMinMaxShow",this,this._notifyOfShow);
dojo.event.topic.registerPublisher("/onScaleModeChange",this,this._notifyModeListeners);
dojo.event.topic.registerPublisher("/requestNavDrawerOpen",this,this._requestOpenDrawer);
dojo.event.topic.subscribe("/requestScaleFocus",this,this._onRequestScaleFocus);
dojo.event.topic.registerPublisher("/requestNavDrawerClose",this,this._requestCloseDrawer);
dojo.event.topic.registerPublisher("/loadRequest",this,this._requestData);
};
this._notifyOfHide=function(evt){
dojo.debug(this.widgetType+": Hide notify sent. (/onMinMaxHide)");
};
this._notifyOfShow=function(evt){
dojo.debug(this.widgetType+": Show notify sent. (/onMinMaxShow)");
};
this._notifyModeListeners=function(_97d){
dojo.debug(this.widgetType+": Notifying node listeners. (/onScaleModeChange)");
};
this._onRequestScaleFocus=function(){
dojo.debug(this.widgetType+": Recived scale focus request. (/requestScaleFocus)");
if(!this.visible){
this._requestOpenDrawer();
}
if(this.isAutoScale()){
this._mode.focus();
}else{
this._min.focus();
this._min.select();
}
};
this._requestOpenDrawer=function(){
dojo.debug(this.widgetType,": Request NavBar drawer open. (/onScaleModeChange)");
};
this._requestCloseDrawer=function(){
dojo.debug(this.widgetType,": Request NavBar drawer close. (/onScaleModeChange)");
};
this._requestData=function(_97e,_97f,_980){
dojo.debug("ExternalEvent:","Sent /loadRequest ",_97e," ",_97f," ",_980);
};
this.validate=function(){
var err;
if(this._minChanged){
err=this._validateMin();
if(err!==0){
this._displayError("Min Value",err);
this._resetMin();
return (false);
}
}
if(this._maxChanged){
err=this._validateMax();
if(err!==0){
this._displayError("Max Value",err);
this._resetMax();
return (false);
}
}
this._setResetValues();
return (true);
};
this._displayError=function(_982,_983){
var _984="unknown error";
switch(_983){
case 1:
_984=this.Strings.ERR_NAN;
break;
case 2:
_984=this.Strings.ERR_OVERMAX;
break;
case 3:
_984=this.Strings.ERR_UNDERMIN;
break;
}
alert(_982+": "+_984);
};
};
dojo.inherits(awl.widget.ScaleSelect,dojo.widget.HtmlWidget);
dojo.widget.tags.addParseTreeHandler("dojo:scaleselect");
dojo.provide("awl.widget.DataNavBar");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.collections.*");
dojo.require("dojo.fx.*");
dojo.require("dojo.validate");
dojo.require("dojo.style");
dojo.require("dojo.widget.html.DatePicker");
dojo.setModulePrefix("awl.widget","../awl/widget");
dojo.widget.manager.registerWidgetPackage("awl.widget");
dojo.require("awl.widget.DateSelect");
dojo.require("awl.widget.ScaleSelect");
dojo.require("awl.*");
var DurationCount={HOUR:24,DAY:31,WEEK:12,MONTH:3};
var DurationUnits=["Hour","Day","Week","Month","Custom"];
var AwlDataNavBarStrings={DRAWER_CONTROL_TOOLTIP:"Click here to set custom date range.",REDRAW_BUTTON:"Reload",ERR_DATE1_BEFORE_VAILD:"\tBeyond first available data point.\n\tSetting to first available date/time.",ERR_DATE1_AFTER_VAILD:"Exceeds 'Last Date'.\nSetting to 1 hour before 'Last Date'.",ERR_DATE2_BEFORE_VAILD:"This date cannot preceed 'First Date'.",ERR_DATE2_AFTER_VAILD:"\n\tThis date is in the future.\n\tSetting to the current date/time."};
awl.widget.DataNavBar=function(){
dojo.widget.HtmlWidget.call(this);
this.templateString="<div class=\"awlDataNavBarContainer\">\n	<div class=\"navBasic\" >\n	<span class=\"leftEdge\"></span>\n	<span class=\"middleBar\">\n		<span class=\"awlNavLeft\">\n		<span class=\"navButtons\">\n		<a class=\"navLink\" href=\"javascript:void(0)\" \n			dojoAttachEvent=\"onClick: getPrev;\" \n			dojoAttachPoint=\"_prevButton\">&nbsp;</a>\n		<a class=\"navLink\" href=\"javascript:void(0)\" \n			dojoAttachEvent=\"onClick: getLatest;\"\n			dojoAttachPoint=\"_latestButton\">&nbsp;</a>\n		<a class=\"navLink\" href=\"javascript:void(0)\" \n			dojoAttachEvent=\"onClick: getNext;\"\n			dojoAttachPoint=\"_nextButton\">&nbsp;</a>\n		</span>\n		<span class=\"navStatus\" dojoAttachPoint=\"_statusMsg\"></span>\n		</span>\n		<span class=\"navTimescale\">\n		<table border=\"0\" cellpadding=\"3\" cellspacing=\"0\">	\n			<tr>\n			<td><label class=\"navLabel\">Duration:</label></td>\n			<td>\n			  <select dojoAttachPoint=\"duration\" \n						dojoAttachEvent=\"onChange: changedDuration;\"\n						class=\"duration\" >\n			  </select>\n			  <input type=\"text\" \n			  		 style=\"display:none;\"\n					 disabled=\"true\"\n			  			dojoAttachPoint=\"durationCustom\" \n						dojoAttachEvent=\"onChange: changedCustomDuration;onfocus: onCustomDurationFocus\"\n						class=\"durationCustom\" >\n			  </input>\n			</td>\n			<td>\n				<select dojoAttachPoint=\"durationUnits\"\n						dojoAttachEvent=\"onChange: changedDurationUnits;\" \n						class=\"durationUnits\" >\n					 <option value=\"0\">Hour</option> \n					 <option value=\"1\">Day</option>\n					 <option value=\"2\">Week</option>\n					 <option value=\"3\">Month</option>\n					 <option value=\"4\">Custom</option>\n				</select>\n			</td>\n			<td><input type=\"button\" value=\"\" \n						dojoAttachPoint=\"_redrawButton\"\n						dojoAttachEvent=\"onClick: redrawGraph;\"></td>\n			</tr>\n		</table>\n		</span>\n	</span>\n	<span class=\"rightEdge\"></span>\n    </div>\n	\n	<div class=\"navAdvanced\" dojoAttachPoint=\"drawerDiv\" >\n	\n	 <div class=\"scalingVert\" dojoAttachPoint=\"_vertScaleDiv\">\n	 <fieldset class=\"vertFieldset\" dojoAttachPoint=\"_fs1\">\n	 	<legend class=\"fieldsetLabel\">Vertical Scaling</legend>\n		<div class=\"vertFieldsetIE\" dojoAttachPoint=\"_fsVertIE\">\n		<div dojoAttachPoint=\"_yaxisScaleNode\"></div>\n		</div>\n	 </fieldset>\n	 </div>\n	\n	<div class=\"scalingHoriz\" dojoAttachPoint=\"_horizScaleDiv\">\n	 <fieldset class=\"horizFieldset\" dojoAttachPoint=\"_fs2\">\n	 	<legend class=\"fieldsetLabel\">Custom Date Range</legend>\n		<div class=\"horizFieldsetIE\" dojoAttachPoint=\"_fs2ie\">\n		<div dojoAttachPoint=\"_dateSelect1Node\" \n		     class=\"navDateSelect1 navDateSelect\"></div>\n		<div dojoAttachPoint=\"_dateSelect2Node\" \n		     class=\"navDateSelect2 navDateSelect\"></div>\n		</div>\n	 </fieldset>\n	 </div>	\n	</div>\n	\n	<div class=\"drawerControl\" \n		 dojoAttachEvent=\"onClick: toggleDrawer;\" \n		 dojoAttachPoint=\"drawerControl\" >\n		<center>\n		<span style=\"position:relative;\"><img dojoAttachPoint=\"drawerControlImg\" /><div class=\"bubble_tooltip\" dojoAttachPoint=\"toolTip\">\n	<div class=\"bubble_top\"><span></span></div>\n	<div class=\"bubble_middle\"><span dojoAttachPoint=\"toolTipContent\">Loading...</span></div>\n	<div class=\"bubble_bottom\"></div>\n</div></span>\n		</center>\n	</div>\n</div>";
this.templateCssPath=dojo.uri.dojoUri("../awl/widget/templates/HtmlDataNavBar.css");
this.isContainer=true;
this.widgetType="DataNavBar";
this.sensorId=-1;
this.podId=-1;
this.gatewayId=-1;
this.drawerOpen=false;
this.dateRange="24";
this.firstDateAvail="";
this.lastDateAvail="";
this.chartTabLabel="";
this.xmlTestFile="";
this.debug=false;
this.updateChart=true;
this.min="";
this.max="";
this.autoScale=true;
this.level=2;
this.yAxisUnits="";
this._firstDate=null;
this._lastDate=null;
this._tablePagePointCount=0;
this._lastDateValue="";
this._graphData=null;
this.drawerControl=null;
this.drawerControlImg=null;
this.drawerDiv=null;
this.duration=null;
this.durationUnits=null;
this.durationCustom=null;
this._redrawButton=null;
this._prevButton=null;
this._latestButton=null;
this._nextButton=null;
this._statusMsg=null;
this.dataNavObject=this;
this.fillInTemplate=function(){
if(!this._validatePublicVars()){
return false;
}
this.createYaxisScale();
this._initDurationCookies();
this._readDurationCookies();
this.createDatePickers();
this._initDurationControl();
this._initDrawerControl();
this._redrawButton.value=AwlDataNavBarStrings.REDRAW_BUTTON;
if(!this.drawerOpen){
this._closeDrawer();
}
if(this.sensorId==-1){
alert("ERROR: awl.widget.datanavbar: no sensorId defined");
}
if(this.podId==-1){
alert("ERROR: awl.widget.datanavbar: no podId defined");
}
if(this.gatewayId==-1){
alert("ERROR: awl.widget.datanavbar: no gatewayId defined");
}
if(this.chartTabLabel!==""){
this.attachTabEvent();
}
};
this.postCreate=function(){
this._registerExternalEvents();
this._setYaxisScaling();
if(this.debug){
dojo.debug("firstDateAvail: "+Date(eval(this.firstDateAvail)).toString());
}
dojo.lang.setTimeout(this,this.getLatest,500);
};
this._validatePublicVars=function(){
if(!dojo.validate.isRealNumber(this.dateRange)){
alert("ERROR: datanavbar: dateRange parameter must be a valid number");
return (false);
}
return (true);
};
this.redrawGraph=function(){
this.loadData(this._dateSelectFirst.getStoredDateTime(),this._dateSelectLast.getStoredDateTime());
return false;
};
this.getPrev=function(){
this._lastDateValue=this._dateSelectFirst.getStoredDateTime();
this._initDates();
this.redrawGraph();
};
this.getNext=function(){
this._lastDateValue=this._dateSelectLast.getStoredDateTime()+this.dateRange*3600000;
this._initDates();
this.redrawGraph();
};
this.getLatest=function(){
this._lastDateValue=this.lastDateAvail;
this._initDates();
this.redrawGraph();
};
this._yaxisScaleNode=null;
this._vertScaleDiv=null;
this._horizScaleDiv=null;
this.createYaxisScale=function(){
this._scaling=dojo.widget.createWidget("scaleSelect",{},this._yaxisScaleNode,"last");
};
this._setYaxisScaling=function(){
this._scaling.setMin(this.min);
this._scaling.setMax(this.max);
this._scaling.setMode(this.autoScale);
};
this.showScaleWidget=function(){
this._vertScaleDiv.style.display="block";
};
this.hideScaleWidget=function(){
this._vertScaleDiv.style.display="none";
this._fs2.style.height="22px";
this._fs2.style.width="645px";
this._fs2ie.style.height="22px";
this._fs2.style.width="645px";
this.drawerDiv.style.height=this.DrawerVal.smallHeight+"px";
this._drawerHeight=this.DrawerVal.smallHeight;
this._horizScaleDiv.style.left="0px";
this._dateSelect1Node.style.left="0px";
this._dateSelect2Node.style.left="417px";
};
this._dateSelect1Node=null;
this._dateSelect2Node=null;
this._dateSelectFirst=null;
this._dateSelectLast=null;
this._disableOnSetEvent=false;
this.createDatePickers=function(){
this._dateSelectFirst=dojo.widget.createWidget("dateselect",{labelString:"First date:",minDateValue:this.firstDateAvail,beforeValidDateMsg:AwlDataNavBarStrings.ERR_DATE1_BEFORE_VAILD,afterValidDateMsg:AwlDataNavBarStrings.ERR_DATE1_AFTER_VAILD},this._dateSelect1Node,"last");
dojo.event.connect(this._dateSelectFirst,"updateListeners",this,"onSetDate");
this._dateSelectLast=dojo.widget.createWidget("dateselect",{labelString:"Last date:",beforeValidDateMsg:AwlDataNavBarStrings.ERR_DATE2_BEFORE_VAILD,afterValidDateMsg:AwlDataNavBarStrings.ERR_DATE2_AFTER_VAILD},this._dateSelect2Node,"last");
dojo.event.connect(this._dateSelectLast,"updateListeners",this,"onSetDate");
this._initDates();
};
this._initDates=function(){
var _985=eval(this.dateRange);
var _986=(this._lastDateValue=="")?new Date():new Date(eval(this._lastDateValue));
var _987=new Date(_986.valueOf()-this.dateRange*3600000);
this._disableOnSetEvent=true;
this._dateSelectLast.updateStoredDateTime(_986,false);
this.updateDateSelectLimits(this._dateSelectLast);
this._dateSelectFirst.updateStoredDateTime(_987,false);
this.updateDateSelectLimits(this._dateSelectFirst);
this._disableOnSetEvent=false;
};
this.updateDateSelectLimits=function(_988){
var _989=3600000;
if(_988===this._dateSelectLast){
var _98a=this._dateSelectLast.getStoredDateTime();
this._dateSelectFirst.setMaxDate(_98a-_989);
}
if(_988===this._dateSelectFirst){
var _98a=this._dateSelectFirst.getStoredDateTime();
this._dateSelectLast.setMinDate(_98a+_989);
}
};
this.onSetDate=function(_98b){
if(!this._disableOnSetEvent){
this.updateDateSelectLimits(_98b);
this.setDurationHours();
}
};
this._currentDuration=1;
this._currentDurationUnits="Day";
this.getDurationHours=function(){
var _98c=this.calcDurationMultiplier(this._currentDurationUnits);
return (this._currentDuration*_98c);
};
this.setDurationHours=function(_98d){
if(_98d==undefined){
_98d=(this._dateSelectLast.getStoredDateTime()-this._dateSelectFirst.getStoredDateTime())/3600000;
}
this.dateRange=_98d;
if((_98d%672==0)&&(_98d/672<=DurationCount.MONTH)){
this._currentDurationUnits="Month";
this._currentDuration=_98d/672;
}else{
if((_98d%168==0)&&(_98d/168<=DurationCount.WEEK)){
this._currentDurationUnits="Week";
this._currentDuration=_98d/168;
}else{
if((_98d%24==0)&&(_98d/24<=DurationCount.DAY)){
this._currentDurationUnits="Day";
this._currentDuration=_98d/24;
}else{
if(_98d<=DurationCount.HOUR){
this._currentDurationUnits="Hour";
this._currentDuration=_98d;
}else{
this._currentDurationUnits="Custom";
this._currentDuration=_98d;
}
}
}
}
this.setDurationUnits();
this.toggleDurationControl();
this.fillDurationList();
this.setDuration();
this.setCustomDuration();
};
this._initDurationControl=function(){
this._durationHash=new dojo.collections.Dictionary();
this._durationHash.add("Hour",DurationCount.HOUR);
this._durationHash.add("Day",DurationCount.DAY);
this._durationHash.add("Week",DurationCount.WEEK);
this._durationHash.add("Month",DurationCount.MONTH);
this._initDurationUnitsList();
this.setDurationUnits();
this.toggleDurationControl();
this.fillDurationList();
this.setDuration();
this.setCustomDuration();
};
this._initDurationCookies=function(){
this.strCookieDuration=this.gatewayId+"_"+this.podId+"_"+this.sensorId+"_d";
this.strCookieDurationUnits=this.gatewayId+"_"+this.podId+"_"+this.sensorId+"_dU";
};
this._readDurationCookies=function(){
this._currentDuration=(awl.common.getCookie(this.strCookieDuration))?awl.common.getCookie(this.strCookieDuration):this._currentDuration;
this._currentDurationUnits=(awl.common.getCookie(this.strCookieDurationUnits))?awl.common.getCookie(this.strCookieDurationUnits):this._currentDurationUnits;
this.dateRange=this.getDurationHours();
dojo.debug("Read cookies: duration="+this._currentDuration+" units="+this._currentDurationUnits+" RangeHrs="+this.dateRange);
};
this._writeDurationCookies=function(){
awl.common.setCookie(this.strCookieDuration,this._currentDuration);
awl.common.setCookie(this.strCookieDurationUnits,this._currentDurationUnits);
dojo.debug("Wrote cookies: duration="+this._currentDuration+" units="+this._currentDurationUnits);
};
this.calcDurationMultiplier=function(_98e){
var _98f=1;
if(_98e=="Day"){
_98f=24;
}else{
if(_98e=="Week"){
_98f=168;
}else{
if(_98e=="Month"){
_98f=720;
}
}
}
return (_98f);
};
this.toggleDurationControl=function(){
if(this._currentDurationUnits!="Custom"){
this.durationCustom.style.display="none";
this.duration.style.display="inline";
}else{
this.duration.style.display="none";
this.durationCustom.style.display="inline";
}
};
this.changedDuration=function(){
this._currentDuration=this.duration.options[this.duration.selectedIndex].value;
this.modifyDurationUnits();
this.dateRange=this.getDurationHours();
this._initDates();
};
this.setDuration=function(){
var len=this.duration.length;
for(i=0;i<len;i++){
var _991=this._currentDuration+"";
if(_991==this.duration.options[i].text){
this.duration.selectedIndex=i;
break;
}
}
this.modifyDurationUnits();
};
this.modifyDuration=function(){
var _992=this.duration.selectedIndex;
this.fillDurationList();
if(_992>=this.duration.options.length){
_992=this.duration.options.length-1;
}
if(_992<0){
_992=0;
}
this.duration.selectedIndex=_992;
this._currentDuration=this.duration.options[this.duration.selectedIndex].value;
this.dateRange=this.getDurationHours();
};
this.limitDuration=function(_993,_994,_995,_996){
var _997=this.calcDurationMultiplier(_994);
var _998=eval(_996);
if(_998<=0){
_998=new Date();
}
var _999=eval(_995);
var _99a=_998-_999;
var _99b=_99a/3600000;
if(_99b<24){
_99b=24;
}
var _99c=Math.ceil(_99b/_997);
if(_99c<_993){
return (_99c);
}else{
return (_993);
}
};
this.fillDurationList=function(){
var _99d=this._currentDurationUnits;
this.duration.options.length=0;
var _99e=this._durationHash.item(this._currentDurationUnits);
if(_99e!=undefined){
var _99f=this.limitDuration(_99e,_99d,this.firstDateAvail,this.lastDateAvail);
for(i=0;i<_99f;i++){
this.duration.options[i]=new Option(i+1,i+1);
}
}
};
this.setCustomDuration=function(){
var _9a0=Math.floor(this.dateRange);
var _9a1=this.calcDurationMultiplier(this._currentDurationUnits);
this._currentDuration=eval(_9a0)/_9a1+"";
var _9a2=(_9a0!=1)?"Hrs":"Hr";
this.durationCustom.value=_9a0+_9a2;
};
this._addPlural=function(str){
if(str.charAt(str.length-1)!="s"){
str=str+"s";
}
return (str);
};
this._removePlural=function(str){
if(str.charAt(str.length-1)=="s"){
str=str.substr(0,str.length-1);
}
return (str);
};
this.changedDurationUnits=function(){
this._currentDurationUnits=this.durationUnits.options[this.durationUnits.selectedIndex].text;
this._currentDurationUnits=this._removePlural(this._currentDurationUnits);
this.toggleDurationControl();
if(this._currentDurationUnits!="Custom"){
this.hideToolTip();
this.modifyDuration();
}else{
this.showToolTip();
this.setCustomDuration();
this.setDuration();
}
this.dateRange=this.getDurationHours();
this._initDates();
};
this.setDurationUnits=function(){
var _9a5=this._currentDurationUnits;
var len=this.durationUnits.length;
for(i=0;i<len;i++){
var _9a7=this._removePlural(this.durationUnits.options[i].text);
if(_9a7==_9a5){
this.durationUnits.selectedIndex=i;
break;
}
}
};
this.modifyDurationUnits=function(){
var len=this.durationUnits.length;
for(i=0;i<len;i++){
var str=this.durationUnits.options[i].text;
if(str!="Custom"){
if(this._currentDuration==1){
this.durationUnits.options[i].text=this._removePlural(str);
}else{
this.durationUnits.options[i].text=this._addPlural(str);
}
}
}
};
this._initDurationUnitsList=function(){
var len=this.durationUnits.length;
for(i=len-1;i>=0;i--){
var str=this.durationUnits.options[i].text;
str=this._removePlural(str);
var _9ac=this.limitDuration(1,str,this.firstDateAvail,this.lastDateAvail);
if(!_9ac){
this.durationUnits.remove(i);
}
}
};
this.DrawerVal={smallHeight:45,bigHeight:83};
this._fs1=null;
this._fs2=null;
this._fsVertIE=null;
this._fs2ie=null;
this._drawerHeight=this.DrawerVal.smallHeight;
this._initDrawerControl=function(){
this.drawerControl.style.display="block";
this.drawerControlImg.src=dojo.uri.dojoUri("../awl/widget/templates/images/less.gif");
this.drawerControlImg.alt="Close Advanced Drawer";
};
this._closeDrawer=function(){
dojo.fx.html.wipeOut(this.drawerDiv,200,dojo.lang.hitch(this,this.scrollRestoreForDrawer));
dojo.fx.fadeHide(this._dateSelect1Node,100);
dojo.fx.fadeHide(this._dateSelect2Node,100);
this.drawerControlImg.src=dojo.uri.dojoUri("../awl/widget/templates/images/more.gif");
this.drawerControlImg.alt="Open Advanced Drawer";
this.drawerOpen=false;
this.duration.disabled=false;
this.durationUnits.disabled=false;
this._scaling.visible=false;
};
this._openDrawer=function(){
this.hideToolTip();
this._drawerScrollPos=this.saveScrollPosition();
this._dateSelectFirst.hideSelector();
this._dateSelectLast.hideSelector();
dojo.fx.html.wipeInToHeight(this.drawerDiv,200,this._drawerHeight,dojo.lang.hitch(this,this.scrollForDrawer));
this.drawerDiv.style.overflow="visible";
dojo.fx.fadeShow(this._dateSelect1Node,600);
dojo.fx.fadeShow(this._dateSelect2Node,600);
dojo.fx.fadeShow(this._scaling._container,600);
dojo.fx.fadeShow(this._fs1,600);
dojo.fx.fadeShow(this._fs2,600);
this.drawerControlImg.src=dojo.uri.dojoUri("../awl/widget/templates/images/less.gif");
this.drawerControlImg.alt="Close Advanced Drawer";
this.drawerOpen=true;
this.duration.disabled=true;
this.durationUnits.disabled=true;
this._scaling.visible=true;
};
this.toggleDrawer=function(){
if(this.drawerOpen){
this._closeDrawer();
}else{
this._openDrawer();
}
};
this._shrinkScaleDiv=function(){
this._fs1.style.height="22px";
this._fs2.style.height="22px";
this._fsVertIE.style.height="22px";
this._yaxisScaleNode.style.height="22px";
this._fs2ie.style.height="22px";
this.drawerDiv.style.height=this.DrawerVal.smallHeight+"px";
this._drawerHeight=this.DrawerVal.smallHeight;
this.restoreScrollPosition(this._growScrollPos);
};
this._growScaleDiv=function(){
this._fs1.style.height="60px";
this._fs2.style.height="60px";
this._fsVertIE.style.height="60px";
this._yaxisScaleNode.style.height="55px";
this._fs2ie.style.height="60px";
this.drawerDiv.style.height=this.DrawerVal.bigHeight+"px";
this._drawerHeight=this.DrawerVal.bigHeight;
if(this.drawerOpen){
this._growScrollPos=this.saveScrollPosition();
var _9ad=dojo.style.getOuterHeight(this.drawerControl)+10;
this.scrollForDrawer();
}
};
this._drawerScrollPos=null;
this.scrollForDrawer=function(){
var _9ae=dojo.style.getOuterHeight(this.drawerControl)+10;
this._scrollForNode(this.drawerDiv,_9ae);
};
this.scrollRestoreForDrawer=function(){
this.restoreScrollPosition(this._drawerScrollPos);
};
this.toolTip=null;
this.toolTipContent=null;
this.showToolTip=function(e){
if(document.all){
e=event;
}
this.toolTipContent.innerHTML=AwlDataNavBarStrings.DRAWER_CONTROL_TOOLTIP;
dojo.fx.fadeShow(this.toolTip,400);
var node=this.drawerControlImg;
var _9b1=dojo.style.getPixelValue(node,"left");
var _9b2=dojo.style.getPixelValue(node,"top");
var _9b3=_9b1-20;
this.toolTip.style.left=_9b3+"px";
this.toolTip.style.top=_9b2+8+"px";
this._toolTipScroll=this.saveScrollPosition();
this._scrollForNode(this.toolTip,30);
};
this.hideToolTip=function(){
dojo.fx.fadeHide(this.toolTip,400);
this.restoreScrollPosition(this._toolTipScroll);
};
this.saveScrollPosition=function(){
return (dojo.html.getScrollOffset());
};
this.restoreScrollPosition=function(_9b4){
if(_9b4!=undefined){
document.documentElement.scrollTop=_9b4.y;
document.documentElement.scrollLeft=_9b4.x;
}
};
this._scrollForNode=function(node,_9b6){
var yAbs=dojo.style.totalOffsetTop(node,false);
var _9b8=dojo.style.getOuterHeight(node);
_9b8=_9b8+_9b6;
var _9b9=dojo.html.getViewportHeight();
var _9ba=document.documentElement.scrollTop;
if(yAbs+_9b8>(_9b9+_9ba)){
var _9bb=((yAbs+_9b8)-(_9b9+_9ba));
document.documentElement.scrollTop=_9ba+_9bb;
dojo.debug(this.widgetType+": Setting scroll top to "+document.documentElement.scrollTop);
}
};
this.attachTabEvent=function(){
var _9bc=document.getElementsByTagName("li");
var _9bd=null;
for(i=0;i<_9bc.length;i++){
for(j=0;j<_9bc[i].childNodes.length;j++){
var node=_9bc[i].childNodes[j];
if((node.nodeName=="SPAN")&&(node.innerHTML==this.chartTabLabel)){
_9bd=node;
break;
}
}
if(_9bd!==null){
break;
}
}
if(_9bd!==null){
dojo.event.kwConnect({srcObj:_9bd,srcFunc:"onclick",targetObj:this,targetFunc:"onClickChartTab",delay:500});
}
};
this.onClickChartTab=function(evt){
if(this.updateChart){
this.hideFlashChart("GuiWidgetsChart");
this.updateFlashChart("GuiWidgetsChart",this._graphData);
}
};
this.updateFlashChart=function(_9c0,_9c1){
try{
var _9c2=(document[_9c0])?document[_9c0]:document.all[_9c0];
_9c2.SetVariable("_root.dataURL","");
_9c2.SetVariable("_root.isNewData","1");
_9c2.SetVariable("_root.newData",_9c1);
_9c2.TGotoLabel("/","JavaScriptHandler");
_9c2.height=335;
_9c2.width=720;
}
catch(e){
}
};
this.hideFlashChart=function(_9c3){
try{
var _9c4=(document[_9c3])?document[_9c3]:document.all[_9c3];
_9c4.height=0;
_9c4.width=0;
}
catch(e){
}
};
this.updateDataNavbar=function(_9c5){
if(_9c5!==null){
var _9c6=false;
var _9c7=false;
if(this.debug){
dojo.debug(dojo.dom.innerXML(_9c5));
}
var node=dojo.dom.firstElement(_9c5);
if(dojo.dom.isNode(node)){
do{
if(node.nodeName=="hasPrev"){
if(node.firstChild.data=="true"){
_9c6=true;
}else{
_9c6=false;
}
}
if(node.nodeName=="hasNext"){
if(node.firstChild.data=="true"){
_9c7=true;
}else{
_9c7=false;
}
}
if(node.nodeName=="lastAvailTs"){
this._lastDateValue=node.firstChild.data;
this.lastDateAvail=node.firstChild.data;
}
if(node.nodeName=="autoScale"){
if(node.firstChild.data=="true"){
this._scaling.setMode(true);
}else{
this._scaling.setMode(false);
}
}
if(node.nodeName=="manualMin"){
this._scaling.setMin(eval(node.firstChild.data));
}
if(node.nodeName=="manualMax"){
this._scaling.setMax(eval(node.firstChild.data));
}
if(node.nodeName=="yScaleUnits"){
this.yAxisUnits=node.firstChild.data;
}
node=dojo.dom.nextElement(node);
}while(dojo.dom.isNode(node));
}
this._nextButton.innerHTML=(_9c7)?"Next >>":"&nbsp;";
this._latestButton.innerHTML="Latest";
this._prevButton.innerHTML=(_9c6)?"<< Prev":"&nbsp;";
}
};
this.loadDataHandler=function(type,data,evt){
var _9cc=this.dataNavObject;
_9cc.hideServiceLevelWarning();
if(data.hasChildNodes()){
var _9cd=null;
var _9ce=null;
var _9cf=null;
var _9d0=null;
var _9d1=null;
var _9d2=null;
var _9d3="0";
var _9d4=dojo.dom.firstElement(data);
var node=dojo.dom.firstElement(_9d4);
if(dojo.dom.isNode(node)){
do{
if(node.nodeName=="exception"){
_9cc.loadFailedMsg();
return;
}
if(node.nodeName=="graph"){
_9cd=node;
_9cc._graphData=dojo.dom.innerXML(_9cd);
if(_9cc._graphData===undefined){
_9cc._graphData=_9cd.xml;
}
if(_9cc.debug){
alert(_9cc._graphData);
}
}
if(node.nodeName=="pageIndex"){
_9d3=node.firstChild.data;
}
if(node.nodeName=="pageStartData"){
_9cf=node;
}
if(node.nodeName=="completeData"){
_9d0=node;
}
if(node.nodeName=="state_info"){
_9ce=node;
}
if(node.nodeName=="legendData"){
_9d1=node;
}
if(node.nodeName=="sensor_stats"){
_9d2=node;
}
node=dojo.dom.nextElement(node);
}while(dojo.dom.isNode(node));
if((_9cf!==null)||(_9d0!==null)){
_9cc._updateTableListeners(_9cf,_9d0,_9d3);
}
if(_9d1!==null){
_9cc._notifyLegendListeners(_9d1);
}
if(_9d2!=null){
_9cc._notifyStatsListeners(_9d2);
}
if(_9cc.updateChart){
if(_9cd!==null){
_9cc.updateFlashChart("GuiWidgetsChart",_9cc._graphData);
}
}
_9cc.updateDataNavbar(_9ce);
_9cc._statusMsg.innerHTML="";
}
}
if(_9cc.level<2){
_9cc.hideScaleWidget();
}
};
this.loadData=function(_9d6,_9d7,_9d8){
var _9d9=false;
var _9da;
if(!this.sensorId||this.sensorId<0){
alert("ERROR: loadData: invalid sensor id");
}
if(!_9d6||!_9d7){
_9d6="";
_9d7="";
}
if((_9d8)&&(_9d8!==null)){
_9d9=true;
_9da=_9d8+"";
}else{
_9da="-1";
}
if(!this._scaling.isAutoScale()){
var pass=this._scaling.validate();
if(!pass){
return;
}
}
if(this.drawerOpen){
this._closeDrawer();
}
this.showServiceLevelWarning();
this._statusMsg.innerHTML="Loading Data...";
if(!_9d9){
this._notifyOfLoading();
}
var _9dc={url:(this.xmlTestFile=="")?"GuiWidgetsChartService.jsp":this.xmlTestFile,mimetype:"text/xml",preventCache:true,content:{"measurementBeanId":this.sensorId,"podId":this.podId,"startDate":_9d6,"endDate":_9d7,"pointsPerPage":this._tablePagePointCount,"tablePageIndex":_9da,"chartMin":this._scaling.getMin(),"chartMax":this._scaling.getMax(),"autoScaleFlag":this._scaling.isAutoScale(),"yScaleUnit":this.yAxisUnits,"firstAvailTs":this.firstDateAvail},error:this.loadFailedMsg,load:this.loadDataHandler,dataNavObject:this};
dojo.io.bind(_9dc);
};
this.loadFailedMsg=function(type,_9de){
this.dataNavObject._statusMsg.innerHTML="Load Failed.";
this.dataNavObject._statusMsg.style.textDecoration="none";
};
this._registerExternalEvents=function(){
dojo.event.topic.registerPublisher("/preLoadRequest",this,this._sendPreLoadRequest);
dojo.event.topic.subscribe("/preLoadResponse",this,this._handlePreLoadResponse);
dojo.event.topic.registerPublisher("/onDataLoad",this,this._updateTableListeners);
dojo.event.topic.registerPublisher("/onLegendData",this,this._notifyLegendListeners);
dojo.event.topic.registerPublisher("/onStatsData",this,this._notifyStatsListeners);
dojo.event.topic.subscribe("/loadRequest",this,this._onLoadResponse);
dojo.event.topic.registerPublisher("/onLoading",this,this._notifyOfLoading);
dojo.event.topic.subscribe("/onMinMaxHide",this,this._shrinkScaleDiv);
dojo.event.topic.subscribe("/onMinMaxShow",this,this._growScaleDiv);
dojo.event.topic.subscribe("/requestNavDrawerOpen",this,this._onOpenDrawerRequest);
dojo.event.topic.subscribe("/requestNavDrawerClose",this,this._onCloseDrawerRequest);
this._sendPreLoadRequest();
};
this._sendPreLoadRequest=function(){
};
this._handlePreLoadResponse=function(_9df){
this._tablePagePointCount=_9df;
if(this.debug){
dojo.debug("xCount from DataTable: "+this._tablePagePointCount);
}
};
this._notifyOfLoading=function(){
};
this._updateTableListeners=function(_9e0,_9e1,_9e2){
};
this._onLoadResponse=function(_9e3,_9e4,_9e5){
if(_9e3!=null){
this.loadData(_9e3,_9e4,_9e5);
}else{
this.redrawGraph();
}
};
this._notifyLegendListeners=function(_9e6){
};
this._notifyStatsListeners=function(_9e7){
};
this._onOpenDrawerRequest=function(){
this._openDrawer();
};
this._onCloseDrawerRequest=function(){
this._closeDrawer();
};
this.showServiceLevelWarning=function(){
var node=document.getElementById("detailPopup:msg4");
if(node){
node.style.display="block";
}
};
this.hideServiceLevelWarning=function(){
var node=document.getElementById("detailPopup:msg4");
if(node){
node.style.display="none";
}
};
};
dojo.inherits(awl.widget.DataNavBar,dojo.widget.HtmlWidget);
dojo.widget.tags.addParseTreeHandler("dojo:datanavbar");
dojo.provide("awl.widget.DataTable");
dojo.require("dojo.event.*");
dojo.setModulePrefix("awl","../awl");
dojo.require("awl.*");
var Strings={VALUE_HEADER:"Value",TIME_HEADER:"Time"};
awl.widget.DataTable=function(){
dojo.widget.HtmlWidget.call(this);
this.templateString="<div class=\"dataTable\">\n<div class=\"dataTableColumn\" dojoAttachPoint=\"_dataTableContainer\">\n<center>\n<table dojoAttachPoint=\"_dataTable\" class=\"awlDataTable\" cellspacing=\"0\" cellpadding=\"2\" border=\"0\">\n<thead>\n<tr>\n  <th dojoAttachPoint=\"_valueHeader\" class=\"awlDataTableHeader\" colspan=\"2\"></th>\n  <th></th>\n  <th dojoAttachPoint=\"_timeHeader\" class=\"awlDataTableHeader\"></th>\n  <th></th>\n</tr>\n</thead>\n<tbody dojoAttachPoint=\"_tableBody\">\n<tr><td height=\"120\" colspan=\"3\">Loading Data Table...</td></tr>\n</tbody>\n</table>\n</center>\n</div>";
this.templateCssPath=dojo.uri.dojoUri("../awl/widget/templates/HtmlDataTable.css");
this.widgetType="DataTable";
this.xmlTestFile="";
this.pointsAvailable=0;
this.pointsPerPage=10;
this._dataTableContainer=null;
this._dataTable=null;
this._valueHeader=null;
this._timeHeader=null;
this._tableBody=null;
this.xmlDataNode=null;
this.fillInTemplate=function(){
};
this.postCreate=function(){
this._registerExternalEvents();
if(this.xmlTestFile!==""){
awl.common.loadXmlFromFile(this.xmlTestFile,this,this.loadhandler);
}
};
this.updateTable=function(xDoc){
var tr,td,i,oneRecord;
var _9ec=this._tableBody;
if(_9ec===""){
alert("ERROR: DataTable template does not contain a tbody element");
}
if((xDoc===undefined)||(xDoc===null)){
this._fillEmptyTable(_9ec);
return false;
}
this._clearTable();
var data=xDoc.getElementsByTagName("data")[0];
if((data===undefined)||(data.childNodes.length<=0)){
this._fillEmptyTable(_9ec);
return false;
}
var _9ee=xDoc.getElementsByTagName("valuesubtitle")[0];
var _9ef=((_9ee===undefined)||(_9ee.childNodes.length<=0))?"":_9ee.firstChild.nodeValue;
this._valueHeader.innerHTML=Strings.VALUE_HEADER;
if(_9ef!==""){
this._valueHeader.innerHTML=this._valueHeader.innerHTML+" <br /><span class=\"awlValueHeaderSubtitle\">("+_9ef+")</span>";
}
this._timeHeader.innerHTML=Strings.TIME_HEADER;
var _9f0=["awlDataTableValueCol","awlDataTableTimeeCol"];
var _9f1=["awlDataTableEvenRow","awlDataTableOddRow"];
var _9f2=0;
for(i=0;i<data.childNodes.length;i++){
if(data.childNodes[i].nodeType==1){
oneRecord=data.childNodes[i];
tr=_9ec.insertRow(_9ec.rows.length);
tr.setAttribute("className",_9f1[_9f2%2]);
tr.setAttribute("class",_9f1[_9f2++%2]);
td=tr.insertCell(tr.cells.length);
td.setAttribute("class","awlDataTableSpacer");
td=tr.insertCell(tr.cells.length);
td.setAttribute("class",_9f0[tr.cells.length-1]);
var _9f3=parseFloat(oneRecord.getAttribute("y"));
td.innerHTML=awl.common.formatDecimal(_9f3,true,2);
td=tr.insertCell(tr.cells.length);
td.innerHTML="&nbsp;";
td=tr.insertCell(tr.cells.length);
td.setAttribute("class",_9f0[tr.cells.length-1]);
td.innerHTML=(oneRecord.getAttribute("ts"));
td=tr.insertCell(tr.cells.length);
td.setAttribute("class","awlDataTableSpacer");
}
}
};
this._clearTable=function(){
if(this._valueHeader!==null){
this._valueHeader.innerHTML="";
}
if(this._timeHeader!==null){
this._timeHeader.innerHTML="";
}
if(this._tableBody!==null){
while(this._tableBody.childNodes.length>0){
this._tableBody.removeChild(this._tableBody.firstChild);
}
}
};
this._fillEmptyTable=function(_9f4){
var _9f5=_9f4;
tr=_9f5.insertRow(0);
td=tr.insertCell(0);
td.setAttribute("colSpan",3);
td.setAttribute("height",120);
td.setAttribute("align","center");
td.innerHTML="No Data Found.";
};
this._postLoadingMessage=function(_9f6){
this._clearTable();
var _9f7=_9f6;
tr=_9f7.insertRow(0);
td=tr.insertCell(0);
td.setAttribute("colSpan",3);
td.setAttribute("align","center");
td.setAttribute("height",120);
td.innerHTML="Loading Data Table...";
};
this.loadhandler=function(type,data,ev){
this.callingObj.updateTable(data);
};
this._registerExternalEvents=function(){
dojo.event.topic.subscribe("/preLoadRequest",this,this._makePreLoadResponse);
dojo.event.topic.registerPublisher("/preLoadResponse",this,this._sendResponse);
dojo.event.topic.subscribe("/onPageDataLoad",this,this._externalLoadEvent);
dojo.event.topic.subscribe("/onLoading",this,this._prepareToLoad);
};
this._sendResponse=function(xDoc){
};
this._makePreLoadResponse=function(){
this._sendResponse(this.pointsPerPage);
};
this._externalLoadEvent=function(_9fc){
this.updateTable(_9fc);
};
this._prepareToLoad=function(){
this._postLoadingMessage(this._tableBody);
};
};
dojo.inherits(awl.widget.DataTable,dojo.widget.HtmlWidget);
dojo.widget.tags.addParseTreeHandler("dojo:datatable");
dojo.provide("awl.widget.DateRangeNav");
dojo.require("dojo.event.*");
var Strings={PREV_PAGE:"<< Prev Page",NEXT_PAGE:"Next Page >>",VALUE_HEADER:"Value",TIME_HEADER:"Time"};
awl.widget.DateRangeNav=function(){
dojo.widget.HtmlWidget.call(this);
this.templateString="<div class=\"dataTableNav\">\n<span>\n	  <a href=\"javascript:void(0)\" \n		  dojoAttachEvent=\"onclick:gotoPrevPage;\"\n		  dojoAttachPoint=\"_navPrev\"\n		  class=\"dateRangeNavButton\">&nbsp;</a>\n</span>\n\n<select style=\"text-align:center;cursor:pointer;\" \n		dojoAttachEvent=\"onChange:jumpToPage;\" \n		dojoAttachPoint=\"_jumpSelector\">\n<option value=\"-1\">Jump to Date/Time</option>\n</select>\n\n<span>\n  <a href=\"javascript:void(0)\" \n	  dojoAttachEvent=\"onclick:gotoNextPage;\"\n	  dojoAttachPoint=\"_navNext\"\n	  class=\"dateRangeNavButton\">&nbsp;</a>\n</span>\n</div>\n";
this.templateCssPath=dojo.uri.dojoUri("../awl/widget/templates/HtmlDateRangeNav.css");
this.widgetType="DateRangeNav";
this.xmlTestFile="";
this.testMode=false;
this._navNext=null;
this._navPrev=null;
this._jumpSelector=null;
this._firstLoad=true;
this._pageIndex=0;
this._xmlPageDataCache=new Array();
this.fillInTemplate=function(){
this._navNext.innerHTML=Strings.NEXT_PAGE;
this._navPrev.innerHTML=Strings.PREV_PAGE;
};
this.postCreate=function(){
this._registerExternalEvents();
if(this.xmlTestFile!==""){
awl.common.loadXmlFromFile(this.xmlTestFile,this,this.loadhandler);
}
};
this.jumpToPage=function(evt){
var _9fe=evt.currentTarget.selectedIndex;
var _9ff=evt.currentTarget.options[_9fe];
var _a00=_9ff.dateRangeNavObj;
_a00.loadPage(_9fe);
};
this.loadPage=function(_a01){
if(_a01<1){
return;
}
this._jumpSelector.selectedIndex=_a01;
var _a02=this._jumpSelector.options[_a01];
var _a03=_a02.startTs;
var _a04=_a02.endTs;
this._pageIndex=eval(_a02.value);
var _a05=this._pageIndex+"";
var _a06=this._xmlPageDataCache[_a05];
if(!_a06){
this._requestData(_a03,_a04,this._pageIndex);
}else{
this._updatePageLoadListeners(_a06);
}
this._initNavButtons();
};
this.updateJumpList=function(xDoc){
var list=this._jumpSelector;
var data=xDoc;
if((data===undefined)||(data.childNodes.length<=0)){
this._fillEmptyList();
return false;
}
this._clearSelectOptions(list);
this._clearCache(this._xmlPageDataCache);
var _a0a,i;
this._appendListItem("Jump to date/time","-1","-1");
for(i=0;i<data.childNodes.length;i++){
if(data.childNodes[i].nodeType==1){
_a0a=data.childNodes[i];
this._appendListItem(_a0a.getAttribute("str"),_a0a.getAttribute("startTs"),_a0a.getAttribute("endTs"));
}
}
this._pageIndex=1;
this._initNavButtons();
};
this._clearSelectOptions=function(_a0b){
while(_a0b.length>0){
_a0b.remove(0);
}
};
this._clearCache=function(_a0c){
if(dojo.lang.isArray(_a0c)){
while(_a0c.length>0){
_a0c.pop();
}
}
};
this._fillEmptyList=function(){
this._clearSelectOptions(this._jumpSelector);
this._appendListItem("No data index available.",true);
};
this._postLoadingMessage=function(){
this._clearSelectOptions(this._jumpSelector);
this._appendListItem("Loading index...",true);
};
this._appendListItem=function(text,_a0e,_a0f){
var list=this._jumpSelector;
list.options[list.length]=new Option(text,list.length);
list.options[list.length-1].startTs=_a0e;
list.options[list.length-1].endTs=_a0f;
list.options[list.length-1].dateRangeNavObj=this;
};
this._registerExternalEvents=function(){
dojo.event.topic.subscribe("/onDataLoad",this,this._externalLoadEvent);
dojo.event.topic.registerPublisher("/loadRequest",this,this._requestData);
dojo.event.topic.subscribe("/onLoading",this,this._prepareToLoad);
dojo.event.topic.registerPublisher("/onPageDataLoad",this,this._updatePageLoadListeners);
};
this._requestData=function(_a11,_a12,_a13){
dojo.debug("ExternalEvent:","Sent /loadRequest ",_a11," ",_a12," ",_a13);
};
this._externalLoadEvent=function(_a14,_a15,_a16){
dojo.debug("ExternalEvent:","Received /onDataLoad ",_a14," ",_a15," ",_a16);
if(_a14!==null){
this.updateJumpList(_a14);
}
if(_a15!==null){
var _a17=_a16+"";
this._xmlPageDataCache[_a17]=_a15;
this._updatePageLoadListeners(_a15);
}
};
this._prepareToLoad=function(){
this._postLoadingMessage();
dojo.debug("ExternalEvent:","Received /onLoading ","Posting 'Loading...' message");
};
this._updatePageLoadListeners=function(_a18){
dojo.debug("ExternalEvent:","Sent /onPageDataLoad ","Notifying listeners",_a18);
};
this.loadhandler=function(type,data,ev){
if(data.nodeName!="pageStartData"){
data=data.childNodes[0];
}
this.callingObj.updateJumpList(data);
};
this._prevDisabled=false;
this.gotoPrevPage=function(){
if(!this._prevDisabled){
this.loadPage(this._pageIndex+1);
}
};
this.disablePrev=function(){
this._navPrev.style.visibility="hidden";
this._prevDisabled=true;
};
this.enablePrev=function(){
this._navPrev.style.visibility="visible";
this._prevDisabled=false;
};
this._nextDisabled=false;
this.gotoNextPage=function(){
if(!this._nextDisabled){
this.loadPage(this._pageIndex-1);
}
};
this.disableNext=function(){
this._navNext.style.visibility="hidden";
this._nextDisabled=true;
};
this.enableNext=function(){
this._navNext.style.visibility="visible";
this._nextDisabled=false;
};
this._initNavButtons=function(){
var _a1c=this._pageIndex;
if(this._isAtFirstIndex(_a1c)){
this.disablePrev();
}else{
this.enablePrev();
}
if(this._isAtLastIndex(_a1c)){
this.disableNext();
}else{
this.enableNext();
}
};
this._isAtFirstIndex=function(_a1d){
if(_a1d>=this._jumpSelector.length-1){
return (true);
}else{
return (false);
}
};
this._isAtLastIndex=function(_a1e){
if(_a1e<=1){
return (true);
}else{
return (false);
}
};
};
dojo.inherits(awl.widget.DateRangeNav,dojo.widget.HtmlWidget);
dojo.widget.tags.addParseTreeHandler("dojo:daterangenav");
dojo.provide("awl.widget.StatsBar");
dojo.require("dojo.event.*");
dojo.setModulePrefix("awl","../awl");
dojo.require("awl.*");
awl.widget.StatsBar=function(){
dojo.widget.HtmlWidget.call(this);
this.templateString="<div class=\"awlStatsBar\">\n<span class=\"awlStatItem awlStatMin\">\n	<span class=\"awlStatLabel\" dojoAttachPoint=\"_minLabel\"></span> \n	<span class=\"awlStatValue\" dojoAttachPoint=\"_minVal\">1234.02</span>\n</span>\n<span class=\"awlStatItem awlStatMax\">\n	<span class=\"awlStatLabel\" dojoAttachPoint=\"_maxLabel\"></span> \n	<span class=\"awlStatValue\" dojoAttachPoint=\"_maxVal\">1234.02</span>\n</span>\n<span class=\"awlStatItem awlStatAve\">\n	<span class=\"awlStatLabel\" dojoAttachPoint=\"_aveLabel\"></span> \n	<span class=\"awlStatValue\" dojoAttachPoint=\"_aveVal\">1234.02</span>\n</span>\n<span class=\"awlStatItem awlStatMean\">\n	<span class=\"awlStatLabel\" dojoAttachPoint=\"_meanLabel\"></span> \n	<span class=\"awlStatValue awlStatValueMean\" dojoAttachPoint=\"_meanVal\">1234.02</span>\n</span>\n<span class=\"awlStatItem awlStatStdDev\">\n	<span class=\"awlStatLabel\" dojoAttachPoint=\"_stddevLabel\"></span> \n	<span class=\"awlStatValue awlStatValueStdDev\" dojoAttachPoint=\"_stddevVal\">1234.02</span>\n</span>\n</div>\n";
this.templateCssPath=dojo.uri.dojoUri("../awl/widget/templates/HtmlStatsBar.css");
this.widgetType="StatsBar";
this.Strings={LABEL_MIN:"Min:",LABEL_MAX:"Max:",LABEL_AVE:"Ave:",LABEL_MEAN:"Median:",LABEL_STDDEV:"StdDev:"};
this.min=0;
this.max=0;
this.ave=0;
this.mean=0;
this.stddev=0;
this.xmlTestFile="";
this._minVal=null;
this._maxVal=null;
this._aveVal=null;
this._meanVal=null;
this._stddevVal=null;
this._minLabel=null;
this._maxLabel=null;
this._aveLabel=null;
this._meanLabel=null;
this._stddevLabel=null;
this.fillInTemplate=function(){
this._minLabel.innerHTML=this.Strings.LABEL_MIN;
this._maxLabel.innerHTML=this.Strings.LABEL_MAX;
this._aveLabel.innerHTML=this.Strings.LABEL_AVE;
this._meanLabel.innerHTML=this.Strings.LABEL_MEAN;
this._stddevLabel.innerHTML=this.Strings.LABEL_STDDEV;
this._minVal.innerHTML=this.min;
this._maxVal.innerHTML=this.max;
this._aveVal.innerHTML=this.ave;
this._meanVal.innerHTML=this.mean;
this._stddevVal.innerHTML=this.stddev;
};
this.postCreate=function(){
this._registerExternalEvents();
if(this.xmlTestFile!==""){
awl.common.loadXmlFromFile(this.xmlTestFile,this,this._testLoadhandler);
}
};
this.updateStats=function(data){
if((data===undefined)||(data===null)){
dojo.debug("StatsBar: No Statstics data found");
return false;
}
this._clearStats();
var _a20=awl.common.getXmlValue(data,"min");
this._minVal.innerHTML=_a20;
var _a20=awl.common.getXmlValue(data,"max");
this._maxVal.innerHTML=_a20;
var _a20=awl.common.getXmlValue(data,"ave");
this._aveVal.innerHTML=_a20;
var _a20=awl.common.getXmlValue(data,"median");
this._meanVal.innerHTML=_a20;
var _a20=awl.common.getXmlValue(data,"stdDev");
this._stddevVal.innerHTML=_a20;
};
this._clearStats=function(){
this._minVal.innerHTML="";
this._maxVal.innerHTML="";
this._aveVal.innerHTML="";
this._meanVal.innerHTML="";
this._stddevVal.innerHTML="";
};
this._testLoadhandler=function(type,data,ev){
this.callingObj.updateStats(data);
};
this._registerExternalEvents=function(){
dojo.event.topic.subscribe("/onStatsData",this,this._externalLoadEvent);
dojo.event.topic.subscribe("/onLoading",this,this._prepareToLoad);
};
this._externalLoadEvent=function(_a24){
dojo.debug(this.widgetType,": Received /onStatsData event",_a24);
this.updateStats(_a24);
};
this._prepareToLoad=function(){
dojo.debug(this.widgetType,": Received /onLoading event");
this._clearStats();
};
};
dojo.inherits(awl.widget.StatsBar,dojo.widget.HtmlWidget);
dojo.widget.tags.addParseTreeHandler("dojo:statsbar");
dojo.widget.manager.registerWidgetPackage("awl.widget");
dojo.hostenv.conditionalLoadModule({browser:["awl.widget.ChartLegend","awl.widget.DataNavBar","awl.widget.DateSelect","awl.widget.DataTable","awl.widget.DateRangeNav","awl.widget.ScaleSelect","awl.widget.StatsBar"]});
dojo.hostenv.moduleLoaded("awl.widget.*");

