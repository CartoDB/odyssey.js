
var Trigger = require('../story').Trigger;

function Sequential() {
  var current = 0;
  var steps = [];
  var max = 0;

  function seq() {}

  function update() {
    for (var i = 0; i < steps.length; ++i) {
      steps[i].check();
    }
  }

  seq.step = function(n) {
    var t = Trigger({ 
      check: function() {
        if (n === current && this.trigger) this.trigger();
      }
    });
    max = Math.max(max, n);
    steps.push(t);
    return t;
  };

  seq.next = function() {
    current += 1;
    if (current > max) {
      current = 0;
    }
    update();
  };

  seq.clear = function() {
    steps = [];
    max = 0;
    current = 0;
    return seq;
  };

  seq.current = function() {
    return current;
  };

  seq.prev = function() {
    current -= 1;
    if (current < 0) {
      current = max;
    }
    update();
  };

  return seq;
}

module.exports = Sequential;
