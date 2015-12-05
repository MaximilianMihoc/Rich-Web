mainManager.controller('LogInCtrl', [ "$scope", "$firebase",
  function($scope) {

    $('#LogInForm').submit(function() {
      //var emailLogin = $('#InputEmailLogin').val();
      //var passwordLogin = $('#InputPasswordLogin').val();
      
      ref.authWithPassword({
        email    : $scope.inputEmailLogin,
        password : $scope.inputPasswordLogin
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);

          routeTo("welcome");
        }  
      });

    }); // end click function

}]); // End LogIn Controller 