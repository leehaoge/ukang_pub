var pluginName = 'UkangUtilsPlugin';
var ukangMiscUtils = {
    getDensity: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, pluginName, "getDensity", [params]);
    }
};
module.exports = ukangMiscUtils;
