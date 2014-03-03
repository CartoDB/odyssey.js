
var Trigger = require('../story').Trigger;
var Core = require('../core');

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
