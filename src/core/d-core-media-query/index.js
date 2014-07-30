function Component(model) {
    this.model = model;
    this.model.setNull('queryMatches', false);
    this.model.setNull('query', '');
}

module.exports = Component;

Component.prototype.start = function () {
    this._mqHandler = this.queryHandler.bind(this);
    this._mq = null;
}
Component.prototype.queryChanged = function () {
    if (this._mq) {
        this._mq.removeListener(this._mqHandler);
    }
    var query = this.model.get('query');
    if (query[0] !== '(') {
        query = '(' + this.query + ')';
    }
    this._mq = window.matchMedia(query);
    this._mq.addListener(this._mqHandler);
    this.queryHandler(this._mq);
}
Component.prototype.queryHandler = function (mq) {
    this.model.set('queryMatches', mq.matches);
}