var app = angular.module('cfSchools');


app.controller('loginCtrl', function($scope, cfServices, $location) {

	$scope.createCaretaker = function(newCaretaker){
		console.log(newCaretaker);
		cfServices.createCaretaker(newCaretaker).then(function(result){
			return result;

		})
	}

	$scope.login = function(email, password){
		cfServices.validateCaretaker(email, password).then(function(result){
				$location.path('/schools');
			return result;

		})
	}
});
