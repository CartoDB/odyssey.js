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

#### Create a new Story

On the [homepage](../), click the button to create a new story or go [here](../editor/editor.html)

#### Name your project

Change the top level data in the editor. Change the _title_ and the _author_. You should see changes to these elements live in the Template preview.

~~~md
```
- title: "10 years later..."
- author: "Homer"
```
~~~

#### Add story content

Stories are broken down into _chapters_. Each chapter begins with a _title_ and then can contain a mix of headlines, text and other Markdown elements (images, links, etc.). Here is an example of one chapter:

~~~md
```
# The beginning

Tell me, O muse, of that ingenious 
hero who travelled far
```
~~~

#### Publish your story

There are a few options for publishing your story. The first is to publish it directly to the web using the **Publish** button. By using the Publish button, your story will be hosted on GitHub and you will be provided a public link to share and view your story. The second way to publish a story is to click the **Download** button to save a local copy of the story. You can then host this copy on your own GitHub account or your own servers. The archive will contain the HTML, CSS, and JavaScript you need to publish the story wherever you prefer.

**TODO**
**Include annotated image of the publish options**

#### Embed it on your site

**TODO**
**Include iframe link on the gist publish dialog**
**After that, add this section plus screenshots**

#### Save and return to your story

You can always save and return to your existing story by bookmarking your current URL. The URL is dynamic, so any changes you make in the editor will result in a new URL. **Be sure to rebookmark the page if you make changes**. You can also _cut & paste_ the URL to share with collaborators.

## The Odyssey Editor

The Odyssey Editor allows you to link map changes and movements to different elements in a web document through the use of [Markdown](http://daringfireball.net/projects/markdown/syntax). We have included a small number of webpage templates to help you quickly create your stories.

<img src="http://i.imgur.com/i0c3bLL.gif" width="100%" />

### Templates

Templates control the overal structure and layout of your story. They define the position of your map and story elements and define the method your story will progress. We have developed 3 templates to get you started.

#### Slide template

**todo**
_describe this template and how it controls the flow of your story_
_provide a link to an example (created using only the editor)_

#### Scrolling template

**todo**
_describe this template and how it controls the flow of your story_
_provide a link to an example (created using only the editor)_

#### Torque template

**todo**
_describe this template and how it controls the flow of your story_
_provide a link to an example (created using only the editor)_

#### Custom templates

Experts can create and use custom Templates with Odyssey. If you are interested in using a custom template see the following section: **link**

**TODO**
**Add link to correct section below when prepared**

## Advanced use of the editor

### Config block

The config block is a control element at the top of your story's Markdown document. You can capture information such as _author_ and _project title_ using the config block. Depending on which template you choose, information from the config block may be displayed as part of the webpage. 

#### Available options

~~~md
```
- title: "This is my story title"
- author: "Odyssey master"
```
~~~

- title: "_Title of your story_"
- author: "_Name of the story author_"

### Markdown syntax

The Markdown syntax used in the Odyssey Editor uses all the features documented in the [Daring Fireball](http://daringfireball.net/projects/markdown/syntax) documentation.

### Chapters

Chapters define each section of your story and allow you to perform new Actions when a user reaches the chapter. Chapters are defined by including a new header element, the ```#```` in Markdown. In this example code shown, the line **# The escape** would indicate the start of a new chapter.

~~~md
```
# The escape

But as the sun was rising from the 
fair sea into the firmament...
```
~~~

### The Actions block

At the heart of Odyssey are **Actions**. For each chapter of your story, you can add one or many actions to unfold when the reader arrives. Each time you add a new chapter, an **add** button appears in the editor to the left of the chapter's starting line. You can click the add button to create new Actions in the chapter. You can string Actions together, one followed by the next, and use the Sleep action to create delays between actions.

You can also add actions manually once you get a hang of the syntax. The code shown here demonstrates what a chapter title and action block will look like in the editor.

~~~md
# Title of the section
```
- center: [10.000, -10.000]
- zoom: 6
L.marker([0.0000, 0.0000]).actions.addRemove(S.map)
```
~~~

See the Actions section for a complete list of available actions and their descriptions.

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
Here, the Alt text is the same as above, but the ```[id]``` is the name of a defined image reference which you have named elsewhere. It would look something like:
~~~
[id]: url/to/image  "Optional title attribute"
~~~

Finally, you can also use simple HTML <img> tags if you wish to edit attributes of the image, like size.

### Links

**TODO** how to add links to your Markdown text

## Actions

**TODO**
**Add a list of all available actions**
**Include an indication of which templates they are available in**

#### Map Actions

_Move to_ - **todo**

_Zoom to_ - **todo**

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

## Javascript API

#### Story object

Will attach each story state to the Odyssey story object.

~~~javascript
var story = O.Story();
~~~

#### Sequence object

The `sequential` object contains the logic for moving forward and backward through the story states attached to your story` object.

~~~javascript
var seq = O.Sequential();
~~~

#### Keys object

The `keys` object abstracts the keyboard based interaction with your story, allowing you to quickly attach left and right key strokes to movement through your story.

~~~javascript
O.Keys().left().then(seq.prev, seq);
O.Keys().right().then(seq.next, seq);
~~~

### Basic functions

_todo_

### Advanced functions

#### YouTube

_todo_

#### Torque

_todo_

### Custom functions

_todo_

## Contributing code

#### Improving documentation

Now go to [http://locahost:8000/docs/index.html](http://locahost:8000/docs/index.html)

You can add to or edit this file by editing the [Markdown](http://daringfireball.net/projects/markdown/syntax) in the file ```docs/doc.md```.

#### Developing the Editor

First, change into the editor and start compass.

~~~sh
editor/
compass watch
~~~

Next, start the server as above and go to [http://locahost:8000/editor/editor.html](http://locahost:8000/editor/editor.html)

#### Submitting improvements

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


## Old content

### Oddysey.Story

controls the state of the story managing the states. Each story contains states and triggers control
which state is the active one.

#### Oddysey.Story.addState(trigger, action)
Adds a new state to the story. `action` will be called when `trigger` is triggered. `action`
`enter` method is only called when the story enters in this state.

~~~javascript
Story().addState(trigger, action);
~~~

#### Oddysey.Story.addLinearState(trigger, action)
Does the same than `addState` but in this case `update` method in the `action` is called every time
the trigger is updated

#### Oddysey.Story.go(action_index[, options])

Move story to desired state
  * `action_index`: base 0 index of state
  * `options`: todo


#### Oddysey.Chain

executes actions serially, waits until the previous task is completed to start with the second and so on

~~~javascript
var chain = Chain(action1, action2, action3)
chain.on('finish.app', function() {
  console.log("all tasks performed");
});
Story().addState(trigger, chain);
~~~

raises `finish` signal when all the tasks has been completed

#### Oddysey.Paralel

executes actions in parallel

~~~javascript
var chain = Parallel(action1, action2, action3)
chain.on('finish.app', function() {
  console.log("all tasks performed");
});
Story().addState(trigger, chain);
~~~

raises `finish` signal when all the tasks has been completed

### Oddysey.Actions

### Oddysey.Triggers

### Custom actions

### Custom triggers
