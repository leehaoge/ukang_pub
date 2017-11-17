define(['core/core'], function (CORE) {
    'use strict';

    var MockData = function (d, idField) {
        this.data = d;
        if (!(idField == undefined)) this.idField = idField;
    };

    var d = CORE.__define,
        c = MockData,
        p = c.prototype;

    p.get = function (param) {
        var filter = param.filter,
            onData = param.onData;
        if ($.isFunction(onData)) {

            if (filter == null || filter == undefined) {
                onData(this.data);
            } else
            if (_.isObject(filter)) {
                //特定方法调用
                if (filter['function']) {
                    var func = filter['function'];
                    if (this[func] && $.isFunction(this[func])) {
                        this[func].call(this, filter['params'], onData);
                        return;
                    }
                }
                var filtered = _.where(this.data, filter);
                onData(filtered);
            }
        }
    };

    function addToData(data, newData, config) {
        function genId(theData) {
            if (config && config.is_new && !_.isEmpty(config.idField)) {
                theData[config.idField] = data.length + 1;
            }
        }

        if (_.isArray(newData)) {
            for (var i in newData) {
                if (!_.isEmpty(newData[i])) {
                    genId(newData[i]);
                    data.push(newData[i])
                }
            }
        } else
        if (_.isObject(newData) && !_.isEmpty(newData)) {
            genId(newData);
            data.push(newData);
        }
    }

    /* 设置数据
     *   如果key是null或者undefined，那么data将替代原来的数据；
     *   如果key = {}，那么data是新增的数据
     *   否则，按照key所指定的内容改写数据。
     */
    p.set = function (param) {
        var key = param.key,
            data = param.data,
            onSuccess = param.onSuccess,
            onFailure = param.onFailure;
        if (key == null || key == undefined) {
            this.data = data;
        } else
        if (_.isObject(key)) {
            if (_.isEmpty(key)) {
                addToData(this.data, data, {is_new: true, idField: this.idField});
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