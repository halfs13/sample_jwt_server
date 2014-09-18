var winston = require('winston');

module.exports = function(config) {
	return new (winston.Logger)({
		transports : [new (winston.transports.Console)({level:config.log_level, timestamp: true}),
						new (winston.transports.File)({filename: './logs/general.log', timestamp: true})]
	});
};