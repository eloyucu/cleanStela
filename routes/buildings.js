var router 		= require('express').Router();
var model		= require('../model/main_model');
var buildingDB	= require('../model/model_building')(model.getBuilding());


router.get('/new_building', function(req, res)
{
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra")) res.render('buildings/new_building', {title:"WELLCOME", user:req.session.user});
	else	res.render('users/loggin', {title:"ACCEDER"});
});
router.get('/admin_buildings', function(req, res)
{
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra"))
	{
		buildingDB.getBuilding({admin_id:req.session.user._id}, function(results)
		{
			if(results.error==1 || results.result.length==0) res.render('resource_not_found');
			else res.render('buildings/admin_buildings', {title:"Administra tus edificios.", subtitle:"Inserte la dirección y el resto de datos de su edificio.", user:req.session.user, buildings: results.result, functionality:req.params.functionality});
		});
	}
	else	res.render('users/loggin', {title:"ACCEDER"});
});
router.post('/new_building', function(req, res)
{
	var address = req.body.new_building;
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra") && address)
	{
		var building = {};
		building.address = [JSON.parse(address)];
		building.admin_id = req.session.user._id;
		buildingDB.insertNewBuilding(building, function(results)
		{
			if(results.result.length>0)
			{
				results.go = "/admin_buildings/user";
				res.send(results);
			}
			else
				res.send({success:0, error:1, result: results});
		});
	}
});
router.post('/admin_buildings', function(req, res)
{
	console.log("buildings.js->admin_buildings-> init" + req.body.building);
	var building = req.body.building;
	if(req.session && req.session.user && (req.session.user.rol=="Admin" || req.session.user.rol=="pedroPicapiedra") && building)
	{
		buildingDB.updateBuilding(JSON.parse(building), function(results)
		{
			if(results.length>0)
			{
				console.log("buildings.js->admin_buildings-> results.length>0");
				results.go = "/admin_buildings/user";
				res.send(results);
			}
			else
			{
				console.log("buildings.js->admin_buildings-> else");
				res.send(results);
			}
		});
	}
});




router.get('/allBuilds', function(req, res)
{
	buildingDB.getBuilding("all", function(results)
	{
		res.send({success:0, error:1, result: results});
	});
});


module.exports = router;