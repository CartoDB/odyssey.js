!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.editor=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

var dropdown = _dereq_('./dropdown');
var saveAs = _dereq_('../vendor/FileSaver');
var exp = _dereq_('./gist');

function close(el) {
  var d = d3.select(document.body).selectAll('#actionDropdown').data([]);
  d.exit().remove();
}

function open(el, items, _class) {
  var d = d3.select(document.body).selectAll('#actionDropdown').data([0]);
  // enter
  var ul = d.enter().append('ul').attr('id', 'actionDropdown').style('position', 'absolute');
  if (_class) {
    ul.attr('class', _class);
  }

  // update
  var bbox = el.getBoundingClientRect();
  d.style({
    top: (bbox.top + 25) + "px",
    left: bbox.left + "px",
  });

  var drop = dropdown().items(items);
  d.call(drop);
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


    divOptions.append('a').attr('class', 'downloadButton').on('click', function() {
        var md = el.select('textarea').node().codemirror.getValue();
        exp.zip(md, context.template(), function(zipBlob) {
          saveAs(zipBlob, 'oddysey.zip');
        });
    });

    var templates = context.templates().map(function(d) { return d.title; });

    divOptions.append('a').attr('class', 'shareButton').on('click', function() {
      var md = el.select('textarea').node().codemirror.getValue();
      exp.gist(md, context.template(), function(gist) {
        console.log(gist);
        window.open(gist.html_url);
      });
    });

    divOptions.append('a').attr('class', 'helpButton').on('click', function() {
    });

    divHeader.append('p')
      .attr('id', 'show_slide')
      .text(templates[0])
      .on('click', function(d) {
        d3.event.stopPropagation();
        var self = this;
        open(this, templates, 'drop-right').on('click', function(value) {
          evt.template(value);
          close();
          d3.select(self).text(value);
        });
      });

    var textarea = enter.append('textarea')
      .attr('id', 'code')
      .on('keyup.editor', function() {
        evt.code(this.value);
      });

    textarea.each(function() {
      var codemirror = this.codemirror = CodeMirror.fromTextArea(this, {
        mode: "markdown",
        lineWrapping: true
      });
      this.codemirror.on('change', function(c) {
        evt.code(c.getValue());
        placeActionButtons(el, codemirror);
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
      placeActionButtons(el, this.codemirror);
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

  // adds action to slideNumber.
  // creates it if the slide does not have any action
  function addAction(codemirror, slideNumer, action) {
    // search for a actions block
    var currentLine;
    var c = 0;
    for (var i = slideNumer + 1; i < codemirror.lineCount(); ++i) {
      var line = codemirror.getLineHandle(i).text;
      if (ACTIONS_BLOCK_REGEXP.exec(line)) {
        if (++c === 2) {
          // inser in the previous line
          currentLine = codemirror.getLineHandle(i);
          codemirror.setLine(i, action + "\n" + currentLine.text);
          return;
        }
      } else if(SLIDE_REGEXP.exec(line)) {
        // not found, inser a block
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
           pos: codemirror.heightAtLine(lineNumber),
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
      .on('click', function(d) {
        d3.event.stopPropagation();
        var self = this;
        open(this, context.actions()).on('click', function(e) {
          context.getAction(e, function(action) {
            addAction(codemirror, d.line, action);
          });
          close(self);
        });
      });

    el.on('click.actionbutton', function() {
      //close popup
      close();
    })

    // update
    var LINE_HEIGHT = 28;
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

},{"../vendor/FileSaver":6,"./dropdown":2,"./gist":4}],2:[function(_dereq_,module,exports){

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
var saveAs = _dereq_('../vendor/FileSaver');

var TEMPLATE_LIST =  [{
    title: 'slides',
    description: 'the classic one, like using keynote',
    default: '#slide1\nsome text\n\n#slide2\n more text'
  }, {
    title: 'scroll',
    description: 'the classic one, like using keynote',
    default: '#title\n##headline\n\n#slide1\nsome text\n\n#slide2\n more text'
  }
];


function editor() {

  var body = d3.select(document.body);
  var context = {};

  d3.rebind(context, d3.dispatch('error'), 'on', 'error');

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

  context.template = function(_) {
    if (_) this._template = _;
    return this._template;
  }

  var template = body.select('#template');
  var code_dialog = dialog(context);

  var iframeWindow;
  var $editor = body.append('div')
    .attr('id', 'editor_modal')
    .call(code_dialog);


  d3.select(document.body);

  var callbacks = {};
  window.addEventListener("message", function(event) {
    var msg = JSON.parse(event.data);
    if (msg.id) {
      callbacks[msg.id](msg.data);
      delete callbacks[msg.id];
    }
  });


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

  code_dialog.on('code.editor', function(code) {
    sendCode(code);
    O.Template.Storage.save(code);
  });

  context.sendCode = sendCode;
  context.execCode = execCode;
  context.actions = function(_) {
    if (!arguments.length) return this._actions;
    this._actions = _;
    return this;
  };
  context.getAction = getAction;


  template.on('load', function() {
    iframeWindow = template.node().contentWindow;
    O.Template.Storage.load(function(md) {
      sendCode(md);
      $editor.call(code_dialog.code(md));
    });
    sendMsg({ type: 'actions' }, function(data) {
      context.actions(data);
    });
    if (location.hash.length === 0) {
      // when there is no code, show template selector splash
      d3.select(document.body).call(Splash(context).on('template', function(t) {
        set_template(t);
        var template_data = context.templates(t);
        if (template_data) {
          sendCode(template_data.default);
          $editor.call(code_dialog.code(template_data.default));
        }
      }));
    }
  });

  function set_template(t) {
    template.attr('src', t + ".html");
    context.template(t);
  }

  code_dialog.on('template.editor', function(t) {
    set_template(t);
  });

  set_template('scroll');

}

module.exports = editor;

},{"../vendor/FileSaver":6,"./dialog":1,"./splash":5}],4:[function(_dereq_,module,exports){

function processHTML(html, md, transform) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');

  // transform
  transform && transform(doc)

  md = md.replace(/\n/g, '\\n');
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
    .defer(request, 'css/' + template + '.css')
    .defer(request, '../dist/odyssey.js')
    .awaitAll(ready);

  function ready(error, results) {
    results = results.map(function(r) { 
      return r.responseText;
    });

    callback({
      'oddysey.html': processHTML(results[0], md, function(doc) {
          var js = doc.getElementsByTagName('script');
          for (var i = 0; i < js.length; ++i) {
            var src = js[i].getAttribute('src');
            if (src && src.indexOf('../dist/odyssey.js') === 0) {
              js[i].setAttribute("src", "js/odyssey.js");
              return
            }
          }
       }),
      'js/odyssey.js': results[2],
      'css/slides.css': results[1]
    });
  }
}

function zip(md, template, callback) {
  files(md, template, function(contents) {
      var zip = new JSZip();
      for (var f in contents) {
        zip.file(f, contents[f]);
      }
      callback(zip.generate({ type: 'blob' }));
  });
}

function Gist(md, template, callback) {

  var gistData = null;

  var s = location.pathname.split('/');
  var relocate_url = "http://" + location.host + s.slice(0, s.length - 1).join('/') + "/";
  function relocateAssets(doc) {
    var js = doc.getElementsByTagName('script');
    for (var i = 0; i < js.length; ++i) {
      var src = js[i].getAttribute('src');
      if (src && src.indexOf('http') !== 0) {
        js[i].setAttribute("src", relocate_url + src);
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
        var BLOCKS = 'http://bl.ocks.org/anonymous/raw/'
        console.log(gist);
        callback({
          url: gist.url,
          html_url: BLOCKS + gist.id
        });
      });
  });

}

module.exports = {
  gist: Gist,
  zip: zip
}

},{}],5:[function(_dereq_,module,exports){

function Splash(context) {

  var evt = d3.dispatch('template')

  function _splash() {
    var s = d3.select(document.body)
      .selectAll('.splash')
      .data([0]);

    var div = s.enter().append('div').attr('class', 'splash h-valign');

    var inner_content = div.append('div').attr('class', 'splash_inner')

    inner_content.append('h1').text('Select your template')
    inner_content.append('p').text('templates allow you to change the layout of the styory')
    var templates = inner_content.append('ul').attr('class', 'template_list h-valign')


    var template = templates 
      .selectAll('.template').data(context.templates())
      .enter()
        .append('li')
        .attr('class', 'template h-valign')
        .append ('div')
        .attr('class', 'inner-template')

    template
        .append('h2')
          .text(function(d) {
            return d.title
          })
    template
        .append('p')
          .text(function(d) {
            return d.description
          })

    template
        .append('a').text('SELECT').attr('class', 'button-template')


    template.on('click', function(d) {
      evt.template(d.title);
      _splash.close()
    })

  }

  _splash.close = function() {
    var s = d3.select(document.body)
      .selectAll('.splash')
      .data([]);
    s.exit().remove();
  }

  return d3.rebind(_splash, evt, 'on');

}

module.exports = Splash

},{}],6:[function(_dereq_,module,exports){
/*! FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-01-24
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
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
		  // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, URL = view.URL || view.webkitURL || view
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
					URL.revokeObjectURL(file);
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
				// FF for Android has a nasty garbage collection mechanism
				// that turns all objects that are not pure javascript into 'deadObject'
				// this means `doc` and `save_link` are unusable and need to be recreated
				// `view` is usable though:
				doc = view.document;
				save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
				save_link.href = object_url;
				save_link.download = name;
				var event = doc.createEvent("MouseEvents");
				event.initMouseEvent(
					"click", true, false, view, 0, 0, 0, 0, 0
					, false, false, false, false, 0, null
				);
				save_link.dispatchEvent(event);
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