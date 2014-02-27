
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

