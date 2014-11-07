//start with dependencies
angular.module('tracker', [
	'templates-app',
	'templates-common',
	'tracker.params',
	'ngResource',
	'ngCookies',
	'ui.bootstrap',
	'ui.router',
	'tracker.sdk',
	'google.maps',
	'tracker.map',
	'tracker.directives',
	'tracker.report',
	'tracker.admin'
]);

angular.module('tracker').
	factory('AuthInterceptor', [
		'$rootScope',
		'$q',
		'AUTH_EVENTS',
		'$cookies',
		function($rootScope, $q, AUTH_EVENTS, $cookies){
			return {
				request: function(config){
					config.headers = config.headers || {};
					if($cookies.token) {
						config.headers.Authorization = 'Bearer ' + $cookies.token;
					}
					return config;
				},

				responseError: function(response){
					if(response.status === 401) {
						$rootScope.$broadcast(
							AUTH_EVENTS.unauthorizedResponse,
							response
						);
					}
					return $q.reject(response);
				}
			};
		}]).
	config(['$httpProvider', '$provide',
		function($httpProvider, $provide) {
			$httpProvider.interceptors.push('AuthInterceptor');

			var profile = angular.copy(window.user);
			$provide.constant('ActiveSession', {user: profile});
		}
	])
	.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('map', {
				url: '/',
				controller: 'MapCtrl',
				templateUrl: 'map/map.tpl.html',
				data: {
					pageTitle: 'Map'
				}
			})
			.state('history', {
				url: '/',
				controller: 'MapCtrl',
				templateUrl: 'map/map.tpl.html',
				data: {
					pageTitle: 'TimeMachine'
				}
			})
			.state('report', {
				url:'/report',
				templateUrl: 'report/report.tpl.html',
				controller: 'ReportCtrl',
				data: {
					pageTitle: 'Report'
				}
			})
			.state('admin', {
				url:'/admin',
				templateUrl: 'admin/admin.tpl.html',
				data: {
					pageTitle: 'Administration'
				},
				controller: 'AdminCtrl'
			});
			$urlRouterProvider.otherwise('/');
	}])
	.config(['GoogleMapProvider', function(GoogleMapProvider){
		GoogleMapProvider.setMapElement('map-canvas');
	}])
	.run(['$rootScope',
		'AUTH_EVENTS',
		'$location',
		function($rootScope, AUTH_EVENTS, $location) {
			$rootScope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
			});
		}
	])
	.controller('TrackerCtrl', [
		'$rootScope',
		'AUTH_EVENTS',
		'ActiveSession',
		'$scope',
		function($rootScope, AUTH_EVENTS, ActiveSession, $scope) {
			$scope.user = ActiveSession.user;
			$rootScope.$on(AUTH_EVENTS.unauthorizedResponse, function (event, data) {
				console.log(data);
			});
			$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
				if ( angular.isDefined( toState.data.pageTitle ) ) {
					$scope.pageTitle = toState.data.pageTitle + ' | GPS Handle' ;
				}
				if(toState === 'map'){
					$scope.$broadcast('sync');
				}else {
					$scope.$broadcast('unsync');
				}
		  });
		}
	]);
