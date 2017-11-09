define(['core/core'], function(CORE) {
    'use strict';

    var MockData = function(d) {
        this.data = d;
    };

    var d=CORE.__define,c=MockData,p=c.prototype;
    
    p.get = function(param) {
        var filter = param.filter, 
            onData = param.onData;
        if ($.isFunction(onData)) {
            if (filter == null || filter == undefined) {
                onData(this.data);
            } else
            if (_.isObject(filter)) {
                var filtered = _.where(this.data, filter);
                onData(filtered);
            }
        }
    };

    function addToData(data, newData) {
        if (_.isArray(newData)) {
            for (var i in newData) {
                data.push(newData[i])
            }
        } else
        if (_.isObject(newData)) {
            data.push(newData);
        }
    }

    /* 设置数据
     *   如果key是null或者undefined，那么data将替代原来的数据；
     *   如果key = {}，那么data是新增的数据
     *   否则，按照key所指定的内容改写数据。
     */
    p.set = function(param) {
        var key = param.key, 
            data = param.data, 
            onSuccess = param.onSuccess, 
            onFailure = param.onFailure;
        if (key == null || key == undefined) {
            this.data = data;
        } else 
        if (_.isObject(key)) {
            if (_.isEmpty(key)) {
                addToData(this.data, data);
            } else {
                var filtered = _.where(this.data, key),
                    others = _.without(this.data, filtered);
                addToData(others, data);
                this.data = others;
            }
        } else {
            if (onFailure && $.isFunction(onFailure)) onFailure();
        }
        if (onSuccess && $.isFunction(onSuccess)) onSuccess();
    };

    return MockData;
});