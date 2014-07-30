var selection = require('../d-core-selection/index.js');

function Component() {
}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.selection = new selection(this.model);

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
    this.model.setNull('selectedClass:', 'core-selected');

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

    this.model.on('all', 'selection', (function (path, event, value) {
        this.selectedChanged();
    }).bind(this));
}

Component.prototype.create = function () {
    this.activateListener = this.activateHandler.bind(this);
    this.observer = new MutationObserver(this.updateSelected.bind(this));
    if (!this.target) {
        this.target = this;
    }
}

Component.prototype.targetChanged = function (old) {
    if (old) {
        this.removeListener(old);
        this.observer.disconnect();
        this.clearSelection();
    }
    if (this.target) {
        this.addListener(this.target);
        this.observer.observe(this.target, {childList: true});
        this.updateSelected();
    }
}

Component.prototype.selectedChanged = function () {
    this.updateSelected();
}

Component.prototype.updateSelected = function () {
    this.validateSelected();
    if (this.multi) {
        this.clearSelection();
        this.selected && this.selected.forEach(function (s) {
            this.valueToSelection(s);
        }, this);
    } else {
        this.valueToSelection(this.selected);
    }
}

Component.prototype.validateSelected = function () {
    // convert to an array for multi-selection
    if (this.multi && !Array.isArray(this.selected) &&
        this.selected !== null && this.selected !== undefined) {
        this.selected = [this.selected];
    }
}

Component.prototype.clearSelection = function () {
    if (this.multi) {
        this.selection.slice().forEach(function (s) {
            this.$.selection.setItemSelected(s, false);
        }, this);
    } else {
        this.$.selection.setItemSelected(this.selection, false);
    }
    this.selectedItem = null;
    this.$.selection.clear();
}

Component.prototype.valueToSelection = function (value) {
    var item = (value === null || value === undefined) ?
        null : this.items[this.valueToIndex(value)];
    this.$.selection.select(item);
}

Component.prototype.updateSelectedItem = function () {
    this.selectedItem = this.selection;
}

Component.prototype.selectedItemChanged = function () {
    if (this.selectedItem) {
        var t = this.selectedItem.templateInstance;
        this.selectedModel = t ? t.model : undefined;
    } else {
        this.selectedModel = null;
    }
    this.selectedIndex = this.selectedItem ?
        parseInt(this.valueToIndex(this.selected)) : -1;
}

Component.prototype.valueToIndex = function (value) {
    // find an item with value == value and return it's index
    for (var i = 0, items = this.items, c; (c = items[i]); i++) {
        if (this.valueForNode(c) == value) {
            return i;
        }
    }
    // if no item found, the value itself is probably the index
    return value;
}

Component.prototype.valueForNode = function (node) {
    return node[this.valueattr] || node.getAttribute(this.valueattr);
}

// events fired from <core-selection> object
Component.prototype.selectionSelect = function (e, detail) {
    this.updateSelectedItem();
    if (detail.item) {
        this.applySelection(detail.item, detail.isSelected);
    }
}

Component.prototype.applySelection = function (item, isSelected) {
    if (this.selectedClass) {
        item.classList.toggle(this.selectedClass, isSelected);
    }
    if (this.selectedProperty) {
        item[this.selectedProperty] = isSelected;
    }
    if (this.selectedAttribute && item.setAttribute) {
        if (isSelected) {
            item.setAttribute(this.selectedAttribute, '');
        } else {
            item.removeAttribute(this.selectedAttribute);
        }
    }
}

// event fired from host
Component.prototype.activateHandler = function (e) {
    if (!this.notap) {
        var i = this.findDistributedTarget(e.target, this.items);
        if (i >= 0) {
            var item = this.items[i];
            var s = this.valueForNode(item) || i;
            if (this.multi) {
                if (this.selected) {
                    this.addRemoveSelected(s);
                } else {
                    this.selected = [s];
                }
            } else {
                this.selected = s;
            }
            this.asyncFire('core-activate', {item: item});
        }
    }
}

Component.prototype.addRemoveSelected = function (value) {
    var i = this.selected.indexOf(value);
    if (i >= 0) {
        this.selected.splice(i, 1);
    } else {
        this.selected.push(value);
    }
    this.valueToSelection(value);
}

Component.prototype.findDistributedTarget = function (target, nodes) {
    // find first ancestor of target (including itself) that
    // is in nodes, if any
    while (target && target != this) {
        var i = Array.prototype.indexOf.call(nodes, target);
        if (i >= 0) {
            return i;
        }
        target = target.parentNode;
    }
}