var selector = require('../d-core-selector/index.js');

function Component() {}

module.exports = Component;
Component.prototype = new selector();
Component.prototype.view = __dirname;

Component.prototype.init = function () {

    /**
     * Gets or sets the selected element.  Default to use the index
     * of the item element.
     *
     * If you want a specific attribute value of the element to be
     * used instead of index, set "valueattr" to that attribute name.
     *
     * Example:
     *
     *     <core-selector valueattr="label" selected="foo">
     *       <div label="foo"></div>
     *       <div label="bar"></div>
     *       <div label="zot"></div>
     *     </core-selector>
     *
     * In multi-selection this should be an array of values.
     *
     * Example:
     *
     *     <core-selector id="selector" valueattr="label" multi>
     *       <div label="foo"></div>
     *       <div label="bar"></div>
     *       <div label="zot"></div>
     *     </core-selector>
     *
     *     this.$.selector.selected = ['foo', 'zot'];
     *
     * @attribute selected
     * @type Object
     * @default null
     */
    this.model.setNull('selected', null);

    /**
     * If true, multiple selections are allowed.
     *
     * @attribute multi
     * @type boolean
     * @default false
     */
    this.model.setNull('multi', false);
    this.model.setNull('selection', []);

    /**
     * Specifies the attribute to be used for "selected" attribute.
     *
     * @attribute valueattr
     * @type string
     * @default 'name'
     */
    this.model.setNull('valueattr', 'name');

    /**
     * Specifies the CSS class to be used to add to the selected element.
     *
     * @attribute selectedClass
     * @type string
     * @default 'core-selected'
     */
    this.model.setNull('selectedClass', 'core-selected');

    /**
     * Specifies the property to be used to set on the selected element
     * to indicate its active state.
     *
     * @attribute selectedProperty
     * @type string
     * @default ''
     */
    this.model.setNull('selectedProperty', '');

    /**
     * Specifies the attribute to set on the selected element to indicate
     * its active state.
     *
     * @attribute selectedAttribute
     * @type string
     * @default 'active'
     */
    this.model.setNull('selectedAttribute', 'active');

    /**
     * Returns the currently selected element. In multi-selection this returns
     * an array of selected elements.
     *
     * @attribute selectedItem
     * @type Object
     * @default null
     */
    this.model.setNull('selectedItem', null);

    /**
     * In single selection, this returns the model associated with the
     * selected element.
     *
     * @attribute selectedModel
     * @type Object
     * @default null
     */
    this.model.setNull('selectedModel', null);

    /**
     * In single selection, this returns the selected index.
     *
     * @attribute selectedIndex
     * @type number
     * @default -1
     */
    this.model.setNull('selectedIndex', -1);

    /**
     * The target element that contains items.  If this is not set
     * core-selector is the container.
     *
     * @attribute target
     * @type Object
     * @default null
     */
    this.model.setNull('target', null);

    /**
     * This can be used to query nodes from the target node to be used for
     * selection items.  Note this only works if the 'target' property is set.
     *
     * Example:
     *
     *     <core-selector target="{{$.myForm}}" itemsSelector="input[type=radio]"></core-selector>
     *     <form id="myForm">
     *       <label><input type="radio" name="color" value="red"> Red</label> <br>
     *       <label><input type="radio" name="color" value="green"> Green</label> <br>
     *       <label><input type="radio" name="color" value="blue"> Blue</label> <br>
     *       <p>color = {{color}}</p>
     *     </form>
     *
     * @attribute itemSelector
     * @type string
     * @default ''
     */
    this.model.setNull('itemsSelector', '');

    /**
     * The event that would be fired from the item element to indicate
     * it is being selected.
     *
     * @attribute activateEvent
     * @type string
     * @default 'tap'
     */
    this.model.setNull('activateEvent', 'tap');

    /**
     * Set this to true to disallow changing the selection via the
     * `activateEvent`.
     *
     * @attribute notap
     * @type boolean
     * @default false
     */
    this.model.setNull('notap', false);

    this.model.fn('selectedItemsProperty', {
        get: (function (selected, items) {
            console.log('selected items')
            console.log(selected)
            console.log(items)
            var selectedItems = [];
            if(selected && items) {
                for (var i = 0; i < selected.length; i++) {
                    for (var k = 0; k < items.length; k++) {
                        if (items[k][this.model.get('valueattr')] == selected[i]) {
                            selectedItems.push(items[k]);
                        }
                    }
                }
            }
            return selectedItems;
        }).bind(this)
    });
}

Component.prototype.create = function () {
    this.model.on('all', 'selected', (function (path, event, value) {
        this.updateSelected();
    }).bind(this));
    this.model.on('all', 'selection', (function (path, event, value) {
        //this.selectionSelect(value);
    }).bind(this));
    this.model.on('all', 'selectedItem', (function (path, event, value) {
        this.model.set('selectedIndex', this.model.get('selectedItem') ?
            parseInt(this.valueToIndex(this.model.get('selected'))) : -1);
    }).bind(this));
    this.on('core-select', function(detail){
        this.selectionSelect(detail);
    });
    this.model.start('selectedItems', 'selected', 'items', 'selectedItemsProperty');
}

Component.prototype.getSelectedItems = function(){
    console.log(this.model)
    return this.model.get('selectedItems');
}