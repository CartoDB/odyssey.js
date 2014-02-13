

m = map();

Story()
  .addState(Scroll('tt3', 400), m.moveTo([51.54, -0.08]), 'name1')
  .addState(Scroll('tt', 400), m.moveTo([51.53, -0.07]))
  .addState(Scroll('tt2', 400), m.moveTo([51.52, -0.075]));

/*
Story()
  .addLinearState(Scroll(), map.GrowLine(points|line))
  .addLinearState(Scroll(), map.Zoom([1, 1.2, 4.5, 2.1]))
  .addState(ScrollReach('10%'), chain(
    map.addMarker(),
    map.showPopup()
  )
*/
  

/*

//
// define an slide based story
// 
Story()
  .addState(Slide(1), m.moveTo([51.54, -0.08], 10))
  .addState(Slide(2), m.moveTo([51.53, -0.07], 20))
  .addState(Slide(3), m.moveTo([51.52, -0.075], 30));


//
// define an story that changes marker colors based on clicks
// 
Story()
  .addState(Click('#el1'), m.moveTo([51.54, -0.08]).changeMarkerStyle({ color: red }));
  .addState(Click('#el2'), m.moveTo([1.53, -1.4]).changeMarkerStyle({ color: blue}));


//
// custom triggers could be created in this way
//
function Click(el) {
  var plugin = {}
  StoryMapPlugg(pluggin);

  $(el).click(function() {
    pluggin.trigger();
  });

  // this function is called when the state has been activated
  pluggin.inverse = function() {
    $(el).style('color', 'red');
  }

  return plugin;
}

//
// custom map actions can be done too
// 

map.addAction('addMarker', function(storyMap) {
  function addMarker(pos, content)
    L.marker(pos).addTo(storyMap.map()).bindPopup(content);
    return storyMap;
  }
  return addMarker;
})

//
// then we could have high level api with a json based stuff and templates
// 

var story = StoryMap.load(el, '/url/to/story.json');
story.goTo('name1')

*/






