var baikeSummaryData = require('../../service/baike-summary');

module.exports = {
	render: function() {
		return Q.Promise(function(resolve, reject) {
			/*本人经历*/
			myApp.onPageInit('jingli', function(page) {

				$$('.baike-summary').on('click', function() {
					myApp.photoBrowser({
						photos: baikeSummaryData,
						lazyLoading: true,
						theme: 'dark',
						backLinkText: '返回'
					}).open();

				});
			});

			resolve();
		});
	}
};