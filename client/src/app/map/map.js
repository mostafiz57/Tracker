angular.module('tracker.map', ['tracker.gmap','tracker.map.realtime', 'tracker.map.timemachine']);

angular.module('tracker.map')
  .controller('MapCtrl', [
    '$scope',
    'Group',
    'Realtime',
    'History',
  function ($scope, Group, Realtime, History) {
  	Group.query(function(response){
   		 $scope.groups  = response.data;
    });
		var STATE = {
			sync: 'sync',
			history: 'history'
		};
		var self = this;

		$scope.$watch('state', function (newState, oldState) {
			console.log(oldState, newState);
			if(newState === STATE.sync){
				Realtime.init();
				Realtime.sync();
			} else if (newState === STATE.history) {
				Realtime.unsync();
			}
		});

    $scope.selectDevice = function(device) {
			if($scope.state === STATE.history) {
				return;
			}
      var feature = Realtime.get(device._id);
			$scope.infor = {
				title: device.description,
				show: true,
				feature: feature
			};
			Realtime.look(device._id);
    };
		
    $scope.startTimeMachine = function($event, device) {
			console.log($event);
			$event.stopPropagation();
			$scope.state = STATE.history;
      if(device) {
        History.setDevice(device);
        History.start();
      }
    };

		$scope.track = function($event, device) {
			$event.stopPropagation();
			Realtime.addDevice(device);
		};
		
		$scope.infor = {
			show: false
		};
		$scope.state = STATE.sync;

		$scope.mapSearchHide = function(){
			$('#main .map').animate({left:'0px'},1000);
			$('#main aside.device-group-list').animate({width:'0px'},1000);
			$('#chevron-right').show("slow");
			$('#map-sidebar').hide('slow');
		};

		$scope.mapSearchShow = function(){
			$('#chevron-right').hide("slow");
		    $('#main .map').animate({left:'250px'},1000);
		    $('#main aside.device-group-list').animate({width:'250px'},1000);
		    $('#map-sidebar').show('slow');
		}
  }]);


InfoPanelModel = function (data) {
  if(data){
    _.extend(this, data);
  }
};
InfoPanelModel.prototype.__set = function (prop, data) {
  this[prop] = data;
};
angular.module('tracker.map')
  .directive('inforPanel', [function () {
		var linkFn = function (scope, elm, attr) {
		};
    return {
			scope: {
				model: "="
			},
			restrict: 'EA',
			templateUrl: 'map/infor-panel.tpl.html',
			link: linkFn,
			controller: function ($scope) {
				$scope.$watch('model', function (_new) {
					if(!_new.show){return;}
					var feature = _new.feature;
					$scope.lastPing = feature.properties;
					$scope.lastPing.lat = feature.geometry.coordinates[1];
					$scope.lastPing.lng = feature.geometry.coordinates[0];
				});
			}
		};
  }]);
