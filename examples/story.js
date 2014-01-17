
function Map() {
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    }).addTo(map);


    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup("<b>Hello world!</b><br />I am a popup.");

    return map;

};

function Story() {

  var triggers = [];
  var currentState = null;

  function story(t) {
  }

  story.addState = function(a, b, opts) {
    var i = triggers.length;
    triggers.push({
      a: a, 
      b: b,
      opts: opts
    });
    a.story(story, function() { 
      if (story.state() !== i) {
        story.state(i);
        b(); 
      }
    });
    b.story(story, function() { 
      if (story.state() !== i) {
        state.state(i);
        a(); 
      }
    });
    return story;
  };

  story.state = function(_) {
    if(_ === undefined) return currentState;
    currentState = _;
  };

  return story;


}

function map() {
  var map = Map()
  var story;

  function _m() {}

  _m.story = function(_) {
    story = _;
  };

  _m.moveTo = function(ll) {
    var f = function() {
      map.panTo(ll);
    };

    f.story = _m.story;
    return f;
  };
  return _m;
}

function StoryMapPluggin(m) {
}


function timeline() {
}



Scroll._scrolls = [];

function Scroll(el, px) {

  var story;
  var trigger;

  function scroll() {
  }
  scroll.el = el;
  scroll.px = px;

  if(Scroll._scrolls.length === 0) {
    window.addEventListener('scroll', function() {
      var t = null;
      Scroll._scrolls.forEach(function(s) {
        var e = document.getElementById(s.el);
        if(e.getBoundingClientRect().top < s.px) {
          t = s;
        }
      });
      if (t) {
        t.trigger();
      }
    });
  }

  Scroll._scrolls.push(scroll);

  scroll.inverse = function() {};
  scroll.trigger = function() { trigger(); };

  scroll.story = function(s, t) {
    story = s;
    trigger = t;
  };

  return scroll;
}
