mainManager.factory('Authentication', ['$rootScope', '$firebaseAuth', '$firebaseObject', '$location', 'FIREBASE_URL',
function($rootScope, $firebaseAuth, $firebaseObject, $location, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var userObject;

    auth.$onAuth(function(authData) {
     
    	if(authData){
    		var userRef = new Firebase(FIREBASE_URL + "users/" + authData.uid)
    		var userObj = $firebaseObject(userRef);

    		$rootScope.auth = authData;

    		$rootScope.currentUser = userObj;
    		userObject = userObj;
    	}else{
    		$rootScope.auth = '';
    		$rootScope.currentUser = '';
    	}

    });
	
	return {
		login: function(user) {
	      auth.$authWithPassword({
	        email    : (user.inputEmail).trim(),
	        password : user.inputPassword
	      }).then(function(authData) {
	          console.log("Authenticated successfully with payload:", authData);
	          $location.path('/profile');
	      }).catch(function(error){
	          console.log("Login Failed!", error);
	          $rootScope.message = 'The specified credentials does not exist. Please Register or try again.';
	          $location.path('/login');
	      });
	    }, // end login
	    register: function(user) {
	    	var self = this;
	      auth.$createUser({
	        email    : (user.inputEmail).trim(),
	        password : user.inputPassword
	      }).then(function(userData) {
	          console.log("Successfully created user account with uid:", userData);
	          
	          // calculate ravatar hash and get the gravatar image URL
	          var emailHash = get_gravatar((user.inputEmail).trim(), 200);

	          var regRef = new Firebase(FIREBASE_URL + "users")
	          .child(userData.uid).set({
	            date: Firebase.ServerValue.TIMESTAMP,
	            regUser: userData.uid,
	            username: user.Inputusername,
	            profilePictureURL: emailHash

	          }); //set

	        //log in user after registration 
	        var loginUser = {
	        	inputEmail 		: "" + user.inputEmail,
	        	inputPassword 	: "" + user.inputPassword
	        };

	        self.login(loginUser);
	        $location.path('/profile');

	      }).catch(function(error){
	          console.log("Error creating user:", error);
	      });

	  	}, // register
	  	logout: function() {
	    	return auth.$unauth();
	    }, //logout
	    getUserObject: function() {
	    	return userObject.regUser;
	    }, // getUserObject
	    requireAuth: function() {
	    	return auth.$requireAuth();
	    }, //require Authentication

	    gitHublogin: function() {
		    ref.authWithOAuthPopup("github", function(error, authData) {
	          if (error) {
	            console.log("Login Failed!", error);
	          } else {
	            console.log("Authenticated successfully with payload:", authData);
	            var regRef = new Firebase(FIREBASE_URL + "users")
		          .child(authData.uid).set({
		            date: Firebase.ServerValue.TIMESTAMP,
		            regUser: authData.uid,
		            username: authData.github.username,
		            profilePictureURL: authData.github.profileImageURL

		          }); //set

		          $location.path('/profile');

	          }
	        }, 
	        {
	          remember: "sessionOnly",
	          scope: "user,gist"
	        });

	    }, // github login

	    googleLogin: function() {
	    	ref.authWithOAuthPopup("google", function(error, authData) {
	          if (error) {
	            console.log("Login Failed!", error);
	          } else {
	            console.log("Authenticated successfully with payload:", authData);
	            var regRef = new Firebase(FIREBASE_URL + "users")
		          .child(authData.uid).set({
		            date: Firebase.ServerValue.TIMESTAMP,
		            regUser: authData.uid,
		            username: authData.google.displayName,
		            profilePictureURL: authData.google.profileImageURL

		          }); //set

		          $location.path('/profile');

	          }
	        }, 
	        {
	          remember: "sessionOnly",
	          scope: "email"
	        });
	    } // google login

	} //return


}]); //factory