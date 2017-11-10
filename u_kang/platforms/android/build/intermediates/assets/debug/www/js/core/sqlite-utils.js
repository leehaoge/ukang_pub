define([], function () {
    'use strict';

    function commonExecuteError(error) {
        console.log('Sql execute error: ' + error.message);
    }

    function callFunction(cb, bindObj) {
        if (cb && $.isFunction(cb)) {
            if (bindObj) cb.bind(bindObj);
            cb();
        }
    }

    var module = {
        tableExists: function (db, tableName, cbExisten, cbNotExist) {
            db.executeSql("SELECT COUNT(*) as count FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName],
                function (rs) {
                    var record = rs.rows.item(0);
                    if (record.count > 0) {
                        //exists!
                        callFunction(cbExisten);
                    } else {
                        callFunction(cbNotExist);
                    }
                }, commonExecuteError);
        },
        commonExecuteError: commonExecuteError
    };

    return module;
});