/**
* tracker.directives.dateRange Module
*
* Description
*/
angular.module('tracker.directives.dateRange', []).
	directive('dateRangePicker', function() {
		var linkFn = function(scope, elm, attr){
			$('div[role="date-range-picker"]').daterangepicker({
				timePicker: true, 
				timePickerIncrement: 30,
				ranges: {
					'Today': [moment(), moment()],
					'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				},
				startDate: scope.model.startDate,
				endDate: scope.model.endDate
			},
			function(start, end) {
				scope.model = {
					startDate:start,
					endDate: end
				};
				scope.$apply();
			});
		};

		return {
			restrict: 'EA',
			templateUrl: 'directives/date-range/date-range-picker.tpl.html',
			scope: {
				model: '=ngModel'
			},
			link: linkFn,
		};
	});