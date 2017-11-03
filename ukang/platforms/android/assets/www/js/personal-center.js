define(['text!html/personalcenter.html'], function(tpl) {
    'use strict';

    var loaded = function() {
    };

    var module = {
        tpl: tpl,
        config: {},
        onloaded: loaded
    };

    return module;
});