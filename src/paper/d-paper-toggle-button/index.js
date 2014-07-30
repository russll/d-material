function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.setNull('checked', false);
    this.model.setNull('dragging', false);
}

Component.prototype.trackStart = function (e) {
    this._w = this.toggleBar.offsetLeft + this.toggleBar.offsetWidth;
    e.preventTap();
}

Component.prototype.track = function (e) {
    this._x = Math.min(this._w, Math.max(0, this.model.get('checked') ? this._w + e.dx : e.dx));
    this.model.set('dragging', true);
    var s = this.toggleRadio.style;
    s.webkitTransform = s.transform = 'translate3d(' + this._x + 'px,0,0)';
}

Component.prototype.trackEnd = function () {
    var s = this.toggleRadio.style;
    s.webkitTransform = s.transform = null;
    this.model.set('dragging', false);
    this.model.set('checked', Math.abs(this._x) > this._w / 2);
}