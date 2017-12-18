cordova.define("ukang-plugin-utils.ukangMiscUtils", function(require, exports, module) {
var pluginName = 'UkangUtilsPlugin';
var ukangMiscUtils = {
    getDensity: function(successCallback, errorCallback, params) {
        cordova.exec(successCallback, errorCallback, pluginName, "getDensity", [params]);
    }
};
module.exports = ukangMiscUtils;

});
