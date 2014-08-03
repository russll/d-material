function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {}

Component.prototype.clickAction = function(event){
    this.emit('click', event, this);
}