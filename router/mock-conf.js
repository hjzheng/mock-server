var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');
var toString = Object.prototype.toString;
var configurations = {
	list: [],
	add: function(config) {
		if (toString.call(config) === '[object Object]') {
			this.list.push(config);
		}
		if (toString.call(config) === '[object Array]') {
			this.list = this.list.concat(config);
		}
	}
};

if(argv.mock) {
	fs.readdirSync(path.join(argv.mock)).forEach(function (file) {
		const target = require(path.join(process.cwd(), argv.mock, file));
		// 扩展mock文件的导出值为function或者object
		if (typeof target === 'function') {
			target(configurations);
		} else if (Object.prototype.toString.apply(target) === '[object Object]') {
			configurations.add(target);
		}
	});
}

module.exports = configurations.list;