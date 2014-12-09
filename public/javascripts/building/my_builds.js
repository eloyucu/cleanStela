jQuery('document').ready(function()
{
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
		//alert(admin_buildings);
		if(cleanTurn!="aaa&&&%%%111") makeTheRequest('POST', 'admin_buildings', data, 'json', onSuccessUpdate, onErrorGenericAJAX);
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
	jQuery('.data').focusout(function()
	{	
		jQuery(this).val(makeCapitalFirstLetter(jQuery(this).val()));
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
function onSuccessUpdate(data)
{
	if(data.error==1)
	{
		jQuery('#errorModal_p').html(JSON.stringify(data));
		jQuery('#errorModal').modal();
	}
	else
		jQuery('#successModal').modal();
}
function onSuccessSignLog(data)
{
}

function makeCapitalFirstLetter(string)
{
	var arrayWords;
	var returnString = "";
	var len;
	arrayWords = string.split(" ");
	len = arrayWords.length;
	for(i=0;i < len ;i++)
		if(i != (len-1))
			returnString = returnString+ucFirst(arrayWords[i])+" ";
		else
			returnString = returnString+ucFirst(arrayWords[i]);
			
	return returnString;
}
function ucFirst(string)
{
	return string.substr(0,1).toUpperCase()+string.substr(1,string.length).toLowerCase();
}