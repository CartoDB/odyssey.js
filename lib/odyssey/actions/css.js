
var Action = require('../story').Action;


function CSS(el) {

  function _css() {};

  _css.toggleClass = function(cl) {
    return Action(function() {
      el.toggleClass(cl);
    });
  };

  _css.addClass = function(cl) {
    return Action(function() {
      el.addClass(cl);
    });
  };

  _css.removeClass = function(cl) {
    return Action(function() {
      el.removeClass(cl);
    });
  };

  return _css;

}

module.exports = CSS;
