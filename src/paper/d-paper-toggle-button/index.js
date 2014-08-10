function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.setNull('checked', false);
    this.model.setNull('dragging', false);
}

Component.prototype.create = function() {
    this.model.on('all', 'active', (function (path, event, active) {
    }).bind(this));
    this.model.on('all', 'focused', (function (path, event, focused) {
    }).bind(this));
    this.model.on('all', 'disabled', (function (path, event, disabled) {
        if (this.model.get('disabled')) {
            this.model.set('tabindex', -1);
        } else {
            this.model.set('tabindex', 0);
        }
    }).bind(this));
}

Component.prototype.toggle = function() {
    this.model.set('checked', !this.model.get('checked'));
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
    this.emit('mousedown', event);
}

Component.prototype.upAction = function() {
    this.model.set('pressed', false);

    if (!this.model.get('isToggle')) {
        this.model.set('active', false);
    }
    this.emit('mouseup', event);
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
    this.radio.toggle();
    this.emit('click', event, element, this.model.get('item'));
}
Component.prototype.dblClickAction = function(event, element) {
    this.emit('dblclick', event, element, this.model.get('item'));
}

Component.prototype.contextMenuAction = function(event, element) {
    // Note that upAction may fire _again_ on the actual up event.
    this.upAction(event);
    this.focusAction();
}
////////////////////////////////////////////////////////////////////////////////////////////////
Component.prototype.trackStart = function (e) {
    this._w = this.toggleBar.offsetLeft + this.toggleBar.offsetWidth;
    e.preventTap();
}

Component.prototype.track = function (e) {
    this._x = Math.min(this._w, Math.max(0, this.model.get('checked') ? this._w + e.dx : e.dx));
    this.model.set('dragging', true);
    var s = this.toggleRadio.style;
    s.webkitTransform = s.transform = 'translate3d(' + this._x + 'px,0,0)';
}

Component.prototype.trackEnd = function () {
    var s = this.toggleRadio.style;
    s.webkitTransform = s.transform = null;
    this.model.set('dragging', false);
    this.model.set('checked', Math.abs(this._x) > this._w / 2);
}
