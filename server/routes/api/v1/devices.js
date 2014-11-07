var Tracker = require('../../../libs/tracker');
var Device = require('../../../models/device');
var RestParser = require('../../../libs/result-parser').RestParser;
var GeoJsonParser = require('./geojson-parser');

var listDevice = function(req, res) {
	var defaultLimit = 50;
	var from = req.query.from || 0;
	var limit = req.query.limit || defaultLimit;
	console.info(from, limit);
	Device.
		find().
		skip(from).
		limit(limit).
		exec(function(err, docs){
			console.log(docs);
			if(err){
				res.json(err);
			} else {
				res.json(RestParser(docs));
			}
		});
};

/**
 * explicitly update cache request
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
var updateDeviceCache = function(req, res) {
	var userInfo = req.user;
	Device.
		updateCache(userInfo).
		then(function sendResults(devices) {
			res.json(RestParser(devices));
		}, function updateFailed(reason){
			res.statusCode = 500;
			res.json({error:{
				type: 'Database Exception',
				details: reason
			}});
		});
};

var getDevice = function(req, res) {
	var deviceId = req.params.deviceid;

	Device.findOne({_id: deviceId}, function(err, device){
		if(err) {
			res.json(err);
		} else {
			res.json(RestParser(device));
		}
	});
};

var createDevice = function(req, res){

};

var editDevice = function(req, res) {
	var deviceId = req.params.deviceid;
};

var getReport = function(req, res){
	var ONE_DAY = 86400;
	var deviceId = req.params.deviceid;
	var reportId = req.params.reportid;
	var credential = req.user;
	var to = req.query.to || parseInt(Date.now()/1000);
	var from = req.query.from || to - ONE_DAY;

	Tracker.api('getreports', {
		authentication: credential,
		data: {
			deviceid: deviceId,
			reportid: reportId,
			timefrom: from,
			timeto: to
		}
	}, function(trackerError, trackerResponse) {
		if(trackerError) {
			res.json(trackerError);
		} else {
			trackerResponse.Report.ReportBody.pop();
			res.json(RestParser(trackerResponse));
		}
	});
};

var listReport = function(req, res){
	var credential = req.user;
	Device.listReport(credential).
		then(function onSuccess(data){
				var response = RestParser(data);
				res.json(response);
			}, function onFailed(error){
				res.json(error);
			});
};


var listEvent = function(req, res) {
	var ONE_DAY = 86400;
	var deviceId = req.params.deviceid;
	var reportId = req.params.reportid;
	var credential = req.user;
	console.log(credential);
	var to = req.query.to || parseInt(Date.now()/1000);
	var from = req.query.from || to - ONE_DAY;

	Tracker.api('getmapdevice', {
		authentication: credential,
		data: {
			deviceid: deviceId,
			timefrom: from,
			timeto: to
		}
	}, function(error, response){
		if(error) {
			res.json(error);
		} else {
			var data = response.JMapData;
			var geoJsonParser = new GeoJsonParser(data.DataColumns);
			if(data.DataSets.length === 0) {
        res.json(RestParser({}));
      }
			var dataSet = data.DataSets[0].Points;
			var features = dataSet.map(function (item) {
				var point = geoJsonParser.parseRow(item);
				return point;
			});

			var points  = {
				type: 'FeatureCollection',
				features: features
			};

			res.json(RestParser(points));
		}
	});
};

module.exports = function (router) {
	router.get('/device/:deviceid/reports', listReport);
	router.get('/device/:deviceid/report', listReport);
	router.get('/device/:deviceid/report/:reportid', getReport);
	router.get('/device/:deviceid', getDevice);
	router.post('/device', createDevice);
	router.put('/device/:deviceid', editDevice);
	router.get('/devices', listDevice);
	router.get('/device', listDevice);
	router.post('/devices', updateDeviceCache);

	router.get('/device/:deviceid/event', listEvent);
};