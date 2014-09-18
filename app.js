var config = require('./app/config');
var logger = require('./app/utils/logger')(config);
var Promise = require('bluebird');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var fs = require('fs');
var options = {
	key: fs.readFileSync('./app/keys/key.pem'),
	cert: fs.readFileSync('./app/keys/server_cert.pem')
};
var sslServer = require('https').createServer(options, app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var methodOverride = require('method-override');
app.use(methodOverride('X-HTTP-Method'))          // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override'))      // IBM
app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next) {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Methods', 'GET, POST, DEL, DELETE, PUT, SEARCH, OPTIONS');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	// res.set('Access-Control-Allow-Max-Age', 3600);
	if ('OPTIONS' === req.method) {
		return res.send(200);
	}
	return next();
});

var expressJwt = require('express-jwt');
// Protect the /api routes with JWT
app.all('/secure/*', expressJwt({secret: config.session_pass}));

sslServer.listen(config.sslPort, function(){
	logger.debug("Express server listening on port " + sslServer.address().port + " in " + app.settings.env + " mode");
});

var models;
var services;
var routes;

var Waterline = require('Waterline');
var orm = new Waterline();

require('./app/loaders/model_loader').loadModels(orm, logger)
.then(function(updatedOrm) {
	return Promise.promisify(orm.initialize, orm)(config.waterline)
})
.then(function(m) {
	models = m.collections;
	return require('./app/loaders/service_loader').loadServices(models, logger);
})
.then(function(s) {
	services = s;

	console.log(s);
	return require('./app/loaders/route_loader').loadRoutes(app, services, logger)
});