
var Action = require('../story').Action;
var Core = require('../core');

function Slides(el) {

  var slideElements = Core.getElement(el).children;
  
  function slides() {};

  function _activate(idx) {
    for(var i = 0; i < slideElements.length; ++i) {
      if (i === idx) {
        slideElements[i].style.display = "block";
      } else {
        slideElements[i].style.display = "none";
      }
    }
  };

  slides.activate = function(i) {
    return Action(function() {
      _activate(i);
    });
  };

  _activate(-1);

  return slides;

}

module.exports = Slides;
