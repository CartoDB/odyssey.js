
function debounce(fn, t, ctx) {
  var i;
  return function() {
    var args = arguments;
    clearTimeout(i);
    i = setTimeout(function() { fn.apply(ctx || window, args); }, t);
  }
}

function set_template(t) {
  var html_url = t + ".html";
  if (template.attr('src') !== html_url) {
    template.attr('src', t + ".html");
    context.template(t);
    context.save();
  }
}

module.exports = {
  debounce: debounce,
  set_template: set_template
}
