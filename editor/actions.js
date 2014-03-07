

/*
var Action = Backbone.Model.extend({

});

var Actions = Backbone.Collection.extend({

})
*/

function Slide(tree, actions) {

  var html; 
  var md_tree = tree;

  var action;

  function compile(context) {
    action = O.Parallel.apply(window, 
      actions.map(function(o) {
        var f = Function("S", "return " + o + ";");
        return f(context);
      })
    );
  }

  function _slide(context) {
    if (!action) compile(context);
    return action;
  }

  _slide.html = function() {
    if (!html) {
      html = markdown.toHTML(['markdown'].concat(md_tree));
    }
    return html;
  };

  return _slide;
}

/**
 * given a markdown parsed tree return a list of slides with
 * html and actions
 */

function md2json(tree) {
  var slide = null;
  var slides = [];
  var elements = tree.slice(1);
  for (var i = 0; i < elements.length; ++i) {
    var el = elements[i];
    var add = true;
    if (el[0] === 'header') {
      if (slide) slides.push(Slide(slide.md_tree, slide.actions));
      slide = {
        md_tree: [],
        html: '',
        actions: []
      };
    } else if (el[0] === 'para') {
      // search inline code inside it
      var actions = [];
      for(var j = 1; j < el.length; ++j) {
        var subel = el[j];
        if (subel[0] === "inlinecode") {
          slide.actions.push.apply(slide.actions, subel[1].split('\n').filter(function(a) { return a != ""; }))
          el.splice(j, 1); 
          --j;
        }
      }
    }
    add && slide && slide.md_tree.push(el);
  }
  if (slide) slides.push(Slide(slide.md_tree, slide.actions));

  return slides;
}


function actionsFromMarkdown(md) {
  var md_tree = markdown.parse(md);
  return md2json(md_tree);
}

