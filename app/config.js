var config = {};

config.port = process.env.PORT || 8080;
config.sslPort = process.env.SSL_PORT || 8443;
config.log_level = process.env.LOG_LEVEL || 'debug';
config.session_pass = process.session_pass || 'password';

var postgresql = require('sails-postgresql');
config.waterline = {
	// Setup Adapters
	// Creates named adapters that have have been required
	adapters: {
		'default': postgresql,
		postgres: postgresql
	},

	// Build Connections Config
	// Setup connections using the named adapter configs
	connections: {
		postgres: {
			adapter: 'postgres',
			database: 'db_name',
			host: 'localhost',
			user: 'user_name',
			password: 'password',
			port: 5432,
			pool: false,
			ssl: false
		}
	},

	defaults: {
		migrate: 'alter'
	}
};

module.exports = config;