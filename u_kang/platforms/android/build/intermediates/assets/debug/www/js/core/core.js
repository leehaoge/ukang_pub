define(['core/context', 'core/date-utils'], function(context, dateUtils) {
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
    
    var DomUtil;
    
    (function(DomUtil) {
    
        function __getClass(object){
            return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
        };
    
        function _set(el, v) {
            if (el && v != undefined) {
                var clz = __getClass(v);
                if (clz == 'Object') {
                    var $el = $(el);
                    for (var i in v) {
                        var val = v[i],
                            cond = '[data-id="' + i +'"]';
                        $el.find(cond).each(function() {
                            _set(this, val);
                        });
                    }
                } else
                //TODO handle Date
                if (clz == 'Number' || clz=='String'){
                    v = '' + v;
                    var nodeName = el.nodeName;
                    if (nodeName == 'INPUT' || nodeName == 'TEXTAREA' || nodeName == 'SELECT') {
                        $(el).val(v);
                    } else
                    if (nodeName == 'DIV' || nodeName == 'SPAN') {
                        $(el).html(v);
                    }
                }
            }
        }
    
        function _get(el) {
            var v = {},
                $el = $(el);
            $el.find('[data-id]').each(function() {
                var $this = $(this), nName = this.nodeName, d_id = $this.attr('data-id');
                if (d_id) {
                    if (nName == 'DIV' || nName == 'SPAN') {
                        v[d_id] = $this.html();
                    } else
                    if (nName == 'INPUT' || nName == 'TEXTAREA' || nName == 'SELECT') {
                        v[d_id] = $this.val();
                    }
                }
            });
            return v;
        }
    
        //TODO getValue
    
        /**
         *
         * @type {_set}
         */
        DomUtil.setValue = _set;
        DomUtil.getValue = _get;
    
        return DomUtil;
    })(DomUtil || (DomUtil = {}));

    var module = {
        __extends: __extends,
        __define: __define,
        DomUtil: DomUtil,
        DateUtils: dateUtils
    };

    return module;

});