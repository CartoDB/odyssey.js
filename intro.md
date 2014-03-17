
# intro

Odyssey allows you to create event based stories. In order to create a story you add a series of
triggers with raises actions. For example, a trigger can be the user press right key and the action
it raises is to move a map to a place.

Let's define the core of Odyssey

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
    .addAState(O.Keys().right(), O.Parallel(
        O.Debug().log('rigth key pressed'),
        O.Debug().log('hello')
    ),
```

or one by one using ``O.Chain``:

```javascript
story
    .addAState(O.Keys().right(), O.Chain(
        O.Debug().log('rigth key pressed'),
        O.Sleep(1000)
        O.Debug().log('this is printed after 1 second')
    )
```

Odyssey defines some useful actions and triggers, they are defined in the API documentation.

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

story.addAction(O.Keys().right(), showHideAction)
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

story.addAction(O.Keys().right(), ShowHideAction($('#element')))
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
story.addAction(IntervalTrigger(), O.Debug().log('enter')); 
```


