
function Splash(context) {

  var evt = d3.dispatch('template')

  function _splash() {
    var s = d3.select(document.body)
      .selectAll('.splash')
      .data([0]);

    var div = s.enter().append('div').attr('class', 'splash');
    var template = div
      .selectAll('.template').data(context.templates())
      .enter()
        .append('div')
        .attr('class', 'template')

    template
        .append('h1')
          .text(function(d) {
            return d.title
          })
    template
        .append('p')
          .text(function(d) {
            return d.description
          })

    template.on('click', function(d) {
      evt.template(d.title);
      _splash.close()
    })

  }

  _splash.close = function() {
    var s = d3.select(document.body)
      .selectAll('.splash')
      .data([]);
    s.exit().remove();
  }

  return d3.rebind(_splash, evt, 'on');

}

module.exports = Splash
