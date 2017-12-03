define(['text!html/bluetoothscan.html', 'core/fragment', 'ukang-app', 'sleepace-pillow'],
    function (tpl, Fragment, ukApp, sleepacePillow) {

        var scanning = false,
            btDevices = {},
            btCount = 0,
            tplDevice = '\
            <div class="ui-block-a uk-bt-model"><a href="#" id="uk-pillow-link-<%=deviceIdx%>" data-id="<%=deviceId%>"><%=modelName%></a></div>\
            <div class="ui-block-b uk-bt-device"><%=deviceName%></div>\
            ',
            compiled = _.template(tplDevice),
            $btnStart,
            $btnStop,
            setBtnEnabled = function ($btn, enabled) {
                if (enabled) $btn.removeAttr('disabled');
                else $btn.attr('disabled', '');
            },
            stopScan = function () {
                function f(result) {
                    console.log(result);
                }
                if (scanning) {
                    scanning = false;
                    setBtnEnabled($btnStop, false);
                    setBtnEnabled($btnStart, true);
                    if (window.SleepacePillow) {
                        window.SleepacePillow.stopScan(f, f);
                    }
                }
            },
            clearLog = function (timeout) {
                timeout = timeout || 2000;
                setTimeout(function () {
                    consoleLog('');
                }, timeout);
            },
            consoleLog = function (msg, clear) {
                if (clear == undefined) clear = false;
                $('.uk-op-console').html(msg);
                if (clear) clearLog();
            },
            moduleLoaded = function () {
                var aModule = ukApp.currentModule();
                $(aModule.el).trigger('create');
                $('#ln-sleep-info').click(function () {
                    aModule.navigate("sleeping");
                });
                $btnStart = $('#bt-startscan');
                $btnStop = $('#bt-stopscan');
                setBtnEnabled($btnStop, false);
                $btnStart.click(function () {
                    if (!scanning) {
                        scanning = true;
                        setBtnEnabled($btnStart, false);
                        setBtnEnabled($btnStop, true);
                        $('#bt-dev-list').html('');
                        btCount = 0;
                        if (window.SleepacePillow) {
                            btDevices = {};
                            window.SleepacePillow.startScan(function (msg) {
                                if (msg && msg.deviceId) {
                                    var idx = ++btCount;
                                    btDevices[msg.deviceId] = msg;
                                    btDevices[msg.deviceId].deviceIdx = idx;
                                    $('#bt-dev-list').append(compiled(msg));
                                    $('#uk-pillow-link-' + idx).click(function () {
                                        // aModule.navigate("sleepace-pillow");
                                        var $this = $(this),
                                            dataId = $this.attr('data-id');
                                        if (btDevices[dataId]) {
                                            consoleLog('连接设备...', true);
                                            sleepacePillow.connect(btDevices[dataId], function () {
                                                consoleLog('设备连接成功！', true);
                                                aModule.navigate("sleepace-pillow");
                                            }, function (error) {
                                                consoleLog('设备连接失败！');
                                            });
                                        }
                                    });
                                }
                            }, function (msg) {
                                console.log(msg);
                            });
                        }
                        setTimeout(function () {
                            stopScan();
                        }, 20 * 1000);
                    }
                });
                $btnStop.click(stopScan);
            },
            module = {
                show: function (el, config) {
                    var fragment = new Fragment(el);
                    fragment.load(tpl, config, moduleLoaded);
                }
            };

        return module;
    });