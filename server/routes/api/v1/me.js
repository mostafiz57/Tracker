var Tracker = require('../../../libs/tracker');

var currentEvent = function(req, res){

};

module.exports = function(router) {
	router.get('/now', currentEvent);
};