!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Odyssey=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

var e = _dereq_('./lib/odyssey/story');
e.Actions = _dereq_('./lib/odyssey/actions');
e.Triggers = _dereq_('./lib/odyssey/triggers');
e.Core = _dereq_('./lib/odyssey/core');
module.exports = e;

},{"./lib/odyssey/actions":4,"./lib/odyssey/core":10,"./lib/odyssey/story":11,"./lib/odyssey/triggers":12}],2:[function(_dereq_,module,exports){

var Action = _dereq_('../story').Action;


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

},{"../story":11}],3:[function(_dereq_,module,exports){

var Action = _dereq_('../story').Action;
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

},{"../story":11}],4:[function(_dereq_,module,exports){

module.exports = {
  Sleep: _dereq_('./sleep'),
  Debug: _dereq_('./debug'),
  Location: _dereq_('./location'),
  Leaflet: {
    Marker: _dereq_('./leaflet/marker'),
    Map: _dereq_('./leaflet/map')
  },
  CSS: _dereq_('./css'),
  Slides: _dereq_('./slides')
};

},{"./css":2,"./debug":3,"./leaflet/map":5,"./leaflet/marker":6,"./location":7,"./sleep":8,"./slides":9}],5:[function(_dereq_,module,exports){

var Action = _dereq_('../../story').Action;

function MapActions(map) {

  function _map() {}

  // helper method to translate leaflet methods to actions
  function leaflet_method(name) {
    _map[name] = function() {
      var args = arguments;
      return Action(function() {
        map[name].apply(map, args);
      });
    };
  }

  // leaflet methods
  leaflet_method('panTo');

  return _map;
}


if (typeof window.L !== 'undefined') {
  L.Map.addInitHook(function () {
    this.actions = MapActions(this);
  });
}
module.exports = MapActions;


},{"../../story":11}],6:[function(_dereq_,module,exports){

var Action = _dereq_('../../story').Action;

function MarkerActions(marker) {

  function _marker() {}

  _marker.addTo = function(map) {
    return Action(function() {
      marker.addTo(map);
    });
  };

  _marker.addRemove = function(map) {
    return Action({
      enter: function() {
        marker.addTo(map);
      },
      exit: function() {
        map.removeLayer(marker);
      }
    });
  };

  _marker.icon = function(iconEnabled, iconDisabled) {
    iconEnabled = L.icon({
      iconUrl: iconEnabled
    });
    iconDisabled = L.icon({
      iconUrl: iconDisabled
    });
    return Action({
      enter: function() {
        marker.setIcon(iconEnabled);
      },
      exit: function() {
        marker.setIcon(iconDisabled);
      }
    });
  }

  return _marker;
}


if (typeof window.L !== 'undefined') {
  L.Marker.addInitHook(function () {
    this.actions = MarkerActions(this);
  });
}
module.exports = MarkerActions;

//marker.actions.addTo(map);
//addState(, map.actions.moveTo(..).addMarker(m)

},{"../../story":11}],7:[function(_dereq_,module,exports){

var Action = _dereq_('../story').Action;

var loc = window.location;
var Location = {

  // changes the browser url hash
  changeHash: function(hash) {
    if (hash === undefined) throw new Error("hash should be a string");
    return Action(function() {
      loc.hash = hash;
    });
  }

};


module.exports = Location;

},{"../story":11}],8:[function(_dereq_,module,exports){

var Action = _dereq_('../story').Action;

function Sleep(ms) {

  return Action({

    enter: function() {
      setTimeout(this.finish, ms);
      return true;
    }

  });
}

module.exports = Sleep;


},{"../story":11}],9:[function(_dereq_,module,exports){

var Action = _dereq_('../story').Action;
var Core = _dereq_('../core');

function Slides(el) {

  var slideElements = Core.getElement(el).children;
  
  function slides() {};

  function _activate(idx) {
    for(var i = 0; i < slideElements.length; ++i) {
      if (i === idx) {
        slideElements[i].style.display = "block";
      } else {
        slideElements[i].style.display = "none";
      }
    }
  };

  slides.activate = function(i) {
    return Action(function() {
      _activate(i);
    });
  };

  _activate(-1);

  return slides;

}

module.exports = Slides;

},{"../core":10,"../story":11}],10:[function(_dereq_,module,exports){

function getElement(el) {
  if(typeof jQuery !== 'undefined') {
    if (el instanceof jQuery) {
      return el[0];
    } else if(typeof el === 'string') {
      if (el[0] === '#' || el[0] === '.') {
        return getElement($(el));
      }
    }
  } 
  return document.getElementById(el);
}

module.exports = {
  getElement: getElement
};

},{}],11:[function(_dereq_,module,exports){

_dereq_('../../vendor/d3.custom');

function Story() {

  var triggers = [];
  var currentState = null;
  var prevState = null;

  function story(t) {
  }

  // event non attached to states
  story.addEvent = function(trigger, action) {
    trigger._story(story, function() {
      action.enter();
    });
    return story;
  };

  // go to state index
  story.go = function(index, opts) {
    opts = opts || {};
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
  t._story = function(story, trigger) {
    this.trigger = trigger;
    this.story = story;
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

  _Parallel = Action(_Parallel);
  return _Parallel;
}



///
// executes actions serially, waits until the previous task
// is completed to start with the second and so on
// usage:
//    Chain(action1, action2, action3)
//
// raises finish when all the tasks has been completed
//
function Chain() {

  var actions = Array.prototype.slice.call(arguments);
  var queue;

  function _Chain() {}

  function next(method) {
    if (queue.length === 0) {
      _Chain.finish();
      return;
    }
    var a = queue.pop();
    if (!a[method] || !a[method]()) {
      next(method);
    } else {
      a.on('finish.chain', function() {
        a.on('finish.chain', null);
        next(method);
      });
    }
  }

  _Chain.enter = function() {
    // call enter on each action
    queue = actions.slice().reverse();
    next('enter');
    return true;
  }

  _Chain.exit = function() {
    // call exit on each action
    queue = actions.slice();
    next('exit');
    return true;
  }

  _Chain = Action(_Chain);
  return _Chain;
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
  return Odyssey.Trigger(t);
}



module.exports = {
  Story: Story,
  Action: Action,
  Trigger: Trigger,
  Chain: Chain,
  Parallel: Parallel,
  Edge: Edge
};


},{"../../vendor/d3.custom":14}],12:[function(_dereq_,module,exports){

module.exports = {
  Scroll: _dereq_('./scroll')
};

},{"./scroll":13}],13:[function(_dereq_,module,exports){

var Trigger = _dereq_('../story').Trigger;
var Core = _dereq_('../core');

function cte(c) { return function() { return c; } }

//TODO: add support for elements != window
function Scroll() {

  var scroller = window;
  var scrolls = [];
  var initialized = false;
  var offset = cte(0);
  var condition = null;

  function scroll() {}

  scroll.reach = function(el) {
    function _reach () {}
    Trigger(_reach);

    _reach.scroll = function(scrollY) {
      var e = Core.getElement(el);
      var bounds = e.getBoundingClientRect();
      var offset = _reach.offset();
      var t = condition(bounds, offset, scrollY);
      if (t !== null && t !== undefined) {
        _reach.trigger(t);
      }
      return _reach;
    };

    _reach.condition = function(_) {
      if (!arguments.length) {
        return condition;
      }
      condition = _;
    }

    /// sets offset in px or % of element
    // offset('50%') offset(100)
    _reach.offset = function(_) {
      if (!arguments.length) {
        return offset();
      }
      if (typeof(_) === 'number') {
        offset = cte(_);
      } else {
        offset = function() {
          //remove %
          var percent = +_.replace('%', '');
          return scroller.innerHeight * percent * 0.01;
        }
      }
      return _reach;
    }

    _reach.reverse = function() {
      var e = document.getElementById(el);
      var bounds = e.getBoundingClientRect();
      var offset = _reach.offset();
      scroller.scrollTo(0, bounds.top - offset);
    };

    // add to working scrolls
    register(_reach);

    return _reach;
  };

  scroll.within = function(el) {
    var r = scroll.reach(el);
    r.condition(function(bounds, offset) {
      if(bounds.top <= offset && bounds.bottom >= offset) {
        var t = (offset - bounds.top)/(bounds.bottom - bounds.top);
        return t;
      }
    });
    return r;
  };

  scroll.less = function(el, opt) {
    opt = opt || {};
    var r = scroll.reach(el);
    var fixedBoundsTop;
    if (opt.fixed) {
      var e = Core.getElement(el);
      fixedBoundsTop = scroller.scrollY + e.getBoundingClientRect().top;
    }
    r.condition(function(bounds, offset, scrollY) {
      var t = opt.fixed ? fixedBoundsTop: bounds.top;
      var o = opt.fixed ? scrollY: offset;
      if(t >= o) {
        return 0;
      }
    });
    return r;
  };

  scroll.greater = function(el, opt) {
    opt = opt || {};
    var r = scroll.reach(el);
    var fixedBoundsTop;
    if (opt.fixed) {
      var e = Core.getElement(el);
      fixedBoundsTop = scroller.scrollY + e.getBoundingClientRect().top;
    }
    r.condition(function(bounds, offset, scrollY) {
      var t = opt.fixed ? fixedBoundsTop: bounds.top;
      var o = opt.fixed ? scrollY: offset;
      if(t <= o) {
        return 0;
      }
    });
    return r;
  };

  function register(s) {
    scrolls.push(s);
    initScroll();
  }

  function initScroll() {
    if (!initialized) {
      initialized = true;
      scroller.addEventListener('scroll', function() {
        scrolls.forEach(function(s) {
          s.scroll(window.scrollY);
        });
      });
    }
  }

  return scroll;
}

Scroll._scrolls = [];
module.exports = Scroll;

},{"../core":10,"../story":11}],14:[function(_dereq_,module,exports){
d3 = (function(){
  var d3 = {version: "3.3.10"}; // semver
function d3_class(ctor, properties) {
  try {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  } catch (e) {
    ctor.prototype = properties;
  }
}

d3.map = function(object) {
  var map = new d3_Map;
  if (object instanceof d3_Map) object.forEach(function(key, value) { map.set(key, value); });
  else for (var key in object) map.set(key, object[key]);
  return map;
};

function d3_Map() {}

d3_class(d3_Map, {
  has: function(key) {
    return d3_map_prefix + key in this;
  },
  get: function(key) {
    return this[d3_map_prefix + key];
  },
  set: function(key, value) {
    return this[d3_map_prefix + key] = value;
  },
  remove: function(key) {
    key = d3_map_prefix + key;
    return key in this && delete this[key];
  },
  keys: function() {
    var keys = [];
    this.forEach(function(key) { keys.push(key); });
    return keys;
  },
  values: function() {
    var values = [];
    this.forEach(function(key, value) { values.push(value); });
    return values;
  },
  entries: function() {
    var entries = [];
    this.forEach(function(key, value) { entries.push({key: key, value: value}); });
    return entries;
  },
  forEach: function(f) {
    for (var key in this) {
      if (key.charCodeAt(0) === d3_map_prefixCode) {
        f.call(this, key.substring(1), this[key]);
      }
    }
  }
});

var d3_map_prefix = "\0", // prevent collision with built-ins
    d3_map_prefixCode = d3_map_prefix.charCodeAt(0);

d3.dispatch = function() {
  var dispatch = new d3_dispatch,
      i = -1,
      n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  return dispatch;
};

function d3_dispatch() {}

d3_dispatch.prototype.on = function(type, listener) {
  var i = type.indexOf("."),
      name = "";

  // Extract optional namespace, e.g., "click.foo"
  if (i >= 0) {
    name = type.substring(i + 1);
    type = type.substring(0, i);
  }

  if (type) return arguments.length < 2
      ? this[type].on(name)
      : this[type].on(name, listener);

  if (arguments.length === 2) {
    if (listener == null) for (type in this) {
      if (this.hasOwnProperty(type)) this[type].on(name, null);
    }
    return this;
  }
};

function d3_dispatch_event(dispatch) {
  var listeners = [],
      listenerByName = new d3_Map;

  function event() {
    var z = listeners, // defensive reference
        i = -1,
        n = z.length,
        l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }

  event.on = function(name, listener) {
    var l = listenerByName.get(name),
        i;

    // return the current listener, if any
    if (arguments.length < 2) return l && l.on;

    // remove the old listener, if any (with copy-on-write)
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }

    // add the new listener, if any
    if (listener) listeners.push(listenerByName.set(name, {on: listener}));

    return dispatch;
  };

  return event;
}
// Copies a variable number of methods from source to target.
d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}
  return d3;
})();

},{}]},{},[1])
(1)
});