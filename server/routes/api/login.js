var Tracker = require('../../libs/tracker');
var TOKEN_SECRET = require('../../config/api').TOKEN_SECRET;
var jwt = require('jsonwebtoken');

console.log(TOKEN_SECRET);

/**
 * authenticate user then send token;
 * @param  {HttpRequest} req [description]
 * @param  {HttpResponse} res [description]
 * @return {[type]}     [description]
 */
var authenticate = function (req, res) {
	var username = req.body.user;
	var password = req.body.password;

	if(!username || !password) {
		var error = {
			message: 'Invalid credential'
		};
		res.status(400);
		res.json(error);
		return;
	}

	Tracker.api('getversion', {
		authentication: {
			user: username,
			password: password
		}
	}, function(error, response){
		if(error){
			res.status(401);
			res.json(error);
		} else {
			var profile = {
				user: username,
				password: password
			};
			var token = jwt.sign(profile, TOKEN_SECRET, {expiresInMinutes: 60*5});
			res.json({token: token});
		}
	});
};

module.exports = function(router){
	router.post('/auth', authenticate);
};