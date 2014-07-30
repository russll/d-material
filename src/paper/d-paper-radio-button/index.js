
function PaperRadioButton() {}

module.exports = PaperRadioButton;

PaperRadioButton.prototype.view = __dirname;

PaperRadioButton.prototype.init = function () {

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
     * @default false
     */
    this.model.setNull('toggles', false);

    /**
     * If true, the user cannot interact with this element.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    this.model.setNull('disabled', false);
}

PaperRadioButton.prototype.tap = function() {
    this.toggle();
}

PaperRadioButton.prototype.toggle = function() {
    this.model.set('checked', !this.model.get('toggles') || !this.model.get('checked'));
}