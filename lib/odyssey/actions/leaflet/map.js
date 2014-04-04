
var Action = require('../../story').Action;

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

  function leaflet_move_method(name, signal) {
    _map[name] = function() {
      var args = arguments;
      return Action({
        enter: function() {
          this.moveEnd = function() {
            map.off(signal, this.moveEnd, this);
            this.finish();
          };
          map.on(signal, this.moveEnd, this);
          map[name].apply(map, args);
          return true;
        },

        clear: function() {
          map.off(signal, this.moveEnd, this);
        }
      });
    };
  }

  _map.moveLinearTo = function(from, to, options) {
    var opt = options || { k: 2 };
    var animationTimer;
    var posTarget;
    var delta = 20;

    // leaflet map animation is not being used because
    // when the action is updated the map just stop the animatin
    // and start again
    // the animtion should be smooth
    return Action({

      enter: function () {
        posTarget = map.project(map.getCenter());
        animationTimer = setInterval(function() {
          var c = map.project(map.getCenter());
          var px = c.x + (posTarget.x - c.x)*delta*0.001* opt.k;
          var py = c.y + (posTarget.y - c.y)*delta*0.001* opt.k;
          map.panTo(map.unproject(L.point(px, py)), { animate: false });
        }, delta);
      },

      update: function (t) {
        var p0 = map.project(from);
        var p1 = map.project(to);
        posTarget = p0.add(p1.subtract(p0).multiplyBy(t));
      },

      exit: function() {
        clearInterval(animationTimer);
      },

      clean: function() {
        this.exit();
      }

    });
  };


  // leaflet methods
  leaflet_move_method('panTo', 'moveend');
  leaflet_move_method('setView', 'moveend');
  leaflet_move_method('setZoom', 'zoomend');

  return _map;
}


if (typeof window.L !== 'undefined') {
  L.Map.addInitHook(function () {
    this.actions = MapActions(this);
  });
}
module.exports = MapActions;

