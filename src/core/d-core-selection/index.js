function Component() {}

module.exports = Component;

Component.prototype.clear = function () {
//    this.model.set('selection', []);
    this.selection = [];
}
/**
 * Retrieves the selected item(s).
 * @method getSelection
 * @returns Returns the selected item(s). If the multi property is true,
 * getSelection will return an array, otherwise it will return
 * the selected item or undefined if there is no selection.
 */
Component.prototype.getSelection = function () {
//    return this.model.get('selection');
    return this.selection;
}
/**
 * Indicates if a given item is selected.
 * @method isSelected
 * @param {any} item The item whose selection state should be checked.
 * @returns Returns true if `item` is selected.
 */
Component.prototype.isSelected = function (item) {
//    return this.model.get('selection').indexOf(item) >= 0;
    return this.selection.indexOf(item) >= 0;
}
Component.prototype.setItemSelected = function (item, isSelected) {
    if (item !== undefined && item !== null) {
        if (isSelected) {
            //this.selection.push('selection', item);
            this.selection.push(item);

        } else {
            //var i = this.model.get('selection').indexOf(item);
            var i = this.selection.indexOf(item);
            if (i >= 0) {
                //this.model.remove('selection', i, 1);
                this.selection.slice(i, 1);
            }
        }
    }
    this.emit("core-select", {isSelected: isSelected, item: item});
}
/**
 * Set the selection state for a given `item`. If the multi property
 * is true, then the selected state of `item` will be toggled; otherwise
 * the `item` will be selected.
 * @method select
 * @param {any} item: The item to select.
 */
Component.prototype.select = function (item) {
    console.log('select')
    console.log(item)
    if (this.model.get('multi')) {
        this.toggle(item);
    } else if (this.getSelection() !== item) {
        this.setItemSelected(this.getSelection(), false);
        this.setItemSelected(item, true);
    }
}
/**
 * Toggles the selection state for `item`.
 * @method toggle
 * @param {any} item: The item to toggle.
 */
Component.prototype.toggle = function (item) {
    this.setItemSelected(item, !this.isSelected(item));
}