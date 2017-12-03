define(['text!html/solutionart.html', 'core/fragment', 'ukang-app'], function(tpl, Fragment, ukApp) {
    'use strict';

    var moduleLoaded = function() {
            var aModule = ukApp.currentModule();
            $('#ln-solutions').click(function() {
                aModule.navigate("solutions");
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