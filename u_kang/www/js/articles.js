define(['text!html/articles.html', 'core/fragment', 'ukang-app'], function(tpl, Fragment, ukApp) {
    'use strict';

    var swiper,
        moduleLoaded = function() {
            var aModule = ukApp.currentModule();
            $('#ln-health-center').click(function() {
                aModule.navigate("");
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