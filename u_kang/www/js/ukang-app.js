/***
 * APP数据逻辑处理 
 **/
define(['core/data-store', 'ukang-utils', 'ukang-constants'], function (dataStore, UTILS, CONSTS) {
    'use strict';

    var appDataReady = false,
        DateUtils = UTILS.DateUtils,
        contains = function (all, sample) {
            return _.isEmpty(all) ? false : !_.isEmpty(_.where(all, sample));
        },
        /**
         * 应用数据处理
         */
        dataHandler = {
            collectTypes: function (params, onData) {
                dataStore.get('收藏', params, onData);
            },
            allTyps: function (params, onData) {
                dataStore.get('健康数据类型', params, onData);
            },
            /**
             * 最后的数据
             *   params必须有{
             *      dataName: 'XXXX'      
             *   }
             */
            latestRecord: function (params, onData) {
                var self = this;
                if (!_.isObject(params) || !!!(params.dataName)) return;
                dataStore.get('测量数据', params, function (data) {
                    if (data && _.isArray(data)) {
                        if (_.isEmpty(data)) {
                            onData({
                                dataName: params.dataName,
                                isEmpty: true
                            });
                        } else {
                            var got = data[0].data,
                                sorted = _.sortBy(got, 'date'),
                                record = _.last(sorted);
                            record.dataName = params.dataName;
                            onData(record);
                        }
                    }
                });
            },
            /**
             * 获取highligh数据
             */
            highlights: function (params, onData) {
                var self = this,
                    info = {
                        cache: {},
                        data: {},
                        rests: []
                    },
                    onLatestRecord = function (record) {
                        var noRecord = !!(record.isEmpty),
                            filter = {
                                dataName: record.dataName
                            },
                            type = _.where(info.cache['allTypes'], filter);
                        if (type) {
                            type = type[0];
                            if (noRecord) {
                                info.rests.push(type);
                            } else {
                                var inCollects = _.where(info.cache['collects'], filter),
                                    dt = UTILS.getSampleTimeDisplay(record.date),
                                    highlightRecord = {
                                        dataName: record.dataName,
                                        d: dt.d,
                                        t: dt.t,
                                        value: record.value,
                                        unit: type.unit
                                    };
                                if (type.type) highlightRecord.type = type.type;
                                if (_.isEmpty(inCollects)) {
                                    info.data['specified'] = info.data['specified'] || [];
                                    var container = info.data['specified'];
                                    switch (dt.kind) {
                                        case CONSTS.DT_SAMEDAY:
                                            info.data['today'] = info.data['today'] || [];
                                            container = info.data['today'];
                                            break;
                                        case CONSTS.DT_SAMEWEEK:
                                            info.data['thisweek'] = info.data['thisweek'] || [];
                                            container = info.data['thisweek'];
                                            break;
                                        case CONSTS.DT_SAMEYEAR:
                                            info.data['thisyear'] = info.data['thisyear'] || [];
                                            container = info.data['thisyear'];
                                            break;
                                    }
                                    container.push(highlightRecord);
                                } else {
                                    info.data['collected'] = info.data['collected'] || [];
                                    info.data['collected'].push(highlightRecord);
                                }
                            }
                        }
                    },
                    onAllTypes = function (allTypes) {
                        info.cache['allTypes'] = allTypes;
                        for (var i in allTypes) {
                            self.latestRecord({
                                dataName: allTypes[i].dataName
                            }, onLatestRecord);
                        }
                        onData({
                            hasData: info.data,
                            rests: info.rests
                        });
                    },
                    onCollectTypes = function (collectTypes) {
                        info.cache['collects'] = collectTypes;
                        self.allTyps(null, onAllTypes);
                    };
                this.collectTypes(null, onCollectTypes);
            }
        },
        ukApp = {
            /**
             * 初始化
             */
            initialize: function () {
                require(['app-datas'], function () {
                    appDataReady = true;
                });
            },
            /**
             * 数据是否ready
             */
            isDataReady: function () {
                return appDataReady;
            },
            get: function (type, params, onData) {
                if (!appDataReady) return null;
                var handler = dataHandler[type];
                if (handler && $.isFunction(handler)) handler.call(dataHandler, params, onData);
            }
        };

    return ukApp;
});