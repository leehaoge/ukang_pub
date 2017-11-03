define(['core/context','mainframe', 'text!html/mainframe.html'], function(context, mainframe, mfHTML) {
    'use strict';

    context['app'] = context['app'] || {};
    context['app'].navbarHeight = 63;

    function loadMainFrame() {
        $('#uk_app_menu').removeClass('hidden');
        mainframe.loadFrame({tpl: mfHTML});
    }

    //显示启动页面，2秒钟
    window.setTimeout(loadMainFrame, 2000);

});