
module.exports = {
  Sleep: require('./sleep'),
  Debug: require('./debug'),
  Location: require('./location'),
  Audio: require('./html5audio'),
  Leaflet: {
    Marker: require('./leaflet/marker'),
    Map: require('./leaflet/map'),
    Popup: require('./leaflet/popup')
  },
  CSS: require('./css'),
  Slides: require('./slides'),
  MiniProgressBar: require('./mini_progressbar')
};
