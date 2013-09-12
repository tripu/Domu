/*
 * File “util.js” — custom JS for the Dōmu Sandbox page.
 * Project Dōmu (“DOM Utilities”) — https://github.com/tripu/Domu
 * Copyright © 2013 tripu <tripu@tripu.info> http://tripu.info
 * Released under the terms of the GPL.
 */

function actionTrace() {

	var trace = traverseDOM()
	console.debug(trace)
	$('#info textarea').prop('value', trace)
	$('#info').dialog('open')

}

function showMenu() {

	$('div#menu').dialog({
		autoOpen: true,
		modal: false,
		resizable: false,
		position: {
			my: 'right bottom',
			at: 'left top',
			of: 'window'
		},
		close: function(event) { event.stopImmediatePropagation(); event.stopPropagation(); event.preventDefault(); console.log(event) /*event..dialog('open')*/ }
	})

}

function initialise() {

	showMenu()
	$('#info').dialog({
		autoOpen: false,
		modal: true,
		width: 400,
		height: 600
	})

	$('a.button').button()
	$('a#actionTrace').click(actionTrace)
	// $('a#actionEdit').click()
	// $('a#actionLorem').click()
	// $('a#actionGravity').click()

}

$(document).ready(initialise)

// EOF