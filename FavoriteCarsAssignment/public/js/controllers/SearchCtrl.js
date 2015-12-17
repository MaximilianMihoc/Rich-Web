/* Search Controller. Used in the search view.*/
mainManager.controller('SearchCtrl', [ '$scope', 'Authentication', '$routeParams', '$http',
  function($scope, Authentication, $routeParams, $http) {

	/* this http request will get a list of cars from Edmunds API which will be nicely displayed in my application.*/
  	var responsePromise = $http.get("https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
	responsePromise.success(function(data, status, headers, config) {
			$scope.cars = data;
			$scope.uid = $routeParams.uid;

	});
	responsePromise.error(function(data, status, headers, config) {
		alert("AJAX failed!");
	});
}]); // End AppCtrl Controller 

