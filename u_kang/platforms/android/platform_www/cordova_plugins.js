cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-sqlite-storage.SQLitePlugin",
    "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
    "pluginId": "cordova-sqlite-storage",
    "clobbers": [
      "SQLitePlugin"
    ]
  },
  {
    "id": "ukang-plugin-sleepace.sleepacePillow",
    "file": "plugins/ukang-plugin-sleepace/www/sleepace-pillow.js",
    "pluginId": "ukang-plugin-sleepace",
    "clobbers": [
      "SleepacePillow"
    ]
  },
  {
    "id": "ukang-plugin-utils.ukangMiscUtils",
    "file": "plugins/ukang-plugin-utils/www/ukang-misc-utils.js",
    "pluginId": "ukang-plugin-utils",
    "clobbers": [
      "UkangMiscUtils"
    ]
  },
  {
    "id": "ukang-plugin-urion.ukangUrionPlugin",
    "file": "plugins/ukang-plugin-urion/www/ukang-urion-plugin.js",
    "pluginId": "ukang-plugin-urion",
    "clobbers": [
      "UkangUrionPlugin"
    ]
  },
  {
    "id": "ukang-plugin-joyelec.ukangJoyelecPlugin",
    "file": "plugins/ukang-plugin-joyelec/www/ukang-joyelec-plugin.js",
    "pluginId": "ukang-plugin-joyelec",
    "clobbers": [
      "UkangJoyelecPlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.2",
  "cordova-sqlite-storage": "2.1.0",
  "ukang-plugin-sleepace": "0.3.0",
  "ukang-plugin-utils": "0.3.0",
  "ukang-plugin-urion": "0.4.0",
  "ukang-plugin-joyelec": "0.4.0"
};
// BOTTOM OF METADATA
});