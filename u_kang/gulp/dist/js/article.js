define(['text!html/article.html', 'core/fragment', 'ukang-app'],
    function (tpl, Fragment, ukApp) {
        'use strict';

        var moduleLoaded = function () {
                var aModule = ukApp.currentModule();
                $('#ln-articles').click(function () {
                    aModule.navigate("articles");
                });

                $(aModule.el).trigger('create');
            },
            module = {
                show: function (el, config) {
                    var fragment = new Fragment(el);
                    config = config || {};
                    config.mainImageHtml = '';

                    if (config.mainImage) {
                        config.mainImageHtml = '<img src="' + ukApp.resourcePath(config.mainImage) + '">';
                    }

                    fragment.load(tpl, config, moduleLoaded);
                }
            };

        return module;

    });