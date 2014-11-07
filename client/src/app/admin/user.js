//TODO: must be a factory
function User (data) {
	_.extend(this, data);
}

/**
* tracker.admin.user Module
*
* Description
*/
angular.module('tracker.admin.user', []).
	controller('UserCtrl', ['$scope', 'FEATURES', 'Tracker' ,function($scope, FEATURES, Tracker) {
		Tracker.listGroup().
			then(function(data) {
				console.log(data);
				$scope.groupList = data;
			});

		var test = new User({
			id: 'mahpah',
			email: 'mahpah@gmail.com',
			tel: '1346541-7',
			name: 'Mahp Ah',
			role: 'owneer',
			group: {
				id: 'test',
				name: 'test'
			},
			features: [
				{name:'Sign-in', granted: true},
				{name:'Now', granted: true},
				{name:'History', granted: true},
				{name:'Dispatch', granted: true},
				{name:'Reports', granted: true},
				{name:'Service', granted: false}
			]
		});

		$scope.users = [test];

		$scope.toggleEdit = function(user) {
			if($scope.addNew) {
				$scope.addNew = false;
			}
			user.editting = true;
			$scope.tmpUser = angular.copy(user);
		};

		$scope.cancelEdit = function() {
			user.editting = false;
			$scope.tmpUser = null;
		};

		$scope.save = function(user) {
			user.editting = false;
			save($scope.tmpUser);
		};

		var save = function(user){
			//emulate sync with server
			console.log('requesting');
		};

		$scope.toggleAdd = function(){
			$scope.addNew = true;
			$scope.tmpUser = new User({features: FEATURES});
			console.log($scope.tmpUser);
		};

		$scope.addUser = function(user) {
			$scope.users.push(user);
		};

	}]);