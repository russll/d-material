function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.setNull('checked', false);
}

Component.prototype.clickAction = function(event){
    this.emit('click', event, this);
}