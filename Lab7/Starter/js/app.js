var movieController = angular.module('myApp', []);
var pendingTask;
movieController.controller("MovieController", function($scope, $http) {

	$scope.change = function() {

		clearTimeout(pendingTask);
		pendingTask = setTimeout(function(){ $scope.search = ""; }, 1000); 
		
		var responsePromise = $http.get("http://www.omdbapi.com/?t=" + $scope.search + "&y=&plot=full&r=json&tomatoes=true");
		var relatedResponsePromise = $http.get("http://www.omdbapi.com/?s=" + $scope.search);


		responsePromise.success(function(data, status, headers, config) {
			$scope.details = data ;

			});
		responsePromise.error(function(data, status, headers, config) {
			alert("AJAX failed!");
		});

		relatedResponsePromise.success(function(data, status, headers, config) {
			$scope.related = data ;

			});
		relatedResponsePromise.error(function(data, status, headers, config) {
			alert("AJAX failed!");
		});
	}

	$scope.update = function(movie){

		$scope.search = movie.Title;
		$scope.change();

	}

} );