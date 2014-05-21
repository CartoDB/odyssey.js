
require('../../vendor/markdown');

var Template = function(template) {
  var initialized = false;

  window.addEventListener("message", function(event) {
    var msg = JSON.parse(event.data);
    template.editor = true;

    if (!initialized) {
      configureEditor();
      initialized = true;
    }

    function sendMsg(_) {
      event.source.postMessage(JSON.stringify({
        id: msg.id,
        data: _
      }), event.currentTarget.location);
    }

    if (msg.type === 'md') {
      var actions = actionsFromMarkdown(msg.code);
      try {
        template.update(actions);
        sendMsg(null)
      } catch(e) {
        sendMsg(e.message)
      }
    } else if (msg.type === 'actions') {
      sendMsg(Object.keys(template.actions));
    } else if (msg.type === 'get_action') {
      sendMsg(template.actions[msg.code].call(template))
    } else if (msg.type === 'code') {
      //TODO: error management
      sendMsg(eval(msg.code));
    }
  }, false);

  template.init(function() {
  });

  function configureEditor() {
    // add helpers
    if (template.map && template.map instanceof L.Map) {
      new L.CrossHair('assets/img/crosshair.png').addTo(template.map);
    }
  }

  window.onload = function() {
    var origin = location.pathname.split('/')[1];

    Template.Storage.load(function(md) {
      template.update(actionsFromMarkdown(md));
    });
  }
};

Template.Storage = {

  save: function(md) {
    location.hash = "md/" + btoa(md);
  },

  load: function(done) {
    if (window.ODYSSEY_MD) {
      done(window.ODYSSEY_MD.replace(/<br \/>/g, '\n'));
      return;
    }

    var h = location.hash;
    if (done && h) {
      var tk = h.split('/');
      if (tk[0] === '#md') {
        done(atob(tk.slice(1).join('/')));
      }
    }
  }
};

function Slide(tree, actions, properties) {

  var html;
  var md_tree = tree;
  var properties = properties;

  var action;

  function compile(context) {
    action = O.Step.apply(window,
      actions.map(function(o) {
        try {
          var f = Function("S", "return " + o + ";");
        } catch (e) {
          throw new Error("error while compiling " + o + ": " + e.message);
        }
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
  return props;
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
          slide && slide.actions.push.apply(slide.actions, subel[1].split('\n').filter(function(a) {
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


module.exports = Template;
