define([], function () {
    'use strict';

    function PictureSwiper(div) {
        this.el = div;
        this.$el = $(div);
    }

    const zIndexUp = 11001;
    const zIndexDown = 11000;
    
    var defaultConfig = {
        w: 200,
        h: 100
    };

    var c = PictureSwiper,
        p = c.prototype;

    /**
     * config syntax: 
     * {
     *      pictures: [
     *          {url: '', link: ''},
     *          {url: '', link: ''},
     *          {url: '', link: ''},
     *          {url: '', link: ''},
     *      ]
     * }
     * @param config 
     */
    p.init = function (config) {
        var self = this;
        this.config = $.extend(defaultConfig, config);
        this.currPicture = 0;
        var divs = this.$el.find('div');
        this.divDisplay = divs[0];
        this.divUnder = divs[1];

        this.setZIndexs();

        this.setDivContent(this.divDisplay, this.config.pictures[0]);
        this.setDivContent(this.divUnder, this.config.pictures[1]);

        var $list = $('.uk-pic-indicate-list');
        $list.html('');
        for (var i = 0; i < this.config.pictures.length; i++) {
            $list.append('<li class="uk-pic-indicate-item"></li>');
        }

        $($list.find('.uk-pic-indicate-item')[0]).addClass('uk-pic-indicate-item-current');


        this.$el.on("swipeleft", function (event) {
            event.preventDefault();
            self.swipeLeft();
        });

        this.$el.on('swiperight', function (event) {
            event.preventDefault();
            self.swipeRight();
        });
    };

    p.setIndicator = function() {
        var self = this;
        $('.uk-pic-indicate-item').each(function(i, item) {
            if (i == self.currPicture) {
                $(item).addClass('uk-pic-indicate-item-current');
            } else {
                $(item).removeClass('uk-pic-indicate-item-current');
            }
        });
    };

    p.setDivContent = function (div, picDef) {
        var img = $(div).find('img');
        if (img) {
            img = img[0];
            img.src = picDef.url;
        }
    };

    p.setZIndexs = function () {
        $(this.divDisplay).css('z-index', zIndexUp);
        $(this.divUnder).css('z-index', zIndexDown);
    };

    p.switchDivs = function () {
        var div = this.divUnder;
        this.divUnder = this.divDisplay;
        this.divDisplay = div;
        this.setZIndexs();
        $(this.divUnder).css('left', '0px');
    };

    p.swipeLeft = function() {
        var self = this;
        if (this.currPicture < this.config.pictures.length - 1) {
            var stops = 20, left = 0, step = this.config.picture_size.w / 20;
            var stepPicture = function() {
                left -= step;
                $(self.divDisplay).css('left', '' + left + 'px');
                stops--;
                if (stops > 0) setTimeout(stepPicture, 50); 
                else {
                    self.switchDivs();
                    self.currPicture++;
                    self.setIndicator();
                }
            }, animate = function() {
                stops = 10;
                left = 0;
                step = self.config.picture_size.w / 10;
                $(self.divUnder).css('left', '0px');
                self.setDivContent(self.divUnder, self.config.pictures[self.currPicture + 1])
                setTimeout(stepPicture, 50);
            }
            animate();
        }
    };

    p.swipeRight = function() {
        var self = this;
        if (this.currPicture > 0) {
            var stops = 20, left = 0, step = this.config.picture_size.w / 20;
            var stepPicture = function() {
                left += step;
                $(self.divDisplay).css('left', '' + left + 'px');
                stops--;
                if (stops > 0) setTimeout(stepPicture, 50); 
                else {
                    self.switchDivs();
                    self.currPicture--;
                    self.setIndicator();
                }
            }, animate = function() {
                stops = 10;
                left = 0;
                step = self.config.picture_size.w / 10;
                $(self.divUnder).css('left', '0px');
                self.setDivContent(self.divUnder, self.config.pictures[self.currPicture - 1])
                setTimeout(stepPicture, 50);
            }
            animate();
        }
    };

    return PictureSwiper;

});