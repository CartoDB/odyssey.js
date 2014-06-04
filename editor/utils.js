
function debounce(fn, t, ctx) {
  var i;
  return function() {
    var args = arguments;
    clearTimeout(i);
    i = setTimeout(function() { fn.apply(ctx || window, args); }, t);
  }
}

module.exports = {
  debounce: debounce
}
