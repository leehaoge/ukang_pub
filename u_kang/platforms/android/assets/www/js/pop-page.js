define(['data-input'], function (dataInput) {
    'use strict';

    var _config = {},
        module,
        pages = {
            "data-input": function(conf) {
                dataInput.show(conf);
            }
        },
        navigate = function (page, conf) {
            var useConf = conf || _config;
            if (!_.isEmpty(page) && pages[page]) {
                var func = pages[page];
                if ($.isFunction(func)) func.call(module, useConf);
            }
        };

    module = {
        config: function (conf) {
            _config = $.extend(_config, conf);
        },
        navigate: navigate
    };

    return module;

});