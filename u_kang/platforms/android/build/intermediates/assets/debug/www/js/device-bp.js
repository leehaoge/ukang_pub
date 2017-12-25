define(['text!html/devicebp.html', 'core/fragment', 'core/core', 'ukang-app'], function (tpl, Fragment, CORE, ukApp) {
    'use strict';

    var DOMUtil = CORE.DomUtil;

    function gaugeMessage(msg) {
        if (msg && msg.typeId) {
            switch (msg.typeId) {
                case 1: //<==Message
                    if (msg.source) {
                        if ('bluetooth' === msg.source) {
                            stateObj.btState = msg.value;
                        }
                    }
                    break;
                case 3: //<== Pressure
                    stateObj.pressure = msg.value;
                    break;
                case 4: //<== Result
                    $('#gauge-result').html(
                        '<h3>测量结果：</h3>' +
                        '收缩压：' + msg.value.sys + '<br>' +
                        '舒张压：' + msg.value.dia + '<br>' +
                        '心率：' + msg.value.pul + '<br>' 
                    );
                    $('#btn-start-gauge').removeAttr("disabled");
                    break;
            }
            updateBPState();
        }
    }

    function gaugeError(err) {
        var errDisp = '';
        if (!_.isObject(err)) errDisp = err;
        else errDisp = '[' + err.errcode + ']' + err.errmsg;
        $('#gauge-result').html('测量错误：' + errDisp);
        $('#btn-start-gauge').removeAttr("disabled");
    }

    function updateBPState() {
        DOMUtil.setValue(stateEl, stateObj);
    }

    function startGauge() {
        $(this).attr("disabled", "disabled");
        stateObj.pressure = '';
        $('gauge-result').html('');
        if (window.UkangUrionPlugin) {
            window.UkangUrionPlugin.startGauge(gaugeMessage, gaugeError, conf);
        }
    }

    var pageEl, conf = {}, stateEl, stateObj = {
            btState: '未连接',
            pressure: '',

        },
        onLayoutLoaded = function () {
            var appModule = ukApp.currentModule();
            stateObj = {
                btState: '未连接',
                pressure: '',
            }
            $('#ln-ds-main').click(function () {
                appModule.navigate("");
            });

            $('#btn-start-gauge').click(startGauge);

            stateEl = document.getElementById('bp-pane');
            updateBPState();
        },
        module = {
            show: function (el, config) {
                pageEl = el;
                var fragment = new Fragment(pageEl);
                config = config || {};
                conf = $.extend(conf, config);
                fragment.load(tpl, conf, onLayoutLoaded)
                $(pageEl).trigger('create');
            }
        };

    return module;

});