var router 		= require('express').Router();
var model		= require('../model/main_model');
var buildingDB	= require('../model/model_building')(model.getBuilding());
var fl_us_DB	= require('../model/model_flat_VS_user')(model.getFlatVSUser());

router.get('/my_buildings', function(req, res)
{
	if(req.session && req.session.user)
	{
		fl_us_DB.getFlatVsUser({user_id:req.session.user._id}, function(FL_US_results)
		{
			var _ids = []
			for(var i in FL_US_results.result)
				_ids.push({_id:FL_US_results.result[i].building_id});
			buildingDB.getBuilding({ $or:_ids}, function(BU_results)
			{
				var buildings = [];
				for(var fl_us in FL_US_results.result)
				{
					for(var building in BU_results.result)
					{
						if(''+FL_US_results.result[fl_us].building_id == ''+BU_results.result[building]._id)
						{
							var calendars = [];
							var actualTurn, userTurn, turn;
						
							var flats = BU_results.result[building].flats;
							for(var i=0; i<flats.length; i++)
							{
								if(flats[i] == BU_results.result[building].cleanTurn) 	actualTurn = i;
								if(flats[i] == FL_US_results.result[fl_us].flat) 		userTurn   = i;
							}
							if(userTurn>actualTurn) 	 turn = userTurn - actualTurn;
							else if(userTurn<actualTurn) turn = flats.length - actualTurn + userTurn;
							else turn = 0;
							
							
							var date 		 	= addDaysAtDate(turn*7);
							var clean_month		= changeMonthDate(date.getMonth());
							var total_days		= amount_month(date.getMonth()+1,date.getUTCFullYear());
							var first_day_clean	= date.getDate()-((date.getDay()+6)%7);
							var day_start_month = (7-(first_day_clean%7)+1)%7;
							var end_day_clean	= first_day_clean+6;
							
	
							var actual_month	= {clean_month:		clean_month,
													totalDays: 		total_days, 
													weekStart:		day_start_month, 
													firstdayClean:	first_day_clean, 
													enddayClean:	end_day_clean};
						
							if(first_day_clean<0)
							{
								date = new Date(""+date.getFullYear(), ""+(date.getMonth()-1), "1");
								clean_month			= changeMonthDate(date.getMonth());
								total_days			= amount_month(date.getMonth()+1,date.getUTCFullYear());
								day_start_month     = (date.getDay()+6)%7;
								date 				= addDaysAtDate(total_days-1, date);
								first_day_clean		= date.getDate()-((date.getDay()+6)%7);
																
								var previous_month	= {clean_month:		clean_month,
														totalDays: 		total_days, 
														weekStart:		day_start_month, 
														firstdayClean:	first_day_clean, 
														enddayClean:	total_days};
														
								calendars.push(previous_month);
								calendars.push(actual_month);
							}
							else if(first_day_clean+6 > total_days)
							{
								actual_month.enddayClean = total_days;
														
								date = new Date(""+date.getFullYear(), ""+(date.getMonth()+1), "1");
								clean_month			= changeMonthDate(date.getMonth());
								total_days			= amount_month(date.getMonth()+1,date.getUTCFullYear());
								day_start_month     = (date.getDay()+6)%7;
								first_day_clean 	= 1;
								end_day_clean 		= 7 - 1 - (((date.getDay()+6)%7)-1);
								
								
								var next_month	= {clean_month:		clean_month,
														totalDays: 		total_days, 
														weekStart:		day_start_month, 
														firstdayClean:	first_day_clean, 
														enddayClean:	end_day_clean};
								
								calendars.push(actual_month);
								calendars.push(next_month);
							}
							else
								calendars.push(actual_month);
								
								
							var _building 		= {address: BU_results.result[building].address[0]};
							_building._id		= BU_results.result[building]._id;
							_building.calendars = calendars;
							_building.flat		= FL_US_results.result[fl_us].flat;
							buildings.push(_building);
						}
					}
				}
				date = new Date();
				res.render('usersflats/calendar', {title:"ACCEDER", buildings:buildings, date:{day:date.getDate(), month:changeMonthDate(date.getMonth())}, user: req.session.user});

			});
		});
	}
	else	res.render('users/loggin', {title:"ACCEDER"});
});

router.get('/choose_building', function(req, res)
{
	if(req.session && req.session.user)
		buildingDB.getBuilding('all', function(buildingResults)
		{	
			if(buildingResults.error==1 || buildingResults.result.length==0) res.render('resource_not_found');
			else
			{
				fl_us_DB.getFieldsFlatVsUser({user_id:req.session.user._id}, {building_id:1, flat:1}, function(userResults)
				{
					res.render('buildings/choose_building', {title:"Edificios por su cuenta.", subtitle:"Puede agregar o eliminar los pisos a su cuenta personal.", infotext:"Haga clic sobre uno de los bloques de un edificio para seleccionar el nuevo edificio a su cuenta.", user:req.session.user, buildings: buildingResults.result, userFlats:userResults.result});
				});
			}
		});
	else	res.render('users/loggin', {title:"ACCEDER"});
});

router.post('/choose_building', function(req, res)
{
	if(req.session && req.session.user)
	{
		if(req.body.func=='add') //añade un piso a las propiedades del usuario
		{
			fl_us_DB.insertNewFlatVsUser({building_id:req.body.building_id, user_id:req.session.user._id,flat:req.body.flat}, function(results)
			{
				res.send(results);
			});
		}
		else if(req.body.func=='substract') //elimina un piso que el usuario haya añadido anteriormente
		{
			fl_us_DB.removeFlatVsUser({building_id:req.body.building_id, user_id:req.session.user._id, flat:req.body.flat}, function(results)
			{
				res.send(results);
			});
		}	
		res.send({success:1, error:0, result:'arreu'})
	}
	else	res.render('users/loggin', {title:"ACCEDER"});
});

module.exports = router;

function addDaysAtDate(days, date)
{
	if(!date) date = new Date();
	day   		 = date.getDate();
	month 		 = date.getMonth()+1;
	year  		 = date.getFullYear();
	time  		 = date.getTime();
	milisegundos = parseInt(days*24*60*60*1000);
	date.setTime(time+milisegundos);
	return date;
}
function changeMonthDate(month)
{
	switch(month)
	{
		case  0: 
		case 12: return 'Enero';
		case  1: return 'Febrero';
		case  2: return 'Marzo';
		case  3: return 'Abril';
		case  4: return 'Mayo';
		case  5: return 'Junio';
		case  6: return 'Julio';
		case  7: return 'Agosto';
		case  8: return 'Septiembre';
		case  9: return 'Octubre';
		case 10: return 'Noviembre';
		case 11: 
		case -1: return 'Diciembre';
	}
}

function amount_month(month,year)
{
    /*
        Los meses 1,3,5,7,8,10,12 siempre tienen 31 días //Los meses 0 y 13 son respectivamente Diciembre del año anterior o Enero del próximo año.
        Los meses 4,6,9,11 siempre tienen 30 días
        El único problema es el mes de febrero dependiendo del año puede tener 28 o 29 días
    */
    if( (month == 0) || (month == 13) || (month == 1) || (month == 3) || (month == 5) || (month == 7) || (month == 8) || (month == 10) || (month == 12) ) 
        return 31;
    else if( (month == 4) || (month == 6) || (month == 9) || (month == 11) ) 
        return 30;
    else if( month == 2 )
    {
        if( (year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0) )
            return 29;
        else
            return 28;
    }      
}