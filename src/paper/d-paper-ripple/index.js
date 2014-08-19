
/*
`paper-ripple` provides a visual effect that other paper elements can
use to simulate a rippling effect emanating from the point of contact.  The
effect can be visualized as a concentric circle with motion.

Example:

    <paper-ripple></paper-ripple>

`paper-ripple` listens to "down" and "up" events so it would display ripple
effect when touches on it.  You can also defeat the default behavior and
manually route the down and up actions to the ripple element.  Note that it is
important if you call downAction() you will have to make sure to call upAction()
so that `paper-ripple` would end the animation loop.

Example:

    <paper-ripple id="ripple" style="pointer-events: none;"></paper-ripple>
...
downAction: function(e) {
    this.$.ripple.downAction({x: e.x, y: e.y});
    },
upAction: function(e) {
    this.$.ripple.upAction();
    }

Styling ripple effect:

Use CSS color property to style the ripple:

paper-ripple {
    color: #4285f4;
    }

Note that CSS color property is inherited so it is not required to set it on
the `paper-ripple` element directly.

Apply `recenteringTouch` class to make the recentering rippling effect.

    <paper-ripple class="recenteringTouch"></paper-ripple>

Apply `circle` class to make the rippling effect within a circle.

    <paper-ripple class="circle"></paper-ripple>

*/

function Component() {}

module.exports = Component;

Component.prototype.view = __dirname;

Component.prototype.init = function () {
    this.model.setNull('width', 0);
    this.model.setNull('height', 0);

    this.model.setNull('recenteringTouch', false);
    this.model.setNull('circle', false);
    
    /**
     * The initial opacity set on the wave.
     *
     * @attribute initialOpacity
     * @type number
     * @default 0.25
     */
    this.model.setNull('initialOpacity', 0.25);

    /**
     * How fast (opacity per second) the wave fades out.
     *
     * @attribute opacityDecayVelocity
     * @type number
     * @default 0.8
     */
    this.model.setNull('opacityDecayVelocity', 0.8);

    this.model.setNull('backgroundFill', false);
    this.model.setNull('pixelDensity', 1);

    this.waves = [];

    this.model.setNull('waveMaxRadius', 150);
}

Component.prototype.create = function () {
    // Shortcuts.
    this.pow = Math.pow;
    this.now = Date.now;
    if (window.performance && performance.now) {
        this.now = performance.now.bind(performance);
    }
}

Component.prototype.setupCanvas = function () {
    this.model.set('width', this.wrapper.clientWidth * this.model.get('pixelDensity'));
    this.model.set('height', this.wrapper.clientHeight * this.model.get('pixelDensity'));
    var ctx = this.canvas.getContext('2d');
    ctx.scale(this.model.get('pixelDensity'), this.model.get('pixelDensity'));
    if (!this._loop) {
        this._loop = this.animate.bind(this, ctx);
    }
}

Component.prototype.downAction = function (e) {
    this.setupCanvas();
    var wave = this.createWave(this.canvas);

    this.cancelled = false;
    wave.isMouseDown = true;
    wave.tDown = 0.0;
    wave.tUp = 0.0;
    wave.mouseUpStart = 0.0;
    wave.mouseDownStart = this.now();

    var width = this.model.get('width') / 2; // Retina canvas
    var height = this.model.get('height') / 2;
    var rect = this.wrapper.getBoundingClientRect();
    var touchX = e.x - rect.left;
    var touchY = e.y - rect.top;

    wave.startPosition = {x: touchX, y: touchY};

    if (this.model.get("recenteringTouch") == true) {
        wave.endPosition = {x: width / 2, y: height / 2};
        wave.slideDistance = this.dist(wave.startPosition, wave.endPosition);
    }
    wave.containerSize = Math.max(width, height);
    wave.maxRadius = this.distanceFromPointToFurthestCorner(wave.startPosition, {w: width, h: height});
    this.waves.push(wave);
    requestAnimationFrame(this._loop);
}

Component.prototype.upAction = function () {
    for (var i = 0; i < this.waves.length; i++) {
        // Declare the next wave that has mouse down to be mouse'ed up.
        var wave = this.waves[i];
        if (wave.isMouseDown) {
            wave.isMouseDown = false
            wave.mouseUpStart = this.now();
            wave.mouseDownStart = 0;
            wave.tUp = 0.0;
            break;
        }
    }
    this._loop && requestAnimationFrame(this._loop);
}

Component.prototype.cancel = function () {
    this.cancelled = true;
}

Component.prototype.animate = function (ctx) {
    var shouldRenderNextFrame = false;

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var deleteTheseWaves = [];
    // The oldest wave's touch down duration
    var longestTouchDownDuration = 0;
    var longestTouchUpDuration = 0;
    // Save the last known wave color
    var lastWaveColor = null;
    // wave animation values
    var anim = {
        initialOpacity: this.model.get('initialOpacity'),
        opacityDecayVelocity: this.model.get('opacityDecayVelocity'),
        height: ctx.canvas.height,
        width: ctx.canvas.width
    }

    for (var i = 0; i < this.waves.length; i++) {
        var wave = this.waves[i];

        if (wave.mouseDownStart > 0) {
            wave.tDown = this.now() - wave.mouseDownStart;
        }
        if (wave.mouseUpStart > 0) {
            wave.tUp = this.now() - wave.mouseUpStart;
        }

        // Determine how long the touch has been up or down.
        var tUp = wave.tUp;
        var tDown = wave.tDown;
        longestTouchDownDuration = Math.max(longestTouchDownDuration, tDown);
        longestTouchUpDuration = Math.max(longestTouchUpDuration, tUp);

        // Obtain the instantenous size and alpha of the ripple.
        var radius = this.waveRadiusFn(tDown, tUp, anim);
        var waveAlpha = this.waveOpacityFn(tDown, tUp, anim);
        var waveColor = this.cssColorWithAlpha(wave.waveColor, waveAlpha);
        lastWaveColor = wave.waveColor;

        // Position of the ripple.
        var x = wave.startPosition.x;
        var y = wave.startPosition.y;

        // Ripple gravitational pull to the center of the canvas.
        if (wave.endPosition) {

            // This translates from the origin to the center of the view  based on the max dimension of
            var translateFraction = Math.min(1, radius / wave.containerSize * 2 / Math.sqrt(2));

            x += translateFraction * (wave.endPosition.x - wave.startPosition.x);
            y += translateFraction * (wave.endPosition.y - wave.startPosition.y);
        }

        // If we do a background fill fade too, work out the correct color.
        var bgFillColor = null;
        if (this.model.get('backgroundFill') == true) {
            var bgFillAlpha = this.waveOuterOpacityFn(tDown, tUp, anim);
            bgFillColor = this.cssColorWithAlpha(wave.waveColor, bgFillAlpha);
        }

        // Draw the ripple.
        this.drawRipple(ctx, x, y, radius, waveColor, bgFillColor);

        // Determine whether there is any more rendering to be done.
        var maximumWave = this.waveAtMaximum(wave, radius, anim);
        var waveDissipated = this.waveDidFinish(wave, radius, anim);
        var shouldKeepWave = !waveDissipated || maximumWave;
        var shouldRenderWaveAgain = !waveDissipated && !maximumWave;
        shouldRenderNextFrame = shouldRenderNextFrame || shouldRenderWaveAgain;
        if (!shouldKeepWave || this.cancelled) {
            deleteTheseWaves.push(wave);
        }
    }

    if (shouldRenderNextFrame) {
        requestAnimationFrame(this._loop);
    }

    for (var i = 0; i < deleteTheseWaves.length; ++i) {
        var wave = deleteTheseWaves[i];
        this.removeWaveFromScope(this, wave);
    }

    if (!this.waves.length) {
        // If there is nothing to draw, clear any drawn waves now because
        // we're not going to get another requestAnimationFrame any more.
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this._loop = null;
    }
}

///////////////////

//
// INK EQUATIONS
//
Component.prototype.waveRadiusFn = function (touchDownMs, touchUpMs, anim) {
    // Convert from ms to s.
    var touchDown = touchDownMs / 1000;
    var touchUp = touchUpMs / 1000;
    var totalElapsed = touchDown + touchUp;
    var ww = anim.width, hh = anim.height;
    // use diagonal size of container to avoid floating point math sadness
    var waveRadius = Math.min(Math.sqrt(ww * ww + hh * hh), this.model.get('waveMaxRadius')) * 1.1 + 5;
    var duration = 1.1 - .2 * (waveRadius / this.model.get('waveMaxRadius'));
    var tt = (totalElapsed / duration);

    var size = waveRadius * (1 - Math.pow(80, -tt));
    return Math.abs(size);
}

Component.prototype.waveOpacityFn = function (td, tu, anim) {
    // Convert from ms to s.
    var touchDown = td / 1000;
    var touchUp = tu / 1000;
    var totalElapsed = touchDown + touchUp;

    if (tu <= 0) {  // before touch up
        return anim.initialOpacity;
    }
    return Math.max(0, anim.initialOpacity - touchUp * anim.opacityDecayVelocity);
}

Component.prototype.waveOuterOpacityFn = function (td, tu, anim) {
    // Convert from ms to s.
    var touchDown = td / 1000;
    var touchUp = tu / 1000;

    // Linear increase in background opacity, capped at the opacity
    // of the wavefront (waveOpacity).
    var outerOpacity = touchDown * 0.3;
    var waveOpacity = this.waveOpacityFn(td, tu, anim);
    return Math.max(0, Math.min(outerOpacity, waveOpacity));
}

// Determines whether the wave should be completely removed.
Component.prototype.waveDidFinish = function (wave, radius, anim) {
    var waveOpacity = this.waveOpacityFn(wave.tDown, wave.tUp, anim);
    // If the wave opacity is 0 and the radius exceeds the bounds
    // of the element, then this is finished.
    if (waveOpacity < 0.01 && radius >= Math.min(wave.maxRadius, this.model.get('waveMaxRadius'))) {
        return true;
    }
    return false;
};

Component.prototype.waveAtMaximum = function (wave, radius, anim) {
    var waveOpacity = this.waveOpacityFn(wave.tDown, wave.tUp, anim);
    if (waveOpacity >= anim.initialOpacity && radius >= Math.min(wave.maxRadius, this.model.get('waveMaxRadius'))) {
        return true;
    }
    return false;
}

//
// DRAWING
//
Component.prototype.drawRipple = function (ctx, x, y, radius, innerColor, outerColor) {
    if (outerColor) {
        ctx.fillStyle = outerColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = innerColor;
    ctx.fill();
}

//
// SETUP
//
Component.prototype.createWave = function (elem) {
    var elementStyle = window.getComputedStyle(elem);
    var fgColor = elementStyle.color;

    var wave = {
        waveColor: fgColor,
        maxRadius: 0,
        isMouseDown: false,
        mouseDownStart: 0.0,
        mouseUpStart: 0.0,
        tDown: 0,
        tUp: 0
    };
    return wave;
}

Component.prototype.removeWaveFromScope = function (scope, wave) {
    if (scope.waves) {
        var pos = scope.waves.indexOf(wave);
        scope.waves.splice(pos, 1);
    }
};

Component.prototype.cssColorWithAlpha = function (cssColor, alpha) {
    var parts = cssColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (typeof alpha == 'undefined') {
        alpha = 1;
    }
    if (!parts) {
        return 'rgba(255, 255, 255, ' + alpha + ')';
    }
    return 'rgba(' + parts[1] + ', ' + parts[2] + ', ' + parts[3] + ', ' + alpha + ')';
}

Component.prototype.dist = function (p1, p2) {
    return Math.sqrt(this.pow(p1.x - p2.x, 2) + this.pow(p1.y - p2.y, 2));
}

Component.prototype.distanceFromPointToFurthestCorner = function (point, size) {
    var tl_d = this.dist(point, {x: 0, y: 0});
    var tr_d = this.dist(point, {x: size.w, y: 0});
    var bl_d = this.dist(point, {x: 0, y: size.h});
    var br_d = this.dist(point, {x: size.w, y: size.h});
    return Math.max(tl_d, tr_d, bl_d, br_d);
}

