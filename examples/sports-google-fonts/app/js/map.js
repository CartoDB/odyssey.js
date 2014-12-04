var Map = {
  initialize: function(options) {
    var self = this;

    this.options = _.extend({}, options);

    // O.Template({
    //   init: function() {
    //     debugger;
    //     var seq = O.Triggers.Sequential();

    //     var baseurl = this.baseurl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
    //     var map = this.map = L.map('map').setView([0, 0], 4);
    //     var basemap = this.basemap = L.tileLayer(baseurl, {
    //       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    //     }).addTo(map);

    //     // enable keys to move
    //     O.Keys().on('map').left().then(seq.prev, seq)
    //     O.Keys().on('map').right().then(seq.next, seq)

    //     var slides = O.Actions.Slides('slides');
    //     var story = O.Story()

    //     this.story = story;
    //     this.seq = seq;
    //     this.slides = slides;
    //   }
    // });

    // cartodb.createLayer(self.map, vizjson, { layerIndex: torqueIndex })
    //   .done(function(layer) {
    //     self.map.fitBounds(vizjson.bounds);

    //     actions.global.duration && layer.setDuration(actions.global.duration);

    //     self.torqueLayer = layer;
    //     self.torqueLayer.stop();

    //     self.map.addLayer(self.torqueLayer);

    //     self.torqueLayer.on('change:steps', function() {
    //       self.torqueLayer.play();
    //       self.torqueLayer.actions = torque(self.torqueLayer);
    //       self._resetActions(actions);
    //     });
    //   }).on('error', function(err) {
    //     console.log("some error occurred: " + err);
    //   });
    // }



    // cdb.vis.Loader.get(VIZJSON_URL, function(vizjson) {
    //   for (var i = 0; i < vizjson.layers.length; ++i) {
    //     if (vizjson.layers[i].type !== 'torque') {
    //       console.log(vizjson.layers[i].options.named);
    //     } else {
    //       console.log(vizjson.layers[i]);
    //     }
    //   }



    // });

  }
}
