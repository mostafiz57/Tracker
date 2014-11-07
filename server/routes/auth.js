var User = require('../models/user');
var _ = require('lodash');
var Tracker = require('../libs/tracker');
var q = require('q');
var jwt = require('jsonwebtoken');

var TOKEN_SECRET = require('../config/api').TOKEN_SECRET;

/**
 * find user info in tracker server
 * @param {string} user username
 * @param {string} password password
 * @return {Promise}
 */
function findInTracker(user, password){
	var deferred = q.defer();
	var auth = {
		user: user,
		password: password
	};
	Tracker.api('getgroups', {
		authentication: auth,
		data: {fields: ['groupid']}
	}, function(trackerError, response){
		if(!trackerError) {
			var groups = _.map(response.results, function (it) {
				return it.groupid;
			});
			var userData = {
				user: user,
				password: password,
				groups: groups
			};
			deferred.resolve(userData);
		} else {
			deferred.reject(trackerError);
		}
	});
	return deferred.promise;
}

/**
 * 
 * @param  {object} user
 * @return {Promise}
 */
function insertIntoDatabase(user) {
	var deferred = q.defer();
	User.update({
		user: user.user
	},{
		$set: user
	}, {
		upsert: true
	}, function(err, doc){
		if(err){
			deferred.reject(err);
		} else {
			var profile = {
				user: user.user,
				password: user.password
			};
			deferred.resolve(profile);
		}
	});
	return deferred.promise;
}

/**
 * login or create new user with authenticate credential
 * @param  {string} user
 * @param  {string} password
 * @return {User} the User object
 */
function login(user, password) {
	var deferred = q.defer();
	findInTracker(user, password).
		then(insertIntoDatabase).
		then(function(profile){
			deferred.resolve(profile);
		}).
		catch(function(err){
			deferred.reject(err);
		});
	return deferred.promise;
}

/**
 * auth router, set cookie to store token
 */
function auth (req, res) {
	var username = req.body.user;
	var password = req.body.password;

	if(!username || !password) {
		req.flash('errorMessage', 'Invalid');
	} else {
		login(username, password).
			then(function(profile) {
				var token = jwt.sign(profile, TOKEN_SECRET, {expiresInMinutes: 60*5});
				//res.setHeader('token', token);
				res.cookie('token', token, {maxAge: 5*3600*1000});
				req.session.user = username;
				res.redirect('/dashboard');
			}, function(reason){
				res.redirect('/');
			});
	}
}

function logout (req, res) {
	res.clearCookie('token');
	res.redirect('/');
}

module.exports.auth = function(app) {
	app.post('/auth', auth);
	app.all('/logout', logout);
};
