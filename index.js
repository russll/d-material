//app.use(module, { components: [ 'd-paper-button']})

module.exports = run;

function run(app, options){
    options || (options = {});//TODO create optional loading of components

    app.component(require('./src/paper/d-paper-button/index.js'));
    app.component(require('./src/paper/d-paper-checkbox/index.js'));
    app.component(require('./src/paper/d-paper-dialog/index.js'));
    app.component(require('./src/paper/d-paper-input/index.js'));
    app.component(require('./src/paper/d-paper-item/index.js'));
    app.component(require('./src/paper/d-paper-menu-button/index.js'));
    app.component(require('./src/paper/d-paper-progress/index.js'));
    app.component(require('./src/paper/d-paper-radio-button/index.js'));
    app.component(require('./src/paper/d-paper-radio-group/index.js'));
    app.component(require('./src/paper/d-paper-ripple/index.js'));
    app.component(require('./src/paper/d-paper-shadow/index.js'));
    app.component(require('./src/paper/d-paper-slider/index.js'));
    app.component(require('./src/paper/d-paper-tab/index.js'));
    app.component(require('./src/paper/d-paper-tabs/index.js'));
    app.component(require('./src/paper/d-paper-tile/index.js'));
    app.component(require('./src/paper/d-paper-tiles/index.js'));
    app.component(require('./src/paper/d-paper-toast/index.js'));
    app.component(require('./src/paper/d-paper-toggle-button/index.js'));

    app.component(require('./src/core/d-core-drawer-panel/index.js'));
    app.component(require('./src/core/d-core-header-panel/index.js'));
    app.component(require('./src/core/d-core-toolbar/index.js'));
    app.component(require('./src/core/d-core-icon/index.js'));
    app.component(require('./src/core/d-core-input/index.js'));
    app.component(require('./src/core/d-core-item/index.js'));
    app.component(require('./src/core/d-core-menu/index.js'));
    app.component(require('./src/core/d-core-overlay/index.js'));
    app.component(require('./src/core/d-core-overlay-layer/index.js'));
    app.component(require('./src/core/d-core-range/index.js'));
    app.component(require('./src/core/d-core-selection/index.js'));
    app.component(require('./src/core/d-core-selector/index.js'));
//    app.component(require('./src/core/d-core-submenu/index.js'));
    app.component(require('./src/core/d-core-toolbar/index.js'));

    app.loadStyles('./index.styl');
}