var basic = require('../../service/basic');

var basicTemp = require('../public/block-list.hbs');

var moduleFavicon = require('../favicon');

module.exports = {
	render: function() {
		return Q.Promise(function(resolve, reject) {
			myApp.onPageInit('basic', function(page) {
				basic.getListAll().then(function(data) {
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