
/*
 * File “domu.js” — source code.
 * Project Dōmu (“DOM Utilities”) — https://github.com/tripu/Domu
 * Copyright © 2013 tripu <tripu@tripu.info> http://tripu.info
 * Released under the terms of the GPL.
 */

const LOG_INDENTATION = '  '

function printNode(node, depth, partialResult) {

	var result

	if (undefined !== node && undefined !== depth) {
		result = partialResult +
			new Array(depth + 1).join(LOG_INDENTATION) +
			/*'<' +*/ node.prop('tagName').toLowerCase() + /*'>' +*/
			(node.attr('id') ? (' “' + node.attr('id') + '”') : '') +
			'\n'
	}

	return result

}

function traverseDOM(task, partialResult, ignore, rootNode, preOrder, depth) {

	var result

	if (undefined === task) {
		task = printNode
	}

	if (undefined === partialResult) {
		partialResult = ''
	}

	if (undefined === ignore) {
		ignore = {}
	}

	if (undefined === rootNode) {
		rootNode = $('body')
	}

	if (undefined === preOrder) {
		preOrder = true
	}

	if (undefined === depth || depth < 0) {
		depth = 0
	}

	if (preOrder) {

		if (rootNode.prop('tagName').toLowerCase() != 'body') {
			result = task.call(null, rootNode, depth, partialResult)
		}

		for (var i = 0; i < rootNode.children().length; i++) {
			result = traverseDOM(task, result, ignore, $(rootNode.children()[i]), preOrder, depth + 1)
		}

	} else {

		for (var i = 0; i < rootNode.children().length; i++) {
			result = traverseDOM(task, partialResult, ignore, $(rootNode.children()[i]), preOrder, depth + 1)
		}

		if (rootNode.prop('tagName').toLowerCase() != 'body') {
			result = task.call(null, rootNode, depth, result)
		}

	}

	return result

}

// EOF