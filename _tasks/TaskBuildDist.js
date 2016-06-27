var _ = require('lodash');
var fs = require('fs');
var del = require('del');
var path = require('path');
var ejs = require('gulp-ejs');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var util = require('./lib/util');

var size = require('gulp-size');

/* 压缩js
https://github.com/terinjokes/gulp-uglify
 */
var uglify = require('gulp-uglify');

/* 合并压缩html中的js文件
https://github.com/pursual/gulp-usemin
 */
var usemin = require('gulp-usemin2');
var lazyImageCSS = require('gulp-lazyimagecss'); // 自动为图片样式添加 宽/高/background-size 属性

/* 压缩css
https://github.com/ben-eb/gulp-cssnano
 */
var minifyCSS = require('gulp-cssnano');

/* 压缩图片
https://github.com/sindresorhus/gulp-imagemin
 */
var imagemin = require('gulp-imagemin');

/* 压缩png
https://github.com/imagemin/imagemin-pngquant
 */
var pngquant = require('imagemin-pngquant');
var tmtsprite = require('gulp-tmtsprite'); // 雪碧图合并
var postcss = require('gulp-postcss'); // CSS 预处理
var postcssPxtorem = require('postcss-pxtorem'); // 转换 px 为 rem
var postcssAutoprefixer = require('autoprefixer'); //自动添加css前缀
var posthtml = require('gulp-posthtml');
var posthtmlPx2rem = require('posthtml-px2rem');
var RevAll = require('gulp-rev-all'); // reversion
var revDel = require('gulp-rev-delete-original');
var changed = require('./common/changed')();

var stripDebug = require('gulp-strip-debug'); //去掉console代码

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

/* borwserify 支持 require handlebars模板
https://github.com/epeli/node-hbsfy
 */
var hbsfy = require('hbsfy');

/*borwserify 支持 require css样式
https://github.com/davidguttman/cssify
*/
var cssify = require('cssify');

/*borwserify 支持 require less样式
https://github.com/dstokes/lessify
*/
var lessify = require('lessify');

module.exports = function(gulp, config) {
    var webp = require('./common/webp')(config);

    var lazyDir = config.lazyDir || ['../slice'];

    var postcssOption = [];

    if (config.supportREM) {
        postcssOption = [
            postcssAutoprefixer({
                browsers: ['last 5 versions']
            }),
            postcssPxtorem({
                root_value: '20', // 基准值 html{ font-zise: 20px; }
                prop_white_list: [], // 对所有 px 值生效
                minPixelValue: 2 // 忽略 1px 值
            })
        ]
    } else {
        postcssOption = [
            postcssAutoprefixer({
                browsers: ['last 5 versions']
            })
        ]
    }

    // 清除 dist 目录
    function delDist() {
        return del([config.paths.dist.dir]);
    }

    // 清除 tmp 目录
    function delTmp() {
        return del([config.paths.tmp.dir]);
    }

    //编译 less
    function compileLess() {
        return gulp.src(config.paths.src.less)
            .pipe(less())
            .pipe(lazyImageCSS({
                imagePath: lazyDir
            }))
            .pipe(tmtsprite({
                margin: 4
            }))
            .pipe(gulpif('*.png', gulp.dest(config.paths.tmp.sprite), gulp.dest(config.paths.tmp.css)));
    }

    //自动补全
    function compileAutoprefixer() {
        return gulp.src(config.paths.tmp.css + '/page-*.css')
            .pipe(postcss(postcssOption))
            .pipe(gulp.dest(config.paths.tmp.css));
    }

    //CSS 压缩
    function miniCSS() {
        return gulp.src(config.paths.tmp.css + '/page-*.css')
            .pipe(minifyCSS({
                safe: true,
                reduceTransforms: false,
                advanced: false,
                compatibility: 'ie7',
                keepSpecialComments: 0
            }))
            .pipe(gulp.dest(config.paths.tmp.css));
    }

    //图片压缩
    function imageminImg() {
        return gulp.src(config.paths.src.img)
            .pipe(imagemin({
                use: [pngquant()]
            }))
            .pipe(gulp.dest(config.paths.tmp.img));
    }

    //字体
    function fontsSize() {
        return gulp.src(config.paths.src.fonts)
            .pipe(size({
                title: 'fonts'
            }))
            .pipe(gulp.dest(config.paths.tmp.fonts));
    }

    //JS 压缩
    // function uglifyJs() {
    //     return gulp.src(config.paths.src.lib, {
    //             base: config.paths.src.dir
    //         })
    //         .pipe(uglify())
    //         .pipe(gulp.dest(config.paths.tmp.dir));
    // }

    //雪碧图压缩
    function imageminSprite() {
        return gulp.src(config.paths.tmp.sprite + '/**/*')
            .pipe(imagemin({
                use: [pngquant()]
            }))
            .pipe(gulp.dest(config.paths.tmp.sprite));
    }

    //html 编译
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
            .pipe(usemin({ //JS 合并压缩
                jsmin: uglify()
            }))
            .pipe(gulp.dest(config.paths.tmp.html));
    }

    //webp 编译
    function supportWebp() {
        if (config['supportWebp']) {
            return webp();
        } else {
            return function noWebp(cb) {
                cb();
            }
        }
    }

    //新文件名(md5)
    function reversion(cb) {
        var revAll = new RevAll({
            fileNameManifest: 'manifest.json',
            dontRenameFile: ['.html', '.php']
        });

        if (config['reversion']) {
            return gulp.src(['./tmp/**/*'])
                .pipe(revAll.revision())
                .pipe(gulp.dest(config.paths.tmp.dir))
                .pipe(revDel({
                    exclude: /(.html|.htm)$/
                }))
                .pipe(revAll.manifestFile())
                .pipe(gulp.dest(config.paths.tmp.dir));
        } else {
            cb();
        }
    }

    function findChanged(cb) {

        if (!config['supportChanged']) {
            return gulp.src('./tmp/**/*', {
                    base: config.paths.tmp.dir
                })
                .pipe(gulp.dest(config.paths.dist.dir))
                .on('end', function() {
                    delTmp();
                })
        } else {
            var diff = changed('./tmp');
            var tmpSrc = [];

            if (!_.isEmpty(diff)) {

                //如果有reversion
                if (config['reversion'] && config['reversion']['available']) {
                    var keys = _.keys(diff);

                    //先取得 reversion 生成的manifest.json
                    var reversionManifest = require(path.resolve('./tmp/manifest.json'));

                    if (reversionManifest) {
                        reversionManifest = _.invert(reversionManifest);

                        reversionManifest = _.pick(reversionManifest, keys);

                        reversionManifest = _.invert(reversionManifest);

                        _.forEach(reversionManifest, function(item, index) {
                            tmpSrc.push('./tmp/' + item);
                            console.log('[changed:] ' + util.colors.blue(index));
                        });

                        //将新的 manifest.json 保存
                        fs.writeFileSync('./tmp/manifest.json', JSON.stringify(reversionManifest));

                        tmpSrc.push('./tmp/manifest.json');
                    }
                } else {
                    _.forEach(diff, function(item, index) {
                        tmpSrc.push('./tmp/' + index);
                        console.log('[changed:] ' + util.colors.blue(index));
                    });
                }

                return gulp.src(tmpSrc, {
                        base: config.paths.tmp.dir
                    })
                    .pipe(gulp.dest(config.paths.dist.dir))
                    .on('end', function() {
                        delTmp();
                    })

            } else {
                console.log('Nothing changed!');
                delTmp();
                cb();
            }
        }

    }

    //编译业务层js
    function compileAppJs() {
        hbsfy.configure({
            extensions: ['hbs']
        });

        return glob(config.paths.src.appJs, function(err, files) {
            files.map(function(file) {
                var source_name = file.match(/src[\/|\\]views[\/|\\](.*?)[\/|\\]/)[1];

                var b = browserify({
                        entries: file,
                        debug: false
                    })
                    .transform(lessify)
                    .transform(cssify)
                    // 业务层handlebars 模板
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
                        // Add transformation tasks to the pipeline here.
                        .on('error', function(error) {
                            console.log(error);
                        })
                        .pipe(stripDebug())
                        .pipe(uglify())
                        .pipe(gulp.dest(config.paths.tmp.appjs));
                }

            });
        });
    }

    //加载插件
    function loadPlugin(cb) {
        util.loadPlugin('build_dist');
        cb();
    }

    //注册 build_dist 任务
    gulp.task('build_dist', gulp.series(
        delDist,
        compileLess,
        compileAutoprefixer,
        miniCSS,
        gulp.parallel(
            imageminImg,
            fontsSize,
            imageminSprite,
            // uglifyJs,
            compileAppJs
        ),
        compileHtml,
        reversion,
        supportWebp(),
        findChanged,
        loadPlugin
    ));
};