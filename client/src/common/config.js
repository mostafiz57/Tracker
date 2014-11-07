/**
* tracker.params Module
*
* Define global params for tracker
*/
angular.module('tracker.params', []).
	constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	}).
	constant('BASE_URL', 'http://localhost:6969/api/').
	constant('FEATURES', [
		{name:'Sign-in', granted: false},
		{name:'Now', granted: false},
		{name:'History', granted: false},
		{name:'Dispatch', granted: false},
		{name:'Reports', granted: false},
		{name:'Service', granted: false}
	]);
