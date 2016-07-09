var blockData = [{
	id: 'aboutme',
	title: '自我介绍',
	content: ['2004年，较早进入互联网Web开发领域，经历了原始的Table排版、写JS原生代码及ASP/SQLserver的后端架构。策划、设计、前端、后端、数据库、运维，一人全包的时代。', '2007年加盟创业公司，使用div/css排版、较早使用jQuery(1.2版)框架及PHP/Mysql搭建网站，二次开发早期的开源系统（风讯/科讯CMS、DEDECMS、帝国CMS、PHPwind、Discuz、UCenter Home等）用于搭建个人网站并移植内部功能模块到工作项目中，锻炼了技术的全面运用和敏捷开发、以及协调团队高效协作完善产品功能。', '2012年进入大型互联网公司，专注精进前端技术，工作更贴近用户，同时与各种背景的人（运营、产品、设计、服务端、客户端、测试）沟通合作，已习惯于协调项目的策划、设计、控制需求范围和项目进度、从零到一的前期技术架构，及协调解决各环节问题。技术上运用前端工程、模块开发、异步编程、前后端开源框架库，大大提高项目的研发效率。']
}, {
	id: 'gangwei',
	title: '意向岗位',
	content: ['高级WEB产品架构师、技术管理职位、产品职位']
}, {
	id: 'zhize',
	title: '意向职责',
	content: ['负责产品需求分析和架构设计、参与系统技术选型及核心模块技术验证和技术攻关，带领团队实现并完善产品功能，协调测试、上线、反馈等流程，控制产品进度及处理各环节问题，保证产品最终质量']
}, {
	id: 'word',
	title: 'word版简历',
	content: ['http://www.hestudy.com/career.docx']
}, {
	id: 'system',
	title: '关于本系统',
	content: ['这是一个基于Framework7构建的WebApp简历。', '用gulp自动化构建工程（Less/Sass编译、CSS/JS合并压缩、雪碧图自动合成、Imagemin图片压缩等）。', '使用Nodejs风格模块式开发，使用Browserify分层规划、管理打包业务层JS逻辑和Handlebars模板。', '使用Q.js(Promise)异步编程、管理各模块的依赖和运行。', '使用LiveReload作为研发环境、监听文件变动、自动刷新浏览器、多终端自动化测试。']
}];

function inArray(elem, arr, i) {
	var len;

	if (arr) {
		len = arr.length;
		i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

		for (; i < len; i++) {

			// Skip accessing in sparse arrays
			if (i in arr && arr[i] === elem) {
				return i;
			}
		}
	}

	return -1;
}

module.exports = {
	/*
	 获取关于本系统的信息
	 */
	getAboutSystem: function() {
		var rtnData = [];
		var limit = ['system'];

		return Q.Promise(function(resolve, reject) {

			blockData.map(function(item) {
				if (inArray(item.id, limit, 0) > -1) {
					rtnData.push(item);
				}
			});

			resolve(rtnData);
		});
	},

	/*
	 获取首页信息
	 */
	getIndexData: function() {
		var rtnData = [];
		var limit = ['aboutme','gangwei','zhize','word'];

		return Q.Promise(function(resolve, reject) {

			blockData.map(function(item) {
				if (inArray(item.id, limit, 0) > -1) {
					rtnData.push(item);
				}
			});

			resolve(rtnData);
		});
	}
};