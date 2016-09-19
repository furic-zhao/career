var blockData = [{
	id: 'aboutme',
	title: '自我介绍',
	content: ['2004年，较早进入互联网Web开发领域，经历了原始的Table排版、写JS原生代码及ASP/SQLserver的后端架构，后续独立开发众多企业及个人站（详见作品）。', '2007年加盟创业公司，基于开源系统（风讯/科讯CMS、DEDECMS、帝国CMS、PHPwind、Discuz、UCenter Home等）用于搭建个人网站并移植内部功能模块到工作项目中，全栈技术的运用和敏捷开发、协调团队高效协作完善产品功能。', '2012年进入大型互联网公司，专注精进前端技术、与各种背景的人（运营、产品、设计、服务端、客户端、测试）沟通合作，善于协调项目的策划、设计、需求范围和项目进度、从零到一的前期技术构建，及协调解决各环节问题。运用前端工程自动化（gulp）、模块开发（commonjs）、异步编程（promise）、前后端开源框架库（bootstrap/jQuery/YII/thinkphp），提高团队项目研发效率。']
}, {
	id: 'gangwei',
	title: '意向岗位',
	content: ['全栈工程师、高级WEB开发工程师、技术管理职位、产品职位']
}, {
	id: 'zhize',
	title: '意向职责',
	content: ['负责产品需求分析和架构设计、参与系统技术选型及核心模块技术验证和技术攻关，实现并完善产品功能，协调测试、上线、反馈等流程，控制产品进度及处理各环节问题，保证产品最终质量。']
}, {
	id: 'word',
	title: 'word版简历',
	content: ['<a href="http://www.hestudy.com/career.docx" class="link external" target="_blank">http://www.hestudy.com/career.docx</a>']
}, {
	id: 'system',
	title: '关于本系统',
	content: ['这是一个基于Framework7构建的WebApp简历。', '用gulp自动化前端工作流（Less/Sass编译、CSS/JS合并压缩、雪碧图自动合成、Imagemin图片压缩等）。使用Browserify组织Nodejs风格的JS代码在浏览器中运行、模块式开发、使用JSON交换数据做到前后端完全分离、自动打包业务层JS逻辑及Handlebars模板。使用Q.js(Promise)异步编程、弥补javascript天生缺陷、优化JS代码运行效率。使用LiveReload作为研发环境、监听文件变动、自动刷新浏览器、实现多终端自动化测试。']
}, {
	id: 'career-code',
	title: '简历源码参考',
	content: ['‪<a href="https://github.com/furic-zhao/career/" target="_blank" class="link external">https://github.com/furic-zhao/career/</a>']
}, {
	id: 'z-workflow-code',
	title: '前端工程介绍及源码',
	content: ['‪<a href="https://github.com/furic-zhao/z-workflow/" target="_blank" class="link external">https://github.com/furic-zhao/z-workflow/</a>']
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
		var limit = ['aboutme', 'gangwei', 'zhize', 'word', 'system', 'career-code', 'z-workflow-code'];

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