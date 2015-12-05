//Create a module named mainApp and load ngRoute as a dependent module
var mainApp = angular.module("mainApp", ['ngRoute']);
 
 //Configure the routes using $routeProvider.
mainApp.config(function($routeProvider) {
    $routeProvider
	//We use two paths in the example, /home and /viewStudents.
	//We use only a single controller in this example, StudentController
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'StudentController'
        })
        .when('/viewStudents', {
            templateUrl: 'viewStudents.html',
            controller: 'StudentController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});
 //StudentController is initialized with an array of students and a message. We will be showing the message in the home page and the students list in viewStudents page.
mainApp.controller('StudentController', function($scope) {
    $scope.students = [
        {name: 'Mark Waugh', city:'New York'},
        {name: 'Steve Jonathan', city:'London'},
        {name: 'John Marcus', city:'Paris'}
    ];
 
    $scope.message = "Click on the hyper link to view the students list.";
});