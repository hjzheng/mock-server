#!/usr/bin/env node

var argv = require('yargs').argv;
var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var mockRouter = require('./router/mock-router');

// 解析 body
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
	extended: false
}));

// 自定义请求
server.get('/echo', function(req, res) {
	res.jsonp(req.query);
});

var apiPrefix = argv['api-prefix'] || '/';
var port = argv['port'] || 8989;

server.use(apiPrefix, mockRouter);

server.listen(port, function() {
	console.log(`mock server is running, please visit http://localhost:${port}`);
});