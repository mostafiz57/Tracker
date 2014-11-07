var parseFieldQuery = require('./query-parser').parseFieldQuery;

module.exports = function(router, Tracker) {
	router.get('/devices', function(req, res) {
		var groupid = req.query.groupid || 'all';
		var fields = ['deviceid', 'description'];
		if(req.query.fields) {
			fields = req.query.fields.split(',');
		}

		var params = {
			data: {
				groupid: groupid,
				fields: fields
			}
		};

		params.authentication = {
			user: req.session.user.user,
			password: req.session.user.password,
		};
		console.log(params);
		Tracker.api('getdevices', params, function(trackerErr, data) {

			if (data.status !== 'OK0000') {
				res.statusCode = 500;
				res.end();
			} else {
				res.json(data.results);
			}
		});
	});

	router.post('/devices', function (req, res) {
		var data = req.body;
		var user = req.session.user;

		Tracker.api('createdevice', {
			authentication: user,
			data: data
		}, function (err, data) {
			if(err){
				res.statusCode = 400;
				res.json({message: 'Bad Request'});
			} else {
				res.json(data);
			}
		});
	});
};
