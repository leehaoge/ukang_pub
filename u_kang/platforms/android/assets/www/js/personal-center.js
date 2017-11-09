define(['text!html/personalcenter.html', 'text!html/personalinfo.html', 'core/context', 'core/fragment', 'core/base-module'], 
function (tpl, piHTML, context, Fragment, BaseModule) {
    'use strict';


    function loadModule() {
        var div = document.getElementById('mdl_personal_center'),
            frag = new Fragment(div),
            mdl = context['app']['modules'].personalCenter;
        frag.load(mdl.tpl, mdl.config, mdl.onloaded);
    }

    /* 个人信息装入后处理 */
    function piLoaded() {
        $('#ln-pi-cancel').click(loadModule);
    }

    function editPersonInfo() {
        var div = document.getElementById('mdl_personal_center'),
            frag = new Fragment(div);
        frag.load(piHTML, {}, piLoaded)
    }

    var loaded = function () {
        $('#ln-person-info').click(editPersonInfo);
    };

    var module = new BaseModule();

    $.extend(module, {
        tpl: tpl,
        config: {},
        onloaded: loaded
    });

    return module;
});