define(['text!html/articles.html', 'core/fragment', 'ukang-app', 'swipe-pictures'], function(tpl, Fragment, ukApp, PictureSwiper) {
    'use strict';

    var swiper,
        moduleLoaded = function() {
            var aModule = ukApp.currentModule();
            $('#ln-health-center').click(function() {
                aModule.navigate("");
            });

            var swiperEl = document.getElementById('pictures-1');
            $(swiperEl).css('left', (ukApp.winsize.width < 356 ? 0 : (ukApp.winsize.width - 356) / 2) + 'px');

            swiper = new PictureSwiper(swiperEl);
            swiper.init({
                picture_size: {w: 320, h: 150},
                pictures: [
                    {url: 'img/swipe_1.png', link: ''},
                    {url: 'img/swipe_2.jpg', link: ''},
                    {url: 'img/swipe_3.jpg', link: ''},
                    {url: 'img/swipe_4.jpg', link: ''}
                ]
            });


            $(aModule.el).trigger('create');
        },
        module = {
        show: function(el, config) {
            var fragment = new Fragment(el);
            fragment.load(tpl, config, moduleLoaded);
        }
    };

    return module;
});