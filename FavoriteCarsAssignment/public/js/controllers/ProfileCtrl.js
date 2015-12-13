mainManager.controller('ProfileCtrl', [ '$scope', 'Authentication', 'FIREBASE_URL',
  function($scope, Authentication, FIREBASE_URL) {
	
  	var uid = Authentication.getUserObject();
	
	console.log(uid);
	//console.log(uid.regUser);
	console.log(FIREBASE_URL + "users/" + uid + "/favoriteCars");
  	var regRef = new Firebase(FIREBASE_URL + "users/" + uid + "/favoriteCars");

    regRef.on("value", function(snapshot) {
	  	var reviewUserName = snapshot.val();
	  	console.log(reviewUserName);

	}, function (errorObject) {
	  console.log("Fevied user Data could not be loaded: " + errorObject.code);
	});





}]); // End AppCtrl Controller 

