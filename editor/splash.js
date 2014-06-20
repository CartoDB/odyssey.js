
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
    inner_content
      .append('p')
      .attr('class', 'last')
      .text('Templates give you different ways to unfold your story')
    var templates = inner_content.append('ul').attr('class', 'template_list h-valign')


    var template = templates
      .selectAll('.template').data(context.templates())
      .enter()
        .append('li')
        .attr('class', 'template h-valign')
        .append ('div')
        .attr('class', function(d) {
            return 'inner-template '
          })

    template
        .append('div')
        .attr('class', 'anim')
        .append('div')
        .attr('id', function(d) {
          return d.title
        })
        .attr('data-baseurl', function(d) {
          return d.title
        })
        .attr('data-grid', '6x8')
        .attr('data-blocksize', '180x134')
        .attr('data-frames', function(d) {
          if (d.title == "slides") return 150
            else return 50
        })
        .attr('data-fps', '30')
        .attr('data-autoplay', 'stop')
        .attr('data-autoload', 'true')
        .attr('data-retina', 'false')
        .attr('data-idx', 0)

    template
        .append('p')
          .text(function(d) {
            return d.description
          })

    template
      .append('a').text(function(d) {
          return d.title
        })
      .attr('class', 'button-template').on('click', function(d) {
        d3.event.preventDefault();
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
