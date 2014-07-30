function Component() {
}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    /**
     * The text shows in a toast.
     *
     * @attribute text
     * @type string
     * @default ''
     */
    this.model.setNull('text', '');

    /**
     * The duration in milliseconds to show the toast.
     *
     * @attribute duration
     * @type number
     * @default 3000
     */
    this.model.setNull('duration', 3000);

    /**
     * Set opened to true to show the toast and to false to hide it.
     *
     * @attribute opened
     * @type boolean
     * @default false
     */
    this.model.setNull('opened', false);

    /**
     * Min-width when the toast changes to narrow layout.  In narrow layout,
     * the toast fits at the bottom of the screen when opened.
     *
     * @attribute responsiveWidth
     * @type string
     * @default '480px'
     */
    this.model.setNull('responsiveWidth', '480px');

    /**
     * If true, the toast can't be swiped.
     *
     * @attribute swipeDisabled
     * @type boolean
     * @default false
     */
    this.model.setNull('swipeDisabled', false);

}

Component.prototype.narrowModeChanged = function () {
    this.classList.toggle('fit-bottom', this.narrowMode);
}

Component.prototype.openedChanged = function () {
    if (this.opened) {
        this.dismissJob = this.job(this.dismissJob, this.dismiss, this.duration);
    } else {
        this.dismissJob && this.dismissJob.stop();
        this.dismiss();
    }
}

/**
 * Toggle the opened state of the toast.
 * @method toggle
 */
Component.prototype.toggle = function () {
    this.opened = !this.opened;
}

/**
 * Show the toast for the specified duration
 * @method show
 */
Component.prototype.show = function () {
    if (currentToast) {
        currentToast.dismiss();
    }
    currentToast = this;
    this.opened = true;
}

/**
 * Dismiss the toast and hide it.
 * @method dismiss
 */
Component.prototype.dismiss = function () {
    if (this.dragging) {
        this.shouldDismiss = true;
    } else {
        this.opened = false;
        if (currentToast === this) {
            currentToast = null;
        }
    }
}

Component.prototype.trackStart = function (e) {
    if (!this.swipeDisabled) {
        e.preventTap();
        this.vertical = e.yDirection;
        this.w = this.offsetWidth;
        this.h = this.offsetHeight;
        this.dragging = true;
        this.classList.add('dragging');
    }
}

Component.prototype.track = function (e) {
    if (this.dragging) {
        var s = this.style;
        if (this.vertical) {
            var y = e.dy;
            s.opacity = (this.h - Math.abs(y)) / this.h;
            s.webkitTransform = s.transform = 'translate3d(0, ' + y + 'px, 0)';
        } else {
            var x = e.dx;
            s.opacity = (this.w - Math.abs(x)) / this.w;
            s.webkitTransform = s.transform = 'translate3d(' + x + 'px, 0, 0)';
        }
    }
}

Component.prototype.trackEnd = function (e) {
    if (this.dragging) {
        this.classList.remove('dragging');
        this.style.opacity = null;
        this.style.webkitTransform = this.style.transform = null;
        var cl = this.classList;
        if (this.vertical) {
            cl.toggle('fade-out-down', e.yDirection === 1 && e.dy > 0);
            cl.toggle('fade-out-up', e.yDirection === -1 && e.dy < 0);
        } else {
            cl.toggle('fade-out-right', e.xDirection === 1 && e.dx > 0);
            cl.toggle('fade-out-left', e.xDirection === -1 && e.dx < 0);
        }
        this.dragging = false;
    }
}

Component.prototype.transitionEnd = function () {
    var cl = this.classList;
    if (cl.contains('fade-out-right') || cl.contains('fade-out-left') ||
        cl.contains('fade-out-down') || cl.contains('fade-out-up')) {
        this.dismiss();
        cl.remove('fade-out-right', 'fade-out-left',
            'fade-out-down', 'fade-out-up');
    } else if (this.shouldDismiss) {
        this.dismiss();
    }
    this.shouldDismiss = false;
}
