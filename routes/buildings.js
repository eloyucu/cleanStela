var router 		= require('express').Router();
var model		= require('../model/main_model');
var fl_us_DB	= require('../model/model_flat_VS_user')(model.getFlatVSUser());
var buildingDB	= require('../model/model_building')(model.getBuilding());


router.get('/new_building', function(req, res)
{
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra")) res.render('buildings/new_building', {title:"WELLCOME", user:req.session.user});
	else if(req.session.user) res.render('not_allowed', {title:"ACCEDER", user:req.session.user});
	else res.render('users/loggin', {title:"ACCEDER"});
});
router.get('/admin_buildings', function(req, res)
{
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra"))
	{
		buildingDB.getBuilding({admin_id:req.session.user._id}, function(results)
		{
			if(results.error==1 || results.result.length==0) res.render('resource_not_found', {user:req.session.user});
			else res.render('buildings/admin_buildings', {title:"Administra tus edificios.", user:req.session.user, buildings: results.result});
		});
	}
	else if(req.session.user) res.render('not_allowed', {title:"ACCEDER", user:req.session.user});
	else res.render('users/loggin', {title:"ACCEDER"});
});
router.get('/remove_building', function(req, res)
{
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra"))
	{
		buildingDB.getBuilding({admin_id:req.session.user._id}, function(results)
		{
			if(results.error==1 || results.result.length==0) res.render('resource_not_found', {user:req.session.user});
			else res.render('buildings/remove_building', {title:"Elimina tus edificios.", user:req.session.user, buildings: results.result});
		});
	}
	else if(req.session.user) res.render('not_allowed', {title:"ACCEDER", user:req.session.user});
	else res.render('users/loggin', {title:"ACCEDER"});
});
router.post('/new_building', function(req, res)
{
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra") && req.body.address && req.body.city && req.body.ZIP_code && req.body.province && req.body.state)
	{
		var building = {}, address = {};
		address.address 	=  req.body.address;
		address.city 		=  req.body.city;
		address.ZIP_code 	=  req.body.ZIP_code;
		address.province 	=  req.body.province;
		address.state 		=  req.body.state;
		building.address 	=  address;
		building.admin_id 	=  req.session.user._id;
		buildingDB.insertNewBuilding(building, function(results)
		{
			if(results.success==1 && results.result.length>0)
				res.redirect("admin_buildings");
			else if(results.error==1)
			{
				if(results.result.code==11000)
				{
					res.render('buildings/new_building', {title:"WELLCOME", user:req.session.user, building_registered:true});
				}
				else res.render('something_wrong');
			}
			else res.render('something_wrong');
		});
	}
	else if(req.session.user) res.render('not_allowed', {title:"ACCEDER", user:req.session.user});
	else res.render('users/loggin', {title:"ACCEDER"});
});
router.post('/admin_buildings', function(req, res)
{
	var building = req.body.building;
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra") && building)
	{
		buildingDB.updateBuilding(JSON.parse(building), function(results)
		{
			if(results.length>0)
			{
				results.go = "/admin_buildings/user";
				res.send(results);
			}
			else
				res.send(results);
		});
	}
	else	res.send({access:"No allowed", success:0, error:1});
});
router.post('/remove_building', function(req, res)
{
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra") && req.body.buildings_id)
	{
		var buildings_aux = JSON.parse(req.body.buildings_id)
		if(buildings_aux.buildings_id instanceof Array)
			buildings_aux = buildings_aux.buildings_id;
		else
			buildings_aux = [buildings_aux.buildings_id];
		var rem_flat_usr  = [];
		var buildings 	  = [];
		for(i in buildings_aux)
		{
			rem_flat_usr.push({building_id:buildings_aux[i]});
			buildings.push({_id:buildings_aux[i]});
		}
		buildingDB.removeBuilding({$or:buildings}, function(BU_results)
		{
			fl_us_DB.removeAllTheFlatVsUserOfBuildings({$or:rem_flat_usr}, function(FU_results)
			{
				var results = {};
				results.fu = FU_results;
				results.bu = BU_results;
				res.send(results);
			});
		});
	}
	else	res.send({access:"No allowed", success:0, error:1});
});


router.get('/allBuilds', function(req, res)
{
	buildingDB.getBuilding("all", function(results)
	{
		res.send({success:0, error:1, result: results});
	});
});


module.exports = router;