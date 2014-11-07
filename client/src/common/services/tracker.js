// Tracker service

angular.module('tracker.sdk', [])
	.config(['$httpProvider', function($httpProvider) {
		// $httpProvider.defaults.useXDomain = true;
	//   delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}])
 .factory('Tracker', ['$http', '$q', '$rootScope', function($http, $q, $rootScope){
		var tracker = {};

		tracker._request = function (url, _method) {
			var method = _method || 'get';
			var deferred = $q.defer();
			$http({
				url: url,
				method: method
			}).success(deferred.resolve)
				.error(deferred.reject);
			var promise = deferred.promise;
			$rootScope.$broadcast('loadData', promise);
			return promise;
		};

		tracker.getMapFleet = function (params) {
			var url = '/api/map/fleet?';
			if (params && params.deviceid) {
				url+='deviceid='+params.deviceid;
			}
			if (params && params.groupid) {
				url+='groupid='+params.groupid;
			}
			return this._request(url, 'get');
		};

		tracker.getMapDevice = function(deviceID, from, to) {
			var url =  '/api/map/device?id='+ deviceID + '&from='+ from+'&to=' + to;
			return this._request(url);
		};

		tracker.listDevice = function(params) {
			var url = '/api/v1/device';
			if(params){
				url += ('groupid=' + params.groupid + '&fields=');
				url += params.fields.join(',');
			}

			return this._request(url);
		};

		tracker.listGroup = function(){
			var url = '/api/v1/group?';
			if(arguments[0]){ //mean fileds require
				var fields = arguments.join(',');
				url += 'fields=' + fields;
			}
			return this._request(url);
		};
		return tracker;
	}]).
	factory('Device', ['$resource', function($resource){
		return $resource('/api/v1/device/:deviceid', {
			deviceid: '@id'
		}, {
			query: {
				method: 'GET',
				isArray: false
			}
		});
	}]).
	factory('Group', ['$resource', function($resource){
		var Group = $resource('/api/v1/group/:groupid', {
			groupid: '@id'
		}, {
			query: {
				method: 'GET',
				isArray: false
			}
		});
		return Group;
	}]);
