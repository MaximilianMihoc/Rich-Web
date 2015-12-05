$(document).ready(function() {

	$('a').css('font-style', 'italic');

	/*$.get('file_to_read.txt', function(data) 
	{
	   $('section').append(data);

	}, 'text');*/


});

function uploadFile()  //with ajax
{
	//upload Right Eye drawing
	resetDrawing();

	var myUrl = "file_to_read.txt";
	$.ajax({
		url: myUrl,
		dataType: 'text',
		async: false,
		success: function(data)
		{
			if(data) //check if there is data to be uploaded
			{
				$('section').append(data);
			}
		},
		error: function()
		{

		}
	});
}