// The application is configured to use the view corresponding to the URL, 
// parsing out an ID where needed, and redirecting to /index otherwise. 
// The index route doesn’t need any special functionality, so there’s 
// no need to write a controller for it. Each of the other routes will need some business logic.

var contactManager = angular.module('contactManager', [])
  .config(function($routeProvider) {
    $routeProvider.when('/index',{
      templateUrl: 'partials/index.html'
    })
    .when('/info/:id', {
      templateUrl: 'partials/info.html',
      controller: 'InfoCtrl'
    })
    
    // Your code for add and remove routes will go here
    // Also add the .otherwise case
      
    
       
    
  });