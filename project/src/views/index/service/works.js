var workInfo = {
	data: [{
		id: "userCenter",
		name: "安全卫士会员中心",
		desc: "安全卫士会员中心内嵌页面",
		cover: "../static/images/works/ucenter360/01.jpg",
		list: [{
			url: '../static/images/works/ucenter360/01.jpg',
			caption: '360会员中心首页'
		}, {
			url: '../static/images/works/ucenter360/02.jpg',
			caption: '360会员中心做任务'
		}, {
			url: '../static/images/works/ucenter360/03.jpg',
			caption: '360会员中心领特权'
		}]
	}, {
		id: "idnac",
		name: "IDNac实名制ID网络管理系统",
		desc: "后台基于Linux+C+zend库架构，通过PHP层调用相关功能封装函数，用WEB技术CSS、Javascript、Flash、XML、Jquery、JS模块功能库来实现相关功能",
		cover: "../static/images/works/idnac/01.png",
		list: [{
			url: '../static/images/works/idnac/01.png',
			caption: ''
		}, {
			url: '../static/images/works/idnac/02.png',
			caption: ''
		}, {
			url: '../static/images/works/idnac/03.png',
			caption: ''
		}, {
			url: '../static/images/works/idnac/04.png',
			caption: ''
		}, {
			url: '../static/images/works/idnac/05.png',
			caption: ''
		}, {
			url: '../static/images/works/idnac/06.png',
			caption: ''
		}, {
			url: '../static/images/works/idnac/07.png',
			caption: ''
		}, {
			url: '../static/images/works/idnac/08.png',
			caption: ''
		}]
	}]
};

var works = {
	getList: function() {
		var listData = [];
		return Q.Promise(function(resolve, reject) {

			workInfo.data.map(function(item) {
				var itemData = {};
				itemData.id = item.id;
				itemData.name = item.name;
				itemData.desc = item.desc;
				itemData.cover = item.cover || item.list[0].url;

				listData.push(itemData);
			});
			resolve(listData);
		});
	},
	getById: function(id) {
		var itemData = {};
		return Q.Promise(function(resolve, reject) {
			workInfo.data.map(function(item) {
				if(id == item.id) {
					itemData = item;
				}
			});
			resolve(itemData);
		});
	}
};

module.exports = works;