
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, yo, define, brackets: true, $, jQuery, window, document, navigator*/

/**************
 *   @author : Ajain Vivek
 *   @desc : Yo.js - Templating Utility Library 
 *   @license : MIT Licensed
 ***************/

(function (w, doc, un) {
    "use strict";
    
	window.yo = window.yo || {};
    window.yo.utils = window.yo.utils || {};

    yo.utils.template = yo.utils.template || {};

    var baseURL = "";
	var setBaseURL, getBaseURL, cachedDOM, fetchHTML, addElements, add, remove, destroy, cache;
    
    //Set the base URL for template class
    setBaseURL = function (url) {
        baseURL = url;
    };
    
    //Get the base URL
    getBaseURL = function () {
        return baseURL;
    };

    //Cache the dom reference
    cachedDOM = function (uid, ele, template) {

        var cacheObj = {
            uid: uid,
            ele: ele,
            template: template
        };
        
        var cacheId = cacheObj.uid;
        var i;
        
        cachedDOM.cache = cachedDOM.cache || {};

        if (cachedDOM.cache[ele] === null || cachedDOM.cache[ele] === undefined) {
            cachedDOM.cache[ele] = cacheObj;
        } 
        
        return {
            uid : cacheId
        };
    };

    //Fetch the HTML Template
    fetchHTML = function (fileRef) {
        var ele = "";
        var url = baseURL + fileRef;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'html',
            async: false,
            cache: false,
            success: function (html) {
                ele = html;
            },
            fail: function () {
                console.error("Error: source not found");
            }
        });

        return ele;
    };

    //Map the string with curly braces
    var getValues = function (str) {
        var vals = [], // an array to collect the strings that are found
            rxp = new RegExp("{([^}]+)}", "g"),
            curMatch;

        while ((curMatch = rxp.exec(str)) !== null) {
            vals.push(curMatch[1]);
        }

        return vals;
    };
	
	

    //Add the element on to the dom
    add = function (options, callback) {
		
        var defaults = {
            root: options.root || "body",
            ele: options.ele || "",
            template: options.template || "",
            animate: options.animate || "slide",
            mode: options.mode || "append",
            data: options.data || {}
        };
		
		if (defaults.data instanceof Array) {
			addElements(options, callback);
		} else {
			var uid = (new Date()).getTime() + Math.floor((Math.random() * 1000));
			var cachedTemplate = cache() || {};
			var keys = Object.keys(defaults.data);
			var html = (cachedTemplate[defaults.ele] === undefined) ? fetchHTML(defaults.template) : cachedTemplate[defaults.ele].template;
			var template = html;
			var arrValues = getValues(html);
			var i, j;
	
			var cacheDOM = cachedDOM(uid, defaults.ele, template);
	
			//Set the data value for dom element
			for (i = 0; i < arrValues.length; i++) {
				for (j = 0; j < keys.length; j++) {
					if (arrValues[i] === keys[j]) {
						html = html.replace("{" + keys[j] + "}", defaults.data[keys[j]]);
					}
				}
			}
			
			var blockWrapper = "<div class='yo-wrapper' async></div>";
			var hiddenEle = $(blockWrapper).append("<div id='templateBuilder' style='display:none;' async></div>");
			var ele = [];
			var arrEl = [];
			
			if (defaults.ele instanceof Array) {
				for (i = 0; i < defaults.ele.length; i++) {
					if (defaults.ele[i].charAt(0) === "#" || defaults.ele[i].charAt(0) === ".") {
						arrEl = hiddenEle.find("#templateBuilder").html(html).find(defaults.ele[i]); //Insert into the dom
						arrEl.first().attr("uid", uid);
						ele.push(arrEl[0]);
					} else {
						console.error("Error: Incorrect reference - pass class or id only.");
					}
				}
			} else {
				if (defaults.ele.charAt(0) === "#" || defaults.ele.charAt(0) === ".") {
					ele = hiddenEle.find("#templateBuilder").html(html).find(defaults.ele); //Insert into the dom
					ele.first().attr("uid", uid);
				} else {
					console.error("Error: Incorrect reference - pass class or id only.");
				}
			}
	
	
			if (defaults.mode === "insert") {
				$(defaults.root).html(ele);
			} else {
				$(defaults.root).append(ele);
			}
			
			var oRef = {
				uid: ("[uid='" + uid + "']"),
				template: defaults.template,
				ele: defaults.ele
			};
	
			if (typeof callback === "function") {
				callback(oRef); // Execute callback function
			}
	
	
			return {
				uid: cacheDOM.uid,
				template: defaults.template,
				ele: defaults.ele
			};
		}

        

    };
	
	//Add Multiple Elements
	addElements = function (options, callback) {
		var defaults = {
            root: options.root || "body",
            ele: options.ele || "",
            template: options.template || "",
            animate: options.animate || "slide",
            mode: options.mode || "append"
        };
		var i;
		
		for (i = 0; i < options.data.length; i++) {
			defaults.data = options.data[i];
			if (i === options.data.length - 1) {
				add(defaults, callback);
			} else {
				add(defaults);
			}
		}
	};

    //Get cached data
    cache = function () {
        return cachedDOM.cache;
    };

    //Remove from the dom but will not be removed from cache
    remove = function (options, callback) {

        var defaults = {
            root: options.root || "body",
            ele: options.ele || "",
            uid: options.uid || "",
            animate: options.animate || "slide"
        };
        var i, j;
        var cachedDom = cache();
        var keys = Object.keys(cachedDom);

        if (defaults.uid !== "") {
            for (i = 0; i < keys.length; i++) {
                for (j = 0; j < cachedDom[keys[i]].length; j++) {
                    if (defaults.uid === cachedDom[keys[i]][j].uid) {
                        $(keys[i]).find("[uid='" + defaults.uid + "']").remove();
                        break;
                    }
                }
            }

        } else {
            if (defaults.ele.charAt(0) === "#" || defaults.ele.charAt(0) === ".") {
                $(defaults.ele).remove();
            }
        }


    };

    //Destroy the element from dom
    destroy = function (options, callback) {

        var defaults = {
            root: options.root || "body",
            ele: options.ele || "",
            uid: options.uid || "",
            animate: options.animate || "slide"
        };

        var i, j;
        var cachedDom = cache();
        var keys = Object.keys(cachedDom);

        if (defaults.uid !== "") {
            for (i = 0; i < keys.length; i++) {
                for (j = 0; j < cachedDom[keys[i]].length; j++) {
                    if (defaults.uid === cachedDom[keys[i]][j].uid) {
                        $(keys[i]).find("[uid='" + defaults.uid + "']").remove();
                        cachedDom[keys[i]].splice(j, 1); //Remove from cache
                        break;
                    }
                }
            }

        } else {
            if (defaults.ele.charAt(0) === "#" || defaults.ele.charAt(0) === ".") {
                
                for (i = 0; i < keys.length; i++) {
                    for (j = 0; j < cachedDom[keys[i]].length; j++) {
                        if (defaults.ele === cachedDom[keys[i]][j].ele) {
                            cachedDom[keys[i]].splice(j, 1); //Remove from cache
                        }
                    }
                }
                
                $(defaults.ele).remove();
                
            } else {
                console.error("Error: Incorrect reference - pass class or id only.");
            }
        }


    };

    yo.utils.template = {
        add: add,
        remove: remove,
        destroy: destroy,
        cache: cache,
        setBaseURL: setBaseURL,
        getBaseURL: getBaseURL
    };

    return yo.utils.template;

}(window, document, undefined));


