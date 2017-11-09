define(['text!html/datapage.html', 'core/fragment', 'core/context'], function (tpl, Fragment, context) {
    'use strict';

    var dataPage = {
        config: {
            dataName: ''
        },
        onLayoutLoaded: function () {
            $('#ln-hc-main').click(function() {
                var modules = context['app']['modules'];
                if (modules && modules['healthCard']) {
                    modules['healthCard'].reload();
                }
            });
        },
        show: function (mdlEl, dataName) {
            var el = mdlEl,
                fragment = new Fragment(el);
            this.config.dataName = dataName;
            fragment.load(tpl, this.config, this.onLayoutLoaded.bind(this));
            $(el).trigger('create');
        }
    };

    return dataPage;

});