---
layout: documentation
title: 'Odyssey.js · Documentation'
css_assets:
  - /css/docs.css
---


## Introduction

Odyssey.js is being developed to help journalists, bloggers, and other people on the web publish stories that combine narratives with maps and map interactions. Odyssey.js is a Javascript library that simplifies the process of linking narratives, movies, and interaction with specific changes and actions on a map. The library simplifies a lot of the code it would take to write many common as well as innovative ways of adding maps to storytelling.

While at its heart, this project is about the Javascript library, we have also developed an easy to use editing tool so you can quickly prototype or even build webpages to tell your stories. The editor will allow you to create pretty advanced online maps and stories without writing anything more advanced than [Markdown](http://daringfireball.net/projects/markdown/syntax).

The library is open source and freely available to use in your projects. It is initially being built to work with most modern browsers.

** Warning **

** We are at an early stage of development where many things are still in flux! Be prepared for what you see today to change tomorrow :) **

## Using the editor

The Odyssey Editor allows you to link map changes and movements to different elements in a web document through the use of [Markdown](http://daringfireball.net/projects/markdown/syntax). We have included a small number of webpage templates for you to use to prototype your stories.

<img src="http://i.imgur.com/i0c3bLL.gif" width="100%" />

### Default templates

_todo_

1. _Slides_
2. _Scrolling_
2. _Rolling Stones_
3. _Torque_

## Publishing stories

### Saving stories

_todo_

### URL Sharing

_todo_

## Hosting Odyssey stories

_todo_

## Advanced use of the editor

### Markdown syntax

The Markdown syntax used in the Odyssey Editor uses all the features documented int the [Daring Fireball](http://daringfireball.net/projects/markdown/syntax) documentation. There are primary additions we have included to make Odyssey.js work:

#### Config block

At the top of your markdown document, you can include a configuration block. Depending on the template you use, this can add information to your story. For example, title object can be included this way,

![title](http://i.imgur.com/Q8ruePp.png)

#### The action block

You can attach map actions to section elements in your Markdown using the interface. Each time you add one interactively, it is translated into a new block that will actually cause the action. You can write them manually by including the same syntax,

![action](http://i.imgur.com/6mhW8oP.png)

In the example above, the user has created a new section header and added the Odyssey action to move the map to a new center and zoom. Odyssey.js is built on [Leaflet](http://leafletjs.com/), so you can perform most actions possible in leaflet here.
### HTML Templates

### Creating your own templates

_todo_

## Using the Javascript libary


### Getting started

#### Story object

**O.Story()**

Will attach each story state to the Odyssey story object.

```js
var story = O.Story();
```

#### Sequence object

**O.Sequential()**

The **sequential** object contains the logic for moving forward and backward through the story states attached to your **story** object.

```js
var seq = O.Sequential();
```

#### Keys object

** O.Keys()**

The **keys** object abstracts the keyboard based interaction with your story, allowing you to quickly attach left and right key strokes to movement through your story.

```js
O.Keys().left().then(seq.prev, seq);
O.Keys().right().then(seq.next, seq);
```

### Basic functions

_todo_

### Advanced functions

#### YouTube

_todo_

#### Torque

_todo_

### Custom functions

_todo_

## Odyssey.js development

### Using the editor locally

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

### Contributing code

#### Improving documentation

Now go to [http://locahost:8000/docs/index.html](http://locahost:8000/docs/index.html)

You can add to or edit this file by editing the [Markdown](http://daringfireball.net/projects/markdown/syntax) in the file ```docs/doc.md```.

#### Developing the Editor

First, change into the editor and start compass.

```sh
editor/
compass watch
```

Next, start the server as above and go to [http://locahost:8000/editor/editor.html](http://locahost:8000/editor/editor.html)

#### Submitting improvements

Send a pull request to the original Odyssey.js repository!




## Old content

### Oddysey.Story

controls the state of the story managing the states. Each story contains states and triggers control
which state is the active one.

#### Oddysey.Story.addState(trigger, action)
Adds a new state to the story. `action` will be called when `trigger` is triggered. `action`
`enter` method is only called when the story enters in this state.

  ```
  Story().addState(trigger, action);
  ```

#### Oddysey.Story.addLinearState(trigger, action)
Does the same than `addState` but in this case `update` method in the `action` is called every time
the trigger is updated

#### Oddysey.Story.go(action_index[, options])

Move story to desired state
  * ``action_index``: base 0 index of state
  * ``options``: todo


#### Oddysey.Chain

executes actions serially, waits until the previous task is completed to start with the second and so on

  ```
  var chain = Chain(action1, action2, action3)
  chain.on('finish.app', function() {
    console.log("all tasks performed");
  });
  Story().addState(trigger, chain);
  ```

raises `finish` signal when all the tasks has been completed

#### Oddysey.Paralel

executes actions in parallel

    ```
    var chain = Parallel(action1, action2, action3)
    chain.on('finish.app', function() {
      console.log("all tasks performed");
    });
    Story().addState(trigger, chain);
    ```

raises `finish` signal when all the tasks has been completed

### Oddysey.Actions
### Oddysey.Triggers
### Custom actions
### Custom triggers
