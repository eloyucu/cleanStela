var router 		= require('express').Router();
var model		= require('../model/main_model');
var usersDB		= require('../model/model_user')(model.getUser());
var buildingDB	= require('../model/model_building')(model.getBuilding());
var fl_us_DB	= require('../model/model_flat_VS_user')(model.getFlatVSUser());
var msn_DB		= require('../model/model_msn')(model.getMessages());
var helper		= require('./helper/helper');


router.get('/superadmin', function(req, res)
{
	if(req.session && req.session.user)
	{
		res.render('emails/superadmin', {title:"SUPERADMIN", user:req.session.user});
	}
});
router.get('/admin', function(req, res)
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
				if(BU_results.success==1 && BU_results.result.length>0)
					res.render('emails/admin', {title:"ADMIN", buildings:BU_results.result, user:req.session.user});
				else
					res.render('emails/admin', {title:"ADMIN", buildings:[], user:req.session.user});
				//res.send({buildings:BU_results.result});
			});
		});
	}
});
router.get('/comunity', function(req, res)
{
	if(req.session && req.session.user)
	{
		fl_us_DB.getFlatVsUser({user_id:req.session.user._id}, function(FL_US_results)
		{
			if(FL_US_results.result.length>0)
			{
				var _ids_building = [];
				var _ids_messages = [];
				var dateSearch = new Date();
				dateSearch.setMonth(dateSearch.getMonth() - 12);
				for(var i in FL_US_results.result)
				{
					_ids_building.push({_id:FL_US_results.result[i].building_id});
					_ids_messages.push({$and:[{building_id:FL_US_results.result[i].building_id}, {date:{$gte:dateSearch}}]});
				}
				msn_DB.getMsn({ $query:{$or:_ids_messages}, $orderby: { date : -1, _id: 1 } }, function(MSN_results)
				{
					buildingDB.getBuilding({ $or:_ids_building}, function(BU_results)
					{
						
						var buildings = [];
						var index_i = 0;
						for(var i in BU_results.result)
						{
							var building 		= {address: BU_results.result[i].address[0]};
							building._id	= BU_results.result[i]._id;
							building.messages=[];
							var answer_messages = [];
							var index_j = 0;
							for(var j in MSN_results.result)
							{
								if(String(MSN_results.result[j].building_id).indexOf(String(BU_results.result[i]._id))!=-1)
								{
									building.messages[index_j]={};
									building.messages[index_j].title 		= MSN_results.result[j].title;
									building.messages[index_j].message 		= MSN_results.result[j].message;
									building.messages[index_j]._id	 		= MSN_results.result[j]._id;
									building.messages[index_j].user_name	= MSN_results.result[j].user_name;
									building.messages[index_j].answers		= MSN_results.result[j].answers;
									var date 								= new Date(MSN_results.result[j].date)
									building.messages[index_j].date 		= date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
									index_j++;
								}
							}
							buildings[index_i] = building;
							index_i++;
						}
						res.render('emails/comunity', {title:"NEIGHBORHOOD", buildings:buildings, user:req.session.user});
						//res.send(buildings);
					});
				});
			}
			else res.render('emails/comunity', {title:"NEIGHBORHOOD", buildings:[], user:req.session.user});
		});
	}
});
router.post('/superadmin', function(req, res)
{
	if(req.session && req.session.user)
	{
		var message= req.body.message;
		var title  = req.body.title;
		usersDB.getUser({rol:'pedroPicapiedra'},function(results)
		{
			console.log("results.succes: " + results.success);
			if(results.success==1)
			{
				var text = "";
				for(var i in req.session.user)
					text += i + ": " + req.session.user[i] + "<br>";
				for(var i in results.result)
					helper.sendAnEmail(results.result[i].email, "SuperCleanStela: " + title, "User: <br>{<br>" + text+ "}<br> message: " + message); 
			}
			res.render('emails/nice', {title:"EMAIL", user:req.session.user});
		});
	}
	else res.render('users/loggin', {title:"LOGGING"});
});
router.post('/admin', function(req, res)
{
	if(req.session && req.session.user)
	{
		var message	 = req.body.message;
		var title  	 = req.body.title;
		var admin_id = req.body.admin_id;
		var address  = req.body.address;
		var city	 = req.body.city;
		var state	 = req.body.state;
		usersDB.getUser({_id:admin_id},function(results)
		{
			if(results.success==1)
			{
				var text = "";
				text = "Name:" 		+ req.session.user['name'] + "<br>";
				text += "Email:" 	+ req.session.user['email'] + "<br>";
				text += "Address:" 	+ address + "<br>";
				text += "City:" 	+ city + "<br>";
				text += "State:" 	+ state + "<br>";
				
				for(var i in results.result)
					helper.sendAnEmail(results.result[i].email, "AdminCleanStela: " + title, "User: <br>{<br>" + text+ "}<br> message: " + message); 
			}
			res.render('emails/nice', {title:"EMAIL", user:req.session.user});
		});
	}
	else res.render('users/loggin', {title:"LOGGING"});
});
router.post('/comunity', function(req, res)
{
	if(req.session && req.session.user)
	{
		var message		= {};
		if(req.body.answer_message != null || (req.body.answers != null && message.answers instanceof Array))
		{	
			message.answers 		= req.body.answers;
			if(req.body.answer_message!=null)
			{
				message.answer={};
				message.answer.user_name = req.session.user.name;
				message.answer.message	 = req.body.answer_message;
			}
			message._id 				 = req.body.msn_id
			msn_DB.updateMsn(message, function(results)
			{
				//res.send(results);
				res.redirect('comunity');
			});
		}
		else
		{
			message.message			= req.body.message;
			message.title  			= req.body.title;
			message.building_id 	= req.body.building_id;
			message.user_name		= req.session.user.name;
			msn_DB.insertNewMsn(message, function(results)
			{
				fl_us_DB.getFlatVsUser({building_id:message.building_id}, function(FL_US_results)
				{
					if(FL_US_results.success==1)
					{
						buildingDB.getBuilding({_id:message.building_id}, function(BU_results)
						{
							if(BU_results.success==1)
							{
								var _ids = [];
								for(var i in FL_US_results.result)
									_ids.push({_id:FL_US_results.result[i].user_id});
								usersDB.getUser({ $or:_ids}, function(US_results)
								{
									if(US_results.success==1)
									{
										var text = "";
										text = "Name:" 		+ req.session.user['name'] + "<br>";
										text += "Email:" 	+ req.session.user['email'] + "<br>";
										text += "Address:" 	+ BU_results.result[0].address[0].address + "<br>";
										text += "City:" 	+ BU_results.result[0].address[0].city + "<br>";
										text += "State:" 	+ BU_results.result[0].address[0].state + "<br>";
										
										for(var i in US_results.result)
											helper.sendAnEmail(US_results.result[i].email, "CleanStela: " + message.title, "USER<br>" + text+ "<br> <br>", "MESSAGE<br>" + message.message); 
									}
								});
							}
						});
					}
				});
				//res.send(results);
				res.redirect('comunity');
			});
		}
	}
	else res.render('users/loggin', {title:"LOGGING"});
});





router.get('/false_comunity', function(req, res)
{
	
	msn_DB.getMsn("all", function(results)
	{
		res.send(results);
		//res.redirect('/comunity');
	});
});



module.exports = router;