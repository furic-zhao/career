var beijingjieshaoTemp = require('./beijingjieshao.hbs');
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

$$(".app-nav").html(appNavTemp());
myApp.onPageInit('index', function(page) {
    $$(".app-nav").html(appNavTemp());
});

/* ===== Modals Page events  ===== */
myApp.onPageInit('beijingjieshao', function(page) {
    $$('.demo-picker-modal').on('click', function() {
        myApp.pickerModal(beijingjieshaoTemp());
    });
});

myApp.onPageInit('jingli', function(page) {
    $$('.demo-popup').on('click', function() {
        myApp.popup(popupTemp());
    });
});


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