
# core

Odyssey is a simple FSM 

    - states
    - outputs
    - triggers

Each state has multiple outputs
To change state a trigger should be raised
When the state machine is swicthing between states no trigger is taken into account
Each state have internal states

----

- timeline
    - time in range [0, 1]
- trigger
- action

- when a trigger moves the timeline other triggers don't take affect
- trigger can be continous or fixed
- actions can be:
    - undo/redo
    - once

timeline = Timeline()
timeline.moveTo(t)
timeline.addTrigger(Trigger(...), Action(....));
timeline.addTrigger(Trigger(...), Action(....));
timeline.addTrigger(Trigger(...), Action(....));


## methods for each type

Actions:
    - enter/leave

```
function MoveMapAction() {
    return {
        /// called when action is triggered
        enter: function() {
        },

        /// called when action is left
        leave: function() {
        }
    }
}
```

Triggers
    - time or range
    - trigger



## examples

### move map to a position on scroll

var t = Timeline()
    .addTrigger(Scroll().Reach('#paragraph1'), MoveMap([1, 2]).animation('ease'))
    .addTrigger(Scroll().Reach('#paragraph2'), MoveMap([1, 2]).animation('ease'))
    .addTrigger(Scroll().Reach('#paragraph3'), MoveMap([1, 2]).animation('ease'))
    .addTrigger(Scroll().Reach('#paragraph4'), MoveMap([1, 2]).animation('ease'))
    .addTrigger(Scroll().Reach('#paragraph3'), Chain(
        MoveMap([1, 2]).animation('ease'),
        Wait(1000),
        marker.style({})
    ))


### slides
var states = States(5)
var t = Timeline()
    .addTrigger(state(1), MoveMap([1, 2]).animation('ease'))
    .addTrigger(state(2), MoveMap([1, 2]).animation('ease'))
    .addTrigger(state(3), MoveMap([1, 2]).animation('ease'))

$('.next').click(states.inc())
$('.next').click(states.dec())

## moving map with scroll 
var t = Timeline()
    .addLinearTrigger(Scroll(), MoveMap().from([1,2,3]).to([2,4,6]))
    .addLinearTrigger(Scroll(), MoveMap().from([1,2,3]).to([2,4,6]))

## growing line with scroll

var line = L.PolyLine(...);
var t = Timeline()
    .addLinearTrigger(Scroll(), GrowingLine(line))
