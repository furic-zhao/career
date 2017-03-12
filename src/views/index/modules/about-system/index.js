var blockContentTemp = require('../public/block-content.hbs');

var blockData = require('../../service/block');

module.exports = {
	render: function() {
		return Q.Promise(function(resolve, reject) {
			blockData.getAboutSystem().then(function(data) {
				$$("#js-panel-left").append(blockContentTemp(data));
			});

			blockData.getIndexData().then(function(data) {
				$$("#js-page-content").append(blockContentTemp(data));
			});

			myApp.onPageInit('home', function(page) {
				blockData.getIndexData().then(function(data) {
					$$("#js-page-content").append(blockContentTemp(data));
				});
			});

			resolve();
		});
	}
};