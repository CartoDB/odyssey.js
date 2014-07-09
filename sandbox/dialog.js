
var dropdown = require('./dropdown');
var saveAs = require('../vendor/FileSaver');
var Splash = require('./splash');
var exp = require('./gist');
var share_dialog = require('./share_dialog');
var debounce = require('./utils').debounce;


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
  var evt = d3.dispatch('code', 'template', 'basemap');

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
      .attr('href','#')
      .attr('title','Toggle expanded mode')
      .on('click', function(e){
        d3.event.preventDefault();
        // console.log(event.target);
        _expand();
      })

    divHeader.append('h1')
      .text('Odyssey sandbox');

    var templates = context.templates().map(function(d) { return d.title; }),
        basemaps = context.basemaps();

    var help = divOptions.append('ul').attr('class', 'h-left');

    help
      .append('li')
      .append('a')
      .attr('class', 'helpButton')
      .attr('title','Documentation')
      .attr('href', '/odyssey.js/documentation');

    var selector = help.append('li')
      .append('a')
      .attr('class', 'basemapSelector')
      .attr('title','Change basemap')
      .attr('href', '#basemap')

    selector.append('img')
      .attr('id', 'selectorImg')
      .attr('src', 'https://cartocdn_a.global.ssl.fastly.net/base-light/6/30/24.png')
      .attr('alt', '');

    selector.append('span')
      .attr('id', 'selectorName')
      .text(basemaps[0].title);

    selector
      .on('click', function() {
        d3.event.preventDefault();

        var self = this;

        open(this, context.basemaps().map(function(d) { return '<img src="'+d.thumbnail+'" alt="" /><span>'+d.title+'</span>'; })).on('click', function(e) {
          var md = el.select('textarea').node().codemirror.getValue();
          evt.basemap(md, e.match(/<span>(.*?)<\/span>/)[1]);

          close(self);
        });
      });


    var optionsMap = divOptions.append('ul').attr('class', 'h-right');

    optionsMap
      .append('li')
      .append('a')
      .attr('class', 'collapseButton')
      .attr('href','#')
      .attr('title','Toggle collapse mode')
      .on('click', function(e) {
        d3.event.preventDefault();

        if (d3.select(this).classed('expandButton')) {
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

    optionsMap
      .append('li')
      .append('a')
      .attr('class', 'downloadButton')
      .attr('href','#')
      .attr('title','Download story')
      .on('click', function(e) {
        d3.event.preventDefault();

        function isSafari() {
          if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
            return true;
          }

          return false;
        }

        function notOld() {
          if (window.File && window.FileReader && window.FileList && window.Blob) {
            return true;
          } else {
            return false;
          }
        }

        if (!isSafari() && notOld()) {
          var md = el.select('textarea').node().codemirror.getValue();
          exp.zip(md, context.template(), function(zip) {
            saveAs(zip.generate({ type: 'blob' }), 'odyssey.zip');
          });
        } else {
          alert('Download is not fully supported in this browser.');
        }
      });

    optionsMap
      .append('li')
      .append('a')
      .attr('class', 'shareButton')
      .attr('href','#')
      .attr('title','Share story')
      .on('click', function(e) {
        d3.event.preventDefault();

        var md = el.select('textarea').node().codemirror.getValue();

        exp.gist(md, context.template(), function(gist) {
          // console.log(gist);
          //window.open(gist.html_url);
          share_dialog(gist.url, gist.html_url);
        });

        document.getElementById("copy-button").innerHTML = "Copy";

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
      .attr('title','Change template')
      .attr('href', '/odyssey.js/sandbox/sandbox.html')
      .on('click', function(d) {
        d3.event.preventDefault();
        d3.select(document.body).call(Splash(context).on('template', function(t) {
          evt.template(t);
        }));

        function initAnim($el) {
          var $anim = $el.find(".anim > div");
          
          $anim.spriteanim();

          $el.on("mouseenter", function() {
            $(this).find(".anim > div").spriteanim('play');
          });

          $el.on("mouseleave", function() {
            $(this).find(".anim > div").spriteanim('stop');
          });
        }

        initAnim($('li.template'));
      });


    context.on('template_change.editor', function(t) {
      d3.select('#show_slide').text(t);
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
