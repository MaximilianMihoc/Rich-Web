mainManager.controller('CarDetailCtrl', [ '$scope', 'Authentication', '$http', '$routeParams', 'FIREBASE_URL',
  function($scope, Authentication, $http, $routeParams, FIREBASE_URL) {

  	var make = $routeParams.make;
  	var model = $routeParams.model;
  	var year = $routeParams.year;
  	var userUid = $routeParams.uid;
  	var styleId;
  	
  	/* http request to the user API to get styles informations about a car using the make, model and year parameters passed as routeParameters.
	Each car has many styles but each style has a unique ID in the system. This id is in the center of Edmunds Database and can be 
	used to retrieve many things about a specific car. This id will be used in many other http requests.
  	 */
	var responsePromise = $http.get("https://api.edmunds.com/api/vehicle/v2/"+make+"/"+model+"/"+year+"/styles?fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
	responsePromise.success(function(data, status, headers, config) {
			$scope.styles = data.styles;

			/* When a user wants to see var details, by pressing the buttons from the favorite cars list, a style id parameter is passed
			in the route provider so that the correct car style information will be displayed in page. When this styleID does not exist in the 
			routeParameters, it means that the car details were accessed from the search page and the first style is displaye.*/
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

	/* the next function is used to bet vehicle informations from the API using the style id. 
	The information retrieved in this function are: engine details, transmission, price, options.

	The style id is retrieved from the 
	view based on the selected style from the select box. */
	$scope.showDetails = function() {
		$scope.hideArea = false;
		styleId = $scope.selectedStyle.id;
		var fullDetailsByStyleID = $http.get("https://api.edmunds.com/api/vehicle/v2/styles/"+styleId+"?view=full&fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
		/* on success, data is passed to the view through Scope and then it is rendered into the view using Angularjs. */
		fullDetailsByStyleID.success(function(data, status, headers, config) {
			$scope.vehicle = data;

		});
		fullDetailsByStyleID.error(function(data, status, headers, config) {
			alert("AJAX failed! - showDetails function");
		});

	} // end showDetails

	/*in this section, styleid is used again to get car summary details about a car and then rendered in the view with Angularjs.*/
	$scope.showSummaryRatings = function() {
		styleId = $scope.selectedStyle.id;
		var summaryRatings = $http.get("https://api.edmunds.com/api/vehicle/v2/styles/"+styleId+"/grade?fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
		summaryRatings.success(function(data, status, headers, config) {
			$scope.carRating = data;

		});
		summaryRatings.error(function(data, status, headers, config) {
			alert("AJAX failed! - showSummaryRatings function");
			//console.log(data)
		});
	} //end showSummaryRatings

	/* http request to get equipment information displayed in the equipment modal. */
	$scope.getEquipment = function() {
		styleId = $scope.selectedStyle.id;
		var equipmentData = $http.get("https://api.edmunds.com/api/vehicle/v2/styles/"+styleId+"/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
		equipmentData.success(function(data, status, headers, config) {
			$scope.equipmentArray = data.equipment;

		});
		equipmentData.error(function(data, status, headers, config) {
			alert("AJAX failed! - showSummaryRatings function");
			//console.log(data)
		});
	} //end showSummaryRatings

	/* http requests to get pictures data from the API. This is a MEDIA API which only has media information like pictures. */
	$scope.showPictures = function() {

		styleId = $scope.selectedStyle.id;
		var photoByStyleID = $http.get("https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId="+styleId+"&fmt=json&api_key=ab98zx7k6u2byxyt77rsunu6");
	
		/*The Media API has many pictures for the same car in many different sizes. Because I only want one size of the same picture
		I need to create a new JSON array to store picture src abd other information. */
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

				/*	the size of a picture is always storer at the end of the src. To get only one picture, at a good clarity, I chosed to get 
				the maximum size that exists, but not greater than 1600 pixels - it will take too much time to load. */
				/* in the next section, a maximum is calculated for the sizes and in most of the cases it will be 1600. this algorithm was required 
				because there are cases when some cars do not have very big pictures. */
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

				/*picture information stored in a custom object which will be later passed to the view for display.*/
			    photoArray.photoData.push({
			    	"subType" : photoObject.subType,
			    	"captionTranscript" : photoObject.captionTranscript,
			    	"authors": authors,
			    	"imageSrc": imageSrc
			    });
			}

			/* pass pictures informations to the view in order to be displayed. */
			$scope.photoArray = photoArray.photoData;
			console.log(photoArray);
			
		});
		photoByStyleID.error(function(data, status, headers, config) {
			alert("AJAX failed! - showPictures function. Data: " + data);
		});
	} // end showPictures

	/* this function has 2 http requests to firebase to get the reviews for a specfic car, if they exist, and display them into the review section of the page.*/
	$scope.showReviews = function() {
		styleId = $scope.selectedStyle.id;
		$('#reviews-container').empty();

		//first request is made to get the users id and the comments made by them to a specific car. StypeID used in firebase to find details about a car. Style id is unique and it is a good idea to use it in my app as a unique field.
		var fireBaseReviews = new Firebase(FIREBASE_URL + "carReviews/" + styleId);
	    fireBaseReviews.on('child_added', function(snapshot) {

	    	$scope.hideArea = true;

	        var uniqName = snapshot.key();
	        var reviewComm = snapshot.val().comment;
	        var reviewsContainer = $('#reviews-container');
	        var reviewUser = snapshot.val().regUser;
			
	        var timeReview = snapshot.val().date;
		  	var dateStr = new Date(timeReview).toLocaleString();

	        
	        var regRef = new Firebase(FIREBASE_URL + "users/" + reviewUser);
	        //console.log(FIREBASE_URL + "users/" + reviewUser);
	        var reviewUserName;
	        var reviewUserProfileImg;
	        
	        // second http request to get user profilepic and username based on the UID stored in the review.
	        regRef.on("value", function(snapshot) {
			  	reviewUserName = snapshot.val().username;
			  	reviewUserProfileImg = snapshot.val().profilePictureURL;

			  	/* after user information has been retrieved, the review is posted to the view in the reviews container.*/
			  	$('<div/>', {class: 'col-sm-12'})
	            	.html('<div class="row review"><div class="col-sm-1"><img class="userReviewPic" src=" ' + reviewUserProfileImg + '"/><br/></div><div class="col-sm-11 reviewText"><br/><b>' + reviewUserName + '</b><br/>' + reviewComm + '<br/><span class="reviewTime">' + dateStr + '</span></div></div>').appendTo(reviewsContainer);

	        	reviewsContainer.scrollTop(reviewsContainer.prop('scrollHeight'));
			}, function (errorObject) {
			  console.log("Fevied user Data could not be loaded: " + errorObject.code);
			});
	    });
	} // end showReviews

	/* function used to add a car to favorites when the button is clicked. 
	A new object created in firebase called (favorite cars) was created. when a user adds a car to favorite, userid and style id are used to store information in the database which will be later displayed in the view. */
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
	    // when user adds a car to his/hers favorite list, a notification is created. 
	    notifyMe("This car was successfully added to your Favorite Cars List");

	} //end Add Car To Favorites

	/* After the user writes a review and the submit button is clicked, the review is stored in firebase database under the carReviews object. 
	every car is identified by the styleid and every review is identified by the user id. So a car can have different reviews from different users. 
	If a user writes a review, that can be seen in real time by another user logged in in another instance of the application.*/
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
