define(['text!html/reproductive.html', 'core/fragment', 'ukang-app'], function (tpl, Fragment, ukApp) {
    'use strict';

    var moduleLoaded = function () {
            var aModule = ukApp.currentModule();
            $('#ln-hc-main').click(function () {
                aModule.navigate("");
            });
            $('.uk-data-link').click(function () {
                var $this = $(this), dataName = $this.attr('data-id');
                if (dataName) aModule.config.dataName = dataName;
                aModule.config.pageFrom = {
                    id: "type-re",
                    display: "生殖健康"
                };
                aModule.navigate("data-page");
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