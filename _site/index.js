
var e = require('./lib/odyssey/story');
e.Actions = require('./lib/odyssey/actions');
e.Triggers = require('./lib/odyssey/triggers');
e.Core = require('./lib/odyssey/core');
e.Template = require('./lib/odyssey/template');
e.UI = require('./lib/odyssey/ui');
require('./lib/odyssey/util');

for (var k in e.Actions) {
  e[k] = e.Actions[k];
}
for (var k in e.Triggers) {
  e[k] = e.Triggers[k];
}
module.exports = e;
