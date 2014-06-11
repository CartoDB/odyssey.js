
var Action = require('../story').Action;
var Core = require('../core');
var classList = require('../util/classList');

function Slides(el) {


  function slides() {};

  function _activate(idx) {
    var slideElements = Core.getElement(el).children;
    for(var i = 0; i < slideElements.length; ++i) {
      if (i === idx) {
        slideElements[i].classList.add("selected", "selected_slide");
      } else {
        slideElements[i].classList.remove("selected", "selected_slide");
      }
    }
  }

  slides.activate = function(i) {
    return Action(function() {
      _activate(i);
    });
  };

  _activate(-1);

  return slides;

}

module.exports = Slides;