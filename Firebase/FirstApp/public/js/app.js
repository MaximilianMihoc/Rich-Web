// I need a controller to get user information and put it on the screen.
var app = angular.module("sampleApp", ["firebase"]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://simplechatmm.firebaseio.com/");
    return $firebaseAuth(ref);
  }
]);

app.controller("SampleCtrl", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {
    $scope.authData = authData;

    var fireBaseRef = new Firebase("https://simplechatmm.firebaseio.com/");
    $("#git-login").bind("click", function() {

        fireBaseRef.authWithOAuthPopup("github", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
          }
        }, 
        {
          remember: "sessionOnly",
          scope: "user,gist"
        });
    });

    $("#submit-btn").bind("click", function(e) {
        var comment = $("#comments");
        var commentValue = $.trim(comment.val());

        if (commentValue.length === 0) {
            alert('Comments are required to continue!');
        } else {
            fireBaseRef.push({comment: commentValue}, function(error) {
                if (error !== null) {
                    alert('Unable to push comments to Firebase!');
                }
            });

            comment.val("");
        }

        e.preventDefault();
        e.stopPropagation();
    });

    fireBaseRef.on('child_added', function(snapshot) {
        var uniqName = snapshot.name();
        var comment = snapshot.val().comment;
        var commentsContainer = $('#comments-container');

        $('<div/>', {class: 'comment-container'})
            .html('<span class="label label-default">Comment ' 
                + uniqName + '</span>' + comment).appendTo(commentsContainer);

        commentsContainer.scrollTop(commentsContainer.prop('scrollHeight'));
    });

    });
  }
]);

