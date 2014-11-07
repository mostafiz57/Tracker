var Group = require('../../../models/group');
var User = require('../../../models/user');
var RestParser = require('../../../libs/result-parser').RestParser;
var Tracker = require('../../../libs/tracker');

var listGroup = function(req, res) {
	var defaultLimit = 50;
	var from = req.query.from || 0;
	var limit = req.query.limit || defaultLimit;
	var username = req.user.user;

	User.findOne({user: username}, function(error, doc){
		if(error) {
			res.json({
				error: {
					type: 'Database Exception',
					details: error
				}
			});
		} else {
			var groups = doc.groups;
				console.log(groups);
				Group
				.find({_id: {$in: groups}})
				.populate('devices')
				.exec(function (queryErr, docs) {
					if(queryErr) {
						res.json({
							error: {
								type: 'Database Exception',
								details: queryErr
							}
						});
					} else {
						res.json(RestParser(docs));
					}
				});
		}
	});
};

var getGroup = function(req, res) {
	var groupId = req.params.groupid;
	Group.findOne({_id: groupId}, function(queryErr, doc){
		if(queryErr) {
			res.json({
				error: {
					type: 'Database Exception',
					details: queryErr
				}
			});
		} else {
			res.json(RestParser(doc));
		}
	});
};

/**
 * get groups event in the past
 */
var getEvents = function(req, res) {

};

var createGroup = function(req, res) {

};

var editGroup = function(req, res) {

};

var getReport = function(req, res) {
	var ONE_DAY = 86400;
	var groupId = req.params.groupid;
	var reportId = req.params.reportid;
	var credential = req.user;
	var to = req.query.to || parseInt(Date.now()/1000);
	var from = req.query.from || to - ONE_DAY;
	console.log(reportId);

	Tracker.api('getreports', {
		authentication: credential,
		data: {
			groupid: groupId,
			reportid: reportId,
			timefrom: from,
			timeto: to
		}
	}, function(trackerError, trackerResponse){
		if(trackerError) {
			res.json(trackerError);
		} else {
			trackerResponse.Report.ReportBody.pop();
			res.json(RestParser(trackerResponse));
		}
	});
};

module.exports = function (router) {
	router.get('/groups', listGroup);
	router.get('/group', listGroup);
	router.get('/group/:groupid', getGroup);
	router.post('/group', createGroup);
	router.put('/group/:groupid', editGroup);
	router.get('/group/:groupid/events');
	router.get('/group/:groupid/report/:reportid', getReport);
};