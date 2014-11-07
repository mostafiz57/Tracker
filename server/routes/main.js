var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var TOKEN_SECRET = require('../config/api').TOKEN_SECRET;

var verifyToken = function(req, res, next) {
	var token = req.cookies.token;
	if(token) {
		jwt.verify(token, TOKEN_SECRET, function(err, profile) {
			if(err) {
				//token seem to be invalid
				res.clearCookie('token');
				res.redirect('/');
			} else {
				req.user = profile;
				next();
			}
		});
	} else {
		res.redirect('/');
	}
};

module.exports = function(app, serverConfig) {
	app.get('/', function(req, res) {
		if(req.cookies.token) {
			return res.redirect('/dashboard');
		}
		res.render('index', {
			title: 'GPSHandle',
			errorMessage: req.flash('errorMessage')
		});
	});

	app.get('/dashboard', verifyToken, function(req, res){
		var user = {user: req.user.user};
		var content= {
			title: 'Dashboard',
			appName: 'tracker',
			rootController: 'TrackerCtrl',
			userData: JSON.stringify(user),
			user: user,
			scripts: [
				{src: '/static/libs/angular/angular.js'},
				{src: '/static/libs/angular-bootstrap/ui-bootstrap-tpls.min.js'},
				{src: '/static/libs/angular-ui-router/release/angular-ui-router.js'},
				{src: '/static/libs/angular-resource/angular-resource.js'},
				{src: '/static/libs/angular-cookies/angular-cookies.js'},
				{src: '/static/js/templates-app.js'},
				{src: '/static/js/templates-common.js'},
				{src: '/static/js/tracker-umaps.js'},
				{src: '//maps.googleapis.com/maps/api/js?sensor=false'},
				{src: '/static/libs/lodash/dist/lodash.underscore.js'},
				{src: '/static/libs/markerwithlabel/index.js'},
				{src: '/static/libs/jquery/dist/jquery.js'},
				{src: '/static/libs/moment/moment.js'},
				{src: '/static/libs/bootstrap-daterangepicker/daterangepicker.js'},
				{src: '/static/libs/d3/d3.js'}
			],
			links:[{
				rel: 'stylesheet',
				href: 'static/css/daterangepicker-bs3.css'
			}]
		};
		res.render('dashboard', content);
	});
};
