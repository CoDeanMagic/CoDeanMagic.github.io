const swiper = new Swiper(".poster.swiper", {
  autoplay: true,
  loop: true,
  pagination: {
    el: ".dots-list",
    bulletClass: "bullet",
    bulletActiveClass: "bullet-active",
    clickable: true,
  },
  navigation: {
    nextEl: ".next-btn",
    prevEl: ".pre-btn",
  },
});

const promoteCarousel = new Swiper(".promote-carousel", {
  autoplay: true,
  loop: true,
  slidesPerView: 2,
  spaceBetween: 20,
  speed: 5000,
  freeMode: true,
  autoplay: {
    delay: 10,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

  breakpoints: {
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 5,
    },
    1280: {
      slidesPerView: 5,
    },
  },
  on: {
    init: function () {
      console.log("swiper initialized");
      console.log(this);
    },

    touchStart: function (swiper, event) {
      alert("事件触发了;");
    },
  },
});
// const swiperContainer = document.querySelector(".promote-carousel");
// console.dir(promoteCarousel);
// swiperContainer.addEventListener("mouseenter", () => {
//   //   promoteCarousel.autoplay.stop; // 當滑鼠進入時立即停止自動播放
//   console.log(promoteCarousel.autoplay.stop);
//   console.log("HAHA我進來了");
// });

// swiperContainer.addEventListener("mouseleave", () => {
//   //   promoteCarousel.autoplay.start(); // 當滑鼠離開時恢復自動播放
//   console.log(promoteCarousel.autoplay);
//   console.log("HAHA我出去了");
// });
