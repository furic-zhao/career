(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
myApp.onPageInit('home', function (page) {
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

},{"./modules/about-system":2,"./modules/basic":3,"./modules/experience":5,"./modules/favicon":9,"./modules/nav":11,"./modules/works":15}],2:[function(require,module,exports){
'use strict';

var blockContentTemp = require('../public/block-content.hbs');

var blockData = require('../../service/block');

module.exports = {
    render: function render() {
        return Q.Promise(function (resolve, reject) {
            blockData.getAboutSystem().then(function (data) {
                $$("#js-panel-left").append(blockContentTemp(data));
            });

            blockData.getIndexData().then(function (data) {
                $$("#js-page-content").append(blockContentTemp(data));
            });

            myApp.onPageInit('home', function (page) {
                blockData.getIndexData().then(function (data) {
                    $$("#js-page-content").append(blockContentTemp(data));
                });
            });

            resolve();
        });
    }
};

},{"../../service/block":18,"../public/block-content.hbs":12}],3:[function(require,module,exports){
'use strict';

var basic = require('../../service/basic');

var basicTemp = require('../public/block-list.hbs');

var moduleFavicon = require('../favicon');

module.exports = {
    render: function render() {
        return Q.Promise(function (resolve, reject) {
            myApp.onPageInit('basic', function (page) {
                basic.getListAll().then(function (data) {
                    $$('#js-basic-box').append(basicTemp(data));
                });

                /*
                基本资料头像
                 */
                moduleFavicon.render($$('#js-basic-box'));
            });

            resolve();
        });
    }
};

},{"../../service/basic":17,"../favicon":9,"../public/block-list.hbs":13}],4:[function(require,module,exports){
'use strict';

var workService = require('../../service/works');

var worksListTemp = require('../public/works-list.hbs');

module.exports = {
    render: function render() {
        return Q.Promise(function (resolve, reject) {

            /*经历相关作品*/
            myApp.onPageInit('experience-work', function (page) {

                var typeVal = page.query.type;

                workService.getListByType(typeVal).then(function (data) {
                    var workPopupTitle = {
                        "2012": "2012年~至今 的作品",
                        "2007": "2007年~2012年 的作品",
                        "2004": "2004年~2007年 的作品"
                    };
                    $$(".jingli-works-title").html(workPopupTitle[typeVal]);

                    $$(".works-list-box").html(worksListTemp(data)).find('.js-card').addClass('swiper-slide').find(".swiper-lazy").append('<div class="preloader"></div>');

                    myApp.initImagesLazyLoad('.page');

                    myApp.swiper('.swiper-container', {
                        preloadImages: false,
                        lazyLoading: true,
                        pagination: '.swiper-pagination',
                        // effect: 'coverflow',
                        slidesPerView: 'auto',
                        centeredSlides: true
                    });

                    $$('.show-photo').on('click', function () {
                        var $$this = $$(this);

                        workService.getById($$this.attr("data-id")).then(function (data) {
                            myApp.photoBrowser({
                                photos: data.list,
                                lazyLoading: true,
                                theme: 'dark',
                                backLinkText: '返回'
                            }).open();
                        });
                    });
                });
            });
            resolve();
        });
    }
};

},{"../../service/works":20,"../public/works-list.hbs":14}],5:[function(require,module,exports){
'use strict';

var moduleExperienceWorks = require('../experience-works');

var baikeSummaryData = require('../../service/baike-summary');

var tabNavTemp = require("./tab-nav.hbs");
var tabContentTemp = require("./tab-content.hbs");

var experienceData = require("../../service/experience");

var Handlebars = require("hbsfy/runtime");

Handlebars.registerHelper("addOne", function (index) {

    return index + 1;
});

Handlebars.registerHelper("addActive", function (index) {

    if (index == 0) {
        return "active";
    }
    return "";
});

Handlebars.registerHelper("addOtherHref", function (type) {
    if (type == '2012') {
        return '<p><a href="#" class="button baike-summary">百科年度工作总结</a></p>';
    }
});

module.exports = {
    render: function render() {
        return Q.Promise(function (resolve, reject) {

            /*百科年度总结*/
            myApp.onPageInit('experience', function (page) {

                experienceData.getListTitle().then(function (data) {
                    $$("#js-tab-nav").html(tabNavTemp(data));
                });

                experienceData.getListAll().then(function (data) {
                    $$("#js-tab-content").html(tabContentTemp(data));
                    // myApp.initPageSwiper('.page');

                    $$('.baike-summary').on('click', function () {
                        myApp.photoBrowser({
                            photos: baikeSummaryData,
                            lazyLoading: true,
                            theme: 'dark',
                            backLinkText: '返回'
                        }).open();
                    });
                });
            });

            moduleExperienceWorks.render();
            resolve();
        });
    }
};

},{"../../service/baike-summary":16,"../../service/experience":19,"../experience-works":4,"./tab-content.hbs":6,"./tab-nav.hbs":7,"hbsfy/runtime":40}],6:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<div id=\"tab"
    + alias3((helpers.addOne || (depth0 && depth0.addOne) || alias2).call(alias1,(data && data.index),{"name":"addOne","hash":{},"data":data}))
    + "\" class=\"page-content tab "
    + alias3((helpers.addActive || (depth0 && depth0.addActive) || alias2).call(alias1,(data && data.index),{"name":"addActive","hash":{},"data":data}))
    + "\">\n    <div class=\"content-block\">\n        <div class=\"content-block-title\">"
    + alias3(container.lambda((depth0 != null ? depth0.compony : depth0), depth0))
    + "</div>\n        <div class=\"card\">\n            <div class=\"card-content\">\n                <div class=\"card-content-inner\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.intro : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </div>\n            </div>\n        </div>\n        <div class=\"card\">\n            <div class=\"card-content\">\n                <div class=\"card-content-inner\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.grade : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.addOtherHref || (depth0 && depth0.addOtherHref) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"addOtherHref","hash":{},"data":data})) != null ? stack1 : "")
    + "\n                </div>\n            </div>\n        </div>\n        <p>\n            <a href=\"./index/experience-works.html?type="
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"button\" data-type=\""
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">相关作品</a>\n        </p>\n    </div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "                    <p>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</p>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "                    <p>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</p>\n                    ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":40}],7:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<a href=\"#tab"
    + alias3((helpers.addOne || (depth0 && depth0.addOne) || alias2).call(alias1,(data && data.index),{"name":"addOne","hash":{},"data":data}))
    + "\" class=\"button tab-link "
    + alias3((helpers.addActive || (depth0 && depth0.addActive) || alias2).call(alias1,(data && data.index),{"name":"addActive","hash":{},"data":data}))
    + "\">"
    + alias3(container.lambda(depth0, depth0))
    + "</a> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true});

},{"hbsfy/runtime":40}],8:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<!-- 头像 -->\n<div class=\"card ks-card-header-pic\">\n    <div valign=\"bottom\" style=\"\" class=\"aboutme-pic card-image color-white no-border lazy lazy-fadein\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n    <div class=\"card-content\">\n        <div class=\"card-content-inner\">\n            <p>"
    + alias4(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"desc","hash":{},"data":data}) : helper)))
    + "</p>\n        </div>\n    </div>\n</div>\n<!-- /头像 -->\n";
},"useData":true});

},{"hbsfy/runtime":40}],9:[function(require,module,exports){
'use strict';

var basic = require('../../service/basic');

var faviconTemp = require('./favicon.hbs');

module.exports = {
    render: function render($$box) {

        return Q.Promise(function () {

            basic.getFaviconData().then(function (data) {
                $$box.prepend(faviconTemp(data));
            });
            resolve();
        });
    }
};

},{"../../service/basic":17,"./favicon.hbs":8}],10:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li>\n    <a href=\"./index/jibenziliao.html\" class=\"item-link item-content close-panel\">\n        <div class=\"item-media\"><i class=\"fa fa-newspaper-o\"></i></div>\n        <div class=\"item-inner\">\n            <div class=\"item-title\">基本资料</div>\n        </div>\n    </a>\n</li>\n<li>\n    <a href=\"./index/experience.html\" class=\"item-link item-content close-panel\">\n        <div class=\"item-media\"><i class=\"fa fa-paper-plane\"></i></div>\n        <div class=\"item-inner\">\n            <div class=\"item-title\">本人经历</div>\n        </div>\n    </a>\n</li>\n<li>\n    <a href=\"./index/works.html\" class=\"item-link item-content close-panel\">\n        <div class=\"item-media\"><i class=\"fa fa-cubes\"></i></div>\n        <div class=\"item-inner\">\n            <div class=\"item-title\">作品信息</div>\n        </div>\n    </a>\n</li>\n";
},"useData":true});

},{"hbsfy/runtime":40}],11:[function(require,module,exports){
'use strict';

var appNavTemp = require('./app-nav.hbs');

module.exports = {
    render: function render() {
        return Q.Promise(function (resolve, reject) {
            /*加载导航模板*/
            $$(".app-nav").append(appNavTemp());
            myApp.onPageInit('home', function (page) {
                $$(".index-app-nav").append(appNavTemp());
            });
            resolve();
        });
    }
};

},{"./app-nav.hbs":10}],12:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"content-block-title\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>\n<div class=\"content-block\">\n    <div class=\"content-block-inner\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.content : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p>"
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":40}],13:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"content-block-title\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</div>\n<div class=\"list-block\">\n    <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.content : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <li>\n            <div class=\"item-content\">\n                <div class=\"item-inner\">\n                    <div class=\"item-title\">"
    + alias2(alias1((depth0 != null ? depth0.subtitle : depth0), depth0))
    + "</div>\n                    <div class=\"item-after\">"
    + alias2(alias1((depth0 != null ? depth0.subcontent : depth0), depth0))
    + "</div>\n                </div>\n            </div>\n        </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":40}],14:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"js-card card ks-card-header-pic\">\n    <div class=\"card-header\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\n    <div data-background=\""
    + alias4(((helper = (helper = helpers.cover || (depth0 != null ? depth0.cover : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cover","hash":{},"data":data}) : helper)))
    + "\" valign=\"bottom\" class=\"lazy lazy-fadein swiper-lazy show-photo card-image color-white no-border\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"></div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.desc : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"card-footer\">\n        <a href=\"#\" class=\"link show-photo\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><i class=\"fa fa-photo\"></i> 更多图片</a> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"card-content\">\n        <div class=\"card-content-inner\">\n            <p>"
    + container.escapeExpression(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"desc","hash":{},"data":data}) : helper)))
    + "</p>\n        </div>\n    </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\n        <a href=\""
    + container.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"url","hash":{},"data":data}) : helper)))
    + "\" class=\"external link\" target=\"_blank\"><i class=\"fa fa-link\"></i> 作品链接</a> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":40}],15:[function(require,module,exports){
'use strict';

var workService = require('../../service/works');

var worksListTemp = require('../public/works-list.hbs');

module.exports = {
    render: function render() {
        return Q.Promise(function (resolve, reject) {
            /*作品页面*/
            myApp.onPageInit('works', function (page) {

                workService.getList().then(function (data) {
                    $$("#js-works-list").html(worksListTemp(data));

                    /*
                    初始化图片赖加载
                     */
                    myApp.initImagesLazyLoad('.page');

                    /*
                    图册浏览
                     */
                    $$('.show-photo').on('click', function () {
                        var $$this = $$(this);

                        workService.getById($$this.attr("data-id")).then(function (data) {
                            myApp.photoBrowser({
                                photos: data.list,
                                lazyLoading: true,
                                theme: 'dark',
                                backLinkText: '返回'
                            }).open();
                        });
                    });
                });
            });
            resolve();
        });
    }
};

},{"../../service/works":20,"../public/works-list.hbs":14}],16:[function(require,module,exports){
'use strict';

var baikeSummary = [{
    url: './static/images/dynamic/baikesummary/01.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/02.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/03.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/04.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/05.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/06.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/07.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/08.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/09.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/10.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/11.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/12.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/13.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/14.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/15.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/16.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/17.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/18.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/19.png',
    caption: ''
}, {
    url: './static/images/dynamic/baikesummary/20.png',
    caption: ''
}];

module.exports = baikeSummary;

},{}],17:[function(require,module,exports){
'use strict';

var basicData = [{
    title: '基本信息',
    content: [{
        subtitle: '姓名',
        subcontent: '赵会见(Furic)'
    }, {
        subtitle: '性别',
        subcontent: '男'
    }, {
        subtitle: '出生年月',
        subcontent: '1982年4月'
    }, {
        subtitle: '民族',
        subcontent: '汉族'
    }, {
        subtitle: '婚姻状况',
        subcontent: '已婚'
    }, {
        subtitle: '籍贯',
        subcontent: '河南'
    }, {
        subtitle: '兴趣爱好',
        subcontent: '电子、硬件、DIY'
    }]
}, {
    title: '背景介绍',
    content: [{
        subtitle: '工作经验',
        subcontent: '12年WEB产品架构研发'
    }, {
        subtitle: '毕业院校',
        subcontent: '郑州轻工业学院(2000~2004年)'
    }, {
        subtitle: '所修专业',
        subcontent: '电子与信息技术'
    }]
}, {
    title: '联系方式',
    content: [{
        subtitle: '电话',
        subcontent: '13811869208'
    }, {
        subtitle: 'Email',
        subcontent: 'furic@qq.com'
    }, {
        subtitle: '现住址',
        subcontent: '北京亦庄开发区科创十三街'
    }]
}];

var faviconData = {
    title: 'furic',
    favicon: './static/images/dynamic/zhaozhao.jpg',
    desc: '个人能力有限，团队力量无限！让激情燃烧自己，把火光照亮别人!'
};

module.exports = {

    /*
    获取所有基本信息
     */
    getListAll: function getListAll() {
        return Q.Promise(function (resolve, reject) {
            resolve(basicData);
        });
    },

    getFaviconData: function getFaviconData() {
        return Q.Promise(function (resolve, reject) {
            resolve(faviconData);
        });
    }
};

},{}],18:[function(require,module,exports){
'use strict';

var blockData = [{
    id: 'aboutme',
    title: '自我介绍',
    content: ['致力于WEB研发工程化自动化的研究，<a href="https://github.com/furic-zhao/fez/" target="_blank" class="link external">FEZ</a>前端模块化工程开发框架作者。', '曾与美国硅谷团队联合研发具有军工安全资质的网络准入系列软件、国内顶级互联网安全公司的搜索百科、核心安全、视频直播、智能硬件等大中型项目的前端构建。现负责京东搜索与大数据平台众多数据类产品的前端架构。', '使用国际前沿的工程化技术提高团队研发效率及项目产品的可维护性和扩展性。善于协调项目的策划、设计、需求范围和项目进度、处理解决各环节问题。']
}, {
    id: 'gangwei',
    title: '意向岗位',
    content: ['WEB产品架构师、高级全栈工程师、技术管理职位、产品职位']
}, {
    id: 'zhize',
    title: '意向职责',
    content: ['负责产品需求分析和架构设计、参与系统技术选型及核心模块技术验证和技术攻关，实现并完善产品功能，协调测试、上线、反馈等流程，控制产品进度及处理各环节问题，保证产品最终质量。']
}, {
    id: 'word',
    title: 'word版简历',
    content: ['<a href="http://www.hestudy.com/career.docx" class="link external" target="_blank">http://www.hestudy.com/career.docx</a>']
}, {
    id: 'system',
    title: '关于本系统',
    content: ['本系统使用FEZ前端模块化开发框架基于Framework7构建。演示了移动端REM的解决方案。兼容任何终端和平台、可以内嵌在任何APP或移动端应用中浏览。', '<a href="https://github.com/furic-zhao/fez/" target="_blank" class="link external">FEZ</a> 是面向 前端模块化工程 的开发框架。主要为解决 前端开发多人高效协作、提高开发质量、及项目功能扩展的快速迭代和可维护性等问题。核心包括功能模块化、结构规范化、及开发自动化。']
}, {
    id: 'career-code',
    title: '简历源码参考',
    content: ['‪<a href="https://github.com/furic-zhao/career/" target="_blank" class="link external">https://github.com/furic-zhao/career/</a>']
}, {
    id: 'z-workflow-code',
    title: 'FEZ前端模块化工程介绍及源码',
    content: ['‪<a href="https://github.com/furic-zhao/fez/" target="_blank" class="link external">https://github.com/furic-zhao/fez/</a>']
}];

function inArray(elem, arr, i) {
    var len;

    if (arr) {
        len = arr.length;
        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

        for (; i < len; i++) {

            // Skip accessing in sparse arrays
            if (i in arr && arr[i] === elem) {
                return i;
            }
        }
    }

    return -1;
}

module.exports = {
    /*
     获取关于本系统的信息
     */
    getAboutSystem: function getAboutSystem() {
        var rtnData = [];
        var limit = ['system'];

        return Q.Promise(function (resolve, reject) {

            blockData.map(function (item) {
                if (inArray(item.id, limit, 0) > -1) {
                    rtnData.push(item);
                }
            });

            resolve(rtnData);
        });
    },

    /*
     获取首页信息
     */
    getIndexData: function getIndexData() {
        var rtnData = [];
        var limit = ['aboutme', 'gangwei', 'zhize', 'z-workflow-code'];

        return Q.Promise(function (resolve, reject) {

            blockData.map(function (item) {
                if (inArray(item.id, limit, 0) > -1) {
                    rtnData.push(item);
                }
            });

            resolve(rtnData);
        });
    }
};

},{}],19:[function(require,module,exports){
"use strict";

var jingliData = [{
    title: "2012~2016",
    compony: "北京奇虎360科技有限公司（奇飞翔艺）",
    intro: ["2012年加盟360，前期独立负责还是保密项目的整个百科前端并身兼产品经理、后续主攻百科编辑器，部分功能被百度和互动百科抄袭借鉴。两周内上线移动版百科，协调处理各环节问题，年底获得优秀员工及股票奖励，随后从百科业务部门并入360最大的前端技术团队-WEB平台部/奇舞团。", "2014年派驻安全卫士部门负责360安全卫士VIP会员中心，创造本地debug开发模式，彻底脱离研发环境对客户端的依赖，增加线上一键开启debug，快速定位问题，大大提高客户端内嵌WEB的研发效率。同时协调支持微密（内嵌web）、悄悄(内嵌web)、手机卫士(活动)、流量卫士（官网）、免费wifi（官网）、点睛平台（官网）、体验中心（官网）等项目。", "2015年初调入老周带领的智能硬件部门，前期独立负责360第一个直播项目小水滴直播网站的搭建研发、app内嵌H5、商城官网的各种合作发售活动前端技术支持。后续协助开发3663Mi玩、悟空TV、游戏内嵌秀场以及花椒直播、熊猫TV、等直播项目。"],
    grade: ["主要业绩：", "360搜索百科整个前端规划、构建(燕尾服)、百科编辑器(ueditor内核)。主导后端部分PHP模块构建(相关词条、词条引用模块)、内容获取(phpQuery)、编辑器及内容处理(htmlPurifier)，分类系统、自媒体系统等", "安全卫士会员中心、360VIP会员积分商城(Window8优惠码、网易明信片、我买网世界杯、唯品会、随身wifi4G版、当当网电子书、防丢卫士(1/2/3/4期)、当当网服装、天猫电器城、网易花田币、天猫双十一、电脑专家超级预约、有道双重礼包、当当网双十二活动、360安全路由等众多特权项目)。", "微密内嵌页、悄悄内嵌页、手机卫士活动、流量卫士官网、免费wifi官网、点睛平台前端、体验中心全站。", "智能摄像机项目的商城官网、小水滴直播全站（多终端web）、APP内嵌H5、花椒直播播放器/聊天长连、3663Mi玩全站构建/送礼系统、等项目的PC及H5网站架构、项目协调和研发。"]
}, {
    title: "2007~2012",
    compony: "北京艾科网信有限公司（同方电子旗下）",
    intro: ["2007年就职于同方电子旗下拥有军工安全资质的网络软件公司，前期设计、前端、服务端(PHP)一人全包。", "后续带领设计师、前端、PHP，与后端（C语言）技术经理协调其他C语言和客户端工程师，协助CTO实现并完善最终WEB展现和交互功能。参与后续产品测试、发版、接收改进用户方反馈，使用有限的资源开发维护7个产品线。", "业余对网站建设及运营有很高的兴致，曾独立建造运营数个网站，并将开源系统成熟的内部功能模块二次开发低成本应用于工作项目中。"],
    grade: ["主要业绩：", "实名准入控制，终端健康检查，实名制IP地址管理，来宾访客网，非法外联及网络威胁定位，网络访问控制，高性能日志存储和审计。"]
}, {
    title: "2004~2007",
    compony: "清华大学出版社（第六事业部）/ 创业",
    intro: ["2004年毕业进入北京清华大学出版社第六事业部做网站研发，需求、设计(PS)、Flash动画、前端(html/css/js)、服务端(ASP)、数据库(SQLServer)、测试、一人全包。", "主要业绩：清华出版社第六事业部官方网站，开发新书、畅销书、精品图书展示和在线订购，图书相关资料下载，和读者留言等功能模块"],
    grade: ["2005年辞掉工作接单做网站搞“创业”。", "独立开发：Kartell(意大利世界顶级家具品牌)北京官方网站，北京金港汽车公园超跑精英会官方网站，北京疯狂英语培训中心官方网站、在线报名系统、及全国授权点互动交流平台，唯泰古典家具网，爱美36计化妆品商城，Carbase汽车支援服务网及论坛，清流迅(streamocean)电视机顶盒视频系统，及其它大小企业网站30多个", "同时开发运营：开心英语学习网，知己网络技术信息网，论文搜索基地，非常Good精品网址导航，非常Good计算机教程网等基于开源系统的个人网站。"]
}];

module.exports = {
    /*
    获取标题列表
     */
    getListTitle: function getListTitle() {
        var titleList = [];
        return Q.Promise(function (resolve, reject) {
            jingliData.map(function (item) {
                titleList.push(item.title);
            });
            resolve(titleList);
        });
    },

    /*
    获取所有列表
     */
    getListAll: function getListAll() {
        return Q.Promise(function (resolve, reject) {
            jingliData.map(function (item) {
                item.type = item.title.split('~')[0];
            });

            resolve(jingliData);
        });
    }
};

},{}],20:[function(require,module,exports){
"use strict";

var workInfo = {
    data: [{
        id: "jiapc",
        type: "2012",
        name: "小水滴直播PC版",
        url: "http://jia.360.cn/pc",
        desc: "360第一个直播项目，前期独立开发负责全站功能模块构建，协调处理各环节流程（运营、PM、服务端接口制定、测试、反馈等）。使用技术：sewisePlayer、sockjs、Emoji、flexslider、jQuery-lazyload、jQuery-tmpl等组件",
        cover: './static/images/dynamic/jiapc/cover.png',
        list: [{
            url: './static/images/dynamic/jiapc/01.jpg',
            caption: '直播首页'
        }, {
            url: './static/images/dynamic/jiapc/02.png',
            caption: '直播频道'
        }, {
            url: './static/images/dynamic/jiapc/03.png',
            caption: '播放页'
        }, {
            url: './static/images/dynamic/jiapc/04.png',
            caption: '直播预告'
        }, {
            url: './static/images/dynamic/jiapc/05.png',
            caption: '个人摄像机网页版'
        }, {
            url: './static/images/dynamic/jiapc/t01.png',
            caption: '访问统计'
        }]
    }, {
        id: "jiamobile",
        type: "2012",
        name: "小水滴直播移动版",
        url: "http://jia.360.cn/mobile",
        desc: "使用技术：h5的video、Emoji、art-template、iscroll、webuploader、sockjs、zepto(后续改为jquery)",
        cover: "./static/images/dynamic/jiamobile/cover.jpg",
        list: [{
            url: './static/images/dynamic/jiamobile/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/jiamobile/02.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/jiamobile/03.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/jiamobile/04.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/jiamobile/t01.png',
            caption: '访问统计'
        }]
    }, {
        id: "baike360pc",
        type: "2012",
        name: "360百科PC版",
        url: "http://baike.so.com",
        desc: "前期独立负责全站前端规划、构建、百科编辑器。主导后端PHP部分模块构建(相关词条、词条引用模块)、内容获取(phpQuery)、内容处理(htmlPurifier)，分类系统、自媒体系统等。使用技术：ueditor、smarty、highslider、art-dialog、datepicker、jQuery-cookie、json2等组建",
        cover: './static/images/dynamic/baike360pc/cover.png',
        list: [{
            url: './static/images/dynamic/baike360pc/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360pc/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360pc/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360pc/04.png',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360pc/05.png',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360pc/06.png',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360pc/t01.png',
            caption: '访问统计'
        }]
    }, {
        id: "baike360mobile",
        type: "2012",
        name: "360百科移动版",
        url: "http://m.baike.so.com",
        desc: "前期独立开发，第一期：历时一周（前后端整体构建）；第二期：历时两周，大量优化、目录、lazyload、有无图模式、字体调整、日夜模式。第三期：反馈功能、功能引导提示、suggest、图册浏览等。使用zepto、iscroll等组件。",
        cover: './static/images/dynamic/baike360mobile/cover.jpg',
        list: [{
            url: './static/images/dynamic/baike360mobile/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360mobile/02.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360mobile/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360mobile/04.png',
            caption: ''
        }, {
            url: './static/images/dynamic/baike360mobile/05.png',
            caption: ''
        }]
    }, {
        id: "userCenter",
        type: "2012",
        name: "安全卫士会员中心",
        desc: "创造本地debug开发模式，彻底脱离研发环境对客户端的依赖，增加线上一键开启debug，快速定位问题，大大提高客户端内嵌WEB的研发效率。主要技术：Qwrap、Qwrap-promise、Qwrap-lazyload、Qwrap-hash-histroy、Qwrap-scroll-bar、Qwrap-dataModal等模块。",
        list: [{
            url: './static/images/dynamic/ucenter360/01.jpg',
            caption: '360会员中心首页'
        }, {
            url: './static/images/dynamic/ucenter360/02.jpg',
            caption: '360会员中心做任务'
        }, {
            url: './static/images/dynamic/ucenter360/03.jpg',
            caption: '360会员中心领特权'
        }]
    }, {
        id: "vip360",
        type: "2012",
        name: "360会员商城",
        url: "http://vip.360.cn/mall/",
        desc: "全站基于bootstrap二次开发。jQuery-tmpl、jQuery-cookie等组件",
        cover: './static/images/dynamic/vip360/cover.png',
        list: [{
            url: './static/images/dynamic/vip360/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/vip360/02.png',
            caption: ''
        }]
    }, {
        id: "miwan3663",
        type: "2012",
        name: "3663Mi玩美女直播",
        url: "http://www.3663.com",
        desc: "美女直播、送礼，基于gulp自动化工作流、browserify组织commonjs标准的nodejs代码在浏览器运行、分层规划模块式构建（服务层、模块层），Promise异步编程",
        cover: './static/images/dynamic/miwan3663/cover.png',
        list: [{
            url: './static/images/dynamic/miwan3663/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/miwan3663/02.png',
            caption: ''
        }]
    }, {
        id: "5kongtv",
        type: "2012",
        name: "悟空TV游戏直播",
        url: "http://www.5kong.tv",
        desc: "游戏直播、送礼。基于gulp自动化工作流、browserify组织commonjs标准的nodejs代码在浏览器运行、分层规划模块式构建（服务层、模块层），Promise异步编程",
        cover: './static/images/dynamic/5kongtv/cover.jpg',
        list: [{
            url: './static/images/dynamic/5kongtv/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/5kongtv/02.jpg',
            caption: ''
        }]
    }, {
        id: "idnac",
        type: "2007",
        name: "实名制ID网络管理系统",
        desc: "底层使用C语言与硬件交互、PHP作为中间层实现业务逻辑。前期独立负责设计、前端、PHP层的各模块构建。",
        cover: './static/images/dynamic/idnac/cover.png',
        list: [{
            url: './static/images/dynamic/idnac/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idnac/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idnac/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idnac/04.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idnac/05.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idnac/06.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idnac/07.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idnac/08.png',
            caption: ''
        }]
    }, {
        id: "idwall",
        type: "2007",
        name: "IDWall准入防火墙",
        desc: "基于IDNac裁剪开发，前期独立构建。IDWall是专为保护内网资源而设计的准入防火墙。它是世界上首款支持实名制ID网络技术的、具有准入控制功能的防火墙。有别于传统的防火墙，IDWall实现了安全域的管理，符合国家安全法规中要求的网络资源必须分区分域、严禁不同等级的安全域互通的规定。",
        cover: './static/images/dynamic/idwall/cover.png',
        list: [{
            url: './static/images/dynamic/idwall/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idwall/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idwall/03.png',
            caption: ''
        }]
    }, {
        id: "fuzaijunheng",
        type: "2007",
        name: "国家电网负载均衡系统",
        desc: "基于IDNac裁剪开发，前期独立构建。",
        cover: './static/images/dynamic/fuzaijunheng/cover.png',
        list: [{
            url: './static/images/dynamic/fuzaijunheng/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/fuzaijunheng/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/fuzaijunheng/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/fuzaijunheng/04.png',
            caption: ''
        }]
    }, {
        id: "feifawailian",
        type: "2007",
        name: "国家电网非法外联检测系统",
        desc: "基于IDNac裁剪开发，前期独立构建。",
        cover: './static/images/dynamic/feifawailian/cover.png',
        list: [{
            url: './static/images/dynamic/feifawailian/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/feifawailian/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/feifawailian/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/feifawailian/04.png',
            caption: ''
        }]
    }, {
        id: "kongzhiwangguan",
        type: "2007",
        name: "公安部控制网关",
        time: "2011年作品",
        desc: "基于IDNac裁剪开发，前期独立构建。为公安部门做的项目，结合IDNac实现下属岗亭接入终端的监控和管理",
        cover: './static/images/dynamic/kongzhiwangguan/cover.png',
        list: [{
            url: './static/images/dynamic/kongzhiwangguan/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kongzhiwangguan/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kongzhiwangguan/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kongzhiwangguan/04.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kongzhiwangguan/05.png',
            caption: ''
        }]
    }, {
        id: "idsensor",
        type: "2007",
        name: "ID网络管理系统远端代理",
        time: "2011年作品",
        desc: "IDSensor可以监视和控制远端分支机构的网络，配合IDNac，实现全网的管控，确保全网的网络边界的完整。解决由于网络分布地域广、不易监察、不易管理的问题，帮助网管人员实现远端全网掌控的难题。",
        cover: './static/images/dynamic/idsensor/cover.png',
        list: [{
            url: './static/images/dynamic/idsensor/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idsensor/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idsensor/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/idsensor/04.png',
            caption: ''
        }]
    }, {
        id: "ackproject",
        type: "2007",
        name: "ACK项目作品",
        desc: "几个重点实地部署的项目",
        cover: './static/images/dynamic/ackproject/cover.jpg',
        list: [{
            url: './static/images/dynamic/ackproject/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/ackproject/02.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/ackproject/03.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/ackproject/04.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/ackproject/05.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/ackproject/06.jpg',
            caption: ''
        }]
    }, {
        id: "ackbbs",
        type: "2007",
        name: "Ackworks产品技术交流论坛",
        desc: "基于开源系统PHPWind构建。为研发、销售、客户提供讨论现存问题，新的功能研发，讨论产品的发布未解决的BUG，销售中的问题建议",
        cover: './static/images/dynamic/ackbbs/cover.jpg',
        list: [{
            url: './static/images/dynamic/ackbbs/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/ackbbs/02.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/ackbbs/03.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/ackbbs/04.jpg',
            caption: ''
        }]
    }, {
        id: "qinghua",
        type: "2004",
        name: "清华大学出版社第六事业部",
        time: "2004-2005年作品",
        desc: "全栈独立开发。清华出版社第六事业部官方网站，新书、畅销书、精品图书展示和在线订购，图书相关资料下载，和读者留言等",
        cover: './static/images/dynamic/qinghua/cover.jpg',
        list: [{
            url: './static/images/dynamic/qinghua/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/qinghua/02.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/qinghua/03.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/qinghua/04.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/qinghua/05.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/qinghua/06.jpg',
            caption: ''
        }]
    }, {
        id: "kartell",
        type: "2004",
        name: "Kartell(意大利)家具贸易北京网站",
        time: "2006年作品",
        desc: "全栈独立开发。意大利世界顶级品牌家具北京官方网站、首页采用全Flash开发，产品展示和在线订购",
        list: [{
            url: './static/images/dynamic/kartell/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/04.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/05.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/06.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/07.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/08.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/09.png',
            caption: ''
        }, {
            url: './static/images/dynamic/kartell/10.png',
            caption: ''
        }]
    }, {
        id: "autoworks",
        type: "2004",
        name: "AutoWorks超跑精英会",
        time: "2005年作品",
        desc: "全栈独立开发。北京金港汽车公园超跑精英会官方网站，车辆改装、销售、礼品、赛事活动",
        list: [{
            url: './static/images/dynamic/autoworks/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/autoworks/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/autoworks/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/autoworks/04.png',
            caption: ''
        }, {
            url: './static/images/dynamic/autoworks/05.png',
            caption: ''
        }]
    }, {
        id: "crazyenglish",
        type: "2004",
        name: "北京疯狂英语项目",
        url: "http://www.bjcrazyenglish.com/",
        desc: "疯狂英语官方网站（基于科讯开源系统）、在线报名系统（全栈独立开发）、全国授权点互动交流平台（全栈独立开发）",
        cover: './static/images/dynamic/crazyenglish/cover.png',
        list: [{
            url: './static/images/dynamic/crazyenglish/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/04.png',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/05.png',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/06.png',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/07.png',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/08.png',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/09.png',
            caption: ''
        }, {
            url: './static/images/dynamic/crazyenglish/10.png',
            caption: ''
        }]
    }, {
        id: "weitai",
        type: "2004",
        name: "唯泰古典家居网",
        time: "2007年作品",
        desc: "基于ASP科讯系统二次开发，山西太原地方家具网站，实现古典家具展示、在线订购、会员互动等功能",
        cover: './static/images/dynamic/weitai/cover.png',
        list: [{
            url: './static/images/dynamic/weitai/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/weitai/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/weitai/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/weitai/04.png',
            caption: ''
        }, {
            url: './static/images/dynamic/weitai/05.png',
            caption: ''
        }, {
            url: './static/images/dynamic/weitai/06.png',
            caption: ''
        }, {
            url: './static/images/dynamic/weitai/07.png',
            caption: ''
        }, {
            url: './static/images/dynamic/weitai/08.png',
            caption: ''
        }]
    }, {
        id: "aimei36计",
        type: "2004",
        name: "爱美36化妆品在线商城",
        time: "2009年作品",
        desc: "基于PHP的shopex二次开发，完整的在线商城系统",
        cover: './static/images/dynamic/aimei36/cover.png',
        list: [{
            url: './static/images/dynamic/aimei36/01.png',
            caption: ''
        }, {
            url: './static/images/dynamic/aimei36/02.png',
            caption: ''
        }, {
            url: './static/images/dynamic/aimei36/03.png',
            caption: ''
        }, {
            url: './static/images/dynamic/aimei36/04.png',
            caption: ''
        }]
    }, {
        id: "zzulibj",
        type: "2004",
        name: "郑州轻工业学院北京校友会",
        desc: "为郑州轻工业学院毕业的、在北京工作的校友，提供在线沟通、交流的平台。基于康盛创想的 ucenter home 二次开发",
        list: [{
            url: './static/images/dynamic/zzulibj/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/zzulibj/02.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/zzulibj/03.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/zzulibj/04.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/zzulibj/05.jpg',
            caption: ''
        }]
    }, {
        id: "other",
        type: "2004",
        name: "其它作品部分信息",
        desc: "2005年起接单做网站、基于开源系统搭建个人网站、的部分作品(大小企业站30多个)",
        cover: "./static/images/dynamic/other/cover.png",
        list: [{
            url: './static/images/dynamic/other/01.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/02.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/03.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/04.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/05.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/06.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/07.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/08.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/09.jpg',
            caption: ''
        }, {
            url: './static/images/dynamic/other/10.png',
            caption: ''
        }]
    }]
};

var works = {
    /*
    获取作品列表并做一些格式加工
     */
    getList: function getList() {
        var listData = [];
        return Q.Promise(function (resolve, reject) {

            workInfo.data.map(function (item) {
                var itemData = {};
                itemData.id = item.id;
                itemData.name = item.name;
                itemData.url = item.url || "";
                itemData.tip = item.tip || "";
                itemData.desc = item.desc || "";
                itemData.cover = item.cover || (item.list ? item.list[0].url : "");

                listData.push(itemData);
            });
            resolve(listData);
        });
    },

    /*
    根据类型获取作品列表
     */
    getListByType: function getListByType(type) {
        var listData = [];
        return Q.Promise(function (resolve, reject) {

            workInfo.data.map(function (item) {
                if (type == item.type) {
                    var itemData = {};
                    itemData.id = item.id;
                    itemData.name = item.name;
                    itemData.url = item.url || "";
                    itemData.tip = item.tip || "";
                    itemData.desc = item.desc || "";
                    itemData.cover = item.cover || (item.list ? item.list[0].url : "");

                    listData.push(itemData);
                }
            });
            resolve(listData);
        });
    },

    /*
    根据id获取单个作品
     */
    getById: function getById(id) {
        var itemData = {};
        return Q.Promise(function (resolve, reject) {
            workInfo.data.map(function (item) {
                if (id == item.id) {
                    itemData = item;
                }
            });
            resolve(itemData);
        });
    }
};

module.exports = works;

},{}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = require('./handlebars/base');

var base = _interopRequireWildcard(_handlebarsBase);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _handlebarsSafeString = require('./handlebars/safe-string');

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = require('./handlebars/exception');

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars/base":22,"./handlebars/exception":25,"./handlebars/no-conflict":35,"./handlebars/runtime":36,"./handlebars/safe-string":37,"./handlebars/utils":38}],22:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _helpers = require('./helpers');

var _decorators = require('./decorators');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var VERSION = '4.0.5';
exports.VERSION = VERSION;
var COMPILER_REVISION = 7;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];


},{"./decorators":23,"./exception":25,"./helpers":26,"./logger":34,"./utils":38}],23:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = require('./decorators/inline');

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


},{"./decorators/inline":24}],24:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];


},{"../utils":38}],25:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  try {
    if (loc) {
      this.lineNumber = line;

      // Work around issue under safari where we can't directly set the column value
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(this, 'column', { value: column });
      } else {
        this.column = column;
      }
    }
  } catch (nop) {
    /* Ignore if the browser is very particular */
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];


},{}],26:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = require('./helpers/block-helper-missing');

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = require('./helpers/each');

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = require('./helpers/helper-missing');

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = require('./helpers/if');

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = require('./helpers/log');

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = require('./helpers/lookup');

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = require('./helpers/with');

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}


},{"./helpers/block-helper-missing":27,"./helpers/each":28,"./helpers/helper-missing":29,"./helpers/if":30,"./helpers/log":31,"./helpers/lookup":32,"./helpers/with":33}],27:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];


},{"../utils":38}],28:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];


},{"../exception":25,"../utils":38}],29:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];


},{"../exception":25}],30:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });
};

module.exports = exports['default'];


},{"../utils":38}],31:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];


},{}],32:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
};

module.exports = exports['default'];


},{}],33:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];


},{"../utils":38}],34:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('./utils');

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      if (!console[method]) {
        // eslint-disable-line no-console
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];


},{"./utils":38}],35:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],36:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _base = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }
    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = container.merge(options.decorators, env.decorators);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context != depths[0]) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      var data = options.data;
      while (data['partial-block'] === noop) {
        data = data._parent;
      }
      partial = data['partial-block'];
      data['partial-block'] = noop;
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    options.data = _base.createFrame(options.data);
    partialBlock = options.data['partial-block'] = options.fn;

    if (partialBlock.partials) {
      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
    }
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}


},{"./base":22,"./exception":25,"./utils":38}],37:[function(require,module,exports){
// Build out our basic SafeString type
'use strict';

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];


},{}],38:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}


},{}],39:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":21}],40:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":39}]},{},[1])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmlld3MvaW5kZXgvaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9hYm91dC1zeXN0ZW0vaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9iYXNpYy9pbmRleC5qcyIsInNyYy92aWV3cy9pbmRleC9tb2R1bGVzL2V4cGVyaWVuY2Utd29ya3MvaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9leHBlcmllbmNlL2luZGV4LmpzIiwic3JjL3ZpZXdzL2luZGV4L21vZHVsZXMvZXhwZXJpZW5jZS90YWItY29udGVudC5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9leHBlcmllbmNlL3RhYi1uYXYuaGJzIiwic3JjL3ZpZXdzL2luZGV4L21vZHVsZXMvZmF2aWNvbi9mYXZpY29uLmhicyIsInNyYy92aWV3cy9pbmRleC9tb2R1bGVzL2Zhdmljb24vaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9uYXYvYXBwLW5hdi5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9uYXYvaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9wdWJsaWMvYmxvY2stY29udGVudC5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9wdWJsaWMvYmxvY2stbGlzdC5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9wdWJsaWMvd29ya3MtbGlzdC5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy93b3Jrcy9pbmRleC5qcyIsInNyYy92aWV3cy9pbmRleC9zZXJ2aWNlL2JhaWtlLXN1bW1hcnkuanMiLCJzcmMvdmlld3MvaW5kZXgvc2VydmljZS9iYXNpYy5qcyIsInNyYy92aWV3cy9pbmRleC9zZXJ2aWNlL2Jsb2NrLmpzIiwic3JjL3ZpZXdzL2luZGV4L3NlcnZpY2UvZXhwZXJpZW5jZS5qcyIsInNyYy92aWV3cy9pbmRleC9zZXJ2aWNlL3dvcmtzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2Jhc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9kZWNvcmF0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvZGVjb3JhdG9ycy9pbmxpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy9ibG9jay1oZWxwZXItbWlzc2luZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvZWFjaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2lmLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy9sb2cuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2xvb2t1cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvd2l0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2xvZ2dlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvdXRpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksWUFBWSxRQUFRLGVBQVIsQ0FBaEI7O0FBRUEsSUFBSSxtQkFBbUIsUUFBUSxzQkFBUixDQUF2Qjs7QUFFQSxJQUFJLGNBQWMsUUFBUSxpQkFBUixDQUFsQjs7QUFFQSxJQUFJLGVBQWUsUUFBUSx3QkFBUixDQUFuQjs7QUFFQSxJQUFJLGtCQUFrQixRQUFRLGlCQUFSLENBQXRCOztBQUVBLElBQUksZ0JBQWdCLFFBQVEsbUJBQVIsQ0FBcEI7O0FBRUE7OztBQUdBLGNBQWMsTUFBZCxDQUFxQixHQUFHLGtCQUFILENBQXJCO0FBQ0EsTUFBTSxVQUFOLENBQWlCLE1BQWpCLEVBQXlCLFVBQVMsSUFBVCxFQUFlO0FBQ3BDLGdCQUFjLE1BQWQsQ0FBcUIsR0FBRyxrQkFBSCxDQUFyQjtBQUNILENBRkQ7O0FBSUE7OztBQUdBLFVBQVUsTUFBVjs7QUFFQTs7O0FBR0EsZ0JBQWdCLE1BQWhCOztBQUVBOzs7QUFHQSxpQkFBaUIsTUFBakI7O0FBRUE7OztBQUdBLFlBQVksTUFBWjs7QUFFQTs7O0FBR0EsYUFBYSxNQUFiOzs7OztBQzNDQSxJQUFJLG1CQUFtQixRQUFRLDZCQUFSLENBQXZCOztBQUVBLElBQUksWUFBWSxRQUFRLHFCQUFSLENBQWhCOztBQUVBLE9BQU8sT0FBUCxHQUFpQjtBQUNi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QUU7QUFDdkMsUUFBTSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7QUFDbEIsU0FBTyxNQUFNLENBQUM7Q0FDZjs7QUFFTSxTQUFTLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUU7QUFDakQsU0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQSxHQUFJLEVBQUUsQ0FBQztDQUNwRDs7OztBQzNHRDtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbW9kdWxlTmF2ID0gcmVxdWlyZSgnLi9tb2R1bGVzL25hdicpO1xuXG52YXIgbW9kdWxlRXhwZXJpZW5jZSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9leHBlcmllbmNlJyk7XG5cbnZhciBtb2R1bGVXb3JrcyA9IHJlcXVpcmUoJy4vbW9kdWxlcy93b3JrcycpO1xuXG52YXIgbW9kdWxlU3lzdGVtID0gcmVxdWlyZSgnLi9tb2R1bGVzL2Fib3V0LXN5c3RlbScpO1xuXG52YXIgbW9kdWxlUGFnZUJhc2ljID0gcmVxdWlyZSgnLi9tb2R1bGVzL2Jhc2ljJyk7XG5cbnZhciBtb2R1bGVGYXZpY29uID0gcmVxdWlyZSgnLi9tb2R1bGVzL2Zhdmljb24nKTtcblxuLypcbummlumhteWktOWDj1xuICovXG5tb2R1bGVGYXZpY29uLnJlbmRlcigkJChcIiNqcy1wYWdlLWNvbnRlbnRcIikpO1xubXlBcHAub25QYWdlSW5pdCgnaG9tZScsIGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICBtb2R1bGVGYXZpY29uLnJlbmRlcigkJChcIiNqcy1wYWdlLWNvbnRlbnRcIikpO1xufSk7XG5cbi8qXG7lr7zoiKpcbiAqL1xubW9kdWxlTmF2LnJlbmRlcigpO1xuXG4vKlxu5Z+65pys5L+h5oGvXG4gKi9cbm1vZHVsZVBhZ2VCYXNpYy5yZW5kZXIoKTtcblxuLypcbuacrOS6uue7j+WOhlxuICovXG5tb2R1bGVFeHBlcmllbmNlLnJlbmRlcigpO1xuXG4vKlxu5L2c5ZOB5L+h5oGvXG4gKi9cbm1vZHVsZVdvcmtzLnJlbmRlcigpO1xuXG4vKlxu5YWz5LqO5pys57O757ufXG4gKi9cbm1vZHVsZVN5c3RlbS5yZW5kZXIoKTtcbiIsInZhciBibG9ja0NvbnRlbnRUZW1wID0gcmVxdWlyZSgnLi4vcHVibGljL2Jsb2NrLWNvbnRlbnQuaGJzJyk7XG5cbnZhciBibG9ja0RhdGEgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlL2Jsb2NrJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBibG9ja0RhdGEuZ2V0QWJvdXRTeXN0ZW0oKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAkJChcIiNqcy1wYW5lbC1sZWZ0XCIpLmFwcGVuZChibG9ja0NvbnRlbnRUZW1wKGRhdGEpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBibG9ja0RhdGEuZ2V0SW5kZXhEYXRhKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCQoXCIjanMtcGFnZS1jb250ZW50XCIpLmFwcGVuZChibG9ja0NvbnRlbnRUZW1wKGRhdGEpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBteUFwcC5vblBhZ2VJbml0KCdob21lJywgZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICAgICAgICAgIGJsb2NrRGF0YS5nZXRJbmRleERhdGEoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgJCQoXCIjanMtcGFnZS1jb250ZW50XCIpLmFwcGVuZChibG9ja0NvbnRlbnRUZW1wKGRhdGEpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJ2YXIgYmFzaWMgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlL2Jhc2ljJyk7XG5cbnZhciBiYXNpY1RlbXAgPSByZXF1aXJlKCcuLi9wdWJsaWMvYmxvY2stbGlzdC5oYnMnKTtcblxudmFyIG1vZHVsZUZhdmljb24gPSByZXF1aXJlKCcuLi9mYXZpY29uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBteUFwcC5vblBhZ2VJbml0KCdiYXNpYycsIGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBiYXNpYy5nZXRMaXN0QWxsKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICQkKCcjanMtYmFzaWMtYm94JykuYXBwZW5kKGJhc2ljVGVtcChkYXRhKSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIOWfuuacrOi1hOaWmeWktOWDj1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIG1vZHVsZUZhdmljb24ucmVuZGVyKCQkKCcjanMtYmFzaWMtYm94JykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsInZhciB3b3JrU2VydmljZSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2Uvd29ya3MnKTtcblxudmFyIHdvcmtzTGlzdFRlbXAgPSByZXF1aXJlKCcuLi9wdWJsaWMvd29ya3MtbGlzdC5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICAgICAgLyrnu4/ljobnm7jlhbPkvZzlk4EqL1xuICAgICAgICAgICAgbXlBcHAub25QYWdlSW5pdCgnZXhwZXJpZW5jZS13b3JrJywgZnVuY3Rpb24ocGFnZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHR5cGVWYWwgPSBwYWdlLnF1ZXJ5LnR5cGU7XG5cbiAgICAgICAgICAgICAgICB3b3JrU2VydmljZS5nZXRMaXN0QnlUeXBlKHR5cGVWYWwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29ya1BvcHVwVGl0bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIjIwMTJcIjogXCIyMDEy5bm0fuiHs+S7iiDnmoTkvZzlk4FcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiMjAwN1wiOiBcIjIwMDflubR+MjAxMuW5tCDnmoTkvZzlk4FcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiMjAwNFwiOiBcIjIwMDTlubR+MjAwN+W5tCDnmoTkvZzlk4FcIlxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAkJChcIi5qaW5nbGktd29ya3MtdGl0bGVcIikuaHRtbCh3b3JrUG9wdXBUaXRsZVt0eXBlVmFsXSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAkJChcIi53b3Jrcy1saXN0LWJveFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmh0bWwod29ya3NMaXN0VGVtcChkYXRhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuanMtY2FyZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3N3aXBlci1zbGlkZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZChcIi5zd2lwZXItbGF6eVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnPGRpdiBjbGFzcz1cInByZWxvYWRlclwiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICAgICAgICAgIG15QXBwLmluaXRJbWFnZXNMYXp5TG9hZCgnLnBhZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICBteUFwcC5zd2lwZXIoJy5zd2lwZXItY29udGFpbmVyJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlbG9hZEltYWdlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXp5TG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb246ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWZmZWN0OiAnY292ZXJmbG93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcmVkU2xpZGVzOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgJCQoJy5zaG93LXBob3RvJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJCR0aGlzID0gJCQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtTZXJ2aWNlLmdldEJ5SWQoJCR0aGlzLmF0dHIoXCJkYXRhLWlkXCIpKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBteUFwcC5waG90b0Jyb3dzZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG90b3M6IGRhdGEubGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiAnZGFyaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tMaW5rVGV4dDogJ+i/lOWbnidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwidmFyIG1vZHVsZUV4cGVyaWVuY2VXb3JrcyA9IHJlcXVpcmUoJy4uL2V4cGVyaWVuY2Utd29ya3MnKTtcblxudmFyIGJhaWtlU3VtbWFyeURhdGEgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlL2JhaWtlLXN1bW1hcnknKTtcblxudmFyIHRhYk5hdlRlbXAgPSByZXF1aXJlKFwiLi90YWItbmF2Lmhic1wiKTtcbnZhciB0YWJDb250ZW50VGVtcCA9IHJlcXVpcmUoXCIuL3RhYi1jb250ZW50Lmhic1wiKTtcblxudmFyIGV4cGVyaWVuY2VEYXRhID0gcmVxdWlyZShcIi4uLy4uL3NlcnZpY2UvZXhwZXJpZW5jZVwiKTtcblxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKFwiaGJzZnkvcnVudGltZVwiKTtcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcihcImFkZE9uZVwiLCBmdW5jdGlvbihpbmRleCkge1xuXG4gICAgcmV0dXJuIGluZGV4ICsgMTtcbn0pO1xuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKFwiYWRkQWN0aXZlXCIsIGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICBpZiAoaW5kZXggPT0gMCkge1xuICAgICAgICByZXR1cm4gXCJhY3RpdmVcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG59KTtcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcihcImFkZE90aGVySHJlZlwiLCBmdW5jdGlvbih0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJzIwMTInKSB7XG4gICAgICAgIHJldHVybiAnPHA+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ1dHRvbiBiYWlrZS1zdW1tYXJ5XCI+55m+56eR5bm05bqm5bel5L2c5oC757uTPC9hPjwvcD4nO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAgICAgICAvKueZvuenkeW5tOW6puaAu+e7kyovXG4gICAgICAgICAgICBteUFwcC5vblBhZ2VJbml0KCdleHBlcmllbmNlJywgZnVuY3Rpb24ocGFnZSkge1xuXG4gICAgICAgICAgICAgICAgZXhwZXJpZW5jZURhdGEuZ2V0TGlzdFRpdGxlKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICQkKFwiI2pzLXRhYi1uYXZcIikuaHRtbCh0YWJOYXZUZW1wKGRhdGEpKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGV4cGVyaWVuY2VEYXRhLmdldExpc3RBbGwoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgJCQoXCIjanMtdGFiLWNvbnRlbnRcIikuaHRtbCh0YWJDb250ZW50VGVtcChkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIG15QXBwLmluaXRQYWdlU3dpcGVyKCcucGFnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICQkKCcuYmFpa2Utc3VtbWFyeScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXlBcHAucGhvdG9Ccm93c2VyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG90b3M6IGJhaWtlU3VtbWFyeURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6ICdkYXJrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrTGlua1RleHQ6ICfov5Tlm54nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5vcGVuKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgbW9kdWxlRXhwZXJpZW5jZVdvcmtzLnJlbmRlcigpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcblxuXG4gICAgfVxufTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzQ29tcGlsZXIgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnNDb21waWxlci50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBoZWxwZXIsIGFsaWFzMT1kZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IHt9LCBhbGlhczI9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczM9Y29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24sIGFsaWFzND1cImZ1bmN0aW9uXCI7XG5cbiAgcmV0dXJuIFwiPGRpdiBpZD1cXFwidGFiXCJcbiAgICArIGFsaWFzMygoaGVscGVycy5hZGRPbmUgfHwgKGRlcHRoMCAmJiBkZXB0aDAuYWRkT25lKSB8fCBhbGlhczIpLmNhbGwoYWxpYXMxLChkYXRhICYmIGRhdGEuaW5kZXgpLHtcIm5hbWVcIjpcImFkZE9uZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwicGFnZS1jb250ZW50IHRhYiBcIlxuICAgICsgYWxpYXMzKChoZWxwZXJzLmFkZEFjdGl2ZSB8fCAoZGVwdGgwICYmIGRlcHRoMC5hZGRBY3RpdmUpIHx8IGFsaWFzMikuY2FsbChhbGlhczEsKGRhdGEgJiYgZGF0YS5pbmRleCkse1wibmFtZVwiOlwiYWRkQWN0aXZlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pKVxuICAgICsgXCJcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50LWJsb2NrXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbnRlbnQtYmxvY2stdGl0bGVcXFwiPlwiXG4gICAgKyBhbGlhczMoY29udGFpbmVyLmxhbWJkYSgoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY29tcG9ueSA6IGRlcHRoMCksIGRlcHRoMCkpXG4gICAgKyBcIjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2FyZFxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2FyZC1jb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2FyZC1jb250ZW50LWlubmVyXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChhbGlhczEsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmludHJvIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDIsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2FyZFxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2FyZC1jb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2FyZC1jb250ZW50LWlubmVyXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChhbGlhczEsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmdyYWRlIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDQsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiBcIlxuICAgICsgKChzdGFjazEgPSAoaGVscGVycy5hZGRPdGhlckhyZWYgfHwgKGRlcHRoMCAmJiBkZXB0aDAuYWRkT3RoZXJIcmVmKSB8fCBhbGlhczIpLmNhbGwoYWxpYXMxLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50eXBlIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJhZGRPdGhlckhyZWZcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDxwPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIi4vaW5kZXgvZXhwZXJpZW5jZS13b3Jrcy5odG1sP3R5cGU9XCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnR5cGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnR5cGUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXM0ID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcInR5cGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIiBkYXRhLXR5cGU9XFxcIlwiXG4gICAgKyBhbGlhczMoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50eXBlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50eXBlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMiksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzNCA/IGhlbHBlci5jYWxsKGFsaWFzMSx7XCJuYW1lXCI6XCJ0eXBlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+55u45YWz5L2c5ZOBPC9hPlxcbiAgICAgICAgPC9wPlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbn0sXCIyXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICByZXR1cm4gXCIgICAgICAgICAgICAgICAgICAgIDxwPlwiXG4gICAgKyBjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbihjb250YWluZXIubGFtYmRhKGRlcHRoMCwgZGVwdGgwKSlcbiAgICArIFwiPC9wPlxcblwiO1xufSxcIjRcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgPHA+XCJcbiAgICArIGNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uKGNvbnRhaW5lci5sYW1iZGEoZGVwdGgwLCBkZXB0aDApKVxuICAgICsgXCI8L3A+XFxuICAgICAgICAgICAgICAgICAgICBcIjtcbn0sXCJjb21waWxlclwiOls3LFwiPj0gNC4wLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxO1xuXG4gIHJldHVybiAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDoge30sZGVwdGgwLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIik7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzQ29tcGlsZXIgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnNDb21waWxlci50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDoge30sIGFsaWFzMj1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMz1jb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbjtcblxuICByZXR1cm4gXCI8YSBocmVmPVxcXCIjdGFiXCJcbiAgICArIGFsaWFzMygoaGVscGVycy5hZGRPbmUgfHwgKGRlcHRoMCAmJiBkZXB0aDAuYWRkT25lKSB8fCBhbGlhczIpLmNhbGwoYWxpYXMxLChkYXRhICYmIGRhdGEuaW5kZXgpLHtcIm5hbWVcIjpcImFkZE9uZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHRhYi1saW5rIFwiXG4gICAgKyBhbGlhczMoKGhlbHBlcnMuYWRkQWN0aXZlIHx8IChkZXB0aDAgJiYgZGVwdGgwLmFkZEFjdGl2ZSkgfHwgYWxpYXMyKS5jYWxsKGFsaWFzMSwoZGF0YSAmJiBkYXRhLmluZGV4KSx7XCJuYW1lXCI6XCJhZGRBY3RpdmVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkpXG4gICAgKyBcIlxcXCI+XCJcbiAgICArIGFsaWFzMyhjb250YWluZXIubGFtYmRhKGRlcHRoMCwgZGVwdGgwKSlcbiAgICArIFwiPC9hPiBcIjtcbn0sXCJjb21waWxlclwiOls3LFwiPj0gNC4wLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxO1xuXG4gIHJldHVybiAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDoge30sZGVwdGgwLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiXFxuXCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzQ29tcGlsZXIgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnNDb21waWxlci50ZW1wbGF0ZSh7XCJjb21waWxlclwiOls3LFwiPj0gNC4wLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyLCBhbGlhczE9ZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSwgYWxpYXMyPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYWxpYXMzPVwiZnVuY3Rpb25cIiwgYWxpYXM0PWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIHJldHVybiBcIjwhLS0g5aS05YOPIC0tPlxcbjxkaXYgY2xhc3M9XFxcImNhcmQga3MtY2FyZC1oZWFkZXItcGljXFxcIj5cXG4gICAgPGRpdiB2YWxpZ249XFxcImJvdHRvbVxcXCIgc3R5bGU9XFxcIlxcXCIgY2xhc3M9XFxcImFib3V0bWUtcGljIGNhcmQtaW1hZ2UgY29sb3Itd2hpdGUgbm8tYm9yZGVyIGxhenkgbGF6eS1mYWRlaW5cXFwiPlwiXG4gICAgKyBhbGlhczQoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50aXRsZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGl0bGUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWNvbnRlbnRcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2FyZC1jb250ZW50LWlubmVyXFxcIj5cXG4gICAgICAgICAgICA8cD5cIlxuICAgICsgYWxpYXM0KCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZGVzYyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZGVzYyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczIpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczMgPyBoZWxwZXIuY2FsbChhbGlhczEse1wibmFtZVwiOlwiZGVzY1wiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L3A+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuPCEtLSAv5aS05YOPIC0tPlxcblwiO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4iLCJ2YXIgYmFzaWMgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlL2Jhc2ljJyk7XG5cbnZhciBmYXZpY29uVGVtcCA9IHJlcXVpcmUoJy4vZmF2aWNvbi5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVuZGVyOiBmdW5jdGlvbigkJGJveCkge1xuXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGJhc2ljLmdldEZhdmljb25EYXRhKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCRib3gucHJlcGVuZChmYXZpY29uVGVtcChkYXRhKSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzcsXCI+PSA0LjAuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHJldHVybiBcIjxsaT5cXG4gICAgPGEgaHJlZj1cXFwiLi9pbmRleC9qaWJlbnppbGlhby5odG1sXFxcIiBjbGFzcz1cXFwiaXRlbS1saW5rIGl0ZW0tY29udGVudCBjbG9zZS1wYW5lbFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtLW1lZGlhXFxcIj48aSBjbGFzcz1cXFwiZmEgZmEtbmV3c3BhcGVyLW9cXFwiPjwvaT48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0taW5uZXJcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0tdGl0bGVcXFwiPuWfuuacrOi1hOaWmTwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvYT5cXG48L2xpPlxcbjxsaT5cXG4gICAgPGEgaHJlZj1cXFwiLi9pbmRleC9leHBlcmllbmNlLmh0bWxcXFwiIGNsYXNzPVxcXCJpdGVtLWxpbmsgaXRlbS1jb250ZW50IGNsb3NlLXBhbmVsXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0tbWVkaWFcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1wYXBlci1wbGFuZVxcXCI+PC9pPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1pbm5lclxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS10aXRsZVxcXCI+5pys5Lq657uP5Y6GPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9hPlxcbjwvbGk+XFxuPGxpPlxcbiAgICA8YSBocmVmPVxcXCIuL2luZGV4L3dvcmtzLmh0bWxcXFwiIGNsYXNzPVxcXCJpdGVtLWxpbmsgaXRlbS1jb250ZW50IGNsb3NlLXBhbmVsXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0tbWVkaWFcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1jdWJlc1xcXCI+PC9pPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1pbm5lclxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS10aXRsZVxcXCI+5L2c5ZOB5L+h5oGvPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9hPlxcbjwvbGk+XFxuXCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcbiIsInZhciBhcHBOYXZUZW1wID0gcmVxdWlyZSgnLi9hcHAtbmF2LmhicycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgLyrliqDovb3lr7zoiKrmqKHmnb8qL1xuICAgICAgICAgICAgJCQoXCIuYXBwLW5hdlwiKS5hcHBlbmQoYXBwTmF2VGVtcCgpKTtcbiAgICAgICAgICAgIG15QXBwLm9uUGFnZUluaXQoJ2hvbWUnLCBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgICAgICAgICAgJCQoXCIuaW5kZXgtYXBwLW5hdlwiKS5hcHBlbmQoYXBwTmF2VGVtcCgpKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFyc0NvbXBpbGVyID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzQ29tcGlsZXIudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJjb250ZW50LWJsb2NrLXRpdGxlXFxcIj5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGl0bGUgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCI8L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJjb250ZW50LWJsb2NrXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiY29udGVudC1ibG9jay1pbm5lclxcXCI+XFxuXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY29udGVudCA6IGRlcHRoMCkse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgyLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG59LFwiMlwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gXCIgICAgICAgIDxwPlwiXG4gICAgKyAoKHN0YWNrMSA9IGNvbnRhaW5lci5sYW1iZGEoZGVwdGgwLCBkZXB0aDApKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiPC9wPlxcblwiO1xufSxcImNvbXBpbGVyXCI6WzcsXCI+PSA0LjAuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazE7XG5cbiAgcmV0dXJuICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSxkZXB0aDAse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazE7XG5cbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwiY29udGVudC1ibG9jay10aXRsZVxcXCI+XCJcbiAgICArIGNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uKGNvbnRhaW5lci5sYW1iZGEoKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibGlzdC1ibG9ja1xcXCI+XFxuICAgIDx1bD5cXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IHt9LChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5jb250ZW50IDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDIsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICA8L3VsPlxcbjwvZGl2PlxcblwiO1xufSxcIjJcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBhbGlhczE9Y29udGFpbmVyLmxhbWJkYSwgYWxpYXMyPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIHJldHVybiBcIiAgICAgICAgPGxpPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0tY29udGVudFxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0taW5uZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS10aXRsZVxcXCI+XCJcbiAgICArIGFsaWFzMihhbGlhczEoKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnN1YnRpdGxlIDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtLWFmdGVyXFxcIj5cIlxuICAgICsgYWxpYXMyKGFsaWFzMSgoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc3ViY29udGVudCA6IGRlcHRoMCksIGRlcHRoMCkpXG4gICAgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvbGk+XFxuXCI7XG59LFwiY29tcGlsZXJcIjpbNyxcIj49IDQuMC4wXCJdLFwibWFpblwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IHt9LGRlcHRoMCx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDEsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFyc0NvbXBpbGVyID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzQ29tcGlsZXIudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMSwgaGVscGVyLCBhbGlhczE9ZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSwgYWxpYXMyPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYWxpYXMzPVwiZnVuY3Rpb25cIiwgYWxpYXM0PWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcImpzLWNhcmQgY2FyZCBrcy1jYXJkLWhlYWRlci1waWNcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWhlYWRlclxcXCI+XCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcIm5hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9kaXY+XFxuICAgIDxkaXYgZGF0YS1iYWNrZ3JvdW5kPVxcXCJcIlxuICAgICsgYWxpYXM0KCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuY292ZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmNvdmVyIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMiksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMyA/IGhlbHBlci5jYWxsKGFsaWFzMSx7XCJuYW1lXCI6XCJjb3ZlclwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIHZhbGlnbj1cXFwiYm90dG9tXFxcIiBjbGFzcz1cXFwibGF6eSBsYXp5LWZhZGVpbiBzd2lwZXItbGF6eSBzaG93LXBob3RvIGNhcmQtaW1hZ2UgY29sb3Itd2hpdGUgbm8tYm9yZGVyXFxcIiBkYXRhLWlkPVxcXCJcIlxuICAgICsgYWxpYXM0KCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuaWQgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmlkIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMiksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMyA/IGhlbHBlci5jYWxsKGFsaWFzMSx7XCJuYW1lXCI6XCJpZFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPjwvZGl2PlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnNbXCJpZlwiXS5jYWxsKGFsaWFzMSwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZGVzYyA6IGRlcHRoMCkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMiwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgIDxkaXYgY2xhc3M9XFxcImNhcmQtZm9vdGVyXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJsaW5rIHNob3ctcGhvdG9cXFwiIGRhdGEtaWQ9XFxcIlwiXG4gICAgKyBhbGlhczQoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5pZCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuaWQgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImlkXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+PGkgY2xhc3M9XFxcImZhIGZhLXBob3RvXFxcIj48L2k+IOabtOWkmuWbvueJhzwvYT4gXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVyc1tcImlmXCJdLmNhbGwoYWxpYXMxLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC51cmwgOiBkZXB0aDApLHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDQsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbn0sXCIyXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gIHJldHVybiBcIiAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWNvbnRlbnRcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2FyZC1jb250ZW50LWlubmVyXFxcIj5cXG4gICAgICAgICAgICA8cD5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5kZXNjIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlcnMuaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDoge30se1wibmFtZVwiOlwiZGVzY1wiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L3A+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuXCI7XG59LFwiNFwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGhlbHBlcjtcblxuICByZXR1cm4gXCJcXG4gICAgICAgIDxhIGhyZWY9XFxcIlwiXG4gICAgKyBjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnVybCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudXJsIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlcnMuaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IFwiZnVuY3Rpb25cIiA/IGhlbHBlci5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDoge30se1wibmFtZVwiOlwidXJsXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgY2xhc3M9XFxcImV4dGVybmFsIGxpbmtcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj48aSBjbGFzcz1cXFwiZmEgZmEtbGlua1xcXCI+PC9pPiDkvZzlk4Hpk77mjqU8L2E+IFwiO1xufSxcImNvbXBpbGVyXCI6WzcsXCI+PSA0LjAuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazE7XG5cbiAgcmV0dXJuICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSxkZXB0aDAse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwidmFyIHdvcmtTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZS93b3JrcycpO1xuXG52YXIgd29ya3NMaXN0VGVtcCA9IHJlcXVpcmUoJy4uL3B1YmxpYy93b3Jrcy1saXN0LmhicycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgLyrkvZzlk4HpobXpnaIqL1xuICAgICAgICAgICAgbXlBcHAub25QYWdlSW5pdCgnd29ya3MnLCBmdW5jdGlvbihwYWdlKSB7XG5cbiAgICAgICAgICAgICAgICB3b3JrU2VydmljZS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICQkKFwiI2pzLXdvcmtzLWxpc3RcIikuaHRtbCh3b3Jrc0xpc3RUZW1wKGRhdGEpKTtcblxuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICDliJ3lp4vljJblm77niYfotZbliqDovb1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIG15QXBwLmluaXRJbWFnZXNMYXp5TG9hZCgnLnBhZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICDlm77lhozmtY/op4hcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICQkKCcuc2hvdy1waG90bycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICQkdGhpcyA9ICQkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrU2VydmljZS5nZXRCeUlkKCQkdGhpcy5hdHRyKFwiZGF0YS1pZFwiKSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXlBcHAucGhvdG9Ccm93c2VyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvdG9zOiBkYXRhLmxpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhenlMb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVtZTogJ2RhcmsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrTGlua1RleHQ6ICfov5Tlm54nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsInZhciBiYWlrZVN1bW1hcnkgPSBbe1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8wMS5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzAyLnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMDMucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8wNC5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzA1LnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMDYucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8wNy5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzA4LnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMDkucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8xMC5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzExLnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMTIucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8xMy5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzE0LnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMTUucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8xNi5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzE3LnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMTgucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8xOS5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzIwLnBuZycsXG4gICAgY2FwdGlvbjogJydcbn1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhaWtlU3VtbWFyeTtcbiIsInZhciBiYXNpY0RhdGEgPSBbe1xuICAgIHRpdGxlOiAn5Z+65pys5L+h5oGvJyxcbiAgICBjb250ZW50OiBbe1xuICAgICAgICBzdWJ0aXRsZTogJ+Wnk+WQjScsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICfotbXkvJrop4EoRnVyaWMpJ1xuICAgIH0sIHtcbiAgICAgICAgc3VidGl0bGU6ICfmgKfliKsnLFxuICAgICAgICBzdWJjb250ZW50OiAn55S3J1xuICAgIH0sIHtcbiAgICAgICAgc3VidGl0bGU6ICflh7rnlJ/lubTmnIgnLFxuICAgICAgICBzdWJjb250ZW50OiAnMTk4MuW5tDTmnIgnXG4gICAgfSwge1xuICAgICAgICBzdWJ0aXRsZTogJ+awkeaXjycsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICfmsYnml48nXG4gICAgfSwge1xuICAgICAgICBzdWJ0aXRsZTogJ+WpmuWnu+eKtuWGtScsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICflt7LlqZonXG4gICAgfSwge1xuICAgICAgICBzdWJ0aXRsZTogJ+exjei0rycsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICfmsrPljZcnXG4gICAgfSwge1xuICAgICAgICBzdWJ0aXRsZTogJ+WFtOi2o+eIseWlvScsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICfnlLXlrZDjgIHnoazku7bjgIFESVknXG4gICAgfV1cbn0sIHtcbiAgICB0aXRsZTogJ+iDjOaZr+S7i+e7jScsXG4gICAgY29udGVudDogW3tcbiAgICAgICAgc3VidGl0bGU6ICflt6XkvZznu4/pqownLFxuICAgICAgICBzdWJjb250ZW50OiAnMTLlubRXRULkuqflk4HmnrbmnoTnoJTlj5EnXG4gICAgfSwge1xuICAgICAgICBzdWJ0aXRsZTogJ+avleS4mumZouagoScsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICfpg5Hlt57ovbvlt6XkuJrlrabpmaIoMjAwMH4yMDA05bm0KSdcbiAgICB9LCB7XG4gICAgICAgIHN1YnRpdGxlOiAn5omA5L+u5LiT5LiaJyxcbiAgICAgICAgc3ViY29udGVudDogJ+eUteWtkOS4juS/oeaBr+aKgOacrydcbiAgICB9XVxufSwge1xuICAgIHRpdGxlOiAn6IGU57O75pa55byPJyxcbiAgICBjb250ZW50OiBbe1xuICAgICAgICBzdWJ0aXRsZTogJ+eUteivnScsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICcxMzgxMTg2OTIwOCdcbiAgICB9LCB7XG4gICAgICAgIHN1YnRpdGxlOiAnRW1haWwnLFxuICAgICAgICBzdWJjb250ZW50OiAnZnVyaWNAcXEuY29tJ1xuICAgIH0sIHtcbiAgICAgICAgc3VidGl0bGU6ICfnjrDkvY/lnYAnLFxuICAgICAgICBzdWJjb250ZW50OiAn5YyX5Lqs5Lqm5bqE5byA5Y+R5Yy656eR5Yib5Y2B5LiJ6KGXJ1xuICAgIH1dXG59XTtcblxudmFyIGZhdmljb25EYXRhID0ge1xuICAgIHRpdGxlOiAnZnVyaWMnLFxuICAgIGZhdmljb246ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy96aGFvemhhby5qcGcnLFxuICAgIGRlc2M6ICfkuKrkurrog73lipvmnInpmZDvvIzlm6LpmJ/lipvph4/ml6DpmZDvvIHorqnmv4Dmg4Xnh4Png6foh6rlt7HvvIzmiorngavlhYnnhafkuq7liKvkurohJ1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAvKlxuICAgIOiOt+WPluaJgOacieWfuuacrOS/oeaBr1xuICAgICAqL1xuICAgIGdldExpc3RBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgcmVzb2x2ZShiYXNpY0RhdGEpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZ2V0RmF2aWNvbkRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgcmVzb2x2ZShmYXZpY29uRGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJ2YXIgYmxvY2tEYXRhID0gW3tcbiAgICBpZDogJ2Fib3V0bWUnLFxuICAgIHRpdGxlOiAn6Ieq5oiR5LuL57uNJyxcbiAgICBjb250ZW50OiBbJ+iHtOWKm+S6jldFQueglOWPkeW3peeoi+WMluiHquWKqOWMlueahOeglOeptu+8jDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZnVyaWMtemhhby9mZXovXCIgdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3M9XCJsaW5rIGV4dGVybmFsXCI+RkVaPC9hPuWJjeerr+aooeWdl+WMluW3peeoi+W8gOWPkeahhuaetuS9nOiAheOAgicsICfmm77kuI7nvo7lm73noYXosLflm6LpmJ/ogZTlkIjnoJTlj5HlhbfmnInlhpvlt6XlronlhajotYTotKjnmoTnvZHnu5zlh4blhaXns7vliJfova/ku7bjgIHlm73lhoXpobbnuqfkupLogZTnvZHlronlhajlhazlj7jnmoTmkJzntKLnmb7np5HjgIHmoLjlv4PlronlhajjgIHop4bpopHnm7Tmkq3jgIHmmbrog73noazku7bnrYnlpKfkuK3lnovpobnnm67nmoTliY3nq6/mnoTlu7rjgILnjrDotJ/otKPkuqzkuJzmkJzntKLkuI7lpKfmlbDmja7lubPlj7DkvJflpJrmlbDmja7nsbvkuqflk4HnmoTliY3nq6/mnrbmnoTjgIInLCAn5L2/55So5Zu96ZmF5YmN5rK/55qE5bel56iL5YyW5oqA5pyv5o+Q6auY5Zui6Zif56CU5Y+R5pWI546H5Y+K6aG555uu5Lqn5ZOB55qE5Y+v57u05oqk5oCn5ZKM5omp5bGV5oCn44CC5ZaE5LqO5Y2P6LCD6aG555uu55qE562W5YiS44CB6K6+6K6h44CB6ZyA5rGC6IyD5Zu05ZKM6aG555uu6L+b5bqm44CB5aSE55CG6Kej5Yaz5ZCE546v6IqC6Zeu6aKY44CCJ11cbn0sIHtcbiAgICBpZDogJ2dhbmd3ZWknLFxuICAgIHRpdGxlOiAn5oSP5ZCR5bKX5L2NJyxcbiAgICBjb250ZW50OiBbJ1dFQuS6p+WTgeaetuaehOW4iOOAgemrmOe6p+WFqOagiOW3peeoi+W4iOOAgeaKgOacr+euoeeQhuiBjOS9jeOAgeS6p+WTgeiBjOS9jSddXG59LCB7XG4gICAgaWQ6ICd6aGl6ZScsXG4gICAgdGl0bGU6ICfmhI/lkJHogYzotKMnLFxuICAgIGNvbnRlbnQ6IFsn6LSf6LSj5Lqn5ZOB6ZyA5rGC5YiG5p6Q5ZKM5p625p6E6K6+6K6h44CB5Y+C5LiO57O757uf5oqA5pyv6YCJ5Z6L5Y+K5qC45b+D5qih5Z2X5oqA5pyv6aqM6K+B5ZKM5oqA5pyv5pS75YWz77yM5a6e546w5bm25a6M5ZaE5Lqn5ZOB5Yqf6IO977yM5Y2P6LCD5rWL6K+V44CB5LiK57q/44CB5Y+N6aaI562J5rWB56iL77yM5o6n5Yi25Lqn5ZOB6L+b5bqm5Y+K5aSE55CG5ZCE546v6IqC6Zeu6aKY77yM5L+d6K+B5Lqn5ZOB5pyA57uI6LSo6YeP44CCJ11cbn0sIHtcbiAgICBpZDogJ3dvcmQnLFxuICAgIHRpdGxlOiAnd29yZOeJiOeugOWOhicsXG4gICAgY29udGVudDogWyc8YSBocmVmPVwiaHR0cDovL3d3dy5oZXN0dWR5LmNvbS9jYXJlZXIuZG9jeFwiIGNsYXNzPVwibGluayBleHRlcm5hbFwiIHRhcmdldD1cIl9ibGFua1wiPmh0dHA6Ly93d3cuaGVzdHVkeS5jb20vY2FyZWVyLmRvY3g8L2E+J11cbn0sIHtcbiAgICBpZDogJ3N5c3RlbScsXG4gICAgdGl0bGU6ICflhbPkuo7mnKzns7vnu58nLFxuICAgIGNvbnRlbnQ6IFsn5pys57O757uf5L2/55SoRkVa5YmN56uv5qih5Z2X5YyW5byA5Y+R5qGG5p625Z+65LqORnJhbWV3b3JrN+aehOW7uuOAgua8lOekuuS6huenu+WKqOerr1JFTeeahOino+WGs+aWueahiOOAguWFvOWuueS7u+S9lee7iOerr+WSjOW5s+WPsOOAgeWPr+S7peWGheW1jOWcqOS7u+S9lUFQUOaIluenu+WKqOerr+W6lOeUqOS4rea1j+iniOOAgicsICc8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2Z1cmljLXpoYW8vZmV6L1wiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwibGluayBleHRlcm5hbFwiPkZFWjwvYT4g5piv6Z2i5ZCRIOWJjeerr+aooeWdl+WMluW3peeoiyDnmoTlvIDlj5HmoYbmnrbjgILkuLvopoHkuLrop6PlhrMg5YmN56uv5byA5Y+R5aSa5Lq66auY5pWI5Y2P5L2c44CB5o+Q6auY5byA5Y+R6LSo6YeP44CB5Y+K6aG555uu5Yqf6IO95omp5bGV55qE5b+r6YCf6L+t5Luj5ZKM5Y+v57u05oqk5oCn562J6Zeu6aKY44CC5qC45b+D5YyF5ous5Yqf6IO95qih5Z2X5YyW44CB57uT5p6E6KeE6IyD5YyW44CB5Y+K5byA5Y+R6Ieq5Yqo5YyW44CCJ11cbn0sIHtcbiAgICBpZDogJ2NhcmVlci1jb2RlJyxcbiAgICB0aXRsZTogJ+eugOWOhua6kOeggeWPguiAgycsXG4gICAgY29udGVudDogWyfigKo8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2Z1cmljLXpoYW8vY2FyZWVyL1wiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwibGluayBleHRlcm5hbFwiPmh0dHBzOi8vZ2l0aHViLmNvbS9mdXJpYy16aGFvL2NhcmVlci88L2E+J11cbn0sIHtcbiAgICBpZDogJ3otd29ya2Zsb3ctY29kZScsXG4gICAgdGl0bGU6ICdGRVrliY3nq6/mqKHlnZfljJblt6XnqIvku4vnu43lj4rmupDnoIEnLFxuICAgIGNvbnRlbnQ6IFsn4oCqPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9mdXJpYy16aGFvL2Zlei9cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImxpbmsgZXh0ZXJuYWxcIj5odHRwczovL2dpdGh1Yi5jb20vZnVyaWMtemhhby9mZXovPC9hPiddXG59XTtcblxuZnVuY3Rpb24gaW5BcnJheShlbGVtLCBhcnIsIGkpIHtcbiAgICB2YXIgbGVuO1xuXG4gICAgaWYgKGFycikge1xuICAgICAgICBsZW4gPSBhcnIubGVuZ3RoO1xuICAgICAgICBpID0gaSA/IGkgPCAwID8gTWF0aC5tYXgoMCwgbGVuICsgaSkgOiBpIDogMDtcblxuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cbiAgICAgICAgICAgIC8vIFNraXAgYWNjZXNzaW5nIGluIHNwYXJzZSBhcnJheXNcbiAgICAgICAgICAgIGlmIChpIGluIGFyciAmJiBhcnJbaV0gPT09IGVsZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLypcbiAgICAg6I635Y+W5YWz5LqO5pys57O757uf55qE5L+h5oGvXG4gICAgICovXG4gICAgZ2V0QWJvdXRTeXN0ZW06IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcnRuRGF0YSA9IFtdO1xuICAgICAgICB2YXIgbGltaXQgPSBbJ3N5c3RlbSddO1xuXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgICAgIGJsb2NrRGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpbkFycmF5KGl0ZW0uaWQsIGxpbWl0LCAwKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ0bkRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzb2x2ZShydG5EYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgIOiOt+WPlummlumhteS/oeaBr1xuICAgICAqL1xuICAgIGdldEluZGV4RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBydG5EYXRhID0gW107XG4gICAgICAgIHZhciBsaW1pdCA9IFsnYWJvdXRtZScsICdnYW5nd2VpJywgJ3poaXplJywgJ3otd29ya2Zsb3ctY29kZSddO1xuXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgICAgIGJsb2NrRGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpbkFycmF5KGl0ZW0uaWQsIGxpbWl0LCAwKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ0bkRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzb2x2ZShydG5EYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsInZhciBqaW5nbGlEYXRhID0gW3tcbiAgICB0aXRsZTogXCIyMDEyfjIwMTZcIixcbiAgICBjb21wb255OiBcIuWMl+S6rOWlh+iZjjM2MOenkeaKgOaciemZkOWFrOWPuO+8iOWlh+mjnue/lOiJuu+8iVwiLFxuICAgIGludHJvOiBbXCIyMDEy5bm05Yqg55ufMzYw77yM5YmN5pyf54us56uL6LSf6LSj6L+Y5piv5L+d5a+G6aG555uu55qE5pW05Liq55m+56eR5YmN56uv5bm26Lqr5YW85Lqn5ZOB57uP55CG44CB5ZCO57ut5Li75pS755m+56eR57yW6L6R5Zmo77yM6YOo5YiG5Yqf6IO96KKr55m+5bqm5ZKM5LqS5Yqo55m+56eR5oqE6KKt5YCf6Ym044CC5Lik5ZGo5YaF5LiK57q/56e75Yqo54mI55m+56eR77yM5Y2P6LCD5aSE55CG5ZCE546v6IqC6Zeu6aKY77yM5bm05bqV6I635b6X5LyY56eA5ZGY5bel5Y+K6IKh56Wo5aWW5Yqx77yM6ZqP5ZCO5LuO55m+56eR5Lia5Yqh6YOo6Zeo5bm25YWlMzYw5pyA5aSn55qE5YmN56uv5oqA5pyv5Zui6ZifLVdFQuW5s+WPsOmDqC/lpYfoiJ7lm6LjgIJcIiwgXCIyMDE05bm05rS+6am75a6J5YWo5Y2r5aOr6YOo6Zeo6LSf6LSjMzYw5a6J5YWo5Y2r5aOrVklQ5Lya5ZGY5Lit5b+D77yM5Yib6YCg5pys5ZywZGVidWflvIDlj5HmqKHlvI/vvIzlvbvlupXohLHnprvnoJTlj5Hnjq/looPlr7nlrqLmiLfnq6/nmoTkvp3otZbvvIzlop7liqDnur/kuIrkuIDplK7lvIDlkK9kZWJ1Z++8jOW/q+mAn+WumuS9jemXrumimO+8jOWkp+Wkp+aPkOmrmOWuouaIt+err+WGheW1jFdFQueahOeglOWPkeaViOeOh+OAguWQjOaXtuWNj+iwg+aUr+aMgeW+ruWvhu+8iOWGheW1jHdlYu+8ieOAgeaChOaChCjlhoXltYx3ZWIp44CB5omL5py65Y2r5aOrKOa0u+WKqCnjgIHmtYHph4/ljavlo6vvvIjlrpjnvZHvvInjgIHlhY3otLl3aWZp77yI5a6Y572R77yJ44CB54K5552b5bmz5Y+w77yI5a6Y572R77yJ44CB5L2T6aqM5Lit5b+D77yI5a6Y572R77yJ562J6aG555uu44CCXCIsIFwiMjAxNeW5tOWIneiwg+WFpeiAgeWRqOW4pumihueahOaZuuiDveehrOS7tumDqOmXqO+8jOWJjeacn+eLrOeri+i0n+i0ozM2MOesrOS4gOS4quebtOaSremhueebruWwj+awtOa7tOebtOaSree9keermeeahOaQreW7uueglOWPkeOAgWFwcOWGheW1jEg144CB5ZWG5Z+O5a6Y572R55qE5ZCE56eN5ZCI5L2c5Y+R5ZSu5rS75Yqo5YmN56uv5oqA5pyv5pSv5oyB44CC5ZCO57ut5Y2P5Yqp5byA5Y+RMzY2M01p546p44CB5oKf56m6VFbjgIHmuLjmiI/lhoXltYznp4DlnLrku6Xlj4roirHmpJLnm7Tmkq3jgIHnhornjKtUVuOAgeetieebtOaSremhueebruOAglwiXSxcbiAgICBncmFkZTogW1wi5Li76KaB5Lia57up77yaXCIsIFwiMzYw5pCc57Si55m+56eR5pW05Liq5YmN56uv6KeE5YiS44CB5p6E5bu6KOeHleWwvuacjSnjgIHnmb7np5HnvJbovpHlmagodWVkaXRvcuWGheaguCnjgILkuLvlr7zlkI7nq6/pg6jliIZQSFDmqKHlnZfmnoTlu7oo55u45YWz6K+N5p2h44CB6K+N5p2h5byV55So5qih5Z2XKeOAgeWGheWuueiOt+WPlihwaHBRdWVyeSnjgIHnvJbovpHlmajlj4rlhoXlrrnlpITnkIYoaHRtbFB1cmlmaWVyKe+8jOWIhuexu+ezu+e7n+OAgeiHquWqkuS9k+ezu+e7n+etiVwiLCBcIuWuieWFqOWNq+Wjq+S8muWRmOS4reW/g+OAgTM2MFZJUOS8muWRmOenr+WIhuWVhuWfjihXaW5kb3c45LyY5oOg56CB44CB572R5piT5piO5L+h54mH44CB5oiR5Lmw572R5LiW55WM5p2v44CB5ZSv5ZOB5Lya44CB6ZqP6Lqrd2lmaTRH54mI44CB5b2T5b2T572R55S15a2Q5Lmm44CB6Ziy5Lii5Y2r5aOrKDEvMi8zLzTmnJ8p44CB5b2T5b2T572R5pyN6KOF44CB5aSp54yr55S15Zmo5Z+O44CB572R5piT6Iqx55Sw5biB44CB5aSp54yr5Y+M5Y2B5LiA44CB55S16ISR5LiT5a626LaF57qn6aKE57qm44CB5pyJ6YGT5Y+M6YeN56S85YyF44CB5b2T5b2T572R5Y+M5Y2B5LqM5rS75Yqo44CBMzYw5a6J5YWo6Lev55Sx562J5LyX5aSa54m55p2D6aG555uuKeOAglwiLCBcIuW+ruWvhuWGheW1jOmhteOAgeaChOaChOWGheW1jOmhteOAgeaJi+acuuWNq+Wjq+a0u+WKqOOAgea1gemHj+WNq+Wjq+WumOe9keOAgeWFjei0uXdpZmnlrpjnvZHjgIHngrnnnZvlubPlj7DliY3nq6/jgIHkvZPpqozkuK3lv4Plhajnq5njgIJcIiwgXCLmmbrog73mkYTlg4/mnLrpobnnm67nmoTllYbln47lrpjnvZHjgIHlsI/msLTmu7Tnm7Tmkq3lhajnq5nvvIjlpJrnu4jnq693ZWLvvInjgIFBUFDlhoXltYxINeOAgeiKseakkuebtOaSreaSreaUvuWZqC/ogYrlpKnplb/ov57jgIEzNjYzTWnnjqnlhajnq5nmnoTlu7ov6YCB56S857O757uf44CB562J6aG555uu55qEUEPlj4pINee9keermeaetuaehOOAgemhueebruWNj+iwg+WSjOeglOWPkeOAglwiXVxufSwge1xuICAgIHRpdGxlOiBcIjIwMDd+MjAxMlwiLFxuICAgIGNvbXBvbnk6IFwi5YyX5Lqs6Im+56eR572R5L+h5pyJ6ZmQ5YWs5Y+477yI5ZCM5pa555S15a2Q5peX5LiL77yJXCIsXG4gICAgaW50cm86IFtcIjIwMDflubTlsLHogYzkuo7lkIzmlrnnlLXlrZDml5fkuIvmi6XmnInlhpvlt6XlronlhajotYTotKjnmoTnvZHnu5zova/ku7blhazlj7jvvIzliY3mnJ/orr7orqHjgIHliY3nq6/jgIHmnI3liqHnq68oUEhQKeS4gOS6uuWFqOWMheOAglwiLCBcIuWQjue7reW4pumihuiuvuiuoeW4iOOAgeWJjeerr+OAgVBIUO+8jOS4juWQjuerr++8iEPor63oqIDvvInmioDmnK/nu4/nkIbljY/osIPlhbbku5ZD6K+t6KiA5ZKM5a6i5oi356uv5bel56iL5biI77yM5Y2P5YqpQ1RP5a6e546w5bm25a6M5ZaE5pyA57uIV0VC5bGV546w5ZKM5Lqk5LqS5Yqf6IO944CC5Y+C5LiO5ZCO57ut5Lqn5ZOB5rWL6K+V44CB5Y+R54mI44CB5o6l5pS25pS56L+b55So5oi35pa55Y+N6aaI77yM5L2/55So5pyJ6ZmQ55qE6LWE5rqQ5byA5Y+R57u05oqkN+S4quS6p+WTgee6v+OAglwiLCBcIuS4muS9meWvuee9keermeW7uuiuvuWPiui/kOiQpeacieW+iOmrmOeahOWFtOiHtO+8jOabvueLrOeri+W7uumAoOi/kOiQpeaVsOS4que9keerme+8jOW5tuWwhuW8gOa6kOezu+e7n+aIkOeGn+eahOWGhemDqOWKn+iDveaooeWdl+S6jOasoeW8gOWPkeS9juaIkOacrOW6lOeUqOS6juW3peS9nOmhueebruS4reOAglwiXSxcbiAgICBncmFkZTogW1wi5Li76KaB5Lia57up77yaXCIsIFwi5a6e5ZCN5YeG5YWl5o6n5Yi277yM57uI56uv5YGl5bq35qOA5p+l77yM5a6e5ZCN5Yi2SVDlnLDlnYDnrqHnkIbvvIzmnaXlrr7orr/lrqLnvZHvvIzpnZ7ms5XlpJbogZTlj4rnvZHnu5zlqIHog4HlrprkvY3vvIznvZHnu5zorr/pl67mjqfliLbvvIzpq5jmgKfog73ml6Xlv5flrZjlgqjlkozlrqHorqHjgIJcIl1cbn0sIHtcbiAgICB0aXRsZTogXCIyMDA0fjIwMDdcIixcbiAgICBjb21wb255OiBcIua4heWNjuWkp+WtpuWHuueJiOekvu+8iOesrOWFreS6i+S4mumDqO+8iS8g5Yib5LiaXCIsXG4gICAgaW50cm86IFtcIjIwMDTlubTmr5XkuJrov5vlhaXljJfkuqzmuIXljY7lpKflrablh7rniYjnpL7nrKzlha3kuovkuJrpg6jlgZrnvZHnq5nnoJTlj5HvvIzpnIDmsYLjgIHorr7orqEoUFMp44CBRmxhc2jliqjnlLvjgIHliY3nq68oaHRtbC9jc3MvanMp44CB5pyN5Yqh56uvKEFTUCnjgIHmlbDmja7lupMoU1FMU2VydmVyKeOAgea1i+ivleOAgeS4gOS6uuWFqOWMheOAglwiLCBcIuS4u+imgeS4mue7qe+8mua4heWNjuWHuueJiOekvuesrOWFreS6i+S4mumDqOWumOaWuee9keerme+8jOW8gOWPkeaWsOS5puOAgeeVhemUgOS5puOAgeeyvuWTgeWbvuS5puWxleekuuWSjOWcqOe6v+iuoui0re+8jOWbvuS5puebuOWFs+i1hOaWmeS4i+i9ve+8jOWSjOivu+iAheeVmeiogOetieWKn+iDveaooeWdl1wiXSxcbiAgICBncmFkZTogW1wiMjAwNeW5tOi+nuaOieW3peS9nOaOpeWNleWBmue9keermeaQnuKAnOWIm+S4muKAneOAglwiLCBcIueLrOeri+W8gOWPke+8mkthcnRlbGwo5oSP5aSn5Yip5LiW55WM6aG257qn5a625YW35ZOB54mMKeWMl+S6rOWumOaWuee9keerme+8jOWMl+S6rOmHkea4r+axvei9puWFrOWbrei2hei3keeyvuiLseS8muWumOaWuee9keerme+8jOWMl+S6rOeWr+eLguiLseivreWfueiureS4reW/g+WumOaWuee9keermeOAgeWcqOe6v+aKpeWQjeezu+e7n+OAgeWPiuWFqOWbveaOiOadg+eCueS6kuWKqOS6pOa1geW5s+WPsO+8jOWUr+azsOWPpOWFuOWutuWFt+e9ke+8jOeIsee+jjM26K6h5YyW5aaG5ZOB5ZWG5Z+O77yMQ2FyYmFzZeaxvei9puaUr+aPtOacjeWKoee9keWPiuiuuuWdm++8jOa4hea1gei/hShzdHJlYW1vY2VhbinnlLXop4bmnLrpobbnm5Lop4bpopHns7vnu5/vvIzlj4rlhbblroPlpKflsI/kvIHkuJrnvZHnq5kzMOWkmuS4qlwiLCBcIuWQjOaXtuW8gOWPkei/kOiQpe+8muW8gOW/g+iLseivreWtpuS5oOe9ke+8jOefpeW3see9kee7nOaKgOacr+S/oeaBr+e9ke+8jOiuuuaWh+aQnOe0ouWfuuWcsO+8jOmdnuW4uEdvb2Tnsr7lk4HnvZHlnYDlr7zoiKrvvIzpnZ7luLhHb29k6K6h566X5py65pWZ56iL572R562J5Z+65LqO5byA5rqQ57O757uf55qE5Liq5Lq6572R56uZ44CCXCJdXG59XTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLypcbiAgICDojrflj5bmoIfpopjliJfooahcbiAgICAgKi9cbiAgICBnZXRMaXN0VGl0bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGl0bGVMaXN0ID0gW107XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBqaW5nbGlEYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgdGl0bGVMaXN0LnB1c2goaXRlbS50aXRsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUodGl0bGVMaXN0KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qXG4gICAg6I635Y+W5omA5pyJ5YiX6KGoXG4gICAgICovXG4gICAgZ2V0TGlzdEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBqaW5nbGlEYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbS50eXBlID0gaXRlbS50aXRsZS5zcGxpdCgnficpWzBdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoamluZ2xpRGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJ2YXIgd29ya0luZm8gPSB7XG4gICAgZGF0YTogW3tcbiAgICAgICAgaWQ6IFwiamlhcGNcIixcbiAgICAgICAgdHlwZTogXCIyMDEyXCIsXG4gICAgICAgIG5hbWU6IFwi5bCP5rC05ru055u05pKtUEPniYhcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9qaWEuMzYwLmNuL3BjXCIsXG4gICAgICAgIGRlc2M6IFwiMzYw56ys5LiA5Liq55u05pKt6aG555uu77yM5YmN5pyf54us56uL5byA5Y+R6LSf6LSj5YWo56uZ5Yqf6IO95qih5Z2X5p6E5bu677yM5Y2P6LCD5aSE55CG5ZCE546v6IqC5rWB56iL77yI6L+Q6JCl44CBUE3jgIHmnI3liqHnq6/mjqXlj6PliLblrprjgIHmtYvor5XjgIHlj43ppojnrYnvvInjgILkvb/nlKjmioDmnK/vvJpzZXdpc2VQbGF5ZXLjgIFzb2NranPjgIFFbW9qaeOAgWZsZXhzbGlkZXLjgIFqUXVlcnktbGF6eWxvYWTjgIFqUXVlcnktdG1wbOetiee7hOS7tlwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ppYXBjL2NvdmVyLnBuZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9qaWFwYy8wMS5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJ+ebtOaSremmlumhtSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhcGMvMDIucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICfnm7Tmkq3popHpgZMnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ppYXBjLzAzLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAn5pKt5pS+6aG1J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9qaWFwYy8wNC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJ+ebtOaSremihOWRiidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhcGMvMDUucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICfkuKrkurrmkYTlg4/mnLrnvZHpobXniYgnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ppYXBjL3QwMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJ+iuv+mXrue7n+iuoSdcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImppYW1vYmlsZVwiLFxuICAgICAgICB0eXBlOiBcIjIwMTJcIixcbiAgICAgICAgbmFtZTogXCLlsI/msLTmu7Tnm7Tmkq3np7vliqjniYhcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9qaWEuMzYwLmNuL21vYmlsZVwiLFxuICAgICAgICBkZXNjOiBcIuS9v+eUqOaKgOacr++8mmg155qEdmlkZW/jgIFFbW9qaeOAgWFydC10ZW1wbGF0ZeOAgWlzY3JvbGzjgIF3ZWJ1cGxvYWRlcuOAgXNvY2tqc+OAgXplcHRvKOWQjue7reaUueS4umpxdWVyeSlcIixcbiAgICAgICAgY292ZXI6IFwiLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhbW9iaWxlL2NvdmVyLmpwZ1wiLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhbW9iaWxlLzAxLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9qaWFtb2JpbGUvMDIuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ppYW1vYmlsZS8wMy5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhbW9iaWxlLzA0LmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9qaWFtb2JpbGUvdDAxLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAn6K6/6Zeu57uf6K6hJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiYmFpa2UzNjBwY1wiLFxuICAgICAgICB0eXBlOiBcIjIwMTJcIixcbiAgICAgICAgbmFtZTogXCIzNjDnmb7np5FQQ+eJiFwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2JhaWtlLnNvLmNvbVwiLFxuICAgICAgICBkZXNjOiBcIuWJjeacn+eLrOeri+i0n+i0o+WFqOermeWJjeerr+inhOWIkuOAgeaehOW7uuOAgeeZvuenkee8lui+keWZqOOAguS4u+WvvOWQjuerr1BIUOmDqOWIhuaooeWdl+aehOW7uijnm7jlhbPor43mnaHjgIHor43mnaHlvJXnlKjmqKHlnZcp44CB5YaF5a656I635Y+WKHBocFF1ZXJ5KeOAgeWGheWuueWkhOeQhihodG1sUHVyaWZpZXIp77yM5YiG57G757O757uf44CB6Ieq5aqS5L2T57O757uf562J44CC5L2/55So5oqA5pyv77yadWVkaXRvcuOAgXNtYXJ0eeOAgWhpZ2hzbGlkZXLjgIFhcnQtZGlhbG9n44CBZGF0ZXBpY2tlcuOAgWpRdWVyeS1jb29raWXjgIFqc29uMuetiee7hOW7ulwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDIucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDMucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDUucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDYucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvdDAxLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAn6K6/6Zeu57uf6K6hJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiYmFpa2UzNjBtb2JpbGVcIixcbiAgICAgICAgdHlwZTogXCIyMDEyXCIsXG4gICAgICAgIG5hbWU6IFwiMzYw55m+56eR56e75Yqo54mIXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vbS5iYWlrZS5zby5jb21cIixcbiAgICAgICAgZGVzYzogXCLliY3mnJ/ni6znq4vlvIDlj5HvvIznrKzkuIDmnJ/vvJrljobml7bkuIDlkajvvIjliY3lkI7nq6/mlbTkvZPmnoTlu7rvvInvvJvnrKzkuozmnJ/vvJrljobml7bkuKTlkajvvIzlpKfph4/kvJjljJbjgIHnm67lvZXjgIFsYXp5bG9hZOOAgeacieaXoOWbvuaooeW8j+OAgeWtl+S9k+iwg+aVtOOAgeaXpeWknOaooeW8j+OAguesrOS4ieacn++8muWPjemmiOWKn+iDveOAgeWKn+iDveW8leWvvOaPkOekuuOAgXN1Z2dlc3TjgIHlm77lhozmtY/op4jnrYnjgILkvb/nlKh6ZXB0b+OAgWlzY3JvbGznrYnnu4Tku7bjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZTM2MG1vYmlsZS9jb3Zlci5qcGcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2UzNjBtb2JpbGUvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwbW9iaWxlLzAyLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZTM2MG1vYmlsZS8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2UzNjBtb2JpbGUvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwbW9iaWxlLzA1LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwidXNlckNlbnRlclwiLFxuICAgICAgICB0eXBlOiBcIjIwMTJcIixcbiAgICAgICAgbmFtZTogXCLlronlhajljavlo6vkvJrlkZjkuK3lv4NcIixcbiAgICAgICAgZGVzYzogXCLliJvpgKDmnKzlnLBkZWJ1Z+W8gOWPkeaooeW8j++8jOW9u+W6leiEseemu+eglOWPkeeOr+Wig+WvueWuouaIt+err+eahOS+nei1lu+8jOWinuWKoOe6v+S4iuS4gOmUruW8gOWQr2RlYnVn77yM5b+r6YCf5a6a5L2N6Zeu6aKY77yM5aSn5aSn5o+Q6auY5a6i5oi356uv5YaF5bWMV0VC55qE56CU5Y+R5pWI546H44CC5Li76KaB5oqA5pyv77yaUXdyYXDjgIFRd3JhcC1wcm9taXNl44CBUXdyYXAtbGF6eWxvYWTjgIFRd3JhcC1oYXNoLWhpc3Ryb3njgIFRd3JhcC1zY3JvbGwtYmFy44CBUXdyYXAtZGF0YU1vZGFs562J5qih5Z2X44CCXCIsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy91Y2VudGVyMzYwLzAxLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnMzYw5Lya5ZGY5Lit5b+D6aaW6aG1J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy91Y2VudGVyMzYwLzAyLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnMzYw5Lya5ZGY5Lit5b+D5YGa5Lu75YqhJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy91Y2VudGVyMzYwLzAzLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnMzYw5Lya5ZGY5Lit5b+D6aKG54m55p2DJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwidmlwMzYwXCIsXG4gICAgICAgIHR5cGU6IFwiMjAxMlwiLFxuICAgICAgICBuYW1lOiBcIjM2MOS8muWRmOWVhuWfjlwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL3ZpcC4zNjAuY24vbWFsbC9cIixcbiAgICAgICAgZGVzYzogXCLlhajnq5nln7rkuo5ib290c3RyYXDkuozmrKHlvIDlj5HjgIJqUXVlcnktdG1wbOOAgWpRdWVyeS1jb29raWXnrYnnu4Tku7ZcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy92aXAzNjAvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3ZpcDM2MC8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvdmlwMzYwLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwibWl3YW4zNjYzXCIsXG4gICAgICAgIHR5cGU6IFwiMjAxMlwiLFxuICAgICAgICBuYW1lOiBcIjM2NjNNaeeOqee+juWls+ebtOaSrVwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL3d3dy4zNjYzLmNvbVwiLFxuICAgICAgICBkZXNjOiBcIue+juWls+ebtOaSreOAgemAgeekvO+8jOWfuuS6jmd1bHDoh6rliqjljJblt6XkvZzmtYHjgIFicm93c2VyaWZ557uE57uHY29tbW9uanPmoIflh4bnmoRub2RlanPku6PnoIHlnKjmtY/op4jlmajov5DooYzjgIHliIblsYLop4TliJLmqKHlnZflvI/mnoTlu7rvvIjmnI3liqHlsYLjgIHmqKHlnZflsYLvvInvvIxQcm9taXNl5byC5q2l57yW56iLXCIsXG4gICAgICAgIGNvdmVyOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvbWl3YW4zNjYzL2NvdmVyLnBuZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9taXdhbjM2NjMvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL21pd2FuMzY2My8wMi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcIjVrb25ndHZcIixcbiAgICAgICAgdHlwZTogXCIyMDEyXCIsXG4gICAgICAgIG5hbWU6IFwi5oKf56m6VFbmuLjmiI/nm7Tmkq1cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly93d3cuNWtvbmcudHZcIixcbiAgICAgICAgZGVzYzogXCLmuLjmiI/nm7Tmkq3jgIHpgIHnpLzjgILln7rkuo5ndWxw6Ieq5Yqo5YyW5bel5L2c5rWB44CBYnJvd3Nlcmlmeee7hOe7h2NvbW1vbmpz5qCH5YeG55qEbm9kZWpz5Luj56CB5Zyo5rWP6KeI5Zmo6L+Q6KGM44CB5YiG5bGC6KeE5YiS5qih5Z2X5byP5p6E5bu677yI5pyN5Yqh5bGC44CB5qih5Z2X5bGC77yJ77yMUHJvbWlzZeW8guatpee8lueoi1wiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljLzVrb25ndHYvY292ZXIuanBnJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljLzVrb25ndHYvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljLzVrb25ndHYvMDIuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJpZG5hY1wiLFxuICAgICAgICB0eXBlOiBcIjIwMDdcIixcbiAgICAgICAgbmFtZTogXCLlrp7lkI3liLZJROe9kee7nOeuoeeQhuezu+e7n1wiLFxuICAgICAgICBkZXNjOiBcIuW6leWxguS9v+eUqEPor63oqIDkuI7noazku7bkuqTkupLjgIFQSFDkvZzkuLrkuK3pl7TlsYLlrp7njrDkuJrliqHpgLvovpHjgILliY3mnJ/ni6znq4votJ/otKPorr7orqHjgIHliY3nq6/jgIFQSFDlsYLnmoTlkITmqKHlnZfmnoTlu7rjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZG5hYy9jb3Zlci5wbmcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRuYWMvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkbmFjLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZG5hYy8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRuYWMvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkbmFjLzA1LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZG5hYy8wNi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRuYWMvMDcucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkbmFjLzA4LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiaWR3YWxsXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwN1wiLFxuICAgICAgICBuYW1lOiBcIklEV2FsbOWHhuWFpemYsueBq+WimVwiLFxuICAgICAgICBkZXNjOiBcIuWfuuS6jklETmFj6KOB5Ymq5byA5Y+R77yM5YmN5pyf54us56uL5p6E5bu644CCSURXYWxs5piv5LiT5Li65L+d5oqk5YaF572R6LWE5rqQ6ICM6K6+6K6h55qE5YeG5YWl6Ziy54Gr5aKZ44CC5a6D5piv5LiW55WM5LiK6aaW5qy+5pSv5oyB5a6e5ZCN5Yi2SUTnvZHnu5zmioDmnK/nmoTjgIHlhbfmnInlh4blhaXmjqfliLblip/og73nmoTpmLLngavlopnjgILmnInliKvkuo7kvKDnu5/nmoTpmLLngavlopnvvIxJRFdhbGzlrp7njrDkuoblronlhajln5/nmoTnrqHnkIbvvIznrKblkIjlm73lrrblronlhajms5Xop4TkuK3opoHmsYLnmoTnvZHnu5zotYTmupDlv4XpobvliIbljLrliIbln5/jgIHkuKXnpoHkuI3lkIznrYnnuqfnmoTlronlhajln5/kupLpgJrnmoTop4TlrprjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZHdhbGwvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkd2FsbC8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWR3YWxsLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZHdhbGwvMDMucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJmdXphaWp1bmhlbmdcIixcbiAgICAgICAgdHlwZTogXCIyMDA3XCIsXG4gICAgICAgIG5hbWU6IFwi5Zu95a6255S1572R6LSf6L295Z2H6KGh57O757ufXCIsXG4gICAgICAgIGRlc2M6IFwi5Z+65LqOSUROYWPoo4HliarlvIDlj5HvvIzliY3mnJ/ni6znq4vmnoTlu7rjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9mdXphaWp1bmhlbmcvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Z1emFpanVuaGVuZy8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvZnV6YWlqdW5oZW5nLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9mdXphaWp1bmhlbmcvMDMucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Z1emFpanVuaGVuZy8wNC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImZlaWZhd2FpbGlhblwiLFxuICAgICAgICB0eXBlOiBcIjIwMDdcIixcbiAgICAgICAgbmFtZTogXCLlm73lrrbnlLXnvZHpnZ7ms5XlpJbogZTmo4DmtYvns7vnu59cIixcbiAgICAgICAgZGVzYzogXCLln7rkuo5JRE5hY+ijgeWJquW8gOWPke+8jOWJjeacn+eLrOeri+aehOW7uuOAglwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ZlaWZhd2FpbGlhbi9jb3Zlci5wbmcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvZmVpZmF3YWlsaWFuLzAxLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9mZWlmYXdhaWxpYW4vMDIucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ZlaWZhd2FpbGlhbi8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvZmVpZmF3YWlsaWFuLzA0LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwia29uZ3poaXdhbmdndWFuXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwN1wiLFxuICAgICAgICBuYW1lOiBcIuWFrOWuiemDqOaOp+WItue9keWFs1wiLFxuICAgICAgICB0aW1lOiBcIjIwMTHlubTkvZzlk4FcIixcbiAgICAgICAgZGVzYzogXCLln7rkuo5JRE5hY+ijgeWJquW8gOWPke+8jOWJjeacn+eLrOeri+aehOW7uuOAguS4uuWFrOWuiemDqOmXqOWBmueahOmhueebru+8jOe7k+WQiElETmFj5a6e546w5LiL5bGe5bKX5Lqt5o6l5YWl57uI56uv55qE55uR5o6n5ZKM566h55CGXCIsXG4gICAgICAgIGNvdmVyOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva29uZ3poaXdhbmdndWFuL2NvdmVyLnBuZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9rb25nemhpd2FuZ2d1YW4vMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2tvbmd6aGl3YW5nZ3Vhbi8wMi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva29uZ3poaXdhbmdndWFuLzAzLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9rb25nemhpd2FuZ2d1YW4vMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2tvbmd6aGl3YW5nZ3Vhbi8wNS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImlkc2Vuc29yXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwN1wiLFxuICAgICAgICBuYW1lOiBcIklE572R57uc566h55CG57O757uf6L+c56uv5Luj55CGXCIsXG4gICAgICAgIHRpbWU6IFwiMjAxMeW5tOS9nOWTgVwiLFxuICAgICAgICBkZXNjOiBcIklEU2Vuc29y5Y+v5Lul55uR6KeG5ZKM5o6n5Yi26L+c56uv5YiG5pSv5py65p6E55qE572R57uc77yM6YWN5ZCISUROYWPvvIzlrp7njrDlhajnvZHnmoTnrqHmjqfvvIznoa7kv53lhajnvZHnmoTnvZHnu5zovrnnlYznmoTlrozmlbTjgILop6PlhrPnlLHkuo7nvZHnu5zliIbluIPlnLDln5/lub/jgIHkuI3mmJPnm5Hlr5/jgIHkuI3mmJPnrqHnkIbnmoTpl67popjvvIzluK7liqnnvZHnrqHkurrlkZjlrp7njrDov5znq6/lhajnvZHmjozmjqfnmoTpmr7popjjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZHNlbnNvci9jb3Zlci5wbmcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRzZW5zb3IvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkc2Vuc29yLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZHNlbnNvci8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRzZW5zb3IvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJhY2twcm9qZWN0XCIsXG4gICAgICAgIHR5cGU6IFwiMjAwN1wiLFxuICAgICAgICBuYW1lOiBcIkFDS+mhueebruS9nOWTgVwiLFxuICAgICAgICBkZXNjOiBcIuWHoOS4qumHjeeCueWunuWcsOmDqOe9sueahOmhueebrlwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvY292ZXIuanBnJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDIuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDMuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDQuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDUuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDYuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJhY2tiYnNcIixcbiAgICAgICAgdHlwZTogXCIyMDA3XCIsXG4gICAgICAgIG5hbWU6IFwiQWNrd29ya3Pkuqflk4HmioDmnK/kuqTmtYHorrrlnZtcIixcbiAgICAgICAgZGVzYzogXCLln7rkuo7lvIDmupDns7vnu59QSFBXaW5k5p6E5bu644CC5Li656CU5Y+R44CB6ZSA5ZSu44CB5a6i5oi35o+Q5L6b6K6o6K66546w5a2Y6Zeu6aKY77yM5paw55qE5Yqf6IO956CU5Y+R77yM6K6o6K665Lqn5ZOB55qE5Y+R5biD5pyq6Kej5Yaz55qEQlVH77yM6ZSA5ZSu5Lit55qE6Zeu6aKY5bu66K6uXCIsXG4gICAgICAgIGNvdmVyOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYWNrYmJzL2NvdmVyLmpwZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9hY2tiYnMvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja2Jicy8wMi5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYWNrYmJzLzAzLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9hY2tiYnMvMDQuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJxaW5naHVhXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwNFwiLFxuICAgICAgICBuYW1lOiBcIua4heWNjuWkp+WtpuWHuueJiOekvuesrOWFreS6i+S4mumDqFwiLFxuICAgICAgICB0aW1lOiBcIjIwMDQtMjAwNeW5tOS9nOWTgVwiLFxuICAgICAgICBkZXNjOiBcIuWFqOagiOeLrOeri+W8gOWPkeOAgua4heWNjuWHuueJiOekvuesrOWFreS6i+S4mumDqOWumOaWuee9keerme+8jOaWsOS5puOAgeeVhemUgOS5puOAgeeyvuWTgeWbvuS5puWxleekuuWSjOWcqOe6v+iuoui0re+8jOWbvuS5puebuOWFs+i1hOaWmeS4i+i9ve+8jOWSjOivu+iAheeVmeiogOetiVwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvY292ZXIuanBnJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDIuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDMuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDQuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDUuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDYuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJrYXJ0ZWxsXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwNFwiLFxuICAgICAgICBuYW1lOiBcIkthcnRlbGwo5oSP5aSn5YipKeWutuWFt+i0uOaYk+WMl+S6rOe9keermVwiLFxuICAgICAgICB0aW1lOiBcIjIwMDblubTkvZzlk4FcIixcbiAgICAgICAgZGVzYzogXCLlhajmoIjni6znq4vlvIDlj5HjgILmhI/lpKfliKnkuJbnlYzpobbnuqflk4HniYzlrrblhbfljJfkuqzlrpjmlrnnvZHnq5njgIHpppbpobXph4fnlKjlhahGbGFzaOW8gOWPke+8jOS6p+WTgeWxleekuuWSjOWcqOe6v+iuoui0rVwiLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wMi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wNC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wNS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wNi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wNy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wOC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wOS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8xMC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImF1dG93b3Jrc1wiLFxuICAgICAgICB0eXBlOiBcIjIwMDRcIixcbiAgICAgICAgbmFtZTogXCJBdXRvV29ya3PotoXot5Hnsr7oi7HkvJpcIixcbiAgICAgICAgdGltZTogXCIyMDA15bm05L2c5ZOBXCIsXG4gICAgICAgIGRlc2M6IFwi5YWo5qCI54us56uL5byA5Y+R44CC5YyX5Lqs6YeR5riv5rG96L2m5YWs5Zut6LaF6LeR57K+6Iux5Lya5a6Y5pa5572R56uZ77yM6L2m6L6G5pS56KOF44CB6ZSA5ZSu44CB56S85ZOB44CB6LWb5LqL5rS75YqoXCIsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9hdXRvd29ya3MvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2F1dG93b3Jrcy8wMi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYXV0b3dvcmtzLzAzLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9hdXRvd29ya3MvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2F1dG93b3Jrcy8wNS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImNyYXp5ZW5nbGlzaFwiLFxuICAgICAgICB0eXBlOiBcIjIwMDRcIixcbiAgICAgICAgbmFtZTogXCLljJfkuqznlq/ni4Loi7Hor63pobnnm65cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly93d3cuYmpjcmF6eWVuZ2xpc2guY29tL1wiLFxuICAgICAgICBkZXNjOiBcIueWr+eLguiLseivreWumOaWuee9keerme+8iOWfuuS6juenkeiur+W8gOa6kOezu+e7n++8ieOAgeWcqOe6v+aKpeWQjeezu+e7n++8iOWFqOagiOeLrOeri+W8gOWPke+8ieOAgeWFqOWbveaOiOadg+eCueS6kuWKqOS6pOa1geW5s+WPsO+8iOWFqOagiOeLrOeri+W8gOWPke+8iVwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2NyYXp5ZW5nbGlzaC9jb3Zlci5wbmcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvY3JhenllbmdsaXNoLzAxLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9jcmF6eWVuZ2xpc2gvMDIucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2NyYXp5ZW5nbGlzaC8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvY3JhenllbmdsaXNoLzA0LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9jcmF6eWVuZ2xpc2gvMDUucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2NyYXp5ZW5nbGlzaC8wNi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvY3JhenllbmdsaXNoLzA3LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9jcmF6eWVuZ2xpc2gvMDgucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2NyYXp5ZW5nbGlzaC8wOS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvY3JhenllbmdsaXNoLzEwLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwid2VpdGFpXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwNFwiLFxuICAgICAgICBuYW1lOiBcIuWUr+azsOWPpOWFuOWutuWxhee9kVwiLFxuICAgICAgICB0aW1lOiBcIjIwMDflubTkvZzlk4FcIixcbiAgICAgICAgZGVzYzogXCLln7rkuo5BU1Dnp5Horq/ns7vnu5/kuozmrKHlvIDlj5HvvIzlsbHopb/lpKrljp/lnLDmlrnlrrblhbfnvZHnq5nvvIzlrp7njrDlj6TlhbjlrrblhbflsZXnpLrjgIHlnKjnur/orqLotK3jgIHkvJrlkZjkupLliqjnrYnlip/og71cIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy93ZWl0YWkvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3dlaXRhaS8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvd2VpdGFpLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy93ZWl0YWkvMDMucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3dlaXRhaS8wNC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvd2VpdGFpLzA1LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy93ZWl0YWkvMDYucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3dlaXRhaS8wNy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvd2VpdGFpLzA4LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiYWltZWkzNuiuoVwiLFxuICAgICAgICB0eXBlOiBcIjIwMDRcIixcbiAgICAgICAgbmFtZTogXCLniLHnvo4zNuWMluWmhuWTgeWcqOe6v+WVhuWfjlwiLFxuICAgICAgICB0aW1lOiBcIjIwMDnlubTkvZzlk4FcIixcbiAgICAgICAgZGVzYzogXCLln7rkuo5QSFDnmoRzaG9wZXjkuozmrKHlvIDlj5HvvIzlrozmlbTnmoTlnKjnur/llYbln47ns7vnu59cIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2L2NvdmVyLnBuZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2LzAxLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2LzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2LzAzLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2LzA0LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwienp1bGlialwiLFxuICAgICAgICB0eXBlOiBcIjIwMDRcIixcbiAgICAgICAgbmFtZTogXCLpg5Hlt57ovbvlt6XkuJrlrabpmaLljJfkuqzmoKHlj4vkvJpcIixcbiAgICAgICAgZGVzYzogXCLkuLrpg5Hlt57ovbvlt6XkuJrlrabpmaLmr5XkuJrnmoTjgIHlnKjljJfkuqzlt6XkvZznmoTmoKHlj4vvvIzmj5DkvpvlnKjnur/msp/pgJrjgIHkuqTmtYHnmoTlubPlj7DjgILln7rkuo7lurfnm5vliJvmg7PnmoQgdWNlbnRlciBob21lIOS6jOasoeW8gOWPkVwiLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wMS5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wMi5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wMy5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wNC5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wNS5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcIm90aGVyXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwNFwiLFxuICAgICAgICBuYW1lOiBcIuWFtuWug+S9nOWTgemDqOWIhuS/oeaBr1wiLFxuICAgICAgICBkZXNjOiBcIjIwMDXlubTotbfmjqXljZXlgZrnvZHnq5njgIHln7rkuo7lvIDmupDns7vnu5/mkK3lu7rkuKrkurrnvZHnq5njgIHnmoTpg6jliIbkvZzlk4Eo5aSn5bCP5LyB5Lia56uZMzDlpJrkuKopXCIsXG4gICAgICAgIGNvdmVyOiBcIi4vc3RhdGljL2ltYWdlcy9keW5hbWljL290aGVyL2NvdmVyLnBuZ1wiLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvb3RoZXIvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL290aGVyLzAyLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9vdGhlci8wMy5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvb3RoZXIvMDQuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL290aGVyLzA1LmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9vdGhlci8wNi5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvb3RoZXIvMDcuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL290aGVyLzA4LmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9vdGhlci8wOS5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvb3RoZXIvMTAucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfV1cbn07XG5cbnZhciB3b3JrcyA9IHtcbiAgICAvKlxuICAgIOiOt+WPluS9nOWTgeWIl+ihqOW5tuWBmuS4gOS6m+agvOW8j+WKoOW3pVxuICAgICAqL1xuICAgIGdldExpc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbGlzdERhdGEgPSBbXTtcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICAgICAgd29ya0luZm8uZGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW1EYXRhLmlkID0gaXRlbS5pZDtcbiAgICAgICAgICAgICAgICBpdGVtRGF0YS5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgICAgICAgIGl0ZW1EYXRhLnVybCA9IGl0ZW0udXJsIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgaXRlbURhdGEudGlwID0gaXRlbS50aXAgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICBpdGVtRGF0YS5kZXNjID0gaXRlbS5kZXNjIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgaXRlbURhdGEuY292ZXIgPSBpdGVtLmNvdmVyIHx8IChpdGVtLmxpc3QgPyBpdGVtLmxpc3RbMF0udXJsIDogXCJcIik7XG5cbiAgICAgICAgICAgICAgICBsaXN0RGF0YS5wdXNoKGl0ZW1EYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzb2x2ZShsaXN0RGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKlxuICAgIOagueaNruexu+Wei+iOt+WPluS9nOWTgeWIl+ihqFxuICAgICAqL1xuICAgIGdldExpc3RCeVR5cGU6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGxpc3REYXRhID0gW107XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgICAgIHdvcmtJbmZvLmRhdGEubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBpdGVtLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1EYXRhID0ge307XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1EYXRhLmlkID0gaXRlbS5pZDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGEubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGEudXJsID0gaXRlbS51cmwgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGEudGlwID0gaXRlbS50aXAgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGEuZGVzYyA9IGl0ZW0uZGVzYyB8fCBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpdGVtRGF0YS5jb3ZlciA9IGl0ZW0uY292ZXIgfHwgKGl0ZW0ubGlzdCA/IGl0ZW0ubGlzdFswXS51cmwgOiBcIlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBsaXN0RGF0YS5wdXNoKGl0ZW1EYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUobGlzdERhdGEpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICDmoLnmja5pZOiOt+WPluWNleS4quS9nOWTgVxuICAgICAqL1xuICAgIGdldEJ5SWQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHZhciBpdGVtRGF0YSA9IHt9O1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgd29ya0luZm8uZGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpZCA9PSBpdGVtLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1EYXRhID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbURhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdvcmtzO1xuIiwiaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuL2hhbmRsZWJhcnMvYmFzZSc7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG5pbXBvcnQgU2FmZVN0cmluZyBmcm9tICcuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2hhbmRsZWJhcnMvZXhjZXB0aW9uJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vaGFuZGxlYmFycy91dGlscyc7XG5pbXBvcnQgKiBhcyBydW50aW1lIGZyb20gJy4vaGFuZGxlYmFycy9ydW50aW1lJztcblxuaW1wb3J0IG5vQ29uZmxpY3QgZnJvbSAnLi9oYW5kbGViYXJzL25vLWNvbmZsaWN0JztcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gIGxldCBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG4gIGhiLmVzY2FwZUV4cHJlc3Npb24gPSBVdGlscy5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn1cblxubGV0IGluc3QgPSBjcmVhdGUoKTtcbmluc3QuY3JlYXRlID0gY3JlYXRlO1xuXG5ub0NvbmZsaWN0KGluc3QpO1xuXG5pbnN0WydkZWZhdWx0J10gPSBpbnN0O1xuXG5leHBvcnQgZGVmYXVsdCBpbnN0O1xuIiwiaW1wb3J0IHtjcmVhdGVGcmFtZSwgZXh0ZW5kLCB0b1N0cmluZ30gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7cmVnaXN0ZXJEZWZhdWx0SGVscGVyc30gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB7cmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9yc30gZnJvbSAnLi9kZWNvcmF0b3JzJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9ICc0LjAuNSc7XG5leHBvcnQgY29uc3QgQ09NUElMRVJfUkVWSVNJT04gPSA3O1xuXG5leHBvcnQgY29uc3QgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc9PSAxLngueCcsXG4gIDU6ICc9PSAyLjAuMC1hbHBoYS54JyxcbiAgNjogJz49IDIuMC4wLWJldGEuMScsXG4gIDc6ICc+PSA0LjAuMCdcbn07XG5cbmNvbnN0IG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZXhwb3J0IGZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscywgZGVjb3JhdG9ycykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG4gIHRoaXMuZGVjb3JhdG9ycyA9IGRlY29yYXRvcnMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbiAgcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyh0aGlzKTtcbn1cblxuSGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2dnZXIubG9nLFxuXG4gIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIGV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5oZWxwZXJzW25hbWVdO1xuICB9LFxuXG4gIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSwgcGFydGlhbCkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBleHRlbmQodGhpcy5wYXJ0aWFscywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgcGFydGlhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihgQXR0ZW1wdGluZyB0byByZWdpc3RlciBhIHBhcnRpYWwgY2FsbGVkIFwiJHtuYW1lfVwiIGFzIHVuZGVmaW5lZGApO1xuICAgICAgfVxuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHBhcnRpYWw7XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLnBhcnRpYWxzW25hbWVdO1xuICB9LFxuXG4gIHJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBkZWNvcmF0b3JzJyk7IH1cbiAgICAgIGV4dGVuZCh0aGlzLmRlY29yYXRvcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlY29yYXRvcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5kZWNvcmF0b3JzW25hbWVdO1xuICB9XG59O1xuXG5leHBvcnQgbGV0IGxvZyA9IGxvZ2dlci5sb2c7XG5cbmV4cG9ydCB7Y3JlYXRlRnJhbWUsIGxvZ2dlcn07XG4iLCJpbXBvcnQgcmVnaXN0ZXJJbmxpbmUgZnJvbSAnLi9kZWNvcmF0b3JzL2lubGluZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVySW5saW5lKGluc3RhbmNlKTtcbn1cblxuIiwiaW1wb3J0IHtleHRlbmR9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJEZWNvcmF0b3IoJ2lubGluZScsIGZ1bmN0aW9uKGZuLCBwcm9wcywgY29udGFpbmVyLCBvcHRpb25zKSB7XG4gICAgbGV0IHJldCA9IGZuO1xuICAgIGlmICghcHJvcHMucGFydGlhbHMpIHtcbiAgICAgIHByb3BzLnBhcnRpYWxzID0ge307XG4gICAgICByZXQgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBwYXJ0aWFscyBzdGFjayBmcmFtZSBwcmlvciB0byBleGVjLlxuICAgICAgICBsZXQgb3JpZ2luYWwgPSBjb250YWluZXIucGFydGlhbHM7XG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IGV4dGVuZCh7fSwgb3JpZ2luYWwsIHByb3BzLnBhcnRpYWxzKTtcbiAgICAgICAgbGV0IHJldCA9IGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcmlnaW5hbDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvcHMucGFydGlhbHNbb3B0aW9ucy5hcmdzWzBdXSA9IG9wdGlvbnMuZm47XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiIsIlxuY29uc3QgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIGxldCBsb2MgPSBub2RlICYmIG5vZGUubG9jLFxuICAgICAgbGluZSxcbiAgICAgIGNvbHVtbjtcbiAgaWYgKGxvYykge1xuICAgIGxpbmUgPSBsb2Muc3RhcnQubGluZTtcbiAgICBjb2x1bW4gPSBsb2Muc3RhcnQuY29sdW1uO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBjb2x1bW47XG4gIH1cblxuICBsZXQgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRXhjZXB0aW9uKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKGxvYykge1xuICAgICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcblxuICAgICAgLy8gV29yayBhcm91bmQgaXNzdWUgdW5kZXIgc2FmYXJpIHdoZXJlIHdlIGNhbid0IGRpcmVjdGx5IHNldCB0aGUgY29sdW1uIHZhbHVlXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NvbHVtbicsIHt2YWx1ZTogY29sdW1ufSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKG5vcCkge1xuICAgIC8qIElnbm9yZSBpZiB0aGUgYnJvd3NlciBpcyB2ZXJ5IHBhcnRpY3VsYXIgKi9cbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4Y2VwdGlvbjtcbiIsImltcG9ydCByZWdpc3RlckJsb2NrSGVscGVyTWlzc2luZyBmcm9tICcuL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcnO1xuaW1wb3J0IHJlZ2lzdGVyRWFjaCBmcm9tICcuL2hlbHBlcnMvZWFjaCc7XG5pbXBvcnQgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nIGZyb20gJy4vaGVscGVycy9oZWxwZXItbWlzc2luZyc7XG5pbXBvcnQgcmVnaXN0ZXJJZiBmcm9tICcuL2hlbHBlcnMvaWYnO1xuaW1wb3J0IHJlZ2lzdGVyTG9nIGZyb20gJy4vaGVscGVycy9sb2cnO1xuaW1wb3J0IHJlZ2lzdGVyTG9va3VwIGZyb20gJy4vaGVscGVycy9sb29rdXAnO1xuaW1wb3J0IHJlZ2lzdGVyV2l0aCBmcm9tICcuL2hlbHBlcnMvd2l0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVyQmxvY2tIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJFYWNoKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJJZihpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyTG9nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJMb29rdXAoaW5zdGFuY2UpO1xuICByZWdpc3RlcldpdGgoaW5zdGFuY2UpO1xufVxuIiwiaW1wb3J0IHthcHBlbmRDb250ZXh0UGF0aCwgY3JlYXRlRnJhbWUsIGlzQXJyYXl9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSxcbiAgICAgICAgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZiAoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmlkcykge1xuICAgICAgICAgIG9wdGlvbnMuaWRzID0gW29wdGlvbnMubmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLm5hbWUpO1xuICAgICAgICBvcHRpb25zID0ge2RhdGE6IGRhdGF9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7YXBwZW5kQ29udGV4dFBhdGgsIGJsb2NrUGFyYW1zLCBjcmVhdGVGcmFtZSwgaXNBcnJheSwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ011c3QgcGFzcyBpdGVyYXRvciB0byAjZWFjaCcpO1xuICAgIH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm4sXG4gICAgICAgIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICByZXQgPSAnJyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29udGV4dFBhdGg7XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICBjb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pICsgJy4nO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWNJdGVyYXRpb24oZmllbGQsIGluZGV4LCBsYXN0KSB7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBkYXRhLmtleSA9IGZpZWxkO1xuICAgICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGRhdGEuZmlyc3QgPSBpbmRleCA9PT0gMDtcbiAgICAgICAgZGF0YS5sYXN0ID0gISFsYXN0O1xuXG4gICAgICAgIGlmIChjb250ZXh0UGF0aCkge1xuICAgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aCArIGZpZWxkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbZmllbGRdLCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dFtmaWVsZF0sIGZpZWxkXSwgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29udGV4dC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJpb3JLZXk7XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBydW5uaW5nIHRoZSBpdGVyYXRpb25zIG9uZSBzdGVwIG91dCBvZiBzeW5jIHNvIHdlIGNhbiBkZXRlY3RcbiAgICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcbiAgICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuXG4gICAgICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvcktleSA9IGtleTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiIsImltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbigvKiBbYXJncywgXW9wdGlvbnMgKi8pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gQSBtaXNzaW5nIGZpZWxkIGluIGEge3tmb299fSBjb25zdHJ1Y3QuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb21lb25lIGlzIGFjdHVhbGx5IHRyeWluZyB0byBjYWxsIHNvbWV0aGluZywgYmxvdyB1cC5cbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ01pc3NpbmcgaGVscGVyOiBcIicgKyBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdLm5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHtpc0VtcHR5LCBpc0Z1bmN0aW9ufSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7IGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTsgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG4gICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cbiAgICBpZiAoKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsKSB8fCBpc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNofSk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKC8qIG1lc3NhZ2UsIG9wdGlvbnMgKi8pIHtcbiAgICBsZXQgYXJncyA9IFt1bmRlZmluZWRdLFxuICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cblxuICAgIGxldCBsZXZlbCA9IDE7XG4gICAgaWYgKG9wdGlvbnMuaGFzaC5sZXZlbCAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IG9wdGlvbnMuaGFzaC5sZXZlbDtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCkge1xuICAgICAgbGV2ZWwgPSBvcHRpb25zLmRhdGEubGV2ZWw7XG4gICAgfVxuICAgIGFyZ3NbMF0gPSBsZXZlbDtcblxuICAgIGluc3RhbmNlLmxvZyguLi4gYXJncyk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvb2t1cCcsIGZ1bmN0aW9uKG9iaiwgZmllbGQpIHtcbiAgICByZXR1cm4gb2JqICYmIG9ialtmaWVsZF07XG4gIH0pO1xufVxuIiwiaW1wb3J0IHthcHBlbmRDb250ZXh0UGF0aCwgYmxvY2tQYXJhbXMsIGNyZWF0ZUZyYW1lLCBpc0VtcHR5LCBpc0Z1bmN0aW9ufSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoIWlzRW1wdHkoY29udGV4dCkpIHtcbiAgICAgIGxldCBkYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuICAgICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm4oY29udGV4dCwge1xuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBibG9ja1BhcmFtczogYmxvY2tQYXJhbXMoW2NvbnRleHRdLCBbZGF0YSAmJiBkYXRhLmNvbnRleHRQYXRoXSlcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQge2luZGV4T2Z9IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IFsnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10sXG4gIGxldmVsOiAnaW5mbycsXG5cbiAgLy8gTWFwcyBhIGdpdmVuIGxldmVsIHZhbHVlIHRvIHRoZSBgbWV0aG9kTWFwYCBpbmRleGVzIGFib3ZlLlxuICBsb29rdXBMZXZlbDogZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBpZiAodHlwZW9mIGxldmVsID09PSAnc3RyaW5nJykge1xuICAgICAgbGV0IGxldmVsTWFwID0gaW5kZXhPZihsb2dnZXIubWV0aG9kTWFwLCBsZXZlbC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIGlmIChsZXZlbE1hcCA+PSAwKSB7XG4gICAgICAgIGxldmVsID0gbGV2ZWxNYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXZlbCA9IHBhcnNlSW50KGxldmVsLCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxldmVsO1xuICB9LFxuXG4gIC8vIENhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIC4uLm1lc3NhZ2UpIHtcbiAgICBsZXZlbCA9IGxvZ2dlci5sb29rdXBMZXZlbChsZXZlbCk7XG5cbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGxvZ2dlci5sb29rdXBMZXZlbChsb2dnZXIubGV2ZWwpIDw9IGxldmVsKSB7XG4gICAgICBsZXQgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kXSkgeyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICBtZXRob2QgPSAnbG9nJztcbiAgICAgIH1cbiAgICAgIGNvbnNvbGVbbWV0aG9kXSguLi5tZXNzYWdlKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iLCIvKiBnbG9iYWwgd2luZG93ICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihIYW5kbGViYXJzKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGxldCByb290ID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3csXG4gICAgICAkSGFuZGxlYmFycyA9IHJvb3QuSGFuZGxlYmFycztcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgSGFuZGxlYmFycy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJvb3QuSGFuZGxlYmFycyA9PT0gSGFuZGxlYmFycykge1xuICAgICAgcm9vdC5IYW5kbGViYXJzID0gJEhhbmRsZWJhcnM7XG4gICAgfVxuICAgIHJldHVybiBIYW5kbGViYXJzO1xuICB9O1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7IENPTVBJTEVSX1JFVklTSU9OLCBSRVZJU0lPTl9DSEFOR0VTLCBjcmVhdGVGcmFtZSB9IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICBjb25zdCBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIGNvbnN0IHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIHJ1bnRpbWVWZXJzaW9ucyArICcpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVyVmVyc2lvbnMgKyAnKS4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVySW5mb1sxXSArICcpLicpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGUnKTtcbiAgfVxuICBpZiAoIXRlbXBsYXRlU3BlYyB8fCAhdGVtcGxhdGVTcGVjLm1haW4pIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbmtub3duIHRlbXBsYXRlIG9iamVjdDogJyArIHR5cGVvZiB0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgdGVtcGxhdGVTcGVjLm1haW4uZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjLm1haW5fZDtcblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICBlbnYuVk0uY2hlY2tSZXZpc2lvbih0ZW1wbGF0ZVNwZWMuY29tcGlsZXIpO1xuXG4gIGZ1bmN0aW9uIGludm9rZVBhcnRpYWxXcmFwcGVyKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgICBjb250ZXh0ID0gVXRpbHMuZXh0ZW5kKHt9LCBjb250ZXh0LCBvcHRpb25zLmhhc2gpO1xuICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIG9wdGlvbnMuaWRzWzBdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJ0aWFsID0gZW52LlZNLnJlc29sdmVQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG4gICAgbGV0IHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwgJiYgZW52LmNvbXBpbGUpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHRlbXBsYXRlU3BlYy5jb21waWxlck9wdGlvbnMsIGVudik7XG4gICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMuaW5kZW50KSB7XG4gICAgICAgIGxldCBsaW5lcyA9IHJlc3VsdC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFsaW5lc1tpXSAmJiBpICsgMSA9PT0gbCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGluZXNbaV0gPSBvcHRpb25zLmluZGVudCArIGxpbmVzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZScpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIGxldCBjb250YWluZXIgPSB7XG4gICAgc3RyaWN0OiBmdW5jdGlvbihvYmosIG5hbWUpIHtcbiAgICAgIGlmICghKG5hbWUgaW4gb2JqKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdcIicgKyBuYW1lICsgJ1wiIG5vdCBkZWZpbmVkIGluICcgKyBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9ialtuYW1lXTtcbiAgICB9LFxuICAgIGxvb2t1cDogZnVuY3Rpb24oZGVwdGhzLCBuYW1lKSB7XG4gICAgICBjb25zdCBsZW4gPSBkZXB0aHMubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZGVwdGhzW2ldICYmIGRlcHRoc1tpXVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcHRoc1tpXVtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbGFtYmRhOiBmdW5jdGlvbihjdXJyZW50LCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicgPyBjdXJyZW50LmNhbGwoY29udGV4dCkgOiBjdXJyZW50O1xuICAgIH0sXG5cbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuXG4gICAgZm46IGZ1bmN0aW9uKGkpIHtcbiAgICAgIGxldCByZXQgPSB0ZW1wbGF0ZVNwZWNbaV07XG4gICAgICByZXQuZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjW2kgKyAnX2QnXTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgICBsZXQgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldLFxuICAgICAgICAgIGZuID0gdGhpcy5mbihpKTtcbiAgICAgIGlmIChkYXRhIHx8IGRlcHRocyB8fCBibG9ja1BhcmFtcyB8fCBkZWNsYXJlZEJsb2NrUGFyYW1zKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG5cbiAgICBkYXRhOiBmdW5jdGlvbih2YWx1ZSwgZGVwdGgpIHtcbiAgICAgIHdoaWxlICh2YWx1ZSAmJiBkZXB0aC0tKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICBsZXQgb2JqID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICBvYmogPSBVdGlscy5leHRlbmQoe30sIGNvbW1vbiwgcGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG5cbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IHRlbXBsYXRlU3BlYy5jb21waWxlclxuICB9O1xuXG4gIGZ1bmN0aW9uIHJldChjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIHJldC5fc2V0dXAob3B0aW9ucyk7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwgJiYgdGVtcGxhdGVTcGVjLnVzZURhdGEpIHtcbiAgICAgIGRhdGEgPSBpbml0RGF0YShjb250ZXh0LCBkYXRhKTtcbiAgICB9XG4gICAgbGV0IGRlcHRocyxcbiAgICAgICAgYmxvY2tQYXJhbXMgPSB0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgPyBbXSA6IHVuZGVmaW5lZDtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocykge1xuICAgICAgaWYgKG9wdGlvbnMuZGVwdGhzKSB7XG4gICAgICAgIGRlcHRocyA9IGNvbnRleHQgIT0gb3B0aW9ucy5kZXB0aHNbMF0gPyBbY29udGV4dF0uY29uY2F0KG9wdGlvbnMuZGVwdGhzKSA6IG9wdGlvbnMuZGVwdGhzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVwdGhzID0gW2NvbnRleHRdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1haW4oY29udGV4dC8qLCBvcHRpb25zKi8pIHtcbiAgICAgIHJldHVybiAnJyArIHRlbXBsYXRlU3BlYy5tYWluKGNvbnRhaW5lciwgY29udGV4dCwgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscywgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG4gICAgfVxuICAgIG1haW4gPSBleGVjdXRlRGVjb3JhdG9ycyh0ZW1wbGF0ZVNwZWMubWFpbiwgbWFpbiwgY29udGFpbmVyLCBvcHRpb25zLmRlcHRocyB8fCBbXSwgZGF0YSwgYmxvY2tQYXJhbXMpO1xuICAgIHJldHVybiBtYWluKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldC5pc1RvcCA9IHRydWU7XG5cbiAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5oZWxwZXJzLCBlbnYuaGVscGVycyk7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCkge1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5wYXJ0aWFscywgZW52LnBhcnRpYWxzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCB8fCB0ZW1wbGF0ZVNwZWMudXNlRGVjb3JhdG9ycykge1xuICAgICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmRlY29yYXRvcnMsIGVudi5kZWNvcmF0b3JzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBvcHRpb25zLmRlY29yYXRvcnM7XG4gICAgfVxuICB9O1xuXG4gIHJldC5fY2hpbGQgPSBmdW5jdGlvbihpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyAmJiAhYmxvY2tQYXJhbXMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ211c3QgcGFzcyBibG9jayBwYXJhbXMnKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMgJiYgIWRlcHRocykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIHBhcmVudCBkZXB0aHMnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCB0ZW1wbGF0ZVNwZWNbaV0sIGRhdGEsIDAsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICB9O1xuICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCBmbiwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuICBmdW5jdGlvbiBwcm9nKGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBjdXJyZW50RGVwdGhzID0gZGVwdGhzO1xuICAgIGlmIChkZXB0aHMgJiYgY29udGV4dCAhPSBkZXB0aHNbMF0pIHtcbiAgICAgIGN1cnJlbnREZXB0aHMgPSBbY29udGV4dF0uY29uY2F0KGRlcHRocyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZuKGNvbnRhaW5lcixcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscyxcbiAgICAgICAgb3B0aW9ucy5kYXRhIHx8IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zICYmIFtvcHRpb25zLmJsb2NrUGFyYW1zXS5jb25jYXQoYmxvY2tQYXJhbXMpLFxuICAgICAgICBjdXJyZW50RGVwdGhzKTtcbiAgfVxuXG4gIHByb2cgPSBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKTtcblxuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gZGVwdGhzID8gZGVwdGhzLmxlbmd0aCA6IDA7XG4gIHByb2cuYmxvY2tQYXJhbXMgPSBkZWNsYXJlZEJsb2NrUGFyYW1zIHx8IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIXBhcnRpYWwpIHtcbiAgICBpZiAob3B0aW9ucy5uYW1lID09PSAnQHBhcnRpYWwtYmxvY2snKSB7XG4gICAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHdoaWxlIChkYXRhWydwYXJ0aWFsLWJsb2NrJ10gPT09IG5vb3ApIHtcbiAgICAgICAgZGF0YSA9IGRhdGEuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHBhcnRpYWwgPSBkYXRhWydwYXJ0aWFsLWJsb2NrJ107XG4gICAgICBkYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBub29wO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdO1xuICAgIH1cbiAgfSBlbHNlIGlmICghcGFydGlhbC5jYWxsICYmICFvcHRpb25zLm5hbWUpIHtcbiAgICAvLyBUaGlzIGlzIGEgZHluYW1pYyBwYXJ0aWFsIHRoYXQgcmV0dXJuZWQgYSBzdHJpbmdcbiAgICBvcHRpb25zLm5hbWUgPSBwYXJ0aWFsO1xuICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW3BhcnRpYWxdO1xuICB9XG4gIHJldHVybiBwYXJ0aWFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMucGFydGlhbCA9IHRydWU7XG4gIGlmIChvcHRpb25zLmlkcykge1xuICAgIG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCA9IG9wdGlvbnMuaWRzWzBdIHx8IG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aDtcbiAgfVxuXG4gIGxldCBwYXJ0aWFsQmxvY2s7XG4gIGlmIChvcHRpb25zLmZuICYmIG9wdGlvbnMuZm4gIT09IG5vb3ApIHtcbiAgICBvcHRpb25zLmRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIHBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChwYXJ0aWFsQmxvY2sucGFydGlhbHMpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHMgPSBVdGlscy5leHRlbmQoe30sIG9wdGlvbnMucGFydGlhbHMsIHBhcnRpYWxCbG9jay5wYXJ0aWFscyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFsQmxvY2spIHtcbiAgICBwYXJ0aWFsID0gcGFydGlhbEJsb2NrO1xuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1RoZSBwYXJ0aWFsICcgKyBvcHRpb25zLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICB9IGVsc2UgaWYgKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gJyc7IH1cblxuZnVuY3Rpb24gaW5pdERhdGEoY29udGV4dCwgZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgISgncm9vdCcgaW4gZGF0YSkpIHtcbiAgICBkYXRhID0gZGF0YSA/IGNyZWF0ZUZyYW1lKGRhdGEpIDoge307XG4gICAgZGF0YS5yb290ID0gY29udGV4dDtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcykge1xuICBpZiAoZm4uZGVjb3JhdG9yKSB7XG4gICAgbGV0IHByb3BzID0ge307XG4gICAgcHJvZyA9IGZuLmRlY29yYXRvcihwcm9nLCBwcm9wcywgY29udGFpbmVyLCBkZXB0aHMgJiYgZGVwdGhzWzBdLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcbiAgICBVdGlscy5leHRlbmQocHJvZywgcHJvcHMpO1xuICB9XG4gIHJldHVybiBwcm9nO1xufVxuIiwiLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IFNhZmVTdHJpbmcucHJvdG90eXBlLnRvSFRNTCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJycgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNhZmVTdHJpbmc7XG4iLCJjb25zdCBlc2NhcGUgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmI3gyNzsnLFxuICAnYCc6ICcmI3g2MDsnLFxuICAnPSc6ICcmI3gzRDsnXG59O1xuXG5jb25zdCBiYWRDaGFycyA9IC9bJjw+XCInYD1dL2csXG4gICAgICBwb3NzaWJsZSA9IC9bJjw+XCInYD1dLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKG9iai8qICwgLi4uc291cmNlICovKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFyZ3VtZW50c1tpXSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcmd1bWVudHNbaV0sIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnQgbGV0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1zdHlsZSAqL1xubGV0IGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbmV4cG9ydCB7aXNGdW5jdGlvbn07XG4vKiBlc2xpbnQtZW5hYmxlIGZ1bmMtc3R5bGUgKi9cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5cbi8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICAgIGlmIChzdHJpbmcgJiYgc3RyaW5nLnRvSFRNTCkge1xuICAgICAgcmV0dXJuIHN0cmluZy50b0hUTUwoKTtcbiAgICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nICsgJyc7XG4gICAgfVxuXG4gICAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gICAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gICAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG4gIH1cblxuICBpZiAoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9iamVjdCkge1xuICBsZXQgZnJhbWUgPSBleHRlbmQoe30sIG9iamVjdCk7XG4gIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG4gIHJldHVybiBmcmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NrUGFyYW1zKHBhcmFtcywgaWRzKSB7XG4gIHBhcmFtcy5wYXRoID0gaWRzO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG4gIHJldHVybiAoY29udGV4dFBhdGggPyBjb250ZXh0UGF0aCArICcuJyA6ICcnKSArIGlkO1xufVxuIiwiLy8gQ3JlYXRlIGEgc2ltcGxlIHBhdGggYWxpYXMgdG8gYWxsb3cgYnJvd3NlcmlmeSB0byByZXNvbHZlXG4vLyB0aGUgcnVudGltZSBvbiBhIHN1cHBvcnRlZCBwYXRoLlxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZScpWydkZWZhdWx0J107XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIilbXCJkZWZhdWx0XCJdO1xuIl0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMMjV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2YVc1a1pYZ3Vhbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2Ylc5a2RXeGxjeTloWW05MWRDMXplWE4wWlcwdmFXNWtaWGd1YW5NaUxDSnpjbU12ZG1sbGQzTXZhVzVrWlhndmJXOWtkV3hsY3k5aVlYTnBZeTlwYm1SbGVDNXFjeUlzSW5OeVl5OTJhV1YzY3k5cGJtUmxlQzl0YjJSMWJHVnpMMlY0Y0dWeWFXVnVZMlV0ZDI5eWEzTXZhVzVrWlhndWFuTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZiVzlrZFd4bGN5OWxlSEJsY21sbGJtTmxMMmx1WkdWNExtcHpJaXdpYzNKakwzWnBaWGR6TDJsdVpHVjRMMjF2WkhWc1pYTXZaWGh3WlhKcFpXNWpaUzkwWVdJdFkyOXVkR1Z1ZEM1b1luTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZiVzlrZFd4bGN5OWxlSEJsY21sbGJtTmxMM1JoWWkxdVlYWXVhR0p6SWl3aWMzSmpMM1pwWlhkekwybHVaR1Y0TDIxdlpIVnNaWE12Wm1GMmFXTnZiaTltWVhacFkyOXVMbWhpY3lJc0luTnlZeTkyYVdWM2N5OXBibVJsZUM5dGIyUjFiR1Z6TDJaaGRtbGpiMjR2YVc1a1pYZ3Vhbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2Ylc5a2RXeGxjeTl1WVhZdllYQndMVzVoZGk1b1luTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZiVzlrZFd4bGN5OXVZWFl2YVc1a1pYZ3Vhbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2Ylc5a2RXeGxjeTl3ZFdKc2FXTXZZbXh2WTJzdFkyOXVkR1Z1ZEM1b1luTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZiVzlrZFd4bGN5OXdkV0pzYVdNdllteHZZMnN0YkdsemRDNW9Zbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2Ylc5a2RXeGxjeTl3ZFdKc2FXTXZkMjl5YTNNdGJHbHpkQzVvWW5NaUxDSnpjbU12ZG1sbGQzTXZhVzVrWlhndmJXOWtkV3hsY3k5M2IzSnJjeTlwYm1SbGVDNXFjeUlzSW5OeVl5OTJhV1YzY3k5cGJtUmxlQzl6WlhKMmFXTmxMMkpoYVd0bExYTjFiVzFoY25rdWFuTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZjMlZ5ZG1salpTOWlZWE5wWXk1cWN5SXNJbk55WXk5MmFXVjNjeTlwYm1SbGVDOXpaWEoyYVdObEwySnNiMk5yTG1weklpd2ljM0pqTDNacFpYZHpMMmx1WkdWNEwzTmxjblpwWTJVdlpYaHdaWEpwWlc1alpTNXFjeUlzSW5OeVl5OTJhV1YzY3k5cGJtUmxlQzl6WlhKMmFXTmxMM2R2Y210ekxtcHpJaXdpTGk0dmJtOWtaVjl0YjJSMWJHVnpMMmhoYm1Sc1pXSmhjbk12YkdsaUwyaGhibVJzWldKaGNuTXVjblZ1ZEdsdFpTNXFjeUlzSWk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlvWVc1a2JHVmlZWEp6TDJ4cFlpOW9ZVzVrYkdWaVlYSnpMMkpoYzJVdWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZhR0Z1Wkd4bFltRnljeTlzYVdJdmFHRnVaR3hsWW1GeWN5OWtaV052Y21GMGIzSnpMbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDJoaGJtUnNaV0poY25NdmJHbGlMMmhoYm1Sc1pXSmhjbk12WkdWamIzSmhkRzl5Y3k5cGJteHBibVV1YW5NaUxDSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmFHRnVaR3hsWW1GeWN5OXNhV0l2YUdGdVpHeGxZbUZ5Y3k5bGVHTmxjSFJwYjI0dWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZhR0Z1Wkd4bFltRnljeTlzYVdJdmFHRnVaR3hsWW1GeWN5OW9aV3h3WlhKekxtcHpJaXdpTGk0dmJtOWtaVjl0YjJSMWJHVnpMMmhoYm1Sc1pXSmhjbk12YkdsaUwyaGhibVJzWldKaGNuTXZhR1ZzY0dWeWN5OWliRzlqYXkxb1pXeHdaWEl0YldsemMybHVaeTVxY3lJc0lpNHVMMjV2WkdWZmJXOWtkV3hsY3k5b1lXNWtiR1ZpWVhKekwyeHBZaTlvWVc1a2JHVmlZWEp6TDJobGJIQmxjbk12WldGamFDNXFjeUlzSWk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlvWVc1a2JHVmlZWEp6TDJ4cFlpOW9ZVzVrYkdWaVlYSnpMMmhsYkhCbGNuTXZhR1ZzY0dWeUxXMXBjM05wYm1jdWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZhR0Z1Wkd4bFltRnljeTlzYVdJdmFHRnVaR3hsWW1GeWN5OW9aV3h3WlhKekwybG1MbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDJoaGJtUnNaV0poY25NdmJHbGlMMmhoYm1Sc1pXSmhjbk12YUdWc2NHVnljeTlzYjJjdWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZhR0Z1Wkd4bFltRnljeTlzYVdJdmFHRnVaR3hsWW1GeWN5OW9aV3h3WlhKekwyeHZiMnQxY0M1cWN5SXNJaTR1TDI1dlpHVmZiVzlrZFd4bGN5OW9ZVzVrYkdWaVlYSnpMMnhwWWk5b1lXNWtiR1ZpWVhKekwyaGxiSEJsY25NdmQybDBhQzVxY3lJc0lpNHVMMjV2WkdWZmJXOWtkV3hsY3k5b1lXNWtiR1ZpWVhKekwyeHBZaTlvWVc1a2JHVmlZWEp6TDJ4dloyZGxjaTVxY3lJc0lpNHVMMjV2WkdWZmJXOWtkV3hsY3k5b1lXNWtiR1ZpWVhKekwyUnBjM1F2WTJwekwyNXZaR1ZmYlc5a2RXeGxjeTlvWVc1a2JHVmlZWEp6TDJ4cFlpOW9ZVzVrYkdWaVlYSnpMMjV2TFdOdmJtWnNhV04wTG1weklpd2lMaTR2Ym05a1pWOXRiMlIxYkdWekwyaGhibVJzWldKaGNuTXZiR2xpTDJoaGJtUnNaV0poY25NdmNuVnVkR2x0WlM1cWN5SXNJaTR1TDI1dlpHVmZiVzlrZFd4bGN5OW9ZVzVrYkdWaVlYSnpMMnhwWWk5b1lXNWtiR1ZpWVhKekwzTmhabVV0YzNSeWFXNW5MbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDJoaGJtUnNaV0poY25NdmJHbGlMMmhoYm1Sc1pXSmhjbk12ZFhScGJITXVhbk1pTENJdUxpOXViMlJsWDIxdlpIVnNaWE12YUdGdVpHeGxZbUZ5Y3k5eWRXNTBhVzFsTG1weklpd2lMaTR2Ym05a1pWOXRiMlIxYkdWekwyaGljMlo1TDNKMWJuUnBiV1V1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPenRCUTBGQkxFbEJRVWtzV1VGQldTeFJRVUZSTEdWQlFWSXNRMEZCYUVJN08wRkJSVUVzU1VGQlNTeHRRa0ZCYlVJc1VVRkJVU3h6UWtGQlVpeERRVUYyUWpzN1FVRkZRU3hKUVVGSkxHTkJRV01zVVVGQlVTeHBRa0ZCVWl4RFFVRnNRanM3UVVGRlFTeEpRVUZKTEdWQlFXVXNVVUZCVVN4M1FrRkJVaXhEUVVGdVFqczdRVUZGUVN4SlFVRkpMR3RDUVVGclFpeFJRVUZSTEdsQ1FVRlNMRU5CUVhSQ096dEJRVVZCTEVsQlFVa3NaMEpCUVdkQ0xGRkJRVkVzYlVKQlFWSXNRMEZCY0VJN08wRkJSVUU3T3p0QlFVZEJMR05CUVdNc1RVRkJaQ3hEUVVGeFFpeEhRVUZITEd0Q1FVRklMRU5CUVhKQ08wRkJRMEVzVFVGQlRTeFZRVUZPTEVOQlFXbENMRTFCUVdwQ0xFVkJRWGxDTEZWQlFWTXNTVUZCVkN4RlFVRmxPMEZCUTNCRExHZENRVUZqTEUxQlFXUXNRMEZCY1VJc1IwRkJSeXhyUWtGQlNDeERRVUZ5UWp0QlFVTklMRU5CUmtRN08wRkJTVUU3T3p0QlFVZEJMRlZCUVZVc1RVRkJWanM3UVVGRlFUczdPMEZCUjBFc1owSkJRV2RDTEUxQlFXaENPenRCUVVWQk96czdRVUZIUVN4cFFrRkJhVUlzVFVGQmFrSTdPMEZCUlVFN096dEJRVWRCTEZsQlFWa3NUVUZCV2pzN1FVRkZRVHM3TzBGQlIwRXNZVUZCWVN4TlFVRmlPenM3T3p0QlF6TkRRU3hKUVVGSkxHMUNRVUZ0UWl4UlFVRlJMRFpDUVVGU0xFTkJRWFpDT3p0QlFVVkJMRWxCUVVrc1dVRkJXU3hSUVVGUkxIRkNRVUZTTEVOQlFXaENPenRCUVVWQkxFOUJRVThzVDBGQlVDeEhRVUZwUWp0QlFVTmlMRmxCUVZFc2EwSkJRVmM3UVVGRFppeGxRVUZQTEVWQlFVVXNUMEZCUml4RFFVRlZMRlZCUVZNc1QwRkJWQ3hGUVVGclFpeE5RVUZzUWl4RlFVRXdRanRCUVVOMlF5eHpRa0ZCVlN4alFVRldMRWRCUVRKQ0xFbEJRVE5DTEVOQlFXZERMRlZCUVZNc1NVRkJWQ3hGUVVGbE8wRkJRek5ETEcxQ1FVRkhMR2RDUVVGSUxFVkJRWEZDTEUxQlFYSkNMRU5CUVRSQ0xHbENRVUZwUWl4SlFVRnFRaXhEUVVFMVFqdEJRVU5JTEdGQlJrUTdPMEZCU1VFc2MwSkJRVlVzV1VGQlZpeEhRVUY1UWl4SlFVRjZRaXhEUVVFNFFpeFZRVUZUTEVsQlFWUXNSVUZCWlR0QlFVTjZReXh0UWtGQlJ5eHJRa0ZCU0N4RlFVRjFRaXhOUVVGMlFpeERRVUU0UWl4cFFrRkJhVUlzU1VGQmFrSXNRMEZCT1VJN1FVRkRTQ3hoUVVaRU96dEJRVWxCTEd0Q1FVRk5MRlZCUVU0c1EwRkJhVUlzVFVGQmFrSXNSVUZCZVVJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRGNFTXNNRUpCUVZVc1dVRkJWaXhIUVVGNVFpeEpRVUY2UWl4RFFVRTRRaXhWUVVGVExFbEJRVlFzUlVGQlpUdEJRVU42UXl4MVFrRkJSeXhyUWtGQlNDeEZRVUYxUWl4TlFVRjJRaXhEUVVFNFFpeHBRa0ZCYVVJc1NVRkJha0lzUTBGQk9VSTdRVUZEU0N4cFFrRkdSRHRCUVVkSUxHRkJTa1E3TzBGQlRVRTdRVUZEU0N4VFFXaENUU3hEUVVGUU8wRkJhVUpJTzBGQmJrSlpMRU5CUVdwQ096czdPenRCUTBwQkxFbEJRVWtzVVVGQlVTeFJRVUZSTEhGQ1FVRlNMRU5CUVZvN08wRkJSVUVzU1VGQlNTeFpRVUZaTEZGQlFWRXNNRUpCUVZJc1EwRkJhRUk3TzBGQlJVRXNTVUZCU1N4blFrRkJaMElzVVVGQlVTeFpRVUZTTEVOQlFYQkNPenRCUVVWQkxFOUJRVThzVDBGQlVDeEhRVUZwUWp0QlFVTmlMRmxCUVZFc2EwSkJRVmM3UVVGRFppeGxRVUZQTEVWQlFVVXNUMEZCUml4RFFVRlZMRlZCUVZNc1QwRkJWQ3hGUVVGclFpeE5RVUZzUWl4RlFVRXdRanRCUVVOMlF5eHJRa0ZCVFN4VlFVRk9MRU5CUVdsQ0xFOUJRV3BDTEVWQlFUQkNMRlZCUVZNc1NVRkJWQ3hGUVVGbE8wRkJRM0pETEhOQ1FVRk5MRlZCUVU0c1IwRkJiVUlzU1VGQmJrSXNRMEZCZDBJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRGJrTXNkVUpCUVVjc1pVRkJTQ3hGUVVGdlFpeE5RVUZ3UWl4RFFVRXlRaXhWUVVGVkxFbEJRVllzUTBGQk0wSTdRVUZEU0N4cFFrRkdSRHM3UVVGSlFUczdPMEZCUjBFc09FSkJRV01zVFVGQlpDeERRVUZ4UWl4SFFVRkhMR1ZCUVVnc1EwRkJja0k3UVVGRFNDeGhRVlJFT3p0QlFWZEJPMEZCUTBnc1UwRmlUU3hEUVVGUU8wRkJZMGc3UVVGb1Fsa3NRMEZCYWtJN096czdPMEZEVGtFc1NVRkJTU3hqUVVGakxGRkJRVkVzY1VKQlFWSXNRMEZCYkVJN08wRkJSVUVzU1VGQlNTeG5Ra0ZCWjBJc1VVRkJVU3d3UWtGQlVpeERRVUZ3UWpzN1FVRkZRU3hQUVVGUExFOUJRVkFzUjBGQmFVSTdRVUZEWWl4WlFVRlJMR3RDUVVGWE8wRkJRMllzWlVGQlR5eEZRVUZGTEU5QlFVWXNRMEZCVlN4VlFVRlRMRTlCUVZRc1JVRkJhMElzVFVGQmJFSXNSVUZCTUVJN08wRkJSWFpETzBGQlEwRXNhMEpCUVUwc1ZVRkJUaXhEUVVGcFFpeHBRa0ZCYWtJc1JVRkJiME1zVlVGQlV5eEpRVUZVTEVWQlFXVTdPMEZCUlM5RExHOUNRVUZKTEZWQlFWVXNTMEZCU3l4TFFVRk1MRU5CUVZjc1NVRkJla0k3TzBGQlJVRXNORUpCUVZrc1lVRkJXaXhEUVVFd1FpeFBRVUV4UWl4RlFVRnRReXhKUVVGdVF5eERRVUYzUXl4VlFVRlRMRWxCUVZRc1JVRkJaVHRCUVVOdVJDeDNRa0ZCU1N4cFFrRkJhVUk3UVVGRGFrSXNaME5CUVZFc1kwRkVVenRCUVVWcVFpeG5RMEZCVVN4cFFrRkdVenRCUVVkcVFpeG5RMEZCVVR0QlFVaFRMSEZDUVVGeVFqdEJRVXRCTEhWQ1FVRkhMSEZDUVVGSUxFVkJRVEJDTEVsQlFURkNMRU5CUVN0Q0xHVkJRV1VzVDBGQlppeERRVUV2UWpzN1FVRkhRU3gxUWtGQlJ5eHBRa0ZCU0N4RlFVTkxMRWxCUkV3c1EwRkRWU3hqUVVGakxFbEJRV1FzUTBGRVZpeEZRVVZMTEVsQlJrd3NRMEZGVlN4VlFVWldMRVZCUjBzc1VVRklUQ3hEUVVkakxHTkJTR1FzUlVGSlN5eEpRVXBNTEVOQlNWVXNZMEZLVml4RlFVdExMRTFCVEV3c1EwRkxXU3dyUWtGTVdqczdRVUZQUVN3d1FrRkJUU3hyUWtGQlRpeERRVUY1UWl4UFFVRjZRanM3UVVGRlFTd3dRa0ZCVFN4TlFVRk9MRU5CUVdFc2JVSkJRV0lzUlVGQmEwTTdRVUZET1VJc2RVTkJRV1VzUzBGRVpUdEJRVVU1UWl4eFEwRkJZU3hKUVVacFFqdEJRVWM1UWl4dlEwRkJXU3h2UWtGSWEwSTdRVUZKT1VJN1FVRkRRU3gxUTBGQlpTeE5RVXhsTzBGQlRUbENMSGREUVVGblFqdEJRVTVqTEhGQ1FVRnNRenM3UVVGVlFTeDFRa0ZCUnl4aFFVRklMRVZCUVd0Q0xFVkJRV3hDTEVOQlFYRkNMRTlCUVhKQ0xFVkJRVGhDTEZsQlFWYzdRVUZEY2tNc05FSkJRVWtzVTBGQlV5eEhRVUZITEVsQlFVZ3NRMEZCWWpzN1FVRkZRU3h2UTBGQldTeFBRVUZhTEVOQlFXOUNMRTlCUVU4c1NVRkJVQ3hEUVVGWkxGTkJRVm9zUTBGQmNFSXNSVUZCTkVNc1NVRkJOVU1zUTBGQmFVUXNWVUZCVXl4SlFVRlVMRVZCUVdVN1FVRkROVVFzYTBOQlFVMHNXVUZCVGl4RFFVRnRRanRCUVVObUxIZERRVUZSTEV0QlFVc3NTVUZFUlR0QlFVVm1MRFpEUVVGaExFbEJSa1U3UVVGSFppeDFRMEZCVHl4TlFVaFJPMEZCU1dZc09FTkJRV003UVVGS1F5dzJRa0ZCYmtJc1JVRkxSeXhKUVV4SU8wRkJUVWdzZVVKQlVFUTdRVUZUU0N4eFFrRmFSRHRCUVdGSUxHbENRWHBEUkR0QlFUQkRTQ3hoUVRsRFJEdEJRU3REUVR0QlFVTklMRk5CYmtSTkxFTkJRVkE3UVVGdlJFZzdRVUYwUkZrc1EwRkJha0k3T3pzN08wRkRTa0VzU1VGQlNTeDNRa0ZCZDBJc1VVRkJVU3h4UWtGQlVpeERRVUUxUWpzN1FVRkZRU3hKUVVGSkxHMUNRVUZ0UWl4UlFVRlJMRFpDUVVGU0xFTkJRWFpDT3p0QlFVVkJMRWxCUVVrc1lVRkJZU3hSUVVGUkxHVkJRVklzUTBGQmFrSTdRVUZEUVN4SlFVRkpMR2xDUVVGcFFpeFJRVUZSTEcxQ1FVRlNMRU5CUVhKQ096dEJRVVZCTEVsQlFVa3NhVUpCUVdsQ0xGRkJRVkVzTUVKQlFWSXNRMEZCY2tJN08wRkJSVUVzU1VGQlNTeGhRVUZoTEZGQlFWRXNaVUZCVWl4RFFVRnFRanM3UVVGRlFTeFhRVUZYTEdOQlFWZ3NRMEZCTUVJc1VVRkJNVUlzUlVGQmIwTXNWVUZCVXl4TFFVRlVMRVZCUVdkQ096dEJRVVZvUkN4WFFVRlBMRkZCUVZFc1EwRkJaanRCUVVOSUxFTkJTRVE3TzBGQlMwRXNWMEZCVnl4alFVRllMRU5CUVRCQ0xGZEJRVEZDTEVWQlFYVkRMRlZCUVZNc1MwRkJWQ3hGUVVGblFqczdRVUZGYmtRc1VVRkJTU3hUUVVGVExFTkJRV0lzUlVGQlowSTdRVUZEV2l4bFFVRlBMRkZCUVZBN1FVRkRTRHRCUVVORUxGZEJRVThzUlVGQlVEdEJRVU5JTEVOQlRrUTdPMEZCVVVFc1YwRkJWeXhqUVVGWUxFTkJRVEJDTEdOQlFURkNMRVZCUVRCRExGVkJRVk1zU1VGQlZDeEZRVUZsTzBGQlEzSkVMRkZCUVVrc1VVRkJVU3hOUVVGYUxFVkJRVzlDTzBGQlEyaENMR1ZCUVU4c09FUkJRVkE3UVVGRFNEdEJRVU5LTEVOQlNrUTdPMEZCVFVFc1QwRkJUeXhQUVVGUUxFZEJRV2xDTzBGQlEySXNXVUZCVVN4clFrRkJWenRCUVVObUxHVkJRVThzUlVGQlJTeFBRVUZHTEVOQlFWVXNWVUZCVXl4UFFVRlVMRVZCUVd0Q0xFMUJRV3hDTEVWQlFUQkNPenRCUVVWMlF6dEJRVU5CTEd0Q1FVRk5MRlZCUVU0c1EwRkJhVUlzV1VGQmFrSXNSVUZCSzBJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3TzBGQlJURkRMQ3RDUVVGbExGbEJRV1lzUjBGQk9FSXNTVUZCT1VJc1EwRkJiVU1zVlVGQlV5eEpRVUZVTEVWQlFXVTdRVUZET1VNc2RVSkJRVWNzWVVGQlNDeEZRVUZyUWl4SlFVRnNRaXhEUVVGMVFpeFhRVUZYTEVsQlFWZ3NRMEZCZGtJN1FVRkRTQ3hwUWtGR1JEczdRVUZKUVN3clFrRkJaU3hWUVVGbUxFZEJRVFJDTEVsQlFUVkNMRU5CUVdsRExGVkJRVk1zU1VGQlZDeEZRVUZsTzBGQlF6VkRMSFZDUVVGSExHbENRVUZJTEVWQlFYTkNMRWxCUVhSQ0xFTkJRVEpDTEdWQlFXVXNTVUZCWml4RFFVRXpRanRCUVVOQk96dEJRVVZCTEhWQ1FVRkhMR2RDUVVGSUxFVkJRWEZDTEVWQlFYSkNMRU5CUVhkQ0xFOUJRWGhDTEVWQlFXbERMRmxCUVZjN1FVRkRlRU1zT0VKQlFVMHNXVUZCVGl4RFFVRnRRanRCUVVObUxHOURRVUZSTEdkQ1FVUlBPMEZCUldZc2VVTkJRV0VzU1VGR1JUdEJRVWRtTEcxRFFVRlBMRTFCU0ZFN1FVRkpaaXd3UTBGQll6dEJRVXBETEhsQ1FVRnVRaXhGUVV0SExFbEJURWc3UVVGUFNDeHhRa0ZTUkR0QlFWTklMR2xDUVdKRU8wRkJaMEpJTEdGQmRFSkVPenRCUVhsQ1FTeHJRMEZCYzBJc1RVRkJkRUk3UVVGRFFUdEJRVU5JTEZOQk9VSk5MRU5CUVZBN1FVRnBRMGc3UVVGdVExa3NRMEZCYWtJN096dEJRemxDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEYmtOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRMnhDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096czdRVU5ZUVN4SlFVRkpMRkZCUVZFc1VVRkJVU3h4UWtGQlVpeERRVUZhT3p0QlFVVkJMRWxCUVVrc1kwRkJZeXhSUVVGUkxHVkJRVklzUTBGQmJFSTdPMEZCUlVFc1QwRkJUeXhQUVVGUUxFZEJRV2xDTzBGQlEySXNXVUZCVVN4blFrRkJVeXhMUVVGVUxFVkJRV2RDT3p0QlFVVndRaXhsUVVGUExFVkJRVVVzVDBGQlJpeERRVUZWTEZsQlFWYzdPMEZCUlhoQ0xHdENRVUZOTEdOQlFVNHNSMEZCZFVJc1NVRkJka0lzUTBGQk5FSXNWVUZCVXl4SlFVRlVMRVZCUVdVN1FVRkRka01zYzBKQlFVMHNUMEZCVGl4RFFVRmpMRmxCUVZrc1NVRkJXaXhEUVVGa08wRkJRMGdzWVVGR1JEdEJRVWRCTzBGQlEwZ3NVMEZPVFN4RFFVRlFPMEZCVDBnN1FVRldXU3hEUVVGcVFqczdPMEZEU2tFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3pzN08wRkRURUVzU1VGQlNTeGhRVUZoTEZGQlFWRXNaVUZCVWl4RFFVRnFRanM3UVVGRlFTeFBRVUZQTEU5QlFWQXNSMEZCYVVJN1FVRkRZaXhaUVVGUkxHdENRVUZYTzBGQlEyWXNaVUZCVHl4RlFVRkZMRTlCUVVZc1EwRkJWU3hWUVVGVExFOUJRVlFzUlVGQmEwSXNUVUZCYkVJc1JVRkJNRUk3UVVGRGRrTTdRVUZEUVN4bFFVRkhMRlZCUVVnc1JVRkJaU3hOUVVGbUxFTkJRWE5DTEZsQlFYUkNPMEZCUTBFc2EwSkJRVTBzVlVGQlRpeERRVUZwUWl4TlFVRnFRaXhGUVVGNVFpeFZRVUZUTEVsQlFWUXNSVUZCWlR0QlFVTndReXh0UWtGQlJ5eG5Ra0ZCU0N4RlFVRnhRaXhOUVVGeVFpeERRVUUwUWl4WlFVRTFRanRCUVVWSUxHRkJTRVE3UVVGSlFUdEJRVU5JTEZOQlVrMHNRMEZCVUR0QlFWTklPMEZCV0Zrc1EwRkJha0k3T3p0QlEwWkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRM0pDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRGRrSkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN096dEJRMjVEUVN4SlFVRkpMR05CUVdNc1VVRkJVU3h4UWtGQlVpeERRVUZzUWpzN1FVRkZRU3hKUVVGSkxHZENRVUZuUWl4UlFVRlJMREJDUVVGU0xFTkJRWEJDT3p0QlFVVkJMRTlCUVU4c1QwRkJVQ3hIUVVGcFFqdEJRVU5pTEZsQlFWRXNhMEpCUVZjN1FVRkRaaXhsUVVGUExFVkJRVVVzVDBGQlJpeERRVUZWTEZWQlFWTXNUMEZCVkN4RlFVRnJRaXhOUVVGc1FpeEZRVUV3UWp0QlFVTjJRenRCUVVOQkxHdENRVUZOTEZWQlFVNHNRMEZCYVVJc1QwRkJha0lzUlVGQk1FSXNWVUZCVXl4SlFVRlVMRVZCUVdVN08wRkJSWEpETERSQ1FVRlpMRTlCUVZvc1IwRkJjMElzU1VGQmRFSXNRMEZCTWtJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRGRFTXNkVUpCUVVjc1owSkJRVWdzUlVGQmNVSXNTVUZCY2tJc1EwRkJNRUlzWTBGQll5eEpRVUZrTEVOQlFURkNPenRCUVVWQk96czdRVUZIUVN3d1FrRkJUU3hyUWtGQlRpeERRVUY1UWl4UFFVRjZRanM3UVVGRlFUczdPMEZCUjBFc2RVSkJRVWNzWVVGQlNDeEZRVUZyUWl4RlFVRnNRaXhEUVVGeFFpeFBRVUZ5UWl4RlFVRTRRaXhaUVVGWE8wRkJRM0pETERSQ1FVRkpMRk5CUVZNc1IwRkJSeXhKUVVGSUxFTkJRV0k3TzBGQlJVRXNiME5CUVZrc1QwRkJXaXhEUVVGdlFpeFBRVUZQTEVsQlFWQXNRMEZCV1N4VFFVRmFMRU5CUVhCQ0xFVkJRVFJETEVsQlFUVkRMRU5CUVdsRUxGVkJRVk1zU1VGQlZDeEZRVUZsTzBGQlF6VkVMR3REUVVGTkxGbEJRVTRzUTBGQmJVSTdRVUZEWml4M1EwRkJVU3hMUVVGTExFbEJSRVU3UVVGRlppdzJRMEZCWVN4SlFVWkZPMEZCUjJZc2RVTkJRVThzVFVGSVVUdEJRVWxtTERoRFFVRmpPMEZCU2tNc05rSkJRVzVDTEVWQlMwY3NTVUZNU0R0QlFVMUlMSGxDUVZCRU8wRkJVMGdzY1VKQldrUTdRVUZoU0N4cFFrRjRRa1E3UVVGNVFrZ3NZVUV6UWtRN1FVRTBRa0U3UVVGRFNDeFRRUzlDVFN4RFFVRlFPMEZCWjBOSU8wRkJiRU5aTEVOQlFXcENPenM3T3p0QlEwcEJMRWxCUVVrc1pVRkJaU3hEUVVGRE8wRkJRMmhDTEZOQlFVc3NOa05CUkZjN1FVRkZhRUlzWVVGQlV6dEJRVVpQTEVOQlFVUXNSVUZIYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CU0dkQ0xFVkJUV2hDTzBGQlEwTXNVMEZCU3l3MlEwRkVUanRCUVVWRExHRkJRVk03UVVGR1ZpeERRVTVuUWl4RlFWTm9RanRCUVVORExGTkJRVXNzTmtOQlJFNDdRVUZGUXl4aFFVRlRPMEZCUmxZc1EwRlVaMElzUlVGWmFFSTdRVUZEUXl4VFFVRkxMRFpEUVVST08wRkJSVU1zWVVGQlV6dEJRVVpXTEVOQldtZENMRVZCWldoQ08wRkJRME1zVTBGQlN5dzJRMEZFVGp0QlFVVkRMR0ZCUVZNN1FVRkdWaXhEUVdablFpeEZRV3RDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CYkVKblFpeEZRWEZDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CY2tKblFpeEZRWGRDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CZUVKblFpeEZRVEpDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CTTBKblFpeEZRVGhDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CT1VKblFpeEZRV2xEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CYWtOblFpeEZRVzlEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CY0VOblFpeEZRWFZEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CZGtOblFpeEZRVEJEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CTVVOblFpeEZRVFpEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CTjBOblFpeEZRV2RFYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CYUVSblFpeEZRVzFFYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CYmtSblFpeEZRWE5FYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CZEVSblFpeEZRWGxFYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CZWtSblFpeERRVUZ1UWpzN1FVRTRSRUVzVDBGQlR5eFBRVUZRTEVkQlFXbENMRmxCUVdwQ096czdPenRCUXpsRVFTeEpRVUZKTEZsQlFWa3NRMEZCUXp0QlFVTmlMRmRCUVU4c1RVRkVUVHRCUVVWaUxHRkJRVk1zUTBGQlF6dEJRVU5PTEd0Q1FVRlZMRWxCUkVvN1FVRkZUaXh2UWtGQldUdEJRVVpPTEV0QlFVUXNSVUZIVGp0QlFVTkRMR3RDUVVGVkxFbEJSRmc3UVVGRlF5eHZRa0ZCV1R0QlFVWmlMRXRCU0Uwc1JVRk5UanRCUVVORExHdENRVUZWTEUxQlJGZzdRVUZGUXl4dlFrRkJXVHRCUVVaaUxFdEJUazBzUlVGVFRqdEJRVU5ETEd0Q1FVRlZMRWxCUkZnN1FVRkZReXh2UWtGQldUdEJRVVppTEV0QlZFMHNSVUZaVGp0QlFVTkRMR3RDUVVGVkxFMUJSRmc3UVVGRlF5eHZRa0ZCV1R0QlFVWmlMRXRCV2swc1JVRmxUanRCUVVORExHdENRVUZWTEVsQlJGZzdRVUZGUXl4dlFrRkJXVHRCUVVaaUxFdEJaazBzUlVGclFrNDdRVUZEUXl4clFrRkJWU3hOUVVSWU8wRkJSVU1zYjBKQlFWazdRVUZHWWl4TFFXeENUVHRCUVVaSkxFTkJRVVFzUlVGM1FtSTdRVUZEUXl4WFFVRlBMRTFCUkZJN1FVRkZReXhoUVVGVExFTkJRVU03UVVGRFRpeHJRa0ZCVlN4TlFVUktPMEZCUlU0c2IwSkJRVms3UVVGR1RpeExRVUZFTEVWQlIwNDdRVUZEUXl4clFrRkJWU3hOUVVSWU8wRkJSVU1zYjBKQlFWazdRVUZHWWl4TFFVaE5MRVZCVFU0N1FVRkRReXhyUWtGQlZTeE5RVVJZTzBGQlJVTXNiMEpCUVZrN1FVRkdZaXhMUVU1Tk8wRkJSbFlzUTBGNFFtRXNSVUZ2UTJJN1FVRkRReXhYUVVGUExFMUJSRkk3UVVGRlF5eGhRVUZUTEVOQlFVTTdRVUZEVGl4clFrRkJWU3hKUVVSS08wRkJSVTRzYjBKQlFWazdRVUZHVGl4TFFVRkVMRVZCUjA0N1FVRkRReXhyUWtGQlZTeFBRVVJZTzBGQlJVTXNiMEpCUVZrN1FVRkdZaXhMUVVoTkxFVkJUVTQ3UVVGRFF5eHJRa0ZCVlN4TFFVUllPMEZCUlVNc2IwSkJRVms3UVVGR1lpeExRVTVOTzBGQlJsWXNRMEZ3UTJFc1EwRkJhRUk3TzBGQmEwUkJMRWxCUVVrc1kwRkJZenRCUVVOa0xGZEJRVThzVDBGRVR6dEJRVVZrTEdGQlFWTXNjME5CUmtzN1FVRkhaQ3hWUVVGTk8wRkJTRkVzUTBGQmJFSTdPMEZCVFVFc1QwRkJUeXhQUVVGUUxFZEJRV2xDT3p0QlFVVmlPenM3UVVGSFFTeG5Ra0ZCV1N4elFrRkJWenRCUVVOdVFpeGxRVUZQTEVWQlFVVXNUMEZCUml4RFFVRlZMRlZCUVZNc1QwRkJWQ3hGUVVGclFpeE5RVUZzUWl4RlFVRXdRanRCUVVOMlF5eHZRa0ZCVVN4VFFVRlNPMEZCUTBnc1UwRkdUU3hEUVVGUU8wRkJSMGdzUzBGVVdUczdRVUZYWWl4dlFrRkJaMElzTUVKQlFWYzdRVUZEZGtJc1pVRkJUeXhGUVVGRkxFOUJRVVlzUTBGQlZTeFZRVUZUTEU5QlFWUXNSVUZCYTBJc1RVRkJiRUlzUlVGQk1FSTdRVUZEZGtNc2IwSkJRVkVzVjBGQlVqdEJRVU5JTEZOQlJrMHNRMEZCVUR0QlFVZElPMEZCWmxrc1EwRkJha0k3T3pzN08wRkRlRVJCTEVsQlFVa3NXVUZCV1N4RFFVRkRPMEZCUTJJc1VVRkJTU3hUUVVSVE8wRkJSV0lzVjBGQlR5eE5RVVpOTzBGQlIySXNZVUZCVXl4RFFVRkRMRFJJUVVGRUxFVkJRU3RJTEhGSFFVRXZTQ3hGUVVGelR5eHpSVUZCZEU4N1FVRklTU3hEUVVGRUxFVkJTV0k3UVVGRFF5eFJRVUZKTEZOQlJFdzdRVUZGUXl4WFFVRlBMRTFCUmxJN1FVRkhReXhoUVVGVExFTkJRVU1zT0VKQlFVUTdRVUZJVml4RFFVcGhMRVZCVVdJN1FVRkRReXhSUVVGSkxFOUJSRXc3UVVGRlF5eFhRVUZQTEUxQlJsSTdRVUZIUXl4aFFVRlRMRU5CUVVNc2RVWkJRVVE3UVVGSVZpeERRVkpoTEVWQldXSTdRVUZEUXl4UlFVRkpMRTFCUkV3N1FVRkZReXhYUVVGUExGTkJSbEk3UVVGSFF5eGhRVUZUTEVOQlFVTXNNa2hCUVVRN1FVRklWaXhEUVZwaExFVkJaMEppTzBGQlEwTXNVVUZCU1N4UlFVUk1PMEZCUlVNc1YwRkJUeXhQUVVaU08wRkJSME1zWVVGQlV5eERRVUZETEN0RlFVRkVMRVZCUVd0R0xHMU1RVUZzUmp0QlFVaFdMRU5CYUVKaExFVkJiMEppTzBGQlEwTXNVVUZCU1N4aFFVUk1PMEZCUlVNc1YwRkJUeXhSUVVaU08wRkJSME1zWVVGQlV5eERRVUZETEd0SlFVRkVPMEZCU0ZZc1EwRndRbUVzUlVGM1FtSTdRVUZEUXl4UlFVRkpMR2xDUVVSTU8wRkJSVU1zVjBGQlR5eHBRa0ZHVWp0QlFVZERMR0ZCUVZNc1EwRkJReXcwU0VGQlJEdEJRVWhXTEVOQmVFSmhMRU5CUVdoQ096dEJRVGhDUVN4VFFVRlRMRTlCUVZRc1EwRkJhVUlzU1VGQmFrSXNSVUZCZFVJc1IwRkJka0lzUlVGQk5FSXNRMEZCTlVJc1JVRkJLMEk3UVVGRE0wSXNVVUZCU1N4SFFVRktPenRCUVVWQkxGRkJRVWtzUjBGQlNpeEZRVUZUTzBGQlEwd3NZMEZCVFN4SlFVRkpMRTFCUVZZN1FVRkRRU3haUVVGSkxFbEJRVWtzU1VGQlNTeERRVUZLTEVkQlFWRXNTMEZCU3l4SFFVRk1MRU5CUVZNc1EwRkJWQ3hGUVVGWkxFMUJRVTBzUTBGQmJFSXNRMEZCVWl4SFFVRXJRaXhEUVVGdVF5eEhRVUYxUXl4RFFVRXpRenM3UVVGRlFTeGxRVUZQTEVsQlFVa3NSMEZCV0N4RlFVRm5RaXhIUVVGb1FpeEZRVUZ4UWpzN1FVRkZha0k3UVVGRFFTeG5Ra0ZCU1N4TFFVRkxMRWRCUVV3c1NVRkJXU3hKUVVGSkxFTkJRVW9zVFVGQlZ5eEpRVUV6UWl4RlFVRnBRenRCUVVNM1FpeDFRa0ZCVHl4RFFVRlFPMEZCUTBnN1FVRkRTanRCUVVOS096dEJRVVZFTEZkQlFVOHNRMEZCUXl4RFFVRlNPMEZCUTBnN08wRkJSVVFzVDBGQlR5eFBRVUZRTEVkQlFXbENPMEZCUTJJN096dEJRVWRCTEc5Q1FVRm5RaXd3UWtGQlZ6dEJRVU4yUWl4WlFVRkpMRlZCUVZVc1JVRkJaRHRCUVVOQkxGbEJRVWtzVVVGQlVTeERRVUZETEZGQlFVUXNRMEZCV2pzN1FVRkZRU3hsUVVGUExFVkJRVVVzVDBGQlJpeERRVUZWTEZWQlFWTXNUMEZCVkN4RlFVRnJRaXhOUVVGc1FpeEZRVUV3UWpzN1FVRkZka01zYzBKQlFWVXNSMEZCVml4RFFVRmpMRlZCUVZNc1NVRkJWQ3hGUVVGbE8wRkJRM3BDTEc5Q1FVRkpMRkZCUVZFc1MwRkJTeXhGUVVGaUxFVkJRV2xDTEV0QlFXcENMRVZCUVhkQ0xFTkJRWGhDTEVsQlFUWkNMRU5CUVVNc1EwRkJiRU1zUlVGQmNVTTdRVUZEYWtNc05FSkJRVkVzU1VGQlVpeERRVUZoTEVsQlFXSTdRVUZEU0R0QlFVTktMR0ZCU2tRN08wRkJUVUVzYjBKQlFWRXNUMEZCVWp0QlFVTklMRk5CVkUwc1EwRkJVRHRCUVZWSUxFdEJiRUpaT3p0QlFXOUNZanM3TzBGQlIwRXNhMEpCUVdNc2QwSkJRVmM3UVVGRGNrSXNXVUZCU1N4VlFVRlZMRVZCUVdRN1FVRkRRU3haUVVGSkxGRkJRVkVzUTBGQlF5eFRRVUZFTEVWQlFWa3NVMEZCV2l4RlFVRjFRaXhQUVVGMlFpeEZRVUZuUXl4cFFrRkJhRU1zUTBGQldqczdRVUZGUVN4bFFVRlBMRVZCUVVVc1QwRkJSaXhEUVVGVkxGVkJRVk1zVDBGQlZDeEZRVUZyUWl4TlFVRnNRaXhGUVVFd1FqczdRVUZGZGtNc2MwSkJRVlVzUjBGQlZpeERRVUZqTEZWQlFWTXNTVUZCVkN4RlFVRmxPMEZCUTNwQ0xHOUNRVUZKTEZGQlFWRXNTMEZCU3l4RlFVRmlMRVZCUVdsQ0xFdEJRV3BDTEVWQlFYZENMRU5CUVhoQ0xFbEJRVFpDTEVOQlFVTXNRMEZCYkVNc1JVRkJjVU03UVVGRGFrTXNORUpCUVZFc1NVRkJVaXhEUVVGaExFbEJRV0k3UVVGRFNEdEJRVU5LTEdGQlNrUTdPMEZCVFVFc2IwSkJRVkVzVDBGQlVqdEJRVU5JTEZOQlZFMHNRMEZCVUR0QlFWVklPMEZCY2tOWkxFTkJRV3BDT3pzN096dEJRMnBFUVN4SlFVRkpMR0ZCUVdFc1EwRkJRenRCUVVOa0xGZEJRVThzVjBGRVR6dEJRVVZrTEdGQlFWTXNjVUpCUmtzN1FVRkhaQ3hYUVVGUExFTkJRVU1zZVVsQlFVUXNSVUZCTkVrc2FVeEJRVFZKTEVWQlFTdFVMREJJUVVFdlZDeERRVWhQTzBGQlNXUXNWMEZCVHl4RFFVRkRMRTlCUVVRc1JVRkJWU3h4U0VGQlZpeEZRVUZwU1N4eFNrRkJha2tzUlVGQmQxSXNiVVJCUVhoU0xFVkJRVFpWTERKR1FVRTNWVHRCUVVwUExFTkJRVVFzUlVGTFpEdEJRVU5ETEZkQlFVOHNWMEZFVWp0QlFVVkRMR0ZCUVZNc2IwSkJSbFk3UVVGSFF5eFhRVUZQTEVOQlFVTXNjVVJCUVVRc1JVRkJkMFFzTUVkQlFYaEVMRVZCUVc5TExEaEVRVUZ3U3l4RFFVaFNPMEZCU1VNc1YwRkJUeXhEUVVGRExFOUJRVVFzUlVGQlZTdzRSRUZCVmp0QlFVcFNMRU5CVEdNc1JVRlZaRHRCUVVORExGZEJRVThzVjBGRVVqdEJRVVZETEdGQlFWTXNiMEpCUmxZN1FVRkhReXhYUVVGUExFTkJRVU1zYVVkQlFVUXNSVUZCYjBjc09FUkJRWEJITEVOQlNGSTdRVUZKUXl4WFFVRlBMRU5CUVVNc2MwSkJRVVFzUlVGQmVVSXNiVXRCUVhwQ0xFVkJRVGhNTEhkRlFVRTVURHRCUVVwU0xFTkJWbU1zUTBGQmFrSTdPMEZCYVVKQkxFOUJRVThzVDBGQlVDeEhRVUZwUWp0QlFVTmlPenM3UVVGSFFTeHJRa0ZCWXl4M1FrRkJWenRCUVVOeVFpeFpRVUZKTEZsQlFWa3NSVUZCYUVJN1FVRkRRU3hsUVVGUExFVkJRVVVzVDBGQlJpeERRVUZWTEZWQlFWTXNUMEZCVkN4RlFVRnJRaXhOUVVGc1FpeEZRVUV3UWp0QlFVTjJReXgxUWtGQlZ5eEhRVUZZTEVOQlFXVXNWVUZCVXl4SlFVRlVMRVZCUVdVN1FVRkRNVUlzTUVKQlFWVXNTVUZCVml4RFFVRmxMRXRCUVVzc1MwRkJjRUk3UVVGRFNDeGhRVVpFTzBGQlIwRXNiMEpCUVZFc1UwRkJVanRCUVVOSUxGTkJURTBzUTBGQlVEdEJRVTFJTEV0QldsazdPMEZCWTJJN096dEJRVWRCTEdkQ1FVRlpMSE5DUVVGWE8wRkJRMjVDTEdWQlFVOHNSVUZCUlN4UFFVRkdMRU5CUVZVc1ZVRkJVeXhQUVVGVUxFVkJRV3RDTEUxQlFXeENMRVZCUVRCQ08wRkJRM1pETEhWQ1FVRlhMRWRCUVZnc1EwRkJaU3hWUVVGVExFbEJRVlFzUlVGQlpUdEJRVU14UWl4eFFrRkJTeXhKUVVGTUxFZEJRVmtzUzBGQlN5eExRVUZNTEVOQlFWY3NTMEZCV0N4RFFVRnBRaXhIUVVGcVFpeEZRVUZ6UWl4RFFVRjBRaXhEUVVGYU8wRkJRMGdzWVVGR1JEczdRVUZKUVN4dlFrRkJVU3hWUVVGU08wRkJRMGdzVTBGT1RTeERRVUZRTzBGQlQwZzdRVUY2UWxrc1EwRkJha0k3T3pzN08wRkRha0pCTEVsQlFVa3NWMEZCVnp0QlFVTllMRlZCUVUwc1EwRkJRenRCUVVOSUxGbEJRVWtzVDBGRVJEdEJRVVZJTEdOQlFVMHNUVUZHU0R0QlFVZElMR05CUVUwc1ZVRklTRHRCUVVsSUxHRkJRVXNzYzBKQlNrWTdRVUZMU0N4alFVRk5MSE5KUVV4SU8wRkJUVWdzWlVGQlR5eDVRMEZPU2p0QlFVOUlMR05CUVUwc1EwRkJRenRCUVVOSUxHbENRVUZMTEhORFFVUkdPMEZCUlVnc2NVSkJRVk03UVVGR1RpeFRRVUZFTEVWQlIwZzdRVUZEUXl4cFFrRkJTeXh6UTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRklSeXhGUVUxSU8wRkJRME1zYVVKQlFVc3NjME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlRrY3NSVUZUU0R0QlFVTkRMR2xDUVVGTExITkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVZSSExFVkJXVWc3UVVGRFF5eHBRa0ZCU3l4elEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZhUnl4RlFXVklPMEZCUTBNc2FVSkJRVXNzZFVOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJaa2M3UVVGUVNDeExRVUZFTEVWQk1FSklPMEZCUTBNc1dVRkJTU3hYUVVSTU8wRkJSVU1zWTBGQlRTeE5RVVpRTzBGQlIwTXNZMEZCVFN4VlFVaFFPMEZCU1VNc1lVRkJTeXd3UWtGS1RqdEJRVXRETEdOQlFVMHNLMFZCVEZBN1FVRk5ReXhsUVVGUExEWkRRVTVTTzBGQlQwTXNZMEZCVFN4RFFVRkRPMEZCUTBnc2FVSkJRVXNzTUVOQlJFWTdRVUZGU0N4eFFrRkJVenRCUVVaT0xGTkJRVVFzUlVGSFNEdEJRVU5ETEdsQ1FVRkxMREJEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVaEhMRVZCVFVnN1FVRkRReXhwUWtGQlN5d3dRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGT1J5eEZRVk5JTzBGQlEwTXNhVUpCUVVzc01FTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVkVjc1JVRlpTRHRCUVVORExHbENRVUZMTERKRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVnBITzBGQlVGQXNTMEV4UWtjc1JVRnBSRWc3UVVGRFF5eFpRVUZKTEZsQlJFdzdRVUZGUXl4alFVRk5MRTFCUmxBN1FVRkhReXhqUVVGTkxGVkJTRkE3UVVGSlF5eGhRVUZMTEhGQ1FVcE9PMEZCUzBNc1kwRkJUU3cwUzBGTVVEdEJRVTFETEdWQlFVOHNPRU5CVGxJN1FVRlBReXhqUVVGTkxFTkJRVU03UVVGRFNDeHBRa0ZCU3l3eVEwRkVSanRCUVVWSUxIRkNRVUZUTzBGQlJrNHNVMEZCUkN4RlFVZElPMEZCUTBNc2FVSkJRVXNzTWtOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJTRWNzUlVGTlNEdEJRVU5ETEdsQ1FVRkxMREpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVNUhMRVZCVTBnN1FVRkRReXhwUWtGQlN5d3lRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGVVJ5eEZRVmxJTzBGQlEwTXNhVUpCUVVzc01rTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CV2tjc1JVRmxTRHRCUVVORExHbENRVUZMTERKRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRV1pITEVWQmEwSklPMEZCUTBNc2FVSkJRVXNzTkVOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJiRUpITzBGQlVGQXNTMEZxUkVjc1JVRTRSVWc3UVVGRFF5eFpRVUZKTEdkQ1FVUk1PMEZCUlVNc1kwRkJUU3hOUVVaUU8wRkJSME1zWTBGQlRTeFZRVWhRTzBGQlNVTXNZVUZCU3l4MVFrRktUanRCUVV0RExHTkJRVTBzYzBoQlRGQTdRVUZOUXl4bFFVRlBMR3RFUVU1U08wRkJUME1zWTBGQlRTeERRVUZETzBGQlEwZ3NhVUpCUVVzc0swTkJSRVk3UVVGRlNDeHhRa0ZCVXp0QlFVWk9MRk5CUVVRc1JVRkhTRHRCUVVORExHbENRVUZMTEN0RFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVWhITEVWQlRVZzdRVUZEUXl4cFFrRkJTeXdyUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRk9SeXhGUVZOSU8wRkJRME1zYVVKQlFVc3NLME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlZFY3NSVUZaU0R0QlFVTkRMR2xDUVVGTExDdERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVZwSE8wRkJVRkFzUzBFNVJVY3NSVUZ4UjBnN1FVRkRReXhaUVVGSkxGbEJSRXc3UVVGRlF5eGpRVUZOTEUxQlJsQTdRVUZIUXl4alFVRk5MRlZCU0ZBN1FVRkpReXhqUVVGTkxITkxRVXBRTzBGQlMwTXNZMEZCVFN4RFFVRkRPMEZCUTBnc2FVSkJRVXNzTWtOQlJFWTdRVUZGU0N4eFFrRkJVenRCUVVaT0xGTkJRVVFzUlVGSFNEdEJRVU5ETEdsQ1FVRkxMREpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVaEhMRVZCVFVnN1FVRkRReXhwUWtGQlN5d3lRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGT1J6dEJRVXhRTEV0QmNrZEhMRVZCYjBoSU8wRkJRME1zV1VGQlNTeFJRVVJNTzBGQlJVTXNZMEZCVFN4TlFVWlFPMEZCUjBNc1kwRkJUU3hUUVVoUU8wRkJTVU1zWVVGQlN5eDVRa0ZLVGp0QlFVdERMR05CUVUwc1owUkJURkE3UVVGTlF5eGxRVUZQTERCRFFVNVNPMEZCVDBNc1kwRkJUU3hEUVVGRE8wRkJRMGdzYVVKQlFVc3NkVU5CUkVZN1FVRkZTQ3h4UWtGQlV6dEJRVVpPTEZOQlFVUXNSVUZIU0R0QlFVTkRMR2xDUVVGTExIVkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVVoSE8wRkJVRkFzUzBGd1NFY3NSVUZyU1VnN1FVRkRReXhaUVVGSkxGZEJSRXc3UVVGRlF5eGpRVUZOTEUxQlJsQTdRVUZIUXl4alFVRk5MR0ZCU0ZBN1FVRkpReXhoUVVGTExIRkNRVXBPTzBGQlMwTXNZMEZCVFN3eVJrRk1VRHRCUVUxRExHVkJRVThzTmtOQlRsSTdRVUZQUXl4alFVRk5MRU5CUVVNN1FVRkRTQ3hwUWtGQlN5d3dRMEZFUmp0QlFVVklMSEZDUVVGVE8wRkJSazRzVTBGQlJDeEZRVWRJTzBGQlEwTXNhVUpCUVVzc01FTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CU0VjN1FVRlFVQ3hMUVd4SlJ5eEZRV2RLU0R0QlFVTkRMRmxCUVVrc1UwRkVURHRCUVVWRExHTkJRVTBzVFVGR1VEdEJRVWRETEdOQlFVMHNWVUZJVUR0QlFVbERMR0ZCUVVzc2NVSkJTazQ3UVVGTFF5eGpRVUZOTERKR1FVeFFPMEZCVFVNc1pVRkJUeXd5UTBGT1VqdEJRVTlETEdOQlFVMHNRMEZCUXp0QlFVTklMR2xDUVVGTExIZERRVVJHTzBGQlJVZ3NjVUpCUVZNN1FVRkdUaXhUUVVGRUxFVkJSMGc3UVVGRFF5eHBRa0ZCU3l4M1EwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZJUnp0QlFWQlFMRXRCYUVwSExFVkJPRXBJTzBGQlEwTXNXVUZCU1N4UFFVUk1PMEZCUlVNc1kwRkJUU3hOUVVaUU8wRkJSME1zWTBGQlRTeGhRVWhRTzBGQlNVTXNZMEZCVFN4eFJFRktVRHRCUVV0RExHVkJRVThzZVVOQlRGSTdRVUZOUXl4alFVRk5MRU5CUVVNN1FVRkRTQ3hwUWtGQlN5eHpRMEZFUmp0QlFVVklMSEZDUVVGVE8wRkJSazRzVTBGQlJDeEZRVWRJTzBGQlEwTXNhVUpCUVVzc2MwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CU0Vjc1JVRk5TRHRCUVVORExHbENRVUZMTEhORFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVTVITEVWQlUwZzdRVUZEUXl4cFFrRkJTeXh6UTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRlVSeXhGUVZsSU8wRkJRME1zYVVKQlFVc3NjME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQldrY3NSVUZsU0R0QlFVTkRMR2xDUVVGTExITkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVdaSExFVkJhMEpJTzBGQlEwTXNhVUpCUVVzc2MwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CYkVKSExFVkJjVUpJTzBGQlEwTXNhVUpCUVVzc2MwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CY2tKSE8wRkJUbEFzUzBFNVNrY3NSVUUyVEVnN1FVRkRReXhaUVVGSkxGRkJSRXc3UVVGRlF5eGpRVUZOTEUxQlJsQTdRVUZIUXl4alFVRk5MR0ZCU0ZBN1FVRkpReXhqUVVGTkxHZEtRVXBRTzBGQlMwTXNaVUZCVHl3d1EwRk1VanRCUVUxRExHTkJRVTBzUTBGQlF6dEJRVU5JTEdsQ1FVRkxMSFZEUVVSR08wRkJSVWdzY1VKQlFWTTdRVUZHVGl4VFFVRkVMRVZCUjBnN1FVRkRReXhwUWtGQlN5eDFRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGSVJ5eEZRVTFJTzBGQlEwTXNhVUpCUVVzc2RVTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVGtjN1FVRk9VQ3hMUVRkTVJ5eEZRVFpOU0R0QlFVTkRMRmxCUVVrc1kwRkVURHRCUVVWRExHTkJRVTBzVFVGR1VEdEJRVWRETEdOQlFVMHNXVUZJVUR0QlFVbERMR05CUVUwc2NVSkJTbEE3UVVGTFF5eGxRVUZQTEdkRVFVeFNPMEZCVFVNc1kwRkJUU3hEUVVGRE8wRkJRMGdzYVVKQlFVc3NOa05CUkVZN1FVRkZTQ3h4UWtGQlV6dEJRVVpPTEZOQlFVUXNSVUZIU0R0QlFVTkRMR2xDUVVGTExEWkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVVoSExFVkJUVWc3UVVGRFF5eHBRa0ZCU3l3MlEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZPUnl4RlFWTklPMEZCUTBNc2FVSkJRVXNzTmtOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJWRWM3UVVGT1VDeExRVGROUnl4RlFXZFBTRHRCUVVORExGbEJRVWtzWTBGRVREdEJRVVZETEdOQlFVMHNUVUZHVUR0QlFVZERMR05CUVUwc1kwRklVRHRCUVVsRExHTkJRVTBzY1VKQlNsQTdRVUZMUXl4bFFVRlBMR2RFUVV4U08wRkJUVU1zWTBGQlRTeERRVUZETzBGQlEwZ3NhVUpCUVVzc05rTkJSRVk3UVVGRlNDeHhRa0ZCVXp0QlFVWk9MRk5CUVVRc1JVRkhTRHRCUVVORExHbENRVUZMTERaRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVWhITEVWQlRVZzdRVUZEUXl4cFFrRkJTeXcyUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRk9SeXhGUVZOSU8wRkJRME1zYVVKQlFVc3NOa05CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlZFYzdRVUZPVUN4TFFXaFBSeXhGUVcxUVNEdEJRVU5ETEZsQlFVa3NhVUpCUkV3N1FVRkZReXhqUVVGTkxFMUJSbEE3UVVGSFF5eGpRVUZOTEZOQlNGQTdRVUZKUXl4alFVRk5MRk5CU2xBN1FVRkxReXhqUVVGTkxITkVRVXhRTzBGQlRVTXNaVUZCVHl4dFJFRk9VanRCUVU5RExHTkJRVTBzUTBGQlF6dEJRVU5JTEdsQ1FVRkxMR2RFUVVSR08wRkJSVWdzY1VKQlFWTTdRVUZHVGl4VFFVRkVMRVZCUjBnN1FVRkRReXhwUWtGQlN5eG5SRUZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGSVJ5eEZRVTFJTzBGQlEwTXNhVUpCUVVzc1owUkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVGtjc1JVRlRTRHRCUVVORExHbENRVUZMTEdkRVFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVlJITEVWQldVZzdRVUZEUXl4cFFrRkJTeXhuUkVGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRmFSenRCUVZCUUxFdEJibEJITEVWQk1GRklPMEZCUTBNc1dVRkJTU3hWUVVSTU8wRkJSVU1zWTBGQlRTeE5RVVpRTzBGQlIwTXNZMEZCVFN4alFVaFFPMEZCU1VNc1kwRkJUU3hUUVVwUU8wRkJTME1zWTBGQlRTeHRSMEZNVUR0QlFVMURMR1ZCUVU4c05FTkJUbEk3UVVGUFF5eGpRVUZOTEVOQlFVTTdRVUZEU0N4cFFrRkJTeXg1UTBGRVJqdEJRVVZJTEhGQ1FVRlRPMEZCUms0c1UwRkJSQ3hGUVVkSU8wRkJRME1zYVVKQlFVc3NlVU5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlNFY3NSVUZOU0R0QlFVTkRMR2xDUVVGTExIbERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVU1SExFVkJVMGc3UVVGRFF5eHBRa0ZCU3l4NVEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZVUnp0QlFWQlFMRXRCTVZGSExFVkJPRkpJTzBGQlEwTXNXVUZCU1N4WlFVUk1PMEZCUlVNc1kwRkJUU3hOUVVaUU8wRkJSME1zWTBGQlRTeFRRVWhRTzBGQlNVTXNZMEZCVFN4aFFVcFFPMEZCUzBNc1pVRkJUeXc0UTBGTVVqdEJRVTFETEdOQlFVMHNRMEZCUXp0QlFVTklMR2xDUVVGTExESkRRVVJHTzBGQlJVZ3NjVUpCUVZNN1FVRkdUaXhUUVVGRUxFVkJSMGc3UVVGRFF5eHBRa0ZCU3l3eVEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZJUnl4RlFVMUlPMEZCUTBNc2FVSkJRVXNzTWtOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJUa2NzUlVGVFNEdEJRVU5ETEdsQ1FVRkxMREpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFWUkhMRVZCV1VnN1FVRkRReXhwUWtGQlN5d3lRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGYVJ5eEZRV1ZJTzBGQlEwTXNhVUpCUVVzc01rTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CWmtjN1FVRk9VQ3hMUVRsU1J5eEZRWFZVU0R0QlFVTkRMRmxCUVVrc1VVRkVURHRCUVVWRExHTkJRVTBzVFVGR1VEdEJRVWRETEdOQlFVMHNhMEpCU0ZBN1FVRkpReXhqUVVGTkxHdEZRVXBRTzBGQlMwTXNaVUZCVHl3d1EwRk1VanRCUVUxRExHTkJRVTBzUTBGQlF6dEJRVU5JTEdsQ1FVRkxMSFZEUVVSR08wRkJSVWdzY1VKQlFWTTdRVUZHVGl4VFFVRkVMRVZCUjBnN1FVRkRReXhwUWtGQlN5eDFRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGSVJ5eEZRVTFJTzBGQlEwTXNhVUpCUVVzc2RVTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVGtjc1JVRlRTRHRCUVVORExHbENRVUZMTEhWRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVlJITzBGQlRsQXNTMEYyVkVjc1JVRXdWVWc3UVVGRFF5eFpRVUZKTEZOQlJFdzdRVUZGUXl4alFVRk5MRTFCUmxBN1FVRkhReXhqUVVGTkxHTkJTRkE3UVVGSlF5eGpRVUZOTEdOQlNsQTdRVUZMUXl4alFVRk5MREJFUVV4UU8wRkJUVU1zWlVGQlR5d3lRMEZPVWp0QlFVOURMR05CUVUwc1EwRkJRenRCUVVOSUxHbENRVUZMTEhkRFFVUkdPMEZCUlVnc2NVSkJRVk03UVVGR1RpeFRRVUZFTEVWQlIwZzdRVUZEUXl4cFFrRkJTeXgzUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRklSeXhGUVUxSU8wRkJRME1zYVVKQlFVc3NkME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlRrY3NSVUZUU0R0QlFVTkRMR2xDUVVGTExIZERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVZSSExFVkJXVWc3UVVGRFF5eHBRa0ZCU3l4M1EwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZhUnl4RlFXVklPMEZCUTBNc2FVSkJRVXNzZDBOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJaa2M3UVVGUVVDeExRVEZWUnl4RlFXOVhTRHRCUVVORExGbEJRVWtzVTBGRVREdEJRVVZETEdOQlFVMHNUVUZHVUR0QlFVZERMR05CUVUwc2MwSkJTRkE3UVVGSlF5eGpRVUZOTEZOQlNsQTdRVUZMUXl4alFVRk5MR2xFUVV4UU8wRkJUVU1zWTBGQlRTeERRVUZETzBGQlEwZ3NhVUpCUVVzc2QwTkJSRVk3UVVGRlNDeHhRa0ZCVXp0QlFVWk9MRk5CUVVRc1JVRkhTRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVWhITEVWQlRVZzdRVUZEUXl4cFFrRkJTeXgzUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRk9SeXhGUVZOSU8wRkJRME1zYVVKQlFVc3NkME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlZFY3NSVUZaU0R0QlFVTkRMR2xDUVVGTExIZERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVZwSExFVkJaVWc3UVVGRFF5eHBRa0ZCU3l4M1EwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZtUnl4RlFXdENTRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRV3hDUnl4RlFYRkNTRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRWEpDUnl4RlFYZENTRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRWGhDUnl4RlFUSkNTRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVE5DUnp0QlFVNVFMRXRCY0ZkSExFVkJlVmxJTzBGQlEwTXNXVUZCU1N4WFFVUk1PMEZCUlVNc1kwRkJUU3hOUVVaUU8wRkJSME1zWTBGQlRTeG5Ra0ZJVUR0QlFVbERMR05CUVUwc1UwRktVRHRCUVV0RExHTkJRVTBzTUVOQlRGQTdRVUZOUXl4alFVRk5MRU5CUVVNN1FVRkRTQ3hwUWtGQlN5d3dRMEZFUmp0QlFVVklMSEZDUVVGVE8wRkJSazRzVTBGQlJDeEZRVWRJTzBGQlEwTXNhVUpCUVVzc01FTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CU0Vjc1JVRk5TRHRCUVVORExHbENRVUZMTERCRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVTVITEVWQlUwZzdRVUZEUXl4cFFrRkJTeXd3UTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRlVSeXhGUVZsSU8wRkJRME1zYVVKQlFVc3NNRU5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQldrYzdRVUZPVUN4TFFYcFpSeXhGUVN0YVNEdEJRVU5ETEZsQlFVa3NZMEZFVER0QlFVVkRMR05CUVUwc1RVRkdVRHRCUVVkRExHTkJRVTBzVlVGSVVEdEJRVWxETEdGQlFVc3NaME5CU2s0N1FVRkxReXhqUVVGTkxIVkVRVXhRTzBGQlRVTXNaVUZCVHl4blJFRk9VanRCUVU5RExHTkJRVTBzUTBGQlF6dEJRVU5JTEdsQ1FVRkxMRFpEUVVSR08wRkJSVWdzY1VKQlFWTTdRVUZHVGl4VFFVRkVMRVZCUjBnN1FVRkRReXhwUWtGQlN5dzJRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGSVJ5eEZRVTFJTzBGQlEwTXNhVUpCUVVzc05rTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVGtjc1JVRlRTRHRCUVVORExHbENRVUZMTERaRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVlJITEVWQldVZzdRVUZEUXl4cFFrRkJTeXcyUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRmFSeXhGUVdWSU8wRkJRME1zYVVKQlFVc3NOa05CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlprY3NSVUZyUWtnN1FVRkRReXhwUWtGQlN5dzJRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGc1FrY3NSVUZ4UWtnN1FVRkRReXhwUWtGQlN5dzJRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGeVFrY3NSVUYzUWtnN1FVRkRReXhwUWtGQlN5dzJRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGNFFrY3NSVUV5UWtnN1FVRkRReXhwUWtGQlN5dzJRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBFelFrYzdRVUZRVUN4TFFTOWFSeXhGUVhGalNEdEJRVU5ETEZsQlFVa3NVVUZFVER0QlFVVkRMR05CUVUwc1RVRkdVRHRCUVVkRExHTkJRVTBzVTBGSVVEdEJRVWxETEdOQlFVMHNVMEZLVUR0QlFVdERMR05CUVUwc1owUkJURkE3UVVGTlF5eGxRVUZQTERCRFFVNVNPMEZCVDBNc1kwRkJUU3hEUVVGRE8wRkJRMGdzYVVKQlFVc3NkVU5CUkVZN1FVRkZTQ3h4UWtGQlV6dEJRVVpPTEZOQlFVUXNSVUZIU0R0QlFVTkRMR2xDUVVGTExIVkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVVoSExFVkJUVWc3UVVGRFF5eHBRa0ZCU3l4MVEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZPUnl4RlFWTklPMEZCUTBNc2FVSkJRVXNzZFVOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJWRWNzUlVGWlNEdEJRVU5ETEdsQ1FVRkxMSFZEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFWcEhMRVZCWlVnN1FVRkRReXhwUWtGQlN5eDFRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGbVJ5eEZRV3RDU0R0QlFVTkRMR2xDUVVGTExIVkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVd4Q1J5eEZRWEZDU0R0QlFVTkRMR2xDUVVGTExIVkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVhKQ1J6dEJRVkJRTEV0QmNtTkhMRVZCY1dWSU8wRkJRME1zV1VGQlNTeFZRVVJNTzBGQlJVTXNZMEZCVFN4TlFVWlFPMEZCUjBNc1kwRkJUU3hoUVVoUU8wRkJTVU1zWTBGQlRTeFRRVXBRTzBGQlMwTXNZMEZCVFN3MFFrRk1VRHRCUVUxRExHVkJRVThzTWtOQlRsSTdRVUZQUXl4alFVRk5MRU5CUVVNN1FVRkRTQ3hwUWtGQlN5eDNRMEZFUmp0QlFVVklMSEZDUVVGVE8wRkJSazRzVTBGQlJDeEZRVWRJTzBGQlEwTXNhVUpCUVVzc2QwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CU0Vjc1JVRk5TRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVTVITEVWQlUwZzdRVUZEUXl4cFFrRkJTeXgzUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRlVSenRCUVZCUUxFdEJjbVZITEVWQmVXWklPMEZCUTBNc1dVRkJTU3hUUVVSTU8wRkJSVU1zWTBGQlRTeE5RVVpRTzBGQlIwTXNZMEZCVFN4alFVaFFPMEZCU1VNc1kwRkJUU3cyUkVGS1VEdEJRVXRETEdOQlFVMHNRMEZCUXp0QlFVTklMR2xDUVVGTExIZERRVVJHTzBGQlJVZ3NjVUpCUVZNN1FVRkdUaXhUUVVGRUxFVkJSMGc3UVVGRFF5eHBRa0ZCU3l4M1EwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZJUnl4RlFVMUlPMEZCUTBNc2FVSkJRVXNzZDBOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJUa2NzUlVGVFNEdEJRVU5ETEdsQ1FVRkxMSGREUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFWUkhMRVZCV1VnN1FVRkRReXhwUWtGQlN5eDNRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGYVJ6dEJRVXhRTEV0QmVtWkhMRVZCT0dkQ1NEdEJRVU5ETEZsQlFVa3NUMEZFVER0QlFVVkRMR05CUVUwc1RVRkdVRHRCUVVkRExHTkJRVTBzVlVGSVVEdEJRVWxETEdOQlFVMHNNa05CU2xBN1FVRkxReXhsUVVGUExIbERRVXhTTzBGQlRVTXNZMEZCVFN4RFFVRkRPMEZCUTBnc2FVSkJRVXNzYzBOQlJFWTdRVUZGU0N4eFFrRkJVenRCUVVaT0xGTkJRVVFzUlVGSFNEdEJRVU5ETEdsQ1FVRkxMSE5EUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVaEhMRVZCVFVnN1FVRkRReXhwUWtGQlN5eHpRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGT1J5eEZRVk5JTzBGQlEwTXNhVUpCUVVzc2MwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVkVjc1JVRlpTRHRCUVVORExHbENRVUZMTEhORFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVnBITEVWQlpVZzdRVUZEUXl4cFFrRkJTeXh6UTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRm1SeXhGUVd0Q1NEdEJRVU5ETEdsQ1FVRkxMSE5EUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFXeENSeXhGUVhGQ1NEdEJRVU5ETEdsQ1FVRkxMSE5EUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFYSkNSeXhGUVhkQ1NEdEJRVU5ETEdsQ1FVRkxMSE5EUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFYaENSeXhGUVRKQ1NEdEJRVU5ETEdsQ1FVRkxMSE5EUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFUTkNSenRCUVU1UUxFdEJPV2RDUnp0QlFVUkxMRU5CUVdZN08wRkJkV3BDUVN4SlFVRkpMRkZCUVZFN1FVRkRVanM3TzBGQlIwRXNZVUZCVXl4dFFrRkJWenRCUVVOb1FpeFpRVUZKTEZkQlFWY3NSVUZCWmp0QlFVTkJMR1ZCUVU4c1JVRkJSU3hQUVVGR0xFTkJRVlVzVlVGQlV5eFBRVUZVTEVWQlFXdENMRTFCUVd4Q0xFVkJRVEJDT3p0QlFVVjJReXh4UWtGQlV5eEpRVUZVTEVOQlFXTXNSMEZCWkN4RFFVRnJRaXhWUVVGVExFbEJRVlFzUlVGQlpUdEJRVU0zUWl4dlFrRkJTU3hYUVVGWExFVkJRV1k3UVVGRFFTeDVRa0ZCVXl4RlFVRlVMRWRCUVdNc1MwRkJTeXhGUVVGdVFqdEJRVU5CTEhsQ1FVRlRMRWxCUVZRc1IwRkJaMElzUzBGQlN5eEpRVUZ5UWp0QlFVTkJMSGxDUVVGVExFZEJRVlFzUjBGQlpTeExRVUZMTEVkQlFVd3NTVUZCV1N4RlFVRXpRanRCUVVOQkxIbENRVUZUTEVkQlFWUXNSMEZCWlN4TFFVRkxMRWRCUVV3c1NVRkJXU3hGUVVFelFqdEJRVU5CTEhsQ1FVRlRMRWxCUVZRc1IwRkJaMElzUzBGQlN5eEpRVUZNTEVsQlFXRXNSVUZCTjBJN1FVRkRRU3g1UWtGQlV5eExRVUZVTEVkQlFXbENMRXRCUVVzc1MwRkJUQ3hMUVVGbExFdEJRVXNzU1VGQlRDeEhRVUZaTEV0QlFVc3NTVUZCVEN4RFFVRlZMRU5CUVZZc1JVRkJZU3hIUVVGNlFpeEhRVUVyUWl4RlFVRTVReXhEUVVGcVFqczdRVUZGUVN4NVFrRkJVeXhKUVVGVUxFTkJRV01zVVVGQlpEdEJRVU5JTEdGQlZrUTdRVUZYUVN4dlFrRkJVU3hSUVVGU08wRkJRMGdzVTBGa1RTeERRVUZRTzBGQlpVZ3NTMEZ5UWs4N08wRkJkVUpTT3pzN1FVRkhRU3h0UWtGQlpTeDFRa0ZCVXl4SlFVRlVMRVZCUVdVN1FVRkRNVUlzV1VGQlNTeFhRVUZYTEVWQlFXWTdRVUZEUVN4bFFVRlBMRVZCUVVVc1QwRkJSaXhEUVVGVkxGVkJRVk1zVDBGQlZDeEZRVUZyUWl4TlFVRnNRaXhGUVVFd1FqczdRVUZGZGtNc2NVSkJRVk1zU1VGQlZDeERRVUZqTEVkQlFXUXNRMEZCYTBJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRE4wSXNiMEpCUVVrc1VVRkJVU3hMUVVGTExFbEJRV3BDTEVWQlFYVkNPMEZCUTI1Q0xIZENRVUZKTEZkQlFWY3NSVUZCWmp0QlFVTkJMRFpDUVVGVExFVkJRVlFzUjBGQll5eExRVUZMTEVWQlFXNUNPMEZCUTBFc05rSkJRVk1zU1VGQlZDeEhRVUZuUWl4TFFVRkxMRWxCUVhKQ08wRkJRMEVzTmtKQlFWTXNSMEZCVkN4SFFVRmxMRXRCUVVzc1IwRkJUQ3hKUVVGWkxFVkJRVE5DTzBGQlEwRXNOa0pCUVZNc1IwRkJWQ3hIUVVGbExFdEJRVXNzUjBGQlRDeEpRVUZaTEVWQlFUTkNPMEZCUTBFc05rSkJRVk1zU1VGQlZDeEhRVUZuUWl4TFFVRkxMRWxCUVV3c1NVRkJZU3hGUVVFM1FqdEJRVU5CTERaQ1FVRlRMRXRCUVZRc1IwRkJhVUlzUzBGQlN5eExRVUZNTEV0QlFXVXNTMEZCU3l4SlFVRk1MRWRCUVZrc1MwRkJTeXhKUVVGTUxFTkJRVlVzUTBGQlZpeEZRVUZoTEVkQlFYcENMRWRCUVN0Q0xFVkJRVGxETEVOQlFXcENPenRCUVVWQkxEWkNRVUZUTEVsQlFWUXNRMEZCWXl4UlFVRmtPMEZCUTBnN1FVRkRTaXhoUVZwRU8wRkJZVUVzYjBKQlFWRXNVVUZCVWp0QlFVTklMRk5CYUVKTkxFTkJRVkE3UVVGcFFrZ3NTMEUzUTA4N08wRkJLME5TT3pzN1FVRkhRU3hoUVVGVExHbENRVUZUTEVWQlFWUXNSVUZCWVR0QlFVTnNRaXhaUVVGSkxGZEJRVmNzUlVGQlpqdEJRVU5CTEdWQlFVOHNSVUZCUlN4UFFVRkdMRU5CUVZVc1ZVRkJVeXhQUVVGVUxFVkJRV3RDTEUxQlFXeENMRVZCUVRCQ08wRkJRM1pETEhGQ1FVRlRMRWxCUVZRc1EwRkJZeXhIUVVGa0xFTkJRV3RDTEZWQlFWTXNTVUZCVkN4RlFVRmxPMEZCUXpkQ0xHOUNRVUZKTEUxQlFVMHNTMEZCU3l4RlFVRm1MRVZCUVcxQ08wRkJRMllzSzBKQlFWY3NTVUZCV0R0QlFVTklPMEZCUTBvc1lVRktSRHRCUVV0QkxHOUNRVUZSTEZGQlFWSTdRVUZEU0N4VFFWQk5MRU5CUVZBN1FVRlJTRHRCUVRWRVR5eERRVUZhT3p0QlFTdEVRU3hQUVVGUExFOUJRVkFzUjBGQmFVSXNTMEZCYWtJN096czdPenM3T3pzN096czdPemhDUTNSdVFuTkNMRzFDUVVGdFFqczdTVUZCTjBJc1NVRkJTVHM3T3pzN2IwTkJTVThzTUVKQlFUQkNPenM3TzIxRFFVTXpRaXgzUWtGQmQwSTdPenM3SzBKQlEzWkNMRzlDUVVGdlFqczdTVUZCTDBJc1MwRkJTenM3YVVOQlExRXNjMEpCUVhOQ096dEpRVUZ1UXl4UFFVRlBPenR2UTBGRlNTd3dRa0ZCTUVJN096czdPMEZCUjJwRUxGTkJRVk1zVFVGQlRTeEhRVUZITzBGQlEyaENMRTFCUVVrc1JVRkJSU3hIUVVGSExFbEJRVWtzU1VGQlNTeERRVUZETEhGQ1FVRnhRaXhGUVVGRkxFTkJRVU03TzBGQlJURkRMRTlCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTNaQ0xFbEJRVVVzUTBGQlF5eFZRVUZWTEc5RFFVRmhMRU5CUVVNN1FVRkRNMElzU1VGQlJTeERRVUZETEZOQlFWTXNiVU5CUVZrc1EwRkJRenRCUVVONlFpeEpRVUZGTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVOcVFpeEpRVUZGTEVOQlFVTXNaMEpCUVdkQ0xFZEJRVWNzUzBGQlN5eERRVUZETEdkQ1FVRm5RaXhEUVVGRE96dEJRVVUzUXl4SlFVRkZMRU5CUVVNc1JVRkJSU3hIUVVGSExFOUJRVThzUTBGQlF6dEJRVU5vUWl4SlFVRkZMRU5CUVVNc1VVRkJVU3hIUVVGSExGVkJRVk1zU1VGQlNTeEZRVUZGTzBGQlF6TkNMRmRCUVU4c1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eEpRVUZKTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRia01zUTBGQlF6czdRVUZGUml4VFFVRlBMRVZCUVVVc1EwRkJRenREUVVOWU96dEJRVVZFTEVsQlFVa3NTVUZCU1N4SFFVRkhMRTFCUVUwc1JVRkJSU3hEUVVGRE8wRkJRM0JDTEVsQlFVa3NRMEZCUXl4TlFVRk5MRWRCUVVjc1RVRkJUU3hEUVVGRE96dEJRVVZ5UWl4clEwRkJWeXhKUVVGSkxFTkJRVU1zUTBGQlF6czdRVUZGYWtJc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXpzN2NVSkJSVklzU1VGQlNUczdPenM3T3pzN096czdPenR4UWtOd1EzbENMRk5CUVZNN08zbENRVU12UWl4aFFVRmhPenM3TzNWQ1FVTkZMRmRCUVZjN096QkNRVU5TTEdOQlFXTTdPM05DUVVOdVF5eFZRVUZWT3pzN08wRkJSWFJDTEVsQlFVMHNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJRenM3UVVGRGVFSXNTVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eERRVUZETEVOQlFVTTdPenRCUVVVMVFpeEpRVUZOTEdkQ1FVRm5RaXhIUVVGSE8wRkJRemxDTEVkQlFVTXNSVUZCUlN4aFFVRmhPMEZCUTJoQ0xFZEJRVU1zUlVGQlJTeGxRVUZsTzBGQlEyeENMRWRCUVVNc1JVRkJSU3hsUVVGbE8wRkJRMnhDTEVkQlFVTXNSVUZCUlN4VlFVRlZPMEZCUTJJc1IwRkJReXhGUVVGRkxHdENRVUZyUWp0QlFVTnlRaXhIUVVGRExFVkJRVVVzYVVKQlFXbENPMEZCUTNCQ0xFZEJRVU1zUlVGQlJTeFZRVUZWTzBOQlEyUXNRMEZCUXpzN08wRkJSVVlzU1VGQlRTeFZRVUZWTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU03TzBGQlJUbENMRk5CUVZNc2NVSkJRWEZDTEVOQlFVTXNUMEZCVHl4RlFVRkZMRkZCUVZFc1JVRkJSU3hWUVVGVkxFVkJRVVU3UVVGRGJrVXNUVUZCU1N4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFbEJRVWtzUlVGQlJTeERRVUZETzBGQlF6ZENMRTFCUVVrc1EwRkJReXhSUVVGUkxFZEJRVWNzVVVGQlVTeEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTXZRaXhOUVVGSkxFTkJRVU1zVlVGQlZTeEhRVUZITEZWQlFWVXNTVUZCU1N4RlFVRkZMRU5CUVVNN08wRkJSVzVETEd0RFFVRjFRaXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU0zUWl4M1EwRkJNRUlzU1VGQlNTeERRVUZETEVOQlFVTTdRMEZEYWtNN08wRkJSVVFzY1VKQlFYRkNMRU5CUVVNc1UwRkJVeXhIUVVGSE8wRkJRMmhETEdGQlFWY3NSVUZCUlN4eFFrRkJjVUk3TzBGQlJXeERMRkZCUVUwc2NVSkJRVkU3UVVGRFpDeExRVUZITEVWQlFVVXNiMEpCUVU4c1IwRkJSenM3UVVGRlppeG5Ra0ZCWXl4RlFVRkZMSGRDUVVGVExFbEJRVWtzUlVGQlJTeEZRVUZGTEVWQlFVVTdRVUZEYWtNc1VVRkJTU3huUWtGQlV5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1ZVRkJWU3hGUVVGRk8wRkJRM1JETEZWQlFVa3NSVUZCUlN4RlFVRkZPMEZCUVVVc1kwRkJUU3d5UWtGQll5eDVRMEZCZVVNc1EwRkJReXhEUVVGRE8wOUJRVVU3UVVGRE0wVXNiMEpCUVU4c1NVRkJTU3hEUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVTTFRaXhOUVVGTk8wRkJRMHdzVlVGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03UzBGRGVrSTdSMEZEUmp0QlFVTkVMR3RDUVVGblFpeEZRVUZGTERCQ1FVRlRMRWxCUVVrc1JVRkJSVHRCUVVNdlFpeFhRVUZQTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UjBGRE0wSTdPMEZCUlVRc2FVSkJRV1VzUlVGQlJTeDVRa0ZCVXl4SlFVRkpMRVZCUVVVc1QwRkJUeXhGUVVGRk8wRkJRM1pETEZGQlFVa3NaMEpCUVZNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEZWQlFWVXNSVUZCUlR0QlFVTjBReXh2UWtGQlR5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wdEJRemRDTEUxQlFVMDdRVUZEVEN4VlFVRkpMRTlCUVU4c1QwRkJUeXhMUVVGTExGZEJRVmNzUlVGQlJUdEJRVU5zUXl4alFVRk5MSGxGUVVFd1JDeEpRVUZKTEc5Q1FVRnBRaXhEUVVGRE8wOUJRM1pHTzBGQlEwUXNWVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTTdTMEZETDBJN1IwRkRSanRCUVVORUxHMUNRVUZwUWl4RlFVRkZMREpDUVVGVExFbEJRVWtzUlVGQlJUdEJRVU5vUXl4WFFVRlBMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdSMEZETlVJN08wRkJSVVFzYlVKQlFXbENMRVZCUVVVc01rSkJRVk1zU1VGQlNTeEZRVUZGTEVWQlFVVXNSVUZCUlR0QlFVTndReXhSUVVGSkxHZENRVUZUTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhWUVVGVkxFVkJRVVU3UVVGRGRFTXNWVUZCU1N4RlFVRkZMRVZCUVVVN1FVRkJSU3hqUVVGTkxESkNRVUZqTERSRFFVRTBReXhEUVVGRExFTkJRVU03VDBGQlJUdEJRVU01UlN4dlFrRkJUeXhKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUXk5Q0xFMUJRVTA3UVVGRFRDeFZRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF6dExRVU0xUWp0SFFVTkdPMEZCUTBRc2NVSkJRVzFDTEVWQlFVVXNOa0pCUVZNc1NVRkJTU3hGUVVGRk8wRkJRMnhETEZkQlFVOHNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU01UWp0RFFVTkdMRU5CUVVNN08wRkJSVXNzU1VGQlNTeEhRVUZITEVkQlFVY3NiMEpCUVU4c1IwRkJSeXhEUVVGRE96czdVVUZGY0VJc1YwRkJWenRSUVVGRkxFMUJRVTA3T3pzN096czdPenM3T3p0blEwTTNSVUVzY1VKQlFYRkNPenM3TzBGQlJYcERMRk5CUVZNc2VVSkJRWGxDTEVOQlFVTXNVVUZCVVN4RlFVRkZPMEZCUTJ4RUxHZERRVUZsTEZGQlFWRXNRMEZCUXl4RFFVRkRPME5CUXpGQ096czdPenM3T3p0eFFrTktiMElzVlVGQlZUczdjVUpCUldoQ0xGVkJRVk1zVVVGQlVTeEZRVUZGTzBGQlEyaERMRlZCUVZFc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4UlFVRlJMRVZCUVVVc1ZVRkJVeXhGUVVGRkxFVkJRVVVzUzBGQlN5eEZRVUZGTEZOQlFWTXNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRNMFVzVVVGQlNTeEhRVUZITEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJJc1VVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVWQlFVVTdRVUZEYmtJc1YwRkJTeXhEUVVGRExGRkJRVkVzUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEY0VJc1UwRkJSeXhIUVVGSExGVkJRVk1zVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlRzN1FVRkZMMElzV1VGQlNTeFJRVUZSTEVkQlFVY3NVMEZCVXl4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOc1F5eHBRa0ZCVXl4RFFVRkRMRkZCUVZFc1IwRkJSeXhqUVVGUExFVkJRVVVzUlVGQlJTeFJRVUZSTEVWQlFVVXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRekZFTEZsQlFVa3NSMEZCUnl4SFFVRkhMRVZCUVVVc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETDBJc2FVSkJRVk1zUTBGQlF5eFJRVUZSTEVkQlFVY3NVVUZCVVN4RFFVRkRPMEZCUXpsQ0xHVkJRVThzUjBGQlJ5eERRVUZETzA5QlExb3NRMEZCUXp0TFFVTklPenRCUVVWRUxGTkJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEU5QlFVOHNRMEZCUXl4RlFVRkZMRU5CUVVNN08wRkJSVGRETEZkQlFVOHNSMEZCUnl4RFFVRkRPMGRCUTFvc1EwRkJReXhEUVVGRE8wTkJRMG83T3pzN096czdPenM3UVVOd1FrUXNTVUZCVFN4VlFVRlZMRWRCUVVjc1EwRkJReXhoUVVGaExFVkJRVVVzVlVGQlZTeEZRVUZGTEZsQlFWa3NSVUZCUlN4VFFVRlRMRVZCUVVVc1RVRkJUU3hGUVVGRkxGRkJRVkVzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXpzN1FVRkZia2NzVTBGQlV5eFRRVUZUTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVOb1F5eE5RVUZKTEVkQlFVY3NSMEZCUnl4SlFVRkpMRWxCUVVrc1NVRkJTU3hEUVVGRExFZEJRVWM3VFVGRGRFSXNTVUZCU1N4WlFVRkJPMDFCUTBvc1RVRkJUU3haUVVGQkxFTkJRVU03UVVGRFdDeE5RVUZKTEVkQlFVY3NSVUZCUlR0QlFVTlFMRkZCUVVrc1IwRkJSeXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTjBRaXhWUVVGTkxFZEJRVWNzUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNN08wRkJSVEZDTEZkQlFVOHNTVUZCU1N4TFFVRkxMRWRCUVVjc1NVRkJTU3hIUVVGSExFZEJRVWNzUjBGQlJ5eE5RVUZOTEVOQlFVTTdSMEZEZUVNN08wRkJSVVFzVFVGQlNTeEhRVUZITEVkQlFVY3NTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenM3TzBGQlJ6RkVMRTlCUVVzc1NVRkJTU3hIUVVGSExFZEJRVWNzUTBGQlF5eEZRVUZGTEVkQlFVY3NSMEZCUnl4VlFVRlZMRU5CUVVNc1RVRkJUU3hGUVVGRkxFZEJRVWNzUlVGQlJTeEZRVUZGTzBGQlEyaEVMRkZCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNSMEZCUnl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZET1VNN096dEJRVWRFTEUxQlFVa3NTMEZCU3l4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTzBGQlF6TkNMRk5CUVVzc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4SlFVRkpMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03UjBGRE1VTTdPMEZCUlVRc1RVRkJTVHRCUVVOR0xGRkJRVWtzUjBGQlJ5eEZRVUZGTzBGQlExQXNWVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU03T3pzN1FVRkpka0lzVlVGQlNTeE5RVUZOTEVOQlFVTXNZMEZCWXl4RlFVRkZPMEZCUTNwQ0xHTkJRVTBzUTBGQlF5eGpRVUZqTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hGUVVGRExFdEJRVXNzUlVGQlJTeE5RVUZOTEVWQlFVTXNRMEZCUXl4RFFVRkRPMDlCUTNoRUxFMUJRVTA3UVVGRFRDeFpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJRenRQUVVOMFFqdExRVU5HTzBkQlEwWXNRMEZCUXl4UFFVRlBMRWRCUVVjc1JVRkJSVHM3UjBGRllqdERRVU5HT3p0QlFVVkVMRk5CUVZNc1EwRkJReXhUUVVGVExFZEJRVWNzU1VGQlNTeExRVUZMTEVWQlFVVXNRMEZCUXpzN2NVSkJSVzVDTEZOQlFWTTdPenM3T3pzN096czdPenM3ZVVORE4wTmxMR2REUVVGblF6czdPenN5UWtGRE9VTXNaMEpCUVdkQ096czdPMjlEUVVOUUxEQkNRVUV3UWpzN096dDVRa0ZEY2tNc1kwRkJZenM3T3pzd1FrRkRZaXhsUVVGbE96czdPelpDUVVOYUxHdENRVUZyUWpzN096c3lRa0ZEY0VJc1owSkJRV2RDT3pzN08wRkJSV3hETEZOQlFWTXNjMEpCUVhOQ0xFTkJRVU1zVVVGQlVTeEZRVUZGTzBGQlF5OURMSGxEUVVFeVFpeFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTnlReXd5UWtGQllTeFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTjJRaXh2UTBGQmMwSXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRhRU1zZVVKQlFWY3NVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRja0lzTUVKQlFWa3NVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRkRUlzTmtKQlFXVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRla0lzTWtKQlFXRXNVVUZCVVN4RFFVRkRMRU5CUVVNN1EwRkRlRUk3T3pzN096czdPM0ZDUTJoQ2NVUXNWVUZCVlRzN2NVSkJSV3BFTEZWQlFWTXNVVUZCVVN4RlFVRkZPMEZCUTJoRExGVkJRVkVzUTBGQlF5eGpRVUZqTEVOQlFVTXNiMEpCUVc5Q0xFVkJRVVVzVlVGQlV5eFBRVUZQTEVWQlFVVXNUMEZCVHl4RlFVRkZPMEZCUTNaRkxGRkJRVWtzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4UFFVRlBPMUZCUTNwQ0xFVkJRVVVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNSVUZCUlN4RFFVRkRPenRCUVVWd1FpeFJRVUZKTEU5QlFVOHNTMEZCU3l4SlFVRkpMRVZCUVVVN1FVRkRjRUlzWVVGQlR5eEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1MwRkRha0lzVFVGQlRTeEpRVUZKTEU5QlFVOHNTMEZCU3l4TFFVRkxMRWxCUVVrc1QwRkJUeXhKUVVGSkxFbEJRVWtzUlVGQlJUdEJRVU12UXl4aFFVRlBMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU4wUWl4TlFVRk5MRWxCUVVrc1pVRkJVU3hQUVVGUExFTkJRVU1zUlVGQlJUdEJRVU16UWl4VlFVRkpMRTlCUVU4c1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEzUkNMRmxCUVVrc1QwRkJUeXhEUVVGRExFZEJRVWNzUlVGQlJUdEJRVU5tTEdsQ1FVRlBMRU5CUVVNc1IwRkJSeXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMU5CUXpsQ096dEJRVVZFTEdWQlFVOHNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMDlCUTJoRUxFMUJRVTA3UVVGRFRDeGxRVUZQTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRQUVVOMFFqdExRVU5HTEUxQlFVMDdRVUZEVEN4VlFVRkpMRTlCUVU4c1EwRkJReXhKUVVGSkxFbEJRVWtzVDBGQlR5eERRVUZETEVkQlFVY3NSVUZCUlR0QlFVTXZRaXhaUVVGSkxFbEJRVWtzUjBGQlJ5eHRRa0ZCV1N4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGNrTXNXVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXg1UWtGQmEwSXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUXpkRkxHVkJRVThzUjBGQlJ5eEZRVUZETEVsQlFVa3NSVUZCUlN4SlFVRkpMRVZCUVVNc1EwRkJRenRQUVVONFFqczdRVUZGUkN4aFFVRlBMRVZCUVVVc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdTMEZETjBJN1IwRkRSaXhEUVVGRExFTkJRVU03UTBGRFNqczdPenM3T3pzN096czdPenR4UWtNdlFqaEZMRlZCUVZVN08zbENRVU51UlN4alFVRmpPenM3TzNGQ1FVVnlRaXhWUVVGVExGRkJRVkVzUlVGQlJUdEJRVU5vUXl4VlFVRlJMRU5CUVVNc1kwRkJZeXhEUVVGRExFMUJRVTBzUlVGQlJTeFZRVUZUTEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRla1FzVVVGQlNTeERRVUZETEU5QlFVOHNSVUZCUlR0QlFVTmFMRmxCUVUwc01rSkJRV01zTmtKQlFUWkNMRU5CUVVNc1EwRkJRenRMUVVOd1JEczdRVUZGUkN4UlFVRkpMRVZCUVVVc1IwRkJSeXhQUVVGUExFTkJRVU1zUlVGQlJUdFJRVU5tTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUenRSUVVONlFpeERRVUZETEVkQlFVY3NRMEZCUXp0UlFVTk1MRWRCUVVjc1IwRkJSeXhGUVVGRk8xRkJRMUlzU1VGQlNTeFpRVUZCTzFGQlEwb3NWMEZCVnl4WlFVRkJMRU5CUVVNN08wRkJSV2hDTEZGQlFVa3NUMEZCVHl4RFFVRkRMRWxCUVVrc1NVRkJTU3hQUVVGUExFTkJRVU1zUjBGQlJ5eEZRVUZGTzBGQlF5OUNMR2xDUVVGWExFZEJRVWNzZVVKQlFXdENMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEhRVUZITEVOQlFVTTdTMEZEYWtZN08wRkJSVVFzVVVGQlNTeHJRa0ZCVnl4UFFVRlBMRU5CUVVNc1JVRkJSVHRCUVVGRkxHRkJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wdEJRVVU3TzBGQlJURkVMRkZCUVVrc1QwRkJUeXhEUVVGRExFbEJRVWtzUlVGQlJUdEJRVU5vUWl4VlFVRkpMRWRCUVVjc2JVSkJRVmtzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUTJ4RE96dEJRVVZFTEdGQlFWTXNZVUZCWVN4RFFVRkRMRXRCUVVzc1JVRkJSU3hMUVVGTExFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlEzcERMRlZCUVVrc1NVRkJTU3hGUVVGRk8wRkJRMUlzV1VGQlNTeERRVUZETEVkQlFVY3NSMEZCUnl4TFFVRkxMRU5CUVVNN1FVRkRha0lzV1VGQlNTeERRVUZETEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNN1FVRkRia0lzV1VGQlNTeERRVUZETEV0QlFVc3NSMEZCUnl4TFFVRkxMRXRCUVVzc1EwRkJReXhEUVVGRE8wRkJRM3BDTEZsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF6czdRVUZGYmtJc1dVRkJTU3hYUVVGWExFVkJRVVU3UVVGRFppeGpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRmRCUVZjc1IwRkJSeXhMUVVGTExFTkJRVU03VTBGRGVFTTdUMEZEUmpzN1FVRkZSQ3hUUVVGSExFZEJRVWNzUjBGQlJ5eEhRVUZITEVWQlFVVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVU3UVVGRE4wSXNXVUZCU1N4RlFVRkZMRWxCUVVrN1FVRkRWaXh0UWtGQlZ5eEZRVUZGTEcxQ1FVRlpMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RlFVRkZMRU5CUVVNc1YwRkJWeXhIUVVGSExFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0UFFVTXZSU3hEUVVGRExFTkJRVU03UzBGRFNqczdRVUZGUkN4UlFVRkpMRTlCUVU4c1NVRkJTU3hQUVVGUExFOUJRVThzUzBGQlN5eFJRVUZSTEVWQlFVVTdRVUZETVVNc1ZVRkJTU3hsUVVGUkxFOUJRVThzUTBGQlF5eEZRVUZGTzBGQlEzQkNMR0ZCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlEzWkRMR05CUVVrc1EwRkJReXhKUVVGSkxFOUJRVThzUlVGQlJUdEJRVU5vUWl4NVFrRkJZU3hEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRTlCUVU4c1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdWMEZETDBNN1UwRkRSanRQUVVOR0xFMUJRVTA3UVVGRFRDeFpRVUZKTEZGQlFWRXNXVUZCUVN4RFFVRkRPenRCUVVWaUxHRkJRVXNzU1VGQlNTeEhRVUZITEVsQlFVa3NUMEZCVHl4RlFVRkZPMEZCUTNaQ0xHTkJRVWtzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSVHM3T3p0QlFVa3ZRaXhuUWtGQlNTeFJRVUZSTEV0QlFVc3NVMEZCVXl4RlFVRkZPMEZCUXpGQ0xESkNRVUZoTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dGhRVU5vUXp0QlFVTkVMRzlDUVVGUkxFZEJRVWNzUjBGQlJ5eERRVUZETzBGQlEyWXNZVUZCUXl4RlFVRkZMRU5CUVVNN1YwRkRURHRUUVVOR08wRkJRMFFzV1VGQlNTeFJRVUZSTEV0QlFVc3NVMEZCVXl4RlFVRkZPMEZCUXpGQ0xIVkNRVUZoTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdVMEZEZEVNN1QwRkRSanRMUVVOR096dEJRVVZFTEZGQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSVHRCUVVOWUxGTkJRVWNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1MwRkRja0k3TzBGQlJVUXNWMEZCVHl4SFFVRkhMRU5CUVVNN1IwRkRXaXhEUVVGRExFTkJRVU03UTBGRFNqczdPenM3T3pzN096czdPenQ1UWtNNVJYRkNMR05CUVdNN096czdjVUpCUlhKQ0xGVkJRVk1zVVVGQlVTeEZRVUZGTzBGQlEyaERMRlZCUVZFc1EwRkJReXhqUVVGakxFTkJRVU1zWlVGQlpTeEZRVUZGTEdsRFFVRm5RenRCUVVOMlJTeFJRVUZKTEZOQlFWTXNRMEZCUXl4TlFVRk5MRXRCUVVzc1EwRkJReXhGUVVGRk96dEJRVVV4UWl4aFFVRlBMRk5CUVZNc1EwRkJRenRMUVVOc1FpeE5RVUZOT3p0QlFVVk1MRmxCUVUwc01rSkJRV01zYlVKQlFXMUNMRWRCUVVjc1UwRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hIUVVGSExFZEJRVWNzUTBGQlF5eERRVUZETzB0QlEzWkdPMGRCUTBZc1EwRkJReXhEUVVGRE8wTkJRMG83T3pzN096czdPenM3Y1VKRFdtbERMRlZCUVZVN08zRkNRVVUzUWl4VlFVRlRMRkZCUVZFc1JVRkJSVHRCUVVOb1F5eFZRVUZSTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hWUVVGVExGZEJRVmNzUlVGQlJTeFBRVUZQTEVWQlFVVTdRVUZETTBRc1VVRkJTU3hyUWtGQlZ5eFhRVUZYTEVOQlFVTXNSVUZCUlR0QlFVRkZMR2xDUVVGWExFZEJRVWNzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVGRk96czdPenRCUVV0MFJTeFJRVUZKTEVGQlFVTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExGZEJRVmNzU1VGQlNTeERRVUZETEZkQlFWY3NTVUZCU3l4bFFVRlJMRmRCUVZjc1EwRkJReXhGUVVGRk8wRkJRM1pGTEdGQlFVOHNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU01UWl4TlFVRk5PMEZCUTB3c1lVRkJUeXhQUVVGUExFTkJRVU1zUlVGQlJTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUTNwQ08wZEJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRlZCUVZFc1EwRkJReXhqUVVGakxFTkJRVU1zVVVGQlVTeEZRVUZGTEZWQlFWTXNWMEZCVnl4RlFVRkZMRTlCUVU4c1JVRkJSVHRCUVVNdlJDeFhRVUZQTEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4WFFVRlhMRVZCUVVVc1JVRkJReXhGUVVGRkxFVkJRVVVzVDBGQlR5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVc1QwRkJUeXhEUVVGRExFVkJRVVVzUlVGQlJTeEpRVUZKTEVWQlFVVXNUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJReXhEUVVGRExFTkJRVU03UjBGRGRrZ3NRMEZCUXl4RFFVRkRPME5CUTBvN096czdPenM3T3pzN2NVSkRia0pqTEZWQlFWTXNVVUZCVVN4RlFVRkZPMEZCUTJoRExGVkJRVkVzUTBGQlF5eGpRVUZqTEVOQlFVTXNTMEZCU3l4RlFVRkZMR3REUVVGcFF6dEJRVU01UkN4UlFVRkpMRWxCUVVrc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF6dFJRVU5zUWl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRPVU1zVTBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExGTkJRVk1zUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRemRETEZWQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdTMEZEZWtJN08wRkJSVVFzVVVGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTJRc1VVRkJTU3hQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NTVUZCU1N4SlFVRkpMRVZCUVVVN1FVRkRPVUlzVjBGQlN5eEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRE8wdEJRelZDTEUxQlFVMHNTVUZCU1N4UFFVRlBMRU5CUVVNc1NVRkJTU3hKUVVGSkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4SlFVRkpMRWxCUVVrc1JVRkJSVHRCUVVOeVJDeFhRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU03UzBGRE5VSTdRVUZEUkN4UlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZET3p0QlFVVm9RaXhaUVVGUkxFTkJRVU1zUjBGQlJ5eE5RVUZCTEVOQlFWb3NVVUZCVVN4RlFVRlRMRWxCUVVrc1EwRkJReXhEUVVGRE8wZEJRM2hDTEVOQlFVTXNRMEZCUXp0RFFVTktPenM3T3pzN096czdPM0ZDUTJ4Q1l5eFZRVUZUTEZGQlFWRXNSVUZCUlR0QlFVTm9ReXhWUVVGUkxFTkJRVU1zWTBGQll5eERRVUZETEZGQlFWRXNSVUZCUlN4VlFVRlRMRWRCUVVjc1JVRkJSU3hMUVVGTExFVkJRVVU3UVVGRGNrUXNWMEZCVHl4SFFVRkhMRWxCUVVrc1IwRkJSeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBkQlF6RkNMRU5CUVVNc1EwRkJRenREUVVOS096czdPenM3T3pzN08zRkNRMG80UlN4VlFVRlZPenR4UWtGRk1VVXNWVUZCVXl4UlFVRlJMRVZCUVVVN1FVRkRhRU1zVlVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1ZVRkJVeXhQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTzBGQlEzcEVMRkZCUVVrc2EwSkJRVmNzVDBGQlR5eERRVUZETEVWQlFVVTdRVUZCUlN4aFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVRkZPenRCUVVVeFJDeFJRVUZKTEVWQlFVVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1JVRkJSU3hEUVVGRE96dEJRVVZ3UWl4UlFVRkpMRU5CUVVNc1pVRkJVU3hQUVVGUExFTkJRVU1zUlVGQlJUdEJRVU55UWl4VlFVRkpMRWxCUVVrc1IwRkJSeXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETzBGQlEzaENMRlZCUVVrc1QwRkJUeXhEUVVGRExFbEJRVWtzU1VGQlNTeFBRVUZQTEVOQlFVTXNSMEZCUnl4RlFVRkZPMEZCUXk5Q0xGbEJRVWtzUjBGQlJ5eHRRa0ZCV1N4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGFrTXNXVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXg1UWtGQmEwSXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wOUJRMmhHT3p0QlFVVkVMR0ZCUVU4c1JVRkJSU3hEUVVGRExFOUJRVThzUlVGQlJUdEJRVU5xUWl4WlFVRkpMRVZCUVVVc1NVRkJTVHRCUVVOV0xHMUNRVUZYTEVWQlFVVXNiVUpCUVZrc1EwRkJReXhQUVVGUExFTkJRVU1zUlVGQlJTeERRVUZETEVsQlFVa3NTVUZCU1N4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU03VDBGRGFFVXNRMEZCUXl4RFFVRkRPMHRCUTBvc1RVRkJUVHRCUVVOTUxHRkJRVThzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVNNVFqdEhRVU5HTEVOQlFVTXNRMEZCUXp0RFFVTktPenM3T3pzN096czdPM0ZDUTNaQ2NVSXNVMEZCVXpzN1FVRkZMMElzU1VGQlNTeE5RVUZOTEVkQlFVYzdRVUZEV0N4WFFVRlRMRVZCUVVVc1EwRkJReXhQUVVGUExFVkJRVVVzVFVGQlRTeEZRVUZGTEUxQlFVMHNSVUZCUlN4UFFVRlBMRU5CUVVNN1FVRkROME1zVDBGQlN5eEZRVUZGTEUxQlFVMDdPenRCUVVkaUxHRkJRVmNzUlVGQlJTeHhRa0ZCVXl4TFFVRkxMRVZCUVVVN1FVRkRNMElzVVVGQlNTeFBRVUZQTEV0QlFVc3NTMEZCU3l4UlFVRlJMRVZCUVVVN1FVRkROMElzVlVGQlNTeFJRVUZSTEVkQlFVY3NaVUZCVVN4TlFVRk5MRU5CUVVNc1UwRkJVeXhGUVVGRkxFdEJRVXNzUTBGQlF5eFhRVUZYTEVWQlFVVXNRMEZCUXl4RFFVRkRPMEZCUXpsRUxGVkJRVWtzVVVGQlVTeEpRVUZKTEVOQlFVTXNSVUZCUlR0QlFVTnFRaXhoUVVGTExFZEJRVWNzVVVGQlVTeERRVUZETzA5QlEyeENMRTFCUVUwN1FVRkRUQ3hoUVVGTExFZEJRVWNzVVVGQlVTeERRVUZETEV0QlFVc3NSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRQUVVNM1FqdExRVU5HT3p0QlFVVkVMRmRCUVU4c1MwRkJTeXhEUVVGRE8wZEJRMlE3T3p0QlFVZEVMRXRCUVVjc1JVRkJSU3hoUVVGVExFdEJRVXNzUlVGQll6dEJRVU12UWl4VFFVRkxMRWRCUVVjc1RVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXpzN1FVRkZiRU1zVVVGQlNTeFBRVUZQTEU5QlFVOHNTMEZCU3l4WFFVRlhMRWxCUVVrc1RVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1MwRkJTeXhGUVVGRk8wRkJReTlGTEZWQlFVa3NUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEY2tNc1ZVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlRzN1FVRkRjRUlzWTBGQlRTeEhRVUZITEV0QlFVc3NRMEZCUXp0UFFVTm9RanM3ZDBOQlVHMUNMRTlCUVU4N1FVRkJVQ3hsUVVGUE96czdRVUZSTTBJc1lVRkJUeXhEUVVGRExFMUJRVTBzVDBGQlF5eERRVUZtTEU5QlFVOHNSVUZCV1N4UFFVRlBMRU5CUVVNc1EwRkJRenRMUVVNM1FqdEhRVU5HTzBOQlEwWXNRMEZCUXpzN2NVSkJSV0VzVFVGQlRUczdPenM3T3pzN096czdjVUpEYWtOT0xGVkJRVk1zVlVGQlZTeEZRVUZGT3p0QlFVVnNReXhOUVVGSkxFbEJRVWtzUjBGQlJ5eFBRVUZQTEUxQlFVMHNTMEZCU3l4WFFVRlhMRWRCUVVjc1RVRkJUU3hIUVVGSExFMUJRVTA3VFVGRGRFUXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU03TzBGQlJXeERMRmxCUVZVc1EwRkJReXhWUVVGVkxFZEJRVWNzV1VGQlZ6dEJRVU5xUXl4UlFVRkpMRWxCUVVrc1EwRkJReXhWUVVGVkxFdEJRVXNzVlVGQlZTeEZRVUZGTzBGQlEyeERMRlZCUVVrc1EwRkJReXhWUVVGVkxFZEJRVWNzVjBGQlZ5eERRVUZETzB0QlF5OUNPMEZCUTBRc1YwRkJUeXhWUVVGVkxFTkJRVU03UjBGRGJrSXNRMEZCUXp0RFFVTklPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN08zRkNRMXB6UWl4VFFVRlRPenRKUVVGd1FpeExRVUZMT3p0NVFrRkRTeXhoUVVGaE96czdPMjlDUVVNNFFpeFJRVUZST3p0QlFVVnNSU3hUUVVGVExHRkJRV0VzUTBGQlF5eFpRVUZaTEVWQlFVVTdRVUZETVVNc1RVRkJUU3huUWtGQlowSXNSMEZCUnl4WlFVRlpMRWxCUVVrc1dVRkJXU3hEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTTdUVUZEZGtRc1pVRkJaU3d3UWtGQmIwSXNRMEZCUXpzN1FVRkZNVU1zVFVGQlNTeG5Ra0ZCWjBJc1MwRkJTeXhsUVVGbExFVkJRVVU3UVVGRGVFTXNVVUZCU1N4blFrRkJaMElzUjBGQlJ5eGxRVUZsTEVWQlFVVTdRVUZEZEVNc1ZVRkJUU3hsUVVGbExFZEJRVWNzZFVKQlFXbENMR1ZCUVdVc1EwRkJRenRWUVVOdVJDeG5Ra0ZCWjBJc1IwRkJSeXgxUWtGQmFVSXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6dEJRVU0xUkN4WlFVRk5MREpDUVVGakxIbEdRVUY1Uml4SFFVTjJSeXh4UkVGQmNVUXNSMEZCUnl4bFFVRmxMRWRCUVVjc2JVUkJRVzFFTEVkQlFVY3NaMEpCUVdkQ0xFZEJRVWNzU1VGQlNTeERRVUZETEVOQlFVTTdTMEZEYUVzc1RVRkJUVHM3UVVGRlRDeFpRVUZOTERKQ1FVRmpMSGRHUVVGM1JpeEhRVU4wUnl4cFJFRkJhVVFzUjBGQlJ5eFpRVUZaTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGRGJrWTdSMEZEUmp0RFFVTkdPenRCUVVWTkxGTkJRVk1zVVVGQlVTeERRVUZETEZsQlFWa3NSVUZCUlN4SFFVRkhMRVZCUVVVN08wRkJSVEZETEUxQlFVa3NRMEZCUXl4SFFVRkhMRVZCUVVVN1FVRkRVaXhWUVVGTkxESkNRVUZqTEcxRFFVRnRReXhEUVVGRExFTkJRVU03UjBGRE1VUTdRVUZEUkN4TlFVRkpMRU5CUVVNc1dVRkJXU3hKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NSVUZCUlR0QlFVTjJReXhWUVVGTkxESkNRVUZqTERKQ1FVRXlRaXhIUVVGSExFOUJRVThzV1VGQldTeERRVUZETEVOQlFVTTdSMEZEZUVVN08wRkJSVVFzWTBGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRWRCUVVjc1dVRkJXU3hEUVVGRExFMUJRVTBzUTBGQlF6czdPenRCUVVsc1JDeExRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhaUVVGWkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdPMEZCUlRWRExGZEJRVk1zYjBKQlFXOUNMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUlVGQlJTeFBRVUZQTEVWQlFVVTdRVUZEZGtRc1VVRkJTU3hQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTzBGQlEyaENMR0ZCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVWQlFVVXNSVUZCUlN4UFFVRlBMRVZCUVVVc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEyeEVMRlZCUVVrc1QwRkJUeXhEUVVGRExFZEJRVWNzUlVGQlJUdEJRVU5tTEdWQlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETzA5QlEzWkNPMHRCUTBZN08wRkJSVVFzVjBGQlR5eEhRVUZITEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU4wUlN4UlFVRkpMRTFCUVUwc1IwRkJSeXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFOUJRVThzUlVGQlJTeFBRVUZQTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSWGhGTEZGQlFVa3NUVUZCVFN4SlFVRkpMRWxCUVVrc1NVRkJTU3hIUVVGSExFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlEycERMR0ZCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eEZRVUZGTEZsQlFWa3NRMEZCUXl4bFFVRmxMRVZCUVVVc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGVrWXNXVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dExRVU16UkR0QlFVTkVMRkZCUVVrc1RVRkJUU3hKUVVGSkxFbEJRVWtzUlVGQlJUdEJRVU5zUWl4VlFVRkpMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGJFSXNXVUZCU1N4TFFVRkxMRWRCUVVjc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhoUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRelZETEdOQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRVZCUVVVN1FVRkROVUlzYTBKQlFVMDdWMEZEVURzN1FVRkZSQ3hsUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVMEZEZEVNN1FVRkRSQ3hqUVVGTkxFZEJRVWNzUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRQUVVNelFqdEJRVU5FTEdGQlFVOHNUVUZCVFN4RFFVRkRPMHRCUTJZc1RVRkJUVHRCUVVOTUxGbEJRVTBzTWtKQlFXTXNZMEZCWXl4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFZEJRVWNzTUVSQlFUQkVMRU5CUVVNc1EwRkJRenRMUVVOcVNEdEhRVU5HT3pzN1FVRkhSQ3hOUVVGSkxGTkJRVk1zUjBGQlJ6dEJRVU5rTEZWQlFVMHNSVUZCUlN4blFrRkJVeXhIUVVGSExFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlF6RkNMRlZCUVVrc1JVRkJSU3hKUVVGSkxFbEJRVWtzUjBGQlJ5eERRVUZCTEVGQlFVTXNSVUZCUlR0QlFVTnNRaXhqUVVGTkxESkNRVUZqTEVkQlFVY3NSMEZCUnl4SlFVRkpMRWRCUVVjc2JVSkJRVzFDTEVkQlFVY3NSMEZCUnl4RFFVRkRMRU5CUVVNN1QwRkROMFE3UVVGRFJDeGhRVUZQTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVOc1FqdEJRVU5FTEZWQlFVMHNSVUZCUlN4blFrRkJVeXhOUVVGTkxFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlF6ZENMRlZCUVUwc1IwRkJSeXhIUVVGSExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTTdRVUZETVVJc1YwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRWRCUVVjc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU0xUWl4WlFVRkpMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzU1VGQlNTeEZRVUZGTzBGQlEzaERMR2xDUVVGUExFMUJRVTBzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRUUVVONFFqdFBRVU5HTzB0QlEwWTdRVUZEUkN4VlFVRk5MRVZCUVVVc1owSkJRVk1zVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlR0QlFVTnFReXhoUVVGUExFOUJRVThzVDBGQlR5eExRVUZMTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEU5QlFVOHNRMEZCUXp0TFFVTjRSVHM3UVVGRlJDeHZRa0ZCWjBJc1JVRkJSU3hMUVVGTExFTkJRVU1zWjBKQlFXZENPMEZCUTNoRExHbENRVUZoTEVWQlFVVXNiMEpCUVc5Q096dEJRVVZ1UXl4TlFVRkZMRVZCUVVVc1dVRkJVeXhEUVVGRExFVkJRVVU3UVVGRFpDeFZRVUZKTEVkQlFVY3NSMEZCUnl4WlFVRlpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE1VSXNVMEZCUnl4RFFVRkRMRk5CUVZNc1IwRkJSeXhaUVVGWkxFTkJRVU1zUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTNaRExHRkJRVThzUjBGQlJ5eERRVUZETzB0QlExbzdPMEZCUlVRc1dVRkJVU3hGUVVGRkxFVkJRVVU3UVVGRFdpeFhRVUZQTEVWQlFVVXNhVUpCUVZNc1EwRkJReXhGUVVGRkxFbEJRVWtzUlVGQlJTeHRRa0ZCYlVJc1JVRkJSU3hYUVVGWExFVkJRVVVzVFVGQlRTeEZRVUZGTzBGQlEyNUZMRlZCUVVrc1kwRkJZeXhIUVVGSExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRPMVZCUTJwRExFVkJRVVVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM0JDTEZWQlFVa3NTVUZCU1N4SlFVRkpMRTFCUVUwc1NVRkJTU3hYUVVGWExFbEJRVWtzYlVKQlFXMUNMRVZCUVVVN1FVRkRlRVFzYzBKQlFXTXNSMEZCUnl4WFFVRlhMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTEVWQlFVVXNTVUZCU1N4RlFVRkZMRzFDUVVGdFFpeEZRVUZGTEZkQlFWY3NSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRQUVVNelJpeE5RVUZOTEVsQlFVa3NRMEZCUXl4alFVRmpMRVZCUVVVN1FVRkRNVUlzYzBKQlFXTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEZkQlFWY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzA5QlF6bEVPMEZCUTBRc1lVRkJUeXhqUVVGakxFTkJRVU03UzBGRGRrSTdPMEZCUlVRc1VVRkJTU3hGUVVGRkxHTkJRVk1zUzBGQlN5eEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTXpRaXhoUVVGUExFdEJRVXNzU1VGQlNTeExRVUZMTEVWQlFVVXNSVUZCUlR0QlFVTjJRaXhoUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXp0UFFVTjJRanRCUVVORUxHRkJRVThzUzBGQlN5eERRVUZETzB0QlEyUTdRVUZEUkN4VFFVRkxMRVZCUVVVc1pVRkJVeXhMUVVGTExFVkJRVVVzVFVGQlRTeEZRVUZGTzBGQlF6ZENMRlZCUVVrc1IwRkJSeXhIUVVGSExFdEJRVXNzU1VGQlNTeE5RVUZOTEVOQlFVTTdPMEZCUlRGQ0xGVkJRVWtzUzBGQlN5eEpRVUZKTEUxQlFVMHNTVUZCU3l4TFFVRkxMRXRCUVVzc1RVRkJUU3hCUVVGRExFVkJRVVU3UVVGRGVrTXNWMEZCUnl4SFFVRkhMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTEUxQlFVMHNSVUZCUlN4TFFVRkxMRU5CUVVNc1EwRkJRenRQUVVOMlF6czdRVUZGUkN4aFFVRlBMRWRCUVVjc1EwRkJRenRMUVVOYU96dEJRVVZFTEZGQlFVa3NSVUZCUlN4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFbEJRVWs3UVVGRGFrSXNaMEpCUVZrc1JVRkJSU3haUVVGWkxFTkJRVU1zVVVGQlVUdEhRVU53UXl4RFFVRkRPenRCUVVWR0xGZEJRVk1zUjBGQlJ5eERRVUZETEU5QlFVOHNSVUZCWjBJN1VVRkJaQ3hQUVVGUExIbEVRVUZITEVWQlFVVTdPMEZCUTJoRExGRkJRVWtzU1VGQlNTeEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNN08wRkJSWGhDTEU5QlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGNFSXNVVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhQUVVGUExFbEJRVWtzV1VGQldTeERRVUZETEU5QlFVOHNSVUZCUlR0QlFVTTFReXhWUVVGSkxFZEJRVWNzVVVGQlVTeERRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVOb1F6dEJRVU5FTEZGQlFVa3NUVUZCVFN4WlFVRkJPMUZCUTA0c1YwRkJWeXhIUVVGSExGbEJRVmtzUTBGQlF5eGpRVUZqTEVkQlFVY3NSVUZCUlN4SFFVRkhMRk5CUVZNc1EwRkJRenRCUVVNdlJDeFJRVUZKTEZsQlFWa3NRMEZCUXl4VFFVRlRMRVZCUVVVN1FVRkRNVUlzVlVGQlNTeFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTJ4Q0xHTkJRVTBzUjBGQlJ5eFBRVUZQTEVsQlFVa3NUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJRenRQUVVNelJpeE5RVUZOTzBGQlEwd3NZMEZCVFN4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03VDBGRGNFSTdTMEZEUmpzN1FVRkZSQ3hoUVVGVExFbEJRVWtzUTBGQlF5eFBRVUZQTEdkQ1FVRmxPMEZCUTJ4RExHRkJRVThzUlVGQlJTeEhRVUZITEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRkxFOUJRVThzUlVGQlJTeFRRVUZUTEVOQlFVTXNUMEZCVHl4RlFVRkZMRk5CUVZNc1EwRkJReXhSUVVGUkxFVkJRVVVzU1VGQlNTeEZRVUZGTEZkQlFWY3NSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRMUVVOeVNEdEJRVU5FTEZGQlFVa3NSMEZCUnl4cFFrRkJhVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1JVRkJSU3hUUVVGVExFVkJRVVVzVDBGQlR5eERRVUZETEUxQlFVMHNTVUZCU1N4RlFVRkZMRVZCUVVVc1NVRkJTU3hGUVVGRkxGZEJRVmNzUTBGQlF5eERRVUZETzBGQlEzUkhMRmRCUVU4c1NVRkJTU3hEUVVGRExFOUJRVThzUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0SFFVTXZRanRCUVVORUxFdEJRVWNzUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRPenRCUVVWcVFpeExRVUZITEVOQlFVTXNUVUZCVFN4SFFVRkhMRlZCUVZNc1QwRkJUeXhGUVVGRk8wRkJRemRDTEZGQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRM0JDTEdWQlFWTXNRMEZCUXl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6czdRVUZGYkVVc1ZVRkJTU3haUVVGWkxFTkJRVU1zVlVGQlZTeEZRVUZGTzBGQlF6TkNMR2xDUVVGVExFTkJRVU1zVVVGQlVTeEhRVUZITEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExGRkJRVkVzUlVGQlJTeEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1QwRkRkRVU3UVVGRFJDeFZRVUZKTEZsQlFWa3NRMEZCUXl4VlFVRlZMRWxCUVVrc1dVRkJXU3hEUVVGRExHRkJRV0VzUlVGQlJUdEJRVU42UkN4cFFrRkJVeXhEUVVGRExGVkJRVlVzUjBGQlJ5eFRRVUZUTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFVkJRVVVzUjBGQlJ5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMDlCUXpWRk8wdEJRMFlzVFVGQlRUdEJRVU5NTEdWQlFWTXNRMEZCUXl4UFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF6dEJRVU53UXl4bFFVRlRMRU5CUVVNc1VVRkJVU3hIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEZEVNc1pVRkJVeXhEUVVGRExGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRPMHRCUXpORE8wZEJRMFlzUTBGQlF6czdRVUZGUml4TFFVRkhMRU5CUVVNc1RVRkJUU3hIUVVGSExGVkJRVk1zUTBGQlF5eEZRVUZGTEVsQlFVa3NSVUZCUlN4WFFVRlhMRVZCUVVVc1RVRkJUU3hGUVVGRk8wRkJRMnhFTEZGQlFVa3NXVUZCV1N4RFFVRkRMR05CUVdNc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJUdEJRVU12UXl4WlFVRk5MREpDUVVGakxIZENRVUYzUWl4RFFVRkRMRU5CUVVNN1MwRkRMME03UVVGRFJDeFJRVUZKTEZsQlFWa3NRMEZCUXl4VFFVRlRMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGNrTXNXVUZCVFN3eVFrRkJZeXg1UWtGQmVVSXNRMEZCUXl4RFFVRkRPMHRCUTJoRU96dEJRVVZFTEZkQlFVOHNWMEZCVnl4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRExFVkJRVVVzV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRWxCUVVrc1JVRkJSU3hEUVVGRExFVkJRVVVzVjBGQlZ5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMGRCUTJwR0xFTkJRVU03UVVGRFJpeFRRVUZQTEVkQlFVY3NRMEZCUXp0RFFVTmFPenRCUVVWTkxGTkJRVk1zVjBGQlZ5eERRVUZETEZOQlFWTXNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSU3hGUVVGRkxFbEJRVWtzUlVGQlJTeHRRa0ZCYlVJc1JVRkJSU3hYUVVGWExFVkJRVVVzVFVGQlRTeEZRVUZGTzBGQlF6VkdMRmRCUVZNc1NVRkJTU3hEUVVGRExFOUJRVThzUlVGQlowSTdVVUZCWkN4UFFVRlBMSGxFUVVGSExFVkJRVVU3TzBGQlEycERMRkZCUVVrc1lVRkJZU3hIUVVGSExFMUJRVTBzUTBGQlF6dEJRVU16UWl4UlFVRkpMRTFCUVUwc1NVRkJTU3hQUVVGUExFbEJRVWtzVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZPMEZCUTJ4RExHMUNRVUZoTEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdTMEZETVVNN08wRkJSVVFzVjBGQlR5eEZRVUZGTEVOQlFVTXNVMEZCVXl4RlFVTm1MRTlCUVU4c1JVRkRVQ3hUUVVGVExFTkJRVU1zVDBGQlR5eEZRVUZGTEZOQlFWTXNRMEZCUXl4UlFVRlJMRVZCUTNKRExFOUJRVThzUTBGQlF5eEpRVUZKTEVsQlFVa3NTVUZCU1N4RlFVTndRaXhYUVVGWExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF5eEZRVU40UkN4aFFVRmhMRU5CUVVNc1EwRkJRenRIUVVOd1FqczdRVUZGUkN4TlFVRkpMRWRCUVVjc2FVSkJRV2xDTEVOQlFVTXNSVUZCUlN4RlFVRkZMRWxCUVVrc1JVRkJSU3hUUVVGVExFVkJRVVVzVFVGQlRTeEZRVUZGTEVsQlFVa3NSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJRenM3UVVGRmVrVXNUVUZCU1N4RFFVRkRMRTlCUVU4c1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFrSXNUVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhOUVVGTkxFZEJRVWNzVFVGQlRTeERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRlRU1zVFVGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4dFFrRkJiVUlzU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETlVNc1UwRkJUeXhKUVVGSkxFTkJRVU03UTBGRFlqczdRVUZGVFN4VFFVRlRMR05CUVdNc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTEU5QlFVOHNSVUZCUlR0QlFVTjRSQ3hOUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlExb3NVVUZCU1N4UFFVRlBMRU5CUVVNc1NVRkJTU3hMUVVGTExHZENRVUZuUWl4RlFVRkZPMEZCUTNKRExGVkJRVWtzU1VGQlNTeEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkRlRUlzWVVGQlR5eEpRVUZKTEVOQlFVTXNaVUZCWlN4RFFVRkRMRXRCUVVzc1NVRkJTU3hGUVVGRk8wRkJRM0pETEZsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE8wOUJRM0pDTzBGQlEwUXNZVUZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU5vUXl4VlFVRkpMRU5CUVVNc1pVRkJaU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETzB0QlF6bENMRTFCUVUwN1FVRkRUQ3hoUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGRE1VTTdSMEZEUml4TlFVRk5MRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSVHM3UVVGRmVrTXNWMEZCVHl4RFFVRkRMRWxCUVVrc1IwRkJSeXhQUVVGUExFTkJRVU03UVVGRGRrSXNWMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdSMEZEY2tNN1FVRkRSQ3hUUVVGUExFOUJRVThzUTBGQlF6dERRVU5vUWpzN1FVRkZUU3hUUVVGVExHRkJRV0VzUTBGQlF5eFBRVUZQTEVWQlFVVXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSVHRCUVVOMlJDeFRRVUZQTEVOQlFVTXNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOMlFpeE5RVUZKTEU5QlFVOHNRMEZCUXl4SFFVRkhMRVZCUVVVN1FVRkRaaXhYUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRE8wZEJRM1pGT3p0QlFVVkVMRTFCUVVrc1dVRkJXU3haUVVGQkxFTkJRVU03UVVGRGFrSXNUVUZCU1N4UFFVRlBMRU5CUVVNc1JVRkJSU3hKUVVGSkxFOUJRVThzUTBGQlF5eEZRVUZGTEV0QlFVc3NTVUZCU1N4RlFVRkZPMEZCUTNKRExGZEJRVThzUTBGQlF5eEpRVUZKTEVkQlFVY3NhMEpCUVZrc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEzcERMR2RDUVVGWkxFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4bFFVRmxMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zUlVGQlJTeERRVUZET3p0QlFVVXhSQ3hSUVVGSkxGbEJRVmtzUTBGQlF5eFJRVUZSTEVWQlFVVTdRVUZEZWtJc1lVRkJUeXhEUVVGRExGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMRVZCUVVVc1JVRkJSU3hQUVVGUExFTkJRVU1zVVVGQlVTeEZRVUZGTEZsQlFWa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRMUVVNNVJUdEhRVU5HT3p0QlFVVkVMRTFCUVVrc1QwRkJUeXhMUVVGTExGTkJRVk1zU1VGQlNTeFpRVUZaTEVWQlFVVTdRVUZEZWtNc1YwRkJUeXhIUVVGSExGbEJRVmtzUTBGQlF6dEhRVU40UWpzN1FVRkZSQ3hOUVVGSkxFOUJRVThzUzBGQlN5eFRRVUZUTEVWQlFVVTdRVUZEZWtJc1ZVRkJUU3d5UWtGQll5eGpRVUZqTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1IwRkJSeXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPMGRCUXpWRkxFMUJRVTBzU1VGQlNTeFBRVUZQTEZsQlFWa3NVVUZCVVN4RlFVRkZPMEZCUTNSRExGZEJRVThzVDBGQlR5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenRIUVVOc1F6dERRVU5HT3p0QlFVVk5MRk5CUVZNc1NVRkJTU3hIUVVGSE8wRkJRVVVzVTBGQlR5eEZRVUZGTEVOQlFVTTdRMEZCUlRzN1FVRkZja01zVTBGQlV5eFJRVUZSTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVNdlFpeE5RVUZKTEVOQlFVTXNTVUZCU1N4SlFVRkpMRVZCUVVVc1RVRkJUU3hKUVVGSkxFbEJRVWtzUTBGQlFTeEJRVUZETEVWQlFVVTdRVUZET1VJc1VVRkJTU3hIUVVGSExFbEJRVWtzUjBGQlJ5eHJRa0ZCV1N4SlFVRkpMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRGNrTXNVVUZCU1N4RFFVRkRMRWxCUVVrc1IwRkJSeXhQUVVGUExFTkJRVU03UjBGRGNrSTdRVUZEUkN4VFFVRlBMRWxCUVVrc1EwRkJRenREUVVOaU96dEJRVVZFTEZOQlFWTXNhVUpCUVdsQ0xFTkJRVU1zUlVGQlJTeEZRVUZGTEVsQlFVa3NSVUZCUlN4VFFVRlRMRVZCUVVVc1RVRkJUU3hGUVVGRkxFbEJRVWtzUlVGQlJTeFhRVUZYTEVWQlFVVTdRVUZEZWtVc1RVRkJTU3hGUVVGRkxFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEyaENMRkZCUVVrc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU5tTEZGQlFVa3NSMEZCUnl4RlFVRkZMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUlVGQlJTeExRVUZMTEVWQlFVVXNVMEZCVXl4RlFVRkZMRTFCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVXNTVUZCU1N4RlFVRkZMRmRCUVZjc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU0xUml4VFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXp0SFFVTXpRanRCUVVORUxGTkJRVThzU1VGQlNTeERRVUZETzBOQlEySTdPenM3T3pzN08wRkRhRkpFTEZOQlFWTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVNeFFpeE5RVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJRenREUVVOMFFqczdRVUZGUkN4VlFVRlZMRU5CUVVNc1UwRkJVeXhEUVVGRExGRkJRVkVzUjBGQlJ5eFZRVUZWTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhaUVVGWE8wRkJRM1pGTEZOQlFVOHNSVUZCUlN4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03UTBGRGVrSXNRMEZCUXpzN2NVSkJSV0VzVlVGQlZUczdPenM3T3pzN096czdPenM3TzBGRFZIcENMRWxCUVUwc1RVRkJUU3hIUVVGSE8wRkJRMklzUzBGQlJ5eEZRVUZGTEU5QlFVODdRVUZEV2l4TFFVRkhMRVZCUVVVc1RVRkJUVHRCUVVOWUxFdEJRVWNzUlVGQlJTeE5RVUZOTzBGQlExZ3NTMEZCUnl4RlFVRkZMRkZCUVZFN1FVRkRZaXhMUVVGSExFVkJRVVVzVVVGQlVUdEJRVU5pTEV0QlFVY3NSVUZCUlN4UlFVRlJPMEZCUTJJc1MwRkJSeXhGUVVGRkxGRkJRVkU3UTBGRFpDeERRVUZET3p0QlFVVkdMRWxCUVUwc1VVRkJVU3hIUVVGSExGbEJRVms3U1VGRGRrSXNVVUZCVVN4SFFVRkhMRmRCUVZjc1EwRkJRenM3UVVGRk4wSXNVMEZCVXl4VlFVRlZMRU5CUVVNc1IwRkJSeXhGUVVGRk8wRkJRM1pDTEZOQlFVOHNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wTkJRM0JDT3p0QlFVVk5MRk5CUVZNc1RVRkJUU3hEUVVGRExFZEJRVWNzYjBKQlFXMUNPMEZCUXpORExFOUJRVXNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhUUVVGVExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUTNwRExGTkJRVXNzU1VGQlNTeEhRVUZITEVsQlFVa3NVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRelZDTEZWQlFVa3NUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhqUVVGakxFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU16UkN4WFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wOUJRemxDTzB0QlEwWTdSMEZEUmpzN1FVRkZSQ3hUUVVGUExFZEJRVWNzUTBGQlF6dERRVU5hT3p0QlFVVk5MRWxCUVVrc1VVRkJVU3hIUVVGSExFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRPenM3T3pzN1FVRkxhRVFzU1VGQlNTeFZRVUZWTEVkQlFVY3NiMEpCUVZNc1MwRkJTeXhGUVVGRk8wRkJReTlDTEZOQlFVOHNUMEZCVHl4TFFVRkxMRXRCUVVzc1ZVRkJWU3hEUVVGRE8wTkJRM0JETEVOQlFVTTdPenRCUVVkR0xFbEJRVWtzVlVGQlZTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTI1Q0xGVkJTVTBzVlVGQlZTeEhRVXBvUWl4VlFVRlZMRWRCUVVjc1ZVRkJVeXhMUVVGTExFVkJRVVU3UVVGRE0wSXNWMEZCVHl4UFFVRlBMRXRCUVVzc1MwRkJTeXhWUVVGVkxFbEJRVWtzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXh0UWtGQmJVSXNRMEZCUXp0SFFVTndSaXhEUVVGRE8wTkJRMGc3VVVGRFR5eFZRVUZWTEVkQlFWWXNWVUZCVlRzN096czdRVUZKV0N4SlFVRk5MRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1zVDBGQlR5eEpRVUZKTEZWQlFWTXNTMEZCU3l4RlFVRkZPMEZCUTNSRUxGTkJRVThzUVVGQlF5eExRVUZMTEVsQlFVa3NUMEZCVHl4TFFVRkxMRXRCUVVzc1VVRkJVU3hIUVVGSkxGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1owSkJRV2RDTEVkQlFVY3NTMEZCU3l4RFFVRkRPME5CUTJwSExFTkJRVU03T3pzN08wRkJSMHNzVTBGQlV5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVOd1F5eFBRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hIUVVGSExFZEJRVWNzUzBGQlN5eERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRWRCUVVjc1IwRkJSeXhGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlEyaEVMRkZCUVVrc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEV0QlFVc3NSVUZCUlR0QlFVTjBRaXhoUVVGUExFTkJRVU1zUTBGQlF6dExRVU5XTzBkQlEwWTdRVUZEUkN4VFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wTkJRMWc3TzBGQlIwMHNVMEZCVXl4blFrRkJaMElzUTBGQlF5eE5RVUZOTEVWQlFVVTdRVUZEZGtNc1RVRkJTU3hQUVVGUExFMUJRVTBzUzBGQlN5eFJRVUZSTEVWQlFVVTdPMEZCUlRsQ0xGRkJRVWtzVFVGQlRTeEpRVUZKTEUxQlFVMHNRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRNMElzWVVGQlR5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNN1MwRkRlRUlzVFVGQlRTeEpRVUZKTEUxQlFVMHNTVUZCU1N4SlFVRkpMRVZCUVVVN1FVRkRla0lzWVVGQlR5eEZRVUZGTEVOQlFVTTdTMEZEV0N4TlFVRk5MRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGJFSXNZVUZCVHl4TlFVRk5MRWRCUVVjc1JVRkJSU3hEUVVGRE8wdEJRM0JDT3pzN096dEJRVXRFTEZWQlFVMHNSMEZCUnl4RlFVRkZMRWRCUVVjc1RVRkJUU3hEUVVGRE8wZEJRM1JDT3p0QlFVVkVMRTFCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkZPMEZCUVVVc1YwRkJUeXhOUVVGTkxFTkJRVU03UjBGQlJUdEJRVU01UXl4VFFVRlBMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeEZRVUZGTEZWQlFWVXNRMEZCUXl4RFFVRkRPME5CUXpkRE96dEJRVVZOTEZOQlFWTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1JVRkJSVHRCUVVNM1FpeE5RVUZKTEVOQlFVTXNTMEZCU3l4SlFVRkpMRXRCUVVzc1MwRkJTeXhEUVVGRExFVkJRVVU3UVVGRGVrSXNWMEZCVHl4SlFVRkpMRU5CUVVNN1IwRkRZaXhOUVVGTkxFbEJRVWtzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRXRCUVVzc1EwRkJReXhOUVVGTkxFdEJRVXNzUTBGQlF5eEZRVUZGTzBGQlF5OURMRmRCUVU4c1NVRkJTU3hEUVVGRE8wZEJRMklzVFVGQlRUdEJRVU5NTEZkQlFVOHNTMEZCU3l4RFFVRkRPMGRCUTJRN1EwRkRSanM3UVVGRlRTeFRRVUZUTEZkQlFWY3NRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRiRU1zVFVGQlNTeExRVUZMTEVkQlFVY3NUVUZCVFN4RFFVRkRMRVZCUVVVc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU12UWl4UFFVRkxMRU5CUVVNc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF6dEJRVU4yUWl4VFFVRlBMRXRCUVVzc1EwRkJRenREUVVOa096dEJRVVZOTEZOQlFWTXNWMEZCVnl4RFFVRkRMRTFCUVUwc1JVRkJSU3hIUVVGSExFVkJRVVU3UVVGRGRrTXNVVUZCVFN4RFFVRkRMRWxCUVVrc1IwRkJSeXhIUVVGSExFTkJRVU03UVVGRGJFSXNVMEZCVHl4TlFVRk5MRU5CUVVNN1EwRkRaanM3UVVGRlRTeFRRVUZUTEdsQ1FVRnBRaXhEUVVGRExGZEJRVmNzUlVGQlJTeEZRVUZGTEVWQlFVVTdRVUZEYWtRc1UwRkJUeXhEUVVGRExGZEJRVmNzUjBGQlJ5eFhRVUZYTEVkQlFVY3NSMEZCUnl4SFFVRkhMRVZCUVVVc1EwRkJRU3hIUVVGSkxFVkJRVVVzUTBGQlF6dERRVU53UkRzN096dEJRek5IUkR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOSVFUdEJRVU5CSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW9ablZ1WTNScGIyNGdaU2gwTEc0c2NpbDdablZ1WTNScGIyNGdjeWh2TEhVcGUybG1LQ0Z1VzI5ZEtYdHBaaWdoZEZ0dlhTbDdkbUZ5SUdFOWRIbHdaVzltSUhKbGNYVnBjbVU5UFZ3aVpuVnVZM1JwYjI1Y0lpWW1jbVZ4ZFdseVpUdHBaaWdoZFNZbVlTbHlaWFIxY200Z1lTaHZMQ0V3S1R0cFppaHBLWEpsZEhWeWJpQnBLRzhzSVRBcE8zWmhjaUJtUFc1bGR5QkZjbkp2Y2loY0lrTmhibTV2ZENCbWFXNWtJRzF2WkhWc1pTQW5YQ0lyYnl0Y0lpZGNJaWs3ZEdoeWIzY2daaTVqYjJSbFBWd2lUVTlFVlV4RlgwNVBWRjlHVDFWT1JGd2lMR1o5ZG1GeUlHdzlibHR2WFQxN1pYaHdiM0owY3pwN2ZYMDdkRnR2WFZzd1hTNWpZV3hzS0d3dVpYaHdiM0owY3l4bWRXNWpkR2x2YmlobEtYdDJZWElnYmoxMFcyOWRXekZkVzJWZE8zSmxkSFZ5YmlCektHNC9ianBsS1gwc2JDeHNMbVY0Y0c5eWRITXNaU3gwTEc0c2NpbDljbVYwZFhKdUlHNWJiMTB1Wlhod2IzSjBjMzEyWVhJZ2FUMTBlWEJsYjJZZ2NtVnhkV2x5WlQwOVhDSm1kVzVqZEdsdmJsd2lKaVp5WlhGMWFYSmxPMlp2Y2loMllYSWdiejB3TzI4OGNpNXNaVzVuZEdnN2J5c3JLWE1vY2x0dlhTazdjbVYwZFhKdUlITjlLU0lzSW5aaGNpQnRiMlIxYkdWT1lYWWdQU0J5WlhGMWFYSmxLQ2N1TDIxdlpIVnNaWE12Ym1GMkp5azdYRzVjYm5aaGNpQnRiMlIxYkdWRmVIQmxjbWxsYm1ObElEMGdjbVZ4ZFdseVpTZ25MaTl0YjJSMWJHVnpMMlY0Y0dWeWFXVnVZMlVuS1R0Y2JseHVkbUZ5SUcxdlpIVnNaVmR2Y210eklEMGdjbVZ4ZFdseVpTZ25MaTl0YjJSMWJHVnpMM2R2Y210ekp5azdYRzVjYm5aaGNpQnRiMlIxYkdWVGVYTjBaVzBnUFNCeVpYRjFhWEpsS0NjdUwyMXZaSFZzWlhNdllXSnZkWFF0YzNsemRHVnRKeWs3WEc1Y2JuWmhjaUJ0YjJSMWJHVlFZV2RsUW1GemFXTWdQU0J5WlhGMWFYSmxLQ2N1TDIxdlpIVnNaWE12WW1GemFXTW5LVHRjYmx4dWRtRnlJRzF2WkhWc1pVWmhkbWxqYjI0Z1BTQnlaWEYxYVhKbEtDY3VMMjF2WkhWc1pYTXZabUYyYVdOdmJpY3BPMXh1WEc0dktseHU2YWFXNmFHMTVhUzA1WU9QWEc0Z0tpOWNibTF2WkhWc1pVWmhkbWxqYjI0dWNtVnVaR1Z5S0NRa0tGd2lJMnB6TFhCaFoyVXRZMjl1ZEdWdWRGd2lLU2s3WEc1dGVVRndjQzV2YmxCaFoyVkpibWwwS0Nkb2IyMWxKeXdnWm5WdVkzUnBiMjRvY0dGblpTa2dlMXh1SUNBZ0lHMXZaSFZzWlVaaGRtbGpiMjR1Y21WdVpHVnlLQ1FrS0Z3aUkycHpMWEJoWjJVdFkyOXVkR1Z1ZEZ3aUtTazdYRzU5S1R0Y2JseHVMeXBjYnVXdnZPaUlxbHh1SUNvdlhHNXRiMlIxYkdWT1lYWXVjbVZ1WkdWeUtDazdYRzVjYmk4cVhHN2xuN3Jtbkt6a3Y2SG1nYTljYmlBcUwxeHViVzlrZFd4bFVHRm5aVUpoYzJsakxuSmxibVJsY2lncE8xeHVYRzR2S2x4dTVweXM1THE2NTd1UDVZNkdYRzRnS2k5Y2JtMXZaSFZzWlVWNGNHVnlhV1Z1WTJVdWNtVnVaR1Z5S0NrN1hHNWNiaThxWEc3a3ZaemxrNEhrdjZIbWdhOWNiaUFxTDF4dWJXOWtkV3hsVjI5eWEzTXVjbVZ1WkdWeUtDazdYRzVjYmk4cVhHN2xoYlBrdW83bW5Lem5zN3ZudTU5Y2JpQXFMMXh1Ylc5a2RXeGxVM2x6ZEdWdExuSmxibVJsY2lncE8xeHVJaXdpZG1GeUlHSnNiMk5yUTI5dWRHVnVkRlJsYlhBZ1BTQnlaWEYxYVhKbEtDY3VMaTl3ZFdKc2FXTXZZbXh2WTJzdFkyOXVkR1Z1ZEM1b1luTW5LVHRjYmx4dWRtRnlJR0pzYjJOclJHRjBZU0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMM05sY25acFkyVXZZbXh2WTJzbktUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0I3WEc0Z0lDQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRkV1VUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHSnNiMk5yUkdGMFlTNW5aWFJCWW05MWRGTjVjM1JsYlNncExuUm9aVzRvWm5WdVkzUnBiMjRvWkdGMFlTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1FrS0Z3aUkycHpMWEJoYm1Wc0xXeGxablJjSWlrdVlYQndaVzVrS0dKc2IyTnJRMjl1ZEdWdWRGUmxiWEFvWkdGMFlTa3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lHSnNiMk5yUkdGMFlTNW5aWFJKYm1SbGVFUmhkR0VvS1M1MGFHVnVLR1oxYm1OMGFXOXVLR1JoZEdFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtKQ2hjSWlOcWN5MXdZV2RsTFdOdmJuUmxiblJjSWlrdVlYQndaVzVrS0dKc2IyTnJRMjl1ZEdWdWRGUmxiWEFvWkdGMFlTa3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lHMTVRWEJ3TG05dVVHRm5aVWx1YVhRb0oyaHZiV1VuTENCbWRXNWpkR2x2Ymlod1lXZGxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWW14dlkydEVZWFJoTG1kbGRFbHVaR1Y0UkdGMFlTZ3BMblJvWlc0b1puVnVZM1JwYjI0b1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtKQ2hjSWlOcWN5MXdZV2RsTFdOdmJuUmxiblJjSWlrdVlYQndaVzVrS0dKc2IyTnJRMjl1ZEdWdWRGUmxiWEFvWkdGMFlTa3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsYzI5c2RtVW9LVHRjYmlBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnZlZ4dWZUdGNiaUlzSW5aaGNpQmlZWE5wWXlBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDNObGNuWnBZMlV2WW1GemFXTW5LVHRjYmx4dWRtRnlJR0poYzJsalZHVnRjQ0E5SUhKbGNYVnBjbVVvSnk0dUwzQjFZbXhwWXk5aWJHOWpheTFzYVhOMExtaGljeWNwTzF4dVhHNTJZWElnYlc5a2RXeGxSbUYyYVdOdmJpQTlJSEpsY1hWcGNtVW9KeTR1TDJaaGRtbGpiMjRuS1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQjdYRzRnSUNBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlGRXVVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUcxNVFYQndMbTl1VUdGblpVbHVhWFFvSjJKaGMybGpKeXdnWm5WdVkzUnBiMjRvY0dGblpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0poYzJsakxtZGxkRXhwYzNSQmJHd29LUzUwYUdWdUtHWjFibU4wYVc5dUtHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKQ1FvSnlOcWN5MWlZWE5wWXkxaWIzZ25LUzVoY0hCbGJtUW9ZbUZ6YVdOVVpXMXdLR1JoZEdFcEtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4cVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZzVaKzY1cHlzNkxXRTVwYVo1YVMwNVlPUFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDb3ZYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiVzlrZFd4bFJtRjJhV052Ymk1eVpXNWtaWElvSkNRb0p5TnFjeTFpWVhOcFl5MWliM2duS1NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemIyeDJaU2dwTzF4dUlDQWdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNTlPMXh1SWl3aWRtRnlJSGR2Y210VFpYSjJhV05sSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2YzJWeWRtbGpaUzkzYjNKcmN5Y3BPMXh1WEc1MllYSWdkMjl5YTNOTWFYTjBWR1Z0Y0NBOUlISmxjWFZwY21Vb0p5NHVMM0IxWW14cFl5OTNiM0pyY3kxc2FYTjBMbWhpY3ljcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSHRjYmlBZ0lDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdVUzVRY205dGFYTmxLR1oxYm1OMGFXOXVLSEpsYzI5c2RtVXNJSEpsYW1WamRDa2dlMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZLdWU3aitXT2h1ZWJ1T1dGcytTOW5PV1RnU292WEc0Z0lDQWdJQ0FnSUNBZ0lDQnRlVUZ3Y0M1dmJsQmhaMlZKYm1sMEtDZGxlSEJsY21sbGJtTmxMWGR2Y21zbkxDQm1kVzVqZEdsdmJpaHdZV2RsS1NCN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnZEhsd1pWWmhiQ0E5SUhCaFoyVXVjWFZsY25rdWRIbHdaVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhkdmNtdFRaWEoyYVdObExtZGxkRXhwYzNSQ2VWUjVjR1VvZEhsd1pWWmhiQ2t1ZEdobGJpaG1kVzVqZEdsdmJpaGtZWFJoS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCM2IzSnJVRzl3ZFhCVWFYUnNaU0E5SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ3aU1qQXhNbHdpT2lCY0lqSXdNVExsdWJSKzZJZXo1THVLSU9lYWhPUzluT1dUZ1Z3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hDSXlNREEzWENJNklGd2lNakF3TitXNXRINHlNREV5NWJtMElPZWFoT1M5bk9XVGdWd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYQ0l5TURBMFhDSTZJRndpTWpBd05PVzV0SDR5TURBMzVibTBJT2VhaE9TOW5PV1RnVndpWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNRa0tGd2lMbXBwYm1kc2FTMTNiM0pyY3kxMGFYUnNaVndpS1M1b2RHMXNLSGR2Y210UWIzQjFjRlJwZEd4bFczUjVjR1ZXWVd4ZEtUdGNibHh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDUWtLRndpTG5kdmNtdHpMV3hwYzNRdFltOTRYQ0lwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F1YUhSdGJDaDNiM0pyYzB4cGMzUlVaVzF3S0dSaGRHRXBLVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMbVpwYm1Rb0p5NXFjeTFqWVhKa0p5bGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDNWhaR1JEYkdGemN5Z25jM2RwY0dWeUxYTnNhV1JsSnlsY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM1bWFXNWtLRndpTG5OM2FYQmxjaTFzWVhwNVhDSXBYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXVZWEJ3Wlc1a0tDYzhaR2wySUdOc1lYTnpQVndpY0hKbGJHOWhaR1Z5WENJK1BDOWthWFkrSnlrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYlhsQmNIQXVhVzVwZEVsdFlXZGxjMHhoZW5sTWIyRmtLQ2N1Y0dGblpTY3BPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHMTVRWEJ3TG5OM2FYQmxjaWduTG5OM2FYQmxjaTFqYjI1MFlXbHVaWEluTENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2NtVnNiMkZrU1cxaFoyVnpPaUJtWVd4elpTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHeGhlbmxNYjJGa2FXNW5PaUIwY25WbExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NHRm5hVzVoZEdsdmJqb2dKeTV6ZDJsd1pYSXRjR0ZuYVc1aGRHbHZiaWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCbFptWmxZM1E2SUNkamIzWmxjbVpzYjNjbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyeHBaR1Z6VUdWeVZtbGxkem9nSjJGMWRHOG5MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZMlZ1ZEdWeVpXUlRiR2xrWlhNNklIUnlkV1ZjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzVjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtKQ2duTG5Ob2IzY3RjR2h2ZEc4bktTNXZiaWduWTJ4cFkyc25MQ0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGNpQWtKSFJvYVhNZ1BTQWtKQ2gwYUdsektUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkMjl5YTFObGNuWnBZMlV1WjJWMFFubEpaQ2drSkhSb2FYTXVZWFIwY2loY0ltUmhkR0V0YVdSY0lpa3BMblJvWlc0b1puVnVZM1JwYjI0b1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHMTVRWEJ3TG5Cb2IzUnZRbkp2ZDNObGNpaDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIQm9iM1J2Y3pvZ1pHRjBZUzVzYVhOMExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1lYcDVURzloWkdsdVp6b2dkSEoxWlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdobGJXVTZJQ2RrWVhKckp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1ltRmphMHhwYm10VVpYaDBPaUFuNkwrVTVadWVKMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcExtOXdaVzRvS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0NrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNibjA3WEc0aUxDSjJZWElnYlc5a2RXeGxSWGh3WlhKcFpXNWpaVmR2Y210eklEMGdjbVZ4ZFdseVpTZ25MaTR2Wlhod1pYSnBaVzVqWlMxM2IzSnJjeWNwTzF4dVhHNTJZWElnWW1GcGEyVlRkVzF0WVhKNVJHRjBZU0E5SUhKbGNYVnBjbVVvSnk0dUx5NHVMM05sY25acFkyVXZZbUZwYTJVdGMzVnRiV0Z5ZVNjcE8xeHVYRzUyWVhJZ2RHRmlUbUYyVkdWdGNDQTlJSEpsY1hWcGNtVW9YQ0l1TDNSaFlpMXVZWFl1YUdKelhDSXBPMXh1ZG1GeUlIUmhZa052Ym5SbGJuUlVaVzF3SUQwZ2NtVnhkV2x5WlNoY0lpNHZkR0ZpTFdOdmJuUmxiblF1YUdKelhDSXBPMXh1WEc1MllYSWdaWGh3WlhKcFpXNWpaVVJoZEdFZ1BTQnlaWEYxYVhKbEtGd2lMaTR2TGk0dmMyVnlkbWxqWlM5bGVIQmxjbWxsYm1ObFhDSXBPMXh1WEc1MllYSWdTR0Z1Wkd4bFltRnljeUE5SUhKbGNYVnBjbVVvWENKb1luTm1lUzl5ZFc1MGFXMWxYQ0lwTzF4dVhHNUlZVzVrYkdWaVlYSnpMbkpsWjJsemRHVnlTR1ZzY0dWeUtGd2lZV1JrVDI1bFhDSXNJR1oxYm1OMGFXOXVLR2x1WkdWNEtTQjdYRzVjYmlBZ0lDQnlaWFIxY200Z2FXNWtaWGdnS3lBeE8xeHVmU2s3WEc1Y2JraGhibVJzWldKaGNuTXVjbVZuYVhOMFpYSklaV3h3WlhJb1hDSmhaR1JCWTNScGRtVmNJaXdnWm5WdVkzUnBiMjRvYVc1a1pYZ3BJSHRjYmx4dUlDQWdJR2xtSUNocGJtUmxlQ0E5UFNBd0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmNJbUZqZEdsMlpWd2lPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnWENKY0lqdGNibjBwTzF4dVhHNUlZVzVrYkdWaVlYSnpMbkpsWjJsemRHVnlTR1ZzY0dWeUtGd2lZV1JrVDNSb1pYSkljbVZtWENJc0lHWjFibU4wYVc5dUtIUjVjR1VwSUh0Y2JpQWdJQ0JwWmlBb2RIbHdaU0E5UFNBbk1qQXhNaWNwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNjOGNENDhZU0JvY21WbVBWd2lJMXdpSUdOc1lYTnpQVndpWW5WMGRHOXVJR0poYVd0bExYTjFiVzFoY25sY0lqN25tYjducDVIbHViVGx1cWJsdDZYa3Zaem1nTHZudTVNOEwyRStQQzl3UGljN1hHNGdJQ0FnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnZTF4dUlDQWdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJSTGxCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU3dnY21WcVpXTjBLU0I3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzhxNTVtKzU2ZVI1Ym0wNWJxbTVvQzc1N3VUS2k5Y2JpQWdJQ0FnSUNBZ0lDQWdJRzE1UVhCd0xtOXVVR0ZuWlVsdWFYUW9KMlY0Y0dWeWFXVnVZMlVuTENCbWRXNWpkR2x2Ymlod1lXZGxLU0I3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbGVIQmxjbWxsYm1ObFJHRjBZUzVuWlhSTWFYTjBWR2wwYkdVb0tTNTBhR1Z1S0daMWJtTjBhVzl1S0dSaGRHRXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pDUW9YQ0lqYW5NdGRHRmlMVzVoZGx3aUtTNW9kRzFzS0hSaFlrNWhkbFJsYlhBb1pHRjBZU2twTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdaWGh3WlhKcFpXNWpaVVJoZEdFdVoyVjBUR2x6ZEVGc2JDZ3BMblJvWlc0b1puVnVZM1JwYjI0b1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtKQ2hjSWlOcWN5MTBZV0l0WTI5dWRHVnVkRndpS1M1b2RHMXNLSFJoWWtOdmJuUmxiblJVWlcxd0tHUmhkR0VwS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnYlhsQmNIQXVhVzVwZEZCaFoyVlRkMmx3WlhJb0p5NXdZV2RsSnlrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSkNRb0p5NWlZV2xyWlMxemRXMXRZWEo1SnlrdWIyNG9KMk5zYVdOckp5d2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J0ZVVGd2NDNXdhRzkwYjBKeWIzZHpaWElvZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIQm9iM1J2Y3pvZ1ltRnBhMlZUZFcxdFlYSjVSR0YwWVN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnNZWHA1VEc5aFpHbHVaem9nZEhKMVpTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwYUdWdFpUb2dKMlJoY21zbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0poWTJ0TWFXNXJWR1Y0ZERvZ0oraS9sT1dibmlkY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcExtOXdaVzRvS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNibHh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmx4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0J0YjJSMWJHVkZlSEJsY21sbGJtTmxWMjl5YTNNdWNtVnVaR1Z5S0NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhOdmJIWmxLQ2s3WEc0Z0lDQWdJQ0FnSUgwcE8xeHVYRzVjYmlBZ0lDQjlYRzU5TzF4dUlpd2lMeThnYUdKelpua2dZMjl0Y0dsc1pXUWdTR0Z1Wkd4bFltRnljeUIwWlcxd2JHRjBaVnh1ZG1GeUlFaGhibVJzWldKaGNuTkRiMjF3YVd4bGNpQTlJSEpsY1hWcGNtVW9KMmhpYzJaNUwzSjFiblJwYldVbktUdGNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdTR0Z1Wkd4bFltRnljME52YlhCcGJHVnlMblJsYlhCc1lYUmxLSHRjSWpGY0lqcG1kVzVqZEdsdmJpaGpiMjUwWVdsdVpYSXNaR1Z3ZEdnd0xHaGxiSEJsY25Nc2NHRnlkR2xoYkhNc1pHRjBZU2tnZTF4dUlDQWdJSFpoY2lCemRHRmphekVzSUdobGJIQmxjaXdnWVd4cFlYTXhQV1JsY0hSb01DQWhQU0J1ZFd4c0lEOGdaR1Z3ZEdnd0lEb2dlMzBzSUdGc2FXRnpNajFvWld4d1pYSnpMbWhsYkhCbGNrMXBjM05wYm1jc0lHRnNhV0Z6TXoxamIyNTBZV2x1WlhJdVpYTmpZWEJsUlhod2NtVnpjMmx2Yml3Z1lXeHBZWE0wUFZ3aVpuVnVZM1JwYjI1Y0lqdGNibHh1SUNCeVpYUjFjbTRnWENJOFpHbDJJR2xrUFZ4Y1hDSjBZV0pjSWx4dUlDQWdJQ3NnWVd4cFlYTXpLQ2hvWld4d1pYSnpMbUZrWkU5dVpTQjhmQ0FvWkdWd2RHZ3dJQ1ltSUdSbGNIUm9NQzVoWkdSUGJtVXBJSHg4SUdGc2FXRnpNaWt1WTJGc2JDaGhiR2xoY3pFc0tHUmhkR0VnSmlZZ1pHRjBZUzVwYm1SbGVDa3NlMXdpYm1GdFpWd2lPbHdpWVdSa1QyNWxYQ0lzWENKb1lYTm9YQ0k2ZTMwc1hDSmtZWFJoWENJNlpHRjBZWDBwS1Z4dUlDQWdJQ3NnWENKY1hGd2lJR05zWVhOelBWeGNYQ0p3WVdkbExXTnZiblJsYm5RZ2RHRmlJRndpWEc0Z0lDQWdLeUJoYkdsaGN6TW9LR2hsYkhCbGNuTXVZV1JrUVdOMGFYWmxJSHg4SUNoa1pYQjBhREFnSmlZZ1pHVndkR2d3TG1Ga1pFRmpkR2wyWlNrZ2ZId2dZV3hwWVhNeUtTNWpZV3hzS0dGc2FXRnpNU3dvWkdGMFlTQW1KaUJrWVhSaExtbHVaR1Y0S1N4N1hDSnVZVzFsWENJNlhDSmhaR1JCWTNScGRtVmNJaXhjSW1oaGMyaGNJanA3ZlN4Y0ltUmhkR0ZjSWpwa1lYUmhmU2twWEc0Z0lDQWdLeUJjSWx4Y1hDSStYRnh1SUNBZ0lEeGthWFlnWTJ4aGMzTTlYRnhjSW1OdmJuUmxiblF0WW14dlkydGNYRndpUGx4Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNYRndpWTI5dWRHVnVkQzFpYkc5amF5MTBhWFJzWlZ4Y1hDSStYQ0pjYmlBZ0lDQXJJR0ZzYVdGek15aGpiMjUwWVdsdVpYSXViR0Z0WW1SaEtDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUM1amIyMXdiMjU1SURvZ1pHVndkR2d3S1N3Z1pHVndkR2d3S1NsY2JpQWdJQ0FySUZ3aVBDOWthWFkrWEZ4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWeGNYQ0pqWVhKa1hGeGNJajVjWEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKallYSmtMV052Ym5SbGJuUmNYRndpUGx4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWeGNYQ0pqWVhKa0xXTnZiblJsYm5RdGFXNXVaWEpjWEZ3aVBseGNibHdpWEc0Z0lDQWdLeUFvS0hOMFlXTnJNU0E5SUdobGJIQmxjbk11WldGamFDNWpZV3hzS0dGc2FXRnpNU3dvWkdWd2RHZ3dJQ0U5SUc1MWJHd2dQeUJrWlhCMGFEQXVhVzUwY204Z09pQmtaWEIwYURBcExIdGNJbTVoYldWY0lqcGNJbVZoWTJoY0lpeGNJbWhoYzJoY0lqcDdmU3hjSW1adVhDSTZZMjl1ZEdGcGJtVnlMbkJ5YjJkeVlXMG9NaXdnWkdGMFlTd2dNQ2tzWENKcGJuWmxjbk5sWENJNlkyOXVkR0ZwYm1WeUxtNXZiM0FzWENKa1lYUmhYQ0k2WkdGMFlYMHBLU0FoUFNCdWRXeHNJRDhnYzNSaFkyc3hJRG9nWENKY0lpbGNiaUFnSUNBcklGd2lJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4Y2JpQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseGNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hGeHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKallYSmtYRnhjSWo1Y1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ4Y1hDSmpZWEprTFdOdmJuUmxiblJjWEZ3aVBseGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKallYSmtMV052Ym5SbGJuUXRhVzV1WlhKY1hGd2lQbHhjYmx3aVhHNGdJQ0FnS3lBb0tITjBZV05yTVNBOUlHaGxiSEJsY25NdVpXRmphQzVqWVd4c0tHRnNhV0Z6TVN3b1pHVndkR2d3SUNFOUlHNTFiR3dnUHlCa1pYQjBhREF1WjNKaFpHVWdPaUJrWlhCMGFEQXBMSHRjSW01aGJXVmNJanBjSW1WaFkyaGNJaXhjSW1oaGMyaGNJanA3ZlN4Y0ltWnVYQ0k2WTI5dWRHRnBibVZ5TG5CeWIyZHlZVzBvTkN3Z1pHRjBZU3dnTUNrc1hDSnBiblpsY25ObFhDSTZZMjl1ZEdGcGJtVnlMbTV2YjNBc1hDSmtZWFJoWENJNlpHRjBZWDBwS1NBaFBTQnVkV3hzSUQ4Z2MzUmhZMnN4SURvZ1hDSmNJaWxjYmlBZ0lDQXJJRndpSUZ3aVhHNGdJQ0FnS3lBb0tITjBZV05yTVNBOUlDaG9aV3h3WlhKekxtRmtaRTkwYUdWeVNISmxaaUI4ZkNBb1pHVndkR2d3SUNZbUlHUmxjSFJvTUM1aFpHUlBkR2hsY2toeVpXWXBJSHg4SUdGc2FXRnpNaWt1WTJGc2JDaGhiR2xoY3pFc0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3TG5SNWNHVWdPaUJrWlhCMGFEQXBMSHRjSW01aGJXVmNJanBjSW1Ga1pFOTBhR1Z5U0hKbFpsd2lMRndpYUdGemFGd2lPbnQ5TEZ3aVpHRjBZVndpT21SaGRHRjlLU2tnSVQwZ2JuVnNiQ0EvSUhOMFlXTnJNU0E2SUZ3aVhDSXBYRzRnSUNBZ0t5QmNJbHhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHhjYmlBZ0lDQWdJQ0FnUEhBK1hGeHVJQ0FnSUNBZ0lDQWdJQ0FnUEdFZ2FISmxaajFjWEZ3aUxpOXBibVJsZUM5bGVIQmxjbWxsYm1ObExYZHZjbXR6TG1oMGJXdy9kSGx3WlQxY0lseHVJQ0FnSUNzZ1lXeHBZWE16S0Nnb2FHVnNjR1Z5SUQwZ0tHaGxiSEJsY2lBOUlHaGxiSEJsY25NdWRIbHdaU0I4ZkNBb1pHVndkR2d3SUNFOUlHNTFiR3dnUHlCa1pYQjBhREF1ZEhsd1pTQTZJR1JsY0hSb01Da3BJQ0U5SUc1MWJHd2dQeUJvWld4d1pYSWdPaUJoYkdsaGN6SXBMQ2gwZVhCbGIyWWdhR1ZzY0dWeUlEMDlQU0JoYkdsaGN6UWdQeUJvWld4d1pYSXVZMkZzYkNoaGJHbGhjekVzZTF3aWJtRnRaVndpT2x3aWRIbHdaVndpTEZ3aWFHRnphRndpT250OUxGd2laR0YwWVZ3aU9tUmhkR0Y5S1NBNklHaGxiSEJsY2lrcEtWeHVJQ0FnSUNzZ1hDSmNYRndpSUdOc1lYTnpQVnhjWENKaWRYUjBiMjVjWEZ3aUlHUmhkR0V0ZEhsd1pUMWNYRndpWENKY2JpQWdJQ0FySUdGc2FXRnpNeWdvS0dobGJIQmxjaUE5SUNob1pXeHdaWElnUFNCb1pXeHdaWEp6TG5SNWNHVWdmSHdnS0dSbGNIUm9NQ0FoUFNCdWRXeHNJRDhnWkdWd2RHZ3dMblI1Y0dVZ09pQmtaWEIwYURBcEtTQWhQU0J1ZFd4c0lEOGdhR1ZzY0dWeUlEb2dZV3hwWVhNeUtTd29kSGx3Wlc5bUlHaGxiSEJsY2lBOVBUMGdZV3hwWVhNMElEOGdhR1ZzY0dWeUxtTmhiR3dvWVd4cFlYTXhMSHRjSW01aGJXVmNJanBjSW5SNWNHVmNJaXhjSW1oaGMyaGNJanA3ZlN4Y0ltUmhkR0ZjSWpwa1lYUmhmU2tnT2lCb1pXeHdaWElwS1NsY2JpQWdJQ0FySUZ3aVhGeGNJajdubTdqbGhiUGt2WnpsazRFOEwyRStYRnh1SUNBZ0lDQWdJQ0E4TDNBK1hGeHVJQ0FnSUR3dlpHbDJQbHhjYmp3dlpHbDJQbHhjYmx3aU8xeHVmU3hjSWpKY0lqcG1kVzVqZEdsdmJpaGpiMjUwWVdsdVpYSXNaR1Z3ZEdnd0xHaGxiSEJsY25Nc2NHRnlkR2xoYkhNc1pHRjBZU2tnZTF4dUlDQWdJSEpsZEhWeWJpQmNJaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhBK1hDSmNiaUFnSUNBcklHTnZiblJoYVc1bGNpNWxjMk5oY0dWRmVIQnlaWE56YVc5dUtHTnZiblJoYVc1bGNpNXNZVzFpWkdFb1pHVndkR2d3TENCa1pYQjBhREFwS1Z4dUlDQWdJQ3NnWENJOEwzQStYRnh1WENJN1hHNTlMRndpTkZ3aU9tWjFibU4wYVc5dUtHTnZiblJoYVc1bGNpeGtaWEIwYURBc2FHVnNjR1Z5Y3l4d1lYSjBhV0ZzY3l4a1lYUmhLU0I3WEc0Z0lDQWdjbVYwZFhKdUlGd2lJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0Q1Y0lseHVJQ0FnSUNzZ1kyOXVkR0ZwYm1WeUxtVnpZMkZ3WlVWNGNISmxjM05wYjI0b1kyOXVkR0ZwYm1WeUxteGhiV0prWVNoa1pYQjBhREFzSUdSbGNIUm9NQ2twWEc0Z0lDQWdLeUJjSWp3dmNENWNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ3aU8xeHVmU3hjSW1OdmJYQnBiR1Z5WENJNld6Y3NYQ0krUFNBMExqQXVNRndpWFN4Y0ltMWhhVzVjSWpwbWRXNWpkR2x2YmloamIyNTBZV2x1WlhJc1pHVndkR2d3TEdobGJIQmxjbk1zY0dGeWRHbGhiSE1zWkdGMFlTa2dlMXh1SUNBZ0lIWmhjaUJ6ZEdGamF6RTdYRzVjYmlBZ2NtVjBkWEp1SUNnb2MzUmhZMnN4SUQwZ2FHVnNjR1Z5Y3k1bFlXTm9MbU5oYkd3b1pHVndkR2d3SUNFOUlHNTFiR3dnUHlCa1pYQjBhREFnT2lCN2ZTeGtaWEIwYURBc2Uxd2libUZ0WlZ3aU9sd2laV0ZqYUZ3aUxGd2lhR0Z6YUZ3aU9udDlMRndpWm01Y0lqcGpiMjUwWVdsdVpYSXVjSEp2WjNKaGJTZ3hMQ0JrWVhSaExDQXdLU3hjSW1sdWRtVnljMlZjSWpwamIyNTBZV2x1WlhJdWJtOXZjQ3hjSW1SaGRHRmNJanBrWVhSaGZTa3BJQ0U5SUc1MWJHd2dQeUJ6ZEdGamF6RWdPaUJjSWx3aUtUdGNibjBzWENKMWMyVkVZWFJoWENJNmRISjFaWDBwTzF4dUlpd2lMeThnYUdKelpua2dZMjl0Y0dsc1pXUWdTR0Z1Wkd4bFltRnljeUIwWlcxd2JHRjBaVnh1ZG1GeUlFaGhibVJzWldKaGNuTkRiMjF3YVd4bGNpQTlJSEpsY1hWcGNtVW9KMmhpYzJaNUwzSjFiblJwYldVbktUdGNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdTR0Z1Wkd4bFltRnljME52YlhCcGJHVnlMblJsYlhCc1lYUmxLSHRjSWpGY0lqcG1kVzVqZEdsdmJpaGpiMjUwWVdsdVpYSXNaR1Z3ZEdnd0xHaGxiSEJsY25Nc2NHRnlkR2xoYkhNc1pHRjBZU2tnZTF4dUlDQWdJSFpoY2lCaGJHbGhjekU5WkdWd2RHZ3dJQ0U5SUc1MWJHd2dQeUJrWlhCMGFEQWdPaUI3ZlN3Z1lXeHBZWE15UFdobGJIQmxjbk11YUdWc2NHVnlUV2x6YzJsdVp5d2dZV3hwWVhNelBXTnZiblJoYVc1bGNpNWxjMk5oY0dWRmVIQnlaWE56YVc5dU8xeHVYRzRnSUhKbGRIVnliaUJjSWp4aElHaHlaV1k5WEZ4Y0lpTjBZV0pjSWx4dUlDQWdJQ3NnWVd4cFlYTXpLQ2hvWld4d1pYSnpMbUZrWkU5dVpTQjhmQ0FvWkdWd2RHZ3dJQ1ltSUdSbGNIUm9NQzVoWkdSUGJtVXBJSHg4SUdGc2FXRnpNaWt1WTJGc2JDaGhiR2xoY3pFc0tHUmhkR0VnSmlZZ1pHRjBZUzVwYm1SbGVDa3NlMXdpYm1GdFpWd2lPbHdpWVdSa1QyNWxYQ0lzWENKb1lYTm9YQ0k2ZTMwc1hDSmtZWFJoWENJNlpHRjBZWDBwS1Z4dUlDQWdJQ3NnWENKY1hGd2lJR05zWVhOelBWeGNYQ0ppZFhSMGIyNGdkR0ZpTFd4cGJtc2dYQ0pjYmlBZ0lDQXJJR0ZzYVdGek15Z29hR1ZzY0dWeWN5NWhaR1JCWTNScGRtVWdmSHdnS0dSbGNIUm9NQ0FtSmlCa1pYQjBhREF1WVdSa1FXTjBhWFpsS1NCOGZDQmhiR2xoY3pJcExtTmhiR3dvWVd4cFlYTXhMQ2hrWVhSaElDWW1JR1JoZEdFdWFXNWtaWGdwTEh0Y0ltNWhiV1ZjSWpwY0ltRmtaRUZqZEdsMlpWd2lMRndpYUdGemFGd2lPbnQ5TEZ3aVpHRjBZVndpT21SaGRHRjlLU2xjYmlBZ0lDQXJJRndpWEZ4Y0lqNWNJbHh1SUNBZ0lDc2dZV3hwWVhNektHTnZiblJoYVc1bGNpNXNZVzFpWkdFb1pHVndkR2d3TENCa1pYQjBhREFwS1Z4dUlDQWdJQ3NnWENJOEwyRStJRndpTzF4dWZTeGNJbU52YlhCcGJHVnlYQ0k2V3pjc1hDSStQU0EwTGpBdU1Gd2lYU3hjSW0xaGFXNWNJanBtZFc1amRHbHZiaWhqYjI1MFlXbHVaWElzWkdWd2RHZ3dMR2hsYkhCbGNuTXNjR0Z5ZEdsaGJITXNaR0YwWVNrZ2UxeHVJQ0FnSUhaaGNpQnpkR0ZqYXpFN1hHNWNiaUFnY21WMGRYSnVJQ2dvYzNSaFkyc3hJRDBnYUdWc2NHVnljeTVsWVdOb0xtTmhiR3dvWkdWd2RHZ3dJQ0U5SUc1MWJHd2dQeUJrWlhCMGFEQWdPaUI3ZlN4a1pYQjBhREFzZTF3aWJtRnRaVndpT2x3aVpXRmphRndpTEZ3aWFHRnphRndpT250OUxGd2labTVjSWpwamIyNTBZV2x1WlhJdWNISnZaM0poYlNneExDQmtZWFJoTENBd0tTeGNJbWx1ZG1WeWMyVmNJanBqYjI1MFlXbHVaWEl1Ym05dmNDeGNJbVJoZEdGY0lqcGtZWFJoZlNrcElDRTlJRzUxYkd3Z1B5QnpkR0ZqYXpFZ09pQmNJbHdpS1Z4dUlDQWdJQ3NnWENKY1hHNWNJanRjYm4wc1hDSjFjMlZFWVhSaFhDSTZkSEoxWlgwcE8xeHVJaXdpTHk4Z2FHSnpabmtnWTI5dGNHbHNaV1FnU0dGdVpHeGxZbUZ5Y3lCMFpXMXdiR0YwWlZ4dWRtRnlJRWhoYm1Sc1pXSmhjbk5EYjIxd2FXeGxjaUE5SUhKbGNYVnBjbVVvSjJoaWMyWjVMM0oxYm5ScGJXVW5LVHRjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnU0dGdVpHeGxZbUZ5YzBOdmJYQnBiR1Z5TG5SbGJYQnNZWFJsS0h0Y0ltTnZiWEJwYkdWeVhDSTZXemNzWENJK1BTQTBMakF1TUZ3aVhTeGNJbTFoYVc1Y0lqcG1kVzVqZEdsdmJpaGpiMjUwWVdsdVpYSXNaR1Z3ZEdnd0xHaGxiSEJsY25Nc2NHRnlkR2xoYkhNc1pHRjBZU2tnZTF4dUlDQWdJSFpoY2lCb1pXeHdaWElzSUdGc2FXRnpNVDFrWlhCMGFEQWdJVDBnYm5Wc2JDQS9JR1JsY0hSb01DQTZJSHQ5TENCaGJHbGhjekk5YUdWc2NHVnljeTVvWld4d1pYSk5hWE56YVc1bkxDQmhiR2xoY3pNOVhDSm1kVzVqZEdsdmJsd2lMQ0JoYkdsaGN6UTlZMjl1ZEdGcGJtVnlMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNDdYRzVjYmlBZ2NtVjBkWEp1SUZ3aVBDRXRMU0RscExUbGc0OGdMUzArWEZ4dVBHUnBkaUJqYkdGemN6MWNYRndpWTJGeVpDQnJjeTFqWVhKa0xXaGxZV1JsY2kxd2FXTmNYRndpUGx4Y2JpQWdJQ0E4WkdsMklIWmhiR2xuYmoxY1hGd2lZbTkwZEc5dFhGeGNJaUJ6ZEhsc1pUMWNYRndpWEZ4Y0lpQmpiR0Z6Y3oxY1hGd2lZV0p2ZFhSdFpTMXdhV01nWTJGeVpDMXBiV0ZuWlNCamIyeHZjaTEzYUdsMFpTQnVieTFpYjNKa1pYSWdiR0Y2ZVNCc1lYcDVMV1poWkdWcGJseGNYQ0krWENKY2JpQWdJQ0FySUdGc2FXRnpOQ2dvS0dobGJIQmxjaUE5SUNob1pXeHdaWElnUFNCb1pXeHdaWEp6TG5ScGRHeGxJSHg4SUNoa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQzUwYVhSc1pTQTZJR1JsY0hSb01Da3BJQ0U5SUc1MWJHd2dQeUJvWld4d1pYSWdPaUJoYkdsaGN6SXBMQ2gwZVhCbGIyWWdhR1ZzY0dWeUlEMDlQU0JoYkdsaGN6TWdQeUJvWld4d1pYSXVZMkZzYkNoaGJHbGhjekVzZTF3aWJtRnRaVndpT2x3aWRHbDBiR1ZjSWl4Y0ltaGhjMmhjSWpwN2ZTeGNJbVJoZEdGY0lqcGtZWFJoZlNrZ09pQm9aV3h3WlhJcEtTbGNiaUFnSUNBcklGd2lQQzlrYVhZK1hGeHVJQ0FnSUR4a2FYWWdZMnhoYzNNOVhGeGNJbU5oY21RdFkyOXVkR1Z1ZEZ4Y1hDSStYRnh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ4Y1hDSmpZWEprTFdOdmJuUmxiblF0YVc1dVpYSmNYRndpUGx4Y2JpQWdJQ0FnSUNBZ0lDQWdJRHh3UGx3aVhHNGdJQ0FnS3lCaGJHbGhjelFvS0Nob1pXeHdaWElnUFNBb2FHVnNjR1Z5SUQwZ2FHVnNjR1Z5Y3k1a1pYTmpJSHg4SUNoa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQzVrWlhOaklEb2daR1Z3ZEdnd0tTa2dJVDBnYm5Wc2JDQS9JR2hsYkhCbGNpQTZJR0ZzYVdGek1pa3NLSFI1Y0dWdlppQm9aV3h3WlhJZ1BUMDlJR0ZzYVdGek15QS9JR2hsYkhCbGNpNWpZV3hzS0dGc2FXRnpNU3g3WENKdVlXMWxYQ0k2WENKa1pYTmpYQ0lzWENKb1lYTm9YQ0k2ZTMwc1hDSmtZWFJoWENJNlpHRjBZWDBwSURvZ2FHVnNjR1Z5S1NrcFhHNGdJQ0FnS3lCY0lqd3ZjRDVjWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHhjYmlBZ0lDQThMMlJwZGo1Y1hHNDhMMlJwZGo1Y1hHNDhJUzB0SUMvbHBMVGxnNDhnTFMwK1hGeHVYQ0k3WEc1OUxGd2lkWE5sUkdGMFlWd2lPblJ5ZFdWOUtUdGNiaUlzSW5aaGNpQmlZWE5wWXlBOUlISmxjWFZwY21Vb0p5NHVMeTR1TDNObGNuWnBZMlV2WW1GemFXTW5LVHRjYmx4dWRtRnlJR1poZG1samIyNVVaVzF3SUQwZ2NtVnhkV2x5WlNnbkxpOW1ZWFpwWTI5dUxtaGljeWNwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlIdGNiaUFnSUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NRa1ltOTRLU0I3WEc1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUZFdVVISnZiV2x6WlNobWRXNWpkR2x2YmlncElIdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ1ltRnphV011WjJWMFJtRjJhV052YmtSaGRHRW9LUzUwYUdWdUtHWjFibU4wYVc5dUtHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBa0pHSnZlQzV3Y21Wd1pXNWtLR1poZG1samIyNVVaVzF3S0dSaGRHRXBLVnh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0NrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNibjA3WEc0aUxDSXZMeUJvWW5ObWVTQmpiMjF3YVd4bFpDQklZVzVrYkdWaVlYSnpJSFJsYlhCc1lYUmxYRzUyWVhJZ1NHRnVaR3hsWW1GeWMwTnZiWEJwYkdWeUlEMGdjbVZ4ZFdseVpTZ25hR0p6Wm5rdmNuVnVkR2x0WlNjcE8xeHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQklZVzVrYkdWaVlYSnpRMjl0Y0dsc1pYSXVkR1Z0Y0d4aGRHVW9lMXdpWTI5dGNHbHNaWEpjSWpwYk55eGNJajQ5SURRdU1DNHdYQ0pkTEZ3aWJXRnBibHdpT21aMWJtTjBhVzl1S0dOdmJuUmhhVzVsY2l4a1pYQjBhREFzYUdWc2NHVnljeXh3WVhKMGFXRnNjeXhrWVhSaEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUZ3aVBHeHBQbHhjYmlBZ0lDQThZU0JvY21WbVBWeGNYQ0l1TDJsdVpHVjRMMnBwWW1WdWVtbHNhV0Z2TG1oMGJXeGNYRndpSUdOc1lYTnpQVnhjWENKcGRHVnRMV3hwYm1zZ2FYUmxiUzFqYjI1MFpXNTBJR05zYjNObExYQmhibVZzWEZ4Y0lqNWNYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WEZ4Y0ltbDBaVzB0YldWa2FXRmNYRndpUGp4cElHTnNZWE56UFZ4Y1hDSm1ZU0JtWVMxdVpYZHpjR0Z3WlhJdGIxeGNYQ0krUEM5cFBqd3ZaR2wyUGx4Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNYRndpYVhSbGJTMXBibTVsY2x4Y1hDSStYRnh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNYRndpYVhSbGJTMTBhWFJzWlZ4Y1hDSSs1Wis2NXB5czZMV0U1cGFaUEM5a2FYWStYRnh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNYRzRnSUNBZ1BDOWhQbHhjYmp3dmJHaytYRnh1UEd4cFBseGNiaUFnSUNBOFlTQm9jbVZtUFZ4Y1hDSXVMMmx1WkdWNEwyVjRjR1Z5YVdWdVkyVXVhSFJ0YkZ4Y1hDSWdZMnhoYzNNOVhGeGNJbWwwWlcwdGJHbHVheUJwZEdWdExXTnZiblJsYm5RZ1kyeHZjMlV0Y0dGdVpXeGNYRndpUGx4Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNYRndpYVhSbGJTMXRaV1JwWVZ4Y1hDSStQR2tnWTJ4aGMzTTlYRnhjSW1aaElHWmhMWEJoY0dWeUxYQnNZVzVsWEZ4Y0lqNDhMMmsrUEM5a2FYWStYRnh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ4Y1hDSnBkR1Z0TFdsdWJtVnlYRnhjSWo1Y1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ4Y1hDSnBkR1Z0TFhScGRHeGxYRnhjSWo3bW5Lemt1cnJudTQvbGpvWThMMlJwZGo1Y1hHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4Y2JpQWdJQ0E4TDJFK1hGeHVQQzlzYVQ1Y1hHNDhiR2srWEZ4dUlDQWdJRHhoSUdoeVpXWTlYRnhjSWk0dmFXNWtaWGd2ZDI5eWEzTXVhSFJ0YkZ4Y1hDSWdZMnhoYzNNOVhGeGNJbWwwWlcwdGJHbHVheUJwZEdWdExXTnZiblJsYm5RZ1kyeHZjMlV0Y0dGdVpXeGNYRndpUGx4Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNYRndpYVhSbGJTMXRaV1JwWVZ4Y1hDSStQR2tnWTJ4aGMzTTlYRnhjSW1aaElHWmhMV04xWW1WelhGeGNJajQ4TDJrK1BDOWthWFkrWEZ4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWeGNYQ0pwZEdWdExXbHVibVZ5WEZ4Y0lqNWNYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWeGNYQ0pwZEdWdExYUnBkR3hsWEZ4Y0lqN2t2WnpsazRIa3Y2SG1nYTg4TDJScGRqNWNYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseGNiaUFnSUNBOEwyRStYRnh1UEM5c2FUNWNYRzVjSWp0Y2JuMHNYQ0oxYzJWRVlYUmhYQ0k2ZEhKMVpYMHBPMXh1SWl3aWRtRnlJR0Z3Y0U1aGRsUmxiWEFnUFNCeVpYRjFhWEpsS0NjdUwyRndjQzF1WVhZdWFHSnpKeWs3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2UxeHVJQ0FnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCUkxsQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0F2S3VXS29PaTl2ZVd2dk9pSXF1YW9vZWFkdnlvdlhHNGdJQ0FnSUNBZ0lDQWdJQ0FrSkNoY0lpNWhjSEF0Ym1GMlhDSXBMbUZ3Y0dWdVpDaGhjSEJPWVhaVVpXMXdLQ2twTzF4dUlDQWdJQ0FnSUNBZ0lDQWdiWGxCY0hBdWIyNVFZV2RsU1c1cGRDZ25hRzl0WlNjc0lHWjFibU4wYVc5dUtIQmhaMlVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBa0pDaGNJaTVwYm1SbGVDMWhjSEF0Ym1GMlhDSXBMbUZ3Y0dWdVpDaGhjSEJPWVhaVVpXMXdLQ2twTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsYzI5c2RtVW9LVHRjYmlBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnZlZ4dWZUdGNiaUlzSWk4dklHaGljMlo1SUdOdmJYQnBiR1ZrSUVoaGJtUnNaV0poY25NZ2RHVnRjR3hoZEdWY2JuWmhjaUJJWVc1a2JHVmlZWEp6UTI5dGNHbHNaWElnUFNCeVpYRjFhWEpsS0Nkb1luTm1lUzl5ZFc1MGFXMWxKeWs3WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVoaGJtUnNaV0poY25ORGIyMXdhV3hsY2k1MFpXMXdiR0YwWlNoN1hDSXhYQ0k2Wm5WdVkzUnBiMjRvWTI5dWRHRnBibVZ5TEdSbGNIUm9NQ3hvWld4d1pYSnpMSEJoY25ScFlXeHpMR1JoZEdFcElIdGNiaUFnSUNCMllYSWdjM1JoWTJzeE8xeHVYRzRnSUhKbGRIVnliaUJjSWp4a2FYWWdZMnhoYzNNOVhGeGNJbU52Ym5SbGJuUXRZbXh2WTJzdGRHbDBiR1ZjWEZ3aVBsd2lYRzRnSUNBZ0t5QmpiMjUwWVdsdVpYSXVaWE5qWVhCbFJYaHdjbVZ6YzJsdmJpaGpiMjUwWVdsdVpYSXViR0Z0WW1SaEtDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUM1MGFYUnNaU0E2SUdSbGNIUm9NQ2tzSUdSbGNIUm9NQ2twWEc0Z0lDQWdLeUJjSWp3dlpHbDJQbHhjYmp4a2FYWWdZMnhoYzNNOVhGeGNJbU52Ym5SbGJuUXRZbXh2WTJ0Y1hGd2lQbHhjYmlBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKamIyNTBaVzUwTFdKc2IyTnJMV2x1Ym1WeVhGeGNJajVjWEc1Y0lseHVJQ0FnSUNzZ0tDaHpkR0ZqYXpFZ1BTQm9aV3h3WlhKekxtVmhZMmd1WTJGc2JDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUNBNklIdDlMQ2hrWlhCMGFEQWdJVDBnYm5Wc2JDQS9JR1JsY0hSb01DNWpiMjUwWlc1MElEb2daR1Z3ZEdnd0tTeDdYQ0p1WVcxbFhDSTZYQ0psWVdOb1hDSXNYQ0pvWVhOb1hDSTZlMzBzWENKbWJsd2lPbU52Ym5SaGFXNWxjaTV3Y205bmNtRnRLRElzSUdSaGRHRXNJREFwTEZ3aWFXNTJaWEp6WlZ3aU9tTnZiblJoYVc1bGNpNXViMjl3TEZ3aVpHRjBZVndpT21SaGRHRjlLU2tnSVQwZ2JuVnNiQ0EvSUhOMFlXTnJNU0E2SUZ3aVhDSXBYRzRnSUNBZ0t5QmNJaUFnSUNBOEwyUnBkajVjWEc0OEwyUnBkajVjWEc1Y0lqdGNibjBzWENJeVhDSTZablZ1WTNScGIyNG9ZMjl1ZEdGcGJtVnlMR1JsY0hSb01DeG9aV3h3WlhKekxIQmhjblJwWVd4ekxHUmhkR0VwSUh0Y2JpQWdJQ0IyWVhJZ2MzUmhZMnN4TzF4dVhHNGdJSEpsZEhWeWJpQmNJaUFnSUNBZ0lDQWdQSEErWENKY2JpQWdJQ0FySUNnb2MzUmhZMnN4SUQwZ1kyOXVkR0ZwYm1WeUxteGhiV0prWVNoa1pYQjBhREFzSUdSbGNIUm9NQ2twSUNFOUlHNTFiR3dnUHlCemRHRmphekVnT2lCY0lsd2lLVnh1SUNBZ0lDc2dYQ0k4TDNBK1hGeHVYQ0k3WEc1OUxGd2lZMjl0Y0dsc1pYSmNJanBiTnl4Y0lqNDlJRFF1TUM0d1hDSmRMRndpYldGcGJsd2lPbVoxYm1OMGFXOXVLR052Ym5SaGFXNWxjaXhrWlhCMGFEQXNhR1ZzY0dWeWN5eHdZWEowYVdGc2N5eGtZWFJoS1NCN1hHNGdJQ0FnZG1GeUlITjBZV05yTVR0Y2JseHVJQ0J5WlhSMWNtNGdLQ2h6ZEdGamF6RWdQU0JvWld4d1pYSnpMbVZoWTJndVkyRnNiQ2hrWlhCMGFEQWdJVDBnYm5Wc2JDQS9JR1JsY0hSb01DQTZJSHQ5TEdSbGNIUm9NQ3g3WENKdVlXMWxYQ0k2WENKbFlXTm9YQ0lzWENKb1lYTm9YQ0k2ZTMwc1hDSm1ibHdpT21OdmJuUmhhVzVsY2k1d2NtOW5jbUZ0S0RFc0lHUmhkR0VzSURBcExGd2lhVzUyWlhKelpWd2lPbU52Ym5SaGFXNWxjaTV1YjI5d0xGd2laR0YwWVZ3aU9tUmhkR0Y5S1NrZ0lUMGdiblZzYkNBL0lITjBZV05yTVNBNklGd2lYQ0lwTzF4dWZTeGNJblZ6WlVSaGRHRmNJanAwY25WbGZTazdYRzRpTENJdkx5Qm9Zbk5tZVNCamIyMXdhV3hsWkNCSVlXNWtiR1ZpWVhKeklIUmxiWEJzWVhSbFhHNTJZWElnU0dGdVpHeGxZbUZ5YzBOdmJYQnBiR1Z5SUQwZ2NtVnhkV2x5WlNnbmFHSnpabmt2Y25WdWRHbHRaU2NwTzF4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCSVlXNWtiR1ZpWVhKelEyOXRjR2xzWlhJdWRHVnRjR3hoZEdVb2Uxd2lNVndpT21aMWJtTjBhVzl1S0dOdmJuUmhhVzVsY2l4a1pYQjBhREFzYUdWc2NHVnljeXh3WVhKMGFXRnNjeXhrWVhSaEtTQjdYRzRnSUNBZ2RtRnlJSE4wWVdOck1UdGNibHh1SUNCeVpYUjFjbTRnWENJOFpHbDJJR05zWVhOelBWeGNYQ0pqYjI1MFpXNTBMV0pzYjJOckxYUnBkR3hsWEZ4Y0lqNWNJbHh1SUNBZ0lDc2dZMjl1ZEdGcGJtVnlMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNG9ZMjl1ZEdGcGJtVnlMbXhoYldKa1lTZ29aR1Z3ZEdnd0lDRTlJRzUxYkd3Z1B5QmtaWEIwYURBdWRHbDBiR1VnT2lCa1pYQjBhREFwTENCa1pYQjBhREFwS1Z4dUlDQWdJQ3NnWENJOEwyUnBkajVjWEc0OFpHbDJJR05zWVhOelBWeGNYQ0pzYVhOMExXSnNiMk5yWEZ4Y0lqNWNYRzRnSUNBZ1BIVnNQbHhjYmx3aVhHNGdJQ0FnS3lBb0tITjBZV05yTVNBOUlHaGxiSEJsY25NdVpXRmphQzVqWVd4c0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3SURvZ2UzMHNLR1JsY0hSb01DQWhQU0J1ZFd4c0lEOGdaR1Z3ZEdnd0xtTnZiblJsYm5RZ09pQmtaWEIwYURBcExIdGNJbTVoYldWY0lqcGNJbVZoWTJoY0lpeGNJbWhoYzJoY0lqcDdmU3hjSW1adVhDSTZZMjl1ZEdGcGJtVnlMbkJ5YjJkeVlXMG9NaXdnWkdGMFlTd2dNQ2tzWENKcGJuWmxjbk5sWENJNlkyOXVkR0ZwYm1WeUxtNXZiM0FzWENKa1lYUmhYQ0k2WkdGMFlYMHBLU0FoUFNCdWRXeHNJRDhnYzNSaFkyc3hJRG9nWENKY0lpbGNiaUFnSUNBcklGd2lJQ0FnSUR3dmRXdytYRnh1UEM5a2FYWStYRnh1WENJN1hHNTlMRndpTWx3aU9tWjFibU4wYVc5dUtHTnZiblJoYVc1bGNpeGtaWEIwYURBc2FHVnNjR1Z5Y3l4d1lYSjBhV0ZzY3l4a1lYUmhLU0I3WEc0Z0lDQWdkbUZ5SUdGc2FXRnpNVDFqYjI1MFlXbHVaWEl1YkdGdFltUmhMQ0JoYkdsaGN6STlZMjl1ZEdGcGJtVnlMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNDdYRzVjYmlBZ2NtVjBkWEp1SUZ3aUlDQWdJQ0FnSUNBOGJHaytYRnh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNYRndpYVhSbGJTMWpiMjUwWlc1MFhGeGNJajVjWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY1hGd2lhWFJsYlMxcGJtNWxjbHhjWENJK1hGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ4Y1hDSnBkR1Z0TFhScGRHeGxYRnhjSWo1Y0lseHVJQ0FnSUNzZ1lXeHBZWE15S0dGc2FXRnpNU2dvWkdWd2RHZ3dJQ0U5SUc1MWJHd2dQeUJrWlhCMGFEQXVjM1ZpZEdsMGJHVWdPaUJrWlhCMGFEQXBMQ0JrWlhCMGFEQXBLVnh1SUNBZ0lDc2dYQ0k4TDJScGRqNWNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhGeGNJbWwwWlcwdFlXWjBaWEpjWEZ3aVBsd2lYRzRnSUNBZ0t5QmhiR2xoY3pJb1lXeHBZWE14S0Noa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQzV6ZFdKamIyNTBaVzUwSURvZ1pHVndkR2d3S1N3Z1pHVndkR2d3S1NsY2JpQWdJQ0FySUZ3aVBDOWthWFkrWEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHhjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4Y2JpQWdJQ0FnSUNBZ1BDOXNhVDVjWEc1Y0lqdGNibjBzWENKamIyMXdhV3hsY2x3aU9sczNMRndpUGowZ05DNHdMakJjSWwwc1hDSnRZV2x1WENJNlpuVnVZM1JwYjI0b1kyOXVkR0ZwYm1WeUxHUmxjSFJvTUN4b1pXeHdaWEp6TEhCaGNuUnBZV3h6TEdSaGRHRXBJSHRjYmlBZ0lDQjJZWElnYzNSaFkyc3hPMXh1WEc0Z0lISmxkSFZ5YmlBb0tITjBZV05yTVNBOUlHaGxiSEJsY25NdVpXRmphQzVqWVd4c0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3SURvZ2UzMHNaR1Z3ZEdnd0xIdGNJbTVoYldWY0lqcGNJbVZoWTJoY0lpeGNJbWhoYzJoY0lqcDdmU3hjSW1adVhDSTZZMjl1ZEdGcGJtVnlMbkJ5YjJkeVlXMG9NU3dnWkdGMFlTd2dNQ2tzWENKcGJuWmxjbk5sWENJNlkyOXVkR0ZwYm1WeUxtNXZiM0FzWENKa1lYUmhYQ0k2WkdGMFlYMHBLU0FoUFNCdWRXeHNJRDhnYzNSaFkyc3hJRG9nWENKY0lpazdYRzU5TEZ3aWRYTmxSR0YwWVZ3aU9uUnlkV1Y5S1R0Y2JpSXNJaTh2SUdoaWMyWjVJR052YlhCcGJHVmtJRWhoYm1Sc1pXSmhjbk1nZEdWdGNHeGhkR1ZjYm5aaGNpQklZVzVrYkdWaVlYSnpRMjl0Y0dsc1pYSWdQU0J5WlhGMWFYSmxLQ2RvWW5ObWVTOXlkVzUwYVcxbEp5azdYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRWhoYm1Sc1pXSmhjbk5EYjIxd2FXeGxjaTUwWlcxd2JHRjBaU2g3WENJeFhDSTZablZ1WTNScGIyNG9ZMjl1ZEdGcGJtVnlMR1JsY0hSb01DeG9aV3h3WlhKekxIQmhjblJwWVd4ekxHUmhkR0VwSUh0Y2JpQWdJQ0IyWVhJZ2MzUmhZMnN4TENCb1pXeHdaWElzSUdGc2FXRnpNVDFrWlhCMGFEQWdJVDBnYm5Wc2JDQS9JR1JsY0hSb01DQTZJSHQ5TENCaGJHbGhjekk5YUdWc2NHVnljeTVvWld4d1pYSk5hWE56YVc1bkxDQmhiR2xoY3pNOVhDSm1kVzVqZEdsdmJsd2lMQ0JoYkdsaGN6UTlZMjl1ZEdGcGJtVnlMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNDdYRzVjYmlBZ2NtVjBkWEp1SUZ3aVBHUnBkaUJqYkdGemN6MWNYRndpYW5NdFkyRnlaQ0JqWVhKa0lHdHpMV05oY21RdGFHVmhaR1Z5TFhCcFkxeGNYQ0krWEZ4dUlDQWdJRHhrYVhZZ1kyeGhjM005WEZ4Y0ltTmhjbVF0YUdWaFpHVnlYRnhjSWo1Y0lseHVJQ0FnSUNzZ1lXeHBZWE0wS0Nnb2FHVnNjR1Z5SUQwZ0tHaGxiSEJsY2lBOUlHaGxiSEJsY25NdWJtRnRaU0I4ZkNBb1pHVndkR2d3SUNFOUlHNTFiR3dnUHlCa1pYQjBhREF1Ym1GdFpTQTZJR1JsY0hSb01Da3BJQ0U5SUc1MWJHd2dQeUJvWld4d1pYSWdPaUJoYkdsaGN6SXBMQ2gwZVhCbGIyWWdhR1ZzY0dWeUlEMDlQU0JoYkdsaGN6TWdQeUJvWld4d1pYSXVZMkZzYkNoaGJHbGhjekVzZTF3aWJtRnRaVndpT2x3aWJtRnRaVndpTEZ3aWFHRnphRndpT250OUxGd2laR0YwWVZ3aU9tUmhkR0Y5S1NBNklHaGxiSEJsY2lrcEtWeHVJQ0FnSUNzZ1hDSThMMlJwZGo1Y1hHNGdJQ0FnUEdScGRpQmtZWFJoTFdKaFkydG5jbTkxYm1ROVhGeGNJbHdpWEc0Z0lDQWdLeUJoYkdsaGN6UW9LQ2hvWld4d1pYSWdQU0FvYUdWc2NHVnlJRDBnYUdWc2NHVnljeTVqYjNabGNpQjhmQ0FvWkdWd2RHZ3dJQ0U5SUc1MWJHd2dQeUJrWlhCMGFEQXVZMjkyWlhJZ09pQmtaWEIwYURBcEtTQWhQU0J1ZFd4c0lEOGdhR1ZzY0dWeUlEb2dZV3hwWVhNeUtTd29kSGx3Wlc5bUlHaGxiSEJsY2lBOVBUMGdZV3hwWVhNeklEOGdhR1ZzY0dWeUxtTmhiR3dvWVd4cFlYTXhMSHRjSW01aGJXVmNJanBjSW1OdmRtVnlYQ0lzWENKb1lYTm9YQ0k2ZTMwc1hDSmtZWFJoWENJNlpHRjBZWDBwSURvZ2FHVnNjR1Z5S1NrcFhHNGdJQ0FnS3lCY0lseGNYQ0lnZG1Gc2FXZHVQVnhjWENKaWIzUjBiMjFjWEZ3aUlHTnNZWE56UFZ4Y1hDSnNZWHA1SUd4aGVua3RabUZrWldsdUlITjNhWEJsY2kxc1lYcDVJSE5vYjNjdGNHaHZkRzhnWTJGeVpDMXBiV0ZuWlNCamIyeHZjaTEzYUdsMFpTQnVieTFpYjNKa1pYSmNYRndpSUdSaGRHRXRhV1E5WEZ4Y0lsd2lYRzRnSUNBZ0t5QmhiR2xoY3pRb0tDaG9aV3h3WlhJZ1BTQW9hR1ZzY0dWeUlEMGdhR1ZzY0dWeWN5NXBaQ0I4ZkNBb1pHVndkR2d3SUNFOUlHNTFiR3dnUHlCa1pYQjBhREF1YVdRZ09pQmtaWEIwYURBcEtTQWhQU0J1ZFd4c0lEOGdhR1ZzY0dWeUlEb2dZV3hwWVhNeUtTd29kSGx3Wlc5bUlHaGxiSEJsY2lBOVBUMGdZV3hwWVhNeklEOGdhR1ZzY0dWeUxtTmhiR3dvWVd4cFlYTXhMSHRjSW01aGJXVmNJanBjSW1sa1hDSXNYQ0pvWVhOb1hDSTZlMzBzWENKa1lYUmhYQ0k2WkdGMFlYMHBJRG9nYUdWc2NHVnlLU2twWEc0Z0lDQWdLeUJjSWx4Y1hDSStQQzlrYVhZK1hGeHVYQ0pjYmlBZ0lDQXJJQ2dvYzNSaFkyc3hJRDBnYUdWc2NHVnljMXRjSW1sbVhDSmRMbU5oYkd3b1lXeHBZWE14TENoa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQzVrWlhOaklEb2daR1Z3ZEdnd0tTeDdYQ0p1WVcxbFhDSTZYQ0pwWmx3aUxGd2lhR0Z6YUZ3aU9udDlMRndpWm01Y0lqcGpiMjUwWVdsdVpYSXVjSEp2WjNKaGJTZ3lMQ0JrWVhSaExDQXdLU3hjSW1sdWRtVnljMlZjSWpwamIyNTBZV2x1WlhJdWJtOXZjQ3hjSW1SaGRHRmNJanBrWVhSaGZTa3BJQ0U5SUc1MWJHd2dQeUJ6ZEdGamF6RWdPaUJjSWx3aUtWeHVJQ0FnSUNzZ1hDSWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY1hGd2lZMkZ5WkMxbWIyOTBaWEpjWEZ3aVBseGNiaUFnSUNBZ0lDQWdQR0VnYUhKbFpqMWNYRndpSTF4Y1hDSWdZMnhoYzNNOVhGeGNJbXhwYm1zZ2MyaHZkeTF3YUc5MGIxeGNYQ0lnWkdGMFlTMXBaRDFjWEZ3aVhDSmNiaUFnSUNBcklHRnNhV0Z6TkNnb0tHaGxiSEJsY2lBOUlDaG9aV3h3WlhJZ1BTQm9aV3h3WlhKekxtbGtJSHg4SUNoa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQzVwWkNBNklHUmxjSFJvTUNrcElDRTlJRzUxYkd3Z1B5Qm9aV3h3WlhJZ09pQmhiR2xoY3pJcExDaDBlWEJsYjJZZ2FHVnNjR1Z5SUQwOVBTQmhiR2xoY3pNZ1B5Qm9aV3h3WlhJdVkyRnNiQ2hoYkdsaGN6RXNlMXdpYm1GdFpWd2lPbHdpYVdSY0lpeGNJbWhoYzJoY0lqcDdmU3hjSW1SaGRHRmNJanBrWVhSaGZTa2dPaUJvWld4d1pYSXBLU2xjYmlBZ0lDQXJJRndpWEZ4Y0lqNDhhU0JqYkdGemN6MWNYRndpWm1FZ1ptRXRjR2h2ZEc5Y1hGd2lQand2YVQ0ZzVwdTA1YVNhNVp1KzU0bUhQQzloUGlCY0lseHVJQ0FnSUNzZ0tDaHpkR0ZqYXpFZ1BTQm9aV3h3WlhKelcxd2lhV1pjSWwwdVkyRnNiQ2hoYkdsaGN6RXNLR1JsY0hSb01DQWhQU0J1ZFd4c0lEOGdaR1Z3ZEdnd0xuVnliQ0E2SUdSbGNIUm9NQ2tzZTF3aWJtRnRaVndpT2x3aWFXWmNJaXhjSW1oaGMyaGNJanA3ZlN4Y0ltWnVYQ0k2WTI5dWRHRnBibVZ5TG5CeWIyZHlZVzBvTkN3Z1pHRjBZU3dnTUNrc1hDSnBiblpsY25ObFhDSTZZMjl1ZEdGcGJtVnlMbTV2YjNBc1hDSmtZWFJoWENJNlpHRjBZWDBwS1NBaFBTQnVkV3hzSUQ4Z2MzUmhZMnN4SURvZ1hDSmNJaWxjYmlBZ0lDQXJJRndpWEZ4dUlDQWdJRHd2WkdsMlBseGNiand2WkdsMlBseGNibHdpTzF4dWZTeGNJakpjSWpwbWRXNWpkR2x2YmloamIyNTBZV2x1WlhJc1pHVndkR2d3TEdobGJIQmxjbk1zY0dGeWRHbGhiSE1zWkdGMFlTa2dlMXh1SUNBZ0lIWmhjaUJvWld4d1pYSTdYRzVjYmlBZ2NtVjBkWEp1SUZ3aUlDQWdJRHhrYVhZZ1kyeGhjM005WEZ4Y0ltTmhjbVF0WTI5dWRHVnVkRnhjWENJK1hGeHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKallYSmtMV052Ym5SbGJuUXRhVzV1WlhKY1hGd2lQbHhjYmlBZ0lDQWdJQ0FnSUNBZ0lEeHdQbHdpWEc0Z0lDQWdLeUJqYjI1MFlXbHVaWEl1WlhOallYQmxSWGh3Y21WemMybHZiaWdvS0dobGJIQmxjaUE5SUNob1pXeHdaWElnUFNCb1pXeHdaWEp6TG1SbGMyTWdmSHdnS0dSbGNIUm9NQ0FoUFNCdWRXeHNJRDhnWkdWd2RHZ3dMbVJsYzJNZ09pQmtaWEIwYURBcEtTQWhQU0J1ZFd4c0lEOGdhR1ZzY0dWeUlEb2dhR1ZzY0dWeWN5NW9aV3h3WlhKTmFYTnphVzVuS1N3b2RIbHdaVzltSUdobGJIQmxjaUE5UFQwZ1hDSm1kVzVqZEdsdmJsd2lJRDhnYUdWc2NHVnlMbU5oYkd3b1pHVndkR2d3SUNFOUlHNTFiR3dnUHlCa1pYQjBhREFnT2lCN2ZTeDdYQ0p1WVcxbFhDSTZYQ0prWlhOalhDSXNYQ0pvWVhOb1hDSTZlMzBzWENKa1lYUmhYQ0k2WkdGMFlYMHBJRG9nYUdWc2NHVnlLU2twWEc0Z0lDQWdLeUJjSWp3dmNENWNYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseGNiaUFnSUNBOEwyUnBkajVjWEc1Y0lqdGNibjBzWENJMFhDSTZablZ1WTNScGIyNG9ZMjl1ZEdGcGJtVnlMR1JsY0hSb01DeG9aV3h3WlhKekxIQmhjblJwWVd4ekxHUmhkR0VwSUh0Y2JpQWdJQ0IyWVhJZ2FHVnNjR1Z5TzF4dVhHNGdJSEpsZEhWeWJpQmNJbHhjYmlBZ0lDQWdJQ0FnUEdFZ2FISmxaajFjWEZ3aVhDSmNiaUFnSUNBcklHTnZiblJoYVc1bGNpNWxjMk5oY0dWRmVIQnlaWE56YVc5dUtDZ29hR1ZzY0dWeUlEMGdLR2hsYkhCbGNpQTlJR2hsYkhCbGNuTXVkWEpzSUh4OElDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUM1MWNtd2dPaUJrWlhCMGFEQXBLU0FoUFNCdWRXeHNJRDhnYUdWc2NHVnlJRG9nYUdWc2NHVnljeTVvWld4d1pYSk5hWE56YVc1bktTd29kSGx3Wlc5bUlHaGxiSEJsY2lBOVBUMGdYQ0ptZFc1amRHbHZibHdpSUQ4Z2FHVnNjR1Z5TG1OaGJHd29aR1Z3ZEdnd0lDRTlJRzUxYkd3Z1B5QmtaWEIwYURBZ09pQjdmU3g3WENKdVlXMWxYQ0k2WENKMWNteGNJaXhjSW1oaGMyaGNJanA3ZlN4Y0ltUmhkR0ZjSWpwa1lYUmhmU2tnT2lCb1pXeHdaWElwS1NsY2JpQWdJQ0FySUZ3aVhGeGNJaUJqYkdGemN6MWNYRndpWlhoMFpYSnVZV3dnYkdsdWExeGNYQ0lnZEdGeVoyVjBQVnhjWENKZllteGhibXRjWEZ3aVBqeHBJR05zWVhOelBWeGNYQ0ptWVNCbVlTMXNhVzVyWEZ4Y0lqNDhMMmsrSU9TOW5PV1RnZW1UdnVhT3BUd3ZZVDRnWENJN1hHNTlMRndpWTI5dGNHbHNaWEpjSWpwYk55eGNJajQ5SURRdU1DNHdYQ0pkTEZ3aWJXRnBibHdpT21aMWJtTjBhVzl1S0dOdmJuUmhhVzVsY2l4a1pYQjBhREFzYUdWc2NHVnljeXh3WVhKMGFXRnNjeXhrWVhSaEtTQjdYRzRnSUNBZ2RtRnlJSE4wWVdOck1UdGNibHh1SUNCeVpYUjFjbTRnS0NoemRHRmphekVnUFNCb1pXeHdaWEp6TG1WaFkyZ3VZMkZzYkNoa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQ0E2SUh0OUxHUmxjSFJvTUN4N1hDSnVZVzFsWENJNlhDSmxZV05vWENJc1hDSm9ZWE5vWENJNmUzMHNYQ0ptYmx3aU9tTnZiblJoYVc1bGNpNXdjbTluY21GdEtERXNJR1JoZEdFc0lEQXBMRndpYVc1MlpYSnpaVndpT21OdmJuUmhhVzVsY2k1dWIyOXdMRndpWkdGMFlWd2lPbVJoZEdGOUtTa2dJVDBnYm5Wc2JDQS9JSE4wWVdOck1TQTZJRndpWENJcE8xeHVmU3hjSW5WelpVUmhkR0ZjSWpwMGNuVmxmU2s3WEc0aUxDSjJZWElnZDI5eWExTmxjblpwWTJVZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5elpYSjJhV05sTDNkdmNtdHpKeWs3WEc1Y2JuWmhjaUIzYjNKcmMweHBjM1JVWlcxd0lEMGdjbVZ4ZFdseVpTZ25MaTR2Y0hWaWJHbGpMM2R2Y210ekxXeHBjM1F1YUdKekp5azdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnZTF4dUlDQWdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJSTGxCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU3dnY21WcVpXTjBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZLdVM5bk9XVGdlbWh0ZW1kb2lvdlhHNGdJQ0FnSUNBZ0lDQWdJQ0J0ZVVGd2NDNXZibEJoWjJWSmJtbDBLQ2QzYjNKcmN5Y3NJR1oxYm1OMGFXOXVLSEJoWjJVcElIdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSGR2Y210VFpYSjJhV05sTG1kbGRFeHBjM1FvS1M1MGFHVnVLR1oxYm1OMGFXOXVLR1JoZEdFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSkNRb1hDSWphbk10ZDI5eWEzTXRiR2x6ZEZ3aUtTNW9kRzFzS0hkdmNtdHpUR2x6ZEZSbGJYQW9aR0YwWVNrcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4cVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJT1dJbmVXbmkrV01sdVdidnVlSmgraTFsdVdLb09pOXZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiWGxCY0hBdWFXNXBkRWx0WVdkbGMweGhlbmxNYjJGa0tDY3VjR0ZuWlNjcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4cVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJT1didnVXR2pPYTFqK2luaUZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdLaTljYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pDUW9KeTV6YUc5M0xYQm9iM1J2SnlrdWIyNG9KMk5zYVdOckp5d2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ0pDUjBhR2x6SUQwZ0pDUW9kR2hwY3lrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIZHZjbXRUWlhKMmFXTmxMbWRsZEVKNVNXUW9KQ1IwYUdsekxtRjBkSElvWENKa1lYUmhMV2xrWENJcEtTNTBhR1Z1S0daMWJtTjBhVzl1S0dSaGRHRXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdGVVRndjQzV3YUc5MGIwSnliM2R6WlhJb2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2FHOTBiM002SUdSaGRHRXViR2x6ZEN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYkdGNmVVeHZZV1JwYm1jNklIUnlkV1VzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJvWlcxbE9pQW5aR0Z5YXljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdKaFkydE1hVzVyVkdWNGREb2dKK2kvbE9XYm5pZGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5S1M1dmNHVnVLQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemIyeDJaU2dwTzF4dUlDQWdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNTlPMXh1SWl3aWRtRnlJR0poYVd0bFUzVnRiV0Z5ZVNBOUlGdDdYRzRnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJWemRXMXRZWEo1THpBeExuQnVaeWNzWEc0Z0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYm4wc0lIdGNiaUFnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWlZV2xyWlhOMWJXMWhjbmt2TURJdWNHNW5KeXhjYmlBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1ZlN3Z2UxeHVJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwySmhhV3RsYzNWdGJXRnllUzh3TXk1d2JtY25MRnh1SUNBZ0lHTmhjSFJwYjI0NklDY25YRzU5TENCN1hHNGdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlZ6ZFcxdFlYSjVMekEwTG5CdVp5Y3NYRzRnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNibjBzSUh0Y2JpQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5aVlXbHJaWE4xYlcxaGNua3ZNRFV1Y0c1bkp5eGNiaUFnSUNCallYQjBhVzl1T2lBbkoxeHVmU3dnZTF4dUlDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJKaGFXdGxjM1Z0YldGeWVTOHdOaTV3Ym1jbkxGeHVJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNTlMQ0I3WEc0Z0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVnpkVzF0WVhKNUx6QTNMbkJ1Wnljc1hHNGdJQ0FnWTJGd2RHbHZiam9nSnlkY2JuMHNJSHRjYmlBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlpWVdsclpYTjFiVzFoY25rdk1EZ3VjRzVuSnl4Y2JpQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dWZTd2dlMXh1SUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkpoYVd0bGMzVnRiV0Z5ZVM4d09TNXdibWNuTEZ4dUlDQWdJR05oY0hScGIyNDZJQ2NuWEc1OUxDQjdYRzRnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJWemRXMXRZWEo1THpFd0xuQnVaeWNzWEc0Z0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYm4wc0lIdGNiaUFnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWlZV2xyWlhOMWJXMWhjbmt2TVRFdWNHNW5KeXhjYmlBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1ZlN3Z2UxeHVJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwySmhhV3RsYzNWdGJXRnllUzh4TWk1d2JtY25MRnh1SUNBZ0lHTmhjSFJwYjI0NklDY25YRzU5TENCN1hHNGdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlZ6ZFcxdFlYSjVMekV6TG5CdVp5Y3NYRzRnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNibjBzSUh0Y2JpQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5aVlXbHJaWE4xYlcxaGNua3ZNVFF1Y0c1bkp5eGNiaUFnSUNCallYQjBhVzl1T2lBbkoxeHVmU3dnZTF4dUlDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJKaGFXdGxjM1Z0YldGeWVTOHhOUzV3Ym1jbkxGeHVJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNTlMQ0I3WEc0Z0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVnpkVzF0WVhKNUx6RTJMbkJ1Wnljc1hHNGdJQ0FnWTJGd2RHbHZiam9nSnlkY2JuMHNJSHRjYmlBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlpWVdsclpYTjFiVzFoY25rdk1UY3VjRzVuSnl4Y2JpQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dWZTd2dlMXh1SUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkpoYVd0bGMzVnRiV0Z5ZVM4eE9DNXdibWNuTEZ4dUlDQWdJR05oY0hScGIyNDZJQ2NuWEc1OUxDQjdYRzRnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJWemRXMXRZWEo1THpFNUxuQnVaeWNzWEc0Z0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYm4wc0lIdGNiaUFnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWlZV2xyWlhOMWJXMWhjbmt2TWpBdWNHNW5KeXhjYmlBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1ZlYwN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdZbUZwYTJWVGRXMXRZWEo1TzF4dUlpd2lkbUZ5SUdKaGMybGpSR0YwWVNBOUlGdDdYRzRnSUNBZ2RHbDBiR1U2SUNmbG43cm1uS3prdjZIbWdhOG5MRnh1SUNBZ0lHTnZiblJsYm5RNklGdDdYRzRnSUNBZ0lDQWdJSE4xWW5ScGRHeGxPaUFuNWFlVDVaQ05KeXhjYmlBZ0lDQWdJQ0FnYzNWaVkyOXVkR1Z1ZERvZ0oraTF0ZVM4bXVpbmdTaEdkWEpwWXlrblhHNGdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQnpkV0owYVhSc1pUb2dKK2FBcCtXSXF5Y3NYRzRnSUNBZ0lDQWdJSE4xWW1OdmJuUmxiblE2SUNmbmxMY25YRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0J6ZFdKMGFYUnNaVG9nSitXSHV1ZVVuK1c1dE9hY2lDY3NYRzRnSUNBZ0lDQWdJSE4xWW1OdmJuUmxiblE2SUNjeE9UZ3k1Ym0wTk9hY2lDZGNiaUFnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJSE4xWW5ScGRHeGxPaUFuNXJDUjVwZVBKeXhjYmlBZ0lDQWdJQ0FnYzNWaVkyOXVkR1Z1ZERvZ0orYXhpZWFYanlkY2JpQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lITjFZblJwZEd4bE9pQW41YW1hNWFlNzU0cTI1WWExSnl4Y2JpQWdJQ0FnSUNBZ2MzVmlZMjl1ZEdWdWREb2dKK1czc3VXcG1pZGNiaUFnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJSE4xWW5ScGRHeGxPaUFuNTdHTjZMU3ZKeXhjYmlBZ0lDQWdJQ0FnYzNWaVkyOXVkR1Z1ZERvZ0orYXlzK1dObHlkY2JpQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lITjFZblJwZEd4bE9pQW41WVcwNkxhajU0aXg1YVc5Snl4Y2JpQWdJQ0FnSUNBZ2MzVmlZMjl1ZEdWdWREb2dKK2VVdGVXdGtPT0FnZWVock9TN3R1T0FnVVJKV1NkY2JpQWdJQ0I5WFZ4dWZTd2dlMXh1SUNBZ0lIUnBkR3hsT2lBbjZJT001cG12NUx1TDU3dU5KeXhjYmlBZ0lDQmpiMjUwWlc1ME9pQmJlMXh1SUNBZ0lDQWdJQ0J6ZFdKMGFYUnNaVG9nSitXM3BlUzluT2U3aittcWpDY3NYRzRnSUNBZ0lDQWdJSE4xWW1OdmJuUmxiblE2SUNjeE11VzV0RmRGUXVTNnArV1RnZWFldHVhZWhPZWdsT1dQa1NkY2JpQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lITjFZblJwZEd4bE9pQW41cStWNUxpYTZabWk1cUNoSnl4Y2JpQWdJQ0FnSUNBZ2MzVmlZMjl1ZEdWdWREb2dKK21Ea2VXM251aTl1K1czcGVTNG11V3RwdW1ab2lneU1EQXdmakl3TURUbHViUXBKMXh1SUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnYzNWaWRHbDBiR1U2SUNmbWlZRGt2NjdrdUpQa3VKb25MRnh1SUNBZ0lDQWdJQ0J6ZFdKamIyNTBaVzUwT2lBbjU1UzE1YTJRNUxpTzVMK2g1b0d2NW9xQTVweXZKMXh1SUNBZ0lIMWRYRzU5TENCN1hHNGdJQ0FnZEdsMGJHVTZJQ2ZvZ1pUbnM3dm1scm5sdkk4bkxGeHVJQ0FnSUdOdmJuUmxiblE2SUZ0N1hHNGdJQ0FnSUNBZ0lITjFZblJwZEd4bE9pQW41NVMxNksrZEp5eGNiaUFnSUNBZ0lDQWdjM1ZpWTI5dWRHVnVkRG9nSnpFek9ERXhPRFk1TWpBNEoxeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdjM1ZpZEdsMGJHVTZJQ2RGYldGcGJDY3NYRzRnSUNBZ0lDQWdJSE4xWW1OdmJuUmxiblE2SUNkbWRYSnBZMEJ4Y1M1amIyMG5YRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0J6ZFdKMGFYUnNaVG9nSitlT3NPUzlqK1dkZ0Njc1hHNGdJQ0FnSUNBZ0lITjFZbU52Ym5SbGJuUTZJQ2Zsakpma3Vxemt1cWJsdW9UbHZJRGxqNUhsakxybnA1SGxpSnZsallIa3VJbm9vWmNuWEc0Z0lDQWdmVjFjYm4xZE8xeHVYRzUyWVhJZ1ptRjJhV052YmtSaGRHRWdQU0I3WEc0Z0lDQWdkR2wwYkdVNklDZG1kWEpwWXljc1hHNGdJQ0FnWm1GMmFXTnZiam9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMM3BvWVc5NmFHRnZMbXB3Wnljc1hHNGdJQ0FnWkdWell6b2dKK1M0cXVTNnV1aUR2ZVdLbSthY2llbVprTys4ak9XYm91bVluK1dLbSttSGorYVhvT21aa08rOGdlaXVxZWEvZ09hRGhlZUhnK2VEcCtpSHF1VzNzZSs4ak9hS2l1ZUJxK1dGaWVlRnArUzZydVdJcStTNnVpRW5YRzU5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlIdGNibHh1SUNBZ0lDOHFYRzRnSUNBZzZJNjM1WStXNW9tQTVweUo1Wis2NXB5czVMK2g1b0d2WEc0Z0lDQWdJQ292WEc0Z0lDQWdaMlYwVEdsemRFRnNiRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCUkxsQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhOdmJIWmxLR0poYzJsalJHRjBZU2s3WEc0Z0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwc1hHNWNiaUFnSUNCblpYUkdZWFpwWTI5dVJHRjBZVG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCUkxsQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhOdmJIWmxLR1poZG1samIyNUVZWFJoS1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVmVHRjYmlJc0luWmhjaUJpYkc5amEwUmhkR0VnUFNCYmUxeHVJQ0FnSUdsa09pQW5ZV0p2ZFhSdFpTY3NYRzRnSUNBZ2RHbDBiR1U2SUNmb2g2cm1pSkhrdTR2bnU0MG5MRnh1SUNBZ0lHTnZiblJsYm5RNklGc242SWUwNVlxYjVMcU9WMFZDNTZDVTVZK1I1YmVsNTZpTDVZeVc2SWVxNVlxbzVZeVc1NXFFNTZDVTU2bTI3N3lNUEdFZ2FISmxaajFjSW1oMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5bWRYSnBZeTE2YUdGdkwyWmxlaTljSWlCMFlYSm5aWFE5WENKZllteGhibXRjSWlCamJHRnpjejFjSW14cGJtc2daWGgwWlhKdVlXeGNJajVHUlZvOEwyRSs1WW1ONTZ1djVxaWg1WjJYNVl5VzViZWw1NmlMNWJ5QTVZK1I1cUdHNXA2MjVMMmM2SUNGNDRDQ0p5d2dKK2FidnVTNGp1ZStqdVdidmVlaGhlaXd0K1dib3VtWW4raUJsT1dRaU9lZ2xPV1BrZVdGdCthY2llV0dtK1czcGVXdWllV0ZxT2kxaE9pMHFPZWFoT2U5a2VlN25PV0hodVdGcGVlenUrV0lsK2k5citTN3R1T0FnZVdidmVXR2hlbWh0dWU2cCtTNmt1aUJsT2U5a2VXdWllV0ZxT1dGck9XUHVPZWFoT2FRbk9lMG91ZVp2dWVua2VPQWdlYWd1T1cvZytXdWllV0ZxT09BZ2Vpbmh1bWlrZWVidE9hU3JlT0FnZWFadXVpRHZlZWhyT1M3dHVldGllV2twK1M0cmVXZWkrbWh1ZWVicnVlYWhPV0pqZWVycithZWhPVzd1dU9BZ3VlT3NPaTBuK2kwbytTNnJPUzRuT2FRbk9lMG91UzRqdVdrcCthVnNPYU5ydVc1cytXUHNPUzhsK1drbXVhVnNPYU5ydWV4dStTNnArV1RnZWVhaE9XSmplZXJyK2FldHVhZWhPT0FnaWNzSUNma3ZiL25sS2psbTczcG1ZWGxpWTNtc3Ivbm1vVGx0NlhucUl2bGpKYm1pb0RtbksvbWo1RHBxNWpsbTZMcG1KL25vSlRsajVIbWxZam5qb2ZsajRycG9ibm5tNjdrdXFmbGs0SG5tb1RsajYvbnU3VG1pcVRtZ0tmbGtvem1pYW5sc1pYbWdLZmpnSUxsbG9Ua3VvN2xqWS9vc0lQcG9ibm5tNjdubW9UbnJaYmxpSkxqZ0lIb3JyN29ycUhqZ0lIcG5JRG1zWUxvaklQbG03VGxrb3pwb2Jubm02N292NXZsdXFiamdJSGxwSVRua0lib3A2UGxoclBsa0lUbmpxL29pb0xwbDY3cG9wampnSUluWFZ4dWZTd2dlMXh1SUNBZ0lHbGtPaUFuWjJGdVozZGxhU2NzWEc0Z0lDQWdkR2wwYkdVNklDZm1oSS9sa0pIbHNwZmt2WTBuTEZ4dUlDQWdJR052Ym5SbGJuUTZJRnNuVjBWQzVMcW41Wk9CNXA2MjVwNkU1YmlJNDRDQjZhdVk1N3FuNVlXbzVxQ0k1YmVsNTZpTDViaUk0NENCNW9xQTVweXY1NjZoNTVDRzZJR001TDJONDRDQjVMcW41Wk9CNklHTTVMMk5KMTFjYm4wc0lIdGNiaUFnSUNCcFpEb2dKM3BvYVhwbEp5eGNiaUFnSUNCMGFYUnNaVG9nSithRWorV1FrZWlCak9pMG95Y3NYRzRnSUNBZ1kyOXVkR1Z1ZERvZ1d5Zm90Si9vdEtQa3VxZmxrNEhwbklEbXNZTGxpSWJtbnBEbGtvem1ucmJtbm9Ub3JyN29ycUhqZ0lIbGo0TGt1STduczd2bnU1L21pb0RtbksvcGdJbmxub3ZsajRybW9Mamx2NFBtcUtIbG5aZm1pb0RtbksvcHFvem9yNEhsa296bWlvRG1uSy9tbEx2bGhiUHZ2SXpscnA3bmpyRGx1YmJscm96bGxvVGt1cWZsazRIbGlwL29nNzN2dkl6bGpZL29zSVBtdFl2b3I1WGpnSUhrdUlybnVyL2pnSUhsajQzcHBvam5yWW5tdFlIbnFJdnZ2SXptanFmbGlMYmt1cWZsazRIb3Y1dmx1cWJsajRybHBJVG5rSWJsa0lUbmpxL29pb0xwbDY3cG9wanZ2SXprdjUzb3I0SGt1cWZsazRIbW5JRG51NGpvdEtqcGg0L2pnSUluWFZ4dWZTd2dlMXh1SUNBZ0lHbGtPaUFuZDI5eVpDY3NYRzRnSUNBZ2RHbDBiR1U2SUNkM2IzSms1NG1JNTY2QTVZNkdKeXhjYmlBZ0lDQmpiMjUwWlc1ME9pQmJKenhoSUdoeVpXWTlYQ0pvZEhSd09pOHZkM2QzTG1obGMzUjFaSGt1WTI5dEwyTmhjbVZsY2k1a2IyTjRYQ0lnWTJ4aGMzTTlYQ0pzYVc1cklHVjRkR1Z5Ym1Gc1hDSWdkR0Z5WjJWMFBWd2lYMkpzWVc1clhDSSthSFIwY0RvdkwzZDNkeTVvWlhOMGRXUjVMbU52YlM5allYSmxaWEl1Wkc5amVEd3ZZVDRuWFZ4dWZTd2dlMXh1SUNBZ0lHbGtPaUFuYzNsemRHVnRKeXhjYmlBZ0lDQjBhWFJzWlRvZ0orV0ZzK1M2anVhY3JPZXp1K2U3bnljc1hHNGdJQ0FnWTI5dWRHVnVkRG9nV3lmbW5Lem5zN3ZudTUva3ZiL25sS2hHUlZybGlZM25xNi9tcUtIbG5aZmxqSmJsdklEbGo1SG1vWWJtbnJibG43cmt1bzVHY21GdFpYZHZjbXMzNXA2RTVidTY0NENDNXJ5VTU2UzY1THFHNTZlNzVZcW81NnV2VWtWTjU1cUU2S2VqNVlhejVwYTU1cUdJNDRDQzVZVzg1YTY1NUx1NzVMMlY1N3VJNTZ1djVaS001Ym16NVkrdzQ0Q0I1WSt2NUx1bDVZYUY1YldNNVp5bzVMdTc1TDJWUVZCUTVvaVc1NmU3NVlxbzU2dXY1YnFVNTVTbzVMaXQ1cldQNktlSTQ0Q0NKeXdnSnp4aElHaHlaV1k5WENKb2RIUndjem92TDJkcGRHaDFZaTVqYjIwdlpuVnlhV010ZW1oaGJ5OW1aWG92WENJZ2RHRnlaMlYwUFZ3aVgySnNZVzVyWENJZ1kyeGhjM005WENKc2FXNXJJR1Y0ZEdWeWJtRnNYQ0krUmtWYVBDOWhQaURtbUsvcG5hTGxrSkVnNVltTjU2dXY1cWloNVoyWDVZeVc1YmVsNTZpTElPZWFoT1c4Z09XUGtlYWhodWFldHVPQWd1UzR1K2ltZ2VTNHV1aW5vK1dHc3lEbGlZM25xNi9sdklEbGo1SGxwSnJrdXJycHE1am1sWWpsalkva3ZaempnSUhtajVEcHE1amx2SURsajVIb3RLanBoNC9qZ0lIbGo0cnBvYm5ubTY3bGlwL29nNzNtaWFubHNaWG5tb1RsdjZ2cGdKL292NjNrdTZQbGtvemxqNi9udTdUbWlxVG1nS2ZucllucGw2N3BvcGpqZ0lMbW9Mamx2NFBsaklYbWk2emxpcC9vZzczbXFLSGxuWmZsakpiamdJSG51NVBtbm9Ub3A0VG9qSVBsakpiamdJSGxqNHJsdklEbGo1SG9oNnJsaXFqbGpKYmpnSUluWFZ4dWZTd2dlMXh1SUNBZ0lHbGtPaUFuWTJGeVpXVnlMV052WkdVbkxGeHVJQ0FnSUhScGRHeGxPaUFuNTY2QTVZNkc1cnFRNTZDQjVZK0M2SUNESnl4Y2JpQWdJQ0JqYjI1MFpXNTBPaUJiSitLQXFqeGhJR2h5WldZOVhDSm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZablZ5YVdNdGVtaGhieTlqWVhKbFpYSXZYQ0lnZEdGeVoyVjBQVndpWDJKc1lXNXJYQ0lnWTJ4aGMzTTlYQ0pzYVc1cklHVjRkR1Z5Ym1Gc1hDSSthSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMMloxY21sakxYcG9ZVzh2WTJGeVpXVnlMend2WVQ0blhWeHVmU3dnZTF4dUlDQWdJR2xrT2lBbmVpMTNiM0pyWm14dmR5MWpiMlJsSnl4Y2JpQWdJQ0IwYVhSc1pUb2dKMFpGV3VXSmplZXJyK2Fvb2VXZGwrV01sdVczcGVlb2krUzdpK2U3amVXUGl1YTZrT2VnZ1Njc1hHNGdJQ0FnWTI5dWRHVnVkRG9nV3lmaWdLbzhZU0JvY21WbVBWd2lhSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMMloxY21sakxYcG9ZVzh2Wm1WNkwxd2lJSFJoY21kbGREMWNJbDlpYkdGdWExd2lJR05zWVhOelBWd2liR2x1YXlCbGVIUmxjbTVoYkZ3aVBtaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOW1kWEpwWXkxNmFHRnZMMlpsZWk4OEwyRStKMTFjYm4xZE8xeHVYRzVtZFc1amRHbHZiaUJwYmtGeWNtRjVLR1ZzWlcwc0lHRnljaXdnYVNrZ2UxeHVJQ0FnSUhaaGNpQnNaVzQ3WEc1Y2JpQWdJQ0JwWmlBb1lYSnlLU0I3WEc0Z0lDQWdJQ0FnSUd4bGJpQTlJR0Z5Y2k1c1pXNW5kR2c3WEc0Z0lDQWdJQ0FnSUdrZ1BTQnBJRDhnYVNBOElEQWdQeUJOWVhSb0xtMWhlQ2d3TENCc1pXNGdLeUJwS1NBNklHa2dPaUF3TzF4dVhHNGdJQ0FnSUNBZ0lHWnZjaUFvT3lCcElEd2diR1Z1T3lCcEt5c3BJSHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVTJ0cGNDQmhZMk5sYzNOcGJtY2dhVzRnYzNCaGNuTmxJR0Z5Y21GNWMxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHa2dhVzRnWVhKeUlDWW1JR0Z5Y2x0cFhTQTlQVDBnWld4bGJTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQnBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVjBkWEp1SUMweE8xeHVmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUh0Y2JpQWdJQ0F2S2x4dUlDQWdJQ0RvanJmbGo1YmxoYlBrdW83bW5Lem5zN3ZudTUvbm1vVGt2NkhtZ2E5Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0JuWlhSQlltOTFkRk41YzNSbGJUb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQnlkRzVFWVhSaElEMGdXMTA3WEc0Z0lDQWdJQ0FnSUhaaGNpQnNhVzFwZENBOUlGc25jM2x6ZEdWdEoxMDdYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRkV1VUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdZbXh2WTJ0RVlYUmhMbTFoY0NobWRXNWpkR2x2YmlocGRHVnRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHbHVRWEp5WVhrb2FYUmxiUzVwWkN3Z2JHbHRhWFFzSURBcElENGdMVEVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjblJ1UkdGMFlTNXdkWE5vS0dsMFpXMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWE52YkhabEtISjBia1JoZEdFcE8xeHVJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdMeXBjYmlBZ0lDQWc2STYzNVkrVzZhYVc2YUcxNUwraDVvR3ZYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1oyVjBTVzVrWlhoRVlYUmhPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJSEowYmtSaGRHRWdQU0JiWFR0Y2JpQWdJQ0FnSUNBZ2RtRnlJR3hwYldsMElEMGdXeWRoWW05MWRHMWxKeXdnSjJkaGJtZDNaV2tuTENBbmVtaHBlbVVuTENBbmVpMTNiM0pyWm14dmR5MWpiMlJsSjEwN1hHNWNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlGRXVVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ1lteHZZMnRFWVhSaExtMWhjQ2htZFc1amRHbHZiaWhwZEdWdEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dsdVFYSnlZWGtvYVhSbGJTNXBaQ3dnYkdsdGFYUXNJREFwSUQ0Z0xURXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NuUnVSR0YwWVM1d2RYTm9LR2wwWlcwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0hKMGJrUmhkR0VwTzF4dUlDQWdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNTlPMXh1SWl3aWRtRnlJR3BwYm1kc2FVUmhkR0VnUFNCYmUxeHVJQ0FnSUhScGRHeGxPaUJjSWpJd01USitNakF4Tmx3aUxGeHVJQ0FnSUdOdmJYQnZibms2SUZ3aTVZeVg1THFzNWFXSDZKbU9Nell3NTZlUjVvcUE1cHlKNlptUTVZV3M1WSs0Nzd5STVhV0g2YU9lNTcrVTZJbTY3N3lKWENJc1hHNGdJQ0FnYVc1MGNtODZJRnRjSWpJd01UTGx1YlRsaXFEbm01OHpOakR2dkl6bGlZM21uSi9uaTZ6bnE0dm90Si9vdEtQb3Y1am1tSy9rdjUzbHI0YnBvYm5ubTY3bm1vVG1sYlRrdUtybm1iN25wNUhsaVkzbnE2L2x1YmJvdXF2bGhiemt1cWZsazRIbnU0L25rSWJqZ0lIbGtJN251NjNrdUx2bWxMdm5tYjducDVIbnZKYm92cEhsbWFqdnZJenBnNmpsaUlibGlwL29nNzNvb3F2bm1iN2x1cWJsa296a3VwTGxpcWpubWI3bnA1SG1pb1Rvb3EzbGdKL3BpYlRqZ0lMa3VLVGxrYWpsaG9Ya3VJcm51ci9ucDd2bGlxam5pWWpubWI3bnA1SHZ2SXpsalkvb3NJUGxwSVRua0libGtJVG5qcS9vaW9McGw2N3BvcGp2dkl6bHViVGx1cFhvanJmbHZwZmt2SmpucDREbGtaamx0NlhsajRyb2dxSG5wYWpscFpibGlySHZ2SXpwbW8vbGtJN2t1NDdubWI3bnA1SGt1SnJsaXFIcGc2anBsNmpsdWJibGhhVXpOakRtbklEbHBLZm5tb1RsaVkzbnE2L21pb0RtbksvbG02THBtSjh0VjBWQzVibXo1WSt3NllPb0wrV2xoK2lJbnVXYm91T0FnbHdpTENCY0lqSXdNVFRsdWJUbXRMN3BxYnZscm9ubGhhamxqYXZsbzZ2cGc2anBsNmpvdEovb3RLTXpOakRscm9ubGhhamxqYXZsbzZ0V1NWRGt2SnJsa1pqa3VLM2x2NFB2dkl6bGlKdnBnS0Rtbkt6bG5MQmtaV0oxWitXOGdPV1BrZWFvb2VXOGorKzhqT1c5dStXNmxlaUVzZWVtdStlZ2xPV1BrZWVPcitXaWcrV3Z1ZVd1b3VhSXQrZXJyK2VhaE9TK25laTFsdSs4ak9XaW51V0tvT2U2ditTNGl1UzRnT21VcnVXOGdPV1FyMlJsWW5Wbjc3eU01YityNllDZjVhNmE1TDJONlpldTZhS1k3N3lNNWFTbjVhU241bytRNmF1WTVhNmk1b2kzNTZ1djVZYUY1YldNVjBWQzU1cUU1NkNVNVkrUjVwV0k1NDZINDRDQzVaQ001cGUyNVkyUDZMQ0Q1cFN2NW95QjViNnU1YStHNzd5STVZYUY1YldNZDJWaTc3eUo0NENCNW9LRTVvS0VLT1dHaGVXMWpIZGxZaW5qZ0lIbWlZdm1uTHJsamF2bG82c281clM3NVlxb0tlT0FnZWExZ2VtSGorV05xK1dqcSsrOGlPV3VtT2U5a2UrOGllT0FnZVdGamVpMHVYZHBabW52dklqbHJwam52Wkh2dkluamdJSG5ncm5ublp2bHViUGxqN0R2dklqbHJwam52Wkh2dkluamdJSGt2WlBwcW96a3VLM2x2NFB2dklqbHJwam52Wkh2dklubnJZbnBvYm5ubTY3amdJSmNJaXdnWENJeU1ERTE1Ym0wNVlpZDZMQ0Q1WVdsNklDQjVaR281YmltNmFLRzU1cUU1cG02NklPOTU2R3M1THUyNllPbzZaZW83N3lNNVltTjVweWY1NHVzNTZ1TDZMU2Y2TFNqTXpZdzU2eXM1TGlBNUxpcTU1dTA1cEt0NmFHNTU1dXU1YkNQNXJDMDVydTA1NXUwNXBLdDU3MlI1NnVaNTVxRTVwQ3Q1YnU2NTZDVTVZK1I0NENCWVhCdzVZYUY1YldNU0RYamdJSGxsWWJsbjQ3bHJwam52WkhubW9UbGtJVG5wNDNsa0lqa3ZaemxqNUhsbEs3bXRMdmxpcWpsaVkzbnE2L21pb0RtbksvbWxLL21qSUhqZ0lMbGtJN251NjNsalkvbGlxbmx2SURsajVFek5qWXpUV25uanFuamdJSG1ncC9ucWJwVVZ1T0FnZWE0dU9hSWorV0doZVcxak9lbmdPV2N1dVM3cGVXUGl1aUtzZWFra3VlYnRPYVNyZU9BZ2VlR2l1ZU1xMVJXNDRDQjU2Mko1NXUwNXBLdDZhRzU1NXV1NDRDQ1hDSmRMRnh1SUNBZ0lHZHlZV1JsT2lCYlhDTGt1THZvcG9Ia3VKcm51Nm52dkpwY0lpd2dYQ0l6TmpEbWtKem50S0xubWI3bnA1SG1sYlRrdUtybGlZM25xNi9vcDRUbGlKTGpnSUhtbm9UbHU3b281NGVWNWJDKzVweU5LZU9BZ2VlWnZ1ZW5rZWU4bHVpK2tlV1pxQ2gxWldScGRHOXk1WWFGNXFDNEtlT0FndVM0dStXdnZPV1FqdWVycittRHFPV0lobEJJVU9hb29lV2RsK2FlaE9XN3Vpam5tN2psaGJQb3I0M21uYUhqZ0lIb3I0M21uYUhsdkpYbmxLam1xS0hsblpjcDQ0Q0I1WWFGNWE2NTZJNjM1WStXS0hCb2NGRjFaWEo1S2VPQWdlZThsdWkra2VXWnFPV1BpdVdHaGVXdXVlV2toT2VRaGlob2RHMXNVSFZ5YVdacFpYSXA3N3lNNVlpRzU3Rzc1N083NTd1ZjQ0Q0I2SWVxNWFxUzVMMlQ1N083NTd1ZjU2MkpYQ0lzSUZ3aTVhNko1WVdvNVkycjVhT3I1THlhNVpHWTVMaXQ1YitENDRDQk16WXdWa2xRNUx5YTVaR1k1NmV2NVlpRzVaV0c1WitPS0ZkcGJtUnZkemprdkpqbWc2RG5vSUhqZ0lIbnZaSG1tSlBtbUk3a3Y2SG5pWWZqZ0lIbWlKSGt1YkRudlpIa3VKYm5sWXptbmEvamdJSGxsSy9sazRIa3ZKcmpnSUhwbW8vb3VxdDNhV1pwTkVmbmlZampnSUhsdlpQbHZaUG52WkhubExYbHJaRGt1YWJqZ0lIcG1MTGt1S0xsamF2bG82c29NUzh5THpNdk5PYWNueW5qZ0lIbHZaUGx2WlBudlpIbW5JM29vNFhqZ0lIbHBLbm5qS3ZubExYbG1hamxuNDdqZ0lIbnZaSG1tSlBvaXJIbmxMRGx1SUhqZ0lIbHBLbm5qS3ZsajR6bGpZSGt1SURqZ0lIbmxMWG9oSkhrdUpQbHJyYm90b1hudXFmcG9vVG51cWJqZ0lIbW5JbnBnWlBsajR6cGg0M25wTHpsaklYamdJSGx2WlBsdlpQbnZaSGxqNHpsallIa3Vvem10THZsaXFqamdJRXpOakRscm9ubGhham90Ni9ubExIbnJZbmt2SmZscEpybmlibm1uWVBwb2Jubm02NHA0NENDWENJc0lGd2k1YjZ1NWErRzVZYUY1YldNNmFHMTQ0Q0I1b0tFNW9LRTVZYUY1YldNNmFHMTQ0Q0I1b21MNXB5NjVZMnI1YU9yNXJTNzVZcW80NENCNXJXQjZZZVA1WTJyNWFPcjVhNlk1NzJSNDRDQjVZV042TFM1ZDJsbWFlV3VtT2U5a2VPQWdlZUN1ZWVkbStXNXMrV1BzT1dKamVlcnIrT0FnZVM5ayttcWpPUzRyZVcvZytXRnFPZXJtZU9BZ2x3aUxDQmNJdWFadXVpRHZlYVJoT1dEaithY3V1bWh1ZWVicnVlYWhPV1ZodVdmanVXdW1PZTlrZU9BZ2VXd2orYXd0T2E3dE9lYnRPYVNyZVdGcU9lcm1lKzhpT1drbXVlN2lPZXJyM2RsWXUrOGllT0FnVUZRVU9XR2hlVzFqRWcxNDRDQjZJcXg1cVNTNTV1MDVwS3Q1cEt0NXBTKzVabW9MK2lCaXVXa3FlbVZ2K2kvbnVPQWdUTTJOak5OYWVlT3FlV0ZxT2VybWVhZWhPVzd1aS9wZ0lIbnBMem5zN3ZudTUvamdJSG5yWW5wb2Jubm02N25tb1JRUStXUGlrZzE1NzJSNTZ1WjVwNjI1cDZFNDRDQjZhRzU1NXV1NVkyUDZMQ0Q1WktNNTZDVTVZK1I0NENDWENKZFhHNTlMQ0I3WEc0Z0lDQWdkR2wwYkdVNklGd2lNakF3TjM0eU1ERXlYQ0lzWEc0Z0lDQWdZMjl0Y0c5dWVUb2dYQ0xsakpma3Vxem9pYjducDVIbnZaSGt2NkhtbklucG1aRGxoYXpsajdqdnZJamxrSXptbHJubmxMWGxyWkRtbDVma3VJdnZ2SWxjSWl4Y2JpQWdJQ0JwYm5SeWJ6b2dXMXdpTWpBd04rVzV0T1d3c2VpQmpPUzZqdVdRak9hV3VlZVV0ZVd0a09hWGwrUzRpK2FMcGVhY2llV0dtK1czcGVXdWllV0ZxT2kxaE9pMHFPZWFoT2U5a2VlN25PaTlyK1M3dHVXRnJPV1B1Tys4ak9XSmplYWNuK2l1dnVpdW9lT0FnZVdKamVlcnIrT0FnZWFjamVXS29lZXJyeWhRU0ZBcDVMaUE1THE2NVlXbzVZeUY0NENDWENJc0lGd2k1WkNPNTd1dDViaW02YUtHNks2KzZLNmg1YmlJNDRDQjVZbU41NnV2NDRDQlVFaFE3N3lNNUxpTzVaQ081NnV2Nzd5SVEraXZyZWlvZ08rOGllYUtnT2FjcitlN2orZVFodVdOaitpd2crV0Z0dVM3bGtQb3I2M29xSURsa296bHJxTG1pTGZucTYvbHQ2WG5xSXZsdUlqdnZJemxqWS9saXFsRFZFL2xycDduanJEbHViYmxyb3psbG9UbW5JRG51NGhYUlVMbHNaWG5qckRsa296a3VxVGt1cExsaXAvb2c3M2pnSUxsajRMa3VJN2xrSTdudTYza3VxZmxrNEhtdFl2b3I1WGpnSUhsajVIbmlZampnSUhtanFYbWxMYm1sTG5vdjV2bmxLam1pTGZtbHJubGo0M3Bwb2p2dkl6a3ZiL25sS2ptbklucG1aRG5tb1RvdFlUbXVwRGx2SURsajVIbnU3VG1pcVEzNUxpcTVMcW41Wk9CNTdxLzQ0Q0NYQ0lzSUZ3aTVMaWE1TDJaNWErNTU3MlI1NnVaNWJ1NjZLNis1WStLNkwrUTZKQ2w1cHlKNWI2STZhdVk1NXFFNVlXMDZJZTA3N3lNNXB1KzU0dXM1NnVMNWJ1NjZZQ2c2TCtRNkpDbDVwV3c1TGlxNTcyUjU2dVo3N3lNNWJtMjViQ0c1YnlBNXJxUTU3Tzc1N3VmNW9pUTU0YWY1NXFFNVlhRjZZT281WXFmNklPOTVxaWg1WjJYNUxxTTVxeWg1YnlBNVkrUjVMMk81b2lRNXB5czVicVU1NVNvNUxxTzViZWw1TDJjNmFHNTU1dXU1TGl0NDRDQ1hDSmRMRnh1SUNBZ0lHZHlZV1JsT2lCYlhDTGt1THZvcG9Ia3VKcm51Nm52dkpwY0lpd2dYQ0xscnA3bGtJM2xoNGJsaGFYbWpxZmxpTGJ2dkl6bnU0am5xNi9sZ2FYbHVyZm1vNERtbjZYdnZJemxycDdsa0kzbGlMWkpVT1djc09XZGdPZXVvZWVRaHUrOGpPYWRwZVd1dnVpdXYrV3VvdWU5a2UrOGpPbWRudWF6bGVXa2x1aUJsT1dQaXVlOWtlZTduT1dvZ2VpRGdlV3VtdVM5amUrOGpPZTlrZWU3bk9pdXYrbVhydWFPcCtXSXR1KzhqT21ybU9hQXAraUR2ZWFYcGVXL2wrV3RtT1dDcU9XU2pPV3VvZWl1b2VPQWdsd2lYVnh1ZlN3Z2UxeHVJQ0FnSUhScGRHeGxPaUJjSWpJd01EUitNakF3TjF3aUxGeHVJQ0FnSUdOdmJYQnZibms2SUZ3aTVyaUY1WTJPNWFTbjVhMm01WWU2NTRtSTU2Uys3N3lJNTZ5czVZV3Q1THFMNUxpYTZZT283N3lKTHlEbGlKdmt1SnBjSWl4Y2JpQWdJQ0JwYm5SeWJ6b2dXMXdpTWpBd05PVzV0T2F2bGVTNG11aS9tK1dGcGVXTWwrUzZyT2E0aGVXTmp1V2twK1d0cHVXSHV1ZUppT2VrdnVlc3JPV0ZyZVM2aStTNG11bURxT1dCbXVlOWtlZXJtZWVnbE9XUGtlKzhqT21jZ09heGd1T0FnZWl1dnVpdW9TaFFVeW5qZ0lGR2JHRnphT1dLcU9lVXUrT0FnZVdKamVlcnJ5aG9kRzFzTDJOemN5OXFjeW5qZ0lIbW5JM2xpcUhucTY4b1FWTlFLZU9BZ2VhVnNPYU5ydVc2a3loVFVVeFRaWEoyWlhJcDQ0Q0I1cldMNksrVjQ0Q0I1TGlBNUxxNjVZV281WXlGNDRDQ1hDSXNJRndpNUxpNzZLYUI1TGlhNTd1cDc3eWE1cmlGNVkyTzVZZTY1NG1JNTZTKzU2eXM1WVd0NUxxTDVMaWE2WU9vNWE2WTVwYTU1NzJSNTZ1Wjc3eU01YnlBNVkrUjVwYXc1TG1tNDRDQjU1V0Y2WlNBNUxtbTQ0Q0I1N0srNVpPQjVadSs1TG1tNWJHVjU2UzY1WktNNVp5bzU3cS82SzZpNkxTdDc3eU01WnUrNUxtbTU1dTQ1WVd6NkxXRTVwYVo1TGlMNkwyOTc3eU01WktNNksrNzZJQ0Y1NVdaNktpQTU2Mko1WXFmNklPOTVxaWg1WjJYWENKZExGeHVJQ0FnSUdkeVlXUmxPaUJiWENJeU1EQTE1Ym0wNkw2ZTVvNko1YmVsNUwyYzVvNmw1WTJWNVlHYTU3MlI1NnVaNXBDZTRvQ2M1WWliNUxpYTRvQ2Q0NENDWENJc0lGd2k1NHVzNTZ1TDVieUE1WStSNzd5YVMyRnlkR1ZzYkNqbWhJL2xwS2ZsaUtua3VKYm5sWXpwb2JibnVxZmxycmJsaGJmbGs0SG5pWXdwNVl5WDVMcXM1YTZZNXBhNTU3MlI1NnVaNzd5TTVZeVg1THFzNlllUjVyaXY1ckc5NkwybTVZV3M1WnV0NkxhRjZMZVI1N0srNkl1eDVMeWE1YTZZNXBhNTU3MlI1NnVaNzd5TTVZeVg1THFzNTVhdjU0dUM2SXV4NksrdDVaKzU2SzZ0NUxpdDViK0Q1YTZZNXBhNTU3MlI1NnVaNDRDQjVaeW81N3EvNW9xbDVaQ041N083NTd1ZjQ0Q0I1WStLNVlXbzVadTk1bzZJNXAyRDU0SzU1THFTNVlxbzVMcWs1cldCNWJtejVZK3c3N3lNNVpTdjVyT3c1WStrNVlXNDVhNjI1WVczNTcyUjc3eU01NGl4NTc2T016Ym9ycUhsakpibHBvYmxrNEhsbFlibG40N3Z2SXhEWVhKaVlYTmw1ckc5NkwybTVwU3Y1byswNXB5TjVZcWg1NzJSNVkrSzZLNjY1WjJiNzd5TTVyaUY1cldCNkwrRktITjBjbVZoYlc5alpXRnVLZWVVdGVpbmh1YWN1dW1odHVlYmt1aW5odW1pa2VlenUrZTduKys4ak9XUGl1V0Z0dVd1ZytXa3ArV3dqK1M4Z2VTNG11ZTlrZWVybVRNdzVhU2E1TGlxWENJc0lGd2k1WkNNNXBlMjVieUE1WStSNkwrUTZKQ2w3N3lhNWJ5QTViK0Q2SXV4NksrdDVhMm01TG1nNTcyUjc3eU01NStsNWJleDU3MlI1N3VjNW9xQTVweXY1TCtoNW9HdjU3MlI3N3lNNks2NjVwYUg1cENjNTdTaTVaKzY1Wnl3Nzd5TTZaMmU1Ymk0UjI5dlpPZXl2dVdUZ2VlOWtlV2RnT1d2dk9pSXF1KzhqT21kbnVXNHVFZHZiMlRvcnFIbnJwZm1uTHJtbFpubnFJdm52WkhucllubG43cmt1bzdsdklEbXVwRG5zN3ZudTUvbm1vVGt1S3JrdXJybnZaSG5xNW5qZ0lKY0lsMWNibjFkTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlIdGNiaUFnSUNBdktseHVJQ0FnSU9pT3QrV1BsdWFnaCttaW1PV0lsK2locUZ4dUlDQWdJQ0FxTDF4dUlDQWdJR2RsZEV4cGMzUlVhWFJzWlRvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCMGFYUnNaVXhwYzNRZ1BTQmJYVHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRkV1VUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHcHBibWRzYVVSaGRHRXViV0Z3S0daMWJtTjBhVzl1S0dsMFpXMHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwYVhSc1pVeHBjM1F1Y0hWemFDaHBkR1Z0TG5ScGRHeGxLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVnpiMngyWlNoMGFYUnNaVXhwYzNRcE8xeHVJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdMeXBjYmlBZ0lDRG9qcmZsajVibWlZRG1uSW5saUpmb29haGNiaUFnSUNBZ0tpOWNiaUFnSUNCblpYUk1hWE4wUVd4c09pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRkV1VUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHcHBibWRzYVVSaGRHRXViV0Z3S0daMWJtTjBhVzl1S0dsMFpXMHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdExuUjVjR1VnUFNCcGRHVnRMblJwZEd4bExuTndiR2wwS0NkK0p5bGJNRjA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZ6YjJ4MlpTaHFhVzVuYkdsRVlYUmhLVHRjYmlBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnZlZ4dWZUdGNiaUlzSW5aaGNpQjNiM0pyU1c1bWJ5QTlJSHRjYmlBZ0lDQmtZWFJoT2lCYmUxeHVJQ0FnSUNBZ0lDQnBaRG9nWENKcWFXRndZMXdpTEZ4dUlDQWdJQ0FnSUNCMGVYQmxPaUJjSWpJd01USmNJaXhjYmlBZ0lDQWdJQ0FnYm1GdFpUb2dYQ0xsc0kvbXNMVG11N1RubTdUbWtxMVFRK2VKaUZ3aUxGeHVJQ0FnSUNBZ0lDQjFjbXc2SUZ3aWFIUjBjRG92TDJwcFlTNHpOakF1WTI0dmNHTmNJaXhjYmlBZ0lDQWdJQ0FnWkdWell6b2dYQ0l6TmpEbnJLemt1SURrdUtybm03VG1rcTNwb2Jubm02N3Z2SXpsaVkzbW5KL25pNnpucTR2bHZJRGxqNUhvdEovb3RLUGxoYWpucTVubGlwL29nNzNtcUtIbG5aZm1ub1RsdTdydnZJemxqWS9vc0lQbHBJVG5rSWJsa0lUbmpxL29pb0xtdFlIbnFJdnZ2SWpvdjVEb2tLWGpnSUZRVGVPQWdlYWNqZVdLb2VlcnIrYU9wZVdQbytXSXR1V3VtdU9BZ2VhMWkraXZsZU9BZ2VXUGplbW1pT2V0aWUrOGllT0FndVM5ditlVXFPYUtnT2FjcisrOG1uTmxkMmx6WlZCc1lYbGxjdU9BZ1hOdlkydHFjK09BZ1VWdGIycHA0NENCWm14bGVITnNhV1JsY3VPQWdXcFJkV1Z5ZVMxc1lYcDViRzloWk9PQWdXcFJkV1Z5ZVMxMGJYQnM1NjJKNTd1RTVMdTJYQ0lzWEc0Z0lDQWdJQ0FnSUdOdmRtVnlPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZhbWxoY0dNdlkyOTJaWEl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdiR2x6ZERvZ1czdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwycHBZWEJqTHpBeExtcHdaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW41NXUwNXBLdDZhYVc2YUcxSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXFhV0Z3WXk4d01pNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKK2VidE9hU3JlbWlrZW1Ca3lkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZhbWxoY0dNdk1ETXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2Zta3EzbWxMN3BvYlVuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwycHBZWEJqTHpBMExuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW41NXUwNXBLdDZhS0U1WkdLSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXFhV0Z3WXk4d05TNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKK1M0cXVTNnV1YVJoT1dEaithY3V1ZTlrZW1odGVlSmlDZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YW1saGNHTXZkREF4TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbjZLNi82WmV1NTd1ZjZLNmhKMXh1SUNBZ0lDQWdJQ0I5WFZ4dUlDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZJRndpYW1saGJXOWlhV3hsWENJc1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aU1qQXhNbHdpTEZ4dUlDQWdJQ0FnSUNCdVlXMWxPaUJjSXVXd2orYXd0T2E3dE9lYnRPYVNyZWVudStXS3FPZUppRndpTEZ4dUlDQWdJQ0FnSUNCMWNtdzZJRndpYUhSMGNEb3ZMMnBwWVM0ek5qQXVZMjR2Ylc5aWFXeGxYQ0lzWEc0Z0lDQWdJQ0FnSUdSbGMyTTZJRndpNUwyLzU1U281b3FBNXB5djc3eWFhRFhubW9SMmFXUmxiK09BZ1VWdGIycHA0NENCWVhKMExYUmxiWEJzWVhSbDQ0Q0JhWE5qY205c2JPT0FnWGRsWW5Wd2JHOWhaR1Z5NDRDQmMyOWphMnB6NDRDQmVtVndkRzhvNVpDTzU3dXQ1cFM1NUxpNmFuRjFaWEo1S1Z3aUxGeHVJQ0FnSUNBZ0lDQmpiM1psY2pvZ1hDSXVMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cWFXRnRiMkpwYkdVdlkyOTJaWEl1YW5CblhDSXNYRzRnSUNBZ0lDQWdJR3hwYzNRNklGdDdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXFhV0Z0YjJKcGJHVXZNREV1YW5Cbkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMnBwWVcxdlltbHNaUzh3TWk1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YW1saGJXOWlhV3hsTHpBekxtcHdaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cWFXRnRiMkpwYkdVdk1EUXVhbkJuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwycHBZVzF2WW1sc1pTOTBNREV1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNmb3JyL3BsNjdudTUvb3JxRW5YRzRnSUNBZ0lDQWdJSDFkWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCcFpEb2dYQ0ppWVdsclpUTTJNSEJqWENJc1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aU1qQXhNbHdpTEZ4dUlDQWdJQ0FnSUNCdVlXMWxPaUJjSWpNMk1PZVp2dWVua1ZCRDU0bUlYQ0lzWEc0Z0lDQWdJQ0FnSUhWeWJEb2dYQ0pvZEhSd09pOHZZbUZwYTJVdWMyOHVZMjl0WENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aTVZbU41cHlmNTR1czU2dUw2TFNmNkxTajVZV281NnVaNVltTjU2dXY2S2VFNVlpUzQ0Q0I1cDZFNWJ1NjQ0Q0I1NW0rNTZlUjU3eVc2TDZSNVptbzQ0Q0M1TGk3NWErODVaQ081NnV2VUVoUTZZT281WWlHNXFpaDVaMlg1cDZFNWJ1NktPZWJ1T1dGcytpdmplYWRvZU9BZ2VpdmplYWRvZVc4bGVlVXFPYW9vZVdkbHluamdJSGxob1hscnJub2pyZmxqNVlvY0dod1VYVmxjbmtwNDRDQjVZYUY1YTY1NWFTRTU1Q0dLR2gwYld4UWRYSnBabWxsY2ludnZJemxpSWJuc2J2bnM3dm51NS9qZ0lIb2g2cmxxcExrdlpQbnM3dm51NS9uclluamdJTGt2Yi9ubEtqbWlvRG1uSy92dkpwMVpXUnBkRzl5NDRDQmMyMWhjblI1NDRDQmFHbG5hSE5zYVdSbGN1T0FnV0Z5ZEMxa2FXRnNiMmZqZ0lGa1lYUmxjR2xqYTJWeTQ0Q0JhbEYxWlhKNUxXTnZiMnRwWmVPQWdXcHpiMjR5NTYySjU3dUU1YnU2WENJc1hHNGdJQ0FnSUNBZ0lHTnZkbVZ5T2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVXpOakJ3WXk5amIzWmxjaTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQnNhWE4wT2lCYmUxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlV6TmpCd1l5OHdNUzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJVek5qQndZeTh3TWk1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVXpOakJ3WXk4d015NXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlV6TmpCd1l5OHdOQzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJVek5qQndZeTh3TlM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVXpOakJ3WXk4d05pNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlV6TmpCd1l5OTBNREV1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNmb3JyL3BsNjdudTUvb3JxRW5YRzRnSUNBZ0lDQWdJSDFkWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCcFpEb2dYQ0ppWVdsclpUTTJNRzF2WW1sc1pWd2lMRnh1SUNBZ0lDQWdJQ0IwZVhCbE9pQmNJakl3TVRKY0lpeGNiaUFnSUNBZ0lDQWdibUZ0WlRvZ1hDSXpOakRubWI3bnA1SG5wN3ZsaXFqbmlZaGNJaXhjYmlBZ0lDQWdJQ0FnZFhKc09pQmNJbWgwZEhBNkx5OXRMbUpoYVd0bExuTnZMbU52YlZ3aUxGeHVJQ0FnSUNBZ0lDQmtaWE5qT2lCY0l1V0pqZWFjbitlTHJPZXJpK1c4Z09XUGtlKzhqT2Vzck9TNGdPYWNuKys4bXVXT2h1YVh0dVM0Z09XUnFPKzhpT1dKamVXUWp1ZXJyK2FWdE9TOWsrYWVoT1c3dXUrOGllKzhtK2Vzck9TNmpPYWNuKys4bXVXT2h1YVh0dVM0cE9XUnFPKzhqT1drcCttSGorUzhtT1dNbHVPQWdlZWJydVc5bGVPQWdXeGhlbmxzYjJGazQ0Q0I1cHlKNXBlZzVadSs1cWloNWJ5UDQ0Q0I1YTJYNUwyVDZMQ0Q1cFcwNDRDQjVwZWw1YVNjNXFpaDVieVA0NENDNTZ5czVMaUo1cHlmNzd5YTVZK042YWFJNVlxZjZJTzk0NENCNVlxZjZJTzk1YnlWNWErODVvK1E1NlM2NDRDQmMzVm5aMlZ6ZE9PQWdlV2J2dVdHak9hMWoraW5pT2V0aWVPQWd1Uzl2K2VVcUhwbGNIUnY0NENCYVhOamNtOXNiT2V0aWVlN2hPUzd0dU9BZ2x3aUxGeHVJQ0FnSUNBZ0lDQmpiM1psY2pvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJKaGFXdGxNell3Ylc5aWFXeGxMMk52ZG1WeUxtcHdaeWNzWEc0Z0lDQWdJQ0FnSUd4cGMzUTZJRnQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlpWVdsclpUTTJNRzF2WW1sc1pTOHdNUzVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJVek5qQnRiMkpwYkdVdk1ESXVhbkJuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwySmhhV3RsTXpZd2JXOWlhV3hsTHpBekxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5aVlXbHJaVE0yTUcxdlltbHNaUzh3TkM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVXpOakJ0YjJKcGJHVXZNRFV1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMWRYRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0JwWkRvZ1hDSjFjMlZ5UTJWdWRHVnlYQ0lzWEc0Z0lDQWdJQ0FnSUhSNWNHVTZJRndpTWpBeE1sd2lMRnh1SUNBZ0lDQWdJQ0J1WVcxbE9pQmNJdVd1aWVXRnFPV05xK1dqcStTOG11V1JtT1M0cmVXL2cxd2lMRnh1SUNBZ0lDQWdJQ0JrWlhOak9pQmNJdVdJbSttQW9PYWNyT1djc0dSbFluVm41YnlBNVkrUjVxaWg1YnlQNzd5TTViMjc1YnFWNklTeDU2YTc1NkNVNVkrUjU0NnY1YUtENWErNTVhNmk1b2kzNTZ1djU1cUU1TDZkNkxXVzc3eU01YUtlNVlxZzU3cS81TGlLNUxpQTZaU3U1YnlBNVpDdlpHVmlkV2Z2dkl6bHY2dnBnSi9scnBya3ZZM3BsNjdwb3BqdnZJemxwS2ZscEtmbWo1RHBxNWpscnFMbWlMZm5xNi9saG9YbHRZeFhSVUxubW9Ubm9KVGxqNUhtbFlqbmpvZmpnSUxrdUx2b3BvSG1pb0RtbksvdnZKcFJkM0poY09PQWdWRjNjbUZ3TFhCeWIyMXBjMlhqZ0lGUmQzSmhjQzFzWVhwNWJHOWhaT09BZ1ZGM2NtRndMV2hoYzJndGFHbHpkSEp2ZWVPQWdWRjNjbUZ3TFhOamNtOXNiQzFpWVhMamdJRlJkM0poY0Mxa1lYUmhUVzlrWVd6bnJZbm1xS0hsblpmamdJSmNJaXhjYmlBZ0lDQWdJQ0FnYkdsemREb2dXM3RjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMM1ZqWlc1MFpYSXpOakF2TURFdWFuQm5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY3pOakRrdkpybGtaamt1SzNsdjRQcHBwYnBvYlVuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwzVmpaVzUwWlhJek5qQXZNREl1YW5Cbkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjek5qRGt2SnJsa1pqa3VLM2x2NFBsZ1pya3U3dmxpcUVuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwzVmpaVzUwWlhJek5qQXZNRE11YW5Cbkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjek5qRGt2SnJsa1pqa3VLM2x2NFBwb29ibmlibm1uWU1uWEc0Z0lDQWdJQ0FnSUgxZFhHNGdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQnBaRG9nWENKMmFYQXpOakJjSWl4Y2JpQWdJQ0FnSUNBZ2RIbHdaVG9nWENJeU1ERXlYQ0lzWEc0Z0lDQWdJQ0FnSUc1aGJXVTZJRndpTXpZdzVMeWE1WkdZNVpXRzVaK09YQ0lzWEc0Z0lDQWdJQ0FnSUhWeWJEb2dYQ0pvZEhSd09pOHZkbWx3TGpNMk1DNWpiaTl0WVd4c0wxd2lMRnh1SUNBZ0lDQWdJQ0JrWlhOak9pQmNJdVdGcU9lcm1lV2Z1dVM2am1KdmIzUnpkSEpoY09TNmpPYXNvZVc4Z09XUGtlT0FnbXBSZFdWeWVTMTBiWEJzNDRDQmFsRjFaWEo1TFdOdmIydHBaZWV0aWVlN2hPUzd0bHdpTEZ4dUlDQWdJQ0FnSUNCamIzWmxjam9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMM1pwY0RNMk1DOWpiM1psY2k1d2JtY25MRnh1SUNBZ0lDQWdJQ0JzYVhOME9pQmJlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZkbWx3TXpZd0x6QXhMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OTJhWEF6TmpBdk1ESXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgxZFhHNGdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQnBaRG9nWENKdGFYZGhiak0yTmpOY0lpeGNiaUFnSUNBZ0lDQWdkSGx3WlRvZ1hDSXlNREV5WENJc1hHNGdJQ0FnSUNBZ0lHNWhiV1U2SUZ3aU16WTJNMDFwNTQ2cDU3Nk81YVd6NTV1MDVwS3RYQ0lzWEc0Z0lDQWdJQ0FnSUhWeWJEb2dYQ0pvZEhSd09pOHZkM2QzTGpNMk5qTXVZMjl0WENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aTU3Nk81YVd6NTV1MDVwS3Q0NENCNllDQjU2Uzg3N3lNNVorNjVMcU9aM1ZzY09pSHF1V0txT1dNbHVXM3BlUzluT2ExZ2VPQWdXSnliM2R6WlhKcFpubm51NFRudTRkamIyMXRiMjVxYythZ2grV0hodWVhaEc1dlpHVnFjK1M3bytlZ2dlV2NxT2ExaitpbmlPV1pxT2kva09paGpPT0FnZVdJaHVXeGd1aW5oT1dJa3Vhb29lV2RsK1c4aithZWhPVzd1dSs4aU9hY2plV0tvZVd4Z3VPQWdlYW9vZVdkbCtXeGd1KzhpZSs4akZCeWIyMXBjMlhsdklMbXJhWG52SmJucUl0Y0lpeGNiaUFnSUNBZ0lDQWdZMjkyWlhJNklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5dGFYZGhiak0yTmpNdlkyOTJaWEl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdiR2x6ZERvZ1czdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyMXBkMkZ1TXpZMk15OHdNUzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZiV2wzWVc0ek5qWXpMekF5TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlYVnh1SUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnYVdRNklGd2lOV3R2Ym1kMGRsd2lMRnh1SUNBZ0lDQWdJQ0IwZVhCbE9pQmNJakl3TVRKY0lpeGNiaUFnSUNBZ0lDQWdibUZ0WlRvZ1hDTG1ncC9ucWJwVVZ1YTR1T2FJaitlYnRPYVNyVndpTEZ4dUlDQWdJQ0FnSUNCMWNtdzZJRndpYUhSMGNEb3ZMM2QzZHk0MWEyOXVaeTUwZGx3aUxGeHVJQ0FnSUNBZ0lDQmtaWE5qT2lCY0l1YTR1T2FJaitlYnRPYVNyZU9BZ2VtQWdlZWt2T09BZ3VXZnV1UzZqbWQxYkhEb2g2cmxpcWpsakpibHQ2WGt2WnptdFlIamdJRmljbTkzYzJWeWFXWjU1N3VFNTd1SFkyOXRiVzl1YW5QbW9JZmxoNGJubW9SdWIyUmxhblBrdTZQbm9JSGxuS2ptdFkvb3A0amxtYWpvdjVEb29ZempnSUhsaUlibHNZTG9wNFRsaUpMbXFLSGxuWmZsdkkvbW5vVGx1N3J2dklqbW5JM2xpcUhsc1lMamdJSG1xS0hsblpmbHNZTHZ2SW52dkl4UWNtOXRhWE5sNWJ5QzVxMmw1N3lXNTZpTFhDSXNYRzRnSUNBZ0lDQWdJR052ZG1WeU9pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdk5XdHZibWQwZGk5amIzWmxjaTVxY0djbkxGeHVJQ0FnSUNBZ0lDQnNhWE4wT2lCYmUxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdk5XdHZibWQwZGk4d01TNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdk5XdHZibWQwZGk4d01pNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlYxY2JpQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lHbGtPaUJjSW1sa2JtRmpYQ0lzWEc0Z0lDQWdJQ0FnSUhSNWNHVTZJRndpTWpBd04xd2lMRnh1SUNBZ0lDQWdJQ0J1WVcxbE9pQmNJdVd1bnVXUWplV0l0a2xFNTcyUjU3dWM1NjZoNTVDRzU3Tzc1N3VmWENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aTVicVY1YkdDNUwyLzU1U29RK2l2cmVpb2dPUzRqdWVock9TN3R1UzZwT1M2a3VPQWdWQklVT1M5bk9TNHV1UzRyZW1YdE9XeGd1V3VudWVPc09TNG11V0tvZW1BdStpK2tlT0FndVdKamVhY24rZUxyT2VyaStpMG4raTBvK2l1dnVpdW9lT0FnZVdKamVlcnIrT0FnVkJJVU9XeGd1ZWFoT1dRaE9hb29lV2RsK2FlaE9XN3V1T0FnbHdpTEZ4dUlDQWdJQ0FnSUNCamIzWmxjam9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMmxrYm1GakwyTnZkbVZ5TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJR3hwYzNRNklGdDdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXBaRzVoWXk4d01TNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmFXUnVZV012TURJdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJsa2JtRmpMekF6TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlwWkc1aFl5OHdOQzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZhV1J1WVdNdk1EVXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwybGtibUZqTHpBMkxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cFpHNWhZeTh3Tnk1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YVdSdVlXTXZNRGd1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMWRYRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0JwWkRvZ1hDSnBaSGRoYkd4Y0lpeGNiaUFnSUNBZ0lDQWdkSGx3WlRvZ1hDSXlNREEzWENJc1hHNGdJQ0FnSUNBZ0lHNWhiV1U2SUZ3aVNVUlhZV3hzNVllRzVZV2w2Wml5NTRHcjVhS1pYQ0lzWEc0Z0lDQWdJQ0FnSUdSbGMyTTZJRndpNVorNjVMcU9TVVJPWVdQb280SGxpYXJsdklEbGo1SHZ2SXpsaVkzbW5KL25pNnpucTR2bW5vVGx1N3JqZ0lKSlJGZGhiR3ptbUsva3VKUGt1THJrdjUzbWlxVGxob1hudlpIb3RZVG11cERvZ0l6b3JyN29ycUhubW9UbGg0YmxoYVhwbUxMbmdhdmxvcG5qZ0lMbHJvUG1tSy9rdUpibmxZemt1SXJwcHBibXJMN21sSy9taklIbHJwN2xrSTNsaUxaSlJPZTlrZWU3bk9hS2dPYWNyK2VhaE9PQWdlV0Z0K2FjaWVXSGh1V0ZwZWFPcCtXSXR1V0tuK2lEdmVlYWhPbVlzdWVCcStXaW1lT0FndWFjaWVXSXErUzZqdVM4b09lN24rZWFoT21Zc3VlQnErV2ltZSs4akVsRVYyRnNiT1d1bnVlT3NPUzZodVd1aWVXRnFPV2ZuK2VhaE9ldW9lZVFodSs4ak9lc3B1V1FpT1didmVXdXR1V3VpZVdGcU9hemxlaW5oT1M0cmVpbWdlYXhndWVhaE9lOWtlZTduT2kxaE9hNmtPVy9oZW1odStXSWh1V011dVdJaHVXZm4rT0FnZVM0cGVlbWdlUzRqZVdRak9ldGllZTZwK2VhaE9XdWllV0ZxT1dmbitTNmt1bUFtdWVhaE9pbmhPV3VtdU9BZ2x3aUxGeHVJQ0FnSUNBZ0lDQmpiM1psY2pvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJsa2QyRnNiQzlqYjNabGNpNXdibWNuTEZ4dUlDQWdJQ0FnSUNCc2FYTjBPaUJiZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YVdSM1lXeHNMekF4TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlwWkhkaGJHd3ZNREl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMmxrZDJGc2JDOHdNeTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZWMWNiaUFnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJR2xrT2lCY0ltWjFlbUZwYW5WdWFHVnVaMXdpTEZ4dUlDQWdJQ0FnSUNCMGVYQmxPaUJjSWpJd01EZGNJaXhjYmlBZ0lDQWdJQ0FnYm1GdFpUb2dYQ0xsbTczbHJyYm5sTFhudlpIb3RKL292YjNsbllmb29hSG5zN3ZudTU5Y0lpeGNiaUFnSUNBZ0lDQWdaR1Z6WXpvZ1hDTGxuN3JrdW81SlJFNWhZK2lqZ2VXSnF1VzhnT1dQa2UrOGpPV0pqZWFjbitlTHJPZXJpK2FlaE9XN3V1T0FnbHdpTEZ4dUlDQWdJQ0FnSUNCamIzWmxjam9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMloxZW1GcGFuVnVhR1Z1Wnk5amIzWmxjaTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQnNhWE4wT2lCYmUxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlpuVjZZV2xxZFc1b1pXNW5MekF4TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTltZFhwaGFXcDFibWhsYm1jdk1ESXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyWjFlbUZwYW5WdWFHVnVaeTh3TXk1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Wm5WNllXbHFkVzVvWlc1bkx6QTBMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOVhWeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdhV1E2SUZ3aVptVnBabUYzWVdsc2FXRnVYQ0lzWEc0Z0lDQWdJQ0FnSUhSNWNHVTZJRndpTWpBd04xd2lMRnh1SUNBZ0lDQWdJQ0J1WVcxbE9pQmNJdVdidmVXdXR1ZVV0ZWU5a2VtZG51YXpsZVdrbHVpQmxPYWpnT2ExaStlenUrZTduMXdpTEZ4dUlDQWdJQ0FnSUNCa1pYTmpPaUJjSXVXZnV1UzZqa2xFVG1GajZLT0I1WW1xNWJ5QTVZK1I3N3lNNVltTjVweWY1NHVzNTZ1TDVwNkU1YnU2NDRDQ1hDSXNYRzRnSUNBZ0lDQWdJR052ZG1WeU9pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlptVnBabUYzWVdsc2FXRnVMMk52ZG1WeUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUd4cGMzUTZJRnQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTltWldsbVlYZGhhV3hwWVc0dk1ERXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyWmxhV1poZDJGcGJHbGhiaTh3TWk1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Wm1WcFptRjNZV2xzYVdGdUx6QXpMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OW1aV2xtWVhkaGFXeHBZVzR2TURRdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDFkWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCcFpEb2dYQ0pyYjI1bmVtaHBkMkZ1WjJkMVlXNWNJaXhjYmlBZ0lDQWdJQ0FnZEhsd1pUb2dYQ0l5TURBM1hDSXNYRzRnSUNBZ0lDQWdJRzVoYldVNklGd2k1WVdzNWE2SjZZT281bzZuNVlpMjU3MlI1WVd6WENJc1hHNGdJQ0FnSUNBZ0lIUnBiV1U2SUZ3aU1qQXhNZVc1dE9TOW5PV1RnVndpTEZ4dUlDQWdJQ0FnSUNCa1pYTmpPaUJjSXVXZnV1UzZqa2xFVG1GajZLT0I1WW1xNWJ5QTVZK1I3N3lNNVltTjVweWY1NHVzNTZ1TDVwNkU1YnU2NDRDQzVMaTY1WVdzNWE2SjZZT282WmVvNVlHYTU1cUU2YUc1NTV1dTc3eU01N3VUNVpDSVNVUk9ZV1BscnA3bmpyRGt1SXZsc1o3bHNwZmt1cTNtanFYbGhhWG51NGpucTYvbm1vVG5tNUhtanFmbGtvem5ycUhua0laY0lpeGNiaUFnSUNBZ0lDQWdZMjkyWlhJNklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cmIyNW5lbWhwZDJGdVoyZDFZVzR2WTI5MlpYSXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ2JHbHpkRG9nVzN0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJ0dmJtZDZhR2wzWVc1blozVmhiaTh3TVM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YTI5dVozcG9hWGRoYm1kbmRXRnVMekF5TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlyYjI1bmVtaHBkMkZ1WjJkMVlXNHZNRE11Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMnR2Ym1kNmFHbDNZVzVuWjNWaGJpOHdOQzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZhMjl1WjNwb2FYZGhibWRuZFdGdUx6QTFMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOVhWeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdhV1E2SUZ3aWFXUnpaVzV6YjNKY0lpeGNiaUFnSUNBZ0lDQWdkSGx3WlRvZ1hDSXlNREEzWENJc1hHNGdJQ0FnSUNBZ0lHNWhiV1U2SUZ3aVNVVG52WkhudTV6bnJxSG5rSWJuczd2bnU1L292NXpucTYva3U2UG5rSVpjSWl4Y2JpQWdJQ0FnSUNBZ2RHbHRaVG9nWENJeU1ERXg1Ym0wNUwyYzVaT0JYQ0lzWEc0Z0lDQWdJQ0FnSUdSbGMyTTZJRndpU1VSVFpXNXpiM0xsajYva3U2WG5tNUhvcDRibGtvem1qcWZsaUxib3Y1em5xNi9saUlibWxLL21uTHJtbm9Ubm1vVG52WkhudTV6dnZJenBoWTNsa0loSlJFNWhZKys4ak9XdW51ZU9zT1dGcU9lOWtlZWFoT2V1b2VhT3ArKzhqT2VocnVTL25lV0ZxT2U5a2VlYWhPZTlrZWU3bk9pK3VlZVZqT2VhaE9XdWpPYVZ0T09BZ3Vpbm8rV0dzK2VVc2VTNmp1ZTlrZWU3bk9XSWh1VzRnK1djc09XZm4rVzV2K09BZ2VTNGplYVlrK2Via2VXdm4rT0FnZVM0amVhWWsrZXVvZWVRaHVlYWhPbVhydW1pbU8rOGpPVzRydVdLcWVlOWtlZXVvZVM2dXVXUm1PV3VudWVPc09pL25PZXJyK1dGcU9lOWtlYU9qT2FPcCtlYWhPbWF2dW1pbU9PQWdsd2lMRnh1SUNBZ0lDQWdJQ0JqYjNabGNqb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwybGtjMlZ1YzI5eUwyTnZkbVZ5TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJR3hwYzNRNklGdDdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXBaSE5sYm5OdmNpOHdNUzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZhV1J6Wlc1emIzSXZNREl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMmxrYzJWdWMyOXlMekF6TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlwWkhObGJuTnZjaTh3TkM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmVjFjYmlBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pQmNJbUZqYTNCeWIycGxZM1JjSWl4Y2JpQWdJQ0FnSUNBZ2RIbHdaVG9nWENJeU1EQTNYQ0lzWEc0Z0lDQWdJQ0FnSUc1aGJXVTZJRndpUVVOTDZhRzU1NXV1NUwyYzVaT0JYQ0lzWEc0Z0lDQWdJQ0FnSUdSbGMyTTZJRndpNVllZzVMaXE2WWVONTRLNTVhNmU1Wnl3NllPbzU3Mnk1NXFFNmFHNTU1dXVYQ0lzWEc0Z0lDQWdJQ0FnSUdOdmRtVnlPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZV05yY0hKdmFtVmpkQzlqYjNabGNpNXFjR2NuTEZ4dUlDQWdJQ0FnSUNCc2FYTjBPaUJiZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WVdOcmNISnZhbVZqZEM4d01TNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdllXTnJjSEp2YW1WamRDOHdNaTVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZV05yY0hKdmFtVmpkQzh3TXk1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WVdOcmNISnZhbVZqZEM4d05DNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdllXTnJjSEp2YW1WamRDOHdOUzVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZV05yY0hKdmFtVmpkQzh3Tmk1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmVjFjYmlBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pQmNJbUZqYTJKaWMxd2lMRnh1SUNBZ0lDQWdJQ0IwZVhCbE9pQmNJakl3TURkY0lpeGNiaUFnSUNBZ0lDQWdibUZ0WlRvZ1hDSkJZMnQzYjNKcmMrUzZwK1dUZ2VhS2dPYWNyK1M2cE9hMWdlaXV1dVdkbTF3aUxGeHVJQ0FnSUNBZ0lDQmtaWE5qT2lCY0l1V2Z1dVM2anVXOGdPYTZrT2V6dStlN24xQklVRmRwYm1UbW5vVGx1N3JqZ0lMa3VMcm5vSlRsajVIamdJSHBsSURsbEs3amdJSGxycUxtaUxmbWo1RGt2cHZvcnFqb3Jycm5qckRsclpqcGw2N3BvcGp2dkl6bWxyRG5tb1RsaXAvb2c3M25vSlRsajVIdnZJem9ycWpvcnJya3VxZmxrNEhubW9UbGo1SGx1SVBtbktyb3A2UGxoclBubW9SQ1ZVZnZ2SXpwbElEbGxLN2t1SzNubW9UcGw2N3BvcGpsdTdyb3JxNWNJaXhjYmlBZ0lDQWdJQ0FnWTI5MlpYSTZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWhZMnRpWW5NdlkyOTJaWEl1YW5Cbkp5eGNiaUFnSUNBZ0lDQWdiR2x6ZERvZ1czdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyRmphMkppY3k4d01TNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdllXTnJZbUp6THpBeUxtcHdaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5aFkydGlZbk12TURNdWFuQm5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJGamEySmljeTh3TkM1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmVjFjYmlBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pQmNJbkZwYm1kb2RXRmNJaXhjYmlBZ0lDQWdJQ0FnZEhsd1pUb2dYQ0l5TURBMFhDSXNYRzRnSUNBZ0lDQWdJRzVoYldVNklGd2k1cmlGNVkyTzVhU241YTJtNVllNjU0bUk1NlMrNTZ5czVZV3Q1THFMNUxpYTZZT29YQ0lzWEc0Z0lDQWdJQ0FnSUhScGJXVTZJRndpTWpBd05DMHlNREExNWJtMDVMMmM1Wk9CWENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aTVZV281cUNJNTR1czU2dUw1YnlBNVkrUjQ0Q0M1cmlGNVkyTzVZZTY1NG1JNTZTKzU2eXM1WVd0NUxxTDVMaWE2WU9vNWE2WTVwYTU1NzJSNTZ1Wjc3eU01cGF3NUxtbTQ0Q0I1NVdGNlpTQTVMbW00NENCNTdLKzVaT0I1WnUrNUxtbTViR1Y1NlM2NVpLTTVaeW81N3EvNks2aTZMU3Q3N3lNNVp1KzVMbW01NXU0NVlXejZMV0U1cGFaNUxpTDZMMjk3N3lNNVpLTTZLKzc2SUNGNTVXWjZLaUE1NjJKWENJc1hHNGdJQ0FnSUNBZ0lHTnZkbVZ5T2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Y1dsdVoyaDFZUzlqYjNabGNpNXFjR2NuTEZ4dUlDQWdJQ0FnSUNCc2FYTjBPaUJiZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Y1dsdVoyaDFZUzh3TVM1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Y1dsdVoyaDFZUzh3TWk1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Y1dsdVoyaDFZUzh3TXk1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Y1dsdVoyaDFZUzh3TkM1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Y1dsdVoyaDFZUzh3TlM1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012Y1dsdVoyaDFZUzh3Tmk1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmVjFjYmlBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pQmNJbXRoY25SbGJHeGNJaXhjYmlBZ0lDQWdJQ0FnZEhsd1pUb2dYQ0l5TURBMFhDSXNYRzRnSUNBZ0lDQWdJRzVoYldVNklGd2lTMkZ5ZEdWc2JDam1oSS9scEtmbGlLa3A1YTYyNVlXMzZMUzQ1cGlUNVl5WDVMcXM1NzJSNTZ1WlhDSXNYRzRnSUNBZ0lDQWdJSFJwYldVNklGd2lNakF3TnVXNXRPUzluT1dUZ1Z3aUxGeHVJQ0FnSUNBZ0lDQmtaWE5qT2lCY0l1V0ZxT2FnaU9lTHJPZXJpK1c4Z09XUGtlT0FndWFFaitXa3ArV0lxZVM0bHVlVmpPbWh0dWU2cCtXVGdlZUpqT1d1dHVXRnQrV01sK1M2ck9XdW1PYVd1ZWU5a2Vlcm1lT0FnZW1tbHVtaHRlbUhoK2VVcU9XRnFFWnNZWE5vNWJ5QTVZK1I3N3lNNUxxbjVaT0I1YkdWNTZTNjVaS001WnlvNTdxLzZLNmk2TFN0WENJc1hHNGdJQ0FnSUNBZ0lHeHBjM1E2SUZ0N1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBeExuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBeUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBekxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBMExuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBMUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBMkxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBM0xuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBNExuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpBNUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cllYSjBaV3hzTHpFd0xuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5WFZ4dUlDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZJRndpWVhWMGIzZHZjbXR6WENJc1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aU1qQXdORndpTEZ4dUlDQWdJQ0FnSUNCdVlXMWxPaUJjSWtGMWRHOVhiM0pyYytpMmhlaTNrZWV5dnVpTHNlUzhtbHdpTEZ4dUlDQWdJQ0FnSUNCMGFXMWxPaUJjSWpJd01EWGx1YlRrdlp6bGs0RmNJaXhjYmlBZ0lDQWdJQ0FnWkdWell6b2dYQ0xsaGFqbW9Jam5pNnpucTR2bHZJRGxqNUhqZ0lMbGpKZmt1cXpwaDVIbXVLL21zYjNvdmFibGhhemxtNjNvdG9Yb3Q1SG5zcjdvaTdIa3ZKcmxycGptbHJubnZaSG5xNW52dkl6b3ZhYm92b2JtbExub280WGpnSUhwbElEbGxLN2pnSUhucEx6bGs0SGpnSUhvdFp2a3Vvdm10THZsaXFoY0lpeGNiaUFnSUNBZ0lDQWdiR2x6ZERvZ1czdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyRjFkRzkzYjNKcmN5OHdNUzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZWFYwYjNkdmNtdHpMekF5TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTloZFhSdmQyOXlhM012TURNdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJGMWRHOTNiM0pyY3k4d05DNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdllYVjBiM2R2Y210ekx6QTFMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOVhWeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdhV1E2SUZ3aVkzSmhlbmxsYm1kc2FYTm9YQ0lzWEc0Z0lDQWdJQ0FnSUhSNWNHVTZJRndpTWpBd05Gd2lMRnh1SUNBZ0lDQWdJQ0J1WVcxbE9pQmNJdVdNbCtTNnJPZVdyK2VMZ3VpTHNlaXZyZW1odWVlYnJsd2lMRnh1SUNBZ0lDQWdJQ0IxY213NklGd2lhSFIwY0RvdkwzZDNkeTVpYW1OeVlYcDVaVzVuYkdsemFDNWpiMjB2WENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aTU1YXY1NHVDNkl1eDZLK3Q1YTZZNXBhNTU3MlI1NnVaNzd5STVaKzY1THFPNTZlUjZLNnY1YnlBNXJxUTU3Tzc1N3VmNzd5SjQ0Q0I1WnlvNTdxLzVvcWw1WkNONTdPNzU3dWY3N3lJNVlXbzVxQ0k1NHVzNTZ1TDVieUE1WStSNzd5SjQ0Q0I1WVdvNVp1OTVvNkk1cDJENTRLNTVMcVM1WXFvNUxxazVyV0I1Ym16NVkrdzc3eUk1WVdvNXFDSTU0dXM1NnVMNWJ5QTVZK1I3N3lKWENJc1hHNGdJQ0FnSUNBZ0lHTnZkbVZ5T2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WTNKaGVubGxibWRzYVhOb0wyTnZkbVZ5TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJR3hwYzNRNklGdDdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWpjbUY2ZVdWdVoyeHBjMmd2TURFdWFuQm5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJOeVlYcDVaVzVuYkdsemFDOHdNaTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZM0poZW5sbGJtZHNhWE5vTHpBekxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5amNtRjZlV1Z1WjJ4cGMyZ3ZNRFF1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMk55WVhwNVpXNW5iR2x6YUM4d05TNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlkzSmhlbmxsYm1kc2FYTm9MekEyTG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlqY21GNmVXVnVaMnhwYzJndk1EY3VjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyTnlZWHA1Wlc1bmJHbHphQzh3T0M1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WTNKaGVubGxibWRzYVhOb0x6QTVMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWpjbUY2ZVdWdVoyeHBjMmd2TVRBdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDFkWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCcFpEb2dYQ0ozWldsMFlXbGNJaXhjYmlBZ0lDQWdJQ0FnZEhsd1pUb2dYQ0l5TURBMFhDSXNYRzRnSUNBZ0lDQWdJRzVoYldVNklGd2k1WlN2NXJPdzVZK2s1WVc0NWE2MjViR0Y1NzJSWENJc1hHNGdJQ0FnSUNBZ0lIUnBiV1U2SUZ3aU1qQXdOK1c1dE9TOW5PV1RnVndpTEZ4dUlDQWdJQ0FnSUNCa1pYTmpPaUJjSXVXZnV1UzZqa0ZUVU9lbmtlaXVyK2V6dStlN24rUzZqT2Fzb2VXOGdPV1BrZSs4ak9XeHNlaWx2K1drcXVXT24rV2NzT2FXdWVXdXR1V0Z0K2U5a2Vlcm1lKzhqT1d1bnVlT3NPV1BwT1dGdU9XdXR1V0Z0K1d4bGVla3V1T0FnZVdjcU9lNnYraXVvdWkwcmVPQWdlUzhtdVdSbU9TNmt1V0txT2V0aWVXS24raUR2VndpTEZ4dUlDQWdJQ0FnSUNCamIzWmxjam9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMM2RsYVhSaGFTOWpiM1psY2k1d2JtY25MRnh1SUNBZ0lDQWdJQ0JzYVhOME9pQmJlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZkMlZwZEdGcEx6QXhMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OTNaV2wwWVdrdk1ESXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwzZGxhWFJoYVM4d015NXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmQyVnBkR0ZwTHpBMExuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5M1pXbDBZV2t2TURVdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDNkbGFYUmhhUzh3Tmk1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012ZDJWcGRHRnBMekEzTG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTkzWldsMFlXa3ZNRGd1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMWRYRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0JwWkRvZ1hDSmhhVzFsYVRNMjZLNmhYQ0lzWEc0Z0lDQWdJQ0FnSUhSNWNHVTZJRndpTWpBd05Gd2lMRnh1SUNBZ0lDQWdJQ0J1WVcxbE9pQmNJdWVJc2VlK2pqTTI1WXlXNWFhRzVaT0I1WnlvNTdxLzVaV0c1WitPWENJc1hHNGdJQ0FnSUNBZ0lIUnBiV1U2SUZ3aU1qQXdPZVc1dE9TOW5PV1RnVndpTEZ4dUlDQWdJQ0FnSUNCa1pYTmpPaUJjSXVXZnV1UzZqbEJJVU9lYWhITm9iM0JsZU9TNmpPYXNvZVc4Z09XUGtlKzhqT1d1ak9hVnRPZWFoT1djcU9lNnYrV1ZodVdmanVlenUrZTduMXdpTEZ4dUlDQWdJQ0FnSUNCamIzWmxjam9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkZwYldWcE16WXZZMjkyWlhJdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnYkdsemREb2dXM3RjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkZwYldWcE16WXZNREV1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkZwYldWcE16WXZNREl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkZwYldWcE16WXZNRE11Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkZwYldWcE16WXZNRFF1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMWRYRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0JwWkRvZ1hDSjZlblZzYVdKcVhDSXNYRzRnSUNBZ0lDQWdJSFI1Y0dVNklGd2lNakF3TkZ3aUxGeHVJQ0FnSUNBZ0lDQnVZVzFsT2lCY0l1bURrZVczbnVpOXUrVzNwZVM0bXVXdHB1bVpvdVdNbCtTNnJPYWdvZVdQaStTOG1sd2lMRnh1SUNBZ0lDQWdJQ0JrWlhOak9pQmNJdVM0dXVtRGtlVzNudWk5dStXM3BlUzRtdVd0cHVtWm91YXZsZVM0bXVlYWhPT0FnZVdjcU9XTWwrUzZyT1czcGVTOW5PZWFoT2Fnb2VXUGkrKzhqT2FQa09TK20rV2NxT2U2ditheW4rbUFtdU9BZ2VTNnBPYTFnZWVhaE9XNXMrV1BzT09BZ3VXZnV1UzZqdVc2dCtlYm0rV0ltK2FEcytlYWhDQjFZMlZ1ZEdWeUlHaHZiV1VnNUxxTTVxeWg1YnlBNVkrUlhDSXNYRzRnSUNBZ0lDQWdJR3hwYzNRNklGdDdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OTZlblZzYVdKcUx6QXhMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OTZlblZzYVdKcUx6QXlMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OTZlblZzYVdKcUx6QXpMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OTZlblZzYVdKcUx6QTBMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OTZlblZzYVdKcUx6QTFMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOVhWeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdhV1E2SUZ3aWIzUm9aWEpjSWl4Y2JpQWdJQ0FnSUNBZ2RIbHdaVG9nWENJeU1EQTBYQ0lzWEc0Z0lDQWdJQ0FnSUc1aGJXVTZJRndpNVlXMjVhNkQ1TDJjNVpPQjZZT281WWlHNUwraDVvR3ZYQ0lzWEc0Z0lDQWdJQ0FnSUdSbGMyTTZJRndpTWpBd05lVzV0T2kxdCthT3BlV05sZVdCbXVlOWtlZXJtZU9BZ2VXZnV1UzZqdVc4Z09hNmtPZXp1K2U3bithUXJlVzd1dVM0cXVTNnV1ZTlrZWVybWVPQWdlZWFoT21EcU9XSWh1UzluT1dUZ1NqbHBLZmxzSS9rdklIa3VKcm5xNWt6TU9Xa211UzRxaWxjSWl4Y2JpQWdJQ0FnSUNBZ1kyOTJaWEk2SUZ3aUxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YjNSb1pYSXZZMjkyWlhJdWNHNW5YQ0lzWEc0Z0lDQWdJQ0FnSUd4cGMzUTZJRnQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTl2ZEdobGNpOHdNUzVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZiM1JvWlhJdk1ESXVhbkJuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyOTBhR1Z5THpBekxtcHdaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5dmRHaGxjaTh3TkM1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YjNSb1pYSXZNRFV1YW5Cbkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMjkwYUdWeUx6QTJMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXZkR2hsY2k4d055NXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmIzUm9aWEl2TURndWFuQm5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDI5MGFHVnlMekE1TG1wd1p5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTl2ZEdobGNpOHhNQzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZWMWNiaUFnSUNCOVhWeHVmVHRjYmx4dWRtRnlJSGR2Y210eklEMGdlMXh1SUNBZ0lDOHFYRzRnSUNBZzZJNjM1WStXNUwyYzVaT0I1WWlYNktHbzVibTI1WUdhNUxpQTVMcWI1cUM4NWJ5UDVZcWc1YmVsWEc0Z0lDQWdJQ292WEc0Z0lDQWdaMlYwVEdsemREb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQnNhWE4wUkdGMFlTQTlJRnRkTzF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnVVM1UWNtOXRhWE5sS0daMWJtTjBhVzl1S0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2tnZTF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0IzYjNKclNXNW1ieTVrWVhSaExtMWhjQ2htZFc1amRHbHZiaWhwZEdWdEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUdsMFpXMUVZWFJoSUQwZ2UzMDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhWFJsYlVSaGRHRXVhV1FnUFNCcGRHVnRMbWxrTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsMFpXMUVZWFJoTG01aGJXVWdQU0JwZEdWdExtNWhiV1U3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVhSbGJVUmhkR0V1ZFhKc0lEMGdhWFJsYlM1MWNtd2dmSHdnWENKY0lqdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBkR1Z0UkdGMFlTNTBhWEFnUFNCcGRHVnRMblJwY0NCOGZDQmNJbHdpTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsMFpXMUVZWFJoTG1SbGMyTWdQU0JwZEdWdExtUmxjMk1nZkh3Z1hDSmNJanRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdFJHRjBZUzVqYjNabGNpQTlJR2wwWlcwdVkyOTJaWElnZkh3Z0tHbDBaVzB1YkdsemRDQS9JR2wwWlcwdWJHbHpkRnN3WFM1MWNtd2dPaUJjSWx3aUtUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR3hwYzNSRVlYUmhMbkIxYzJnb2FYUmxiVVJoZEdFcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhOdmJIWmxLR3hwYzNSRVlYUmhLVHRjYmlBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnZlN4Y2JseHVJQ0FnSUM4cVhHNGdJQ0FnNXFDNTVvMnU1N0c3NVo2TDZJNjM1WStXNUwyYzVaT0I1WWlYNktHb1hHNGdJQ0FnSUNvdlhHNGdJQ0FnWjJWMFRHbHpkRUo1Vkhsd1pUb2dablZ1WTNScGIyNG9kSGx3WlNrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnYkdsemRFUmhkR0VnUFNCYlhUdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlGRXVVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2QyOXlhMGx1Wm04dVpHRjBZUzV0WVhBb1puVnVZM1JwYjI0b2FYUmxiU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaDBlWEJsSUQwOUlHbDBaVzB1ZEhsd1pTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllYSWdhWFJsYlVSaGRHRWdQU0I3ZlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhWFJsYlVSaGRHRXVhV1FnUFNCcGRHVnRMbWxrTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBkR1Z0UkdGMFlTNXVZVzFsSUQwZ2FYUmxiUzV1WVcxbE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdFJHRjBZUzUxY213Z1BTQnBkR1Z0TG5WeWJDQjhmQ0JjSWx3aU8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdFJHRjBZUzUwYVhBZ1BTQnBkR1Z0TG5ScGNDQjhmQ0JjSWx3aU8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdFJHRjBZUzVrWlhOaklEMGdhWFJsYlM1a1pYTmpJSHg4SUZ3aVhDSTdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsMFpXMUVZWFJoTG1OdmRtVnlJRDBnYVhSbGJTNWpiM1psY2lCOGZDQW9hWFJsYlM1c2FYTjBJRDhnYVhSbGJTNXNhWE4wV3pCZExuVnliQ0E2SUZ3aVhDSXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHeHBjM1JFWVhSaExuQjFjMmdvYVhSbGJVUmhkR0VwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZ6YjJ4MlpTaHNhWE4wUkdGMFlTazdYRzRnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJSDBzWEc1Y2JpQWdJQ0F2S2x4dUlDQWdJT2FndWVhTnJtbGs2STYzNVkrVzVZMlY1TGlxNUwyYzVaT0JYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1oyVjBRbmxKWkRvZ1puVnVZM1JwYjI0b2FXUXBJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHbDBaVzFFWVhSaElEMGdlMzA3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJSTGxCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU3dnY21WcVpXTjBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjNiM0pyU1c1bWJ5NWtZWFJoTG0xaGNDaG1kVzVqZEdsdmJpaHBkR1Z0S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR2xrSUQwOUlHbDBaVzB1YVdRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVhSbGJVUmhkR0VnUFNCcGRHVnRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVnpiMngyWlNocGRHVnRSR0YwWVNrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNibjA3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2QyOXlhM003WEc0aUxDSnBiWEJ2Y25RZ0tpQmhjeUJpWVhObElHWnliMjBnSnk0dmFHRnVaR3hsWW1GeWN5OWlZWE5sSnp0Y2JseHVMeThnUldGamFDQnZaaUIwYUdWelpTQmhkV2R0Wlc1MElIUm9aU0JJWVc1a2JHVmlZWEp6SUc5aWFtVmpkQzRnVG04Z2JtVmxaQ0IwYnlCelpYUjFjQ0JvWlhKbExseHVMeThnS0ZSb2FYTWdhWE1nWkc5dVpTQjBieUJsWVhOcGJIa2djMmhoY21VZ1kyOWtaU0JpWlhSM1pXVnVJR052YlcxdmJtcHpJR0Z1WkNCaWNtOTNjMlVnWlc1MmN5bGNibWx0Y0c5eWRDQlRZV1psVTNSeWFXNW5JR1p5YjIwZ0p5NHZhR0Z1Wkd4bFltRnljeTl6WVdabExYTjBjbWx1WnljN1hHNXBiWEJ2Y25RZ1JYaGpaWEIwYVc5dUlHWnliMjBnSnk0dmFHRnVaR3hsWW1GeWN5OWxlR05sY0hScGIyNG5PMXh1YVcxd2IzSjBJQ29nWVhNZ1ZYUnBiSE1nWm5KdmJTQW5MaTlvWVc1a2JHVmlZWEp6TDNWMGFXeHpKenRjYm1sdGNHOXlkQ0FxSUdGeklISjFiblJwYldVZ1puSnZiU0FuTGk5b1lXNWtiR1ZpWVhKekwzSjFiblJwYldVbk8xeHVYRzVwYlhCdmNuUWdibTlEYjI1bWJHbGpkQ0JtY205dElDY3VMMmhoYm1Sc1pXSmhjbk12Ym04dFkyOXVabXhwWTNRbk8xeHVYRzR2THlCR2IzSWdZMjl0Y0dGMGFXSnBiR2wwZVNCaGJtUWdkWE5oWjJVZ2IzVjBjMmxrWlNCdlppQnRiMlIxYkdVZ2MzbHpkR1Z0Y3l3Z2JXRnJaU0IwYUdVZ1NHRnVaR3hsWW1GeWN5QnZZbXBsWTNRZ1lTQnVZVzFsYzNCaFkyVmNibVoxYm1OMGFXOXVJR055WldGMFpTZ3BJSHRjYmlBZ2JHVjBJR2hpSUQwZ2JtVjNJR0poYzJVdVNHRnVaR3hsWW1GeWMwVnVkbWx5YjI1dFpXNTBLQ2s3WEc1Y2JpQWdWWFJwYkhNdVpYaDBaVzVrS0doaUxDQmlZWE5sS1R0Y2JpQWdhR0l1VTJGbVpWTjBjbWx1WnlBOUlGTmhabVZUZEhKcGJtYzdYRzRnSUdoaUxrVjRZMlZ3ZEdsdmJpQTlJRVY0WTJWd2RHbHZianRjYmlBZ2FHSXVWWFJwYkhNZ1BTQlZkR2xzY3p0Y2JpQWdhR0l1WlhOallYQmxSWGh3Y21WemMybHZiaUE5SUZWMGFXeHpMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNDdYRzVjYmlBZ2FHSXVWazBnUFNCeWRXNTBhVzFsTzF4dUlDQm9ZaTUwWlcxd2JHRjBaU0E5SUdaMWJtTjBhVzl1S0hOd1pXTXBJSHRjYmlBZ0lDQnlaWFIxY200Z2NuVnVkR2x0WlM1MFpXMXdiR0YwWlNoemNHVmpMQ0JvWWlrN1hHNGdJSDA3WEc1Y2JpQWdjbVYwZFhKdUlHaGlPMXh1ZlZ4dVhHNXNaWFFnYVc1emRDQTlJR055WldGMFpTZ3BPMXh1YVc1emRDNWpjbVZoZEdVZ1BTQmpjbVZoZEdVN1hHNWNibTV2UTI5dVpteHBZM1FvYVc1emRDazdYRzVjYm1sdWMzUmJKMlJsWm1GMWJIUW5YU0E5SUdsdWMzUTdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR2x1YzNRN1hHNGlMQ0pwYlhCdmNuUWdlMk55WldGMFpVWnlZVzFsTENCbGVIUmxibVFzSUhSdlUzUnlhVzVuZlNCbWNtOXRJQ2N1TDNWMGFXeHpKenRjYm1sdGNHOXlkQ0JGZUdObGNIUnBiMjRnWm5KdmJTQW5MaTlsZUdObGNIUnBiMjRuTzF4dWFXMXdiM0owSUh0eVpXZHBjM1JsY2tSbFptRjFiSFJJWld4d1pYSnpmU0JtY205dElDY3VMMmhsYkhCbGNuTW5PMXh1YVcxd2IzSjBJSHR5WldkcGMzUmxja1JsWm1GMWJIUkVaV052Y21GMGIzSnpmU0JtY205dElDY3VMMlJsWTI5eVlYUnZjbk1uTzF4dWFXMXdiM0owSUd4dloyZGxjaUJtY205dElDY3VMMnh2WjJkbGNpYzdYRzVjYm1WNGNHOXlkQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKelF1TUM0MUp6dGNibVY0Y0c5eWRDQmpiMjV6ZENCRFQwMVFTVXhGVWw5U1JWWkpVMGxQVGlBOUlEYzdYRzVjYm1WNGNHOXlkQ0JqYjI1emRDQlNSVlpKVTBsUFRsOURTRUZPUjBWVElEMGdlMXh1SUNBeE9pQW5QRDBnTVM0d0xuSmpMakluTENBdkx5QXhMakF1Y21NdU1pQnBjeUJoWTNSMVlXeHNlU0J5WlhZeUlHSjFkQ0JrYjJWemJpZDBJSEpsY0c5eWRDQnBkRnh1SUNBeU9pQW5QVDBnTVM0d0xqQXRjbU11TXljc1hHNGdJRE02SUNjOVBTQXhMakF1TUMxeVl5NDBKeXhjYmlBZ05Eb2dKejA5SURFdWVDNTRKeXhjYmlBZ05Ub2dKejA5SURJdU1DNHdMV0ZzY0doaExuZ25MRnh1SUNBMk9pQW5QajBnTWk0d0xqQXRZbVYwWVM0eEp5eGNiaUFnTnpvZ0p6NDlJRFF1TUM0d0oxeHVmVHRjYmx4dVkyOXVjM1FnYjJKcVpXTjBWSGx3WlNBOUlDZGJiMkpxWldOMElFOWlhbVZqZEYwbk8xeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdTR0Z1Wkd4bFltRnljMFZ1ZG1seWIyNXRaVzUwS0dobGJIQmxjbk1zSUhCaGNuUnBZV3h6TENCa1pXTnZjbUYwYjNKektTQjdYRzRnSUhSb2FYTXVhR1ZzY0dWeWN5QTlJR2hsYkhCbGNuTWdmSHdnZTMwN1hHNGdJSFJvYVhNdWNHRnlkR2xoYkhNZ1BTQndZWEowYVdGc2N5QjhmQ0I3ZlR0Y2JpQWdkR2hwY3k1a1pXTnZjbUYwYjNKeklEMGdaR1ZqYjNKaGRHOXljeUI4ZkNCN2ZUdGNibHh1SUNCeVpXZHBjM1JsY2tSbFptRjFiSFJJWld4d1pYSnpLSFJvYVhNcE8xeHVJQ0J5WldkcGMzUmxja1JsWm1GMWJIUkVaV052Y21GMGIzSnpLSFJvYVhNcE8xeHVmVnh1WEc1SVlXNWtiR1ZpWVhKelJXNTJhWEp2Ym0xbGJuUXVjSEp2ZEc5MGVYQmxJRDBnZTF4dUlDQmpiMjV6ZEhKMVkzUnZjam9nU0dGdVpHeGxZbUZ5YzBWdWRtbHliMjV0Wlc1MExGeHVYRzRnSUd4dloyZGxjam9nYkc5bloyVnlMRnh1SUNCc2IyYzZJR3h2WjJkbGNpNXNiMmNzWEc1Y2JpQWdjbVZuYVhOMFpYSklaV3h3WlhJNklHWjFibU4wYVc5dUtHNWhiV1VzSUdadUtTQjdYRzRnSUNBZ2FXWWdLSFJ2VTNSeWFXNW5MbU5oYkd3b2JtRnRaU2tnUFQwOUlHOWlhbVZqZEZSNWNHVXBJSHRjYmlBZ0lDQWdJR2xtSUNobWJpa2dleUIwYUhKdmR5QnVaWGNnUlhoalpYQjBhVzl1S0NkQmNtY2dibTkwSUhOMWNIQnZjblJsWkNCM2FYUm9JRzExYkhScGNHeGxJR2hsYkhCbGNuTW5LVHNnZlZ4dUlDQWdJQ0FnWlhoMFpXNWtLSFJvYVhNdWFHVnNjR1Z5Y3l3Z2JtRnRaU2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIUm9hWE11YUdWc2NHVnljMXR1WVcxbFhTQTlJR1p1TzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnZFc1eVpXZHBjM1JsY2tobGJIQmxjam9nWm5WdVkzUnBiMjRvYm1GdFpTa2dlMXh1SUNBZ0lHUmxiR1YwWlNCMGFHbHpMbWhsYkhCbGNuTmJibUZ0WlYwN1hHNGdJSDBzWEc1Y2JpQWdjbVZuYVhOMFpYSlFZWEowYVdGc09pQm1kVzVqZEdsdmJpaHVZVzFsTENCd1lYSjBhV0ZzS1NCN1hHNGdJQ0FnYVdZZ0tIUnZVM1J5YVc1bkxtTmhiR3dvYm1GdFpTa2dQVDA5SUc5aWFtVmpkRlI1Y0dVcElIdGNiaUFnSUNBZ0lHVjRkR1Z1WkNoMGFHbHpMbkJoY25ScFlXeHpMQ0J1WVcxbEtUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCd1lYSjBhV0ZzSUQwOVBTQW5kVzVrWldacGJtVmtKeWtnZTF4dUlDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYaGpaWEIwYVc5dUtHQkJkSFJsYlhCMGFXNW5JSFJ2SUhKbFoybHpkR1Z5SUdFZ2NHRnlkR2xoYkNCallXeHNaV1FnWENJa2UyNWhiV1Y5WENJZ1lYTWdkVzVrWldacGJtVmtZQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0IwYUdsekxuQmhjblJwWVd4elcyNWhiV1ZkSUQwZ2NHRnlkR2xoYkR0Y2JpQWdJQ0I5WEc0Z0lIMHNYRzRnSUhWdWNtVm5hWE4wWlhKUVlYSjBhV0ZzT2lCbWRXNWpkR2x2YmlodVlXMWxLU0I3WEc0Z0lDQWdaR1ZzWlhSbElIUm9hWE11Y0dGeWRHbGhiSE5iYm1GdFpWMDdYRzRnSUgwc1hHNWNiaUFnY21WbmFYTjBaWEpFWldOdmNtRjBiM0k2SUdaMWJtTjBhVzl1S0c1aGJXVXNJR1p1S1NCN1hHNGdJQ0FnYVdZZ0tIUnZVM1J5YVc1bkxtTmhiR3dvYm1GdFpTa2dQVDA5SUc5aWFtVmpkRlI1Y0dVcElIdGNiaUFnSUNBZ0lHbG1JQ2htYmlrZ2V5QjBhSEp2ZHlCdVpYY2dSWGhqWlhCMGFXOXVLQ2RCY21jZ2JtOTBJSE4xY0hCdmNuUmxaQ0IzYVhSb0lHMTFiSFJwY0d4bElHUmxZMjl5WVhSdmNuTW5LVHNnZlZ4dUlDQWdJQ0FnWlhoMFpXNWtLSFJvYVhNdVpHVmpiM0poZEc5eWN5d2dibUZ0WlNrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSFJvYVhNdVpHVmpiM0poZEc5eWMxdHVZVzFsWFNBOUlHWnVPMXh1SUNBZ0lIMWNiaUFnZlN4Y2JpQWdkVzV5WldkcGMzUmxja1JsWTI5eVlYUnZjam9nWm5WdVkzUnBiMjRvYm1GdFpTa2dlMXh1SUNBZ0lHUmxiR1YwWlNCMGFHbHpMbVJsWTI5eVlYUnZjbk5iYm1GdFpWMDdYRzRnSUgxY2JuMDdYRzVjYm1WNGNHOXlkQ0JzWlhRZ2JHOW5JRDBnYkc5bloyVnlMbXh2Wnp0Y2JseHVaWGh3YjNKMElIdGpjbVZoZEdWR2NtRnRaU3dnYkc5bloyVnlmVHRjYmlJc0ltbHRjRzl5ZENCeVpXZHBjM1JsY2tsdWJHbHVaU0JtY205dElDY3VMMlJsWTI5eVlYUnZjbk12YVc1c2FXNWxKenRjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhKbFoybHpkR1Z5UkdWbVlYVnNkRVJsWTI5eVlYUnZjbk1vYVc1emRHRnVZMlVwSUh0Y2JpQWdjbVZuYVhOMFpYSkpibXhwYm1Vb2FXNXpkR0Z1WTJVcE8xeHVmVnh1WEc0aUxDSnBiWEJ2Y25RZ2UyVjRkR1Z1WkgwZ1puSnZiU0FuTGk0dmRYUnBiSE1uTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlocGJuTjBZVzVqWlNrZ2UxeHVJQ0JwYm5OMFlXNWpaUzV5WldkcGMzUmxja1JsWTI5eVlYUnZjaWduYVc1c2FXNWxKeXdnWm5WdVkzUnBiMjRvWm00c0lIQnliM0J6TENCamIyNTBZV2x1WlhJc0lHOXdkR2x2Ym5NcElIdGNiaUFnSUNCc1pYUWdjbVYwSUQwZ1ptNDdYRzRnSUNBZ2FXWWdLQ0Z3Y205d2N5NXdZWEowYVdGc2N5a2dlMXh1SUNBZ0lDQWdjSEp2Y0hNdWNHRnlkR2xoYkhNZ1BTQjdmVHRjYmlBZ0lDQWdJSEpsZENBOUlHWjFibU4wYVc5dUtHTnZiblJsZUhRc0lHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lDQWdMeThnUTNKbFlYUmxJR0VnYm1WM0lIQmhjblJwWVd4eklITjBZV05ySUdaeVlXMWxJSEJ5YVc5eUlIUnZJR1Y0WldNdVhHNGdJQ0FnSUNBZ0lHeGxkQ0J2Y21sbmFXNWhiQ0E5SUdOdmJuUmhhVzVsY2k1d1lYSjBhV0ZzY3p0Y2JpQWdJQ0FnSUNBZ1kyOXVkR0ZwYm1WeUxuQmhjblJwWVd4eklEMGdaWGgwWlc1a0tIdDlMQ0J2Y21sbmFXNWhiQ3dnY0hKdmNITXVjR0Z5ZEdsaGJITXBPMXh1SUNBZ0lDQWdJQ0JzWlhRZ2NtVjBJRDBnWm00b1kyOXVkR1Y0ZEN3Z2IzQjBhVzl1Y3lrN1hHNGdJQ0FnSUNBZ0lHTnZiblJoYVc1bGNpNXdZWEowYVdGc2N5QTlJRzl5YVdkcGJtRnNPMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdjbVYwTzF4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J3Y205d2N5NXdZWEowYVdGc2MxdHZjSFJwYjI1ekxtRnlaM05iTUYxZElEMGdiM0IwYVc5dWN5NW1ianRjYmx4dUlDQWdJSEpsZEhWeWJpQnlaWFE3WEc0Z0lIMHBPMXh1ZlZ4dUlpd2lYRzVqYjI1emRDQmxjbkp2Y2xCeWIzQnpJRDBnV3lka1pYTmpjbWx3ZEdsdmJpY3NJQ2RtYVd4bFRtRnRaU2NzSUNkc2FXNWxUblZ0WW1WeUp5d2dKMjFsYzNOaFoyVW5MQ0FuYm1GdFpTY3NJQ2R1ZFcxaVpYSW5MQ0FuYzNSaFkyc25YVHRjYmx4dVpuVnVZM1JwYjI0Z1JYaGpaWEIwYVc5dUtHMWxjM05oWjJVc0lHNXZaR1VwSUh0Y2JpQWdiR1YwSUd4dll5QTlJRzV2WkdVZ0ppWWdibTlrWlM1c2IyTXNYRzRnSUNBZ0lDQnNhVzVsTEZ4dUlDQWdJQ0FnWTI5c2RXMXVPMXh1SUNCcFppQW9iRzlqS1NCN1hHNGdJQ0FnYkdsdVpTQTlJR3h2WXk1emRHRnlkQzVzYVc1bE8xeHVJQ0FnSUdOdmJIVnRiaUE5SUd4dll5NXpkR0Z5ZEM1amIyeDFiVzQ3WEc1Y2JpQWdJQ0J0WlhOellXZGxJQ3M5SUNjZ0xTQW5JQ3NnYkdsdVpTQXJJQ2M2SnlBcklHTnZiSFZ0Ymp0Y2JpQWdmVnh1WEc0Z0lHeGxkQ0IwYlhBZ1BTQkZjbkp2Y2k1d2NtOTBiM1I1Y0dVdVkyOXVjM1J5ZFdOMGIzSXVZMkZzYkNoMGFHbHpMQ0J0WlhOellXZGxLVHRjYmx4dUlDQXZMeUJWYm1admNuUjFibUYwWld4NUlHVnljbTl5Y3lCaGNtVWdibTkwSUdWdWRXMWxjbUZpYkdVZ2FXNGdRMmh5YjIxbElDaGhkQ0JzWldGemRDa3NJSE52SUdCbWIzSWdjSEp2Y0NCcGJpQjBiWEJnSUdSdlpYTnVKM1FnZDI5eWF5NWNiaUFnWm05eUlDaHNaWFFnYVdSNElEMGdNRHNnYVdSNElEd2daWEp5YjNKUWNtOXdjeTVzWlc1bmRHZzdJR2xrZUNzcktTQjdYRzRnSUNBZ2RHaHBjMXRsY25KdmNsQnliM0J6VzJsa2VGMWRJRDBnZEcxd1cyVnljbTl5VUhKdmNITmJhV1I0WFYwN1hHNGdJSDFjYmx4dUlDQXZLaUJwYzNSaGJtSjFiQ0JwWjI1dmNtVWdaV3h6WlNBcUwxeHVJQ0JwWmlBb1JYSnliM0l1WTJGd2RIVnlaVk4wWVdOclZISmhZMlVwSUh0Y2JpQWdJQ0JGY25KdmNpNWpZWEIwZFhKbFUzUmhZMnRVY21GalpTaDBhR2x6TENCRmVHTmxjSFJwYjI0cE8xeHVJQ0I5WEc1Y2JpQWdkSEo1SUh0Y2JpQWdJQ0JwWmlBb2JHOWpLU0I3WEc0Z0lDQWdJQ0IwYUdsekxteHBibVZPZFcxaVpYSWdQU0JzYVc1bE8xeHVYRzRnSUNBZ0lDQXZMeUJYYjNKcklHRnliM1Z1WkNCcGMzTjFaU0IxYm1SbGNpQnpZV1poY21rZ2QyaGxjbVVnZDJVZ1kyRnVKM1FnWkdseVpXTjBiSGtnYzJWMElIUm9aU0JqYjJ4MWJXNGdkbUZzZFdWY2JpQWdJQ0FnSUM4cUlHbHpkR0Z1WW5Wc0lHbG5ibTl5WlNCdVpYaDBJQ292WEc0Z0lDQWdJQ0JwWmlBb1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLU0I3WEc0Z0lDQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDBhR2x6TENBblkyOXNkVzF1Snl3Z2UzWmhiSFZsT2lCamIyeDFiVzU5S1R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVZMjlzZFcxdUlEMGdZMjlzZFcxdU8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmU0JqWVhSamFDQW9ibTl3S1NCN1hHNGdJQ0FnTHlvZ1NXZHViM0psSUdsbUlIUm9aU0JpY205M2MyVnlJR2x6SUhabGNua2djR0Z5ZEdsamRXeGhjaUFxTDF4dUlDQjlYRzU5WEc1Y2JrVjRZMlZ3ZEdsdmJpNXdjbTkwYjNSNWNHVWdQU0J1WlhjZ1JYSnliM0lvS1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1JYaGpaWEIwYVc5dU8xeHVJaXdpYVcxd2IzSjBJSEpsWjJsemRHVnlRbXh2WTJ0SVpXeHdaWEpOYVhOemFXNW5JR1p5YjIwZ0p5NHZhR1ZzY0dWeWN5OWliRzlqYXkxb1pXeHdaWEl0YldsemMybHVaeWM3WEc1cGJYQnZjblFnY21WbmFYTjBaWEpGWVdOb0lHWnliMjBnSnk0dmFHVnNjR1Z5Y3k5bFlXTm9KenRjYm1sdGNHOXlkQ0J5WldkcGMzUmxja2hsYkhCbGNrMXBjM05wYm1jZ1puSnZiU0FuTGk5b1pXeHdaWEp6TDJobGJIQmxjaTF0YVhOemFXNW5KenRjYm1sdGNHOXlkQ0J5WldkcGMzUmxja2xtSUdaeWIyMGdKeTR2YUdWc2NHVnljeTlwWmljN1hHNXBiWEJ2Y25RZ2NtVm5hWE4wWlhKTWIyY2dabkp2YlNBbkxpOW9aV3h3WlhKekwyeHZaeWM3WEc1cGJYQnZjblFnY21WbmFYTjBaWEpNYjI5cmRYQWdabkp2YlNBbkxpOW9aV3h3WlhKekwyeHZiMnQxY0NjN1hHNXBiWEJ2Y25RZ2NtVm5hWE4wWlhKWGFYUm9JR1p5YjIwZ0p5NHZhR1ZzY0dWeWN5OTNhWFJvSnp0Y2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlISmxaMmx6ZEdWeVJHVm1ZWFZzZEVobGJIQmxjbk1vYVc1emRHRnVZMlVwSUh0Y2JpQWdjbVZuYVhOMFpYSkNiRzlqYTBobGJIQmxjazFwYzNOcGJtY29hVzV6ZEdGdVkyVXBPMXh1SUNCeVpXZHBjM1JsY2tWaFkyZ29hVzV6ZEdGdVkyVXBPMXh1SUNCeVpXZHBjM1JsY2tobGJIQmxjazFwYzNOcGJtY29hVzV6ZEdGdVkyVXBPMXh1SUNCeVpXZHBjM1JsY2tsbUtHbHVjM1JoYm1ObEtUdGNiaUFnY21WbmFYTjBaWEpNYjJjb2FXNXpkR0Z1WTJVcE8xeHVJQ0J5WldkcGMzUmxja3h2YjJ0MWNDaHBibk4wWVc1alpTazdYRzRnSUhKbFoybHpkR1Z5VjJsMGFDaHBibk4wWVc1alpTazdYRzU5WEc0aUxDSnBiWEJ2Y25RZ2UyRndjR1Z1WkVOdmJuUmxlSFJRWVhSb0xDQmpjbVZoZEdWR2NtRnRaU3dnYVhOQmNuSmhlWDBnWm5KdmJTQW5MaTR2ZFhScGJITW5PMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JtZFc1amRHbHZiaWhwYm5OMFlXNWpaU2tnZTF4dUlDQnBibk4wWVc1alpTNXlaV2RwYzNSbGNraGxiSEJsY2lnbllteHZZMnRJWld4d1pYSk5hWE56YVc1bkp5d2dablZ1WTNScGIyNG9ZMjl1ZEdWNGRDd2diM0IwYVc5dWN5a2dlMXh1SUNBZ0lHeGxkQ0JwYm5abGNuTmxJRDBnYjNCMGFXOXVjeTVwYm5abGNuTmxMRnh1SUNBZ0lDQWdJQ0JtYmlBOUlHOXdkR2x2Ym5NdVptNDdYRzVjYmlBZ0lDQnBaaUFvWTI5dWRHVjRkQ0E5UFQwZ2RISjFaU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1p1S0hSb2FYTXBPMXh1SUNBZ0lIMGdaV3h6WlNCcFppQW9ZMjl1ZEdWNGRDQTlQVDBnWm1Gc2MyVWdmSHdnWTI5dWRHVjRkQ0E5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdhVzUyWlhKelpTaDBhR2x6S1R0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0dselFYSnlZWGtvWTI5dWRHVjRkQ2twSUh0Y2JpQWdJQ0FnSUdsbUlDaGpiMjUwWlhoMExteGxibWQwYUNBK0lEQXBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHOXdkR2x2Ym5NdWFXUnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1cFpITWdQU0JiYjNCMGFXOXVjeTV1WVcxbFhUdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJwYm5OMFlXNWpaUzVvWld4d1pYSnpMbVZoWTJnb1kyOXVkR1Y0ZEN3Z2IzQjBhVzl1Y3lrN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYVc1MlpYSnpaU2gwYUdsektUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYVdZZ0tHOXdkR2x2Ym5NdVpHRjBZU0FtSmlCdmNIUnBiMjV6TG1sa2N5a2dlMXh1SUNBZ0lDQWdJQ0JzWlhRZ1pHRjBZU0E5SUdOeVpXRjBaVVp5WVcxbEtHOXdkR2x2Ym5NdVpHRjBZU2s3WEc0Z0lDQWdJQ0FnSUdSaGRHRXVZMjl1ZEdWNGRGQmhkR2dnUFNCaGNIQmxibVJEYjI1MFpYaDBVR0YwYUNodmNIUnBiMjV6TG1SaGRHRXVZMjl1ZEdWNGRGQmhkR2dzSUc5d2RHbHZibk11Ym1GdFpTazdYRzRnSUNBZ0lDQWdJRzl3ZEdsdmJuTWdQU0I3WkdGMFlUb2daR0YwWVgwN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCbWJpaGpiMjUwWlhoMExDQnZjSFJwYjI1ektUdGNiaUFnSUNCOVhHNGdJSDBwTzF4dWZWeHVJaXdpYVcxd2IzSjBJSHRoY0hCbGJtUkRiMjUwWlhoMFVHRjBhQ3dnWW14dlkydFFZWEpoYlhNc0lHTnlaV0YwWlVaeVlXMWxMQ0JwYzBGeWNtRjVMQ0JwYzBaMWJtTjBhVzl1ZlNCbWNtOXRJQ2N1TGk5MWRHbHNjeWM3WEc1cGJYQnZjblFnUlhoalpYQjBhVzl1SUdaeWIyMGdKeTR1TDJWNFkyVndkR2x2YmljN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHWjFibU4wYVc5dUtHbHVjM1JoYm1ObEtTQjdYRzRnSUdsdWMzUmhibU5sTG5KbFoybHpkR1Z5U0dWc2NHVnlLQ2RsWVdOb0p5d2dablZ1WTNScGIyNG9ZMjl1ZEdWNGRDd2diM0IwYVc5dWN5a2dlMXh1SUNBZ0lHbG1JQ2doYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWNFkyVndkR2x2YmlnblRYVnpkQ0J3WVhOeklHbDBaWEpoZEc5eUlIUnZJQ05sWVdOb0p5azdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2JHVjBJR1p1SUQwZ2IzQjBhVzl1Y3k1bWJpeGNiaUFnSUNBZ0lDQWdhVzUyWlhKelpTQTlJRzl3ZEdsdmJuTXVhVzUyWlhKelpTeGNiaUFnSUNBZ0lDQWdhU0E5SURBc1hHNGdJQ0FnSUNBZ0lISmxkQ0E5SUNjbkxGeHVJQ0FnSUNBZ0lDQmtZWFJoTEZ4dUlDQWdJQ0FnSUNCamIyNTBaWGgwVUdGMGFEdGNibHh1SUNBZ0lHbG1JQ2h2Y0hScGIyNXpMbVJoZEdFZ0ppWWdiM0IwYVc5dWN5NXBaSE1wSUh0Y2JpQWdJQ0FnSUdOdmJuUmxlSFJRWVhSb0lEMGdZWEJ3Wlc1a1EyOXVkR1Y0ZEZCaGRHZ29iM0IwYVc5dWN5NWtZWFJoTG1OdmJuUmxlSFJRWVhSb0xDQnZjSFJwYjI1ekxtbGtjMXN3WFNrZ0t5QW5MaWM3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0dselJuVnVZM1JwYjI0b1kyOXVkR1Y0ZENrcElIc2dZMjl1ZEdWNGRDQTlJR052Ym5SbGVIUXVZMkZzYkNoMGFHbHpLVHNnZlZ4dVhHNGdJQ0FnYVdZZ0tHOXdkR2x2Ym5NdVpHRjBZU2tnZTF4dUlDQWdJQ0FnWkdGMFlTQTlJR055WldGMFpVWnlZVzFsS0c5d2RHbHZibk11WkdGMFlTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1puVnVZM1JwYjI0Z1pYaGxZMGwwWlhKaGRHbHZiaWhtYVdWc1pDd2dhVzVrWlhnc0lHeGhjM1FwSUh0Y2JpQWdJQ0FnSUdsbUlDaGtZWFJoS1NCN1hHNGdJQ0FnSUNBZ0lHUmhkR0V1YTJWNUlEMGdabWxsYkdRN1hHNGdJQ0FnSUNBZ0lHUmhkR0V1YVc1a1pYZ2dQU0JwYm1SbGVEdGNiaUFnSUNBZ0lDQWdaR0YwWVM1bWFYSnpkQ0E5SUdsdVpHVjRJRDA5UFNBd08xeHVJQ0FnSUNBZ0lDQmtZWFJoTG14aGMzUWdQU0FoSVd4aGMzUTdYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tHTnZiblJsZUhSUVlYUm9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ1pHRjBZUzVqYjI1MFpYaDBVR0YwYUNBOUlHTnZiblJsZUhSUVlYUm9JQ3NnWm1sbGJHUTdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMElEMGdjbVYwSUNzZ1ptNG9ZMjl1ZEdWNGRGdG1hV1ZzWkYwc0lIdGNiaUFnSUNBZ0lDQWdaR0YwWVRvZ1pHRjBZU3hjYmlBZ0lDQWdJQ0FnWW14dlkydFFZWEpoYlhNNklHSnNiMk5yVUdGeVlXMXpLRnRqYjI1MFpYaDBXMlpwWld4a1hTd2dabWxsYkdSZExDQmJZMjl1ZEdWNGRGQmhkR2dnS3lCbWFXVnNaQ3dnYm5Wc2JGMHBYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvWTI5dWRHVjRkQ0FtSmlCMGVYQmxiMllnWTI5dWRHVjRkQ0E5UFQwZ0oyOWlhbVZqZENjcElIdGNiaUFnSUNBZ0lHbG1JQ2hwYzBGeWNtRjVLR052Ym5SbGVIUXBLU0I3WEc0Z0lDQWdJQ0FnSUdadmNpQW9iR1YwSUdvZ1BTQmpiMjUwWlhoMExteGxibWQwYURzZ2FTQThJR283SUdrckt5a2dlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHBJR2x1SUdOdmJuUmxlSFFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1Y0WldOSmRHVnlZWFJwYjI0b2FTd2dhU3dnYVNBOVBUMGdZMjl1ZEdWNGRDNXNaVzVuZEdnZ0xTQXhLVHRjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lHeGxkQ0J3Y21sdmNrdGxlVHRjYmx4dUlDQWdJQ0FnSUNCbWIzSWdLR3hsZENCclpYa2dhVzRnWTI5dWRHVjRkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2hqYjI1MFpYaDBMbWhoYzA5M2JsQnliM0JsY25SNUtHdGxlU2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUZkbEozSmxJSEoxYm01cGJtY2dkR2hsSUdsMFpYSmhkR2x2Ym5NZ2IyNWxJSE4wWlhBZ2IzVjBJRzltSUhONWJtTWdjMjhnZDJVZ1kyRnVJR1JsZEdWamRGeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2RHaGxJR3hoYzNRZ2FYUmxjbUYwYVc5dUlIZHBkR2h2ZFhRZ2FHRjJaU0IwYnlCelkyRnVJSFJvWlNCdlltcGxZM1FnZEhkcFkyVWdZVzVrSUdOeVpXRjBaVnh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdZVzRnYVhSbGNtMWxaR2xoZEdVZ2EyVjVjeUJoY25KaGVTNWNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHdjbWx2Y2t0bGVTQWhQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdWNFpXTkpkR1Z5WVhScGIyNG9jSEpwYjNKTFpYa3NJR2tnTFNBeEtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQWdJSEJ5YVc5eVMyVjVJRDBnYTJWNU8xeHVJQ0FnSUNBZ0lDQWdJQ0FnYVNzck8xeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCcFppQW9jSEpwYjNKTFpYa2dJVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR1Y0WldOSmRHVnlZWFJwYjI0b2NISnBiM0pMWlhrc0lHa2dMU0F4TENCMGNuVmxLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNocElEMDlQU0F3S1NCN1hHNGdJQ0FnSUNCeVpYUWdQU0JwYm5abGNuTmxLSFJvYVhNcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUJ5WlhRN1hHNGdJSDBwTzF4dWZWeHVJaXdpYVcxd2IzSjBJRVY0WTJWd2RHbHZiaUJtY205dElDY3VMaTlsZUdObGNIUnBiMjRuTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlocGJuTjBZVzVqWlNrZ2UxeHVJQ0JwYm5OMFlXNWpaUzV5WldkcGMzUmxja2hsYkhCbGNpZ25hR1ZzY0dWeVRXbHpjMmx1Wnljc0lHWjFibU4wYVc5dUtDOHFJRnRoY21kekxDQmRiM0IwYVc5dWN5QXFMeWtnZTF4dUlDQWdJR2xtSUNoaGNtZDFiV1Z1ZEhNdWJHVnVaM1JvSUQwOVBTQXhLU0I3WEc0Z0lDQWdJQ0F2THlCQklHMXBjM05wYm1jZ1ptbGxiR1FnYVc0Z1lTQjdlMlp2YjMxOUlHTnZibk4wY25WamRDNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMWJtUmxabWx1WldRN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQzh2SUZOdmJXVnZibVVnYVhNZ1lXTjBkV0ZzYkhrZ2RISjVhVzVuSUhSdklHTmhiR3dnYzI5dFpYUm9hVzVuTENCaWJHOTNJSFZ3TGx4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWNFkyVndkR2x2YmlnblRXbHpjMmx1WnlCb1pXeHdaWEk2SUZ3aUp5QXJJR0Z5WjNWdFpXNTBjMXRoY21kMWJXVnVkSE11YkdWdVozUm9JQzBnTVYwdWJtRnRaU0FySUNkY0lpY3BPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNTlYRzRpTENKcGJYQnZjblFnZTJselJXMXdkSGtzSUdselJuVnVZM1JwYjI1OUlHWnliMjBnSnk0dUwzVjBhV3h6Snp0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1puVnVZM1JwYjI0b2FXNXpkR0Z1WTJVcElIdGNiaUFnYVc1emRHRnVZMlV1Y21WbmFYTjBaWEpJWld4d1pYSW9KMmxtSnl3Z1puVnVZM1JwYjI0b1kyOXVaR2wwYVc5dVlXd3NJRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQnBaaUFvYVhOR2RXNWpkR2x2YmloamIyNWthWFJwYjI1aGJDa3BJSHNnWTI5dVpHbDBhVzl1WVd3Z1BTQmpiMjVrYVhScGIyNWhiQzVqWVd4c0tIUm9hWE1wT3lCOVhHNWNiaUFnSUNBdkx5QkVaV1poZFd4MElHSmxhR0YyYVc5eUlHbHpJSFJ2SUhKbGJtUmxjaUIwYUdVZ2NHOXphWFJwZG1VZ2NHRjBhQ0JwWmlCMGFHVWdkbUZzZFdVZ2FYTWdkSEoxZEdoNUlHRnVaQ0J1YjNRZ1pXMXdkSGt1WEc0Z0lDQWdMeThnVkdobElHQnBibU5zZFdSbFdtVnliMkFnYjNCMGFXOXVJRzFoZVNCaVpTQnpaWFFnZEc4Z2RISmxZWFFnZEdobElHTnZibVIwYVc5dVlXd2dZWE1nY0hWeVpXeDVJRzV2ZENCbGJYQjBlU0JpWVhObFpDQnZiaUIwYUdWY2JpQWdJQ0F2THlCaVpXaGhkbWx2Y2lCdlppQnBjMFZ0Y0hSNUxpQkZabVpsWTNScGRtVnNlU0IwYUdseklHUmxkR1Z5YldsdVpYTWdhV1lnTUNCcGN5Qm9ZVzVrYkdWa0lHSjVJSFJvWlNCd2IzTnBkR2wyWlNCd1lYUm9JRzl5SUc1bFoyRjBhWFpsTGx4dUlDQWdJR2xtSUNnb0lXOXdkR2x2Ym5NdWFHRnphQzVwYm1Oc2RXUmxXbVZ5YnlBbUppQWhZMjl1WkdsMGFXOXVZV3dwSUh4OElHbHpSVzF3ZEhrb1kyOXVaR2wwYVc5dVlXd3BLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdiM0IwYVc5dWN5NXBiblpsY25ObEtIUm9hWE1wTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2IzQjBhVzl1Y3k1bWJpaDBhR2x6S1R0Y2JpQWdJQ0I5WEc0Z0lIMHBPMXh1WEc0Z0lHbHVjM1JoYm1ObExuSmxaMmx6ZEdWeVNHVnNjR1Z5S0NkMWJteGxjM01uTENCbWRXNWpkR2x2YmloamIyNWthWFJwYjI1aGJDd2diM0IwYVc5dWN5a2dlMXh1SUNBZ0lISmxkSFZ5YmlCcGJuTjBZVzVqWlM1b1pXeHdaWEp6V3lkcFppZGRMbU5oYkd3b2RHaHBjeXdnWTI5dVpHbDBhVzl1WVd3c0lIdG1iam9nYjNCMGFXOXVjeTVwYm5abGNuTmxMQ0JwYm5abGNuTmxPaUJ2Y0hScGIyNXpMbVp1TENCb1lYTm9PaUJ2Y0hScGIyNXpMbWhoYzJoOUtUdGNiaUFnZlNrN1hHNTlYRzRpTENKbGVIQnZjblFnWkdWbVlYVnNkQ0JtZFc1amRHbHZiaWhwYm5OMFlXNWpaU2tnZTF4dUlDQnBibk4wWVc1alpTNXlaV2RwYzNSbGNraGxiSEJsY2lnbmJHOW5KeXdnWm5WdVkzUnBiMjRvTHlvZ2JXVnpjMkZuWlN3Z2IzQjBhVzl1Y3lBcUx5a2dlMXh1SUNBZ0lHeGxkQ0JoY21keklEMGdXM1Z1WkdWbWFXNWxaRjBzWEc0Z0lDQWdJQ0FnSUc5d2RHbHZibk1nUFNCaGNtZDFiV1Z1ZEhOYllYSm5kVzFsYm5SekxteGxibWQwYUNBdElERmRPMXh1SUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dZWEpuZFcxbGJuUnpMbXhsYm1kMGFDQXRJREU3SUdrckt5a2dlMXh1SUNBZ0lDQWdZWEpuY3k1d2RYTm9LR0Z5WjNWdFpXNTBjMXRwWFNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYkdWMElHeGxkbVZzSUQwZ01UdGNiaUFnSUNCcFppQW9iM0IwYVc5dWN5NW9ZWE5vTG14bGRtVnNJQ0U5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJR3hsZG1Wc0lEMGdiM0IwYVc5dWN5NW9ZWE5vTG14bGRtVnNPMXh1SUNBZ0lIMGdaV3h6WlNCcFppQW9iM0IwYVc5dWN5NWtZWFJoSUNZbUlHOXdkR2x2Ym5NdVpHRjBZUzVzWlhabGJDQWhQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnNaWFpsYkNBOUlHOXdkR2x2Ym5NdVpHRjBZUzVzWlhabGJEdGNiaUFnSUNCOVhHNGdJQ0FnWVhKbmMxc3dYU0E5SUd4bGRtVnNPMXh1WEc0Z0lDQWdhVzV6ZEdGdVkyVXViRzluS0M0dUxpQmhjbWR6S1R0Y2JpQWdmU2s3WEc1OVhHNGlMQ0psZUhCdmNuUWdaR1ZtWVhWc2RDQm1kVzVqZEdsdmJpaHBibk4wWVc1alpTa2dlMXh1SUNCcGJuTjBZVzVqWlM1eVpXZHBjM1JsY2tobGJIQmxjaWduYkc5dmEzVndKeXdnWm5WdVkzUnBiMjRvYjJKcUxDQm1hV1ZzWkNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ2WW1vZ0ppWWdiMkpxVzJacFpXeGtYVHRjYmlBZ2ZTazdYRzU5WEc0aUxDSnBiWEJ2Y25RZ2UyRndjR1Z1WkVOdmJuUmxlSFJRWVhSb0xDQmliRzlqYTFCaGNtRnRjeXdnWTNKbFlYUmxSbkpoYldVc0lHbHpSVzF3ZEhrc0lHbHpSblZ1WTNScGIyNTlJR1p5YjIwZ0p5NHVMM1YwYVd4ekp6dGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdablZ1WTNScGIyNG9hVzV6ZEdGdVkyVXBJSHRjYmlBZ2FXNXpkR0Z1WTJVdWNtVm5hWE4wWlhKSVpXeHdaWElvSjNkcGRHZ25MQ0JtZFc1amRHbHZiaWhqYjI1MFpYaDBMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lDQWdhV1lnS0dselJuVnVZM1JwYjI0b1kyOXVkR1Y0ZENrcElIc2dZMjl1ZEdWNGRDQTlJR052Ym5SbGVIUXVZMkZzYkNoMGFHbHpLVHNnZlZ4dVhHNGdJQ0FnYkdWMElHWnVJRDBnYjNCMGFXOXVjeTVtYmp0Y2JseHVJQ0FnSUdsbUlDZ2hhWE5GYlhCMGVTaGpiMjUwWlhoMEtTa2dlMXh1SUNBZ0lDQWdiR1YwSUdSaGRHRWdQU0J2Y0hScGIyNXpMbVJoZEdFN1hHNGdJQ0FnSUNCcFppQW9iM0IwYVc5dWN5NWtZWFJoSUNZbUlHOXdkR2x2Ym5NdWFXUnpLU0I3WEc0Z0lDQWdJQ0FnSUdSaGRHRWdQU0JqY21WaGRHVkdjbUZ0WlNodmNIUnBiMjV6TG1SaGRHRXBPMXh1SUNBZ0lDQWdJQ0JrWVhSaExtTnZiblJsZUhSUVlYUm9JRDBnWVhCd1pXNWtRMjl1ZEdWNGRGQmhkR2dvYjNCMGFXOXVjeTVrWVhSaExtTnZiblJsZUhSUVlYUm9MQ0J2Y0hScGIyNXpMbWxrYzFzd1hTazdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQm1iaWhqYjI1MFpYaDBMQ0I3WEc0Z0lDQWdJQ0FnSUdSaGRHRTZJR1JoZEdFc1hHNGdJQ0FnSUNBZ0lHSnNiMk5yVUdGeVlXMXpPaUJpYkc5amExQmhjbUZ0Y3loYlkyOXVkR1Y0ZEYwc0lGdGtZWFJoSUNZbUlHUmhkR0V1WTI5dWRHVjRkRkJoZEdoZEtWeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ2Y0hScGIyNXpMbWx1ZG1WeWMyVW9kR2hwY3lrN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYm4xY2JpSXNJbWx0Y0c5eWRDQjdhVzVrWlhoUFpuMGdabkp2YlNBbkxpOTFkR2xzY3ljN1hHNWNibXhsZENCc2IyZG5aWElnUFNCN1hHNGdJRzFsZEdodlpFMWhjRG9nV3lka1pXSjFaeWNzSUNkcGJtWnZKeXdnSjNkaGNtNG5MQ0FuWlhKeWIzSW5YU3hjYmlBZ2JHVjJaV3c2SUNkcGJtWnZKeXhjYmx4dUlDQXZMeUJOWVhCeklHRWdaMmwyWlc0Z2JHVjJaV3dnZG1Gc2RXVWdkRzhnZEdobElHQnRaWFJvYjJSTllYQmdJR2x1WkdWNFpYTWdZV0p2ZG1VdVhHNGdJR3h2YjJ0MWNFeGxkbVZzT2lCbWRXNWpkR2x2Ymloc1pYWmxiQ2tnZTF4dUlDQWdJR2xtSUNoMGVYQmxiMllnYkdWMlpXd2dQVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNCc1pYUWdiR1YyWld4TllYQWdQU0JwYm1SbGVFOW1LR3h2WjJkbGNpNXRaWFJvYjJSTllYQXNJR3hsZG1Wc0xuUnZURzkzWlhKRFlYTmxLQ2twTzF4dUlDQWdJQ0FnYVdZZ0tHeGxkbVZzVFdGd0lENDlJREFwSUh0Y2JpQWdJQ0FnSUNBZ2JHVjJaV3dnUFNCc1pYWmxiRTFoY0R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUd4bGRtVnNJRDBnY0dGeWMyVkpiblFvYkdWMlpXd3NJREV3S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdiR1YyWld3N1hHNGdJSDBzWEc1Y2JpQWdMeThnUTJGdUlHSmxJRzkyWlhKeWFXUmtaVzRnYVc0Z2RHaGxJR2h2YzNRZ1pXNTJhWEp2Ym0xbGJuUmNiaUFnYkc5bk9pQm1kVzVqZEdsdmJpaHNaWFpsYkN3Z0xpNHViV1Z6YzJGblpTa2dlMXh1SUNBZ0lHeGxkbVZzSUQwZ2JHOW5aMlZ5TG14dmIydDFjRXhsZG1Wc0tHeGxkbVZzS1R0Y2JseHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ1kyOXVjMjlzWlNBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NnSmlZZ2JHOW5aMlZ5TG14dmIydDFjRXhsZG1Wc0tHeHZaMmRsY2k1c1pYWmxiQ2tnUEQwZ2JHVjJaV3dwSUh0Y2JpQWdJQ0FnSUd4bGRDQnRaWFJvYjJRZ1BTQnNiMmRuWlhJdWJXVjBhRzlrVFdGd1cyeGxkbVZzWFR0Y2JpQWdJQ0FnSUdsbUlDZ2hZMjl1YzI5c1pWdHRaWFJvYjJSZEtTQjdJQ0FnTHk4Z1pYTnNhVzUwTFdScGMyRmliR1V0YkdsdVpTQnVieTFqYjI1emIyeGxYRzRnSUNBZ0lDQWdJRzFsZEdodlpDQTlJQ2RzYjJjbk8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1kyOXVjMjlzWlZ0dFpYUm9iMlJkS0M0dUxtMWxjM05oWjJVcE95QWdJQ0F2THlCbGMyeHBiblF0WkdsellXSnNaUzFzYVc1bElHNXZMV052Ym5OdmJHVmNiaUFnSUNCOVhHNGdJSDFjYm4wN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHeHZaMmRsY2p0Y2JpSXNJaThxSUdkc2IySmhiQ0IzYVc1a2IzY2dLaTljYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1oxYm1OMGFXOXVLRWhoYm1Sc1pXSmhjbk1wSUh0Y2JpQWdMeW9nYVhOMFlXNWlkV3dnYVdkdWIzSmxJRzVsZUhRZ0tpOWNiaUFnYkdWMElISnZiM1FnUFNCMGVYQmxiMllnWjJ4dlltRnNJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5QS9JR2RzYjJKaGJDQTZJSGRwYm1SdmR5eGNiaUFnSUNBZ0lDUklZVzVrYkdWaVlYSnpJRDBnY205dmRDNUlZVzVrYkdWaVlYSnpPMXh1SUNBdktpQnBjM1JoYm1KMWJDQnBaMjV2Y21VZ2JtVjRkQ0FxTDF4dUlDQklZVzVrYkdWaVlYSnpMbTV2UTI5dVpteHBZM1FnUFNCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCcFppQW9jbTl2ZEM1SVlXNWtiR1ZpWVhKeklEMDlQU0JJWVc1a2JHVmlZWEp6S1NCN1hHNGdJQ0FnSUNCeWIyOTBMa2hoYm1Sc1pXSmhjbk1nUFNBa1NHRnVaR3hsWW1GeWN6dGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJRWhoYm1Sc1pXSmhjbk03WEc0Z0lIMDdYRzU5WEc0aUxDSnBiWEJ2Y25RZ0tpQmhjeUJWZEdsc2N5Qm1jbTl0SUNjdUwzVjBhV3h6Snp0Y2JtbHRjRzl5ZENCRmVHTmxjSFJwYjI0Z1puSnZiU0FuTGk5bGVHTmxjSFJwYjI0bk8xeHVhVzF3YjNKMElIc2dRMDlOVUVsTVJWSmZVa1ZXU1ZOSlQwNHNJRkpGVmtsVFNVOU9YME5JUVU1SFJWTXNJR055WldGMFpVWnlZVzFsSUgwZ1puSnZiU0FuTGk5aVlYTmxKenRjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdOb1pXTnJVbVYyYVhOcGIyNG9ZMjl0Y0dsc1pYSkpibVp2S1NCN1hHNGdJR052Ym5OMElHTnZiWEJwYkdWeVVtVjJhWE5wYjI0Z1BTQmpiMjF3YVd4bGNrbHVabThnSmlZZ1kyOXRjR2xzWlhKSmJtWnZXekJkSUh4OElERXNYRzRnSUNBZ0lDQWdJR04xY25KbGJuUlNaWFpwYzJsdmJpQTlJRU5QVFZCSlRFVlNYMUpGVmtsVFNVOU9PMXh1WEc0Z0lHbG1JQ2hqYjIxd2FXeGxjbEpsZG1semFXOXVJQ0U5UFNCamRYSnlaVzUwVW1WMmFYTnBiMjRwSUh0Y2JpQWdJQ0JwWmlBb1kyOXRjR2xzWlhKU1pYWnBjMmx2YmlBOElHTjFjbkpsYm5SU1pYWnBjMmx2YmlrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY25WdWRHbHRaVlpsY25OcGIyNXpJRDBnVWtWV1NWTkpUMDVmUTBoQlRrZEZVMXRqZFhKeVpXNTBVbVYyYVhOcGIyNWRMRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXRjR2xzWlhKV1pYSnphVzl1Y3lBOUlGSkZWa2xUU1U5T1gwTklRVTVIUlZOYlkyOXRjR2xzWlhKU1pYWnBjMmx2YmwwN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYaGpaWEIwYVc5dUtDZFVaVzF3YkdGMFpTQjNZWE1nY0hKbFkyOXRjR2xzWldRZ2QybDBhQ0JoYmlCdmJHUmxjaUIyWlhKemFXOXVJRzltSUVoaGJtUnNaV0poY25NZ2RHaGhiaUIwYUdVZ1kzVnljbVZ1ZENCeWRXNTBhVzFsTGlBbklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNkUWJHVmhjMlVnZFhCa1lYUmxJSGx2ZFhJZ2NISmxZMjl0Y0dsc1pYSWdkRzhnWVNCdVpYZGxjaUIyWlhKemFXOXVJQ2duSUNzZ2NuVnVkR2x0WlZabGNuTnBiMjV6SUNzZ0p5a2diM0lnWkc5M2JtZHlZV1JsSUhsdmRYSWdjblZ1ZEdsdFpTQjBieUJoYmlCdmJHUmxjaUIyWlhKemFXOXVJQ2duSUNzZ1kyOXRjR2xzWlhKV1pYSnphVzl1Y3lBcklDY3BMaWNwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQXZMeUJWYzJVZ2RHaGxJR1Z0WW1Wa1pHVmtJSFpsY25OcGIyNGdhVzVtYnlCemFXNWpaU0IwYUdVZ2NuVnVkR2x0WlNCa2IyVnpiaWQwSUd0dWIzY2dZV0p2ZFhRZ2RHaHBjeUJ5WlhacGMybHZiaUI1WlhSY2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmVHTmxjSFJwYjI0b0oxUmxiWEJzWVhSbElIZGhjeUJ3Y21WamIyMXdhV3hsWkNCM2FYUm9JR0VnYm1WM1pYSWdkbVZ5YzJsdmJpQnZaaUJJWVc1a2JHVmlZWEp6SUhSb1lXNGdkR2hsSUdOMWNuSmxiblFnY25WdWRHbHRaUzRnSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuVUd4bFlYTmxJSFZ3WkdGMFpTQjViM1Z5SUhKMWJuUnBiV1VnZEc4Z1lTQnVaWGRsY2lCMlpYSnphVzl1SUNnbklDc2dZMjl0Y0dsc1pYSkpibVp2V3pGZElDc2dKeWt1SnlrN1hHNGdJQ0FnZlZ4dUlDQjlYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCMFpXMXdiR0YwWlNoMFpXMXdiR0YwWlZOd1pXTXNJR1Z1ZGlrZ2UxeHVJQ0F2S2lCcGMzUmhibUoxYkNCcFoyNXZjbVVnYm1WNGRDQXFMMXh1SUNCcFppQW9JV1Z1ZGlrZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCRmVHTmxjSFJwYjI0b0owNXZJR1Z1ZG1seWIyNXRaVzUwSUhCaGMzTmxaQ0IwYnlCMFpXMXdiR0YwWlNjcE8xeHVJQ0I5WEc0Z0lHbG1JQ2doZEdWdGNHeGhkR1ZUY0dWaklIeDhJQ0YwWlcxd2JHRjBaVk53WldNdWJXRnBiaWtnZTF4dUlDQWdJSFJvY205M0lHNWxkeUJGZUdObGNIUnBiMjRvSjFWdWEyNXZkMjRnZEdWdGNHeGhkR1VnYjJKcVpXTjBPaUFuSUNzZ2RIbHdaVzltSUhSbGJYQnNZWFJsVTNCbFl5azdYRzRnSUgxY2JseHVJQ0IwWlcxd2JHRjBaVk53WldNdWJXRnBiaTVrWldOdmNtRjBiM0lnUFNCMFpXMXdiR0YwWlZOd1pXTXViV0ZwYmw5a08xeHVYRzRnSUM4dklFNXZkR1U2SUZWemFXNW5JR1Z1ZGk1V1RTQnlaV1psY21WdVkyVnpJSEpoZEdobGNpQjBhR0Z1SUd4dlkyRnNJSFpoY2lCeVpXWmxjbVZ1WTJWeklIUm9jbTkxWjJodmRYUWdkR2hwY3lCelpXTjBhVzl1SUhSdklHRnNiRzkzWEc0Z0lDOHZJR1p2Y2lCbGVIUmxjbTVoYkNCMWMyVnljeUIwYnlCdmRtVnljbWxrWlNCMGFHVnpaU0JoY3lCd2MzVmxaRzh0YzNWd2NHOXlkR1ZrSUVGUVNYTXVYRzRnSUdWdWRpNVdUUzVqYUdWamExSmxkbWx6YVc5dUtIUmxiWEJzWVhSbFUzQmxZeTVqYjIxd2FXeGxjaWs3WEc1Y2JpQWdablZ1WTNScGIyNGdhVzUyYjJ0bFVHRnlkR2xoYkZkeVlYQndaWElvY0dGeWRHbGhiQ3dnWTI5dWRHVjRkQ3dnYjNCMGFXOXVjeWtnZTF4dUlDQWdJR2xtSUNodmNIUnBiMjV6TG1oaGMyZ3BJSHRjYmlBZ0lDQWdJR052Ym5SbGVIUWdQU0JWZEdsc2N5NWxlSFJsYm1Rb2UzMHNJR052Ym5SbGVIUXNJRzl3ZEdsdmJuTXVhR0Z6YUNrN1hHNGdJQ0FnSUNCcFppQW9iM0IwYVc5dWN5NXBaSE1wSUh0Y2JpQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1cFpITmJNRjBnUFNCMGNuVmxPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lIQmhjblJwWVd3Z1BTQmxibll1VmswdWNtVnpiMngyWlZCaGNuUnBZV3d1WTJGc2JDaDBhR2x6TENCd1lYSjBhV0ZzTENCamIyNTBaWGgwTENCdmNIUnBiMjV6S1R0Y2JpQWdJQ0JzWlhRZ2NtVnpkV3gwSUQwZ1pXNTJMbFpOTG1sdWRtOXJaVkJoY25ScFlXd3VZMkZzYkNoMGFHbHpMQ0J3WVhKMGFXRnNMQ0JqYjI1MFpYaDBMQ0J2Y0hScGIyNXpLVHRjYmx4dUlDQWdJR2xtSUNoeVpYTjFiSFFnUFQwZ2JuVnNiQ0FtSmlCbGJuWXVZMjl0Y0dsc1pTa2dlMXh1SUNBZ0lDQWdiM0IwYVc5dWN5NXdZWEowYVdGc2MxdHZjSFJwYjI1ekxtNWhiV1ZkSUQwZ1pXNTJMbU52YlhCcGJHVW9jR0Z5ZEdsaGJDd2dkR1Z0Y0d4aGRHVlRjR1ZqTG1OdmJYQnBiR1Z5VDNCMGFXOXVjeXdnWlc1MktUdGNiaUFnSUNBZ0lISmxjM1ZzZENBOUlHOXdkR2x2Ym5NdWNHRnlkR2xoYkhOYmIzQjBhVzl1Y3k1dVlXMWxYU2hqYjI1MFpYaDBMQ0J2Y0hScGIyNXpLVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLSEpsYzNWc2RDQWhQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnBaaUFvYjNCMGFXOXVjeTVwYm1SbGJuUXBJSHRjYmlBZ0lDQWdJQ0FnYkdWMElHeHBibVZ6SUQwZ2NtVnpkV3gwTG5Od2JHbDBLQ2RjWEc0bktUdGNiaUFnSUNBZ0lDQWdabTl5SUNoc1pYUWdhU0E5SURBc0lHd2dQU0JzYVc1bGN5NXNaVzVuZEdnN0lHa2dQQ0JzT3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9JV3hwYm1WelcybGRJQ1ltSUdrZ0t5QXhJRDA5UFNCc0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0JzYVc1bGMxdHBYU0E5SUc5d2RHbHZibk11YVc1a1pXNTBJQ3NnYkdsdVpYTmJhVjA3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2NtVnpkV3gwSUQwZ2JHbHVaWE11YW05cGJpZ25YRnh1SnlrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYaGpaWEIwYVc5dUtDZFVhR1VnY0dGeWRHbGhiQ0FuSUNzZ2IzQjBhVzl1Y3k1dVlXMWxJQ3NnSnlCamIzVnNaQ0J1YjNRZ1ltVWdZMjl0Y0dsc1pXUWdkMmhsYmlCeWRXNXVhVzVuSUdsdUlISjFiblJwYldVdGIyNXNlU0J0YjJSbEp5azdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeThnU25WemRDQmhaR1FnZDJGMFpYSmNiaUFnYkdWMElHTnZiblJoYVc1bGNpQTlJSHRjYmlBZ0lDQnpkSEpwWTNRNklHWjFibU4wYVc5dUtHOWlhaXdnYm1GdFpTa2dlMXh1SUNBZ0lDQWdhV1lnS0NFb2JtRnRaU0JwYmlCdlltb3BLU0I3WEc0Z0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmVHTmxjSFJwYjI0b0oxd2lKeUFySUc1aGJXVWdLeUFuWENJZ2JtOTBJR1JsWm1sdVpXUWdhVzRnSnlBcklHOWlhaWs3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdiMkpxVzI1aGJXVmRPMXh1SUNBZ0lIMHNYRzRnSUNBZ2JHOXZhM1Z3T2lCbWRXNWpkR2x2Ymloa1pYQjBhSE1zSUc1aGJXVXBJSHRjYmlBZ0lDQWdJR052Ym5OMElHeGxiaUE5SUdSbGNIUm9jeTVzWlc1bmRHZzdYRzRnSUNBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJR3hsYmpzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaGtaWEIwYUhOYmFWMGdKaVlnWkdWd2RHaHpXMmxkVzI1aGJXVmRJQ0U5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWkdWd2RHaHpXMmxkVzI1aGJXVmRPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU3hjYmlBZ0lDQnNZVzFpWkdFNklHWjFibU4wYVc5dUtHTjFjbkpsYm5Rc0lHTnZiblJsZUhRcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGVYQmxiMllnWTNWeWNtVnVkQ0E5UFQwZ0oyWjFibU4wYVc5dUp5QS9JR04xY25KbGJuUXVZMkZzYkNoamIyNTBaWGgwS1NBNklHTjFjbkpsYm5RN1hHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdWelkyRndaVVY0Y0hKbGMzTnBiMjQ2SUZWMGFXeHpMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNHNYRzRnSUNBZ2FXNTJiMnRsVUdGeWRHbGhiRG9nYVc1MmIydGxVR0Z5ZEdsaGJGZHlZWEJ3WlhJc1hHNWNiaUFnSUNCbWJqb2dablZ1WTNScGIyNG9hU2tnZTF4dUlDQWdJQ0FnYkdWMElISmxkQ0E5SUhSbGJYQnNZWFJsVTNCbFkxdHBYVHRjYmlBZ0lDQWdJSEpsZEM1a1pXTnZjbUYwYjNJZ1BTQjBaVzF3YkdGMFpWTndaV05iYVNBcklDZGZaQ2RkTzF4dUlDQWdJQ0FnY21WMGRYSnVJSEpsZER0Y2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnY0hKdlozSmhiWE02SUZ0ZExGeHVJQ0FnSUhCeWIyZHlZVzA2SUdaMWJtTjBhVzl1S0drc0lHUmhkR0VzSUdSbFkyeGhjbVZrUW14dlkydFFZWEpoYlhNc0lHSnNiMk5yVUdGeVlXMXpMQ0JrWlhCMGFITXBJSHRjYmlBZ0lDQWdJR3hsZENCd2NtOW5jbUZ0VjNKaGNIQmxjaUE5SUhSb2FYTXVjSEp2WjNKaGJYTmJhVjBzWEc0Z0lDQWdJQ0FnSUNBZ1ptNGdQU0IwYUdsekxtWnVLR2twTzF4dUlDQWdJQ0FnYVdZZ0tHUmhkR0VnZkh3Z1pHVndkR2h6SUh4OElHSnNiMk5yVUdGeVlXMXpJSHg4SUdSbFkyeGhjbVZrUW14dlkydFFZWEpoYlhNcElIdGNiaUFnSUNBZ0lDQWdjSEp2WjNKaGJWZHlZWEJ3WlhJZ1BTQjNjbUZ3VUhKdlozSmhiU2gwYUdsekxDQnBMQ0JtYml3Z1pHRjBZU3dnWkdWamJHRnlaV1JDYkc5amExQmhjbUZ0Y3l3Z1lteHZZMnRRWVhKaGJYTXNJR1JsY0hSb2N5azdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLQ0Z3Y205bmNtRnRWM0poY0hCbGNpa2dlMXh1SUNBZ0lDQWdJQ0J3Y205bmNtRnRWM0poY0hCbGNpQTlJSFJvYVhNdWNISnZaM0poYlhOYmFWMGdQU0IzY21Gd1VISnZaM0poYlNoMGFHbHpMQ0JwTENCbWJpazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnlaWFIxY200Z2NISnZaM0poYlZkeVlYQndaWEk3WEc0Z0lDQWdmU3hjYmx4dUlDQWdJR1JoZEdFNklHWjFibU4wYVc5dUtIWmhiSFZsTENCa1pYQjBhQ2tnZTF4dUlDQWdJQ0FnZDJocGJHVWdLSFpoYkhWbElDWW1JR1JsY0hSb0xTMHBJSHRjYmlBZ0lDQWdJQ0FnZG1Gc2RXVWdQU0IyWVd4MVpTNWZjR0Z5Wlc1ME8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2NtVjBkWEp1SUhaaGJIVmxPMXh1SUNBZ0lIMHNYRzRnSUNBZ2JXVnlaMlU2SUdaMWJtTjBhVzl1S0hCaGNtRnRMQ0JqYjIxdGIyNHBJSHRjYmlBZ0lDQWdJR3hsZENCdlltb2dQU0J3WVhKaGJTQjhmQ0JqYjIxdGIyNDdYRzVjYmlBZ0lDQWdJR2xtSUNod1lYSmhiU0FtSmlCamIyMXRiMjRnSmlZZ0tIQmhjbUZ0SUNFOVBTQmpiMjF0YjI0cEtTQjdYRzRnSUNBZ0lDQWdJRzlpYWlBOUlGVjBhV3h6TG1WNGRHVnVaQ2g3ZlN3Z1kyOXRiVzl1TENCd1lYSmhiU2s3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUJ2WW1vN1hHNGdJQ0FnZlN4Y2JseHVJQ0FnSUc1dmIzQTZJR1Z1ZGk1V1RTNXViMjl3TEZ4dUlDQWdJR052YlhCcGJHVnlTVzVtYnpvZ2RHVnRjR3hoZEdWVGNHVmpMbU52YlhCcGJHVnlYRzRnSUgwN1hHNWNiaUFnWm5WdVkzUnBiMjRnY21WMEtHTnZiblJsZUhRc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJR3hsZENCa1lYUmhJRDBnYjNCMGFXOXVjeTVrWVhSaE8xeHVYRzRnSUNBZ2NtVjBMbDl6WlhSMWNDaHZjSFJwYjI1ektUdGNiaUFnSUNCcFppQW9JVzl3ZEdsdmJuTXVjR0Z5ZEdsaGJDQW1KaUIwWlcxd2JHRjBaVk53WldNdWRYTmxSR0YwWVNrZ2UxeHVJQ0FnSUNBZ1pHRjBZU0E5SUdsdWFYUkVZWFJoS0dOdmJuUmxlSFFzSUdSaGRHRXBPMXh1SUNBZ0lIMWNiaUFnSUNCc1pYUWdaR1Z3ZEdoekxGeHVJQ0FnSUNBZ0lDQmliRzlqYTFCaGNtRnRjeUE5SUhSbGJYQnNZWFJsVTNCbFl5NTFjMlZDYkc5amExQmhjbUZ0Y3lBL0lGdGRJRG9nZFc1a1pXWnBibVZrTzF4dUlDQWdJR2xtSUNoMFpXMXdiR0YwWlZOd1pXTXVkWE5sUkdWd2RHaHpLU0I3WEc0Z0lDQWdJQ0JwWmlBb2IzQjBhVzl1Y3k1a1pYQjBhSE1wSUh0Y2JpQWdJQ0FnSUNBZ1pHVndkR2h6SUQwZ1kyOXVkR1Y0ZENBaFBTQnZjSFJwYjI1ekxtUmxjSFJvYzFzd1hTQS9JRnRqYjI1MFpYaDBYUzVqYjI1allYUW9iM0IwYVc5dWN5NWtaWEIwYUhNcElEb2diM0IwYVc5dWN5NWtaWEIwYUhNN1hHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCa1pYQjBhSE1nUFNCYlkyOXVkR1Y0ZEYwN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWm5WdVkzUnBiMjRnYldGcGJpaGpiMjUwWlhoMEx5b3NJRzl3ZEdsdmJuTXFMeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2NuSUNzZ2RHVnRjR3hoZEdWVGNHVmpMbTFoYVc0b1kyOXVkR0ZwYm1WeUxDQmpiMjUwWlhoMExDQmpiMjUwWVdsdVpYSXVhR1ZzY0dWeWN5d2dZMjl1ZEdGcGJtVnlMbkJoY25ScFlXeHpMQ0JrWVhSaExDQmliRzlqYTFCaGNtRnRjeXdnWkdWd2RHaHpLVHRjYmlBZ0lDQjlYRzRnSUNBZ2JXRnBiaUE5SUdWNFpXTjFkR1ZFWldOdmNtRjBiM0p6S0hSbGJYQnNZWFJsVTNCbFl5NXRZV2x1TENCdFlXbHVMQ0JqYjI1MFlXbHVaWElzSUc5d2RHbHZibk11WkdWd2RHaHpJSHg4SUZ0ZExDQmtZWFJoTENCaWJHOWphMUJoY21GdGN5azdYRzRnSUNBZ2NtVjBkWEp1SUcxaGFXNG9ZMjl1ZEdWNGRDd2diM0IwYVc5dWN5azdYRzRnSUgxY2JpQWdjbVYwTG1selZHOXdJRDBnZEhKMVpUdGNibHh1SUNCeVpYUXVYM05sZEhWd0lEMGdablZ1WTNScGIyNG9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lHbG1JQ2doYjNCMGFXOXVjeTV3WVhKMGFXRnNLU0I3WEc0Z0lDQWdJQ0JqYjI1MFlXbHVaWEl1YUdWc2NHVnljeUE5SUdOdmJuUmhhVzVsY2k1dFpYSm5aU2h2Y0hScGIyNXpMbWhsYkhCbGNuTXNJR1Z1ZGk1b1pXeHdaWEp6S1R0Y2JseHVJQ0FnSUNBZ2FXWWdLSFJsYlhCc1lYUmxVM0JsWXk1MWMyVlFZWEowYVdGc0tTQjdYRzRnSUNBZ0lDQWdJR052Ym5SaGFXNWxjaTV3WVhKMGFXRnNjeUE5SUdOdmJuUmhhVzVsY2k1dFpYSm5aU2h2Y0hScGIyNXpMbkJoY25ScFlXeHpMQ0JsYm5ZdWNHRnlkR2xoYkhNcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2FXWWdLSFJsYlhCc1lYUmxVM0JsWXk1MWMyVlFZWEowYVdGc0lIeDhJSFJsYlhCc1lYUmxVM0JsWXk1MWMyVkVaV052Y21GMGIzSnpLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuUmhhVzVsY2k1a1pXTnZjbUYwYjNKeklEMGdZMjl1ZEdGcGJtVnlMbTFsY21kbEtHOXdkR2x2Ym5NdVpHVmpiM0poZEc5eWN5d2daVzUyTG1SbFkyOXlZWFJ2Y25NcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JqYjI1MFlXbHVaWEl1YUdWc2NHVnljeUE5SUc5d2RHbHZibk11YUdWc2NHVnljenRjYmlBZ0lDQWdJR052Ym5SaGFXNWxjaTV3WVhKMGFXRnNjeUE5SUc5d2RHbHZibk11Y0dGeWRHbGhiSE03WEc0Z0lDQWdJQ0JqYjI1MFlXbHVaWEl1WkdWamIzSmhkRzl5Y3lBOUlHOXdkR2x2Ym5NdVpHVmpiM0poZEc5eWN6dGNiaUFnSUNCOVhHNGdJSDA3WEc1Y2JpQWdjbVYwTGw5amFHbHNaQ0E5SUdaMWJtTjBhVzl1S0drc0lHUmhkR0VzSUdKc2IyTnJVR0Z5WVcxekxDQmtaWEIwYUhNcElIdGNiaUFnSUNCcFppQW9kR1Z0Y0d4aGRHVlRjR1ZqTG5WelpVSnNiMk5yVUdGeVlXMXpJQ1ltSUNGaWJHOWphMUJoY21GdGN5a2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVY0WTJWd2RHbHZiaWduYlhWemRDQndZWE56SUdKc2IyTnJJSEJoY21GdGN5Y3BPMXh1SUNBZ0lIMWNiaUFnSUNCcFppQW9kR1Z0Y0d4aGRHVlRjR1ZqTG5WelpVUmxjSFJvY3lBbUppQWhaR1Z3ZEdoektTQjdYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWGhqWlhCMGFXOXVLQ2R0ZFhOMElIQmhjM01nY0dGeVpXNTBJR1JsY0hSb2N5Y3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCM2NtRndVSEp2WjNKaGJTaGpiMjUwWVdsdVpYSXNJR2tzSUhSbGJYQnNZWFJsVTNCbFkxdHBYU3dnWkdGMFlTd2dNQ3dnWW14dlkydFFZWEpoYlhNc0lHUmxjSFJvY3lrN1hHNGdJSDA3WEc0Z0lISmxkSFZ5YmlCeVpYUTdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCM2NtRndVSEp2WjNKaGJTaGpiMjUwWVdsdVpYSXNJR2tzSUdadUxDQmtZWFJoTENCa1pXTnNZWEpsWkVKc2IyTnJVR0Z5WVcxekxDQmliRzlqYTFCaGNtRnRjeXdnWkdWd2RHaHpLU0I3WEc0Z0lHWjFibU4wYVc5dUlIQnliMmNvWTI5dWRHVjRkQ3dnYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ2JHVjBJR04xY25KbGJuUkVaWEIwYUhNZ1BTQmtaWEIwYUhNN1hHNGdJQ0FnYVdZZ0tHUmxjSFJvY3lBbUppQmpiMjUwWlhoMElDRTlJR1JsY0hSb2Mxc3dYU2tnZTF4dUlDQWdJQ0FnWTNWeWNtVnVkRVJsY0hSb2N5QTlJRnRqYjI1MFpYaDBYUzVqYjI1allYUW9aR1Z3ZEdoektUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnWm00b1kyOXVkR0ZwYm1WeUxGeHVJQ0FnSUNBZ0lDQmpiMjUwWlhoMExGeHVJQ0FnSUNBZ0lDQmpiMjUwWVdsdVpYSXVhR1ZzY0dWeWN5d2dZMjl1ZEdGcGJtVnlMbkJoY25ScFlXeHpMRnh1SUNBZ0lDQWdJQ0J2Y0hScGIyNXpMbVJoZEdFZ2ZId2daR0YwWVN4Y2JpQWdJQ0FnSUNBZ1lteHZZMnRRWVhKaGJYTWdKaVlnVzI5d2RHbHZibk11WW14dlkydFFZWEpoYlhOZExtTnZibU5oZENoaWJHOWphMUJoY21GdGN5a3NYRzRnSUNBZ0lDQWdJR04xY25KbGJuUkVaWEIwYUhNcE8xeHVJQ0I5WEc1Y2JpQWdjSEp2WnlBOUlHVjRaV04xZEdWRVpXTnZjbUYwYjNKektHWnVMQ0J3Y205bkxDQmpiMjUwWVdsdVpYSXNJR1JsY0hSb2N5d2daR0YwWVN3Z1lteHZZMnRRWVhKaGJYTXBPMXh1WEc0Z0lIQnliMmN1Y0hKdlozSmhiU0E5SUdrN1hHNGdJSEJ5YjJjdVpHVndkR2dnUFNCa1pYQjBhSE1nUHlCa1pYQjBhSE11YkdWdVozUm9JRG9nTUR0Y2JpQWdjSEp2Wnk1aWJHOWphMUJoY21GdGN5QTlJR1JsWTJ4aGNtVmtRbXh2WTJ0UVlYSmhiWE1nZkh3Z01EdGNiaUFnY21WMGRYSnVJSEJ5YjJjN1hHNTlYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJ5WlhOdmJIWmxVR0Z5ZEdsaGJDaHdZWEowYVdGc0xDQmpiMjUwWlhoMExDQnZjSFJwYjI1ektTQjdYRzRnSUdsbUlDZ2hjR0Z5ZEdsaGJDa2dlMXh1SUNBZ0lHbG1JQ2h2Y0hScGIyNXpMbTVoYldVZ1BUMDlJQ2RBY0dGeWRHbGhiQzFpYkc5amF5Y3BJSHRjYmlBZ0lDQWdJR3hsZENCa1lYUmhJRDBnYjNCMGFXOXVjeTVrWVhSaE8xeHVJQ0FnSUNBZ2QyaHBiR1VnS0dSaGRHRmJKM0JoY25ScFlXd3RZbXh2WTJzblhTQTlQVDBnYm05dmNDa2dlMXh1SUNBZ0lDQWdJQ0JrWVhSaElEMGdaR0YwWVM1ZmNHRnlaVzUwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnY0dGeWRHbGhiQ0E5SUdSaGRHRmJKM0JoY25ScFlXd3RZbXh2WTJzblhUdGNiaUFnSUNBZ0lHUmhkR0ZiSjNCaGNuUnBZV3d0WW14dlkyc25YU0E5SUc1dmIzQTdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhCaGNuUnBZV3dnUFNCdmNIUnBiMjV6TG5CaGNuUnBZV3h6VzI5d2RHbHZibk11Ym1GdFpWMDdYRzRnSUNBZ2ZWeHVJQ0I5SUdWc2MyVWdhV1lnS0NGd1lYSjBhV0ZzTG1OaGJHd2dKaVlnSVc5d2RHbHZibk11Ym1GdFpTa2dlMXh1SUNBZ0lDOHZJRlJvYVhNZ2FYTWdZU0JrZVc1aGJXbGpJSEJoY25ScFlXd2dkR2hoZENCeVpYUjFjbTVsWkNCaElITjBjbWx1WjF4dUlDQWdJRzl3ZEdsdmJuTXVibUZ0WlNBOUlIQmhjblJwWVd3N1hHNGdJQ0FnY0dGeWRHbGhiQ0E5SUc5d2RHbHZibk11Y0dGeWRHbGhiSE5iY0dGeWRHbGhiRjA3WEc0Z0lIMWNiaUFnY21WMGRYSnVJSEJoY25ScFlXdzdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCcGJuWnZhMlZRWVhKMGFXRnNLSEJoY25ScFlXd3NJR052Ym5SbGVIUXNJRzl3ZEdsdmJuTXBJSHRjYmlBZ2IzQjBhVzl1Y3k1d1lYSjBhV0ZzSUQwZ2RISjFaVHRjYmlBZ2FXWWdLRzl3ZEdsdmJuTXVhV1J6S1NCN1hHNGdJQ0FnYjNCMGFXOXVjeTVrWVhSaExtTnZiblJsZUhSUVlYUm9JRDBnYjNCMGFXOXVjeTVwWkhOYk1GMGdmSHdnYjNCMGFXOXVjeTVrWVhSaExtTnZiblJsZUhSUVlYUm9PMXh1SUNCOVhHNWNiaUFnYkdWMElIQmhjblJwWVd4Q2JHOWphenRjYmlBZ2FXWWdLRzl3ZEdsdmJuTXVabTRnSmlZZ2IzQjBhVzl1Y3k1bWJpQWhQVDBnYm05dmNDa2dlMXh1SUNBZ0lHOXdkR2x2Ym5NdVpHRjBZU0E5SUdOeVpXRjBaVVp5WVcxbEtHOXdkR2x2Ym5NdVpHRjBZU2s3WEc0Z0lDQWdjR0Z5ZEdsaGJFSnNiMk5ySUQwZ2IzQjBhVzl1Y3k1a1lYUmhXeWR3WVhKMGFXRnNMV0pzYjJOckoxMGdQU0J2Y0hScGIyNXpMbVp1TzF4dVhHNGdJQ0FnYVdZZ0tIQmhjblJwWVd4Q2JHOWpheTV3WVhKMGFXRnNjeWtnZTF4dUlDQWdJQ0FnYjNCMGFXOXVjeTV3WVhKMGFXRnNjeUE5SUZWMGFXeHpMbVY0ZEdWdVpDaDdmU3dnYjNCMGFXOXVjeTV3WVhKMGFXRnNjeXdnY0dGeWRHbGhiRUpzYjJOckxuQmhjblJwWVd4ektUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnBaaUFvY0dGeWRHbGhiQ0E5UFQwZ2RXNWtaV1pwYm1Wa0lDWW1JSEJoY25ScFlXeENiRzlqYXlrZ2UxeHVJQ0FnSUhCaGNuUnBZV3dnUFNCd1lYSjBhV0ZzUW14dlkyczdYRzRnSUgxY2JseHVJQ0JwWmlBb2NHRnlkR2xoYkNBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRVY0WTJWd2RHbHZiaWduVkdobElIQmhjblJwWVd3Z0p5QXJJRzl3ZEdsdmJuTXVibUZ0WlNBcklDY2dZMjkxYkdRZ2JtOTBJR0psSUdadmRXNWtKeWs3WEc0Z0lIMGdaV3h6WlNCcFppQW9jR0Z5ZEdsaGJDQnBibk4wWVc1alpXOW1JRVoxYm1OMGFXOXVLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIQmhjblJwWVd3b1kyOXVkR1Y0ZEN3Z2IzQjBhVzl1Y3lrN1hHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHNXZiM0FvS1NCN0lISmxkSFZ5YmlBbkp6c2dmVnh1WEc1bWRXNWpkR2x2YmlCcGJtbDBSR0YwWVNoamIyNTBaWGgwTENCa1lYUmhLU0I3WEc0Z0lHbG1JQ2doWkdGMFlTQjhmQ0FoS0NkeWIyOTBKeUJwYmlCa1lYUmhLU2tnZTF4dUlDQWdJR1JoZEdFZ1BTQmtZWFJoSUQ4Z1kzSmxZWFJsUm5KaGJXVW9aR0YwWVNrZ09pQjdmVHRjYmlBZ0lDQmtZWFJoTG5KdmIzUWdQU0JqYjI1MFpYaDBPMXh1SUNCOVhHNGdJSEpsZEhWeWJpQmtZWFJoTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJsZUdWamRYUmxSR1ZqYjNKaGRHOXljeWhtYml3Z2NISnZaeXdnWTI5dWRHRnBibVZ5TENCa1pYQjBhSE1zSUdSaGRHRXNJR0pzYjJOclVHRnlZVzF6S1NCN1hHNGdJR2xtSUNobWJpNWtaV052Y21GMGIzSXBJSHRjYmlBZ0lDQnNaWFFnY0hKdmNITWdQU0I3ZlR0Y2JpQWdJQ0J3Y205bklEMGdabTR1WkdWamIzSmhkRzl5S0hCeWIyY3NJSEJ5YjNCekxDQmpiMjUwWVdsdVpYSXNJR1JsY0hSb2N5QW1KaUJrWlhCMGFITmJNRjBzSUdSaGRHRXNJR0pzYjJOclVHRnlZVzF6TENCa1pYQjBhSE1wTzF4dUlDQWdJRlYwYVd4ekxtVjRkR1Z1WkNod2NtOW5MQ0J3Y205d2N5azdYRzRnSUgxY2JpQWdjbVYwZFhKdUlIQnliMmM3WEc1OVhHNGlMQ0l2THlCQ2RXbHNaQ0J2ZFhRZ2IzVnlJR0poYzJsaklGTmhabVZUZEhKcGJtY2dkSGx3WlZ4dVpuVnVZM1JwYjI0Z1UyRm1aVk4wY21sdVp5aHpkSEpwYm1jcElIdGNiaUFnZEdocGN5NXpkSEpwYm1jZ1BTQnpkSEpwYm1jN1hHNTlYRzVjYmxOaFptVlRkSEpwYm1jdWNISnZkRzkwZVhCbExuUnZVM1J5YVc1bklEMGdVMkZtWlZOMGNtbHVaeTV3Y205MGIzUjVjR1V1ZEc5SVZFMU1JRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJSEpsZEhWeWJpQW5KeUFySUhSb2FYTXVjM1J5YVc1bk8xeHVmVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVTJGbVpWTjBjbWx1Wnp0Y2JpSXNJbU52Ym5OMElHVnpZMkZ3WlNBOUlIdGNiaUFnSnlZbk9pQW5KbUZ0Y0RzbkxGeHVJQ0FuUENjNklDY21iSFE3Snl4Y2JpQWdKejRuT2lBbkptZDBPeWNzWEc0Z0lDZGNJaWM2SUNjbWNYVnZkRHNuTEZ4dUlDQmNJaWRjSWpvZ0p5WWplREkzT3ljc1hHNGdJQ2RnSnpvZ0p5WWplRFl3T3ljc1hHNGdJQ2M5SnpvZ0p5WWplRE5FT3lkY2JuMDdYRzVjYm1OdmJuTjBJR0poWkVOb1lYSnpJRDBnTDFzbVBENWNJaWRnUFYwdlp5eGNiaUFnSUNBZ0lIQnZjM05wWW14bElEMGdMMXNtUEQ1Y0lpZGdQVjB2TzF4dVhHNW1kVzVqZEdsdmJpQmxjMk5oY0dWRGFHRnlLR05vY2lrZ2UxeHVJQ0J5WlhSMWNtNGdaWE5qWVhCbFcyTm9jbDA3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmxlSFJsYm1Rb2IySnFMeW9nTENBdUxpNXpiM1Z5WTJVZ0tpOHBJSHRjYmlBZ1ptOXlJQ2hzWlhRZ2FTQTlJREU3SUdrZ1BDQmhjbWQxYldWdWRITXViR1Z1WjNSb095QnBLeXNwSUh0Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JyWlhrZ2FXNGdZWEpuZFcxbGJuUnpXMmxkS1NCN1hHNGdJQ0FnSUNCcFppQW9UMkpxWldOMExuQnliM1J2ZEhsd1pTNW9ZWE5QZDI1UWNtOXdaWEowZVM1allXeHNLR0Z5WjNWdFpXNTBjMXRwWFN3Z2EyVjVLU2tnZTF4dUlDQWdJQ0FnSUNCdlltcGJhMlY1WFNBOUlHRnlaM1Z0Wlc1MGMxdHBYVnRyWlhsZE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCdlltbzdYRzU5WEc1Y2JtVjRjRzl5ZENCc1pYUWdkRzlUZEhKcGJtY2dQU0JQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5PMXh1WEc0dkx5QlRiM1Z5WTJWa0lHWnliMjBnYkc5a1lYTm9YRzR2THlCb2RIUndjem92TDJkcGRHaDFZaTVqYjIwdlltVnpkR2xsYW5NdmJHOWtZWE5vTDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVdWRIaDBYRzR2S2lCbGMyeHBiblF0WkdsellXSnNaU0JtZFc1akxYTjBlV3hsSUNvdlhHNXNaWFFnYVhOR2RXNWpkR2x2YmlBOUlHWjFibU4wYVc5dUtIWmhiSFZsS1NCN1hHNGdJSEpsZEhWeWJpQjBlWEJsYjJZZ2RtRnNkV1VnUFQwOUlDZG1kVzVqZEdsdmJpYzdYRzU5TzF4dUx5OGdabUZzYkdKaFkyc2dabTl5SUc5c1pHVnlJSFpsY25OcGIyNXpJRzltSUVOb2NtOXRaU0JoYm1RZ1UyRm1ZWEpwWEc0dktpQnBjM1JoYm1KMWJDQnBaMjV2Y21VZ2JtVjRkQ0FxTDF4dWFXWWdLR2x6Um5WdVkzUnBiMjRvTDNndktTa2dlMXh1SUNCcGMwWjFibU4wYVc5dUlEMGdablZ1WTNScGIyNG9kbUZzZFdVcElIdGNiaUFnSUNCeVpYUjFjbTRnZEhsd1pXOW1JSFpoYkhWbElEMDlQU0FuWm5WdVkzUnBiMjRuSUNZbUlIUnZVM1J5YVc1bkxtTmhiR3dvZG1Gc2RXVXBJRDA5UFNBblcyOWlhbVZqZENCR2RXNWpkR2x2Ymwwbk8xeHVJQ0I5TzF4dWZWeHVaWGh3YjNKMElIdHBjMFoxYm1OMGFXOXVmVHRjYmk4cUlHVnpiR2x1ZEMxbGJtRmliR1VnWm5WdVl5MXpkSGxzWlNBcUwxeHVYRzR2S2lCcGMzUmhibUoxYkNCcFoyNXZjbVVnYm1WNGRDQXFMMXh1Wlhod2IzSjBJR052Ym5OMElHbHpRWEp5WVhrZ1BTQkJjbkpoZVM1cGMwRnljbUY1SUh4OElHWjFibU4wYVc5dUtIWmhiSFZsS1NCN1hHNGdJSEpsZEhWeWJpQW9kbUZzZFdVZ0ppWWdkSGx3Wlc5bUlIWmhiSFZsSUQwOVBTQW5iMkpxWldOMEp5a2dQeUIwYjFOMGNtbHVaeTVqWVd4c0tIWmhiSFZsS1NBOVBUMGdKMXR2WW1wbFkzUWdRWEp5WVhsZEp5QTZJR1poYkhObE8xeHVmVHRjYmx4dUx5OGdUMnhrWlhJZ1NVVWdkbVZ5YzJsdmJuTWdaRzhnYm05MElHUnBjbVZqZEd4NUlITjFjSEJ2Y25RZ2FXNWtaWGhQWmlCemJ5QjNaU0J0ZFhOMElHbHRjR3hsYldWdWRDQnZkWElnYjNkdUxDQnpZV1JzZVM1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCcGJtUmxlRTltS0dGeWNtRjVMQ0IyWVd4MVpTa2dlMXh1SUNCbWIzSWdLR3hsZENCcElEMGdNQ3dnYkdWdUlEMGdZWEp5WVhrdWJHVnVaM1JvT3lCcElEd2diR1Z1T3lCcEt5c3BJSHRjYmlBZ0lDQnBaaUFvWVhKeVlYbGJhVjBnUFQwOUlIWmhiSFZsS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYVR0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnY21WMGRYSnVJQzB4TzF4dWZWeHVYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJsYzJOaGNHVkZlSEJ5WlhOemFXOXVLSE4wY21sdVp5a2dlMXh1SUNCcFppQW9kSGx3Wlc5bUlITjBjbWx1WnlBaFBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQXZMeUJrYjI0bmRDQmxjMk5oY0dVZ1UyRm1aVk4wY21sdVozTXNJSE5wYm1ObElIUm9aWGtuY21VZ1lXeHlaV0ZrZVNCellXWmxYRzRnSUNBZ2FXWWdLSE4wY21sdVp5QW1KaUJ6ZEhKcGJtY3VkRzlJVkUxTUtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzUnlhVzVuTG5SdlNGUk5UQ2dwTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvYzNSeWFXNW5JRDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQW5KenRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLQ0Z6ZEhKcGJtY3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkSEpwYm1jZ0t5QW5KenRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJHYjNKalpTQmhJSE4wY21sdVp5QmpiMjUyWlhKemFXOXVJR0Z6SUhSb2FYTWdkMmxzYkNCaVpTQmtiMjVsSUdKNUlIUm9aU0JoY0hCbGJtUWdjbVZuWVhKa2JHVnpjeUJoYm1SY2JpQWdJQ0F2THlCMGFHVWdjbVZuWlhnZ2RHVnpkQ0IzYVd4c0lHUnZJSFJvYVhNZ2RISmhibk53WVhKbGJuUnNlU0JpWldocGJtUWdkR2hsSUhOalpXNWxjeXdnWTJGMWMybHVaeUJwYzNOMVpYTWdhV1pjYmlBZ0lDQXZMeUJoYmlCdlltcGxZM1FuY3lCMGJ5QnpkSEpwYm1jZ2FHRnpJR1Z6WTJGd1pXUWdZMmhoY21GamRHVnljeUJwYmlCcGRDNWNiaUFnSUNCemRISnBibWNnUFNBbkp5QXJJSE4wY21sdVp6dGNiaUFnZlZ4dVhHNGdJR2xtSUNnaGNHOXpjMmxpYkdVdWRHVnpkQ2h6ZEhKcGJtY3BLU0I3SUhKbGRIVnliaUJ6ZEhKcGJtYzdJSDFjYmlBZ2NtVjBkWEp1SUhOMGNtbHVaeTV5WlhCc1lXTmxLR0poWkVOb1lYSnpMQ0JsYzJOaGNHVkRhR0Z5S1R0Y2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR2x6Ulcxd2RIa29kbUZzZFdVcElIdGNiaUFnYVdZZ0tDRjJZV3gxWlNBbUppQjJZV3gxWlNBaFBUMGdNQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBjblZsTzF4dUlDQjlJR1ZzYzJVZ2FXWWdLR2x6UVhKeVlYa29kbUZzZFdVcElDWW1JSFpoYkhWbExteGxibWQwYUNBOVBUMGdNQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBjblZsTzF4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnZlZ4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdZM0psWVhSbFJuSmhiV1VvYjJKcVpXTjBLU0I3WEc0Z0lHeGxkQ0JtY21GdFpTQTlJR1Y0ZEdWdVpDaDdmU3dnYjJKcVpXTjBLVHRjYmlBZ1puSmhiV1V1WDNCaGNtVnVkQ0E5SUc5aWFtVmpkRHRjYmlBZ2NtVjBkWEp1SUdaeVlXMWxPMXh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1lteHZZMnRRWVhKaGJYTW9jR0Z5WVcxekxDQnBaSE1wSUh0Y2JpQWdjR0Z5WVcxekxuQmhkR2dnUFNCcFpITTdYRzRnSUhKbGRIVnliaUJ3WVhKaGJYTTdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCaGNIQmxibVJEYjI1MFpYaDBVR0YwYUNoamIyNTBaWGgwVUdGMGFDd2dhV1FwSUh0Y2JpQWdjbVYwZFhKdUlDaGpiMjUwWlhoMFVHRjBhQ0EvSUdOdmJuUmxlSFJRWVhSb0lDc2dKeTRuSURvZ0p5Y3BJQ3NnYVdRN1hHNTlYRzRpTENJdkx5QkRjbVZoZEdVZ1lTQnphVzF3YkdVZ2NHRjBhQ0JoYkdsaGN5QjBieUJoYkd4dmR5QmljbTkzYzJWeWFXWjVJSFJ2SUhKbGMyOXNkbVZjYmk4dklIUm9aU0J5ZFc1MGFXMWxJRzl1SUdFZ2MzVndjRzl5ZEdWa0lIQmhkR2d1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhKbGNYVnBjbVVvSnk0dlpHbHpkQzlqYW5NdmFHRnVaR3hsWW1GeWN5NXlkVzUwYVcxbEp5bGJKMlJsWm1GMWJIUW5YVHRjYmlJc0ltMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2NtVnhkV2x5WlNoY0ltaGhibVJzWldKaGNuTXZjblZ1ZEdsdFpWd2lLVnRjSW1SbFptRjFiSFJjSWwwN1hHNGlYWDA9In0=
