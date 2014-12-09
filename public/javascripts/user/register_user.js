jQuery('document').ready(function()
{
	jQuery('.remove').on('click', function()//(parent, object, type)
	{
		var object =  jQuery(this);
		var data = '{"'+object.attr('data-section')+'":[';
		var parent  = object.parent().parent().parent().parent();
		var id_to_update = {id:object.parent().parent().parent().attr('id'), method:"delete"};
		var find = false;
		parent.children().not("#"+id_to_update.id).each(function()
		{
			find = true;
			if(jQuery(this).attr('data-object') !== undefined)
				data 	+= jQuery(this).attr('data-object')+ ",";
		});
		if(find) data = data.substring(0, data.length-1)
		data += ']}';
		//data =data.replace(/\"/g,'"');
		jQuery('#special-container').append(data);
		jQuery('#special-container').append(" EStees el id a actualizar: " + id_to_update);
		makeTheRequest("POST", 'users', "param=" + data, 'json', function(){jQuery("#"+id_to_update).remove();}, onErrorGenericAJAX);
	});
	jQuery('.modify').on('click',function()
	{
		var register_user_type = jQuery(this).attr('data-section');
		jQuery('#'+register_user_type).removeClass('hide');
		jQuery('#'+register_user_type).addClass('show');
		
		object = jQuery(this).parent().parent().parent().attr('data-object');
		object = JSON.parse(object);
		var value;
		jQuery('#'+register_user_type).find('input').each(function()
		{
			if((value=object[jQuery(this).attr("id")]))
			{
				jQuery(this).val(value);
				jQuery(this).html(value);
			}
		});
	});
	jQuery('.new_data_user').on('click', function()
	{
		var register_user_type = jQuery(this).attr('data-section');
		jQuery('#'+register_user_type).removeClass('hide');
		jQuery('#'+register_user_type).addClass('show');
	});
	jQuery('.cancel_new').on('click', function()
	{
		var register_user_type = jQuery(this).attr('data-section');
		jQuery('#'+register_user_type).removeClass('show');
		jQuery('#'+register_user_type).addClass('hide');
	});
	jQuery('.new_one_data').on('click', function()
	{	
		var fields = true;
		var type = jQuery(this).attr('data-section');
		var param = '{"' + type.split('new-')[1] + '":{';
		jQuery("#"+type+ " form").find("input").each(function()
		{
			if(jQuery(this).val() && jQuery(this).attr('id'))
				param+= '"' + jQuery(this).attr('id') +'":"'+ jQuery(this).val()+'",';
			else if(jQuery(this).prop('required'))
			{
				jQuery(this).parent().addClass('has-error');
				fields = false;
			}
		});
		if(fields)
		{
			param = param.substring(0, param.length-1) + '}}';
			jQuery("#"+type).removeClass('show');
			jQuery("#"+type).addClass('hide');
			makeTheRequest('PUT', 'users', "param=" + param, 'json', onSuccessSignLog, onErrorGenericAJAX);
		}
		else
			alert("Please check all the fields of the form.");
		jQuery('#special-container').append(param);

	});
});

function modifyAddress(parent)
{
	alert("address");
}
function modifyTelephones(parent)
{
	alert("telephones");
}
function modifyEmails(parent)
{
	alert("emails");
}
function onSuccessSignLog(data)
{
	if(data.error==1)
	{
		if(data.result.name=="MongoError" && data.result.code==11000)
		{
			jQuery('#user_name').parent().addClass('has-error');
			alert("User name is registered.");
		}
		else if(data.result.name=="ValidationError")
		{
			for(var key in data.result.errors)
				jQuery('#'+key).parent().addClass('has-error');
			alert("Please check all the fields of the form.");
		}
		else
			alert(JSON.stringify(data.result));
	}
	else
		jQuery('#special-container').append(JSON.stringify(data));
}


