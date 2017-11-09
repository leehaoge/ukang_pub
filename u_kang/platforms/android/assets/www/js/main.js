define(['core/context', 'ukang-app', 'mainframe', 'text!html/mainframe.html'], function(context, ukApp, mainframe, mfHTML) {
    'use strict';

    context['app'] = context['app'] || {};
    context['app'].navbarHeight = 63;

    ukApp.initialize();
    
    function loadMainFrame() {
        $('#uk_app_menu').removeClass('hidden');
        mainframe.loadFrame({tpl: mfHTML});
    }

    //显示启动页面，2秒钟
    window.setTimeout(loadMainFrame, 2000);

});