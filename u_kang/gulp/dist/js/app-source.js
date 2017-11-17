define(['text!html/appsource.html', 'core/fragment', 'ukang-app'], function (tpl, Fragment, ukApp) {
    'use strict';

    var pageEl, conf = {},
        onLayoutLoaded = function () {
            var appModule = ukApp.currentModule();
            $('#ln-ds-main').click(function () {
                appModule.navigate("");
            });
        },
        module = {
            show: function (el, config) {
                pageEl = el;
                var fragment = new Fragment(pageEl);
                config = config || {};
                conf = $.extend(conf, config);
                fragment.load(tpl, conf, onLayoutLoaded)
                $(pageEl).trigger('create');
            }
        };

    return module;

});