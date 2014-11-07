var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Tracker = require('../libs/tracker');
var q = require('q');
var _ = require('lodash');

var userSchema = new Schema({
	user: {type: String, unique: true, index: true},
	password: {type: String},
	groups: [{type: String, ref: 'Group'}],
	features: [String],
	lastUpdate: {type: Date, default: Date.now()}
});

/**
 * update user access zone
 * @return {[type]} [description]
 */
userSchema.methods.updateCache = function() {
	var deferred = q.defer();
	var User = this;
	var credential = {
		user: User.user,
		password: User.password
	};

	Tracker.api('getgroups', {
		authentication: credential,
		data: {
			fields: ['groupid']
		}
	}, function(trackerErr, trackerRes){
		if(trackerErr) {
			deferred.reject(trackerErr);
		} else {
			var groups = _.map(trackerRes.results, function(each){
				return each.groupid;
			});
			Groups.groups = groups;
			Groups.save(function(saveErr, docs){
				if(saveErr) {
					deferred.reject(saveErr);
				} else {
					deferred.resolve(docs);
				}
			});
		}
	});
	return deferred.promise;
};

module.exports = mongoose.model("User", userSchema);
