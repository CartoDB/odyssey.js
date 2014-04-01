
var Action = require('../story').Action;

var Audio = function(el){
  return {
    play: function() {
      return Action(function() {
        el.play()
      });
    },
    pause: function() {
      return Action(function() {
        el.pause()
      });
    }
	}

};
module.exports = Audio;

