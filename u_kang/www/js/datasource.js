define(['text!html/datasource.html', 'core/base-module', 'add-device', 'app-source', 'device-source', 'bluetooth-scan.1', 'ukang-devices',
        'ukang-constants', 'ukang-app', 'device-bp', 'sleepace-pillow.1', 'device-scales'
    ],
    function (tpl, BaseModule, addDevice, appSource, deviceSource, scanBluetoothDevice, deviceManager,
        CONSTS, ukApp, deviceBp, sleepacePillow, deviceScales) {
        'use strict';

        var templates = {
            'noDevice': '<h1>暂无设备</h1>',
            'deviceList': '\
        <ul class="ds-device-list">\
        <%=list%>\
        </ul>\
            ',
            'device': '\
            <li class="ds-device-item" data-id="<%=type%>">\
                <h3><%=name%></h3>\
                <p>设备号：<%=modelName%></p>\
                <%=extra%>\
            </li>\
            ',
        };

        var module = new BaseModule();

        var loaded = function () {
            var $deviceDiv = $('#ds-pane-devices'),
                $applicationDiv = $('#ds-pane-applications');
            $('#ln-add-source').click(function () {
                module.navigate('add-device');
            });
            $('#switch-device').click(function () {
                $applicationDiv.addClass('hidden');
                $deviceDiv.removeClass('hidden');
                $(this).addClass('uk-selected-datasource');
                $('#switch-application').removeClass('uk-selected-datasource');
            });
            $('#switch-application').click(function () {
                $deviceDiv.addClass('hidden');
                $applicationDiv.removeClass('hidden');
                $(this).addClass('uk-selected-datasource');
                $('#switch-device').removeClass('uk-selected-datasource');
            });

            function liClick() {
                var $this = $(this),
                    dataId = $this.attr('data-id'),
                    device = deviceManager.get(dataId);
                if (device) {
                    module.navigate('device', device);
                }
            }

            var devList = deviceManager.getList();
            if (devList) {
                if (devList.length == 0) {
                    $deviceDiv.html(templates['noDevice']);
                } else {
                    var funcLine = _.template(templates['device']),
                        funcList = _.template(templates['deviceList']),
                        objList = {
                            list: ''
                        };
                    for (var i in devList) {
                        var device = devList[i];
                        device.extra = '';
                        if (!_.isEmpty(device['firmware_version']))
                            device.extra += '<p>固件版本：' + device['firmware_version'] + '</p>';
                        if (!_.isEmpty(device['power_level']))
                            device.extra += '<p>电池容量：' + device['power_level'] + '%</p>';
                        objList.list += funcLine(device);
                    }
                    $deviceDiv.html(funcList(objList));
                    $('.ds-device-item').click(liClick);
                }
            }


            // $('.uk-app-source-link').click(function () {
            //     //APP来源点击
            //     module.navigate('app-source', {
            //         name: $(this).attr('data-id')
            //     });
            // });
            // $('.uk-device-source-link').click(function () {
            //     //设备来源点击
            //     var $this = $(this);
            //     module.navigate('device-source', {
            //         name: $this.attr('data-id'),
            //         healthType: $this.attr('data-health-type') || ''
            //     });
            // });
        };

        var pages = {
            "add-device": function () {
                addDevice.show(module.el);
            },
            "app-source": function (config) {
                appSource.show(module.el, config);
            },
            "device-source": function (config) {
                deviceSource.show(module.el, config);
            },
            "add-bluetooth-device": function () {
                scanBluetoothDevice.show(module.el);
            },
            "device": function (config) {
                if (config) {
                    if (CONSTS["DEV_血压计"] === config.type) deviceBp.show(module.el, config);
                    else
                    if (CONSTS["DEV_体脂秤"] === config.type) deviceScales.show(module.el, config);
                    else
                    if (CONSTS["DEV_睡眠枕头"] === config.type) {
                        sleepacePillow.connect(config, function () {
                            consoleLog('睡眠枕头连接成功！', true);
                            sleepacePillow.show(module.el);;
                        }, function (error) {
                            consoleLog('睡眠枕头连接失败！');
                            ukApp.toast('无法连接睡眠枕头，是否没打开电源，或者离得太远了？');
                        });
                    }
                }
            }
        };

        $.extend(module, {
            activeTab: 'device',
            tpl: tpl,
            config: {},
            pages: pages,
            onloaded: loaded
        });

        return module;
    });