var del = require('del');
var ejs = require('gulp-ejs');
var less = require('gulp-less');
var gulpif = require('gulp-if');
var util = require('./lib/util');

/*自动刷新浏览器
https://browsersync.io/docs/gulp
 */
var bs = require('browser-sync').create();

/*
自动为图片样式添加 宽/高/background-size 属性
 */
var lazyImageCSS = require('gulp-lazyimagecss');
var postcss = require('gulp-postcss'); // CSS 预处理

/* CSS 转换 `px` 为 `rem`
https://github.com/cuth/postcss-pxtorem
 */
var postcssPxtorem = require('postcss-pxtorem');

/* HTML 内联 CSS 转换 `px` 为 `rem`
https://www.npmjs.com/package/posthtml-px2rem
 */
var posthtmlPx2rem = require('posthtml-px2rem');
var posthtml = require('gulp-posthtml'); // HTML 预处理

/***************************
    browserify 处理相关包
 ***************************/
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

/*browserify 处理多文件
https://github.com/isaacs/node-glob
 */
var glob = require("glob");

/* 提高browserify 的处理效率
https://github.com/substack/watchify
 */
var watchify = require('watchify');

/* borwserify 支持 require handlebars模板
https://github.com/epeli/node-hbsfy
 */
var hbsfy = require('hbsfy');

/*borwserify 支持 require css样式
https://github.com/davidguttman/cssify
*/
var cssify = require('cssify')

/*borwserify 支持 require less样式
https://github.com/dstokes/lessify
*/
var lessify = require('lessify');

module.exports = function(gulp, config) {

    var lazyDir = config.lazyDir || ['../slice'];

    // 复制操作
    var copyHandler = function(type, file) {
        file = file || config.paths['src'][type];

        return gulp.src(file, {
                base: config.paths.src.dir
            })
            .pipe(gulp.dest(config.paths.dev.dir))
            .on('end', reloadHandler);
    };

    // 自动刷新
    var reloadHandler = function() {
        config.livereload && bs.reload();
    };

    //清除目标目录
    function delDev() {
        return del([config.paths.dev.dir]);
    }

    //复制操作 start
    function copyImg() {
        return copyHandler('img');
    }

    function copyLib() {
        return copyHandler("lib");
    }

    function copySlice() {
        return copyHandler('slice');
    }

    function copyFonts() {
        return copyHandler('fonts');
    }

    //复制操作 end

    //编译 less
    function compileLess() {
        return gulp.src(config.paths.src.less)
            .pipe(less())
            .on('error', function(error) {
                console.log(error.message);
            })
            .pipe(gulpif(
                config.supportREM,
                postcss([
                    postcssPxtorem({
                        root_value: '20', // 基准值 html{ font-size: 20px; }
                        prop_white_list: [], // 对所有 px 值生效
                        minPixelValue: 2 // 忽略 1px 值
                    })
                ])
            ))
            .pipe(lazyImageCSS({
                imagePath: lazyDir
            }))
            .pipe(gulp.dest(config.paths.dev.css))
            .on('data', function() {})
            .on('end', reloadHandler)
    }

    //编译 html
    function compileHtml() {
        return gulp.src(config.paths.src.html)
            .pipe(gulpif(
                config.supportREM,
                posthtml(
                    posthtmlPx2rem({
                        rootValue: 20,
                        minPixelValue: 2
                    })
                )))
            .pipe(gulp.dest(config.paths.dev.html))
            .on('data', function() {})
            .on('end', reloadHandler)
    }

    //编译业务层js
    function compileAppJs() {
        hbsfy.configure({
            extensions: ['hbs']
        });

        /*browserify 处理多文件
        https://github.com/isaacs/node-glob
         */
        return glob(config.paths.src.appJs, function(err, files) {
            files.map(function(file) {
                var source_name = file.match(/src[\/|\\]views[\/|\\](.*?)[\/|\\]/)[1];

                var b = browserify({
                        entries: file,
                        debug: true,
                        plugin: [watchify]
                    })
                    .transform(lessify)
                    .transform(cssify)
                    .transform(hbsfy);
                b.on('update', bandle);
                bandle();

                function bandle() {
                    b.bundle()
                        .on('error', function(err) {
                            console.log('err:' + err);
                            util.log(err)
                        })
                        .pipe(source(source_name + '.js'))
                        .pipe(buffer())
                        .pipe(sourcemaps.init({
                            loadMaps: true
                        }))
                        // Add transformation tasks to the pipeline here.
                        .on('error', function(error) {
                            console.log(error);
                        })
                        .pipe(sourcemaps.write('./'))
                        .pipe(gulp.dest(config.paths.dev.appjs))
                        .on('end', reloadHandler);
                }

            });
        });
    }

    //启动 livereload
    function startServer() {
        /*
        配置参考：http://www.browsersync.cn/docs/options/
        */
        bs.init({
            //在Chrome浏览器中打开网站 
            browser: "google chrome",
            server: config.paths.dev.dir,
            port: config['livereload']['port'] || 8080,
            startPath: config['livereload']['startPath'] || '/html',
            reloadDelay: 0,
            notify: { //自定制livereload 提醒条
                styles: [
                    "margin: 0",
                    "padding: 5px",
                    "position: fixed",
                    "font-size: 10px",
                    "z-index: 9999",
                    "bottom: 0px",
                    "right: 0px",
                    "border-radius: 0",
                    "border-top-left-radius: 5px",
                    "background-color: rgba(60,197,31,0.5)",
                    "color: white",
                    "text-align: center"
                ]
            }
        });
    }

    var watchHandler = function(type, file) {
        var target = file.match(/^src[\/|\\](.*?)[\/|\\]/)[1];
        if (target === "views") {
            /*监视页面*/
            if (type === 'removed') {
                var tmp = file.replace('src/', 'dev/');
                del([tmp]).then(function() {
                    util.loadPlugin('BuildDev');
                });
            } else {
                compileHtml();
            }

            if (type === 'add') {
                setTimeout(function() {
                    util.loadPlugin('BuildDev');
                }, 500);
            }
        } else if (target === "static") {
            /*监视静态资源*/
            var static = file.match(/^src[\/|\\]static[\/|\\](.*?)[\/|\\]/)[1];

            switch (static) {
                case 'images':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]);
                    } else {
                        copyHandler('img', file);
                    }
                    break;

                case 'fonts':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]);
                    } else {
                        copyHandler('fonts', file);
                    }
                    break;

                case 'slice':
                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/');
                        del([tmp]);
                    } else {
                        copyHandler('slice', file);
                    }
                    break;

                    // case 'js':
                    //     if (type === 'removed') {
                    //         var tmp = file.replace('src/', 'dev/');
                    //         del([tmp]);
                    //     } else {
                    //         copyHandler('js', file);
                    //     }
                    //     break;

                case 'styles':

                    if (type === 'removed') {
                        var tmp = file.replace('src/', 'dev/').replace('.less', '.css');
                        del([tmp]);
                    } else {
                        compileLess();
                    }

                    break;
            }
        }


    };

    //监听文件
    function watch(cb) {
        var watcher = gulp.watch([
            config.paths.src.img,
            config.paths.src.slice,
            config.paths.src.lib,
            config.paths.src.lessAll,
            config.paths.src.htmlAll,
            // config.paths.src.appJsALL
        ], {
            ignored: /[\/\\]\./
        });

        watcher
            .on('change', function(file) {
                util.log(file + ' has been changed');
                watchHandler('changed', file);
            })
            .on('add', function(file) {
                util.log(file + ' has been added');
                watchHandler('add', file);
            })
            .on('unlink', function(file) {
                util.log(file + ' is deleted');
                watchHandler('removed', file);
            });

        cb();
    }

    //加载插件
    function loadPlugin(cb) {
        util.loadPlugin('build_dev');
        cb();
    }

    //注册 build_dev 任务
    gulp.task('build_dev', gulp.series(
        delDev,
        gulp.parallel(
            copyImg,
            copyFonts,
            copySlice,
            copyLib,
            compileLess,
            compileHtml
        ),
        gulp.parallel(
            watch,
            loadPlugin,
            compileAppJs
        ),
        startServer
    ));

};