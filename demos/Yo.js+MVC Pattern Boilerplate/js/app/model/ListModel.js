/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global, yo, define, brackets: true, $, jQuery, window, document, navigator*/

/**
 * @desc: Model Class. Model stores items and notifies
 * observers about changes.
 * @param: items
 */
 
App.Model.ListModel = function (items) {
    
	this._items = items;
    this._selectedIndex = -1;

    this.itemAdded = new yo.event(this);
    this.itemRemoved = new yo.event(this);
    this.selectedIndexChanged = new yo.event(this);
	
	this.getItems = function () {
        return [].concat(this._items);
    };
	
	this.addItem = function (item) {
        this._items.push(item);
        this.itemAdded.notify({ item : item });
    };
	
	this.removeItemAt = function (index) {
        var item;

        item = this._items[index];
        this._items.splice(index, 1);
        this.itemRemoved.notify({ item : item });
        if (index === this._selectedIndex) {
            this.setSelectedIndex(-1);
        }
    };
	
	this.getSelectedIndex = function () {
        return this._selectedIndex;
    };
	
	this.setSelectedIndex = function (index) {
        var previousIndex;

        previousIndex = this._selectedIndex;
        this._selectedIndex = index;
        this.selectedIndexChanged.notify({ previous : previousIndex });
    };
	
}

