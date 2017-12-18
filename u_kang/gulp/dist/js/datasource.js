define(['text!html/datasource.html', 'core/base-module', 'add-device', 'app-source', 'device-source', 'bluetooth-scan.1'],
    function (tpl, BaseModule, addDevice, appSource, deviceSource, scanBluetoothDevice) {
        'use strict';


        var module = new BaseModule();

        var loaded = function () {
            $('#ln-add-source').click(function () {
                module.navigate('add-device');
            });
            $('.uk-app-source-link').click(function () {
                //APP来源点击
                module.navigate('app-source', {
                    name: $(this).attr('data-id')
                });
            });
            $('.uk-device-source-link').click(function () {
                //设备来源点击
                var $this = $(this);
                module.navigate('device-source', {
                    name: $this.attr('data-id'),
                    healthType: $this.attr('data-health-type') || ''
                });
            });
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
            "add-bluetooth-device": function() {
                scanBluetoothDevice.show(module.el);
            }
        };

        $.extend(module, {
            tpl: tpl,
            config: {},
            pages: pages,
            onloaded: loaded
        });

        return module;
    });