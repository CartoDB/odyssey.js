var Home = {
  initialize: function() {
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

    $('.menu-link').on('click', function(e) {
      e.preventDefault();

      that._onClick();
    });
  },

  _onScroll: function() {
    var pos = $(window).scrollTop();

    if (pos < $('.header').outerHeight()) {
      if ($('.navbar').hasClass('scrolled')) {
        $('.navbar').removeClass('scrolled');

        $('.navbar').animate({
          top: '-90px'
        }, 50);
      }
    } else {
      if (!$('.navbar').hasClass('scrolled')) {
        $('.navbar').addClass('scrolled');

        $('.navbar').animate({
          top: 0,
        }, 50);
      }
    }
  },

  _onClick: function() {
    if ($('.offcanvas').hasClass('active')) {
      $('.offcanvas').removeClass('active');
    } else {
      $('.offcanvas').addClass('active');
    }
  }
}

$(function() {
  Home.initialize();
});
