
function share_dialog(url) {
  //var share_iframe = "<iframe width='100%' height='520' frameborder='0' src='http://piensaenpixel.cartodb.com/viz/7e3ff036-e26c-11e3-bbdb-0e10bcd91c2b/embed_map?title=true&description=true&search=false&shareable=true&cartodb_logo=true&layer_selector=false&legends=false&scrollwheel=true&fullscreen=true&sublayer_options=1&sql=' allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>"

  // show the dialog
  var s = d3.select('#share_dialog').style('display', 'block');

  function close() {
    s.style('display', 'none');
  }
  // update url 
  s.selectAll('input').attr('value', url);

  // bind events for copy and close on ESP press
  s.selectAll('a')
    .on('click', close)
    .on("keydown", function() {
      if (d3.event.e.which === 27) {
        close();
      }
    })

}

module.exports = share_dialog
