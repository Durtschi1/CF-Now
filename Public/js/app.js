

var app = angular.module('cfSchools',  [ 
  'ngRoute', 
  'ngPlacesMap',
  'ui.bootstrap',
  'ngAnimate'
  ]);

app.config(function($routeProvider){
  $routeProvider
  .when('/schools', {
    templateUrl: 'views/schools.html',
    controller: 'schoolsCtrl'
  })
  .when('/login', {
  	templateUrl: 'views/login.html',
  	controller: 'loginCtrl',
  })
	  
  .otherwise({
    redirectTo:'/schools'
  })
});
