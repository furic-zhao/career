var basic = require('../../service/basic');

var faviconTemp = require('./favicon.hbs');

module.exports = {
	render:function($$box) {

		return Q.Promise(function() {

			basic.getFaviconData().then(function(data) {
				$$box.prepend(faviconTemp(data))
			});
			resolve();
		});
	}
};