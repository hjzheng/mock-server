module.exports = function (configurations) {
	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/test-compatible'
			},
			response: {
				status: 200,
				body: function () {
					return [];
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		},{
			'/test-compatible01': {
				msg: '兼容复杂模式测试1，在复杂模式下依然可以配置简单数据'
      },
      '/test-compatible02': {
        post: {
          msg: '兼容复杂模式测试2，在复杂模式下依然可以配置请求方法'
        },
        get: '顶顶顶顶顶'
      },
      '/test-compatible03': [1, 2, 'lalal']
		}
	])
};