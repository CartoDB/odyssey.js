
function Splash(context) {

  var evt = d3.dispatch('template')

  function _splash() {
    var s = d3.select(document.body)
      .selectAll('#template_selector')
      .data([0]);

    var div = s.enter().append('div')
      .attr('id', 'template_selector')
      .attr('class', 'splash h-valign');

    var inner_content = div.append('div').attr('class', 'splash_inner')

    inner_content.append('h1').text('Select your template')
    inner_content.append('p').text('Templates give you different ways to unfold you story')
    var templates = inner_content.append('ul').attr('class', 'template_list h-valign')


    var template = templates
      .selectAll('.template').data(context.templates())
      .enter()
        .append('li')
        .attr('class', 'template h-valign')
        .append ('div')
        .attr('class', 'inner-template')

    template
        .append('h2')
          .text(function(d) {
            return d.title
          })
    template
        .append('p')
          .text(function(d) {
            return d.description
          })

    template
      .append('a').text('SELECT').attr('class', 'button-template').on('click', function(d) {
        d3.event.preventDefault();
        console.log(evt.template(d.title))
        evt.template(d.title);
        _splash.close()
      })
  }

  _splash.close = function() {
    var s = d3.select(document.body)
      .selectAll('#template_selector')
      .data([]);
    s.exit().remove();
  }

  return d3.rebind(_splash, evt, 'on');

}

module.exports = Splash
