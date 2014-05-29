
//i18n placeholder
function _t(s) { return s; }


var dialog = require('./dialog');
var Splash = require('./splash');
var saveAs = require('../vendor/FileSaver');

var TEMPLATE_LIST =  [{
    title: 'slides',
    description: 'the classic one, like using keynote',
    default: '```\n-title: "Title"\n-author: "Name"\n```\n\n#slide1\nsome text\n\n#slide2\n more text'
  }, {
    title: 'scroll',
    description: 'the classic one, like using keynote',
    default: '\n-title: "Title"\n-author: "Name"\n```\n\n#title\n##headline\n\n#slide1\nsome text\n\n#slide2\n more text'
  }
];


function editor() {

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

  context.save = function(_) {
    if (this.code() && this.template()) {
      O.Template.Storage.save(this.code(), this.template());
    }
  }

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
    if (_) this._code = _;
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
