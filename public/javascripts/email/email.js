var ocuppy = true;
jQuery('document').ready(function()
{	
	jQuery('[data-toggle="tooltip"]').tooltip();
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
		jQuery('#responseModal').modal();
		//jQuery('#response').addClass('ocuppy-all');
		jQuery('#answer_to_response').attr('value',jQuery(this).attr('data-msn-id'));
	});
	jQuery('.vote-favor').on('click', function()
	{
		jQuery('#votesModal').modal();
	});
	jQuery('.vote-against').on('click', function()
	{
		jQuery('#votesModal').modal();
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
	jQuery('.show_messages').on('click', function()
	{
		var id = jQuery(this).attr('data-msn-id');
		jQuery('#'+id).toggle(500);
		var hide_show = jQuery(this).attr('data-msn-hide-show');
		jQuery(this).attr('data-msn-hide-show', jQuery(this).html());
		jQuery(this).html(hide_show);
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