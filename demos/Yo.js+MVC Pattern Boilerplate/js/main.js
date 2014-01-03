/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, EzyTracker, yo, define, brackets: true, $, jQuery, window, document, navigator*/


(function (w, doc, un) {
    "use strict";

    /******
     * @desc : defaults value
     ******/
    var defaults = {
        theme: "default"
    };

    /******
     * @desc : dynamic script loading
     ******/
    yo.core.config({

        // Sets the js folder as the base directory for all future relative paths
        baseUrl: "",

        // Set the namespace for the application
        namespace: "App",

        // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
        // probably a good idea to keep version numbers in the file names for updates checking
        path: {
            Model: "js/app/model",
            View: "js/app/view",
            Controller: "js/app/controller",
            libs: "js/libs",
            styles: "css"
        },

        loadScript: {
            libs: ["jquery-1.10.2.min", "yo-observer"],
            Model: ["ListModel"],
            View: ["ListView"],
            Controller : ["ListController"]
        },

        loadCSS: {
            styles: ["style"]
        }

    }, function () {

		var model = new App.Model.ListModel(['PHP', 'JavaScript']),
        
		view = new App.View.ListView(model, {
            'list' : $('#list'), 
            'addButton' : $('#plusBtn'), 
            'delButton' : $('#minusBtn')
        }),
		
        controller = new App.Controller.ListController(model, view);
    
		view.show();


    });

}(window, document, undefined));