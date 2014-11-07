var User = require('../../../models/user');
var Tracker = require('../../../libs/tracker');
var RestParser = require('../../../libs/result-parser').RestParser;

/**
 * list all user
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
var listUser = function(req, res) {
	User.
		find().
		exec(function(queryErr, docs){
			if(queryErr) {
				res.json({
					error: {
						type: 'Database Exception',
						details: queryErr.toString()
					}
				});
			} else {
				res.json(RestParser(docs));
			}
		});
};

var getUser = function(req, res) {
	User.findOne(function(queryErr, doc){
		if(queryErr) {
			res.json({
				error: {
					type: 'Database Exception',
					details: queryErr.toString()
				}
			});
		} else {
			res.json(RestParser(doc));
		}
	});
};

module.exports = function(router) {
	router.get('/user', listUser);
	router.get('/user/:userid', getUser);
};