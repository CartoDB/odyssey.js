
//i18n placeholder
function _t(s) { return s; }


var dialog = require('./dialog');
var saveAs = require('../vendor/FileSaver');

function editor() {

  var body = d3.select(document.body);
  var context = {};

  d3.rebind(context, d3.dispatch('error'), 'on', 'error');

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
  });

  function set_template(t) {
    template.attr('src', t + ".html");
  }

  code_dialog.on('template.editor', function(t) {
    set_template(t);
  });

  set_template('slides');

}

module.exports = editor;
