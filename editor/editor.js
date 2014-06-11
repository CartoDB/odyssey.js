
//i18n placeholder
function _t(s) { return s; }


var dialog = require('./dialog');
var Splash = require('./splash');
var DOMParser = require('../vendor/DOMParser');
var utils = require('./utils');


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
