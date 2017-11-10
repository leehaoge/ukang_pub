define([], function () {
    var ukangDB = {
            name: 'ukang.db',
            location: 'default'
        }, module = {
            config: ukangDB,
            getDB: function(onSuccess, onError) {
                var db = window.sqlitePlugin.openDatabase(ukangDB, function () {
                    module.dbOK = true;
                    module.err = undefined;
                    if (onSuccess && $.isFunction(onSuccess)) onSuccess(db);
                }, function (err) {
                    console.log(err);
                    module.dbOK = false;
                    module.err = err;
                    if (onError && $.isFunction(onError)) onError(err);
                });
                return db;
            }
        };

    return module;
});