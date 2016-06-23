var fs = require('fs');
var path = require('path');
var config = require('rc')('zworkflow', {
    projectName: process.cwd().split(path.sep).pop()
});

/*
加载当前目录下所有以 task 开头的文件，我们将各个 gulp 任务都定义成一个个以 task 开头的 js 文件，这样，就动态的注册了所有 gulp 任务，共用了一个 node_modules
 */
module.exports = function (gulp) {
    fs.readdirSync(__dirname).filter(function (file) {
        return (file.indexOf(".") !== 0) && (file.indexOf('Task') === 0);
    }).forEach(function (file) {
        var registerTask = require(path.join(__dirname, file));
        registerTask(gulp, config);
    });
};
