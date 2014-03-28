
module.exports = {
  Sleep: require('./sleep'),
  Debug: require('./debug'),
  Location: require('./location'),
  Leaflet: {
    Marker: require('./leaflet/marker'),
    Map: require('./leaflet/map'),
    Popup: require('./leaflet/popup')
  },
  CSS: require('./css'),
  Slides: require('./slides')
};
