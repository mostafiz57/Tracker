angular.module('tracker.gmap', [])
  .directive('gmap', ['GoogleMap', function (GoogleMap) {
    var linkFn = function (scope, elm, attr) {
      console.log(GoogleMap);
      GoogleMap.initMap();
    };
    return {
      restrict: 'EA',
      link: linkFn,
      controller: 'GMapCtrl'
    };
  }])
  .controller('GMapCtrl', ['$scope', function($scope){

  }]);
