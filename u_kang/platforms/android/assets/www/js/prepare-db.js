define(['ukang-sqlite', 'core/sqlite-utils', 'ukang-constants', 'core/context'],
    function (sqlite, sqliteUtils, CONSTS, context) {
        'use strict';

        function executeCallback(cb) {
            if (cb && $.isFunction(cb)) {
                var args = arguments;
                Array.prototype.shift.apply(args);
                cb.apply(null, args);
            }
        }

        var utils = {
            '测试': function (db) {
                db.executeSql("SELECT COUNT(*) as tbCount FROM sqlite_master WHERE type = 'table'", [],
                    function (rs) {
                        console.log('当前表数量=' + rs.rows.item(0).tbCount);
                        console.log('测试成功！');
                    }, sqliteUtils.commonExecuteError);
            },
            '建表_系统配置': function (db, onSuccess) {
                var tbName = CONSTS['TB_系统配置'];
                db.sqlBatch([
                    "CREATE TABLE " + tbName + " (\
                        s_group TEXT NOT NULL,\
                        s_ident TEXT NOT NULL,\
                        s_value TEXT,\
                        s_ex TEXT,\
                        PRIMARY KEY (s_group, s_ident)\
                    )", ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['sys', 'version', '' + CONSTS.VERSIO, '']]
                ], function () {
                    console.log('“系统配置”表[' + tbName + ']创建成功！');
                    executeCallback(onSuccess);
                }, function (error) {
                    console.log('“系统配置”表[' + tbName + ']创建失败！message: ' + error.message);
                });
            },
            '建表_基本数据类型': function (db, onSuccess) {
                var tbName = CONSTS['TB_基本数据类型'];
                db.sqlBatch([
                    "CREATE TABLE " + tbName + " (\
                        d_type TEXT NOT NULL PRIMARY KEY,\
                        desc TEXT,\
                        main_unit TEXT\
                    )", ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['LEN', '长度', 'CM']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['WEIGHT', '重量', 'KG']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['PERCENT', '比例', 'PERCENT']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['VOLUMN', '体积', 'L']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['PRESSURE', '压力', 'MMGH']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['CONTENT', '含量', 'MMOL/L']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['RATE', '速率', 'CPM']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['TIMELONG', '时长', 'HOUR']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?)', ['TEMPERATURE', '温度', 'DEGREE_C']],
                ], function () {
                    console.log('“基本数据类型”表[' + tbName + ']创建成功！');
                    executeCallback(onSuccess);
                }, function (error) {
                    console.log('“基本数据类型”表[' + tbName + ']创建失败！message: ' + error.message);
                });
            },
            '建表_数据单位': function (db, onSuccess) {
                var tbName = CONSTS['TB_数据单位'];
                db.sqlBatch([
                    "CREATE TABLE " + tbName + " (\
                        u_ident TEXT NOT NULL PRIMARY KEY,\
                        d_type TEXT NOT NULL,\
                        desc TEXT,\
                        convert_method TEXT\
                    )", ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['CM', 'LEN', '厘米', 'linear(1)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['M', 'LEN', '米', 'linear(100)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['KG', 'WEIGHT', '公斤', 'linear(1)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['LB', 'WEIGHT', '磅', 'linear(0.4535924)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['ST', 'WEIGHT', '英石', 'linear(6.3502932)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['PERCENT', 'PERCENT', '%', 'linear(1)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['MMOL/L', 'CONTENT', '毫摩尔/升', 'linear(1)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['MMHG', 'PRESSURE', '毫米汞柱', 'linear(1)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['CPM', 'RATE', '次/分钟', 'linear(1)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['HOUR', 'TIMELONG', '小时', 'linear(1)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['MINUTE', 'TIMELONG', '分钟', 'linear(1/60)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['SEC', 'TIMELONG', '秒', 'linear(1/60/60)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['DEGREE_C', 'TEMPERATURE', '℃', 'linear(1)']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['DEGREE_F', 'TEMPERATURE', '℉', 'linear(9/5)+32']],
                ], function () {
                    console.log('“数据单位”表[' + tbName + ']创建成功！');
                    executeCallback(onSuccess);
                }, function (error) {
                    console.log('“数据单位”表[' + tbName + ']创建失败！message: ' + error.message);
                });
            },
            '建表_健康数据类型': function (db, onSuccess) {
                /**
                 * basic_type ==> 基础数据类型
                 * d_unit ==> 目前使用的单位
                 * d_kind ==> (
                 *      'single' ==> 单一数据,
                 *      'updown' ==> 高低值(含起始终止)
                 * )
                 */
                var tbName = CONSTS['TB_健康数据类型'];
                db.sqlBatch([
                    "CREATE TABLE " + tbName + " (\
                        data_name TEXT NOT NULL PRIMARY KEY,\
                        basic_type TEXT,\
                        d_unit TEXT,\
                        d_kind TEXT\
                    )", ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['身高', 'LEN', 'CM', 'single']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['体重', 'WEIGHT', 'KG', 'single']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['血糖', 'CONTENT', 'MMOL/L', 'single']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['血压', 'PRESSURE', 'MMHG', 'updown']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['心率', 'RATE', 'CPM', 'single']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['体脂率', 'PERCENT', 'PERCENT', 'single']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['脱脂体重', 'WEIGHT', 'KG', 'single']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['睡眠', 'TIMELONG', 'HOUR', 'single']],
                    ['INSERT INTO ' + tbName + ' VALUES (?,?,?,?)', ['体温', 'TEMPERATURE', 'DEGREE_C', 'single']],
                ], function () {
                    console.log('“健康数据类型”表[' + tbName + ']创建成功！');
                    executeCallback(onSuccess);
                }, function (error) {
                    console.log('“健康数据类型”表[' + tbName + ']创建失败！message: ' + error.message);
                });
            },
            '建表_收藏': function (db, onSuccess) {
                var tbName = CONSTS['TB_收藏'];
                db.sqlBatch([
                    "CREATE TABLE " + tbName + " (\
                        data_name TEXT PRIMARY KEY,\
                        collected INTEGER\
                    )"
                ], function () {
                    console.log('“收藏”表[' + tbName + ']创建成功！');
                    executeCallback(onSuccess);
                }, function (error) {
                    console.log('“收藏”表[' + tbName + ']创建失败！message: ' + error.message);
                });
            },
            '建表_测量数据': function (db, onSuccess) {
                /**
                 * 测量数据表
                 */
                var tbName = CONSTS['TB_测量数据'];
                db.sqlBatch([
                    "CREATE TABLE " + tbName + " (\
                        data_id INTEGER PRIMARY KEY AUTOINCREMENT,\
                        data_name TEXT NOT NULL,\
                        s_date TEXT NOT NULL,\
                        value1 REAL NOT NULL,\
                        value2 REAL,\
                        value3 REAL,\
                        value4 REAL\
                    )"
                ], function () {
                    console.log('“测量数据”表[' + tbName + ']创建成功！');
                    executeCallback(onSuccess);
                }, function (error) {
                    console.log('“测量数据”表[' + tbName + ']创建失败！message: ' + error.message);
                });
            },
            '建表_APP用户': function (db, onSuccess) {
                /**
                 * 测量数据表
                 */
                var tbName = CONSTS['TB_APP用户'];
                db.sqlBatch([
                    "CREATE TABLE " + tbName + " (\
                        user_id TEXT PRIMARY KEY,\
                        u_name TEXT NOT NULL,\
                        phone TEXT NOT NULL,\
                        birthday TEXT,\
                        age INTEGER,\
                        weight REAL,\
                        height READ,\
                        blood_type TEXT,\
                        medical_memo TEXT,\
                        allergies TEXT,\
                        medicines TEXT,\
                        last_update TEXT\
                    )",
                    ["INSERT INTO " + tbName + " VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [
                        'default','默认用户','','1990-01-01',(new Date().getFullYear() - 1990),0,0,'','','','',new Date()]]
                ], function () {
                    console.log('“APP用户”表[' + tbName + ']创建成功！');
                    executeCallback(onSuccess);
                }, function (error) {
                    console.log('“APP用户”表[' + tbName + ']创建失败！message: ' + error.message);
                });
            },
            '清除所有表': function (db) {
                var dropSQL = function (tableName) {
                        return "DROP TABLE IF EXISTS " + tableName;
                    },
                    dropSqls = [];
                dropSqls.push(dropSQL(CONSTS['TB_基本数据类型']));
                dropSqls.push(dropSQL(CONSTS['TB_健康数据类型']));
                dropSqls.push(dropSQL(CONSTS['TB_数据单位']));
                dropSqls.push(dropSQL(CONSTS['TB_收藏']));
                dropSqls.push(dropSQL(CONSTS['TB_测量数据']));
                dropSqls.push(dropSQL(CONSTS['TB_系统配置']));
                db.sqlBatch(dropSqls, function () {
                    console.log('清除所有表成功！');
                }, function (error) {
                    console.log('清除所有表失败！message: ' + error.message);
                })
            },
            '表存在': function (db, tableName, cbExists, cbNotExist) {
                sqliteUtils.tableExists(db, tableName, cbExists, cbNotExist);
            },
            //--------------------------------
            execute: function (action) {
                if (this[action]) {
                    var args = arguments;
                    //去掉第一个参数
                    Array.prototype.shift.apply(args);
                    this[action].apply(this, args);
                }
            }
        };


        function onDBSuccess(db) {
            context['status'] = 'preparing';
            var routineCount = 7;
            function createTableIfNotExists(tableName, cbExists) {
                var constName = 'TB_' + tableName,
                    createMethod = '建表_' + tableName;
                utils.execute('表存在', db, CONSTS[constName], function () {
                    routineCount--;
                    console.log('表[' + CONSTS[constName] + '](' + tableName + ')已经存在，无需创建。');
                    executeCallback(cbExists);
                }, function () {
                    utils.execute(createMethod, db, function() {
                        routineCount--;
                        executeCallback(cbExists);
                    });
                });
            }

            function prepareCollects() {
                var sql = "INSERT INTO " + CONSTS['TB_收藏'] + " \
                SELECT t1.data_name, 0 as collected FROM " + CONSTS['TB_健康数据类型'] + " t1\
                LEFT OUTER JOIN " + CONSTS['TB_收藏'] + " t2 \
                ON t1.data_name = t2.data_name WHERE t2.data_name IS NULL";
                db.executeSql(sql, [], function() {
                    routineCount--;
                    console.log('同步收藏数据成功！');
                }, function(error) {
                    routineCount--;
                    console.log('同步收藏数据失败！message: ' + error.message);
                });                
            }

            function checkPrepared() {
                if (routineCount > 0) setTimeout(checkPrepared, 200);
                else context['status'] = 'prepared';
            }

            createTableIfNotExists('系统配置');
            createTableIfNotExists('基本数据类型');
            createTableIfNotExists('健康数据类型');
            createTableIfNotExists('数据单位');
            createTableIfNotExists('收藏', prepareCollects);
            createTableIfNotExists('测量数据');
            createTableIfNotExists('APP用户');
            
            checkPrepared();
        }

        var module = {
            utils: utils,
            execute: function () {
                sqlite.getDB(onDBSuccess);
            }
        };

        return module;
    });