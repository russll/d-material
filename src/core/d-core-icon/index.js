var icons = require('./icons.js');

function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function() {
    /**
     * Mode of icon source
     *
     * @attribute mode
     * @type string
     * @default 'svg'
     * 'svg' || 'img' || 'sprite'
     */
    this.model.setNull('mode', 'svg');

    this.model.setNull('icon', 'add');
    this.model.setNull('data', '');

    this.model.setNull('config', '');
    this.model.setNull('width', '25');
    this.model.setNull('height', '25');
    this.model.setNull('animate', false);
    this.model.setNull('keyframe', '');
    // XXX: Loading icons using a `require` was causing an error on route change.
    // FIX: Use a cached variable for the default icons, only require custom icons
    // TODO: test loading of custom icons. Investigate ways to utilize caching
    if (this.model.get('src')) {
        icons = require(this.model.get('src'));
    }
    this.model.set('data', icons[this.model.get('icon')]);
}

Component.prototype.create = function(){
    if(this.model.get('mode') == 'svg'){
        this.icon.innerHTML = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
            this.model.get('width') + ' ' + this.model.get('height') +
            '" width="' +
            this.model.get('width') +
            '" height="' +
            this.model.get('height') +
            '" preserveAspectRatio="xMidYMid meet">' +
            this.model.get('data') +
            '</svg>');
    }
}
