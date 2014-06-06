
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
      debugger;
      el.classList.add(cl);
    });
  };

  _css.removeClass = function(cl) {
    return Action(function() {
      el.classList.remove(cl);
    });
  };

  return _css;

}

module.exports = CSS;
