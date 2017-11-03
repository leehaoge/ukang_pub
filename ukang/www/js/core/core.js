define(['core/context'], function(context) {
    'use strict';

    var winWidth, winHeight;
    // 获取窗口宽度 
    if (window.innerWidth) 
        winWidth = window.innerWidth; 
    else 
    if ((document.body) && (document.body.clientWidth)) 
        winWidth = document.body.clientWidth; 
    // 获取窗口高度 
    if (window.innerHeight) 
        winHeight = window.innerHeight; 
    else 
    if ((document.body) && (document.body.clientHeight)) 
        winHeight = document.body.clientHeight; 
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小 
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) 
    { 
        winHeight = document.documentElement.clientHeight; 
        winWidth = document.documentElement.clientWidth; 
    } 

    var __extends = function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    }

    var __define = function (o, p, g, s) { Object.defineProperty(o, p, { configurable: true, enumerable: true, get: g, set: s }); };

    context['app'] = context['app'] || {};
    
    context['app'].winWidth = winWidth;
    context['app'].winHeight = winHeight;
    
    var module = {
        __extends: __extends,
        __define: __define,
    };

    return module;

});