
function share_dialog(url, html_url) {
  var share_iframe = "<iframe width='100%' height='520' frameborder='0' src='"+html_url+"' allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>"

  // show the dialog
  var s = d3.select('#share_dialog').style('display', 'block');

  function close() {
    s.style('display', 'none');
  }

  var input = s.select('#shareInput');

  // update url
  input.attr('value', share_iframe);

  s.selectAll('#mode_menu li').classed("selected", false);
  s.select('#mode_menu li.first').classed("selected", true);

  // select input on click
  input.on("click", function() {
    this.select();
  });

  // toggle iframe url
  s.selectAll('#mode_menu a')
    .on('click', function() {
      d3.event.preventDefault();

      s.selectAll('#mode_menu li').classed("selected", false);
      d3.select(this.parentNode).classed("selected", true);

      var type = d3.select(this).attr("data-embed");

      if (type === 'url') {
        input.attr('value', html_url);
      } else if (type === 'iframe') {
        input.attr('value', share_iframe);
      }
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
