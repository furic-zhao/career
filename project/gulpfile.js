var gulp = require('gulp');
var fs = require('fs');
var path = require('path');

/*
每一次执行 gulp 任务时，会向上寻找 _tasks 目录，这里定义的层级为 3，也就是在 gulpfile.js 会向上寻找 3 个层级，只要 _tasks 在这 3 个层级内即可，如果目录很深很深，改一下这里的 3 即可
 */
var deep = 3;
run_tasks('_tasks');

function run_tasks(tasks_path) {
    if (--deep < 0) {
        throw new Error('something wrong in require tasks!');
        return;
    }

    tasks_path = path.join('../', tasks_path);

    if (fs.existsSync(tasks_path)) {
        require(tasks_path)(gulp);
    } else {
        run_tasks(tasks_path);
    }
}
