
function a(t) { 
  this.t = t;
  if (this.called) {
    ++this.called;
  } else {
    this.called = 1;
  }
}
function e() { this.ex = !this.ex ? 1: ++this.ex; }
module('story');
var story, t1, t2, a1, la0;
QUnit.testStart(function() {
  story = Odyssey.Story();
  t1 = Odyssey.Trigger({});
  t2 = Odyssey.Trigger({});
  a1 = Odyssey.Action(a);
  la0 = Odyssey.Action({
    enter: a,
    update: function(t) { this.t = t; },
    exit: e
  });
});

test('addState', 8, function() {
  story.addState(t1, a1);
  story.addState(t2, la0);
  t1.trigger();
  equal(1, a1.called);
  equal(undefined, la0.called);

  // call again does not make any effect
  t1.trigger();
  equal(1, a1.called);
  equal(undefined, la0.called);

  t2.trigger();
  equal(1, la0.called);

  // call again does make effect since state was changed
  t1.trigger();
  equal(2, a1.called);
  equal(1, la0.ex);

  // add non valid story
  try {
    story.addState(null, a1);
  } catch(e) {
    equal(1, 1);
  }

  // add non valid story
  try {
    story.addState(t1);
  } catch(e) {
    equal(1, 1);
  }
});

test('addLinearState', 5, function() {
  story.addLinearState(t1, la0);
  story.addState(t2, a1);
  t1.trigger(0.1);
  equal(1, la0.called);
  t1.trigger(0.2);
  equal(1, la0.called);
  equal(0.2, la0.t);
  t1.trigger(0.4);
  equal(0.4, la0.t);

  t2.trigger();
  equal(1, la0.ex);
});
