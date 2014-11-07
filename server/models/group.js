var mongoose = require('mongoose');
var Tracker = require('./../libs/tracker');
var q = require('q');
var _ = require('lodash');

var groupSchema = new mongoose.Schema({
	_id: {
		type: String,
		require: true,
		unique: true,
		index: true
	},
	description: {
		type: String
	},
	lastUpdate: {type: Date, default: Date.now()},
	devices: [{
		type: String,
		ref: 'Device'
	}]
});

groupSchema.methods.updateDevicesList = function(credential) {
	var deferred = q.defer();
	var Group = this;
	console.log(Group);
	Tracker.api('getdevices', {
		authentication: credential,
		data : {
			groupid: Group._id,
			fields: ['deviceid']
		}
	}, function(trackerError, trackerResponse){
		if(trackerError){
			deferred.reject(trackerError);
		} else {
			var devices = _.map(trackerResponse.results, function(each){
				return each.deviceid;
			});
			Group.devices = devices;
			Group.save(function(savingError, doc){
				if(savingError){
					deferred.reject(savingError);
				} else {
					deferred.resolve(doc);
				}
			});
		}
	});

	return deferred.promise;
};

module.exports = mongoose.model("Group", groupSchema);
