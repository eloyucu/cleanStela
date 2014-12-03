jQuery('document').ready(function()
{
	$('#myAlert').on('closed.bs.alert', function () {
		alert("HOLA");
	});
	jQuery('#accordion').collapse();
	jQuery('.upload').on('click', function()
	{
		var flats = [], cleanTurn="";
		var data_building_id = jQuery(this).attr('data-building-id');
		jQuery('#setup-' + data_building_id).find('.flat-value').each(function()
		{
			flats.push(jQuery(this).html());
		});
		flats.sort();
		if(flats.length >0)
		{
			cleanTurn="aaa&&&%%%111"
			jQuery('#setup-' + data_building_id).find('.cleanTurn').each(function()
			{
				if(jQuery(this).attr('class').indexOf('warning') != -1)
					cleanTurn = jQuery(this).find('.flat-value').html();
			});
		}
		var data = 'building={"flats":' + JSON.stringify(flats) + ',"_id":"' + data_building_id + '", "cleanTurn":"' + cleanTurn + '"}' ;
		//alert(data);
		if(cleanTurn!="aaa&&&%%%111") makeTheRequest('post', 'admin_buildings', data, 'json', onSuccessSignLog, onErrorGenericAJAX);
		else alert("Es necesario marcar una de las viviendas como el actual turno de limpieza");
	});
	jQuery('.setup-flat-adds').on('click', function()
	{
		var data_building_id = jQuery(this).attr('data-building-id');
		var number = jQuery('#number' + data_building_id).val();
		var letter = jQuery('#letter' + data_building_id).val();
		if(letter && number)
		{
			var setupTable = jQuery('#setup-' + data_building_id);
			setupTable.append(getCell(number+""+letter, data_building_id));
			setupTable.find('.no-flats').remove();
		}
	});
	jQuery('.setup-table').delegate('.setup-flat-substract', 'click', function()
	{
		jQuery(this).parent().parent().remove();
	});
	jQuery('.setup-table').delegate('.cleanTurn', 'click', function()
	{
		var _id = jQuery(this).attr('data-cleanTurn-building-id');
		jQuery('.cleanTurn.label-warning.'+_id).removeClass('label-warning').addClass('label-success');
		jQuery(this).removeClass('label-success').addClass('label-warning');
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
	jQuery('.user-select-flat').on('click', function()
	{
		var flatLabel = jQuery(this).children();
		var flat = flatLabel.find(':last-child');
		var func;
		if(flatLabel.attr('class').indexOf('label-success')!=-1) 
			func = "add";
		else if(flatLabel.attr('class').indexOf('label-warning')!=-1) 
			func = "substract";
			
		var data = 'flat=' + flat.html() + '&building_id=' + flat.attr('data-building-id') + '&func=' + func;
		makeTheRequest('post', 'choose_building', data, 'json', onSuccessSignLog, onErrorGenericAJAX);
		flatLabel.toggleClass('label-success').toggleClass('label-warning');
	});
	jQuery('.this-my-flat').each(function()
	{	
		jQuery('#'+jQuery(this).attr('data-this-my-flat')).removeClass("label-success").addClass("label-warning");
	});
	jQuery('.consult-clean-turn').each(function()
	{
		jQuery('#'+jQuery(this).attr('data-clean-turn')).removeClass("label-success").addClass("label-warning");
	});
});
function getCell(value, data_building_id)
{
	return '<div class="table-row search_hit left-float">'+
				'<div class="table-cell inline short selectable">'+
					'<span class="label label-success content-label cleanTurn ' + data_building_id + '" data-cleanTurn-building-id="' + data_building_id + '">'+
						'<span class="glyphicon glyphicon-home right-margin"></span>'+
						'<div class="flat-value inline">'+value+'</div>'+
					'</span>'+
				'</div>'+
				'<div class="table-cell inline input-group input-group-sm">'+
					'<button type="button" class="btn inline setup-flat-substract">'+
							'<span class="glyphicon glyphicon-minus">'+
					'</button>'+
				'</div>'+
			'</div>';
}
function onSuccessSignLog(data)
{
	jQuery('#special-content').html("aquí: " + JSON.stringify(data));
	/*if(data.error==1)
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
	}*/
}