function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.setNull('label', '');
    this.model.setNull('floatingLabel', false);
    this.model.setNull('maxRows', 0);
    this.model.setNull('focused', false);
    this.model.setNull('pressed', false);
}

Component.prototype.attached = function () {
    if (this.multiline) {
        this.resizeInput();
        window.requestAnimationFrame(function () {
            this.$.underlineContainer.classList.add('animating');
        }.bind(this));
    }
}

Component.prototype.resizeInput = function () {
    var height = this.$.inputClone.getBoundingClientRect().height;
    var bounded = this.maxRows > 0 || this.rows > 0;
    if (bounded) {
        var minHeight = this.$.minInputHeight.getBoundingClientRect().height;
        var maxHeight = this.$.maxInputHeight.getBoundingClientRect().height;
        height = Math.max(minHeight, Math.min(height, maxHeight));
    }
    this.$.inputContainer.style.height = height + 'px';
    this.$.underlineContainer.style.top = height + 'px';
}

Component.prototype.prepareLabelTransform = function () {
    var toRect = this.$.floatedLabelSpan.getBoundingClientRect();
    var fromRect = this.$.labelSpan.getBoundingClientRect();
    if (toRect.width !== 0) {
        this.$.label.cachedTransform = 'scale(' + (toRect.width / fromRect.width) + ') ' +
            'translateY(' + (toRect.bottom - fromRect.bottom) + 'px)';
    }
}

Component.prototype.rowsChanged = function () {
    if (this.multiline && !isNaN(parseInt(this.rows))) {
        this.$.minInputHeight.innerHTML = '';
        for (var i = 0; i < this.rows; i++) {
            this.$.minInputHeight.appendChild(document.createElement('br'));
        }
        this.resizeInput();
    }
}

Component.prototype.maxRowsChanged = function () {
    if (this.multiline && !isNaN(parseInt(this.maxRows))) {
        this.$.maxInputHeight.innerHTML = '';
        for (var i = 0; i < this.maxRows; i++) {
            this.$.maxInputHeight.appendChild(document.createElement('br'));
        }
        this.resizeInput();
    }
}

Component.prototype.inputValueChanged = function () {
    this.super();

    if (this.multiline) {
        var escaped = this.inputValue.replace(/\n/gm, '<br>');
        if (!escaped || escaped.lastIndexOf('<br>') === escaped.length - 4) {
            escaped += '&nbsp';
        }
        this.$.inputCloneSpan.innerHTML = escaped;
        this.resizeInput();
    }

    if (!this.floatingLabel) {
        this.$.label.classList.toggle('hidden', this.inputValue);
    }

    if (this.floatingLabel && !this.focused) {
        this.$.label.classList.toggle('hidden', this.inputValue);
        this.$.floatedLabel.classList.toggle('hidden', !this.inputValue);
    }
}

Component.prototype.labelChanged = function () {
    if (this.floatingLabel && this.$.floatedLabel && this.$.label) {
        // If the element is created programmatically, labelChanged is called before
        // binding. Run the measuring code in async so the DOM is ready.
        this.async(function () {
            this.prepareLabelTransform();
        });
    }
}

Component.prototype.placeholderChanged = function () {
    this.label = this.placeholder;
}

Component.prototype.inputFocusAction = function () {
    if (!this.pressed) {
        if (this.floatingLabel) {
            this.$.floatedLabel.classList.remove('hidden');
            this.$.floatedLabel.classList.add('focused');
            this.$.floatedLabel.classList.add('focusedColor');
        }
        this.$.label.classList.add('hidden');
        this.$.underlineHighlight.classList.add('focused');
        this.$.caret.classList.add('focused');

        this.super(arguments);
    }
    this.focused = true;
}

Component.prototype.inputBlurAction = function () {
    this.super(arguments);

    this.$.underlineHighlight.classList.remove('focused');
    this.$.caret.classList.remove('focused');
    if (this.floatingLabel) {
        this.$.floatedLabel.classList.remove('focused');
        this.$.floatedLabel.classList.remove('focusedColor');
        if (!this.inputValue) {
            this.$.floatedLabel.classList.add('hidden');
        }
    }
    if (!this.inputValue) {
        this.$.label.classList.remove('hidden');
        this.$.label.classList.add('animating');
        this.async(function () {
            this.$.label.style.webkitTransform = 'none';
            this.$.label.style.transform = 'none';
        });
    }
    this.focused = false;
}

Component.prototype.downAction = function (e) {
    if (this.disabled) {
        return;
    }

    if (this.focused) {
        return;
    }

    this.pressed = true;
    var rect = this.$.underline.getBoundingClientRect();
    var right = e.x - rect.left;
    this.$.underlineHighlight.style.webkitTransformOriginX = right + 'px';
    this.$.underlineHighlight.style.transformOriginX = right + 'px';
    this.$.underlineHighlight.classList.remove('focused');
    this.underlineAsync = this.async(function () {
        this.$.underlineHighlight.classList.add('pressed');
    }
    null, 200
    )
    ;

    // No caret animation if there is text in the input.
    if (!this.inputValue) {
        var width = this.$.inputCloneSpan.getBoundingClientRect().width;
        if (width < right) {
            this.$.caret.style.left = width + 'px';
            this.$.caret.classList.remove('focused');
        }
    }
}

Component.prototype.upAction = function (e) {
    if (this.disabled) {
        return;
    }

    if (!this.pressed) {
        return;
    }

    // if a touchevent caused the up, the synthentic mouseevents will blur
    // the input, make sure to prevent those from being generated.
    if (e._source === 'touch') {
        e.preventDefault();
    }

    if (this.underlineAsync) {
        clearTimeout(this.underlineAsync);
        this.underlineAsync = null;
    }

    // Focus the input here to bring up the virtual keyboard.
    this.$.input.focus();
    this.pressed = false;
    this.animating = true;

    this.$.underlineHighlight.classList.remove('pressed');
    this.$.underlineHighlight.classList.add('animating');
    this.async(function () {
        this.$.underlineHighlight.classList.add('focused');
    });

    // No caret animation if there is text in the input.
    if (!this.inputValue) {
        this.$.caret.classList.add('animating');
        this.async(function () {
            this.$.caret.classList.add('focused');
        }
        null, 100
    )
        ;
    }

    if (this.floatingLabel) {
        this.$.label.classList.add('focusedColor');
        this.$.label.classList.add('animating');
        if (!this.$.label.cachedTransform) {
            this.prepareLabelTransform();
        }
        this.$.label.style.webkitTransform = this.$.label.cachedTransform;
        this.$.label.style.transform = this.$.label.cachedTransform;
    }
}

Component.prototype.keypressAction = function () {
    if (this.animating) {
        this.transitionEndAction();
    }
}

Component.prototype.transitionEndAction = function (e) {
    this.animating = false;
    if (this.pressed) {
        return;
    }

    if (this.focused) {

        if (this.floatingLabel || this.inputValue) {
            this.$.label.classList.add('hidden');
        }

        if (this.floatingLabel) {
            this.$.label.classList.remove('focusedColor');
            this.$.label.classList.remove('animating');
            this.$.floatedLabel.classList.remove('hidden');
            this.$.floatedLabel.classList.add('focused');
            this.$.floatedLabel.classList.add('focusedColor');
        }

        this.async(function () {
            this.$.underlineHighlight.classList.remove('animating');
            this.$.caret.classList.remove('animating');
        }
        null, 100
    )
        ;

    } else {

        this.$.label.classList.remove('animating');

    }
}
