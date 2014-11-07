var _ = require('lodash');
var Group = require ('../../models/group');
var Device = require ('../../models/device');
var User = require ('../../models/user');
var parseFieldQuery = require('./query-parser').parseFieldQuery;

module.exports = function(router, Tracker) {
	router.use(parseFieldQuery);
	router.get('/groups', function(req, res){
		//check if user is uncached
		var username = req.session.user;
		User.findOne({user: username}, function(err, doc){
			console.log(doc);
			if(err) {
				res.json(err);
			} else {
				var groups = doc.groups;
				console.log(groups);
				Group
				.find({_id: {$in: groups}})
				.populate('devices')
				.exec(function (err, docs) {
					if(err) {
						res.json(err);
					} else {
						res.json(docs);
					}
				});
			}
		});
	});

	router.get('/groups/:from-:limit?', function(req, res){
		var defaultLimit = 50;
		var from = req.params.from || 0;
		var limit = req.params.limit || defaultLimit;
		Group.find().skip(from).limit(limit).exec(function(err, docs){
			if(err){
				res.json(err);
			} else {
				res.json(docs);
			}
		});
	});

	router.get('/groups/:groupid', function(req, res){
		Group.findOne({_id: req.params.groupid})
			.populate('devices')
			.exec(function(err, doc){
				if(err) {
					res.json(err);
				} else {
					if(!doc){
						res.statusCode = 404;
						res.json({error: "group not found"});
					} else {
						res.json(doc);
					}
				}
			});
	});

	router.get('/groups/*', function(req, res){
		res.statusCode = 404;
		res.json({error: "command not supported"});
	});
};
