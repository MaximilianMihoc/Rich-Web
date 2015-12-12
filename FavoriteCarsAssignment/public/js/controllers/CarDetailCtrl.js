mainManager.controller('CarDetailCtrl', [ '$scope', 'Authentication', '$http', '$routeParams', 'FIREBASE_URL',
  function($scope, Authentication, $http, $routeParams, FIREBASE_URL) {

  	var make = $routeParams.make;
  	var model = $routeParams.model;
  	var year = $routeParams.year;
  	var userUid = $routeParams.uid;
  	var styleId;

	var responsePromise = $http.get("https://api.edmunds.com/api/vehicle/v2/"+make+"/"+model+"/"+year+"/styles?fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
	responsePromise.success(function(data, status, headers, config) {
			$scope.styles = data.styles;
			$scope.selectedStyle = data.styles[0];
			$scope.showDetails();
			$scope.showPictures();
			$scope.showReviews();

	});
	responsePromise.error(function(data, status, headers, config) {
		alert("AJAX failed!");
	});

	
	$scope.showDetails = function() {
		styleId = $scope.selectedStyle.id;
		var fullDetailsByStyleID = $http.get("https://api.edmunds.com/api/vehicle/v2/styles/"+styleId+"?view=full&fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
		fullDetailsByStyleID.success(function(data, status, headers, config) {
			$scope.vehicle = data;

		});
		fullDetailsByStyleID.error(function(data, status, headers, config) {
			alert("AJAX failed! - showDetails function");
		});

	} // end showDetails


	$scope.showPictures = function() {

		styleId = $scope.selectedStyle.id;
		var photoByStyleID = $http.get("https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId="+styleId+"&fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
		photoByStyleID.success(function(data, status, headers, config) {
			var array = data;
			var photoArray = { photoData: [] };
			//create new Array object in JS, pass that to view
			for (i = 0; i < array.length; i++) {

				var photoObject = array[i];

				var authors = "";
				for(j = 0; j < photoObject.authorNames.length; j++)
				{
					authors += photoObject.authorNames[j];
					if(j != 0 || j != photoObject.authorNames.length -1) authors += " | ";

				}

				var imageSrc = "https://media.ed.edmunds-media.com";
				for(j = 0; j < photoObject.photoSrcs.length; j++)
				{
					if( photoObject.photoSrcs[j].indexOf("_1600.jpg") > -1)
					{
						imageSrc += photoObject.photoSrcs[j];
					}

				}

			    photoArray.photoData.push({
			    	"subType" : photoObject.subType,
			    	"captionTranscript" : photoObject.captionTranscript,
			    	"authors": authors,
			    	"imageSrc": imageSrc
			    });

			    $scope.photoArray = photoArray.photoData;
			}
		});
		photoByStyleID.error(function(data, status, headers, config) {
			alert("AJAX failed! - showPictures function. Data: " + data);
		});
	} // end showPictures

	$scope.showReviews = function() {
		styleId = $scope.selectedStyle.id;
		$('#reviews-container').empty();

		var fireBaseReviews = new Firebase(FIREBASE_URL + "carReviews/" + styleId);
	    fireBaseReviews.on('child_added', function(snapshot) {
	        var uniqName = snapshot.key();
	        var reviewComm = snapshot.val().comment;
	        var reviewsContainer = $('#reviews-container');
	        var reviewUser = snapshot.val().regUser;


	        // get user profilepic and username
	        var regRef = new Firebase(FIREBASE_URL + "users/" + reviewUser);
	        console.log(FIREBASE_URL + "users/" + reviewUser);
	        var reviewUserName;
	        var reviewUserProfileImg;

	        regRef.on("value", function(snapshot) {
			  	reviewUserName = snapshot.val().username;
			  	reviewUserProfileImg = snapshot.val().profilePictureURL;

			  	$('<div/>', {class: 'col-sm-12 review'})
	            	.html('<img class="userReviewPic" src=" ' + reviewUserProfileImg + '"/><b>' + reviewUserName + '</b><br/> ' + reviewComm).appendTo(reviewsContainer);

	        	reviewsContainer.scrollTop(reviewsContainer.prop('scrollHeight'));
			}, function (errorObject) {
			  console.log("Fevied user Data could not be loaded: " + errorObject.code);
			});
	    });
	} // end showReviews

	$scope.addCarToFavorites = function() {
		console.log("Car added to favorites");
		styleId = $scope.selectedStyle.id;
		var fireBaseRef = new Firebase(FIREBASE_URL + "users/" + userUid + "/favoriteCars")
	        .child(styleId).set({
	            date: Firebase.ServerValue.TIMESTAMP,
	            styleId: styleId,
	            make: make,
	            model: model,
	            year: year
	        });
	} //end Add Car To Favorites

	$("#submit-btn").bind("click", function(e) {
		styleId = $scope.selectedStyle.id;
        var comment = $("#comments");
        var commentValue = $.trim(comment.val());

        if (commentValue.length === 0) {
            alert('Comments are required to continue!');
        } else {
            var fireBaseRef = new Firebase(FIREBASE_URL + "carReviews")
	        .child(styleId).push({
	            date: Firebase.ServerValue.TIMESTAMP,
	            regUser: userUid,
	            comment: commentValue

	        });

            comment.val("");
        }

        e.preventDefault();
        e.stopPropagation();
    });



}]); // End AppCtrl Controller 
