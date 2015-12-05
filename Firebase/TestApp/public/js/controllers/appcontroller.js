mainManager.controller('AppCtrl', [ "$scope", "$firebase",
  function($scope) {

    ref.onAuth(function(authData) {
     
      $scope.auth = authData;

      $scope.username = getName(authData);

    });

}]); // End AppCtrl Controller 