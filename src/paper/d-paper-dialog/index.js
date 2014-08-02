
function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.setNull('width', '400px');
    this.model.setNull('height', '300px');
    /**
     * Set opened to true to show the dialog and to false to hide it.
     * A dialog may be made intially opened by setting its opened attribute.

     * @attribute opened
     * @type boolean
     * @default false
     */
    this.model.setNull('opened', false);
    this.model.setNull('opening', false);

    /**
     * If true, the dialog has a backdrop darkening the rest of the screen.
     * The backdrop element is attached to the document body and may be styled
     * with the class `core-overlay-backdrop`. When opened the `core-opened`
     * class is applied.
     *
     * @attribute backdrop
     * @type boolean
     * @default false
     */
    this.model.setNull('backdrop', false);

    /**
     * If true, the dialog is guaranteed to display above page content.
     *
     * @attribute layered
     * @type boolean
     * @default false
     */
    this.model.setNull('layered', false);

    /**
     * By default a dialog will close automatically if the user
     * taps outside it or presses the escape key. Disable this
     * behavior by setting the `autoCloseDisabled` property to true.
     * @attribute autoCloseDisabled
     * @type boolean
     * @default false
     */
    this.model.setNull('autoCloseDisabled', false);

    /**
     * @attribute heading
     * @type string
     * @default ''
     */
    this.model.setNull('heading', '');

    /**
     * Set this property to the id of a <core-transition> element to specify
     * the transition to use when opening/closing this dialog.
     *
     * @attribute transition
     * @type string
     * @default ''
     */
    this.model.setNull('transition.base', 'd-paper-dialog-transition');
    this.model.setNull('transition.opened', 'core-opened');
    this.model.setNull('transition.type', 'bottom');
}

Component.prototype.transitionEndAction = function(event){
}

/**
 * Toggle the opened state of the overlay.
 * @method toggle
 */
Component.prototype.toggle = function () {
    this.model.set('opened', !this.model.get('opened'));
}

/**
 * Open the overlay. This is equivalent to setting the `opened`
 * property to true.
 * @method open
 */
Component.prototype.open = function () {
    this.model.set('opened', true);
}

/**
 * Close the overlay. This is equivalent to setting the `opened`
 * property to false.
 * @method close
 */
Component.prototype.close = function () {
    this.model.set('opened', false);
}