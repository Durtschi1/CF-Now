var app = angular.module('cfSchools');


app.service('cfServices', function($http){
	this.getSchoolId = function(place_id){
		return $http({
			method: 'GET',
			url: '/api/school/getId/' + place_id
		}).then(function(response){
			return response.data;
		})
	},
	this.getCfers = function(mongoId){
		return $http({
			method: 'GET',
			url: '/api/cf/getCfer/' + mongoId
		}).then(function(result){
			return result.data;
		})
	},
	this.createCaretaker = function(newCaretaker){
		return $http({
			method: 'POST',
			url: '/api/caretaker/create',
			data: newCaretaker
		}).then(function(result){
			return result.data;
		})
	},
	this.validateCaretaker = function(email, password){
		return $http({
			method: 'POST',
			url: '/api/caretaker/login',
			data: {
				username: email,
				password: password
			}
		}).then(function(result){
			return result.data;
		})
	},
	this.createSchool = function(place_id){
		return $http({
			method: 'POST',
			url: '/api/school/create',
			data: {
				placeId: place_id
			}
		}).then(function(result){
			return result.data
		})
	},
	this.addCaretaker = function(mongoId){
		return $http({
			method: 'POST',
			url: '/api/school/addCaretaker/' + mongoId
		})
	}
});
			

