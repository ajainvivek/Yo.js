/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, define, brackets: true, $, window, document, navigator*/

/**************
 *   @author : Ajain Vivek
 *   @desc : Yo.js - Yo.js is an open source framework to structure your javascript code base by following your own design pattern.
 *   @license : MIT Licensed
 ***************/


(function (w, doc, un) {
    "use strict";
    
    var JSImport = {
        
        init : function (options, callback, type) {
            var defaults = {
                baseUrl : options.baseUrl || "",
                path : options.path || {},
				namespace : options.namespace || "",
                importScript : options.loadScript || {},
                importCSS : options.loadCSS || {}
            };
            
            //Config BaseURL & Path
            var config = this.config(defaults);
            var scrObj = defaults.importScript;
			var cssObj = defaults.importCSS;
 			
			if ((Object.keys(defaults.importScript).length !== 0) && (Object.keys(defaults.importCSS).length !== 0) && type === "all") {
				this.loadAllCSS(config, cssObj);
				this.loadAllScript(config, scrObj, callback);
			} else if ((Object.keys(defaults.importScript).length !== 0) && (type === "js" || type === "all")) {
                this.loadAllScript(config, scrObj, callback);
            } else if ((Object.keys(defaults.importCSS).length !== 0) && (type === "js" || type === "all")) {
				this.loadAllCSS(config, cssObj, callback);
			}
        },
        
        config : function (options) {
            var config = {
                baseUrl : options.baseUrl || "",
                path : options.path || {},
				namespace : options.namespace || ""
            };
            
            var path = {};
            var baseUrl = config.baseUrl;
            var keys = Object.keys(config.path);
            var i;
            
            for (i = 0; i < keys.length; i++) {
                path[keys[i]] = baseUrl + config.path[keys[i]];
            }
            
            return {
                baseUrl: baseUrl,
                path : path,
				namespace : config.namespace
            };
        },
        
        loadAllScript : function (options, obj, callback) {
            var scripts = obj;
            var keys = Object.keys(scripts);
			window[options.namespace] = {};// Define Global Namespace
			
            var path = options.path;
            var i, j;
			
            for (i = 0; i < keys.length; i++) {
                
                var scr = scripts[keys[i]];
                var arrScr = [];
				
				window[options.namespace][keys[i]] = {};
                
                if (scr instanceof Array) {
                    arrScr = scr;
                } else {
                    arrScr.push(scr);
                }
				
				if (arrScr.length === 0) {
					console.error(keys[i] + " is empty array or illegal format - Warning : can't pass empty array in configuration");
				}
                
                for (j = 0; j < arrScr.length; j++) {
                    var slash = path[keys[i]].substr(path[keys[i]].length - 1, path[keys[i]].length) === "/" ? "" : "/";
                    var extension = arrScr[j].substr(arrScr[j].length - 3, arrScr[j].length) === ".js" ? "" : ".js";
                    var source = path[keys[i]] + slash + arrScr[j] + extension;
                    
                    if (i !== keys.length - 1 || j !== arrScr.length - 1 || (typeof callback !== "function")) {
                        this.loadScript(source);
                    } else {
                        this.loadScript(source, callback);
                    }
                }
                
                
            }
            
        },
		
		loadAllCSS : function (options, obj, callback) {
            var cssSrc = obj;
            var keys = Object.keys(cssSrc);
            var path = options.path;
            var i, j;
            
            for (i = 0; i < keys.length; i++) {
                
                var cssEle = cssSrc[keys[i]];
                var arrCSSEle = [];
                
                if (cssEle instanceof Array) {
                    arrCSSEle = cssEle;
                } else {
                    arrCSSEle.push(cssEle);
                }
				
				if (arrCSSEle.length === 0) {
					console.error(keys[i] + " is empty array or illegal format - Warning : can't pass empty array in configuration");
				}

                for (j = 0; j < arrCSSEle.length; j++) {
                    var slash = path[keys[i]].substr(path[keys[i]].length - 1, path[keys[i]].length) === "/" ? "" : "/";
                    var extension = arrCSSEle[j].substr(arrCSSEle[j].length - 3, arrCSSEle[j].length) === ".css" ? "" : ".css";
                    var source = path[keys[i]] + slash + arrCSSEle[j] + extension;
                    
                    if (i !== keys.length - 1 || j !== arrCSSEle.length - 1 || (typeof callback !== "function")) {
                        this.loadCSS(source);
                    } else {
                        this.loadCSS(source, callback);
                    }
                }
                
                
            }
            
        },
        
        loadScript : function (source, done) {
            var scr = document.createElement("script");
            scr.src = source;
            scr.async = false;
            
            document.head.appendChild(scr);
             
            if (done) {
                scr.onload = done;
                scr.onreadystatechange = function () {
                    if (scr.readyState === "loaded" || scr.readyState === "completed") {
                        done();
                    }
                };
            }
        },
        
        loadCSS : function (source, done) {
            var cssEle = document.createElement("link");
            cssEle.setAttribute("rel", "stylesheet");
            cssEle.setAttribute("type", "text/css");
            cssEle.setAttribute("href", source);
			cssEle.async = false;
			
			document.head.appendChild(cssEle);
             
            if (done) {
                cssEle.onload = done;
                cssEle.onreadystatechange = function () {
                    if (cssEle.readyState === "loaded" || cssEle.readyState === "completed") {
                        done();
                    }
                };
            }
        }
        
    };
    
	w.yo = w.yo || {};
    
    w.yo = {
        config : function (options, callback) {
            JSImport.init(options, callback, "all");
        },
        loadScript: function (source, callback) {
            var options = {
                importScript: {}
            };
            JSImport.init(options, callback, "js");
        },
        loadCSS: function (source, callback) {
			var options = {
                importScript: {}
            };
            JSImport.init(options, callback, "css");
        }
    };
    
    
    
}(window, document, undefined));