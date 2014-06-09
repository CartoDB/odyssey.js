
require('../../vendor/d3.custom');

function Story() {

  var triggers = [];
  var events = [];
  var currentState = null;
  var prevState = null;

  function story(t) {
  }

  // event non attached to states
  story.addEvent = function(trigger, action) {
    trigger._story(story, function() {
      action.enter();
    });
    events.push({
      a: trigger,
      b: action
    });
    return story;
  };

  story.clear = function() {
    var all = triggers.concat(events);
    for(var i = 0; i < all.length; ++i) {
      var a = all[i];
      a.a.story = null;
      a.a.trigger = null;
      a.a.clear && a.a.clear();
      a.b.clear && a.b.clear();
    }

    triggers = [];
    events = [];
    currentState = null;
    prevState = null;

  };

  // go to state index
  story.go = function(index, opts) {
    opts = opts || {};
    if(index < 0 && index > triggers.length) {
      throw new Error("index should be less than states length");
    }
    if (story.state() !== index) {

      if (opts.reverse) {
        var a = triggers[index].a;
        if (a.reverse) {
          a.reverse();
        }
      }
      // current state
      story.state(index);

      // raise exit
      if (prevState !== null) {
        var prev = triggers[prevState].b;
        if (prev.exit) {
          prev.exit();
        }
      }

      var b = triggers[index].b;

      // enter in current state
      b.enter();
    }

  };

  story.addState = function(a, b, opts) {
    var i = triggers.length;

    if(!a || !b) {
      throw new Error("action and trigger must be defined");
    }

    triggers.push({
      a: a,
      b: b,
      opts: opts
    });

    a._story(story, function() {
      story.go(i);
    });

    return story;
  };

  story.addLinearState = function(a, b, opts) {
    var j;
    var i = triggers.length;

    triggers.push({
      a: a,
      b: b,
      opts: opts
    });

    a._story(story, function(t) {
      if (story.state() !== i) {
        story.go(i);
      } else {
        if (b.update) {
          b.update(t);
        }
      }
    });

    return story;
  };

  story.state = function(_) {
    if(_ === undefined) return currentState;
    prevState = currentState;
    currentState = _;
    return;
  };

  return story;


}


//
// basic action
// t can be a function or an object
// if is a function it's called on ``enter`` event
// if t is an object with enter/exit/update methods
// they're called on state changes
function Action(t) {

  var evt = d3.dispatch('finish');
  var action = t;
  if (t.enter === undefined && !(typeof(t) === 'function' && t.prototype.enter !== undefined)) {
    action = {
      enter: t
    }
  }

  return d3.rebind(action, evt, 'on', 'finish');

}

function Trigger(t) {
  t = t || {}
  t._story = function(story, trigger) {
    this.trigger = trigger;
    this.story = story;
  };

  t.then = function(t, context) {
    this.trigger = function() {
      if (t.trigger) {
        t.trigger();
        if (t.reverse) t.reverse();
      } else if (t.call) {
        t.call(context || self);
      } else {
        throw new Error("then first param should be either function or trigger");
      }
    };
  };
  return t;
}

///
// executes actions in parallel
// usage:
//    Parallel(action1, action2, action3)
//
// raises finish when all the tasks has been completed
//
function Parallel () {
  var actions = Array.prototype.slice.call(arguments);
  var tasksLeft;

  function _Parallel() {}

  function start() {
    tasksLeft = actions.length;
  }

  function done() {
    if (--tasksLeft === 0) {
      _Parallel.finish();
    }
  }

  function wait(action) {
    action.on('finish.parallel', function() {
      action.on('finish.parallel', null);
      done();
    });
  }


  _Parallel.enter = function() {
    start();
    for(var i = 0, len = actions.length; i < len; ++i) {
      var a = actions[i];
      if (a.enter) {
        if (a.enter()) {
          wait(a);
        } else {
          done();
        }
      }
    }
  };

  _Parallel.exit = function() {
    start();
    for(var i = actions.length - 1; i >= 0; --i) {
      var a = actions[i];
      if (a.exit) {
        if (a.exit()) {
          wait(a);
        } else {
          done();
        }
      }
    }
  };

  _Parallel.clear = function() {
    for(var i = 0, len = actions.length; i < len; ++i) {
      var a = actions[i];
      a.clear && a.clear();
    }
  }

  _Parallel = Action(_Parallel);
  return _Parallel;
}



///
// executes actions serially, waits until the previous task
// is completed to start with the second and so on
// usage:
//    Step(action1, action2, action3)
//
// raises finish when all the tasks has been completed
//
function Step() {

  var actions = Array.prototype.slice.call(arguments);
  var queue;

  function _Step() {}

  function next(method) {
    if (queue.length === 0) {
      _Step.finish();
      return;
    }
    var a = queue.pop();
    if (a.on) {
      a.on('finish.chain', function() {
        a.on('finish.chain', null);
        next(method);
      });
    }
    if (!a[method] || !a[method]()) {
      next(method);
      if(a.on) a.on('finish.chain', null);
    }
  }

  _Step.enter = function() {
    // call enter on each action
    queue = actions.slice().reverse();
    next('enter');
    return true;
  }

  _Step.exit = function() {
    // call exit on each action
    queue = actions.slice();
    next('exit');
    return true;
  }

  _Step.clear = function() {
    for(var i = 0, len = actions.length; i < len; ++i) {
      var a = actions[i];
      a.clear && a.clear();
    }
  }

  _Step = Action(_Step);
  return _Step;
}

// check change between two states and triggers
function Edge(a, b) {
  var s = 0;
  function t() {}
  a._story(null, function() {
    if(s !== 0) {
      t.trigger();
    }
    s = 0;
  });
  b._story(null, function() {
    if(s !== 1) {
      t.trigger();
    }
    s = 1;
  });
  return Trigger(t);
}



module.exports = {
  Story: Story,
  Action: Action,
  Trigger: Trigger,
  Step: Step,
  Parallel: Parallel,
  Edge: Edge
};

