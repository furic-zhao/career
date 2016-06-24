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
$$(".app-nav").html(appNavTemp());
myApp.onPageInit('index', function(page) {
    $$(".app-nav").html(appNavTemp());
});

/*经历*/
myApp.onPageInit('jingli', function(page) {
    $$('.demo-popup').on('click', function() {
        myApp.popup(popupTemp());
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