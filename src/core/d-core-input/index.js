function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.set('validate', {
        number: /^[0-9]*$/
    });
    /**
     * Placeholder text that hints to the user what can be entered in
     * the input.
     *
     * @attribute placeholder
     * @type string
     * @default ''
     */
    this.model.setNull('placeholder', '');

    /**
     * If true, this input cannot be focused and the user cannot change
     * its value.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    this.model.setNull('disabled', false);

    /**
     * Set the input type. Not supported for `multiline`.
     *
     * @attribute type
     * @type string
     * @default text
     */
    this.model.setNull('type', 'text');

    /**
     * If true, the user cannot modify the value of the input.
     *
     * @attribute readonly
     * @type boolean
     * @default false
     */
    this.model.setNull('readonly', false);

    /**
     * If true, the input is invalid until the value becomes non-null.
     *
     * @attribute required
     * @type boolean
     * @default false
     */
    this.model.setNull('required', false);

    /**
     * If true, this input accepts multi-line input like a `<textarea>`
     *
     * @attribute multiline
     * @type boolean
     * @default false
     */
    this.model.setNull('multiline', false);

    /**
     * (multiline only) The height of this text input in rows. The input
     * will scroll internally if more input is entered beyond the size
     * of the component. This property is meaningless if multiline is
     * false. You can also set this property to "fit" and size the
     * component with CSS to make the input fit the CSS size.
     *
     * @attribute rows
     * @type number|'fit'
     * @default 'fit'
     */
    this.model.setNull('rows', 'fit');

    /**
     * The current value of this input. Changing inputValue programmatically
     * will cause value to be out of sync. Instead, change value directly
     * or call commit() after changing inputValue.
     *
     * @attribute inputValue
     * @type string
     * @default ''
     */
    this.model.setNull('inputValue', '');

    /**
     * The value of the input committed by the user, either by changing the
     * inputValue and blurring the input, or by hitting the `enter` key.
     *
     * @attribute value
     * @type string
     * @default ''
     */
    this.model.setNull('value', '');

    /**
     * If this property is not null, the text input's inputValue will be
     * validated. You can validate the value with either a regular expression
     * or a custom function.
     *
     * To use a regular expression, set this property to a RegExp object or
     * a string containing the regular expression to match against. To use a
     * custom validator, set this property to a function with the signature
     * function(value) that returns a boolean. The input is valid if the
     * function returns true.
     *
     * Example:
     *
     *     // valid only if the value is a number
     *     <core-input validate="^[0-9]*$"></core-input>
     *
     *     // valid only if the value is a number
     *     this.$.input.validate = /^[0-9]*$/;
     *
     *     this.$.input2.validate = function(value) {
         *         // valid only if the value is 'foo'
         *         return value === 'foo';
         *     }
     *
     * @attribute validate
     * @type string|RegExp|Function(value)
     * @default null
     */
    this.model.setNull('validate', null);

    /**
     * If this property is true, the text input's inputValue failed validation.
     *
     * @attribute invalid
     * @type boolean
     * @default false
     */
    this.model.setNull('invalid', false);
}

Component.prototype.validateValue = function () {
    var valid = true;

    if (this.validate) {

        if (!this.inputValue) {
            valid = !this.required;
        } else if (typeof this.validate === 'string') {
            valid = new RegExp(this.validate).exec(this.inputValue);
        } else if (this.validate.exec) {
            valid = this.validate.exec(this.inputValue);
        } else if (this.validate instanceof Function) {
            valid = this.validate.call(this, this.inputValue);
        }

    } else if (this.required) {
        valid = !!this.inputValue;
    }

    this.invalid = !valid;
}

Component.prototype.inputValueChanged = function () {
    if (this.validate || this.required) {
        this.validateValue();
    }
}

Component.prototype.invalidChanged = function() {
    this.classList.toggle('invalid', this.invalid);
    this.fire('input-'+ this.invalid ? 'invalid' : 'valid', {value: this.inputValue});
}

Component.prototype.inputValueChanged = function() {
    if (this.validate || this.required) {
        this.validateValue();
    }
}

Component.prototype.valueChanged = function() {
    this.inputValue = this.value;
}

Component.prototype.requiredChanged = function() {
    this.validateValue();
}

Component.prototype.attributeChanged = function(attr, oldVal, curVal) {
    if (attr === 'tabindex') {
        this.tabindexChanged(curVal);
    }
}

Component.prototype.tabindexChanged = function(tabindex) {
    if (tabindex > 0) {
        this.$.input.setAttribute('tabindex', -1);
    } else {
        this.$.input.removeAttribute('tabindex');
    }
}

/**
 * Commits the inputValue to value.
 *
 * @method commit
 */
Component.prototype.commit = function () {
    this.value = this.inputValue;
}

Component.prototype.focusAction = function () {
    this.$.input.focus();
}

Component.prototype.inputFocusAction = function () {
    // re-fire non-bubbling event
    this.fire('focus', null, this, false);
}

Component.prototype.inputBlurAction = function () {
    // re-fire non-bubbling event
    this.fire('blur', null, this, false);
}

Component.prototype.blur = function () {
    // forward blur method to the internal input / textarea element
    this.$.input.blur();
}

Component.prototype.click = function () {
    // forward click method to the internal input / textarea element
    this.$.input.click();
}

Component.prototype.focus = function () {
    // forward focus method to the internal input / textarea element
    this.$.input.focus();
}

Component.prototype.select = function () {
    // forward select method to the internal input / textarea element
    this.$.input.focus();
}

Component.prototype.setSelectionRange = function (selectionStart, selectionEnd, selectionDirection) {
    // forward setSelectionRange method to the internal input / textarea element
    this.$.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
}

Component.prototype.setRangeText = function (replacement, start, end, selectMode) {
    // forward setRangeText method to the internal input element
    if (!this.multiline) {
        this.$.input.setRangeText(replacement, start, end, selectMode);
    }
}

Component.prototype.stepDown = function (n) {
    // forward stepDown method to the internal input element
    if (!this.multiline) {
        this.$.input.stepDown(n);
    }
}

Component.prototype.stepUp = function (n) {
    // forward stepUp method to the internal input element
    if (!this.multiline) {
        this.$.input.stepUp(n);
    }
}