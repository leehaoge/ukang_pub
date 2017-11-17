define(['text!html/adddevice.html', 'core/fragment', 'ukang-app'], function (tpl, Fragment, ukApp) {
    'use strict';

    var pageEl, config = {},
        onLayoutLoaded = function () {
            var appModule = ukApp.currentModule();
            $('#ln-ds-main').click(function () {
                appModule.navigate("");
            });
        },
        module = {
            show: function (el) {
                pageEl = el;
                var fragment = new Fragment(pageEl);
                fragment.load(tpl, config, onLayoutLoaded)
                $(pageEl).trigger('create');
            }
        };

    return module;

});