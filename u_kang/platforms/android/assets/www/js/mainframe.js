define(['core/context', 'core/fragment', 'modules'], function (context, Fragment, M) {
    'use strict';

    context['app']['modules'] = M;

    var el = $('#app_frame')[0],
        fragment = new Fragment(el),
        loadStatus = {},
        module = {
            /* 装入frame, frame => {tpl: "[页面模板]", config: [页面数据对象]} */
            loadFrame: function (frame) {
                var self = this;
                fragment.load(frame.tpl, frame.config);
                $('#app_main').height(context['app'].winHeight - context['app'].navbarHeight);

                M.healthCard.setDivId('mdl_health_card');
                M.healthCenter.setDivId('mdl_health_center');
                M.datasource.setDivId('mdl_datasource');
                M.personalCenter.setDivId('mdl_personal_center')


                $('#app_frame').trigger('create');
                /* 设置菜单点击响应 */
                $('#ln-health-card').click(function () {
                    self.loadModule(M.healthCard);
                });
                $('#ln-health-center').click(function () {
                    self.loadModule(M.healthCenter);
                });
                $('#ln-datasource').click(function () {
                    self.loadModule(M.datasource);
                });
                $('#ln-personal-center').click(function () {
                    self.loadModule(M.personalCenter);
                });
                self.loadModule(M.healthCard);
            },
            loadModule: function (aModule) {
                if (!!!(aModule.divId)) return;
                var divName = aModule.divId,
                    isLoaded = loadStatus[divName] && loadStatus[divName]['loaded'];
                $('.app_module').addClass('hidden');
                if (!isLoaded) {
                    aModule.load(aModule.tpl, aModule.config, aModule.onloaded);
                    loadStatus[divName] = {
                        loaded: true
                    };
                    // $(aModule.el).trigger('create');
                    if (aModule.afterLoad && $.isFunction(aModule.afterLoad)) aModule.afterLoad();
                }
                context['current_module'] = aModule;                
                $(aModule.el).removeClass('hidden');
            }
        };

    return module;
});