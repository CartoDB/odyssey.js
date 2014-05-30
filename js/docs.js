var Docs = {
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
        that._onResize();

        if (!that.$content.hasClass('sticky')) {
          that.$content.addClass('sticky');
        }

        that.api = that.$nav.find('.nav-inner').jScrollPane().data().jsp;
      }
    });

    var $inner_ = this.$content.find('.inner');
    $inner_.find('h2, h3, h4').waypoint(function(direction) {
      that._waypoint(direction, this);

      that.api = that.$nav.find('.nav-inner').jScrollPane().data().jsp;
    }, { offset: 40 });
  },

  _onScroll: function() {
    var that = this;

    if (!this.built) return;

    var pos = this.$el.scrollTop();

    if (pos >= this.navHeight) {
      this._onResize();

      if (!this.$content.hasClass('sticky')) {
        this.$content.addClass('sticky');
      }

      if (!this.scrolled) {
        this.scrolled = true;

        that.api = that.$nav.find('.nav-inner').jScrollPane().data().jsp;
      }
    } else if (pos < this.navHeight) {
      this.init = true;

      this._onResize();

      this.$nav.addClass('sticky');

      if (this.$content.hasClass('sticky')) {
        this.$content.removeClass('sticky');
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
        subTitle = $subEl.text();
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

  _waypoint: function(direction, el) {
    var $active = $(el);

    $('.nav').find('a[href="#' + $active.attr('id') + '"]')
      .closest('li')
      .addClass('selected');

      // if (direction === "up") {
      //   $active = ($active.index('h2') === 0) ? $active : $active.prevAll('h2');
      // }

      if (!$active.length) { $active.end('h2'); }

      var id_ = $active.attr('id');

      $('.nav').find('.selected')
        .removeClass('selected');

      $('.nav').find('a[href="#' + id_ + '"]')
        .addClass('selected')
        .closest('.item')
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

    this.$nav.find('a').on('click', function(e) {
      e.preventDefault();

      that._goTo($('#'+this.href.split('#')[1]), { margin: 30 });
    });
  },

  _goTo: function($el, opt, callback) {
    if ($el) {
      var speed  = (opt && opt.speed)  || 150;
      var delay  = (opt && opt.delay)  || 0;
      var margin = (opt && opt.margin) || 0;

      $('html, body').delay(delay).animate({scrollTop:$el.offset().top - margin}, speed);

      callback && callback();
    }
  }
}

$(function() {
  Docs.initialize();
});
