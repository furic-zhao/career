var appNavTemp = require('./app-nav.hbs');

module.exports = {
	render: function() {
		return Q.Promise(function(resolve, reject) {
			/*加载导航模板*/

			$$(".app-nav").append(appNavTemp());
			myApp.onPageInit('home', function(page) {
				$$(".index-app-nav").append(appNavTemp());

			});
			resolve();
		});
	}
};