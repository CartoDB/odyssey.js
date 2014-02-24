
var Action = require('../../story').Action;

function MarkerActions(marker) {

  function _marker() {}

  _marker.addTo = function(map) {
    return Action(function() {
      marker.addTo(map);
    });
  };

  return _marker;

}


L.Marker.addInitHook(function () {
  this.actions = MarkerActions(this);
});

module.exports = MarkerActions;

//marker.actions.addTo(map);

//addState(, map.actions.moveTo(..).addMarker(m)
