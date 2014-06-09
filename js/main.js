var Home = Backbone.View.extend({
  el: document.body,

  events: {
    'click .menu-link': '_onClick'
  },

  initialize: function() {
    this.$offcanvas = $('.offcanvas');
    this.$navbar = $('.navbar');

    this._initBindings();
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
  },

  _onScroll: function() {
    var pos = $(window).scrollTop();

    if (pos < $('.header').outerHeight()) {
      if (this.$navbar.hasClass('scrolled')) {
        this.$navbar.removeClass('scrolled');

        this.$navbar.animate({
          top: '-90px'
        }, 50);
      }
    } else {
      if (!this.$navbar.hasClass('scrolled')) {
        this.$navbar.addClass('scrolled');

        this.$navbar.animate({
          top: 0,
        }, 50);
      }
    }
  },

  _onClick: function(e) {
    e.preventDefault();

    if (this.$offcanvas.hasClass('active')) {
      this.$offcanvas.removeClass('active');
    } else {
      this.$offcanvas.addClass('active');
    }
  }
});
