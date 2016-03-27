'use strict';

const SELF = 'dōmu',
    LOG_INDENTATION = '·   ';

/**
 * Return a simple text representation of a node.
 *
 * @param {} node
 * @param {Number} depth
 * @param {String} partialResult
 * @returns {String}
 */

const printNode = function(node, depth, partialResult) {

    if (undefined === node || undefined === depth)
        throw new Error(SELF + ': printNode misses some arguments.');

    return partialResult +
        new Array(depth + 1).join(LOG_INDENTATION) +
        '<' + node.prop('tagName').toLowerCase() + (node.attr('id') ? (' id="' + node.attr('id') + '"') : '') + '>\n';

};

const OPTS_DEFAULT = {
    task: printNode,
    partialResult: '',
    ignore: undefined,
    rootNode: 'body',
    depth: 0
};

/**
 * Traverse the DOM tree and perform some action in each of its nodes.
 *
 * @param {Function} $ - the jQuery object.
 * @param {Object} options -.
 * @returns {*}
 */

const traverseDOM = function($, options) {

    var opts = {},
        children;

    if ('function' !== typeof $)
        throw new Error(SELF + ': missing/wrong jQuery object.');

    for (var o of Object.keys(OPTS_DEFAULT))
        opts[o] = (undefined === options[o] ? OPTS_DEFAULT[o] : options[o]);

    if ('string' === typeof opts.rootNode)
        opts.rootNode = $(opts.rootNode);

    if (undefined !== opts.ignore && !/^:not/.test(opts.ignore))
        opts.ignore = ':not(' + opts.ignore + ')';

    children = opts.rootNode.children(opts.ignore);
    opts.partialResult = opts.task.call(null, opts.rootNode, opts.depth, opts.partialResult);

    for (var i = 0; i < children.length; i++)
        opts.partialResult = traverseDOM($, {
            task: opts.task,
            ignore: opts.ignore,
            rootNode: $(children[i]),
            depth: opts.depth + 1,
            partialResult: opts.partialResult
        });

    return opts.partialResult;

};

// CommonJS:
const exports = {traverseDOM: traverseDOM};

// AMD:
if ('function' === typeof define) {
  define(exports);
}
