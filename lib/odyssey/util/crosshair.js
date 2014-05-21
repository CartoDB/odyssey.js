/**
 * new L.CrossHair('http://image.com/image', { x: 10, y :10 }).addTo(map)
 */
if (typeof window.L !== 'undefined') {

L.CrossHair = L.Control.extend({

  initialize: function(img, size) {
    this.image = new Image();
    this.image.onload = L.bind(this._updatePos, this);
    this.image.src = img;
    if (size) {
      this.image.width = size.x;
      this.image.height = size.y;
    }
  },

  _updatePos: function() {
    if (this._map) {
      var w = this.image.width >> 1;
      var h = this.image.height >> 1;
      w = this._map.getSize().x/2.0 - w;
      h = this._map.getSize().y/2.0 - h;
      L.DomUtil.setPosition(this.image, { x: w, y: h });
    }
  },

  addTo: function(map) {
    var r = L.Control.prototype.addTo.call(this, map);
    // remove leaflet-top and leaflet-right classes
    this.image.parentNode.setAttribute('class', '');
    map.on('resize', L.bind(this._updatePos, this));
    return r;
  },

  onRemove: function(map) {
    map.off('resize', null, this);
  },

  onAdd: function(map) {
    this._updatePos();
    return this.image;
  }

});

}
