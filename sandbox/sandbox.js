
//i18n placeholder
function _t(s) { return s; }


var dialog = require('./dialog');
var Splash = require('./splash');
var DOMParser = require('../vendor/DOMParser');
var utils = require('./utils');


var TEMPLATE_LIST =  [{
    title: 'slides',
    description: 'Display visualization chapters like slides in a presentation',
    default: "```\n-title: \"Odyssey example FTW\"\n-author: \"CartoDB\"\n```\n\n#Your first odyssey.js story\n```\n- center: [37.7620, -122.4385]\n- zoom: 9\nL.marker([37.7620, -122.4385]).actions.addRemove(S.map)\n```\n\nMove the map around and save the position by clicking on \"ADD > Move map to the current position\". As you can see, now we are highlighting San Francisco.\n\nThen add here the description for your slide so it's shown on the left side box.\n\n\n#How to add more states\n```\n- center: [40.7348, -73.9970]\n- zoom: 9\nL.marker([40.7348, -73.9970]).actions.addRemove(S.map)\n```\n\nBy adding new [Markdown] (http://daringfireball.net/projects/markdown/]) h1 elements (#) you add new states to your story.\n\n\n#Adding images to your story\n```\n- center: [40.7365, -73.9982]\n- zoom: 13\n```\n\nBy default, images are also supported. \n\n![New York](http://www.boston-discovery-guide.com/image-files/new-york-1.jpg)\n\n#Exporting your story\n```\n- center: [40.4469, -28.5645]\n- zoom: 3\n```\n\nYou have different options for exporting your odyssey.js visualization. You can either embed this using an iframe, publishing with a click on bl.ocks or just share the URL of this visualization.\n\nIf you want to customize it further, you can download the generated source code by clicking on the button below.\n\n#Advanced users\n\nCheck out our [documentation](/odyssey.js/documentation/) to learn how to use odyssey to create more custom things. It's crazy the amount of cool things that can be done with the library.\n\nAlso if you are a developer, take a look at our contributing guideline so you can push code to the actual library.\n\nCheers!\n"
  }, {
    title: 'scroll',
    description: 'Create a visualization that changes as your reader moves through your narrative',
    default: "```\n-title: \"Odyssey example FTW\"\n-author: \"CartoDB\"\n```\n\n#Your first odyssey.js story\n```\n- center: [37.7620, -122.4385]\n- zoom: 9\nL.marker([37.7620, -122.4385]).actions.addRemove(S.map)\n```\n\nMove the map around and save the position by clicking on \"ADD > Move map to the current position\". As you can see, now we are highlighting San Francisco.\n\nThen add here the description for your slide so it's shown on the left side box.\n\n\n#How to add more states\n```\n- center: [40.7348, -73.9970]\n- zoom: 9\nL.marker([40.7348, -73.9970]).actions.addRemove(S.map)\n```\n\nBy adding new [Markdown] (http://daringfireball.net/projects/markdown/]) h1 elements (#) you add new states to your story.\n\n\n#Adding images to your story\n```\n- center: [40.7365, -73.9982]\n- zoom: 13\n```\n\nBy default, images are also supported. \n\n![New York](http://www.boston-discovery-guide.com/image-files/new-york-1.jpg)\n\n#Exporting your story\n```\n- center: [40.4469, -28.5645]\n- zoom: 3\n```\n\nYou have different options for exporting your odyssey.js visualization. You can either embed this using an iframe, publishing with a click on bl.ocks or just share the URL of this visualization.\n\nIf you want to customize it further, you can download the generated source code by clicking on the button below.\n\n#Advanced users\n\nCheck out our [documentation](/odyssey.js/documentation/) to learn how to use odyssey to create more custom things. It's crazy the amount of cool things that can be done with the library.\n\nAlso if you are a developer, take a look at our contributing guideline so you can push code to the actual library.\n\nCheers!\n"
  }, {
    title: 'torque',
    description: 'Link story elements to moments in time using this animated map template',
    default: "```\n-title: \"Title\"\n-author: \"Odyssey.js Developers\"\n-vizjson: \"http://viz2.cartodb.com/api/v2/viz/521f3768-eb3c-11e3-b456-0e10bcd91c2b/viz.json\"\n-duration: 18\n```\n\n# Torque Template\n```\n- step: 0\n- center: [-4.0396, 5.5371]\n- zoom: 2\n```\n\n## Animated maps in Odyssey.js\n\nDelete the [Markdown](http://daringfireball.net/projects/markdown/) to get started with your own or watch this story to learn some of the techniques.\n\n# vizjson\n```\n-step: 30\nS.torqueLayer.actions.pause()\nO.Actions.Sleep(3000)\nS.torqueLayer.actions.play()\n```\n\nUnlike other Odyssey.js templates, the Torque template requres a Viz.JSON URL to add an animated layer to your map. You can find out more about Viz.JSON URLs [here](http://developers.cartodb.com/documentation/using-cartodb.html#sec-8)\n\nTo add your own, just replace the above link so it looks like,\n\n**-vizjson: \"http://your-url/viz.json\"**\n\n\n# Markdown\n```\n-step: 60\nS.torqueLayer.actions.pause()\nO.Actions.Sleep(3000)\nS.torqueLayer.actions.play()\n```\n\nLike all templates, the Torque template runs on [Markdown](http://daringfireball.net/projects/markdown/). This gives you the ability to create completely custom content for your story\n\n# Change map position \n```\n- step: 111\n- center: [50.2613, -2.1313]\n- zoom: 5\nS.torqueLayer.actions.pause()\nO.Actions.Sleep(3000)\nS.torqueLayer.actions.play()\n```\n\nYou can tour the map by:\n\n1. Add a new section using the headline notation, **#**\n2. Pause the slider and move it to the desired time in your map visualization.\n3. Beside your new headline, click Add and then **insert time**\n4. Move your map to your desired location, and click \"move map to current position\"\n\n# Pause your map\n```\n- step: 292\n- center: [9.4165, -79.2828]\n- zoom: 7\nS.torqueLayer.actions.pause()\nO.Actions.Sleep(2000)\nS.torqueLayer.actions.play()\n```\n\nIf you want to highlight a particular moment in time, it is helpful to use a Pause, Sleep, Play series of events like this slide. \n"
  }
];

var BASEMAP_LIST =  [{
    title: 'CartoDB Light',
    url: "https:\/\/cartocdn_a.global.ssl.fastly.net\/base-light\/{z}\/{x}\/{y}.png",
    thumbnail: "https:\/\/cartocdn_a.global.ssl.fastly.net\/base-light\/6\/30\/24.png"
  }, {
    title: 'Nokia Day',
    url: "https://2.maps.nlp.nokia.com/maptile/2.1/maptile/newest/normal.day/{z}\/{x}\/{y}/256/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24",
    thumbnail: "https:\/\/2.maps.nlp.nokia.com\/maptile\/2.1\/maptile\/newest\/normal.day\/6\/30\/24\/256\/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24"
  }, {
    title: 'Stamen Watercolor',
    url: "http://{s}.tile.stamen.com/watercolor/{z}\/{x}\/{y}.jpg",
    thumbnail: "http:\/\/a.tile.stamen.com\/watercolor\/6\/30\/24.jpg"
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
      // console.log("code", _);
    }
    return this._code;
  }

  context.basemaps = function(_) {
    if (_) {
      var t = BASEMAP_LIST.map(function(d) { return d.title; }).indexOf(_);
      if (t >= 0) {
        return BASEMAP_LIST[t];
      }
      return null;
    }
    return BASEMAP_LIST;
  }

  var template = body.select('#template');
  var code_dialog = dialog(context);

  var iframeWindow;
  var $editor = body.append('div')
    .attr('id', 'editor_modal')
    .call(code_dialog);


  d3.select(document.body);

  var callbacks = {};

  function readMessage(event) {
    var msg = JSON.parse(event.data);

    if (msg.id) {
      callbacks[msg.id](msg.data);
      delete callbacks[msg.id];
    }
  }

  if (!window.addEventListener) {
    window.attachEvent("message", function load(event) {
      readMessage(event);
    });
  } else {
    window.addEventListener("message", function load(event) {
      readMessage(event);
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

  code_dialog.on('basemap.editor', function(md, bm) {
    var basemap_data = context.basemaps(bm);

    //TODO: refactor with addAction
    if (basemap_data) {
      var url = basemap_data.url;

      if (md.indexOf('baseurl:') === -1) {
        var ibas = md.indexOf('```')+3,
            bas = "\n-baseurl: \""+url+"\"";

        md = md.slice(0, ibas) + bas + md.slice(ibas);
      } else {
        var md_i = md.indexOf('baseurl:')+8,
            md_ = md.slice(md_i, md.length);

        md = '```\n-baseurl: \"'+url+'"\n'+md_.slice(md_.indexOf('\n')+1, md_.length);
      }

      $editor.call(code_dialog.code(md));
    }
  });

  code_dialog.on('code.editor', function(code) {
    if (code.indexOf('baseurl:') != -1) {
      var code_i = code.indexOf('baseurl:')+8,
          code_ = code.slice(code_i, code.length);
          url = code_.split("\"")[1];

      var url_ = url.replace(/\{s\}/g, "a")
        .replace(/\{x\}/g, "30")
        .replace(/\{y\}/g, "24")
        .replace(/\{z\}/g, "6");

      document.getElementById('selectorImg').src = url_;

      var urls = context.basemaps().map(function(d) { return d.url; });

      for(var i = 0; i < urls.length; i++) {
        if (url === urls[i]) {
          document.getElementById('selectorName').innerHTML = context.basemaps()[i].title;
        }
      }
    }

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
