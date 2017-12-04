define(['text!html/thinktrainning.html', 'core/fragment', 'ukang-app'], function (tpl, Fragment, ukApp) {
    'use strict';

    var moduleLoaded = function () {
            var aModule = ukApp.currentModule();
            $('#ln-hc-main').click(function () {
                aModule.navigate("");
            });
            $('.uk-data-link').click(function() {
                var $this = $(this), dataId = $this.attr('data-id');
                console.log(dataId + ' clicked!');
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