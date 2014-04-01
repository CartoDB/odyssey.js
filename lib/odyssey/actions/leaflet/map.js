
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

