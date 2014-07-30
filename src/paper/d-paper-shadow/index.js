function PaperShadow() {}

module.exports = PaperShadow;

PaperShadow.prototype.view = __dirname;

PaperShadow.prototype.init = function () {
    this.model.setNull('z', 0);
    this.model.setNull('animated', false);
    this.model.setNull('splash', false);
}