define(['text!html/sleepinginfo.html', 'core/fragment', 'ukang-app'], function (tpl, Fragment, ukApp) {
    'use strict';

    var moduleLoaded = function () {
            var aModule = ukApp.currentModule();
            $('#ln-hc-main').click(function () {
                aModule.navigate("");
            });
            $('.uk-data-link').click(function () {
                var $this = $(this), dataName = $this.attr('data-id');
                if (dataName) aModule.config.dataName = dataName;
                aModule.navigate("data-page");
            });
            $('#ln-bt-scan').click(function() {
                aModule.navigate("bt-scan");
            });
            $(aModule.el).trigger('create');
        },
        module = {
            show: function (el, config) {
                var fragment = new Fragment(el);
                fragment.load(tpl, config, moduleLoaded);
            }
        };

    return module;
});