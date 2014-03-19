
var Template = function(template) {
  var initialized = false;
  window.addEventListener("message", function(event) {
    var msg = JSON.parse(event.data);

    function sendMsg(_) {
      event.source.postMessage(JSON.stringify({
        id: msg.id,
        data: _
      }), event.currentTarget.location);
    }

    if (msg.type === 'md') {
      var actions = actionsFromMarkdown(msg.code);
      template.update(actions);
    } else if (msg.type === 'actions') {
      sendMsg(Object.keys(template.actions));
    } else if (msg.type === 'get_action') {
      sendMsg(template.actions[msg.code].call(template))
    } else if (msg.type === 'code') {
      //TODO: error management
      sendMsg(eval(msg.code));
    }
  }, false);

  template.init(function() {
  });
};

Template.Storage = {

  save: function(md) {
    location.hash = btoa(md);
  },

  load: function(done) {
    var h = location.hash;
    done && h && done(atob(h.slice(1)));
  }
};

module.exports = Template;
