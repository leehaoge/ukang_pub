define([], function () {
    'use strict';

    var db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});

    return db;

});