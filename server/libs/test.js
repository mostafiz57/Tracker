var Tracker = require('./tracker');

Tracker.init({
	account: 'umaps',
});

Tracker.api('getreports', {
	authentication: {
		user: 'admin',
		password: 'qwerty123'
	},
	data: {}
}, function(data){
	console.log(data);
});
