define(['text!html/healthcenter.html', 'core/base-module', 'health-notice', 'solutions', 'articles', 'health-hints', 
    'ukang-mall', 'solution-article'],
    function (tpl, BaseModule, healthNotice, solutions, articles, healthHints, ukangMall, solutionArticle) {
        'use strict';

        var module = new BaseModule();
        var loaded = function () {
            $('#ln-health-notice').click(function () {
                module.navigate("notice");
            });
            $('.uk-hc-solution').click(function() {
                module.navigate('solutions');
            });
            $('.uk-hc-article').click(function() {
                module.navigate('articles');
            });
            $('.uk-hc-hints').click(function() {
                module.navigate('hints');
            });
            $('.uk-hc-shop').click(function() {
                module.navigate('mall');
            });
        };

        var pages = {
            'notice': function () {
                healthNotice.show(module.el);
            },
            'solutions': function() {
                solutions.show(module.el);
            },
            'articles': function() {
                articles.show(module.el);
            },
            'hints': function() {
                healthHints.show(module.el);
            },
            'mall': function() {
                ukangMall.show(module.el);
            },
            'solution-article': function() {
                solutionArticle.show(module.el);
            }
        };

        $.extend(module, {
            tpl: tpl,
            config: {},
            pages: pages,
            onloaded: loaded
        });

        return module;

    });