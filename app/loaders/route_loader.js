var fs = require('fs');
var promise = require('bluebird');

var restLoader = {};

restLoader.loadRoutes = function(app, services, logger) {
	return new promise(function(resolve, reject) {
		var componentPath = __dirname + "/../components/";

		logger.verbose("To read component routes from " + componentPath);

		var routes = {};

		var components = fs.readdirSync(componentPath);
		var routesDir;
		var component;
		for(var i = 0; i < components.length; i++) {
			//modelDir = fs.readdirSync(componentPath + components[i]);
			try {
				logger.debug("Trying to load " + componentPath + components[i] + "/route.js");
				component = require(componentPath + components[i] + "/route.js");
				routes[components[i]] = new component(app, services, logger);
			} catch(e) {
				logger.error(e);
				logger.error("Found component folder with no route");
			}
		}

		logger.verbose("Completed route loading");
		resolve(routes);
	});
}

module.exports = restLoader