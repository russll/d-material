var selection = require('../d-core-selection/index.js');

function Component() {}

module.exports = Component;

Component.prototype = new selection();

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
    this.model.setNull('valuefield', 'name');
    this.model.setNull('valuefield', 'name');

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
}

Component.prototype.create = function () {
    this.model.on('all', 'selected', (function (path, event, value) {
        this.updateSelected();
    }).bind(this));
    this.model.on('all', 'selection', (function (path, event, value) {
        this.selectionSelect(value);
    }).bind(this));
    this.model.on('all', 'selectedItem', (function (path, event, value) {
        if (this.model.get('selectedItem')) {
            var t = this.model.get('selectedItem').templateInstance;
            this.model.set('selectedModel', t ? t.model : undefined);
        } else {
            this.model.set('selectedModel', null);
        }
        this.model.set('selectedIndex', this.model.get('selectedItem') ?
            parseInt(this.valueToIndex(this.model.get('selected'))) : -1);
    }).bind(this));
}

Component.prototype.getItems = function () {
    var nodes = this.model.get('itemsSelector') ?
        this.wrapper.querySelectorAll(this.model.get('itemsSelector')) :
        this.wrapper.children;
    return nodes;
}

Component.prototype.getSelected = function () {
    return this.model.get('selected');

}

Component.prototype.getSelectedItems = function () {
    var selected = this.model.get('selected');
    console.log(this.model)
    return selected;
}

//!!!
Component.prototype.updateSelected = function() {
    //this.validateSelected();
    if (this.model.get('multi')) {
        this.clearSelection();
        
        this.model.get('selected') && this.model.get('selected').forEach(function(s) {
            
            this.valueToSelection(s);
        }, this);
    } else {
        this.valueToSelection(this.model.get('selected'));
    }
}

Component.prototype.validateSelected = function() {
    if (this.model.get('multi') && !Array.isArray(this.model.get('selected')) &&
        this.model.get('selected') !== null && this.model.get('selected') !== undefined) {
        this.model.set('selected', [this.model.get('selected')]);
    }
}

Component.prototype.clearSelection = function() {
    if (this.model.get('multi')) {
        
        this.model.get('selected').forEach(function(s) {
            this.setItemSelected(s, false);
        }, this);
    } else {
        this.setItemSelected(this.model.get('selected')[0], false);
    }
    this.model.set('selectedItem', null);
    this.clear();
}

Component.prototype.nodeForData = function(data) {
    console.log('data')
    console.log(data)
    console.log('[' + this.model.get('valueattr') + '=' + data + ']')
    console.log(this.wrapper)
    console.log(this.wrapper.querySelectorAll("[" + this.model.get("valueattr") + "='" + data + "']"))
    return this.wrapper.querySelectorAll("[" + this.model.get("valueattr") + "='" + data + "']");
}
Component.prototype.dataForNode = function(node) {
    console.log(this.model.get("valueattr"))
    console.log(node.getAttribute)
    console.log(node[this.model.get("valueattr")])
    return node[this.model.get("valueattr")] || node.getAttribute(this.model.get("valueattr"));
}

Component.prototype.valueForItem = function(data) {
    return data[this.model.get('valuefield')];
}

Component.prototype.valueToSelection = function(value) {
    var item = (value === null || value === undefined) ?
        null : this.getItems()[this.valueToIndex(value)];
    //this.select(item);
    console.log('------val to sel!!!----')
    console.log(value)
    this.select(value);
}

Component.prototype.updateSelectedItem = function() {
    this.model.remove('selectedItem', this.model.get('selected').length);
    this.model.set('selectedItem', this.model.get('selected'));
}

Component.prototype.valueToIndex = function(value) {
    // find an item with value == value and return it's index
    for (var i=0, items=this.model.get('items'), c; (c=items[i]); i++) {
        console.log('--'+i)
        console.log(c)
        console.log(this.valueForItem(c))
        if (this.valueForItem(c) == value) {
            return i;
        }
    }
    // if no item found, the value itself is probably the index
    return value;
}

//!!!
// events fired from <core-selection> object
Component.prototype.selectionSelect = function(detail) {
    console.log(this)
    console.log('data for detail')
    console.log(detail)
//    console.log(this.dataForNode(detail.item))
    this.updateSelectedItem();
    if (detail.item) {

        this.applySelection(detail.item, detail.isSelected);
    }
    
}

Component.prototype.applySelection = function(data, isSelected) {
    console.log('apply selection')
    console.log(isSelected)
    console.log(data)

    var items = this.nodeForData(data);
    console.log('items-----')
    console.log(items)
    for(var i = 0;i<items.length;i++) {
        var item = items[i];
        console.log('-item-')
        console.log(item)
        if (this.model.get('selectedClass')) {
            item.classList.toggle(this.model.get('selectedClass'), isSelected);
            console.log('item.classList')
            console.log(item.classList)
        }
        if (this.model.get('selectedProperty')) {
            item[this.model.get('selectedProperty')] = isSelected;
        }
        if (this.model.get('selectedAttribute') && item.setAttribute) {
            if (isSelected) {
                item.setAttribute(this.model.get('selectedAttribute'), '');
            } else {
                item.removeAttribute(this.model.get('selectedAttribute'));
            }
        }
    }
}
//!!!
// event fired from host
Component.prototype.selectAction = function(event, element, data) {
    if (!this.model.get('notap')) {
        var i = this.findDistributedTarget(event.target, this.getItems());
        if (i >= 0) {
            var item = this.getItems()[i];
            var s = data || i;
            if (this.model.get('multi')) {
                if (this.model.get('selected')) {
                    this.addRemoveSelected(s);
                } else {
                    this.model.push('selected', s);
                }
            } else {
                this.model.set('selected', s);
            }
        }
    }
}

Component.prototype.addRemoveSelected = function(value) {
    var i = this.model.get('selected').indexOf(value);
    if (i >= 0) {
        this.model.remove('selected', i, 1);
    } else {
        this.model.push('selected', value);
    }
    this.valueToSelection(value);
}

Component.prototype.findDistributedTarget = function(target, nodes) {
    // find first ancestor of target (including itself) that
    // is in nodes, if any
    while (target && target != this.wrapper) {
        var i = Array.prototype.indexOf.call(nodes, target);
        if (i >= 0) {
            return i;
        }
        target = target.parentNode;
    }
}