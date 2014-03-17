# intro

Odyssey allows you to create event based stories. In order to create a story you add some states,
each of those states are raised by a trigger and some actions are performed for each state. For example, a trigger could be "pressing the right key" and the action it raises "to move a map to a certain place".


# most basic example

this examples prints in the console when an user press a key

```javascript
var story = O.Story();

story
    .addState(O.Keys().right(), O.Debug().log('rigth key pressed')
    .addState(O.Keys().left(), O.Debug().log('left key pressed')

```

When the user press right key the story enters in the first state and it does not leave it until
another trigger is raised (so it enters in another state)


we can execute multiple actions at the same time with ``O.Parallel``

```javascript
story
    .addState(O.Keys().right(), O.Parallel(
        O.Debug().log('rigth key pressed'),
        O.Debug().log('hello')
    ))
```

or one by one using ``O.Chain``:

```javascript
story
    .addState(O.Keys().right(), O.Chain(
        O.Debug().log('rigth key pressed'),
        O.Sleep(1000),
        O.Debug().log('this is printed after 1 second')
    ))
```

Odyssey defines some useful actions and triggers, they are defined in the API documentation.

## triggers can raise other triggers

Imagine we want to create a story that passes slides with right and left keys. We need a trigger
that is raised every time we press the key. Let's do it

```javascript

// create a sequential trigger
// seq.step(1) creates a trigger that will be raised then sequence enters
// in step 1
var seq = O.Sequential();

// attach left and right keys to next//prev
O.Keys().left().then(seq.next, seq)
O.Keys().right().then(seq.next, seq)

// create the story
O.Story()
    .addState(seq.step(0), O.Debug().log('slide 1'))
    .addState(seq.step(1), O.Debug().log('slide 2'))
    .addState(seq.step(2), O.Debug().log('slide 3'))

// we could control programatically
// pass the slides every 5000
setInterval(function() {
    seq.next()
}, 5000);
```


# how to define your own actions

Odyssey provides actions but you can define yours

```javascript
var hideDivAction = O.Action(function() {
    $('#element').hide()
});

story.addAction(O.Keys().right(), hideDivAction)
```

more advanced actions can be created, for example, one that show an element when the story enters in
the state and hides it when leaves it

```javascript
var showHideAction = O.Action({
    enter: function() {
        $('#element').show()
    },

    exit: function() {
        $('#element').hide()
    }
});

story.addState(O.Keys().right(), showHideAction)
```

but the right way to define this actions would be:

```javascript
function ShowHideAction(el) {
    return O.Action({
        enter: function() {
            el.show()
        },

        exit: function() {
            el.hide()
        }
    });
}

story.addState(O.Keys().right(), ShowHideAction($('#element')))
```

# define custom triggers

let's define a trigger that is raised every 3 seconds

```javascript
function IntervalTrigger() {
    t = O.Trigger();
    setInterval(funtion() {
        t.trigger();
    }, 3000)
    return t;
}

// enter will be printed only once since when the story is in a 
// state if the trigger is raised again it has no effect
story.addState(IntervalTrigger(), O.Debug().log('enter')); 
```

