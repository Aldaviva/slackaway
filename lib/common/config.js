var _ = require('lodash');
var logger = require('./logger')(module);

var defaults = require('../../config.example');
var isInitialized = false;

module.exports = {};

module.exports.init = function(userConfig){
	if(!isInitialized){
		isInitialized = true;
		return _.merge(module.exports, defaults, userConfig);
	} else {
		return module.exports;
	}
};