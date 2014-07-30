function PaperCheckbox() {}

module.exports = PaperCheckbox;

PaperCheckbox.prototype.view = __dirname;

PaperCheckbox.prototype.init = function () {

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

PaperCheckbox.prototype.create = function() {
    this.model.on('all', 'checked', (function (path, event, checked) {
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
        this.model.set('box', this.model.get('checked'));
        this.model.set('checkmark', !this.model.get('checked'));
    }).bind(this));
}
PaperCheckbox.prototype.downAction = function(event) {
    this.lastEvent = event;
    this.toggle();
}

PaperCheckbox.prototype.toggle = function() {
    this.model.set('checked', !this.model.get('toggles') || !this.model.get('checked'));
}
PaperCheckbox.prototype.checkboxAnimationEnd = function () {
    this.model.set('checkmark', this.model.get('checked') && !this.model.get('checkmark'));
    this.model.set('box', !this.model.get('checked') && !this.model.get('box'));
}