var moduleExperienceWorks = require('../experience-works');

var baikeSummaryData = require('../../service/baike-summary');

var tabNavTemp = require("./tab-nav.hbs");
var tabContentTemp = require("./tab-content.hbs");

var experienceData = require("../../service/experience");

var Handlebars = require("hbsfy/runtime");

Handlebars.registerHelper("addOne", function(index) {

    return index + 1;
});

Handlebars.registerHelper("addActive", function(index) {

    if (index == 0) {
        return "active";
    }
    return "";
});

Handlebars.registerHelper("addOtherHref", function(type) {
    if (type == '2012') {
        return '<p><a href="#" class="button baike-summary">百科年度工作总结</a></p>';
    }
});

module.exports = {
    render: function() {
        return Q.Promise(function(resolve, reject) {

            /*百科年度总结*/
            myApp.onPageInit('experience', function(page) {

                experienceData.getListTitle().then(function(data) {
                    $$("#js-tab-nav").html(tabNavTemp(data));
                });

                experienceData.getListAll().then(function(data) {
                    $$("#js-tab-content").html(tabContentTemp(data));
                    // myApp.initPageSwiper('.page');

                    $$('.baike-summary').on('click', function() {
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
