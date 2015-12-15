mainManager.controller('RegistrationController', [ '$scope', 'Authentication', '$location', 
  function($scope, Authentication, $location) {

    $scope.currentPath = $location.path();

  	$scope.login = function(){
  		Authentication.login($scope.user);
  	} //login

  	$scope.register = function(){
  		Authentication.register($scope.user);
  	} // register

  	$scope.gitHublogin = function(){
  		Authentication.gitHublogin();
  	} //github authentication

	  $scope.googleLogin = function(){
  		Authentication.googleLogin();
  	} //github authentication

}]); // End Registration Controller 