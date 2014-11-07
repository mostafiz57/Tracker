describe('main', function () {
	it('should run test', function () {
		expect(true).toBe(true);
	});

	it('should loeded angular', function () {
		expect(angular.module('tracker')).toBeDefined();
	});

	it('should inject dependence', inject(function ($http) {
		expect($http).toBeDefined();
	}));
});