function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {}
Component.prototype.create = function () {
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
        //this.adjustZ();
    }).bind(this));
}

Component.prototype.adjustZ = function () {
    if (this.model.get('focused')) {
        this.model.set('splash', true);
    } else {
        this.model.set('splash', false);

        if (this.model.get('active')) {
            this.model.set('z', 2);
        } else if (this.model.get('disabled')) {
            this.model.set('z', 0);
        } else {
            this.model.set('z', 1);
        }

    }
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

Component.prototype.upAction = function(event) {
    this.model.set('pressed', false);

    if (!this.model.get('isToggle')) {
        this.model.set('active', false);
    }
    this.emit('mouseup', event);
}

Component.prototype.focusAction = function(event, element) {
    this.emit('click', event, element, this.model.get('item'));
}

Component.prototype.blurAction = function(event, element) {
    this.emit('click', event, element, this.model.get('item'));
}
Component.prototype.clickAction = function(event, element) {
    this.emit('click', event, element, this.model.get('item'));
}
Component.prototype.dblClickAction = function(event, element) {
    this.emit('dblclick', event, element, this.model.get('item'));
}

Component.prototype.contextMenuAction = function(event, element) {
    // Note that upAction may fire _again_ on the actual up event.
    this.upAction(e);
    this.focusAction();
    this.emit('click', event, element, this.model.get('item'));
}
