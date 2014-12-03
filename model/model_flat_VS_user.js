var Model;
var FlatVsUserModel = function(initialModel)
{
	Model = initialModel;
	this.insertNewFlatVsUser= function(flat_Vs_user, callback)
	{
		var object = new Model(flat_Vs_user);
		object.save (function (err) 
		{
		//console.log("model_flat_VS_user> insertNewFlatVsUser-> building_id: " + object.building_id);
		//console.log("model_flat_VS_user> insertNewFlatVsUser-> user_id: " + object.user_id);
		//console.log("model_flat_VS_user> insertNewFlatVsUser-> flat: " + object.flat);
			if(err)
				callback({success:0, error:1, result: err});
			else
				Model.find({_id:object._id}, function(err, doc)
				{
					if(err)
						callback({success:0, error:1, result: err});
					else 
						callback({success:1, error:0, result:doc});
				});
		});
	}
	this.getFlatVsUser = function(filter, callback)
	{
		if(filter=='all')
			Model.find(function(err, doc)
			{
				if(err) callback({success:0, error:1, result: err});
				else callback({success:1, error:0, result:doc});
			});
		else
			Model.find(filter, function(err, doc)
			{
				if(err)
					callback({success:0, error:1, result: err});
				else 
					callback({success:1, error:0, result:doc});
			});
	}
	this.getFieldsFlatVsUser = function(filter, field, callback)
	{
		if(filter=='all')
			Model.find(field, function(err, doc)
			{
				if(err) callback({success:0, error:1, result: err});
				else callback({success:1, error:0, result:doc});
			});
		else
			Model.find(filter, field, function(err, doc)
			{
				if(err)
					callback({success:0, error:1, result: err});
				else 
					callback({success:1, error:0, result:doc});
			});
	}
	/*this.updateFlatVsUser = function(flat_Vs_user,  callback)
	{
		Model.find(flat_Vs_user.building_user, function(err, doc)
		{
			if(err) callback({success:0, error:1, result: err});
			else if(!doc || doc.lenght==0) callback({success:0, error:1});
			else
			{
				if(flat_Vs_user.password)	doc.password = flat_Vs_user.password;
				if(flat_Vs_user.rol)		doc.rol		 = flat_Vs_user.rol;
				if(flat_Vs_user.flats)		doc.flats	 = flat_Vs_user.flats;
				if(flat_Vs_user.flat)		doc.flats.push(flat_Vs_user.flat);
				doc.save(function(err)
				{
					if(err)callback({success:0, error:1, result: err});
					else callback({success:1, error:0, result:doc});
				});
			}
		});
	}*/
	this.removeFlatVsUser = function(flat_Vs_user,  callback)
	{
		Model.findOne(flat_Vs_user, function(err, doc)
		{
			if(!doc)
			{
				console.log("model_falt_VS_user.js-> removeFlatVsUser->find no doc");
				callback({success:0, error:1, result:"no doc found"});
			}
			else if(err)
			{
				console.log("model_falt_VS_user.js-> removeFlatVsUser->find error");
				callback({success:0, error:1, result:err});
			}
			else 
			{
				Model.findById(doc._id,function(err, docy)
				{
					if(!docy)
					{
						console.log("model_falt_VS_user.js-> removeFlatVsUser->findByID no doc");
						callback({success:0, error:1, result:"no doc found"});
					}
					else if(err)
					{
						console.log("model_falt_VS_user.js-> removeFlatVsUser->findByID error");
						callback({success:0, error:1, result:err});
					}
					else docy.remove(function()
					{
						console.log("model_falt_VS_user.js-> removeFlatVsUser->findByID remove");
						callback({success:1, error:0});
					});
				});
			}
		});
	}
	return this;
}
module.exports = FlatVsUserModel;