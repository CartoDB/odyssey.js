
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

  function leaflet_move_method(name) {
    _map[name] = function() {
      var args = arguments;
      return Action({
        enter: function() {
          this.moveEnd = function() {
            map.off('moveend', this.moveEnd, this);
            this.finish();
          };
          map.on('moveend', this.moveEnd, this);
          map[name].apply(map, args);
          return true;
        },

        clear: function() {
          map.off('moveend', this.moveEnd, this);
        }
      });
    };
  }


  // leaflet methods
  leaflet_move_method('panTo');
  leaflet_move_method('setView');
  leaflet_move_method('setZoom');

  return _map;
}


if (typeof window.L !== 'undefined') {
  L.Map.addInitHook(function () {
    this.actions = MapActions(this);
  });
}
module.exports = MapActions;

