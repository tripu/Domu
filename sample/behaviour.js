'use strict';

const IGNORE_NODES = '.helper, section#overlay, section#ticker, script, object',
  MIN_DEPTH = 1,
  MAX_DEPTH = Infinity;

/**
 * Define a generic event handler that triggers some given action and then cancels the event altogether.
 *
 * @param {Function} action - an operation to complete, a callback.
 * @returns {Function} - the resulting event handler.
 */

const buildHandler = function(action) {
    return function(event) {
        if (action && 'function' === typeof action)
            action.call(this, event);
        if (event && event.preventDefault)
            event.preventDefault();
        return false;
    };
};

const reloadPage = function() {
    window.location.reload();
};

/**
 * Set up the page once all dependencies are loaded.
 *
 * @param {Function} $ - the jQuery object.
 * @param {Function} domu - the Domu object.
 */

const setUp = function($, domu) {

    var body,
        ticker,
        helpers,
        arena,
        anchors,
        target = 0;

    const createTicker = function() {
        ticker = $('<section id="ticker">' + target + '</section>');
        body.append(ticker);
    };

    const reactToMouseOver = function(event) {
        // console.log(event);
        const X = event.pageX,
            Y = event.pageY;
        var vx, vy, d;
        for (var a of anchors) {
            vx = a.x - X;
            vy = a.y - Y;
            d = Math.sqrt(vx * vx + vy * vy);
            if (d > /* a.r */ arena * 0.5) {
                a.n.css('transform', 'none');
            } else if (d > arena * 0.01) {
                var nx = vx / d,
                    ny = vy / d,
                    push = (Math.cos((arena * 0.5 - d) / (arena * 0.5) * Math.PI + Math.PI) + 1) * arena * 0.075;
                // push = (arena * 0.5 - d) * 0.3; // / a.w;
                a.n.css('transform', 'translate(' + (nx * push) + 'px, ' + (ny * push) + 'px)');
            }
        }
    };

    const reactToMouseClick = function() {
        $(this).fadeOut({done: function() { $(this).remove(); }});
        target--;
        ticker.text(target);
    };

    const recordProperties = function(node, depth) {
        if (depth >= MIN_DEPTH && depth <= MAX_DEPTH) {
            // console.dir(node);
            const n = node[0],
                comp = window.getComputedStyle(n, null);
            node.attr('data-tmp-style', JSON.stringify({
                position: 'absolute',
                marginTop: n.style.marginTop + 'px',
                marginBottom: n.style.marginBottom + 'px',
                marginLeft: n.style.marginLeft + 'px',
                marginRight: n.style.marginRight + 'px',
                paddingTop: n.style.paddingTop + 'px',
                paddingBottom: n.style.paddingBottom + 'px',
                paddingLeft: n.style.paddingLeft + 'px',
                paddingRight: n.style.paddingRight + 'px',
                left: n.offsetLeft + 'px',
                top: n.offsetTop + 'px',
                width: n.offsetWidth + 'px',
                height: n.offsetHeight + 'px',
                fontFamily: comp.getPropertyValue('font-family'), // n.style.fontFamily,
                fontSize: comp.getPropertyValue('font-size'), // n.style.fontSize,
                backgroundColor: comp.getPropertyValue('background-color'), // n.style.backgroundColor,
                // border: '1px solid black'
            }));
            // console.dir(n);
            // console.log(node.attr('data-tmp-style'));
        }
    };

    const createHelper = function(node) {
        // console.dir(node[0]);
        var n = node[0];
        // console.log(n.offsetTop + ', ' + n.offsetLeft);
        helpers.push('<div class="helper" style="left:' + n.offsetLeft + 'px; top:' + n.offsetTop +
            'px; width:' + n.offsetWidth + 'px; height:' + n.offsetHeight + 'px;">'
            + node.prop('tagName') + '</div>');
    };

    const detach = function(node, depth) {
        if (depth >= MIN_DEPTH && depth <= MAX_DEPTH) {
            // console.dir(node);
            body.append(node);
            node.css(JSON.parse(node.attr('data-tmp-style')));
            node.removeAttr('data-tmp-style');
            target++;
            const n = node[0];
            anchors.push({
                n: node,
                x: n.offsetLeft + 0.5 * n.offsetWidth,
                y: n.offsetTop + 0.5 * n.offsetHeight,
                // l: Math.max(n.offsetWidth, n.offsetHeight)
                w: Math.min((n.offsetWidth * n.offsetHeight) / (arena * arena), 1)
            });
        }
    };

    const traceDOM = function() {
        const trace = domu.traverseDOM($, {ignore: IGNORE_NODES});
        console.debug(trace);
        window.alert('Check out the JavaScript console.');
    };

    const giveDepth = function() {
        helpers = [];
        domu.traverseDOM($, {task: createHelper, ignore: IGNORE_NODES});
        helpers.map(function(elem) {
            body.append($(elem));
        });
        body.addClass('td');
    };

    const gamify = function() {
        anchors = [];
        arena = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
        // console.log(arena);
        domu.traverseDOM($, {task: recordProperties, ignore: IGNORE_NODES});
        domu.traverseDOM($, {task: detach, ignore: IGNORE_NODES});
        createTicker();
        $('body > :not(' + IGNORE_NODES + ')').click(buildHandler(reactToMouseClick));
        $(document).mousemove(buildHandler(reactToMouseOver))
    };

    const init = function() {
        body = $('body');
        $('a#trace').click(buildHandler(traceDOM));
        $('a#depth').click(buildHandler(giveDepth));
        $('a#game').click(buildHandler(gamify));
        // $('a#actionEdit').click();
        // $('a#actionLorem').click();
        $('a#reload').click(buildHandler(reloadPage));
        body.addClass('padded');
        $('section#overlay').removeClass('hidden');
    };

    $(document).ready(init);

};

// Set up RequireJS:
requirejs.config({
    paths: {
        jquery: 'https://code.jquery.com/jquery-2.2.2.min',
        domu: '../domu'
    }
});

// Load dependencies asynchronously via RequireJS:
requirejs(['jquery', 'domu'], setUp);
