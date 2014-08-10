function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {

    /**
     * Gets or sets the state, `true` is checked and `false` is unchecked.
     *
     * @attribute checked
     * @type boolean
     * @default false
     */
    this.model.setNull('checked', false);

    /**
     * The label for the radio button.
     *
     * @attribute label
     * @type string
     * @default ''
     */
    this.model.setNull('label', '');

    /**
     * Normally the user cannot uncheck the radio button by tapping once
     * checked.  Setting this property to `true` makes the radio button
     * toggleable from checked to unchecked.
     *
     * @attribute toggles
     * @type boolean
     * @default true
     */
    this.model.setNull('toggles', true);

    /**
     * If true, the user cannot interact with this element.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    this.model.setNull('disabled', false);
    this.model.setNull('checkmark', false);
    this.model.setNull('box', false);
}

Component.prototype.create = function() {
    this.model.on('all', 'active', (function (path, event, checked) {
        console.log(this)
        console.log(this.model.get('active'))
        if (this.model.get('active')) {
            // FIXME: remove when paper-ripple can have a default 'down' state.
            if (!this.lastEvent) {
                var rect = this.wrapper.getBoundingClientRect();
                this.lastEvent = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                }
            }
            console.log(this.lastEvent)
            this.ripple.downAction(this.lastEvent);
        } else {
            this.ripple.upAction();
        }
        this.model.set('box', this.model.get('checked'));
        this.model.set('checkmark', !this.model.get('checked'));
    }).bind(this));
}

Component.prototype.toggle = function() {
    this.model.set('checked', !this.model.get('toggles') || !this.model.get('checked'));
}

Component.prototype.checkboxAnimationEnd = function () {
    this.model.set('checkmark', this.model.get('checked') && (this.model.get('checkmark') === true));
    this.model.set('box', !this.model.get('checked') && (this.model.get('box') === true));
}

Component.prototype.downAction = function(event, element) {
    this.lastEvent = event;
    this.toggle();

    this.model.set('pressed', true);
    this.model.set('focused', false);

    if (this.model.get('isToggle')) {
        this.model.set('active', !this.model.get('active'));
    } else {
        this.model.set('active', true);
    }
    this.emit('mousedown', event, element, this.model.get('item'));
}

Component.prototype.upAction = function(event, element) {
    this.model.set('pressed', false);

    if (!this.model.get('isToggle')) {
        this.model.set('active', false);
    }
    this.emit('mouseup', event, element, this.model.get('item'));
}

Component.prototype.focusAction = function() {
    if (!this.model.get('pressed')) {
        this.model.set('focused', true);
    }
}

Component.prototype.blurAction = function() {
    this.model.set('focused', false);
}
Component.prototype.clickAction = function(event, element) {
    this.toggle();
    this.emit('click', event, element, this.model.get('item'));
    event.stopPropagation();
}
Component.prototype.dblClickAction = function(event, element) {
    this.emit('dblclick', event, element, this.model.get('item'));
}

Component.prototype.contextMenuAction = function(event, element) {
    // Note that upAction may fire _again_ on the actual up event.
    this.upAction(event);
    this.focusAction();
}