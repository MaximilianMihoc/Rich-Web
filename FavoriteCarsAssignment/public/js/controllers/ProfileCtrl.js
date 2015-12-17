/* Profile controller. Used in the profile view to get the list of favorite cars of the authenticated user.*/
mainManager.controller('ProfileCtrl', [ '$scope', 'Authentication', '$routeParams', '$location', 'FIREBASE_URL',
  function($scope, Authentication, $routeParams, $location, FIREBASE_URL) {
	
  	var uid = $routeParams.uid;
  	$scope.uid = uid;
	
	//console.log(FIREBASE_URL + "favoriteCars/" + uid);
  	var regRef = new Firebase(FIREBASE_URL + "favoriteCars/" + uid);

  	// favorite cars was object created in the database to store the list of favorite cars. 
  	// in this object, each user will have it's own record containing some data about the car he/she likes.
    regRef.on("value", function(snapshot) {
	  	var favCars = snapshot.val();
	  	$scope.favCars = favCars;
	  	$scope.$apply();

	}, function (errorObject) {
	  console.log("Feiled user Data could not be loaded: " + errorObject.code);
	});




}]); // End AppCtrl Controller 

