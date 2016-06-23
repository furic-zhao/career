var beijingjieshaoTemp = require('./beijingjieshao.hbs');
var popupTemp = require('./popup.hbs');

var appNavTemp = require('./app-nav.hbs');



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


var workInfo = {
    data: [{
        name: "userCenter",
        list: [{
            url: '../static/images/works/idhua/hy01.jpg',
            caption: '360会员中心首页'
        }, {
            url: '../static/images/works/idhua/hy02.jpg',
            caption: '360会员中心做任务'
        }, {
            url: '../static/images/works/idhua/hy03.jpg',
            caption: '360会员中心领特权'
        }]
    }]
};

var photoBrowserPhotos = [{
        url: '../static/images/works/idhua/hy01.jpg',
        caption: '360会员中心首页'
    }, {
        url: '../static/images/works/idhua/hy02.jpg',
        caption: '360会员中心做任务'
    }, {
        url: '../static/images/works/idhua/hy03.jpg',
        caption: '360会员中心领特权'
    }

];



myApp.onPageInit('works', function(page) {
    $$('.show-photo').on('click', function() {
        myApp.photoBrowser({
            photos: photoBrowserPhotos,
            lazyLoading: true,
            theme: 'dark',
            backLinkText: '返回'
        }).open();
    });
});