
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

    _reach.clear = function() {
      unregister(_reach);
    }

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

  function unregister(s) {
    var i = scrolls.indexOf(s);
    if (i >= 0) {
      scrolls.splice(i, 1);
    }
  }

  function initScroll() {
    if (!initialized) {
      initialized = true;

      if (!Array.prototype.forEach) {

        Array.prototype.forEach = function (callback, thisArg) {

          var T, k;

          if (this == null) {
            throw new TypeError(" this is null or not defined");
          }

          // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
          var O = Object(this);

          // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
          // 3. Let len be ToUint32(lenValue).
          var len = O.length >>> 0;

          // 4. If IsCallable(callback) is false, throw a TypeError exception.
          // See: http://es5.github.com/#x9.11
          if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
          }

          // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (thisArg) {
            T = thisArg;
          }

          // 6. Let k be 0
          k = 0;

          // 7. Repeat, while k < len
          while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

              // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
              kValue = O[k];

              // ii. Call the Call internal method of callback with T as the this value and
              // argument list containing kValue, k, and O.
              callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
          }
          // 8. return undefined
        };
      }

      function scrollEach() {
        scrolls.forEach(function(s) {
          s.scroll(window.scrollY);
        });
      }

      if (!window.addEventListener) {
        scroller.attachEvent("onscroll", function load(event) {
          scrollEach();
        });
      } else {
        window.addEventListener("scroll", function load(event) {
          scrollEach();
        });
      }
    }
  }

  return scroll;
}

Scroll._scrolls = [];
module.exports = Scroll;
