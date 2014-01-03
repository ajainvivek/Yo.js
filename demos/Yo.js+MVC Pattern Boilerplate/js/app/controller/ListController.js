/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global, yo, define, brackets: true, $, jQuery, window, document, navigator*/

/**
 * @desc: Controller Class. Controller responds to user actions and
 * invokes changes on the model.
 * @param: items
 */
 
App.Controller.ListController = function (model, view) {
    
	this._model = model;
    this._view = view;
	var self = this;

    this._view.listModified.attach(function (sender, args) {
        self.updateSelected(args.index);
    });

    this._view.addButtonClicked.attach(function () {
        self.addItem();
    });

    this._view.delButtonClicked.attach(function () {
        self.delItem();
    });
	
	this.addItem = function () {
        var item = window.prompt('Add item:', '');
        if (item) {
            this._model.addItem(item);
        }
    };

    this.delItem = function () {
        var index;

        index = this._model.getSelectedIndex();
        if (index !== -1) {
            this._model.removeItemAt(this._model.getSelectedIndex());
        }
    };

    this.updateSelected = function (index) {
        this._model.setSelectedIndex(index);
    };

	
};

