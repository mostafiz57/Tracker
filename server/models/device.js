var mongoose = require('mongoose');
var Tracker = require('../libs/tracker');
var q = require('q');
var _ = require('lodash');

var deviceSchema = new mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		index: true
	},
	description: String,
	vehicleID: String,
	groupid: String,
	lastUpdate: {type: Date, default: Date.now()}
});

deviceSchema.statics.updateCache = function(credential) {
	var Device = this;
	var deferred = q.defer();
	Tracker.api('getdevices', {
		authentication: credential,
		data: {
			fields: ['deviceid', 'description']
		}
	}, function(trackerError, trackerResponse){
		if(trackerError) {
			deferred.reject(trackerError);
		} else if(trackerResponse.results.length !== 0) {
			var data = _.map(trackerResponse.results, function(eachDevice) {
				return {
					_id: eachDevice.deviceid,
					description: eachDevice.description
				};
			});
			Device.collection.insert(data, {
				upsert: true
			},
			function(insertError, devices){
				if(insertError){
					deferred.reject(insertError);
				} else {
					deferred.resolve(devices);
				}
			});
		}
	});
	return deferred.promise;
};

deviceSchema.methods.getReport = function(credential, reportId, from, to) {
	var deferred = q.defer();
	var Device = this;
	var deviceId = Device._id;
	Tracker.api('getreports', {
		authentication: credential,
		data: {
			deviceid: deviceId,
			reportid: reportId,
			timefrom: from,
			timeto: to
		}
	}, function(trackerError, trackerResponse) {
		if(trackerError){
			deferred.reject(trackerError);
		} else {
			deferred.resolve(trackerResponse);
		}
	});
	return deferred.promise;
};

deviceSchema.statics.listReport = function(credential){
	var deferred = q.defer();
	var Device = this;
	Tracker.api('getreports', {
		authentication: credential,
		data: {}
	}, function(trackerError, trackerResponse) {
		if(trackerError){
			deferred.reject(trackerError);
		} else {
			deferred.resolve(trackerResponse.results);
		}
	});
	return deferred.promise;
};

module.exports = mongoose.model("Device", deviceSchema);
