
function Video(player) {
  if (typeof YT === 'undefined' || !(player instanceof YT.Player)) {
    throw new Error("player should be a YT.Player instance, see youtube API");
  }
  
  var triggers = [];

  var i = setInterval(function() {
    var seconds = player.getCurrentTime();
    for (var i = 0; i < triggers.length; ++i) {
      var t = triggers[i];
      if (t.start <= seconds && t.end > seconds) {
        t.trigger((seconds - t.start)/(t.end - t.start));
      }
    }
  }, 100);

  var clear = function(t) {
    if (triggers.length === 0) {
      clearInterval(i);
    }
  };

  return {
    between: function(start, end) {
      var t = O.Trigger();
      t.start = start;
      t.end = end;
      triggers.push(t);
      t.clear = function() {
        triggers.splice(triggers.indexOf(t), 1);
        clear();
      };
      return t;
    }
  }

}

module.exports = Video
