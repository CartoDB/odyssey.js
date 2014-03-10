
//i18n placeholder
function _t(s) { return s; }


/*
function dropdown() {
  var items = []

  function _dropdown(el) {
    var items = el.selectAll('.item').data(items);

    // enter
    items.enter().append('li');
    
    // update
    items.text(function(d) { return d.text; });

    // remove
    items.exit().remove();

  };

  // gets a list of { value: '...', text: '...' }
  _dropdown.items = function(_) {
    if (!arguments.length) return _
    items = _;
    return _dropdown;
  }

}
*/

function dialog() {
  var code = '';
  var evt = d3.dispatch('code', 'template');

  function _dialog (el) {

    var codeEditor = el.selectAll('textarea#code')
      .data([code]);




    var enter = codeEditor.enter();
    enter.append('h1').text('Odyssey editor');
    var select = enter.append('select')
      .html(['scroll', 'slides'].map(function(v) {
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
      this.codemirror = CodeMirror.fromTextArea(this, {
        mode: "markdown"
      });
      this.codemirror.on('change', function(c) {
        evt.code(c.getValue());
      });
    });

    // update
    codeEditor.each(function(d) {
      this.codemirror.setValue(d);
    });
  }

  _dialog.code = function(_) {
    if (!arguments.length) return _;
    code = _;
    return _dialog;
  };

  return d3.rebind(_dialog, evt, 'on');
}

function editor() {

  var body = d3.select(document.body);

  var template = body.select('#template');
  var code_dialog = dialog();

  var iframeWindow;
  var $editor = body.append('div')
    .attr('id', 'editor_dialog')
    .call(code_dialog);


  d3.select(document.body);


  function sendCode(_) {
    iframeWindow.postMessage(_, iframeWindow.location);
  }

  code_dialog.on('code.editor', function(code) {
    sendCode(code);
    O.Template.Storage.save(code);
  });


  template.on('load', function() {
    iframeWindow = template.node().contentWindow;
    O.Template.Storage.load(function(md) {
      sendCode(md);
      $editor.call(code_dialog.code(md));
    });
  });
  function set_template(t) {
    template.attr('src', t + ".html");
  }

  code_dialog.on('template.editor', function(t) {
    set_template(t);
  });

  set_template('scroll');



}
