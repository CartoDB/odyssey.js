---
layout: documentation
title: 'Odyssey.js · Documentation'
css_assets:
  - "/css/docs.css"
---

## How it works

Odyssey.js is an open-source tool that allows you to combine maps, narratives, and other multimedia into a beautiful story. Creating new stories is simple, requiring nothing more than a modern web-browser and an idea. You enhance the narrative and multimedia of your stories using Actions (e.g. map movements, video and sound control, or the display or new content) that will let you tell your story in an exciting new way. Use our Templates to control the overall look and feel of your story in beautifully designed layouts.

Experts can also add custom Templates and Actions by following our contribution guide. We are excited about adding YouTube, Vimeo, Soundcloud, and Twitter based Actions, if you can help let us know!

The library is open source and freely available to use in your projects.

**Warning**

**We are at an early stage of development where many things are still in flux! Be prepared for what you see today to change tomorrow :)**

## Quick start

**TODO** Create a quickstart video. Very simple, starting at editor and creating a story and publishing as a gist. Narrate and make it short (4 minutes) and possible to watch on its own.

### Create a new Story

If you want to start using the on-line editor, go to the [homepage](../), click the button to create a new story or just go [here](../editor/editor.html).

#### Name your project

Change the top level data in the editor. Change the _title_ and the _author_. You should see changes to these elements live in the Template preview.

~~~md

- title: "10 years later..."
- author: "Homer"

~~~

#### Add story content

Stories are broken down into _chapters_. Each chapter begins with a _title_ and then can contain a mix of headlines, text and other Markdown elements (images, links, etc.). Here is an example of one chapter:

~~~md

# The beginning

Tell me, O muse, of that ingenious
hero who travelled far

~~~

### Publish your story

There are a few options for publishing your story. The first is to publish it directly to the web using the **Publish** button. By using the Publish button, your story will be hosted on GitHub and you will be provided a public link to share and view your story. The second way to publish a story is to click the **Download** button to save a local copy of the story. You can then host this copy on your own GitHub account or your own servers. The archive will contain the HTML, CSS, and JavaScript you need to publish the story wherever you prefer.

**TODO**
**Include annotated image of the publish options**

### Publish it on your site

In the **Share** options for your story, you can select the third option, _IFRAME_.

<img src="http://i.imgur.com/lj9DCQ9.gif" width="100%" />

After you have selected iFrame, you can use this code to embed your story on your website or blog. 

### Save and return to your story

You can always save and return to your existing story by bookmarking your current URL. The URL is dynamic, so any changes you make in the editor will result in a new URL. **Be sure to rebookmark the page if you make changes**. You can also _cut & paste_ the URL to share with collaborators.

## The Odyssey Editor

The Odyssey Editor allows you to link map changes and movements to different elements in a web document through the use of [Markdown](http://daringfireball.net/projects/markdown/syntax). We have included a small number of webpage templates to help you quickly create your stories.

<img src="http://i.imgur.com/i0c3bLL.gif" width="100%" />

### Hosted Templates

Templates control the overal structure and layout of your story. They define the position of your map and story elements and define the method by which your story will progress. We have developed three templates to get you started.

#### Slide template

The slide template acts like a Keynote or PowerPoint presentation. Your story is broken down into different states or slides, so you can go forward or backward just by clicking the arrows on the screen buttons or by pressing the forward/back arrows on your keyboard. This is perfect for stories that don't have too much text and you want to highlight the map as the principal element.

**todo**
_provide a link to an example (created using only the editor)_

#### Scroll template

The scroll template is moves based on when the viewer scrolls the page. As you scroll up or down, the story moves forward or backward. This template works really well with stories that have a lot of editorial content such as images and texts, and where the map adds more context to the story.

**todo**
_provide a link to an example (created using only the editor)_

#### Torque template

Use this template if your data is animated. This template adds triggers to your animated map so when reaching a certain point on the timeline your contextual information changes. This is perfect for adding extra information to animated stories.

**todo**
_provide a link to an example (created using only the editor)_

### Custom templates

Experts can create and use custom Templates with Odyssey. If you are interested in using a custom template see the following section: **link**

**TODO**
**Add link to correct section below when prepared**

## Advanced use of the editor

### Markdown syntax

Markdown syntax is used in the Odyssey Editor and contains all the features documented in the [Daring Fireball](http://daringfireball.net/projects/markdown/syntax) documentation.

### Config block

The config block is a control element at the top of your story's Markdown document. You can capture information such as _author_ and _project title_ using the config block. Depending on which template you choose, information from the config block may be displayed as part of the webpage.

#### Default options

~~~md

- title: "This is my story title"
- author: "Odyssey master"

~~~

- title: "_Title of your story_"
- author: "_Name of the story author_"

#### Torque options

~~~md
- vizjson: "http://viz2.cartodb.com/api/v2/viz/your-viz-key-here/viz.json"
- duration: 30
~~~

- vizjson: "_the url to your cartodb torque visualization_"
- duration: "_duration of torque animation (default is 30)_"

### Chapters

Chapters define each section of your story and allow you to perform new Actions when a user reaches the chapter. Chapters are defined by including a new header element, the `#` in Markdown. In this example code shown, the line **# The escape** would indicate the start of a new chapter.

~~~md

# The escape

But as the sun was rising from the
fair sea into the firmament...

~~~

### The Actions block

At the heart of Odyssey are **Actions**. For each chapter of your story, you can add one or many actions to unfold when the reader arrives. Each time you add a new chapter, an **add** button appears in the editor to the left of the chapter's starting line. You can click the add button to create new Actions in the chapter. You can string Actions together, one followed by the next, and use the Sleep action to create delays between actions.

You can also add actions manually once you get a hang of the syntax. The code shown here demonstrates what a chapter title and action block will look like in the editor.

~~~md
# Title of the section

- center: [10.000, -10.000]
- zoom: 6
L.marker([0.0000, 0.0000]).actions.addRemove(S.map)

~~~

See the list below for a complete list of available actions and their descriptions.

#### Map Actions

_Move to_ 

- simply set the map's new center point in latitude and longitude decimal degrees.

```
- center: [40.7127, -74.0059]
```

_Zoom to_  
- set the map's new zoom level using an integer number from 0 to 18.
```
- zoom: 3
```

#### Control Actions

_Sleep_ - **todo**

#### Data Actions

_Show marker_ - **todo**

_Show infowindow_ - **todo** (ask @javisantana when this will be ready)

#### Video actions

**todo** ask @javisantana when this will be ready.

#### Audio actions

**todo** _html5audio_

**pending** _soundcloud_

#### Torque Actions

_Play_ - **todo**

_Pause_ - **todo**

_Insert time_ - **todo**

**TODO**
**Add an Actions section at the main level of Documentation**

### Images

Adding images in Markdown is simple, and you have a few options. The first is the following:

~~~md
![Alt text](/path/to/img.jpg)
~~~

Here, the "Alt text" will appear when you hover, and the image path or URL is specified in the parentheses.

If you want to use a defined image reference, you can also do that. The markdown would look like:

~~~md
![Alt text][id]
~~~

Here, the Alt text is the same as above, but the [id] is the name of a defined image reference which you have named elsewhere. It would look something like:

~~~md
[id]: url/to/image  "Optional title attribute"
~~~

Finally, you can also use simple HTML <img> tags if you wish to edit attributes of the image, like size. For example:

~~~md
<img width="200px" src="http://imgur.com/69Gxjih.jpg" />
~~~

### Links

In Markdown, there are two ways to add links. Both are similar to how you add images, which we described above. The simplest way is to add links inline. Your markdown would look like:

~~~md
This is [an example](http://example.com/ "Title") inline link.
~~~

Here, the text in brackets would be the active link. The URL is placed within parentheses and can also be a relative path to a local resource. The Title is entirely optional, and can be left out.

You can also use a reference-style link, which would look like:

~~~md
This is [an example][id] reference-style link.
~~~

Here, the first text in parentheses would be the link, and the second text is a label refering to the label you have defined elsewhere in your document. The definition of your label (i.e. assigning it a URL to visit) would look like:

~~~md
[id]: http://example.com/  "Optional Title Here"
~~~

## Javascript API

### Install

Grab dist/odyssey.js and add it at the end of your `<body>` element in your html file.

~~~html
<script src="odyssey.js"></script>
~~~


### Quick start

**TODO**

### Story object

The main object in Odyssey.js is the Story object. You can initialize a new story object as follows:

~~~javascript
var story = O.Story();
~~~

#### addState(_trigger_, _action_)

Adds a new state to the story. [`action`](#) will be called when [`trigger`](#) is triggered. Action method is only called when the story enters in this state.

~~~javascript
Story().addState(trigger, action); 
//TODO: IMPROVE THIS EXAMPLE
~~~

#### addLinearState(_trigger_, _action_)

Does the same than `addState` but in this case `update` method in the `action` is called every time
the trigger is updated.

#### state()

Returns the current state number, 0 based index.

#### go(action_index,[ options])

Move story to the desired state

  - `action_index`: Base 0 index of state

Available options

  - `reverse`: Boolean, default false. Set it to true to call `reverse` method in the trigger when the state is set.

~~~javascript
// This goes to the second state in the story
Story().go(1);
~~~

### Action object

Converts a function or object into an action.

~~~javascript
var hideDivAction = O.Action(function() {
    $('#element').hide()
});

// this hides #element when right key is pressed
story.addAction(O.Keys().right(), hideDivAction)
~~~

More advanced actions can be created. For example, let's define one that shows an element when the story enters in
the state and hides it when leaves it:

~~~javascript
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

story.addState(O.Keys().right(), ShowHideAction($('#element')));
~~~


### Trigger object

Creates a trigger that can raise actions. For example, below is a trigger that is raised every 3 seconds.

~~~javascript
function IntervalTrigger() {
    t = O.Trigger();
    setInterval(funtion() {
        t.trigger();
    }, 3000)
    return t;
}

// Note that if the trigger is raised again it has no effect
story.addState(IntervalTrigger(), O.Debug().log('enter')); 
~~~

#### trigger(_number_)

Raises the trigger. Optionally takes an argument, float [0, 1] if the action is linear, i.e a scroll

~~~javascript
//TODO: ADD EXAMPLE
~~~

### Step Object

Accepts an unlimited number of actions and execute them in a sequence. Waits until the previous action is completed to start with the next one. The example below raises `finish` signal when all the tasks has been completed.

~~~javascript
var step = O.Step(action1, action2, action3);
step.on('finish.app', function() {
  console.log("all tasks performed");
});

Story().addState(trigger, step);
~~~

The following example shows how to include a [`Sleep`](#) between actions

~~~javascript
story.addState(O.Keys().right(), O.Step(
  O.Debug().log('rigth key pressed'),
  O.Sleep(1000),
  O.Debug().log('this is printed after 1 second')
))
~~~


### Parallel Object

Similar to Step but execute the defined actions at the same time. The example below raises `finish` signal when all the tasks has been completed.

~~~javascript
var parallel = Parallel(action1, action2, action3);
parallel.on('finish.app', function() {
  console.log("all tasks performed");
});

O.Story().addState(trigger, parallel);
~~~


### Sequence Object

Contains the logic for moving forward and backward through the story states attached to your story object.

~~~javascript
//TODO: THIS IS NOT CLEAR ENOUGH
var seq = O.Sequence();
O.Story()
  .addState(seq.step(0), action1);
  .addState(seq.step(1), action2);

seq.next() // raises action1
seq.next() // raises action2
~~~

#### next()

Goes to the nextstate

#### prev()

Goes to the prev state

#### step(_number_)

Generates a trigger which is raised when the sequence moves to state `n`

~~~javascript
//TODO: ADD EXAMPLE.
~~~

#### current(_number_)

Set (triggers) or get the current step

~~~javascript
//TODO: ADD EXAMPLE.
~~~


### Keys

The `keys` object abstracts the keyboard based interaction with your story, allowing you to quickly attach left and right key strokes to movement through your story.

~~~javascript
O.Story()
  .addState(O.Keys().left(), action1);
  .addState(O.Keys().right(), action1);
~~~

It also can be used together with the [`Sequence`](#) object.

~~~javascript
O.Keys().left().then(seq.prev, seq);
O.Keys().right().then(seq.next, seq);
~~~

#### right()

Returns a trigger that is raised when user press right key

#### left()

Returns a trigger that is raised when user press left key


### Scroll
Manages page scroll

~~~javascript
// action will be called when the scroll is within the vertical scape of #myelement
O.Story()
    .addState(O.Scroll().within($('#myelement'), action) 
~~~

#### within(_el_)
Returns a trigger raised when the scroll is within the vertical space of the specified element. For example, if there is a #div_element with style `position: absolute; top: 400px` the trigger will be raised when the scroll of the page is 400px.

`el` can be a DOMElement or a jQuery object and optionally an `offset` can be set.

~~~javascript
// in this case the trigger will be raised when the scroll of the page is at 200px
O.Story()
  .addState(O.Scroll().within($('#myelement').offset(200), action) 
~~~

#### less(_el_)
Returns a trigger which is raised when the scroll is less than the element position in pixels `element` can be a DOMElement or a jQuery object.

#### greater(_el_)
Returns a trigger which is raised when the scroll is greater than the element position in pixels `element` can be a DOMElement or a jQuery object.


### Slides
Given an DOM element with children return actions to swtich between them. With the following html:

~~~html
<div id="slides">
    <div class="slide">slide 1</div>
    <div class="slide">slide 2</div>
</div>
~~~

A story like this can be created with the following code.

~~~javascript
var slides = O.Slides($('#slides'));
O.Story()
    .addState(trigger1, slides.activate(0))
    .addState(trigger2, slides.activate(1))
~~~

When `trigger1` is raised, the first slide will have the style `display: block` and the other ones `display: none`. It hides all when no action was raised.


### Leaflet Object

#### Map Object
Contains actions to manage the Leaflet Map object. This is included as a leaflet map plugin, so can be used from `actions`.

~~~javascript
var map = new L.Map('map', {
  center: [37, -91],
  zoom: 6
});

O.Story()
  .addState(O.Scroll().within($('#myelement'), map.actions.panTo([37.1, -92]);
~~~

#### panTo(_latlng_)

See Leaflet [panTo](http://leafletjs.com/reference.html#map-panto) method

~~~javascript
// TODO: ADD EXAMPLE
~~~

#### setView()

See Leaflet [setView](http://leafletjs.com/reference.html#map-setview) method

~~~javascript()
// TODO: ADD EXAMPLE
~~~

#### setZoom()

See Leaflet [setZoom](http://leafletjs.com/reference.html#map-setzoom) method

~~~javascript
// TODO: ADD EXAMPLE
~~~

### Marker
Creates actions to manage leaflet markers. It can be used as a leaflet plugin using `actions` in ``L.Marker`` instance

~~~javascript
var map = new L.Map('map', {
  center: [37, -91],
  zoom: 6
});

O.Story()
  .addState(
    O.Scroll().within($('#myelement'), 
    L.marker([37.1, -92]).actions.addTo(map)
  );
~~~

#### addTo(_map_)
Creates an action that adds the marker instance to the specified `map`.

#### addRemove(_map_)
Creates an action that adds the marker instance to the specified `map` when the story enters in the action and removes when the story leaves it.

### Icon
Creates an action that changes the icon of a marker. It receives two arguments _(iconEnabled, iconDisabled)_.

~~~javascript
var marker = L.marker([0, 0])
O.Story()
  .addState(
    O.Scroll().within($('#myelement'), 
    marker.actions.icon('enabled.png', 'disabled.png')
  );
~~~


### Popup
Creates actions to manage [leaflet popups](http://leafletjs.com/reference.html#popup) or also called infowindows. It can be used as a leaflet plugin using `actions` attribute.

~~~javascript
var map = new L.Map('map', {
  center: [37, -91],
  zoom: 6
});
var popup = L.popup().setLatLng(latlng).setContent('<p>popup for action1</p>')

O.Story()
  .addState(O.Scroll().within($('#myelement'), popup.actions.openOn(map));
~~~

#### openOn(_map_)

Returns an action that opens the popup in the specified `map` see [L.Popup.openOn](http://leafletjs.com/reference.html#popup-openon) documentation.

### CSS
Actions related to css tasks. All the actions inside this module needs the elements to be jQuery.

#### toggleClass

**TODO: DOCUMENT

~~~javascript
O.Story()
  .addState(trigger, CSS($('#element')).toggleClass('visible'));
~~~

### Debug

Actions for debugging pourposes. 
**TODO: EXTEND

#### log(_text_)
Prints current state plus the `text`.

~~~javascript
O.Story()
  .addState(trigger, Debug().log('this is a test'));
~~~

### Location
Actions related with the `window.location` object.
**TODO: EXTEND

#### changeHash(_string_)

Changes the url hash

~~~javascript
O.Story()
  .addState(trigger, Location.changeHash('/slide/1'));
~~~

### Sleep(_ms_)

Action that sleeps the execution for some time, it's useful when using `Step`.

~~~javascript
O.Story()
  .addState(trigger, O.Step(
    Debug().log('executed now')),
    O.Sleep(1000),
    Debug().log('executed 1 second later'))
  ));
~~~

### Audio
Actions to control HTML5 audio element

#### play
**TODO: EXTEND

~~~javascript
O.Story()
  .addState(trigger, O.Audio('#audio_el').play());
~~~

#### pause
**TODO: EXTEND

~~~javascript
O.Story()
  .addState(trigger, O.Audio('#audio_el').pause());
~~~

#### setCurrentTime(_t_)

Sets current play time
**TODO: EXTEND

~~~javascript
O.Story()
  .addState(trigger, O.Audio('#audio_el').setCurrentTime(1400));
~~~

### Basic functions

_todo_

### Advanced functions

### YouTube

_todo_

### Torque

_todo_

### Custom functions

_todo_

## Contributing code

### Improving documentation

Now go to [http://locahost:8000/docs/index.html](http://locahost:8000/docs/index.html)

You can add to or edit this file by editing the [Markdown](http://daringfireball.net/projects/markdown/syntax) in the file docs/doc.md.

### Developing the Editor

First, change into the editor and start compass.

~~~sh
editor/
compass watch
~~~

Next, start the server as above and go to [http://locahost:8000/editor/editor.html](http://locahost:8000/editor/editor.html)

### Submitting improvements

Send a pull request to the original Odyssey.js repository!


## Developers

_todo intro_

### Run locally

**Step 1: Checkout the code**

~~~sh
git clone git@github.com:CartoDB/odyssey.js.git
cd odyssey.js
~~~

**Step 2: Install dependancies**

~~~sh
npm install
gem system --update
gem install compass
~~~

**Step 3. Start the server**

~~~sh
python -m SimpleHTTPServer
~~~

Now go to [http://locahost:8000/editor/editor.html](http://locahost:8000/editor/editor.html)

### Custom templates

Authoring new templates can be useful if you want to deploy new stories with a custom look and feel or if you have a new story type you want to contribute back to the Odyssey project for others to use.

**TODO**
_describe the rest of how to author a template_

**Adding to Odyssey**

If you are particularly happy with your template and think it could be useful for others, submit a pull request. See the Contributing section above for how to contribute. **TODO, make link to Contributing live**

### Custom Actions

**Action format**

_TODO_
_actions are written in this format... yada yada_

**Using locally**

_you can test your new actions locally by rebuilding the libarary_
_todo_
_steps for compile_

**Adding to Odyssey**

If you are particularly happy with your template and think it could be useful for others, submit a pull request. See the Contributing section above. **TODO, make link to Contributing live**



