
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
      }, 
      clear: function() {
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
      },
      clear: function() { }
    });
  }

  return _marker;
}

function PathActions(path) {
  function _path() {};

  _path.toggleStyle = function(styleDisabled, styleEnabled) {
    return Action({
      enter: function() {
        path.setStyle(styleEnabled);
      },
      exit: function() {
        path.setStyle(styleDisabled);
      },
      clear: function() { }
    });
  }

  return _path;
}


if (typeof window.L !== 'undefined') {
  L.Marker.addInitHook(function () {
    this.actions = MarkerActions(this);
  });
  L.Path.addInitHook(function () {
    this.actions = PathActions(this);
  })
}
module.exports = MarkerActions;

//marker.actions.addTo(map);
//addState(, map.actions.moveTo(..).addMarker(m)
