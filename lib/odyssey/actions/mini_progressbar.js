
var Action = require('../story').Action;

/**
 * mini progress var adds a small line to the top of the browser
 * and moves according to story progress
 * usage:
 * var pg = MiniProgressBar()
 * story.addAction(trigger, pg.percent(10)) //goes to 10%
 */

var MiniProgressBar = function(el) {

  var defaultStyle =  {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '3px',
    display: 'inline-block',
    background: '#ff7373',
    'z-index': 2
  };

  var pg = {};

  // create an element and apply default style
  var div = document.createElement('div');
  div.setAttribute('class', 'oddysey-miniprogressbar');
  for (var s in defaultStyle) {
    div.style[s] = defaultStyle[s];
  }

  // append to element or to tge body
  (el || document.body).appendChild(div);
  
  /**
   * returns an action that moves the percentaje bar to the specified one
   */
  pg.percent = function(p) {
    return Action(function() {
      div.style.width = p + "%";
    });
  };

  return pg;
}

module.exports = MiniProgressBar;
