define(['text!html/sleepacepillow.html', 'core/fragment', 'ukang-app', 'sleepace-pillow-intf', 'sleepace-pillow-defines'],
    function (tpl, Fragment, ukApp, PillowIntf, sleepaceDefines) {
        'use strict';

        var intf = undefined,
            pageView = false,
            $btnCollect, $stateDisp, $hrateDisp, $brateDisp,
            setBtnEnabled = function ($btn, enabled) {
                if (enabled) $btn.removeAttr('disabled');
                else $btn.attr('disabled', '');
            },
            moduleLoaded = function () {
                var aModule = ukApp.currentModule();
                $btnCollect = $('#uk-pillow-control');
                $stateDisp = $('.uk-collect-state');
                $hrateDisp = $('#uk-data-heartrate');
                $brateDisp = $('#uk-data-breathrate');
                $('#ln-sleep-info').click(function () {
                    if (intf.connected) {
                        if (intf.state == sleepaceDefines.STATE_COLLECTING) {
                            intf.stopRealTimeData();
                            intf.stopCollect();
                        }
                        intf.disconnect();
                    }
                    aModule.navigate("sleeping");
                });
                $btnCollect.click(function() {
                    if (intf && intf.connected) {
                        if (intf.state == sleepaceDefines.STATE_IDLE) {
                            //开始
                            intf.startCollect();
                        } else
                        if (intf.state == sleepaceDefines.STATE_COLLECTING) {
                            //停止
                            intf.stopRealTimeData();
                            intf.stopCollect();
                        }    
                    }
                });
                $(aModule.el).trigger('create');
                pageView = true;
            },
            onData = function(data) {
                $hrateDisp.text(data.heartRate + '次/分');
                $brateDisp.text(data.breathRate + '次/分');
            },
            onStateChanged = function(state) {
                if (!pageView) return;
                if (sleepaceDefines.STATE_IDLE == state) {
                    $hrateDisp.text('--');
                    $brateDisp.text('--');
                        $btnCollect.text('开始采集');
                    $stateDisp.text('未采集');
                } else 
                if (sleepaceDefines.STATE_COLLECTING == state) {
                    $btnCollect.text('停止采集');
                    $stateDisp.text('采集中');
                    intf.startRealTimeData();
                }                    
            },
            module = {
                show: function (el, config) {
                    var fragment = new Fragment(el);
                    fragment.load(tpl, config, moduleLoaded);
                },
                connect: function (device, cbSuccess, cbFailure) {
                    intf = new PillowIntf({
                        device: device,
                        deviceCode: device.deviceCode || '3-6',
                        onData: onData,
                        onStateChanged: onStateChanged,
                    });
                    intf.connect(cbSuccess, cbFailure);
                }
            };

        return module;
    });