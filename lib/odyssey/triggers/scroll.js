

function cte(c) { return function() { return c; } }

//TODO: add support for elements != window
function Scroll() {

  var scroller = window;
  var scrolls = [];
  var initialized = false;
  var level = cte(0);

  function scroll() {}

  scroll.reach = function(el) {
    function _reach () {}
    Trigger(_reach);

    _reach.scroll = function() {
      var e = document.getElementById(el);
      var bounds = e.getBoundingClientRect();
      var level = _reach.level();
      if(bounds.top <= level && bounds.bottom >= level) {
        var t = (level - bounds.top)/(bounds.bottom - bounds.top);
        _reach.trigger(t);
      }
    };

    /// sets level in px or % of element
    // level('50%') level(100)
    _reach.level = function(_) {
      if (!arguments.length) {
        return level();
      }
      if (typeof(_) === 'number') {
        level = cte(_);
      } else {
        level = function() {
          //remove %
          var percent = +_.replace('%', '');
          return scroller.innerHeight * percent * 0.01;
        }
      }
      return _reach;
    }

    // add to working scrolls
    register(_reach);

    return _reach;
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