
var Template = function(template) {
  window.addEventListener("message", function(event) {
    var actions = actionsFromMarkdown(event.data);
    template.update(actions);
  }, false);
  template.init();
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
