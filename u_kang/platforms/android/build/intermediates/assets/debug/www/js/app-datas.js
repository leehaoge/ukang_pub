define(['core/context', 'core/data-store', 'core/mock-data', 'ukang-constants', 'ukang-sqlite'],
    function (context, dataStore, MockData, CONSTS, sqlite) {
        'use strict';

        function executeCallback(cb) {
            if (cb && $.isFunction(cb)) {
                var args = arguments;
                Array.prototype.shift.apply(args);
                cb.apply(null, args);
            }
        }


        var initCount = 5;

        function stepInit() {
            initCount--;
            if (initCount == 0) context['status'] = 'prepared2';
        }

        sqlite.getDB(function (db) {

            //基本数据类型:
            //[
            //     {type: 'LEN', desc: '长度', baseUint: 'CM'},
            //     {type: 'WEIGHT', desc: '重量', baseUint: 'KG'},
            //     {type: 'PERCENT', desc: '比例', baseUint: 'PERCENT'},
            //     {type: 'VOLUMN', desc: '体积', baseUint: 'L'},
            //     {type: 'PRESSURE', desc: '压力', baseUint: 'MMGH'},
            //     {type: 'CONTENT', desc: '含量', baseUint: 'MMOL/L'},
            //     {type: 'RATE', desc: '速率', baseUint: 'CPM'},
            //     {type: 'TIMELONG', desc: '时长', baseUint: 'HOUR'}
            // ]

            db.executeSql("SELECT * FROM " + CONSTS['TB_基本数据类型'], [], function (rs) {
                var basicTypes = [],
                    dataLen = rs.rows.length;
                for (var i = 0; i < dataLen; i++) {
                    var record = rs.rows.item(i);
                    basicTypes.push({
                        type: record['d_type'],
                        desc: record['desc'],
                        baseUnit: record['main_unit']
                    });
                }
                dataStore.registerItem('基本数据类型', new MockData(basicTypes));
                stepInit();
            });

            // 数据单位：
            // [
            //     {unit: 'CM', basicType: 'LEN', desc: '厘米', convert: 'linear(1)'},
            //     {unit: 'M', basicType: 'LEN', desc: '米', convert: 'linear(100)'},
            //     {unit: 'KG', basicType: 'WEIGHT', desc: '公斤', convert: 'linear(1)'},
            //     {unit: 'LB', basicType: 'WEIGHT', desc: '磅', convert: 'linear(0.4535924)'},
            //     {unit: 'ST', basicType: 'WEIGHT', desc: '英石', convert: 'linear(6.3502932)'},
            //     {unit: 'PERSENT', basicType: 'PERSENT', desc: '%', convert: 'linear(1)'},
            //     {unit: 'MMOL/L', basicType: 'CONTENT', desc: '毫摩尔/升', convert: 'linear(1)'},
            //     {unit: 'MMHG', basicType: 'PRESSURE', desc: '毫米汞柱', convert: 'linear(1)'},
            //     {unit: 'CPM', basicType: 'RATE', desc: '次/分钟', convert: 'linear(1)'},
            //     {unit: 'HOUR', basicType: 'TIMELONG', desc: '小时', convert: 'linear(1)'},
            //     {unit: 'MINUTE', basicType: 'TIMELONG', desc: '分钟', convert: 'linear(1/60)'},
            //     {unit: 'SEC', basicType: 'TIMELONG', desc: '秒', convert: 'linear(1/60/60)'}
            // ]

            db.executeSql("SELECT * FROM " + CONSTS['TB_数据单位'], [], function (rs) {
                var units = [],
                    dataLen = rs.rows.length;
                for (var i = 0; i < dataLen; i++) {
                    var record = rs.rows.item(i);
                    units.push({
                        unit: record['u_ident'],
                        basicType: record['d_type'],
                        desc: record['desc'],
                        convert: record['convert_method']
                    });
                }
                dataStore.registerItem('数据单位', new MockData(units));
                stepInit();
            });


            // 健康数据类型
            // [
            //     {dataName:'身高', basicType: 'LEN', unit:'CM'},
            //     {dataName:'体重', basicType: 'WEIGHT', unit:'KG'},
            //     {dataName:'血糖', basicType: 'CONTENT', unit:'MMOL/L', sampleKind: 'single'},  //<--- sampleKind 如果不指定就是single，单一数据
            //     {dataName:'血压', basicType: 'PRESSURE', unit:'MMGH', sampleKind: 'updown'},
            //     {dataName:'心率', basicType: 'RATE', unit:'CPM'},
            //     {dataName:'体脂率', basicType: 'PERCENT', unit:'PERCENT'},
            //     {dataName:'脱脂体重', basicType: 'WEIGHT', unit:'公斤'},
            //     {dataName:'睡眠', basicType: 'TIMELONG', unit:'HOUR'}
            // ]

            db.executeSql("SELECT * FROM " + CONSTS['TB_健康数据类型'], [], function (rs) {
                var healthDataTypes = [],
                    dataLen = rs.rows.length;
                for (var i = 0; i < dataLen; i++) {
                    var record = rs.rows.item(i);
                    healthDataTypes.push({
                        dataName: record['data_name'],
                        basicType: record['basic_type'],
                        unit: record['d_unit'],
                        sampleKind: record['d_kind']
                    });
                }
                dataStore.registerItem('健康数据类型', new MockData(healthDataTypes));
                stepInit();
            });

            db.executeSql("SELECT * FROM " + CONSTS['TB_收藏'], [], function (rs) {
                var allData = [],
                    dataLen = rs.rows.length;
                for (var i = 0; i < dataLen; i++) {
                    var record = rs.rows.item(i);
                    allData.push({
                        dataName: record['data_name'],
                        collected: record['collected']
                    });
                }
                dataStore.registerItem('收藏', {
                    data: allData,
                    // transform: function(record) {
                    //     return {
                    //         dataName: record['data_name'],
                    //         collected: record['collected']
                    //     };
                    // },
                    // transformRs: function(rs) {
                    //     var dataLen = rs.rows.length, data = [];
                    //     for (var i = 0; i < length; i++) {
                    //         data.push(this.transform(rs.rows.item(i)));
                    //     }
                    //     return data;
                    // },
                    initilized: false,
                    checkInit: function () {
                        if (!this.initilized) {
                            this.indexed = _.indexBy(this.data, 'dataName');
                            this.initilized = true;
                        }
                    },
                    get: function (param) {
                        var filter = param.filter,
                            onData = param.onData;
                        this.checkInit();
                        if ($.isFunction(onData)) {
                            if (filter == null || filter == undefined) {
                                onData(this.data);
                            } else {
                                if (_.isObject(filter)) {
                                    if (filter['dataName']) {
                                        filter = filter['dataName'];
                                    } else {
                                        var filtered = _.where(this.data, filter);
                                        onData(filtered);
                                        return;
                                    }
                                }
                                if (_.isString(filter)) {
                                    var filtered = [this.indexed[filter]];
                                    onData(filtered);
                                }
                            }
                        }
                    },
                    set: function (param) {
                        this.checkInit();
                        var key = param.key,
                            data = param.data,
                            onSuccess = param.onSuccess,
                            onFailure = param.onFailure;

                        function persist(dataName, record) {
                            sqlite.getDB(function (db) {
                                var sql = "UPDATE " + CONSTS['TB_收藏'] + " SET collected = ? WHERE data_name = ?";
                                db.executeSql(sql, [record['collected'] || 0, dataName], function () {
                                    executeCallback(onSuccess);
                                }, function (error) {
                                    executeCallback(onFailure);
                                });
                            });
                        }

                        if (_.isObject(key)) key = key['dataName'];
                        if (_.isString(key) && this.indexed[key]) {
                            this.indexed[key] = data;
                            persist(key, data);
                        }
                    }
                });
                stepInit();
            });


        });

        dataStore.registerItem('测量数据', {
            transform: function (record) {
                return {
                    id: record['data_id'],
                    dataName: record['data_name'],
                    date: record['s_date'],
                    value1: record['value1'],
                    value2: record['value2'],
                    value3: record['value3'],
                    value4: record['value4']
                };
            },
            transformRs: function (rs) {
                var dataLen = rs.rows.length,
                    data = [];
                for (var i = 0; i < length; i++) {
                    data.push(this.transform(rs.rows.item(i)));
                }
                return data;
            },
            get: function (param) {
                var filter = param.filter,
                    onData = param.onData;
                executeCallback(onData, []);
            },
            set: function (param) {
                var key = param.key,
                    data = param.data,
                    onSuccess = param.onSuccess,
                    onFailure = param.onFailure;
                executeCallback(onSuccess);
            }
        });
        stepInit();
        



        // dataStore.registerItem('测量数据', new MockData([
        //     {dataName:'身高', data:[
        //         {date:'2017-07-10 12:30', value: 176},
        //         {date:'2017-11-06 00:21', value: 176}
        //     ]},
        //     {dataName:'体重', data:[
        //         {date:'2017-11-09 05:20', value: 76}
        //     ]},
        //     {dataName:'血糖', data:[
        //         {date:'2017-11-05 21:30', value: 18},
        //         {date:'2017-11-06 17:02', value: 17.2},
        //         {date:'2017-11-07 18:10', value: 15.3},
        //         {date:'2017-11-08 18:20', value: 15.5},
        //         {date:'2017-11-09 09:15', value: 16.6}
        //     ]}        
        // ]));

        // dataStore.registerItem('收藏', new MockData([
        //     {sort:1, dataName:'体重'},
        //     {sort:2, dataName:'血糖'}
        // ]));
    });