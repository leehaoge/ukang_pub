define(['text!html/adddevice.html', 'core/fragment', 'ukang-app', 'ukang-constants', 'ukang-devices'], 
function (tpl, Fragment, ukApp, CONSTS, deviceManager) {
    'use strict';

    /**
     * 查找Urion血压计
     * @param {*} onSuccess 
     * @param {*} onFailure 
     */
    function findBP(onSuccess, onFailure) {
        if (window.UkangUrionPlugin) {
            window.UkangUrionPlugin.findDevice(
                function(msg) { //<==success
                    deviceManager.register(CONSTS['DEV_血压计'], msg);
                    ukApp.toast('已找到血压计');
                    if (onSuccess) onSuccess();
                },  
                function(msg) {
                    if (msg === 'no device found') msg = '找不到血压计';
                    ukApp.toast(msg);
                }
            );
        }
    }

    /**
     * 查找享睡健康枕
     * @param {*} onSuccess 
     * @param {*} onFailure 
     */
    function findPillow(onSuccess, onFailure) {
        if (window.SleepacePillow) {
            window.SleepacePillow.findDevice(
                function(result) {
                    deviceManager.register(CONSTS['DEV_睡眠枕头'], msg);
                    ukApp.toast('已找到睡眠枕头');
                    if (onSuccess) onSuccess();
                },
                function(msg) {
                    if (msg === 'no device found') msg = '找不到睡眠枕头';
                    ukApp.toast(msg);
                }
            );
        }
    }

    function backToList() {
        var appModule = ukApp.currentModule();
        appModule.navigate("");        
    }

    function findDevice() {
        var $this = $(this), dataId = $this.attr('data-id'),
            deviceFound = function() {
                $this.addClass('uk-valid-device');
                setTimeout(backToList, 1000);
            },
            deviceNotFound = function() {
                $this.removeClass('uk-valid-device');
            };

        if (dataId === CONSTS['DEV_血压计']) findBP(deviceFound);
        else
        if (dataId === CONSES['DEV_睡眠枕头']) findPillow(deviceFound);
    }

    var pageEl, config = {},
        onLayoutLoaded = function () {
            var appModule = ukApp.currentModule();
            $('#ln-ds-main').click(function () {
                appModule.navigate("");
            });
            $('.uk-device-item').click(findDevice);
        },
        module = {
            show: function (el) {
                pageEl = el;
                var fragment = new Fragment(pageEl);
                fragment.load(tpl, config, onLayoutLoaded)
                $(pageEl).trigger('create');
            }
        };

    return module;

});