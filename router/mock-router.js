var express = require('express');
var router = express.Router();
var configurations = require('./mock-conf.js');

const ALLOWED_METHOD = ['GET', 'POST', 'PUT', 'DELETE'];

const toString = Object.prototype.toString;

configurations.forEach(function(config) {

	/**
	 * 处理逻辑是：
	 * 1. 称之前的完整配置模式为superMode
	 * 2. 如果数据结构是superMode，则按以前的流程处理
	 * 3. 如果数据结构是单纯的数据，则将数据转换为superMode，然后再按superMode的流程处理
	 * 4. 单纯的数据配置还分为： ‘包含请求方法’和‘未包含请求方法，默认get’，两种模式
	 */
	if (isSuperMode(config)) {
		return handleConfig(config);
	}
	const dataConfList = convert2Super(config);
	dataConfList.forEach(dataConfig => handleConfig(dataConfig))
});

/**
 * superMode数据的处理方法
 * 处理 { response, request, headers } 类型数据，并发送数据
 */
function handleConfig(config) {
	var method = config.request.method || 'get';
	router[method.toLowerCase()](config.request.urlPattern, (req, res) => {
		if (config.response.headers) {
			res.set(config.response.headers);
		}
		if (config.response.status) {
			res.status(config.response.status);
		}
		var result = null;
		if (config.response.body) {
			result = config.response.body(req, res); // 添加res，为了满足特定情况下对header的设置
		}

		res.send(result);
	});
}

function isSuperMode(config) {
	const keys = Object.keys(config);
	const superKeys = ['request', 'response', 'headers'];
	return keys.every(k => superKeys.includes(k.toLowerCase()));
}

/**
 * 将简单模式下的数据转换为完全模式的数据, 返回值为一个数组。
 * 数据的配置，区分“是否带有请求方法”，如果带有请求方法，表示为methodMode
 * {[url]: body} => [{ request, response, headers }]
 */
function convert2Super(config) {
	return Object.keys(config).reduce((rs, url) => {
		const body = config[url];
		const dataArr = isMethodMode(body) ? genMethodData(url, body) : genGetData(url, body);
		return [...rs, ...dataArr];
	}, []);
}


/**
 * 数据配置中是否为带有请求方法
 * @param {请求体数据} body 
 */
function isMethodMode(body) {
	// 配置内容不是对象时，置为非请求模式，直接返回数据。如果是对象，则需要区分是否带了请求方法
	if (toString.call(body) !== '[object Object]') {
		return false;
	}
  return ALLOWED_METHOD.some(method => method in body || method.toLowerCase() in body);
}

/**
 * 带请求方式的模式下，url和body结构为
 * { 
 *    [url]: {
 *        [method]: body
 *    }
 * }
 * 支持一次性配置多个url
 * 返回数组形式数据，保持统一处理。
 */
function genMethodData(url, bodyMap) {
  return Object.keys(bodyMap).map(method => {
		const body = bodyMap[method];
		return {
			request: {
				method,
				urlPattern: url
			},
			response: {
				status: 200,
				body: typeof body === 'function' ? body : () => {
					return body;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		};
  });
}

/**
 * 默认get模式下，url和body结构为
 * {
 *    [url]: body
 * }
 * 支持一次性配置多个url
 * 返回数组类型数据，保持统一处理。
 */
function genGetData(url, body) {
  return [{
		request: {
			method: 'GET',
			urlPattern: url
		},
		response: {
			status: 200,
			body: typeof body === 'function' ? body : () => {
				return body;
			},
			headers: {
				'Content-Type': 'application/json'
			}
		}
	}];
}

module.exports = router;
