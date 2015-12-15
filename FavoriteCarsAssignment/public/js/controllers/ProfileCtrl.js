mainManager.controller('ProfileCtrl', [ '$scope', 'Authentication', '$routeParams', '$location', 'FIREBASE_URL',
  function($scope, Authentication, $routeParams, $location, FIREBASE_URL) {
	
  	var uid = $routeParams.uid;
  	$scope.uid = uid;
  	//$scope.hideNavBar = true;
	
	//console.log(FIREBASE_URL + "favoriteCars/" + uid);
  	var regRef = new Firebase(FIREBASE_URL + "favoriteCars/" + uid);

    regRef.on("value", function(snapshot) {
	  	var favCars = snapshot.val();
	  	$scope.favCars = favCars;
	  	$scope.$apply();

	}, function (errorObject) {
	  console.log("Feiled user Data could not be loaded: " + errorObject.code);
	});




}]); // End AppCtrl Controller 

