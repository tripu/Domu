const TMP_CLASS = 'temporaryGravityPlaceholder'
var elems = 0;

function unpin(node, depth) {

	if (node && !node.hasClass(TMP_CLASS) && node.prop('tagName').toLowerCase() != 'script' && node.prop('tagName').toLowerCase() != 'iframe') {

		for (var i = 0; i < node.children().length; i++) {
			unpin($(node.children()[i]), depth + 1)
		}

		if (node.prop('tagName').toLowerCase() != 'body') {
			var pos = node.offset()
			var w = node.width()
			var h = node.height()
			console.log(node.prop('tagName'), pos.left, pos.top, w, h)
			var clone = node.clone()
			clone.addClass(TMP_CLASS)
			$('body').append(clone)
			clone.css('position', 'absolute')
			clone.css('top', pos['top'])
			clone.css('left', pos['left'])
			clone.width(w)
			clone.height(h)
			clone.css('z-index', depth)
		}

	}

}

function trigger() {

	// $('*').css('transition', '2s')
	unpin($('body'), 0)
	$('body *').not('.' + TMP_CLASS).not('iframe,script').remove()

}

function shake() {

	$('.' + TMP_CLASS).css('transform', 'rotate(10deg)') // .css('top', Math.random() * document.width / 2)
	// $('.' + TMP_CLASS).css('left', Math.random() * document.height / 2)

}

$(document).ready(trigger)
