//banner swiper js

var swiper = new Swiper('.mySwiper', {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 3000,
  loop: true,
  slidesPerView: 1,

  grabCursor: true,
  autoHeight: false,
  pagination: {
    el: '.swiper-pagination',
  },
});

var swiper = new Swiper('.mySwiperCards', {
  slidesPerView: 3,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper('.mySwiper-product', {
  slidesPerView: 3,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
});
