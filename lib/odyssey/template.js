
require('../../vendor/markdown');
var mapActions = {
    'move map to current position': function() {
      var center = this.map.getCenter()
      return '- center: [' + center.lat.toFixed(4) + ', ' + center.lng.toFixed(4) + ']\n- zoom: ' + this.map.getZoom()
    },
    'show marker at current position': function() {
      var center = this.map.getCenter()
      return 'L.marker([' + center.lat.toFixed(4) + ', ' + center.lng.toFixed(4) + ']).actions.addRemove(S.map)';
    },
    'sleep': function() {
      return "O.Actions.Sleep(1000)";
    }
};

var Template = function(template) {
  var initialized = false;

  function readMessage(event) {
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
      }), event.currentTarget ? event.currentTarget.location : event.source.location);
    }

    if (msg.type === 'md') {
      var actions = actionsFromMarkdown(msg.code);
      try {
        template.update(actions);
        sendMsg(null);
      } catch(e) {
        sendMsg(e.message);
      }
    } else if (msg.type === 'actions') {
      var actions = [];
      if (template.map && template.map instanceof L.Map) {
        for (var k in mapActions) {
          actions.push(k);
        }
      }
      if (template.actions) {
        for (var k in template.actions) {
          actions.push(k);
        }
      }
      sendMsg(actions);
    } else if (msg.type === 'get_action') {
      if (msg.code in mapActions) {
        sendMsg(mapActions[msg.code].call(template));
      } else {
        sendMsg(template.actions[msg.code].call(template));
      }
    } else if (msg.type === 'code') {
      sendMsg(eval(msg.code));
    } else if (msg.type === 'change_slide') {
      template.changeSlide && template.changeSlide(msg.slide);
    }
  }

  if (!window.addEventListener) {
    window.attachEvent("message", function load(event) {
      readMessage(event);
    });
  } else {
    window.addEventListener("message", function load(event) {
      readMessage(event);
    });
  }

  template.init(function() { });

  function configureEditor() {
    // add helpers
    if (template.map && template.map instanceof L.Map) {
      new L.CrossHair('//cartodb.github.io/odyssey.js/img/crosshair.png').addTo(template.map);
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

  save: function(md, template) {
    location.hash = "md/" + template + "/" + btoa(md);
  },

  load: function(done) {
    if (document.getElementById('md_template')) {
      done(document.getElementById('md_template').text);
      return;
    }

    var h = location.hash;
    if (done && h) {
      // #md/template/base_64_markdown
      var tk = h.split('/');
      if (tk[0] === '#md') {
        done(atob(tk.slice(2).join('/')), tk[1]);
      }
    }
  }
};

function Slide(tree, actions, prop) {

  var html;
  var md_tree = tree;
  var properties = prop;

  var action;

  function compile(context) {
    propertiesToActions();
    //sort actions by order
    actions.sort(function(a, b) {
      return a.order - b.order;
    });

    if (!('map' in Array.prototype)) {
      Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
          if (i in this)
              other[i]= mapper.call(that, this[i], i, this);
        return other;
      };
    }

    action = O.Step.apply(window,
      actions.map(function(a) {
        var o = a.cmd;
        try {
          var f = Function("S", "return " + o + ";");
        } catch (e) {
          throw new Error("error while compiling " + o + ": " + e.message);
        }
        return f(context);
      })
    );
  }

  /*
   * there are special propertues like pos, marker and so 
   * on that should become actions
   */
  function propertiesToActions() {
    for (var k in properties) {
      var prop = properties[k];
      switch (k) {
        case 'center':
          var pos = prop.value;
          if (properties.zoom === undefined) {
            actions.push({
              order: prop.order,
              cmd: 'S.map.actions.panTo([' + pos[0] + ',' + pos[1] + '])'
            });
          } else {
            actions.push({
              order: prop.order,
              cmd: 'S.map.actions.setView([' + pos[0] + ',' + pos[1] + '], ' + properties.zoom.value + ')'
            });
          }
        case 'zoom':
          if (!properties.center) {
            actions.push({
              order: prop.order,
              cmd: 'S.map.actions.setZoom(' + properties.zoom.value+ ')'
            });
          }
      }
    }
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

var prop_re = /^-([^:]+):(.*)/;
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
          var lines = subel[1].split('\n');

          for (var ln = 0; ln < lines.length; ++ln) {
            var line = lines[ln];
            if (trim(line) !== '') {
              // if matches property, parse it
              if (prop_re.exec(line)) {
                var p = parseProperties(subel[1]);
                var prop = slide ? slide.properties: globalProperties
                for(var k in p) {
                  prop[k] = {
                    order: ln,
                    value: p[k]
                  }
                }
              } else {
                slide && slide.actions.push({
                  cmd: line,
                  order: ln
                });
              }
            }
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

  // remove the order for globalProperties
  slides.global = {};
  for(var k in globalProperties) {
    slides.global[k] = globalProperties[k].value;
  }

  return slides;
}


// return a list of Slide objects
function actionsFromMarkdown(md) {
  var md_tree = markdown.parse(md);
  return md2json(md_tree);
}


Template.parseProperties = parseProperties;

module.exports = Template;
