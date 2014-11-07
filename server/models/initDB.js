var mongoose = require('mongoose');
// mongoose.connect('mongodb://mahpah:mahpah@ds055689.mongolab.com:55689/dev-gpshandle');
mongoose.connect('mongodb://127.0.0.1:27017/umapsv1');

var Tracker = require('../libs/tracker');
var Group = require('./group');
var Device = require('./device');
var User = require('./user');
var _ = require('lodash');

Tracker.init({account: 'umaps'});

Tracker.api('getgroups', {
	authentication: {
		user: 'admin',
		password: 'qwerty123'
	},
	data: {
		fields:['groupid', 'description']
		}
	},
	function (err, response) {
		var groups = _.map(response.results, function (group) {
			return group.groupid;
		});
		User.update({
			user: 'admin'
		}, {
			$set: {
				groups: groups
			}
		},{
			upsert: true
		}, function (err, users) {
			if(err) {
				console.log(err);
			}
		});

		//update group
		_.each(response.results, function (group) {
			Tracker.api('getdevices', {
				authentication: {
					user: 'admin',
					password: 'qwerty123'
				},
				data: {
					groupid: group.groupid,
					fields:[ 'deviceID', 'description']}
			}, function(err, data){
				console.log(data);
				devices = _.map(data.results, function(it){
					Device.update({
						_id: it.deviceID
					}, {
						$set: {
							description: it.description
						}
					}, {
						upsert: true
					},function (err) {
						if(err) {
							console.error("Error while update device ", it.deviceID);
							console.log(err);
						}
					});
					return it.deviceID;
				});
				console.log('UPDATE: ', group.groupid);

				Group.update({
					_id: group.groupid,
				},{
					$set: {
						description: group.description,
						devices: devices
					}
				}, {upsert: true}, function(err, doc){
					if(err) {
						console.error("Error when update group " + group.groupid);
					} else {
						console.log('UPDATE: ' + group.groupid + 'done');
					}
				});
			});
		});
	}
);
