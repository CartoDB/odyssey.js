
var Action = require('../../story').Action;

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
