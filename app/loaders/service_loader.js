var fs = require('fs');
var Promise = require('bluebird');

var serviceLoader = {};

serviceLoader.loadServices = function(models, logger) {
	return new Promise(function(resolve, reject) {
		var componentPath = __dirname + "/../components/";
		logger.verbose("To read component services from " + componentPath);

		var services = {};

		//find all componentPath/**/model.js
		var components = fs.readdirSync(componentPath);
		var serviceDir;
		var component;
		for(var i = 0; i < components.length; i++) {
			try {
				logger.debug("Trying to load " + componentPath + components[i] + "/service.js");
				component = require(componentPath + components[i] + "/service.js");
				services[components[i]] = new component(models, logger);
			} catch(e) {
				logger.error(e);
				logger.error("Found component folder with no service");
			}
		}

		logger.verbose("Completed service loading");
		resolve(services);
	});
};

module.exports = serviceLoader;