function Component(model) {
    this.model = model;
    this.model.setNull('transition.base', 'core-transition');
    this.model.setNull('transition.opened', 'core-opened');
    this.model.setNull('transition.type', 'bottom');
}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function (model) {
    this.model.setNull('checked', null);
}