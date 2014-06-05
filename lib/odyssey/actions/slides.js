
var Action = require('../story').Action;
var Core = require('../core');

function Slides(el) {


  function slides() {};

  function _activate(idx) {
    var slideElements = Core.getElement(el).children;
    for(var i = 0; i < slideElements.length; ++i) {
      if (i === idx) {
        var $slidesContainer = document.getElementById("slides_container")
        if ($slidesContainer.style.display === 'none') {
          $slidesContainer.style.display = "block";
        }

        slideElements[i].style.display = "block";
      } else {
        slideElements[i].style.display = "none";
      }
    }

    for(var i = 0; i < slideElements.length; ++i) {
      if (i === idx) {
        if (slideElements[i].offsetHeight+169+40+80 >= window.innerHeight) {
          document.getElementById("slides_container").style.bottom = "80px";
          var h = document.getElementById("slides_container").offsetHeight;

          slideElements[i].style.height = h-169+"px";
          document.getElementById("slides_container").style.minHeight = h-80+"px";
        } else {
          document.getElementById("slides_container").style.bottom = "auto";
          document.getElementById("slides_container").style.minHeight = "0";
          slideElements[i].style.height = "auto";
        }
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
