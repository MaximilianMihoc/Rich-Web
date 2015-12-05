/* Function used to hide elements from the page when the load process is finished. */
function hideContent ()
{
	var ditExtend = document.getElementById('ditExtend');
	ditExtend.style.display = 'none';

	var ditEducation = document.getElementById("ditEducationExtend");
	ditEducation.style.display = 'none';

	var ocucoExtent = document.getElementById("ocucoExtend");
	ocucoExtent.style.display = 'none';

}	

/* Function used to toggle elements from the page when the user clicks a button. It takes the button
   element as parameter and if will toggle an area based on the id of the button. Knowing the button Id
    I know what area to be toggled. */
function toggleElement(buttonPressed)
{
	var buttonId = buttonPressed.id;
	var butonText = buttonPressed.firstChild.data;
	var blockToToggle;

	// Checks what area needs to be toggled based o button Id
	if(buttonId == "moreDITbutton")
		blockToToggle = document.getElementById('ditExtend');
	if(buttonId == "moreOcucoInfo")
		blockToToggle = document.getElementById('ocucoExtend');
	if(buttonId == "moreditExp")
		blockToToggle = document.getElementById('ditEducationExtend');

	/* Value of the button changes when clicked. 
	   More - show extra content - change value to Less
	   Less - hide extra content - change value back to More.
	*/
	if(butonText == "More")
	{
		blockToToggle.style.display = 'block';
		buttonPressed.firstChild.data = "Less"
	}
	else
	{
		blockToToggle.style.display = 'none';
		buttonPressed.firstChild.data = "More"
	}
	
}

// Skills image animation on mouse over
var speed = 5;
var stopIt = 0;
var animation = 1;

// function used to define the initial states of the images that are going to have a shake animation
// when the mouse is over them.
function initialState(which)
{
	stopIt = 0;
	vibrate = which;
	vibrate.style.left = 0;
	vibrate.style.top = 0;
}

/* Function used to shake skills images. */
function shakeImage()
{
	if ( (!document.all && !document.getElementById) || stopIt == 1)
		return;
	if ( animation == 1)
	{
		vibrate.style.top = parseInt(vibrate.style.top) + speed + "px";
	}
	else if ( animation == 2)
	{
		vibrate.style.left = parseInt(vibrate.style.left) + speed + "px";
	}
	else if ( animation == 3)
	{
		vibrate.style.top = parseInt(vibrate.style.top) - speed + "px";
	}
	else
	{
		vibrate.style.left = parseInt(vibrate.style.left) - speed + "px";
	}

	if ( animation < 4)
		animation++;
	else
		animation = 1;

	setTimeout("shakeImage()", 50);
}

/* function used on mouse out of the image to stop the shaking. */
function stopShacking(which) 
{
	stopIt = 1
	which.style.left = 0
	which.style.top = 0
}

/* Function to update the Time and Date from the top right corner of the page. */
function getTodayDate()
{ 
	 var apm = "";
	 var today = new Date();
	 var dd = today.getDate();
	 var mm = today.getMonth() + 1; //January is 0!
	 var yyyy = today.getFullYear();
	 var hour = today.getHours();
     var minute = today.getMinutes();
     var second = today.getSeconds();

	if (hour < 12) {
        apm = "am";
    } else {
        apm = "pm";
    }

    //if (hour == 0) hour = 12;
    //if (hour > 12) hour = hour - 12;

    dd = addZeroInFront(dd);
	mm = addZeroInFront(mm);
	hour = addZeroInFront(hour);
	minute = addZeroInFront(minute);
	second = addZeroInFront(second);

	today = hour + ':' + minute + ':' + second + apm + ' ' + dd + '-' + mm + '-' + yyyy;
	document.getElementById("todayDt").textContent = today;

}

/* Function that adds a 0 in front of the numbers when they are smaller than 10. */
function addZeroInFront(temp) 
{
    if (temp < 10) temp = "0" + temp;
    return temp;
}

// This is used to update the div containing Time date informations every 1000 miliseconds. 
// Calls the function one time per second. 
setInterval(getTodayDate, 1000);
