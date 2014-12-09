jQuery('document').ready(function()
{
	jQuery('.delete-building').on('click', function()
	{
		var buildings_id = jQuery(this).attr('data-building-id');
		makeTheRequest("POST", 'remove_building', "buildings_id=" +  JSON.stringify({buildings_id:buildings_id}), 'json', function(){jQuery("#remove-"+buildings_id).remove();}, onErrorGenericAJAX);
	});
	jQuery('#delete-building').on('click',function()
	{
		var buildings_id = [];
		jQuery('.data:checked').each(function()
		{
			buildings_id.push(jQuery(this).attr('data-building-id'));
		});
		if(buildings_id.length>0)
			makeTheRequest("POST", 'remove_building', "buildings_id=" + JSON.stringify({buildings_id:buildings_id}), 'json', function(data)
			{
				jQuery('#special').html("Esta es la data: " + JSON.stringify(data));
				for(var i=0; i<buildings_id.length; i++)
					jQuery("#remove-"+buildings_id[i]).remove();
			}, onErrorGenericAJAX);
		else
			jQuery('#myModal').modal();
	});
});