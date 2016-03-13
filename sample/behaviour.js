'use strict';

requirejs(['../domu'], function(domu) {

var body;
var helpers;
var props;

function reparent(node) {
//  console.log(node, typeof(node), node.parent());
  body.append(node);
};

function drop(node, depth, partialResult) {
//  console.log(depth, partialResult);
//  console.dir(node[0]);
  reparent(node);
};

function recordProperties(node, depth, partialResult) {
//  console.dir(node[0]);
  var n = node[0];
//  console.log(n.offsetTop + ', ' + n.offsetLeft);
  helpers.push('<div class="helper" style="left:' + n.offsetLeft + 'px; top:' + n.offsetTop +
    'px; width:' + n.offsetWidth + 'px; height:' + n.offsetHeight + 'px;">'
    + node.prop('tagName') + '</div>');
};

function detach(node, depth, partialResult) {
  var result;
  result = partialResult +
    new Array(depth + 1).join(LOG_INDENTATION) +
    '<' + node.prop('tagName').toLowerCase() + (node.attr('id') ? (' id="' + node.attr('id') + '"') : '') + '>\n';
  return result;
};

function preventDefault(action) {
  return function(event) {
    action();
    return false;
  };
};

function actionTrace() {
  var trace = domu.traverseDOM(undefined, undefined, '.helper, section#overlay, script');
  console.debug(trace);
  $('#info textarea').prop('value', trace);
};

function actionGravity() {
  helpers = [];
  props = domu.traverseDOM(recordProperties, undefined, '.helper, section#overlay, script');
  helpers.map(function(elem) {
    body.append($(elem));
  });
  body.addClass('td');
//  domu.traverseDOM(detach, undefined, '.helper');
};

function actionReload() {
  window.location.reload();
};

function initialise() {
  body = $('body');
  $('a#trace').click(preventDefault(actionTrace));
  $('a#gravity').click(preventDefault(actionGravity));
  // $('a#actionEdit').click();
  // $('a#actionLorem').click();
  $('a#reload').click(preventDefault(actionReload));
};

$(document).ready(initialise);

});
