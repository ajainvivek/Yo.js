/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, EzyTracker, yo, define, brackets: true, $, jQuery, window, document, navigator*/


(function (w, doc, un) {
    "use strict";

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
            App: "js/app",
            libs: "js/libs",
            styles: "css"
        },

        loadScript: {
            libs: ["jquery-1.10.2.min"],
            App: ["init"]
        },

        loadCSS: {
            styles: ["style"]
        }

    }, function () {
		//Initialize the application
		App.init();
    });

}(window, document, undefined));