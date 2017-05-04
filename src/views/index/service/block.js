var blockData = [{
    id: 'aboutme',
    title: '自我介绍',
    content: ['致力于WEB研发工程化自动化的研究，<a href="https://github.com/furic-zhao/fez/" target="_blank" class="link external">FEZ</a>前端模块化工程开发框架作者。', '曾与美国硅谷团队联合研发具有军工安全资质的网络准入系列软件、国内顶级互联网安全公司的搜索百科、核心安全、视频直播、智能硬件等大中型项目的前端构建。现负责京东搜索与大数据平台众多数据类产品的前端架构。', '使用国际前沿的工程化技术提高团队研发效率及项目产品的可维护性和扩展性。善于协调项目的策划、设计、需求范围和项目进度、处理解决各环节问题。']
}, {
    id: 'gangwei',
    title: '意向岗位',
    content: ['WEB产品架构师、高级全栈工程师、技术管理职位、产品职位']
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
    content: ['本系统使用FEZ前端模块化开发框架基于Framework7构建。演示了移动端REM的解决方案。兼容任何终端和平台、可以内嵌在任何APP或移动端应用中浏览。', '<a href="https://github.com/furic-zhao/fez/" target="_blank" class="link external">FEZ</a> 是面向 前端模块化工程 的开发框架。主要为解决 前端开发多人高效协作、提高开发质量、及项目功能扩展的快速迭代和可维护性等问题。核心包括功能模块化、结构规范化、及开发自动化。']
}, {
    id: 'career-code',
    title: '简历源码参考',
    content: ['‪<a href="https://github.com/furic-zhao/career/" target="_blank" class="link external">https://github.com/furic-zhao/career/</a>']
}, {
    id: 'z-workflow-code',
    title: 'FEZ前端模块化工程介绍及源码',
    content: ['‪<a href="https://github.com/furic-zhao/fez/" target="_blank" class="link external">https://github.com/furic-zhao/fez/</a>']
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
        var limit = ['aboutme', 'gangwei', 'zhize', 'z-workflow-code'];

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
