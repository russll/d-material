function CoreToolbar() {}

module.exports = CoreToolbar;

CoreToolbar.prototype.view = __dirname;

CoreToolbar.prototype.init = function(){
    this.model.setNull('mode', '');
}