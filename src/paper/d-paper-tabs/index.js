function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.setNull('noink', false);
    this.model.setNull('nobar', false);
    this.model.setNull('nostretch', false);
    this.model.setNull('expand', false);
    this.model.setNull('width', 0);
    this.model.setNull('left', 0);
    this.model.setNull('selectedIndex', -1);
}

Component.prototype.create = function(){
    this.model.on('all', 'selectedIndex', (function (path, event, value) {

        if (!this.selectedItem) {
            this.model.set('width', 0);
            this.model.set('left', 0);
            return;
        }

        var w = 100 / this.items.length;

        if (this.nostretch || old === null || old === -1) {
            this.model.set('width', w + '%');
            this.model.set('left', this.selectedIndex * w + '%');
            return;
        }

        var m = 5;
        this.$.selectionBar.classList.add('expand');
        if (old < this.selectedIndex) {
            this.model.set('width', w + w * (this.selectedIndex - old) - m + '%');
        } else {
            this.model.set('width', w + w * (old - this.selectedIndex) - m + '%');
            this.model.set('left', this.selectedIndex * w + m + '%');
        }
    }).bind(this));
}

Component.prototype.barTransitionEnd = function () {
    var cl = this.$.selectionBar.classList;
    if (cl.contains('expand')) {
        cl.remove('expand');
        cl.add('contract');
        var s = this.$.selectionBar.style;
        var w = 100 / this.items.length;
        this.model.set('width', w + '%');
        this.model.set('left', this.selectedIndex * w + '%');
    } else if (cl.contains('contract')) {
        cl.remove('contract');
    }
}