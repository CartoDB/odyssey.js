/**
# dot progress
ui widget that controls dot progress 

## usage
in order to use it you need to instanciate using a container, so for example:

  <div id="dots"></div>

  ...

  var progress = DotProgress('dots')

  // we set the number of slides
  progress.count(10);

  // we can activate it as an action
  // then the story enters in this state the second dot
  // will be activated
  story.addState(trigger, progress.activate(1))

  // when an user clicks on the dot it can trigger an action
  story.addState(progress.step(1), action);

## styling
the html rendered is the following:
```
  <div id="dots">
    <ul>
      <li><href="#0"></a></li>
      <li><href="#1" class="active"></a></li>
      <li><href="#2"></a></li>
      <li><href="#2"></a></li>
    </ul>
  </div>
```

so you can use active class to style the active one
 
 */

var Core = require('../core');

function DotProgress(el) {
  var count = 0;
  var element = Core.getElement(el);
  var triggers = {};

  function _progress() {
    return _progress;
  }

  function render() {
    var html = '<ul>';
    for(var i = 0; i < count; ++i) { 
      html += '<li><a slide-index="' + i + '" href="#' + i + '"></a></li>'; 
    }
    html += "</ul>";
    element.innerHTML = html;
  }

  _progress.count = function(_) {
    count = _;
    render();
    return _progress;
  };

  // returns an action to activate the index
  _progress.activate = function(activeIndex) {
    return O.Action(function () {
      var children = element.children[0].children;
      for(var i = 0; i < children.length; ++i) {
        children[i].children[0].setAttribute('class', '');
      }
      children[activeIndex].children[0].setAttribute('class', 'active');
    });
  };

  element.onclick = function(e) {
   e = e || window.event;

    var idx = (e.target || e.srcElement).getAttribute('slide-index');
    var t = triggers[idx];
    if (t) {
      t.trigger();
    }
  };

  _progress.step = function(i) {
    var t = O.Trigger();
    triggers[i] = t;
    return t;
  };

  return _progress;

}

module.exports = DotProgress;
