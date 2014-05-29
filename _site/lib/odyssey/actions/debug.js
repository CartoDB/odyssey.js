
var Action = require('../story').Action;
//
// debug action
// prints information about current state
//
function Debug() {
  function _debug() {};

  _debug.log = function(_) {

    return Action({

      enter: function() {
        console.log("STATE =>", _, arguments);
      },

      update: function() {
        console.log("STATE (.)", _, arguments);
      },

      exit: function() {
        console.log("STATE <=", _, arguments);
      }

    });

  };

  return _debug;
}

module.exports = Debug;
