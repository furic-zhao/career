var popupTemp = require('./popup.hbs');

var appNavTemp = require('./app-nav.hbs');

var worksListTemp = require('./works-list.hbs');

var workService = require('./service/works');

// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
});

/*加载导航模板*/
$$(".app-nav").append(appNavTemp());

/*经历相关作品*/
myApp.onPageInit('jingli-work', function(page) {
    console.log(page);
    var typeVal = page.query.type;
    workService.getTypeList(typeVal).then(function(data) {
        var workPopupTitle = {
            "2012": "2012年~至今 的作品",
            "2007": "2007年~2012年 的作品",
            "2004": "2004年~2007年 的作品"
        };
        $$(".jingli-works-title").html(workPopupTitle[typeVal]);
        $$(".works-list-box").html(worksListTemp(data));
        myApp.swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            // effect: 'coverflow',
            slidesPerView: 'auto',
            centeredSlides: true,
            preloadImages: false,
            lazyLoading: true
        });

        $$('.show-photo').on('click', function() {
            var $$this = $$(this);

            workService.getById($$this.attr("data-id")).then(function(data) {
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

/*作品*/
myApp.onPageInit('works', function(page) {

    workService.getList().then(function(data) {
        $$(".works-list-box").html(worksListTemp(data));

        $$('.show-photo').on('click', function() {
            var $$this = $$(this);

            workService.getById($$this.attr("data-id")).then(function(data) {
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