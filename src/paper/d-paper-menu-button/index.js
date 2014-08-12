function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    /**
     * If true, this menu is currently visible.
     *
     * @attribute opened
     * @type boolean
     * @default false
     */
    this.model.setNull('opened', false);

    /**
     * The horizontal alignment of the pulldown menu relative to the button.
     *
     * @attribute halign
     * @type 'left' | 'right'
     * @default 'left'
     */
    this.model.setNull('halign', 'left');

    /**
     * The vertical alignment of the pulldown menu relative to the button.
     *
     * @attribute valign
     * @type 'bottom' | 'top'
     * @default 'top'
     */
    this.model.setNull('valign', 'top');

    /**
     * The URL of an image for the icon.  Should not use `icon` property
     * if you are using this property.
     *
     * @attribute src
     * @type string
     * @default ''
     */
    this.model.setNull('src', '');

    /**
     * Specifies the icon name or index in the set of icons available in
     * the icon set.  Should not use `src` property if you are using this
     * property.
     *
     * @attribute icon
     * @type string
     * @default ''
     */
    this.model.setNull('icon', '');

    this.model.setNull('slow', false);

}

Component.prototype.downAction = function () {
    if (!this.model.get('disabled')) {
        this.toggle();
    }
}

/**
 * Toggle the opened state of the menu.
 *
 * @method toggle
 */
Component.prototype.toggle = function () {
    this.model.set('opened', !this.model.get('opened'));
}

Component.prototype.transitionOpened = function(node, opened) {
    this.super(arguments);

    if (opened) {
        if (this.player) {
            this.player.cancel();
        }

        var anims = [];

        var ink = node.querySelector('.paper-menu-button-overlay-ink');
        var offset = 40 / Math.max(node.cachedSize.width, node.cachedSize.height);
        anims.push(new Animation(ink, [
            {
                'opacity': 0.9,
                'transform': 'scale(0)'
            },
            {
                'opacity': 0.9,
                'transform': 'scale(1)'
            }
        ], {
            duration: this.duration * offset
        }));

        var bg = node.querySelector('.paper-menu-button-overlay-bg');
        anims.push(new Animation(bg, [
            {
                'opacity': 0.9,
                'transform': 'scale(' + 40 / node.cachedSize.width + ',' + 40 / node.cachedSize.height + ')'
            },
            {
                'opacity': 1,
                'transform': 'scale(0.95, 0.5)'
            },
            {
                'opacity': 1,
                'transform': 'scale(1, 1)'
            }
        ], {
            delay: this.duration * offset,
            duration: this.duration * (1 - offset),
            fill: 'forwards'
        }));

        var nodes = window.ShadowDOMPolyfill ? Platform.queryAllShadows(node.querySelector('core-menu'), 'content').getDistributedNodes() : node.querySelector('core-menu::shadow content').getDistributedNodes().array();
        var items = nodes.filter(function (n) {
            return n.nodeType === Node.ELEMENT_NODE;
        });
        var itemDelay = offset + (1 - offset) / 2;
        var itemDuration = this.duration * (1 - itemDelay) / (items.length - 1);
        items.forEach(function (item, i) {
            anims.push(new Animation(item, [
                {
                    'opacity': 0
                },
                {
                    'opacity': 1
                }
            ], {
                delay: this.duration * itemDelay + itemDuration * i,
                duration: itemDuration,
                fill: 'both'
            }));
        }.bind(this));

        var shadow = node.querySelector('paper-shadow');
        anims.push(new Animation(shadow, function (t, target) {
            if (t > offset * 2 && shadow.z === 0) {
                shadow.z = 1
            }
        }, {
            duration: this.duration
        }));

        var group = new AnimationGroup(anims, {
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        this.player = document.timeline.play(group);
    }
}