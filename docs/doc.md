
# Introduction

Odyssey.js is being developed to help journalists, bloggers, and other people on the web publish stories that combine narratives with maps and map interactions. Odyssey.js is a Javascript library that simplifies the process of linking narratives, movies, and interaction with specific changes and actions on a map. The library simplifies a lot of the code it would take to write many common as well as innovative ways of adding maps to storytelling. 

While at its heart, this project is about the Javascript library, we have also developed an easy to use editing tool so you can quickly prototype or even build webpages to tell your stories. The editor will allow you to create pretty advanced online maps and stories without writing anything more advanced than [Markdown](http://daringfireball.net/projects/markdown/syntax).

The library is open source and freely available to use in your projects. It is initially being built to work with most modern browsers. 

## Examples

# Using the editor


## Markdown

# Publishing stories

## URL Sharing

## HTML Templates

## Creating your own templates

## Hosting

# Using the Javascript libary

## Basic functions

## Advanced functions

### YouTube

### Torque

## Custom functions

Writing your own JS


# Using the editor locally

** Step 1: Checkout the code **

```sh
git clone git@github.com:CartoDB/odyssey.js.git
cd odyssey.js
```

** Step 2: Install dependancies **

```sh
npm install
gem system --update
gem install compass
```

** Step 3. Start the server **

```sh
python -m SimpleHTTPServer
```

Now go to [http://locahost:8000/editor/editor.html](http://locahost:8000/editor/editor.html)

# Contributing code

### Improving documentation

Now go to [http://locahost:8000/docs/index.html](http://locahost:8000/docs/index.html)

You can add to or edit this file by editing the [Markdown](http://daringfireball.net/projects/markdown/syntax) in the file ```docs/doc.md```.

### Developing the Editor

First, change into the editor and start compass.

```sh
editor/
compass watch
```

Next, start the server as above and go to [http://locahost:8000/editor/editor.html](http://locahost:8000/editor/editor.html)

### Submitting improvements

Send a pull request to the original Odyssey.js repository!




# Old content

## Oddysey.Story

controls the state of the story managing the states. Each story contains states and triggers control
which state is the active one.

### Oddysey.Story.addState(trigger, action)
Adds a new state to the story. `action` will be called when `trigger` is triggered. `action`
`enter` method is only called when the story enters in this state.

  ```
  Story().addState(trigger, action);
  ```

### Oddysey.Story.addLinearState(trigger, action)
Does the same than `addState` but in this case `update` method in the `action` is called every time
the trigger is updated

### Oddysey.Story.go(action_index[, options])

Move story to desired state 
  * ``action_index``: base 0 index of state
  * ``options``: todo


### Oddysey.Chain

executes actions serially, waits until the previous task is completed to start with the second and so on

  ```
  var chain = Chain(action1, action2, action3)
  chain.on('finish.app', function() {
    console.log("all tasks performed");
  });
  Story().addState(trigger, chain);
  ```

raises `finish` signal when all the tasks has been completed

### Oddysey.Paralel

executes actions in parallel

    ```
    var chain = Parallel(action1, action2, action3)
    chain.on('finish.app', function() {
      console.log("all tasks performed");
    });
    Story().addState(trigger, chain);
    ```

raises `finish` signal when all the tasks has been completed

## Oddysey.Actions
## Oddysey.Triggers 
## Custom actions
## Custom triggers 
