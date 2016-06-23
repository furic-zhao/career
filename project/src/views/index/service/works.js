var workInfo = {
	data: [{
		id: "userCenter",
		name: "安全卫士会员中心",
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

var works = {
	getList: function() {
		var listData = [];
		return Q.Promise(function(resolve, reject) {
			var itemData = {};

			workInfo.data.foreach(function(idx,val) {
				itemData.id = val.id;
				itemData.name = val.name;
				itemData.image = val.list[0].url;

				listData.push(itemData);
				resolve(listData);
			});
		});
	}
};

module.exports = works;