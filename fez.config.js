export default {
    /* ==================================
     * @ 2017 FEZ 前端模块工程自动化构建工具
     * https://github.com/furic-zhao/fez
     * ================================== */

    /**
     * bowserify配置
     */
    "browserify": {
        "options": {
            "extensions": [], // import require 引入文件时可以省略的扩展名
            "paths": ["./src/views"] // import require 引入文件的根路径
        },
        /**
         * 抽取来通过 import $ from 'jquery';或let $ = require('jquery');
         * 引入的公共文件不和业务逻辑文件打包到一起
         * 此处配置后需要通过script标签形式在页面引入
         * 具体信息请参考：https://github.com/thlorenz/browserify-shim
         */
        "shim": [{
            "import": "Q",
            "from": "q"
        }, {
            "import": "Framework7",
            "from": "framework7"
        }]
    },

    "sftp": {
        "host": "xxx.xxx.xxx.xxx",
        "port": "22",
        "user": "root",
        "password": "***********",
        "remotePath": "/data/wwwroot/www.hestudy.com/career",
        "includeHtml": true
    },

    /**
     * 启用 PX => REM 自动化转换
     * 如果启用 REM 转换需要在公共样式中对<html>设置基准值
     * 通过 media媒体查询 为 <html> 设置不同值 以实现在不同的屏幕中等比缩放
     */
    "useREM": {
        "css": {
            "available": true, //启用 css 中的 px => rem 转换 【包含less,sass】
            /**
             * 配置参考：https://github.com/cuth/postcss-pxtorem
             */
            "options": {
                "rootValue": 16, //相对于html根字体大小
                "unitPrecision": 5, //允许REM单位增长到的十进制数
                "propList": ["*"], //可以从px更改为rem的属性
                "selectorBlackList": [], //要忽略的选择器
                "replace": true, //替换包含rems的规则，而不是添加fallback
                "mediaQuery": false, //允许在媒体查询中转换px
                "minPixelValue": 0 //设置要替换的最小像素值
            }
        }
    },

    /**
     * 生产环境 启用自动化添加文件版本号(md5)
     * 配置参考：https://github.com/smysnk/gulp-rev-all
     */
    "useMd5": {
        "options": {
            "dontRenameFile": [".html", /dynamic\/(.*?).(jpg|png)$/g],
            "dontUpdateReference": [".html", /dynamic\/(.*?).(jpg|png)$/g]
        }
    },

    /**html自动化注入文件*
     * 【支持自定义打包多个文件到一个文件】
     * 【支持自定义打包单个文件】
     * 【未配置的文件自动打包成一个文件】
     * 【插入页面顺序以字母或数字降序排列-解决插入页面的脚本文件依赖关系】
     * 【打包顺序以文件配置先后降序排列-解决打包文件间的依赖关系】
     */
    "useInject": {
        /**
         * ---------- bower打包格式 仅对 生产环境------------
         * 打包文件支持 gulp格式的正则文件名
         * {
         *     "target": "{排序序号}-vendor-{打包名称}.js",
         *     "contain": ["{文件1}", "{文件2}", "{文件3}"]
         * }
         */
        "bower": {
            "available": true, //启用 bower 文件自动化注入
            "js": [{
                "target": "vendor-framework7.js",
                "contain": ["**/framework7.js"]
            }],
            "css": [{
                "target": "vendor-framework7.css",
                "contain": ["**/framework7.ios.css", "**/framework7.ios.colors.css"]
            }, {
                "target": "vendor-font-awesome.css",
                "contain": ["**/font-awesome.css"]
            }]
        },
        /**
         * 【支持单个文件指定注入到某些页面】
         * （命名规则：assign-{页面名}-{页面名}-{other}
         */
        "lib": {
            "available": true, //启用 公共 文件自动化注入
            "css": "*common*", //以common命名的样式文件会注入到所有的页面
            /*
             * ---------- 公共脚本打包格式 仅对 生产环境------------
             * 打包文件支持 gulp格式的正则文件名
             * {
             *     "target": "{排序序号}-common-{打包名称}.js",
             *     "contain": ["{文件1}", "{文件2}", "{文件3}"]
             * }
             */
            "js": []
        },
        /**
         * 【支持src目录中的样式及编译后的逻辑脚本自动化注入到对应的页面】
         */
        "views": true //启用 业务目录 文件自动化注入
    }
}
