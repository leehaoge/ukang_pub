cordova.define("ukang-plugin-urion.ukangUrionPlugin", function(require, exports, module) {
    var pluginName = 'UkangUrionPlugin';
    var ukangUrionPlugin = {
        findDevice: function(successCallback, errorCallback, params) {
            cordova.exec(successCallback, errorCallback, pluginName, "findDevice", [params]);
        },
        startGauge: function(successCallback, errorCallback, params) {
            cordova.exec(successCallback, errorCallback, pluginName, "startGauge", [params]);
        }
    };
    module.exports = ukangUrionPlugin;
});
