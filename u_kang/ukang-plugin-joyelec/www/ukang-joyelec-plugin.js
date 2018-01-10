var pluginName = 'UkangJoyelecPlugin';
var ukangJoyelecPlugin = {
    findDevice: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, pluginName, "findDevice", [params]);
    },
    getResult: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, pluginName, "getResult", [params]);
    }
};
module.exports = ukangJoyelecPlugin;