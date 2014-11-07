var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var TOKEN_SECRET = require('../../../config/api').TOKEN_SECRET;

module.exports = function(app) {
	app.use('/api/v1', expressJwt({secret: TOKEN_SECRET}));

	require('./devices')(router);
	require('./groups')(router);
	// require('./map')(router);
	// require('./reports')(router);
	router.get('/restricted', function(req, res){
	  console.log('user ' + req.user.user + ' is calling /api/restricted');
	  console.log(req.user);
	  res.json({profile:req.user});
	});

	app.use('/api/v1', router);
};
