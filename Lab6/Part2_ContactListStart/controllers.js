contactManager.controller('AppCtrl',
	function AppCtrl ($scope) {
		$scope.contacts = [{
		name: 'John Smith',
		phone: '087-1234567'
	}];
});

// This controller simply aliases the contact based on 
// the parameter passed through by the routing configuration.
contactManager.controller('InfoCtrl',
	function InfoCtrl($scope, $routeParams) {
		$scope.contact = $scope.contacts[$routeParams.id];
});

contactManager.controller('AddCtrl',
		// Write the controller for adding contacts: 
		// based on the ID passed through the route parameter, 
		// it aliases a $scope.contact variable so that the 
		// HTML template can display the desired user
		// e.g., *push* contact to contacts
		);
		  
contactManager.controller('RemoveCtrl',
		// Write the controller for removing contacts, which is similar to AddCtrl: 
		// This controller initialises the contact scope variable to an empty object, 
		//then exposes a method on the scope for use by the template
		// e.g., *splice* contact from contacts
);