var fs = require('fs');
var promise = require('bluebird');

var modelLoader = {};

modelLoader.loadModels = function(orm, logger) {
	var componentPath = __dirname + "/../components/";
	logger.verbose("To read component models from " + componentPath);

	return new promise(function(resolve, reject) {
		var models = {};
		var components = fs.readdirSync(componentPath);

		logger.debug("Componenets found in component directory: ", components);

		var model;
		var modelDef;
		var dependencies = [];

		for(var i = 0; i < components.length; i++) {
			try {
				logger.debug("Trying to load " + componentPath + components[i] + "/model.js");
				model = require(componentPath + components[i] + "/model.js");
				orm.loadCollection(model);
			} catch(e) {
				logger.error(e);
				logger.error("Found component folder with no model");
			}
		}

		resolve(orm);
	});
}

module.exports = modelLoader;