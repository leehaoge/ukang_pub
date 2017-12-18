define(['ukang-app', 'core/fragment'
], function (ukApp, Fragment) {
    'use strict';

    const template = {
        'group': '\
    <div class="uk-article-group">\
        <h2><%=name%></h2>\
        <ul class="uk-article-<%=type%>-list">\
        <%=listHtml%>\
        </ul>\
    </div>\
        ',
        'article-latest': '\
    <li class="uk-article-link" data-id="<%=id%>">\
        <div class="uk-article-hl-title">\
            <%=title%>\
        </div>\
        <div class="uk-article-hl-img">\
            <img src="<%=imgUrl%>">\
        </div>\
    </li>\
        ',
        'article-normal': '\
    <li class="uk-article-link" data-id="<%=id%>">\
        <div class="uk-article-hl-title">\
            <%=title%>\
        </div>\
    </li>\
        '
    };

    var module;

    function show(el, highlights, afterShow) {
        var fragment = new Fragment(el), html = '';

        if (highlights.latest) {
            var group = {
                    name: '最新',
                    type: 'latest',
                    listHtml: ''
                },
                groupFunc = _.template(template['group']),
                articleFunc = _.template(template['article-latest']);
            for (var i in highlights.latest) {
                var article = highlights.latest[i];
                article.imgUrl = ukApp.resourcePath(article.mainImage);
                group.listHtml += articleFunc(article);
            }
            html += groupFunc(group);
        }
        if (highlights.groups) {
            for (var grpId in highlights.groups) {
                var aGroup = highlights.groups[grpId],
                    group = {
                        name: '',
                        type: 'normal',
                        listHtml: ''
                    },
                    groupFunc = _.template(template['group']),
                    articleFunc = _.template(template['article-normal']);
                for (var i in aGroup) {
                    var article = aGroup[i];
                    if (_.isEmpty(group.name)) group.name = article.type.name;
                    group.listHtml += articleFunc(article);
                }
                html += groupFunc(group);
            }
        }
        fragment.html(html, afterShow);
    }

    module = {
        show: show
    };

    return module;

});