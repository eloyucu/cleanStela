var model		= require('../model/main_model');
var usersDB		= require('../model/model_user')(model.getUser());
var buildingDB	= require('../model/model_building')(model.getBuilding());
var fl_us_DB	= require('../model/model_flat_VS_user')(model.getFlatVSUser());
var msn_DB		= require('../model/model_msn')(model.getMessages());
var helper		= require('./helper/helper');



buildingDB.getBuilding("all", function(BU_results)
{
	var _ids_this_week = [];
	var _ids_next_week = [];
	for(var i in BU_results.result)
	{
		var new_clean_turn;
		var next_clean_turn;
		var idx_f = 0;
		for(idx_f=0; idx_f<BU_results.result[i].flats.length; idx_f++)
		{
			if(BU_results.result[i].cleanTurn == BU_results.result[i].flats[idx_f])
			{			
				new_clean_turn = BU_results.result[i].flats[(idx_f+1)%BU_results.result[i].flats.length];
				next_clean_turn = BU_results.result[i].flats[(idx_f+2)%BU_results.result[i].flats.length];
				_ids_this_week.push({$and:[{building_id:BU_results.result[i]._id}, {flat:new_clean_turn}]});
				_ids_next_week.push({$and:[{building_id:BU_results.result[i]._id}, {flat:next_clean_turn}]});
				buildingDB.updateBuilding({_id:BU_results.result[i]._id, cleanTurn:new_clean_turn},function(results){});
			}
		}
	}
	fl_us_DB.getFlatVsUser({ $or:_ids_this_week}, function(FL_US_results)
	{
		_ids_this_week = [];
		for(var i in FL_US_results.result)
			_ids_this_week.push({_id:FL_US_results.result[i].user_id});
		if(_ids_this_week.length>0)
			usersDB.getFieldsUser({ $or:_ids_this_week}, {email:1, _id:0}, function(US_results)
			{
				var emails="";
				for(email in US_results.result)
					if(email==0) emails = US_results.result[email].email;
					else emails += "," + US_results.result[email].email;
				console.log("esta semana: " + emails);
				helper.sendAnEmail(emails, "CleanStela: Semana de limpieza", "Mensaje enviado por la aplicación CleanStela", "Le recomendamos que visite nuestra aplicación web. ESTA SEAMANA es el turno de limpieza de alguna de sus viviendas."); 
			});
	});
	fl_us_DB.getFlatVsUser({ $or:_ids_next_week}, function(FL_US_results)
	{
		_ids_next_week = [];
		for(var i in FL_US_results.result)
			_ids_next_week.push({_id:FL_US_results.result[i].user_id});
		if(_ids_next_week.length>0)
			usersDB.getFieldsUser({ $or:_ids_next_week}, {email:1, _id:0}, function(US_results)
			{
				var emails="";
				for(email in US_results.result)
					if(email==0) emails = US_results.result[email].email;
					else emails += "," + US_results.result[email].email;
				console.log("próxima semana: " + emails);
				helper.sendAnEmail(emails, "CleanStela: Semana de limpieza", "Mensaje enviado por la aplicación CleanStela", "Le recomendamos que visite nuestra aplicación web. LA PRÓXIMA SEMANA será el turno de limpiezza de alguna de sus viviendas."); 
			});
	});
});