	

var getXmlHttp = function()
{
	var xmlhttp;
	try
	{
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (e)
	{
		try
		{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (E)
		{
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined')
	{
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback )
            {
                window.setTimeout(callback, 1000 / 60);
            };
})();

Array.prototype.clone = function()
{
    return this.slice(0);
}

Array.prototype.equals = function (array)
{
    if (!array) return false;

    if (this.length != array.length) return false;

    for (var i = 0, l=this.length; i < l; i++)
    {
        if (this[i] instanceof Array && array[i] instanceof Array)
        {
            if (!this[i].equals(array[i])) return false;
        }

        else if (this[i] != array[i])
        {
            return false;
        }
    }
    return true;
}







