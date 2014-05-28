function onScroll() {
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
}

function onClick() {
  if ($('.offcanvas').hasClass('active')) {
    $('.offcanvas').removeClass('active');
  } else {
    $('.offcanvas').addClass('active');
  }
}

$(function() {
  $(window)
    .on('scroll', function() {
      onScroll();
    })
    .on('resize', function() {
      onScroll();
    });

  $('.menu-link').on('click', function(e) {
    e.preventDefault();

    onClick();
  });
});
