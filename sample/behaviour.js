'use strict';

const IGNORE_NODES = '.helper, section#overlay, section#ticker, script, object, iframe',
    MIN_DEPTH = 2,
    MAX_DEPTH = Infinity,
    TARGET_RATIO = 0.1,
    FIELD_AFFORDANCE = 0.3, // 0.5,
    FIELD_NEUTER = 0.01,
    MAX_PUSH = 0.1; // 0.2;

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
        const X = event.pageX,
            Y = event.pageY,
            AFF = arena * FIELD_AFFORDANCE;
        var vx, vy, d;
        for (var a of anchors) {
            vx = a.x - X;
            vy = a.y - Y;
            d = Math.sqrt(vx * vx + vy * vy);
            if (d > arena * FIELD_AFFORDANCE) {
                a.n.css('transform', 'none');
            } else if (d > arena * FIELD_NEUTER) {
                var nx = vx / d,
                    ny = vy / d,
                    push = (Math.cos((AFF - d) / AFF * Math.PI + Math.PI) * 0.5 + 0.5) * arena * MAX_PUSH,
                    h = d / AFF * 200,
                    deg = (AFF - d) / AFF * -60;
                    // push = (arena * 0.5 - d) * 0.3; // / a.w;
                a.n.css('transform', 'translate(' + (nx * push) + 'px, ' + (ny * push) + 'px)');
                // a.n.css('transform', 'translate(' + (nx * push) + 'px, ' + (ny * push) + 'px, ' + h + 'px)');
                // a.n.css('transform', 'translate(' + (nx * push) + 'px, ' + (ny * push) + 'px) ' +
                //     'rotate3d(' + ny + ', ' + nx + ', 0, ' + deg + 'deg)');
                // a.n.css('transform', 'rotate3d(' + ny + ', ' + nx + ', 0, ' + deg + 'deg)');
            }
        }
    };

    const reactToMouseClick = function() {
        $(this).fadeOut({done: function() { $(this).remove(); }});
        target--;
        ticker.text(target);
        // if (target < 1)
            window.location = 'https://heavyeditorial.files.wordpress.com/2015/03/qjrcnqc.jpg';
    };

    const recordProperties = function(node, depth) {
        if (depth >= MIN_DEPTH && depth <= MAX_DEPTH) {
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
            // node.attr('data-tmp-style', JSON.stringify(comp));
        }
    };

    const createHelper = function(node) {
        var n = node[0];
        helpers.push('<div class="helper" style="left:' + n.offsetLeft + 'px; top:' + n.offsetTop +
            'px; width:' + n.offsetWidth + 'px; height:' + n.offsetHeight + 'px;">'
            + node.prop('tagName') + '</div>');
    };

    const detach = function(node, depth) {
        if (depth >= MIN_DEPTH && depth <= MAX_DEPTH) {
            const n = node[0],
                weight = Math.min((n.offsetWidth * n.offsetHeight) / (arena * arena), 1);
            body.append(node);
            node.css(JSON.parse(node.attr('data-tmp-style')));
            node.removeAttr('data-tmp-style');
            if (Math.random() < TARGET_RATIO && n.offsetWidth > 50 && n.offsetHeight > 50) { // && weight >= 0.2) {
                node.addClass('target');
                target++;
            } else {
                anchors.push({
                    n: node,
                    x: n.offsetLeft + 0.5 * n.offsetWidth,
                    y: n.offsetTop + 0.5 * n.offsetHeight,
                    // l: Math.max(n.offsetWidth, n.offsetHeight)
                    w: weight
                });
            }
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
        domu.traverseDOM($, {task: recordProperties, ignore: IGNORE_NODES});
        domu.traverseDOM($, {task: detach, ignore: IGNORE_NODES});
        createTicker();
        // $(':not(' + IGNORE_NODES + ')').click(buildHandler(reactToMouseClick));
        $('.target').click(buildHandler(reactToMouseClick));
        $(document).mousemove(buildHandler(reactToMouseOver))
        // $(body).css({
        //     'transform-origin': '50% 50%',
        //     'transform-style': 'preserve-3d',
        //     'perspective': (arena * 2) + 'px'
        // });
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
