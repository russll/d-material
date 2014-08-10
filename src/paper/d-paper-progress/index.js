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
    this.model.setNull('progress', 0);

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
    this.model.setNull('secondaryRatio', 0);

    /**
     * The number that represents the current secondary progress.
     *
     * @attribute secondaryProgress
     * @type number
     * @default 0
     */
    this.model.setNull('secondaryProgress', 0);
}

Component.prototype.create = function() {
    this.model.fn('ratioProperty', {
        get: (function (progress) {
            var p = this.clampValue(progress);
            return this.calcRatio(p) * 100;
        }).bind(this)
    });
    this.model.fn('secondaryRatioProperty', {
        get: (function (secondaryProgress) {
            var sp = this.clampValue(secondaryProgress);
            return this.calcRatio(sp) * 100;
        }).bind(this)
    });

    this.model.start('ratio', 'progress', 'ratioProperty');
    this.model.start('secondaryRatio', 'secondaryProgress', 'secondaryRatioProperty');
}

Component.prototype.calcRatio= function(value) {
    return (this.clampValue(value) - this.model.get('min')) / (this.model.get('max') - this.model.get('min'));
}

Component.prototype.clampValue= function(value) {
    return Math.min(this.model.get('max'), Math.max(this.model.get('min'), this.calcStep(value)));
}

Component.prototype.calcStep= function(value) {
    return this.model.get('step') ? (Math.round(value / this.model.get('step')) / (1 / this.model.get('step'))) : value;
}