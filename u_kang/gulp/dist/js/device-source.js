define(['text!html/devicesource.html', 'core/fragment', 'ukang-app'], function (tpl, Fragment, ukApp) {
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
                conf['typeDisp'] = '';
                if (_.isEmpty(conf['healthType'])) conf['typeDisp'] = ' style="display: none"';
                fragment.load(tpl, conf, onLayoutLoaded)
                $(pageEl).trigger('create');
            }
        };

    return module;

});