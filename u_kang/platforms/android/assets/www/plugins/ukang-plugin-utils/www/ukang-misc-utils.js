cordova.define("ukang-plugin-utils.ukangMiscUtils", function(require, exports, module) {
var pluginName = 'UkangUtilsPlugin';
var ukangMiscUtils = {
    getDensity: function(successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, pluginName, "getDensity", []);
    },
    toast: function(params) {
        cordova.exec(null, null, pluginName, "toast", [params]);
    }
};
module.exports = ukangMiscUtils;

});
