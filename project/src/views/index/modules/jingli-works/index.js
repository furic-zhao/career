var workService = require('../../service/works');

var worksListTemp = require('../public/works-list.hbs');

module.exports = {
	render: function() {
		return Q.Promise(function(resolve, reject) {

			/*经历相关作品*/
			myApp.onPageInit('jingli-work', function(page) {

				var typeVal = page.query.type;

				workService.getTypeList(typeVal).then(function(data) {
					var workPopupTitle = {
						"2012": "2012年~至今 的作品",
						"2007": "2007年~2012年 的作品",
						"2004": "2004年~2007年 的作品"
					};
					$$(".jingli-works-title").html(workPopupTitle[typeVal]);
					$$(".works-list-box")
						.html(worksListTemp(data))
						.find('.js-card')
						.addClass('swiper-slide')
						.find(".swiper-lazy")
						.append('<div class="preloader"></div>');

					myApp.initImagesLazyLoad('.page');

					myApp.swiper('.swiper-container', {
						preloadImages: false,
						lazyLoading: true,
						pagination: '.swiper-pagination',
						// effect: 'coverflow',
						slidesPerView: 'auto',
						centeredSlides: true
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
			resolve();
		});
	}
};