
var dropdown = require('./dropdown');
var saveAs = require('../vendor/FileSaver');

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
      var md = el.select('textarea').node().codemirror.getValue()
      var blob = new Blob([md], {type: "text/plain;charset=utf-8"});
      saveAs(blob, 'oddysey.md');
    });

    divOptions.append('a').attr('class', 'helpButton').on('click', function() {
    });


    divOptions.append('a').attr('class', 'shareButton').on('click', function() {
    });

    var templates = ['torque', 'scroll', 'slides', 'rolling_stones'];
      
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
        mode: "markdown"
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
