
var Action = require('../story').Action;
var Core = require('../core');

function Slides(el) {

  
  function slides() {};

  function _activate(idx) {
    var slideElements = Core.getElement(el).children;
    for(var i = 0; i < slideElements.length; ++i) {
      if (i === idx) {
        slideElements[i].style.display = "block";
      } else {
        slideElements[i].style.display = "none";
      }
    }
  }
  function _hide(idx) {
    var slideElements = Core.getElement(el).children;
    for(var i = 0; i < slideElements.length; ++i) {
      slideElements[i].style.display = "none";
    }
  }

  slides.hide = function(i) {
    return Action(function() {
      _hide(i);
    });
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
