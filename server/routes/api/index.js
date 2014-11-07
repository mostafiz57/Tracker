var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var TOKEN_SECRET = require('../../config/api').TOKEN_SECRET;

module.exports = function(app, Tracker) {
	app.use('/api', expressJwt({secret: TOKEN_SECRET}));

	require('./devices')(router, Tracker);
	require('./groups')(router, Tracker);
	require('./map')(router, Tracker);
	require('./reports')(router, Tracker);

	require('./login')(router);

	app.use('/api', router);
};
