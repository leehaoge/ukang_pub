/**
 * UKang Device Manager;
 */
define(['ukang-constants'], function(CONSTS) {
    'use strict';
   
    var devices = {
        
    };

    /**
     * deviceType: 
     *      SleepKillow => 睡眠枕头
     *      SleepButton => 睡眠纽扣
     *      BP => 血压计
     */

    function registerDevice(deviceType, desctriptor) {
        desctriptor.type = desctriptor.type || deviceType;
        devices[deviceType] = desctriptor;
    }

    function getDevice(deviceType) {
        if (devices[deviceType]) return devices[deviceType];
        else {
            var nameInConst = 'DEV_' + deviceType;
            if (CONSTS[nameInConst]) {
                return getDevice(CONSTS[nameInConst]);
            }
        }
        return null;
    }

    function getDeviceList() {
        var deviceTypes = [
            '睡眠枕头', '睡眠纽扣', '血压计', '体脂秤', '血糖仪'    
        ], ret = [];
        for (var i in deviceTypes) {
            var aType = deviceTypes[i], 
                device = getDevice(aType);
            if (device) {
                var record = {
                    'type': CONSTS['DEV_' + aType],
                    'name': aType,
                    'modelName': device.name,
                    'address': device.address,
                    'firmware_version': device.firmware_version || '',
                    'power_level': device.power_level || '',
                };
                ret.push(record);
            }
        }
        return ret;
    }


    var deviceManager = {
        devices: devices,
        register: registerDevice,
        get: getDevice,
        getList: getDeviceList
    };

    return deviceManager;

});