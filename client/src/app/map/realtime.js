angular.module('tracker.map.realtime', [])
  .factory('Realtime', [
    'Tracker',
    'GoogleMap',
    '$interval',
  function(Tracker, GoogleMap, $interval){
    var ret = {};
    ret.events = {
      click: 'showInfoWindow',
    };

		ret.tracking = null;

    ret.addMarkerWithLabel = function(feature){
      var self = this;
      var marker = GoogleMap.createMarker(feature);
    };

    ret.init = function () {
      var self = this;
			
      Tracker.getMapFleet().then(function (data) {
				self.features = data;
				GoogleMap.markerLayer.addGeoJson(data);
				GoogleMap.markerLayer.setMap(GoogleMap.map);
				GoogleMap.zoom(GoogleMap.markerLayer);
      });
    };

    ret.now = function () {
      var self = this;
      Tracker.getMapFleet(this.tracking).then(function (data) {
        _.each(data, function (feature) {
						GoogleMap.markerLayer.addGeoJson(feature);
        });
      });
    };

    ret.sync = function () {
      var self = this;
      this.updateInterval = $interval(function () {
        self.now();
      }, 10000);
    };

    ret.unsync = function () {
      $interval.cancel(this.updateInterval);
      GoogleMap.markerLayer.setMap(null);
    };

		ret.get = function (id) {
			return _.filter(this.features, {id: id})[0];
		};

    ret.look = function (id) {
      var feature = _.filter(this.features, {id: id})[0];
			var pos =  {
				lat: feature.geometry.coordinates[1],
				lng: feature.geometry.coordinates[0],
			};
			GoogleMap.zoomTo(pos);
    };
    return ret;
  }]);
