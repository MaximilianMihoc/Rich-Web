mainManager.factory('Authentication', ['$rootScope', '$firebaseAuth', '$firebaseObject', '$location', 'FIREBASE_URL',
function($rootScope, $firebaseAuth, $firebaseObject, $location) {
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);
	return{
		login: function(user){
			auth.$authWithPassword({
				email: user.email,
				password: user.password
			}).then(function(regUser){
				$location.path('/login');
			}).catch(function(error){
				$rootScope.message = error.message;
			});
		}, //login
		
	} 


}]); //factory