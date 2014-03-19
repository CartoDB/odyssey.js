

/*
var Action = Backbone.Model.extend({

});

var Actions = Backbone.Collection.extend({

})
*/

function Slide(tree, actions, properties) {

  var html; 
  var md_tree = tree;
  var properties = properties;

  var action;

  function compile(context) {
    action = O.Chain.apply(window, 
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

  _slide.props = function() {
    return properties || {}
  };

  _slide.get = function(_) {
    return (properties || {})[_];
  }

  return _slide;
}

function trim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}

var prop_re = /^-([^:]+):(.*)/
function parseProperties(code) {
  var props = {};
  var lines = code.split('\n');
  for (var i = 0; i < lines.length; ++i) {
    var e = prop_re.exec(lines[i]);
    if (e) {
      try {
      props[trim(e[1])] = JSON.parse(trim(e[2]));
      } catch(e) {
      }
    }
  }
  return props
}

/**
 * given a markdown parsed tree return a list of slides with
 * html and actions
 */

function md2json(tree) {
  var slide = null;
  var slides = [];
  var globalProperties = {}
  var elements = tree.slice(1);
  for (var i = 0; i < elements.length; ++i) {
    var el = elements[i];
    var add = true;
    if (el[0] === 'header' && el[1].level === 1) {
      if (slide) slides.push(Slide(slide.md_tree, slide.actions, slide.properties));
      slide = {
        md_tree: [],
        html: '',
        actions: [],
        properties: {}
      };
    } else if (el[0] === 'para') {
      // search inline code inside it
      var actions = [];
      for(var j = 1; j < el.length; ++j) {
        var subel = el[j];
        if (subel[0] === "inlinecode") {
          slide.actions.push.apply(slide.actions, subel[1].split('\n').filter(function(a) { 
            return trim(a) !== "" && !prop_re.exec(a);
          }))
          // props
          var p = parseProperties(subel[1]);
          var prop = slide ? slide.properties: globalProperties
          for(var k in p) {
            prop[k] = p[k];
          }

          // remove from list
          el.splice(j, 1); 
          --j;
        }
      }
    }
    add && slide && slide.md_tree.push(el);
  }
  if (slide) slides.push(Slide(slide.md_tree, slide.actions, slide.properties));

  slides.global = globalProperties;

  return slides;
}


function actionsFromMarkdown(md) {
  var md_tree = markdown.parse(md);
  return md2json(md_tree);
}

