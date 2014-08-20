function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.setNull('z', 0);
    this.model.setNull('animated', false);
    this.model.setNull('splash', false);
}