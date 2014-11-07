module.exports = function (router, Tracker) {
	router.get('/reports', function (req, res) {
		console.log(req.user);
		var authentication = req.user;
		Tracker.api('getreports',{
			authentication: authentication,
			data: {}
		}, function (data) {
			if(data.status !== 'OK0000'){
				res.statusCode = 400;
				res.json({message: 'Bad Request'});
			} else {
				res.json(data.results);
			}
		});
	});

	router.get('/device/:did/reports/:rid', function (req, res) {
		var authentication = req.user;
		console.log(req.query);
		var timeto = req.query.to | parseInt(Date.now()/1000);
		var timefrom = req.query.from | timefrom - 86400;

		console.log(timefrom, timeto);
		var data = {
			reportid: req.params.rid,
			timefrom: timefrom,
			timeto: timeto,
			deviceid: req.params.did
		};

		Tracker.api('getreports', {
			authentication: authentication,
			data: data
		}, function (data) {
			if(data.status !== 'SUCCESS'){
				res.statusCode = 400;
				res.json({
					message: 'Bad Request'
				});
			} else {
				res.json(data);
			}
		});
	});

	router.get('/group/:gid/reports/:rid', function (req, res) {
		var authentication = req.user;
		var timeto = req.query.to | parseInt(Date.now()/1000);
		var timefrom = req.query.from | timefrom - 86400;

		var data = {
			reportid: req.params.rid,
			timefrom: timefrom,
			timeto: timeto,
			groupid: req.params.gid
		};

		Tracker.api('getreports', {
			authentication: authentication,
			data: data
		}, function (data) {
			if(data.status !== 'SUCCESS'){
				res.statusCode = 400;
				res.json({
					message: 'Bad Request'
				});
			} else {
				res.json(data);
			}
		});
	});

};
