mainManager.controller('RegisterCtrl', [ "$scope", "$firebase",
  function($scope) {
    
    $('#registerForm').submit(function() {

      ref.createUser({
        email    : $scope.inputEmailFirst,
        password : $scope.InputPasswordFirst
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          
          var regRef = new Firebase("https://blazing-heat-534.firebaseio.com/users")
          .child(userData.uid).set({
            date: Firebase.ServerValue.TIMESTAMP,
            regUser: userData.uid,
            username: $scope.Inputusername

          }); //set

        } //else

      });

     routeTo("login");
    });
}]); // End Register Controller 
