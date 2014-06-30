var Docs = Backbone.View.extend({
  el: document.body,

  events: {
    'click .menu-link': '_onClick'
  },

  initialize: function() {
    this.$el = $('body');
    this.navHeight = $('.navbar').outerHeight()
    this.$nav = $('.nav');
    this.$content = $('.content');

    this._initViews();
    this._initBindings();
  },

  _initViews: function() {
    var that = this;

    this._buildToc(function() {
      if (location.hash) {
        if (!that.$content.hasClass('sticky')) {
          that.$content.addClass('sticky');
        }

        that.api = that.$nav.find('.nav-inner').jScrollPane().data().jsp;
      }

      that._onResize();
    });

    this._styleCode();
  },

  _onScroll: function() {
    var that = this;

    if (!this.built) return;

    var pos = document.body.scrollTop || document.documentElement.scrollTop;

    if (pos >= this.navHeight) {
      this._onResize();

      if (!this.$content.hasClass('sticky')) {
        this.$content.addClass('sticky');
      }

      if (!this.$nav.hasClass('fix-nav')) {
        this.$nav.addClass('fix-nav');
      }

      if (!this.scrolled) {
        this.scrolled = true;

        that.api = that.$nav.find('.nav-inner').jScrollPane().data().jsp;
      }
    } else if (pos < this.navHeight) {
      this.init = true;

      this._onResize();

      if (this.$content.hasClass('sticky')) {
        this.$content.removeClass('sticky');
      }

      if (this.$nav.hasClass('fix-nav')) {
        this.$nav.removeClass('fix-nav');
      }

      if (this.scrolled) {
        this.api && this.api.destroy();
        this.scrolled = false;
      }
    }
  },

  _onResize: function() {
    var offset = this.$content.hasClass('sticky') ? 0 : this.$el.scrollTop()-this.navHeight;

    var h = $(window).outerHeight()+offset;

    this.$nav.height(h);
  },

  _buildToc: function(callback) {
    var $item = $('<ul class="fixed">'),
      $el,
      title,
      link;

    this.$content.find('h2').each(function() {
      $el = $(this);
      title = $el.text();
      link = "#" + $el.attr("id");

      var $subItem = $('<li class="item">'),
        $subEl,
        subTitle,
        subLink;

      $subItem.append("<h3><a href='"+link+"'>"+title+"</a></h3>");

      var $subSubItem= $('<ul>');

      $subItem.append($subSubItem);

      $(this).nextAll('h4, h3, h2').each(function(j) {
        if ($(this).is('h2')) return false;

        $subEl = $(this);
        subTitle = $subEl.html();
        subLink = "#" + $subEl.attr("id");

        var klass = $(this).is('h4') ? 'indent' : '';
        $subSubItem.append("<li class='"+klass+"'><a href='"+subLink+"'>"+subTitle+"</a></li>");
      });

      $item.append($subItem);
    });

    var $nav_inner = this.$nav.find(".nav-inner");

    $nav_inner.prepend($item);
    $nav_inner.find('.item').first().find('h3 a').addClass('selected');

    this.built = true;
    callback && callback();
  },

  _styleCode: function() {
    $('.language-md, .language-bash, .language-javascript').each(function() {
        var $this = $(this),
            $code = $this.html();

        $this.empty();

        var myCodeMirror = CodeMirror(this, {
            value: $code,
            lineNumbers: false,
            readOnly: true,
            lineWrapping: false,
        });
    });

    $('.language-html').each(function() {
        var $this = $(this),
            $code = $this.html();

        $this.empty();

        var myCodeMirror = CodeMirror(this, {
            value: $code.replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
            mode: 'text/html',
            lineNumbers: false,
            readOnly: true,
            lineWrapping: false,
        });
    });
  },

  _waypoint: function(direction, el) {
    var $active = $(el);

    $('.nav').find('a[href="#' + $active.attr('id') + '"]')
      .closest('li')
      .addClass('selected');

      if (!$active.length) { $active.end('h2'); }

      var id_ = $active.attr('id');

      $('.nav').find('.selected').removeClass('selected');

      var $a = $('.nav').find('a[href="#' + id_ + '"]').addClass('selected');

      $a.closest('li')
        .siblings('.indent')
        .hide();

      var $indent = $a.closest('.indent').show();

      $indent
        .nextUntil('li:not(.indent)').show();

      $indent
        .prevUntil('li:not(.indent)').show();

      $a.closest('.item')
        .addClass('selected')
        .find('h3 a')
        .addClass('selected');
  },

  _initBindings: function() {
    var that = this;

    $(window)
      .on('scroll', function() {
        that._onScroll();
      })
      .on('resize', function() {
        that._onScroll();
      });

    var $inner_ = this.$content.find('.inner');
    $inner_.find('h2, h3, h4').waypoint(function(direction) {
      that._waypoint(direction, this);

      that.api = that.$nav.find('.nav-inner').jScrollPane().data().jsp;
    }, { offset: 40 });

    this.$nav.find('a').on('click', function(e) {
      if (!$(this).hasClass('nav-link')) e.preventDefault();

      that._goTo($('#'+this.href.split('#')[1]), { margin: 30 }, function() {  window.location.hash = $(e.target).attr('href') });
    });
  },

  _goTo: function($el, opt, callback) {
    if ($el) {
      var speed  = (opt && opt.speed)  || 150;
      var delay  = (opt && opt.delay)  || 0;
      var margin = (opt && opt.margin) || 0;

      $('html, body').delay(delay).animate({scrollTop:$el.offset().top - margin}, speed);

      setTimeout(function() {
        callback && callback();
      }, delay);
    }
  }
});
