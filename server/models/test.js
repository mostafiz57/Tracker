var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/umaps');
var User = require('./user');
var Group = require('./group');
var Device = require('./device');

User.findOne({'user': 'admin'}, function(err, docs){
	if(err) {
		res.json(err);
	} else {
		var groups = docs.groups;
		console.log(groups);
		Group.find({_id:{ $in: groups}}).populate('devices').exec(function(err, docs) {
			console.log(docs);
			mongoose.disconnect();
		})
	}
});
