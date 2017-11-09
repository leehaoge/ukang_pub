var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('serve', function() {
    connect.server({
        root: '../www',
        port: 9000
    });
});