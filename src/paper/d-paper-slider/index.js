function Component() {
}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    /**
     * The number that represents the current value.
     *
     * @attribute value
     * @type number
     * @default 0
     */
    this.model.setNull('value', 0);

    /**
     * The number that indicates the minimum value of the range.
     *
     * @attribute min
     * @type number
     * @default 0
     */
    this.model.setNull('min', 0);

    /**
     * The number that indicates the maximum value of the range.
     *
     * @attribute max
     * @type number
     * @default 100
     */
    this.model.setNull('max', 100);

    /**
     * Specifies the value granularity of the range's value.
     *
     * @attribute step
     * @type number
     * @default 1
     */
    this.model.setNull('step', 1);

    /**
     * Returns the ratio of the value.
     *
     * @attribute ratio
     * @type number
     * @default 0
     */
    this.model.setNull('ratio', 0);

    /**
     * The number that represents the current secondary progress.
     *
     * @attribute secondaryProgress
     * @type number
     * @default 0
     */
    this.model.setNull('secondaryProgress', 0);

    /**
     * If true, the slider thumb snaps to tick marks evenly spaced based
     * on the `step` property value.
     *
     * @attribute snaps
     * @type boolean
     * @default false
     */
    this.model.setNull('snaps', false);

    /**
     * If true, a pin with numeric value label is shown when the slider thumb
     * is pressed.  Use for settings for which users need to know the exact
     * value of the setting.
     *
     * @attribute pin
     * @type boolean
     * @default false
     */
    this.model.setNull('pin', false);

    /**
     * If true, this slider is disabled.  A disabled slider cannot be tapped
     * or dragged to change the slider value.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    this.model.setNull('disabled', false);

    /**
     * If true, an input is shown and user can use it to set the slider value.
     *
     * @attribute editable
     * @type boolean
     * @default false
     */
    this.model.setNull('editable', false);

    /**
     * The immediate value of the slider.  This value is updated while the user
     * is dragging the slider.
     *
     * @attribute immediateValue
     * @type number
     * @default 0
     */
    this.model.setNull('immediateValue', 0);
}

Component.prototype.ready = function () {
    this.update();
}

Component.prototype.update = function () {
    this.positionKnob(this.calcRatio(this.value));
    this.updateMarkers();
}

Component.prototype.valueChanged = function () {
    this.update();
    this.fire('change');
}

Component.prototype.expandKnob = function () {
    this.$.sliderKnob.classList.add('expand');
}

Component.prototype.resetKnob = function () {
    this.expandJob && this.expandJob.stop();
    this.$.sliderKnob.classList.remove('expand');
}

Component.prototype.positionKnob = function (ratio) {
    this._ratio = ratio;
    this.immediateValue = this.calcStep(this.calcKnobPosition()) || 0;
    if (this.snaps) {
        this._ratio = this.calcRatio(this.immediateValue);
    }
    this.$.sliderKnob.style.left = this._ratio * 100 + '%';
}

Component.prototype.immediateValueChanged = function () {
    this.$.sliderKnob.classList.toggle('ring', this.immediateValue <= this.min);
}

Component.prototype.inputChange = function () {
    this.value = this.$.input.value;
    this.fire('manual-change');
}

Component.prototype.calcKnobPosition = function () {
    return (this.max - this.min) * this._ratio + this.min;
}

Component.prototype.measureWidth = function () {
    this._w = this.$.sliderBar.offsetWidth;
}

Component.prototype.trackStart = function (e) {
    this.measureWidth();
    this._x = this._ratio * this._w;
    this._startx = this._x || 0;
    this._minx = -this._startx;
    this._maxx = this._w - this._startx;
    this.$.sliderKnob.classList.add('dragging');
    e.preventTap();
}

Component.prototype.track = function (e) {
    var x = Math.min(this._maxx, Math.max(this._minx, e.dx));
    this._x = this._startx + x;
    this._ratio = this._x / this._w;
    this.immediateValue = this.calcStep(this.calcKnobPosition()) || 0;
    var s = this.$.sliderKnob.style;
    s.transform = s.webkitTransform = 'translate3d(' + (this.snaps ?
        (this.calcRatio(this.immediateValue) * this._w) - this._startx : x) + 'px, 0, 0)';
}

Component.prototype.trackEnd = function () {
    var s = this.$.sliderKnob.style;
    s.transform = s.webkitTransform = '';
    this.$.sliderKnob.classList.remove('dragging');
    this.resetKnob();
    this.value = this.immediateValue;
    this.fire('manual-change');
}

Component.prototype.bardown = function (e) {
    this.measureWidth();
    this.$.sliderKnob.classList.add('transiting');
    var rect = this.$.sliderBar.getBoundingClientRect();
    this.positionKnob((e.x - rect.left) / this._w);
    this.value = this.calcStep(this.calcKnobPosition());
    this.expandJob = this.job(this.expandJob, this.expandKnob, 60);
    this.fire('manual-change');
}

Component.prototype.knobTransitionEnd = function () {
    this.$.sliderKnob.classList.remove('transiting');
}

Component.prototype.updateMarkers = function () {
    this.markers = [], l = (this.max - this.min) / this.step;
    for (var i = 0; i < l; i++) {
        this.markers.push('');
    }
}

Component.prototype.increment = function () {
    this.value = this.clampValue(this.value + this.step);
}

Component.prototype.decrement = function () {
    this.value = this.clampValue(this.value - this.step);
}

Component.prototype.keydown = function (e) {
    if (this.disabled) {
        return;
    }
    var c = e.keyCode;
    if (c === 37) {
        this.decrement();
        this.fire('manual-change');
    } else if (c === 39) {
        this.increment();
        this.fire('manual-change');
    }
}

Component.prototype.calcRatio = function (value) {
    return (this.clampValue(value) - this.min) / (this.max - this.min);
}

Component.prototype.clampValue = function (value) {
    return Math.min(this.max, Math.max(this.min, this.calcStep(value)));
}

Component.prototype.calcStep = function (value) {
    return this.step ? (Math.round(value / this.step) / (1 / this.step)) : value;
}

Component.prototype.validateValue = function () {
    var v = this.clampValue(this.value);
    this.value = this.oldValue = isNaN(v) ? this.oldValue : v;
    return this.value !== v;
}

Component.prototype.update = function () {
    this.validateValue();
    this.ratio = this.calcRatio(this.value) * 100;
}
    
