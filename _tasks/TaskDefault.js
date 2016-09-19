module.exports = function (gulp, config) {

    //注册 default 任务
    gulp.task('default', gulp.series(
        'build_dev'
    ));
};
