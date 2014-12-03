var server = "https://"+window.location.host;

jQuery('document').ready(function()
{
	jQuery('.data').on('focus', function()
	{
		jQuery(this).parent().removeClass('has-error');
	});
	jQuery('#search_building').keyup(function()
	{
		var filter =jQuery(this).val().toLocaleLowerCase();
		jQuery('.search-container').each(function()
		{
			var coincidence = false;
			jQuery(this).find('.search-hit').each(function()
			{
				var str = jQuery(this).html().toLocaleLowerCase();
				if(str.indexOf(filter) != -1 && jQuery(this).attr('class').indexOf('not_search')== -1)
					coincidence=true;
			});
			if(coincidence)
			{
				jQuery(this).removeClass('hide');
				jQuery('#'+jQuery(this).attr('data-id_control')).removeClass('hide');
			}
			else
			{
				jQuery(this).addClass('hide');
				jQuery('#'+jQuery(this).attr('data-id_control')).addClass('hide');
			}
		});
	});
});
jQuery(window).load(function()
{
	makeTheMagellan();
});
jQuery(window).resize(function()
{
	makeTheMagellan();
});

function makeTheMagellan()
{
	var menu = $('#navbar-magellan');
	var menu_offset = menu.offset();
	// Cada vez que se haga scroll en la página
	// haremos un chequeo del estado del menú
	// y lo vamos a alternar entre 'fixed' y 'static'.
	$(window).on('scroll', function() 
	{
		if($(window).scrollTop() > menu_offset.top) 
		{
			menu.addClass('navbar-fixed-top');
			menu.removeClass('navbar-static-top');
		} 
		else 
		{
			menu.removeClass('navbar-fixed-top');
			menu.addClass('navbar-static-top');
		}
	});
}
function makeTheRequest(method, url, data, dataType, onSuccess, onError, onComplete)
{
	jQuery.ajax({
		method: method,//metodo|verbo con el que procesamos la peticion
		url: server + '/' + url,//url a la que hacemos la petición
		data: data,//datos del formulario
		dataType: dataType,
		success: onSuccess,
		error: onError,
		complete: onComplete
	});
}
function onErrorGenericAJAX(jqXHR, exception)
{
	alert("ERROR");
	for (var jqxr in jqXHR)
		console.log("jqXHR: " + jqxr);
	
	console.log("exception: " + exception);
}








