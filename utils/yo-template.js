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
    
    //Set the base URL for template class
    var setBaseURL = function (url) {
        baseURL = url;
    };
    
    //Get the base URL
    var getBaseURL = function () {
        return baseURL;
    };

    //Cache the dom reference
    var cachedDOM = function (uid, root, ele, template) {

        var cacheObj = {
            uid: uid,
            ele: ele,
            template: template
        };
        
        var cacheId = cacheObj.uid;
        var setCache = true;
        var i;
        
        cachedDOM.cache = cachedDOM.cache || {};

        if (cachedDOM.cache[root] === null || cachedDOM.cache[root] === undefined) {
            cachedDOM.cache[root] = [];
        } else {
            for (i = 0; i < cachedDOM.cache[root].length; i++) {
                if (cachedDOM.cache[root][i].ele === ele) {
                    cacheId = cachedDOM.cache[root][i].uid;
                    setCache = false;
                }
            }
        }

        if (setCache) {
            cachedDOM.cache[root].push(cacheObj);
        }
        
        return {
            uid : cacheId
        };
    };

    //Fetch the HTML Template
    var fetchHTML = function (fileRef) {
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
    var add = function (options, callback) {

        var defaults = {
            root: options.root || "body",
            ele: options.ele || "",
            template: options.template || "",
            animate: options.animate || "slide",
            mode: options.mode || "append",
            data: options.data || {}
        };

        var uid = (new Date()).getTime();

        var keys = Object.keys(defaults.data);
        var html = fetchHTML(defaults.template);
        var template = html;
        var arrValues = getValues(html);
        var i, j;

        var cacheDOM = cachedDOM(uid, defaults.root, defaults.ele, defaults.template);

        //Set the data value for dom element
        for (i = 0; i < arrValues.length; i++) {
            for (j = 0; j < keys.length; j++) {
                if (arrValues[i] === keys[j]) {
                    html = html.replace("{" + keys[j] + "}", defaults.data[keys[j]]);
                }
            }
        }

        //Remove Hidden Element if it exists in the DOM
        $("#templateBuilder").remove();

        var hiddenEle = $("body").append("<div id='templateBuilder' style='display:none;'></div>");
        var ele = [];
        var arrEl = [];
        
        if (defaults.ele instanceof Array) {
            for (i = 0; i < defaults.ele.length; i++) {
                if (defaults.ele[i].charAt(0) === "#" || defaults.ele[i].charAt(0) === ".") {
                    arrEl = $("#templateBuilder").html(html).find(defaults.ele[i]); //Insert into the dom
                    arrEl.first().attr("uid", cacheDOM.uid);
                    ele.push(arrEl[0]);
                } else {
                    console.error("Error: Incorrect reference - pass class or id only.");
                }
            }
        } else {
            if (defaults.ele.charAt(0) === "#" || defaults.ele.charAt(0) === ".") {
                ele = $("#templateBuilder").html(html).find(defaults.ele); //Insert into the dom
                ele.first().attr("uid", cacheDOM.uid);
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
            uid: ("[uid='" + cacheDOM.uid + "']"),
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

    };

    //Get cached data
    var cache = function () {
        return cachedDOM.cache;
    };

    //Remove from the dom but will not be removed from cache
    var remove = function (options, callback) {

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
    var destroy = function (options, callback) {

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