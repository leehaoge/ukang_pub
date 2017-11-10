/* 数据仓库 */
define([], function() {
    'use strict';
    
    var items = {}, handler = {};

    function executeCallback(cb) {
        if (cb && $.isFunction(cb)) {
            var args = arguments;
            Array.prototype.shift.apply(args);
            cb.apply(null, args);
        }
    }

    function registerItem(dataName, dataHandler) {
        items[dataName] = {
            name: dataName,
            handler: dataHandler
        };
        handler[dataName] = dataHandler;
    }

    function _has(dataName) {
        return (items[dataName] != undefined && items[dataName].name == dataName);
    }

    
    function _get(dataName, filter, onData) {
        if (_has(dataName)) { //有指定的数据项
            if (items[dataName].handler) {
                items[dataName].handler.get.call(items[dataName].handler, {
                    filter: filter,
                    onData: function(data) {
                        executeCallback(onData, data);
                    }
                });
            }
        } else {
            executeCallback(onData, []);
        }
    }

    function _set(dataName, key, data, onSuccess, onFailure) {
        if (_has(dataName)) { //有指定的数据项
            if (items[dataName].handler) {
                items[dataName].handler.set.call(items[dataName].handler, {
                    key: key,
                    data: data,
                    onSuccess: onSuccess,
                    onFailure: onFailure
                });
            }
        } else {
            executeCallback(onSuccess);
        }
    }

    var module = {
        registerItem: registerItem,     //注册命名数据
        has: _has,                      //是否具有命名数据
        get: _get,                      //获取命名数据
        set: _set,                      //设定命名数据
        handler: handler,               //处理器
        //-----
        dummy: 0
    };

    return module;
});