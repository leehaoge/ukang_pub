define(['text!html/healthcard.html'], function(tpl) {
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