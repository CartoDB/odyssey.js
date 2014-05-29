
function share_dialog(url) {
  //var share_iframe = "<iframe width='100%' height='520' frameborder='0' src='http://piensaenpixel.cartodb.com/viz/7e3ff036-e26c-11e3-bbdb-0e10bcd91c2b/embed_map?title=true&description=true&search=false&shareable=true&cartodb_logo=true&layer_selector=false&legends=false&scrollwheel=true&fullscreen=true&sublayer_options=1&sql=' allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>"

  // show the dialog
  var s = d3.select('#share_dialog').style('display', 'block');

  function close() {
    s.style('display', 'none');
  }

  var input = s.select('#shareInput');

  // update url
  input.attr('value', url);

  // select input on click
  input.on("click", function() {
    this.select();
  });

  // bind events for copy and close on ESP press
  s.selectAll('#closeButton')
    .on('click', function() {
      d3.event.preventDefault();
      close();
    });

  d3.select("body")
    .on("keydown", function() {
      if (d3.event.which === 27) {
        close();
      }
    });
}

module.exports = share_dialog
