var ocuppy = true;
jQuery('document').ready(function()
{
	jQuery('#send_the_mail').on('click', function()
	{
		data_type  = jQuery(this).attr("data-type");
		var data   = {};
		var fields = true;
		jQuery('.data').each(function(index)
		{
			if(jQuery(this).val())
				data[jQuery(this).attr('id')]=jQuery(this).val();
			else
			{
				jQuery(this).parent().addClass('has-error');
				fields = false;
			}
		});
		alert(JSON.stringify(data));
		//if(fields)
			//makeTheRequest('POST', jQuery(this).attr("data-base-type") + "/" + data_type, data_type + "=" + JSON.stringify(data) , 'json', onSuccessSend, onErrorGenericAJAX);
		//else
			//alert("Please check all the fields of the form.");
	});
	jQuery('.response').on('click', function()
	{
		jQuery('#response').removeClass('hide');
		//jQuery('#response').addClass('ocuppy-all');
		jQuery('#answer_to_response').attr('value',jQuery(this).attr('data-msn-id'));
	});
	jQuery('.ocuppy-all').on('click', function()
	{
		if(ocuppy)
			jQuery(this).addClass('hide');
		ocuppy = true;
	});
	jQuery('.form-ocuppy-all').on('click', function()
	{
		ocuppy = false;
	});
});
function onSuccessSend(data)
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
		
	}
}