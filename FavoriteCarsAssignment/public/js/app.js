

var mainManager = angular.module('mainManager', ['ngRoute','firebase'])
.constant('FIREBASE_URL', 'https://favoritecars.firebaseio.com/');

//var ref = new Firebase("https://favoritecars.firebaseio.com/");

mainManager.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'FirstCtrl'
    })
    .when('/login', {
      templateUrl: 'views/logInPage.html',
      controller: 'RegistrationController'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationController'
    })
    .when('/welcome', {
      templateUrl: 'views/welcome.html',
      controller: 'AppCtrl',
      resolve: {
        currentAuth: function(Authentication){
          return Authentication.requireAuth();
        } //current Auth
      } //resolve
    })
    .otherwise({
        redirectTo: '/home'
    });

}]);

mainManager.run([ '$rootScope', '$location', 
  function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', 
      function(event, next, previous, error) {
        if(error = 'AUTH_REQUIRED') {
          $rootScope.message = 'Sorry, you must log in to access that page';
          $location.path('login');
        }
      }); //event info
}]); //run 


// find a suitable name based on the meta info given by each provider
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}