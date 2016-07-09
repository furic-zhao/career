var appNavTemp = require('./app-nav.hbs');

module.exports = {
	render: function() {
		return Q.Promise(function(resolve, reject) {
			/*加载导航模板*/
<<<<<<< HEAD
=======

>>>>>>> 08d0c018126c5a36bb5ce6d9eef5b73e19a376f0
			$$(".app-nav").append(appNavTemp());
			myApp.onPageInit('home', function(page) {
				$$(".index-app-nav").append(appNavTemp());

			});
			resolve();
		});
	}
};