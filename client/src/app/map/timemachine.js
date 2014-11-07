var TimeMachine = function (data) {
  _.extend(this, data);
};

angular.module('tracker.map.timemachine', [])
  .controller('TimeMachine', ['History','$scope' , function (History, $scope) {
    $scope.model = History.createInstance();
		$scope.show = function (e) {
			History.start();
		};
		$scope.play =  function () {
			History.play();
		};
  }])

  .factory('History', ['GoogleMap', 'Tracker','$interval', function (GoogleMap, Tracker, $interval) {
    var tm = {};
    function setStyle (feature){
      var icon = feature.getProperty('icon');
      var strokeColor = feature.getProperty('strokeColor') || '#ff0000';
      var strokeOpacity= 0.6;
      return {
        icon: icon,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        weight: 2
      };
    }

    tm.createInstance = function () {
      this.instance = new TimeMachine({
        running: false,
      });
			return this.instance;
    };

    tm.setDevice = function (device) {
      this.instance.device = device;
			this.instance.toDate = Date.now();
			this.instance.fromDate = Date.now() - 6*3600*1000;
    };

    tm.start = function() {
      var self = this;

      if(!this.instance.device) {
        console.warn('I belive you get here by accident.');
        return;
      }
			this.instance.running = true;
      var from = parseInt(this.instance.fromDate/1000);
      var to = parseInt(this.instance.toDate/1000);
			if(to < from) {
				return;
			}
      if(self.dataLayer) {
        self.dataLayer.setMap(null);
        self.dataLayer = null;
      }
      Tracker.getMapDevice(this.instance.device._id, from, to)
        .then(function (data) {
          if(angular.equals(data, {})) {
						console.log('empty');
						return;
					}
					console.log('loaded');
					self.data = data;
          var line = data[0];
					self.points = data[1].features;
					self.instance.line = line;
					GoogleMap.clearDataLayer();
					GoogleMap.dataLayer.setStyle(function (f) {
						return {
							strokeColor: f.getProperty('routeColor') || '#ff0000',
							strokeOpacity: 0.6,
							strokeWeight: 3
						};
					});
          GoogleMap.dataLayer.addGeoJson(line);
          GoogleMap.zoom(GoogleMap.dataLayer);
          GoogleMap.dataLayer.setMap(GoogleMap.map);
        });
    };

		tm.play = function (_speed) {
			var self = this;
			var speed = _speed || 50;
			console.log('play');
			GoogleMap.dataLayer.setStyle( {
				strokeOpacity: 0,
			});
			var latlng;
			var marker = new Marker(self.points[0]);
			marker.setMap(GoogleMap.map);
			GoogleMap.dataLayer.forEach(function (feature) {
				if(feature.getGeometry().getArray){
					latlng = feature.getGeometry().getArray();
				}
			});
			var polyOptions = {
			    strokeColor: '#ff0000',
			    strokeOpacity: 0.5,
			    strokeWeight: 3
			};
			poly = new google.maps.Polyline(polyOptions);
			poly.setMap(GoogleMap.map);
			
			var path = poly.getPath();
			var i = 0, length = latlng.length;
			var it = $interval(function () {
				if(i >= length) {
					$interval.cancel(it);
					console.log('end');
					return;
				}
				var current = latlng[i];
				marker.update(self.points[i]);
				GoogleMap.zoomTo(current);
				path.push(current);
				i++;
			}, speed);
		};

    return tm;
  }])
  .controller('LoadingBarCtrl', ['$scope', '$interval','$timeout', function ($scope, $interval, $timeout){
		$scope.width = 0;
		$scope.opacity = 0;
		var init = 25, step = 200;

		$scope.$on('loadData', function (ev, promise) {
			$scope.width = 0;
			$scope.opacity = 1;
			var i = 0;
			var it = $interval(function () {
				i+=1;
				$scope.width += init / i;
			}, step);
			promise.then(function () {
				$interval.cancel(it);
				$scope.width = 100;
				$scope.opacity = 0;
				$timeout(function () {
					$scope.width = 0;
				}, 500);
			});
		});
  }]);

