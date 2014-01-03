/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interaction.
 */
App.View.ListView = function (model, elements) {
    this._model = model;
    this._elements = elements;
	var self = this;

    this.listModified = new yo.event(this);
    this.addButtonClicked = new yo.event(this);
    this.delButtonClicked = new yo.event(this);


    // attach model listeners
    this._model.itemAdded.attach(function () {
        self.rebuildList();
    });
    this._model.itemRemoved.attach(function () {
        self.rebuildList();
    });

    // attach listeners to HTML controls
    this._elements.list.change(function (e) {
        self.listModified.notify({ index : e.target.selectedIndex });
    });
	
    this._elements.addButton.click(function () {
        self.addButtonClicked.notify();
    });
	
    this._elements.delButton.click(function () {
        self.delButtonClicked.notify();
    });
	
	this.show = function () {
        this.rebuildList();
    };

    this.rebuildList = function () {
        var list, items, key;

        list = this._elements.list;
        list.html('');

        items = this._model.getItems();
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                list.append($('<option>' + items[key] + '</option>'));
            }
        }
        this._model.setSelectedIndex(-1);
    };
}