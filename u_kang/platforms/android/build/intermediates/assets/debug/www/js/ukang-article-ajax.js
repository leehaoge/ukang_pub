;//为了减少ukang-app的篇幅，把article相关的ajax调用集中在这里
define([
    'ukang-constants',
], function(CONSTS) {
    'use strict';

    function ukUrl(url) {
        return CONSTS['ajax_root'] + url + CONSTS['ajax_ext']
    }

    function callAjax(mth, url, data, onSuccess) {
        $.ajax({
            url: ukUrl(url),
            data: data,
            type: mth,
            dataType: 'json',
            success: onSuccess
        });
}

    var articleAjaxHandler = {
        //----------- AJAX Handlers
        /**
         * 获取专家讲堂首页列表
         * 格式：{
         *      latest: [{文章列表}],
         *      groups:{
         *          {分类1}: [{文章列表}],
         *          {分类2}: [{文章列表}],
         *          ...
         *      }
         * }
         */
        articleHighlights: function(params, onSuccess) {
            callAjax('get', '/app/article/highlights', params, onSuccess);
        },
        article: function(params, onSuccess) {
            callAjax('get', '/app/article/' + params, '', onSuccess);
        }
    };

    return articleAjaxHandler;
    
});