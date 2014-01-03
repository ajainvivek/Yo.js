/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, yo, EzyTracker, define, brackets: true, $, jQuery, window, document, navigator*/

(function (w, doc, un) {
	"use strict";
	
	var event = function (sender) {
		this._sender = sender;
		this._listeners = [];
	};

	event.prototype = {
		attach : function (listener) {
			this._listeners.push(listener);
		},
		notify : function (args) {
			var index;

			for (index = 0; index < this._listeners.length; index += 1) {
				this._listeners[index](this._sender, args);
			}
		}
	};
	
	w.yo = w.yo || {};
	w.yo.event = event;
	
	return w.yo.event;
	
}(window, document, undefined));

