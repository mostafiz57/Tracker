angular.module('tracker.report', ['tracker.directives.dateRange']).

	factory('DeviceReport', ['$resource', function($resource){
		var Report = $resource('/api/v1/device/:deviceId/report/:reportId');
		
		return Report;
	}]).

	factory('FleetReport', ['$resource', function($resource){
		var Report = $resource('/api/v1/group/:groupId/report/:reportId');
		
		return Report;
	}]).

	constant('REPORT_TYPE', [{
		name: 'Summary',
		id: 'EventSummary',
		type: 'fleet.summary',
		icon: 'fa fa-signal'
	},{
		name: 'Detail',
		id: 'EventDetail',
		type: 'device.detail',
		icon: 'fa fa-map-marker'
	}]).

	filter('unit', function(){
		return function(input) {
			var array = input.split('\n');
			output = array[0];
			if(array[1]) {
				output += ' ('+ array[1]+')';
			}
			return output;
		};
	}).

	directive('pieChart', function($window){
		return {
			restrict: 'EA',
			scope: {
				data: '=',
				radius: '@'
			},
			controller: function($scope){

			},
			link: function(scope, elm, attr) {
				var d3 = $window.d3;
				var radius = parseInt(scope.radius) || 100;
				var margin = 20;
				var height = radius*2 + margin;
				var width = height;

				var color = d3.scale.ordinal().
				    range(["#7ebf22", 'yellow', '#E2350B']);

				var arc = d3.svg.arc().
				    outerRadius(radius - 10).
				    innerRadius(0);

				var pie = d3.layout.pie().
				    sort(null).
				    value(function(d) { return d.quantity; });

				var svg = d3.select(elm[0]).append("svg").
				    attr("width", width).
				    attr("height", height).
				  	append("g").
				    attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

				scope.render = function(data){
					var g = svg.selectAll(".arc").
				      data(pie(data)).
				    	enter().append("g").
				      attr("class", "arc");
					g.append("path").
				      attr("d", arc).
				      style("fill", function(d) { return color(d.data.state); });

				  g.append("text").
				      attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; }).
				      attr("dy", ".35em").
				      style("text-anchor", "middle").
				      text(function(d) { return d.data.text; });
				};

				scope.$watch('data', function(_new){
					if(!_new) return;
					scope.render(scope.data);
				});
			}
		};
	}).

	directive('lineChart', function($window){
		var d3 = $window.d3;

		return {
			restrict: 'EA',
			scope: {
				data: '=',
				height: '@',
			},
			link: function(scope, elm, attr) {
				var margin = {top: 20, right: 20, bottom: 30, left: 50},
				    height = parseInt(scope.height);

				var svg = d3.select(elm[0]).
				    append("svg").
				    attr("width", '100%').
				    attr("height", height + margin.top + margin.bottom).
				    append('g').
				    attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				//parse date helper
				var parseDate = d3.time.format("%Y/%m/%d %H:%M:%S").parse;
 
				scope.render = function(data) {
					window.a =  elm.find('svg')[0];
					var width = elm.find('svg')[0].offsetWidth;
					console.log(width);
					svg.selectAll('*').remove();

					var x = d3.time.scale().range([0, width]);
					var y = d3.scale.linear().range([height, 0]);

					var xAxis = d3.svg.axis().
							scale(x).
							orient('bottom');

					var yAxis = d3.svg.axis().
							scale(y).
							orient('left');

					var line = d3.svg.line().
							x(function(d){
								return x(parseDate(d.date + ' ' + d.time));
							}).
							y(function(d){
								return y(parseFloat(d.speedh));
							});

					x.domain(d3.extent(data, function(d){
						return parseDate(d.date + ' ' + d.time);
					}));
					y.domain(d3.extent(data, function(d){
						return parseFloat(d.speedh);
					}));

					svg.append('g').
							attr('class', 'x axis').
							attr('transform', 'translate(0,' + height + ')').
							call(xAxis);

					svg.append('g').
							attr('class', 'y axis').
							call(yAxis).
							append('text').
								attr('transform', 'rotate(-90)').
								attr('y', 6).
								attr('dy', '-3em').
								style('text-anchor', 'end').
								text('Speed (kmph)');
					svg.append("path").
				      datum(data).
				      attr("class", "line").
				      attr("d", line);
				};

				scope.$watch('data', function(_new){
					if(!_new) return;
					scope.render(scope.data);
				});
			}
		};
	}).

	controller('ReportCtrl', [
		'$scope',
		'REPORT_TYPE',
		'DeviceReport',
		'FleetReport',
		'Device',
		'Group',
	function ($scope, REPORT_TYPE, DeviceReport, FleetReport, Device, Group) {
		$scope.dateRange = new Date();
		$scope.reportType = REPORT_TYPE;
		Device.query(function(response){
			$scope.devices = response.data;
		});

		Group.query(function(response) {
			var allGroup = {
				_id: 'all',
				description: 'All'
			};
			response.data.unshift(allGroup);
			$scope.groups = response.data;
		});

		$scope.currentReport = $scope.reportType[0];

		//default date range
		var endDate = moment();
		var startDate = moment().subtract(1, 'day');
		$scope.time = {
			startDate: startDate,
			endDate: endDate
		};

		$scope.showChart = false;

		//event handler
		$scope.switchTo = function (toReport) {
			$scope.currentReport = toReport;
		};

		$scope.selectDevice = function(ev, device) {
			$scope.currentItem = device;
			$scope.refreshReport();
		};

		$scope.selectGroup = function(ev, group) {
			$scope.currentItem = group;
			$scope.refreshReport();
		};

		$scope.toggleChart = function($event){
			$event.preventDefault();
			$scope.showChart = !$scope.showChart;
			$scope.refreshChart();
		};

		$scope.$watch('time', function(_new, _old){
			$scope.refreshReport();
		});

		var parseDuration = function(d){
			var parsed = d.split(' ').map(function(it){
				return parseInt(it);
			});
			var state;
			if(parsed[0]>0 || parsed[1] > 0){
				state = 'stopped';
				return state;
			}
			if(parsed[2] < 5) {
				state = 'running';
				return state;
			}
			return 'sleeping';
		};

		var parsePieData = function(){
			var data = {
				running: 0,
				sleeping: 0,
				stopped: 0
			};
			var total = $scope.report.Report.ReportBody.length;
			var pieData = $scope.report.Report.ReportBody.reduce(function (previous, current, index, _array) {
				console.log(current);
				switch (parseDuration(current.checkinage)) {
					case 'running':
						previous.running ++;
						break;

					case 'sleeping': 
						previous.sleeping++;
						break;

					case 'stopped':
						previous.stopped++;
						break;
				}
				return previous;
			}, data);
			res = [];
			for (var key in pieData){
				if(pieData.hasOwnProperty(key)){
					var text = '';
					if(pieData[key] !== 0) {
						text = pieData[key] + '/' + total;
					}
					res.push({
						state: key,
						quantity: pieData[key],
						text: text
					});
				}
			}
			console.log(res);
			return res;
		};

		$scope.$watch('currentReport', function(_new, _old){
			var type = $scope.currentReport.type.split('.')[0];
			console.log(type);
			if(type === 'fleet') { 
				$scope.itemType = 'group';
				$scope.chartName = 'stop';
				$scope.showDevice = false;
			} else if(type === 'device') {
				$scope.showDevice = true;
				$scope.chartName = 'speed';
				$scope.itemType = 'device';
			}
		});

		$scope.refreshChart = function() {
			if(!$scope.showChart) {
				return;
			}
			if($scope.chartName === 'stop') {
				$scope.pieChart = {
					data: parsePieData()
				};
			} else if($scope.chartName === 'speed') {
				$scope.lineChart = {
					data: $scope.report.Report.ReportBody
				};
			}
		};

		$scope.refreshReport = function(){
			if(!$scope.currentItem) {
				return;
			}
			$scope.showLoading = true;
			var type = $scope.currentReport.type.split('.')[0];
			if(type === 'fleet'){
				FleetReport.get({
					groupId: $scope.currentItem._id || 'all',
					reportId: $scope.currentReport.id
				}).$promise.then(function(res){
					$scope.showLoading = false;
					$scope.report = res.data;
					$scope.refreshChart();
				});
			} else if(type === 'device') {
				DeviceReport.get({
					deviceId: $scope.currentItem._id,
					reportId: $scope.currentReport.id,
					from: $scope.time.startDate.unix(),
					to: $scope.time.endDate.unix()
				}).$promise.then(function(res){
					$scope.showLoading = false;
					$scope.report = res.data;
					$scope.refreshChart();
				});
			}
		};
	}]);
