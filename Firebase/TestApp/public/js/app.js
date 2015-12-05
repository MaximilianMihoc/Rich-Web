

var mainManager = angular.module('mainManager', ['ngRoute','firebase'])
.constant('FIREBASE_URL', 'https://blazing-heat-534.firebaseio.com');

//var ref = new Firebase(FIREBASE_URL);

mainManager.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'FirstCtrl'
    })
    .when('/login', {
      templateUrl: 'views/logInPage.html',
      controller: 'LogInCtrl'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterCtrl'
    })
    .when('/welcome', {
      templateUrl: 'views/welcome.html',
      controller: 'AppCtrl',
      resolve: {
        
      }//resolve
    })
    .otherwise({
        redirectTo: '/home'
    });

}]);

function routeTo(route) {
        window.location.href = '#/' + route;
}

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