define(['text!html/personalinfo.html', 'core/core', 'core/fragment', 'ukang-app', 'ukang-utils'], function (tpl, CORE, Fragment, ukApp, UTILS) {
    'use strict';

    function onloaded() {
        var aModule = ukApp.currentModule();
        $('#ln-pi-cancel').click(function () {
            if (aModule)
                aModule.navigate('');
        });
        $('#ln-pi-save').click(function () {
            //保存个人信息，然后跳回个人中心首页
            if (aModule) {
                var info = aModule.config.person || {};
                info = $.extend(info, CORE.DomUtil.getValue(document.getElementById('person-info-pane')));
                var now = new Date(), bDate = UTILS.DateUtils.parse(info['birthday']),
                    y1 = now.getFullYear(), m1 = now.getMonth(), d1 = now.getDate(),
                    y0 = bDate.getFullYear(), m0 = bDate.getMonth(), d0 = bDate.getDate();
                info['age'] = (y1 - y0) + ((m1 > m0) ? 0 : 
                    ((m1 == m0) ? (d1 < d0 ? -1 : 0) : -1));
                info['lastUpdate'] = UTILS.dbDatetime(new Date());
                ukApp.do('updatePersonInfo', info, function () {
                    aModule.navigate('');
                });
            }
        });
        $(aModule.el).trigger('create');
    }

    function show(el, config) {
        var aModule = ukApp.currentModule();
        var fragment = new Fragment(el);
        config = config || aModule.config.person;
        fragment.load(tpl, config, onloaded);
    }

    var editPersonInfo = {
        show: show
    };

    return editPersonInfo;

});