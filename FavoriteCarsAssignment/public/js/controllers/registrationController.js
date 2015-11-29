mainManager.controller('RegistrationController', [ '$scope', 'Authentication',
  function($scope, Authentication) {

  	$scope.isLoggedIn = true;

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