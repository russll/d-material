function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    /**
     * Max-width when the panel changes to narrow layout.
     *
     * @attribute responsiveWidth
     * @type string
     * @default '640px'
     */
    this.model.setNull('responsiveWidth', 640);

    /**
     * The panel that is being selected. `drawer` for the drawer panel and
     * `main` for the main panel.
     *
     * @attribute selected
     * @type string
     * @default null
     */
    this.model.setNull('selected', false);

    /**
     * The panel to be selected when `core-drawer-panel` changes to narrow
     * layout.
     *
     * @attribute defaultSelected
     * @type string
     * @default 'main'
     */
    this.model.setNull('defaultSelected', 'main');

    /**
     * Returns true if the panel is in narrow layout.  This is useful if you
     * need to show/hide elements based on the layout.
     *
     * @attribute narrow
     * @type boolean
     * @default false
     */
    this.model.setNull('narrow', false);

    /**
     * If true, position the drawer to the right.
     *
     * @attribute right
     * @type boolean
     * @default false
     */
    this.model.setNull('right', false);

    /**
     * If true, position the drawer to the left.
     *
     * @attribute left
     * @type boolean
     * @default false
     */
    this.model.setNull('left', false);

    /**
     * If true, swipe to open/close the drawer is disabled.
     *
     * @attribute disableSwipe
     * @type boolean
     * @default false
     */
    this.model.setNull('disableSwipe', false);

    this.model.set('edgeSwipeSensitivity', 15);
    this.model.set('transition', false);
    this.model.set('dragging', false);
}

Component.prototype.create = function () {
    this.model.set('transition', true);
}

Component.prototype.togglePanel = function () {
    this.selected = this.selected === 'main' ? 'drawer' : 'main';
}

Component.prototype.openDrawer = function () {
    this.selected = 'drawer';
}

Component.prototype.closeDrawer = function () {
    this.selected = 'main';
}

Component.prototype.queryMatchesChanged = function () {
    if (this.queryMatches) {
        this.selected = this.defaultSelected;
    }
    this.narrow = this.queryMatches;
    this.setAttribute('touch-action',
            this.narrow && !this.disableSwipe ? 'pan-y' : '');
    this.fire('core-responsive-change', {narrow: this.narrow});
}

// swipe support for the drawer, inspired by
// https://github.com/Polymer/core-drawer-panel/pull/6
Component.prototype.trackStart = function (e) {
    if (this.narrow && !this.disableSwipe) {
        this.dragging = true;

        if (this.selected === 'main') {
            this.dragging = this.rightDrawer ?
                e.pageX >= this.offsetWidth - this.edgeSwipeSensitivity :
                e.pageX <= this.edgeSwipeSensitivity;
        }

        if (this.dragging) {
            this.width = this.$.drawer.offsetWidth;
            this.transition = false;
            e.preventTap();
        }
    }
}

Component.prototype.track = function (e) {
    if (this.dragging) {
        var x;
        if (this.rightDrawer) {
            x = Math.max(0, (this.selected === 'main') ? this.width + e.dx : e.dx);
        } else {
            x = Math.min(0, (this.selected === 'main') ? e.dx - this.width : e.dx);
        }
        this.moveDrawer(x);
    }
}

Component.prototype.trackEnd = function (e) {
    if (this.dragging) {
        this.dragging = false;
        this.transition = true;
        this.moveDrawer(null);

        if (this.rightDrawer) {
            this.selected = e.xDirection > 0 ? 'main' : 'drawer';
        } else {
            this.selected = e.xDirection > 0 ? 'drawer' : 'main';
        }
    }
}

Component.prototype.moveDrawer = function (translateX) {
    var s = this.$.drawer.style;
    s.webkitTransform = s.transform =
            translateX === null ? '' : 'translate3d(' + translateX + 'px, 0, 0)';
}