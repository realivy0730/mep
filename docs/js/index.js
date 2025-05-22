/**
 * 主要 JavaScript 檔案
 */
document.addEventListener('DOMContentLoaded', function () {
    // 初始化首頁輪播
    swiperIndexSplish();
    // 初始化統計圖表輪播
    initStatsSwiper();
});

/**
 * 初始化首頁主輪播
 */
function swiperIndexSplish() {
    let swiper = new Swiper(".section_home_slider .swiper", {
        loop: true,
        loopedSlides: 2,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            stopOnLastSlide: false,
        },
        pagination: {
            el: ".slider_pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".slider_button-next",
            prevEl: ".slider_button-prev",
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        // thumbs: {
        //   swiper: indexGalleryThumbs
        // }
    });
}

/**
 * 初始化統計圖表輪播
 */
function initStatsSwiper() {
    let statsSwiper = new Swiper(".stats-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".section_home_stats .slider_pagination",
            clickable: true,
        }
    });
}
