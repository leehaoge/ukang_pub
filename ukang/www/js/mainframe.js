define(['core/context', 'core/fragment', 'modules'], function(context, Fragment, M) {
    'use strict';

    var el = $('#app_frame')[0],
        fragment = new Fragment(el),
        module = {
            /* 装入frame, frame => {tpl: "[页面模板]", config: [页面数据对象]} */
            loadFrame: function(frame) {
                var self = this;
                fragment.load(frame.tpl, frame.config);
                // $('#app_main').height(context['app'].winHeight - context['app'].navbarHeight);
                $('#app_frame').trigger('create');
                /* 设置菜单点击响应 */
                $('#ln-health-card').click(function() {
                    self.loadModule(M.healthCard);
                });
                $('#ln-personal-doctor').click(function() {
                    self.loadModule(M.personalDoctor);
                });
                $('#ln-more').click(function() {
                    self.loadModule(M.more);
                });
                $('#ln-intelligent-record').click(function() {
                    self.loadModule(M.intelligentRecord);
                });
                $('#ln-personal-center').click(function() {
                    self.loadModule(M.personalCenter);
                });
                self.loadModule(M.healthCard);
            },
            loadModule: function(aModule) {
                var mainEl = document.getElementById('app_main'),
                    mainFragment = new Fragment(mainEl);
                mainFragment.load(aModule.tpl, aModule.config, aModule.onloaded);
                $(mainEl).trigger('create');
                if (aModule.afterLoad) aModule.afterLoad();
            }
        };

    return module;    
});