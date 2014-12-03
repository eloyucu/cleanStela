jQuery('document').ready(function()
{
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
			if(coincidence) jQuery(this).show();
			else jQuery(this).hide();
		});
	});
	jQuery('.upload').on('click', function()
	{
		var flats = [];
		var data_building_id = jQuery(this).attr('data-building-id');
		jQuery('#setup-' + data_building_id).find('.flat-value').each(function()
		{
			flats.push(jQuery(this).html());
		});
		flats.sort();
		/*jQuery('#especial-test').html('building={"flats":"[' + flats + ']","_id":"' + data_building_id + '"}');
		var obj = JSON.parse('{"flats":"[' + flats + ']","_id":"' + data_building_id + '"}');
		for (var x=0;x<obj.flats.length;x++)
			console.log("El elemento " + x + " del array flat es: " + obj.flats[x]);*/
		makeTheRequest('post', 'admin_buildings', 'building={"flats":"[' + flats + ']","_id":"' + data_building_id + '"}' , 'json', onSuccessSignLog, onErrorGenericAJAX);
	});
	jQuery('.setup-flat-adds').on('click', function()
	{
		var data_building_id = jQuery(this).attr('data-building-id');
		var number = jQuery('#number' + data_building_id).val();
		var letter = jQuery('#letter' + data_building_id).val();
		var setupTable = jQuery('#setup-' + data_building_id);
		setupTable.append(getCell(number+""+letter));
		setupTable.find('.no-flats').remove();
	});
	jQuery('.setup-table').delegate('.setup-flat-substract', 'click', function()
	{
		jQuery(this).parent().parent().remove();
	});
	jQuery('.flat-type-control-letter').keyup(function(event)
	{
		if(!jQuery(this).val().match(/^[a-zA-Z]+$/))
			jQuery(this).val('');
	});
	jQuery('.flat-type-control-number').keyup(function(event)
	{
		if(!jQuery(this).val().match(/^[0-9]+$/))
			jQuery(this).val('');
	});
	jQuery('#accordion').collapse()
});
function getCell(value)
{
	return '<div class="table-row search_hit">'+
				'<div class="table-cell inline short">'+
					'<span class="label label-success content-label">'+
						'<span class="glyphicon glyphicon-home right-margin"></span>'+
						'<div class="flat-value inline">'+value+'</div>'+
					'</span>'+
				'</div>'+
				'<div style="display: table-cell;" class="inline input-group input-group-sm">'+
					'<button type="button" class="btn btn-info inline setup-flat-substract">'+
							'<span class="glyphicon glyphicon-minus">'+
					'</button>'+
				'</div>'+
			'</div>';
}
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
			alert(data);
	}
}