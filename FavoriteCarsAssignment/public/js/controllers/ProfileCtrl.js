mainManager.controller('ProfileCtrl', [ '$scope', 'Authentication', '$routeParams', 'FIREBASE_URL',
  function($scope, Authentication, $routeParams, FIREBASE_URL) {
	
  	var uid = $routeParams.uid;
  	$scope.uid = uid;
	
	//console.log(uid);
	//console.log(uid.regUser);
	console.log(FIREBASE_URL + "favoriteCars/" + uid);
  	var regRef = new Firebase(FIREBASE_URL + "favoriteCars/" + uid);

    regRef.on("value", function(snapshot) {
	  	var favCars = snapshot.val();
	  	console.log(favCars);
	  	$scope.favCars = favCars;
	  	$scope.$apply();

	}, function (errorObject) {
	  console.log("Feiled user Data could not be loaded: " + errorObject.code);
	});




}]); // End AppCtrl Controller 

