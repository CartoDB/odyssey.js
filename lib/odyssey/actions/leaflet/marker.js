
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

//marker.actions.addTo(map);

//addState(, map.actions.moveTo(..).addMarker(m)
