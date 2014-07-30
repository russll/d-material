function Component() {}

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
    this.model.setNull('min',0);

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

}

Component.prototype.update= function() {
    this.validateValue();
    this.ratio = this.calcRatio(this.value) * 100;
    this.secondaryProgress = this.clampValue(this.secondaryProgress);
    this.secondaryRatio = this.calcRatio(this.secondaryProgress) * 100;
}

Component.prototype.calcRatio= function(value) {
    return (this.clampValue(value) - this.min) / (this.max - this.min);
}

Component.prototype.clampValue= function(value) {
    return Math.min(this.max, Math.max(this.min, this.calcStep(value)));
}

Component.prototype.calcStep= function(value) {
    return this.step ? (Math.round(value / this.step) / (1 / this.step)) : value;
}

Component.prototype.validateValue= function() {
    var v = this.clampValue(this.value);
    this.value = this.oldValue = isNaN(v) ? this.oldValue : v;
    return this.value !== v;
}