function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function(model) {
    this.model.set('state', 'normal');

    /**
     * If true, the button is currently active either because the
     * user is holding down the button, or the button is a toggle
     * and is currently in the active state.
     *
     * @attribute active
     * @type boolean
     * @default false
     */
    this.model.setNull('active', false);

    /**
     * If true, the element currently has focus due to keyboard
     * navigation.
     *
     * @attribute focused
     * @type boolean
     * @default false
     */
    this.model.setNull('focused', false);

    /**
     * If true, the user is currently holding down the button.
     *
     * @attribute pressed
     * @type boolean
     * @default false
     */
    this.model.setNull('pressed', false);

    /**
     * If true, the user cannot interact with this element.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    this.model.setNull('disabled', false);

    /**
     * If true, the button toggles the active state with each tap.
     * Otherwise, the button becomes active when the user is holding
     * it down.
     *
     * @attribute isToggle
     * @type boolean
     * @default false
     */
    this.model.setNull('isToggle', false);

    //----------------------------------------------------------------------
    /**
     * The label of the button.
     *
     * @attribute label
     * @type string
     * @default ''
     */
    this.model.setNull('label', null);

    /**
     * If true, the button will be styled as a "raised" button.
     *
     * @attribute raised
     * @type boolean
     * @default false
     */
    this.model.setNull('raised', false);

    /**
     * (optional) The URL of an image for an icon to use in the button.
     * Should not use `icon` property if you are using this property.
     *
     * @attribute iconSrc
     * @type string
     * @default ''
     */
    this.model.setNull('src', null);

    /**
     * (optional) Specifies the icon name or index in the set of icons
     * available in the icon set. If using this property, load the icon
     * set separately where the icon is used. Should not use `src`
     * if you are using this property.
     *
     * @attribute icon
     * @type string
     * @default ''
     */
    this.model.setNull('icon', null);

    this.model.setNull('z', 0);

    this.model.setNull('tabindex', 0);

    this.model.setNull('splash', false);

    this.model.setNull('rippled', true);
}
Component.prototype.create = function(model) {
    this.model.on('all', 'active', (function (path, event, active) {
        if (this.model.get('active')) {
            // FIXME: remove when paper-ripple can have a default 'down' state.
            if (!this.lastEvent) {
                var rect = this.wrapper.getBoundingClientRect();
                this.lastEvent = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                }
            }
            this.ripple.downAction(this.lastEvent);
        } else {
            this.ripple.upAction();
        }
        this.adjustZ();
    }).bind(this));
    this.model.on('all', 'focused', (function (path, event, focused) {
        this.adjustZ();
    }).bind(this));
    this.model.on('all', 'hover', (function (path, event, value) {
        this.adjustZ();
    }).bind(this));
    this.model.on('all', 'disabled', (function (path, event, disabled) {
        this.adjustZ();

        if (this.model.get('disabled')) {
            this.model.set('tabindex', -1);
        } else {
            this.model.set('tabindex', 0);
        }
    }).bind(this));
}

Component.prototype.insideButton = function (x, y) {
    var rect = this.wrapper.getBoundingClientRect();
    return (rect.left <= x) && (x <= rect.right) && (rect.top <= y) && (y <= rect.bottom);
}

Component.prototype.adjustZ = function () {
    if (this.model.get('focused')) {
        this.model.set('splash', true);
    } else {
        this.model.set('splash', false);

        if (this.model.get('active') || this.model.get('hover')) {
            this.model.set('z', 1);
        } else if (this.model.get('disabled')) {
            this.model.set('z', 0);
        } else {
            this.model.set('z', 0);
        }

    }
}


Component.prototype.focusAction = function() {
    if (!this.model.get('pressed')) {
        // Only render the "focused" state if the element gains focus due to
        // keyboard navigation.
        this.model.set('focused', true);
    }
}

Component.prototype.blurAction = function() {
    this.model.set('focused', false);
}

Component.prototype.downAction = function(event) {
    this.lastEvent = event;

    this.model.set('pressed', true);
    this.model.set('focused', false);

    if (this.model.get('isToggle')) {
        this.model.set('active', !this.model.get('active'));
    } else {
        this.model.set('active', true);
    }
}

Component.prototype.upAction = function() {
    this.model.set('pressed', false);

    if (!this.model.get('isToggle')) {
        this.model.set('active', false);
    }
}

Component.prototype.contextMenuAction = function(){}

Component.prototype.mouseEnterAction = function(event) {
    this.model.set('hover', true);
}
Component.prototype.mouseLeaveAction = function(event) {
    this.model.set('hover', false);
}

Component.prototype.clickAction = function(event, element) {
    this.emit('click', event, element, this.model.get('item'));
}

Component.prototype.dblclickAction = function(event, element) {
    this.emit('dblclick', event, element, this.model.get('item'));
}
