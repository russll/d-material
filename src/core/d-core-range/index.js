function Component(model) {
    this.model = model;

    this.model.setNull('checked', null);
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

    this.model.on('all', '*', (function (path, event, value) {
        this.update();
    }).bind(this));
}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.calcRatio = function (value) {
    return (this.clampValue(value) - this.model.get('min')) / (this.model.get('max') - this.model.get('min'));
}

Component.prototype.clampValue = function (value) {
    return Math.min(this.model.get('max'), Math.max(this.model.get('min'), this.calcStep(value)));
}

Component.prototype.calcStep = function (value) {
    return this.model.get('step') ? (Math.round(value / this.model.get('step')) / (1 / this.model.get('step'))) : value;
}

Component.prototype.validateValue = function () {
    var v = this.clampValue(this.model.get('value'));
    this.model.set('oldvalue', isNaN(v));
    this.model.set('value', this.model.get('oldValue') ? this.model.get('oldValue') : v);
    return this.model.get('value') !== v;
}

Component.prototype.update = function () {
    this.validateValue();
    this.model.set('ratio', this.calcRatio(this.model.get('value')) * 100);
}