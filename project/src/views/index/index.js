var moduleNav = require('./modules/nav');

<<<<<<< HEAD
var moduleExperience = require('./modules/experience');

var moduleWorks = require('./modules/works');

var moduleSystem = require('./modules/about-system');

var modulePageBasic = require('./modules/basic');

var moduleFavicon = require('./modules/favicon');

/*
首页头像
 */
moduleFavicon.render($$("#js-page-content"));
myApp.onPageInit('home', function(page) {
	moduleFavicon.render($$("#js-page-content"));
});

/*
导航
 */
moduleNav.render();

/*
基本信息
 */
modulePageBasic.render();

/*
本人经历
 */
moduleExperience.render();

/*
作品信息
 */
moduleWorks.render();

/*
关于本系统
 */
moduleSystem.render();
=======
var moduleJingli = require('./modules/jingli');

var moduleJingliWorks = require('./modules/jingli-works');

var moduleWorks = require('./modules/works');

moduleNav.render().then(function(data) {

});

moduleJingli.render().then(function(data) {

});

moduleJingliWorks.render().then(function(data) {

});

moduleWorks.render().then(function(data) {

});

>>>>>>> 08d0c018126c5a36bb5ce6d9eef5b73e19a376f0
