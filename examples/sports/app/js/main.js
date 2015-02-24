var VIZJSON = getParameterByName('vis');
var VIZJSON_URL;
var TITLE;
var DESCRIPTION;
var DURATION;
var LAT = getParameterByName('center').split(',')[0];
var LNG = getParameterByName('center').split(',')[1];
var ZOOM = getParameterByName('center').split(',')[2];
var USER = getParameterByName('utn').split(',')[0];
var TABLE_NAME = getParameterByName('utn').split(',')[1];
var TEAM1 = _.escape(getParameterByName('t').split('|')[0].split(',')[0]);
var TEAM1_COLOR = '#' + _.escape(getParameterByName('t').split('|')[0].split(',')[1]);
var TEAM1_SANITIZED = sanitizeCountry(TEAM1);
var TEAM2 = _.escape(getParameterByName('t').split('|')[1].split(',')[0]);
var TEAM2_COLOR = '#' + _.escape(getParameterByName('t').split('|')[1].split(',')[1]);
var TEAM2_SANITIZED = sanitizeCountry(TEAM2);
var TIME = false;

function torque_(layer) {
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
    var score = title.split('+')[3];
    var slide_panel_title = title.split('+')[4];
    var subtitle = slide.html().split("<h2>")[1].split("</h2>")[0];
    var icon_url = decodeURIComponent(subtitle.split('+')[0]);
    var background = (icon_url != "null" && icon_url != "") ? "background: url("+icon_url+") no-repeat center;" : "";
    var tooltip_title = decodeURIComponent(subtitle.split('+')[1]);
    var slide_panel_content_md = slide.html().split("</h2>")[1];

    if (visible) {
      // tooltips
      var l = i*$('#map .slider').width()/layer.options.steps;

      var tooltip = ['<div class="slide-tip slide-tip-s'+i+((team != "null" && team != "") ? " slide-tip-t"+team : "")+' slide-tip-n'+type+'" style="left:'+l+'px;'+(type === "score" ? background : "")+'" data-steps="'+i+'">',
                     '<div class="tooltip">',
                     '<h2>'+getTimeOrStep(i)+'</h2>'+(tooltip_title ? '<p>'+tooltip_title+'</p>' : ''),
                     '</div>',
                     '</div>'].join("\n");

      $('#map .slider').append(tooltip);
    }

    if (type === 'slide') {
      // slides
      var notification = ['<li class="Notification Notification_'+i+'">',
                          '<div class="Notification-text">',
                          '<p class="Notification-time">'+getTimeOrStep(i)+'</p>',
                          '<div class="Notification-content">'+(slide_panel_title ? '<h2>'+slide_panel_title+'</h2>' : ''),
                          '<p>'+slide_panel_content_md+'</p>',
                          '</div>',
                          '</li>'].join("\n");

      $('.Notifications > ul').append(notification);
      var $notification = $('.Notification_'+i);
    }

    if (type === 'score') {
      var $number = $('.Scoreboard-team--'+team+' .Scoreboard-number').last();
      var n = parseInt($number.text(), 10);
      var counter = '<p class="Scoreboard-number Scoreboard-number--'+(n+1)+' Scoreboard-number_'+i+'">'+score+'</p>';

      $('.Scoreboard-team--'+team+' .Scoreboard-count').append(counter);
      var $counter = $('.Scoreboard-number_'+i);
    }

    var $sliderWrapper = $('#map .slider-wrapper');

    $('.slide-tip-s'+i)
      .on('mouseenter', function() {
        var $tooltipSlider = $(this).find('.tooltip').clone();
        $sliderWrapper.append($tooltipSlider.css({
          left: $(this).css('left'),
          top: $(this).css('top')
        }));
        $tooltipSlider.fadeIn(250);
      })
      .on('mouseleave', function() {
        $sliderWrapper.children('.tooltip').fadeOut(250, function() {
          $(this).remove();
        });
      });

    var $tip = $('.slide-tip-s'+i+' .tip');
    var $tooltip = $('.slide-tip-s'+i+' .tooltip');
    var w = $tip.width()/2;

    $tip.css({ margin: -w });

    function check(changes) {
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

    if (USER && VIZJSON) {
      VIZJSON_URL = 'http://' + USER + '.cartodb.com/api/v2/viz/' + VIZJSON + '/viz.json';

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
      sql.execute("SELECT * FROM " + TABLE_NAME + " ORDER BY date ASC")
        .done(function(data) {
          var rows = data.rows;

          // cartodb.createVis('map', VIZJSON_URL)
          cartodb.createVis('map', 'http://srogers.cartodb.com/api/v2/viz/bdd137fe-a60d-11e4-a7d7-0e4fddd5de28/viz.json')
            .done(function(vis, layers) {
              var map = self.map = vis.getNativeMap();
              if (getParameterByName('center') !== "") {
                map.setView([LAT, LNG], ZOOM);
              }

              cdb.vis.Loader.get(VIZJSON_URL, function(vizjson) {
                for (var t = 0; t < vizjson.layers.length; ++t) {
                  if (vizjson.layers[t].type === 'torque') {
                    cartodb.createLayer(map, vizjson, { layerIndex: t })
                      .done(function(layer) {
                        self.torqueLayer = layer;
                        map.addLayer(self.torqueLayer);
                      });
                  }
                }
              });
            });

          var init = false;

          setInterval(function() {
            if (self.torqueLayer && self.torqueLayer.getTimeBounds().start && self.torqueLayer.getTimeBounds().end && init === false) {
              function map_range(dateUNIXrequired, minDateUNIX, maxDateUNIX, steps) {
                return steps * (dateUNIXrequired - minDateUNIX) / (maxDateUNIX - minDateUNIX);
              }

              for (var i = 0; i < rows.length; ++i) {
                var slide = rows[i];
                var slide_info = "";
                var step = map_range(new Date(rows[i].date).getTime(), self.torqueLayer.getTimeBounds().start, self.torqueLayer.getTimeBounds().end, self.torqueLayer.options.steps);

                var slide_md = [
                  "#"+slide.event_type+'+'+slide.team_id+'+'+slide.visible+'+'+slide.score_panel+'+'+slide.slide_panel_title,
                  '```'+'\n'+'-step: '+parseInt(step, 10)+'\n'+(slide.odyssey_actions ? slide.odyssey_actions+'\n' : '') + '```',
                  "##"+encodeURIComponent(slide.event_icon_url)+'+'+encodeURIComponent(slide.tooltip_title),
                  slide.slide_panel_content_md
                ].join('\n');

                md = md + '\n' + '\n' + slide_md;
              }

              self.update(actionsFromMarkdown(md.replace(/"/g, '\'')));

              init = true;
            }
          }, 1);

          $('.Scoreboard-team--1 .team-marker').css({ background: TEAM1_COLOR});
          $('.Scoreboard-team--2 .team-marker').css({ background: TEAM2_COLOR});

          $('.Scoreboard-team--1 .Scoreboard-title').text(TEAM1);
          $('.Scoreboard-team--2 .Scoreboard-title').text(TEAM2);
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
        torque_(this.torqueLayer).reach(slide),
        action
      )
    }
  },

  _reposition: function() {
    var self = this;

    _.each($("#map .slide-tip"), function($slideTip) {
      var l = $($slideTip).data('steps')*$('#map .slider').width()/self.torqueLayer.options.steps;

      $($slideTip).css('left', l);
    });
  },

  update: function(actions) {
    var self = this;

    cdb.vis.Loader.get(VIZJSON_URL, function(vizjson) {
      TITLE = vizjson.title;
      DESCRIPTION = vizjson.description;

      document.title = TITLE;
      $('meta[name=description]').attr('content', DESCRIPTION);
      $('.Footer-infoTitle').text(TITLE);

      var slides = self.slides = O.Actions.Slides('slides');
      var story = self.story = O.Story();

      self.torqueLayer.play();
      self.torqueLayer.actions = torque_(self.torqueLayer);
      self._initActions(actions);

      var timeOut;

      $(window).on('resize', function() {
        if (timeOut != null) {
          clearTimeout(timeOut);
        }

        timeOut = setTimeout(function(){
          self._reposition();
        }, 400);
      });
    });
  }

});
