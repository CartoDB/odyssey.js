
function a(t) { 
  this.t = t;
  this.lastEnterCall = new Date().getTime()
  if (this.called) {
    ++this.called;
  } else {
    this.called = 1;
  }
}

function e() { 
  this.lastExitCall = new Date().getTime()
  this.ex = !this.ex ? 1: ++this.ex; 
}

module('story');
var story, t1, t2, a1, a2, la0;
QUnit.testStart(function() {
  story = O.Story();
  t1 = O.Trigger({});
  t2 = O.Trigger({});
  a1 = O.Action(a);
  a2 = O.Action(a)
  la0 = O.Action({
    enter: a,
    update: function(t) { this.t = t; },
    exit: e
  });
});

test('addState', 9, function() {
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
  throws(function() { story.addState(null, a1) });
  throws(function() { story.addState(t1) });
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

test('clear', 2, function() {
  story.addState(t2, a1);
  t2.trigger();
  equal(1, a1.called);
  story.clear();
  equal(t2.trigger, null);
});



test('Step', function() {
  story.addState(t1, O.Step(a1, a2));
  t1.trigger();
  equal(1, a1.called, "a1 should be called");
  equal(1, a2.called, "a2 should be called");
  ok(a1.lastEnterCall <= a2.lastEnterCall, "a1 should be called before a2");
})

asyncTest('Step - async', 3, function() {
  var finished = false;
  var asyncAction = O.Action({
    enter: function() {
      var self = this;
      this.lastEnterCall = new Date().getTime();
      setTimeout(function() {
        self.finish();
      }, 1000);
      return true;
    }
  });
  story.addState(t1, O.Step(asyncAction, a2).on('finish.test', function() {
    finished = true;
  }));

  t1.trigger();
  setTimeout(function() {
    equal(1, a2.called, "a2 should be called");
    ok(a2.lastEnterCall - asyncAction.lastEnterCall > 990, "a2 shouldn't be called until asyncAction finish");
    ok(finished, "chain should call finish");
    start();
  }, 1100);
});

asyncTest('Step - async with sync actions', 2, function() {
  var finished = false;
  var asyncAction = O.Action({
    enter: function() {
      var self = this;
      this.lastEnterCall = new Date().getTime();
      self.finish();
      return true;
    }
  });
  story.addState(t1, O.Step(asyncAction, a2).on('finish.test', function() {
    finished = true;
  }));

  t1.trigger();
  setTimeout(function() {
    equal(1, a2.called, "a2 should be called");
    ok(finished, "chain should call finish");
    start();
  }, 1100);
});

test('Parallel', function() {
  var finished = false;
  story.addState(t1, O.Parallel(a1, a2).on('finish.test', function() {
    finished = true;
  }));
  t1.trigger();
  equal(1, a1.called, "a1 should be called");
  equal(1, a2.called, "a2 should be called");
  ok(finished, "finish signal should be throw");
});

asyncTest('Parallel - async', 3, function() {
  var finished = false;
  var asyncAction = O.Action({
    enter: function() {
      var self = this;
      this.lastEnterCall = new Date().getTime();
      setTimeout(function() {
        self.finish();
      }, 1000);
      return true;
    }
  });
  story.addState(t1, O.Parallel(asyncAction, a2).on('finish.test', function() {
    finished = true;
  }));

  t1.trigger();
  equal(1, a2.called, "a2 should be called");
  setTimeout(function() { ok(!finished); }, 100);
  setTimeout(function() { ok(finished); start(); }, 1000);
});

asyncTest('Step - async', 3, function() {
  var finished = false;
  var asyncAction = O.Action({
    enter: function() {
      var self = this;
      this.lastEnterCall = new Date().getTime();
      setTimeout(function() {
        self.finish();
      }, 1000);
      return true;
    }
  });
  story.addState(t1, O.Step(asyncAction, a2).on('finish.test', function() {
    finished = true;
  }));

  t1.trigger();
  setTimeout(function() {
    equal(1, a2.called, "a2 should be called");
    ok(a2.lastEnterCall - asyncAction.lastEnterCall > 990, "a2 shouldn't be called until asyncAction finish");
    ok(finished, "chain should call finish");
    start();
  }, 1100);
});

