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

			var routeStyleid = $routeParams.styleid;

			if(typeof routeStyleid === 'undefined')
				$scope.selectedStyle = data.styles[0];
			else 
			{ // show the car with the style id specified in url
				for(var i=0; i<data.styles.length; i++)
				{
					if(routeStyleid == data.styles[i].id) $scope.selectedStyle = data.styles[i];
				}
			}

			$scope.showSummaryRatings();
			$scope.getEquipment();
			$scope.showDetails();
			$scope.showPictures();
			$scope.showReviews();
			$scope.hideArea = false;

	});
	responsePromise.error(function(data, status, headers, config) {
		alert("AJAX failed!");
	});

	
	$scope.showDetails = function() {
		$scope.hideArea = false;
		styleId = $scope.selectedStyle.id;
		var fullDetailsByStyleID = $http.get("https://api.edmunds.com/api/vehicle/v2/styles/"+styleId+"?view=full&fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
		fullDetailsByStyleID.success(function(data, status, headers, config) {
			$scope.vehicle = data;

		});
		fullDetailsByStyleID.error(function(data, status, headers, config) {
			alert("AJAX failed! - showDetails function");
		});

	} // end showDetails

	$scope.showSummaryRatings = function() {
		styleId = $scope.selectedStyle.id;
		var summaryRatings = $http.get("https://api.edmunds.com/api/vehicle/v2/styles/"+styleId+"/grade?fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
		summaryRatings.success(function(data, status, headers, config) {
			$scope.carRating = data;

		});
		summaryRatings.error(function(data, status, headers, config) {
			//alert("AJAX failed! - showSummaryRatings function");
			//console.log(data)
		});
	} //end showSummaryRatings

	$scope.getEquipment = function() {
		styleId = $scope.selectedStyle.id;
		var equipmentData = $http.get("https://api.edmunds.com/api/vehicle/v2/styles/"+styleId+"/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
		equipmentData.success(function(data, status, headers, config) {
			$scope.equipmentArray = data.equipment;

		});
		equipmentData.error(function(data, status, headers, config) {
			//alert("AJAX failed! - showSummaryRatings function");
			//console.log(data)
		});
	} //end showSummaryRatings

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
				//console.log(photoObject);
				var maxSize = 0;
				var srcEnd = "";
				for(j = 0; j < photoObject.photoSrcs.length; j++)
				{
					var st = photoObject.photoSrcs[j].lastIndexOf("_");
					var end = photoObject.photoSrcs[j].lastIndexOf(".jpg");
					var currSize = parseInt(photoObject.photoSrcs[j].substring(st+1, end));
					if( currSize > maxSize && currSize <= 1600)
					{
						maxSize = currSize;
						srcEnd = photoObject.photoSrcs[j];
					}
				}
				imageSrc += srcEnd;
				//console.log(maxSize + " - > " + imageSrc);

			    photoArray.photoData.push({
			    	"subType" : photoObject.subType,
			    	"captionTranscript" : photoObject.captionTranscript,
			    	"authors": authors,
			    	"imageSrc": imageSrc
			    });
			}

			$scope.photoArray = photoArray.photoData;
			console.log(photoArray);
			
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

	    	$scope.hideArea = true;

	        var uniqName = snapshot.key();
	        var reviewComm = snapshot.val().comment;
	        var reviewsContainer = $('#reviews-container');
	        var reviewUser = snapshot.val().regUser;
			
	        var timeReview = snapshot.val().date;
		  	var dateStr = new Date(timeReview).toLocaleString();

	        // get user profilepic and username
	        var regRef = new Firebase(FIREBASE_URL + "users/" + reviewUser);
	        //console.log(FIREBASE_URL + "users/" + reviewUser);
	        var reviewUserName;
	        var reviewUserProfileImg;
	        

	        regRef.on("value", function(snapshot) {
			  	reviewUserName = snapshot.val().username;
			  	reviewUserProfileImg = snapshot.val().profilePictureURL;

			  	$('<div/>', {class: 'col-sm-12'})
	            	.html('<div class="row review"><div class="col-sm-1"><img class="userReviewPic" src=" ' + reviewUserProfileImg + '"/><br/></div><div class="col-sm-11 reviewText"><br/><b>' + reviewUserName + '</b><br/>' + reviewComm + '<br/><span class="reviewTime">' + dateStr + '</span></div></div>').appendTo(reviewsContainer);

	        	reviewsContainer.scrollTop(reviewsContainer.prop('scrollHeight'));
			}, function (errorObject) {
			  console.log("Fevied user Data could not be loaded: " + errorObject.code);
			});
	    });
	} // end showReviews

	$scope.addCarToFavorites = function() {
		console.log("Car added to favorites");
		styleId = $scope.selectedStyle.id;
		var fireBaseRef = new Firebase(FIREBASE_URL + "favoriteCars/" + userUid)
	        .child(styleId).set({
	            date: Firebase.ServerValue.TIMESTAMP,
	            styleId: styleId,
	            styleName: $scope.selectedStyle.name,
	            make: make,
	            model: model,
	            year: year
	        });

	    notifyMe("This car was successfully added to your Favorite Cars List");

	} //end Add Car To Favorites

	$("#submit-btn").bind("click", function(e) {
		styleId = $scope.selectedStyle.id;
        var comment = $("#comments");
        var commentValue = $.trim(comment.val());
        
        if (commentValue.length === 0) {
            alert('Comments are required to continue!');
        } else {
        	$scope.hideArea = true;
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
