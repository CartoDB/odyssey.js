!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.editor=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

var dropdown = _dereq_('./dropdown');
var saveAs = _dereq_('../vendor/FileSaver');
var Splash = _dereq_('./splash');
var exp = _dereq_('./gist');
var share_dialog = _dereq_('./share_dialog');
var debounce = _dereq_('./utils').debounce;


function close(el) {
  var d = d3.select(document.body).selectAll('#actionDropdown').data([]);
  d.exit().remove();
}

function open(el, items, _class, offset) {
  var d = d3.select(document.body).selectAll('#actionDropdown').data([0]);
  // enter
  var ul = d.enter().append('ul').attr('id', 'actionDropdown').style('position', 'absolute');
  if (_class) {
    d3.selectAll('#actionDropdown').attr('class', _class);
  } else {
    d3.selectAll('#actionDropdown').attr('class', '');
  }

  offset = offset || { x: 0, y: 0 }

  // update
  var bbox = el.getBoundingClientRect(),
      h = bbox.top + 25 + offset.y;
  d.style({
    top: h + "px",
    left: (bbox.left + offset.x) + "px",
  });

  var drop = dropdown().items(items);
  d.call(drop);

  if ((d3.select('#actionDropdown').node().offsetHeight+h - d3.select('#editor_modal').node().offsetHeight) > 120) {
    var top_ = (h - d3.select('#actionDropdown').node().offsetHeight - 40)+"px";

    d3.selectAll('#actionDropdown')
      .classed('drop-top', true)
      .style('top', top_)
  }

  return drop;

}
function dialog(context) {
  var code = '';
  var evt = d3.dispatch('code', 'template');

  function _dialog (el) {

    var codeEditor = el.selectAll('textarea#code')
      .data([code]);

    var enter = codeEditor.enter();
    var divHeader = enter.append('div')
      .attr('class','header');
    var divOptions = enter.append('div')
      .attr('class','options');

    divHeader.append('a')
      .attr('class','expandButton')
      .on('click', function(){
        // console.log(event.target);
        _expand();
      })

    divHeader.append('h1')
      .text('Odyssey editor');

    var templates = context.templates().map(function(d) { return d.title; });

    var help = divOptions.append('ul').attr('class', 'h-left');

    help.append('li').append('a').attr('class', 'helpButton').attr('href', '/odyssey.js/documentation');

    var optionsMap = divOptions.append('ul').attr('class', 'h-right');

    optionsMap.append('li').append('a').attr('class', 'collapseButton').on('click', function() {

      if (el.style('bottom') === 'auto') {
        el.select('.CodeMirror').style('padding', '20px 20px 20px 72px');
        el.style('bottom', 'auto').style('min-height', '330px');
        el.style('bottom', '80px').style('height', 'auto');
        el.selectAll('.actionButton').style("visibility", "visible");
        d3.select(this).classed('expandButton', false);
        el.select('#actions_bar').classed('collapseActions', false);
      } else {
        el.style('bottom', 'auto').style('min-height', '0');
        el.style('bottom', 'auto').style('height', '119px');
        d3.select(this).classed('expandButton', true);
        el.selectAll('.actionButton').style("visibility", "hidden");
        el.select('#actions_bar').classed('collapseActions', true);
        el.select('.CodeMirror').style('padding', '0');
      }

    });

    optionsMap.append('li').append('a').attr('class', 'downloadButton').on('click', function() {
        var md = el.select('textarea').node().codemirror.getValue();
        exp.zip(md, context.template(), function(zip) {
          saveAs(zip.generate({ type: 'blob' }), 'oddysey.zip');

          // var link = document.createElement("a");
          // link.download = 'odyssey.zip';
          // link.href = "data:application/zip;base64," + zip.generate({type:"base64"});
          // link.click();
        });
    });

    optionsMap.append('li').append('a').attr('class', 'shareButton').on('click', function() {
      var md = el.select('textarea').node().codemirror.getValue();

      exp.gist(md, context.template(), function(gist) {
        console.log(gist);
        //window.open(gist.html_url);
        share_dialog(gist.url, gist.html_url);
      });

      var client = new ZeroClipboard(document.getElementById("copy-button"), {
        moviePath: "../vendor/ZeroClipboard.swf"
      });

      client.on("load", function(client) {
        client.on('datarequested', function(client) {
          var input = document.getElementById('shareInput');

          client.setText(input.value);
        });

        client.on("complete", function(client, args) {
          this.textContent = "Copied!";
        });
      });
    });

    divHeader.append('a')
      .attr('id', 'show_slide')
      .text(templates[0])
      .attr('href', '/odyssey.js/editor/editor.html')
      .on('click', function(d) {
        d3.event.preventDefault();
        d3.select(document.body).call(Splash(context).on('template', function(t) {
          evt.template(t);
        }));

      });


    context.on('template_change.editor', function(t) {
      divHeader.select('#show_slide').text(t);
    });

    var actions_bar = enter.append('div')
      .attr('id', 'actions_bar');

    var textarea = enter.append('textarea')
      .attr('id', 'code')
      .on('keyup.editor', function() {
        evt.code(this.value);
      });

    var sendCode = debounce(function(code) {
      evt.code(code);
    }, 100);



    textarea.each(function() {
      var codemirror = this.codemirror = CodeMirror.fromTextArea(this, {
        mode: "markdown",
        lineWrapping: true
      });
      var codemirror_wrap = el.select('.CodeMirror-wrap');
      var showActions = debounce(function() { placeActionButtons(codemirror_wrap, codemirror); }, 500);
      var hideActions = debounce(function() { el.selectAll('.actionButton').remove(); }, 20);
      codemirror.on('scroll',  function() {
        showActions();
        hideActions();
      });
      this.codemirror.on('change', function(c) {
        // change is raised at the beginning with any real change
        if (c.getValue()) {
          sendCode(c.getValue());
          var codemirror_wrap = el.select('.CodeMirror-wrap');
          placeActionButtons(codemirror_wrap, codemirror);
        }
      });
    });

    function _expand() {
      var _t = d3.select('#editor_modal');
      var _hassClass = _t.classed('expanded')
      _t.classed('expanded', !_hassClass);

      var _b = d3.select('a.expandButton');
      _b.classed('expanded', !_hassClass);

    }

    // update
    codeEditor.each(function(d) {
      this.codemirror.setValue(d);
      var codemirror_wrap = el.select('.CodeMirror-wrap');
      placeActionButtons(codemirror_wrap, this.codemirror);
    });

    context.on('error.editor', function(errors) {
      var e = el.selectAll('.error').data(errors)
      e.enter()
        .append('div')
        .attr('class', 'error')
      e.text(String)

      e.exit().remove();
    })

  }

  var SLIDE_REGEXP = /^#[^#]+/i;
  var ACTIONS_BLOCK_REGEXP = /\s*```/i;

  function getLines(codemirror, i, j) {
    var lines = '';
    for(var k = i; k < j; ++k) {
      lines += codemirror.getLine(k) + '\n';
    }
    return lines;
  }

  // adds action to slideNumber.
  // creates it if the slide does not have any action
  function addAction(codemirror, slideNumer, action) {
    // parse properties from the new actions to next compare with
    // the current ones in the slide
    var currentActions = O.Template.parseProperties(action);
    var currentLine;
    var c = 0;
    var blockStart;

    // search for a actions block
    for (var i = slideNumer + 1; i < codemirror.lineCount(); ++i) {
      var line = codemirror.getLineHandle(i).text;
      if (ACTIONS_BLOCK_REGEXP.exec(line)) {
        if (++c === 2) {
          // parse current slide properties
          var slideActions = O.Template.parseProperties(getLines(codemirror, blockStart, i));
          var updatedActions = {};

          // search for the same in the slides
          for (var k in currentActions) {
            if (k in slideActions) {
              updatedActions[k] = currentActions[k];
            }
          }

          // remove the ones that need update
          for (var k in updatedActions) {
            for (var linePos = blockStart + 1; linePos < i; ++linePos) {
              if (k in O.Template.parseProperties(codemirror.getLine(linePos))) {
                codemirror.removeLine(linePos);
                i -= 1;
              }
            }
          }

          // insert in the previous line
          currentLine = codemirror.getLineHandle(i);
          codemirror.setLine(i, action + "\n" + currentLine.text);
          return;
        } else {
          blockStart = i;
        }
      } else if(SLIDE_REGEXP.exec(line)) {
        // not found, insert a block
        currentLine = codemirror.getLineHandle(slideNumer);
        codemirror.setLine(slideNumer, currentLine.text + "\n```\n" + action +"\n```\n");
        return;
      }
    }
    // insert at the end
    currentLine = codemirror.getLineHandle(slideNumer);
    codemirror.setLine(slideNumer, currentLine.text + "\n```\n"+ action + "\n```\n");
  }


  // place actions buttons on the left of the beggining of each slide
  function placeActionButtons(el, codemirror) {

    // search for h1's
    var positions = [];
    var lineNumber = 0;
    codemirror.eachLine(function(a) {
      if (SLIDE_REGEXP.exec(a.text)) {
         positions.push({
           pos: codemirror.heightAtLine(lineNumber)-66, // header height
           line: lineNumber
         });
      }
      ++lineNumber;
    });

    //remove previously added buttons
    el.selectAll('.actionButton').remove()

    var buttons = el.selectAll('.actionButton')
      .data(positions);

    // enter
    buttons.enter()
      .append('div')
      .attr('class', 'actionButton')
      .style({ position: 'absolute' })
      .html('add')
      .on('click', function(d, i) {
        d3.event.stopPropagation();
        var self = this;
        open(this, context.actions()).on('click', function(e) {
          context.getAction(e, function(action) {
            addAction(codemirror, d.line, action);
            context.changeSlide(i);
          });
          close(self);
        });
      });

    el.on('click.actionbutton', function() {
      //close popup
      close();
    })

    // update
    var LINE_HEIGHT = 38;
    buttons.style({
      top: function(d) { return (d.pos - LINE_HEIGHT) + "px"; },
      left: 16 + "px"
    });

  }

  _dialog.code = function(_) {
    if (!arguments.length) return _;
    code = _;
    return _dialog;
  };

  return d3.rebind(_dialog, evt, 'on');
}

module.exports = dialog;

},{"../vendor/FileSaver":9,"./dropdown":2,"./gist":4,"./share_dialog":5,"./splash":6,"./utils":7}],2:[function(_dereq_,module,exports){

function dropdown() {
  var evt = d3.dispatch('click');
  var items = [];

  function _dropdown(el) {
    var i = el.selectAll('.item').data(items);
    // enter
    i.enter().append('li').attr('class', 'item').on('click', function(d) {
      evt.click(d.value || d);
    });
    // update
    i.text(function(d) { return d.text || d; });
    // remove
    i.exit().remove();

    return _dropdown;
  }

  // gets a list of { value: '...', text: '...' }
  _dropdown.items = function(_) {
    if (!arguments.length) return _;
    items = _;
    return _dropdown;
  };

  return d3.rebind(_dropdown, evt, 'on');
}


module.exports = dropdown;

},{}],3:[function(_dereq_,module,exports){

//i18n placeholder
function _t(s) { return s; }


var dialog = _dereq_('./dialog');
var Splash = _dereq_('./splash');
var DOMParser = _dereq_('../vendor/DOMParser');
var utils = _dereq_('./utils');


var TEMPLATE_LIST =  [{
    title: 'slides',
    description: 'Display visualization chapters like slides in a presentation',
    default: '```\n-title: "Title"\n-author: "Name"\n-baseurl: "http://{s}.api.cartocdn.com/base-light/{z}/{x}/{y}.png"\n```\n\n#slide1\nsome text\n\n#slide2\nmore text'
  }, {
    title: 'scroll',
    description: 'Create a visualization that changes as your reader moves through your narrative',
    default: '```\n-title: "Title"\n-author: "Name"\n-baseurl: "http://{s}.api.cartocdn.com/base-light/{z}/{x}/{y}.png"\n```\n\n#title\n##headline\n\n#slide1\nsome text\n\n\n#slide2\nmore text'
  }, {
    title: 'torque',
    description: 'Link story elements to moments in time using this animated map template',
    default: '```\n-title: "Title"\n-author: "Name"\n-vizjson: "http://viz2.cartodb.com/api/v2/viz/521f3768-eb3c-11e3-b456-0e10bcd91c2b/viz.json"\n-duration: 30\n-baseurl: "http://{s}.api.cartocdn.com/base-light/{z}/{x}/{y}.png"\n```\n\n#title\n##headline\n\n#slide1\n```\n-step: 100\n```\nsome text\n\n\n#slide2\n```\n-step: 200\n```\nmore text'
  }
];





function editor(callback) {

  var body = d3.select(document.body);
  var context = {};

  d3.rebind(context, d3.dispatch('error', 'template_change'), 'on', 'error', 'template_change');

  context.templates = function(_) {
    if (_) {
      var t = TEMPLATE_LIST.map(function(d) { return d.title; }).indexOf(_);
      if (t >= 0) {
        return TEMPLATE_LIST[t];
      }
      return null;
    }
    return TEMPLATE_LIST;
  };

  context.save = utils.debounce(function(_) {
    if (this.code() && this.template()) {
      O.Template.Storage.save(this.code(), this.template());
    }
  }, 100, context);

  context.template = function(_) {
    if (_) {
      if (this._template !== _) {
        this._template = _;
        this.template_change(_);
      }
    }
    return this._template;
  }

  context.code = function(_) {

    if (_) {
      this._code = _;
      console.log("code", _);
    }
    return this._code;
  }

  var template = body.select('#template');
  var code_dialog = dialog(context);

  var iframeWindow;
  var $editor = body.append('div')
    .attr('id', 'editor_modal')
    .call(code_dialog);


  d3.select(document.body);

  var callbacks = {};

  function readMessage() {
    var msg = JSON.parse(event.data);

    if (msg.id) {
      callbacks[msg.id](msg.data);
      delete callbacks[msg.id];
    }
  }

  if (!window.addEventListener) {
    window.attachEvent("message", function load(event) {
      readMessage();
    });
  } else {
    window.addEventListener("message", function load(event) {
      readMessage();
    });
  }

  function sendMsg(_, done) {
    var id = new Date().getTime();
    callbacks[id] = done;
    _.id = id;
    iframeWindow.postMessage(JSON.stringify(_), iframeWindow.location);
  }

  function execCode(_, done) {
    var id = new Date().getTime();
    callbacks[id] = done;
    iframeWindow.postMessage(JSON.stringify({
      type: 'code',
      code: _,
      id: id
    }), iframeWindow.location);
  }

  function sendCode(_) {
    sendMsg({
      type: 'md',
      code: _
    }, function(err) {
      if (err) {
        err = [err]
      } else {
        err = []
      }
      context.error(err);
    });
  }

  function getAction(_, done) {
    sendMsg({ type: 'get_action', code: _ }, done);
  }

  function changeSlide(_) {
    sendMsg({ type: 'change_slide', slide: _ });
  }

  code_dialog.on('code.editor', function(code) {
    sendCode(code);
    context.code(code);
    context.save();
  });

  context.sendCode = sendCode;
  context.execCode = execCode;
  context.actions = function(_) {
    if (!arguments.length) return this._actions;
    this._actions = _;
    return this;
  };
  context.getAction = getAction;
  context.changeSlide = changeSlide;


  template.on('load', function() {
    iframeWindow = template.node().contentWindow;
    O.Template.Storage.load(function(md, template) {
      sendCode(md);
      set_template(template);

      if (template === 'torque') {
        if (md.indexOf('vizjson:') === -1) {
          var iviz = md.lastIndexOf('```'),
              viz = "-vizjson: \"http://viz2.cartodb.com/api/v2/viz/521f3768-eb3c-11e3-b456-0e10bcd91c2b/viz.json\"\n";

          md = md.slice(0, iviz) + viz + md.slice(iviz);
        }

        if (md.indexOf('duration:') === -1) {
          var idur = md.lastIndexOf('```'),
              dur = "-duration: \"30\"\n";

          md = md.slice(0, idur) + dur + md.slice(idur);
        }
      }

      $editor.call(code_dialog.code(md));
    });
    sendMsg({ type: 'actions' }, function(data) {
      context.actions(data);
    });

    // when there is no code, show template selector splash
    if (!context.code() && location.hash.length === 0) {
      d3.select(document.body).call(Splash(context).on('template', function(t) {
        var template_data = context.templates(t);
        if (template_data) {
          context.code(template_data.default);
          set_template(t);
          sendCode(template_data.default);
          $editor.call(code_dialog.code(template_data.default));
        }
      }));

      callback && callback();
    }
  });

  function set_template(t) {
    var html_url = t + ".html";
    if (template.attr('src') !== html_url) {
      template.attr('src', t + ".html");
      context.template(t);
      context.save();
    }
  }

  code_dialog.on('template.editor', function(t) {
    set_template(t);
  });

  //set_template('scroll');

}

module.exports = editor;

},{"../vendor/DOMParser":8,"./dialog":1,"./splash":6,"./utils":7}],4:[function(_dereq_,module,exports){
function relocateAssets(doc) {
  var s = location.pathname.split('/');
  var relocate_url = "http://cartodb.github.io" + s.slice(0, s.length - 1).join('/') + "/";

  var js = doc.getElementsByTagName('script');
  for (var i = 0; i < js.length; ++i) {
    var src = js[i].getAttribute('src');
    if (src && src.indexOf('http') !== 0) {
      js[i].setAttribute("src", (relocate_url + src).replace(/editor\/..\//g, ''));
    }
  }

  var css = doc.getElementsByTagName('link');
  for (var i = 0; i < css.length; ++i) {
    var href = css[i].getAttribute('href');
    if (href && href.indexOf('http') !== 0) {
      css[i].setAttribute("href", relocate_url + href);
    }
  }
}

function processHTML(html, md, transform) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');

  // transform
  transform && transform(doc);

  md = md.replace(/\n/g, '\\n').replace(/"/g, '\\"');
  // insert oddyset markdown
  var script = doc.createElement('script');
  script.innerHTML = 'window.ODYSSEY_MD = "' + md + '"';
  doc.body.appendChild(script);
  return doc.documentElement.innerHTML;
}

function files(md, template, callback) {
  function request(r, callback) {
    d3.xhr(r).get(callback);
  }
  queue(2)
    .defer(request, template + '.html')
    .awaitAll(ready);

  function ready(error, results) {
    results = results.map(function(r) {
      return r.responseText;
    });

    callback({
      'oddysey.html': processHTML(results[0], md, relocateAssets)
    });
  }
}

function zip(md, template, callback) {
  files(md, template, function(contents) {
    var zip = new JSZip();
    for (var f in contents) {
      zip.file(f, contents[f]);
    }
    callback(zip);
  });
}

function Gist(md, template, callback) {
  var gistData = null;

  d3.xhr(template + ".html").get(function(err, xhr) {
    var html = xhr.responseText;
    var payload = {
        "description": "Odyssey.js template",
        "public": true,
        "files": {
          'index.html': {
            content: processHTML(html, md, relocateAssets)
          }
        }
    };

    d3.xhr('https://api.github.com/gists')
      .header("Content-Type", "application/json")
      .post(JSON.stringify(payload), function(err, xhr) {
        gist = JSON.parse(xhr.responseText);
        var BLOCKS = 'http://bl.ocks.org/anonymous/raw/';
        console.log(gist);
        callback({
          url: gist.url,
          html_url: BLOCKS + gist.id,
        });
      });
  });

}

module.exports = {
  gist: Gist,
  zip: zip
}

},{}],5:[function(_dereq_,module,exports){

function share_dialog(url, html_url) {
  var share_iframe = "<iframe width='100%' height='520' frameborder='0' src='"+html_url+"' allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>"

  // show the dialog
  var s = d3.select('#share_dialog').style('display', 'block');

  function close() {
    s.style('display', 'none');
  }

  var input = s.select('#shareInput');

  // update url
  input.attr('value', share_iframe);

  // select input on click
  input.on("click", function() {
    this.select();
  });

  // toggle iframe url
  s.selectAll('#mode_menu a')
    .on('click', function() {
      d3.event.preventDefault();

      s.selectAll('#mode_menu li').classed("selected", false);
      d3.select(this.parentNode).classed("selected", true);

      var type = d3.select(this).attr("data-embed");

      if (type === 'url') {
        input.attr('value', html_url);
      } else if (type === 'iframe') {
        input.attr('value', share_iframe);
      }
    });


  // bind events for copy and close on ESP press
  s.selectAll('#closeButton')
    .on('click', function() {
      d3.event.preventDefault();
      close();
    });

  d3.select("body")
    .on("keydown", function() {
      if (d3.event.which === 27) {
        close();
      }
    });
}

module.exports = share_dialog

},{}],6:[function(_dereq_,module,exports){

function Splash(context) {

  var evt = d3.dispatch('template')

  function _splash() {
    var s = d3.select(document.body)
      .selectAll('#template_selector')
      .data([0]);

    var div = s.enter().append('div')
      .attr('id', 'template_selector')
      .attr('class', 'splash h-valign');

    var inner_content = div.append('div').attr('class', 'splash_inner')

    inner_content.append('h1').text('Select your template')
    inner_content.append('p').text('Templates give you different ways to unfold you story')
    var templates = inner_content.append('ul').attr('class', 'template_list h-valign')


    var template = templates
      .selectAll('.template').data(context.templates())
      .enter()
        .append('li')
        .attr('class', 'template h-valign')
        .append ('div')
        .attr('class', function(d) {
            return 'inner-template '+d.description
          })

    template
        .append('div')
        .attr('class', 'anim')
        .append('div')
        .attr('id', function(d) {
          return d.title
        })
        .attr('data-baseurl', function(d) {
          return d.title
        })
        .attr('data-grid', '5x5')
        .attr('data-blocksize', '150x115')
        .attr('data-frames', '50')
        .attr('data-fps', '30')
        .attr('data-autoplay', 'stop')
        .attr('data-autoload', 'true')
        .attr('data-retina', 'false')
        .attr('data-idx', 0)

    template
        .append('p')
          .text(function(d) {
            return d.description
          })

    template
      .append('a').text(function(d) {
          return d.title
        })
      .attr('class', 'button-template').on('click', function(d) {
        d3.event.preventDefault();
        evt.template(d.title);
        _splash.close()
      })
  }

  _splash.close = function() {
    var s = d3.select(document.body)
      .selectAll('#template_selector')
      .data([]);
    s.exit().remove();
  }

  return d3.rebind(_splash, evt, 'on');

}

module.exports = Splash

},{}],7:[function(_dereq_,module,exports){

function debounce(fn, t, ctx) {
  var i;
  return function() {
    var args = arguments;
    clearTimeout(i);
    i = setTimeout(function() { fn.apply(ctx || window, args); }, t);
  }
}

module.exports = {
  debounce: debounce
}

},{}],8:[function(_dereq_,module,exports){
/*
 * DOMParser HTML extension
 * 2012-09-04
 *
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function(DOMParser) {
  "use strict";

  var
    DOMParser_proto = DOMParser.prototype
  , real_parseFromString = DOMParser_proto.parseFromString
  ;

  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if ((new DOMParser).parseFromString("", "text/html")) {
      // text/html parsing is natively supported
      return;
    }
  } catch (ex) {}

  DOMParser_proto.parseFromString = function(markup, type) {
    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
      var
        doc = document.implementation.createHTMLDocument("")
      ;
            if (markup.toLowerCase().indexOf('<!doctype') > -1) {
              doc.documentElement.innerHTML = markup;
            }
            else {
              doc.body.innerHTML = markup;
            }
      return doc;
    } else {
      return real_parseFromString.apply(this, arguments);
    }
  };
}(DOMParser));

},{}],9:[function(_dereq_,module,exports){
/* FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-05-27
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  // IE 10+ (native saveAs)
  || (typeof navigator !== "undefined" &&
      navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  // Everyone else
  || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" &&
	    /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = !view.externalHost && "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		, deletion_queue = []
		, process_deletion_queue = function() {
			var i = deletion_queue.length;
			while (i--) {
				var file = deletion_queue[i];
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			}
			deletion_queue.length = 0; // clear queue
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, get_object_url = function() {
					var object_url = get_URL().createObjectURL(blob);
					deletion_queue.push(object_url);
					return object_url;
				}
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_object_url(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						window.open(object_url, "_blank");
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_object_url(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									deletion_queue.push(file);
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	view.addEventListener("unload", process_deletion_queue, false);
	saveAs.unload = function() {
		process_deletion_queue();
		view.removeEventListener("unload", process_deletion_queue, false);
	};
	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
  module.exports = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
  define([], function() {
    return saveAs;
  });
}
},{}]},{},[3])
(3)
});