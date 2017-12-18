define(['text!html/solutions.html', 'core/fragment', 'ukang-app'], function(tpl, Fragment, ukApp) {
    'use strict';

    var moduleLoaded = function() {
            var aModule = ukApp.currentModule();
            $('#ln-health-center').click(function() {
                aModule.navigate("");
            });
            $('.uk-art-link').click(function() {
                aModule.navigate('solution-article');
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