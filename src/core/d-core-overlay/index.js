var transition = require('./../d-core-transition/index.js')
function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.transition = new transition(this.model);

    /**
     * The target element that will be shown when the overlay is
     * opened. If unspecified, the core-overlay itself is the target.
     *
     * @attribute target
     * @type Object
     * @default the overlay element
     */
    this.model.setNull('target', null);


    /**
     * A `core-overlay`'s size is guaranteed to be
     * constrained to the window size. To achieve this, the sizingElement
     * is sized with a max-height/width. By default this element is the
     * target element, but it can be specifically set to a specific element
     * inside the target if that is more appropriate. This is useful, for
     * example, when a region inside the overlay should scroll if needed.
     *
     * @attribute sizingTarget
     * @type Object
     * @default the target element
     */
    this.model.setNull('sizingTarget', null);

    /**
     * Set opened to true to show an overlay and to false to hide it.
     * A `core-overlay` may be made initially opened by setting its
     * `opened` attribute.
     * @attribute opened
     * @type boolean
     * @default false
     */
    this.model.setNull('opened', false);
    this.model.setNull('opening', false);
    this.model.setNull('way', 'opened');

    /**
     * If true, the overlay has a backdrop darkening the rest of the screen.
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
     * If true, the overlay is guaranteed to display above page content.
     *
     * @attribute layered
     * @type boolean
     * @default false
     */
    this.model.setNull('layered', false);

    /**
     * By default an overlay will close automatically if the user
     * taps outside it or presses the escape key. Disable this
     * behavior by setting the `autoCloseDisabled` property to true.
     * @attribute autoCloseDisabled
     * @type boolean
     * @default false
     */
    this.model.setNull('autoCloseDisabled', false);

    /**
     * This property specifies an attribute on elements that should
     * close the overlay on tap. Should not set `closeSelector` if this
     * is set.
     *
     * @attribute closeAttribute
     * @type string
     * @default "core-overlay-toggle"
     */
    this.model.setNull('closeAttribute', 'core-overlay-toggle');

    /**
     * This property specifies a selector matching elements that should
     * close the overlay on tap. Should not set `closeAttribute` if this
     * is set.
     *
     * @attribute closeSelector
     * @type string
     * @default ""
     */
    this.model.setNull('closeSelector', '');

    /**
     * A `core-overlay` target's size is constrained to the window size.
     * The `margin` property specifies a pixel amount around the overlay
     * that will be reserved. It's useful for ensuring that, for example,
     * a shadow displayed outside the target will always be visible.
     *
     * @attribute margin
     * @type number
     * @default 0
     */
    this.model.setNull('margin', 0);

    /**
     * The transition property specifies a string which identifies a
     * <a href="../core-transition/">`core-transition`</a> element that
     * will be used to help the overlay open and close. The default
     * `core-transition-fade` will cause the overlay to fade in and out.
     *
     * @attribute transition
     * @type string
     * @default 'core-transition-fade'
     */
    //this.model.setNull('transition', 'core-transition-fade');

}

Component.prototype.transitionEndAction = function(event){
    console.log('end')
}

/**
 * Toggle the opened state of the overlay.
 * @method toggle
 */
Component.prototype.toggle = function () {
    console.log('toggle')
    this.model.set('opened', !this.model.get('opened'));
}

/**
 * Open the overlay. This is equivalent to setting the `opened`
 * property to true.
 * @method open
 */
Component.prototype.open = function () {
    console.log('open')
    this.model.set('opened', false);
}

/**
 * Close the overlay. This is equivalent to setting the `opened`
 * property to false.
 * @method close
 */
Component.prototype.close = function () {
    console.log('close')
    this.model.set('opened', false);
}