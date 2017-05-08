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
    id: 'near',
    title: '近期概况',
    content: ['于2016年9月任职京东商城搜索与大数据业务部/数据产品研发部架构师岗，负责慧眼项目、京东动力、京东管家、决策仪表盘、倾听系统、指标管理系统、实时应用、及其移动端项目的前端构建并持续提供底层工程技术支持，引领技术团队实现产品功能。']
}, {
    id: 'gangwei',
    title: '意向岗位',
    content: ['WEB产品架构师、高级全栈工程师、技术管理职位、产品职位']
}, {
    id: 'zhize',
    title: '意向职责',
    content: ['负责产品需求分析和架构设计、参与系统技术选型及核心模块技术验证和技术攻关，实现并完善产品功能，协调测试、上线、反馈等流程，控制产品进度及处理各环节问题，保证产品最终质量。']
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
}, {
    id: 'word',
    title: 'word版简历',
    content: ['<a href="http://www.hestudy.com/career/career.docx" class="link external" target="_blank">http://www.hestudy.com/career/career.docx</a>']
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
        var limit = ['aboutme', 'near', 'gangwei', 'zhize', 'z-workflow-code', 'word'];

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmlld3MvaW5kZXgvaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9hYm91dC1zeXN0ZW0vaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9iYXNpYy9pbmRleC5qcyIsInNyYy92aWV3cy9pbmRleC9tb2R1bGVzL2V4cGVyaWVuY2Utd29ya3MvaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9leHBlcmllbmNlL2luZGV4LmpzIiwic3JjL3ZpZXdzL2luZGV4L21vZHVsZXMvZXhwZXJpZW5jZS90YWItY29udGVudC5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9leHBlcmllbmNlL3RhYi1uYXYuaGJzIiwic3JjL3ZpZXdzL2luZGV4L21vZHVsZXMvZmF2aWNvbi9mYXZpY29uLmhicyIsInNyYy92aWV3cy9pbmRleC9tb2R1bGVzL2Zhdmljb24vaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9uYXYvYXBwLW5hdi5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9uYXYvaW5kZXguanMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9wdWJsaWMvYmxvY2stY29udGVudC5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9wdWJsaWMvYmxvY2stbGlzdC5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy9wdWJsaWMvd29ya3MtbGlzdC5oYnMiLCJzcmMvdmlld3MvaW5kZXgvbW9kdWxlcy93b3Jrcy9pbmRleC5qcyIsInNyYy92aWV3cy9pbmRleC9zZXJ2aWNlL2JhaWtlLXN1bW1hcnkuanMiLCJzcmMvdmlld3MvaW5kZXgvc2VydmljZS9iYXNpYy5qcyIsInNyYy92aWV3cy9pbmRleC9zZXJ2aWNlL2Jsb2NrLmpzIiwic3JjL3ZpZXdzL2luZGV4L3NlcnZpY2UvZXhwZXJpZW5jZS5qcyIsInNyYy92aWV3cy9pbmRleC9zZXJ2aWNlL3dvcmtzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2Jhc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9kZWNvcmF0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvZGVjb3JhdG9ycy9pbmxpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy9ibG9jay1oZWxwZXItbWlzc2luZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvZWFjaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2lmLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvaGVscGVycy9sb2cuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9saWIvaGFuZGxlYmFycy9oZWxwZXJzL2xvb2t1cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvd2l0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL2xvZ2dlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2hhbmRsZWJhcnMvdXRpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hic2Z5L3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksWUFBWSxRQUFRLGVBQVIsQ0FBaEI7O0FBRUEsSUFBSSxtQkFBbUIsUUFBUSxzQkFBUixDQUF2Qjs7QUFFQSxJQUFJLGNBQWMsUUFBUSxpQkFBUixDQUFsQjs7QUFFQSxJQUFJLGVBQWUsUUFBUSx3QkFBUixDQUFuQjs7QUFFQSxJQUFJLGtCQUFrQixRQUFRLGlCQUFSLENBQXRCOztBQUVBLElBQUksZ0JBQWdCLFFBQVEsbUJBQVIsQ0FBcEI7O0FBRUE7OztBQUdBLGNBQWMsTUFBZCxDQUFxQixHQUFHLGtCQUFILENBQXJCO0FBQ0EsTUFBTSxVQUFOLENBQWlCLE1BQWpCLEVBQXlCLFVBQVMsSUFBVCxFQUFlO0FBQ3BDLGdCQUFjLE1BQWQsQ0FBcUIsR0FBRyxrQkFBSCxDQUFyQjtBQUNILENBRkQ7O0FBSUE7OztBQUdBLFVBQVUsTUFBVjs7QUFFQTs7O0FBR0EsZ0JBQWdCLE1BQWhCOztBQUVBOzs7QUFHQSxpQkFBaUIsTUFBakI7O0FBRUE7OztBQUdBLFlBQVksTUFBWjs7QUFFQTs7O0FBR0EsYUFBYSxNQUFiOzs7OztBQzNDQSxJQUFJLG1CQUFtQixRQUFRLDZCQUFSLENBQXZCOztBQUVBLElBQUksWUFBWSxRQUFRLHFCQUFSLENBQWhCOztBQUVBLE9BQU8sT0FBUCxHQUFpQjtBQUNi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QUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3ZCLFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBRU0sU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtBQUN2QyxRQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNsQixTQUFPLE1BQU0sQ0FBQztDQUNmOztBQUVNLFNBQVMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRTtBQUNqRCxTQUFPLENBQUMsV0FBVyxHQUFHLFdBQVcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBLEdBQUksRUFBRSxDQUFDO0NBQ3BEOzs7O0FDM0dEO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtb2R1bGVOYXYgPSByZXF1aXJlKCcuL21vZHVsZXMvbmF2Jyk7XG5cbnZhciBtb2R1bGVFeHBlcmllbmNlID0gcmVxdWlyZSgnLi9tb2R1bGVzL2V4cGVyaWVuY2UnKTtcblxudmFyIG1vZHVsZVdvcmtzID0gcmVxdWlyZSgnLi9tb2R1bGVzL3dvcmtzJyk7XG5cbnZhciBtb2R1bGVTeXN0ZW0gPSByZXF1aXJlKCcuL21vZHVsZXMvYWJvdXQtc3lzdGVtJyk7XG5cbnZhciBtb2R1bGVQYWdlQmFzaWMgPSByZXF1aXJlKCcuL21vZHVsZXMvYmFzaWMnKTtcblxudmFyIG1vZHVsZUZhdmljb24gPSByZXF1aXJlKCcuL21vZHVsZXMvZmF2aWNvbicpO1xuXG4vKlxu6aaW6aG15aS05YOPXG4gKi9cbm1vZHVsZUZhdmljb24ucmVuZGVyKCQkKFwiI2pzLXBhZ2UtY29udGVudFwiKSk7XG5teUFwcC5vblBhZ2VJbml0KCdob21lJywgZnVuY3Rpb24ocGFnZSkge1xuICAgIG1vZHVsZUZhdmljb24ucmVuZGVyKCQkKFwiI2pzLXBhZ2UtY29udGVudFwiKSk7XG59KTtcblxuLypcbuWvvOiIqlxuICovXG5tb2R1bGVOYXYucmVuZGVyKCk7XG5cbi8qXG7ln7rmnKzkv6Hmga9cbiAqL1xubW9kdWxlUGFnZUJhc2ljLnJlbmRlcigpO1xuXG4vKlxu5pys5Lq657uP5Y6GXG4gKi9cbm1vZHVsZUV4cGVyaWVuY2UucmVuZGVyKCk7XG5cbi8qXG7kvZzlk4Hkv6Hmga9cbiAqL1xubW9kdWxlV29ya3MucmVuZGVyKCk7XG5cbi8qXG7lhbPkuo7mnKzns7vnu59cbiAqL1xubW9kdWxlU3lzdGVtLnJlbmRlcigpO1xuIiwidmFyIGJsb2NrQ29udGVudFRlbXAgPSByZXF1aXJlKCcuLi9wdWJsaWMvYmxvY2stY29udGVudC5oYnMnKTtcblxudmFyIGJsb2NrRGF0YSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2UvYmxvY2snKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGJsb2NrRGF0YS5nZXRBYm91dFN5c3RlbSgpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICQkKFwiI2pzLXBhbmVsLWxlZnRcIikuYXBwZW5kKGJsb2NrQ29udGVudFRlbXAoZGF0YSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJsb2NrRGF0YS5nZXRJbmRleERhdGEoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAkJChcIiNqcy1wYWdlLWNvbnRlbnRcIikuYXBwZW5kKGJsb2NrQ29udGVudFRlbXAoZGF0YSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG15QXBwLm9uUGFnZUluaXQoJ2hvbWUnLCBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tEYXRhLmdldEluZGV4RGF0YSgpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAkJChcIiNqcy1wYWdlLWNvbnRlbnRcIikuYXBwZW5kKGJsb2NrQ29udGVudFRlbXAoZGF0YSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsInZhciBiYXNpYyA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2UvYmFzaWMnKTtcblxudmFyIGJhc2ljVGVtcCA9IHJlcXVpcmUoJy4uL3B1YmxpYy9ibG9jay1saXN0LmhicycpO1xuXG52YXIgbW9kdWxlRmF2aWNvbiA9IHJlcXVpcmUoJy4uL2Zhdmljb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIG15QXBwLm9uUGFnZUluaXQoJ2Jhc2ljJywgZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICAgICAgICAgIGJhc2ljLmdldExpc3RBbGwoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgJCQoJyNqcy1iYXNpYy1ib3gnKS5hcHBlbmQoYmFzaWNUZW1wKGRhdGEpKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAg5Z+65pys6LWE5paZ5aS05YOPXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbW9kdWxlRmF2aWNvbi5yZW5kZXIoJCQoJyNqcy1iYXNpYy1ib3gnKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwidmFyIHdvcmtTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZS93b3JrcycpO1xuXG52YXIgd29ya3NMaXN0VGVtcCA9IHJlcXVpcmUoJy4uL3B1YmxpYy93b3Jrcy1saXN0LmhicycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAgICAgICAvKue7j+WOhuebuOWFs+S9nOWTgSovXG4gICAgICAgICAgICBteUFwcC5vblBhZ2VJbml0KCdleHBlcmllbmNlLXdvcmsnLCBmdW5jdGlvbihwYWdlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdHlwZVZhbCA9IHBhZ2UucXVlcnkudHlwZTtcblxuICAgICAgICAgICAgICAgIHdvcmtTZXJ2aWNlLmdldExpc3RCeVR5cGUodHlwZVZhbCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JrUG9wdXBUaXRsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiMjAxMlwiOiBcIjIwMTLlubR+6Iez5LuKIOeahOS9nOWTgVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIyMDA3XCI6IFwiMjAwN+W5tH4yMDEy5bm0IOeahOS9nOWTgVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIyMDA0XCI6IFwiMjAwNOW5tH4yMDA35bm0IOeahOS9nOWTgVwiXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICQkKFwiLmppbmdsaS13b3Jrcy10aXRsZVwiKS5odG1sKHdvcmtQb3B1cFRpdGxlW3R5cGVWYWxdKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICQkKFwiLndvcmtzLWxpc3QtYm94XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaHRtbCh3b3Jrc0xpc3RUZW1wKGRhdGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5qcy1jYXJkJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc3dpcGVyLXNsaWRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKFwiLnN3aXBlci1sYXp5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicHJlbG9hZGVyXCI+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgbXlBcHAuaW5pdEltYWdlc0xhenlMb2FkKCcucGFnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIG15QXBwLnN3aXBlcignLnN3aXBlci1jb250YWluZXInLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkSW1hZ2VzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhenlMb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvbjogJy5zd2lwZXItcGFnaW5hdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlZmZlY3Q6ICdjb3ZlcmZsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyZWRTbGlkZXM6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAkJCgnLnNob3ctcGhvdG8nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkJHRoaXMgPSAkJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgd29ya1NlcnZpY2UuZ2V0QnlJZCgkJHRoaXMuYXR0cihcImRhdGEtaWRcIikpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15QXBwLnBob3RvQnJvd3Nlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob3RvczogZGF0YS5saXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXp5TG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6ICdkYXJrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja0xpbmtUZXh0OiAn6L+U5ZueJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLm9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJ2YXIgbW9kdWxlRXhwZXJpZW5jZVdvcmtzID0gcmVxdWlyZSgnLi4vZXhwZXJpZW5jZS13b3JrcycpO1xuXG52YXIgYmFpa2VTdW1tYXJ5RGF0YSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2UvYmFpa2Utc3VtbWFyeScpO1xuXG52YXIgdGFiTmF2VGVtcCA9IHJlcXVpcmUoXCIuL3RhYi1uYXYuaGJzXCIpO1xudmFyIHRhYkNvbnRlbnRUZW1wID0gcmVxdWlyZShcIi4vdGFiLWNvbnRlbnQuaGJzXCIpO1xuXG52YXIgZXhwZXJpZW5jZURhdGEgPSByZXF1aXJlKFwiLi4vLi4vc2VydmljZS9leHBlcmllbmNlXCIpO1xuXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoXCJoYnNmeS9ydW50aW1lXCIpO1xuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKFwiYWRkT25lXCIsIGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICByZXR1cm4gaW5kZXggKyAxO1xufSk7XG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoXCJhZGRBY3RpdmVcIiwgZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgIGlmIChpbmRleCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBcImFjdGl2ZVwiO1xuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbn0pO1xuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKFwiYWRkT3RoZXJIcmVmXCIsIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnMjAxMicpIHtcbiAgICAgICAgcmV0dXJuICc8cD48YSBocmVmPVwiI1wiIGNsYXNzPVwiYnV0dG9uIGJhaWtlLXN1bW1hcnlcIj7nmb7np5HlubTluqblt6XkvZzmgLvnu5M8L2E+PC9wPic7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgICAgIC8q55m+56eR5bm05bqm5oC757uTKi9cbiAgICAgICAgICAgIG15QXBwLm9uUGFnZUluaXQoJ2V4cGVyaWVuY2UnLCBmdW5jdGlvbihwYWdlKSB7XG5cbiAgICAgICAgICAgICAgICBleHBlcmllbmNlRGF0YS5nZXRMaXN0VGl0bGUoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgJCQoXCIjanMtdGFiLW5hdlwiKS5odG1sKHRhYk5hdlRlbXAoZGF0YSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZXhwZXJpZW5jZURhdGEuZ2V0TGlzdEFsbCgpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAkJChcIiNqcy10YWItY29udGVudFwiKS5odG1sKHRhYkNvbnRlbnRUZW1wKGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gbXlBcHAuaW5pdFBhZ2VTd2lwZXIoJy5wYWdlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCQoJy5iYWlrZS1zdW1tYXJ5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBteUFwcC5waG90b0Jyb3dzZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBob3RvczogYmFpa2VTdW1tYXJ5RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXp5TG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVtZTogJ2RhcmsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tMaW5rVGV4dDogJ+i/lOWbnidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLm9wZW4oKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICBtb2R1bGVFeHBlcmllbmNlV29ya3MucmVuZGVyKCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG59O1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazEsIGhlbHBlciwgYWxpYXMxPWRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDoge30sIGFsaWFzMj1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMz1jb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbiwgYWxpYXM0PVwiZnVuY3Rpb25cIjtcblxuICByZXR1cm4gXCI8ZGl2IGlkPVxcXCJ0YWJcIlxuICAgICsgYWxpYXMzKChoZWxwZXJzLmFkZE9uZSB8fCAoZGVwdGgwICYmIGRlcHRoMC5hZGRPbmUpIHx8IGFsaWFzMikuY2FsbChhbGlhczEsKGRhdGEgJiYgZGF0YS5pbmRleCkse1wibmFtZVwiOlwiYWRkT25lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJwYWdlLWNvbnRlbnQgdGFiIFwiXG4gICAgKyBhbGlhczMoKGhlbHBlcnMuYWRkQWN0aXZlIHx8IChkZXB0aDAgJiYgZGVwdGgwLmFkZEFjdGl2ZSkgfHwgYWxpYXMyKS5jYWxsKGFsaWFzMSwoZGF0YSAmJiBkYXRhLmluZGV4KSx7XCJuYW1lXCI6XCJhZGRBY3RpdmVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkpXG4gICAgKyBcIlxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbnRlbnQtYmxvY2tcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udGVudC1ibG9jay10aXRsZVxcXCI+XCJcbiAgICArIGFsaWFzMyhjb250YWluZXIubGFtYmRhKChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5jb21wb255IDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWNvbnRlbnQtaW5uZXJcXFwiPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGFsaWFzMSwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuaW50cm8gOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMiwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWNvbnRlbnQtaW5uZXJcXFwiPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGFsaWFzMSwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZ3JhZGUgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oNCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiIFwiXG4gICAgKyAoKHN0YWNrMSA9IChoZWxwZXJzLmFkZE90aGVySHJlZiB8fCAoZGVwdGgwICYmIGRlcHRoMC5hZGRPdGhlckhyZWYpIHx8IGFsaWFzMikuY2FsbChhbGlhczEsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnR5cGUgOiBkZXB0aDApLHtcIm5hbWVcIjpcImFkZE90aGVySHJlZlwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPHA+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiLi9pbmRleC9leHBlcmllbmNlLXdvcmtzLmh0bWw/dHlwZT1cIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudHlwZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudHlwZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczIpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczQgPyBoZWxwZXIuY2FsbChhbGlhczEse1wibmFtZVwiOlwidHlwZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJidXR0b25cXFwiIGRhdGEtdHlwZT1cXFwiXCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnR5cGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnR5cGUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXM0ID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcInR5cGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj7nm7jlhbPkvZzlk4E8L2E+XFxuICAgICAgICA8L3A+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiO1xufSxcIjJcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgPHA+XCJcbiAgICArIGNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uKGNvbnRhaW5lci5sYW1iZGEoZGVwdGgwLCBkZXB0aDApKVxuICAgICsgXCI8L3A+XFxuXCI7XG59LFwiNFwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgcmV0dXJuIFwiICAgICAgICAgICAgICAgICAgICA8cD5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYShkZXB0aDAsIGRlcHRoMCkpXG4gICAgKyBcIjwvcD5cXG4gICAgICAgICAgICAgICAgICAgIFwiO1xufSxcImNvbXBpbGVyXCI6WzcsXCI+PSA0LjAuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazE7XG5cbiAgcmV0dXJuICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSxkZXB0aDAse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKTtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBhbGlhczE9ZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSwgYWxpYXMyPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYWxpYXMzPWNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIHJldHVybiBcIjxhIGhyZWY9XFxcIiN0YWJcIlxuICAgICsgYWxpYXMzKChoZWxwZXJzLmFkZE9uZSB8fCAoZGVwdGgwICYmIGRlcHRoMC5hZGRPbmUpIHx8IGFsaWFzMikuY2FsbChhbGlhczEsKGRhdGEgJiYgZGF0YS5pbmRleCkse1wibmFtZVwiOlwiYWRkT25lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pKVxuICAgICsgXCJcXFwiIGNsYXNzPVxcXCJidXR0b24gdGFiLWxpbmsgXCJcbiAgICArIGFsaWFzMygoaGVscGVycy5hZGRBY3RpdmUgfHwgKGRlcHRoMCAmJiBkZXB0aDAuYWRkQWN0aXZlKSB8fCBhbGlhczIpLmNhbGwoYWxpYXMxLChkYXRhICYmIGRhdGEuaW5kZXgpLHtcIm5hbWVcIjpcImFkZEFjdGl2ZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSlcbiAgICArIFwiXFxcIj5cIlxuICAgICsgYWxpYXMzKGNvbnRhaW5lci5sYW1iZGEoZGVwdGgwLCBkZXB0aDApKVxuICAgICsgXCI8L2E+IFwiO1xufSxcImNvbXBpbGVyXCI6WzcsXCI+PSA0LjAuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBzdGFjazE7XG5cbiAgcmV0dXJuICgoc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSxkZXB0aDAse1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgxLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCJcXG5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnNDb21waWxlciA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFyc0NvbXBpbGVyLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzcsXCI+PSA0LjAuMFwiXSxcIm1haW5cIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXIsIGFsaWFzMT1kZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IHt9LCBhbGlhczI9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczM9XCJmdW5jdGlvblwiLCBhbGlhczQ9Y29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgcmV0dXJuIFwiPCEtLSDlpLTlg48gLS0+XFxuPGRpdiBjbGFzcz1cXFwiY2FyZCBrcy1jYXJkLWhlYWRlci1waWNcXFwiPlxcbiAgICA8ZGl2IHZhbGlnbj1cXFwiYm90dG9tXFxcIiBzdHlsZT1cXFwiXFxcIiBjbGFzcz1cXFwiYWJvdXRtZS1waWMgY2FyZC1pbWFnZSBjb2xvci13aGl0ZSBuby1ib3JkZXIgbGF6eSBsYXp5LWZhZGVpblxcXCI+XCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczIpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczMgPyBoZWxwZXIuY2FsbChhbGlhczEse1wibmFtZVwiOlwidGl0bGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImNhcmQtY29udGVudFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWNvbnRlbnQtaW5uZXJcXFwiPlxcbiAgICAgICAgICAgIDxwPlwiXG4gICAgKyBhbGlhczQoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5kZXNjIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMiksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMyA/IGhlbHBlci5jYWxsKGFsaWFzMSx7XCJuYW1lXCI6XCJkZXNjXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvcD5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG48IS0tIC/lpLTlg48gLS0+XFxuXCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcbiIsInZhciBiYXNpYyA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2UvYmFzaWMnKTtcblxudmFyIGZhdmljb25UZW1wID0gcmVxdWlyZSgnLi9mYXZpY29uLmhicycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCQkYm94KSB7XG5cbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgYmFzaWMuZ2V0RmF2aWNvbkRhdGEoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAkJGJveC5wcmVwZW5kKGZhdmljb25UZW1wKGRhdGEpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFyc0NvbXBpbGVyID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzQ29tcGlsZXIudGVtcGxhdGUoe1wiY29tcGlsZXJcIjpbNyxcIj49IDQuMC4wXCJdLFwibWFpblwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgcmV0dXJuIFwiPGxpPlxcbiAgICA8YSBocmVmPVxcXCIuL2luZGV4L2ppYmVuemlsaWFvLmh0bWxcXFwiIGNsYXNzPVxcXCJpdGVtLWxpbmsgaXRlbS1jb250ZW50IGNsb3NlLXBhbmVsXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0tbWVkaWFcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1uZXdzcGFwZXItb1xcXCI+PC9pPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1pbm5lclxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS10aXRsZVxcXCI+5Z+65pys6LWE5paZPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9hPlxcbjwvbGk+XFxuPGxpPlxcbiAgICA8YSBocmVmPVxcXCIuL2luZGV4L2V4cGVyaWVuY2UuaHRtbFxcXCIgY2xhc3M9XFxcIml0ZW0tbGluayBpdGVtLWNvbnRlbnQgY2xvc2UtcGFuZWxcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1tZWRpYVxcXCI+PGkgY2xhc3M9XFxcImZhIGZhLXBhcGVyLXBsYW5lXFxcIj48L2k+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtLWlubmVyXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtLXRpdGxlXFxcIj7mnKzkurrnu4/ljoY8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2E+XFxuPC9saT5cXG48bGk+XFxuICAgIDxhIGhyZWY9XFxcIi4vaW5kZXgvd29ya3MuaHRtbFxcXCIgY2xhc3M9XFxcIml0ZW0tbGluayBpdGVtLWNvbnRlbnQgY2xvc2UtcGFuZWxcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1tZWRpYVxcXCI+PGkgY2xhc3M9XFxcImZhIGZhLWN1YmVzXFxcIj48L2k+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtLWlubmVyXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtLXRpdGxlXFxcIj7kvZzlk4Hkv6Hmga88L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2E+XFxuPC9saT5cXG5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIiwidmFyIGFwcE5hdlRlbXAgPSByZXF1aXJlKCcuL2FwcC1uYXYuaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAvKuWKoOi9veWvvOiIquaooeadvyovXG4gICAgICAgICAgICAkJChcIi5hcHAtbmF2XCIpLmFwcGVuZChhcHBOYXZUZW1wKCkpO1xuICAgICAgICAgICAgbXlBcHAub25QYWdlSW5pdCgnaG9tZScsIGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICAgICAgICAkJChcIi5pbmRleC1hcHAtbmF2XCIpLmFwcGVuZChhcHBOYXZUZW1wKCkpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzQ29tcGlsZXIgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnNDb21waWxlci50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxO1xuXG4gIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcImNvbnRlbnQtYmxvY2stdGl0bGVcXFwiPlwiXG4gICAgKyBjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbihjb250YWluZXIubGFtYmRhKChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCksIGRlcHRoMCkpXG4gICAgKyBcIjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcImNvbnRlbnQtYmxvY2tcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50LWJsb2NrLWlubmVyXFxcIj5cXG5cIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IHt9LChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5jb250ZW50IDogZGVwdGgwKSx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDIsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpXG4gICAgKyBcIiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbn0sXCIyXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxO1xuXG4gIHJldHVybiBcIiAgICAgICAgPHA+XCJcbiAgICArICgoc3RhY2sxID0gY29udGFpbmVyLmxhbWJkYShkZXB0aDAsIGRlcHRoMCkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCI8L3A+XFxuXCI7XG59LFwiY29tcGlsZXJcIjpbNyxcIj49IDQuMC4wXCJdLFwibWFpblwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IHt9LGRlcHRoMCx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDEsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFyc0NvbXBpbGVyID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzQ29tcGlsZXIudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJjb250ZW50LWJsb2NrLXRpdGxlXFxcIj5cIlxuICAgICsgY29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb24oY29udGFpbmVyLmxhbWJkYSgoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGl0bGUgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCI8L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJsaXN0LWJsb2NrXFxcIj5cXG4gICAgPHVsPlxcblwiXG4gICAgKyAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDoge30sKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmNvbnRlbnQgOiBkZXB0aDApLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMiwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiICAgIDwvdWw+XFxuPC9kaXY+XFxuXCI7XG59LFwiMlwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIGFsaWFzMT1jb250YWluZXIubGFtYmRhLCBhbGlhczI9Y29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgcmV0dXJuIFwiICAgICAgICA8bGk+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1jb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1pbm5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtLXRpdGxlXFxcIj5cIlxuICAgICsgYWxpYXMyKGFsaWFzMSgoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc3VidGl0bGUgOiBkZXB0aDApLCBkZXB0aDApKVxuICAgICsgXCI8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0tYWZ0ZXJcXFwiPlwiXG4gICAgKyBhbGlhczIoYWxpYXMxKChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zdWJjb250ZW50IDogZGVwdGgwKSwgZGVwdGgwKSlcbiAgICArIFwiPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9saT5cXG5cIjtcbn0sXCJjb21waWxlclwiOls3LFwiPj0gNC4wLjBcIl0sXCJtYWluXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxO1xuXG4gIHJldHVybiAoKHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwIDoge30sZGVwdGgwLHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oMSwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIik7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzQ29tcGlsZXIgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnNDb21waWxlci50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgc3RhY2sxLCBoZWxwZXIsIGFsaWFzMT1kZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IHt9LCBhbGlhczI9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBhbGlhczM9XCJmdW5jdGlvblwiLCBhbGlhczQ9Y29udGFpbmVyLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwianMtY2FyZCBjYXJkIGtzLWNhcmQtaGVhZGVyLXBpY1xcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImNhcmQtaGVhZGVyXFxcIj5cIlxuICAgICsgYWxpYXM0KCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczIpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczMgPyBoZWxwZXIuY2FsbChhbGlhczEse1wibmFtZVwiOlwibmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2Rpdj5cXG4gICAgPGRpdiBkYXRhLWJhY2tncm91bmQ9XFxcIlwiXG4gICAgKyBhbGlhczQoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jb3ZlciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY292ZXIgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImNvdmVyXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgdmFsaWduPVxcXCJib3R0b21cXFwiIGNsYXNzPVxcXCJsYXp5IGxhenktZmFkZWluIHN3aXBlci1sYXp5IHNob3ctcGhvdG8gY2FyZC1pbWFnZSBjb2xvci13aGl0ZSBuby1ib3JkZXJcXFwiIGRhdGEtaWQ9XFxcIlwiXG4gICAgKyBhbGlhczQoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5pZCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuaWQgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMyKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMzID8gaGVscGVyLmNhbGwoYWxpYXMxLHtcIm5hbWVcIjpcImlkXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+PC9kaXY+XFxuXCJcbiAgICArICgoc3RhY2sxID0gaGVscGVyc1tcImlmXCJdLmNhbGwoYWxpYXMxLChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5kZXNjIDogZGVwdGgwKSx7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjpjb250YWluZXIucHJvZ3JhbSgyLCBkYXRhLCAwKSxcImludmVyc2VcIjpjb250YWluZXIubm9vcCxcImRhdGFcIjpkYXRhfSkpICE9IG51bGwgPyBzdGFjazEgOiBcIlwiKVxuICAgICsgXCIgICAgPGRpdiBjbGFzcz1cXFwiY2FyZC1mb290ZXJcXFwiPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImxpbmsgc2hvdy1waG90b1xcXCIgZGF0YS1pZD1cXFwiXCJcbiAgICArIGFsaWFzNCgoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmlkIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5pZCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczIpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczMgPyBoZWxwZXIuY2FsbChhbGlhczEse1wibmFtZVwiOlwiaWRcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj48aSBjbGFzcz1cXFwiZmEgZmEtcGhvdG9cXFwiPjwvaT4g5pu05aSa5Zu+54mHPC9hPiBcIlxuICAgICsgKChzdGFjazEgPSBoZWxwZXJzW1wiaWZcIl0uY2FsbChhbGlhczEsKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnVybCA6IGRlcHRoMCkse1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6Y29udGFpbmVyLnByb2dyYW0oNCwgZGF0YSwgMCksXCJpbnZlcnNlXCI6Y29udGFpbmVyLm5vb3AsXCJkYXRhXCI6ZGF0YX0pKSAhPSBudWxsID8gc3RhY2sxIDogXCJcIilcbiAgICArIFwiXFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiO1xufSxcIjJcIjpmdW5jdGlvbihjb250YWluZXIsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXI7XG5cbiAgcmV0dXJuIFwiICAgIDxkaXYgY2xhc3M9XFxcImNhcmQtY29udGVudFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjYXJkLWNvbnRlbnQtaW5uZXJcXFwiPlxcbiAgICAgICAgICAgIDxwPlwiXG4gICAgKyBjb250YWluZXIuZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmRlc2MgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmRlc2MgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVycy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSx7XCJuYW1lXCI6XCJkZXNjXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvcD5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cIjtcbn0sXCI0XCI6ZnVuY3Rpb24oY29udGFpbmVyLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gIHJldHVybiBcIlxcbiAgICAgICAgPGEgaHJlZj1cXFwiXCJcbiAgICArIGNvbnRhaW5lci5lc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudXJsIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC51cmwgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVycy5oZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gXCJmdW5jdGlvblwiID8gaGVscGVyLmNhbGwoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAgOiB7fSx7XCJuYW1lXCI6XCJ1cmxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiBjbGFzcz1cXFwiZXh0ZXJuYWwgbGlua1xcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1saW5rXFxcIj48L2k+IOS9nOWTgemTvuaOpTwvYT4gXCI7XG59LFwiY29tcGlsZXJcIjpbNyxcIj49IDQuMC4wXCJdLFwibWFpblwiOmZ1bmN0aW9uKGNvbnRhaW5lcixkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gICAgdmFyIHN0YWNrMTtcblxuICByZXR1cm4gKChzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMCA6IHt9LGRlcHRoMCx7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOmNvbnRhaW5lci5wcm9ncmFtKDEsIGRhdGEsIDApLFwiaW52ZXJzZVwiOmNvbnRhaW5lci5ub29wLFwiZGF0YVwiOmRhdGF9KSkgIT0gbnVsbCA/IHN0YWNrMSA6IFwiXCIpO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4iLCJ2YXIgd29ya1NlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlL3dvcmtzJyk7XG5cbnZhciB3b3Jrc0xpc3RUZW1wID0gcmVxdWlyZSgnLi4vcHVibGljL3dvcmtzLWxpc3QuaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAvKuS9nOWTgemhtemdoiovXG4gICAgICAgICAgICBteUFwcC5vblBhZ2VJbml0KCd3b3JrcycsIGZ1bmN0aW9uKHBhZ2UpIHtcblxuICAgICAgICAgICAgICAgIHdvcmtTZXJ2aWNlLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgJCQoXCIjanMtd29ya3MtbGlzdFwiKS5odG1sKHdvcmtzTGlzdFRlbXAoZGF0YSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgIOWIneWni+WMluWbvueJh+i1luWKoOi9vVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgbXlBcHAuaW5pdEltYWdlc0xhenlMb2FkKCcucGFnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgIOWbvuWGjOa1j+iniFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgJCQoJy5zaG93LXBob3RvJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJCR0aGlzID0gJCQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtTZXJ2aWNlLmdldEJ5SWQoJCR0aGlzLmF0dHIoXCJkYXRhLWlkXCIpKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBteUFwcC5waG90b0Jyb3dzZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaG90b3M6IGRhdGEubGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eUxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiAnZGFyaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tMaW5rVGV4dDogJ+i/lOWbnidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwidmFyIGJhaWtlU3VtbWFyeSA9IFt7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzAxLnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMDIucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8wMy5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzA0LnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMDUucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8wNi5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzA3LnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMDgucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8wOS5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzEwLnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMTEucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8xMi5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzEzLnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMTQucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8xNS5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzE2LnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMTcucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufSwge1xuICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlc3VtbWFyeS8xOC5wbmcnLFxuICAgIGNhcHRpb246ICcnXG59LCB7XG4gICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2VzdW1tYXJ5LzE5LnBuZycsXG4gICAgY2FwdGlvbjogJydcbn0sIHtcbiAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZXN1bW1hcnkvMjAucG5nJyxcbiAgICBjYXB0aW9uOiAnJ1xufV07XG5cbm1vZHVsZS5leHBvcnRzID0gYmFpa2VTdW1tYXJ5O1xuIiwidmFyIGJhc2ljRGF0YSA9IFt7XG4gICAgdGl0bGU6ICfln7rmnKzkv6Hmga8nLFxuICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgIHN1YnRpdGxlOiAn5aeT5ZCNJyxcbiAgICAgICAgc3ViY29udGVudDogJ+i1teS8muingShGdXJpYyknXG4gICAgfSwge1xuICAgICAgICBzdWJ0aXRsZTogJ+aAp+WIqycsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICfnlLcnXG4gICAgfSwge1xuICAgICAgICBzdWJ0aXRsZTogJ+WHuueUn+W5tOaciCcsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICcxOTgy5bm0NOaciCdcbiAgICB9LCB7XG4gICAgICAgIHN1YnRpdGxlOiAn5rCR5pePJyxcbiAgICAgICAgc3ViY29udGVudDogJ+axieaXjydcbiAgICB9LCB7XG4gICAgICAgIHN1YnRpdGxlOiAn5ama5ae754q25Ya1JyxcbiAgICAgICAgc3ViY29udGVudDogJ+W3suWpmidcbiAgICB9LCB7XG4gICAgICAgIHN1YnRpdGxlOiAn57GN6LSvJyxcbiAgICAgICAgc3ViY29udGVudDogJ+ays+WNlydcbiAgICB9LCB7XG4gICAgICAgIHN1YnRpdGxlOiAn5YW06Laj54ix5aW9JyxcbiAgICAgICAgc3ViY29udGVudDogJ+eUteWtkOOAgeehrOS7tuOAgURJWSdcbiAgICB9XVxufSwge1xuICAgIHRpdGxlOiAn6IOM5pmv5LuL57uNJyxcbiAgICBjb250ZW50OiBbe1xuICAgICAgICBzdWJ0aXRsZTogJ+W3peS9nOe7j+mqjCcsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICcxMuW5tFdFQuS6p+WTgeaetuaehOeglOWPkSdcbiAgICB9LCB7XG4gICAgICAgIHN1YnRpdGxlOiAn5q+V5Lia6Zmi5qChJyxcbiAgICAgICAgc3ViY29udGVudDogJ+mDkeW3nui9u+W3peS4muWtpumZoigyMDAwfjIwMDTlubQpJ1xuICAgIH0sIHtcbiAgICAgICAgc3VidGl0bGU6ICfmiYDkv67kuJPkuJonLFxuICAgICAgICBzdWJjb250ZW50OiAn55S15a2Q5LiO5L+h5oGv5oqA5pyvJ1xuICAgIH1dXG59LCB7XG4gICAgdGl0bGU6ICfogZTns7vmlrnlvI8nLFxuICAgIGNvbnRlbnQ6IFt7XG4gICAgICAgIHN1YnRpdGxlOiAn55S16K+dJyxcbiAgICAgICAgc3ViY29udGVudDogJzEzODExODY5MjA4J1xuICAgIH0sIHtcbiAgICAgICAgc3VidGl0bGU6ICdFbWFpbCcsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICdmdXJpY0BxcS5jb20nXG4gICAgfSwge1xuICAgICAgICBzdWJ0aXRsZTogJ+eOsOS9j+WdgCcsXG4gICAgICAgIHN1YmNvbnRlbnQ6ICfljJfkuqzkuqbluoTlvIDlj5HljLrnp5HliJvljYHkuInooZcnXG4gICAgfV1cbn1dO1xuXG52YXIgZmF2aWNvbkRhdGEgPSB7XG4gICAgdGl0bGU6ICdmdXJpYycsXG4gICAgZmF2aWNvbjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3poYW96aGFvLmpwZycsXG4gICAgZGVzYzogJ+S4quS6uuiDveWKm+aciemZkO+8jOWboumYn+WKm+mHj+aXoOmZkO+8geiuqea/gOaDheeHg+eDp+iHquW3se+8jOaKiueBq+WFieeFp+S6ruWIq+S6uiEnXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIC8qXG4gICAg6I635Y+W5omA5pyJ5Z+65pys5L+h5oGvXG4gICAgICovXG4gICAgZ2V0TGlzdEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICByZXNvbHZlKGJhc2ljRGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRGYXZpY29uRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICByZXNvbHZlKGZhdmljb25EYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsInZhciBibG9ja0RhdGEgPSBbe1xuICAgIGlkOiAnYWJvdXRtZScsXG4gICAgdGl0bGU6ICfoh6rmiJHku4vnu40nLFxuICAgIGNvbnRlbnQ6IFsn6Ie05Yqb5LqOV0VC56CU5Y+R5bel56iL5YyW6Ieq5Yqo5YyW55qE56CU56m277yMPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9mdXJpYy16aGFvL2Zlei9cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImxpbmsgZXh0ZXJuYWxcIj5GRVo8L2E+5YmN56uv5qih5Z2X5YyW5bel56iL5byA5Y+R5qGG5p625L2c6ICF44CCJywgJ+abvuS4jue+juWbveehheiwt+WboumYn+iBlOWQiOeglOWPkeWFt+acieWGm+W3peWuieWFqOi1hOi0qOeahOe9kee7nOWHhuWFpeezu+WIl+i9r+S7tuOAgeWbveWGhemhtue6p+S6kuiBlOe9keWuieWFqOWFrOWPuOeahOaQnOe0oueZvuenkeOAgeaguOW/g+WuieWFqOOAgeinhumikeebtOaSreOAgeaZuuiDveehrOS7tuetieWkp+S4reWei+mhueebrueahOWJjeerr+aehOW7uuOAgueOsOi0n+i0o+S6rOS4nOaQnOe0ouS4juWkp+aVsOaNruW5s+WPsOS8l+WkmuaVsOaNruexu+S6p+WTgeeahOWJjeerr+aetuaehOOAgicsICfkvb/nlKjlm73pmYXliY3msr/nmoTlt6XnqIvljJbmioDmnK/mj5Dpq5jlm6LpmJ/noJTlj5HmlYjnjoflj4rpobnnm67kuqflk4HnmoTlj6/nu7TmiqTmgKflkozmianlsZXmgKfjgILlloTkuo7ljY/osIPpobnnm67nmoTnrZbliJLjgIHorr7orqHjgIHpnIDmsYLojIPlm7Tlkozpobnnm67ov5vluqbjgIHlpITnkIbop6PlhrPlkITnjq/oioLpl67popjjgIInXVxufSwge1xuICAgIGlkOiAnbmVhcicsXG4gICAgdGl0bGU6ICfov5HmnJ/mpoLlhrUnLFxuICAgIGNvbnRlbnQ6IFsn5LqOMjAxNuW5tDnmnIjku7vogYzkuqzkuJzllYbln47mkJzntKLkuI7lpKfmlbDmja7kuJrliqHpg6gv5pWw5o2u5Lqn5ZOB56CU5Y+R6YOo5p625p6E5biI5bKX77yM6LSf6LSj5oWn55y86aG555uu44CB5Lqs5Lic5Yqo5Yqb44CB5Lqs5Lic566h5a6244CB5Yaz562W5Luq6KGo55uY44CB5YC+5ZCs57O757uf44CB5oyH5qCH566h55CG57O757uf44CB5a6e5pe25bqU55So44CB5Y+K5YW256e75Yqo56uv6aG555uu55qE5YmN56uv5p6E5bu65bm25oyB57ut5o+Q5L6b5bqV5bGC5bel56iL5oqA5pyv5pSv5oyB77yM5byV6aKG5oqA5pyv5Zui6Zif5a6e546w5Lqn5ZOB5Yqf6IO944CCJ11cbn0sIHtcbiAgICBpZDogJ2dhbmd3ZWknLFxuICAgIHRpdGxlOiAn5oSP5ZCR5bKX5L2NJyxcbiAgICBjb250ZW50OiBbJ1dFQuS6p+WTgeaetuaehOW4iOOAgemrmOe6p+WFqOagiOW3peeoi+W4iOOAgeaKgOacr+euoeeQhuiBjOS9jeOAgeS6p+WTgeiBjOS9jSddXG59LCB7XG4gICAgaWQ6ICd6aGl6ZScsXG4gICAgdGl0bGU6ICfmhI/lkJHogYzotKMnLFxuICAgIGNvbnRlbnQ6IFsn6LSf6LSj5Lqn5ZOB6ZyA5rGC5YiG5p6Q5ZKM5p625p6E6K6+6K6h44CB5Y+C5LiO57O757uf5oqA5pyv6YCJ5Z6L5Y+K5qC45b+D5qih5Z2X5oqA5pyv6aqM6K+B5ZKM5oqA5pyv5pS75YWz77yM5a6e546w5bm25a6M5ZaE5Lqn5ZOB5Yqf6IO977yM5Y2P6LCD5rWL6K+V44CB5LiK57q/44CB5Y+N6aaI562J5rWB56iL77yM5o6n5Yi25Lqn5ZOB6L+b5bqm5Y+K5aSE55CG5ZCE546v6IqC6Zeu6aKY77yM5L+d6K+B5Lqn5ZOB5pyA57uI6LSo6YeP44CCJ11cbn0sIHtcbiAgICBpZDogJ3N5c3RlbScsXG4gICAgdGl0bGU6ICflhbPkuo7mnKzns7vnu58nLFxuICAgIGNvbnRlbnQ6IFsn5pys57O757uf5L2/55SoRkVa5YmN56uv5qih5Z2X5YyW5byA5Y+R5qGG5p625Z+65LqORnJhbWV3b3JrN+aehOW7uuOAgua8lOekuuS6huenu+WKqOerr1JFTeeahOino+WGs+aWueahiOOAguWFvOWuueS7u+S9lee7iOerr+WSjOW5s+WPsOOAgeWPr+S7peWGheW1jOWcqOS7u+S9lUFQUOaIluenu+WKqOerr+W6lOeUqOS4rea1j+iniOOAgicsICc8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2Z1cmljLXpoYW8vZmV6L1wiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwibGluayBleHRlcm5hbFwiPkZFWjwvYT4g5piv6Z2i5ZCRIOWJjeerr+aooeWdl+WMluW3peeoiyDnmoTlvIDlj5HmoYbmnrbjgILkuLvopoHkuLrop6PlhrMg5YmN56uv5byA5Y+R5aSa5Lq66auY5pWI5Y2P5L2c44CB5o+Q6auY5byA5Y+R6LSo6YeP44CB5Y+K6aG555uu5Yqf6IO95omp5bGV55qE5b+r6YCf6L+t5Luj5ZKM5Y+v57u05oqk5oCn562J6Zeu6aKY44CC5qC45b+D5YyF5ous5Yqf6IO95qih5Z2X5YyW44CB57uT5p6E6KeE6IyD5YyW44CB5Y+K5byA5Y+R6Ieq5Yqo5YyW44CCJ11cbn0sIHtcbiAgICBpZDogJ2NhcmVlci1jb2RlJyxcbiAgICB0aXRsZTogJ+eugOWOhua6kOeggeWPguiAgycsXG4gICAgY29udGVudDogWyfigKo8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2Z1cmljLXpoYW8vY2FyZWVyL1wiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwibGluayBleHRlcm5hbFwiPmh0dHBzOi8vZ2l0aHViLmNvbS9mdXJpYy16aGFvL2NhcmVlci88L2E+J11cbn0sIHtcbiAgICBpZDogJ3otd29ya2Zsb3ctY29kZScsXG4gICAgdGl0bGU6ICdGRVrliY3nq6/mqKHlnZfljJblt6XnqIvku4vnu43lj4rmupDnoIEnLFxuICAgIGNvbnRlbnQ6IFsn4oCqPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9mdXJpYy16aGFvL2Zlei9cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImxpbmsgZXh0ZXJuYWxcIj5odHRwczovL2dpdGh1Yi5jb20vZnVyaWMtemhhby9mZXovPC9hPiddXG59LCB7XG4gICAgaWQ6ICd3b3JkJyxcbiAgICB0aXRsZTogJ3dvcmTniYjnroDljoYnLFxuICAgIGNvbnRlbnQ6IFsnPGEgaHJlZj1cImh0dHA6Ly93d3cuaGVzdHVkeS5jb20vY2FyZWVyL2NhcmVlci5kb2N4XCIgY2xhc3M9XCJsaW5rIGV4dGVybmFsXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cDovL3d3dy5oZXN0dWR5LmNvbS9jYXJlZXIvY2FyZWVyLmRvY3g8L2E+J11cbn1dO1xuXG5mdW5jdGlvbiBpbkFycmF5KGVsZW0sIGFyciwgaSkge1xuICAgIHZhciBsZW47XG5cbiAgICBpZiAoYXJyKSB7XG4gICAgICAgIGxlbiA9IGFyci5sZW5ndGg7XG4gICAgICAgIGkgPSBpID8gaSA8IDAgPyBNYXRoLm1heCgwLCBsZW4gKyBpKSA6IGkgOiAwO1xuXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gU2tpcCBhY2Nlc3NpbmcgaW4gc3BhcnNlIGFycmF5c1xuICAgICAgICAgICAgaWYgKGkgaW4gYXJyICYmIGFycltpXSA9PT0gZWxlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvKlxuICAgICDojrflj5blhbPkuo7mnKzns7vnu5/nmoTkv6Hmga9cbiAgICAgKi9cbiAgICBnZXRBYm91dFN5c3RlbTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBydG5EYXRhID0gW107XG4gICAgICAgIHZhciBsaW1pdCA9IFsnc3lzdGVtJ107XG5cbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICAgICAgYmxvY2tEYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluQXJyYXkoaXRlbS5pZCwgbGltaXQsIDApID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcnRuRGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXNvbHZlKHJ0bkRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAg6I635Y+W6aaW6aG15L+h5oGvXG4gICAgICovXG4gICAgZ2V0SW5kZXhEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJ0bkRhdGEgPSBbXTtcbiAgICAgICAgdmFyIGxpbWl0ID0gWydhYm91dG1lJywgJ25lYXInLCAnZ2FuZ3dlaScsICd6aGl6ZScsICd6LXdvcmtmbG93LWNvZGUnLCAnd29yZCddO1xuXG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgICAgIGJsb2NrRGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpbkFycmF5KGl0ZW0uaWQsIGxpbWl0LCAwKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ0bkRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzb2x2ZShydG5EYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsInZhciBqaW5nbGlEYXRhID0gW3tcbiAgICB0aXRsZTogXCIyMDEyfjIwMTZcIixcbiAgICBjb21wb255OiBcIuWMl+S6rOWlh+iZjjM2MOenkeaKgOaciemZkOWFrOWPuO+8iOWlh+mjnue/lOiJuu+8iVwiLFxuICAgIGludHJvOiBbXCIyMDEy5bm05Yqg55ufMzYw77yM5YmN5pyf54us56uL6LSf6LSj6L+Y5piv5L+d5a+G6aG555uu55qE5pW05Liq55m+56eR5YmN56uv5bm26Lqr5YW85Lqn5ZOB57uP55CG44CB5ZCO57ut5Li75pS755m+56eR57yW6L6R5Zmo77yM6YOo5YiG5Yqf6IO96KKr55m+5bqm5ZKM5LqS5Yqo55m+56eR5oqE6KKt5YCf6Ym044CC5Lik5ZGo5YaF5LiK57q/56e75Yqo54mI55m+56eR77yM5Y2P6LCD5aSE55CG5ZCE546v6IqC6Zeu6aKY77yM5bm05bqV6I635b6X5LyY56eA5ZGY5bel5Y+K6IKh56Wo5aWW5Yqx77yM6ZqP5ZCO5LuO55m+56eR5Lia5Yqh6YOo6Zeo5bm25YWlMzYw5pyA5aSn55qE5YmN56uv5oqA5pyv5Zui6ZifLVdFQuW5s+WPsOmDqC/lpYfoiJ7lm6LjgIJcIiwgXCIyMDE05bm05rS+6am75a6J5YWo5Y2r5aOr6YOo6Zeo6LSf6LSjMzYw5a6J5YWo5Y2r5aOrVklQ5Lya5ZGY5Lit5b+D77yM5Yib6YCg5pys5ZywZGVidWflvIDlj5HmqKHlvI/vvIzlvbvlupXohLHnprvnoJTlj5Hnjq/looPlr7nlrqLmiLfnq6/nmoTkvp3otZbvvIzlop7liqDnur/kuIrkuIDplK7lvIDlkK9kZWJ1Z++8jOW/q+mAn+WumuS9jemXrumimO+8jOWkp+Wkp+aPkOmrmOWuouaIt+err+WGheW1jFdFQueahOeglOWPkeaViOeOh+OAguWQjOaXtuWNj+iwg+aUr+aMgeW+ruWvhu+8iOWGheW1jHdlYu+8ieOAgeaChOaChCjlhoXltYx3ZWIp44CB5omL5py65Y2r5aOrKOa0u+WKqCnjgIHmtYHph4/ljavlo6vvvIjlrpjnvZHvvInjgIHlhY3otLl3aWZp77yI5a6Y572R77yJ44CB54K5552b5bmz5Y+w77yI5a6Y572R77yJ44CB5L2T6aqM5Lit5b+D77yI5a6Y572R77yJ562J6aG555uu44CCXCIsIFwiMjAxNeW5tOWIneiwg+WFpeiAgeWRqOW4pumihueahOaZuuiDveehrOS7tumDqOmXqO+8jOWJjeacn+eLrOeri+i0n+i0ozM2MOesrOS4gOS4quebtOaSremhueebruWwj+awtOa7tOebtOaSree9keermeeahOaQreW7uueglOWPkeOAgWFwcOWGheW1jEg144CB5ZWG5Z+O5a6Y572R55qE5ZCE56eN5ZCI5L2c5Y+R5ZSu5rS75Yqo5YmN56uv5oqA5pyv5pSv5oyB44CC5ZCO57ut5Y2P5Yqp5byA5Y+RMzY2M01p546p44CB5oKf56m6VFbjgIHmuLjmiI/lhoXltYznp4DlnLrku6Xlj4roirHmpJLnm7Tmkq3jgIHnhornjKtUVuOAgeetieebtOaSremhueebruOAglwiXSxcbiAgICBncmFkZTogW1wi5Li76KaB5Lia57up77yaXCIsIFwiMzYw5pCc57Si55m+56eR5pW05Liq5YmN56uv6KeE5YiS44CB5p6E5bu6KOeHleWwvuacjSnjgIHnmb7np5HnvJbovpHlmagodWVkaXRvcuWGheaguCnjgILkuLvlr7zlkI7nq6/pg6jliIZQSFDmqKHlnZfmnoTlu7oo55u45YWz6K+N5p2h44CB6K+N5p2h5byV55So5qih5Z2XKeOAgeWGheWuueiOt+WPlihwaHBRdWVyeSnjgIHnvJbovpHlmajlj4rlhoXlrrnlpITnkIYoaHRtbFB1cmlmaWVyKe+8jOWIhuexu+ezu+e7n+OAgeiHquWqkuS9k+ezu+e7n+etiVwiLCBcIuWuieWFqOWNq+Wjq+S8muWRmOS4reW/g+OAgTM2MFZJUOS8muWRmOenr+WIhuWVhuWfjihXaW5kb3c45LyY5oOg56CB44CB572R5piT5piO5L+h54mH44CB5oiR5Lmw572R5LiW55WM5p2v44CB5ZSv5ZOB5Lya44CB6ZqP6Lqrd2lmaTRH54mI44CB5b2T5b2T572R55S15a2Q5Lmm44CB6Ziy5Lii5Y2r5aOrKDEvMi8zLzTmnJ8p44CB5b2T5b2T572R5pyN6KOF44CB5aSp54yr55S15Zmo5Z+O44CB572R5piT6Iqx55Sw5biB44CB5aSp54yr5Y+M5Y2B5LiA44CB55S16ISR5LiT5a626LaF57qn6aKE57qm44CB5pyJ6YGT5Y+M6YeN56S85YyF44CB5b2T5b2T572R5Y+M5Y2B5LqM5rS75Yqo44CBMzYw5a6J5YWo6Lev55Sx562J5LyX5aSa54m55p2D6aG555uuKeOAglwiLCBcIuW+ruWvhuWGheW1jOmhteOAgeaChOaChOWGheW1jOmhteOAgeaJi+acuuWNq+Wjq+a0u+WKqOOAgea1gemHj+WNq+Wjq+WumOe9keOAgeWFjei0uXdpZmnlrpjnvZHjgIHngrnnnZvlubPlj7DliY3nq6/jgIHkvZPpqozkuK3lv4Plhajnq5njgIJcIiwgXCLmmbrog73mkYTlg4/mnLrpobnnm67nmoTllYbln47lrpjnvZHjgIHlsI/msLTmu7Tnm7Tmkq3lhajnq5nvvIjlpJrnu4jnq693ZWLvvInjgIFBUFDlhoXltYxINeOAgeiKseakkuebtOaSreaSreaUvuWZqC/ogYrlpKnplb/ov57jgIEzNjYzTWnnjqnlhajnq5nmnoTlu7ov6YCB56S857O757uf44CB562J6aG555uu55qEUEPlj4pINee9keermeaetuaehOOAgemhueebruWNj+iwg+WSjOeglOWPkeOAglwiXVxufSwge1xuICAgIHRpdGxlOiBcIjIwMDd+MjAxMlwiLFxuICAgIGNvbXBvbnk6IFwi5YyX5Lqs6Im+56eR572R5L+h5pyJ6ZmQ5YWs5Y+477yI5ZCM5pa555S15a2Q5peX5LiL77yJXCIsXG4gICAgaW50cm86IFtcIjIwMDflubTlsLHogYzkuo7lkIzmlrnnlLXlrZDml5fkuIvmi6XmnInlhpvlt6XlronlhajotYTotKjnmoTnvZHnu5zova/ku7blhazlj7jvvIzliY3mnJ/orr7orqHjgIHliY3nq6/jgIHmnI3liqHnq68oUEhQKeS4gOS6uuWFqOWMheOAglwiLCBcIuWQjue7reW4pumihuiuvuiuoeW4iOOAgeWJjeerr+OAgVBIUO+8jOS4juWQjuerr++8iEPor63oqIDvvInmioDmnK/nu4/nkIbljY/osIPlhbbku5ZD6K+t6KiA5ZKM5a6i5oi356uv5bel56iL5biI77yM5Y2P5YqpQ1RP5a6e546w5bm25a6M5ZaE5pyA57uIV0VC5bGV546w5ZKM5Lqk5LqS5Yqf6IO944CC5Y+C5LiO5ZCO57ut5Lqn5ZOB5rWL6K+V44CB5Y+R54mI44CB5o6l5pS25pS56L+b55So5oi35pa55Y+N6aaI77yM5L2/55So5pyJ6ZmQ55qE6LWE5rqQ5byA5Y+R57u05oqkN+S4quS6p+WTgee6v+OAglwiLCBcIuS4muS9meWvuee9keermeW7uuiuvuWPiui/kOiQpeacieW+iOmrmOeahOWFtOiHtO+8jOabvueLrOeri+W7uumAoOi/kOiQpeaVsOS4que9keerme+8jOW5tuWwhuW8gOa6kOezu+e7n+aIkOeGn+eahOWGhemDqOWKn+iDveaooeWdl+S6jOasoeW8gOWPkeS9juaIkOacrOW6lOeUqOS6juW3peS9nOmhueebruS4reOAglwiXSxcbiAgICBncmFkZTogW1wi5Li76KaB5Lia57up77yaXCIsIFwi5a6e5ZCN5YeG5YWl5o6n5Yi277yM57uI56uv5YGl5bq35qOA5p+l77yM5a6e5ZCN5Yi2SVDlnLDlnYDnrqHnkIbvvIzmnaXlrr7orr/lrqLnvZHvvIzpnZ7ms5XlpJbogZTlj4rnvZHnu5zlqIHog4HlrprkvY3vvIznvZHnu5zorr/pl67mjqfliLbvvIzpq5jmgKfog73ml6Xlv5flrZjlgqjlkozlrqHorqHjgIJcIl1cbn0sIHtcbiAgICB0aXRsZTogXCIyMDA0fjIwMDdcIixcbiAgICBjb21wb255OiBcIua4heWNjuWkp+WtpuWHuueJiOekvu+8iOesrOWFreS6i+S4mumDqO+8iS8g5Yib5LiaXCIsXG4gICAgaW50cm86IFtcIjIwMDTlubTmr5XkuJrov5vlhaXljJfkuqzmuIXljY7lpKflrablh7rniYjnpL7nrKzlha3kuovkuJrpg6jlgZrnvZHnq5nnoJTlj5HvvIzpnIDmsYLjgIHorr7orqEoUFMp44CBRmxhc2jliqjnlLvjgIHliY3nq68oaHRtbC9jc3MvanMp44CB5pyN5Yqh56uvKEFTUCnjgIHmlbDmja7lupMoU1FMU2VydmVyKeOAgea1i+ivleOAgeS4gOS6uuWFqOWMheOAglwiLCBcIuS4u+imgeS4mue7qe+8mua4heWNjuWHuueJiOekvuesrOWFreS6i+S4mumDqOWumOaWuee9keerme+8jOW8gOWPkeaWsOS5puOAgeeVhemUgOS5puOAgeeyvuWTgeWbvuS5puWxleekuuWSjOWcqOe6v+iuoui0re+8jOWbvuS5puebuOWFs+i1hOaWmeS4i+i9ve+8jOWSjOivu+iAheeVmeiogOetieWKn+iDveaooeWdl1wiXSxcbiAgICBncmFkZTogW1wiMjAwNeW5tOi+nuaOieW3peS9nOaOpeWNleWBmue9keermeaQnuKAnOWIm+S4muKAneOAglwiLCBcIueLrOeri+W8gOWPke+8mkthcnRlbGwo5oSP5aSn5Yip5LiW55WM6aG257qn5a625YW35ZOB54mMKeWMl+S6rOWumOaWuee9keerme+8jOWMl+S6rOmHkea4r+axvei9puWFrOWbrei2hei3keeyvuiLseS8muWumOaWuee9keerme+8jOWMl+S6rOeWr+eLguiLseivreWfueiureS4reW/g+WumOaWuee9keermeOAgeWcqOe6v+aKpeWQjeezu+e7n+OAgeWPiuWFqOWbveaOiOadg+eCueS6kuWKqOS6pOa1geW5s+WPsO+8jOWUr+azsOWPpOWFuOWutuWFt+e9ke+8jOeIsee+jjM26K6h5YyW5aaG5ZOB5ZWG5Z+O77yMQ2FyYmFzZeaxvei9puaUr+aPtOacjeWKoee9keWPiuiuuuWdm++8jOa4hea1gei/hShzdHJlYW1vY2VhbinnlLXop4bmnLrpobbnm5Lop4bpopHns7vnu5/vvIzlj4rlhbblroPlpKflsI/kvIHkuJrnvZHnq5kzMOWkmuS4qlwiLCBcIuWQjOaXtuW8gOWPkei/kOiQpe+8muW8gOW/g+iLseivreWtpuS5oOe9ke+8jOefpeW3see9kee7nOaKgOacr+S/oeaBr+e9ke+8jOiuuuaWh+aQnOe0ouWfuuWcsO+8jOmdnuW4uEdvb2Tnsr7lk4HnvZHlnYDlr7zoiKrvvIzpnZ7luLhHb29k6K6h566X5py65pWZ56iL572R562J5Z+65LqO5byA5rqQ57O757uf55qE5Liq5Lq6572R56uZ44CCXCJdXG59XTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLypcbiAgICDojrflj5bmoIfpopjliJfooahcbiAgICAgKi9cbiAgICBnZXRMaXN0VGl0bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGl0bGVMaXN0ID0gW107XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBqaW5nbGlEYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgdGl0bGVMaXN0LnB1c2goaXRlbS50aXRsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUodGl0bGVMaXN0KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qXG4gICAg6I635Y+W5omA5pyJ5YiX6KGoXG4gICAgICovXG4gICAgZ2V0TGlzdEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBqaW5nbGlEYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbS50eXBlID0gaXRlbS50aXRsZS5zcGxpdCgnficpWzBdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoamluZ2xpRGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJ2YXIgd29ya0luZm8gPSB7XG4gICAgZGF0YTogW3tcbiAgICAgICAgaWQ6IFwiamlhcGNcIixcbiAgICAgICAgdHlwZTogXCIyMDEyXCIsXG4gICAgICAgIG5hbWU6IFwi5bCP5rC05ru055u05pKtUEPniYhcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9qaWEuMzYwLmNuL3BjXCIsXG4gICAgICAgIGRlc2M6IFwiMzYw56ys5LiA5Liq55u05pKt6aG555uu77yM5YmN5pyf54us56uL5byA5Y+R6LSf6LSj5YWo56uZ5Yqf6IO95qih5Z2X5p6E5bu677yM5Y2P6LCD5aSE55CG5ZCE546v6IqC5rWB56iL77yI6L+Q6JCl44CBUE3jgIHmnI3liqHnq6/mjqXlj6PliLblrprjgIHmtYvor5XjgIHlj43ppojnrYnvvInjgILkvb/nlKjmioDmnK/vvJpzZXdpc2VQbGF5ZXLjgIFzb2NranPjgIFFbW9qaeOAgWZsZXhzbGlkZXLjgIFqUXVlcnktbGF6eWxvYWTjgIFqUXVlcnktdG1wbOetiee7hOS7tlwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ppYXBjL2NvdmVyLnBuZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9qaWFwYy8wMS5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJ+ebtOaSremmlumhtSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhcGMvMDIucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICfnm7Tmkq3popHpgZMnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ppYXBjLzAzLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAn5pKt5pS+6aG1J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9qaWFwYy8wNC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJ+ebtOaSremihOWRiidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhcGMvMDUucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICfkuKrkurrmkYTlg4/mnLrnvZHpobXniYgnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ppYXBjL3QwMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJ+iuv+mXrue7n+iuoSdcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImppYW1vYmlsZVwiLFxuICAgICAgICB0eXBlOiBcIjIwMTJcIixcbiAgICAgICAgbmFtZTogXCLlsI/msLTmu7Tnm7Tmkq3np7vliqjniYhcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9qaWEuMzYwLmNuL21vYmlsZVwiLFxuICAgICAgICBkZXNjOiBcIuS9v+eUqOaKgOacr++8mmg155qEdmlkZW/jgIFFbW9qaeOAgWFydC10ZW1wbGF0ZeOAgWlzY3JvbGzjgIF3ZWJ1cGxvYWRlcuOAgXNvY2tqc+OAgXplcHRvKOWQjue7reaUueS4umpxdWVyeSlcIixcbiAgICAgICAgY292ZXI6IFwiLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhbW9iaWxlL2NvdmVyLmpwZ1wiLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhbW9iaWxlLzAxLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9qaWFtb2JpbGUvMDIuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ppYW1vYmlsZS8wMy5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvamlhbW9iaWxlLzA0LmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9qaWFtb2JpbGUvdDAxLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAn6K6/6Zeu57uf6K6hJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiYmFpa2UzNjBwY1wiLFxuICAgICAgICB0eXBlOiBcIjIwMTJcIixcbiAgICAgICAgbmFtZTogXCIzNjDnmb7np5FQQ+eJiFwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2JhaWtlLnNvLmNvbVwiLFxuICAgICAgICBkZXNjOiBcIuWJjeacn+eLrOeri+i0n+i0o+WFqOermeWJjeerr+inhOWIkuOAgeaehOW7uuOAgeeZvuenkee8lui+keWZqOOAguS4u+WvvOWQjuerr1BIUOmDqOWIhuaooeWdl+aehOW7uijnm7jlhbPor43mnaHjgIHor43mnaHlvJXnlKjmqKHlnZcp44CB5YaF5a656I635Y+WKHBocFF1ZXJ5KeOAgeWGheWuueWkhOeQhihodG1sUHVyaWZpZXIp77yM5YiG57G757O757uf44CB6Ieq5aqS5L2T57O757uf562J44CC5L2/55So5oqA5pyv77yadWVkaXRvcuOAgXNtYXJ0eeOAgWhpZ2hzbGlkZXLjgIFhcnQtZGlhbG9n44CBZGF0ZXBpY2tlcuOAgWpRdWVyeS1jb29raWXjgIFqc29uMuetiee7hOW7ulwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDIucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDMucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDUucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvMDYucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwcGMvdDAxLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAn6K6/6Zeu57uf6K6hJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiYmFpa2UzNjBtb2JpbGVcIixcbiAgICAgICAgdHlwZTogXCIyMDEyXCIsXG4gICAgICAgIG5hbWU6IFwiMzYw55m+56eR56e75Yqo54mIXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vbS5iYWlrZS5zby5jb21cIixcbiAgICAgICAgZGVzYzogXCLliY3mnJ/ni6znq4vlvIDlj5HvvIznrKzkuIDmnJ/vvJrljobml7bkuIDlkajvvIjliY3lkI7nq6/mlbTkvZPmnoTlu7rvvInvvJvnrKzkuozmnJ/vvJrljobml7bkuKTlkajvvIzlpKfph4/kvJjljJbjgIHnm67lvZXjgIFsYXp5bG9hZOOAgeacieaXoOWbvuaooeW8j+OAgeWtl+S9k+iwg+aVtOOAgeaXpeWknOaooeW8j+OAguesrOS4ieacn++8muWPjemmiOWKn+iDveOAgeWKn+iDveW8leWvvOaPkOekuuOAgXN1Z2dlc3TjgIHlm77lhozmtY/op4jnrYnjgILkvb/nlKh6ZXB0b+OAgWlzY3JvbGznrYnnu4Tku7bjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZTM2MG1vYmlsZS9jb3Zlci5qcGcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2UzNjBtb2JpbGUvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwbW9iaWxlLzAyLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9iYWlrZTM2MG1vYmlsZS8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYmFpa2UzNjBtb2JpbGUvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2JhaWtlMzYwbW9iaWxlLzA1LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwidXNlckNlbnRlclwiLFxuICAgICAgICB0eXBlOiBcIjIwMTJcIixcbiAgICAgICAgbmFtZTogXCLlronlhajljavlo6vkvJrlkZjkuK3lv4NcIixcbiAgICAgICAgZGVzYzogXCLliJvpgKDmnKzlnLBkZWJ1Z+W8gOWPkeaooeW8j++8jOW9u+W6leiEseemu+eglOWPkeeOr+Wig+WvueWuouaIt+err+eahOS+nei1lu+8jOWinuWKoOe6v+S4iuS4gOmUruW8gOWQr2RlYnVn77yM5b+r6YCf5a6a5L2N6Zeu6aKY77yM5aSn5aSn5o+Q6auY5a6i5oi356uv5YaF5bWMV0VC55qE56CU5Y+R5pWI546H44CC5Li76KaB5oqA5pyv77yaUXdyYXDjgIFRd3JhcC1wcm9taXNl44CBUXdyYXAtbGF6eWxvYWTjgIFRd3JhcC1oYXNoLWhpc3Ryb3njgIFRd3JhcC1zY3JvbGwtYmFy44CBUXdyYXAtZGF0YU1vZGFs562J5qih5Z2X44CCXCIsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy91Y2VudGVyMzYwLzAxLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnMzYw5Lya5ZGY5Lit5b+D6aaW6aG1J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy91Y2VudGVyMzYwLzAyLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnMzYw5Lya5ZGY5Lit5b+D5YGa5Lu75YqhJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy91Y2VudGVyMzYwLzAzLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnMzYw5Lya5ZGY5Lit5b+D6aKG54m55p2DJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwidmlwMzYwXCIsXG4gICAgICAgIHR5cGU6IFwiMjAxMlwiLFxuICAgICAgICBuYW1lOiBcIjM2MOS8muWRmOWVhuWfjlwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL3ZpcC4zNjAuY24vbWFsbC9cIixcbiAgICAgICAgZGVzYzogXCLlhajnq5nln7rkuo5ib290c3RyYXDkuozmrKHlvIDlj5HjgIJqUXVlcnktdG1wbOOAgWpRdWVyeS1jb29raWXnrYnnu4Tku7ZcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy92aXAzNjAvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3ZpcDM2MC8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvdmlwMzYwLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwibWl3YW4zNjYzXCIsXG4gICAgICAgIHR5cGU6IFwiMjAxMlwiLFxuICAgICAgICBuYW1lOiBcIjM2NjNNaeeOqee+juWls+ebtOaSrVwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL3d3dy4zNjYzLmNvbVwiLFxuICAgICAgICBkZXNjOiBcIue+juWls+ebtOaSreOAgemAgeekvO+8jOWfuuS6jmd1bHDoh6rliqjljJblt6XkvZzmtYHjgIFicm93c2VyaWZ557uE57uHY29tbW9uanPmoIflh4bnmoRub2RlanPku6PnoIHlnKjmtY/op4jlmajov5DooYzjgIHliIblsYLop4TliJLmqKHlnZflvI/mnoTlu7rvvIjmnI3liqHlsYLjgIHmqKHlnZflsYLvvInvvIxQcm9taXNl5byC5q2l57yW56iLXCIsXG4gICAgICAgIGNvdmVyOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvbWl3YW4zNjYzL2NvdmVyLnBuZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9taXdhbjM2NjMvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL21pd2FuMzY2My8wMi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcIjVrb25ndHZcIixcbiAgICAgICAgdHlwZTogXCIyMDEyXCIsXG4gICAgICAgIG5hbWU6IFwi5oKf56m6VFbmuLjmiI/nm7Tmkq1cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly93d3cuNWtvbmcudHZcIixcbiAgICAgICAgZGVzYzogXCLmuLjmiI/nm7Tmkq3jgIHpgIHnpLzjgILln7rkuo5ndWxw6Ieq5Yqo5YyW5bel5L2c5rWB44CBYnJvd3Nlcmlmeee7hOe7h2NvbW1vbmpz5qCH5YeG55qEbm9kZWpz5Luj56CB5Zyo5rWP6KeI5Zmo6L+Q6KGM44CB5YiG5bGC6KeE5YiS5qih5Z2X5byP5p6E5bu677yI5pyN5Yqh5bGC44CB5qih5Z2X5bGC77yJ77yMUHJvbWlzZeW8guatpee8lueoi1wiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljLzVrb25ndHYvY292ZXIuanBnJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljLzVrb25ndHYvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljLzVrb25ndHYvMDIuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJpZG5hY1wiLFxuICAgICAgICB0eXBlOiBcIjIwMDdcIixcbiAgICAgICAgbmFtZTogXCLlrp7lkI3liLZJROe9kee7nOeuoeeQhuezu+e7n1wiLFxuICAgICAgICBkZXNjOiBcIuW6leWxguS9v+eUqEPor63oqIDkuI7noazku7bkuqTkupLjgIFQSFDkvZzkuLrkuK3pl7TlsYLlrp7njrDkuJrliqHpgLvovpHjgILliY3mnJ/ni6znq4votJ/otKPorr7orqHjgIHliY3nq6/jgIFQSFDlsYLnmoTlkITmqKHlnZfmnoTlu7rjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZG5hYy9jb3Zlci5wbmcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRuYWMvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkbmFjLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZG5hYy8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRuYWMvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkbmFjLzA1LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZG5hYy8wNi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRuYWMvMDcucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkbmFjLzA4LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiaWR3YWxsXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwN1wiLFxuICAgICAgICBuYW1lOiBcIklEV2FsbOWHhuWFpemYsueBq+WimVwiLFxuICAgICAgICBkZXNjOiBcIuWfuuS6jklETmFj6KOB5Ymq5byA5Y+R77yM5YmN5pyf54us56uL5p6E5bu644CCSURXYWxs5piv5LiT5Li65L+d5oqk5YaF572R6LWE5rqQ6ICM6K6+6K6h55qE5YeG5YWl6Ziy54Gr5aKZ44CC5a6D5piv5LiW55WM5LiK6aaW5qy+5pSv5oyB5a6e5ZCN5Yi2SUTnvZHnu5zmioDmnK/nmoTjgIHlhbfmnInlh4blhaXmjqfliLblip/og73nmoTpmLLngavlopnjgILmnInliKvkuo7kvKDnu5/nmoTpmLLngavlopnvvIxJRFdhbGzlrp7njrDkuoblronlhajln5/nmoTnrqHnkIbvvIznrKblkIjlm73lrrblronlhajms5Xop4TkuK3opoHmsYLnmoTnvZHnu5zotYTmupDlv4XpobvliIbljLrliIbln5/jgIHkuKXnpoHkuI3lkIznrYnnuqfnmoTlronlhajln5/kupLpgJrnmoTop4TlrprjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZHdhbGwvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkd2FsbC8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWR3YWxsLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZHdhbGwvMDMucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJmdXphaWp1bmhlbmdcIixcbiAgICAgICAgdHlwZTogXCIyMDA3XCIsXG4gICAgICAgIG5hbWU6IFwi5Zu95a6255S1572R6LSf6L295Z2H6KGh57O757ufXCIsXG4gICAgICAgIGRlc2M6IFwi5Z+65LqOSUROYWPoo4HliarlvIDlj5HvvIzliY3mnJ/ni6znq4vmnoTlu7rjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9mdXphaWp1bmhlbmcvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Z1emFpanVuaGVuZy8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvZnV6YWlqdW5oZW5nLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9mdXphaWp1bmhlbmcvMDMucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Z1emFpanVuaGVuZy8wNC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImZlaWZhd2FpbGlhblwiLFxuICAgICAgICB0eXBlOiBcIjIwMDdcIixcbiAgICAgICAgbmFtZTogXCLlm73lrrbnlLXnvZHpnZ7ms5XlpJbogZTmo4DmtYvns7vnu59cIixcbiAgICAgICAgZGVzYzogXCLln7rkuo5JRE5hY+ijgeWJquW8gOWPke+8jOWJjeacn+eLrOeri+aehOW7uuOAglwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ZlaWZhd2FpbGlhbi9jb3Zlci5wbmcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvZmVpZmF3YWlsaWFuLzAxLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9mZWlmYXdhaWxpYW4vMDIucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2ZlaWZhd2FpbGlhbi8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvZmVpZmF3YWlsaWFuLzA0LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwia29uZ3poaXdhbmdndWFuXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwN1wiLFxuICAgICAgICBuYW1lOiBcIuWFrOWuiemDqOaOp+WItue9keWFs1wiLFxuICAgICAgICB0aW1lOiBcIjIwMTHlubTkvZzlk4FcIixcbiAgICAgICAgZGVzYzogXCLln7rkuo5JRE5hY+ijgeWJquW8gOWPke+8jOWJjeacn+eLrOeri+aehOW7uuOAguS4uuWFrOWuiemDqOmXqOWBmueahOmhueebru+8jOe7k+WQiElETmFj5a6e546w5LiL5bGe5bKX5Lqt5o6l5YWl57uI56uv55qE55uR5o6n5ZKM566h55CGXCIsXG4gICAgICAgIGNvdmVyOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva29uZ3poaXdhbmdndWFuL2NvdmVyLnBuZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9rb25nemhpd2FuZ2d1YW4vMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2tvbmd6aGl3YW5nZ3Vhbi8wMi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva29uZ3poaXdhbmdndWFuLzAzLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9rb25nemhpd2FuZ2d1YW4vMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2tvbmd6aGl3YW5nZ3Vhbi8wNS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImlkc2Vuc29yXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwN1wiLFxuICAgICAgICBuYW1lOiBcIklE572R57uc566h55CG57O757uf6L+c56uv5Luj55CGXCIsXG4gICAgICAgIHRpbWU6IFwiMjAxMeW5tOS9nOWTgVwiLFxuICAgICAgICBkZXNjOiBcIklEU2Vuc29y5Y+v5Lul55uR6KeG5ZKM5o6n5Yi26L+c56uv5YiG5pSv5py65p6E55qE572R57uc77yM6YWN5ZCISUROYWPvvIzlrp7njrDlhajnvZHnmoTnrqHmjqfvvIznoa7kv53lhajnvZHnmoTnvZHnu5zovrnnlYznmoTlrozmlbTjgILop6PlhrPnlLHkuo7nvZHnu5zliIbluIPlnLDln5/lub/jgIHkuI3mmJPnm5Hlr5/jgIHkuI3mmJPnrqHnkIbnmoTpl67popjvvIzluK7liqnnvZHnrqHkurrlkZjlrp7njrDov5znq6/lhajnvZHmjozmjqfnmoTpmr7popjjgIJcIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZHNlbnNvci9jb3Zlci5wbmcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRzZW5zb3IvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2lkc2Vuc29yLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9pZHNlbnNvci8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvaWRzZW5zb3IvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJhY2twcm9qZWN0XCIsXG4gICAgICAgIHR5cGU6IFwiMjAwN1wiLFxuICAgICAgICBuYW1lOiBcIkFDS+mhueebruS9nOWTgVwiLFxuICAgICAgICBkZXNjOiBcIuWHoOS4qumHjeeCueWunuWcsOmDqOe9sueahOmhueebrlwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvY292ZXIuanBnJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDIuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDMuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDQuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDUuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja3Byb2plY3QvMDYuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJhY2tiYnNcIixcbiAgICAgICAgdHlwZTogXCIyMDA3XCIsXG4gICAgICAgIG5hbWU6IFwiQWNrd29ya3Pkuqflk4HmioDmnK/kuqTmtYHorrrlnZtcIixcbiAgICAgICAgZGVzYzogXCLln7rkuo7lvIDmupDns7vnu59QSFBXaW5k5p6E5bu644CC5Li656CU5Y+R44CB6ZSA5ZSu44CB5a6i5oi35o+Q5L6b6K6o6K66546w5a2Y6Zeu6aKY77yM5paw55qE5Yqf6IO956CU5Y+R77yM6K6o6K665Lqn5ZOB55qE5Y+R5biD5pyq6Kej5Yaz55qEQlVH77yM6ZSA5ZSu5Lit55qE6Zeu6aKY5bu66K6uXCIsXG4gICAgICAgIGNvdmVyOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYWNrYmJzL2NvdmVyLmpwZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9hY2tiYnMvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2Fja2Jicy8wMi5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYWNrYmJzLzAzLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9hY2tiYnMvMDQuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJxaW5naHVhXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwNFwiLFxuICAgICAgICBuYW1lOiBcIua4heWNjuWkp+WtpuWHuueJiOekvuesrOWFreS6i+S4mumDqFwiLFxuICAgICAgICB0aW1lOiBcIjIwMDQtMjAwNeW5tOS9nOWTgVwiLFxuICAgICAgICBkZXNjOiBcIuWFqOagiOeLrOeri+W8gOWPkeOAgua4heWNjuWHuueJiOekvuesrOWFreS6i+S4mumDqOWumOaWuee9keerme+8jOaWsOS5puOAgeeVhemUgOS5puOAgeeyvuWTgeWbvuS5puWxleekuuWSjOWcqOe6v+iuoui0re+8jOWbvuS5puebuOWFs+i1hOaWmeS4i+i9ve+8jOWSjOivu+iAheeVmeiogOetiVwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvY292ZXIuanBnJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDIuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDMuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDQuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDUuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3FpbmdodWEvMDYuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfSwge1xuICAgICAgICBpZDogXCJrYXJ0ZWxsXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwNFwiLFxuICAgICAgICBuYW1lOiBcIkthcnRlbGwo5oSP5aSn5YipKeWutuWFt+i0uOaYk+WMl+S6rOe9keermVwiLFxuICAgICAgICB0aW1lOiBcIjIwMDblubTkvZzlk4FcIixcbiAgICAgICAgZGVzYzogXCLlhajmoIjni6znq4vlvIDlj5HjgILmhI/lpKfliKnkuJbnlYzpobbnuqflk4HniYzlrrblhbfljJfkuqzlrpjmlrnnvZHnq5njgIHpppbpobXph4fnlKjlhahGbGFzaOW8gOWPke+8jOS6p+WTgeWxleekuuWSjOWcqOe6v+iuoui0rVwiLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wMi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wNC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wNS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wNi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wNy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wOC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8wOS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMva2FydGVsbC8xMC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImF1dG93b3Jrc1wiLFxuICAgICAgICB0eXBlOiBcIjIwMDRcIixcbiAgICAgICAgbmFtZTogXCJBdXRvV29ya3PotoXot5Hnsr7oi7HkvJpcIixcbiAgICAgICAgdGltZTogXCIyMDA15bm05L2c5ZOBXCIsXG4gICAgICAgIGRlc2M6IFwi5YWo5qCI54us56uL5byA5Y+R44CC5YyX5Lqs6YeR5riv5rG96L2m5YWs5Zut6LaF6LeR57K+6Iux5Lya5a6Y5pa5572R56uZ77yM6L2m6L6G5pS56KOF44CB6ZSA5ZSu44CB56S85ZOB44CB6LWb5LqL5rS75YqoXCIsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9hdXRvd29ya3MvMDEucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2F1dG93b3Jrcy8wMi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvYXV0b3dvcmtzLzAzLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9hdXRvd29ya3MvMDQucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2F1dG93b3Jrcy8wNS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcImNyYXp5ZW5nbGlzaFwiLFxuICAgICAgICB0eXBlOiBcIjIwMDRcIixcbiAgICAgICAgbmFtZTogXCLljJfkuqznlq/ni4Loi7Hor63pobnnm65cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly93d3cuYmpjcmF6eWVuZ2xpc2guY29tL1wiLFxuICAgICAgICBkZXNjOiBcIueWr+eLguiLseivreWumOaWuee9keerme+8iOWfuuS6juenkeiur+W8gOa6kOezu+e7n++8ieOAgeWcqOe6v+aKpeWQjeezu+e7n++8iOWFqOagiOeLrOeri+W8gOWPke+8ieOAgeWFqOWbveaOiOadg+eCueS6kuWKqOS6pOa1geW5s+WPsO+8iOWFqOagiOeLrOeri+W8gOWPke+8iVwiLFxuICAgICAgICBjb3ZlcjogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2NyYXp5ZW5nbGlzaC9jb3Zlci5wbmcnLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvY3JhenllbmdsaXNoLzAxLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9jcmF6eWVuZ2xpc2gvMDIucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2NyYXp5ZW5nbGlzaC8wMy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvY3JhenllbmdsaXNoLzA0LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9jcmF6eWVuZ2xpc2gvMDUucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2NyYXp5ZW5nbGlzaC8wNi5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvY3JhenllbmdsaXNoLzA3LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9jcmF6eWVuZ2xpc2gvMDgucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL2NyYXp5ZW5nbGlzaC8wOS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvY3JhenllbmdsaXNoLzEwLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwid2VpdGFpXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwNFwiLFxuICAgICAgICBuYW1lOiBcIuWUr+azsOWPpOWFuOWutuWxhee9kVwiLFxuICAgICAgICB0aW1lOiBcIjIwMDflubTkvZzlk4FcIixcbiAgICAgICAgZGVzYzogXCLln7rkuo5BU1Dnp5Horq/ns7vnu5/kuozmrKHlvIDlj5HvvIzlsbHopb/lpKrljp/lnLDmlrnlrrblhbfnvZHnq5nvvIzlrp7njrDlj6TlhbjlrrblhbflsZXnpLrjgIHlnKjnur/orqLotK3jgIHkvJrlkZjkupLliqjnrYnlip/og71cIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy93ZWl0YWkvY292ZXIucG5nJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3dlaXRhaS8wMS5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvd2VpdGFpLzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy93ZWl0YWkvMDMucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3dlaXRhaS8wNC5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvd2VpdGFpLzA1LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy93ZWl0YWkvMDYucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL3dlaXRhaS8wNy5wbmcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvd2VpdGFpLzA4LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwiYWltZWkzNuiuoVwiLFxuICAgICAgICB0eXBlOiBcIjIwMDRcIixcbiAgICAgICAgbmFtZTogXCLniLHnvo4zNuWMluWmhuWTgeWcqOe6v+WVhuWfjlwiLFxuICAgICAgICB0aW1lOiBcIjIwMDnlubTkvZzlk4FcIixcbiAgICAgICAgZGVzYzogXCLln7rkuo5QSFDnmoRzaG9wZXjkuozmrKHlvIDlj5HvvIzlrozmlbTnmoTlnKjnur/llYbln47ns7vnu59cIixcbiAgICAgICAgY292ZXI6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2L2NvdmVyLnBuZycsXG4gICAgICAgIGxpc3Q6IFt7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2LzAxLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2LzAyLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2LzAzLnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9haW1laTM2LzA0LnBuZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9XVxuICAgIH0sIHtcbiAgICAgICAgaWQ6IFwienp1bGlialwiLFxuICAgICAgICB0eXBlOiBcIjIwMDRcIixcbiAgICAgICAgbmFtZTogXCLpg5Hlt57ovbvlt6XkuJrlrabpmaLljJfkuqzmoKHlj4vkvJpcIixcbiAgICAgICAgZGVzYzogXCLkuLrpg5Hlt57ovbvlt6XkuJrlrabpmaLmr5XkuJrnmoTjgIHlnKjljJfkuqzlt6XkvZznmoTmoKHlj4vvvIzmj5DkvpvlnKjnur/msp/pgJrjgIHkuqTmtYHnmoTlubPlj7DjgILln7rkuo7lurfnm5vliJvmg7PnmoQgdWNlbnRlciBob21lIOS6jOasoeW8gOWPkVwiLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wMS5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wMi5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wMy5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wNC5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvenp1bGliai8wNS5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfV1cbiAgICB9LCB7XG4gICAgICAgIGlkOiBcIm90aGVyXCIsXG4gICAgICAgIHR5cGU6IFwiMjAwNFwiLFxuICAgICAgICBuYW1lOiBcIuWFtuWug+S9nOWTgemDqOWIhuS/oeaBr1wiLFxuICAgICAgICBkZXNjOiBcIjIwMDXlubTotbfmjqXljZXlgZrnvZHnq5njgIHln7rkuo7lvIDmupDns7vnu5/mkK3lu7rkuKrkurrnvZHnq5njgIHnmoTpg6jliIbkvZzlk4Eo5aSn5bCP5LyB5Lia56uZMzDlpJrkuKopXCIsXG4gICAgICAgIGNvdmVyOiBcIi4vc3RhdGljL2ltYWdlcy9keW5hbWljL290aGVyL2NvdmVyLnBuZ1wiLFxuICAgICAgICBsaXN0OiBbe1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvb3RoZXIvMDEuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL290aGVyLzAyLmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9vdGhlci8wMy5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvb3RoZXIvMDQuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL290aGVyLzA1LmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9vdGhlci8wNi5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvb3RoZXIvMDcuanBnJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHVybDogJy4vc3RhdGljL2ltYWdlcy9keW5hbWljL290aGVyLzA4LmpwZycsXG4gICAgICAgICAgICBjYXB0aW9uOiAnJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB1cmw6ICcuL3N0YXRpYy9pbWFnZXMvZHluYW1pYy9vdGhlci8wOS5qcGcnLFxuICAgICAgICAgICAgY2FwdGlvbjogJydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdXJsOiAnLi9zdGF0aWMvaW1hZ2VzL2R5bmFtaWMvb3RoZXIvMTAucG5nJyxcbiAgICAgICAgICAgIGNhcHRpb246ICcnXG4gICAgICAgIH1dXG4gICAgfV1cbn07XG5cbnZhciB3b3JrcyA9IHtcbiAgICAvKlxuICAgIOiOt+WPluS9nOWTgeWIl+ihqOW5tuWBmuS4gOS6m+agvOW8j+WKoOW3pVxuICAgICAqL1xuICAgIGdldExpc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbGlzdERhdGEgPSBbXTtcbiAgICAgICAgcmV0dXJuIFEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICAgICAgd29ya0luZm8uZGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtRGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW1EYXRhLmlkID0gaXRlbS5pZDtcbiAgICAgICAgICAgICAgICBpdGVtRGF0YS5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgICAgICAgIGl0ZW1EYXRhLnVybCA9IGl0ZW0udXJsIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgaXRlbURhdGEudGlwID0gaXRlbS50aXAgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICBpdGVtRGF0YS5kZXNjID0gaXRlbS5kZXNjIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgaXRlbURhdGEuY292ZXIgPSBpdGVtLmNvdmVyIHx8IChpdGVtLmxpc3QgPyBpdGVtLmxpc3RbMF0udXJsIDogXCJcIik7XG5cbiAgICAgICAgICAgICAgICBsaXN0RGF0YS5wdXNoKGl0ZW1EYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzb2x2ZShsaXN0RGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKlxuICAgIOagueaNruexu+Wei+iOt+WPluS9nOWTgeWIl+ihqFxuICAgICAqL1xuICAgIGdldExpc3RCeVR5cGU6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGxpc3REYXRhID0gW107XG4gICAgICAgIHJldHVybiBRLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgICAgICAgIHdvcmtJbmZvLmRhdGEubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBpdGVtLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1EYXRhID0ge307XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1EYXRhLmlkID0gaXRlbS5pZDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGEubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGEudXJsID0gaXRlbS51cmwgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGEudGlwID0gaXRlbS50aXAgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGEuZGVzYyA9IGl0ZW0uZGVzYyB8fCBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpdGVtRGF0YS5jb3ZlciA9IGl0ZW0uY292ZXIgfHwgKGl0ZW0ubGlzdCA/IGl0ZW0ubGlzdFswXS51cmwgOiBcIlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBsaXN0RGF0YS5wdXNoKGl0ZW1EYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUobGlzdERhdGEpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICDmoLnmja5pZOiOt+WPluWNleS4quS9nOWTgVxuICAgICAqL1xuICAgIGdldEJ5SWQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHZhciBpdGVtRGF0YSA9IHt9O1xuICAgICAgICByZXR1cm4gUS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgd29ya0luZm8uZGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpZCA9PSBpdGVtLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1EYXRhID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbURhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdvcmtzO1xuIiwiaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuL2hhbmRsZWJhcnMvYmFzZSc7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG5pbXBvcnQgU2FmZVN0cmluZyBmcm9tICcuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2hhbmRsZWJhcnMvZXhjZXB0aW9uJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vaGFuZGxlYmFycy91dGlscyc7XG5pbXBvcnQgKiBhcyBydW50aW1lIGZyb20gJy4vaGFuZGxlYmFycy9ydW50aW1lJztcblxuaW1wb3J0IG5vQ29uZmxpY3QgZnJvbSAnLi9oYW5kbGViYXJzL25vLWNvbmZsaWN0JztcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gIGxldCBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG4gIGhiLmVzY2FwZUV4cHJlc3Npb24gPSBVdGlscy5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn1cblxubGV0IGluc3QgPSBjcmVhdGUoKTtcbmluc3QuY3JlYXRlID0gY3JlYXRlO1xuXG5ub0NvbmZsaWN0KGluc3QpO1xuXG5pbnN0WydkZWZhdWx0J10gPSBpbnN0O1xuXG5leHBvcnQgZGVmYXVsdCBpbnN0O1xuIiwiaW1wb3J0IHtjcmVhdGVGcmFtZSwgZXh0ZW5kLCB0b1N0cmluZ30gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7cmVnaXN0ZXJEZWZhdWx0SGVscGVyc30gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCB7cmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9yc30gZnJvbSAnLi9kZWNvcmF0b3JzJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9ICc0LjAuNSc7XG5leHBvcnQgY29uc3QgQ09NUElMRVJfUkVWSVNJT04gPSA3O1xuXG5leHBvcnQgY29uc3QgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc9PSAxLngueCcsXG4gIDU6ICc9PSAyLjAuMC1hbHBoYS54JyxcbiAgNjogJz49IDIuMC4wLWJldGEuMScsXG4gIDc6ICc+PSA0LjAuMCdcbn07XG5cbmNvbnN0IG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZXhwb3J0IGZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscywgZGVjb3JhdG9ycykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG4gIHRoaXMuZGVjb3JhdG9ycyA9IGRlY29yYXRvcnMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbiAgcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyh0aGlzKTtcbn1cblxuSGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2dnZXIubG9nLFxuXG4gIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIGV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5oZWxwZXJzW25hbWVdO1xuICB9LFxuXG4gIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSwgcGFydGlhbCkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBleHRlbmQodGhpcy5wYXJ0aWFscywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgcGFydGlhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihgQXR0ZW1wdGluZyB0byByZWdpc3RlciBhIHBhcnRpYWwgY2FsbGVkIFwiJHtuYW1lfVwiIGFzIHVuZGVmaW5lZGApO1xuICAgICAgfVxuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHBhcnRpYWw7XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLnBhcnRpYWxzW25hbWVdO1xuICB9LFxuXG4gIHJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBkZWNvcmF0b3JzJyk7IH1cbiAgICAgIGV4dGVuZCh0aGlzLmRlY29yYXRvcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlY29yYXRvcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5kZWNvcmF0b3JzW25hbWVdO1xuICB9XG59O1xuXG5leHBvcnQgbGV0IGxvZyA9IGxvZ2dlci5sb2c7XG5cbmV4cG9ydCB7Y3JlYXRlRnJhbWUsIGxvZ2dlcn07XG4iLCJpbXBvcnQgcmVnaXN0ZXJJbmxpbmUgZnJvbSAnLi9kZWNvcmF0b3JzL2lubGluZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVySW5saW5lKGluc3RhbmNlKTtcbn1cblxuIiwiaW1wb3J0IHtleHRlbmR9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJEZWNvcmF0b3IoJ2lubGluZScsIGZ1bmN0aW9uKGZuLCBwcm9wcywgY29udGFpbmVyLCBvcHRpb25zKSB7XG4gICAgbGV0IHJldCA9IGZuO1xuICAgIGlmICghcHJvcHMucGFydGlhbHMpIHtcbiAgICAgIHByb3BzLnBhcnRpYWxzID0ge307XG4gICAgICByZXQgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBwYXJ0aWFscyBzdGFjayBmcmFtZSBwcmlvciB0byBleGVjLlxuICAgICAgICBsZXQgb3JpZ2luYWwgPSBjb250YWluZXIucGFydGlhbHM7XG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IGV4dGVuZCh7fSwgb3JpZ2luYWwsIHByb3BzLnBhcnRpYWxzKTtcbiAgICAgICAgbGV0IHJldCA9IGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcmlnaW5hbDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvcHMucGFydGlhbHNbb3B0aW9ucy5hcmdzWzBdXSA9IG9wdGlvbnMuZm47XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiIsIlxuY29uc3QgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIGxldCBsb2MgPSBub2RlICYmIG5vZGUubG9jLFxuICAgICAgbGluZSxcbiAgICAgIGNvbHVtbjtcbiAgaWYgKGxvYykge1xuICAgIGxpbmUgPSBsb2Muc3RhcnQubGluZTtcbiAgICBjb2x1bW4gPSBsb2Muc3RhcnQuY29sdW1uO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBjb2x1bW47XG4gIH1cblxuICBsZXQgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRXhjZXB0aW9uKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKGxvYykge1xuICAgICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcblxuICAgICAgLy8gV29yayBhcm91bmQgaXNzdWUgdW5kZXIgc2FmYXJpIHdoZXJlIHdlIGNhbid0IGRpcmVjdGx5IHNldCB0aGUgY29sdW1uIHZhbHVlXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NvbHVtbicsIHt2YWx1ZTogY29sdW1ufSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKG5vcCkge1xuICAgIC8qIElnbm9yZSBpZiB0aGUgYnJvd3NlciBpcyB2ZXJ5IHBhcnRpY3VsYXIgKi9cbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4Y2VwdGlvbjtcbiIsImltcG9ydCByZWdpc3RlckJsb2NrSGVscGVyTWlzc2luZyBmcm9tICcuL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcnO1xuaW1wb3J0IHJlZ2lzdGVyRWFjaCBmcm9tICcuL2hlbHBlcnMvZWFjaCc7XG5pbXBvcnQgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nIGZyb20gJy4vaGVscGVycy9oZWxwZXItbWlzc2luZyc7XG5pbXBvcnQgcmVnaXN0ZXJJZiBmcm9tICcuL2hlbHBlcnMvaWYnO1xuaW1wb3J0IHJlZ2lzdGVyTG9nIGZyb20gJy4vaGVscGVycy9sb2cnO1xuaW1wb3J0IHJlZ2lzdGVyTG9va3VwIGZyb20gJy4vaGVscGVycy9sb29rdXAnO1xuaW1wb3J0IHJlZ2lzdGVyV2l0aCBmcm9tICcuL2hlbHBlcnMvd2l0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVyQmxvY2tIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJFYWNoKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJJZihpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyTG9nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJMb29rdXAoaW5zdGFuY2UpO1xuICByZWdpc3RlcldpdGgoaW5zdGFuY2UpO1xufVxuIiwiaW1wb3J0IHthcHBlbmRDb250ZXh0UGF0aCwgY3JlYXRlRnJhbWUsIGlzQXJyYXl9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSxcbiAgICAgICAgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZiAoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmlkcykge1xuICAgICAgICAgIG9wdGlvbnMuaWRzID0gW29wdGlvbnMubmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLm5hbWUpO1xuICAgICAgICBvcHRpb25zID0ge2RhdGE6IGRhdGF9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7YXBwZW5kQ29udGV4dFBhdGgsIGJsb2NrUGFyYW1zLCBjcmVhdGVGcmFtZSwgaXNBcnJheSwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ011c3QgcGFzcyBpdGVyYXRvciB0byAjZWFjaCcpO1xuICAgIH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm4sXG4gICAgICAgIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICByZXQgPSAnJyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29udGV4dFBhdGg7XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICBjb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pICsgJy4nO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWNJdGVyYXRpb24oZmllbGQsIGluZGV4LCBsYXN0KSB7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBkYXRhLmtleSA9IGZpZWxkO1xuICAgICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGRhdGEuZmlyc3QgPSBpbmRleCA9PT0gMDtcbiAgICAgICAgZGF0YS5sYXN0ID0gISFsYXN0O1xuXG4gICAgICAgIGlmIChjb250ZXh0UGF0aCkge1xuICAgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aCArIGZpZWxkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbZmllbGRdLCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dFtmaWVsZF0sIGZpZWxkXSwgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29udGV4dC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJpb3JLZXk7XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBydW5uaW5nIHRoZSBpdGVyYXRpb25zIG9uZSBzdGVwIG91dCBvZiBzeW5jIHNvIHdlIGNhbiBkZXRlY3RcbiAgICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcbiAgICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuXG4gICAgICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvcktleSA9IGtleTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiIsImltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbigvKiBbYXJncywgXW9wdGlvbnMgKi8pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gQSBtaXNzaW5nIGZpZWxkIGluIGEge3tmb299fSBjb25zdHJ1Y3QuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb21lb25lIGlzIGFjdHVhbGx5IHRyeWluZyB0byBjYWxsIHNvbWV0aGluZywgYmxvdyB1cC5cbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ01pc3NpbmcgaGVscGVyOiBcIicgKyBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdLm5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHtpc0VtcHR5LCBpc0Z1bmN0aW9ufSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7IGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTsgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG4gICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cbiAgICBpZiAoKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsKSB8fCBpc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNofSk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKC8qIG1lc3NhZ2UsIG9wdGlvbnMgKi8pIHtcbiAgICBsZXQgYXJncyA9IFt1bmRlZmluZWRdLFxuICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cblxuICAgIGxldCBsZXZlbCA9IDE7XG4gICAgaWYgKG9wdGlvbnMuaGFzaC5sZXZlbCAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IG9wdGlvbnMuaGFzaC5sZXZlbDtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCkge1xuICAgICAgbGV2ZWwgPSBvcHRpb25zLmRhdGEubGV2ZWw7XG4gICAgfVxuICAgIGFyZ3NbMF0gPSBsZXZlbDtcblxuICAgIGluc3RhbmNlLmxvZyguLi4gYXJncyk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvb2t1cCcsIGZ1bmN0aW9uKG9iaiwgZmllbGQpIHtcbiAgICByZXR1cm4gb2JqICYmIG9ialtmaWVsZF07XG4gIH0pO1xufVxuIiwiaW1wb3J0IHthcHBlbmRDb250ZXh0UGF0aCwgYmxvY2tQYXJhbXMsIGNyZWF0ZUZyYW1lLCBpc0VtcHR5LCBpc0Z1bmN0aW9ufSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoIWlzRW1wdHkoY29udGV4dCkpIHtcbiAgICAgIGxldCBkYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuICAgICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm4oY29udGV4dCwge1xuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBibG9ja1BhcmFtczogYmxvY2tQYXJhbXMoW2NvbnRleHRdLCBbZGF0YSAmJiBkYXRhLmNvbnRleHRQYXRoXSlcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQge2luZGV4T2Z9IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IFsnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10sXG4gIGxldmVsOiAnaW5mbycsXG5cbiAgLy8gTWFwcyBhIGdpdmVuIGxldmVsIHZhbHVlIHRvIHRoZSBgbWV0aG9kTWFwYCBpbmRleGVzIGFib3ZlLlxuICBsb29rdXBMZXZlbDogZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBpZiAodHlwZW9mIGxldmVsID09PSAnc3RyaW5nJykge1xuICAgICAgbGV0IGxldmVsTWFwID0gaW5kZXhPZihsb2dnZXIubWV0aG9kTWFwLCBsZXZlbC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIGlmIChsZXZlbE1hcCA+PSAwKSB7XG4gICAgICAgIGxldmVsID0gbGV2ZWxNYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXZlbCA9IHBhcnNlSW50KGxldmVsLCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxldmVsO1xuICB9LFxuXG4gIC8vIENhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIC4uLm1lc3NhZ2UpIHtcbiAgICBsZXZlbCA9IGxvZ2dlci5sb29rdXBMZXZlbChsZXZlbCk7XG5cbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGxvZ2dlci5sb29rdXBMZXZlbChsb2dnZXIubGV2ZWwpIDw9IGxldmVsKSB7XG4gICAgICBsZXQgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kXSkgeyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICBtZXRob2QgPSAnbG9nJztcbiAgICAgIH1cbiAgICAgIGNvbnNvbGVbbWV0aG9kXSguLi5tZXNzYWdlKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iLCIvKiBnbG9iYWwgd2luZG93ICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihIYW5kbGViYXJzKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGxldCByb290ID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3csXG4gICAgICAkSGFuZGxlYmFycyA9IHJvb3QuSGFuZGxlYmFycztcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgSGFuZGxlYmFycy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJvb3QuSGFuZGxlYmFycyA9PT0gSGFuZGxlYmFycykge1xuICAgICAgcm9vdC5IYW5kbGViYXJzID0gJEhhbmRsZWJhcnM7XG4gICAgfVxuICAgIHJldHVybiBIYW5kbGViYXJzO1xuICB9O1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7IENPTVBJTEVSX1JFVklTSU9OLCBSRVZJU0lPTl9DSEFOR0VTLCBjcmVhdGVGcmFtZSB9IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICBjb25zdCBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIGNvbnN0IHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIHJ1bnRpbWVWZXJzaW9ucyArICcpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVyVmVyc2lvbnMgKyAnKS4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVySW5mb1sxXSArICcpLicpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGUnKTtcbiAgfVxuICBpZiAoIXRlbXBsYXRlU3BlYyB8fCAhdGVtcGxhdGVTcGVjLm1haW4pIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbmtub3duIHRlbXBsYXRlIG9iamVjdDogJyArIHR5cGVvZiB0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgdGVtcGxhdGVTcGVjLm1haW4uZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjLm1haW5fZDtcblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICBlbnYuVk0uY2hlY2tSZXZpc2lvbih0ZW1wbGF0ZVNwZWMuY29tcGlsZXIpO1xuXG4gIGZ1bmN0aW9uIGludm9rZVBhcnRpYWxXcmFwcGVyKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgICBjb250ZXh0ID0gVXRpbHMuZXh0ZW5kKHt9LCBjb250ZXh0LCBvcHRpb25zLmhhc2gpO1xuICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIG9wdGlvbnMuaWRzWzBdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJ0aWFsID0gZW52LlZNLnJlc29sdmVQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG4gICAgbGV0IHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwgJiYgZW52LmNvbXBpbGUpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHRlbXBsYXRlU3BlYy5jb21waWxlck9wdGlvbnMsIGVudik7XG4gICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMuaW5kZW50KSB7XG4gICAgICAgIGxldCBsaW5lcyA9IHJlc3VsdC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFsaW5lc1tpXSAmJiBpICsgMSA9PT0gbCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGluZXNbaV0gPSBvcHRpb25zLmluZGVudCArIGxpbmVzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZScpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIGxldCBjb250YWluZXIgPSB7XG4gICAgc3RyaWN0OiBmdW5jdGlvbihvYmosIG5hbWUpIHtcbiAgICAgIGlmICghKG5hbWUgaW4gb2JqKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdcIicgKyBuYW1lICsgJ1wiIG5vdCBkZWZpbmVkIGluICcgKyBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9ialtuYW1lXTtcbiAgICB9LFxuICAgIGxvb2t1cDogZnVuY3Rpb24oZGVwdGhzLCBuYW1lKSB7XG4gICAgICBjb25zdCBsZW4gPSBkZXB0aHMubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZGVwdGhzW2ldICYmIGRlcHRoc1tpXVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcHRoc1tpXVtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbGFtYmRhOiBmdW5jdGlvbihjdXJyZW50LCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicgPyBjdXJyZW50LmNhbGwoY29udGV4dCkgOiBjdXJyZW50O1xuICAgIH0sXG5cbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuXG4gICAgZm46IGZ1bmN0aW9uKGkpIHtcbiAgICAgIGxldCByZXQgPSB0ZW1wbGF0ZVNwZWNbaV07XG4gICAgICByZXQuZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjW2kgKyAnX2QnXTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgICBsZXQgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldLFxuICAgICAgICAgIGZuID0gdGhpcy5mbihpKTtcbiAgICAgIGlmIChkYXRhIHx8IGRlcHRocyB8fCBibG9ja1BhcmFtcyB8fCBkZWNsYXJlZEJsb2NrUGFyYW1zKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG5cbiAgICBkYXRhOiBmdW5jdGlvbih2YWx1ZSwgZGVwdGgpIHtcbiAgICAgIHdoaWxlICh2YWx1ZSAmJiBkZXB0aC0tKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICBsZXQgb2JqID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICBvYmogPSBVdGlscy5leHRlbmQoe30sIGNvbW1vbiwgcGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG5cbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IHRlbXBsYXRlU3BlYy5jb21waWxlclxuICB9O1xuXG4gIGZ1bmN0aW9uIHJldChjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIHJldC5fc2V0dXAob3B0aW9ucyk7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwgJiYgdGVtcGxhdGVTcGVjLnVzZURhdGEpIHtcbiAgICAgIGRhdGEgPSBpbml0RGF0YShjb250ZXh0LCBkYXRhKTtcbiAgICB9XG4gICAgbGV0IGRlcHRocyxcbiAgICAgICAgYmxvY2tQYXJhbXMgPSB0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgPyBbXSA6IHVuZGVmaW5lZDtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocykge1xuICAgICAgaWYgKG9wdGlvbnMuZGVwdGhzKSB7XG4gICAgICAgIGRlcHRocyA9IGNvbnRleHQgIT0gb3B0aW9ucy5kZXB0aHNbMF0gPyBbY29udGV4dF0uY29uY2F0KG9wdGlvbnMuZGVwdGhzKSA6IG9wdGlvbnMuZGVwdGhzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVwdGhzID0gW2NvbnRleHRdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1haW4oY29udGV4dC8qLCBvcHRpb25zKi8pIHtcbiAgICAgIHJldHVybiAnJyArIHRlbXBsYXRlU3BlYy5tYWluKGNvbnRhaW5lciwgY29udGV4dCwgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscywgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG4gICAgfVxuICAgIG1haW4gPSBleGVjdXRlRGVjb3JhdG9ycyh0ZW1wbGF0ZVNwZWMubWFpbiwgbWFpbiwgY29udGFpbmVyLCBvcHRpb25zLmRlcHRocyB8fCBbXSwgZGF0YSwgYmxvY2tQYXJhbXMpO1xuICAgIHJldHVybiBtYWluKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldC5pc1RvcCA9IHRydWU7XG5cbiAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5oZWxwZXJzLCBlbnYuaGVscGVycyk7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCkge1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5wYXJ0aWFscywgZW52LnBhcnRpYWxzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCB8fCB0ZW1wbGF0ZVNwZWMudXNlRGVjb3JhdG9ycykge1xuICAgICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmRlY29yYXRvcnMsIGVudi5kZWNvcmF0b3JzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBvcHRpb25zLmRlY29yYXRvcnM7XG4gICAgfVxuICB9O1xuXG4gIHJldC5fY2hpbGQgPSBmdW5jdGlvbihpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyAmJiAhYmxvY2tQYXJhbXMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ211c3QgcGFzcyBibG9jayBwYXJhbXMnKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMgJiYgIWRlcHRocykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIHBhcmVudCBkZXB0aHMnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCB0ZW1wbGF0ZVNwZWNbaV0sIGRhdGEsIDAsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICB9O1xuICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCBmbiwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuICBmdW5jdGlvbiBwcm9nKGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBjdXJyZW50RGVwdGhzID0gZGVwdGhzO1xuICAgIGlmIChkZXB0aHMgJiYgY29udGV4dCAhPSBkZXB0aHNbMF0pIHtcbiAgICAgIGN1cnJlbnREZXB0aHMgPSBbY29udGV4dF0uY29uY2F0KGRlcHRocyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZuKGNvbnRhaW5lcixcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscyxcbiAgICAgICAgb3B0aW9ucy5kYXRhIHx8IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zICYmIFtvcHRpb25zLmJsb2NrUGFyYW1zXS5jb25jYXQoYmxvY2tQYXJhbXMpLFxuICAgICAgICBjdXJyZW50RGVwdGhzKTtcbiAgfVxuXG4gIHByb2cgPSBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKTtcblxuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gZGVwdGhzID8gZGVwdGhzLmxlbmd0aCA6IDA7XG4gIHByb2cuYmxvY2tQYXJhbXMgPSBkZWNsYXJlZEJsb2NrUGFyYW1zIHx8IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIXBhcnRpYWwpIHtcbiAgICBpZiAob3B0aW9ucy5uYW1lID09PSAnQHBhcnRpYWwtYmxvY2snKSB7XG4gICAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHdoaWxlIChkYXRhWydwYXJ0aWFsLWJsb2NrJ10gPT09IG5vb3ApIHtcbiAgICAgICAgZGF0YSA9IGRhdGEuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHBhcnRpYWwgPSBkYXRhWydwYXJ0aWFsLWJsb2NrJ107XG4gICAgICBkYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBub29wO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdO1xuICAgIH1cbiAgfSBlbHNlIGlmICghcGFydGlhbC5jYWxsICYmICFvcHRpb25zLm5hbWUpIHtcbiAgICAvLyBUaGlzIGlzIGEgZHluYW1pYyBwYXJ0aWFsIHRoYXQgcmV0dXJuZWQgYSBzdHJpbmdcbiAgICBvcHRpb25zLm5hbWUgPSBwYXJ0aWFsO1xuICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW3BhcnRpYWxdO1xuICB9XG4gIHJldHVybiBwYXJ0aWFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMucGFydGlhbCA9IHRydWU7XG4gIGlmIChvcHRpb25zLmlkcykge1xuICAgIG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCA9IG9wdGlvbnMuaWRzWzBdIHx8IG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aDtcbiAgfVxuXG4gIGxldCBwYXJ0aWFsQmxvY2s7XG4gIGlmIChvcHRpb25zLmZuICYmIG9wdGlvbnMuZm4gIT09IG5vb3ApIHtcbiAgICBvcHRpb25zLmRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIHBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChwYXJ0aWFsQmxvY2sucGFydGlhbHMpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHMgPSBVdGlscy5leHRlbmQoe30sIG9wdGlvbnMucGFydGlhbHMsIHBhcnRpYWxCbG9jay5wYXJ0aWFscyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFsQmxvY2spIHtcbiAgICBwYXJ0aWFsID0gcGFydGlhbEJsb2NrO1xuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1RoZSBwYXJ0aWFsICcgKyBvcHRpb25zLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICB9IGVsc2UgaWYgKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gJyc7IH1cblxuZnVuY3Rpb24gaW5pdERhdGEoY29udGV4dCwgZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgISgncm9vdCcgaW4gZGF0YSkpIHtcbiAgICBkYXRhID0gZGF0YSA/IGNyZWF0ZUZyYW1lKGRhdGEpIDoge307XG4gICAgZGF0YS5yb290ID0gY29udGV4dDtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcykge1xuICBpZiAoZm4uZGVjb3JhdG9yKSB7XG4gICAgbGV0IHByb3BzID0ge307XG4gICAgcHJvZyA9IGZuLmRlY29yYXRvcihwcm9nLCBwcm9wcywgY29udGFpbmVyLCBkZXB0aHMgJiYgZGVwdGhzWzBdLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcbiAgICBVdGlscy5leHRlbmQocHJvZywgcHJvcHMpO1xuICB9XG4gIHJldHVybiBwcm9nO1xufVxuIiwiLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IFNhZmVTdHJpbmcucHJvdG90eXBlLnRvSFRNTCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJycgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNhZmVTdHJpbmc7XG4iLCJjb25zdCBlc2NhcGUgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmI3gyNzsnLFxuICAnYCc6ICcmI3g2MDsnLFxuICAnPSc6ICcmI3gzRDsnXG59O1xuXG5jb25zdCBiYWRDaGFycyA9IC9bJjw+XCInYD1dL2csXG4gICAgICBwb3NzaWJsZSA9IC9bJjw+XCInYD1dLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKG9iai8qICwgLi4uc291cmNlICovKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFyZ3VtZW50c1tpXSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcmd1bWVudHNbaV0sIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnQgbGV0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1zdHlsZSAqL1xubGV0IGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbmV4cG9ydCB7aXNGdW5jdGlvbn07XG4vKiBlc2xpbnQtZW5hYmxlIGZ1bmMtc3R5bGUgKi9cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5cbi8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICAgIGlmIChzdHJpbmcgJiYgc3RyaW5nLnRvSFRNTCkge1xuICAgICAgcmV0dXJuIHN0cmluZy50b0hUTUwoKTtcbiAgICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nICsgJyc7XG4gICAgfVxuXG4gICAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gICAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gICAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG4gIH1cblxuICBpZiAoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9iamVjdCkge1xuICBsZXQgZnJhbWUgPSBleHRlbmQoe30sIG9iamVjdCk7XG4gIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG4gIHJldHVybiBmcmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NrUGFyYW1zKHBhcmFtcywgaWRzKSB7XG4gIHBhcmFtcy5wYXRoID0gaWRzO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG4gIHJldHVybiAoY29udGV4dFBhdGggPyBjb250ZXh0UGF0aCArICcuJyA6ICcnKSArIGlkO1xufVxuIiwiLy8gQ3JlYXRlIGEgc2ltcGxlIHBhdGggYWxpYXMgdG8gYWxsb3cgYnJvd3NlcmlmeSB0byByZXNvbHZlXG4vLyB0aGUgcnVudGltZSBvbiBhIHN1cHBvcnRlZCBwYXRoLlxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZScpWydkZWZhdWx0J107XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIilbXCJkZWZhdWx0XCJdO1xuIl0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMMjV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2YVc1a1pYZ3Vhbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2Ylc5a2RXeGxjeTloWW05MWRDMXplWE4wWlcwdmFXNWtaWGd1YW5NaUxDSnpjbU12ZG1sbGQzTXZhVzVrWlhndmJXOWtkV3hsY3k5aVlYTnBZeTlwYm1SbGVDNXFjeUlzSW5OeVl5OTJhV1YzY3k5cGJtUmxlQzl0YjJSMWJHVnpMMlY0Y0dWeWFXVnVZMlV0ZDI5eWEzTXZhVzVrWlhndWFuTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZiVzlrZFd4bGN5OWxlSEJsY21sbGJtTmxMMmx1WkdWNExtcHpJaXdpYzNKakwzWnBaWGR6TDJsdVpHVjRMMjF2WkhWc1pYTXZaWGh3WlhKcFpXNWpaUzkwWVdJdFkyOXVkR1Z1ZEM1b1luTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZiVzlrZFd4bGN5OWxlSEJsY21sbGJtTmxMM1JoWWkxdVlYWXVhR0p6SWl3aWMzSmpMM1pwWlhkekwybHVaR1Y0TDIxdlpIVnNaWE12Wm1GMmFXTnZiaTltWVhacFkyOXVMbWhpY3lJc0luTnlZeTkyYVdWM2N5OXBibVJsZUM5dGIyUjFiR1Z6TDJaaGRtbGpiMjR2YVc1a1pYZ3Vhbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2Ylc5a2RXeGxjeTl1WVhZdllYQndMVzVoZGk1b1luTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZiVzlrZFd4bGN5OXVZWFl2YVc1a1pYZ3Vhbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2Ylc5a2RXeGxjeTl3ZFdKc2FXTXZZbXh2WTJzdFkyOXVkR1Z1ZEM1b1luTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZiVzlrZFd4bGN5OXdkV0pzYVdNdllteHZZMnN0YkdsemRDNW9Zbk1pTENKemNtTXZkbWxsZDNNdmFXNWtaWGd2Ylc5a2RXeGxjeTl3ZFdKc2FXTXZkMjl5YTNNdGJHbHpkQzVvWW5NaUxDSnpjbU12ZG1sbGQzTXZhVzVrWlhndmJXOWtkV3hsY3k5M2IzSnJjeTlwYm1SbGVDNXFjeUlzSW5OeVl5OTJhV1YzY3k5cGJtUmxlQzl6WlhKMmFXTmxMMkpoYVd0bExYTjFiVzFoY25rdWFuTWlMQ0p6Y21NdmRtbGxkM012YVc1a1pYZ3ZjMlZ5ZG1salpTOWlZWE5wWXk1cWN5SXNJbk55WXk5MmFXVjNjeTlwYm1SbGVDOXpaWEoyYVdObEwySnNiMk5yTG1weklpd2ljM0pqTDNacFpYZHpMMmx1WkdWNEwzTmxjblpwWTJVdlpYaHdaWEpwWlc1alpTNXFjeUlzSW5OeVl5OTJhV1YzY3k5cGJtUmxlQzl6WlhKMmFXTmxMM2R2Y210ekxtcHpJaXdpTGk0dmJtOWtaVjl0YjJSMWJHVnpMMmhoYm1Sc1pXSmhjbk12YkdsaUwyaGhibVJzWldKaGNuTXVjblZ1ZEdsdFpTNXFjeUlzSWk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlvWVc1a2JHVmlZWEp6TDJ4cFlpOW9ZVzVrYkdWaVlYSnpMMkpoYzJVdWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZhR0Z1Wkd4bFltRnljeTlzYVdJdmFHRnVaR3hsWW1GeWN5OWtaV052Y21GMGIzSnpMbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDJoaGJtUnNaV0poY25NdmJHbGlMMmhoYm1Sc1pXSmhjbk12WkdWamIzSmhkRzl5Y3k5cGJteHBibVV1YW5NaUxDSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmFHRnVaR3hsWW1GeWN5OXNhV0l2YUdGdVpHeGxZbUZ5Y3k5bGVHTmxjSFJwYjI0dWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZhR0Z1Wkd4bFltRnljeTlzYVdJdmFHRnVaR3hsWW1GeWN5OW9aV3h3WlhKekxtcHpJaXdpTGk0dmJtOWtaVjl0YjJSMWJHVnpMMmhoYm1Sc1pXSmhjbk12YkdsaUwyaGhibVJzWldKaGNuTXZhR1ZzY0dWeWN5OWliRzlqYXkxb1pXeHdaWEl0YldsemMybHVaeTVxY3lJc0lpNHVMMjV2WkdWZmJXOWtkV3hsY3k5b1lXNWtiR1ZpWVhKekwyeHBZaTlvWVc1a2JHVmlZWEp6TDJobGJIQmxjbk12WldGamFDNXFjeUlzSWk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlvWVc1a2JHVmlZWEp6TDJ4cFlpOW9ZVzVrYkdWaVlYSnpMMmhsYkhCbGNuTXZhR1ZzY0dWeUxXMXBjM05wYm1jdWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZhR0Z1Wkd4bFltRnljeTlzYVdJdmFHRnVaR3hsWW1GeWN5OW9aV3h3WlhKekwybG1MbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDJoaGJtUnNaV0poY25NdmJHbGlMMmhoYm1Sc1pXSmhjbk12YUdWc2NHVnljeTlzYjJjdWFuTWlMQ0l1TGk5dWIyUmxYMjF2WkhWc1pYTXZhR0Z1Wkd4bFltRnljeTlzYVdJdmFHRnVaR3hsWW1GeWN5OW9aV3h3WlhKekwyeHZiMnQxY0M1cWN5SXNJaTR1TDI1dlpHVmZiVzlrZFd4bGN5OW9ZVzVrYkdWaVlYSnpMMnhwWWk5b1lXNWtiR1ZpWVhKekwyaGxiSEJsY25NdmQybDBhQzVxY3lJc0lpNHVMMjV2WkdWZmJXOWtkV3hsY3k5b1lXNWtiR1ZpWVhKekwyeHBZaTlvWVc1a2JHVmlZWEp6TDJ4dloyZGxjaTVxY3lJc0lpNHVMMjV2WkdWZmJXOWtkV3hsY3k5b1lXNWtiR1ZpWVhKekwyUnBjM1F2WTJwekwyNXZaR1ZmYlc5a2RXeGxjeTlvWVc1a2JHVmlZWEp6TDJ4cFlpOW9ZVzVrYkdWaVlYSnpMMjV2TFdOdmJtWnNhV04wTG1weklpd2lMaTR2Ym05a1pWOXRiMlIxYkdWekwyaGhibVJzWldKaGNuTXZiR2xpTDJoaGJtUnNaV0poY25NdmNuVnVkR2x0WlM1cWN5SXNJaTR1TDI1dlpHVmZiVzlrZFd4bGN5OW9ZVzVrYkdWaVlYSnpMMnhwWWk5b1lXNWtiR1ZpWVhKekwzTmhabVV0YzNSeWFXNW5MbXB6SWl3aUxpNHZibTlrWlY5dGIyUjFiR1Z6TDJoaGJtUnNaV0poY25NdmJHbGlMMmhoYm1Sc1pXSmhjbk12ZFhScGJITXVhbk1pTENJdUxpOXViMlJsWDIxdlpIVnNaWE12YUdGdVpHeGxZbUZ5Y3k5eWRXNTBhVzFsTG1weklpd2lMaTR2Ym05a1pWOXRiMlIxYkdWekwyaGljMlo1TDNKMWJuUnBiV1V1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPenRCUTBGQkxFbEJRVWtzV1VGQldTeFJRVUZSTEdWQlFWSXNRMEZCYUVJN08wRkJSVUVzU1VGQlNTeHRRa0ZCYlVJc1VVRkJVU3h6UWtGQlVpeERRVUYyUWpzN1FVRkZRU3hKUVVGSkxHTkJRV01zVVVGQlVTeHBRa0ZCVWl4RFFVRnNRanM3UVVGRlFTeEpRVUZKTEdWQlFXVXNVVUZCVVN4M1FrRkJVaXhEUVVGdVFqczdRVUZGUVN4SlFVRkpMR3RDUVVGclFpeFJRVUZSTEdsQ1FVRlNMRU5CUVhSQ096dEJRVVZCTEVsQlFVa3NaMEpCUVdkQ0xGRkJRVkVzYlVKQlFWSXNRMEZCY0VJN08wRkJSVUU3T3p0QlFVZEJMR05CUVdNc1RVRkJaQ3hEUVVGeFFpeEhRVUZITEd0Q1FVRklMRU5CUVhKQ08wRkJRMEVzVFVGQlRTeFZRVUZPTEVOQlFXbENMRTFCUVdwQ0xFVkJRWGxDTEZWQlFWTXNTVUZCVkN4RlFVRmxPMEZCUTNCRExHZENRVUZqTEUxQlFXUXNRMEZCY1VJc1IwRkJSeXhyUWtGQlNDeERRVUZ5UWp0QlFVTklMRU5CUmtRN08wRkJTVUU3T3p0QlFVZEJMRlZCUVZVc1RVRkJWanM3UVVGRlFUczdPMEZCUjBFc1owSkJRV2RDTEUxQlFXaENPenRCUVVWQk96czdRVUZIUVN4cFFrRkJhVUlzVFVGQmFrSTdPMEZCUlVFN096dEJRVWRCTEZsQlFWa3NUVUZCV2pzN1FVRkZRVHM3TzBGQlIwRXNZVUZCWVN4TlFVRmlPenM3T3p0QlF6TkRRU3hKUVVGSkxHMUNRVUZ0UWl4UlFVRlJMRFpDUVVGU0xFTkJRWFpDT3p0QlFVVkJMRWxCUVVrc1dVRkJXU3hSUVVGUkxIRkNRVUZTTEVOQlFXaENPenRCUVVWQkxFOUJRVThzVDBGQlVDeEhRVUZwUWp0QlFVTmlMRmxCUVZFc2EwSkJRVmM3UVVGRFppeGxRVUZQTEVWQlFVVXNUMEZCUml4RFFVRlZMRlZCUVZNc1QwRkJWQ3hGUVVGclFpeE5RVUZzUWl4RlFVRXdRanRCUVVOMlF5eHpRa0ZCVlN4alFVRldMRWRCUVRKQ0xFbEJRVE5DTEVOQlFXZERMRlZCUVZNc1NVRkJWQ3hGUVVGbE8wRkJRek5ETEcxQ1FVRkhMR2RDUVVGSUxFVkJRWEZDTEUxQlFYSkNMRU5CUVRSQ0xHbENRVUZwUWl4SlFVRnFRaXhEUVVFMVFqdEJRVU5JTEdGQlJrUTdPMEZCU1VFc2MwSkJRVlVzV1VGQlZpeEhRVUY1UWl4SlFVRjZRaXhEUVVFNFFpeFZRVUZUTEVsQlFWUXNSVUZCWlR0QlFVTjZReXh0UWtGQlJ5eHJRa0ZCU0N4RlFVRjFRaXhOUVVGMlFpeERRVUU0UWl4cFFrRkJhVUlzU1VGQmFrSXNRMEZCT1VJN1FVRkRTQ3hoUVVaRU96dEJRVWxCTEd0Q1FVRk5MRlZCUVU0c1EwRkJhVUlzVFVGQmFrSXNSVUZCZVVJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRGNFTXNNRUpCUVZVc1dVRkJWaXhIUVVGNVFpeEpRVUY2UWl4RFFVRTRRaXhWUVVGVExFbEJRVlFzUlVGQlpUdEJRVU42UXl4MVFrRkJSeXhyUWtGQlNDeEZRVUYxUWl4TlFVRjJRaXhEUVVFNFFpeHBRa0ZCYVVJc1NVRkJha0lzUTBGQk9VSTdRVUZEU0N4cFFrRkdSRHRCUVVkSUxHRkJTa1E3TzBGQlRVRTdRVUZEU0N4VFFXaENUU3hEUVVGUU8wRkJhVUpJTzBGQmJrSlpMRU5CUVdwQ096czdPenRCUTBwQkxFbEJRVWtzVVVGQlVTeFJRVUZSTEhGQ1FVRlNMRU5CUVZvN08wRkJSVUVzU1VGQlNTeFpRVUZaTEZGQlFWRXNNRUpCUVZJc1EwRkJhRUk3TzBGQlJVRXNTVUZCU1N4blFrRkJaMElzVVVGQlVTeFpRVUZTTEVOQlFYQkNPenRCUVVWQkxFOUJRVThzVDBGQlVDeEhRVUZwUWp0QlFVTmlMRmxCUVZFc2EwSkJRVmM3UVVGRFppeGxRVUZQTEVWQlFVVXNUMEZCUml4RFFVRlZMRlZCUVZNc1QwRkJWQ3hGUVVGclFpeE5RVUZzUWl4RlFVRXdRanRCUVVOMlF5eHJRa0ZCVFN4VlFVRk9MRU5CUVdsQ0xFOUJRV3BDTEVWQlFUQkNMRlZCUVZNc1NVRkJWQ3hGUVVGbE8wRkJRM0pETEhOQ1FVRk5MRlZCUVU0c1IwRkJiVUlzU1VGQmJrSXNRMEZCZDBJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRGJrTXNkVUpCUVVjc1pVRkJTQ3hGUVVGdlFpeE5RVUZ3UWl4RFFVRXlRaXhWUVVGVkxFbEJRVllzUTBGQk0wSTdRVUZEU0N4cFFrRkdSRHM3UVVGSlFUczdPMEZCUjBFc09FSkJRV01zVFVGQlpDeERRVUZ4UWl4SFFVRkhMR1ZCUVVnc1EwRkJja0k3UVVGRFNDeGhRVlJFT3p0QlFWZEJPMEZCUTBnc1UwRmlUU3hEUVVGUU8wRkJZMGc3UVVGb1Fsa3NRMEZCYWtJN096czdPMEZEVGtFc1NVRkJTU3hqUVVGakxGRkJRVkVzY1VKQlFWSXNRMEZCYkVJN08wRkJSVUVzU1VGQlNTeG5Ra0ZCWjBJc1VVRkJVU3d3UWtGQlVpeERRVUZ3UWpzN1FVRkZRU3hQUVVGUExFOUJRVkFzUjBGQmFVSTdRVUZEWWl4WlFVRlJMR3RDUVVGWE8wRkJRMllzWlVGQlR5eEZRVUZGTEU5QlFVWXNRMEZCVlN4VlFVRlRMRTlCUVZRc1JVRkJhMElzVFVGQmJFSXNSVUZCTUVJN08wRkJSWFpETzBGQlEwRXNhMEpCUVUwc1ZVRkJUaXhEUVVGcFFpeHBRa0ZCYWtJc1JVRkJiME1zVlVGQlV5eEpRVUZVTEVWQlFXVTdPMEZCUlM5RExHOUNRVUZKTEZWQlFWVXNTMEZCU3l4TFFVRk1MRU5CUVZjc1NVRkJla0k3TzBGQlJVRXNORUpCUVZrc1lVRkJXaXhEUVVFd1FpeFBRVUV4UWl4RlFVRnRReXhKUVVGdVF5eERRVUYzUXl4VlFVRlRMRWxCUVZRc1JVRkJaVHRCUVVOdVJDeDNRa0ZCU1N4cFFrRkJhVUk3UVVGRGFrSXNaME5CUVZFc1kwRkVVenRCUVVWcVFpeG5RMEZCVVN4cFFrRkdVenRCUVVkcVFpeG5RMEZCVVR0QlFVaFRMSEZDUVVGeVFqdEJRVXRCTEhWQ1FVRkhMSEZDUVVGSUxFVkJRVEJDTEVsQlFURkNMRU5CUVN0Q0xHVkJRV1VzVDBGQlppeERRVUV2UWpzN1FVRkhRU3gxUWtGQlJ5eHBRa0ZCU0N4RlFVTkxMRWxCUkV3c1EwRkRWU3hqUVVGakxFbEJRV1FzUTBGRVZpeEZRVVZMTEVsQlJrd3NRMEZGVlN4VlFVWldMRVZCUjBzc1VVRklUQ3hEUVVkakxHTkJTR1FzUlVGSlN5eEpRVXBNTEVOQlNWVXNZMEZLVml4RlFVdExMRTFCVEV3c1EwRkxXU3dyUWtGTVdqczdRVUZQUVN3d1FrRkJUU3hyUWtGQlRpeERRVUY1UWl4UFFVRjZRanM3UVVGRlFTd3dRa0ZCVFN4TlFVRk9MRU5CUVdFc2JVSkJRV0lzUlVGQmEwTTdRVUZET1VJc2RVTkJRV1VzUzBGRVpUdEJRVVU1UWl4eFEwRkJZU3hKUVVacFFqdEJRVWM1UWl4dlEwRkJXU3h2UWtGSWEwSTdRVUZKT1VJN1FVRkRRU3gxUTBGQlpTeE5RVXhsTzBGQlRUbENMSGREUVVGblFqdEJRVTVqTEhGQ1FVRnNRenM3UVVGVlFTeDFRa0ZCUnl4aFFVRklMRVZCUVd0Q0xFVkJRV3hDTEVOQlFYRkNMRTlCUVhKQ0xFVkJRVGhDTEZsQlFWYzdRVUZEY2tNc05FSkJRVWtzVTBGQlV5eEhRVUZITEVsQlFVZ3NRMEZCWWpzN1FVRkZRU3h2UTBGQldTeFBRVUZhTEVOQlFXOUNMRTlCUVU4c1NVRkJVQ3hEUVVGWkxGTkJRVm9zUTBGQmNFSXNSVUZCTkVNc1NVRkJOVU1zUTBGQmFVUXNWVUZCVXl4SlFVRlVMRVZCUVdVN1FVRkROVVFzYTBOQlFVMHNXVUZCVGl4RFFVRnRRanRCUVVObUxIZERRVUZSTEV0QlFVc3NTVUZFUlR0QlFVVm1MRFpEUVVGaExFbEJSa1U3UVVGSFppeDFRMEZCVHl4TlFVaFJPMEZCU1dZc09FTkJRV003UVVGS1F5dzJRa0ZCYmtJc1JVRkxSeXhKUVV4SU8wRkJUVWdzZVVKQlVFUTdRVUZUU0N4eFFrRmFSRHRCUVdGSUxHbENRWHBEUkR0QlFUQkRTQ3hoUVRsRFJEdEJRU3REUVR0QlFVTklMRk5CYmtSTkxFTkJRVkE3UVVGdlJFZzdRVUYwUkZrc1EwRkJha0k3T3pzN08wRkRTa0VzU1VGQlNTeDNRa0ZCZDBJc1VVRkJVU3h4UWtGQlVpeERRVUUxUWpzN1FVRkZRU3hKUVVGSkxHMUNRVUZ0UWl4UlFVRlJMRFpDUVVGU0xFTkJRWFpDT3p0QlFVVkJMRWxCUVVrc1lVRkJZU3hSUVVGUkxHVkJRVklzUTBGQmFrSTdRVUZEUVN4SlFVRkpMR2xDUVVGcFFpeFJRVUZSTEcxQ1FVRlNMRU5CUVhKQ096dEJRVVZCTEVsQlFVa3NhVUpCUVdsQ0xGRkJRVkVzTUVKQlFWSXNRMEZCY2tJN08wRkJSVUVzU1VGQlNTeGhRVUZoTEZGQlFWRXNaVUZCVWl4RFFVRnFRanM3UVVGRlFTeFhRVUZYTEdOQlFWZ3NRMEZCTUVJc1VVRkJNVUlzUlVGQmIwTXNWVUZCVXl4TFFVRlVMRVZCUVdkQ096dEJRVVZvUkN4WFFVRlBMRkZCUVZFc1EwRkJaanRCUVVOSUxFTkJTRVE3TzBGQlMwRXNWMEZCVnl4alFVRllMRU5CUVRCQ0xGZEJRVEZDTEVWQlFYVkRMRlZCUVZNc1MwRkJWQ3hGUVVGblFqczdRVUZGYmtRc1VVRkJTU3hUUVVGVExFTkJRV0lzUlVGQlowSTdRVUZEV2l4bFFVRlBMRkZCUVZBN1FVRkRTRHRCUVVORUxGZEJRVThzUlVGQlVEdEJRVU5JTEVOQlRrUTdPMEZCVVVFc1YwRkJWeXhqUVVGWUxFTkJRVEJDTEdOQlFURkNMRVZCUVRCRExGVkJRVk1zU1VGQlZDeEZRVUZsTzBGQlEzSkVMRkZCUVVrc1VVRkJVU3hOUVVGYUxFVkJRVzlDTzBGQlEyaENMR1ZCUVU4c09FUkJRVkE3UVVGRFNEdEJRVU5LTEVOQlNrUTdPMEZCVFVFc1QwRkJUeXhQUVVGUUxFZEJRV2xDTzBGQlEySXNXVUZCVVN4clFrRkJWenRCUVVObUxHVkJRVThzUlVGQlJTeFBRVUZHTEVOQlFWVXNWVUZCVXl4UFFVRlVMRVZCUVd0Q0xFMUJRV3hDTEVWQlFUQkNPenRCUVVWMlF6dEJRVU5CTEd0Q1FVRk5MRlZCUVU0c1EwRkJhVUlzV1VGQmFrSXNSVUZCSzBJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3TzBGQlJURkRMQ3RDUVVGbExGbEJRV1lzUjBGQk9FSXNTVUZCT1VJc1EwRkJiVU1zVlVGQlV5eEpRVUZVTEVWQlFXVTdRVUZET1VNc2RVSkJRVWNzWVVGQlNDeEZRVUZyUWl4SlFVRnNRaXhEUVVGMVFpeFhRVUZYTEVsQlFWZ3NRMEZCZGtJN1FVRkRTQ3hwUWtGR1JEczdRVUZKUVN3clFrRkJaU3hWUVVGbUxFZEJRVFJDTEVsQlFUVkNMRU5CUVdsRExGVkJRVk1zU1VGQlZDeEZRVUZsTzBGQlF6VkRMSFZDUVVGSExHbENRVUZJTEVWQlFYTkNMRWxCUVhSQ0xFTkJRVEpDTEdWQlFXVXNTVUZCWml4RFFVRXpRanRCUVVOQk96dEJRVVZCTEhWQ1FVRkhMR2RDUVVGSUxFVkJRWEZDTEVWQlFYSkNMRU5CUVhkQ0xFOUJRWGhDTEVWQlFXbERMRmxCUVZjN1FVRkRlRU1zT0VKQlFVMHNXVUZCVGl4RFFVRnRRanRCUVVObUxHOURRVUZSTEdkQ1FVUlBPMEZCUldZc2VVTkJRV0VzU1VGR1JUdEJRVWRtTEcxRFFVRlBMRTFCU0ZFN1FVRkpaaXd3UTBGQll6dEJRVXBETEhsQ1FVRnVRaXhGUVV0SExFbEJURWc3UVVGUFNDeHhRa0ZTUkR0QlFWTklMR2xDUVdKRU8wRkJaMEpJTEdGQmRFSkVPenRCUVhsQ1FTeHJRMEZCYzBJc1RVRkJkRUk3UVVGRFFUdEJRVU5JTEZOQk9VSk5MRU5CUVZBN1FVRnBRMGc3UVVGdVExa3NRMEZCYWtJN096dEJRemxDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEYmtOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRMnhDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096czdRVU5ZUVN4SlFVRkpMRkZCUVZFc1VVRkJVU3h4UWtGQlVpeERRVUZhT3p0QlFVVkJMRWxCUVVrc1kwRkJZeXhSUVVGUkxHVkJRVklzUTBGQmJFSTdPMEZCUlVFc1QwRkJUeXhQUVVGUUxFZEJRV2xDTzBGQlEySXNXVUZCVVN4blFrRkJVeXhMUVVGVUxFVkJRV2RDT3p0QlFVVndRaXhsUVVGUExFVkJRVVVzVDBGQlJpeERRVUZWTEZsQlFWYzdPMEZCUlhoQ0xHdENRVUZOTEdOQlFVNHNSMEZCZFVJc1NVRkJka0lzUTBGQk5FSXNWVUZCVXl4SlFVRlVMRVZCUVdVN1FVRkRka01zYzBKQlFVMHNUMEZCVGl4RFFVRmpMRmxCUVZrc1NVRkJXaXhEUVVGa08wRkJRMGdzWVVGR1JEdEJRVWRCTzBGQlEwZ3NVMEZPVFN4RFFVRlFPMEZCVDBnN1FVRldXU3hEUVVGcVFqczdPMEZEU2tFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3pzN08wRkRURUVzU1VGQlNTeGhRVUZoTEZGQlFWRXNaVUZCVWl4RFFVRnFRanM3UVVGRlFTeFBRVUZQTEU5QlFWQXNSMEZCYVVJN1FVRkRZaXhaUVVGUkxHdENRVUZYTzBGQlEyWXNaVUZCVHl4RlFVRkZMRTlCUVVZc1EwRkJWU3hWUVVGVExFOUJRVlFzUlVGQmEwSXNUVUZCYkVJc1JVRkJNRUk3UVVGRGRrTTdRVUZEUVN4bFFVRkhMRlZCUVVnc1JVRkJaU3hOUVVGbUxFTkJRWE5DTEZsQlFYUkNPMEZCUTBFc2EwSkJRVTBzVlVGQlRpeERRVUZwUWl4TlFVRnFRaXhGUVVGNVFpeFZRVUZUTEVsQlFWUXNSVUZCWlR0QlFVTndReXh0UWtGQlJ5eG5Ra0ZCU0N4RlFVRnhRaXhOUVVGeVFpeERRVUUwUWl4WlFVRTFRanRCUVVWSUxHRkJTRVE3UVVGSlFUdEJRVU5JTEZOQlVrMHNRMEZCVUR0QlFWTklPMEZCV0Zrc1EwRkJha0k3T3p0QlEwWkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRM0pDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRGRrSkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN096dEJRMjVEUVN4SlFVRkpMR05CUVdNc1VVRkJVU3h4UWtGQlVpeERRVUZzUWpzN1FVRkZRU3hKUVVGSkxHZENRVUZuUWl4UlFVRlJMREJDUVVGU0xFTkJRWEJDT3p0QlFVVkJMRTlCUVU4c1QwRkJVQ3hIUVVGcFFqdEJRVU5pTEZsQlFWRXNhMEpCUVZjN1FVRkRaaXhsUVVGUExFVkJRVVVzVDBGQlJpeERRVUZWTEZWQlFWTXNUMEZCVkN4RlFVRnJRaXhOUVVGc1FpeEZRVUV3UWp0QlFVTjJRenRCUVVOQkxHdENRVUZOTEZWQlFVNHNRMEZCYVVJc1QwRkJha0lzUlVGQk1FSXNWVUZCVXl4SlFVRlVMRVZCUVdVN08wRkJSWEpETERSQ1FVRlpMRTlCUVZvc1IwRkJjMElzU1VGQmRFSXNRMEZCTWtJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRGRFTXNkVUpCUVVjc1owSkJRVWdzUlVGQmNVSXNTVUZCY2tJc1EwRkJNRUlzWTBGQll5eEpRVUZrTEVOQlFURkNPenRCUVVWQk96czdRVUZIUVN3d1FrRkJUU3hyUWtGQlRpeERRVUY1UWl4UFFVRjZRanM3UVVGRlFUczdPMEZCUjBFc2RVSkJRVWNzWVVGQlNDeEZRVUZyUWl4RlFVRnNRaXhEUVVGeFFpeFBRVUZ5UWl4RlFVRTRRaXhaUVVGWE8wRkJRM0pETERSQ1FVRkpMRk5CUVZNc1IwRkJSeXhKUVVGSUxFTkJRV0k3TzBGQlJVRXNiME5CUVZrc1QwRkJXaXhEUVVGdlFpeFBRVUZQTEVsQlFWQXNRMEZCV1N4VFFVRmFMRU5CUVhCQ0xFVkJRVFJETEVsQlFUVkRMRU5CUVdsRUxGVkJRVk1zU1VGQlZDeEZRVUZsTzBGQlF6VkVMR3REUVVGTkxGbEJRVTRzUTBGQmJVSTdRVUZEWml4M1EwRkJVU3hMUVVGTExFbEJSRVU3UVVGRlppdzJRMEZCWVN4SlFVWkZPMEZCUjJZc2RVTkJRVThzVFVGSVVUdEJRVWxtTERoRFFVRmpPMEZCU2tNc05rSkJRVzVDTEVWQlMwY3NTVUZNU0R0QlFVMUlMSGxDUVZCRU8wRkJVMGdzY1VKQldrUTdRVUZoU0N4cFFrRjRRa1E3UVVGNVFrZ3NZVUV6UWtRN1FVRTBRa0U3UVVGRFNDeFRRUzlDVFN4RFFVRlFPMEZCWjBOSU8wRkJiRU5aTEVOQlFXcENPenM3T3p0QlEwcEJMRWxCUVVrc1pVRkJaU3hEUVVGRE8wRkJRMmhDTEZOQlFVc3NOa05CUkZjN1FVRkZhRUlzWVVGQlV6dEJRVVpQTEVOQlFVUXNSVUZIYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CU0dkQ0xFVkJUV2hDTzBGQlEwTXNVMEZCU3l3MlEwRkVUanRCUVVWRExHRkJRVk03UVVGR1ZpeERRVTVuUWl4RlFWTm9RanRCUVVORExGTkJRVXNzTmtOQlJFNDdRVUZGUXl4aFFVRlRPMEZCUmxZc1EwRlVaMElzUlVGWmFFSTdRVUZEUXl4VFFVRkxMRFpEUVVST08wRkJSVU1zWVVGQlV6dEJRVVpXTEVOQldtZENMRVZCWldoQ08wRkJRME1zVTBGQlN5dzJRMEZFVGp0QlFVVkRMR0ZCUVZNN1FVRkdWaXhEUVdablFpeEZRV3RDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CYkVKblFpeEZRWEZDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CY2tKblFpeEZRWGRDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CZUVKblFpeEZRVEpDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CTTBKblFpeEZRVGhDYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CT1VKblFpeEZRV2xEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CYWtOblFpeEZRVzlEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CY0VOblFpeEZRWFZEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CZGtOblFpeEZRVEJEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CTVVOblFpeEZRVFpEYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CTjBOblFpeEZRV2RFYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CYUVSblFpeEZRVzFFYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CYmtSblFpeEZRWE5FYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CZEVSblFpeEZRWGxFYUVJN1FVRkRReXhUUVVGTExEWkRRVVJPTzBGQlJVTXNZVUZCVXp0QlFVWldMRU5CZWtSblFpeERRVUZ1UWpzN1FVRTRSRUVzVDBGQlR5eFBRVUZRTEVkQlFXbENMRmxCUVdwQ096czdPenRCUXpsRVFTeEpRVUZKTEZsQlFWa3NRMEZCUXp0QlFVTmlMRmRCUVU4c1RVRkVUVHRCUVVWaUxHRkJRVk1zUTBGQlF6dEJRVU5PTEd0Q1FVRlZMRWxCUkVvN1FVRkZUaXh2UWtGQldUdEJRVVpPTEV0QlFVUXNSVUZIVGp0QlFVTkRMR3RDUVVGVkxFbEJSRmc3UVVGRlF5eHZRa0ZCV1R0QlFVWmlMRXRCU0Uwc1JVRk5UanRCUVVORExHdENRVUZWTEUxQlJGZzdRVUZGUXl4dlFrRkJXVHRCUVVaaUxFdEJUazBzUlVGVFRqdEJRVU5ETEd0Q1FVRlZMRWxCUkZnN1FVRkZReXh2UWtGQldUdEJRVVppTEV0QlZFMHNSVUZaVGp0QlFVTkRMR3RDUVVGVkxFMUJSRmc3UVVGRlF5eHZRa0ZCV1R0QlFVWmlMRXRCV2swc1JVRmxUanRCUVVORExHdENRVUZWTEVsQlJGZzdRVUZGUXl4dlFrRkJXVHRCUVVaaUxFdEJaazBzUlVGclFrNDdRVUZEUXl4clFrRkJWU3hOUVVSWU8wRkJSVU1zYjBKQlFWazdRVUZHWWl4TFFXeENUVHRCUVVaSkxFTkJRVVFzUlVGM1FtSTdRVUZEUXl4WFFVRlBMRTFCUkZJN1FVRkZReXhoUVVGVExFTkJRVU03UVVGRFRpeHJRa0ZCVlN4TlFVUktPMEZCUlU0c2IwSkJRVms3UVVGR1RpeExRVUZFTEVWQlIwNDdRVUZEUXl4clFrRkJWU3hOUVVSWU8wRkJSVU1zYjBKQlFWazdRVUZHWWl4TFFVaE5MRVZCVFU0N1FVRkRReXhyUWtGQlZTeE5RVVJZTzBGQlJVTXNiMEpCUVZrN1FVRkdZaXhMUVU1Tk8wRkJSbFlzUTBGNFFtRXNSVUZ2UTJJN1FVRkRReXhYUVVGUExFMUJSRkk3UVVGRlF5eGhRVUZUTEVOQlFVTTdRVUZEVGl4clFrRkJWU3hKUVVSS08wRkJSVTRzYjBKQlFWazdRVUZHVGl4TFFVRkVMRVZCUjA0N1FVRkRReXhyUWtGQlZTeFBRVVJZTzBGQlJVTXNiMEpCUVZrN1FVRkdZaXhMUVVoTkxFVkJUVTQ3UVVGRFF5eHJRa0ZCVlN4TFFVUllPMEZCUlVNc2IwSkJRVms3UVVGR1lpeExRVTVOTzBGQlJsWXNRMEZ3UTJFc1EwRkJhRUk3TzBGQmEwUkJMRWxCUVVrc1kwRkJZenRCUVVOa0xGZEJRVThzVDBGRVR6dEJRVVZrTEdGQlFWTXNjME5CUmtzN1FVRkhaQ3hWUVVGTk8wRkJTRkVzUTBGQmJFSTdPMEZCVFVFc1QwRkJUeXhQUVVGUUxFZEJRV2xDT3p0QlFVVmlPenM3UVVGSFFTeG5Ra0ZCV1N4elFrRkJWenRCUVVOdVFpeGxRVUZQTEVWQlFVVXNUMEZCUml4RFFVRlZMRlZCUVZNc1QwRkJWQ3hGUVVGclFpeE5RVUZzUWl4RlFVRXdRanRCUVVOMlF5eHZRa0ZCVVN4VFFVRlNPMEZCUTBnc1UwRkdUU3hEUVVGUU8wRkJSMGdzUzBGVVdUczdRVUZYWWl4dlFrRkJaMElzTUVKQlFWYzdRVUZEZGtJc1pVRkJUeXhGUVVGRkxFOUJRVVlzUTBGQlZTeFZRVUZUTEU5QlFWUXNSVUZCYTBJc1RVRkJiRUlzUlVGQk1FSTdRVUZEZGtNc2IwSkJRVkVzVjBGQlVqdEJRVU5JTEZOQlJrMHNRMEZCVUR0QlFVZElPMEZCWmxrc1EwRkJha0k3T3pzN08wRkRlRVJCTEVsQlFVa3NXVUZCV1N4RFFVRkRPMEZCUTJJc1VVRkJTU3hUUVVSVE8wRkJSV0lzVjBGQlR5eE5RVVpOTzBGQlIySXNZVUZCVXl4RFFVRkRMRFJJUVVGRUxFVkJRU3RJTEhGSFFVRXZTQ3hGUVVGelR5eHpSVUZCZEU4N1FVRklTU3hEUVVGRUxFVkJTV0k3UVVGRFF5eFJRVUZKTEUxQlJFdzdRVUZGUXl4WFFVRlBMRTFCUmxJN1FVRkhReXhoUVVGVExFTkJRVU1zY1VoQlFVUTdRVUZJVml4RFFVcGhMRVZCVVdJN1FVRkRReXhSUVVGSkxGTkJSRXc3UVVGRlF5eFhRVUZQTEUxQlJsSTdRVUZIUXl4aFFVRlRMRU5CUVVNc09FSkJRVVE3UVVGSVZpeERRVkpoTEVWQldXSTdRVUZEUXl4UlFVRkpMRTlCUkV3N1FVRkZReXhYUVVGUExFMUJSbEk3UVVGSFF5eGhRVUZUTEVOQlFVTXNkVVpCUVVRN1FVRklWaXhEUVZwaExFVkJaMEppTzBGQlEwTXNVVUZCU1N4UlFVUk1PMEZCUlVNc1YwRkJUeXhQUVVaU08wRkJSME1zWVVGQlV5eERRVUZETEN0RlFVRkVMRVZCUVd0R0xHMU1RVUZzUmp0QlFVaFdMRU5CYUVKaExFVkJiMEppTzBGQlEwTXNVVUZCU1N4aFFVUk1PMEZCUlVNc1YwRkJUeXhSUVVaU08wRkJSME1zWVVGQlV5eERRVUZETEd0SlFVRkVPMEZCU0ZZc1EwRndRbUVzUlVGM1FtSTdRVUZEUXl4UlFVRkpMR2xDUVVSTU8wRkJSVU1zVjBGQlR5eHBRa0ZHVWp0QlFVZERMR0ZCUVZNc1EwRkJReXcwU0VGQlJEdEJRVWhXTEVOQmVFSmhMRVZCTkVKaU8wRkJRME1zVVVGQlNTeE5RVVJNTzBGQlJVTXNWMEZCVHl4VFFVWlNPMEZCUjBNc1lVRkJVeXhEUVVGRExIbEpRVUZFTzBGQlNGWXNRMEUxUW1Fc1EwRkJhRUk3TzBGQmEwTkJMRk5CUVZNc1QwRkJWQ3hEUVVGcFFpeEpRVUZxUWl4RlFVRjFRaXhIUVVGMlFpeEZRVUUwUWl4RFFVRTFRaXhGUVVFclFqdEJRVU16UWl4UlFVRkpMRWRCUVVvN08wRkJSVUVzVVVGQlNTeEhRVUZLTEVWQlFWTTdRVUZEVEN4alFVRk5MRWxCUVVrc1RVRkJWanRCUVVOQkxGbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVb3NSMEZCVVN4TFFVRkxMRWRCUVV3c1EwRkJVeXhEUVVGVUxFVkJRVmtzVFVGQlRTeERRVUZzUWl4RFFVRlNMRWRCUVN0Q0xFTkJRVzVETEVkQlFYVkRMRU5CUVRORE96dEJRVVZCTEdWQlFVOHNTVUZCU1N4SFFVRllMRVZCUVdkQ0xFZEJRV2hDTEVWQlFYRkNPenRCUVVWcVFqdEJRVU5CTEdkQ1FVRkpMRXRCUVVzc1IwRkJUQ3hKUVVGWkxFbEJRVWtzUTBGQlNpeE5RVUZYTEVsQlFUTkNMRVZCUVdsRE8wRkJRemRDTEhWQ1FVRlBMRU5CUVZBN1FVRkRTRHRCUVVOS08wRkJRMG83TzBGQlJVUXNWMEZCVHl4RFFVRkRMRU5CUVZJN1FVRkRTRHM3UVVGRlJDeFBRVUZQTEU5QlFWQXNSMEZCYVVJN1FVRkRZanM3TzBGQlIwRXNiMEpCUVdkQ0xEQkNRVUZYTzBGQlEzWkNMRmxCUVVrc1ZVRkJWU3hGUVVGa08wRkJRMEVzV1VGQlNTeFJRVUZSTEVOQlFVTXNVVUZCUkN4RFFVRmFPenRCUVVWQkxHVkJRVThzUlVGQlJTeFBRVUZHTEVOQlFWVXNWVUZCVXl4UFFVRlVMRVZCUVd0Q0xFMUJRV3hDTEVWQlFUQkNPenRCUVVWMlF5eHpRa0ZCVlN4SFFVRldMRU5CUVdNc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRGVrSXNiMEpCUVVrc1VVRkJVU3hMUVVGTExFVkJRV0lzUlVGQmFVSXNTMEZCYWtJc1JVRkJkMElzUTBGQmVFSXNTVUZCTmtJc1EwRkJReXhEUVVGc1F5eEZRVUZ4UXp0QlFVTnFReXcwUWtGQlVTeEpRVUZTTEVOQlFXRXNTVUZCWWp0QlFVTklPMEZCUTBvc1lVRktSRHM3UVVGTlFTeHZRa0ZCVVN4UFFVRlNPMEZCUTBnc1UwRlVUU3hEUVVGUU8wRkJWVWdzUzBGc1FsazdPMEZCYjBKaU96czdRVUZIUVN4clFrRkJZeXgzUWtGQlZ6dEJRVU55UWl4WlFVRkpMRlZCUVZVc1JVRkJaRHRCUVVOQkxGbEJRVWtzVVVGQlVTeERRVUZETEZOQlFVUXNSVUZCV1N4TlFVRmFMRVZCUVc5Q0xGTkJRWEJDTEVWQlFTdENMRTlCUVM5Q0xFVkJRWGRETEdsQ1FVRjRReXhGUVVFeVJDeE5RVUV6UkN4RFFVRmFPenRCUVVWQkxHVkJRVThzUlVGQlJTeFBRVUZHTEVOQlFWVXNWVUZCVXl4UFFVRlVMRVZCUVd0Q0xFMUJRV3hDTEVWQlFUQkNPenRCUVVWMlF5eHpRa0ZCVlN4SFFVRldMRU5CUVdNc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRGVrSXNiMEpCUVVrc1VVRkJVU3hMUVVGTExFVkJRV0lzUlVGQmFVSXNTMEZCYWtJc1JVRkJkMElzUTBGQmVFSXNTVUZCTmtJc1EwRkJReXhEUVVGc1F5eEZRVUZ4UXp0QlFVTnFReXcwUWtGQlVTeEpRVUZTTEVOQlFXRXNTVUZCWWp0QlFVTklPMEZCUTBvc1lVRktSRHM3UVVGTlFTeHZRa0ZCVVN4UFFVRlNPMEZCUTBnc1UwRlVUU3hEUVVGUU8wRkJWVWc3UVVGeVExa3NRMEZCYWtJN096czdPMEZEY2tSQkxFbEJRVWtzWVVGQllTeERRVUZETzBGQlEyUXNWMEZCVHl4WFFVUlBPMEZCUldRc1lVRkJVeXh4UWtGR1N6dEJRVWRrTEZkQlFVOHNRMEZCUXl4NVNVRkJSQ3hGUVVFMFNTeHBURUZCTlVrc1JVRkJLMVFzTUVoQlFTOVVMRU5CU0U4N1FVRkpaQ3hYUVVGUExFTkJRVU1zVDBGQlJDeEZRVUZWTEhGSVFVRldMRVZCUVdsSkxIRktRVUZxU1N4RlFVRjNVaXh0UkVGQmVGSXNSVUZCTmxVc01rWkJRVGRWTzBGQlNrOHNRMEZCUkN4RlFVdGtPMEZCUTBNc1YwRkJUeXhYUVVSU08wRkJSVU1zWVVGQlV5eHZRa0ZHVmp0QlFVZERMRmRCUVU4c1EwRkJReXh4UkVGQlJDeEZRVUYzUkN3d1IwRkJlRVFzUlVGQmIwc3NPRVJCUVhCTExFTkJTRkk3UVVGSlF5eFhRVUZQTEVOQlFVTXNUMEZCUkN4RlFVRlZMRGhFUVVGV08wRkJTbElzUTBGTVl5eEZRVlZrTzBGQlEwTXNWMEZCVHl4WFFVUlNPMEZCUlVNc1lVRkJVeXh2UWtGR1ZqdEJRVWRETEZkQlFVOHNRMEZCUXl4cFIwRkJSQ3hGUVVGdlJ5dzRSRUZCY0Vjc1EwRklVanRCUVVsRExGZEJRVThzUTBGQlF5eHpRa0ZCUkN4RlFVRjVRaXh0UzBGQmVrSXNSVUZCT0V3c2QwVkJRVGxNTzBGQlNsSXNRMEZXWXl4RFFVRnFRanM3UVVGcFFrRXNUMEZCVHl4UFFVRlFMRWRCUVdsQ08wRkJRMkk3T3p0QlFVZEJMR3RDUVVGakxIZENRVUZYTzBGQlEzSkNMRmxCUVVrc1dVRkJXU3hGUVVGb1FqdEJRVU5CTEdWQlFVOHNSVUZCUlN4UFFVRkdMRU5CUVZVc1ZVRkJVeXhQUVVGVUxFVkJRV3RDTEUxQlFXeENMRVZCUVRCQ08wRkJRM1pETEhWQ1FVRlhMRWRCUVZnc1EwRkJaU3hWUVVGVExFbEJRVlFzUlVGQlpUdEJRVU14UWl3d1FrRkJWU3hKUVVGV0xFTkJRV1VzUzBGQlN5eExRVUZ3UWp0QlFVTklMR0ZCUmtRN1FVRkhRU3h2UWtGQlVTeFRRVUZTTzBGQlEwZ3NVMEZNVFN4RFFVRlFPMEZCVFVnc1MwRmFXVHM3UVVGallqczdPMEZCUjBFc1owSkJRVmtzYzBKQlFWYzdRVUZEYmtJc1pVRkJUeXhGUVVGRkxFOUJRVVlzUTBGQlZTeFZRVUZUTEU5QlFWUXNSVUZCYTBJc1RVRkJiRUlzUlVGQk1FSTdRVUZEZGtNc2RVSkJRVmNzUjBGQldDeERRVUZsTEZWQlFWTXNTVUZCVkN4RlFVRmxPMEZCUXpGQ0xIRkNRVUZMTEVsQlFVd3NSMEZCV1N4TFFVRkxMRXRCUVV3c1EwRkJWeXhMUVVGWUxFTkJRV2xDTEVkQlFXcENMRVZCUVhOQ0xFTkJRWFJDTEVOQlFWbzdRVUZEU0N4aFFVWkVPenRCUVVsQkxHOUNRVUZSTEZWQlFWSTdRVUZEU0N4VFFVNU5MRU5CUVZBN1FVRlBTRHRCUVhwQ1dTeERRVUZxUWpzN096czdRVU5xUWtFc1NVRkJTU3hYUVVGWE8wRkJRMWdzVlVGQlRTeERRVUZETzBGQlEwZ3NXVUZCU1N4UFFVUkVPMEZCUlVnc1kwRkJUU3hOUVVaSU8wRkJSMGdzWTBGQlRTeFZRVWhJTzBGQlNVZ3NZVUZCU3l4elFrRktSanRCUVV0SUxHTkJRVTBzYzBsQlRFZzdRVUZOU0N4bFFVRlBMSGxEUVU1S08wRkJUMGdzWTBGQlRTeERRVUZETzBGQlEwZ3NhVUpCUVVzc2MwTkJSRVk3UVVGRlNDeHhRa0ZCVXp0QlFVWk9MRk5CUVVRc1JVRkhTRHRCUVVORExHbENRVUZMTEhORFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVWhITEVWQlRVZzdRVUZEUXl4cFFrRkJTeXh6UTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRk9SeXhGUVZOSU8wRkJRME1zYVVKQlFVc3NjME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlZFY3NSVUZaU0R0QlFVTkRMR2xDUVVGTExITkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVZwSExFVkJaVWc3UVVGRFF5eHBRa0ZCU3l4MVEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZtUnp0QlFWQklMRXRCUVVRc1JVRXdRa2c3UVVGRFF5eFpRVUZKTEZkQlJFdzdRVUZGUXl4alFVRk5MRTFCUmxBN1FVRkhReXhqUVVGTkxGVkJTRkE3UVVGSlF5eGhRVUZMTERCQ1FVcE9PMEZCUzBNc1kwRkJUU3dyUlVGTVVEdEJRVTFETEdWQlFVOHNOa05CVGxJN1FVRlBReXhqUVVGTkxFTkJRVU03UVVGRFNDeHBRa0ZCU3l3d1EwRkVSanRCUVVWSUxIRkNRVUZUTzBGQlJrNHNVMEZCUkN4RlFVZElPMEZCUTBNc2FVSkJRVXNzTUVOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJTRWNzUlVGTlNEdEJRVU5ETEdsQ1FVRkxMREJEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVNUhMRVZCVTBnN1FVRkRReXhwUWtGQlN5d3dRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGVVJ5eEZRVmxJTzBGQlEwTXNhVUpCUVVzc01rTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CV2tjN1FVRlFVQ3hMUVRGQ1J5eEZRV2xFU0R0QlFVTkRMRmxCUVVrc1dVRkVURHRCUVVWRExHTkJRVTBzVFVGR1VEdEJRVWRETEdOQlFVMHNWVUZJVUR0QlFVbERMR0ZCUVVzc2NVSkJTazQ3UVVGTFF5eGpRVUZOTERSTFFVeFFPMEZCVFVNc1pVRkJUeXc0UTBGT1VqdEJRVTlETEdOQlFVMHNRMEZCUXp0QlFVTklMR2xDUVVGTExESkRRVVJHTzBGQlJVZ3NjVUpCUVZNN1FVRkdUaXhUUVVGRUxFVkJSMGc3UVVGRFF5eHBRa0ZCU3l3eVEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZJUnl4RlFVMUlPMEZCUTBNc2FVSkJRVXNzTWtOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJUa2NzUlVGVFNEdEJRVU5ETEdsQ1FVRkxMREpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFWUkhMRVZCV1VnN1FVRkRReXhwUWtGQlN5d3lRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGYVJ5eEZRV1ZJTzBGQlEwTXNhVUpCUVVzc01rTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CWmtjc1JVRnJRa2c3UVVGRFF5eHBRa0ZCU3l3MFEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZzUWtjN1FVRlFVQ3hMUVdwRVJ5eEZRVGhGU0R0QlFVTkRMRmxCUVVrc1owSkJSRXc3UVVGRlF5eGpRVUZOTEUxQlJsQTdRVUZIUXl4alFVRk5MRlZCU0ZBN1FVRkpReXhoUVVGTExIVkNRVXBPTzBGQlMwTXNZMEZCVFN4elNFRk1VRHRCUVUxRExHVkJRVThzYTBSQlRsSTdRVUZQUXl4alFVRk5MRU5CUVVNN1FVRkRTQ3hwUWtGQlN5d3JRMEZFUmp0QlFVVklMSEZDUVVGVE8wRkJSazRzVTBGQlJDeEZRVWRJTzBGQlEwTXNhVUpCUVVzc0swTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CU0Vjc1JVRk5TRHRCUVVORExHbENRVUZMTEN0RFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVTVITEVWQlUwZzdRVUZEUXl4cFFrRkJTeXdyUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRlVSeXhGUVZsSU8wRkJRME1zYVVKQlFVc3NLME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQldrYzdRVUZRVUN4TFFUbEZSeXhGUVhGSFNEdEJRVU5ETEZsQlFVa3NXVUZFVER0QlFVVkRMR05CUVUwc1RVRkdVRHRCUVVkRExHTkJRVTBzVlVGSVVEdEJRVWxETEdOQlFVMHNjMHRCU2xBN1FVRkxReXhqUVVGTkxFTkJRVU03UVVGRFNDeHBRa0ZCU3l3eVEwRkVSanRCUVVWSUxIRkNRVUZUTzBGQlJrNHNVMEZCUkN4RlFVZElPMEZCUTBNc2FVSkJRVXNzTWtOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJTRWNzUlVGTlNEdEJRVU5ETEdsQ1FVRkxMREpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVNUhPMEZCVEZBc1MwRnlSMGNzUlVGdlNFZzdRVUZEUXl4WlFVRkpMRkZCUkV3N1FVRkZReXhqUVVGTkxFMUJSbEE3UVVGSFF5eGpRVUZOTEZOQlNGQTdRVUZKUXl4aFFVRkxMSGxDUVVwT08wRkJTME1zWTBGQlRTeG5SRUZNVUR0QlFVMURMR1ZCUVU4c01FTkJUbEk3UVVGUFF5eGpRVUZOTEVOQlFVTTdRVUZEU0N4cFFrRkJTeXgxUTBGRVJqdEJRVVZJTEhGQ1FVRlRPMEZCUms0c1UwRkJSQ3hGUVVkSU8wRkJRME1zYVVKQlFVc3NkVU5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlNFYzdRVUZRVUN4TFFYQklSeXhGUVd0SlNEdEJRVU5ETEZsQlFVa3NWMEZFVER0QlFVVkRMR05CUVUwc1RVRkdVRHRCUVVkRExHTkJRVTBzWVVGSVVEdEJRVWxETEdGQlFVc3NjVUpCU2s0N1FVRkxReXhqUVVGTkxESkdRVXhRTzBGQlRVTXNaVUZCVHl3MlEwRk9VanRCUVU5RExHTkJRVTBzUTBGQlF6dEJRVU5JTEdsQ1FVRkxMREJEUVVSR08wRkJSVWdzY1VKQlFWTTdRVUZHVGl4VFFVRkVMRVZCUjBnN1FVRkRReXhwUWtGQlN5d3dRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGSVJ6dEJRVkJRTEV0QmJFbEhMRVZCWjBwSU8wRkJRME1zV1VGQlNTeFRRVVJNTzBGQlJVTXNZMEZCVFN4TlFVWlFPMEZCUjBNc1kwRkJUU3hWUVVoUU8wRkJTVU1zWVVGQlN5eHhRa0ZLVGp0QlFVdERMR05CUVUwc01rWkJURkE3UVVGTlF5eGxRVUZQTERKRFFVNVNPMEZCVDBNc1kwRkJUU3hEUVVGRE8wRkJRMGdzYVVKQlFVc3NkME5CUkVZN1FVRkZTQ3h4UWtGQlV6dEJRVVpPTEZOQlFVUXNSVUZIU0R0QlFVTkRMR2xDUVVGTExIZERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVVoSE8wRkJVRkFzUzBGb1NrY3NSVUU0U2tnN1FVRkRReXhaUVVGSkxFOUJSRXc3UVVGRlF5eGpRVUZOTEUxQlJsQTdRVUZIUXl4alFVRk5MR0ZCU0ZBN1FVRkpReXhqUVVGTkxIRkVRVXBRTzBGQlMwTXNaVUZCVHl4NVEwRk1VanRCUVUxRExHTkJRVTBzUTBGQlF6dEJRVU5JTEdsQ1FVRkxMSE5EUVVSR08wRkJSVWdzY1VKQlFWTTdRVUZHVGl4VFFVRkVMRVZCUjBnN1FVRkRReXhwUWtGQlN5eHpRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGSVJ5eEZRVTFJTzBGQlEwTXNhVUpCUVVzc2MwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVGtjc1JVRlRTRHRCUVVORExHbENRVUZMTEhORFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVlJITEVWQldVZzdRVUZEUXl4cFFrRkJTeXh6UTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRmFSeXhGUVdWSU8wRkJRME1zYVVKQlFVc3NjME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlprY3NSVUZyUWtnN1FVRkRReXhwUWtGQlN5eHpRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGc1FrY3NSVUZ4UWtnN1FVRkRReXhwUWtGQlN5eHpRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGeVFrYzdRVUZPVUN4TFFUbEtSeXhGUVRaTVNEdEJRVU5ETEZsQlFVa3NVVUZFVER0QlFVVkRMR05CUVUwc1RVRkdVRHRCUVVkRExHTkJRVTBzWVVGSVVEdEJRVWxETEdOQlFVMHNaMHBCU2xBN1FVRkxReXhsUVVGUExEQkRRVXhTTzBGQlRVTXNZMEZCVFN4RFFVRkRPMEZCUTBnc2FVSkJRVXNzZFVOQlJFWTdRVUZGU0N4eFFrRkJVenRCUVVaT0xGTkJRVVFzUlVGSFNEdEJRVU5ETEdsQ1FVRkxMSFZEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVaEhMRVZCVFVnN1FVRkRReXhwUWtGQlN5eDFRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGT1J6dEJRVTVRTEV0Qk4weEhMRVZCTmsxSU8wRkJRME1zV1VGQlNTeGpRVVJNTzBGQlJVTXNZMEZCVFN4TlFVWlFPMEZCUjBNc1kwRkJUU3haUVVoUU8wRkJTVU1zWTBGQlRTeHhRa0ZLVUR0QlFVdERMR1ZCUVU4c1owUkJURkk3UVVGTlF5eGpRVUZOTEVOQlFVTTdRVUZEU0N4cFFrRkJTeXcyUTBGRVJqdEJRVVZJTEhGQ1FVRlRPMEZCUms0c1UwRkJSQ3hGUVVkSU8wRkJRME1zYVVKQlFVc3NOa05CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlNFY3NSVUZOU0R0QlFVTkRMR2xDUVVGTExEWkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVU1SExFVkJVMGc3UVVGRFF5eHBRa0ZCU3l3MlEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZVUnp0QlFVNVFMRXRCTjAxSExFVkJaMDlJTzBGQlEwTXNXVUZCU1N4alFVUk1PMEZCUlVNc1kwRkJUU3hOUVVaUU8wRkJSME1zWTBGQlRTeGpRVWhRTzBGQlNVTXNZMEZCVFN4eFFrRktVRHRCUVV0RExHVkJRVThzWjBSQlRGSTdRVUZOUXl4alFVRk5MRU5CUVVNN1FVRkRTQ3hwUWtGQlN5dzJRMEZFUmp0QlFVVklMSEZDUVVGVE8wRkJSazRzVTBGQlJDeEZRVWRJTzBGQlEwTXNhVUpCUVVzc05rTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CU0Vjc1JVRk5TRHRCUVVORExHbENRVUZMTERaRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVTVITEVWQlUwZzdRVUZEUXl4cFFrRkJTeXcyUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRlVSenRCUVU1UUxFdEJhRTlITEVWQmJWQklPMEZCUTBNc1dVRkJTU3hwUWtGRVREdEJRVVZETEdOQlFVMHNUVUZHVUR0QlFVZERMR05CUVUwc1UwRklVRHRCUVVsRExHTkJRVTBzVTBGS1VEdEJRVXRETEdOQlFVMHNjMFJCVEZBN1FVRk5ReXhsUVVGUExHMUVRVTVTTzBGQlQwTXNZMEZCVFN4RFFVRkRPMEZCUTBnc2FVSkJRVXNzWjBSQlJFWTdRVUZGU0N4eFFrRkJVenRCUVVaT0xGTkJRVVFzUlVGSFNEdEJRVU5ETEdsQ1FVRkxMR2RFUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVaEhMRVZCVFVnN1FVRkRReXhwUWtGQlN5eG5SRUZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGT1J5eEZRVk5JTzBGQlEwTXNhVUpCUVVzc1owUkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVkVjc1JVRlpTRHRCUVVORExHbENRVUZMTEdkRVFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVnBITzBGQlVGQXNTMEZ1VUVjc1JVRXdVVWc3UVVGRFF5eFpRVUZKTEZWQlJFdzdRVUZGUXl4alFVRk5MRTFCUmxBN1FVRkhReXhqUVVGTkxHTkJTRkE3UVVGSlF5eGpRVUZOTEZOQlNsQTdRVUZMUXl4alFVRk5MRzFIUVV4UU8wRkJUVU1zWlVGQlR5dzBRMEZPVWp0QlFVOURMR05CUVUwc1EwRkJRenRCUVVOSUxHbENRVUZMTEhsRFFVUkdPMEZCUlVnc2NVSkJRVk03UVVGR1RpeFRRVUZFTEVWQlIwZzdRVUZEUXl4cFFrRkJTeXg1UTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRklSeXhGUVUxSU8wRkJRME1zYVVKQlFVc3NlVU5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlRrY3NSVUZUU0R0QlFVTkRMR2xDUVVGTExIbERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVZSSE8wRkJVRkFzUzBFeFVVY3NSVUU0VWtnN1FVRkRReXhaUVVGSkxGbEJSRXc3UVVGRlF5eGpRVUZOTEUxQlJsQTdRVUZIUXl4alFVRk5MRk5CU0ZBN1FVRkpReXhqUVVGTkxHRkJTbEE3UVVGTFF5eGxRVUZQTERoRFFVeFNPMEZCVFVNc1kwRkJUU3hEUVVGRE8wRkJRMGdzYVVKQlFVc3NNa05CUkVZN1FVRkZTQ3h4UWtGQlV6dEJRVVpPTEZOQlFVUXNSVUZIU0R0QlFVTkRMR2xDUVVGTExESkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVVoSExFVkJUVWc3UVVGRFF5eHBRa0ZCU3l3eVEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZPUnl4RlFWTklPMEZCUTBNc2FVSkJRVXNzTWtOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJWRWNzUlVGWlNEdEJRVU5ETEdsQ1FVRkxMREpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFWcEhMRVZCWlVnN1FVRkRReXhwUWtGQlN5d3lRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGbVJ6dEJRVTVRTEV0Qk9WSkhMRVZCZFZSSU8wRkJRME1zV1VGQlNTeFJRVVJNTzBGQlJVTXNZMEZCVFN4TlFVWlFPMEZCUjBNc1kwRkJUU3hyUWtGSVVEdEJRVWxETEdOQlFVMHNhMFZCU2xBN1FVRkxReXhsUVVGUExEQkRRVXhTTzBGQlRVTXNZMEZCVFN4RFFVRkRPMEZCUTBnc2FVSkJRVXNzZFVOQlJFWTdRVUZGU0N4eFFrRkJVenRCUVVaT0xGTkJRVVFzUlVGSFNEdEJRVU5ETEdsQ1FVRkxMSFZEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVaEhMRVZCVFVnN1FVRkRReXhwUWtGQlN5eDFRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGT1J5eEZRVk5JTzBGQlEwTXNhVUpCUVVzc2RVTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVkVjN1FVRk9VQ3hMUVhaVVJ5eEZRVEJWU0R0QlFVTkRMRmxCUVVrc1UwRkVURHRCUVVWRExHTkJRVTBzVFVGR1VEdEJRVWRETEdOQlFVMHNZMEZJVUR0QlFVbERMR05CUVUwc1kwRktVRHRCUVV0RExHTkJRVTBzTUVSQlRGQTdRVUZOUXl4bFFVRlBMREpEUVU1U08wRkJUME1zWTBGQlRTeERRVUZETzBGQlEwZ3NhVUpCUVVzc2QwTkJSRVk3UVVGRlNDeHhRa0ZCVXp0QlFVWk9MRk5CUVVRc1JVRkhTRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVWhITEVWQlRVZzdRVUZEUXl4cFFrRkJTeXgzUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRk9SeXhGUVZOSU8wRkJRME1zYVVKQlFVc3NkME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlZFY3NSVUZaU0R0QlFVTkRMR2xDUVVGTExIZERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVZwSExFVkJaVWc3UVVGRFF5eHBRa0ZCU3l4M1EwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZtUnp0QlFWQlFMRXRCTVZWSExFVkJiMWRJTzBGQlEwTXNXVUZCU1N4VFFVUk1PMEZCUlVNc1kwRkJUU3hOUVVaUU8wRkJSME1zWTBGQlRTeHpRa0ZJVUR0QlFVbERMR05CUVUwc1UwRktVRHRCUVV0RExHTkJRVTBzYVVSQlRGQTdRVUZOUXl4alFVRk5MRU5CUVVNN1FVRkRTQ3hwUWtGQlN5eDNRMEZFUmp0QlFVVklMSEZDUVVGVE8wRkJSazRzVTBGQlJDeEZRVWRJTzBGQlEwTXNhVUpCUVVzc2QwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CU0Vjc1JVRk5TRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVTVITEVWQlUwZzdRVUZEUXl4cFFrRkJTeXgzUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRlVSeXhGUVZsSU8wRkJRME1zYVVKQlFVc3NkME5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQldrY3NSVUZsU0R0QlFVTkRMR2xDUVVGTExIZERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVdaSExFVkJhMEpJTzBGQlEwTXNhVUpCUVVzc2QwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CYkVKSExFVkJjVUpJTzBGQlEwTXNhVUpCUVVzc2QwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CY2tKSExFVkJkMEpJTzBGQlEwTXNhVUpCUVVzc2QwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CZUVKSExFVkJNa0pJTzBGQlEwTXNhVUpCUVVzc2QwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CTTBKSE8wRkJUbEFzUzBGd1YwY3NSVUY1V1VnN1FVRkRReXhaUVVGSkxGZEJSRXc3UVVGRlF5eGpRVUZOTEUxQlJsQTdRVUZIUXl4alFVRk5MR2RDUVVoUU8wRkJTVU1zWTBGQlRTeFRRVXBRTzBGQlMwTXNZMEZCVFN3d1EwRk1VRHRCUVUxRExHTkJRVTBzUTBGQlF6dEJRVU5JTEdsQ1FVRkxMREJEUVVSR08wRkJSVWdzY1VKQlFWTTdRVUZHVGl4VFFVRkVMRVZCUjBnN1FVRkRReXhwUWtGQlN5d3dRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGSVJ5eEZRVTFJTzBGQlEwTXNhVUpCUVVzc01FTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVGtjc1JVRlRTRHRCUVVORExHbENRVUZMTERCRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVlJITEVWQldVZzdRVUZEUXl4cFFrRkJTeXd3UTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRmFSenRCUVU1UUxFdEJlbGxITEVWQksxcElPMEZCUTBNc1dVRkJTU3hqUVVSTU8wRkJSVU1zWTBGQlRTeE5RVVpRTzBGQlIwTXNZMEZCVFN4VlFVaFFPMEZCU1VNc1lVRkJTeXhuUTBGS1RqdEJRVXRETEdOQlFVMHNkVVJCVEZBN1FVRk5ReXhsUVVGUExHZEVRVTVTTzBGQlQwTXNZMEZCVFN4RFFVRkRPMEZCUTBnc2FVSkJRVXNzTmtOQlJFWTdRVUZGU0N4eFFrRkJVenRCUVVaT0xGTkJRVVFzUlVGSFNEdEJRVU5ETEdsQ1FVRkxMRFpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVaEhMRVZCVFVnN1FVRkRReXhwUWtGQlN5dzJRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGT1J5eEZRVk5JTzBGQlEwTXNhVUpCUVVzc05rTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVkVjc1JVRlpTRHRCUVVORExHbENRVUZMTERaRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVnBITEVWQlpVZzdRVUZEUXl4cFFrRkJTeXcyUTBGRVRqdEJRVVZETEhGQ1FVRlRPMEZCUmxZc1UwRm1SeXhGUVd0Q1NEdEJRVU5ETEdsQ1FVRkxMRFpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFXeENSeXhGUVhGQ1NEdEJRVU5ETEdsQ1FVRkxMRFpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFYSkNSeXhGUVhkQ1NEdEJRVU5ETEdsQ1FVRkxMRFpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFYaENSeXhGUVRKQ1NEdEJRVU5ETEdsQ1FVRkxMRFpEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFUTkNSenRCUVZCUUxFdEJMMXBITEVWQmNXTklPMEZCUTBNc1dVRkJTU3hSUVVSTU8wRkJSVU1zWTBGQlRTeE5RVVpRTzBGQlIwTXNZMEZCVFN4VFFVaFFPMEZCU1VNc1kwRkJUU3hUUVVwUU8wRkJTME1zWTBGQlRTeG5SRUZNVUR0QlFVMURMR1ZCUVU4c01FTkJUbEk3UVVGUFF5eGpRVUZOTEVOQlFVTTdRVUZEU0N4cFFrRkJTeXgxUTBGRVJqdEJRVVZJTEhGQ1FVRlRPMEZCUms0c1UwRkJSQ3hGUVVkSU8wRkJRME1zYVVKQlFVc3NkVU5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQlNFY3NSVUZOU0R0QlFVTkRMR2xDUVVGTExIVkRRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVU1SExFVkJVMGc3UVVGRFF5eHBRa0ZCU3l4MVEwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZVUnl4RlFWbElPMEZCUTBNc2FVSkJRVXNzZFVOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJXa2NzUlVGbFNEdEJRVU5ETEdsQ1FVRkxMSFZEUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFXWkhMRVZCYTBKSU8wRkJRME1zYVVKQlFVc3NkVU5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQmJFSkhMRVZCY1VKSU8wRkJRME1zYVVKQlFVc3NkVU5CUkU0N1FVRkZReXh4UWtGQlV6dEJRVVpXTEZOQmNrSkhPMEZCVUZBc1MwRnlZMGNzUlVGeFpVZzdRVUZEUXl4WlFVRkpMRlZCUkV3N1FVRkZReXhqUVVGTkxFMUJSbEE3UVVGSFF5eGpRVUZOTEdGQlNGQTdRVUZKUXl4alFVRk5MRk5CU2xBN1FVRkxReXhqUVVGTkxEUkNRVXhRTzBGQlRVTXNaVUZCVHl3eVEwRk9VanRCUVU5RExHTkJRVTBzUTBGQlF6dEJRVU5JTEdsQ1FVRkxMSGREUVVSR08wRkJSVWdzY1VKQlFWTTdRVUZHVGl4VFFVRkVMRVZCUjBnN1FVRkRReXhwUWtGQlN5eDNRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGSVJ5eEZRVTFJTzBGQlEwTXNhVUpCUVVzc2QwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CVGtjc1JVRlRTRHRCUVVORExHbENRVUZMTEhkRFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRVlJITzBGQlVGQXNTMEZ5WlVjc1JVRjVaa2c3UVVGRFF5eFpRVUZKTEZOQlJFdzdRVUZGUXl4alFVRk5MRTFCUmxBN1FVRkhReXhqUVVGTkxHTkJTRkE3UVVGSlF5eGpRVUZOTERaRVFVcFFPMEZCUzBNc1kwRkJUU3hEUVVGRE8wRkJRMGdzYVVKQlFVc3NkME5CUkVZN1FVRkZTQ3h4UWtGQlV6dEJRVVpPTEZOQlFVUXNSVUZIU0R0QlFVTkRMR2xDUVVGTExIZERRVVJPTzBGQlJVTXNjVUpCUVZNN1FVRkdWaXhUUVVoSExFVkJUVWc3UVVGRFF5eHBRa0ZCU3l4M1EwRkVUanRCUVVWRExIRkNRVUZUTzBGQlJsWXNVMEZPUnl4RlFWTklPMEZCUTBNc2FVSkJRVXNzZDBOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJWRWNzUlVGWlNEdEJRVU5ETEdsQ1FVRkxMSGREUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFWcEhPMEZCVEZBc1MwRjZaa2NzUlVFNFowSklPMEZCUTBNc1dVRkJTU3hQUVVSTU8wRkJSVU1zWTBGQlRTeE5RVVpRTzBGQlIwTXNZMEZCVFN4VlFVaFFPMEZCU1VNc1kwRkJUU3d5UTBGS1VEdEJRVXRETEdWQlFVOHNlVU5CVEZJN1FVRk5ReXhqUVVGTkxFTkJRVU03UVVGRFNDeHBRa0ZCU3l4elEwRkVSanRCUVVWSUxIRkNRVUZUTzBGQlJrNHNVMEZCUkN4RlFVZElPMEZCUTBNc2FVSkJRVXNzYzBOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJTRWNzUlVGTlNEdEJRVU5ETEdsQ1FVRkxMSE5EUVVST08wRkJSVU1zY1VKQlFWTTdRVUZHVml4VFFVNUhMRVZCVTBnN1FVRkRReXhwUWtGQlN5eHpRMEZFVGp0QlFVVkRMSEZDUVVGVE8wRkJSbFlzVTBGVVJ5eEZRVmxJTzBGQlEwTXNhVUpCUVVzc2MwTkJSRTQ3UVVGRlF5eHhRa0ZCVXp0QlFVWldMRk5CV2tjc1JVRmxTRHRCUVVORExHbENRVUZMTEhORFFVUk9PMEZCUlVNc2NVSkJRVk03UVVGR1ZpeFRRV1pITEVWQmEwSklPMEZCUTBNc2FVSkJRVXNzYzBOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJiRUpITEVWQmNVSklPMEZCUTBNc2FVSkJRVXNzYzBOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJja0pITEVWQmQwSklPMEZCUTBNc2FVSkJRVXNzYzBOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJlRUpITEVWQk1rSklPMEZCUTBNc2FVSkJRVXNzYzBOQlJFNDdRVUZGUXl4eFFrRkJVenRCUVVaV0xGTkJNMEpITzBGQlRsQXNTMEU1WjBKSE8wRkJSRXNzUTBGQlpqczdRVUYxYWtKQkxFbEJRVWtzVVVGQlVUdEJRVU5TT3pzN1FVRkhRU3hoUVVGVExHMUNRVUZYTzBGQlEyaENMRmxCUVVrc1YwRkJWeXhGUVVGbU8wRkJRMEVzWlVGQlR5eEZRVUZGTEU5QlFVWXNRMEZCVlN4VlFVRlRMRTlCUVZRc1JVRkJhMElzVFVGQmJFSXNSVUZCTUVJN08wRkJSWFpETEhGQ1FVRlRMRWxCUVZRc1EwRkJZeXhIUVVGa0xFTkJRV3RDTEZWQlFWTXNTVUZCVkN4RlFVRmxPMEZCUXpkQ0xHOUNRVUZKTEZkQlFWY3NSVUZCWmp0QlFVTkJMSGxDUVVGVExFVkJRVlFzUjBGQll5eExRVUZMTEVWQlFXNUNPMEZCUTBFc2VVSkJRVk1zU1VGQlZDeEhRVUZuUWl4TFFVRkxMRWxCUVhKQ08wRkJRMEVzZVVKQlFWTXNSMEZCVkN4SFFVRmxMRXRCUVVzc1IwRkJUQ3hKUVVGWkxFVkJRVE5DTzBGQlEwRXNlVUpCUVZNc1IwRkJWQ3hIUVVGbExFdEJRVXNzUjBGQlRDeEpRVUZaTEVWQlFUTkNPMEZCUTBFc2VVSkJRVk1zU1VGQlZDeEhRVUZuUWl4TFFVRkxMRWxCUVV3c1NVRkJZU3hGUVVFM1FqdEJRVU5CTEhsQ1FVRlRMRXRCUVZRc1IwRkJhVUlzUzBGQlN5eExRVUZNTEV0QlFXVXNTMEZCU3l4SlFVRk1MRWRCUVZrc1MwRkJTeXhKUVVGTUxFTkJRVlVzUTBGQlZpeEZRVUZoTEVkQlFYcENMRWRCUVN0Q0xFVkJRVGxETEVOQlFXcENPenRCUVVWQkxIbENRVUZUTEVsQlFWUXNRMEZCWXl4UlFVRmtPMEZCUTBnc1lVRldSRHRCUVZkQkxHOUNRVUZSTEZGQlFWSTdRVUZEU0N4VFFXUk5MRU5CUVZBN1FVRmxTQ3hMUVhKQ1R6czdRVUYxUWxJN096dEJRVWRCTEcxQ1FVRmxMSFZDUVVGVExFbEJRVlFzUlVGQlpUdEJRVU14UWl4WlFVRkpMRmRCUVZjc1JVRkJaanRCUVVOQkxHVkJRVThzUlVGQlJTeFBRVUZHTEVOQlFWVXNWVUZCVXl4UFFVRlVMRVZCUVd0Q0xFMUJRV3hDTEVWQlFUQkNPenRCUVVWMlF5eHhRa0ZCVXl4SlFVRlVMRU5CUVdNc1IwRkJaQ3hEUVVGclFpeFZRVUZUTEVsQlFWUXNSVUZCWlR0QlFVTTNRaXh2UWtGQlNTeFJRVUZSTEV0QlFVc3NTVUZCYWtJc1JVRkJkVUk3UVVGRGJrSXNkMEpCUVVrc1YwRkJWeXhGUVVGbU8wRkJRMEVzTmtKQlFWTXNSVUZCVkN4SFFVRmpMRXRCUVVzc1JVRkJia0k3UVVGRFFTdzJRa0ZCVXl4SlFVRlVMRWRCUVdkQ0xFdEJRVXNzU1VGQmNrSTdRVUZEUVN3MlFrRkJVeXhIUVVGVUxFZEJRV1VzUzBGQlN5eEhRVUZNTEVsQlFWa3NSVUZCTTBJN1FVRkRRU3cyUWtGQlV5eEhRVUZVTEVkQlFXVXNTMEZCU3l4SFFVRk1MRWxCUVZrc1JVRkJNMEk3UVVGRFFTdzJRa0ZCVXl4SlFVRlVMRWRCUVdkQ0xFdEJRVXNzU1VGQlRDeEpRVUZoTEVWQlFUZENPMEZCUTBFc05rSkJRVk1zUzBGQlZDeEhRVUZwUWl4TFFVRkxMRXRCUVV3c1MwRkJaU3hMUVVGTExFbEJRVXdzUjBGQldTeExRVUZMTEVsQlFVd3NRMEZCVlN4RFFVRldMRVZCUVdFc1IwRkJla0lzUjBGQkswSXNSVUZCT1VNc1EwRkJha0k3TzBGQlJVRXNOa0pCUVZNc1NVRkJWQ3hEUVVGakxGRkJRV1E3UVVGRFNEdEJRVU5LTEdGQldrUTdRVUZoUVN4dlFrRkJVU3hSUVVGU08wRkJRMGdzVTBGb1FrMHNRMEZCVUR0QlFXbENTQ3hMUVRkRFR6czdRVUVyUTFJN096dEJRVWRCTEdGQlFWTXNhVUpCUVZNc1JVRkJWQ3hGUVVGaE8wRkJRMnhDTEZsQlFVa3NWMEZCVnl4RlFVRm1PMEZCUTBFc1pVRkJUeXhGUVVGRkxFOUJRVVlzUTBGQlZTeFZRVUZUTEU5QlFWUXNSVUZCYTBJc1RVRkJiRUlzUlVGQk1FSTdRVUZEZGtNc2NVSkJRVk1zU1VGQlZDeERRVUZqTEVkQlFXUXNRMEZCYTBJc1ZVRkJVeXhKUVVGVUxFVkJRV1U3UVVGRE4wSXNiMEpCUVVrc1RVRkJUU3hMUVVGTExFVkJRV1lzUlVGQmJVSTdRVUZEWml3clFrRkJWeXhKUVVGWU8wRkJRMGc3UVVGRFNpeGhRVXBFTzBGQlMwRXNiMEpCUVZFc1VVRkJVanRCUVVOSUxGTkJVRTBzUTBGQlVEdEJRVkZJTzBGQk5VUlBMRU5CUVZvN08wRkJLMFJCTEU5QlFVOHNUMEZCVUN4SFFVRnBRaXhMUVVGcVFqczdPenM3T3pzN096czdPenM3T0VKRGRHNUNjMElzYlVKQlFXMUNPenRKUVVFM1FpeEpRVUZKT3pzN096dHZRMEZKVHl3d1FrRkJNRUk3T3pzN2JVTkJRek5DTEhkQ1FVRjNRanM3T3pzclFrRkRka0lzYjBKQlFXOUNPenRKUVVFdlFpeExRVUZMT3p0cFEwRkRVU3h6UWtGQmMwSTdPMGxCUVc1RExFOUJRVTg3TzI5RFFVVkpMREJDUVVFd1FqczdPenM3UVVGSGFrUXNVMEZCVXl4TlFVRk5MRWRCUVVjN1FVRkRhRUlzVFVGQlNTeEZRVUZGTEVkQlFVY3NTVUZCU1N4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVWQlFVVXNRMEZCUXpzN1FVRkZNVU1zVDBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkZMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGRrSXNTVUZCUlN4RFFVRkRMRlZCUVZVc2IwTkJRV0VzUTBGQlF6dEJRVU16UWl4SlFVRkZMRU5CUVVNc1UwRkJVeXh0UTBGQldTeERRVUZETzBGQlEzcENMRWxCUVVVc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETzBGQlEycENMRWxCUVVVc1EwRkJReXhuUWtGQlowSXNSMEZCUnl4TFFVRkxMRU5CUVVNc1owSkJRV2RDTEVOQlFVTTdPMEZCUlRkRExFbEJRVVVzUTBGQlF5eEZRVUZGTEVkQlFVY3NUMEZCVHl4RFFVRkRPMEZCUTJoQ0xFbEJRVVVzUTBGQlF5eFJRVUZSTEVkQlFVY3NWVUZCVXl4SlFVRkpMRVZCUVVVN1FVRkRNMElzVjBGQlR5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1JVRkJSU3hGUVVGRkxFTkJRVU1zUTBGQlF6dEhRVU51UXl4RFFVRkRPenRCUVVWR0xGTkJRVThzUlVGQlJTeERRVUZETzBOQlExZzdPMEZCUlVRc1NVRkJTU3hKUVVGSkxFZEJRVWNzVFVGQlRTeEZRVUZGTEVOQlFVTTdRVUZEY0VJc1NVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eE5RVUZOTEVOQlFVTTdPMEZCUlhKQ0xHdERRVUZYTEVsQlFVa3NRMEZCUXl4RFFVRkRPenRCUVVWcVFpeEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE96dHhRa0ZGVWl4SlFVRkpPenM3T3pzN096czdPenM3TzNGQ1EzQkRlVUlzVTBGQlV6czdlVUpCUXk5Q0xHRkJRV0U3T3pzN2RVSkJRMFVzVjBGQlZ6czdNRUpCUTFJc1kwRkJZenM3YzBKQlEyNURMRlZCUVZVN096czdRVUZGZEVJc1NVRkJUU3hQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZET3p0QlFVTjRRaXhKUVVGTkxHbENRVUZwUWl4SFFVRkhMRU5CUVVNc1EwRkJRenM3TzBGQlJUVkNMRWxCUVUwc1owSkJRV2RDTEVkQlFVYzdRVUZET1VJc1IwRkJReXhGUVVGRkxHRkJRV0U3UVVGRGFFSXNSMEZCUXl4RlFVRkZMR1ZCUVdVN1FVRkRiRUlzUjBGQlF5eEZRVUZGTEdWQlFXVTdRVUZEYkVJc1IwRkJReXhGUVVGRkxGVkJRVlU3UVVGRFlpeEhRVUZETEVWQlFVVXNhMEpCUVd0Q08wRkJRM0pDTEVkQlFVTXNSVUZCUlN4cFFrRkJhVUk3UVVGRGNFSXNSMEZCUXl4RlFVRkZMRlZCUVZVN1EwRkRaQ3hEUVVGRE96czdRVUZGUml4SlFVRk5MRlZCUVZVc1IwRkJSeXhwUWtGQmFVSXNRMEZCUXpzN1FVRkZPVUlzVTBGQlV5eHhRa0ZCY1VJc1EwRkJReXhQUVVGUExFVkJRVVVzVVVGQlVTeEZRVUZGTEZWQlFWVXNSVUZCUlR0QlFVTnVSU3hOUVVGSkxFTkJRVU1zVDBGQlR5eEhRVUZITEU5QlFVOHNTVUZCU1N4RlFVRkZMRU5CUVVNN1FVRkROMElzVFVGQlNTeERRVUZETEZGQlFWRXNSMEZCUnl4UlFVRlJMRWxCUVVrc1JVRkJSU3hEUVVGRE8wRkJReTlDTEUxQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1ZVRkJWU3hKUVVGSkxFVkJRVVVzUTBGQlF6czdRVUZGYmtNc2EwTkJRWFZDTEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUXpkQ0xIZERRVUV3UWl4SlFVRkpMRU5CUVVNc1EwRkJRenREUVVOcVF6czdRVUZGUkN4eFFrRkJjVUlzUTBGQlF5eFRRVUZUTEVkQlFVYzdRVUZEYUVNc1lVRkJWeXhGUVVGRkxIRkNRVUZ4UWpzN1FVRkZiRU1zVVVGQlRTeHhRa0ZCVVR0QlFVTmtMRXRCUVVjc1JVRkJSU3h2UWtGQlR5eEhRVUZIT3p0QlFVVm1MR2RDUVVGakxFVkJRVVVzZDBKQlFWTXNTVUZCU1N4RlFVRkZMRVZCUVVVc1JVRkJSVHRCUVVOcVF5eFJRVUZKTEdkQ1FVRlRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eFZRVUZWTEVWQlFVVTdRVUZEZEVNc1ZVRkJTU3hGUVVGRkxFVkJRVVU3UVVGQlJTeGpRVUZOTERKQ1FVRmpMSGxEUVVGNVF5eERRVUZETEVOQlFVTTdUMEZCUlR0QlFVTXpSU3h2UWtGQlR5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wdEJRelZDTEUxQlFVMDdRVUZEVEN4VlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0TFFVTjZRanRIUVVOR08wRkJRMFFzYTBKQlFXZENMRVZCUVVVc01FSkJRVk1zU1VGQlNTeEZRVUZGTzBGQlF5OUNMRmRCUVU4c1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SFFVTXpRanM3UVVGRlJDeHBRa0ZCWlN4RlFVRkZMSGxDUVVGVExFbEJRVWtzUlVGQlJTeFBRVUZQTEVWQlFVVTdRVUZEZGtNc1VVRkJTU3huUWtGQlV5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1ZVRkJWU3hGUVVGRk8wRkJRM1JETEc5Q1FVRlBMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdTMEZETjBJc1RVRkJUVHRCUVVOTUxGVkJRVWtzVDBGQlR5eFBRVUZQTEV0QlFVc3NWMEZCVnl4RlFVRkZPMEZCUTJ4RExHTkJRVTBzZVVWQlFUQkVMRWxCUVVrc2IwSkJRV2xDTEVOQlFVTTdUMEZEZGtZN1FVRkRSQ3hWUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJRenRMUVVNdlFqdEhRVU5HTzBGQlEwUXNiVUpCUVdsQ0xFVkJRVVVzTWtKQlFWTXNTVUZCU1N4RlFVRkZPMEZCUTJoRExGZEJRVThzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVNMVFqczdRVUZGUkN4dFFrRkJhVUlzUlVGQlJTd3lRa0ZCVXl4SlFVRkpMRVZCUVVVc1JVRkJSU3hGUVVGRk8wRkJRM0JETEZGQlFVa3NaMEpCUVZNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEZWQlFWVXNSVUZCUlR0QlFVTjBReXhWUVVGSkxFVkJRVVVzUlVGQlJUdEJRVUZGTEdOQlFVMHNNa0pCUVdNc05FTkJRVFJETEVOQlFVTXNRMEZCUXp0UFFVRkZPMEZCUXpsRkxHOUNRVUZQTEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGREwwSXNUVUZCVFR0QlFVTk1MRlZCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkRPMHRCUXpWQ08wZEJRMFk3UVVGRFJDeHhRa0ZCYlVJc1JVRkJSU3cyUWtGQlV5eEpRVUZKTEVWQlFVVTdRVUZEYkVNc1YwRkJUeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUXpsQ08wTkJRMFlzUTBGQlF6czdRVUZGU3l4SlFVRkpMRWRCUVVjc1IwRkJSeXh2UWtGQlR5eEhRVUZITEVOQlFVTTdPenRSUVVWd1FpeFhRVUZYTzFGQlFVVXNUVUZCVFRzN096czdPenM3T3pzN08yZERRemRGUVN4eFFrRkJjVUk3T3pzN1FVRkZla01zVTBGQlV5eDVRa0ZCZVVJc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRGJFUXNaME5CUVdVc1VVRkJVU3hEUVVGRExFTkJRVU03UTBGRE1VSTdPenM3T3pzN08zRkNRMHB2UWl4VlFVRlZPenR4UWtGRmFFSXNWVUZCVXl4UlFVRlJMRVZCUVVVN1FVRkRhRU1zVlVGQlVTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExGRkJRVkVzUlVGQlJTeFZRVUZUTEVWQlFVVXNSVUZCUlN4TFFVRkxMRVZCUVVVc1UwRkJVeXhGUVVGRkxFOUJRVThzUlVGQlJUdEJRVU16UlN4UlFVRkpMRWRCUVVjc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRFlpeFJRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1JVRkJSVHRCUVVOdVFpeFhRVUZMTEVOQlFVTXNVVUZCVVN4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOd1FpeFRRVUZITEVkQlFVY3NWVUZCVXl4UFFVRlBMRVZCUVVVc1QwRkJUeXhGUVVGRk96dEJRVVV2UWl4WlFVRkpMRkZCUVZFc1IwRkJSeXhUUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETzBGQlEyeERMR2xDUVVGVExFTkJRVU1zVVVGQlVTeEhRVUZITEdOQlFVOHNSVUZCUlN4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZETVVRc1dVRkJTU3hIUVVGSExFZEJRVWNzUlVGQlJTeERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNdlFpeHBRa0ZCVXl4RFFVRkRMRkZCUVZFc1IwRkJSeXhSUVVGUkxFTkJRVU03UVVGRE9VSXNaVUZCVHl4SFFVRkhMRU5CUVVNN1QwRkRXaXhEUVVGRE8wdEJRMGc3TzBGQlJVUXNVMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRExFVkJRVVVzUTBGQlF6czdRVUZGTjBNc1YwRkJUeXhIUVVGSExFTkJRVU03UjBGRFdpeERRVUZETEVOQlFVTTdRMEZEU2pzN096czdPenM3T3p0QlEzQkNSQ3hKUVVGTkxGVkJRVlVzUjBGQlJ5eERRVUZETEdGQlFXRXNSVUZCUlN4VlFVRlZMRVZCUVVVc1dVRkJXU3hGUVVGRkxGTkJRVk1zUlVGQlJTeE5RVUZOTEVWQlFVVXNVVUZCVVN4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE96dEJRVVZ1Unl4VFFVRlRMRk5CUVZNc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlEyaERMRTFCUVVrc1IwRkJSeXhIUVVGSExFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNSMEZCUnp0TlFVTjBRaXhKUVVGSkxGbEJRVUU3VFVGRFNpeE5RVUZOTEZsQlFVRXNRMEZCUXp0QlFVTllMRTFCUVVrc1IwRkJSeXhGUVVGRk8wRkJRMUFzVVVGQlNTeEhRVUZITEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRE8wRkJRM1JDTEZWQlFVMHNSMEZCUnl4SFFVRkhMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF6czdRVUZGTVVJc1YwRkJUeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVkQlFVY3NSMEZCUnl4SFFVRkhMRTFCUVUwc1EwRkJRenRIUVVONFF6czdRVUZGUkN4TlFVRkpMRWRCUVVjc1IwRkJSeXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZET3pzN1FVRkhNVVFzVDBGQlN5eEpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRVZCUVVVc1IwRkJSeXhIUVVGSExGVkJRVlVzUTBGQlF5eE5RVUZOTEVWQlFVVXNSMEZCUnl4RlFVRkZMRVZCUVVVN1FVRkRhRVFzVVVGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhIUVVGSExFZEJRVWNzUTBGQlF5eFZRVUZWTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVNNVF6czdPMEZCUjBRc1RVRkJTU3hMUVVGTExFTkJRVU1zYVVKQlFXbENMRVZCUVVVN1FVRkRNMElzVTBGQlN5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFbEJRVWtzUlVGQlJTeFRRVUZUTEVOQlFVTXNRMEZCUXp0SFFVTXhRenM3UVVGRlJDeE5RVUZKTzBGQlEwWXNVVUZCU1N4SFFVRkhMRVZCUVVVN1FVRkRVQ3hWUVVGSkxFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXpzN096dEJRVWwyUWl4VlFVRkpMRTFCUVUwc1EwRkJReXhqUVVGakxFVkJRVVU3UVVGRGVrSXNZMEZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhKUVVGSkxFVkJRVVVzVVVGQlVTeEZRVUZGTEVWQlFVTXNTMEZCU3l4RlFVRkZMRTFCUVUwc1JVRkJReXhEUVVGRExFTkJRVU03VDBGRGVFUXNUVUZCVFR0QlFVTk1MRmxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzVFVGQlRTeERRVUZETzA5QlEzUkNPMHRCUTBZN1IwRkRSaXhEUVVGRExFOUJRVThzUjBGQlJ5eEZRVUZGT3p0SFFVVmlPME5CUTBZN08wRkJSVVFzVTBGQlV5eERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRXRCUVVzc1JVRkJSU3hEUVVGRE96dHhRa0ZGYmtJc1UwRkJVenM3T3pzN096czdPenM3T3p0NVEwTTNRMlVzWjBOQlFXZERPenM3T3pKQ1FVTTVReXhuUWtGQlowSTdPenM3YjBOQlExQXNNRUpCUVRCQ096czdPM2xDUVVOeVF5eGpRVUZqT3pzN096QkNRVU5pTEdWQlFXVTdPenM3TmtKQlExb3NhMEpCUVd0Q096czdPekpDUVVOd1FpeG5Ra0ZCWjBJN096czdRVUZGYkVNc1UwRkJVeXh6UWtGQmMwSXNRMEZCUXl4UlFVRlJMRVZCUVVVN1FVRkRMME1zZVVOQlFUSkNMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRM0pETERKQ1FVRmhMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRM1pDTEc5RFFVRnpRaXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU5vUXl4NVFrRkJWeXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU55UWl3d1FrRkJXU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU4wUWl3MlFrRkJaU3hSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU42UWl3eVFrRkJZU3hSUVVGUkxFTkJRVU1zUTBGQlF6dERRVU40UWpzN096czdPenM3Y1VKRGFFSnhSQ3hWUVVGVk96dHhRa0ZGYWtRc1ZVRkJVeXhSUVVGUkxFVkJRVVU3UVVGRGFFTXNWVUZCVVN4RFFVRkRMR05CUVdNc1EwRkJReXh2UWtGQmIwSXNSVUZCUlN4VlFVRlRMRTlCUVU4c1JVRkJSU3hQUVVGUExFVkJRVVU3UVVGRGRrVXNVVUZCU1N4UFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRExFOUJRVTg3VVVGRGVrSXNSVUZCUlN4SFFVRkhMRTlCUVU4c1EwRkJReXhGUVVGRkxFTkJRVU03TzBGQlJYQkNMRkZCUVVrc1QwRkJUeXhMUVVGTExFbEJRVWtzUlVGQlJUdEJRVU53UWl4aFFVRlBMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU5xUWl4TlFVRk5MRWxCUVVrc1QwRkJUeXhMUVVGTExFdEJRVXNzU1VGQlNTeFBRVUZQTEVsQlFVa3NTVUZCU1N4RlFVRkZPMEZCUXk5RExHRkJRVThzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUTNSQ0xFMUJRVTBzU1VGQlNTeGxRVUZSTEU5QlFVOHNRMEZCUXl4RlFVRkZPMEZCUXpOQ0xGVkJRVWtzVDBGQlR5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRVZCUVVVN1FVRkRkRUlzV1VGQlNTeFBRVUZQTEVOQlFVTXNSMEZCUnl4RlFVRkZPMEZCUTJZc2FVSkJRVThzUTBGQlF5eEhRVUZITEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03VTBGRE9VSTdPMEZCUlVRc1pVRkJUeXhSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03VDBGRGFFUXNUVUZCVFR0QlFVTk1MR1ZCUVU4c1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzA5QlEzUkNPMHRCUTBZc1RVRkJUVHRCUVVOTUxGVkJRVWtzVDBGQlR5eERRVUZETEVsQlFVa3NTVUZCU1N4UFFVRlBMRU5CUVVNc1IwRkJSeXhGUVVGRk8wRkJReTlDTEZsQlFVa3NTVUZCU1N4SFFVRkhMRzFDUVVGWkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnlReXhaUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEhsQ1FVRnJRaXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NSVUZCUlN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE4wVXNaVUZCVHl4SFFVRkhMRVZCUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlF5eERRVUZETzA5QlEzaENPenRCUVVWRUxHRkJRVThzUlVGQlJTeERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenRMUVVNM1FqdEhRVU5HTEVOQlFVTXNRMEZCUXp0RFFVTktPenM3T3pzN096czdPenM3TzNGQ1F5OUNPRVVzVlVGQlZUczdlVUpCUTI1RkxHTkJRV003T3pzN2NVSkJSWEpDTEZWQlFWTXNVVUZCVVN4RlFVRkZPMEZCUTJoRExGVkJRVkVzUTBGQlF5eGpRVUZqTEVOQlFVTXNUVUZCVFN4RlFVRkZMRlZCUVZNc1QwRkJUeXhGUVVGRkxFOUJRVThzUlVGQlJUdEJRVU42UkN4UlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRMW9zV1VGQlRTd3lRa0ZCWXl3MlFrRkJOa0lzUTBGQlF5eERRVUZETzB0QlEzQkVPenRCUVVWRUxGRkJRVWtzUlVGQlJTeEhRVUZITEU5QlFVOHNRMEZCUXl4RlFVRkZPMUZCUTJZc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF5eFBRVUZQTzFGQlEzcENMRU5CUVVNc1IwRkJSeXhEUVVGRE8xRkJRMHdzUjBGQlJ5eEhRVUZITEVWQlFVVTdVVUZEVWl4SlFVRkpMRmxCUVVFN1VVRkRTaXhYUVVGWExGbEJRVUVzUTBGQlF6czdRVUZGYUVJc1VVRkJTU3hQUVVGUExFTkJRVU1zU1VGQlNTeEpRVUZKTEU5QlFVOHNRMEZCUXl4SFFVRkhMRVZCUVVVN1FVRkRMMElzYVVKQlFWY3NSMEZCUnl4NVFrRkJhMElzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRWRCUVVjc1EwRkJRenRMUVVOcVJqczdRVUZGUkN4UlFVRkpMR3RDUVVGWExFOUJRVThzUTBGQlF5eEZRVUZGTzBGQlFVVXNZVUZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdTMEZCUlRzN1FVRkZNVVFzVVVGQlNTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RlFVRkZPMEZCUTJoQ0xGVkJRVWtzUjBGQlJ5eHRRa0ZCV1N4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGRGJFTTdPMEZCUlVRc1lVRkJVeXhoUVVGaExFTkJRVU1zUzBGQlN5eEZRVUZGTEV0QlFVc3NSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRla01zVlVGQlNTeEpRVUZKTEVWQlFVVTdRVUZEVWl4WlFVRkpMRU5CUVVNc1IwRkJSeXhIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU5xUWl4WlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU51UWl4WlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFdEJRVXNzUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEZWtJc1dVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRPenRCUVVWdVFpeFpRVUZKTEZkQlFWY3NSVUZCUlR0QlFVTm1MR05CUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzVjBGQlZ5eEhRVUZITEV0QlFVc3NRMEZCUXp0VFFVTjRRenRQUVVOR096dEJRVVZFTEZOQlFVY3NSMEZCUnl4SFFVRkhMRWRCUVVjc1JVRkJSU3hEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCUlR0QlFVTTNRaXhaUVVGSkxFVkJRVVVzU1VGQlNUdEJRVU5XTEcxQ1FVRlhMRVZCUVVVc2JVSkJRVmtzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRVZCUVVVc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eFhRVUZYTEVkQlFVY3NTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRE8wOUJReTlGTEVOQlFVTXNRMEZCUXp0TFFVTktPenRCUVVWRUxGRkJRVWtzVDBGQlR5eEpRVUZKTEU5QlFVOHNUMEZCVHl4TFFVRkxMRkZCUVZFc1JVRkJSVHRCUVVNeFF5eFZRVUZKTEdWQlFWRXNUMEZCVHl4RFFVRkRMRVZCUVVVN1FVRkRjRUlzWVVGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1FVRkRka01zWTBGQlNTeERRVUZETEVsQlFVa3NUMEZCVHl4RlFVRkZPMEZCUTJoQ0xIbENRVUZoTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzVDBGQlR5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRYUVVNdlF6dFRRVU5HTzA5QlEwWXNUVUZCVFR0QlFVTk1MRmxCUVVrc1VVRkJVU3haUVVGQkxFTkJRVU03TzBGQlJXSXNZVUZCU3l4SlFVRkpMRWRCUVVjc1NVRkJTU3hQUVVGUExFVkJRVVU3UVVGRGRrSXNZMEZCU1N4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGT3pzN08wRkJTUzlDTEdkQ1FVRkpMRkZCUVZFc1MwRkJTeXhUUVVGVExFVkJRVVU3UVVGRE1VSXNNa0pCUVdFc1EwRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMkZCUTJoRE8wRkJRMFFzYjBKQlFWRXNSMEZCUnl4SFFVRkhMRU5CUVVNN1FVRkRaaXhoUVVGRExFVkJRVVVzUTBGQlF6dFhRVU5NTzFOQlEwWTdRVUZEUkN4WlFVRkpMRkZCUVZFc1MwRkJTeXhUUVVGVExFVkJRVVU3UVVGRE1VSXNkVUpCUVdFc1EwRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRUUVVOMFF6dFBRVU5HTzB0QlEwWTdPMEZCUlVRc1VVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTzBGQlExZ3NVMEZCUnl4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dExRVU55UWpzN1FVRkZSQ3hYUVVGUExFZEJRVWNzUTBGQlF6dEhRVU5hTEVOQlFVTXNRMEZCUXp0RFFVTktPenM3T3pzN096czdPenM3TzNsQ1F6bEZjVUlzWTBGQll6czdPenR4UWtGRmNrSXNWVUZCVXl4UlFVRlJMRVZCUVVVN1FVRkRhRU1zVlVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4bFFVRmxMRVZCUVVVc2FVTkJRV2RETzBGQlEzWkZMRkZCUVVrc1UwRkJVeXhEUVVGRExFMUJRVTBzUzBGQlN5eERRVUZETEVWQlFVVTdPMEZCUlRGQ0xHRkJRVThzVTBGQlV5eERRVUZETzB0QlEyeENMRTFCUVUwN08wRkJSVXdzV1VGQlRTd3lRa0ZCWXl4dFFrRkJiVUlzUjBGQlJ5eFRRVUZUTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRU5CUVVNN1MwRkRka1k3UjBGRFJpeERRVUZETEVOQlFVTTdRMEZEU2pzN096czdPenM3T3p0eFFrTmFhVU1zVlVGQlZUczdjVUpCUlRkQ0xGVkJRVk1zVVVGQlVTeEZRVUZGTzBGQlEyaERMRlZCUVZFc1EwRkJReXhqUVVGakxFTkJRVU1zU1VGQlNTeEZRVUZGTEZWQlFWTXNWMEZCVnl4RlFVRkZMRTlCUVU4c1JVRkJSVHRCUVVNelJDeFJRVUZKTEd0Q1FVRlhMRmRCUVZjc1EwRkJReXhGUVVGRk8wRkJRVVVzYVVKQlFWY3NSMEZCUnl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzB0QlFVVTdPenM3TzBGQlMzUkZMRkZCUVVrc1FVRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4SlFVRkpMRU5CUVVNc1YwRkJWeXhKUVVGTExHVkJRVkVzVjBGQlZ5eERRVUZETEVWQlFVVTdRVUZEZGtVc1lVRkJUeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUXpsQ0xFMUJRVTA3UVVGRFRDeGhRVUZQTEU5QlFVOHNRMEZCUXl4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UzBGRGVrSTdSMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzVlVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4UlFVRlJMRVZCUVVVc1ZVRkJVeXhYUVVGWExFVkJRVVVzVDBGQlR5eEZRVUZGTzBGQlF5OUVMRmRCUVU4c1VVRkJVU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxGZEJRVmNzUlVGQlJTeEZRVUZETEVWQlFVVXNSVUZCUlN4UFFVRlBMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUlVGQlJTeFBRVUZQTEVOQlFVTXNSVUZCUlN4RlFVRkZMRWxCUVVrc1JVRkJSU3hQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZETEVOQlFVTXNRMEZCUXp0SFFVTjJTQ3hEUVVGRExFTkJRVU03UTBGRFNqczdPenM3T3pzN096dHhRa051UW1Nc1ZVRkJVeXhSUVVGUkxFVkJRVVU3UVVGRGFFTXNWVUZCVVN4RFFVRkRMR05CUVdNc1EwRkJReXhMUVVGTExFVkJRVVVzYTBOQlFXbERPMEZCUXpsRUxGRkJRVWtzU1VGQlNTeEhRVUZITEVOQlFVTXNVMEZCVXl4RFFVRkRPMUZCUTJ4Q0xFOUJRVThzUjBGQlJ5eFRRVUZUTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU01UXl4VFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NVMEZCVXl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZETjBNc1ZVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVONlFqczdRVUZGUkN4UlFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRFpDeFJRVUZKTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhKUVVGSkxFbEJRVWtzUlVGQlJUdEJRVU01UWl4WFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdTMEZETlVJc1RVRkJUU3hKUVVGSkxFOUJRVThzUTBGQlF5eEpRVUZKTEVsQlFVa3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFbEJRVWtzU1VGQlNTeEZRVUZGTzBGQlEzSkVMRmRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXp0TFFVTTFRanRCUVVORUxGRkJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNN08wRkJSV2hDTEZsQlFWRXNRMEZCUXl4SFFVRkhMRTFCUVVFc1EwRkJXaXhSUVVGUkxFVkJRVk1zU1VGQlNTeERRVUZETEVOQlFVTTdSMEZEZUVJc1EwRkJReXhEUVVGRE8wTkJRMG83T3pzN096czdPenM3Y1VKRGJFSmpMRlZCUVZNc1VVRkJVU3hGUVVGRk8wRkJRMmhETEZWQlFWRXNRMEZCUXl4alFVRmpMRU5CUVVNc1VVRkJVU3hGUVVGRkxGVkJRVk1zUjBGQlJ5eEZRVUZGTEV0QlFVc3NSVUZCUlR0QlFVTnlSQ3hYUVVGUExFZEJRVWNzU1VGQlNTeEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1IwRkRNVUlzUTBGQlF5eERRVUZETzBOQlEwbzdPenM3T3pzN096czdjVUpEU2poRkxGVkJRVlU3TzNGQ1FVVXhSU3hWUVVGVExGRkJRVkVzUlVGQlJUdEJRVU5vUXl4VlFVRlJMRU5CUVVNc1kwRkJZeXhEUVVGRExFMUJRVTBzUlVGQlJTeFZRVUZUTEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRla1FzVVVGQlNTeHJRa0ZCVnl4UFFVRlBMRU5CUVVNc1JVRkJSVHRCUVVGRkxHRkJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wdEJRVVU3TzBGQlJURkVMRkZCUVVrc1JVRkJSU3hIUVVGSExFOUJRVThzUTBGQlF5eEZRVUZGTEVOQlFVTTdPMEZCUlhCQ0xGRkJRVWtzUTBGQlF5eGxRVUZSTEU5QlFVOHNRMEZCUXl4RlFVRkZPMEZCUTNKQ0xGVkJRVWtzU1VGQlNTeEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkRlRUlzVlVGQlNTeFBRVUZQTEVOQlFVTXNTVUZCU1N4SlFVRkpMRTlCUVU4c1EwRkJReXhIUVVGSExFVkJRVVU3UVVGREwwSXNXVUZCU1N4SFFVRkhMRzFDUVVGWkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnFReXhaUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEhsQ1FVRnJRaXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NSVUZCUlN4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdUMEZEYUVZN08wRkJSVVFzWVVGQlR5eEZRVUZGTEVOQlFVTXNUMEZCVHl4RlFVRkZPMEZCUTJwQ0xGbEJRVWtzUlVGQlJTeEpRVUZKTzBGQlExWXNiVUpCUVZjc1JVRkJSU3h0UWtGQldTeERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRkZMRU5CUVVNc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0UFFVTm9SU3hEUVVGRExFTkJRVU03UzBGRFNpeE5RVUZOTzBGQlEwd3NZVUZCVHl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzB0QlF6bENPMGRCUTBZc1EwRkJReXhEUVVGRE8wTkJRMG83T3pzN096czdPenM3Y1VKRGRrSnhRaXhUUVVGVE96dEJRVVV2UWl4SlFVRkpMRTFCUVUwc1IwRkJSenRCUVVOWUxGZEJRVk1zUlVGQlJTeERRVUZETEU5QlFVOHNSVUZCUlN4TlFVRk5MRVZCUVVVc1RVRkJUU3hGUVVGRkxFOUJRVThzUTBGQlF6dEJRVU0zUXl4UFFVRkxMRVZCUVVVc1RVRkJUVHM3TzBGQlIySXNZVUZCVnl4RlFVRkZMSEZDUVVGVExFdEJRVXNzUlVGQlJUdEJRVU16UWl4UlFVRkpMRTlCUVU4c1MwRkJTeXhMUVVGTExGRkJRVkVzUlVGQlJUdEJRVU0zUWl4VlFVRkpMRkZCUVZFc1IwRkJSeXhsUVVGUkxFMUJRVTBzUTBGQlF5eFRRVUZUTEVWQlFVVXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRExFTkJRVU03UVVGRE9VUXNWVUZCU1N4UlFVRlJMRWxCUVVrc1EwRkJReXhGUVVGRk8wRkJRMnBDTEdGQlFVc3NSMEZCUnl4UlFVRlJMRU5CUVVNN1QwRkRiRUlzVFVGQlRUdEJRVU5NTEdGQlFVc3NSMEZCUnl4UlFVRlJMRU5CUVVNc1MwRkJTeXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzA5QlF6ZENPMHRCUTBZN08wRkJSVVFzVjBGQlR5eExRVUZMTEVOQlFVTTdSMEZEWkRzN08wRkJSMFFzUzBGQlJ5eEZRVUZGTEdGQlFWTXNTMEZCU3l4RlFVRmpPMEZCUXk5Q0xGTkJRVXNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE96dEJRVVZzUXl4UlFVRkpMRTlCUVU4c1QwRkJUeXhMUVVGTExGZEJRVmNzU1VGQlNTeE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeExRVUZMTEVWQlFVVTdRVUZETDBVc1ZVRkJTU3hOUVVGTkxFZEJRVWNzVFVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVOeVF5eFZRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRk96dEJRVU53UWl4alFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRE8wOUJRMmhDT3p0M1EwRlFiVUlzVDBGQlR6dEJRVUZRTEdWQlFVODdPenRCUVZFelFpeGhRVUZQTEVOQlFVTXNUVUZCVFN4UFFVRkRMRU5CUVdZc1QwRkJUeXhGUVVGWkxFOUJRVThzUTBGQlF5eERRVUZETzB0QlF6ZENPMGRCUTBZN1EwRkRSaXhEUVVGRE96dHhRa0ZGWVN4TlFVRk5PenM3T3pzN096czdPenR4UWtOcVEwNHNWVUZCVXl4VlFVRlZMRVZCUVVVN08wRkJSV3hETEUxQlFVa3NTVUZCU1N4SFFVRkhMRTlCUVU4c1RVRkJUU3hMUVVGTExGZEJRVmNzUjBGQlJ5eE5RVUZOTEVkQlFVY3NUVUZCVFR0TlFVTjBSQ3hYUVVGWExFZEJRVWNzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXpzN1FVRkZiRU1zV1VGQlZTeERRVUZETEZWQlFWVXNSMEZCUnl4WlFVRlhPMEZCUTJwRExGRkJRVWtzU1VGQlNTeERRVUZETEZWQlFWVXNTMEZCU3l4VlFVRlZMRVZCUVVVN1FVRkRiRU1zVlVGQlNTeERRVUZETEZWQlFWVXNSMEZCUnl4WFFVRlhMRU5CUVVNN1MwRkRMMEk3UVVGRFJDeFhRVUZQTEZWQlFWVXNRMEZCUXp0SFFVTnVRaXhEUVVGRE8wTkJRMGc3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdjVUpEV25OQ0xGTkJRVk03TzBsQlFYQkNMRXRCUVVzN08zbENRVU5MTEdGQlFXRTdPenM3YjBKQlF6aENMRkZCUVZFN08wRkJSV3hGTEZOQlFWTXNZVUZCWVN4RFFVRkRMRmxCUVZrc1JVRkJSVHRCUVVNeFF5eE5RVUZOTEdkQ1FVRm5RaXhIUVVGSExGbEJRVmtzU1VGQlNTeFpRVUZaTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJRenROUVVOMlJDeGxRVUZsTERCQ1FVRnZRaXhEUVVGRE96dEJRVVV4UXl4TlFVRkpMR2RDUVVGblFpeExRVUZMTEdWQlFXVXNSVUZCUlR0QlFVTjRReXhSUVVGSkxHZENRVUZuUWl4SFFVRkhMR1ZCUVdVc1JVRkJSVHRCUVVOMFF5eFZRVUZOTEdWQlFXVXNSMEZCUnl4MVFrRkJhVUlzWlVGQlpTeERRVUZETzFWQlEyNUVMR2RDUVVGblFpeEhRVUZITEhWQ1FVRnBRaXhuUWtGQlowSXNRMEZCUXl4RFFVRkRPMEZCUXpWRUxGbEJRVTBzTWtKQlFXTXNlVVpCUVhsR0xFZEJRM1pITEhGRVFVRnhSQ3hIUVVGSExHVkJRV1VzUjBGQlJ5eHRSRUZCYlVRc1IwRkJSeXhuUWtGQlowSXNSMEZCUnl4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVOb1N5eE5RVUZOT3p0QlFVVk1MRmxCUVUwc01rSkJRV01zZDBaQlFYZEdMRWRCUTNSSExHbEVRVUZwUkN4SFFVRkhMRmxCUVZrc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVTnVSanRIUVVOR08wTkJRMFk3TzBGQlJVMHNVMEZCVXl4UlFVRlJMRU5CUVVNc1dVRkJXU3hGUVVGRkxFZEJRVWNzUlVGQlJUczdRVUZGTVVNc1RVRkJTU3hEUVVGRExFZEJRVWNzUlVGQlJUdEJRVU5TTEZWQlFVMHNNa0pCUVdNc2JVTkJRVzFETEVOQlFVTXNRMEZCUXp0SFFVTXhSRHRCUVVORUxFMUJRVWtzUTBGQlF5eFpRVUZaTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hGUVVGRk8wRkJRM1pETEZWQlFVMHNNa0pCUVdNc01rSkJRVEpDTEVkQlFVY3NUMEZCVHl4WlFVRlpMRU5CUVVNc1EwRkJRenRIUVVONFJUczdRVUZGUkN4alFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RFFVRkRPenM3TzBGQlNXeEVMRXRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zWVVGQllTeERRVUZETEZsQlFWa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3UVVGRk5VTXNWMEZCVXl4dlFrRkJiMElzUTBGQlF5eFBRVUZQTEVWQlFVVXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSVHRCUVVOMlJDeFJRVUZKTEU5QlFVOHNRMEZCUXl4SlFVRkpMRVZCUVVVN1FVRkRhRUlzWVVGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1JVRkJSU3hGUVVGRkxFOUJRVThzUlVGQlJTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRiRVFzVlVGQlNTeFBRVUZQTEVOQlFVTXNSMEZCUnl4RlFVRkZPMEZCUTJZc1pVRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1QwRkRka0k3UzBGRFJqczdRVUZGUkN4WFFVRlBMRWRCUVVjc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eGpRVUZqTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNSRkxGRkJRVWtzVFVGQlRTeEhRVUZITEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNUMEZCVHl4RlFVRkZMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6czdRVUZGZUVVc1VVRkJTU3hOUVVGTkxFbEJRVWtzU1VGQlNTeEpRVUZKTEVkQlFVY3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRha01zWVVGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVVc1dVRkJXU3hEUVVGRExHVkJRV1VzUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTjZSaXhaUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNRMEZCUXl4RFFVRkRPMHRCUXpORU8wRkJRMFFzVVVGQlNTeE5RVUZOTEVsQlFVa3NTVUZCU1N4RlFVRkZPMEZCUTJ4Q0xGVkJRVWtzVDBGQlR5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTnNRaXhaUVVGSkxFdEJRVXNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJReTlDTEdGQlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eExRVUZMTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZETlVNc1kwRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJUdEJRVU0xUWl4clFrRkJUVHRYUVVOUU96dEJRVVZFTEdWQlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeEhRVUZITEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVOMFF6dEJRVU5FTEdOQlFVMHNSMEZCUnl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzA5QlF6TkNPMEZCUTBRc1lVRkJUeXhOUVVGTkxFTkJRVU03UzBGRFppeE5RVUZOTzBGQlEwd3NXVUZCVFN3eVFrRkJZeXhqUVVGakxFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NSMEZCUnl3d1JFRkJNRVFzUTBGQlF5eERRVUZETzB0QlEycElPMGRCUTBZN096dEJRVWRFTEUxQlFVa3NVMEZCVXl4SFFVRkhPMEZCUTJRc1ZVRkJUU3hGUVVGRkxHZENRVUZUTEVkQlFVY3NSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRNVUlzVlVGQlNTeEZRVUZGTEVsQlFVa3NTVUZCU1N4SFFVRkhMRU5CUVVFc1FVRkJReXhGUVVGRk8wRkJRMnhDTEdOQlFVMHNNa0pCUVdNc1IwRkJSeXhIUVVGSExFbEJRVWtzUjBGQlJ5eHRRa0ZCYlVJc1IwRkJSeXhIUVVGSExFTkJRVU1zUTBGQlF6dFBRVU0zUkR0QlFVTkVMR0ZCUVU4c1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzB0QlEyeENPMEZCUTBRc1ZVRkJUU3hGUVVGRkxHZENRVUZUTEUxQlFVMHNSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkROMElzVlVGQlRTeEhRVUZITEVkQlFVY3NUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVNeFFpeFhRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzUjBGQlJ5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMEZCUXpWQ0xGbEJRVWtzVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4SlFVRkpMRVZCUVVVN1FVRkRlRU1zYVVKQlFVOHNUVUZCVFN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFOQlEzaENPMDlCUTBZN1MwRkRSanRCUVVORUxGVkJRVTBzUlVGQlJTeG5Ra0ZCVXl4UFFVRlBMRVZCUVVVc1QwRkJUeXhGUVVGRk8wRkJRMnBETEdGQlFVOHNUMEZCVHl4UFFVRlBMRXRCUVVzc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRE8wdEJRM2hGT3p0QlFVVkVMRzlDUVVGblFpeEZRVUZGTEV0QlFVc3NRMEZCUXl4blFrRkJaMEk3UVVGRGVFTXNhVUpCUVdFc1JVRkJSU3h2UWtGQmIwSTdPMEZCUlc1RExFMUJRVVVzUlVGQlJTeFpRVUZUTEVOQlFVTXNSVUZCUlR0QlFVTmtMRlZCUVVrc1IwRkJSeXhIUVVGSExGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTXhRaXhUUVVGSExFTkJRVU1zVTBGQlV5eEhRVUZITEZsQlFWa3NRMEZCUXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGRrTXNZVUZCVHl4SFFVRkhMRU5CUVVNN1MwRkRXanM3UVVGRlJDeFpRVUZSTEVWQlFVVXNSVUZCUlR0QlFVTmFMRmRCUVU4c1JVRkJSU3hwUWtGQlV5eERRVUZETEVWQlFVVXNTVUZCU1N4RlFVRkZMRzFDUVVGdFFpeEZRVUZGTEZkQlFWY3NSVUZCUlN4TlFVRk5MRVZCUVVVN1FVRkRia1VzVlVGQlNTeGpRVUZqTEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU03VlVGRGFrTXNSVUZCUlN4SFFVRkhMRWxCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY0VJc1ZVRkJTU3hKUVVGSkxFbEJRVWtzVFVGQlRTeEpRVUZKTEZkQlFWY3NTVUZCU1N4dFFrRkJiVUlzUlVGQlJUdEJRVU40UkN4elFrRkJZeXhIUVVGSExGZEJRVmNzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVc1JVRkJSU3hKUVVGSkxFVkJRVVVzYlVKQlFXMUNMRVZCUVVVc1YwRkJWeXhGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzA5QlF6TkdMRTFCUVUwc1NVRkJTU3hEUVVGRExHTkJRV01zUlVGQlJUdEJRVU14UWl4elFrRkJZeXhIUVVGSExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVjc1YwRkJWeXhEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1QwRkRPVVE3UVVGRFJDeGhRVUZQTEdOQlFXTXNRMEZCUXp0TFFVTjJRanM3UVVGRlJDeFJRVUZKTEVWQlFVVXNZMEZCVXl4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRk8wRkJRek5DTEdGQlFVOHNTMEZCU3l4SlFVRkpMRXRCUVVzc1JVRkJSU3hGUVVGRk8wRkJRM1pDTEdGQlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRE8wOUJRM1pDTzBGQlEwUXNZVUZCVHl4TFFVRkxMRU5CUVVNN1MwRkRaRHRCUVVORUxGTkJRVXNzUlVGQlJTeGxRVUZUTEV0QlFVc3NSVUZCUlN4TlFVRk5MRVZCUVVVN1FVRkROMElzVlVGQlNTeEhRVUZITEVkQlFVY3NTMEZCU3l4SlFVRkpMRTFCUVUwc1EwRkJRenM3UVVGRk1VSXNWVUZCU1N4TFFVRkxMRWxCUVVrc1RVRkJUU3hKUVVGTExFdEJRVXNzUzBGQlN5eE5RVUZOTEVGQlFVTXNSVUZCUlR0QlFVTjZReXhYUVVGSExFZEJRVWNzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkZMRVZCUVVVc1RVRkJUU3hGUVVGRkxFdEJRVXNzUTBGQlF5eERRVUZETzA5QlEzWkRPenRCUVVWRUxHRkJRVThzUjBGQlJ5eERRVUZETzB0QlExbzdPMEZCUlVRc1VVRkJTU3hGUVVGRkxFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNTVUZCU1R0QlFVTnFRaXhuUWtGQldTeEZRVUZGTEZsQlFWa3NRMEZCUXl4UlFVRlJPMGRCUTNCRExFTkJRVU03TzBGQlJVWXNWMEZCVXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhGUVVGblFqdFJRVUZrTEU5QlFVOHNlVVJCUVVjc1JVRkJSVHM3UVVGRGFFTXNVVUZCU1N4SlFVRkpMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF6czdRVUZGZUVJc1QwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTndRaXhSUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEU5QlFVOHNTVUZCU1N4WlFVRlpMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRelZETEZWQlFVa3NSMEZCUnl4UlFVRlJMRU5CUVVNc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzB0QlEyaERPMEZCUTBRc1VVRkJTU3hOUVVGTkxGbEJRVUU3VVVGRFRpeFhRVUZYTEVkQlFVY3NXVUZCV1N4RFFVRkRMR05CUVdNc1IwRkJSeXhGUVVGRkxFZEJRVWNzVTBGQlV5eERRVUZETzBGQlF5OUVMRkZCUVVrc1dVRkJXU3hEUVVGRExGTkJRVk1zUlVGQlJUdEJRVU14UWl4VlFVRkpMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGJFSXNZMEZCVFN4SFFVRkhMRTlCUVU4c1NVRkJTU3hQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETzA5QlF6TkdMRTFCUVUwN1FVRkRUQ3hqUVVGTkxFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0UFFVTndRanRMUVVOR096dEJRVVZFTEdGQlFWTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1owSkJRV1U3UVVGRGJFTXNZVUZCVHl4RlFVRkZMRWRCUVVjc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVWQlFVVXNUMEZCVHl4RlFVRkZMRk5CUVZNc1EwRkJReXhQUVVGUExFVkJRVVVzVTBGQlV5eERRVUZETEZGQlFWRXNSVUZCUlN4SlFVRkpMRVZCUVVVc1YwRkJWeXhGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzB0QlEzSklPMEZCUTBRc1VVRkJTU3hIUVVGSExHbENRVUZwUWl4RFFVRkRMRmxCUVZrc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeEZRVUZGTEZOQlFWTXNSVUZCUlN4UFFVRlBMRU5CUVVNc1RVRkJUU3hKUVVGSkxFVkJRVVVzUlVGQlJTeEpRVUZKTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUVVNN1FVRkRkRWNzVjBGQlR5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wZEJReTlDTzBGQlEwUXNTMEZCUnl4RFFVRkRMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU03TzBGQlJXcENMRXRCUVVjc1EwRkJReXhOUVVGTkxFZEJRVWNzVlVGQlV5eFBRVUZQTEVWQlFVVTdRVUZETjBJc1VVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZEY0VJc1pVRkJVeXhEUVVGRExFOUJRVThzUjBGQlJ5eFRRVUZUTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhQUVVGUExFVkJRVVVzUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPenRCUVVWc1JTeFZRVUZKTEZsQlFWa3NRMEZCUXl4VlFVRlZMRVZCUVVVN1FVRkRNMElzYVVKQlFWTXNRMEZCUXl4UlFVRlJMRWRCUVVjc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RlFVRkZMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dFBRVU4wUlR0QlFVTkVMRlZCUVVrc1dVRkJXU3hEUVVGRExGVkJRVlVzU1VGQlNTeFpRVUZaTEVOQlFVTXNZVUZCWVN4RlFVRkZPMEZCUTNwRUxHbENRVUZUTEVOQlFVTXNWVUZCVlN4SFFVRkhMRk5CUVZNc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEZWQlFWVXNSVUZCUlN4SFFVRkhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03VDBGRE5VVTdTMEZEUml4TlFVRk5PMEZCUTB3c1pVRkJVeXhEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRPMEZCUTNCRExHVkJRVk1zUTBGQlF5eFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOMFF5eGxRVUZUTEVOQlFVTXNWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU03UzBGRE0wTTdSMEZEUml4RFFVRkRPenRCUVVWR0xFdEJRVWNzUTBGQlF5eE5RVUZOTEVkQlFVY3NWVUZCVXl4RFFVRkRMRVZCUVVVc1NVRkJTU3hGUVVGRkxGZEJRVmNzUlVGQlJTeE5RVUZOTEVWQlFVVTdRVUZEYkVRc1VVRkJTU3haUVVGWkxFTkJRVU1zWTBGQll5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZPMEZCUXk5RExGbEJRVTBzTWtKQlFXTXNkMEpCUVhkQ0xFTkJRVU1zUTBGQlF6dExRVU12UXp0QlFVTkVMRkZCUVVrc1dVRkJXU3hEUVVGRExGTkJRVk1zU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTnlReXhaUVVGTkxESkNRVUZqTEhsQ1FVRjVRaXhEUVVGRExFTkJRVU03UzBGRGFFUTdPMEZCUlVRc1YwRkJUeXhYUVVGWExFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTXNSVUZCUlN4WlFVRlpMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzU1VGQlNTeEZRVUZGTEVOQlFVTXNSVUZCUlN4WFFVRlhMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRVU03UjBGRGFrWXNRMEZCUXp0QlFVTkdMRk5CUVU4c1IwRkJSeXhEUVVGRE8wTkJRMW83TzBGQlJVMHNVMEZCVXl4WFFVRlhMRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTEVWQlFVVXNTVUZCU1N4RlFVRkZMRzFDUVVGdFFpeEZRVUZGTEZkQlFWY3NSVUZCUlN4TlFVRk5MRVZCUVVVN1FVRkROVVlzVjBGQlV5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRm5RanRSUVVGa0xFOUJRVThzZVVSQlFVY3NSVUZCUlRzN1FVRkRha01zVVVGQlNTeGhRVUZoTEVkQlFVY3NUVUZCVFN4RFFVRkRPMEZCUXpOQ0xGRkJRVWtzVFVGQlRTeEpRVUZKTEU5QlFVOHNTVUZCU1N4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVU3UVVGRGJFTXNiVUpCUVdFc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRMUVVNeFF6czdRVUZGUkN4WFFVRlBMRVZCUVVVc1EwRkJReXhUUVVGVExFVkJRMllzVDBGQlR5eEZRVU5RTEZOQlFWTXNRMEZCUXl4UFFVRlBMRVZCUVVVc1UwRkJVeXhEUVVGRExGRkJRVkVzUlVGRGNrTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1NVRkJTU3hKUVVGSkxFVkJRM0JDTEZkQlFWY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRVZCUTNoRUxHRkJRV0VzUTBGQlF5eERRVUZETzBkQlEzQkNPenRCUVVWRUxFMUJRVWtzUjBGQlJ5eHBRa0ZCYVVJc1EwRkJReXhGUVVGRkxFVkJRVVVzU1VGQlNTeEZRVUZGTEZOQlFWTXNSVUZCUlN4TlFVRk5MRVZCUVVVc1NVRkJTU3hGUVVGRkxGZEJRVmNzUTBGQlF5eERRVUZET3p0QlFVVjZSU3hOUVVGSkxFTkJRVU1zVDBGQlR5eEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTnFRaXhOUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEUxQlFVMHNSMEZCUnl4TlFVRk5MRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU40UXl4TlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExHMUNRVUZ0UWl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVNMVF5eFRRVUZQTEVsQlFVa3NRMEZCUXp0RFFVTmlPenRCUVVWTkxGTkJRVk1zWTBGQll5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVc1QwRkJUeXhGUVVGRk8wRkJRM2hFTEUxQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRXaXhSUVVGSkxFOUJRVThzUTBGQlF5eEpRVUZKTEV0QlFVc3NaMEpCUVdkQ0xFVkJRVVU3UVVGRGNrTXNWVUZCU1N4SlFVRkpMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU40UWl4aFFVRlBMRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU1zUzBGQlN5eEpRVUZKTEVWQlFVVTdRVUZEY2tNc1dVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdUMEZEY2tJN1FVRkRSQ3hoUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEdWQlFXVXNRMEZCUXl4RFFVRkRPMEZCUTJoRExGVkJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNN1MwRkRPVUlzVFVGQlRUdEJRVU5NTEdGQlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVTXhRenRIUVVOR0xFMUJRVTBzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGT3p0QlFVVjZReXhYUVVGUExFTkJRVU1zU1VGQlNTeEhRVUZITEU5QlFVOHNRMEZCUXp0QlFVTjJRaXhYUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRIUVVOeVF6dEJRVU5FTEZOQlFVOHNUMEZCVHl4RFFVRkRPME5CUTJoQ096dEJRVVZOTEZOQlFWTXNZVUZCWVN4RFFVRkRMRTlCUVU4c1JVRkJSU3hQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTzBGQlEzWkVMRk5CUVU4c1EwRkJReXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzWkNMRTFCUVVrc1QwRkJUeXhEUVVGRExFZEJRVWNzUlVGQlJUdEJRVU5tTEZkQlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTTdSMEZEZGtVN08wRkJSVVFzVFVGQlNTeFpRVUZaTEZsQlFVRXNRMEZCUXp0QlFVTnFRaXhOUVVGSkxFOUJRVThzUTBGQlF5eEZRVUZGTEVsQlFVa3NUMEZCVHl4RFFVRkRMRVZCUVVVc1MwRkJTeXhKUVVGSkxFVkJRVVU3UVVGRGNrTXNWMEZCVHl4RFFVRkRMRWxCUVVrc1IwRkJSeXhyUWtGQldTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRla01zWjBKQlFWa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF5eEhRVUZITEU5QlFVOHNRMEZCUXl4RlFVRkZMRU5CUVVNN08wRkJSVEZFTEZGQlFVa3NXVUZCV1N4RFFVRkRMRkZCUVZFc1JVRkJSVHRCUVVONlFpeGhRVUZQTEVOQlFVTXNVVUZCVVN4SFFVRkhMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTEU5QlFVOHNRMEZCUXl4UlFVRlJMRVZCUVVVc1dVRkJXU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzB0QlF6bEZPMGRCUTBZN08wRkJSVVFzVFVGQlNTeFBRVUZQTEV0QlFVc3NVMEZCVXl4SlFVRkpMRmxCUVZrc1JVRkJSVHRCUVVONlF5eFhRVUZQTEVkQlFVY3NXVUZCV1N4RFFVRkRPMGRCUTNoQ096dEJRVVZFTEUxQlFVa3NUMEZCVHl4TFFVRkxMRk5CUVZNc1JVRkJSVHRCUVVONlFpeFZRVUZOTERKQ1FVRmpMR05CUVdNc1IwRkJSeXhQUVVGUExFTkJRVU1zU1VGQlNTeEhRVUZITEhGQ1FVRnhRaXhEUVVGRExFTkJRVU03UjBGRE5VVXNUVUZCVFN4SlFVRkpMRTlCUVU4c1dVRkJXU3hSUVVGUkxFVkJRVVU3UVVGRGRFTXNWMEZCVHl4UFFVRlBMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZETzBkQlEyeERPME5CUTBZN08wRkJSVTBzVTBGQlV5eEpRVUZKTEVkQlFVYzdRVUZCUlN4VFFVRlBMRVZCUVVVc1EwRkJRenREUVVGRk96dEJRVVZ5UXl4VFFVRlRMRkZCUVZFc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlF5OUNMRTFCUVVrc1EwRkJReXhKUVVGSkxFbEJRVWtzUlVGQlJTeE5RVUZOTEVsQlFVa3NTVUZCU1N4RFFVRkJMRUZCUVVNc1JVRkJSVHRCUVVNNVFpeFJRVUZKTEVkQlFVY3NTVUZCU1N4SFFVRkhMR3RDUVVGWkxFbEJRVWtzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTnlReXhSUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEU5QlFVOHNRMEZCUXp0SFFVTnlRanRCUVVORUxGTkJRVThzU1VGQlNTeERRVUZETzBOQlEySTdPMEZCUlVRc1UwRkJVeXhwUWtGQmFVSXNRMEZCUXl4RlFVRkZMRVZCUVVVc1NVRkJTU3hGUVVGRkxGTkJRVk1zUlVGQlJTeE5RVUZOTEVWQlFVVXNTVUZCU1N4RlFVRkZMRmRCUVZjc1JVRkJSVHRCUVVONlJTeE5RVUZKTEVWQlFVVXNRMEZCUXl4VFFVRlRMRVZCUVVVN1FVRkRhRUlzVVVGQlNTeExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJZc1VVRkJTU3hIUVVGSExFVkJRVVVzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RlFVRkZMRXRCUVVzc1JVRkJSU3hUUVVGVExFVkJRVVVzVFVGQlRTeEpRVUZKTEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzVjBGQlZ5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpWR0xGTkJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RlFVRkZMRXRCUVVzc1EwRkJReXhEUVVGRE8wZEJRek5DTzBGQlEwUXNVMEZCVHl4SlFVRkpMRU5CUVVNN1EwRkRZanM3T3pzN096czdRVU5vVWtRc1UwRkJVeXhWUVVGVkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlF6RkNMRTFCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzVFVGQlRTeERRVUZETzBOQlEzUkNPenRCUVVWRUxGVkJRVlVzUTBGQlF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4SFFVRkhMRlZCUVZVc1EwRkJReXhUUVVGVExFTkJRVU1zVFVGQlRTeEhRVUZITEZsQlFWYzdRVUZEZGtVc1UwRkJUeXhGUVVGRkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0RFFVTjZRaXhEUVVGRE96dHhRa0ZGWVN4VlFVRlZPenM3T3pzN096czdPenM3T3pzN1FVTlVla0lzU1VGQlRTeE5RVUZOTEVkQlFVYzdRVUZEWWl4TFFVRkhMRVZCUVVVc1QwRkJUenRCUVVOYUxFdEJRVWNzUlVGQlJTeE5RVUZOTzBGQlExZ3NTMEZCUnl4RlFVRkZMRTFCUVUwN1FVRkRXQ3hMUVVGSExFVkJRVVVzVVVGQlVUdEJRVU5pTEV0QlFVY3NSVUZCUlN4UlFVRlJPMEZCUTJJc1MwRkJSeXhGUVVGRkxGRkJRVkU3UVVGRFlpeExRVUZITEVWQlFVVXNVVUZCVVR0RFFVTmtMRU5CUVVNN08wRkJSVVlzU1VGQlRTeFJRVUZSTEVkQlFVY3NXVUZCV1R0SlFVTjJRaXhSUVVGUkxFZEJRVWNzVjBGQlZ5eERRVUZET3p0QlFVVTNRaXhUUVVGVExGVkJRVlVzUTBGQlF5eEhRVUZITEVWQlFVVTdRVUZEZGtJc1UwRkJUeXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdRMEZEY0VJN08wRkJSVTBzVTBGQlV5eE5RVUZOTEVOQlFVTXNSMEZCUnl4dlFrRkJiVUk3UVVGRE0wTXNUMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEZOQlFWTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVU3UVVGRGVrTXNVMEZCU3l4SlFVRkpMRWRCUVVjc1NVRkJTU3hUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVTdRVUZETlVJc1ZVRkJTU3hOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEdOQlFXTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUXpORUxGZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdUMEZET1VJN1MwRkRSanRIUVVOR096dEJRVVZFTEZOQlFVOHNSMEZCUnl4RFFVRkRPME5CUTFvN08wRkJSVTBzU1VGQlNTeFJRVUZSTEVkQlFVY3NUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU03T3pzN096dEJRVXRvUkN4SlFVRkpMRlZCUVZVc1IwRkJSeXh2UWtGQlV5eExRVUZMTEVWQlFVVTdRVUZETDBJc1UwRkJUeXhQUVVGUExFdEJRVXNzUzBGQlN5eFZRVUZWTEVOQlFVTTdRMEZEY0VNc1EwRkJRenM3TzBGQlIwWXNTVUZCU1N4VlFVRlZMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVVU3UVVGRGJrSXNWVUZKVFN4VlFVRlZMRWRCU21oQ0xGVkJRVlVzUjBGQlJ5eFZRVUZUTEV0QlFVc3NSVUZCUlR0QlFVTXpRaXhYUVVGUExFOUJRVThzUzBGQlN5eExRVUZMTEZWQlFWVXNTVUZCU1N4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTEcxQ1FVRnRRaXhEUVVGRE8wZEJRM0JHTEVOQlFVTTdRMEZEU0R0UlFVTlBMRlZCUVZVc1IwRkJWaXhWUVVGVk96czdPenRCUVVsWUxFbEJRVTBzVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXl4UFFVRlBMRWxCUVVrc1ZVRkJVeXhMUVVGTExFVkJRVVU3UVVGRGRFUXNVMEZCVHl4QlFVRkRMRXRCUVVzc1NVRkJTU3hQUVVGUExFdEJRVXNzUzBGQlN5eFJRVUZSTEVkQlFVa3NVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eG5Ra0ZCWjBJc1IwRkJSeXhMUVVGTExFTkJRVU03UTBGRGFrY3NRMEZCUXpzN096czdRVUZIU3l4VFFVRlRMRTlCUVU4c1EwRkJReXhMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZGTzBGQlEzQkRMRTlCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVkQlFVY3NSMEZCUnl4TFFVRkxMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVN1FVRkRhRVFzVVVGQlNTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRXRCUVVzc1MwRkJTeXhGUVVGRk8wRkJRM1JDTEdGQlFVOHNRMEZCUXl4RFFVRkRPMHRCUTFZN1IwRkRSanRCUVVORUxGTkJRVThzUTBGQlF5eERRVUZETEVOQlFVTTdRMEZEV0RzN1FVRkhUU3hUUVVGVExHZENRVUZuUWl4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVOMlF5eE5RVUZKTEU5QlFVOHNUVUZCVFN4TFFVRkxMRkZCUVZFc1JVRkJSVHM3UVVGRk9VSXNVVUZCU1N4TlFVRk5MRWxCUVVrc1RVRkJUU3hEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU16UWl4aFFVRlBMRTFCUVUwc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF6dExRVU40UWl4TlFVRk5MRWxCUVVrc1RVRkJUU3hKUVVGSkxFbEJRVWtzUlVGQlJUdEJRVU42UWl4aFFVRlBMRVZCUVVVc1EwRkJRenRMUVVOWUxFMUJRVTBzU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTnNRaXhoUVVGUExFMUJRVTBzUjBGQlJ5eEZRVUZGTEVOQlFVTTdTMEZEY0VJN096czdPMEZCUzBRc1ZVRkJUU3hIUVVGSExFVkJRVVVzUjBGQlJ5eE5RVUZOTEVOQlFVTTdSMEZEZEVJN08wRkJSVVFzVFVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVU3UVVGQlJTeFhRVUZQTEUxQlFVMHNRMEZCUXp0SFFVRkZPMEZCUXpsRExGTkJRVThzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4UlFVRlJMRVZCUVVVc1ZVRkJWU3hEUVVGRExFTkJRVU03UTBGRE4wTTdPMEZCUlUwc1UwRkJVeXhQUVVGUExFTkJRVU1zUzBGQlN5eEZRVUZGTzBGQlF6ZENMRTFCUVVrc1EwRkJReXhMUVVGTExFbEJRVWtzUzBGQlN5eExRVUZMTEVOQlFVTXNSVUZCUlR0QlFVTjZRaXhYUVVGUExFbEJRVWtzUTBGQlF6dEhRVU5pTEUxQlFVMHNTVUZCU1N4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUzBGQlN5eERRVUZETEUxQlFVMHNTMEZCU3l4RFFVRkRMRVZCUVVVN1FVRkRMME1zVjBGQlR5eEpRVUZKTEVOQlFVTTdSMEZEWWl4TlFVRk5PMEZCUTB3c1YwRkJUeXhMUVVGTExFTkJRVU03UjBGRFpEdERRVU5HT3p0QlFVVk5MRk5CUVZNc1YwRkJWeXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5zUXl4TlFVRkpMRXRCUVVzc1IwRkJSeXhOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXk5Q0xFOUJRVXNzUTBGQlF5eFBRVUZQTEVkQlFVY3NUVUZCVFN4RFFVRkRPMEZCUTNaQ0xGTkJRVThzUzBGQlN5eERRVUZETzBOQlEyUTdPMEZCUlUwc1UwRkJVeXhYUVVGWExFTkJRVU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NSVUZCUlR0QlFVTjJReXhSUVVGTkxFTkJRVU1zU1VGQlNTeEhRVUZITEVkQlFVY3NRMEZCUXp0QlFVTnNRaXhUUVVGUExFMUJRVTBzUTBGQlF6dERRVU5tT3p0QlFVVk5MRk5CUVZNc2FVSkJRV2xDTEVOQlFVTXNWMEZCVnl4RlFVRkZMRVZCUVVVc1JVRkJSVHRCUVVOcVJDeFRRVUZQTEVOQlFVTXNWMEZCVnl4SFFVRkhMRmRCUVZjc1IwRkJSeXhIUVVGSExFZEJRVWNzUlVGQlJTeERRVUZCTEVkQlFVa3NSVUZCUlN4RFFVRkRPME5CUTNCRU96czdPMEZETTBkRU8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlEwaEJPMEZCUTBFaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWhtZFc1amRHbHZiaUJsS0hRc2JpeHlLWHRtZFc1amRHbHZiaUJ6S0c4c2RTbDdhV1lvSVc1YmIxMHBlMmxtS0NGMFcyOWRLWHQyWVhJZ1lUMTBlWEJsYjJZZ2NtVnhkV2x5WlQwOVhDSm1kVzVqZEdsdmJsd2lKaVp5WlhGMWFYSmxPMmxtS0NGMUppWmhLWEpsZEhWeWJpQmhLRzhzSVRBcE8ybG1LR2twY21WMGRYSnVJR2tvYnl3aE1DazdkbUZ5SUdZOWJtVjNJRVZ5Y205eUtGd2lRMkZ1Ym05MElHWnBibVFnYlc5a2RXeGxJQ2RjSWl0dksxd2lKMXdpS1R0MGFISnZkeUJtTG1OdlpHVTlYQ0pOVDBSVlRFVmZUazlVWDBaUFZVNUVYQ0lzWm4xMllYSWdiRDF1VzI5ZFBYdGxlSEJ2Y25Sek9udDlmVHQwVzI5ZFd6QmRMbU5oYkd3b2JDNWxlSEJ2Y25SekxHWjFibU4wYVc5dUtHVXBlM1poY2lCdVBYUmJiMTFiTVYxYlpWMDdjbVYwZFhKdUlITW9iajl1T21VcGZTeHNMR3d1Wlhod2IzSjBjeXhsTEhRc2JpeHlLWDF5WlhSMWNtNGdibHR2WFM1bGVIQnZjblJ6ZlhaaGNpQnBQWFI1Y0dWdlppQnlaWEYxYVhKbFBUMWNJbVoxYm1OMGFXOXVYQ0ltSm5KbGNYVnBjbVU3Wm05eUtIWmhjaUJ2UFRBN2J6eHlMbXhsYm1kMGFEdHZLeXNwY3loeVcyOWRLVHR5WlhSMWNtNGdjMzBwSWl3aWRtRnlJRzF2WkhWc1pVNWhkaUE5SUhKbGNYVnBjbVVvSnk0dmJXOWtkV3hsY3k5dVlYWW5LVHRjYmx4dWRtRnlJRzF2WkhWc1pVVjRjR1Z5YVdWdVkyVWdQU0J5WlhGMWFYSmxLQ2N1TDIxdlpIVnNaWE12Wlhod1pYSnBaVzVqWlNjcE8xeHVYRzUyWVhJZ2JXOWtkV3hsVjI5eWEzTWdQU0J5WlhGMWFYSmxLQ2N1TDIxdlpIVnNaWE12ZDI5eWEzTW5LVHRjYmx4dWRtRnlJRzF2WkhWc1pWTjVjM1JsYlNBOUlISmxjWFZwY21Vb0p5NHZiVzlrZFd4bGN5OWhZbTkxZEMxemVYTjBaVzBuS1R0Y2JseHVkbUZ5SUcxdlpIVnNaVkJoWjJWQ1lYTnBZeUE5SUhKbGNYVnBjbVVvSnk0dmJXOWtkV3hsY3k5aVlYTnBZeWNwTzF4dVhHNTJZWElnYlc5a2RXeGxSbUYyYVdOdmJpQTlJSEpsY1hWcGNtVW9KeTR2Ylc5a2RXeGxjeTltWVhacFkyOXVKeWs3WEc1Y2JpOHFYRzdwcHBicG9iWGxwTFRsZzQ5Y2JpQXFMMXh1Ylc5a2RXeGxSbUYyYVdOdmJpNXlaVzVrWlhJb0pDUW9YQ0lqYW5NdGNHRm5aUzFqYjI1MFpXNTBYQ0lwS1R0Y2JtMTVRWEJ3TG05dVVHRm5aVWx1YVhRb0oyaHZiV1VuTENCbWRXNWpkR2x2Ymlod1lXZGxLU0I3WEc0Z0lDQWdiVzlrZFd4bFJtRjJhV052Ymk1eVpXNWtaWElvSkNRb1hDSWphbk10Y0dGblpTMWpiMjUwWlc1MFhDSXBLVHRjYm4wcE8xeHVYRzR2S2x4dTVhKzg2SWlxWEc0Z0tpOWNibTF2WkhWc1pVNWhkaTV5Wlc1a1pYSW9LVHRjYmx4dUx5cGNidVdmdXVhY3JPUy9vZWFCcjF4dUlDb3ZYRzV0YjJSMWJHVlFZV2RsUW1GemFXTXVjbVZ1WkdWeUtDazdYRzVjYmk4cVhHN21uS3prdXJybnU0L2xqb1pjYmlBcUwxeHViVzlrZFd4bFJYaHdaWEpwWlc1alpTNXlaVzVrWlhJb0tUdGNibHh1THlwY2J1UzluT1dUZ2VTL29lYUJyMXh1SUNvdlhHNXRiMlIxYkdWWGIzSnJjeTV5Wlc1a1pYSW9LVHRjYmx4dUx5cGNidVdGcytTNmp1YWNyT2V6dStlN24xeHVJQ292WEc1dGIyUjFiR1ZUZVhOMFpXMHVjbVZ1WkdWeUtDazdYRzRpTENKMllYSWdZbXh2WTJ0RGIyNTBaVzUwVkdWdGNDQTlJSEpsY1hWcGNtVW9KeTR1TDNCMVlteHBZeTlpYkc5amF5MWpiMjUwWlc1MExtaGljeWNwTzF4dVhHNTJZWElnWW14dlkydEVZWFJoSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2YzJWeWRtbGpaUzlpYkc5amF5Y3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUh0Y2JpQWdJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnVVM1UWNtOXRhWE5sS0daMWJtTjBhVzl1S0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZbXh2WTJ0RVlYUmhMbWRsZEVGaWIzVjBVM2x6ZEdWdEtDa3VkR2hsYmlobWRXNWpkR2x2Ymloa1lYUmhLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSkNRb1hDSWphbk10Y0dGdVpXd3RiR1ZtZEZ3aUtTNWhjSEJsYm1Rb1lteHZZMnREYjI1MFpXNTBWR1Z0Y0Noa1lYUmhLU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdZbXh2WTJ0RVlYUmhMbWRsZEVsdVpHVjRSR0YwWVNncExuUm9aVzRvWm5WdVkzUnBiMjRvWkdGMFlTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1FrS0Z3aUkycHpMWEJoWjJVdFkyOXVkR1Z1ZEZ3aUtTNWhjSEJsYm1Rb1lteHZZMnREYjI1MFpXNTBWR1Z0Y0Noa1lYUmhLU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdiWGxCY0hBdWIyNVFZV2RsU1c1cGRDZ25hRzl0WlNjc0lHWjFibU4wYVc5dUtIQmhaMlVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCaWJHOWphMFJoZEdFdVoyVjBTVzVrWlhoRVlYUmhLQ2t1ZEdobGJpaG1kVzVqZEdsdmJpaGtZWFJoS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1FrS0Z3aUkycHpMWEJoWjJVdFkyOXVkR1Z1ZEZ3aUtTNWhjSEJsYm1Rb1lteHZZMnREYjI1MFpXNTBWR1Z0Y0Noa1lYUmhLU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemIyeDJaU2dwTzF4dUlDQWdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNTlPMXh1SWl3aWRtRnlJR0poYzJsaklEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dmMyVnlkbWxqWlM5aVlYTnBZeWNwTzF4dVhHNTJZWElnWW1GemFXTlVaVzF3SUQwZ2NtVnhkV2x5WlNnbkxpNHZjSFZpYkdsakwySnNiMk5yTFd4cGMzUXVhR0p6SnlrN1hHNWNiblpoY2lCdGIyUjFiR1ZHWVhacFkyOXVJRDBnY21WeGRXbHlaU2duTGk0dlptRjJhV052YmljcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSHRjYmlBZ0lDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdVUzVRY205dGFYTmxLR1oxYm1OMGFXOXVLSEpsYzI5c2RtVXNJSEpsYW1WamRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JYbEJjSEF1YjI1UVlXZGxTVzVwZENnblltRnphV01uTENCbWRXNWpkR2x2Ymlod1lXZGxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWW1GemFXTXVaMlYwVEdsemRFRnNiQ2dwTG5Sb1pXNG9ablZ1WTNScGIyNG9aR0YwWVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FrSkNnbkkycHpMV0poYzJsakxXSnZlQ2NwTG1Gd2NHVnVaQ2hpWVhOcFkxUmxiWEFvWkdGMFlTa3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5cGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDRGxuN3Jtbkt6b3RZVG1scG5scExUbGc0OWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdLaTljYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J0YjJSMWJHVkdZWFpwWTI5dUxuSmxibVJsY2lna0pDZ25JMnB6TFdKaGMybGpMV0p2ZUNjcEtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0NrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNibjA3WEc0aUxDSjJZWElnZDI5eWExTmxjblpwWTJVZ1BTQnlaWEYxYVhKbEtDY3VMaTh1TGk5elpYSjJhV05sTDNkdmNtdHpKeWs3WEc1Y2JuWmhjaUIzYjNKcmMweHBjM1JVWlcxd0lEMGdjbVZ4ZFdseVpTZ25MaTR2Y0hWaWJHbGpMM2R2Y210ekxXeHBjM1F1YUdKekp5azdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnZTF4dUlDQWdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJSTGxCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU3dnY21WcVpXTjBLU0I3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzhxNTd1UDVZNkc1NXU0NVlXejVMMmM1Wk9CS2k5Y2JpQWdJQ0FnSUNBZ0lDQWdJRzE1UVhCd0xtOXVVR0ZuWlVsdWFYUW9KMlY0Y0dWeWFXVnVZMlV0ZDI5eWF5Y3NJR1oxYm1OMGFXOXVLSEJoWjJVcElIdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCMGVYQmxWbUZzSUQwZ2NHRm5aUzV4ZFdWeWVTNTBlWEJsTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2QyOXlhMU5sY25acFkyVXVaMlYwVEdsemRFSjVWSGx3WlNoMGVYQmxWbUZzS1M1MGFHVnVLR1oxYm1OMGFXOXVLR1JoZEdFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlIZHZjbXRRYjNCMWNGUnBkR3hsSUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hDSXlNREV5WENJNklGd2lNakF4TXVXNXRIN29oN1BrdTRvZzU1cUU1TDJjNVpPQlhDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmNJakl3TURkY0lqb2dYQ0l5TURBMzVibTBmakl3TVRMbHViUWc1NXFFNUwyYzVaT0JYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjSWpJd01EUmNJam9nWENJeU1EQTA1Ym0wZmpJd01EZmx1YlFnNTVxRTVMMmM1Wk9CWENKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pDUW9YQ0l1YW1sdVoyeHBMWGR2Y210ekxYUnBkR3hsWENJcExtaDBiV3dvZDI5eWExQnZjSFZ3VkdsMGJHVmJkSGx3WlZaaGJGMHBPMXh1WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKQ1FvWENJdWQyOXlhM010YkdsemRDMWliM2hjSWlsY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM1b2RHMXNLSGR2Y210elRHbHpkRlJsYlhBb1pHRjBZU2twWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F1Wm1sdVpDZ25MbXB6TFdOaGNtUW5LVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMbUZrWkVOc1lYTnpLQ2R6ZDJsd1pYSXRjMnhwWkdVbktWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xtWnBibVFvWENJdWMzZHBjR1Z5TFd4aGVubGNJaWxjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzVoY0hCbGJtUW9KenhrYVhZZ1kyeGhjM005WENKd2NtVnNiMkZrWlhKY0lqNDhMMlJwZGo0bktUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdGVVRndjQzVwYm1sMFNXMWhaMlZ6VEdGNmVVeHZZV1FvSnk1d1lXZGxKeWs3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiWGxCY0hBdWMzZHBjR1Z5S0NjdWMzZHBjR1Z5TFdOdmJuUmhhVzVsY2ljc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIQnlaV3h2WVdSSmJXRm5aWE02SUdaaGJITmxMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiR0Y2ZVV4dllXUnBibWM2SUhSeWRXVXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQndZV2RwYm1GMGFXOXVPaUFuTG5OM2FYQmxjaTF3WVdkcGJtRjBhVzl1Snl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklHVm1abVZqZERvZ0oyTnZkbVZ5Wm14dmR5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpiR2xrWlhOUVpYSldhV1YzT2lBbllYVjBieWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JqWlc1MFpYSmxaRk5zYVdSbGN6b2dkSEoxWlZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmx4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1FrS0NjdWMyaHZkeTF3YUc5MGJ5Y3BMbTl1S0NkamJHbGpheWNzSUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJQ1FrZEdocGN5QTlJQ1FrS0hSb2FYTXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IzYjNKclUyVnlkbWxqWlM1blpYUkNlVWxrS0NRa2RHaHBjeTVoZEhSeUtGd2laR0YwWVMxcFpGd2lLU2t1ZEdobGJpaG1kVzVqZEdsdmJpaGtZWFJoS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiWGxCY0hBdWNHaHZkRzlDY205M2MyVnlLSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjR2h2ZEc5ek9pQmtZWFJoTG14cGMzUXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHeGhlbmxNYjJGa2FXNW5PaUIwY25WbExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHVnRaVG9nSjJSaGNtc25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmlZV05yVEdsdWExUmxlSFE2SUNmb3Y1VGxtNTRuWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTa3ViM0JsYmlncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxjMjlzZG1Vb0tUdGNiaUFnSUNBZ0lDQWdmU2s3WEc0Z0lDQWdmVnh1ZlR0Y2JpSXNJblpoY2lCdGIyUjFiR1ZGZUhCbGNtbGxibU5sVjI5eWEzTWdQU0J5WlhGMWFYSmxLQ2N1TGk5bGVIQmxjbWxsYm1ObExYZHZjbXR6SnlrN1hHNWNiblpoY2lCaVlXbHJaVk4xYlcxaGNubEVZWFJoSUQwZ2NtVnhkV2x5WlNnbkxpNHZMaTR2YzJWeWRtbGpaUzlpWVdsclpTMXpkVzF0WVhKNUp5azdYRzVjYm5aaGNpQjBZV0pPWVhaVVpXMXdJRDBnY21WeGRXbHlaU2hjSWk0dmRHRmlMVzVoZGk1b1luTmNJaWs3WEc1MllYSWdkR0ZpUTI5dWRHVnVkRlJsYlhBZ1BTQnlaWEYxYVhKbEtGd2lMaTkwWVdJdFkyOXVkR1Z1ZEM1b1luTmNJaWs3WEc1Y2JuWmhjaUJsZUhCbGNtbGxibU5sUkdGMFlTQTlJSEpsY1hWcGNtVW9YQ0l1TGk4dUxpOXpaWEoyYVdObEwyVjRjR1Z5YVdWdVkyVmNJaWs3WEc1Y2JuWmhjaUJJWVc1a2JHVmlZWEp6SUQwZ2NtVnhkV2x5WlNoY0ltaGljMlo1TDNKMWJuUnBiV1ZjSWlrN1hHNWNia2hoYm1Sc1pXSmhjbk11Y21WbmFYTjBaWEpJWld4d1pYSW9YQ0poWkdSUGJtVmNJaXdnWm5WdVkzUnBiMjRvYVc1a1pYZ3BJSHRjYmx4dUlDQWdJSEpsZEhWeWJpQnBibVJsZUNBcklERTdYRzU5S1R0Y2JseHVTR0Z1Wkd4bFltRnljeTV5WldkcGMzUmxja2hsYkhCbGNpaGNJbUZrWkVGamRHbDJaVndpTENCbWRXNWpkR2x2YmlocGJtUmxlQ2tnZTF4dVhHNGdJQ0FnYVdZZ0tHbHVaR1Y0SUQwOUlEQXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRndpWVdOMGFYWmxYQ0k3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCY0lsd2lPMXh1ZlNrN1hHNWNia2hoYm1Sc1pXSmhjbk11Y21WbmFYTjBaWEpJWld4d1pYSW9YQ0poWkdSUGRHaGxja2h5WldaY0lpd2dablZ1WTNScGIyNG9kSGx3WlNrZ2UxeHVJQ0FnSUdsbUlDaDBlWEJsSUQwOUlDY3lNREV5SnlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z0p6eHdQanhoSUdoeVpXWTlYQ0lqWENJZ1kyeGhjM005WENKaWRYUjBiMjRnWW1GcGEyVXRjM1Z0YldGeWVWd2lQdWVadnVlbmtlVzV0T1c2cHVXM3BlUzluT2FBdStlN2t6d3ZZVDQ4TDNBK0p6dGNiaUFnSUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCN1hHNGdJQ0FnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUZFdVVISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsTENCeVpXcGxZM1FwSUh0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHlybm1iN25wNUhsdWJUbHVxYm1nTHZudTVNcUwxeHVJQ0FnSUNBZ0lDQWdJQ0FnYlhsQmNIQXViMjVRWVdkbFNXNXBkQ2duWlhod1pYSnBaVzVqWlNjc0lHWjFibU4wYVc5dUtIQmhaMlVwSUh0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVjRjR1Z5YVdWdVkyVkVZWFJoTG1kbGRFeHBjM1JVYVhSc1pTZ3BMblJvWlc0b1puVnVZM1JwYjI0b1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtKQ2hjSWlOcWN5MTBZV0l0Ym1GMlhDSXBMbWgwYld3b2RHRmlUbUYyVkdWdGNDaGtZWFJoS1NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JsZUhCbGNtbGxibU5sUkdGMFlTNW5aWFJNYVhOMFFXeHNLQ2t1ZEdobGJpaG1kVzVqZEdsdmJpaGtZWFJoS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1FrS0Z3aUkycHpMWFJoWWkxamIyNTBaVzUwWENJcExtaDBiV3dvZEdGaVEyOXVkR1Z1ZEZSbGJYQW9aR0YwWVNrcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCdGVVRndjQzVwYm1sMFVHRm5aVk4zYVhCbGNpZ25MbkJoWjJVbktUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBa0pDZ25MbUpoYVd0bExYTjFiVzFoY25rbktTNXZiaWduWTJ4cFkyc25MQ0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUcxNVFYQndMbkJvYjNSdlFuSnZkM05sY2loN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjR2h2ZEc5ek9pQmlZV2xyWlZOMWJXMWhjbmxFWVhSaExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR3hoZW5sTWIyRmthVzVuT2lCMGNuVmxMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSb1pXMWxPaUFuWkdGeWF5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWW1GamEweHBibXRVWlhoME9pQW42TCtVNVp1ZUoxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTa3ViM0JsYmlncE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUcxdlpIVnNaVVY0Y0dWeWFXVnVZMlZYYjNKcmN5NXlaVzVrWlhJb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGMyOXNkbVVvS1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzVjYmx4dUlDQWdJSDFjYm4wN1hHNGlMQ0l2THlCb1luTm1lU0JqYjIxd2FXeGxaQ0JJWVc1a2JHVmlZWEp6SUhSbGJYQnNZWFJsWEc1MllYSWdTR0Z1Wkd4bFltRnljME52YlhCcGJHVnlJRDBnY21WeGRXbHlaU2duYUdKelpua3ZjblZ1ZEdsdFpTY3BPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JJWVc1a2JHVmlZWEp6UTI5dGNHbHNaWEl1ZEdWdGNHeGhkR1VvZTF3aU1Wd2lPbVoxYm1OMGFXOXVLR052Ym5SaGFXNWxjaXhrWlhCMGFEQXNhR1ZzY0dWeWN5eHdZWEowYVdGc2N5eGtZWFJoS1NCN1hHNGdJQ0FnZG1GeUlITjBZV05yTVN3Z2FHVnNjR1Z5TENCaGJHbGhjekU5WkdWd2RHZ3dJQ0U5SUc1MWJHd2dQeUJrWlhCMGFEQWdPaUI3ZlN3Z1lXeHBZWE15UFdobGJIQmxjbk11YUdWc2NHVnlUV2x6YzJsdVp5d2dZV3hwWVhNelBXTnZiblJoYVc1bGNpNWxjMk5oY0dWRmVIQnlaWE56YVc5dUxDQmhiR2xoY3pROVhDSm1kVzVqZEdsdmJsd2lPMXh1WEc0Z0lISmxkSFZ5YmlCY0lqeGthWFlnYVdROVhGeGNJblJoWWx3aVhHNGdJQ0FnS3lCaGJHbGhjek1vS0dobGJIQmxjbk11WVdSa1QyNWxJSHg4SUNoa1pYQjBhREFnSmlZZ1pHVndkR2d3TG1Ga1pFOXVaU2tnZkh3Z1lXeHBZWE15S1M1allXeHNLR0ZzYVdGek1Td29aR0YwWVNBbUppQmtZWFJoTG1sdVpHVjRLU3g3WENKdVlXMWxYQ0k2WENKaFpHUlBibVZjSWl4Y0ltaGhjMmhjSWpwN2ZTeGNJbVJoZEdGY0lqcGtZWFJoZlNrcFhHNGdJQ0FnS3lCY0lseGNYQ0lnWTJ4aGMzTTlYRnhjSW5CaFoyVXRZMjl1ZEdWdWRDQjBZV0lnWENKY2JpQWdJQ0FySUdGc2FXRnpNeWdvYUdWc2NHVnljeTVoWkdSQlkzUnBkbVVnZkh3Z0tHUmxjSFJvTUNBbUppQmtaWEIwYURBdVlXUmtRV04wYVhabEtTQjhmQ0JoYkdsaGN6SXBMbU5oYkd3b1lXeHBZWE14TENoa1lYUmhJQ1ltSUdSaGRHRXVhVzVrWlhncExIdGNJbTVoYldWY0lqcGNJbUZrWkVGamRHbDJaVndpTEZ3aWFHRnphRndpT250OUxGd2laR0YwWVZ3aU9tUmhkR0Y5S1NsY2JpQWdJQ0FySUZ3aVhGeGNJajVjWEc0Z0lDQWdQR1JwZGlCamJHRnpjejFjWEZ3aVkyOXVkR1Z1ZEMxaWJHOWphMXhjWENJK1hGeHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKamIyNTBaVzUwTFdKc2IyTnJMWFJwZEd4bFhGeGNJajVjSWx4dUlDQWdJQ3NnWVd4cFlYTXpLR052Ym5SaGFXNWxjaTVzWVcxaVpHRW9LR1JsY0hSb01DQWhQU0J1ZFd4c0lEOGdaR1Z3ZEdnd0xtTnZiWEJ2Ym5rZ09pQmtaWEIwYURBcExDQmtaWEIwYURBcEtWeHVJQ0FnSUNzZ1hDSThMMlJwZGo1Y1hHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYRnhjSW1OaGNtUmNYRndpUGx4Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WEZ4Y0ltTmhjbVF0WTI5dWRHVnVkRnhjWENJK1hGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYRnhjSW1OaGNtUXRZMjl1ZEdWdWRDMXBibTVsY2x4Y1hDSStYRnh1WENKY2JpQWdJQ0FySUNnb2MzUmhZMnN4SUQwZ2FHVnNjR1Z5Y3k1bFlXTm9MbU5oYkd3b1lXeHBZWE14TENoa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQzVwYm5SeWJ5QTZJR1JsY0hSb01Da3NlMXdpYm1GdFpWd2lPbHdpWldGamFGd2lMRndpYUdGemFGd2lPbnQ5TEZ3aVptNWNJanBqYjI1MFlXbHVaWEl1Y0hKdlozSmhiU2d5TENCa1lYUmhMQ0F3S1N4Y0ltbHVkbVZ5YzJWY0lqcGpiMjUwWVdsdVpYSXVibTl2Y0N4Y0ltUmhkR0ZjSWpwa1lYUmhmU2twSUNFOUlHNTFiR3dnUHlCemRHRmphekVnT2lCY0lsd2lLVnh1SUNBZ0lDc2dYQ0lnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hGeHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRnh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WEZ4Y0ltTmhjbVJjWEZ3aVBseGNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhGeGNJbU5oY21RdFkyOXVkR1Z1ZEZ4Y1hDSStYRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WEZ4Y0ltTmhjbVF0WTI5dWRHVnVkQzFwYm01bGNseGNYQ0krWEZ4dVhDSmNiaUFnSUNBcklDZ29jM1JoWTJzeElEMGdhR1ZzY0dWeWN5NWxZV05vTG1OaGJHd29ZV3hwWVhNeExDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUM1bmNtRmtaU0E2SUdSbGNIUm9NQ2tzZTF3aWJtRnRaVndpT2x3aVpXRmphRndpTEZ3aWFHRnphRndpT250OUxGd2labTVjSWpwamIyNTBZV2x1WlhJdWNISnZaM0poYlNnMExDQmtZWFJoTENBd0tTeGNJbWx1ZG1WeWMyVmNJanBqYjI1MFlXbHVaWEl1Ym05dmNDeGNJbVJoZEdGY0lqcGtZWFJoZlNrcElDRTlJRzUxYkd3Z1B5QnpkR0ZqYXpFZ09pQmNJbHdpS1Z4dUlDQWdJQ3NnWENJZ1hDSmNiaUFnSUNBcklDZ29jM1JoWTJzeElEMGdLR2hsYkhCbGNuTXVZV1JrVDNSb1pYSkljbVZtSUh4OElDaGtaWEIwYURBZ0ppWWdaR1Z3ZEdnd0xtRmtaRTkwYUdWeVNISmxaaWtnZkh3Z1lXeHBZWE15S1M1allXeHNLR0ZzYVdGek1Td29aR1Z3ZEdnd0lDRTlJRzUxYkd3Z1B5QmtaWEIwYURBdWRIbHdaU0E2SUdSbGNIUm9NQ2tzZTF3aWJtRnRaVndpT2x3aVlXUmtUM1JvWlhKSWNtVm1YQ0lzWENKb1lYTm9YQ0k2ZTMwc1hDSmtZWFJoWENJNlpHRjBZWDBwS1NBaFBTQnVkV3hzSUQ4Z2MzUmhZMnN4SURvZ1hDSmNJaWxjYmlBZ0lDQXJJRndpWEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHhjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4Y2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEZ4dUlDQWdJQ0FnSUNBOGNENWNYRzRnSUNBZ0lDQWdJQ0FnSUNBOFlTQm9jbVZtUFZ4Y1hDSXVMMmx1WkdWNEwyVjRjR1Z5YVdWdVkyVXRkMjl5YTNNdWFIUnRiRDkwZVhCbFBWd2lYRzRnSUNBZ0t5QmhiR2xoY3pNb0tDaG9aV3h3WlhJZ1BTQW9hR1ZzY0dWeUlEMGdhR1ZzY0dWeWN5NTBlWEJsSUh4OElDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUM1MGVYQmxJRG9nWkdWd2RHZ3dLU2tnSVQwZ2JuVnNiQ0EvSUdobGJIQmxjaUE2SUdGc2FXRnpNaWtzS0hSNWNHVnZaaUJvWld4d1pYSWdQVDA5SUdGc2FXRnpOQ0EvSUdobGJIQmxjaTVqWVd4c0tHRnNhV0Z6TVN4N1hDSnVZVzFsWENJNlhDSjBlWEJsWENJc1hDSm9ZWE5vWENJNmUzMHNYQ0prWVhSaFhDSTZaR0YwWVgwcElEb2dhR1ZzY0dWeUtTa3BYRzRnSUNBZ0t5QmNJbHhjWENJZ1kyeGhjM005WEZ4Y0ltSjFkSFJ2Ymx4Y1hDSWdaR0YwWVMxMGVYQmxQVnhjWENKY0lseHVJQ0FnSUNzZ1lXeHBZWE16S0Nnb2FHVnNjR1Z5SUQwZ0tHaGxiSEJsY2lBOUlHaGxiSEJsY25NdWRIbHdaU0I4ZkNBb1pHVndkR2d3SUNFOUlHNTFiR3dnUHlCa1pYQjBhREF1ZEhsd1pTQTZJR1JsY0hSb01Da3BJQ0U5SUc1MWJHd2dQeUJvWld4d1pYSWdPaUJoYkdsaGN6SXBMQ2gwZVhCbGIyWWdhR1ZzY0dWeUlEMDlQU0JoYkdsaGN6UWdQeUJvWld4d1pYSXVZMkZzYkNoaGJHbGhjekVzZTF3aWJtRnRaVndpT2x3aWRIbHdaVndpTEZ3aWFHRnphRndpT250OUxGd2laR0YwWVZ3aU9tUmhkR0Y5S1NBNklHaGxiSEJsY2lrcEtWeHVJQ0FnSUNzZ1hDSmNYRndpUHVlYnVPV0ZzK1M5bk9XVGdUd3ZZVDVjWEc0Z0lDQWdJQ0FnSUR3dmNENWNYRzRnSUNBZ1BDOWthWFkrWEZ4dVBDOWthWFkrWEZ4dVhDSTdYRzU5TEZ3aU1sd2lPbVoxYm1OMGFXOXVLR052Ym5SaGFXNWxjaXhrWlhCMGFEQXNhR1ZzY0dWeWN5eHdZWEowYVdGc2N5eGtZWFJoS1NCN1hHNGdJQ0FnY21WMGRYSnVJRndpSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNENWNJbHh1SUNBZ0lDc2dZMjl1ZEdGcGJtVnlMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNG9ZMjl1ZEdGcGJtVnlMbXhoYldKa1lTaGtaWEIwYURBc0lHUmxjSFJvTUNrcFhHNGdJQ0FnS3lCY0lqd3ZjRDVjWEc1Y0lqdGNibjBzWENJMFhDSTZablZ1WTNScGIyNG9ZMjl1ZEdGcGJtVnlMR1JsY0hSb01DeG9aV3h3WlhKekxIQmhjblJwWVd4ekxHUmhkR0VwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdYQ0lnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4d1Bsd2lYRzRnSUNBZ0t5QmpiMjUwWVdsdVpYSXVaWE5qWVhCbFJYaHdjbVZ6YzJsdmJpaGpiMjUwWVdsdVpYSXViR0Z0WW1SaEtHUmxjSFJvTUN3Z1pHVndkR2d3S1NsY2JpQWdJQ0FySUZ3aVBDOXdQbHhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hDSTdYRzU5TEZ3aVkyOXRjR2xzWlhKY0lqcGJOeXhjSWo0OUlEUXVNQzR3WENKZExGd2liV0ZwYmx3aU9tWjFibU4wYVc5dUtHTnZiblJoYVc1bGNpeGtaWEIwYURBc2FHVnNjR1Z5Y3l4d1lYSjBhV0ZzY3l4a1lYUmhLU0I3WEc0Z0lDQWdkbUZ5SUhOMFlXTnJNVHRjYmx4dUlDQnlaWFIxY200Z0tDaHpkR0ZqYXpFZ1BTQm9aV3h3WlhKekxtVmhZMmd1WTJGc2JDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUNBNklIdDlMR1JsY0hSb01DeDdYQ0p1WVcxbFhDSTZYQ0psWVdOb1hDSXNYQ0pvWVhOb1hDSTZlMzBzWENKbWJsd2lPbU52Ym5SaGFXNWxjaTV3Y205bmNtRnRLREVzSUdSaGRHRXNJREFwTEZ3aWFXNTJaWEp6WlZ3aU9tTnZiblJoYVc1bGNpNXViMjl3TEZ3aVpHRjBZVndpT21SaGRHRjlLU2tnSVQwZ2JuVnNiQ0EvSUhOMFlXTnJNU0E2SUZ3aVhDSXBPMXh1ZlN4Y0luVnpaVVJoZEdGY0lqcDBjblZsZlNrN1hHNGlMQ0l2THlCb1luTm1lU0JqYjIxd2FXeGxaQ0JJWVc1a2JHVmlZWEp6SUhSbGJYQnNZWFJsWEc1MllYSWdTR0Z1Wkd4bFltRnljME52YlhCcGJHVnlJRDBnY21WeGRXbHlaU2duYUdKelpua3ZjblZ1ZEdsdFpTY3BPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JJWVc1a2JHVmlZWEp6UTI5dGNHbHNaWEl1ZEdWdGNHeGhkR1VvZTF3aU1Wd2lPbVoxYm1OMGFXOXVLR052Ym5SaGFXNWxjaXhrWlhCMGFEQXNhR1ZzY0dWeWN5eHdZWEowYVdGc2N5eGtZWFJoS1NCN1hHNGdJQ0FnZG1GeUlHRnNhV0Z6TVQxa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQ0E2SUh0OUxDQmhiR2xoY3pJOWFHVnNjR1Z5Y3k1b1pXeHdaWEpOYVhOemFXNW5MQ0JoYkdsaGN6TTlZMjl1ZEdGcGJtVnlMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNDdYRzVjYmlBZ2NtVjBkWEp1SUZ3aVBHRWdhSEpsWmoxY1hGd2lJM1JoWWx3aVhHNGdJQ0FnS3lCaGJHbGhjek1vS0dobGJIQmxjbk11WVdSa1QyNWxJSHg4SUNoa1pYQjBhREFnSmlZZ1pHVndkR2d3TG1Ga1pFOXVaU2tnZkh3Z1lXeHBZWE15S1M1allXeHNLR0ZzYVdGek1Td29aR0YwWVNBbUppQmtZWFJoTG1sdVpHVjRLU3g3WENKdVlXMWxYQ0k2WENKaFpHUlBibVZjSWl4Y0ltaGhjMmhjSWpwN2ZTeGNJbVJoZEdGY0lqcGtZWFJoZlNrcFhHNGdJQ0FnS3lCY0lseGNYQ0lnWTJ4aGMzTTlYRnhjSW1KMWRIUnZiaUIwWVdJdGJHbHVheUJjSWx4dUlDQWdJQ3NnWVd4cFlYTXpLQ2hvWld4d1pYSnpMbUZrWkVGamRHbDJaU0I4ZkNBb1pHVndkR2d3SUNZbUlHUmxjSFJvTUM1aFpHUkJZM1JwZG1VcElIeDhJR0ZzYVdGek1pa3VZMkZzYkNoaGJHbGhjekVzS0dSaGRHRWdKaVlnWkdGMFlTNXBibVJsZUNrc2Uxd2libUZ0WlZ3aU9sd2lZV1JrUVdOMGFYWmxYQ0lzWENKb1lYTm9YQ0k2ZTMwc1hDSmtZWFJoWENJNlpHRjBZWDBwS1Z4dUlDQWdJQ3NnWENKY1hGd2lQbHdpWEc0Z0lDQWdLeUJoYkdsaGN6TW9ZMjl1ZEdGcGJtVnlMbXhoYldKa1lTaGtaWEIwYURBc0lHUmxjSFJvTUNrcFhHNGdJQ0FnS3lCY0lqd3ZZVDRnWENJN1hHNTlMRndpWTI5dGNHbHNaWEpjSWpwYk55eGNJajQ5SURRdU1DNHdYQ0pkTEZ3aWJXRnBibHdpT21aMWJtTjBhVzl1S0dOdmJuUmhhVzVsY2l4a1pYQjBhREFzYUdWc2NHVnljeXh3WVhKMGFXRnNjeXhrWVhSaEtTQjdYRzRnSUNBZ2RtRnlJSE4wWVdOck1UdGNibHh1SUNCeVpYUjFjbTRnS0NoemRHRmphekVnUFNCb1pXeHdaWEp6TG1WaFkyZ3VZMkZzYkNoa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQ0E2SUh0OUxHUmxjSFJvTUN4N1hDSnVZVzFsWENJNlhDSmxZV05vWENJc1hDSm9ZWE5vWENJNmUzMHNYQ0ptYmx3aU9tTnZiblJoYVc1bGNpNXdjbTluY21GdEtERXNJR1JoZEdFc0lEQXBMRndpYVc1MlpYSnpaVndpT21OdmJuUmhhVzVsY2k1dWIyOXdMRndpWkdGMFlWd2lPbVJoZEdGOUtTa2dJVDBnYm5Wc2JDQS9JSE4wWVdOck1TQTZJRndpWENJcFhHNGdJQ0FnS3lCY0lseGNibHdpTzF4dWZTeGNJblZ6WlVSaGRHRmNJanAwY25WbGZTazdYRzRpTENJdkx5Qm9Zbk5tZVNCamIyMXdhV3hsWkNCSVlXNWtiR1ZpWVhKeklIUmxiWEJzWVhSbFhHNTJZWElnU0dGdVpHeGxZbUZ5YzBOdmJYQnBiR1Z5SUQwZ2NtVnhkV2x5WlNnbmFHSnpabmt2Y25WdWRHbHRaU2NwTzF4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCSVlXNWtiR1ZpWVhKelEyOXRjR2xzWlhJdWRHVnRjR3hoZEdVb2Uxd2lZMjl0Y0dsc1pYSmNJanBiTnl4Y0lqNDlJRFF1TUM0d1hDSmRMRndpYldGcGJsd2lPbVoxYm1OMGFXOXVLR052Ym5SaGFXNWxjaXhrWlhCMGFEQXNhR1ZzY0dWeWN5eHdZWEowYVdGc2N5eGtZWFJoS1NCN1hHNGdJQ0FnZG1GeUlHaGxiSEJsY2l3Z1lXeHBZWE14UFdSbGNIUm9NQ0FoUFNCdWRXeHNJRDhnWkdWd2RHZ3dJRG9nZTMwc0lHRnNhV0Z6TWoxb1pXeHdaWEp6TG1obGJIQmxjazFwYzNOcGJtY3NJR0ZzYVdGek16MWNJbVoxYm1OMGFXOXVYQ0lzSUdGc2FXRnpORDFqYjI1MFlXbHVaWEl1WlhOallYQmxSWGh3Y21WemMybHZianRjYmx4dUlDQnlaWFIxY200Z1hDSThJUzB0SU9Xa3RPV0RqeUF0TFQ1Y1hHNDhaR2wySUdOc1lYTnpQVnhjWENKallYSmtJR3R6TFdOaGNtUXRhR1ZoWkdWeUxYQnBZMXhjWENJK1hGeHVJQ0FnSUR4a2FYWWdkbUZzYVdkdVBWeGNYQ0ppYjNSMGIyMWNYRndpSUhOMGVXeGxQVnhjWENKY1hGd2lJR05zWVhOelBWeGNYQ0poWW05MWRHMWxMWEJwWXlCallYSmtMV2x0WVdkbElHTnZiRzl5TFhkb2FYUmxJRzV2TFdKdmNtUmxjaUJzWVhwNUlHeGhlbmt0Wm1Ga1pXbHVYRnhjSWo1Y0lseHVJQ0FnSUNzZ1lXeHBZWE0wS0Nnb2FHVnNjR1Z5SUQwZ0tHaGxiSEJsY2lBOUlHaGxiSEJsY25NdWRHbDBiR1VnZkh3Z0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3TG5ScGRHeGxJRG9nWkdWd2RHZ3dLU2tnSVQwZ2JuVnNiQ0EvSUdobGJIQmxjaUE2SUdGc2FXRnpNaWtzS0hSNWNHVnZaaUJvWld4d1pYSWdQVDA5SUdGc2FXRnpNeUEvSUdobGJIQmxjaTVqWVd4c0tHRnNhV0Z6TVN4N1hDSnVZVzFsWENJNlhDSjBhWFJzWlZ3aUxGd2lhR0Z6YUZ3aU9udDlMRndpWkdGMFlWd2lPbVJoZEdGOUtTQTZJR2hsYkhCbGNpa3BLVnh1SUNBZ0lDc2dYQ0k4TDJScGRqNWNYRzRnSUNBZ1BHUnBkaUJqYkdGemN6MWNYRndpWTJGeVpDMWpiMjUwWlc1MFhGeGNJajVjWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhGeGNJbU5oY21RdFkyOXVkR1Z1ZEMxcGJtNWxjbHhjWENJK1hGeHVJQ0FnSUNBZ0lDQWdJQ0FnUEhBK1hDSmNiaUFnSUNBcklHRnNhV0Z6TkNnb0tHaGxiSEJsY2lBOUlDaG9aV3h3WlhJZ1BTQm9aV3h3WlhKekxtUmxjMk1nZkh3Z0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3TG1SbGMyTWdPaUJrWlhCMGFEQXBLU0FoUFNCdWRXeHNJRDhnYUdWc2NHVnlJRG9nWVd4cFlYTXlLU3dvZEhsd1pXOW1JR2hsYkhCbGNpQTlQVDBnWVd4cFlYTXpJRDhnYUdWc2NHVnlMbU5oYkd3b1lXeHBZWE14TEh0Y0ltNWhiV1ZjSWpwY0ltUmxjMk5jSWl4Y0ltaGhjMmhjSWpwN2ZTeGNJbVJoZEdGY0lqcGtZWFJoZlNrZ09pQm9aV3h3WlhJcEtTbGNiaUFnSUNBcklGd2lQQzl3UGx4Y2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEZ4dUlDQWdJRHd2WkdsMlBseGNiand2WkdsMlBseGNiandoTFMwZ0wrV2t0T1dEanlBdExUNWNYRzVjSWp0Y2JuMHNYQ0oxYzJWRVlYUmhYQ0k2ZEhKMVpYMHBPMXh1SWl3aWRtRnlJR0poYzJsaklEMGdjbVZ4ZFdseVpTZ25MaTR2TGk0dmMyVnlkbWxqWlM5aVlYTnBZeWNwTzF4dVhHNTJZWElnWm1GMmFXTnZibFJsYlhBZ1BTQnlaWEYxYVhKbEtDY3VMMlpoZG1samIyNHVhR0p6SnlrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdlMXh1SUNBZ0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0pDUmliM2dwSUh0Y2JseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1VTNVFjbTl0YVhObEtHWjFibU4wYVc5dUtDa2dlMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQmlZWE5wWXk1blpYUkdZWFpwWTI5dVJHRjBZU2dwTG5Sb1pXNG9ablZ1WTNScGIyNG9aR0YwWVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDUWtZbTk0TG5CeVpYQmxibVFvWm1GMmFXTnZibFJsYlhBb1pHRjBZU2twWEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxjMjlzZG1Vb0tUdGNiaUFnSUNBZ0lDQWdmU2s3WEc0Z0lDQWdmVnh1ZlR0Y2JpSXNJaTh2SUdoaWMyWjVJR052YlhCcGJHVmtJRWhoYm1Sc1pXSmhjbk1nZEdWdGNHeGhkR1ZjYm5aaGNpQklZVzVrYkdWaVlYSnpRMjl0Y0dsc1pYSWdQU0J5WlhGMWFYSmxLQ2RvWW5ObWVTOXlkVzUwYVcxbEp5azdYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRWhoYm1Sc1pXSmhjbk5EYjIxd2FXeGxjaTUwWlcxd2JHRjBaU2g3WENKamIyMXdhV3hsY2x3aU9sczNMRndpUGowZ05DNHdMakJjSWwwc1hDSnRZV2x1WENJNlpuVnVZM1JwYjI0b1kyOXVkR0ZwYm1WeUxHUmxjSFJvTUN4b1pXeHdaWEp6TEhCaGNuUnBZV3h6TEdSaGRHRXBJSHRjYmlBZ0lDQnlaWFIxY200Z1hDSThiR2srWEZ4dUlDQWdJRHhoSUdoeVpXWTlYRnhjSWk0dmFXNWtaWGd2YW1saVpXNTZhV3hwWVc4dWFIUnRiRnhjWENJZ1kyeGhjM005WEZ4Y0ltbDBaVzB0YkdsdWF5QnBkR1Z0TFdOdmJuUmxiblFnWTJ4dmMyVXRjR0Z1Wld4Y1hGd2lQbHhjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY1hGd2lhWFJsYlMxdFpXUnBZVnhjWENJK1BHa2dZMnhoYzNNOVhGeGNJbVpoSUdaaExXNWxkM053WVhCbGNpMXZYRnhjSWo0OEwyaytQQzlrYVhZK1hGeHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKcGRHVnRMV2x1Ym1WeVhGeGNJajVjWEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKcGRHVnRMWFJwZEd4bFhGeGNJajdsbjdybW5Lem90WVRtbHBrOEwyUnBkajVjWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHhjYmlBZ0lDQThMMkUrWEZ4dVBDOXNhVDVjWEc0OGJHaytYRnh1SUNBZ0lEeGhJR2h5WldZOVhGeGNJaTR2YVc1a1pYZ3ZaWGh3WlhKcFpXNWpaUzVvZEcxc1hGeGNJaUJqYkdGemN6MWNYRndpYVhSbGJTMXNhVzVySUdsMFpXMHRZMjl1ZEdWdWRDQmpiRzl6WlMxd1lXNWxiRnhjWENJK1hGeHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKcGRHVnRMVzFsWkdsaFhGeGNJajQ4YVNCamJHRnpjejFjWEZ3aVptRWdabUV0Y0dGd1pYSXRjR3hoYm1WY1hGd2lQand2YVQ0OEwyUnBkajVjWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhGeGNJbWwwWlcwdGFXNXVaWEpjWEZ3aVBseGNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhGeGNJbWwwWlcwdGRHbDBiR1ZjWEZ3aVB1YWNyT1M2dXVlN2orV09oand2WkdsMlBseGNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hGeHVJQ0FnSUR3dllUNWNYRzQ4TDJ4cFBseGNianhzYVQ1Y1hHNGdJQ0FnUEdFZ2FISmxaajFjWEZ3aUxpOXBibVJsZUM5M2IzSnJjeTVvZEcxc1hGeGNJaUJqYkdGemN6MWNYRndpYVhSbGJTMXNhVzVySUdsMFpXMHRZMjl1ZEdWdWRDQmpiRzl6WlMxd1lXNWxiRnhjWENJK1hGeHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKcGRHVnRMVzFsWkdsaFhGeGNJajQ4YVNCamJHRnpjejFjWEZ3aVptRWdabUV0WTNWaVpYTmNYRndpUGp3dmFUNDhMMlJwZGo1Y1hHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYRnhjSW1sMFpXMHRhVzV1WlhKY1hGd2lQbHhjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYRnhjSW1sMFpXMHRkR2wwYkdWY1hGd2lQdVM5bk9XVGdlUy9vZWFCcnp3dlpHbDJQbHhjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYRnh1SUNBZ0lEd3ZZVDVjWEc0OEwyeHBQbHhjYmx3aU8xeHVmU3hjSW5WelpVUmhkR0ZjSWpwMGNuVmxmU2s3WEc0aUxDSjJZWElnWVhCd1RtRjJWR1Z0Y0NBOUlISmxjWFZwY21Vb0p5NHZZWEJ3TFc1aGRpNW9Zbk1uS1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQjdYRzRnSUNBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlGRXVVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4cTVZcWc2TDI5NWErODZJaXE1cWloNXAyL0tpOWNiaUFnSUNBZ0lDQWdJQ0FnSUNRa0tGd2lMbUZ3Y0MxdVlYWmNJaWt1WVhCd1pXNWtLR0Z3Y0U1aGRsUmxiWEFvS1NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J0ZVVGd2NDNXZibEJoWjJWSmJtbDBLQ2RvYjIxbEp5d2dablZ1WTNScGIyNG9jR0ZuWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDUWtLRndpTG1sdVpHVjRMV0Z3Y0MxdVlYWmNJaWt1WVhCd1pXNWtLR0Z3Y0U1aGRsUmxiWEFvS1NrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemIyeDJaU2dwTzF4dUlDQWdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNTlPMXh1SWl3aUx5OGdhR0p6Wm5rZ1kyOXRjR2xzWldRZ1NHRnVaR3hsWW1GeWN5QjBaVzF3YkdGMFpWeHVkbUZ5SUVoaGJtUnNaV0poY25ORGIyMXdhV3hsY2lBOUlISmxjWFZwY21Vb0oyaGljMlo1TDNKMWJuUnBiV1VuS1R0Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1NHRnVaR3hsWW1GeWMwTnZiWEJwYkdWeUxuUmxiWEJzWVhSbEtIdGNJakZjSWpwbWRXNWpkR2x2YmloamIyNTBZV2x1WlhJc1pHVndkR2d3TEdobGJIQmxjbk1zY0dGeWRHbGhiSE1zWkdGMFlTa2dlMXh1SUNBZ0lIWmhjaUJ6ZEdGamF6RTdYRzVjYmlBZ2NtVjBkWEp1SUZ3aVBHUnBkaUJqYkdGemN6MWNYRndpWTI5dWRHVnVkQzFpYkc5amF5MTBhWFJzWlZ4Y1hDSStYQ0pjYmlBZ0lDQXJJR052Ym5SaGFXNWxjaTVsYzJOaGNHVkZlSEJ5WlhOemFXOXVLR052Ym5SaGFXNWxjaTVzWVcxaVpHRW9LR1JsY0hSb01DQWhQU0J1ZFd4c0lEOGdaR1Z3ZEdnd0xuUnBkR3hsSURvZ1pHVndkR2d3S1N3Z1pHVndkR2d3S1NsY2JpQWdJQ0FySUZ3aVBDOWthWFkrWEZ4dVBHUnBkaUJqYkdGemN6MWNYRndpWTI5dWRHVnVkQzFpYkc5amExeGNYQ0krWEZ4dUlDQWdJRHhrYVhZZ1kyeGhjM005WEZ4Y0ltTnZiblJsYm5RdFlteHZZMnN0YVc1dVpYSmNYRndpUGx4Y2Jsd2lYRzRnSUNBZ0t5QW9LSE4wWVdOck1TQTlJR2hsYkhCbGNuTXVaV0ZqYUM1allXeHNLR1JsY0hSb01DQWhQU0J1ZFd4c0lEOGdaR1Z3ZEdnd0lEb2dlMzBzS0dSbGNIUm9NQ0FoUFNCdWRXeHNJRDhnWkdWd2RHZ3dMbU52Ym5SbGJuUWdPaUJrWlhCMGFEQXBMSHRjSW01aGJXVmNJanBjSW1WaFkyaGNJaXhjSW1oaGMyaGNJanA3ZlN4Y0ltWnVYQ0k2WTI5dWRHRnBibVZ5TG5CeWIyZHlZVzBvTWl3Z1pHRjBZU3dnTUNrc1hDSnBiblpsY25ObFhDSTZZMjl1ZEdGcGJtVnlMbTV2YjNBc1hDSmtZWFJoWENJNlpHRjBZWDBwS1NBaFBTQnVkV3hzSUQ4Z2MzUmhZMnN4SURvZ1hDSmNJaWxjYmlBZ0lDQXJJRndpSUNBZ0lEd3ZaR2wyUGx4Y2Jqd3ZaR2wyUGx4Y2Jsd2lPMXh1ZlN4Y0lqSmNJanBtZFc1amRHbHZiaWhqYjI1MFlXbHVaWElzWkdWd2RHZ3dMR2hsYkhCbGNuTXNjR0Z5ZEdsaGJITXNaR0YwWVNrZ2UxeHVJQ0FnSUhaaGNpQnpkR0ZqYXpFN1hHNWNiaUFnY21WMGRYSnVJRndpSUNBZ0lDQWdJQ0E4Y0Q1Y0lseHVJQ0FnSUNzZ0tDaHpkR0ZqYXpFZ1BTQmpiMjUwWVdsdVpYSXViR0Z0WW1SaEtHUmxjSFJvTUN3Z1pHVndkR2d3S1NrZ0lUMGdiblZzYkNBL0lITjBZV05yTVNBNklGd2lYQ0lwWEc0Z0lDQWdLeUJjSWp3dmNENWNYRzVjSWp0Y2JuMHNYQ0pqYjIxd2FXeGxjbHdpT2xzM0xGd2lQajBnTkM0d0xqQmNJbDBzWENKdFlXbHVYQ0k2Wm5WdVkzUnBiMjRvWTI5dWRHRnBibVZ5TEdSbGNIUm9NQ3hvWld4d1pYSnpMSEJoY25ScFlXeHpMR1JoZEdFcElIdGNiaUFnSUNCMllYSWdjM1JoWTJzeE8xeHVYRzRnSUhKbGRIVnliaUFvS0hOMFlXTnJNU0E5SUdobGJIQmxjbk11WldGamFDNWpZV3hzS0dSbGNIUm9NQ0FoUFNCdWRXeHNJRDhnWkdWd2RHZ3dJRG9nZTMwc1pHVndkR2d3TEh0Y0ltNWhiV1ZjSWpwY0ltVmhZMmhjSWl4Y0ltaGhjMmhjSWpwN2ZTeGNJbVp1WENJNlkyOXVkR0ZwYm1WeUxuQnliMmR5WVcwb01Td2daR0YwWVN3Z01Da3NYQ0pwYm5abGNuTmxYQ0k2WTI5dWRHRnBibVZ5TG01dmIzQXNYQ0prWVhSaFhDSTZaR0YwWVgwcEtTQWhQU0J1ZFd4c0lEOGdjM1JoWTJzeElEb2dYQ0pjSWlrN1hHNTlMRndpZFhObFJHRjBZVndpT25SeWRXVjlLVHRjYmlJc0lpOHZJR2hpYzJaNUlHTnZiWEJwYkdWa0lFaGhibVJzWldKaGNuTWdkR1Z0Y0d4aGRHVmNiblpoY2lCSVlXNWtiR1ZpWVhKelEyOXRjR2xzWlhJZ1BTQnlaWEYxYVhKbEtDZG9Zbk5tZVM5eWRXNTBhVzFsSnlrN1hHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFaGhibVJzWldKaGNuTkRiMjF3YVd4bGNpNTBaVzF3YkdGMFpTaDdYQ0l4WENJNlpuVnVZM1JwYjI0b1kyOXVkR0ZwYm1WeUxHUmxjSFJvTUN4b1pXeHdaWEp6TEhCaGNuUnBZV3h6TEdSaGRHRXBJSHRjYmlBZ0lDQjJZWElnYzNSaFkyc3hPMXh1WEc0Z0lISmxkSFZ5YmlCY0lqeGthWFlnWTJ4aGMzTTlYRnhjSW1OdmJuUmxiblF0WW14dlkyc3RkR2wwYkdWY1hGd2lQbHdpWEc0Z0lDQWdLeUJqYjI1MFlXbHVaWEl1WlhOallYQmxSWGh3Y21WemMybHZiaWhqYjI1MFlXbHVaWEl1YkdGdFltUmhLQ2hrWlhCMGFEQWdJVDBnYm5Wc2JDQS9JR1JsY0hSb01DNTBhWFJzWlNBNklHUmxjSFJvTUNrc0lHUmxjSFJvTUNrcFhHNGdJQ0FnS3lCY0lqd3ZaR2wyUGx4Y2JqeGthWFlnWTJ4aGMzTTlYRnhjSW14cGMzUXRZbXh2WTJ0Y1hGd2lQbHhjYmlBZ0lDQThkV3crWEZ4dVhDSmNiaUFnSUNBcklDZ29jM1JoWTJzeElEMGdhR1ZzY0dWeWN5NWxZV05vTG1OaGJHd29aR1Z3ZEdnd0lDRTlJRzUxYkd3Z1B5QmtaWEIwYURBZ09pQjdmU3dvWkdWd2RHZ3dJQ0U5SUc1MWJHd2dQeUJrWlhCMGFEQXVZMjl1ZEdWdWRDQTZJR1JsY0hSb01Da3NlMXdpYm1GdFpWd2lPbHdpWldGamFGd2lMRndpYUdGemFGd2lPbnQ5TEZ3aVptNWNJanBqYjI1MFlXbHVaWEl1Y0hKdlozSmhiU2d5TENCa1lYUmhMQ0F3S1N4Y0ltbHVkbVZ5YzJWY0lqcGpiMjUwWVdsdVpYSXVibTl2Y0N4Y0ltUmhkR0ZjSWpwa1lYUmhmU2twSUNFOUlHNTFiR3dnUHlCemRHRmphekVnT2lCY0lsd2lLVnh1SUNBZ0lDc2dYQ0lnSUNBZ1BDOTFiRDVjWEc0OEwyUnBkajVjWEc1Y0lqdGNibjBzWENJeVhDSTZablZ1WTNScGIyNG9ZMjl1ZEdGcGJtVnlMR1JsY0hSb01DeG9aV3h3WlhKekxIQmhjblJwWVd4ekxHUmhkR0VwSUh0Y2JpQWdJQ0IyWVhJZ1lXeHBZWE14UFdOdmJuUmhhVzVsY2k1c1lXMWlaR0VzSUdGc2FXRnpNajFqYjI1MFlXbHVaWEl1WlhOallYQmxSWGh3Y21WemMybHZianRjYmx4dUlDQnlaWFIxY200Z1hDSWdJQ0FnSUNBZ0lEeHNhVDVjWEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVnhjWENKcGRHVnRMV052Ym5SbGJuUmNYRndpUGx4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWeGNYQ0pwZEdWdExXbHVibVZ5WEZ4Y0lqNWNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhGeGNJbWwwWlcwdGRHbDBiR1ZjWEZ3aVBsd2lYRzRnSUNBZ0t5QmhiR2xoY3pJb1lXeHBZWE14S0Noa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQzV6ZFdKMGFYUnNaU0E2SUdSbGNIUm9NQ2tzSUdSbGNIUm9NQ2twWEc0Z0lDQWdLeUJjSWp3dlpHbDJQbHhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNYRndpYVhSbGJTMWhablJsY2x4Y1hDSStYQ0pjYmlBZ0lDQXJJR0ZzYVdGek1paGhiR2xoY3pFb0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3TG5OMVltTnZiblJsYm5RZ09pQmtaWEIwYURBcExDQmtaWEIwYURBcEtWeHVJQ0FnSUNzZ1hDSThMMlJwZGo1Y1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEZ4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hGeHVJQ0FnSUNBZ0lDQThMMnhwUGx4Y2Jsd2lPMXh1ZlN4Y0ltTnZiWEJwYkdWeVhDSTZXemNzWENJK1BTQTBMakF1TUZ3aVhTeGNJbTFoYVc1Y0lqcG1kVzVqZEdsdmJpaGpiMjUwWVdsdVpYSXNaR1Z3ZEdnd0xHaGxiSEJsY25Nc2NHRnlkR2xoYkhNc1pHRjBZU2tnZTF4dUlDQWdJSFpoY2lCemRHRmphekU3WEc1Y2JpQWdjbVYwZFhKdUlDZ29jM1JoWTJzeElEMGdhR1ZzY0dWeWN5NWxZV05vTG1OaGJHd29aR1Z3ZEdnd0lDRTlJRzUxYkd3Z1B5QmtaWEIwYURBZ09pQjdmU3hrWlhCMGFEQXNlMXdpYm1GdFpWd2lPbHdpWldGamFGd2lMRndpYUdGemFGd2lPbnQ5TEZ3aVptNWNJanBqYjI1MFlXbHVaWEl1Y0hKdlozSmhiU2d4TENCa1lYUmhMQ0F3S1N4Y0ltbHVkbVZ5YzJWY0lqcGpiMjUwWVdsdVpYSXVibTl2Y0N4Y0ltUmhkR0ZjSWpwa1lYUmhmU2twSUNFOUlHNTFiR3dnUHlCemRHRmphekVnT2lCY0lsd2lLVHRjYm4wc1hDSjFjMlZFWVhSaFhDSTZkSEoxWlgwcE8xeHVJaXdpTHk4Z2FHSnpabmtnWTI5dGNHbHNaV1FnU0dGdVpHeGxZbUZ5Y3lCMFpXMXdiR0YwWlZ4dWRtRnlJRWhoYm1Sc1pXSmhjbk5EYjIxd2FXeGxjaUE5SUhKbGNYVnBjbVVvSjJoaWMyWjVMM0oxYm5ScGJXVW5LVHRjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnU0dGdVpHeGxZbUZ5YzBOdmJYQnBiR1Z5TG5SbGJYQnNZWFJsS0h0Y0lqRmNJanBtZFc1amRHbHZiaWhqYjI1MFlXbHVaWElzWkdWd2RHZ3dMR2hsYkhCbGNuTXNjR0Z5ZEdsaGJITXNaR0YwWVNrZ2UxeHVJQ0FnSUhaaGNpQnpkR0ZqYXpFc0lHaGxiSEJsY2l3Z1lXeHBZWE14UFdSbGNIUm9NQ0FoUFNCdWRXeHNJRDhnWkdWd2RHZ3dJRG9nZTMwc0lHRnNhV0Z6TWoxb1pXeHdaWEp6TG1obGJIQmxjazFwYzNOcGJtY3NJR0ZzYVdGek16MWNJbVoxYm1OMGFXOXVYQ0lzSUdGc2FXRnpORDFqYjI1MFlXbHVaWEl1WlhOallYQmxSWGh3Y21WemMybHZianRjYmx4dUlDQnlaWFIxY200Z1hDSThaR2wySUdOc1lYTnpQVnhjWENKcWN5MWpZWEprSUdOaGNtUWdhM010WTJGeVpDMW9aV0ZrWlhJdGNHbGpYRnhjSWo1Y1hHNGdJQ0FnUEdScGRpQmpiR0Z6Y3oxY1hGd2lZMkZ5WkMxb1pXRmtaWEpjWEZ3aVBsd2lYRzRnSUNBZ0t5QmhiR2xoY3pRb0tDaG9aV3h3WlhJZ1BTQW9hR1ZzY0dWeUlEMGdhR1ZzY0dWeWN5NXVZVzFsSUh4OElDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUM1dVlXMWxJRG9nWkdWd2RHZ3dLU2tnSVQwZ2JuVnNiQ0EvSUdobGJIQmxjaUE2SUdGc2FXRnpNaWtzS0hSNWNHVnZaaUJvWld4d1pYSWdQVDA5SUdGc2FXRnpNeUEvSUdobGJIQmxjaTVqWVd4c0tHRnNhV0Z6TVN4N1hDSnVZVzFsWENJNlhDSnVZVzFsWENJc1hDSm9ZWE5vWENJNmUzMHNYQ0prWVhSaFhDSTZaR0YwWVgwcElEb2dhR1ZzY0dWeUtTa3BYRzRnSUNBZ0t5QmNJand2WkdsMlBseGNiaUFnSUNBOFpHbDJJR1JoZEdFdFltRmphMmR5YjNWdVpEMWNYRndpWENKY2JpQWdJQ0FySUdGc2FXRnpOQ2dvS0dobGJIQmxjaUE5SUNob1pXeHdaWElnUFNCb1pXeHdaWEp6TG1OdmRtVnlJSHg4SUNoa1pYQjBhREFnSVQwZ2JuVnNiQ0EvSUdSbGNIUm9NQzVqYjNabGNpQTZJR1JsY0hSb01Da3BJQ0U5SUc1MWJHd2dQeUJvWld4d1pYSWdPaUJoYkdsaGN6SXBMQ2gwZVhCbGIyWWdhR1ZzY0dWeUlEMDlQU0JoYkdsaGN6TWdQeUJvWld4d1pYSXVZMkZzYkNoaGJHbGhjekVzZTF3aWJtRnRaVndpT2x3aVkyOTJaWEpjSWl4Y0ltaGhjMmhjSWpwN2ZTeGNJbVJoZEdGY0lqcGtZWFJoZlNrZ09pQm9aV3h3WlhJcEtTbGNiaUFnSUNBcklGd2lYRnhjSWlCMllXeHBaMjQ5WEZ4Y0ltSnZkSFJ2YlZ4Y1hDSWdZMnhoYzNNOVhGeGNJbXhoZW5rZ2JHRjZlUzFtWVdSbGFXNGdjM2RwY0dWeUxXeGhlbmtnYzJodmR5MXdhRzkwYnlCallYSmtMV2x0WVdkbElHTnZiRzl5TFhkb2FYUmxJRzV2TFdKdmNtUmxjbHhjWENJZ1pHRjBZUzFwWkQxY1hGd2lYQ0pjYmlBZ0lDQXJJR0ZzYVdGek5DZ29LR2hsYkhCbGNpQTlJQ2hvWld4d1pYSWdQU0JvWld4d1pYSnpMbWxrSUh4OElDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUM1cFpDQTZJR1JsY0hSb01Da3BJQ0U5SUc1MWJHd2dQeUJvWld4d1pYSWdPaUJoYkdsaGN6SXBMQ2gwZVhCbGIyWWdhR1ZzY0dWeUlEMDlQU0JoYkdsaGN6TWdQeUJvWld4d1pYSXVZMkZzYkNoaGJHbGhjekVzZTF3aWJtRnRaVndpT2x3aWFXUmNJaXhjSW1oaGMyaGNJanA3ZlN4Y0ltUmhkR0ZjSWpwa1lYUmhmU2tnT2lCb1pXeHdaWElwS1NsY2JpQWdJQ0FySUZ3aVhGeGNJajQ4TDJScGRqNWNYRzVjSWx4dUlDQWdJQ3NnS0NoemRHRmphekVnUFNCb1pXeHdaWEp6VzF3aWFXWmNJbDB1WTJGc2JDaGhiR2xoY3pFc0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3TG1SbGMyTWdPaUJrWlhCMGFEQXBMSHRjSW01aGJXVmNJanBjSW1sbVhDSXNYQ0pvWVhOb1hDSTZlMzBzWENKbWJsd2lPbU52Ym5SaGFXNWxjaTV3Y205bmNtRnRLRElzSUdSaGRHRXNJREFwTEZ3aWFXNTJaWEp6WlZ3aU9tTnZiblJoYVc1bGNpNXViMjl3TEZ3aVpHRjBZVndpT21SaGRHRjlLU2tnSVQwZ2JuVnNiQ0EvSUhOMFlXTnJNU0E2SUZ3aVhDSXBYRzRnSUNBZ0t5QmNJaUFnSUNBOFpHbDJJR05zWVhOelBWeGNYQ0pqWVhKa0xXWnZiM1JsY2x4Y1hDSStYRnh1SUNBZ0lDQWdJQ0E4WVNCb2NtVm1QVnhjWENJalhGeGNJaUJqYkdGemN6MWNYRndpYkdsdWF5QnphRzkzTFhCb2IzUnZYRnhjSWlCa1lYUmhMV2xrUFZ4Y1hDSmNJbHh1SUNBZ0lDc2dZV3hwWVhNMEtDZ29hR1ZzY0dWeUlEMGdLR2hsYkhCbGNpQTlJR2hsYkhCbGNuTXVhV1FnZkh3Z0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3TG1sa0lEb2daR1Z3ZEdnd0tTa2dJVDBnYm5Wc2JDQS9JR2hsYkhCbGNpQTZJR0ZzYVdGek1pa3NLSFI1Y0dWdlppQm9aV3h3WlhJZ1BUMDlJR0ZzYVdGek15QS9JR2hsYkhCbGNpNWpZV3hzS0dGc2FXRnpNU3g3WENKdVlXMWxYQ0k2WENKcFpGd2lMRndpYUdGemFGd2lPbnQ5TEZ3aVpHRjBZVndpT21SaGRHRjlLU0E2SUdobGJIQmxjaWtwS1Z4dUlDQWdJQ3NnWENKY1hGd2lQanhwSUdOc1lYTnpQVnhjWENKbVlTQm1ZUzF3YUc5MGIxeGNYQ0krUEM5cFBpRG1tN1RscEpybG03N25pWWM4TDJFK0lGd2lYRzRnSUNBZ0t5QW9LSE4wWVdOck1TQTlJR2hsYkhCbGNuTmJYQ0pwWmx3aVhTNWpZV3hzS0dGc2FXRnpNU3dvWkdWd2RHZ3dJQ0U5SUc1MWJHd2dQeUJrWlhCMGFEQXVkWEpzSURvZ1pHVndkR2d3S1N4N1hDSnVZVzFsWENJNlhDSnBabHdpTEZ3aWFHRnphRndpT250OUxGd2labTVjSWpwamIyNTBZV2x1WlhJdWNISnZaM0poYlNnMExDQmtZWFJoTENBd0tTeGNJbWx1ZG1WeWMyVmNJanBqYjI1MFlXbHVaWEl1Ym05dmNDeGNJbVJoZEdGY0lqcGtZWFJoZlNrcElDRTlJRzUxYkd3Z1B5QnpkR0ZqYXpFZ09pQmNJbHdpS1Z4dUlDQWdJQ3NnWENKY1hHNGdJQ0FnUEM5a2FYWStYRnh1UEM5a2FYWStYRnh1WENJN1hHNTlMRndpTWx3aU9tWjFibU4wYVc5dUtHTnZiblJoYVc1bGNpeGtaWEIwYURBc2FHVnNjR1Z5Y3l4d1lYSjBhV0ZzY3l4a1lYUmhLU0I3WEc0Z0lDQWdkbUZ5SUdobGJIQmxjanRjYmx4dUlDQnlaWFIxY200Z1hDSWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY1hGd2lZMkZ5WkMxamIyNTBaVzUwWEZ4Y0lqNWNYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WEZ4Y0ltTmhjbVF0WTI5dWRHVnVkQzFwYm01bGNseGNYQ0krWEZ4dUlDQWdJQ0FnSUNBZ0lDQWdQSEErWENKY2JpQWdJQ0FySUdOdmJuUmhhVzVsY2k1bGMyTmhjR1ZGZUhCeVpYTnphVzl1S0Nnb2FHVnNjR1Z5SUQwZ0tHaGxiSEJsY2lBOUlHaGxiSEJsY25NdVpHVnpZeUI4ZkNBb1pHVndkR2d3SUNFOUlHNTFiR3dnUHlCa1pYQjBhREF1WkdWell5QTZJR1JsY0hSb01Da3BJQ0U5SUc1MWJHd2dQeUJvWld4d1pYSWdPaUJvWld4d1pYSnpMbWhsYkhCbGNrMXBjM05wYm1jcExDaDBlWEJsYjJZZ2FHVnNjR1Z5SUQwOVBTQmNJbVoxYm1OMGFXOXVYQ0lnUHlCb1pXeHdaWEl1WTJGc2JDaGtaWEIwYURBZ0lUMGdiblZzYkNBL0lHUmxjSFJvTUNBNklIdDlMSHRjSW01aGJXVmNJanBjSW1SbGMyTmNJaXhjSW1oaGMyaGNJanA3ZlN4Y0ltUmhkR0ZjSWpwa1lYUmhmU2tnT2lCb1pXeHdaWElwS1NsY2JpQWdJQ0FySUZ3aVBDOXdQbHhjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYRnh1SUNBZ0lEd3ZaR2wyUGx4Y2Jsd2lPMXh1ZlN4Y0lqUmNJanBtZFc1amRHbHZiaWhqYjI1MFlXbHVaWElzWkdWd2RHZ3dMR2hsYkhCbGNuTXNjR0Z5ZEdsaGJITXNaR0YwWVNrZ2UxeHVJQ0FnSUhaaGNpQm9aV3h3WlhJN1hHNWNiaUFnY21WMGRYSnVJRndpWEZ4dUlDQWdJQ0FnSUNBOFlTQm9jbVZtUFZ4Y1hDSmNJbHh1SUNBZ0lDc2dZMjl1ZEdGcGJtVnlMbVZ6WTJGd1pVVjRjSEpsYzNOcGIyNG9LQ2hvWld4d1pYSWdQU0FvYUdWc2NHVnlJRDBnYUdWc2NHVnljeTUxY213Z2ZId2dLR1JsY0hSb01DQWhQU0J1ZFd4c0lEOGdaR1Z3ZEdnd0xuVnliQ0E2SUdSbGNIUm9NQ2twSUNFOUlHNTFiR3dnUHlCb1pXeHdaWElnT2lCb1pXeHdaWEp6TG1obGJIQmxjazFwYzNOcGJtY3BMQ2gwZVhCbGIyWWdhR1ZzY0dWeUlEMDlQU0JjSW1aMWJtTjBhVzl1WENJZ1B5Qm9aV3h3WlhJdVkyRnNiQ2hrWlhCMGFEQWdJVDBnYm5Wc2JDQS9JR1JsY0hSb01DQTZJSHQ5TEh0Y0ltNWhiV1ZjSWpwY0luVnliRndpTEZ3aWFHRnphRndpT250OUxGd2laR0YwWVZ3aU9tUmhkR0Y5S1NBNklHaGxiSEJsY2lrcEtWeHVJQ0FnSUNzZ1hDSmNYRndpSUdOc1lYTnpQVnhjWENKbGVIUmxjbTVoYkNCc2FXNXJYRnhjSWlCMFlYSm5aWFE5WEZ4Y0lsOWliR0Z1YTF4Y1hDSStQR2tnWTJ4aGMzTTlYRnhjSW1aaElHWmhMV3hwYm10Y1hGd2lQand2YVQ0ZzVMMmM1Wk9CNlpPKzVvNmxQQzloUGlCY0lqdGNibjBzWENKamIyMXdhV3hsY2x3aU9sczNMRndpUGowZ05DNHdMakJjSWwwc1hDSnRZV2x1WENJNlpuVnVZM1JwYjI0b1kyOXVkR0ZwYm1WeUxHUmxjSFJvTUN4b1pXeHdaWEp6TEhCaGNuUnBZV3h6TEdSaGRHRXBJSHRjYmlBZ0lDQjJZWElnYzNSaFkyc3hPMXh1WEc0Z0lISmxkSFZ5YmlBb0tITjBZV05yTVNBOUlHaGxiSEJsY25NdVpXRmphQzVqWVd4c0tHUmxjSFJvTUNBaFBTQnVkV3hzSUQ4Z1pHVndkR2d3SURvZ2UzMHNaR1Z3ZEdnd0xIdGNJbTVoYldWY0lqcGNJbVZoWTJoY0lpeGNJbWhoYzJoY0lqcDdmU3hjSW1adVhDSTZZMjl1ZEdGcGJtVnlMbkJ5YjJkeVlXMG9NU3dnWkdGMFlTd2dNQ2tzWENKcGJuWmxjbk5sWENJNlkyOXVkR0ZwYm1WeUxtNXZiM0FzWENKa1lYUmhYQ0k2WkdGMFlYMHBLU0FoUFNCdWRXeHNJRDhnYzNSaFkyc3hJRG9nWENKY0lpazdYRzU5TEZ3aWRYTmxSR0YwWVZ3aU9uUnlkV1Y5S1R0Y2JpSXNJblpoY2lCM2IzSnJVMlZ5ZG1salpTQTlJSEpsY1hWcGNtVW9KeTR1THk0dUwzTmxjblpwWTJVdmQyOXlhM01uS1R0Y2JseHVkbUZ5SUhkdmNtdHpUR2x6ZEZSbGJYQWdQU0J5WlhGMWFYSmxLQ2N1TGk5d2RXSnNhV012ZDI5eWEzTXRiR2x6ZEM1b1luTW5LVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCN1hHNGdJQ0FnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUZFdVVISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsTENCeVpXcGxZM1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQzhxNUwyYzVaT0I2YUcxNloyaUtpOWNiaUFnSUNBZ0lDQWdJQ0FnSUcxNVFYQndMbTl1VUdGblpVbHVhWFFvSjNkdmNtdHpKeXdnWm5WdVkzUnBiMjRvY0dGblpTa2dlMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZDI5eWExTmxjblpwWTJVdVoyVjBUR2x6ZENncExuUm9aVzRvWm5WdVkzUnBiMjRvWkdGMFlTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBa0pDaGNJaU5xY3kxM2IzSnJjeTFzYVhOMFhDSXBMbWgwYld3b2QyOXlhM05NYVhOMFZHVnRjQ2hrWVhSaEtTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5cGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnNVlpZDVhZUw1WXlXNVp1KzU0bUg2TFdXNVlxZzZMMjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBcUwxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J0ZVVGd2NDNXBibWwwU1cxaFoyVnpUR0Y2ZVV4dllXUW9KeTV3WVdkbEp5azdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5cGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnNVp1KzVZYU01cldQNktlSVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FxTDF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtKQ2duTG5Ob2IzY3RjR2h2ZEc4bktTNXZiaWduWTJ4cFkyc25MQ0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGNpQWtKSFJvYVhNZ1BTQWtKQ2gwYUdsektUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkMjl5YTFObGNuWnBZMlV1WjJWMFFubEpaQ2drSkhSb2FYTXVZWFIwY2loY0ltUmhkR0V0YVdSY0lpa3BMblJvWlc0b1puVnVZM1JwYjI0b1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHMTVRWEJ3TG5Cb2IzUnZRbkp2ZDNObGNpaDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIQm9iM1J2Y3pvZ1pHRjBZUzVzYVhOMExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1lYcDVURzloWkdsdVp6b2dkSEoxWlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdobGJXVTZJQ2RrWVhKckp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1ltRmphMHhwYm10VVpYaDBPaUFuNkwrVTVadWVKMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcExtOXdaVzRvS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0NrN1hHNGdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNibjA3WEc0aUxDSjJZWElnWW1GcGEyVlRkVzF0WVhKNUlEMGdXM3RjYmlBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlpWVdsclpYTjFiVzFoY25rdk1ERXVjRzVuSnl4Y2JpQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dWZTd2dlMXh1SUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkpoYVd0bGMzVnRiV0Z5ZVM4d01pNXdibWNuTEZ4dUlDQWdJR05oY0hScGIyNDZJQ2NuWEc1OUxDQjdYRzRnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJWemRXMXRZWEo1THpBekxuQnVaeWNzWEc0Z0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYm4wc0lIdGNiaUFnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWlZV2xyWlhOMWJXMWhjbmt2TURRdWNHNW5KeXhjYmlBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1ZlN3Z2UxeHVJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwySmhhV3RsYzNWdGJXRnllUzh3TlM1d2JtY25MRnh1SUNBZ0lHTmhjSFJwYjI0NklDY25YRzU5TENCN1hHNGdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlZ6ZFcxdFlYSjVMekEyTG5CdVp5Y3NYRzRnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNibjBzSUh0Y2JpQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5aVlXbHJaWE4xYlcxaGNua3ZNRGN1Y0c1bkp5eGNiaUFnSUNCallYQjBhVzl1T2lBbkoxeHVmU3dnZTF4dUlDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJKaGFXdGxjM1Z0YldGeWVTOHdPQzV3Ym1jbkxGeHVJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNTlMQ0I3WEc0Z0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVnpkVzF0WVhKNUx6QTVMbkJ1Wnljc1hHNGdJQ0FnWTJGd2RHbHZiam9nSnlkY2JuMHNJSHRjYmlBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlpWVdsclpYTjFiVzFoY25rdk1UQXVjRzVuSnl4Y2JpQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dWZTd2dlMXh1SUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkpoYVd0bGMzVnRiV0Z5ZVM4eE1TNXdibWNuTEZ4dUlDQWdJR05oY0hScGIyNDZJQ2NuWEc1OUxDQjdYRzRnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJWemRXMXRZWEo1THpFeUxuQnVaeWNzWEc0Z0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYm4wc0lIdGNiaUFnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWlZV2xyWlhOMWJXMWhjbmt2TVRNdWNHNW5KeXhjYmlBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1ZlN3Z2UxeHVJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwySmhhV3RsYzNWdGJXRnllUzh4TkM1d2JtY25MRnh1SUNBZ0lHTmhjSFJwYjI0NklDY25YRzU5TENCN1hHNGdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlZ6ZFcxdFlYSjVMekUxTG5CdVp5Y3NYRzRnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNibjBzSUh0Y2JpQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5aVlXbHJaWE4xYlcxaGNua3ZNVFl1Y0c1bkp5eGNiaUFnSUNCallYQjBhVzl1T2lBbkoxeHVmU3dnZTF4dUlDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJKaGFXdGxjM1Z0YldGeWVTOHhOeTV3Ym1jbkxGeHVJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNTlMQ0I3WEc0Z0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVnpkVzF0WVhKNUx6RTRMbkJ1Wnljc1hHNGdJQ0FnWTJGd2RHbHZiam9nSnlkY2JuMHNJSHRjYmlBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlpWVdsclpYTjFiVzFoY25rdk1Ua3VjRzVuSnl4Y2JpQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dWZTd2dlMXh1SUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkpoYVd0bGMzVnRiV0Z5ZVM4eU1DNXdibWNuTEZ4dUlDQWdJR05oY0hScGIyNDZJQ2NuWEc1OVhUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JpWVdsclpWTjFiVzFoY25rN1hHNGlMQ0oyWVhJZ1ltRnphV05FWVhSaElEMGdXM3RjYmlBZ0lDQjBhWFJzWlRvZ0orV2Z1dWFjck9TL29lYUJyeWNzWEc0Z0lDQWdZMjl1ZEdWdWREb2dXM3RjYmlBZ0lDQWdJQ0FnYzNWaWRHbDBiR1U2SUNmbHA1UGxrSTBuTEZ4dUlDQWdJQ0FnSUNCemRXSmpiMjUwWlc1ME9pQW42TFcxNUx5YTZLZUJLRVoxY21saktTZGNiaUFnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJSE4xWW5ScGRHeGxPaUFuNW9DbjVZaXJKeXhjYmlBZ0lDQWdJQ0FnYzNWaVkyOXVkR1Z1ZERvZ0orZVV0eWRjYmlBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUhOMVluUnBkR3hsT2lBbjVZZTY1NVNmNWJtMDVweUlKeXhjYmlBZ0lDQWdJQ0FnYzNWaVkyOXVkR1Z1ZERvZ0p6RTVPRExsdWJRMDVweUlKMXh1SUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnYzNWaWRHbDBiR1U2SUNmbXNKSG1sNDhuTEZ4dUlDQWdJQ0FnSUNCemRXSmpiMjUwWlc1ME9pQW41ckdKNXBlUEoxeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdjM1ZpZEdsMGJHVTZJQ2ZscVpybHA3dm5pcmJsaHJVbkxGeHVJQ0FnSUNBZ0lDQnpkV0pqYjI1MFpXNTBPaUFuNWJleTVhbWFKMXh1SUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnYzNWaWRHbDBiR1U2SUNmbnNZM290SzhuTEZ4dUlDQWdJQ0FnSUNCemRXSmpiMjUwWlc1ME9pQW41ckt6NVkyWEoxeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdjM1ZpZEdsMGJHVTZJQ2ZsaGJUb3RxUG5pTEhscGIwbkxGeHVJQ0FnSUNBZ0lDQnpkV0pqYjI1MFpXNTBPaUFuNTVTMTVhMlE0NENCNTZHczVMdTI0NENCUkVsWkoxeHVJQ0FnSUgxZFhHNTlMQ0I3WEc0Z0lDQWdkR2wwYkdVNklDZm9nNHptbWEva3U0dm51NDBuTEZ4dUlDQWdJR052Ym5SbGJuUTZJRnQ3WEc0Z0lDQWdJQ0FnSUhOMVluUnBkR3hsT2lBbjViZWw1TDJjNTd1UDZhcU1KeXhjYmlBZ0lDQWdJQ0FnYzNWaVkyOXVkR1Z1ZERvZ0p6RXk1Ym0wVjBWQzVMcW41Wk9CNXA2MjVwNkU1NkNVNVkrUkoxeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdjM1ZpZEdsMGJHVTZJQ2ZtcjVYa3VKcnBtYUxtb0tFbkxGeHVJQ0FnSUNBZ0lDQnpkV0pqYjI1MFpXNTBPaUFuNllPUjViZWU2TDI3NWJlbDVMaWE1YTJtNlptaUtESXdNREIrTWpBd05PVzV0Q2tuWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCemRXSjBhWFJzWlRvZ0orYUpnT1MvcnVTNGsrUzRtaWNzWEc0Z0lDQWdJQ0FnSUhOMVltTnZiblJsYm5RNklDZm5sTFhsclpEa3VJN2t2NkhtZ2EvbWlvRG1uSzhuWEc0Z0lDQWdmVjFjYm4wc0lIdGNiaUFnSUNCMGFYUnNaVG9nSitpQmxPZXp1K2FXdWVXOGp5Y3NYRzRnSUNBZ1kyOXVkR1Z1ZERvZ1czdGNiaUFnSUNBZ0lDQWdjM1ZpZEdsMGJHVTZJQ2ZubExYb3I1MG5MRnh1SUNBZ0lDQWdJQ0J6ZFdKamIyNTBaVzUwT2lBbk1UTTRNVEU0TmpreU1EZ25YRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0J6ZFdKMGFYUnNaVG9nSjBWdFlXbHNKeXhjYmlBZ0lDQWdJQ0FnYzNWaVkyOXVkR1Z1ZERvZ0oyWjFjbWxqUUhGeExtTnZiU2RjYmlBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUhOMVluUnBkR3hsT2lBbjU0Nnc1TDJQNVoyQUp5eGNiaUFnSUNBZ0lDQWdjM1ZpWTI5dWRHVnVkRG9nSitXTWwrUzZyT1M2cHVXNmhPVzhnT1dQa2VXTXV1ZW5rZVdJbStXTmdlUzRpZWlobHlkY2JpQWdJQ0I5WFZ4dWZWMDdYRzVjYm5aaGNpQm1ZWFpwWTI5dVJHRjBZU0E5SUh0Y2JpQWdJQ0IwYVhSc1pUb2dKMloxY21sakp5eGNiaUFnSUNCbVlYWnBZMjl1T2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012ZW1oaGIzcG9ZVzh1YW5Cbkp5eGNiaUFnSUNCa1pYTmpPaUFuNUxpcTVMcTY2SU85NVlxYjVweUo2Wm1RNzd5TTVadWk2WmlmNVlxYjZZZVA1cGVnNlptUTc3eUI2SzZwNXIrQTVvT0Y1NGVENTRPbjZJZXE1YmV4Nzd5TTVvcUs1NEdyNVlXSjU0V241THF1NVlpcjVMcTZJU2RjYm4wN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdlMXh1WEc0Z0lDQWdMeXBjYmlBZ0lDRG9qcmZsajVibWlZRG1uSW5sbjdybW5Lemt2NkhtZ2E5Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0JuWlhSTWFYTjBRV3hzT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlGRXVVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGMyOXNkbVVvWW1GemFXTkVZWFJoS1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lHZGxkRVpoZG1samIyNUVZWFJoT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlGRXVVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGMyOXNkbVVvWm1GMmFXTnZia1JoZEdFcE8xeHVJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlYRzU5TzF4dUlpd2lkbUZ5SUdKc2IyTnJSR0YwWVNBOUlGdDdYRzRnSUNBZ2FXUTZJQ2RoWW05MWRHMWxKeXhjYmlBZ0lDQjBhWFJzWlRvZ0oraUhxdWFJa2VTN2krZTdqU2NzWEc0Z0lDQWdZMjl1ZEdWdWREb2dXeWZvaDdUbGlwdmt1bzVYUlVMbm9KVGxqNUhsdDZYbnFJdmxqSmJvaDZybGlxamxqSmJubW9Ubm9KVG5xYmJ2dkl3OFlTQm9jbVZtUFZ3aWFIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwyWjFjbWxqTFhwb1lXOHZabVY2TDF3aUlIUmhjbWRsZEQxY0lsOWliR0Z1YTF3aUlHTnNZWE56UFZ3aWJHbHVheUJsZUhSbGNtNWhiRndpUGtaRldqd3ZZVDdsaVkzbnE2L21xS0hsblpmbGpKYmx0NlhucUl2bHZJRGxqNUhtb1libW5yYmt2WnpvZ0lYamdJSW5MQ0FuNXB1KzVMaU81NzZPNVp1OTU2R0Y2TEMzNVp1aTZaaWY2SUdVNVpDSTU2Q1U1WStSNVlXMzVweUo1WWFiNWJlbDVhNko1WVdvNkxXRTZMU281NXFFNTcyUjU3dWM1WWVHNVlXbDU3Tzc1WWlYNkwydjVMdTI0NENCNVp1OTVZYUY2YUcyNTdxbjVMcVM2SUdVNTcyUjVhNko1WVdvNVlXczVZKzQ1NXFFNXBDYzU3U2k1NW0rNTZlUjQ0Q0I1cUM0NWIrRDVhNko1WVdvNDRDQjZLZUc2YUtSNTV1MDVwS3Q0NENCNXBtNjZJTzk1NkdzNUx1MjU2Mko1YVNuNUxpdDVaNkw2YUc1NTV1dTU1cUU1WW1ONTZ1djVwNkU1YnU2NDRDQzU0Nnc2TFNmNkxTajVMcXM1TGljNXBDYzU3U2k1TGlPNWFTbjVwV3c1bzJ1NWJtejVZK3c1THlYNWFTYTVwV3c1bzJ1NTdHNzVMcW41Wk9CNTVxRTVZbU41NnV2NXA2MjVwNkU0NENDSnl3Z0orUzl2K2VVcU9XYnZlbVpoZVdKamVheXYrZWFoT1czcGVlb2krV01sdWFLZ09hY3IrYVBrT21ybU9XYm91bVluK2VnbE9XUGtlYVZpT2VPaCtXUGl1bWh1ZWVicnVTNnArV1RnZWVhaE9XUHIrZTd0T2FLcE9hQXArV1NqT2FKcWVXeGxlYUFwK09BZ3VXV2hPUzZqdVdOaitpd2crbWh1ZWVicnVlYWhPZXRsdVdJa3VPQWdlaXV2dWl1b2VPQWdlbWNnT2F4Z3VpTWcrV2J0T1dTak9taHVlZWJydWkvbStXNnB1T0FnZVdraE9lUWh1aW5vK1dHcytXUWhPZU9yK2lLZ3VtWHJ1bWltT09BZ2lkZFhHNTlMQ0I3WEc0Z0lDQWdhV1E2SUNkdVpXRnlKeXhjYmlBZ0lDQjBhWFJzWlRvZ0oraS9rZWFjbithbWd1V0d0U2NzWEc0Z0lDQWdZMjl1ZEdWdWREb2dXeWZrdW80eU1ERTI1Ym0wT2VhY2lPUzd1K2lCak9TNnJPUzRuT1dWaHVXZmp1YVFuT2Uwb3VTNGp1V2twK2FWc09hTnJ1UzRtdVdLb2VtRHFDL21sYkRtamE3a3VxZmxrNEhub0pUbGo1SHBnNmptbnJibW5vVGx1SWpsc3BmdnZJem90Si9vdEtQbWhhZm5uTHpwb2Jubm02N2pnSUhrdXF6a3VKemxpcWpsaXB2amdJSGt1cXprdUp6bnJxSGxycmJqZ0lIbGhyUG5yWmJrdTZyb29ham5tNWpqZ0lIbGdMN2xrS3puczd2bnU1L2pnSUhtaklmbW9JZm5ycUhua0libnM3dm51NS9qZ0lIbHJwN21sN2JsdXBUbmxLampnSUhsajRybGhiYm5wN3ZsaXFqbnE2L3BvYm5ubTY3bm1vVGxpWTNucTYvbW5vVGx1N3JsdWJibWpJSG51NjNtajVEa3Zwdmx1cFhsc1lMbHQ2WG5xSXZtaW9EbW5LL21sSy9taklIdnZJemx2Slhwb29ibWlvRG1uSy9sbTZMcG1KL2xycDduanJEa3VxZmxrNEhsaXAvb2c3M2pnSUluWFZ4dWZTd2dlMXh1SUNBZ0lHbGtPaUFuWjJGdVozZGxhU2NzWEc0Z0lDQWdkR2wwYkdVNklDZm1oSS9sa0pIbHNwZmt2WTBuTEZ4dUlDQWdJR052Ym5SbGJuUTZJRnNuVjBWQzVMcW41Wk9CNXA2MjVwNkU1YmlJNDRDQjZhdVk1N3FuNVlXbzVxQ0k1YmVsNTZpTDViaUk0NENCNW9xQTVweXY1NjZoNTVDRzZJR001TDJONDRDQjVMcW41Wk9CNklHTTVMMk5KMTFjYm4wc0lIdGNiaUFnSUNCcFpEb2dKM3BvYVhwbEp5eGNiaUFnSUNCMGFYUnNaVG9nSithRWorV1FrZWlCak9pMG95Y3NYRzRnSUNBZ1kyOXVkR1Z1ZERvZ1d5Zm90Si9vdEtQa3VxZmxrNEhwbklEbXNZTGxpSWJtbnBEbGtvem1ucmJtbm9Ub3JyN29ycUhqZ0lIbGo0TGt1STduczd2bnU1L21pb0RtbksvcGdJbmxub3ZsajRybW9Mamx2NFBtcUtIbG5aZm1pb0RtbksvcHFvem9yNEhsa296bWlvRG1uSy9tbEx2bGhiUHZ2SXpscnA3bmpyRGx1YmJscm96bGxvVGt1cWZsazRIbGlwL29nNzN2dkl6bGpZL29zSVBtdFl2b3I1WGpnSUhrdUlybnVyL2pnSUhsajQzcHBvam5yWW5tdFlIbnFJdnZ2SXptanFmbGlMYmt1cWZsazRIb3Y1dmx1cWJsajRybHBJVG5rSWJsa0lUbmpxL29pb0xwbDY3cG9wanZ2SXprdjUzb3I0SGt1cWZsazRIbW5JRG51NGpvdEtqcGg0L2pnSUluWFZ4dWZTd2dlMXh1SUNBZ0lHbGtPaUFuYzNsemRHVnRKeXhjYmlBZ0lDQjBhWFJzWlRvZ0orV0ZzK1M2anVhY3JPZXp1K2U3bnljc1hHNGdJQ0FnWTI5dWRHVnVkRG9nV3lmbW5Lem5zN3ZudTUva3ZiL25sS2hHUlZybGlZM25xNi9tcUtIbG5aZmxqSmJsdklEbGo1SG1vWWJtbnJibG43cmt1bzVHY21GdFpYZHZjbXMzNXA2RTVidTY0NENDNXJ5VTU2UzY1THFHNTZlNzVZcW81NnV2VWtWTjU1cUU2S2VqNVlhejVwYTU1cUdJNDRDQzVZVzg1YTY1NUx1NzVMMlY1N3VJNTZ1djVaS001Ym16NVkrdzQ0Q0I1WSt2NUx1bDVZYUY1YldNNVp5bzVMdTc1TDJWUVZCUTVvaVc1NmU3NVlxbzU2dXY1YnFVNTVTbzVMaXQ1cldQNktlSTQ0Q0NKeXdnSnp4aElHaHlaV1k5WENKb2RIUndjem92TDJkcGRHaDFZaTVqYjIwdlpuVnlhV010ZW1oaGJ5OW1aWG92WENJZ2RHRnlaMlYwUFZ3aVgySnNZVzVyWENJZ1kyeGhjM005WENKc2FXNXJJR1Y0ZEdWeWJtRnNYQ0krUmtWYVBDOWhQaURtbUsvcG5hTGxrSkVnNVltTjU2dXY1cWloNVoyWDVZeVc1YmVsNTZpTElPZWFoT1c4Z09XUGtlYWhodWFldHVPQWd1UzR1K2ltZ2VTNHV1aW5vK1dHc3lEbGlZM25xNi9sdklEbGo1SGxwSnJrdXJycHE1am1sWWpsalkva3ZaempnSUhtajVEcHE1amx2SURsajVIb3RLanBoNC9qZ0lIbGo0cnBvYm5ubTY3bGlwL29nNzNtaWFubHNaWG5tb1RsdjZ2cGdKL292NjNrdTZQbGtvemxqNi9udTdUbWlxVG1nS2ZucllucGw2N3BvcGpqZ0lMbW9Mamx2NFBsaklYbWk2emxpcC9vZzczbXFLSGxuWmZsakpiamdJSG51NVBtbm9Ub3A0VG9qSVBsakpiamdJSGxqNHJsdklEbGo1SG9oNnJsaXFqbGpKYmpnSUluWFZ4dWZTd2dlMXh1SUNBZ0lHbGtPaUFuWTJGeVpXVnlMV052WkdVbkxGeHVJQ0FnSUhScGRHeGxPaUFuNTY2QTVZNkc1cnFRNTZDQjVZK0M2SUNESnl4Y2JpQWdJQ0JqYjI1MFpXNTBPaUJiSitLQXFqeGhJR2h5WldZOVhDSm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZablZ5YVdNdGVtaGhieTlqWVhKbFpYSXZYQ0lnZEdGeVoyVjBQVndpWDJKc1lXNXJYQ0lnWTJ4aGMzTTlYQ0pzYVc1cklHVjRkR1Z5Ym1Gc1hDSSthSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMMloxY21sakxYcG9ZVzh2WTJGeVpXVnlMend2WVQ0blhWeHVmU3dnZTF4dUlDQWdJR2xrT2lBbmVpMTNiM0pyWm14dmR5MWpiMlJsSnl4Y2JpQWdJQ0IwYVhSc1pUb2dKMFpGV3VXSmplZXJyK2Fvb2VXZGwrV01sdVczcGVlb2krUzdpK2U3amVXUGl1YTZrT2VnZ1Njc1hHNGdJQ0FnWTI5dWRHVnVkRG9nV3lmaWdLbzhZU0JvY21WbVBWd2lhSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMMloxY21sakxYcG9ZVzh2Wm1WNkwxd2lJSFJoY21kbGREMWNJbDlpYkdGdWExd2lJR05zWVhOelBWd2liR2x1YXlCbGVIUmxjbTVoYkZ3aVBtaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOW1kWEpwWXkxNmFHRnZMMlpsZWk4OEwyRStKMTFjYm4wc0lIdGNiaUFnSUNCcFpEb2dKM2R2Y21RbkxGeHVJQ0FnSUhScGRHeGxPaUFuZDI5eVpPZUppT2V1Z09XT2hpY3NYRzRnSUNBZ1kyOXVkR1Z1ZERvZ1d5YzhZU0JvY21WbVBWd2lhSFIwY0RvdkwzZDNkeTVvWlhOMGRXUjVMbU52YlM5allYSmxaWEl2WTJGeVpXVnlMbVJ2WTNoY0lpQmpiR0Z6Y3oxY0lteHBibXNnWlhoMFpYSnVZV3hjSWlCMFlYSm5aWFE5WENKZllteGhibXRjSWo1b2RIUndPaTh2ZDNkM0xtaGxjM1IxWkhrdVkyOXRMMk5oY21WbGNpOWpZWEpsWlhJdVpHOWplRHd2WVQ0blhWeHVmVjA3WEc1Y2JtWjFibU4wYVc5dUlHbHVRWEp5WVhrb1pXeGxiU3dnWVhKeUxDQnBLU0I3WEc0Z0lDQWdkbUZ5SUd4bGJqdGNibHh1SUNBZ0lHbG1JQ2hoY25JcElIdGNiaUFnSUNBZ0lDQWdiR1Z1SUQwZ1lYSnlMbXhsYm1kMGFEdGNiaUFnSUNBZ0lDQWdhU0E5SUdrZ1B5QnBJRHdnTUNBL0lFMWhkR2d1YldGNEtEQXNJR3hsYmlBcklHa3BJRG9nYVNBNklEQTdYRzVjYmlBZ0lDQWdJQ0FnWm05eUlDZzdJR2tnUENCc1pXNDdJR2tyS3lrZ2UxeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QlRhMmx3SUdGalkyVnpjMmx1WnlCcGJpQnpjR0Z5YzJVZ1lYSnlZWGx6WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYVNCcGJpQmhjbklnSmlZZ1lYSnlXMmxkSUQwOVBTQmxiR1Z0S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdMVEU3WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdlMXh1SUNBZ0lDOHFYRzRnSUNBZ0lPaU90K1dQbHVXRnMrUzZqdWFjck9lenUrZTduK2VhaE9TL29lYUJyMXh1SUNBZ0lDQXFMMXh1SUNBZ0lHZGxkRUZpYjNWMFUzbHpkR1Z0T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUhKMGJrUmhkR0VnUFNCYlhUdGNiaUFnSUNBZ0lDQWdkbUZ5SUd4cGJXbDBJRDBnV3lkemVYTjBaVzBuWFR0Y2JseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1VTNVFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1Vc0lISmxhbVZqZENrZ2UxeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCaWJHOWphMFJoZEdFdWJXRndLR1oxYm1OMGFXOXVLR2wwWlcwcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYVc1QmNuSmhlU2hwZEdWdExtbGtMQ0JzYVcxcGRDd2dNQ2tnUGlBdE1Ta2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeWRHNUVZWFJoTG5CMWMyZ29hWFJsYlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGMyOXNkbVVvY25SdVJHRjBZU2s3WEc0Z0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwc1hHNWNiaUFnSUNBdktseHVJQ0FnSUNEb2pyZmxqNWJwcHBicG9iWGt2NkhtZ2E5Y2JpQWdJQ0FnS2k5Y2JpQWdJQ0JuWlhSSmJtUmxlRVJoZEdFNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ2NuUnVSR0YwWVNBOUlGdGRPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2JHbHRhWFFnUFNCYkoyRmliM1YwYldVbkxDQW5ibVZoY2ljc0lDZG5ZVzVuZDJWcEp5d2dKM3BvYVhwbEp5d2dKM290ZDI5eWEyWnNiM2N0WTI5a1pTY3NJQ2QzYjNKa0oxMDdYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRkV1VUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdZbXh2WTJ0RVlYUmhMbTFoY0NobWRXNWpkR2x2YmlocGRHVnRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHbHVRWEp5WVhrb2FYUmxiUzVwWkN3Z2JHbHRhWFFzSURBcElENGdMVEVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjblJ1UkdGMFlTNXdkWE5vS0dsMFpXMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWE52YkhabEtISjBia1JoZEdFcE8xeHVJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlYRzU5TzF4dUlpd2lkbUZ5SUdwcGJtZHNhVVJoZEdFZ1BTQmJlMXh1SUNBZ0lIUnBkR3hsT2lCY0lqSXdNVEorTWpBeE5sd2lMRnh1SUNBZ0lHTnZiWEJ2Ym5rNklGd2k1WXlYNUxxczVhV0g2Sm1PTXpZdzU2ZVI1b3FBNXB5SjZabVE1WVdzNVkrNDc3eUk1YVdINmFPZTU3K1U2SW02Nzd5SlhDSXNYRzRnSUNBZ2FXNTBjbTg2SUZ0Y0lqSXdNVExsdWJUbGlxRG5tNTh6TmpEdnZJemxpWTNtbkovbmk2em5xNHZvdEovb3RLUG92NWptbUsva3Y1M2xyNGJwb2Jubm02N25tb1RtbGJUa3VLcm5tYjducDVIbGlZM25xNi9sdWJib3VxdmxoYnprdXFmbGs0SG51NC9ua0liamdJSGxrSTdudTYza3VMdm1sTHZubWI3bnA1SG52SmJvdnBIbG1hanZ2SXpwZzZqbGlJYmxpcC9vZzczb29xdm5tYjdsdXFibGtvemt1cExsaXFqbm1iN25wNUhtaW9Ub29xM2xnSi9waWJUamdJTGt1S1Rsa2FqbGhvWGt1SXJudXIvbnA3dmxpcWpuaVlqbm1iN25wNUh2dkl6bGpZL29zSVBscElUbmtJYmxrSVRuanEvb2lvTHBsNjdwb3BqdnZJemx1YlRsdXBYb2pyZmx2cGZrdkpqbnA0RGxrWmpsdDZYbGo0cm9ncUhucGFqbHBaYmxpckh2dkl6cG1vL2xrSTdrdTQ3bm1iN25wNUhrdUpybGlxSHBnNmpwbDZqbHViYmxoYVV6TmpEbW5JRGxwS2ZubW9UbGlZM25xNi9taW9EbW5LL2xtNkxwbUo4dFYwVkM1Ym16NVkrdzZZT29MK1dsaCtpSW51V2JvdU9BZ2x3aUxDQmNJakl3TVRUbHViVG10TDdwcWJ2bHJvbmxoYWpsamF2bG82dnBnNmpwbDZqb3RKL290S016TmpEbHJvbmxoYWpsamF2bG82dFdTVkRrdkpybGtaamt1SzNsdjRQdnZJemxpSnZwZ0tEbW5LemxuTEJrWldKMVorVzhnT1dQa2Vhb29lVzhqKys4ak9XOXUrVzZsZWlFc2VlbXUrZWdsT1dQa2VlT3IrV2lnK1d2dWVXdW91YUl0K2VycitlYWhPUytuZWkxbHUrOGpPV2ludVdLb09lNnYrUzRpdVM0Z09tVXJ1VzhnT1dRcjJSbFluVm43N3lNNWIrcjZZQ2Y1YTZhNUwyTjZaZXU2YUtZNzd5TTVhU241YVNuNW8rUTZhdVk1YTZpNW9pMzU2dXY1WWFGNWJXTVYwVkM1NXFFNTZDVTVZK1I1cFdJNTQ2SDQ0Q0M1WkNNNXBlMjVZMlA2TENENXBTdjVveUI1YjZ1NWErRzc3eUk1WWFGNWJXTWQyVmk3N3lKNDRDQjVvS0U1b0tFS09XR2hlVzFqSGRsWWluamdJSG1pWXZtbkxybGphdmxvNnNvNXJTNzVZcW9LZU9BZ2VhMWdlbUhqK1dOcStXanErKzhpT1d1bU9lOWtlKzhpZU9BZ2VXRmplaTB1WGRwWm1udnZJamxycGpudlpIdnZJbmpnSUhuZ3Jubm5admx1YlBsajdEdnZJamxycGpudlpIdnZJbmpnSUhrdlpQcHFvemt1SzNsdjRQdnZJamxycGpudlpIdnZJbm5yWW5wb2Jubm02N2pnSUpjSWl3Z1hDSXlNREUxNWJtMDVZaWQ2TENENVlXbDZJQ0I1WkdvNWJpbTZhS0c1NXFFNXBtNjZJTzk1NkdzNUx1MjZZT282WmVvNzd5TTVZbU41cHlmNTR1czU2dUw2TFNmNkxTak16WXc1NnlzNUxpQTVMaXE1NXUwNXBLdDZhRzU1NXV1NWJDUDVyQzA1cnUwNTV1MDVwS3Q1NzJSNTZ1WjU1cUU1cEN0NWJ1NjU2Q1U1WStSNDRDQllYQnc1WWFGNWJXTVNEWGpnSUhsbFlibG40N2xycGpudlpIbm1vVGxrSVRucDQzbGtJamt2WnpsajVIbGxLN210THZsaXFqbGlZM25xNi9taW9EbW5LL21sSy9taklIamdJTGxrSTdudTYzbGpZL2xpcW5sdklEbGo1RXpOall6VFdubmpxbmpnSUhtZ3AvbnFicFVWdU9BZ2VhNHVPYUlqK1dHaGVXMWpPZW5nT1djdXVTN3BlV1BpdWlLc2Vha2t1ZWJ0T2FTcmVPQWdlZUdpdWVNcTFSVzQ0Q0I1NjJKNTV1MDVwS3Q2YUc1NTV1dTQ0Q0NYQ0pkTEZ4dUlDQWdJR2R5WVdSbE9pQmJYQ0xrdUx2b3BvSGt1SnJudTZudnZKcGNJaXdnWENJek5qRG1rSnpudEtMbm1iN25wNUhtbGJUa3VLcmxpWTNucTYvb3A0VGxpSkxqZ0lIbW5vVGx1N29vNTRlVjViQys1cHlOS2VPQWdlZVp2dWVua2VlOGx1aStrZVdacUNoMVpXUnBkRzl5NVlhRjVxQzRLZU9BZ3VTNHUrV3Z2T1dRanVlcnIrbURxT1dJaGxCSVVPYW9vZVdkbCthZWhPVzd1aWpubTdqbGhiUG9yNDNtbmFIamdJSG9yNDNtbmFIbHZKWG5sS2ptcUtIbG5aY3A0NENCNVlhRjVhNjU2STYzNVkrV0tIQm9jRkYxWlhKNUtlT0FnZWU4bHVpK2tlV1pxT1dQaXVXR2hlV3V1ZVdraE9lUWhpaG9kRzFzVUhWeWFXWnBaWElwNzd5TTVZaUc1N0c3NTdPNzU3dWY0NENCNkllcTVhcVM1TDJUNTdPNzU3dWY1NjJKWENJc0lGd2k1YTZKNVlXbzVZMnI1YU9yNUx5YTVaR1k1TGl0NWIrRDQ0Q0JNell3VmtsUTVMeWE1WkdZNTZldjVZaUc1WldHNVorT0tGZHBibVJ2ZHpqa3ZKam1nNkRub0lIamdJSG52WkhtbUpQbW1JN2t2NkhuaVlmamdJSG1pSkhrdWJEbnZaSGt1SmJubFl6bW5hL2pnSUhsbEsvbGs0SGt2SnJqZ0lIcG1vL291cXQzYVdacE5FZm5pWWpqZ0lIbHZaUGx2WlBudlpIbmxMWGxyWkRrdWFiamdJSHBtTExrdUtMbGphdmxvNnNvTVM4eUx6TXZOT2FjbnluamdJSGx2WlBsdlpQbnZaSG1uSTNvbzRYamdJSGxwS25uakt2bmxMWGxtYWpsbjQ3amdJSG52WkhtbUpQb2lySG5sTERsdUlIamdJSGxwS25uakt2bGo0emxqWUhrdUlEamdJSG5sTFhvaEpIa3VKUGxycmJvdG9YbnVxZnBvb1RudXFiamdJSG1uSW5wZ1pQbGo0enBoNDNucEx6bGpJWGpnSUhsdlpQbHZaUG52WkhsajR6bGpZSGt1b3ptdEx2bGlxampnSUV6TmpEbHJvbmxoYWpvdDYvbmxMSG5yWW5rdkpmbHBKcm5pYm5tbllQcG9ibm5tNjRwNDRDQ1hDSXNJRndpNWI2dTVhK0c1WWFGNWJXTTZhRzE0NENCNW9LRTVvS0U1WWFGNWJXTTZhRzE0NENCNW9tTDVweTY1WTJyNWFPcjVyUzc1WXFvNDRDQjVyV0I2WWVQNVkycjVhT3I1YTZZNTcyUjQ0Q0I1WVdONkxTNWQybG1hZVd1bU9lOWtlT0FnZWVDdWVlZG0rVzVzK1dQc09XSmplZXJyK09BZ2VTOWsrbXFqT1M0cmVXL2crV0ZxT2VybWVPQWdsd2lMQ0JjSXVhWnV1aUR2ZWFSaE9XRGorYWN1dW1odWVlYnJ1ZWFoT1dWaHVXZmp1V3VtT2U5a2VPQWdlV3dqK2F3dE9hN3RPZWJ0T2FTcmVXRnFPZXJtZSs4aU9Xa211ZTdpT2VycjNkbFl1KzhpZU9BZ1VGUVVPV0doZVcxakVnMTQ0Q0I2SXF4NXFTUzU1dTA1cEt0NXBLdDVwUys1Wm1vTCtpQml1V2txZW1WditpL251T0FnVE0yTmpOTmFlZU9xZVdGcU9lcm1lYWVoT1c3dWkvcGdJSG5wTHpuczd2bnU1L2pnSUhucllucG9ibm5tNjdubW9SUVErV1Bpa2cxNTcyUjU2dVo1cDYyNXA2RTQ0Q0I2YUc1NTV1dTVZMlA2TENENVpLTTU2Q1U1WStSNDRDQ1hDSmRYRzU5TENCN1hHNGdJQ0FnZEdsMGJHVTZJRndpTWpBd04zNHlNREV5WENJc1hHNGdJQ0FnWTI5dGNHOXVlVG9nWENMbGpKZmt1cXpvaWI3bnA1SG52WkhrdjZIbW5JbnBtWkRsaGF6bGo3anZ2SWpsa0l6bWxybm5sTFhsclpEbWw1Zmt1SXZ2dklsY0lpeGNiaUFnSUNCcGJuUnliem9nVzF3aU1qQXdOK1c1dE9Xd3NlaUJqT1M2anVXUWpPYVd1ZWVVdGVXdGtPYVhsK1M0aSthTHBlYWNpZVdHbStXM3BlV3VpZVdGcU9pMWhPaTBxT2VhaE9lOWtlZTduT2k5citTN3R1V0ZyT1dQdU8rOGpPV0pqZWFjbitpdXZ1aXVvZU9BZ2VXSmplZXJyK09BZ2VhY2plV0tvZWVycnloUVNGQXA1TGlBNUxxNjVZV281WXlGNDRDQ1hDSXNJRndpNVpDTzU3dXQ1YmltNmFLRzZLNis2SzZoNWJpSTQ0Q0I1WW1ONTZ1djQ0Q0JVRWhRNzd5TTVMaU81WkNPNTZ1djc3eUlRK2l2cmVpb2dPKzhpZWFLZ09hY3IrZTdqK2VRaHVXTmoraXdnK1dGdHVTN2xrUG9yNjNvcUlEbGtvemxycUxtaUxmbnE2L2x0NlhucUl2bHVJanZ2SXpsalkvbGlxbERWRS9scnA3bmpyRGx1YmJscm96bGxvVG1uSURudTRoWFJVTGxzWlhuanJEbGtvemt1cVRrdXBMbGlwL29nNzNqZ0lMbGo0TGt1STdsa0k3bnU2M2t1cWZsazRIbXRZdm9yNVhqZ0lIbGo1SG5pWWpqZ0lIbWpxWG1sTGJtbExub3Y1dm5sS2ptaUxmbWxybmxqNDNwcG9qdnZJemt2Yi9ubEtqbW5JbnBtWkRubW9Ub3RZVG11cERsdklEbGo1SG51N1RtaXFRMzVMaXE1THFuNVpPQjU3cS80NENDWENJc0lGd2k1TGlhNUwyWjVhKzU1NzJSNTZ1WjVidTY2SzYrNVkrSzZMK1E2SkNsNXB5SjViNkk2YXVZNTVxRTVZVzA2SWUwNzd5TTVwdSs1NHVzNTZ1TDVidTY2WUNnNkwrUTZKQ2w1cFd3NUxpcTU3MlI1NnVaNzd5TTVibTI1YkNHNWJ5QTVycVE1N083NTd1ZjVvaVE1NGFmNTVxRTVZYUY2WU9vNVlxZjZJTzk1cWloNVoyWDVMcU01cXloNWJ5QTVZK1I1TDJPNW9pUTVweXM1YnFVNTVTbzVMcU81YmVsNUwyYzZhRzU1NXV1NUxpdDQ0Q0NYQ0pkTEZ4dUlDQWdJR2R5WVdSbE9pQmJYQ0xrdUx2b3BvSGt1SnJudTZudnZKcGNJaXdnWENMbHJwN2xrSTNsaDRibGhhWG1qcWZsaUxidnZJem51NGpucTYvbGdhWGx1cmZtbzREbW42WHZ2SXpscnA3bGtJM2xpTFpKVU9XY3NPV2RnT2V1b2VlUWh1KzhqT2FkcGVXdXZ1aXV2K1d1b3VlOWtlKzhqT21kbnVhemxlV2tsdWlCbE9XUGl1ZTlrZWU3bk9Xb2dlaURnZVd1bXVTOWplKzhqT2U5a2VlN25PaXV2K21YcnVhT3ArV0l0dSs4ak9tcm1PYUFwK2lEdmVhWHBlVy9sK1d0bU9XQ3FPV1NqT1d1b2VpdW9lT0FnbHdpWFZ4dWZTd2dlMXh1SUNBZ0lIUnBkR3hsT2lCY0lqSXdNRFIrTWpBd04xd2lMRnh1SUNBZ0lHTnZiWEJ2Ym5rNklGd2k1cmlGNVkyTzVhU241YTJtNVllNjU0bUk1NlMrNzd5STU2eXM1WVd0NUxxTDVMaWE2WU9vNzd5Skx5RGxpSnZrdUpwY0lpeGNiaUFnSUNCcGJuUnliem9nVzF3aU1qQXdOT1c1dE9hdmxlUzRtdWkvbStXRnBlV01sK1M2ck9hNGhlV05qdVdrcCtXdHB1V0h1dWVKaU9la3Z1ZXNyT1dGcmVTNmkrUzRtdW1EcU9XQm11ZTlrZWVybWVlZ2xPV1BrZSs4ak9tY2dPYXhndU9BZ2VpdXZ1aXVvU2hRVXluamdJRkdiR0Z6YU9XS3FPZVV1K09BZ2VXSmplZXJyeWhvZEcxc0wyTnpjeTlxY3luamdJSG1uSTNsaXFIbnE2OG9RVk5RS2VPQWdlYVZzT2FOcnVXNmt5aFRVVXhUWlhKMlpYSXA0NENCNXJXTDZLK1Y0NENCNUxpQTVMcTY1WVdvNVl5RjQ0Q0NYQ0lzSUZ3aTVMaTc2S2FCNUxpYTU3dXA3N3lhNXJpRjVZMk81WWU2NTRtSTU2Uys1NnlzNVlXdDVMcUw1TGlhNllPbzVhNlk1cGE1NTcyUjU2dVo3N3lNNWJ5QTVZK1I1cGF3NUxtbTQ0Q0I1NVdGNlpTQTVMbW00NENCNTdLKzVaT0I1WnUrNUxtbTViR1Y1NlM2NVpLTTVaeW81N3EvNks2aTZMU3Q3N3lNNVp1KzVMbW01NXU0NVlXejZMV0U1cGFaNUxpTDZMMjk3N3lNNVpLTTZLKzc2SUNGNTVXWjZLaUE1NjJKNVlxZjZJTzk1cWloNVoyWFhDSmRMRnh1SUNBZ0lHZHlZV1JsT2lCYlhDSXlNREExNWJtMDZMNmU1bzZKNWJlbDVMMmM1bzZsNVkyVjVZR2E1NzJSNTZ1WjVwQ2U0b0NjNVlpYjVMaWE0b0NkNDRDQ1hDSXNJRndpNTR1czU2dUw1YnlBNVkrUjc3eWFTMkZ5ZEdWc2JDam1oSS9scEtmbGlLbmt1SmJubFl6cG9iYm51cWZscnJibGhiZmxrNEhuaVl3cDVZeVg1THFzNWE2WTVwYTU1NzJSNTZ1Wjc3eU01WXlYNUxxczZZZVI1cml2NXJHOTZMMm01WVdzNVp1dDZMYUY2TGVSNTdLKzZJdXg1THlhNWE2WTVwYTU1NzJSNTZ1Wjc3eU01WXlYNUxxczU1YXY1NHVDNkl1eDZLK3Q1Wis1Nks2dDVMaXQ1YitENWE2WTVwYTU1NzJSNTZ1WjQ0Q0I1WnlvNTdxLzVvcWw1WkNONTdPNzU3dWY0NENCNVkrSzVZV281WnU5NW82STVwMkQ1NEs1NUxxUzVZcW81THFrNXJXQjVibXo1WSt3Nzd5TTVaU3Y1ck93NVkrazVZVzQ1YTYyNVlXMzU3MlI3N3lNNTRpeDU3Nk9NemJvcnFIbGpKYmxwb2JsazRIbGxZYmxuNDd2dkl4RFlYSmlZWE5sNXJHOTZMMm01cFN2NW8rMDVweU41WXFoNTcyUjVZK0s2SzY2NVoyYjc3eU01cmlGNXJXQjZMK0ZLSE4wY21WaGJXOWpaV0Z1S2VlVXRlaW5odWFjdXVtaHR1ZWJrdWluaHVtaWtlZXp1K2U3bisrOGpPV1BpdVdGdHVXdWcrV2twK1d3aitTOGdlUzRtdWU5a2Vlcm1UTXc1YVNhNUxpcVhDSXNJRndpNVpDTTVwZTI1YnlBNVkrUjZMK1E2SkNsNzd5YTVieUE1YitENkl1eDZLK3Q1YTJtNUxtZzU3MlI3N3lNNTUrbDViZXg1NzJSNTd1YzVvcUE1cHl2NUwraDVvR3Y1NzJSNzd5TTZLNjY1cGFINXBDYzU3U2k1Wis2NVp5dzc3eU02WjJlNWJpNFIyOXZaT2V5dnVXVGdlZTlrZVdkZ09XdnZPaUlxdSs4ak9tZG51VzR1RWR2YjJUb3JxSG5ycGZtbkxybWxabm5xSXZudlpIbnJZbmxuN3JrdW83bHZJRG11cERuczd2bnU1L25tb1RrdUtya3Vycm52WkhucTVuamdJSmNJbDFjYm4xZE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSHRjYmlBZ0lDQXZLbHh1SUNBZ0lPaU90K1dQbHVhZ2grbWltT1dJbCtpaHFGeHVJQ0FnSUNBcUwxeHVJQ0FnSUdkbGRFeHBjM1JVYVhSc1pUb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQjBhWFJzWlV4cGMzUWdQU0JiWFR0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUZFdVVISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsTENCeVpXcGxZM1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3BwYm1kc2FVUmhkR0V1YldGd0tHWjFibU4wYVc5dUtHbDBaVzBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFYUnNaVXhwYzNRdWNIVnphQ2hwZEdWdExuUnBkR3hsS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZ6YjJ4MlpTaDBhWFJzWlV4cGMzUXBPMXh1SUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnTHlwY2JpQWdJQ0RvanJmbGo1Ym1pWURtbklubGlKZm9vYWhjYmlBZ0lDQWdLaTljYmlBZ0lDQm5aWFJNYVhOMFFXeHNPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUZFdVVISnZiV2x6WlNobWRXNWpkR2x2YmloeVpYTnZiSFpsTENCeVpXcGxZM1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3BwYm1kc2FVUmhkR0V1YldGd0tHWjFibU4wYVc5dUtHbDBaVzBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRMblI1Y0dVZ1BTQnBkR1Z0TG5ScGRHeGxMbk53YkdsMEtDZCtKeWxiTUYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemIyeDJaU2hxYVc1bmJHbEVZWFJoS1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZWeHVmVHRjYmlJc0luWmhjaUIzYjNKclNXNW1ieUE5SUh0Y2JpQWdJQ0JrWVhSaE9pQmJlMXh1SUNBZ0lDQWdJQ0JwWkRvZ1hDSnFhV0Z3WTF3aUxGeHVJQ0FnSUNBZ0lDQjBlWEJsT2lCY0lqSXdNVEpjSWl4Y2JpQWdJQ0FnSUNBZ2JtRnRaVG9nWENMbHNJL21zTFRtdTdUbm03VG1rcTFRUStlSmlGd2lMRnh1SUNBZ0lDQWdJQ0IxY213NklGd2lhSFIwY0RvdkwycHBZUzR6TmpBdVkyNHZjR05jSWl4Y2JpQWdJQ0FnSUNBZ1pHVnpZem9nWENJek5qRG5yS3prdUlEa3VLcm5tN1Rta3EzcG9ibm5tNjd2dkl6bGlZM21uSi9uaTZ6bnE0dmx2SURsajVIb3RKL290S1BsaGFqbnE1bmxpcC9vZzczbXFLSGxuWmZtbm9UbHU3cnZ2SXpsalkvb3NJUGxwSVRua0libGtJVG5qcS9vaW9MbXRZSG5xSXZ2dklqb3Y1RG9rS1hqZ0lGUVRlT0FnZWFjamVXS29lZXJyK2FPcGVXUG8rV0l0dVd1bXVPQWdlYTFpK2l2bGVPQWdlV1BqZW1taU9ldGllKzhpZU9BZ3VTOXYrZVVxT2FLZ09hY3IrKzhtbk5sZDJselpWQnNZWGxsY3VPQWdYTnZZMnRxYytPQWdVVnRiMnBwNDRDQlpteGxlSE5zYVdSbGN1T0FnV3BSZFdWeWVTMXNZWHA1Ykc5aFpPT0FnV3BSZFdWeWVTMTBiWEJzNTYySjU3dUU1THUyWENJc1hHNGdJQ0FnSUNBZ0lHTnZkbVZ5T2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YW1saGNHTXZZMjkyWlhJdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnYkdsemREb2dXM3RjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMnBwWVhCakx6QXhMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuNTV1MDVwS3Q2YWFXNmFHMUoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlxYVdGd1l5OHdNaTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSitlYnRPYVNyZW1pa2VtQmt5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YW1saGNHTXZNRE11Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNmbWtxM21sTDdwb2JVblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMnBwWVhCakx6QTBMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuNTV1MDVwS3Q2YUtFNVpHS0oxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlxYVdGd1l5OHdOUzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSitTNHF1UzZ1dWFSaE9XRGorYWN1dWU5a2VtaHRlZUppQ2RjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmFtbGhjR012ZERBeExuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW42SzYvNlpldTU3dWY2SzZoSjF4dUlDQWdJQ0FnSUNCOVhWeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdhV1E2SUZ3aWFtbGhiVzlpYVd4bFhDSXNYRzRnSUNBZ0lDQWdJSFI1Y0dVNklGd2lNakF4TWx3aUxGeHVJQ0FnSUNBZ0lDQnVZVzFsT2lCY0l1V3dqK2F3dE9hN3RPZWJ0T2FTcmVlbnUrV0txT2VKaUZ3aUxGeHVJQ0FnSUNBZ0lDQjFjbXc2SUZ3aWFIUjBjRG92TDJwcFlTNHpOakF1WTI0dmJXOWlhV3hsWENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aTVMMi81NVNvNW9xQTVweXY3N3lhYURYbm1vUjJhV1JsYitPQWdVVnRiMnBwNDRDQllYSjBMWFJsYlhCc1lYUmw0NENCYVhOamNtOXNiT09BZ1hkbFluVndiRzloWkdWeTQ0Q0JjMjlqYTJwejQ0Q0JlbVZ3ZEc4bzVaQ081N3V0NXBTNTVMaTZhbkYxWlhKNUtWd2lMRnh1SUNBZ0lDQWdJQ0JqYjNabGNqb2dYQ0l1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXFhV0Z0YjJKcGJHVXZZMjkyWlhJdWFuQm5YQ0lzWEc0Z0lDQWdJQ0FnSUd4cGMzUTZJRnQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlxYVdGdGIySnBiR1V2TURFdWFuQm5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJwcFlXMXZZbWxzWlM4d01pNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmFtbGhiVzlpYVd4bEx6QXpMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXFhV0Z0YjJKcGJHVXZNRFF1YW5Cbkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMnBwWVcxdlltbHNaUzkwTURFdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDZm9yci9wbDY3bnU1L29ycUVuWEc0Z0lDQWdJQ0FnSUgxZFhHNGdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQnBaRG9nWENKaVlXbHJaVE0yTUhCalhDSXNYRzRnSUNBZ0lDQWdJSFI1Y0dVNklGd2lNakF4TWx3aUxGeHVJQ0FnSUNBZ0lDQnVZVzFsT2lCY0lqTTJNT2VadnVlbmtWQkQ1NG1JWENJc1hHNGdJQ0FnSUNBZ0lIVnliRG9nWENKb2RIUndPaTh2WW1GcGEyVXVjMjh1WTI5dFhDSXNYRzRnSUNBZ0lDQWdJR1JsYzJNNklGd2k1WW1ONXB5ZjU0dXM1NnVMNkxTZjZMU2o1WVdvNTZ1WjVZbU41NnV2NktlRTVZaVM0NENCNXA2RTVidTY0NENCNTVtKzU2ZVI1N3lXNkw2UjVabW80NENDNUxpNzVhKzg1WkNPNTZ1dlVFaFE2WU9vNVlpRzVxaWg1WjJYNXA2RTVidTZLT2VidU9XRnMraXZqZWFkb2VPQWdlaXZqZWFkb2VXOGxlZVVxT2Fvb2VXZGx5bmpnSUhsaG9YbHJybm9qcmZsajVZb2NHaHdVWFZsY25rcDQ0Q0I1WWFGNWE2NTVhU0U1NUNHS0doMGJXeFFkWEpwWm1sbGNpbnZ2SXpsaUlibnNidm5zN3ZudTUvamdJSG9oNnJscXBMa3ZaUG5zN3ZudTUvbnJZbmpnSUxrdmIvbmxLam1pb0RtbksvdnZKcDFaV1JwZEc5eTQ0Q0JjMjFoY25SNTQ0Q0JhR2xuYUhOc2FXUmxjdU9BZ1dGeWRDMWthV0ZzYjJmamdJRmtZWFJsY0dsamEyVnk0NENCYWxGMVpYSjVMV052YjJ0cFplT0FnV3B6YjI0eTU2Mko1N3VFNWJ1NlhDSXNYRzRnSUNBZ0lDQWdJR052ZG1WeU9pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlV6TmpCd1l5OWpiM1psY2k1d2JtY25MRnh1SUNBZ0lDQWdJQ0JzYVhOME9pQmJlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJVek5qQndZeTh3TVM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVXpOakJ3WXk4d01pNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlV6TmpCd1l5OHdNeTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJVek5qQndZeTh3TkM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVXpOakJ3WXk4d05TNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlV6TmpCd1l5OHdOaTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZbUZwYTJVek5qQndZeTkwTURFdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDZm9yci9wbDY3bnU1L29ycUVuWEc0Z0lDQWdJQ0FnSUgxZFhHNGdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQnBaRG9nWENKaVlXbHJaVE0yTUcxdlltbHNaVndpTEZ4dUlDQWdJQ0FnSUNCMGVYQmxPaUJjSWpJd01USmNJaXhjYmlBZ0lDQWdJQ0FnYm1GdFpUb2dYQ0l6TmpEbm1iN25wNUhucDd2bGlxam5pWWhjSWl4Y2JpQWdJQ0FnSUNBZ2RYSnNPaUJjSW1oMGRIQTZMeTl0TG1KaGFXdGxMbk52TG1OdmJWd2lMRnh1SUNBZ0lDQWdJQ0JrWlhOak9pQmNJdVdKamVhY24rZUxyT2VyaStXOGdPV1BrZSs4ak9lc3JPUzRnT2FjbisrOG11V09odWFYdHVTNGdPV1JxTys4aU9XSmplV1FqdWVycithVnRPUzlrK2FlaE9XN3V1KzhpZSs4bStlc3JPUzZqT2FjbisrOG11V09odWFYdHVTNHBPV1JxTys4ak9Xa3ArbUhqK1M4bU9XTWx1T0FnZWVicnVXOWxlT0FnV3hoZW5sc2IyRms0NENCNXB5SjVwZWc1WnUrNXFpaDVieVA0NENCNWEyWDVMMlQ2TENENXBXMDQ0Q0I1cGVsNWFTYzVxaWg1YnlQNDRDQzU2eXM1TGlKNXB5Zjc3eWE1WStONmFhSTVZcWY2SU85NDRDQjVZcWY2SU85NWJ5VjVhKzg1bytRNTZTNjQ0Q0JjM1ZuWjJWemRPT0FnZVdidnVXR2pPYTFqK2luaU9ldGllT0FndVM5ditlVXFIcGxjSFJ2NDRDQmFYTmpjbTlzYk9ldGllZTdoT1M3dHVPQWdsd2lMRnh1SUNBZ0lDQWdJQ0JqYjNabGNqb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwySmhhV3RsTXpZd2JXOWlhV3hsTDJOdmRtVnlMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lHeHBjM1E2SUZ0N1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5aVlXbHJaVE0yTUcxdlltbHNaUzh3TVM1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WW1GcGEyVXpOakJ0YjJKcGJHVXZNREl1YW5Cbkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkpoYVd0bE16WXdiVzlpYVd4bEx6QXpMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWlZV2xyWlRNMk1HMXZZbWxzWlM4d05DNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlltRnBhMlV6TmpCdGIySnBiR1V2TURVdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDFkWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCcFpEb2dYQ0oxYzJWeVEyVnVkR1Z5WENJc1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aU1qQXhNbHdpTEZ4dUlDQWdJQ0FnSUNCdVlXMWxPaUJjSXVXdWllV0ZxT1dOcStXanErUzhtdVdSbU9TNHJlVy9nMXdpTEZ4dUlDQWdJQ0FnSUNCa1pYTmpPaUJjSXVXSW0rbUFvT2Fjck9XY3NHUmxZblZuNWJ5QTVZK1I1cWloNWJ5UDc3eU01YjI3NWJxVjZJU3g1NmE3NTZDVTVZK1I1NDZ2NWFLRDVhKzU1YTZpNW9pMzU2dXY1NXFFNUw2ZDZMV1c3N3lNNWFLZTVZcWc1N3EvNUxpSzVMaUE2WlN1NWJ5QTVaQ3ZaR1ZpZFdmdnZJemx2NnZwZ0ovbHJwcmt2WTNwbDY3cG9wanZ2SXpscEtmbHBLZm1qNURwcTVqbHJxTG1pTGZucTYvbGhvWGx0WXhYUlVMbm1vVG5vSlRsajVIbWxZam5qb2ZqZ0lMa3VMdm9wb0htaW9EbW5LL3Z2SnBSZDNKaGNPT0FnVkYzY21Gd0xYQnliMjFwYzJYamdJRlJkM0poY0Mxc1lYcDViRzloWk9PQWdWRjNjbUZ3TFdoaGMyZ3RhR2x6ZEhKdmVlT0FnVkYzY21Gd0xYTmpjbTlzYkMxaVlYTGpnSUZSZDNKaGNDMWtZWFJoVFc5a1lXem5yWW5tcUtIbG5aZmpnSUpjSWl4Y2JpQWdJQ0FnSUNBZ2JHbHpkRG9nVzN0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDNWalpXNTBaWEl6TmpBdk1ERXVhbkJuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2N6TmpEa3ZKcmxrWmprdUszbHY0UHBwcGJwb2JVblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMM1ZqWlc1MFpYSXpOakF2TURJdWFuQm5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY3pOakRrdkpybGtaamt1SzNsdjRQbGdacmt1N3ZsaXFFblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMM1ZqWlc1MFpYSXpOakF2TURNdWFuQm5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY3pOakRrdkpybGtaamt1SzNsdjRQcG9vYm5pYm5tbllNblhHNGdJQ0FnSUNBZ0lIMWRYRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0JwWkRvZ1hDSjJhWEF6TmpCY0lpeGNiaUFnSUNBZ0lDQWdkSGx3WlRvZ1hDSXlNREV5WENJc1hHNGdJQ0FnSUNBZ0lHNWhiV1U2SUZ3aU16WXc1THlhNVpHWTVaV0c1WitPWENJc1hHNGdJQ0FnSUNBZ0lIVnliRG9nWENKb2RIUndPaTh2ZG1sd0xqTTJNQzVqYmk5dFlXeHNMMXdpTEZ4dUlDQWdJQ0FnSUNCa1pYTmpPaUJjSXVXRnFPZXJtZVdmdXVTNmptSnZiM1J6ZEhKaGNPUzZqT2Fzb2VXOGdPV1BrZU9BZ21wUmRXVnllUzEwYlhCczQ0Q0JhbEYxWlhKNUxXTnZiMnRwWmVldGllZTdoT1M3dGx3aUxGeHVJQ0FnSUNBZ0lDQmpiM1psY2pvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDNacGNETTJNQzlqYjNabGNpNXdibWNuTEZ4dUlDQWdJQ0FnSUNCc2FYTjBPaUJiZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012ZG1sd016WXdMekF4TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTkyYVhBek5qQXZNREl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMWRYRzRnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0JwWkRvZ1hDSnRhWGRoYmpNMk5qTmNJaXhjYmlBZ0lDQWdJQ0FnZEhsd1pUb2dYQ0l5TURFeVhDSXNYRzRnSUNBZ0lDQWdJRzVoYldVNklGd2lNelkyTTAxcDU0NnA1NzZPNWFXejU1dTA1cEt0WENJc1hHNGdJQ0FnSUNBZ0lIVnliRG9nWENKb2RIUndPaTh2ZDNkM0xqTTJOak11WTI5dFhDSXNYRzRnSUNBZ0lDQWdJR1JsYzJNNklGd2k1NzZPNWFXejU1dTA1cEt0NDRDQjZZQ0I1NlM4Nzd5TTVaKzY1THFPWjNWc2NPaUhxdVdLcU9XTWx1VzNwZVM5bk9hMWdlT0FnV0p5YjNkelpYSnBabm5udTRUbnU0ZGpiMjF0YjI1cWMrYWdoK1dIaHVlYWhHNXZaR1ZxYytTN28rZWdnZVdjcU9hMWoraW5pT1dacU9pL2tPaWhqT09BZ2VXSWh1V3hndWluaE9XSWt1YW9vZVdkbCtXOGorYWVoT1c3dXUrOGlPYWNqZVdLb2VXeGd1T0FnZWFvb2VXZGwrV3hndSs4aWUrOGpGQnliMjFwYzJYbHZJTG1yYVhudkpibnFJdGNJaXhjYmlBZ0lDQWdJQ0FnWTI5MlpYSTZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXRhWGRoYmpNMk5qTXZZMjkyWlhJdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnYkdsemREb2dXM3RjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMjFwZDJGdU16WTJNeTh3TVM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YldsM1lXNHpOall6THpBeUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5WFZ4dUlDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZJRndpTld0dmJtZDBkbHdpTEZ4dUlDQWdJQ0FnSUNCMGVYQmxPaUJjSWpJd01USmNJaXhjYmlBZ0lDQWdJQ0FnYm1GdFpUb2dYQ0xtZ3AvbnFicFVWdWE0dU9hSWorZWJ0T2FTclZ3aUxGeHVJQ0FnSUNBZ0lDQjFjbXc2SUZ3aWFIUjBjRG92TDNkM2R5NDFhMjl1Wnk1MGRsd2lMRnh1SUNBZ0lDQWdJQ0JrWlhOak9pQmNJdWE0dU9hSWorZWJ0T2FTcmVPQWdlbUFnZWVrdk9PQWd1V2Z1dVM2am1kMWJIRG9oNnJsaXFqbGpKYmx0Nlhrdlp6bXRZSGpnSUZpY205M2MyVnlhV1o1NTd1RTU3dUhZMjl0Ylc5dWFuUG1vSWZsaDRibm1vUnViMlJsYW5Qa3U2UG5vSUhsbktqbXRZL29wNGpsbWFqb3Y1RG9vWXpqZ0lIbGlJYmxzWUxvcDRUbGlKTG1xS0hsblpmbHZJL21ub1RsdTdydnZJam1uSTNsaXFIbHNZTGpnSUhtcUtIbG5aZmxzWUx2dkludnZJeFFjbTl0YVhObDVieUM1cTJsNTd5VzU2aUxYQ0lzWEc0Z0lDQWdJQ0FnSUdOdmRtVnlPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZOV3R2Ym1kMGRpOWpiM1psY2k1cWNHY25MRnh1SUNBZ0lDQWdJQ0JzYVhOME9pQmJlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZOV3R2Ym1kMGRpOHdNUzVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZOV3R2Ym1kMGRpOHdNaTVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZWMWNiaUFnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJR2xrT2lCY0ltbGtibUZqWENJc1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aU1qQXdOMXdpTEZ4dUlDQWdJQ0FnSUNCdVlXMWxPaUJjSXVXdW51V1FqZVdJdGtsRTU3MlI1N3VjNTY2aDU1Q0c1N083NTd1ZlhDSXNYRzRnSUNBZ0lDQWdJR1JsYzJNNklGd2k1YnFWNWJHQzVMMi81NVNvUStpdnJlaW9nT1M0anVlaHJPUzd0dVM2cE9TNmt1T0FnVkJJVU9TOW5PUzR1dVM0cmVtWHRPV3hndVd1bnVlT3NPUzRtdVdLb2VtQXUraStrZU9BZ3VXSmplYWNuK2VMck9lcmkraTBuK2kwbytpdXZ1aXVvZU9BZ2VXSmplZXJyK09BZ1ZCSVVPV3hndWVhaE9XUWhPYW9vZVdkbCthZWhPVzd1dU9BZ2x3aUxGeHVJQ0FnSUNBZ0lDQmpiM1psY2pvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJsa2JtRmpMMk52ZG1WeUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUd4cGMzUTZJRnQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlwWkc1aFl5OHdNUzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZhV1J1WVdNdk1ESXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwybGtibUZqTHpBekxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cFpHNWhZeTh3TkM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YVdSdVlXTXZNRFV1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMmxrYm1Gakx6QTJMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXBaRzVoWXk4d055NXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmFXUnVZV012TURndWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDFkWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCcFpEb2dYQ0pwWkhkaGJHeGNJaXhjYmlBZ0lDQWdJQ0FnZEhsd1pUb2dYQ0l5TURBM1hDSXNYRzRnSUNBZ0lDQWdJRzVoYldVNklGd2lTVVJYWVd4czVZZUc1WVdsNlppeTU0R3I1YUtaWENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aTVaKzY1THFPU1VST1lXUG9vNEhsaWFybHZJRGxqNUh2dkl6bGlZM21uSi9uaTZ6bnE0dm1ub1RsdTdyamdJSkpSRmRoYkd6bW1LL2t1SlBrdUxya3Y1M21pcVRsaG9YbnZaSG90WVRtdXBEb2dJem9ycjdvcnFIbm1vVGxoNGJsaGFYcG1MTG5nYXZsb3BuamdJTGxyb1BtbUsva3VKYm5sWXprdUlycHBwYm1yTDdtbEsvbWpJSGxycDdsa0kzbGlMWkpST2U5a2VlN25PYUtnT2FjcitlYWhPT0FnZVdGdCthY2llV0hodVdGcGVhT3ArV0l0dVdLbitpRHZlZWFoT21Zc3VlQnErV2ltZU9BZ3VhY2llV0lxK1M2anVTOG9PZTduK2VhaE9tWXN1ZUJxK1dpbWUrOGpFbEVWMkZzYk9XdW51ZU9zT1M2aHVXdWllV0ZxT1dmbitlYWhPZXVvZWVRaHUrOGpPZXNwdVdRaU9XYnZlV3V0dVd1aWVXRnFPYXpsZWluaE9TNHJlaW1nZWF4Z3VlYWhPZTlrZWU3bk9pMWhPYTZrT1cvaGVtaHUrV0lodVdNdXVXSWh1V2ZuK09BZ2VTNHBlZW1nZVM0amVXUWpPZXRpZWU2cCtlYWhPV3VpZVdGcU9XZm4rUzZrdW1BbXVlYWhPaW5oT1d1bXVPQWdsd2lMRnh1SUNBZ0lDQWdJQ0JqYjNabGNqb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwybGtkMkZzYkM5amIzWmxjaTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQnNhWE4wT2lCYmUxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmFXUjNZV3hzTHpBeExuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cFpIZGhiR3d2TURJdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJsa2QyRnNiQzh3TXk1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmVjFjYmlBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pQmNJbVoxZW1GcGFuVnVhR1Z1WjF3aUxGeHVJQ0FnSUNBZ0lDQjBlWEJsT2lCY0lqSXdNRGRjSWl4Y2JpQWdJQ0FnSUNBZ2JtRnRaVG9nWENMbG03M2xycmJubExYbnZaSG90Si9vdmIzbG5ZZm9vYUhuczd2bnU1OWNJaXhjYmlBZ0lDQWdJQ0FnWkdWell6b2dYQ0xsbjdya3VvNUpSRTVoWStpamdlV0pxdVc4Z09XUGtlKzhqT1dKamVhY24rZUxyT2VyaSthZWhPVzd1dU9BZ2x3aUxGeHVJQ0FnSUNBZ0lDQmpiM1psY2pvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJaMWVtRnBhblZ1YUdWdVp5OWpiM1psY2k1d2JtY25MRnh1SUNBZ0lDQWdJQ0JzYVhOME9pQmJlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZablY2WVdscWRXNW9aVzVuTHpBeExuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5bWRYcGhhV3AxYm1obGJtY3ZNREl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMloxZW1GcGFuVnVhR1Z1Wnk4d015NXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlpuVjZZV2xxZFc1b1pXNW5MekEwTG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlYVnh1SUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnYVdRNklGd2labVZwWm1GM1lXbHNhV0Z1WENJc1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aU1qQXdOMXdpTEZ4dUlDQWdJQ0FnSUNCdVlXMWxPaUJjSXVXYnZlV3V0dWVVdGVlOWtlbWRudWF6bGVXa2x1aUJsT2FqZ09hMWkrZXp1K2U3bjF3aUxGeHVJQ0FnSUNBZ0lDQmtaWE5qT2lCY0l1V2Z1dVM2amtsRVRtRmo2S09CNVltcTVieUE1WStSNzd5TTVZbU41cHlmNTR1czU2dUw1cDZFNWJ1NjQ0Q0NYQ0lzWEc0Z0lDQWdJQ0FnSUdOdmRtVnlPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZabVZwWm1GM1lXbHNhV0Z1TDJOdmRtVnlMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lHeHBjM1E2SUZ0N1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5bVpXbG1ZWGRoYVd4cFlXNHZNREV1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMlpsYVdaaGQyRnBiR2xoYmk4d01pNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlptVnBabUYzWVdsc2FXRnVMekF6TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTltWldsbVlYZGhhV3hwWVc0dk1EUXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgxZFhHNGdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQnBaRG9nWENKcmIyNW5lbWhwZDJGdVoyZDFZVzVjSWl4Y2JpQWdJQ0FnSUNBZ2RIbHdaVG9nWENJeU1EQTNYQ0lzWEc0Z0lDQWdJQ0FnSUc1aGJXVTZJRndpNVlXczVhNko2WU9vNW82bjVZaTI1NzJSNVlXelhDSXNYRzRnSUNBZ0lDQWdJSFJwYldVNklGd2lNakF4TWVXNXRPUzluT1dUZ1Z3aUxGeHVJQ0FnSUNBZ0lDQmtaWE5qT2lCY0l1V2Z1dVM2amtsRVRtRmo2S09CNVltcTVieUE1WStSNzd5TTVZbU41cHlmNTR1czU2dUw1cDZFNWJ1NjQ0Q0M1TGk2NVlXczVhNko2WU9vNlplbzVZR2E1NXFFNmFHNTU1dXU3N3lNNTd1VDVaQ0lTVVJPWVdQbHJwN25qckRrdUl2bHNaN2xzcGZrdXEzbWpxWGxoYVhudTRqbnE2L25tb1RubTVIbWpxZmxrb3pucnFIbmtJWmNJaXhjYmlBZ0lDQWdJQ0FnWTI5MlpYSTZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJiMjVuZW1ocGQyRnVaMmQxWVc0dlkyOTJaWEl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdiR2x6ZERvZ1czdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwydHZibWQ2YUdsM1lXNW5aM1ZoYmk4d01TNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmEyOXVaM3BvYVhkaGJtZG5kV0Z1THpBeUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cmIyNW5lbWhwZDJGdVoyZDFZVzR2TURNdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJ0dmJtZDZhR2wzWVc1blozVmhiaTh3TkM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YTI5dVozcG9hWGRoYm1kbmRXRnVMekExTG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlYVnh1SUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnYVdRNklGd2lhV1J6Wlc1emIzSmNJaXhjYmlBZ0lDQWdJQ0FnZEhsd1pUb2dYQ0l5TURBM1hDSXNYRzRnSUNBZ0lDQWdJRzVoYldVNklGd2lTVVRudlpIbnU1em5ycUhua0libnM3dm51NS9vdjV6bnE2L2t1NlBua0laY0lpeGNiaUFnSUNBZ0lDQWdkR2x0WlRvZ1hDSXlNREV4NWJtMDVMMmM1Wk9CWENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aVNVUlRaVzV6YjNMbGo2L2t1NlhubTVIb3A0Ymxrb3ptanFmbGlMYm92NXpucTYvbGlJYm1sSy9tbkxybW5vVG5tb1RudlpIbnU1enZ2SXpwaFkzbGtJaEpSRTVoWSsrOGpPV3VudWVPc09XRnFPZTlrZWVhaE9ldW9lYU9wKys4ak9laHJ1Uy9uZVdGcU9lOWtlZWFoT2U5a2VlN25PaSt1ZWVWak9lYWhPV3VqT2FWdE9PQWd1aW5vK1dHcytlVXNlUzZqdWU5a2VlN25PV0lodVc0ZytXY3NPV2ZuK1c1ditPQWdlUzRqZWFZaytlYmtlV3ZuK09BZ2VTNGplYVlrK2V1b2VlUWh1ZWFoT21YcnVtaW1PKzhqT1c0cnVXS3FlZTlrZWV1b2VTNnV1V1JtT1d1bnVlT3NPaS9uT2VycitXRnFPZTlrZWFPak9hT3ArZWFoT21hdnVtaW1PT0FnbHdpTEZ4dUlDQWdJQ0FnSUNCamIzWmxjam9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMmxrYzJWdWMyOXlMMk52ZG1WeUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUd4cGMzUTZJRnQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlwWkhObGJuTnZjaTh3TVM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YVdSelpXNXpiM0l2TURJdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJsa2MyVnVjMjl5THpBekxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5cFpITmxibk52Y2k4d05DNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlYxY2JpQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lHbGtPaUJjSW1GamEzQnliMnBsWTNSY0lpeGNiaUFnSUNBZ0lDQWdkSGx3WlRvZ1hDSXlNREEzWENJc1hHNGdJQ0FnSUNBZ0lHNWhiV1U2SUZ3aVFVTkw2YUc1NTV1dTVMMmM1Wk9CWENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aTVZZWc1TGlxNlllTjU0SzU1YTZlNVp5dzZZT281NzJ5NTVxRTZhRzU1NXV1WENJc1hHNGdJQ0FnSUNBZ0lHTnZkbVZ5T2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WVdOcmNISnZhbVZqZEM5amIzWmxjaTVxY0djbkxGeHVJQ0FnSUNBZ0lDQnNhWE4wT2lCYmUxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdllXTnJjSEp2YW1WamRDOHdNUzVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZV05yY0hKdmFtVmpkQzh3TWk1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WVdOcmNISnZhbVZqZEM4d015NXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdllXTnJjSEp2YW1WamRDOHdOQzVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZV05yY0hKdmFtVmpkQzh3TlM1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WVdOcmNISnZhbVZqZEM4d05pNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlYxY2JpQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lHbGtPaUJjSW1GamEySmljMXdpTEZ4dUlDQWdJQ0FnSUNCMGVYQmxPaUJjSWpJd01EZGNJaXhjYmlBZ0lDQWdJQ0FnYm1GdFpUb2dYQ0pCWTJ0M2IzSnJjK1M2cCtXVGdlYUtnT2FjcitTNnBPYTFnZWl1dXVXZG0xd2lMRnh1SUNBZ0lDQWdJQ0JrWlhOak9pQmNJdVdmdXVTNmp1VzhnT2E2a09lenUrZTduMUJJVUZkcGJtVG1ub1RsdTdyamdJTGt1THJub0pUbGo1SGpnSUhwbElEbGxLN2pnSUhscnFMbWlMZm1qNURrdnB2b3Jxam9ycnJuanJEbHJaanBsNjdwb3BqdnZJem1sckRubW9UbGlwL29nNzNub0pUbGo1SHZ2SXpvcnFqb3Jycmt1cWZsazRIbm1vVGxqNUhsdUlQbW5Lcm9wNlBsaHJQbm1vUkNWVWZ2dkl6cGxJRGxsSzdrdUszbm1vVHBsNjdwb3BqbHU3cm9ycTVjSWl4Y2JpQWdJQ0FnSUNBZ1kyOTJaWEk2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTloWTJ0aVluTXZZMjkyWlhJdWFuQm5KeXhjYmlBZ0lDQWdJQ0FnYkdsemREb2dXM3RjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkZqYTJKaWN5OHdNUzVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZV05yWW1Kekx6QXlMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWhZMnRpWW5Ndk1ETXVhbkJuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyRmphMkppY3k4d05DNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlYxY2JpQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lHbGtPaUJjSW5GcGJtZG9kV0ZjSWl4Y2JpQWdJQ0FnSUNBZ2RIbHdaVG9nWENJeU1EQTBYQ0lzWEc0Z0lDQWdJQ0FnSUc1aGJXVTZJRndpNXJpRjVZMk81YVNuNWEybTVZZTY1NG1JNTZTKzU2eXM1WVd0NUxxTDVMaWE2WU9vWENJc1hHNGdJQ0FnSUNBZ0lIUnBiV1U2SUZ3aU1qQXdOQzB5TURBMTVibTA1TDJjNVpPQlhDSXNYRzRnSUNBZ0lDQWdJR1JsYzJNNklGd2k1WVdvNXFDSTU0dXM1NnVMNWJ5QTVZK1I0NENDNXJpRjVZMk81WWU2NTRtSTU2Uys1NnlzNVlXdDVMcUw1TGlhNllPbzVhNlk1cGE1NTcyUjU2dVo3N3lNNXBhdzVMbW00NENCNTVXRjZaU0E1TG1tNDRDQjU3Sys1Wk9CNVp1KzVMbW01YkdWNTZTNjVaS001WnlvNTdxLzZLNmk2TFN0Nzd5TTVadSs1TG1tNTV1NDVZV3o2TFdFNXBhWjVMaUw2TDI5Nzd5TTVaS002Sys3NklDRjU1V1o2S2lBNTYySlhDSXNYRzRnSUNBZ0lDQWdJR052ZG1WeU9pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmNXbHVaMmgxWVM5amIzWmxjaTVxY0djbkxGeHVJQ0FnSUNBZ0lDQnNhWE4wT2lCYmUxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmNXbHVaMmgxWVM4d01TNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmNXbHVaMmgxWVM4d01pNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmNXbHVaMmgxWVM4d015NXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmNXbHVaMmgxWVM4d05DNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmNXbHVaMmgxWVM4d05TNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmNXbHVaMmgxWVM4d05pNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlYxY2JpQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lHbGtPaUJjSW10aGNuUmxiR3hjSWl4Y2JpQWdJQ0FnSUNBZ2RIbHdaVG9nWENJeU1EQTBYQ0lzWEc0Z0lDQWdJQ0FnSUc1aGJXVTZJRndpUzJGeWRHVnNiQ2ptaEkvbHBLZmxpS2twNWE2MjVZVzM2TFM0NXBpVDVZeVg1THFzNTcyUjU2dVpYQ0lzWEc0Z0lDQWdJQ0FnSUhScGJXVTZJRndpTWpBd051VzV0T1M5bk9XVGdWd2lMRnh1SUNBZ0lDQWdJQ0JrWlhOak9pQmNJdVdGcU9hZ2lPZUxyT2VyaStXOGdPV1BrZU9BZ3VhRWorV2twK1dJcWVTNGx1ZVZqT21odHVlNnArV1RnZWVKak9XdXR1V0Z0K1dNbCtTNnJPV3VtT2FXdWVlOWtlZXJtZU9BZ2VtbWx1bWh0ZW1IaCtlVXFPV0ZxRVpzWVhObzVieUE1WStSNzd5TTVMcW41Wk9CNWJHVjU2UzY1WktNNVp5bzU3cS82SzZpNkxTdFhDSXNYRzRnSUNBZ0lDQWdJR3hwYzNRNklGdDdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QXhMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QXlMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QXpMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QTBMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QTFMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QTJMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QTNMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QTRMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6QTVMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXJZWEowWld4c0x6RXdMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOVhWeHVJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdhV1E2SUZ3aVlYVjBiM2R2Y210elhDSXNYRzRnSUNBZ0lDQWdJSFI1Y0dVNklGd2lNakF3TkZ3aUxGeHVJQ0FnSUNBZ0lDQnVZVzFsT2lCY0lrRjFkRzlYYjNKcmMraTJoZWkza2VleXZ1aUxzZVM4bWx3aUxGeHVJQ0FnSUNBZ0lDQjBhVzFsT2lCY0lqSXdNRFhsdWJUa3ZaemxrNEZjSWl4Y2JpQWdJQ0FnSUNBZ1pHVnpZem9nWENMbGhham1vSWpuaTZ6bnE0dmx2SURsajVIamdJTGxqSmZrdXF6cGg1SG11Sy9tc2Izb3ZhYmxoYXpsbTYzb3RvWG90NUhuc3I3b2k3SGt2SnJscnBqbWxybm52WkhucTVudnZJem92YWJvdm9ibWxMbm9vNFhqZ0lIcGxJRGxsSzdqZ0lIbnBMemxrNEhqZ0lIb3Radmt1b3ZtdEx2bGlxaGNJaXhjYmlBZ0lDQWdJQ0FnYkdsemREb2dXM3RjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMkYxZEc5M2IzSnJjeTh3TVM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WVhWMGIzZHZjbXR6THpBeUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5aGRYUnZkMjl5YTNNdk1ETXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyRjFkRzkzYjNKcmN5OHdOQzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZWFYwYjNkdmNtdHpMekExTG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlYVnh1SUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnYVdRNklGd2lZM0poZW5sbGJtZHNhWE5vWENJc1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aU1qQXdORndpTEZ4dUlDQWdJQ0FnSUNCdVlXMWxPaUJjSXVXTWwrUzZyT2VXcitlTGd1aUxzZWl2cmVtaHVlZWJybHdpTEZ4dUlDQWdJQ0FnSUNCMWNtdzZJRndpYUhSMGNEb3ZMM2QzZHk1aWFtTnlZWHA1Wlc1bmJHbHphQzVqYjIwdlhDSXNYRzRnSUNBZ0lDQWdJR1JsYzJNNklGd2k1NWF2NTR1QzZJdXg2Syt0NWE2WTVwYTU1NzJSNTZ1Wjc3eUk1Wis2NUxxTzU2ZVI2SzZ2NWJ5QTVycVE1N083NTd1Zjc3eUo0NENCNVp5bzU3cS81b3FsNVpDTjU3Tzc1N3VmNzd5STVZV281cUNJNTR1czU2dUw1YnlBNVkrUjc3eUo0NENCNVlXbzVadTk1bzZJNXAyRDU0SzU1THFTNVlxbzVMcWs1cldCNWJtejVZK3c3N3lJNVlXbzVxQ0k1NHVzNTZ1TDVieUE1WStSNzd5SlhDSXNYRzRnSUNBZ0lDQWdJR052ZG1WeU9pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlkzSmhlbmxsYm1kc2FYTm9MMk52ZG1WeUxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUd4cGMzUTZJRnQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlqY21GNmVXVnVaMnhwYzJndk1ERXVhbkJuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyTnlZWHA1Wlc1bmJHbHphQzh3TWk1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012WTNKaGVubGxibWRzYVhOb0x6QXpMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OWpjbUY2ZVdWdVoyeHBjMmd2TURRdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJOeVlYcDVaVzVuYkdsemFDOHdOUzV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZZM0poZW5sbGJtZHNhWE5vTHpBMkxuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5amNtRjZlV1Z1WjJ4cGMyZ3ZNRGN1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMk55WVhwNVpXNW5iR2x6YUM4d09DNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdlkzSmhlbmxsYm1kc2FYTm9MekE1TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTlqY21GNmVXVnVaMnhwYzJndk1UQXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgxZFhHNGdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQnBaRG9nWENKM1pXbDBZV2xjSWl4Y2JpQWdJQ0FnSUNBZ2RIbHdaVG9nWENJeU1EQTBYQ0lzWEc0Z0lDQWdJQ0FnSUc1aGJXVTZJRndpNVpTdjVyT3c1WStrNVlXNDVhNjI1YkdGNTcyUlhDSXNYRzRnSUNBZ0lDQWdJSFJwYldVNklGd2lNakF3TitXNXRPUzluT1dUZ1Z3aUxGeHVJQ0FnSUNBZ0lDQmtaWE5qT2lCY0l1V2Z1dVM2amtGVFVPZW5rZWl1citlenUrZTduK1M2ak9hc29lVzhnT1dQa2UrOGpPV3hzZWlsditXa3F1V09uK1djc09hV3VlV3V0dVdGdCtlOWtlZXJtZSs4ak9XdW51ZU9zT1dQcE9XRnVPV3V0dVdGdCtXeGxlZWt1dU9BZ2VXY3FPZTZ2K2l1b3VpMHJlT0FnZVM4bXVXUm1PUzZrdVdLcU9ldGllV0tuK2lEdlZ3aUxGeHVJQ0FnSUNBZ0lDQmpiM1psY2pvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDNkbGFYUmhhUzlqYjNabGNpNXdibWNuTEZ4dUlDQWdJQ0FnSUNCc2FYTjBPaUJiZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012ZDJWcGRHRnBMekF4TG5CdVp5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTkzWldsMFlXa3ZNREl1Y0c1bkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMM2RsYVhSaGFTOHdNeTV3Ym1jbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZkMlZwZEdGcEx6QTBMbkJ1Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OTNaV2wwWVdrdk1EVXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwzZGxhWFJoYVM4d05pNXdibWNuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmQyVnBkR0ZwTHpBM0xuQnVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5M1pXbDBZV2t2TURndWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDFkWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCcFpEb2dYQ0poYVcxbGFUTTI2SzZoWENJc1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aU1qQXdORndpTEZ4dUlDQWdJQ0FnSUNCdVlXMWxPaUJjSXVlSXNlZStqak0yNVl5VzVhYUc1Wk9CNVp5bzU3cS81WldHNVorT1hDSXNYRzRnSUNBZ0lDQWdJSFJwYldVNklGd2lNakF3T2VXNXRPUzluT1dUZ1Z3aUxGeHVJQ0FnSUNBZ0lDQmtaWE5qT2lCY0l1V2Z1dVM2amxCSVVPZWFoSE5vYjNCbGVPUzZqT2Fzb2VXOGdPV1BrZSs4ak9XdWpPYVZ0T2VhaE9XY3FPZTZ2K1dWaHVXZmp1ZXp1K2U3bjF3aUxGeHVJQ0FnSUNBZ0lDQmpiM1psY2pvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJGcGJXVnBNell2WTI5MlpYSXVjRzVuSnl4Y2JpQWdJQ0FnSUNBZ2JHbHpkRG9nVzN0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJGcGJXVnBNell2TURFdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJGcGJXVnBNell2TURJdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJGcGJXVnBNell2TURNdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDJGcGJXVnBNell2TURRdWNHNW5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDFkWEc0Z0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNCcFpEb2dYQ0o2ZW5Wc2FXSnFYQ0lzWEc0Z0lDQWdJQ0FnSUhSNWNHVTZJRndpTWpBd05Gd2lMRnh1SUNBZ0lDQWdJQ0J1WVcxbE9pQmNJdW1Ea2VXM251aTl1K1czcGVTNG11V3RwdW1ab3VXTWwrUzZyT2Fnb2VXUGkrUzhtbHdpTEZ4dUlDQWdJQ0FnSUNCa1pYTmpPaUJjSXVTNHV1bURrZVczbnVpOXUrVzNwZVM0bXVXdHB1bVpvdWF2bGVTNG11ZWFoT09BZ2VXY3FPV01sK1M2ck9XM3BlUzluT2VhaE9hZ29lV1BpKys4ak9hUGtPUyttK1djcU9lNnYrYXluK21BbXVPQWdlUzZwT2ExZ2VlYWhPVzVzK1dQc09PQWd1V2Z1dVM2anVXNnQrZWJtK1dJbSthRHMrZWFoQ0IxWTJWdWRHVnlJR2h2YldVZzVMcU01cXloNWJ5QTVZK1JYQ0lzWEc0Z0lDQWdJQ0FnSUd4cGMzUTZJRnQ3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTk2ZW5Wc2FXSnFMekF4TG1wd1p5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTk2ZW5Wc2FXSnFMekF5TG1wd1p5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTk2ZW5Wc2FXSnFMekF6TG1wd1p5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTk2ZW5Wc2FXSnFMekEwTG1wd1p5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTk2ZW5Wc2FXSnFMekExTG1wd1p5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlYVnh1SUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnYVdRNklGd2liM1JvWlhKY0lpeGNiaUFnSUNBZ0lDQWdkSGx3WlRvZ1hDSXlNREEwWENJc1hHNGdJQ0FnSUNBZ0lHNWhiV1U2SUZ3aTVZVzI1YTZENUwyYzVaT0I2WU9vNVlpRzVMK2g1b0d2WENJc1hHNGdJQ0FnSUNBZ0lHUmxjMk02SUZ3aU1qQXdOZVc1dE9pMXQrYU9wZVdObGVXQm11ZTlrZWVybWVPQWdlV2Z1dVM2anVXOGdPYTZrT2V6dStlN24rYVFyZVc3dXVTNHF1UzZ1dWU5a2Vlcm1lT0FnZWVhaE9tRHFPV0lodVM5bk9XVGdTamxwS2Zsc0kva3ZJSGt1SnJucTVrek1PV2ttdVM0cWlsY0lpeGNiaUFnSUNBZ0lDQWdZMjkyWlhJNklGd2lMaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmIzUm9aWEl2WTI5MlpYSXVjRzVuWENJc1hHNGdJQ0FnSUNBZ0lHeHBjM1E2SUZ0N1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5dmRHaGxjaTh3TVM1cWNHY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkWEpzT2lBbkxpOXpkR0YwYVdNdmFXMWhaMlZ6TDJSNWJtRnRhV012YjNSb1pYSXZNREl1YW5Cbkp5eGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGNIUnBiMjQ2SUNjblhHNGdJQ0FnSUNBZ0lIMHNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIVnliRG9nSnk0dmMzUmhkR2xqTDJsdFlXZGxjeTlrZVc1aGJXbGpMMjkwYUdWeUx6QXpMbXB3Wnljc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhCMGFXOXVPaUFuSjF4dUlDQWdJQ0FnSUNCOUxDQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMWNtdzZJQ2N1TDNOMFlYUnBZeTlwYldGblpYTXZaSGx1WVcxcFl5OXZkR2hsY2k4d05DNXFjR2NuTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ3ZEdsdmJqb2dKeWRjYmlBZ0lDQWdJQ0FnZlN3Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhKc09pQW5MaTl6ZEdGMGFXTXZhVzFoWjJWekwyUjVibUZ0YVdNdmIzUm9aWEl2TURVdWFuQm5KeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHTmhjSFJwYjI0NklDY25YRzRnSUNBZ0lDQWdJSDBzSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ5YkRvZ0p5NHZjM1JoZEdsakwybHRZV2RsY3k5a2VXNWhiV2xqTDI5MGFHVnlMekEyTG1wd1p5Y3NYRzRnSUNBZ0lDQWdJQ0FnSUNCallYQjBhVzl1T2lBbkoxeHVJQ0FnSUNBZ0lDQjlMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjbXc2SUNjdUwzTjBZWFJwWXk5cGJXRm5aWE12WkhsdVlXMXBZeTl2ZEdobGNpOHdOeTVxY0djbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGd2RHbHZiam9nSnlkY2JpQWdJQ0FnSUNBZ2ZTd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RYSnNPaUFuTGk5emRHRjBhV012YVcxaFoyVnpMMlI1Ym1GdGFXTXZiM1JvWlhJdk1EZ3VhbkJuSnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oY0hScGIyNDZJQ2NuWEc0Z0lDQWdJQ0FnSUgwc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhWeWJEb2dKeTR2YzNSaGRHbGpMMmx0WVdkbGN5OWtlVzVoYldsakwyOTBhR1Z5THpBNUxtcHdaeWNzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZWEIwYVc5dU9pQW5KMXh1SUNBZ0lDQWdJQ0I5TENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxY213NklDY3VMM04wWVhScFl5OXBiV0ZuWlhNdlpIbHVZVzFwWXk5dmRHaGxjaTh4TUM1d2JtY25MRnh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRndkR2x2YmpvZ0p5ZGNiaUFnSUNBZ0lDQWdmVjFjYmlBZ0lDQjlYVnh1ZlR0Y2JseHVkbUZ5SUhkdmNtdHpJRDBnZTF4dUlDQWdJQzhxWEc0Z0lDQWc2STYzNVkrVzVMMmM1Wk9CNVlpWDZLR281Ym0yNVlHYTVMaUE1THFiNXFDODVieVA1WXFnNWJlbFhHNGdJQ0FnSUNvdlhHNGdJQ0FnWjJWMFRHbHpkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJzYVhOMFJHRjBZU0E5SUZ0ZE8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1VTNVFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1Vc0lISmxhbVZqZENrZ2UxeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCM2IzSnJTVzVtYnk1a1lYUmhMbTFoY0NobWRXNWpkR2x2YmlocGRHVnRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHbDBaVzFFWVhSaElEMGdlMzA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVhSbGJVUmhkR0V1YVdRZ1BTQnBkR1Z0TG1sa08xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbDBaVzFFWVhSaExtNWhiV1VnUFNCcGRHVnRMbTVoYldVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FYUmxiVVJoZEdFdWRYSnNJRDBnYVhSbGJTNTFjbXdnZkh3Z1hDSmNJanRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdFJHRjBZUzUwYVhBZ1BTQnBkR1Z0TG5ScGNDQjhmQ0JjSWx3aU8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbDBaVzFFWVhSaExtUmxjMk1nUFNCcGRHVnRMbVJsYzJNZ2ZId2dYQ0pjSWp0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRSR0YwWVM1amIzWmxjaUE5SUdsMFpXMHVZMjkyWlhJZ2ZId2dLR2wwWlcwdWJHbHpkQ0EvSUdsMFpXMHViR2x6ZEZzd1hTNTFjbXdnT2lCY0lsd2lLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUd4cGMzUkVZWFJoTG5CMWMyZ29hWFJsYlVSaGRHRXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTnZiSFpsS0d4cGMzUkVZWFJoS1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lDOHFYRzRnSUNBZzVxQzU1bzJ1NTdHNzVaNkw2STYzNVkrVzVMMmM1Wk9CNVlpWDZLR29YRzRnSUNBZ0lDb3ZYRzRnSUNBZ1oyVjBUR2x6ZEVKNVZIbHdaVG9nWm5WdVkzUnBiMjRvZEhsd1pTa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ2JHbHpkRVJoZEdFZ1BTQmJYVHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRkV1VUhKdmJXbHpaU2htZFc1amRHbHZiaWh5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdkMjl5YTBsdVptOHVaR0YwWVM1dFlYQW9ablZ1WTNScGIyNG9hWFJsYlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbElEMDlJR2wwWlcwdWRIbHdaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnYVhSbGJVUmhkR0VnUFNCN2ZUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVhSbGJVUmhkR0V1YVdRZ1BTQnBkR1Z0TG1sa08xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdFJHRjBZUzV1WVcxbElEMGdhWFJsYlM1dVlXMWxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRSR0YwWVM1MWNtd2dQU0JwZEdWdExuVnliQ0I4ZkNCY0lsd2lPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRSR0YwWVM1MGFYQWdQU0JwZEdWdExuUnBjQ0I4ZkNCY0lsd2lPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRSR0YwWVM1a1pYTmpJRDBnYVhSbGJTNWtaWE5qSUh4OElGd2lYQ0k3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbDBaVzFFWVhSaExtTnZkbVZ5SUQwZ2FYUmxiUzVqYjNabGNpQjhmQ0FvYVhSbGJTNXNhWE4wSUQ4Z2FYUmxiUzVzYVhOMFd6QmRMblZ5YkNBNklGd2lYQ0lwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR3hwYzNSRVlYUmhMbkIxYzJnb2FYUmxiVVJoZEdFcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemIyeDJaU2hzYVhOMFJHRjBZU2s3WEc0Z0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwc1hHNWNiaUFnSUNBdktseHVJQ0FnSU9hZ3VlYU5ybWxrNkk2MzVZK1c1WTJWNUxpcTVMMmM1Wk9CWEc0Z0lDQWdJQ292WEc0Z0lDQWdaMlYwUW5sSlpEb2dablZ1WTNScGIyNG9hV1FwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJR2wwWlcxRVlYUmhJRDBnZTMwN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCUkxsQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IzYjNKclNXNW1ieTVrWVhSaExtMWhjQ2htZFc1amRHbHZiaWhwZEdWdEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dsa0lEMDlJR2wwWlcwdWFXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FYUmxiVVJoZEdFZ1BTQnBkR1Z0TzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZ6YjJ4MlpTaHBkR1Z0UkdGMFlTazdYRzRnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJSDFjYm4wN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdkMjl5YTNNN1hHNGlMQ0pwYlhCdmNuUWdLaUJoY3lCaVlYTmxJR1p5YjIwZ0p5NHZhR0Z1Wkd4bFltRnljeTlpWVhObEp6dGNibHh1THk4Z1JXRmphQ0J2WmlCMGFHVnpaU0JoZFdkdFpXNTBJSFJvWlNCSVlXNWtiR1ZpWVhKeklHOWlhbVZqZEM0Z1RtOGdibVZsWkNCMGJ5QnpaWFIxY0NCb1pYSmxMbHh1THk4Z0tGUm9hWE1nYVhNZ1pHOXVaU0IwYnlCbFlYTnBiSGtnYzJoaGNtVWdZMjlrWlNCaVpYUjNaV1Z1SUdOdmJXMXZibXB6SUdGdVpDQmljbTkzYzJVZ1pXNTJjeWxjYm1sdGNHOXlkQ0JUWVdabFUzUnlhVzVuSUdaeWIyMGdKeTR2YUdGdVpHeGxZbUZ5Y3k5ellXWmxMWE4wY21sdVp5YzdYRzVwYlhCdmNuUWdSWGhqWlhCMGFXOXVJR1p5YjIwZ0p5NHZhR0Z1Wkd4bFltRnljeTlsZUdObGNIUnBiMjRuTzF4dWFXMXdiM0owSUNvZ1lYTWdWWFJwYkhNZ1puSnZiU0FuTGk5b1lXNWtiR1ZpWVhKekwzVjBhV3h6Snp0Y2JtbHRjRzl5ZENBcUlHRnpJSEoxYm5ScGJXVWdabkp2YlNBbkxpOW9ZVzVrYkdWaVlYSnpMM0oxYm5ScGJXVW5PMXh1WEc1cGJYQnZjblFnYm05RGIyNW1iR2xqZENCbWNtOXRJQ2N1TDJoaGJtUnNaV0poY25NdmJtOHRZMjl1Wm14cFkzUW5PMXh1WEc0dkx5QkdiM0lnWTI5dGNHRjBhV0pwYkdsMGVTQmhibVFnZFhOaFoyVWdiM1YwYzJsa1pTQnZaaUJ0YjJSMWJHVWdjM2x6ZEdWdGN5d2diV0ZyWlNCMGFHVWdTR0Z1Wkd4bFltRnljeUJ2WW1wbFkzUWdZU0J1WVcxbGMzQmhZMlZjYm1aMWJtTjBhVzl1SUdOeVpXRjBaU2dwSUh0Y2JpQWdiR1YwSUdoaUlEMGdibVYzSUdKaGMyVXVTR0Z1Wkd4bFltRnljMFZ1ZG1seWIyNXRaVzUwS0NrN1hHNWNiaUFnVlhScGJITXVaWGgwWlc1a0tHaGlMQ0JpWVhObEtUdGNiaUFnYUdJdVUyRm1aVk4wY21sdVp5QTlJRk5oWm1WVGRISnBibWM3WEc0Z0lHaGlMa1Y0WTJWd2RHbHZiaUE5SUVWNFkyVndkR2x2Ymp0Y2JpQWdhR0l1VlhScGJITWdQU0JWZEdsc2N6dGNiaUFnYUdJdVpYTmpZWEJsUlhod2NtVnpjMmx2YmlBOUlGVjBhV3h6TG1WelkyRndaVVY0Y0hKbGMzTnBiMjQ3WEc1Y2JpQWdhR0l1VmswZ1BTQnlkVzUwYVcxbE8xeHVJQ0JvWWk1MFpXMXdiR0YwWlNBOUlHWjFibU4wYVc5dUtITndaV01wSUh0Y2JpQWdJQ0J5WlhSMWNtNGdjblZ1ZEdsdFpTNTBaVzF3YkdGMFpTaHpjR1ZqTENCb1lpazdYRzRnSUgwN1hHNWNiaUFnY21WMGRYSnVJR2hpTzF4dWZWeHVYRzVzWlhRZ2FXNXpkQ0E5SUdOeVpXRjBaU2dwTzF4dWFXNXpkQzVqY21WaGRHVWdQU0JqY21WaGRHVTdYRzVjYm01dlEyOXVabXhwWTNRb2FXNXpkQ2s3WEc1Y2JtbHVjM1JiSjJSbFptRjFiSFFuWFNBOUlHbHVjM1E3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdsdWMzUTdYRzRpTENKcGJYQnZjblFnZTJOeVpXRjBaVVp5WVcxbExDQmxlSFJsYm1Rc0lIUnZVM1J5YVc1bmZTQm1jbTl0SUNjdUwzVjBhV3h6Snp0Y2JtbHRjRzl5ZENCRmVHTmxjSFJwYjI0Z1puSnZiU0FuTGk5bGVHTmxjSFJwYjI0bk8xeHVhVzF3YjNKMElIdHlaV2RwYzNSbGNrUmxabUYxYkhSSVpXeHdaWEp6ZlNCbWNtOXRJQ2N1TDJobGJIQmxjbk1uTzF4dWFXMXdiM0owSUh0eVpXZHBjM1JsY2tSbFptRjFiSFJFWldOdmNtRjBiM0p6ZlNCbWNtOXRJQ2N1TDJSbFkyOXlZWFJ2Y25Nbk8xeHVhVzF3YjNKMElHeHZaMmRsY2lCbWNtOXRJQ2N1TDJ4dloyZGxjaWM3WEc1Y2JtVjRjRzl5ZENCamIyNXpkQ0JXUlZKVFNVOU9JRDBnSnpRdU1DNDFKenRjYm1WNGNHOXlkQ0JqYjI1emRDQkRUMDFRU1V4RlVsOVNSVlpKVTBsUFRpQTlJRGM3WEc1Y2JtVjRjRzl5ZENCamIyNXpkQ0JTUlZaSlUwbFBUbDlEU0VGT1IwVlRJRDBnZTF4dUlDQXhPaUFuUEQwZ01TNHdMbkpqTGpJbkxDQXZMeUF4TGpBdWNtTXVNaUJwY3lCaFkzUjFZV3hzZVNCeVpYWXlJR0oxZENCa2IyVnpiaWQwSUhKbGNHOXlkQ0JwZEZ4dUlDQXlPaUFuUFQwZ01TNHdMakF0Y21NdU15Y3NYRzRnSURNNklDYzlQU0F4TGpBdU1DMXlZeTQwSnl4Y2JpQWdORG9nSnowOUlERXVlQzU0Snl4Y2JpQWdOVG9nSnowOUlESXVNQzR3TFdGc2NHaGhMbmduTEZ4dUlDQTJPaUFuUGowZ01pNHdMakF0WW1WMFlTNHhKeXhjYmlBZ056b2dKejQ5SURRdU1DNHdKMXh1ZlR0Y2JseHVZMjl1YzNRZ2IySnFaV04wVkhsd1pTQTlJQ2RiYjJKcVpXTjBJRTlpYW1WamRGMG5PMXh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnU0dGdVpHeGxZbUZ5YzBWdWRtbHliMjV0Wlc1MEtHaGxiSEJsY25Nc0lIQmhjblJwWVd4ekxDQmtaV052Y21GMGIzSnpLU0I3WEc0Z0lIUm9hWE11YUdWc2NHVnljeUE5SUdobGJIQmxjbk1nZkh3Z2UzMDdYRzRnSUhSb2FYTXVjR0Z5ZEdsaGJITWdQU0J3WVhKMGFXRnNjeUI4ZkNCN2ZUdGNiaUFnZEdocGN5NWtaV052Y21GMGIzSnpJRDBnWkdWamIzSmhkRzl5Y3lCOGZDQjdmVHRjYmx4dUlDQnlaV2RwYzNSbGNrUmxabUYxYkhSSVpXeHdaWEp6S0hSb2FYTXBPMXh1SUNCeVpXZHBjM1JsY2tSbFptRjFiSFJFWldOdmNtRjBiM0p6S0hSb2FYTXBPMXh1ZlZ4dVhHNUlZVzVrYkdWaVlYSnpSVzUyYVhKdmJtMWxiblF1Y0hKdmRHOTBlWEJsSUQwZ2UxeHVJQ0JqYjI1emRISjFZM1J2Y2pvZ1NHRnVaR3hsWW1GeWMwVnVkbWx5YjI1dFpXNTBMRnh1WEc0Z0lHeHZaMmRsY2pvZ2JHOW5aMlZ5TEZ4dUlDQnNiMmM2SUd4dloyZGxjaTVzYjJjc1hHNWNiaUFnY21WbmFYTjBaWEpJWld4d1pYSTZJR1oxYm1OMGFXOXVLRzVoYldVc0lHWnVLU0I3WEc0Z0lDQWdhV1lnS0hSdlUzUnlhVzVuTG1OaGJHd29ibUZ0WlNrZ1BUMDlJRzlpYW1WamRGUjVjR1VwSUh0Y2JpQWdJQ0FnSUdsbUlDaG1iaWtnZXlCMGFISnZkeUJ1WlhjZ1JYaGpaWEIwYVc5dUtDZEJjbWNnYm05MElITjFjSEJ2Y25SbFpDQjNhWFJvSUcxMWJIUnBjR3hsSUdobGJIQmxjbk1uS1RzZ2ZWeHVJQ0FnSUNBZ1pYaDBaVzVrS0hSb2FYTXVhR1ZzY0dWeWN5d2dibUZ0WlNrN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJSFJvYVhNdWFHVnNjR1Z5YzF0dVlXMWxYU0E5SUdadU8xeHVJQ0FnSUgxY2JpQWdmU3hjYmlBZ2RXNXlaV2RwYzNSbGNraGxiSEJsY2pvZ1puVnVZM1JwYjI0b2JtRnRaU2tnZTF4dUlDQWdJR1JsYkdWMFpTQjBhR2x6TG1obGJIQmxjbk5iYm1GdFpWMDdYRzRnSUgwc1hHNWNiaUFnY21WbmFYTjBaWEpRWVhKMGFXRnNPaUJtZFc1amRHbHZiaWh1WVcxbExDQndZWEowYVdGc0tTQjdYRzRnSUNBZ2FXWWdLSFJ2VTNSeWFXNW5MbU5oYkd3b2JtRnRaU2tnUFQwOUlHOWlhbVZqZEZSNWNHVXBJSHRjYmlBZ0lDQWdJR1Y0ZEdWdVpDaDBhR2x6TG5CaGNuUnBZV3h6TENCdVlXMWxLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQndZWEowYVdGc0lEMDlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWGhqWlhCMGFXOXVLR0JCZEhSbGJYQjBhVzVuSUhSdklISmxaMmx6ZEdWeUlHRWdjR0Z5ZEdsaGJDQmpZV3hzWldRZ1hDSWtlMjVoYldWOVhDSWdZWE1nZFc1a1pXWnBibVZrWUNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCMGFHbHpMbkJoY25ScFlXeHpXMjVoYldWZElEMGdjR0Z5ZEdsaGJEdGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lIVnVjbVZuYVhOMFpYSlFZWEowYVdGc09pQm1kVzVqZEdsdmJpaHVZVzFsS1NCN1hHNGdJQ0FnWkdWc1pYUmxJSFJvYVhNdWNHRnlkR2xoYkhOYmJtRnRaVjA3WEc0Z0lIMHNYRzVjYmlBZ2NtVm5hWE4wWlhKRVpXTnZjbUYwYjNJNklHWjFibU4wYVc5dUtHNWhiV1VzSUdadUtTQjdYRzRnSUNBZ2FXWWdLSFJ2VTNSeWFXNW5MbU5oYkd3b2JtRnRaU2tnUFQwOUlHOWlhbVZqZEZSNWNHVXBJSHRjYmlBZ0lDQWdJR2xtSUNobWJpa2dleUIwYUhKdmR5QnVaWGNnUlhoalpYQjBhVzl1S0NkQmNtY2dibTkwSUhOMWNIQnZjblJsWkNCM2FYUm9JRzExYkhScGNHeGxJR1JsWTI5eVlYUnZjbk1uS1RzZ2ZWeHVJQ0FnSUNBZ1pYaDBaVzVrS0hSb2FYTXVaR1ZqYjNKaGRHOXljeXdnYm1GdFpTazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhSb2FYTXVaR1ZqYjNKaGRHOXljMXR1WVcxbFhTQTlJR1p1TzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnZFc1eVpXZHBjM1JsY2tSbFkyOXlZWFJ2Y2pvZ1puVnVZM1JwYjI0b2JtRnRaU2tnZTF4dUlDQWdJR1JsYkdWMFpTQjBhR2x6TG1SbFkyOXlZWFJ2Y25OYmJtRnRaVjA3WEc0Z0lIMWNibjA3WEc1Y2JtVjRjRzl5ZENCc1pYUWdiRzluSUQwZ2JHOW5aMlZ5TG14dlp6dGNibHh1Wlhod2IzSjBJSHRqY21WaGRHVkdjbUZ0WlN3Z2JHOW5aMlZ5ZlR0Y2JpSXNJbWx0Y0c5eWRDQnlaV2RwYzNSbGNrbHViR2x1WlNCbWNtOXRJQ2N1TDJSbFkyOXlZWFJ2Y25NdmFXNXNhVzVsSnp0Y2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlISmxaMmx6ZEdWeVJHVm1ZWFZzZEVSbFkyOXlZWFJ2Y25Nb2FXNXpkR0Z1WTJVcElIdGNiaUFnY21WbmFYTjBaWEpKYm14cGJtVW9hVzV6ZEdGdVkyVXBPMXh1ZlZ4dVhHNGlMQ0pwYlhCdmNuUWdlMlY0ZEdWdVpIMGdabkp2YlNBbkxpNHZkWFJwYkhNbk8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQm1kVzVqZEdsdmJpaHBibk4wWVc1alpTa2dlMXh1SUNCcGJuTjBZVzVqWlM1eVpXZHBjM1JsY2tSbFkyOXlZWFJ2Y2lnbmFXNXNhVzVsSnl3Z1puVnVZM1JwYjI0b1ptNHNJSEJ5YjNCekxDQmpiMjUwWVdsdVpYSXNJRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQnNaWFFnY21WMElEMGdabTQ3WEc0Z0lDQWdhV1lnS0NGd2NtOXdjeTV3WVhKMGFXRnNjeWtnZTF4dUlDQWdJQ0FnY0hKdmNITXVjR0Z5ZEdsaGJITWdQU0I3ZlR0Y2JpQWdJQ0FnSUhKbGRDQTlJR1oxYm1OMGFXOXVLR052Ym5SbGVIUXNJRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1EzSmxZWFJsSUdFZ2JtVjNJSEJoY25ScFlXeHpJSE4wWVdOcklHWnlZVzFsSUhCeWFXOXlJSFJ2SUdWNFpXTXVYRzRnSUNBZ0lDQWdJR3hsZENCdmNtbG5hVzVoYkNBOUlHTnZiblJoYVc1bGNpNXdZWEowYVdGc2N6dGNiaUFnSUNBZ0lDQWdZMjl1ZEdGcGJtVnlMbkJoY25ScFlXeHpJRDBnWlhoMFpXNWtLSHQ5TENCdmNtbG5hVzVoYkN3Z2NISnZjSE11Y0dGeWRHbGhiSE1wTzF4dUlDQWdJQ0FnSUNCc1pYUWdjbVYwSUQwZ1ptNG9ZMjl1ZEdWNGRDd2diM0IwYVc5dWN5azdYRzRnSUNBZ0lDQWdJR052Ym5SaGFXNWxjaTV3WVhKMGFXRnNjeUE5SUc5eWFXZHBibUZzTzF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnY21WME8xeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOVhHNWNiaUFnSUNCd2NtOXdjeTV3WVhKMGFXRnNjMXR2Y0hScGIyNXpMbUZ5WjNOYk1GMWRJRDBnYjNCMGFXOXVjeTVtYmp0Y2JseHVJQ0FnSUhKbGRIVnliaUJ5WlhRN1hHNGdJSDBwTzF4dWZWeHVJaXdpWEc1amIyNXpkQ0JsY25KdmNsQnliM0J6SUQwZ1d5ZGtaWE5qY21sd2RHbHZiaWNzSUNkbWFXeGxUbUZ0WlNjc0lDZHNhVzVsVG5WdFltVnlKeXdnSjIxbGMzTmhaMlVuTENBbmJtRnRaU2NzSUNkdWRXMWlaWEluTENBbmMzUmhZMnNuWFR0Y2JseHVablZ1WTNScGIyNGdSWGhqWlhCMGFXOXVLRzFsYzNOaFoyVXNJRzV2WkdVcElIdGNiaUFnYkdWMElHeHZZeUE5SUc1dlpHVWdKaVlnYm05a1pTNXNiMk1zWEc0Z0lDQWdJQ0JzYVc1bExGeHVJQ0FnSUNBZ1kyOXNkVzF1TzF4dUlDQnBaaUFvYkc5aktTQjdYRzRnSUNBZ2JHbHVaU0E5SUd4dll5NXpkR0Z5ZEM1c2FXNWxPMXh1SUNBZ0lHTnZiSFZ0YmlBOUlHeHZZeTV6ZEdGeWRDNWpiMngxYlc0N1hHNWNiaUFnSUNCdFpYTnpZV2RsSUNzOUlDY2dMU0FuSUNzZ2JHbHVaU0FySUNjNkp5QXJJR052YkhWdGJqdGNiaUFnZlZ4dVhHNGdJR3hsZENCMGJYQWdQU0JGY25KdmNpNXdjbTkwYjNSNWNHVXVZMjl1YzNSeWRXTjBiM0l1WTJGc2JDaDBhR2x6TENCdFpYTnpZV2RsS1R0Y2JseHVJQ0F2THlCVmJtWnZjblIxYm1GMFpXeDVJR1Z5Y205eWN5QmhjbVVnYm05MElHVnVkVzFsY21GaWJHVWdhVzRnUTJoeWIyMWxJQ2hoZENCc1pXRnpkQ2tzSUhOdklHQm1iM0lnY0hKdmNDQnBiaUIwYlhCZ0lHUnZaWE51SjNRZ2QyOXlheTVjYmlBZ1ptOXlJQ2hzWlhRZ2FXUjRJRDBnTURzZ2FXUjRJRHdnWlhKeWIzSlFjbTl3Y3k1c1pXNW5kR2c3SUdsa2VDc3JLU0I3WEc0Z0lDQWdkR2hwYzF0bGNuSnZjbEJ5YjNCelcybGtlRjFkSUQwZ2RHMXdXMlZ5Y205eVVISnZjSE5iYVdSNFhWMDdYRzRnSUgxY2JseHVJQ0F2S2lCcGMzUmhibUoxYkNCcFoyNXZjbVVnWld4elpTQXFMMXh1SUNCcFppQW9SWEp5YjNJdVkyRndkSFZ5WlZOMFlXTnJWSEpoWTJVcElIdGNiaUFnSUNCRmNuSnZjaTVqWVhCMGRYSmxVM1JoWTJ0VWNtRmpaU2gwYUdsekxDQkZlR05sY0hScGIyNHBPMXh1SUNCOVhHNWNiaUFnZEhKNUlIdGNiaUFnSUNCcFppQW9iRzlqS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbXhwYm1WT2RXMWlaWElnUFNCc2FXNWxPMXh1WEc0Z0lDQWdJQ0F2THlCWGIzSnJJR0Z5YjNWdVpDQnBjM04xWlNCMWJtUmxjaUJ6WVdaaGNta2dkMmhsY21VZ2QyVWdZMkZ1SjNRZ1pHbHlaV04wYkhrZ2MyVjBJSFJvWlNCamIyeDFiVzRnZG1Gc2RXVmNiaUFnSUNBZ0lDOHFJR2x6ZEdGdVluVnNJR2xuYm05eVpTQnVaWGgwSUNvdlhHNGdJQ0FnSUNCcFppQW9UMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S1NCN1hHNGdJQ0FnSUNBZ0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2gwYUdsekxDQW5ZMjlzZFcxdUp5d2dlM1poYkhWbE9pQmpiMngxYlc1OUtUdGNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WTI5c2RXMXVJRDBnWTI5c2RXMXVPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlNCallYUmphQ0FvYm05d0tTQjdYRzRnSUNBZ0x5b2dTV2R1YjNKbElHbG1JSFJvWlNCaWNtOTNjMlZ5SUdseklIWmxjbmtnY0dGeWRHbGpkV3hoY2lBcUwxeHVJQ0I5WEc1OVhHNWNia1Y0WTJWd2RHbHZiaTV3Y205MGIzUjVjR1VnUFNCdVpYY2dSWEp5YjNJb0tUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdSWGhqWlhCMGFXOXVPMXh1SWl3aWFXMXdiM0owSUhKbFoybHpkR1Z5UW14dlkydElaV3h3WlhKTmFYTnphVzVuSUdaeWIyMGdKeTR2YUdWc2NHVnljeTlpYkc5amF5MW9aV3h3WlhJdGJXbHpjMmx1WnljN1hHNXBiWEJ2Y25RZ2NtVm5hWE4wWlhKRllXTm9JR1p5YjIwZ0p5NHZhR1ZzY0dWeWN5OWxZV05vSnp0Y2JtbHRjRzl5ZENCeVpXZHBjM1JsY2tobGJIQmxjazFwYzNOcGJtY2dabkp2YlNBbkxpOW9aV3h3WlhKekwyaGxiSEJsY2kxdGFYTnphVzVuSnp0Y2JtbHRjRzl5ZENCeVpXZHBjM1JsY2tsbUlHWnliMjBnSnk0dmFHVnNjR1Z5Y3k5cFppYzdYRzVwYlhCdmNuUWdjbVZuYVhOMFpYSk1iMmNnWm5KdmJTQW5MaTlvWld4d1pYSnpMMnh2WnljN1hHNXBiWEJ2Y25RZ2NtVm5hWE4wWlhKTWIyOXJkWEFnWm5KdmJTQW5MaTlvWld4d1pYSnpMMnh2YjJ0MWNDYzdYRzVwYlhCdmNuUWdjbVZuYVhOMFpYSlhhWFJvSUdaeWIyMGdKeTR2YUdWc2NHVnljeTkzYVhSb0p6dGNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJSEpsWjJsemRHVnlSR1ZtWVhWc2RFaGxiSEJsY25Nb2FXNXpkR0Z1WTJVcElIdGNiaUFnY21WbmFYTjBaWEpDYkc5amEwaGxiSEJsY2sxcGMzTnBibWNvYVc1emRHRnVZMlVwTzF4dUlDQnlaV2RwYzNSbGNrVmhZMmdvYVc1emRHRnVZMlVwTzF4dUlDQnlaV2RwYzNSbGNraGxiSEJsY2sxcGMzTnBibWNvYVc1emRHRnVZMlVwTzF4dUlDQnlaV2RwYzNSbGNrbG1LR2x1YzNSaGJtTmxLVHRjYmlBZ2NtVm5hWE4wWlhKTWIyY29hVzV6ZEdGdVkyVXBPMXh1SUNCeVpXZHBjM1JsY2t4dmIydDFjQ2hwYm5OMFlXNWpaU2s3WEc0Z0lISmxaMmx6ZEdWeVYybDBhQ2hwYm5OMFlXNWpaU2s3WEc1OVhHNGlMQ0pwYlhCdmNuUWdlMkZ3Y0dWdVpFTnZiblJsZUhSUVlYUm9MQ0JqY21WaGRHVkdjbUZ0WlN3Z2FYTkJjbkpoZVgwZ1puSnZiU0FuTGk0dmRYUnBiSE1uTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlocGJuTjBZVzVqWlNrZ2UxeHVJQ0JwYm5OMFlXNWpaUzV5WldkcGMzUmxja2hsYkhCbGNpZ25ZbXh2WTJ0SVpXeHdaWEpOYVhOemFXNW5KeXdnWm5WdVkzUnBiMjRvWTI5dWRHVjRkQ3dnYjNCMGFXOXVjeWtnZTF4dUlDQWdJR3hsZENCcGJuWmxjbk5sSUQwZ2IzQjBhVzl1Y3k1cGJuWmxjbk5sTEZ4dUlDQWdJQ0FnSUNCbWJpQTlJRzl3ZEdsdmJuTXVabTQ3WEc1Y2JpQWdJQ0JwWmlBb1kyOXVkR1Y0ZENBOVBUMGdkSEoxWlNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdadUtIUm9hWE1wTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvWTI5dWRHVjRkQ0E5UFQwZ1ptRnNjMlVnZkh3Z1kyOXVkR1Y0ZENBOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYVc1MlpYSnpaU2gwYUdsektUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tHbHpRWEp5WVhrb1kyOXVkR1Y0ZENrcElIdGNiaUFnSUNBZ0lHbG1JQ2hqYjI1MFpYaDBMbXhsYm1kMGFDQStJREFwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVhV1J6S1NCN1hHNGdJQ0FnSUNBZ0lDQWdiM0IwYVc5dWN5NXBaSE1nUFNCYmIzQjBhVzl1Y3k1dVlXMWxYVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCcGJuTjBZVzVqWlM1b1pXeHdaWEp6TG1WaFkyZ29ZMjl1ZEdWNGRDd2diM0IwYVc5dWN5azdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2FXNTJaWEp6WlNoMGFHbHpLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVaR0YwWVNBbUppQnZjSFJwYjI1ekxtbGtjeWtnZTF4dUlDQWdJQ0FnSUNCc1pYUWdaR0YwWVNBOUlHTnlaV0YwWlVaeVlXMWxLRzl3ZEdsdmJuTXVaR0YwWVNrN1hHNGdJQ0FnSUNBZ0lHUmhkR0V1WTI5dWRHVjRkRkJoZEdnZ1BTQmhjSEJsYm1SRGIyNTBaWGgwVUdGMGFDaHZjSFJwYjI1ekxtUmhkR0V1WTI5dWRHVjRkRkJoZEdnc0lHOXdkR2x2Ym5NdWJtRnRaU2s3WEc0Z0lDQWdJQ0FnSUc5d2RHbHZibk1nUFNCN1pHRjBZVG9nWkdGMFlYMDdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQm1iaWhqYjI1MFpYaDBMQ0J2Y0hScGIyNXpLVHRjYmlBZ0lDQjlYRzRnSUgwcE8xeHVmVnh1SWl3aWFXMXdiM0owSUh0aGNIQmxibVJEYjI1MFpYaDBVR0YwYUN3Z1lteHZZMnRRWVhKaGJYTXNJR055WldGMFpVWnlZVzFsTENCcGMwRnljbUY1TENCcGMwWjFibU4wYVc5dWZTQm1jbTl0SUNjdUxpOTFkR2xzY3ljN1hHNXBiWEJ2Y25RZ1JYaGpaWEIwYVc5dUlHWnliMjBnSnk0dUwyVjRZMlZ3ZEdsdmJpYzdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1oxYm1OMGFXOXVLR2x1YzNSaGJtTmxLU0I3WEc0Z0lHbHVjM1JoYm1ObExuSmxaMmx6ZEdWeVNHVnNjR1Z5S0NkbFlXTm9KeXdnWm5WdVkzUnBiMjRvWTI5dWRHVjRkQ3dnYjNCMGFXOXVjeWtnZTF4dUlDQWdJR2xtSUNnaGIzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVjRZMlZ3ZEdsdmJpZ25UWFZ6ZENCd1lYTnpJR2wwWlhKaGRHOXlJSFJ2SUNObFlXTm9KeWs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiR1YwSUdadUlEMGdiM0IwYVc5dWN5NW1iaXhjYmlBZ0lDQWdJQ0FnYVc1MlpYSnpaU0E5SUc5d2RHbHZibk11YVc1MlpYSnpaU3hjYmlBZ0lDQWdJQ0FnYVNBOUlEQXNYRzRnSUNBZ0lDQWdJSEpsZENBOUlDY25MRnh1SUNBZ0lDQWdJQ0JrWVhSaExGeHVJQ0FnSUNBZ0lDQmpiMjUwWlhoMFVHRjBhRHRjYmx4dUlDQWdJR2xtSUNodmNIUnBiMjV6TG1SaGRHRWdKaVlnYjNCMGFXOXVjeTVwWkhNcElIdGNiaUFnSUNBZ0lHTnZiblJsZUhSUVlYUm9JRDBnWVhCd1pXNWtRMjl1ZEdWNGRGQmhkR2dvYjNCMGFXOXVjeTVrWVhSaExtTnZiblJsZUhSUVlYUm9MQ0J2Y0hScGIyNXpMbWxrYzFzd1hTa2dLeUFuTGljN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tHbHpSblZ1WTNScGIyNG9ZMjl1ZEdWNGRDa3BJSHNnWTI5dWRHVjRkQ0E5SUdOdmJuUmxlSFF1WTJGc2JDaDBhR2x6S1RzZ2ZWeHVYRzRnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVaR0YwWVNrZ2UxeHVJQ0FnSUNBZ1pHRjBZU0E5SUdOeVpXRjBaVVp5WVcxbEtHOXdkR2x2Ym5NdVpHRjBZU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdablZ1WTNScGIyNGdaWGhsWTBsMFpYSmhkR2x2YmlobWFXVnNaQ3dnYVc1a1pYZ3NJR3hoYzNRcElIdGNiaUFnSUNBZ0lHbG1JQ2hrWVhSaEtTQjdYRzRnSUNBZ0lDQWdJR1JoZEdFdWEyVjVJRDBnWm1sbGJHUTdYRzRnSUNBZ0lDQWdJR1JoZEdFdWFXNWtaWGdnUFNCcGJtUmxlRHRjYmlBZ0lDQWdJQ0FnWkdGMFlTNW1hWEp6ZENBOUlHbHVaR1Y0SUQwOVBTQXdPMXh1SUNBZ0lDQWdJQ0JrWVhSaExteGhjM1FnUFNBaElXeGhjM1E3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLR052Ym5SbGVIUlFZWFJvS1NCN1hHNGdJQ0FnSUNBZ0lDQWdaR0YwWVM1amIyNTBaWGgwVUdGMGFDQTlJR052Ym5SbGVIUlFZWFJvSUNzZ1ptbGxiR1E3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBJRDBnY21WMElDc2dabTRvWTI5dWRHVjRkRnRtYVdWc1pGMHNJSHRjYmlBZ0lDQWdJQ0FnWkdGMFlUb2daR0YwWVN4Y2JpQWdJQ0FnSUNBZ1lteHZZMnRRWVhKaGJYTTZJR0pzYjJOclVHRnlZVzF6S0Z0amIyNTBaWGgwVzJacFpXeGtYU3dnWm1sbGJHUmRMQ0JiWTI5dWRHVjRkRkJoZEdnZ0t5Qm1hV1ZzWkN3Z2JuVnNiRjBwWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb1kyOXVkR1Y0ZENBbUppQjBlWEJsYjJZZ1kyOXVkR1Y0ZENBOVBUMGdKMjlpYW1WamRDY3BJSHRjYmlBZ0lDQWdJR2xtSUNocGMwRnljbUY1S0dOdmJuUmxlSFFwS1NCN1hHNGdJQ0FnSUNBZ0lHWnZjaUFvYkdWMElHb2dQU0JqYjI1MFpYaDBMbXhsYm1kMGFEc2dhU0E4SUdvN0lHa3JLeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2hwSUdsdUlHTnZiblJsZUhRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdWNFpXTkpkR1Z5WVhScGIyNG9hU3dnYVN3Z2FTQTlQVDBnWTI5dWRHVjRkQzVzWlc1bmRHZ2dMU0F4S1R0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJR3hsZENCd2NtbHZja3RsZVR0Y2JseHVJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnJaWGtnYVc0Z1kyOXVkR1Y0ZENrZ2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoamIyNTBaWGgwTG1oaGMwOTNibEJ5YjNCbGNuUjVLR3RsZVNrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklGZGxKM0psSUhKMWJtNXBibWNnZEdobElHbDBaWEpoZEdsdmJuTWdiMjVsSUhOMFpYQWdiM1YwSUc5bUlITjVibU1nYzI4Z2QyVWdZMkZ1SUdSbGRHVmpkRnh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdkR2hsSUd4aGMzUWdhWFJsY21GMGFXOXVJSGRwZEdodmRYUWdhR0YyWlNCMGJ5QnpZMkZ1SUhSb1pTQnZZbXBsWTNRZ2RIZHBZMlVnWVc1a0lHTnlaV0YwWlZ4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnWVc0Z2FYUmxjbTFsWkdsaGRHVWdhMlY1Y3lCaGNuSmhlUzVjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2h3Y21sdmNrdGxlU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHVjRaV05KZEdWeVlYUnBiMjRvY0hKcGIzSkxaWGtzSUdrZ0xTQXhLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0FnSUhCeWFXOXlTMlY1SUQwZ2EyVjVPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FTc3JPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQnBaaUFvY0hKcGIzSkxaWGtnSVQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1SUNBZ0lDQWdJQ0FnSUdWNFpXTkpkR1Z5WVhScGIyNG9jSEpwYjNKTFpYa3NJR2tnTFNBeExDQjBjblZsS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaHBJRDA5UFNBd0tTQjdYRzRnSUNBZ0lDQnlaWFFnUFNCcGJuWmxjbk5sS0hSb2FYTXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCeVpYUTdYRzRnSUgwcE8xeHVmVnh1SWl3aWFXMXdiM0owSUVWNFkyVndkR2x2YmlCbWNtOXRJQ2N1TGk5bGVHTmxjSFJwYjI0bk8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQm1kVzVqZEdsdmJpaHBibk4wWVc1alpTa2dlMXh1SUNCcGJuTjBZVzVqWlM1eVpXZHBjM1JsY2tobGJIQmxjaWduYUdWc2NHVnlUV2x6YzJsdVp5Y3NJR1oxYm1OMGFXOXVLQzhxSUZ0aGNtZHpMQ0JkYjNCMGFXOXVjeUFxTHlrZ2UxeHVJQ0FnSUdsbUlDaGhjbWQxYldWdWRITXViR1Z1WjNSb0lEMDlQU0F4S1NCN1hHNGdJQ0FnSUNBdkx5QkJJRzFwYzNOcGJtY2dabWxsYkdRZ2FXNGdZU0I3ZTJadmIzMTlJR052Ym5OMGNuVmpkQzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjFibVJsWm1sdVpXUTdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUM4dklGTnZiV1Z2Ym1VZ2FYTWdZV04wZFdGc2JIa2dkSEo1YVc1bklIUnZJR05oYkd3Z2MyOXRaWFJvYVc1bkxDQmliRzkzSUhWd0xseHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVjRZMlZ3ZEdsdmJpZ25UV2x6YzJsdVp5Qm9aV3h3WlhJNklGd2lKeUFySUdGeVozVnRaVzUwYzF0aGNtZDFiV1Z1ZEhNdWJHVnVaM1JvSUMwZ01WMHVibUZ0WlNBcklDZGNJaWNwTzF4dUlDQWdJSDFjYmlBZ2ZTazdYRzU5WEc0aUxDSnBiWEJ2Y25RZ2UybHpSVzF3ZEhrc0lHbHpSblZ1WTNScGIyNTlJR1p5YjIwZ0p5NHVMM1YwYVd4ekp6dGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdablZ1WTNScGIyNG9hVzV6ZEdGdVkyVXBJSHRjYmlBZ2FXNXpkR0Z1WTJVdWNtVm5hWE4wWlhKSVpXeHdaWElvSjJsbUp5d2dablZ1WTNScGIyNG9ZMjl1WkdsMGFXOXVZV3dzSUc5d2RHbHZibk1wSUh0Y2JpQWdJQ0JwWmlBb2FYTkdkVzVqZEdsdmJpaGpiMjVrYVhScGIyNWhiQ2twSUhzZ1kyOXVaR2wwYVc5dVlXd2dQU0JqYjI1a2FYUnBiMjVoYkM1allXeHNLSFJvYVhNcE95QjlYRzVjYmlBZ0lDQXZMeUJFWldaaGRXeDBJR0psYUdGMmFXOXlJR2x6SUhSdklISmxibVJsY2lCMGFHVWdjRzl6YVhScGRtVWdjR0YwYUNCcFppQjBhR1VnZG1Gc2RXVWdhWE1nZEhKMWRHaDVJR0Z1WkNCdWIzUWdaVzF3ZEhrdVhHNGdJQ0FnTHk4Z1ZHaGxJR0JwYm1Oc2RXUmxXbVZ5YjJBZ2IzQjBhVzl1SUcxaGVTQmlaU0J6WlhRZ2RHOGdkSEpsWVhRZ2RHaGxJR052Ym1SMGFXOXVZV3dnWVhNZ2NIVnlaV3g1SUc1dmRDQmxiWEIwZVNCaVlYTmxaQ0J2YmlCMGFHVmNiaUFnSUNBdkx5QmlaV2hoZG1sdmNpQnZaaUJwYzBWdGNIUjVMaUJGWm1abFkzUnBkbVZzZVNCMGFHbHpJR1JsZEdWeWJXbHVaWE1nYVdZZ01DQnBjeUJvWVc1a2JHVmtJR0o1SUhSb1pTQndiM05wZEdsMlpTQndZWFJvSUc5eUlHNWxaMkYwYVhabExseHVJQ0FnSUdsbUlDZ29JVzl3ZEdsdmJuTXVhR0Z6YUM1cGJtTnNkV1JsV21WeWJ5QW1KaUFoWTI5dVpHbDBhVzl1WVd3cElIeDhJR2x6Ulcxd2RIa29ZMjl1WkdsMGFXOXVZV3dwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYjNCMGFXOXVjeTVwYm5abGNuTmxLSFJvYVhNcE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdiM0IwYVc5dWN5NW1iaWgwYUdsektUdGNiaUFnSUNCOVhHNGdJSDBwTzF4dVhHNGdJR2x1YzNSaGJtTmxMbkpsWjJsemRHVnlTR1ZzY0dWeUtDZDFibXhsYzNNbkxDQm1kVzVqZEdsdmJpaGpiMjVrYVhScGIyNWhiQ3dnYjNCMGFXOXVjeWtnZTF4dUlDQWdJSEpsZEhWeWJpQnBibk4wWVc1alpTNW9aV3h3WlhKeld5ZHBaaWRkTG1OaGJHd29kR2hwY3l3Z1kyOXVaR2wwYVc5dVlXd3NJSHRtYmpvZ2IzQjBhVzl1Y3k1cGJuWmxjbk5sTENCcGJuWmxjbk5sT2lCdmNIUnBiMjV6TG1adUxDQm9ZWE5vT2lCdmNIUnBiMjV6TG1oaGMyaDlLVHRjYmlBZ2ZTazdYRzU5WEc0aUxDSmxlSEJ2Y25RZ1pHVm1ZWFZzZENCbWRXNWpkR2x2YmlocGJuTjBZVzVqWlNrZ2UxeHVJQ0JwYm5OMFlXNWpaUzV5WldkcGMzUmxja2hsYkhCbGNpZ25iRzluSnl3Z1puVnVZM1JwYjI0b0x5b2diV1Z6YzJGblpTd2diM0IwYVc5dWN5QXFMeWtnZTF4dUlDQWdJR3hsZENCaGNtZHpJRDBnVzNWdVpHVm1hVzVsWkYwc1hHNGdJQ0FnSUNBZ0lHOXdkR2x2Ym5NZ1BTQmhjbWQxYldWdWRITmJZWEpuZFcxbGJuUnpMbXhsYm1kMGFDQXRJREZkTzF4dUlDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnWVhKbmRXMWxiblJ6TG14bGJtZDBhQ0F0SURFN0lHa3JLeWtnZTF4dUlDQWdJQ0FnWVhKbmN5NXdkWE5vS0dGeVozVnRaVzUwYzF0cFhTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2JHVjBJR3hsZG1Wc0lEMGdNVHRjYmlBZ0lDQnBaaUFvYjNCMGFXOXVjeTVvWVhOb0xteGxkbVZzSUNFOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUd4bGRtVnNJRDBnYjNCMGFXOXVjeTVvWVhOb0xteGxkbVZzTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvYjNCMGFXOXVjeTVrWVhSaElDWW1JRzl3ZEdsdmJuTXVaR0YwWVM1c1pYWmxiQ0FoUFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0JzWlhabGJDQTlJRzl3ZEdsdmJuTXVaR0YwWVM1c1pYWmxiRHRjYmlBZ0lDQjlYRzRnSUNBZ1lYSm5jMXN3WFNBOUlHeGxkbVZzTzF4dVhHNGdJQ0FnYVc1emRHRnVZMlV1Ykc5bktDNHVMaUJoY21kektUdGNiaUFnZlNrN1hHNTlYRzRpTENKbGVIQnZjblFnWkdWbVlYVnNkQ0JtZFc1amRHbHZiaWhwYm5OMFlXNWpaU2tnZTF4dUlDQnBibk4wWVc1alpTNXlaV2RwYzNSbGNraGxiSEJsY2lnbmJHOXZhM1Z3Snl3Z1puVnVZM1JwYjI0b2IySnFMQ0JtYVdWc1pDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCdlltb2dKaVlnYjJKcVcyWnBaV3hrWFR0Y2JpQWdmU2s3WEc1OVhHNGlMQ0pwYlhCdmNuUWdlMkZ3Y0dWdVpFTnZiblJsZUhSUVlYUm9MQ0JpYkc5amExQmhjbUZ0Y3l3Z1kzSmxZWFJsUm5KaGJXVXNJR2x6Ulcxd2RIa3NJR2x6Um5WdVkzUnBiMjU5SUdaeWIyMGdKeTR1TDNWMGFXeHpKenRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnWm5WdVkzUnBiMjRvYVc1emRHRnVZMlVwSUh0Y2JpQWdhVzV6ZEdGdVkyVXVjbVZuYVhOMFpYSklaV3h3WlhJb0ozZHBkR2duTENCbWRXNWpkR2x2YmloamIyNTBaWGgwTENCdmNIUnBiMjV6S1NCN1hHNGdJQ0FnYVdZZ0tHbHpSblZ1WTNScGIyNG9ZMjl1ZEdWNGRDa3BJSHNnWTI5dWRHVjRkQ0E5SUdOdmJuUmxlSFF1WTJGc2JDaDBhR2x6S1RzZ2ZWeHVYRzRnSUNBZ2JHVjBJR1p1SUQwZ2IzQjBhVzl1Y3k1bWJqdGNibHh1SUNBZ0lHbG1JQ2doYVhORmJYQjBlU2hqYjI1MFpYaDBLU2tnZTF4dUlDQWdJQ0FnYkdWMElHUmhkR0VnUFNCdmNIUnBiMjV6TG1SaGRHRTdYRzRnSUNBZ0lDQnBaaUFvYjNCMGFXOXVjeTVrWVhSaElDWW1JRzl3ZEdsdmJuTXVhV1J6S1NCN1hHNGdJQ0FnSUNBZ0lHUmhkR0VnUFNCamNtVmhkR1ZHY21GdFpTaHZjSFJwYjI1ekxtUmhkR0VwTzF4dUlDQWdJQ0FnSUNCa1lYUmhMbU52Ym5SbGVIUlFZWFJvSUQwZ1lYQndaVzVrUTI5dWRHVjRkRkJoZEdnb2IzQjBhVzl1Y3k1a1lYUmhMbU52Ym5SbGVIUlFZWFJvTENCdmNIUnBiMjV6TG1sa2Mxc3dYU2s3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUJtYmloamIyNTBaWGgwTENCN1hHNGdJQ0FnSUNBZ0lHUmhkR0U2SUdSaGRHRXNYRzRnSUNBZ0lDQWdJR0pzYjJOclVHRnlZVzF6T2lCaWJHOWphMUJoY21GdGN5aGJZMjl1ZEdWNGRGMHNJRnRrWVhSaElDWW1JR1JoZEdFdVkyOXVkR1Y0ZEZCaGRHaGRLVnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdmNIUnBiMjV6TG1sdWRtVnljMlVvZEdocGN5azdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JuMWNiaUlzSW1sdGNHOXlkQ0I3YVc1a1pYaFBabjBnWm5KdmJTQW5MaTkxZEdsc2N5YzdYRzVjYm14bGRDQnNiMmRuWlhJZ1BTQjdYRzRnSUcxbGRHaHZaRTFoY0RvZ1d5ZGtaV0oxWnljc0lDZHBibVp2Snl3Z0ozZGhjbTRuTENBblpYSnliM0luWFN4Y2JpQWdiR1YyWld3NklDZHBibVp2Snl4Y2JseHVJQ0F2THlCTllYQnpJR0VnWjJsMlpXNGdiR1YyWld3Z2RtRnNkV1VnZEc4Z2RHaGxJR0J0WlhSb2IyUk5ZWEJnSUdsdVpHVjRaWE1nWVdKdmRtVXVYRzRnSUd4dmIydDFjRXhsZG1Wc09pQm1kVzVqZEdsdmJpaHNaWFpsYkNrZ2UxeHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2JHVjJaV3dnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQnNaWFFnYkdWMlpXeE5ZWEFnUFNCcGJtUmxlRTltS0d4dloyZGxjaTV0WlhSb2IyUk5ZWEFzSUd4bGRtVnNMblJ2VEc5M1pYSkRZWE5sS0NrcE8xeHVJQ0FnSUNBZ2FXWWdLR3hsZG1Wc1RXRndJRDQ5SURBcElIdGNiaUFnSUNBZ0lDQWdiR1YyWld3Z1BTQnNaWFpsYkUxaGNEdGNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lHeGxkbVZzSUQwZ2NHRnljMlZKYm5Rb2JHVjJaV3dzSURFd0tUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnYkdWMlpXdzdYRzRnSUgwc1hHNWNiaUFnTHk4Z1EyRnVJR0psSUc5MlpYSnlhV1JrWlc0Z2FXNGdkR2hsSUdodmMzUWdaVzUyYVhKdmJtMWxiblJjYmlBZ2JHOW5PaUJtZFc1amRHbHZiaWhzWlhabGJDd2dMaTR1YldWemMyRm5aU2tnZTF4dUlDQWdJR3hsZG1Wc0lEMGdiRzluWjJWeUxteHZiMnQxY0V4bGRtVnNLR3hsZG1Wc0tUdGNibHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdZMjl1YzI5c1pTQWhQVDBnSjNWdVpHVm1hVzVsWkNjZ0ppWWdiRzluWjJWeUxteHZiMnQxY0V4bGRtVnNLR3h2WjJkbGNpNXNaWFpsYkNrZ1BEMGdiR1YyWld3cElIdGNiaUFnSUNBZ0lHeGxkQ0J0WlhSb2IyUWdQU0JzYjJkblpYSXViV1YwYUc5a1RXRndXMnhsZG1Wc1hUdGNiaUFnSUNBZ0lHbG1JQ2doWTI5dWMyOXNaVnR0WlhSb2IyUmRLU0I3SUNBZ0x5OGdaWE5zYVc1MExXUnBjMkZpYkdVdGJHbHVaU0J1YnkxamIyNXpiMnhsWEc0Z0lDQWdJQ0FnSUcxbGRHaHZaQ0E5SUNkc2IyY25PMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdZMjl1YzI5c1pWdHRaWFJvYjJSZEtDNHVMbTFsYzNOaFoyVXBPeUFnSUNBdkx5QmxjMnhwYm5RdFpHbHpZV0pzWlMxc2FXNWxJRzV2TFdOdmJuTnZiR1ZjYmlBZ0lDQjlYRzRnSUgxY2JuMDdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR3h2WjJkbGNqdGNiaUlzSWk4cUlHZHNiMkpoYkNCM2FXNWtiM2NnS2k5Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdaMWJtTjBhVzl1S0VoaGJtUnNaV0poY25NcElIdGNiaUFnTHlvZ2FYTjBZVzVpZFd3Z2FXZHViM0psSUc1bGVIUWdLaTljYmlBZ2JHVjBJSEp2YjNRZ1BTQjBlWEJsYjJZZ1oyeHZZbUZzSUNFOVBTQW5kVzVrWldacGJtVmtKeUEvSUdkc2IySmhiQ0E2SUhkcGJtUnZkeXhjYmlBZ0lDQWdJQ1JJWVc1a2JHVmlZWEp6SUQwZ2NtOXZkQzVJWVc1a2JHVmlZWEp6TzF4dUlDQXZLaUJwYzNSaGJtSjFiQ0JwWjI1dmNtVWdibVY0ZENBcUwxeHVJQ0JJWVc1a2JHVmlZWEp6TG01dlEyOXVabXhwWTNRZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnBaaUFvY205dmRDNUlZVzVrYkdWaVlYSnpJRDA5UFNCSVlXNWtiR1ZpWVhKektTQjdYRzRnSUNBZ0lDQnliMjkwTGtoaGJtUnNaV0poY25NZ1BTQWtTR0Z1Wkd4bFltRnljenRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUVoaGJtUnNaV0poY25NN1hHNGdJSDA3WEc1OVhHNGlMQ0pwYlhCdmNuUWdLaUJoY3lCVmRHbHNjeUJtY205dElDY3VMM1YwYVd4ekp6dGNibWx0Y0c5eWRDQkZlR05sY0hScGIyNGdabkp2YlNBbkxpOWxlR05sY0hScGIyNG5PMXh1YVcxd2IzSjBJSHNnUTA5TlVFbE1SVkpmVWtWV1NWTkpUMDRzSUZKRlZrbFRTVTlPWDBOSVFVNUhSVk1zSUdOeVpXRjBaVVp5WVcxbElIMGdabkp2YlNBbkxpOWlZWE5sSnp0Y2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHTm9aV05yVW1WMmFYTnBiMjRvWTI5dGNHbHNaWEpKYm1adktTQjdYRzRnSUdOdmJuTjBJR052YlhCcGJHVnlVbVYyYVhOcGIyNGdQU0JqYjIxd2FXeGxja2x1Wm04Z0ppWWdZMjl0Y0dsc1pYSkpibVp2V3pCZElIeDhJREVzWEc0Z0lDQWdJQ0FnSUdOMWNuSmxiblJTWlhacGMybHZiaUE5SUVOUFRWQkpURVZTWDFKRlZrbFRTVTlPTzF4dVhHNGdJR2xtSUNoamIyMXdhV3hsY2xKbGRtbHphVzl1SUNFOVBTQmpkWEp5Wlc1MFVtVjJhWE5wYjI0cElIdGNiaUFnSUNCcFppQW9ZMjl0Y0dsc1pYSlNaWFpwYzJsdmJpQThJR04xY25KbGJuUlNaWFpwYzJsdmJpa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2NuVnVkR2x0WlZabGNuTnBiMjV6SUQwZ1VrVldTVk5KVDA1ZlEwaEJUa2RGVTF0amRYSnlaVzUwVW1WMmFYTnBiMjVkTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl0Y0dsc1pYSldaWEp6YVc5dWN5QTlJRkpGVmtsVFNVOU9YME5JUVU1SFJWTmJZMjl0Y0dsc1pYSlNaWFpwYzJsdmJsMDdYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWGhqWlhCMGFXOXVLQ2RVWlcxd2JHRjBaU0IzWVhNZ2NISmxZMjl0Y0dsc1pXUWdkMmwwYUNCaGJpQnZiR1JsY2lCMlpYSnphVzl1SUc5bUlFaGhibVJzWldKaGNuTWdkR2hoYmlCMGFHVWdZM1Z5Y21WdWRDQnlkVzUwYVcxbExpQW5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDZFFiR1ZoYzJVZ2RYQmtZWFJsSUhsdmRYSWdjSEpsWTI5dGNHbHNaWElnZEc4Z1lTQnVaWGRsY2lCMlpYSnphVzl1SUNnbklDc2djblZ1ZEdsdFpWWmxjbk5wYjI1eklDc2dKeWtnYjNJZ1pHOTNibWR5WVdSbElIbHZkWElnY25WdWRHbHRaU0IwYnlCaGJpQnZiR1JsY2lCMlpYSnphVzl1SUNnbklDc2dZMjl0Y0dsc1pYSldaWEp6YVc5dWN5QXJJQ2NwTGljcE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0F2THlCVmMyVWdkR2hsSUdWdFltVmtaR1ZrSUhabGNuTnBiMjRnYVc1bWJ5QnphVzVqWlNCMGFHVWdjblZ1ZEdsdFpTQmtiMlZ6YmlkMElHdHViM2NnWVdKdmRYUWdkR2hwY3lCeVpYWnBjMmx2YmlCNVpYUmNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZlR05sY0hScGIyNG9KMVJsYlhCc1lYUmxJSGRoY3lCd2NtVmpiMjF3YVd4bFpDQjNhWFJvSUdFZ2JtVjNaWElnZG1WeWMybHZiaUJ2WmlCSVlXNWtiR1ZpWVhKeklIUm9ZVzRnZEdobElHTjFjbkpsYm5RZ2NuVnVkR2x0WlM0Z0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblVHeGxZWE5sSUhWd1pHRjBaU0I1YjNWeUlISjFiblJwYldVZ2RHOGdZU0J1WlhkbGNpQjJaWEp6YVc5dUlDZ25JQ3NnWTI5dGNHbHNaWEpKYm1adld6RmRJQ3NnSnlrdUp5azdYRzRnSUNBZ2ZWeHVJQ0I5WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQjBaVzF3YkdGMFpTaDBaVzF3YkdGMFpWTndaV01zSUdWdWRpa2dlMXh1SUNBdktpQnBjM1JoYm1KMWJDQnBaMjV2Y21VZ2JtVjRkQ0FxTDF4dUlDQnBaaUFvSVdWdWRpa2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QkZlR05sY0hScGIyNG9KMDV2SUdWdWRtbHliMjV0Wlc1MElIQmhjM05sWkNCMGJ5QjBaVzF3YkdGMFpTY3BPMXh1SUNCOVhHNGdJR2xtSUNnaGRHVnRjR3hoZEdWVGNHVmpJSHg4SUNGMFpXMXdiR0YwWlZOd1pXTXViV0ZwYmlrZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCRmVHTmxjSFJwYjI0b0oxVnVhMjV2ZDI0Z2RHVnRjR3hoZEdVZ2IySnFaV04wT2lBbklDc2dkSGx3Wlc5bUlIUmxiWEJzWVhSbFUzQmxZeWs3WEc0Z0lIMWNibHh1SUNCMFpXMXdiR0YwWlZOd1pXTXViV0ZwYmk1a1pXTnZjbUYwYjNJZ1BTQjBaVzF3YkdGMFpWTndaV011YldGcGJsOWtPMXh1WEc0Z0lDOHZJRTV2ZEdVNklGVnphVzVuSUdWdWRpNVdUU0J5WldabGNtVnVZMlZ6SUhKaGRHaGxjaUIwYUdGdUlHeHZZMkZzSUhaaGNpQnlaV1psY21WdVkyVnpJSFJvY205MVoyaHZkWFFnZEdocGN5QnpaV04wYVc5dUlIUnZJR0ZzYkc5M1hHNGdJQzh2SUdadmNpQmxlSFJsY201aGJDQjFjMlZ5Y3lCMGJ5QnZkbVZ5Y21sa1pTQjBhR1Z6WlNCaGN5QndjM1ZsWkc4dGMzVndjRzl5ZEdWa0lFRlFTWE11WEc0Z0lHVnVkaTVXVFM1amFHVmphMUpsZG1semFXOXVLSFJsYlhCc1lYUmxVM0JsWXk1amIyMXdhV3hsY2lrN1hHNWNiaUFnWm5WdVkzUnBiMjRnYVc1MmIydGxVR0Z5ZEdsaGJGZHlZWEJ3WlhJb2NHRnlkR2xoYkN3Z1kyOXVkR1Y0ZEN3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUdsbUlDaHZjSFJwYjI1ekxtaGhjMmdwSUh0Y2JpQWdJQ0FnSUdOdmJuUmxlSFFnUFNCVmRHbHNjeTVsZUhSbGJtUW9lMzBzSUdOdmJuUmxlSFFzSUc5d2RHbHZibk11YUdGemFDazdYRzRnSUNBZ0lDQnBaaUFvYjNCMGFXOXVjeTVwWkhNcElIdGNiaUFnSUNBZ0lDQWdiM0IwYVc5dWN5NXBaSE5iTUYwZ1BTQjBjblZsTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSEJoY25ScFlXd2dQU0JsYm5ZdVZrMHVjbVZ6YjJ4MlpWQmhjblJwWVd3dVkyRnNiQ2gwYUdsekxDQndZWEowYVdGc0xDQmpiMjUwWlhoMExDQnZjSFJwYjI1ektUdGNiaUFnSUNCc1pYUWdjbVZ6ZFd4MElEMGdaVzUyTGxaTkxtbHVkbTlyWlZCaGNuUnBZV3d1WTJGc2JDaDBhR2x6TENCd1lYSjBhV0ZzTENCamIyNTBaWGgwTENCdmNIUnBiMjV6S1R0Y2JseHVJQ0FnSUdsbUlDaHlaWE4xYkhRZ1BUMGdiblZzYkNBbUppQmxibll1WTI5dGNHbHNaU2tnZTF4dUlDQWdJQ0FnYjNCMGFXOXVjeTV3WVhKMGFXRnNjMXR2Y0hScGIyNXpMbTVoYldWZElEMGdaVzUyTG1OdmJYQnBiR1VvY0dGeWRHbGhiQ3dnZEdWdGNHeGhkR1ZUY0dWakxtTnZiWEJwYkdWeVQzQjBhVzl1Y3l3Z1pXNTJLVHRjYmlBZ0lDQWdJSEpsYzNWc2RDQTlJRzl3ZEdsdmJuTXVjR0Z5ZEdsaGJITmJiM0IwYVc5dWN5NXVZVzFsWFNoamIyNTBaWGgwTENCdmNIUnBiMjV6S1R0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0hKbGMzVnNkQ0FoUFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0JwWmlBb2IzQjBhVzl1Y3k1cGJtUmxiblFwSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJR3hwYm1WeklEMGdjbVZ6ZFd4MExuTndiR2wwS0NkY1hHNG5LVHRjYmlBZ0lDQWdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQXNJR3dnUFNCc2FXNWxjeTVzWlc1bmRHZzdJR2tnUENCc095QnBLeXNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvSVd4cGJtVnpXMmxkSUNZbUlHa2dLeUF4SUQwOVBTQnNLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNCc2FXNWxjMXRwWFNBOUlHOXdkR2x2Ym5NdWFXNWtaVzUwSUNzZ2JHbHVaWE5iYVYwN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MElEMGdiR2x1WlhNdWFtOXBiaWduWEZ4dUp5azdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWGhqWlhCMGFXOXVLQ2RVYUdVZ2NHRnlkR2xoYkNBbklDc2diM0IwYVc5dWN5NXVZVzFsSUNzZ0p5QmpiM1ZzWkNCdWIzUWdZbVVnWTI5dGNHbHNaV1FnZDJobGJpQnlkVzV1YVc1bklHbHVJSEoxYm5ScGJXVXRiMjVzZVNCdGIyUmxKeWs3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHk4Z1NuVnpkQ0JoWkdRZ2QyRjBaWEpjYmlBZ2JHVjBJR052Ym5SaGFXNWxjaUE5SUh0Y2JpQWdJQ0J6ZEhKcFkzUTZJR1oxYm1OMGFXOXVLRzlpYWl3Z2JtRnRaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRW9ibUZ0WlNCcGJpQnZZbW9wS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZlR05sY0hScGIyNG9KMXdpSnlBcklHNWhiV1VnS3lBblhDSWdibTkwSUdSbFptbHVaV1FnYVc0Z0p5QXJJRzlpYWlrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCeVpYUjFjbTRnYjJKcVcyNWhiV1ZkTzF4dUlDQWdJSDBzWEc0Z0lDQWdiRzl2YTNWd09pQm1kVzVqZEdsdmJpaGtaWEIwYUhNc0lHNWhiV1VwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR3hsYmlBOUlHUmxjSFJvY3k1c1pXNW5kR2c3WEc0Z0lDQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUd4bGJqc2dhU3NyS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hrWlhCMGFITmJhVjBnSmlZZ1pHVndkR2h6VzJsZFcyNWhiV1ZkSUNFOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1pHVndkR2h6VzJsZFcyNWhiV1ZkTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlN4Y2JpQWdJQ0JzWVcxaVpHRTZJR1oxYm1OMGFXOXVLR04xY25KbGJuUXNJR052Ym5SbGVIUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBlWEJsYjJZZ1kzVnljbVZ1ZENBOVBUMGdKMloxYm1OMGFXOXVKeUEvSUdOMWNuSmxiblF1WTJGc2JDaGpiMjUwWlhoMEtTQTZJR04xY25KbGJuUTdYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lHVnpZMkZ3WlVWNGNISmxjM05wYjI0NklGVjBhV3h6TG1WelkyRndaVVY0Y0hKbGMzTnBiMjRzWEc0Z0lDQWdhVzUyYjJ0bFVHRnlkR2xoYkRvZ2FXNTJiMnRsVUdGeWRHbGhiRmR5WVhCd1pYSXNYRzVjYmlBZ0lDQm1iam9nWm5WdVkzUnBiMjRvYVNrZ2UxeHVJQ0FnSUNBZ2JHVjBJSEpsZENBOUlIUmxiWEJzWVhSbFUzQmxZMXRwWFR0Y2JpQWdJQ0FnSUhKbGRDNWtaV052Y21GMGIzSWdQU0IwWlcxd2JHRjBaVk53WldOYmFTQXJJQ2RmWkNkZE8xeHVJQ0FnSUNBZ2NtVjBkWEp1SUhKbGREdGNiaUFnSUNCOUxGeHVYRzRnSUNBZ2NISnZaM0poYlhNNklGdGRMRnh1SUNBZ0lIQnliMmR5WVcwNklHWjFibU4wYVc5dUtHa3NJR1JoZEdFc0lHUmxZMnhoY21Wa1FteHZZMnRRWVhKaGJYTXNJR0pzYjJOclVHRnlZVzF6TENCa1pYQjBhSE1wSUh0Y2JpQWdJQ0FnSUd4bGRDQndjbTluY21GdFYzSmhjSEJsY2lBOUlIUm9hWE11Y0hKdlozSmhiWE5iYVYwc1hHNGdJQ0FnSUNBZ0lDQWdabTRnUFNCMGFHbHpMbVp1S0drcE8xeHVJQ0FnSUNBZ2FXWWdLR1JoZEdFZ2ZId2daR1Z3ZEdoeklIeDhJR0pzYjJOclVHRnlZVzF6SUh4OElHUmxZMnhoY21Wa1FteHZZMnRRWVhKaGJYTXBJSHRjYmlBZ0lDQWdJQ0FnY0hKdlozSmhiVmR5WVhCd1pYSWdQU0IzY21Gd1VISnZaM0poYlNoMGFHbHpMQ0JwTENCbWJpd2daR0YwWVN3Z1pHVmpiR0Z5WldSQ2JHOWphMUJoY21GdGN5d2dZbXh2WTJ0UVlYSmhiWE1zSUdSbGNIUm9jeWs3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0NGd2NtOW5jbUZ0VjNKaGNIQmxjaWtnZTF4dUlDQWdJQ0FnSUNCd2NtOW5jbUZ0VjNKaGNIQmxjaUE5SUhSb2FYTXVjSEp2WjNKaGJYTmJhVjBnUFNCM2NtRndVSEp2WjNKaGJTaDBhR2x6TENCcExDQm1iaWs3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjSEp2WjNKaGJWZHlZWEJ3WlhJN1hHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdSaGRHRTZJR1oxYm1OMGFXOXVLSFpoYkhWbExDQmtaWEIwYUNrZ2UxeHVJQ0FnSUNBZ2QyaHBiR1VnS0haaGJIVmxJQ1ltSUdSbGNIUm9MUzBwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnNkV1VnUFNCMllXeDFaUzVmY0dGeVpXNTBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdjbVYwZFhKdUlIWmhiSFZsTzF4dUlDQWdJSDBzWEc0Z0lDQWdiV1Z5WjJVNklHWjFibU4wYVc5dUtIQmhjbUZ0TENCamIyMXRiMjRwSUh0Y2JpQWdJQ0FnSUd4bGRDQnZZbW9nUFNCd1lYSmhiU0I4ZkNCamIyMXRiMjQ3WEc1Y2JpQWdJQ0FnSUdsbUlDaHdZWEpoYlNBbUppQmpiMjF0YjI0Z0ppWWdLSEJoY21GdElDRTlQU0JqYjIxdGIyNHBLU0I3WEc0Z0lDQWdJQ0FnSUc5aWFpQTlJRlYwYVd4ekxtVjRkR1Z1WkNoN2ZTd2dZMjl0Ylc5dUxDQndZWEpoYlNrN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCdlltbzdYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lHNXZiM0E2SUdWdWRpNVdUUzV1YjI5d0xGeHVJQ0FnSUdOdmJYQnBiR1Z5U1c1bWJ6b2dkR1Z0Y0d4aGRHVlRjR1ZqTG1OdmJYQnBiR1Z5WEc0Z0lIMDdYRzVjYmlBZ1puVnVZM1JwYjI0Z2NtVjBLR052Ym5SbGVIUXNJRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUd4bGRDQmtZWFJoSUQwZ2IzQjBhVzl1Y3k1a1lYUmhPMXh1WEc0Z0lDQWdjbVYwTGw5elpYUjFjQ2h2Y0hScGIyNXpLVHRjYmlBZ0lDQnBaaUFvSVc5d2RHbHZibk11Y0dGeWRHbGhiQ0FtSmlCMFpXMXdiR0YwWlZOd1pXTXVkWE5sUkdGMFlTa2dlMXh1SUNBZ0lDQWdaR0YwWVNBOUlHbHVhWFJFWVhSaEtHTnZiblJsZUhRc0lHUmhkR0VwTzF4dUlDQWdJSDFjYmlBZ0lDQnNaWFFnWkdWd2RHaHpMRnh1SUNBZ0lDQWdJQ0JpYkc5amExQmhjbUZ0Y3lBOUlIUmxiWEJzWVhSbFUzQmxZeTUxYzJWQ2JHOWphMUJoY21GdGN5QS9JRnRkSURvZ2RXNWtaV1pwYm1Wa08xeHVJQ0FnSUdsbUlDaDBaVzF3YkdGMFpWTndaV011ZFhObFJHVndkR2h6S1NCN1hHNGdJQ0FnSUNCcFppQW9iM0IwYVc5dWN5NWtaWEIwYUhNcElIdGNiaUFnSUNBZ0lDQWdaR1Z3ZEdoeklEMGdZMjl1ZEdWNGRDQWhQU0J2Y0hScGIyNXpMbVJsY0hSb2Mxc3dYU0EvSUZ0amIyNTBaWGgwWFM1amIyNWpZWFFvYjNCMGFXOXVjeTVrWlhCMGFITXBJRG9nYjNCMGFXOXVjeTVrWlhCMGFITTdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQmtaWEIwYUhNZ1BTQmJZMjl1ZEdWNGRGMDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1puVnVZM1JwYjI0Z2JXRnBiaWhqYjI1MFpYaDBMeW9zSUc5d2RHbHZibk1xTHlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUNjbklDc2dkR1Z0Y0d4aGRHVlRjR1ZqTG0xaGFXNG9ZMjl1ZEdGcGJtVnlMQ0JqYjI1MFpYaDBMQ0JqYjI1MFlXbHVaWEl1YUdWc2NHVnljeXdnWTI5dWRHRnBibVZ5TG5CaGNuUnBZV3h6TENCa1lYUmhMQ0JpYkc5amExQmhjbUZ0Y3l3Z1pHVndkR2h6S1R0Y2JpQWdJQ0I5WEc0Z0lDQWdiV0ZwYmlBOUlHVjRaV04xZEdWRVpXTnZjbUYwYjNKektIUmxiWEJzWVhSbFUzQmxZeTV0WVdsdUxDQnRZV2x1TENCamIyNTBZV2x1WlhJc0lHOXdkR2x2Ym5NdVpHVndkR2h6SUh4OElGdGRMQ0JrWVhSaExDQmliRzlqYTFCaGNtRnRjeWs3WEc0Z0lDQWdjbVYwZFhKdUlHMWhhVzRvWTI5dWRHVjRkQ3dnYjNCMGFXOXVjeWs3WEc0Z0lIMWNiaUFnY21WMExtbHpWRzl3SUQwZ2RISjFaVHRjYmx4dUlDQnlaWFF1WDNObGRIVndJRDBnWm5WdVkzUnBiMjRvYjNCMGFXOXVjeWtnZTF4dUlDQWdJR2xtSUNnaGIzQjBhVzl1Y3k1d1lYSjBhV0ZzS1NCN1hHNGdJQ0FnSUNCamIyNTBZV2x1WlhJdWFHVnNjR1Z5Y3lBOUlHTnZiblJoYVc1bGNpNXRaWEpuWlNodmNIUnBiMjV6TG1obGJIQmxjbk1zSUdWdWRpNW9aV3h3WlhKektUdGNibHh1SUNBZ0lDQWdhV1lnS0hSbGJYQnNZWFJsVTNCbFl5NTFjMlZRWVhKMGFXRnNLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuUmhhVzVsY2k1d1lYSjBhV0ZzY3lBOUlHTnZiblJoYVc1bGNpNXRaWEpuWlNodmNIUnBiMjV6TG5CaGNuUnBZV3h6TENCbGJuWXVjR0Z5ZEdsaGJITXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdhV1lnS0hSbGJYQnNZWFJsVTNCbFl5NTFjMlZRWVhKMGFXRnNJSHg4SUhSbGJYQnNZWFJsVTNCbFl5NTFjMlZFWldOdmNtRjBiM0p6S1NCN1hHNGdJQ0FnSUNBZ0lHTnZiblJoYVc1bGNpNWtaV052Y21GMGIzSnpJRDBnWTI5dWRHRnBibVZ5TG0xbGNtZGxLRzl3ZEdsdmJuTXVaR1ZqYjNKaGRHOXljeXdnWlc1MkxtUmxZMjl5WVhSdmNuTXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCamIyNTBZV2x1WlhJdWFHVnNjR1Z5Y3lBOUlHOXdkR2x2Ym5NdWFHVnNjR1Z5Y3p0Y2JpQWdJQ0FnSUdOdmJuUmhhVzVsY2k1d1lYSjBhV0ZzY3lBOUlHOXdkR2x2Ym5NdWNHRnlkR2xoYkhNN1hHNGdJQ0FnSUNCamIyNTBZV2x1WlhJdVpHVmpiM0poZEc5eWN5QTlJRzl3ZEdsdmJuTXVaR1ZqYjNKaGRHOXljenRjYmlBZ0lDQjlYRzRnSUgwN1hHNWNiaUFnY21WMExsOWphR2xzWkNBOUlHWjFibU4wYVc5dUtHa3NJR1JoZEdFc0lHSnNiMk5yVUdGeVlXMXpMQ0JrWlhCMGFITXBJSHRjYmlBZ0lDQnBaaUFvZEdWdGNHeGhkR1ZUY0dWakxuVnpaVUpzYjJOclVHRnlZVzF6SUNZbUlDRmliRzlqYTFCaGNtRnRjeWtnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWNFkyVndkR2x2YmlnbmJYVnpkQ0J3WVhOeklHSnNiMk5ySUhCaGNtRnRjeWNwTzF4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvZEdWdGNHeGhkR1ZUY0dWakxuVnpaVVJsY0hSb2N5QW1KaUFoWkdWd2RHaHpLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhoalpYQjBhVzl1S0NkdGRYTjBJSEJoYzNNZ2NHRnlaVzUwSUdSbGNIUm9jeWNwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQjNjbUZ3VUhKdlozSmhiU2hqYjI1MFlXbHVaWElzSUdrc0lIUmxiWEJzWVhSbFUzQmxZMXRwWFN3Z1pHRjBZU3dnTUN3Z1lteHZZMnRRWVhKaGJYTXNJR1JsY0hSb2N5azdYRzRnSUgwN1hHNGdJSEpsZEhWeWJpQnlaWFE3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQjNjbUZ3VUhKdlozSmhiU2hqYjI1MFlXbHVaWElzSUdrc0lHWnVMQ0JrWVhSaExDQmtaV05zWVhKbFpFSnNiMk5yVUdGeVlXMXpMQ0JpYkc5amExQmhjbUZ0Y3l3Z1pHVndkR2h6S1NCN1hHNGdJR1oxYm1OMGFXOXVJSEJ5YjJjb1kyOXVkR1Y0ZEN3Z2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdiR1YwSUdOMWNuSmxiblJFWlhCMGFITWdQU0JrWlhCMGFITTdYRzRnSUNBZ2FXWWdLR1JsY0hSb2N5QW1KaUJqYjI1MFpYaDBJQ0U5SUdSbGNIUm9jMXN3WFNrZ2UxeHVJQ0FnSUNBZ1kzVnljbVZ1ZEVSbGNIUm9jeUE5SUZ0amIyNTBaWGgwWFM1amIyNWpZWFFvWkdWd2RHaHpLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z1ptNG9ZMjl1ZEdGcGJtVnlMRnh1SUNBZ0lDQWdJQ0JqYjI1MFpYaDBMRnh1SUNBZ0lDQWdJQ0JqYjI1MFlXbHVaWEl1YUdWc2NHVnljeXdnWTI5dWRHRnBibVZ5TG5CaGNuUnBZV3h6TEZ4dUlDQWdJQ0FnSUNCdmNIUnBiMjV6TG1SaGRHRWdmSHdnWkdGMFlTeGNiaUFnSUNBZ0lDQWdZbXh2WTJ0UVlYSmhiWE1nSmlZZ1cyOXdkR2x2Ym5NdVlteHZZMnRRWVhKaGJYTmRMbU52Ym1OaGRDaGliRzlqYTFCaGNtRnRjeWtzWEc0Z0lDQWdJQ0FnSUdOMWNuSmxiblJFWlhCMGFITXBPMXh1SUNCOVhHNWNiaUFnY0hKdlp5QTlJR1Y0WldOMWRHVkVaV052Y21GMGIzSnpLR1p1TENCd2NtOW5MQ0JqYjI1MFlXbHVaWElzSUdSbGNIUm9jeXdnWkdGMFlTd2dZbXh2WTJ0UVlYSmhiWE1wTzF4dVhHNGdJSEJ5YjJjdWNISnZaM0poYlNBOUlHazdYRzRnSUhCeWIyY3VaR1Z3ZEdnZ1BTQmtaWEIwYUhNZ1B5QmtaWEIwYUhNdWJHVnVaM1JvSURvZ01EdGNiaUFnY0hKdlp5NWliRzlqYTFCaGNtRnRjeUE5SUdSbFkyeGhjbVZrUW14dlkydFFZWEpoYlhNZ2ZId2dNRHRjYmlBZ2NtVjBkWEp1SUhCeWIyYzdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCeVpYTnZiSFpsVUdGeWRHbGhiQ2h3WVhKMGFXRnNMQ0JqYjI1MFpYaDBMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lHbG1JQ2doY0dGeWRHbGhiQ2tnZTF4dUlDQWdJR2xtSUNodmNIUnBiMjV6TG01aGJXVWdQVDA5SUNkQWNHRnlkR2xoYkMxaWJHOWpheWNwSUh0Y2JpQWdJQ0FnSUd4bGRDQmtZWFJoSUQwZ2IzQjBhVzl1Y3k1a1lYUmhPMXh1SUNBZ0lDQWdkMmhwYkdVZ0tHUmhkR0ZiSjNCaGNuUnBZV3d0WW14dlkyc25YU0E5UFQwZ2JtOXZjQ2tnZTF4dUlDQWdJQ0FnSUNCa1lYUmhJRDBnWkdGMFlTNWZjR0Z5Wlc1ME8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2NHRnlkR2xoYkNBOUlHUmhkR0ZiSjNCaGNuUnBZV3d0WW14dlkyc25YVHRjYmlBZ0lDQWdJR1JoZEdGYkozQmhjblJwWVd3dFlteHZZMnNuWFNBOUlHNXZiM0E3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lIQmhjblJwWVd3Z1BTQnZjSFJwYjI1ekxuQmhjblJwWVd4elcyOXdkR2x2Ym5NdWJtRnRaVjA3WEc0Z0lDQWdmVnh1SUNCOUlHVnNjMlVnYVdZZ0tDRndZWEowYVdGc0xtTmhiR3dnSmlZZ0lXOXdkR2x2Ym5NdWJtRnRaU2tnZTF4dUlDQWdJQzh2SUZSb2FYTWdhWE1nWVNCa2VXNWhiV2xqSUhCaGNuUnBZV3dnZEdoaGRDQnlaWFIxY201bFpDQmhJSE4wY21sdVoxeHVJQ0FnSUc5d2RHbHZibk11Ym1GdFpTQTlJSEJoY25ScFlXdzdYRzRnSUNBZ2NHRnlkR2xoYkNBOUlHOXdkR2x2Ym5NdWNHRnlkR2xoYkhOYmNHRnlkR2xoYkYwN1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUhCaGNuUnBZV3c3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnBiblp2YTJWUVlYSjBhV0ZzS0hCaGNuUnBZV3dzSUdOdmJuUmxlSFFzSUc5d2RHbHZibk1wSUh0Y2JpQWdiM0IwYVc5dWN5NXdZWEowYVdGc0lEMGdkSEoxWlR0Y2JpQWdhV1lnS0c5d2RHbHZibk11YVdSektTQjdYRzRnSUNBZ2IzQjBhVzl1Y3k1a1lYUmhMbU52Ym5SbGVIUlFZWFJvSUQwZ2IzQjBhVzl1Y3k1cFpITmJNRjBnZkh3Z2IzQjBhVzl1Y3k1a1lYUmhMbU52Ym5SbGVIUlFZWFJvTzF4dUlDQjlYRzVjYmlBZ2JHVjBJSEJoY25ScFlXeENiRzlqYXp0Y2JpQWdhV1lnS0c5d2RHbHZibk11Wm00Z0ppWWdiM0IwYVc5dWN5NW1iaUFoUFQwZ2JtOXZjQ2tnZTF4dUlDQWdJRzl3ZEdsdmJuTXVaR0YwWVNBOUlHTnlaV0YwWlVaeVlXMWxLRzl3ZEdsdmJuTXVaR0YwWVNrN1hHNGdJQ0FnY0dGeWRHbGhiRUpzYjJOcklEMGdiM0IwYVc5dWN5NWtZWFJoV3lkd1lYSjBhV0ZzTFdKc2IyTnJKMTBnUFNCdmNIUnBiMjV6TG1adU8xeHVYRzRnSUNBZ2FXWWdLSEJoY25ScFlXeENiRzlqYXk1d1lYSjBhV0ZzY3lrZ2UxeHVJQ0FnSUNBZ2IzQjBhVzl1Y3k1d1lYSjBhV0ZzY3lBOUlGVjBhV3h6TG1WNGRHVnVaQ2g3ZlN3Z2IzQjBhVzl1Y3k1d1lYSjBhV0ZzY3l3Z2NHRnlkR2xoYkVKc2IyTnJMbkJoY25ScFlXeHpLVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0JwWmlBb2NHRnlkR2xoYkNBOVBUMGdkVzVrWldacGJtVmtJQ1ltSUhCaGNuUnBZV3hDYkc5amF5a2dlMXh1SUNBZ0lIQmhjblJwWVd3Z1BTQndZWEowYVdGc1FteHZZMnM3WEc0Z0lIMWNibHh1SUNCcFppQW9jR0Z5ZEdsaGJDQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUVWNFkyVndkR2x2YmlnblZHaGxJSEJoY25ScFlXd2dKeUFySUc5d2RHbHZibk11Ym1GdFpTQXJJQ2NnWTI5MWJHUWdibTkwSUdKbElHWnZkVzVrSnlrN1hHNGdJSDBnWld4elpTQnBaaUFvY0dGeWRHbGhiQ0JwYm5OMFlXNWpaVzltSUVaMWJtTjBhVzl1S1NCN1hHNGdJQ0FnY21WMGRYSnVJSEJoY25ScFlXd29ZMjl1ZEdWNGRDd2diM0IwYVc5dWN5azdYRzRnSUgxY2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJRzV2YjNBb0tTQjdJSEpsZEhWeWJpQW5KenNnZlZ4dVhHNW1kVzVqZEdsdmJpQnBibWwwUkdGMFlTaGpiMjUwWlhoMExDQmtZWFJoS1NCN1hHNGdJR2xtSUNnaFpHRjBZU0I4ZkNBaEtDZHliMjkwSnlCcGJpQmtZWFJoS1NrZ2UxeHVJQ0FnSUdSaGRHRWdQU0JrWVhSaElEOGdZM0psWVhSbFJuSmhiV1VvWkdGMFlTa2dPaUI3ZlR0Y2JpQWdJQ0JrWVhSaExuSnZiM1FnUFNCamIyNTBaWGgwTzF4dUlDQjlYRzRnSUhKbGRIVnliaUJrWVhSaE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCbGVHVmpkWFJsUkdWamIzSmhkRzl5Y3lobWJpd2djSEp2Wnl3Z1kyOXVkR0ZwYm1WeUxDQmtaWEIwYUhNc0lHUmhkR0VzSUdKc2IyTnJVR0Z5WVcxektTQjdYRzRnSUdsbUlDaG1iaTVrWldOdmNtRjBiM0lwSUh0Y2JpQWdJQ0JzWlhRZ2NISnZjSE1nUFNCN2ZUdGNiaUFnSUNCd2NtOW5JRDBnWm00dVpHVmpiM0poZEc5eUtIQnliMmNzSUhCeWIzQnpMQ0JqYjI1MFlXbHVaWElzSUdSbGNIUm9jeUFtSmlCa1pYQjBhSE5iTUYwc0lHUmhkR0VzSUdKc2IyTnJVR0Z5WVcxekxDQmtaWEIwYUhNcE8xeHVJQ0FnSUZWMGFXeHpMbVY0ZEdWdVpDaHdjbTluTENCd2NtOXdjeWs3WEc0Z0lIMWNiaUFnY21WMGRYSnVJSEJ5YjJjN1hHNTlYRzRpTENJdkx5QkNkV2xzWkNCdmRYUWdiM1Z5SUdKaGMybGpJRk5oWm1WVGRISnBibWNnZEhsd1pWeHVablZ1WTNScGIyNGdVMkZtWlZOMGNtbHVaeWh6ZEhKcGJtY3BJSHRjYmlBZ2RHaHBjeTV6ZEhKcGJtY2dQU0J6ZEhKcGJtYzdYRzU5WEc1Y2JsTmhabVZUZEhKcGJtY3VjSEp2ZEc5MGVYQmxMblJ2VTNSeWFXNW5JRDBnVTJGbVpWTjBjbWx1Wnk1d2NtOTBiM1I1Y0dVdWRHOUlWRTFNSUQwZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUhKbGRIVnliaUFuSnlBcklIUm9hWE11YzNSeWFXNW5PMXh1ZlR0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1UyRm1aVk4wY21sdVp6dGNiaUlzSW1OdmJuTjBJR1Z6WTJGd1pTQTlJSHRjYmlBZ0p5WW5PaUFuSm1GdGNEc25MRnh1SUNBblBDYzZJQ2NtYkhRN0p5eGNiaUFnSno0bk9pQW5KbWQwT3ljc1hHNGdJQ2RjSWljNklDY21jWFZ2ZERzbkxGeHVJQ0JjSWlkY0lqb2dKeVlqZURJM095Y3NYRzRnSUNkZ0p6b2dKeVlqZURZd095Y3NYRzRnSUNjOUp6b2dKeVlqZURORU95ZGNibjA3WEc1Y2JtTnZibk4wSUdKaFpFTm9ZWEp6SUQwZ0wxc21QRDVjSWlkZ1BWMHZaeXhjYmlBZ0lDQWdJSEJ2YzNOcFlteGxJRDBnTDFzbVBENWNJaWRnUFYwdk8xeHVYRzVtZFc1amRHbHZiaUJsYzJOaGNHVkRhR0Z5S0dOb2Npa2dlMXh1SUNCeVpYUjFjbTRnWlhOallYQmxXMk5vY2wwN1hHNTlYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJsZUhSbGJtUW9iMkpxTHlvZ0xDQXVMaTV6YjNWeVkyVWdLaThwSUh0Y2JpQWdabTl5SUNoc1pYUWdhU0E5SURFN0lHa2dQQ0JoY21kMWJXVnVkSE11YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNCbWIzSWdLR3hsZENCclpYa2dhVzRnWVhKbmRXMWxiblJ6VzJsZEtTQjdYRzRnSUNBZ0lDQnBaaUFvVDJKcVpXTjBMbkJ5YjNSdmRIbHdaUzVvWVhOUGQyNVFjbTl3WlhKMGVTNWpZV3hzS0dGeVozVnRaVzUwYzF0cFhTd2dhMlY1S1NrZ2UxeHVJQ0FnSUNBZ0lDQnZZbXBiYTJWNVhTQTlJR0Z5WjNWdFpXNTBjMXRwWFZ0clpYbGRPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnZZbW83WEc1OVhHNWNibVY0Y0c5eWRDQnNaWFFnZEc5VGRISnBibWNnUFNCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTzF4dVhHNHZMeUJUYjNWeVkyVmtJR1p5YjIwZ2JHOWtZWE5vWEc0dkx5Qm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZZbVZ6ZEdsbGFuTXZiRzlrWVhOb0wySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXVkSGgwWEc0dktpQmxjMnhwYm5RdFpHbHpZV0pzWlNCbWRXNWpMWE4wZVd4bElDb3ZYRzVzWlhRZ2FYTkdkVzVqZEdsdmJpQTlJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUhKbGRIVnliaUIwZVhCbGIyWWdkbUZzZFdVZ1BUMDlJQ2RtZFc1amRHbHZiaWM3WEc1OU8xeHVMeThnWm1Gc2JHSmhZMnNnWm05eUlHOXNaR1Z5SUhabGNuTnBiMjV6SUc5bUlFTm9jbTl0WlNCaGJtUWdVMkZtWVhKcFhHNHZLaUJwYzNSaGJtSjFiQ0JwWjI1dmNtVWdibVY0ZENBcUwxeHVhV1lnS0dselJuVnVZM1JwYjI0b0wzZ3ZLU2tnZTF4dUlDQnBjMFoxYm1OMGFXOXVJRDBnWm5WdVkzUnBiMjRvZG1Gc2RXVXBJSHRjYmlBZ0lDQnlaWFIxY200Z2RIbHdaVzltSUhaaGJIVmxJRDA5UFNBblpuVnVZM1JwYjI0bklDWW1JSFJ2VTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwSUQwOVBTQW5XMjlpYW1WamRDQkdkVzVqZEdsdmJsMG5PMXh1SUNCOU8xeHVmVnh1Wlhod2IzSjBJSHRwYzBaMWJtTjBhVzl1ZlR0Y2JpOHFJR1Z6YkdsdWRDMWxibUZpYkdVZ1puVnVZeTF6ZEhsc1pTQXFMMXh1WEc0dktpQnBjM1JoYm1KMWJDQnBaMjV2Y21VZ2JtVjRkQ0FxTDF4dVpYaHdiM0owSUdOdmJuTjBJR2x6UVhKeVlYa2dQU0JCY25KaGVTNXBjMEZ5Y21GNUlIeDhJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUhKbGRIVnliaUFvZG1Gc2RXVWdKaVlnZEhsd1pXOW1JSFpoYkhWbElEMDlQU0FuYjJKcVpXTjBKeWtnUHlCMGIxTjBjbWx1Wnk1allXeHNLSFpoYkhWbEtTQTlQVDBnSjF0dlltcGxZM1FnUVhKeVlYbGRKeUE2SUdaaGJITmxPMXh1ZlR0Y2JseHVMeThnVDJ4a1pYSWdTVVVnZG1WeWMybHZibk1nWkc4Z2JtOTBJR1JwY21WamRHeDVJSE4xY0hCdmNuUWdhVzVrWlhoUFppQnpieUIzWlNCdGRYTjBJR2x0Y0d4bGJXVnVkQ0J2ZFhJZ2IzZHVMQ0J6WVdSc2VTNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnBibVJsZUU5bUtHRnljbUY1TENCMllXeDFaU2tnZTF4dUlDQm1iM0lnS0d4bGRDQnBJRDBnTUN3Z2JHVnVJRDBnWVhKeVlYa3ViR1Z1WjNSb095QnBJRHdnYkdWdU95QnBLeXNwSUh0Y2JpQWdJQ0JwWmlBb1lYSnlZWGxiYVYwZ1BUMDlJSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2FUdGNiaUFnSUNCOVhHNGdJSDFjYmlBZ2NtVjBkWEp1SUMweE8xeHVmVnh1WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCbGMyTmhjR1ZGZUhCeVpYTnphVzl1S0hOMGNtbHVaeWtnZTF4dUlDQnBaaUFvZEhsd1pXOW1JSE4wY21sdVp5QWhQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0F2THlCa2IyNG5kQ0JsYzJOaGNHVWdVMkZtWlZOMGNtbHVaM01zSUhOcGJtTmxJSFJvWlhrbmNtVWdZV3h5WldGa2VTQnpZV1psWEc0Z0lDQWdhV1lnS0hOMGNtbHVaeUFtSmlCemRISnBibWN1ZEc5SVZFMU1LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1J5YVc1bkxuUnZTRlJOVENncE8xeHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb2MzUnlhVzVuSUQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUFuSnp0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0NGemRISnBibWNwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZEhKcGJtY2dLeUFuSnp0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCR2IzSmpaU0JoSUhOMGNtbHVaeUJqYjI1MlpYSnphVzl1SUdGeklIUm9hWE1nZDJsc2JDQmlaU0JrYjI1bElHSjVJSFJvWlNCaGNIQmxibVFnY21WbllYSmtiR1Z6Y3lCaGJtUmNiaUFnSUNBdkx5QjBhR1VnY21WblpYZ2dkR1Z6ZENCM2FXeHNJR1J2SUhSb2FYTWdkSEpoYm5Od1lYSmxiblJzZVNCaVpXaHBibVFnZEdobElITmpaVzVsY3l3Z1kyRjFjMmx1WnlCcGMzTjFaWE1nYVdaY2JpQWdJQ0F2THlCaGJpQnZZbXBsWTNRbmN5QjBieUJ6ZEhKcGJtY2dhR0Z6SUdWelkyRndaV1FnWTJoaGNtRmpkR1Z5Y3lCcGJpQnBkQzVjYmlBZ0lDQnpkSEpwYm1jZ1BTQW5KeUFySUhOMGNtbHVaenRjYmlBZ2ZWeHVYRzRnSUdsbUlDZ2hjRzl6YzJsaWJHVXVkR1Z6ZENoemRISnBibWNwS1NCN0lISmxkSFZ5YmlCemRISnBibWM3SUgxY2JpQWdjbVYwZFhKdUlITjBjbWx1Wnk1eVpYQnNZV05sS0dKaFpFTm9ZWEp6TENCbGMyTmhjR1ZEYUdGeUtUdGNibjFjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdselJXMXdkSGtvZG1Gc2RXVXBJSHRjYmlBZ2FXWWdLQ0YyWVd4MVpTQW1KaUIyWVd4MVpTQWhQVDBnTUNrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwY25WbE8xeHVJQ0I5SUdWc2MyVWdhV1lnS0dselFYSnlZWGtvZG1Gc2RXVXBJQ1ltSUhaaGJIVmxMbXhsYm1kMGFDQTlQVDBnTUNrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwY25WbE8xeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWTNKbFlYUmxSbkpoYldVb2IySnFaV04wS1NCN1hHNGdJR3hsZENCbWNtRnRaU0E5SUdWNGRHVnVaQ2g3ZlN3Z2IySnFaV04wS1R0Y2JpQWdabkpoYldVdVgzQmhjbVZ1ZENBOUlHOWlhbVZqZER0Y2JpQWdjbVYwZFhKdUlHWnlZVzFsTzF4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdZbXh2WTJ0UVlYSmhiWE1vY0dGeVlXMXpMQ0JwWkhNcElIdGNiaUFnY0dGeVlXMXpMbkJoZEdnZ1BTQnBaSE03WEc0Z0lISmxkSFZ5YmlCd1lYSmhiWE03WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmhjSEJsYm1SRGIyNTBaWGgwVUdGMGFDaGpiMjUwWlhoMFVHRjBhQ3dnYVdRcElIdGNiaUFnY21WMGRYSnVJQ2hqYjI1MFpYaDBVR0YwYUNBL0lHTnZiblJsZUhSUVlYUm9JQ3NnSnk0bklEb2dKeWNwSUNzZ2FXUTdYRzU5WEc0aUxDSXZMeUJEY21WaGRHVWdZU0J6YVcxd2JHVWdjR0YwYUNCaGJHbGhjeUIwYnlCaGJHeHZkeUJpY205M2MyVnlhV1o1SUhSdklISmxjMjlzZG1WY2JpOHZJSFJvWlNCeWRXNTBhVzFsSUc5dUlHRWdjM1Z3Y0c5eWRHVmtJSEJoZEdndVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlISmxjWFZwY21Vb0p5NHZaR2x6ZEM5amFuTXZhR0Z1Wkd4bFltRnljeTV5ZFc1MGFXMWxKeWxiSjJSbFptRjFiSFFuWFR0Y2JpSXNJbTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdjbVZ4ZFdseVpTaGNJbWhoYm1Sc1pXSmhjbk12Y25WdWRHbHRaVndpS1Z0Y0ltUmxabUYxYkhSY0lsMDdYRzRpWFgwPSJ9
