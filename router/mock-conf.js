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
		require(path.join(process.cwd(), argv.mock, file))(configurations);
	});
}

module.exports = configurations.list;