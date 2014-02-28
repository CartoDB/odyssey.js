
# Introduction

The odyssey.js library is being developed to help journalists, bloggers, and other people on the web publish stories that combine narratives with maps and map interactions. The library is open source and freely available to use in your projects. It is initially being built to work with most modern browsers.

# Guidelines
# Quickstart

# Oddysey.Story

controls the state of the story managing the states. Each story contains states and triggers control
which state is the active one.

## Oddysey.Story.addState(trigger, action)
Adds a new state to the story. `action` will be called when `trigger` is triggered. `action`
`enter` method is only called when the story enters in this state.

  ```
  Story().addState(trigger, action);
  ```

## Oddysey.Story.addLinearState(trigger, action)
Does the same than `addState` but in this case `update` method in the `action` is called every time
the trigger is updated

## Oddysey.Story.go(action_index[, options])

Move story to desired state 
  * ``action_index``: base 0 index of state
  * ``options``: todo


## Oddysey.Chain

executes actions serially, waits until the previous task is completed to start with the second and so on

  ```
  var chain = Chain(action1, action2, action3)
  chain.on('finish.app', function() {
    console.log("all tasks performed");
  });
  Story().addState(trigger, chain);
  ```

raises `finish` signal when all the tasks has been completed

## Oddysey.Paralel

executes actions in parallel

    ```
    var chain = Parallel(action1, action2, action3)
    chain.on('finish.app', function() {
      console.log("all tasks performed");
    });
    Story().addState(trigger, chain);
    ```

raises `finish` signal when all the tasks has been completed

# Oddysey.Actions
# Oddysey.Triggers 

# Contributing


# Custom actions
# Custom triggers 

