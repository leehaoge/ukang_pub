var gulp = require('gulp'),
    connect = require('gulp-connect'),
    reqOptimize = require('gulp-requirejs-optimize'), //- requireJs文件合并所需模块，选择该模块的原因为相对于其它模块活跃度较高
    rename = require("gulp-rename"); //- 文件重命名

gulp.task('serve', function () {
    connect.server({
        root: '../www',
        port: 9000
    });
});

/**
 * 使用 requirejs-optimize 插件，对requireJS的代码进行合并和压缩
 */
gulp.task("optimize", function () {
    gulp.src("app/js/index.js")
        .pipe(reqOptimize({
            optimize: "none", //"uglify", //- none为不压缩资源
            findNestedDependencies: true,                 //- 解析嵌套中的require
            paths: {
                'text': 'libs/text',
                'chart': 'libs/Chart'
            }
        }))
        .pipe(rename("ukang.min.js"))
        .pipe(gulp.dest('dist')); //- 映射文件输出目录
});

gulp.task("watch", function () {
    gulp.watch('app/js/**/*.js', ['optimize'])
    gulp.watch('app/js/**/*.html', ['optimize'])
});