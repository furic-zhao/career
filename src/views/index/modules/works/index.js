var workService = require('../../service/works');

var worksListTemp = require('../public/works-list.hbs');

module.exports = {
	render: function() {
		return Q.Promise(function(resolve, reject) {
			/*作品页面*/
			myApp.onPageInit('works', function(page) {

				workService.getList().then(function(data) {
					$$("#js-works-list").html(worksListTemp(data));

					/*
					初始化图片赖加载
					 */
					myApp.initImagesLazyLoad('.page');

					/*
					图册浏览
					 */
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