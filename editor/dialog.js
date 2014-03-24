
var dropdown = require('./dropdown');

function close(el) {
  var d = d3.select(document.body).selectAll('#actionDropdown').data([]);
  d.exit().remove();
}

function open(el, items) {
  var d = d3.select(document.body).selectAll('#actionDropdown').data([0]);
  // enter
  d.enter().append('div').attr('id', 'actionDropdown').style('position', 'absolute');

  // update
  var bbox = el.getBoundingClientRect();
  d.style({
    top: (bbox.top + 15) + "px",
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

    divHeader.append('a')
      .attr('class','expandButton')
      .on('click', function(){
        // console.log(event.target);
        _expand();
      })

    divHeader.append('h1')
      .text('Odyssey editor');
      
    divHeader.append('select')
      .html(['torque', 'scroll', 'slides'].map(function(v) {
        return "<option value='" + v + "'>" + v + "</option>";
      }).join('\n'))
      .on('change', function() {
        evt.template(this.value);
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

    function _expand(){
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
        var self = this;
        open(this, context.actions()).on('click', function(e) {
          context.getAction(e, function(action) {
            addAction(codemirror, d.line, action);
          });
          close(self);
        });
      });

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
