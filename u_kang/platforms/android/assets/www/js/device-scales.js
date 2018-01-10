define(['text!html/deviceScales.html', 'core/fragment', 'core/core', 'ukang-app'], function (tpl, Fragment, CORE, ukApp) {
    'use strict';

    var DOMUtil = CORE.DomUtil;

    function getWeight(msg) {
        if (msg && msg.typeId) {
            switch (msg.typeId) {
                case 1: //<==Message
                    if (msg.source) {
                        if ('bluetooth' === msg.source) {
                            stateObj.btState = msg.value;
                        }
                    }
                    break;
                case 3: //<== 仍在变动的读数
                    stateObj.weight = msg.value;
                    break;
                case 4: //<== Result
                    $('#gauge-result').html(
                        '<h3>测量结果：</h3>' +
                        '体重：' + msg.value['体重'] + 'KG<br>' +
                        '脂肪：' + msg.value['脂肪'] + 'KG<br>' +
                        '肌肉：' + msg.value['肌肉'] + 'KG<br>' +
                        '骨骼：' + msg.value['骨骼'] + 'KG<br>' +
                        '基础代谢率：' + msg.value['基础代谢率'] + '<br>' +
                        'bmi：' + msg.value['bmi'] + '<br>' +
                        '水分：' + msg.value['水分'] + 'KG<br>'                      
                    );
                    $('#btn-start-gauge').removeAttr("disabled");
                    break;
            }
            updateScalesState();
        }
    }

    function gaugeError(err) {
        var errDisp = '';
        if (!_.isObject(err)) errDisp = err;
        else errDisp = '[' + err.errcode + ']' + err.errmsg;
        $('#gauge-result').html('测量错误：' + errDisp);
        $('#btn-start-gauge').removeAttr("disabled");
    }

    function updateScalesState() {
        DOMUtil.setValue(stateEl, stateObj);
    }

    function startGauge() {
        $(this).attr("disabled", "disabled");
        stateObj.pressure = '';
        $('gauge-result').html('');
        if (window.UkangJoyelecPlugin) {
            window.UkangJoyelecPlugin.getResult(getWeight, gaugeError, conf);
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
                weight: '',
            }
            $('#ln-ds-main').click(function () {
                appModule.navigate("");
            });

            stateEl = document.getElementById('bp-pane');
            updateScalesState();

            setTimeout(startGauge, 100);
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