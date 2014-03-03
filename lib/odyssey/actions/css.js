
var Action = require('../story').Action;


function CSS(el) {
  
  function _css() {};

  _css.toggleClass = function(cl) {
    return Action(function() {
      el.toggleClass(cl);
    });
  };

  return _css;

}

module.exports = CSS;
