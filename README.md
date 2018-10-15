# mock-server

[![npm version](https://img.shields.io/npm/v/fe-mock-server.svg?style=flat-square)](https://www.npmjs.com/package/fe-mock-server)
[![npm downloads](https://img.shields.io/npm/dt/fe-mock-server.svg?style=flat-square)](https://www.npmjs.com/package/fe-mock-server)

### Usage

```shell
npm install fe-mock-server -g
```

```shell
fe-mock-server --mock "./config/" --api-prefix "/api" --port 8989
```

- --mock:  mock files's location
- --api-prefix: api prefix, default '/'
- --port: server port, default 8989

About mock configuration file, please check [config](https://github.com/hjzheng/mock-server/tree/master/conf).


### Example

```
var _ = require('lodash');
// 简单的 RESTful
module.exports = function(configurations) {
	var users = [
		{id: 1, name: 'hurry', grade: 90},
		{id: 2, name: 'hjzheng', grade: 88},
		{id: 3, name: 'Jack', grade: 30},
		{id: 4, name: 'Tom', grade: 70},
		{id: 5, name: 'Bell', grade: 40}
	];

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/users'
			},
			response: {
				status: 200,
				body: function() {
					return users;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		},
		{
			request: {
				method: 'GET',
				urlPattern: '/users/:id'
			},
			response: {
				status: 200,
				body: function(req) {
					return _.find(users,
					{ 'id': parseInt(req.params.id, 10)});
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		},
		{
			request: {
				method: 'DELETE',
				urlPattern: '/users/:id'
			},
			response: {
				status: 200,
				body: function(req) {
					_.remove(users, function(u) {
						return u.id === parseInt(req.params.id, 10);
					});
					return {success: true};
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		},
		{
			request: {
				method: 'POST',
				urlPattern: '/users'
			},
			response: {
				status: 200,
				body: function(req) {
					req.body.id = users[users.length - 1].id + 1;
					users.push(req.body);
					return {success: true};
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		},
		{
			request: {
				method: 'PUT',
				urlPattern: '/users/:id'
			},
			response: {
				status: 200,
				body: function(req) {
					req.body.id = parseInt(req.params.id, 10);
					var index = _.findIndex(users,
					    { 'id': parseInt(req.params.id, 10)})
					users[index] = req.body;
					return {success: true};
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
}
```

### 数据配置模式简单说明

> 通过数据，简化mock配置过程

#### 1. mock简单模式，模块文件导出一个对象

+ 针对get请求，可以直接按照`[url]: data`的形式配置
```javascript
// data.js

module.exports = {
	'/test': {
		name: 'aa',
		age: 'bb',
		gender: 'cc'
	},
	'/test2': 'This is data',
	'/test3': [1, 2, 3, '我是一条锦鲤']
}
```

+ 针对非get请求（支持get/post/delete/put）,按照`[url]: { [method]: data }`的形式配置
```javascript
// data.js

module.exports = {
	'/test':{
		post: {
			message: 'message from post'
		},
		delete: {},
		get: 'lalal'
	}
}
```

+ 针对高级请求，需要对request和response做处理的，按照 `[url]: (req, res) => {}`的形式配置

```javascript
// data.js

module.exports = {
	'/test': function(req, res) {
		const query = req.query;
		res.status(500);
		return { message: 'This is internal error' }
	},
	'/test2': {
		get(req, res) {
			return req.query;
		},
		post(req, res) {
			return req.params;
		}
	}
}
```

#### 2. mock兼容模式
> 在原有的配置方式中，可以兼容简单的配置模式。

```javascript
module.exports = function (configurations) {
	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/tt/test'
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
			'/test3': {
				msg: '兼容模式'
			},
			'/test33': {
				post: {}
			}
		}
	])
};
```
