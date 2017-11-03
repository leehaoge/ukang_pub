/* 数据仓库 */
define([], function() {
    'use strict';
    
    var items = {};

    function registerItem(dataName, dataHandler) {
        items[dataName] = {
            name: dataName,
            handler: dataHandler
        };
    }

    function _has(dataName) {
        return (items[dataName] != undefined && items[dataName].name == dataName);
    }

    
    function _get(dataName, filter, onData) {
        if (_has(dataName)) { //有指定的数据项
            if (items[dataName].handler) {
                handler.get({
                    filter: filter,
                    onData: function(data) {
                        if (onData != undefined && $.isFunction(onData)) onData(data);
                    }
                });
            }
        }
    }

    function _set(dataName, key, data, onSuccess, onFailure) {
        if (_has(dataName)) { //有指定的数据项
            if (items[dataName].handler) {
                handler.set({
                    key: key,
                    data: data,
                    onSuccess: onSuccess,
                    onFailure: onFailure
                });
            }
        }
    }

    var module = {
        registerItem, registerItem,     //注册命名数据
        has: _has,                      //是否具有命名数据
        get: _get,                      //获取命名数据
        set: _set                       //设定命名数据
    };

    return module;
});