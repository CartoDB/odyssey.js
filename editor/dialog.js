
var dropdown = require('./dropdown');
var saveAs = require('../vendor/FileSaver');
var exp = require('./gist');

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
    debugger;
    d3.selectAll('#actionDropdown').attr('class', '');
  }

  offset = offset || { x: 0, y: 0 }

  // update
  var bbox = el.getBoundingClientRect();
  d.style({
    top: (bbox.top + 25 + offset.y) + "px",
    left: (bbox.left + offset.x) + "px",
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

    var templates = context.templates().map(function(d) { return d.title; });

    var help = divOptions.append('ul').attr('class', 'h-left');
    help.append('li').append('a').attr('class', 'helpButton');

    var optionsMap = divOptions.append('ul').attr('class', 'h-right');

    optionsMap.append('li').append('a').attr('class', 'collapseButton').on('click', function() {

      if (el.style('bottom') === 'auto') {
        el.style('bottom', '80px').style('height', 'auto');
        el.selectAll('.actionButton').style("visibility", "visible");
        d3.select(this).classed('expandButton', false);

      } else {
        el.style('bottom', 'auto').style('height', '119px');
        d3.select(this).classed('expandButton', true);
        el.selectAll('.actionButton').style("visibility", "hidden");
      }

    });

    optionsMap.append('li').append('a').attr('class', 'downloadButton').on('click', function() {
        var md = el.select('textarea').node().codemirror.getValue();
        exp.zip(md, context.template(), function(zipBlob) {
          saveAs(zipBlob, 'oddysey.zip');
        });
    });

    optionsMap.append('li').append('a').attr('class', 'shareButton').on('click', function() {
      var md = el.select('textarea').node().codemirror.getValue();
      exp.gist(md, context.template(), function(gist) {
        console.log(gist);
        //window.open(gist.html_url);
      });
    });



    divHeader.append('p')
      .attr('id', 'show_slide')
      .text(templates[0])
      .on('click', function(d) {
        d3.event.stopPropagation();
        var self = this;
        open(this, templates, 'drop-right', { x: -74, y: 5}).on('click', function(value) {
          evt.template(value);
          close();
          d3.select(self).text(value);
        });
      });

    context.on('template_change.editor', function(t) {
      divHeader.select('#show_slide').text(t);
    });

    var textarea = enter.append('textarea')
      .attr('id', 'code')
      .on('keyup.editor', function() {
        evt.code(this.value);
      });

    function debounce(fn, t) {
      var i;
      return function() {
        var args = arguments;
        clearTimeout(i);
        i = setTimeout(function() { fn.apply(window, arguments); }, t);
      }
    }

    textarea.each(function() {
      var codemirror = this.codemirror = CodeMirror.fromTextArea(this, {
        mode: "markdown",
        lineWrapping: true
      });
      var showActions = debounce(function() { placeActionButtons(el, codemirror); }, 500);
      var hideActions = debounce(function() { el.selectAll('.actionButton').remove(); }, 20);
      codemirror.on('scroll',  function() {
        showActions();
        hideActions();
      });
      this.codemirror.on('change', function(c) {
        // change is raised at the beginning with any real change
        if (c.getValue()) {
          evt.code(c.getValue());
          placeActionButtons(el, codemirror);
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
