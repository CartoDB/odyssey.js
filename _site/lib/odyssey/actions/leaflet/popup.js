
/**
directional popup allows to create popups in the left and the right of a point,
not only on the top.

Same api than L.popup but you can spcify ``potision`` to 'left' or 'right'

*/

var Action = require('../../story').Action;


if (typeof window.L !== 'undefined') {

var DirectionalPopup = L.Popup.extend({
    _updatePosition: function() {
        L.Popup.prototype._updatePosition.call(this);
        var offset = L.point(this.options.offset),
            animated = this._animated;

        switch(this.options.position) {
          case 'left':
            this._container.style.bottom = 'auto';
            this._container.style.left = 'auto';
            this._container.style.right = offset.x + (animated ? 0 : pos.x) + "px";
            break;
          case 'right':
            this._container.style.bottom = 'auto';
            this._container.style.left =  offset.x + "px";
            break;
      }
    }
});

L.DirectionalPopup = DirectionalPopup;
L.directionalPopup = function (options, source) {
  return new L.DirectionalPopup(options, source);
};

function PopupActions(popup) {

  function _popup() {}

  // helper method to translate leaflet methods to actions
  function leaflet_method(name) {
    _popup[name] = function() {
      var args = arguments;
      return Action(function() {
        popup[name].apply(popup, args);
      });
    };
  }

  // leaflet methods
  leaflet_method('openOn');
  _popup.openClose = function(map) {
    if (!map) {
      throw new Error("openClose gets map as first param");
    }
    return Action({
      enter: function() {
        popup.openOn(map);
      },

      exit: function() {
        map.closePopup(popup);
      }

    });
  };

  return _popup;
}


  L.Popup.addInitHook(function () {
    this.actions = PopupActions(this);
  });
}

