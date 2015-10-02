

var app = angular.module('cfSchools');

app.controller('schoolsCtrl', function($scope, $modal, $log, cfServices) {
	


	$scope.initAddress = {
        geometry : {
            location : {
                A : 37.1,
                F : -95.7
            }
        },
        zoom: 4
    };



   var Person = function(title, grade, updated) {
   	this.title = title;
   	this.grade = grade;
   	this.updated = updated;
   }

    $scope.getSchoolData = function(school) {
    	school.isVisible = !school.isVisible;
    	console.log(school);
    	cfServices.getSchoolId(school.place_id).then(function(result){
    		
	    		cfServices.getCfers(result[0]._id).then(function(cfers){
		    		console.log(cfers);
		    		school.cfersArr = [];
		    		school.count = cfers.length;
		    		for (var i = 0; i < cfers.length; i++) {
		    			school.cfersArr[i] = new Person("Student" + (i + 1), cfers[i].Grade, cfers[i].Updated);
		    		};		    		 
	    		})		 	
    	})
    };

    $scope.addCfer = function(place_id){
    	cfServices.getSchoolId(place_id).then(function(result){
    		$scope.mongoId = result[0]._id;
    	});

    	if (!$scope.mongoId){
    		cfServices.createSchool(place_id).then(function(result){
    			$scope.mongoId = result._id;
    			console.log(result);
    			console.log($scope.mongoId);
    		})
    	}
    	else{
    		cfServices.addCaretaker($scope.mongoId).then(function(result){
    			console.log(result);
    		})
    	}
    }

  $scope.animationsEnabled = true;

	$scope.open = function (size) {

		var modalInstance = $modal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'myModalContent.html',
		  controller: 'modalInstanceCtrl',
		  resolve: {
		    items: function () {
		      return $scope.items;
		    }
		  }
		});

		modalInstance.result.then(function (selectedItem) {
		  $scope.selectedSchool = selectedItem;
		})
	};

});

angular.module('cfSchools').controller('modalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

