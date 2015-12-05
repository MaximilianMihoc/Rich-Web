

function hideSection() 
{ 
	var matches = countPattern();

    for (i = 0; i < matches; i++) 
    { 
	    var sectionOne = document.getElementsByTagName("section")[i];
		sectionOne.style.display='none';
	}
}

function countPattern()
{
    var matches = document.body.innerHTML.match(/<section/g);
    return matches ? matches.length : 0;
}

function removeLinks()
{
	var ary = document.getElementsByTagName("a");
	for (var i=ary.length-1; i >= 0; i--)
	{
	  ary[i].parentNode.removeChild(ary[i]);
	  //ary[i].onclick = function() {return(false);};
	}
}

function emphasiseDefeasible()
{
    if (window.find && window.getSelection) {
        document.designMode = "on";
        var sel = window.getSelection();
        sel.collapse(document.body, 0);

        while (window.find("defeasible reasoning")) {
            document.execCommand("HiliteColor", false, "yellow");
            document.execCommand("Bold", false, "");
            sel.collapseToEnd();
        }
        document.designMode = "off";
    } else if (document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        while (textRange.findText("defeasible")) {
            textRange.execCommand("BackColor", false, "yellow");
            //textRange.execCommand("Bold", false, null)
            textRange.collapse(false);
        }
    }
    document.designMode = "off";
}