var moduleNav = require('./modules/nav');

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
