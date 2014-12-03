var data_type;
var data_types =[];
data_types['new_user'] = "User name";
data_types['new_building'] = "Building";
jQuery('document').ready(function()
{
	jQuery('#sign_log_button').on('click', function()
	{
		data_type = jQuery(this).attr("data-type");
		var data = {};
		var fields = true;
		jQuery('.data').each(function(index)
		{
			if(jQuery(this).val())
				data[jQuery(this).attr('id')]= jQuery(this).val();
			else
			{
				jQuery(this).parent().addClass('has-error');
				fields = false;
			}
		});
		if(jQuery('#rol-select').length)
		{
			if(jQuery('#rol-select').children('.active').children('input').attr('data-value') == undefined)
				fields=false;
			else
				data['rol'] = jQuery('#rol-select').children('.active').children('input').attr('data-value');
		}
		if(jQuery('#lang').length)
		{
			if(jQuery('#lang').children('.active').children('input').attr('data-value') == undefined)
				fields=false;
			else
				data['lang'] = jQuery('#lang').children('.active').children('input').attr('data-value');
		}
		if(fields)
			makeTheRequest('POST', data_type, data_type + "=" + JSON.stringify(data) , 'json', onSuccessSignLog, onErrorGenericAJAX);
		else
			jQuery('#not-input').removeClass('hide');
	});
	jQuery('.rol-select-class').on('change', function()
	{
		jQuery('#rol').val(jQuery(this).attr('id'));
	});
});


function onSuccessSignLog(data)
{
	if(data.error==1)
	{
		if(data.result.name=="MongoError" && data.result.code==11000)
		{
			jQuery('#name').parent().addClass('has-error');
			alert(data_types[data_type] + " is registered.");
		}
		else if(data.result.name=="ValidationError")
		{
			for(var key in data.result.errors)
				jQuery('#'+key).parent().addClass('has-error');
			alert("Please check all the fields of the form.");
		}
		else
			alert(JSON.stringify(data));
	}
	else
	{
		if(data.go)
			window.location.href = server+data.go;
		else
			alert("Nombre y contraseña no coinciden");
	}
}
