mainManager.controller('AppCtrl', [ '$scope', 'Authentication', '$routeParams', '$http',
  function($scope, Authentication, $routeParams, $http) {

  	var responsePromise = $http.get("https://api.edmunds.com/api/vehicle/v2/makes?state=new&fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
	responsePromise.success(function(data, status, headers, config) {
			$scope.cars = data;
			$scope.uid = $routeParams.uid;

	});
	responsePromise.error(function(data, status, headers, config) {
		alert("AJAX failed!");
	});

	/*$scope.view = function(){

	};*/


}]); // End AppCtrl Controller 

