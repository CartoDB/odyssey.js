
var Trigger = require('../story').Trigger;
var Core = require('../core');
var Hammer = require('hammerjs');

function Gestures(el) {

  var gestures = {};
  el = el || document;
  function _hammerEvent(eventName, fnName) {
    gestures[fnName]= function() {
      var t = Trigger({});
      Hammer(el).on(eventName, function() {
        t.trigger();
      });
      return t;
    };
  }

  _hammerEvent('swipeup', 'swipeUp');
  _hammerEvent('swipedown', 'swipeDown');
  _hammerEvent('swipeleft', 'swipeLeft');
  _hammerEvent('swiperight', 'swipeRight');

  return gestures;

}

module.exports = Gestures;
