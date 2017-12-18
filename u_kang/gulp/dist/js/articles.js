define(['text!html/articles.html', 'core/fragment', 'ukang-app', 'article-pane'], 
function(tpl, Fragment, ukApp, articlePane) {
    'use strict';

    var moduleLoaded = function() {
            var aModule = ukApp.currentModule();
            $('#ln-health-center').click(function() {
                aModule.navigate("");
            });

            function showArticle(article) {
                aModule.navigate('article', article);
            }

            function articleLinkClick() {
                var $this = $(this), artId = $this.attr('data-id');
                ukApp.get('article', artId, showArticle);
            }

            function articlesLoaded() {
                $('.uk-article-link').click(articleLinkClick);
            }

            function onHighlightData(highlights) {
                articlePane.show(document.getElementById('articles-pane'), highlights, articlesLoaded);
            }

            ukApp.get('articleHighlights', '', onHighlightData);

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