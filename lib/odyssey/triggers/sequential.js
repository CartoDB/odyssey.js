
var Trigger = require('../story').Trigger;

function Sequential() {
  var current = 0;
  var steps = [];
  var max = 0;
  var triggers = {};

  function seq() {}

  function update() {
    for (var i = 0; i < steps.length; ++i) {
      steps[i].check();
    }
  }

  seq.state = seq.step = function(n) {
    if (n in triggers) {
      return triggers[n];
    }
    var t = Trigger({
      check: function() {
        if (n === current && this.trigger) this.trigger();
      },
      reverse: function() {
        current = n;
      }
    });
    max = Math.max(max, n);
    steps.push(t);
    return triggers[n] = t;
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

  seq.current = function(_) {
    if (_ !== undefined) {
      var c = Math.max(Math.min(max, _), 0);
      if (c !== current) {
        current = c;
        update();
      }
      return this;
    }
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
