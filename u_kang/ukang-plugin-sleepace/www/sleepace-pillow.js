var sleepacePillowName = 'SleepacePlugin';
var sleepacePillow = {
    startScan: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "startScan", [params]);
    },
    stopScan: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "stopScan", [params]);
    },
    connect: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "connect", [params]);
    },
    disconnect: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "disconnect", [params]);
    },
    startCollect: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "startCollect", [params]);
    },
    stopCollect: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "stopCollect", [params]);
    },
    startRealTimeData: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "startRealTimeData", [params]);
    },
    stopRealTimeData: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "stopRealTimeData", [params]);
    },


    /**
     * 字段		说明
PILLOW_3_1	3-1	智能枕头(蓝牙版)_享睡健康枕（化纤压电立体式）
PILLOW_3_2	3-2	智能枕头(蓝牙版)_记忆棉电缆
PILLOW_3_3	3-3	智能枕头(蓝牙版)_享睡健康枕（化纤压电二片式）
PILLOW_3_4	3-4	智能枕头(蓝牙版)_享睡健康枕（化纤压电香薰）
PILLOW_3_5	3-5	智能枕头(蓝牙版)_享睡健康枕（可拆卸-填充物聚酯纤维）
PILLOW_3_6	3-6	智能枕头(蓝牙版)_享睡健康枕（可拆卸-填充物记忆棉条）

     */
    DeviceCode: {
        "3-1": "享睡健康枕（化纤压电立体式）",
        "3-2": "记忆棉电缆",
        "3-3": "享睡健康枕（化纤压电二片式）",
        "3-4": "享睡健康枕（化纤压电香薰）",
        "3-5": "享睡健康枕（可拆卸-填充物聚酯纤维）",
        "3-6": "享睡健康枕（可拆卸-填充物记忆棉条）",
    }
};
module.exports = sleepacePillow;
