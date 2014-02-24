
/*
function Map() {
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    }).addTo(map);


    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup("<b>Hello world!</b><br />I am a popup.");

    return map;
L.Map.mergeOptions({
  drawControlTooltips: true,
  drawControl: false
});

L.Map.addInitHook(function () {
  if (this.options.drawControl) {
    this.drawControl = new L.Control.Draw();
    this.addControl(this.drawControl);
  }
});
map.oddysey.addMarker()

};
*/


function Story() {

  var triggers = [];
  var currentState = null;
  var prevState = null;

  function story(t) {
  }

  story.addState = function(a, b, opts) {
    var i = triggers.length;

    triggers.push({
      a: a, 
      b: b,
      opts: opts
    });

    a._story(story, function() { 
      if (story.state() !== i) {

        // current state
        story.state(i);

        // raise exit
        if (prevState !== null) {
            var prev = triggers[prevState].b;
            prev.exit && prev.exit();
        }

        // enter in current state
        b.enter();
      }
    });

    return story;
  };

  story.addLinearState = function(a, b, opts) {
    var i = triggers.length;
    triggers.push({
      a: a, 
      b: b,
      opts: opts
    });

    a._story(story, function(t) {
      if (story.state() !== i) {
        // current state
        story.state(i);

        // raise exit
        if (prevState !== null) {
          var prev = triggers[prevState].b;
          prev.exit && prev.exit();
        }

        // enter in current state
        b.enter();
      } else {
        b.update(t);
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
}

function Chain() {

  var actions = Array.prototype.slice.call(arguments);
  var queue;

  function _Chain() {};

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
      })
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

module.exports = {
  Story: Story,
  Action: Action,
  Trigger: Trigger,
  Chain: Chain,
}

