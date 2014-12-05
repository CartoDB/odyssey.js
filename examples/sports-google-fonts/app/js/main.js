var USER = getParameterByName('user');
var TABLE_NAME = getParameterByName('table_name');
var VIZJSON = getParameterByName('vis');
var VIZJSON_URL;
var TITLE = getParameterByName('title');
var DESCRIPTION = getParameterByName('description');
var DURATION = getParameterByName('duration');
var TEAM1 = _.escape(getParameterByName('t').split('|')[0].split(',')[0]);
var TEAM1_COLOR = '#' + _.escape(getParameterByName('t').split('|')[0].split(',')[1]);
var TEAM1_SANITIZED = sanitizeCountry(TEAM1);
var TEAM2 = _.escape(getParameterByName('t').split('|')[1].split(',')[0]);
var TEAM2_COLOR = '#' + _.escape(getParameterByName('t').split('|')[1].split(',')[1]);
var TEAM2_SANITIZED = sanitizeCountry(TEAM2);
var TIME = false;


function torque(layer) {
  function _torque() {}

  _torque.reach = function (slide) {
    var i = slide.get('step').value;

    function formaterForRange(start, end) {
      start = start.getTime ? start.getTime(): start;
      end = end.getTime ? end.getTime(): end;
      var span = (end - start)/1000;
      var ONE_DAY = 3600*24;
      var ONE_YEAR = ONE_DAY * 31 * 12;
      function pad(n) { return n < 10 ? '0' + n : n; };

      // lest than a day
      if (span < ONE_DAY) return function(t) { return pad(t.getUTCHours()) + ":" + pad(t.getUTCMinutes()); };
      if (span < ONE_YEAR) return function(t) { return pad(t.getUTCMonth() + 1) + "/" + pad(t.getUTCDate()) + "/" + pad(t.getUTCFullYear()); };
      return function(t) { return pad(t.getUTCMonth() + 1) + "/" + pad(t.getUTCFullYear()); };
    }

    function getTimeOrStep(s) {
      var tb = layer.getTimeBounds();
      if (!tb) return;
      if (tb.columnType === 'date') {
        if (tb && tb.start !== undefined) {
          var f = formaterForRange(tb.start, tb.end);
          // avoid showing invalid dates
          if (!_.isNaN(layer.stepToTime(s).getYear())) {
            return f(layer.stepToTime(s));
          }
        }
      } else {
        return s;
      }
    }

    if (!TIME) {
      $('.Footer-time--l').text(getTimeOrStep(0));
      $('.Footer-time--r').text(getTimeOrStep(layer.options.steps));

      TIME = true;
    }

    var t = O.Trigger({});

    var title = slide.html().split("<h1>")[1].split("</h1>")[0];
    var type = title.split('+')[0];
    var team = title.split('+')[1];
    var visible = title.split('+')[2] === 'true';
    var subtitle = slide.html().split("<h2>")[1].split("</h2>")[0];
    var content = slide.html().split("</h2>")[1];

    if (visible) {
      // tooltips
      var l = i*$('.slider').width()/layer.options.steps;

      var tooltip = ['<div class="slide-tip slide-tip-'+i+' slide-tip-'+team+' slide-tip-'+type+'" style="left:'+l+'px">',
                     '<div class="tooltip">',
                     '<h2>'+getTimeOrStep(i)+'</h2>'+(subtitle ? '<p>'+subtitle+'</p>' : ''),
                     '</div>',
                     '</div>'].join("\n");

      $('.slider').append(tooltip);
    }

    if (type === 'slide') {
      // slides
      var notification = ['<li class="Notification Notification_'+i+'">',
                          '<div class="Notification-text">',
                          '<p class="Notification-time">'+getTimeOrStep(i)+'</p>',
                          '<div class="Notification-content">'+(subtitle ? '<h2>'+subtitle+'</h2>' : ''),
                          '<p>'+content+'</p>',
                          '</div>',
                          '</li>'].join("\n");

      $('.Notifications > ul').append(notification);
      var $notification = $('.Notification_'+i);
    }

    if (type === 'score') {
      var $number = $('.Scoreboard-team--'+team+' .Scoreboard-number');

      var n = parseInt($number.text(), 10);

      var counter = '<p class="Scoreboard-number Scoreboard-number--'+(n+1)+' Scoreboard-number_'+i+'">'+(n+1)+'</p>';

      $('.Scoreboard-team--'+team+' .Scoreboard-count').append(counter);

      var $counter = $('.Scoreboard-number_'+i);
    }

    var $tip = $('.slide-tip-'+i+' .tip');
    var $tooltip = $('.slide-tip-'+i+' .tooltip');
    var w = $tip.width()/2;

    $tip.css({ margin: -w });

    function check(changes) {
      // console.log(changes);

      if (changes.step === 0) {
        $('.Scoreboard-number').removeClass('is-visible');
        $('.Scoreboard-number--0').addClass('is-visible');
      }

      var w = changes.step*100/1440;
      $('.progress').width(w+'%');

      if (changes.step >= i-5 && changes.step < i+5) {
        t.trigger();

        if ($notification && !$notification.is(':visible')) {
          $notification.show()
            .animate({
              marginRight: 0,
              opacity: 1
            }, 150);
        }

        if ($counter && !$counter.is(':visible')) {
          $counter.siblings('.Scoreboard-number').removeClass('is-visible');
          $counter.addClass('is-visible');
        }

        if (!$tooltip.is(':visible')) {
          $tooltip.fadeIn(150);
        }

      } else if (changes.step >= i+5 && changes.step < i+10) {
        setTimeout(function() {
          $notification && $notification
            .animate({
              marginRight: -30,
              opacity: 0
            }, 150, function() {
              $(this).appendTo($('.Notifications > ul'));
              $(this).hide();
            });
        }, 6000);

        setTimeout(function() {
          $('.tooltip').fadeOut(150);
        }, 2000);
      }
    };

    layer.on('change:time', check);

    t.clear = function() {
      layer.off('change:time', check);
    }

    return t;
  }

  _torque.pause = function() {
    return O.Action(function (){
      layer.pause();
    });
  }

  _torque.play = function() {
    return O.Action(function () {
      layer.play()
    });
  }

  return _torque;
}


O.Template({

  init: function() {
    var self = this;

    var baseurl = this.baseurl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
    var map = this.map = L.map('map').setView([0, 0], 4);
    var basemap = this.basemap = L.tileLayer(baseurl, {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    var slides = this.slides = O.Actions.Slides('slides');
    var story = this.story = O.Story();

    if (USER && VIZJSON) {
      VIZJSON_URL = 'http://' + USER + '.cartodb.com/api/v2/viz/' + VIZJSON + '/viz.json';

      $('.Scoreboard-team--1 .team-marker').css({ background: TEAM1_COLOR});
      $('.Scoreboard-team--2 .team-marker').css({ background: TEAM2_COLOR});

      $('.Scoreboard-team--1 .Scoreboard-title').text(TEAM1);
      $('.Scoreboard-team--2 .Scoreboard-title').text(TEAM2);

      var md = [
        '```',
        '-title: "' + TITLE + '"',
        '-author: "author"',
        '-vizjson: "' + VIZJSON_URL + '"',
        '-duration: ' + DURATION || 30,
        '```',
        '\n'
      ].join('\n');

      var sql = new cartodb.SQL({ user: USER });
      sql.execute("SELECT * FROM " + TABLE_NAME + " ORDER BY step ASC")
        .done(function(data) {
          var rows = data.rows;

          for (var i = 0; i < rows.length; ++i) {
            var slide = rows[i];

            var slide_info = "";

            var slide_md = [
              "#"+slide.name+'+'+slide.team+'+'+slide.visible,
              '```'+'\n'+'-step: '+slide.step+'\n'+(slide.info ? slide.info+'\n' : '') + '```',
              "##"+slide.title,
              slide.description
            ].join('\n');

            md = md + '\n' + '\n' + slide_md;
          }

          O.Template.Storage.save(md.replace(/"/g, '\''), 'torque');
        });
    }
  },

  _initActions: function(actions) {

    for (var i = 0; i < actions.length; ++i) {
      var slide = actions[i];

      var action = O.Parallel(
        O.Actions.CSS($(".Notifications")).addClass('is-visible'),
        this.slides.activate(i),
        slide(this)
      );

      if (!slide.get('step')) return;

      this.story.addState(
        torque(this.torqueLayer).reach(slide),
        action
      )
    }
  },

  update: function(actions) {
    var self = this;

    cdb.vis.Loader.get(VIZJSON_URL, function(vizjson) {
      TITLE = vizjson.title;
      DESCRIPTION = vizjson.description;
      console.log(TITLE);
      $('.Footer-infoTitle').text(TITLE);

      for (var i = 0; i < vizjson.layers.length; ++i) {
        self.map.fitBounds(vizjson.bounds);

        var torqueIndex;

        if (vizjson.layers[i].type === 'torque') {
          cartodb.createLayer(self.map, vizjson, { layerIndex: i })
            .done(function(layer) {
              self.torqueLayer = layer;
              self.torqueLayer.stop();

              self.map.addLayer(self.torqueLayer);


              function formaterForRange(start, end) {
                start = start.getTime ? start.getTime(): start;
                end = end.getTime ? end.getTime(): end;
                var span = (end - start)/1000;
                var ONE_DAY = 3600*24;
                var ONE_YEAR = ONE_DAY * 31 * 12;
                function pad(n) { return n < 10 ? '0' + n : n; };

                // lest than a day
                if (span < ONE_DAY) return function(t) { return pad(t.getUTCHours()) + ":" + pad(t.getUTCMinutes()); };
                if (span < ONE_YEAR) return function(t) { return pad(t.getUTCMonth() + 1) + "/" + pad(t.getUTCDate()) + "/" + pad(t.getUTCFullYear()); };
                return function(t) { return pad(t.getUTCMonth() + 1) + "/" + pad(t.getUTCFullYear()); };
              }

              function getTimeOrStep(s) {
                var tb = layer.getTimeBounds();
                if (!tb) return;
                if (tb.columnType === 'date') {
                  if (tb && tb.start !== undefined) {
                    var f = formaterForRange(tb.start, tb.end);
                    // avoid showing invalid dates
                    if (!_.isNaN(layer.stepToTime(s).getYear())) {
                      return f(layer.stepToTime(s));
                    }
                  }
                } else {
                  return s;
                }
              }

              self.torqueLayer.on('change:steps', function() {
                self.torqueLayer.play();
                self.torqueLayer.actions = torque(self.torqueLayer);
                self._initActions(actions);
              });
            }).on('error', function(err) {
              throw new Error("Some error occurred: " + err);
            });
        }
      }
    });
  }

});
