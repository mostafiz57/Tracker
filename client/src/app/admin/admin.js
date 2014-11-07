/**
* tracker.admin Module
*
* Description
*/
angular.module('tracker.admin', ['tracker.admin.user'])
	.config(['$stateProvider',function($stateProvider) {
		$stateProvider
			.state('admin.device', {
				url: '/device',
				templateUrl:'admin/device.tpl.html',
				controller: 'DeviceCtrl'
			})
			.state('admin.group', {
				url: '/group',
				templateUrl:'admin/user.tpl.html',
				controller: 'GroupCtrl'
			})
			.state('admin.user', {
				url: '/user',
				templateUrl:'admin/user.tpl.html',
				controller: 'UserCtrl'
			})
			.state('admin.geozone', {
				url: '/geozone',
				templateUrl:'admin/user.tpl.html',
				controller: 'GeozoneCtrl'
			});
	}])
	.controller('AdminCtrl', ['$scope', function($scope){
		$scope.pageList = [{
			title: 'Devices',
			icon: 'fa fa-automobile',
			sref: '.device'
		},{
			title: 'Groups',
			icon: 'fa fa-bus',
			sref: '.group'
		},{
			title: 'Users',
			icon: 'fa fa-user',
			sref: '.user'
		},{
			title: 'Geozone',
			icon: 'fa fa-minus-circle',
			sref: '.geozone'
		}];
	}]).

	controller('DeviceCtrl', ['$scope', function($scope) {

	}]).
	controller('GroupCtrl', ['$scope', function($scope) {

	}]).
	controller('GeozoneCtrl', ['$scope', function($scope) {

	}]);
