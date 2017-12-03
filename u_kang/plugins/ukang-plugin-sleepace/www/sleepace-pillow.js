var sleepacePillowName = 'SleepacePlugin';
var sleepacePillow = {
    startScan: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "startScan", [params]);
    },
    stopScan: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, sleepacePillowName, "stopScan", [params]);
    }
};
module.export = sleepacePillow;