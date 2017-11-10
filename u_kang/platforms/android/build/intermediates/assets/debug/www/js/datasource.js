define(['text!html/datasource.html', 'core/base-module'], function (tpl, BaseModule) {
    'use strict';

    var loaded = function () {};

    var module = new BaseModule();

    $.extend(module, {
        tpl: tpl,
        config: {},
        onloaded: loaded
    });

    return module;
});