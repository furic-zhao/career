var basicData = [{
	title: '基本信息',
	content: [{
		subtitle: '姓名',
		subcontent: '赵会见(Furic)'
	}, {
		subtitle: '性别',
		subcontent: '男'
	}, {
		subtitle: '出生年月',
		subcontent: '1982年4月'
	}, {
		subtitle: '民族',
		subcontent: '汉族'
	}, {
		subtitle: '婚姻状况',
		subcontent: '已婚'
	}, {
		subtitle: '籍贯',
		subcontent: '河南'
	}, {
		subtitle: '兴趣爱好',
		subcontent: '电子、硬件、DIY'
	}]
}, {
	title: '背景介绍',
	content: [{
		subtitle: '工作经验',
		subcontent: '12年WEB产品架构研发'
	}, {
		subtitle: '毕业院校',
		subcontent: '郑州轻工业学院(2000~2004年)'
	}, {
		subtitle: '所修专业',
		subcontent: '电子与信息技术'
	}]
}, {
	title: '联系方式',
	content: [{
		subtitle: '电话',
		subcontent: '13811869208'
	}, {
		subtitle: 'Email',
		subcontent: 'furic@qq.com'
	}, {
		subtitle: '现住址',
		subcontent: '北京亦庄开发区科创十三街'
	}]
}];

var faviconData = {
	title:'furic',
	favicon: './static/images/dynamic/zhaozhao.jpg',
	desc: '个人能力有限，团队力量无限！让激情燃烧自己，把火光照亮别人!'
};

module.exports = {

	/*
	获取所有基本信息
	 */
	getListAll: function() {
		return Q.Promise(function(resolve, reject) {
			resolve(basicData);
		});
	},

	getFaviconData : function() {
		return Q.Promise(function(resolve,reject) {
			resolve(faviconData);
		});
	}
};