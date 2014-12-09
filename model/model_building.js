var Model;
var BuildingModel = function(initialModel)
{
	Model		= initialModel;
	this.insertNewBuilding= function(building, callback)
	{
		var object = new Model(building);
		object.save (function (err) 
		{
			if(err)
				callback({success:0, error:1, result: err});
			else
			{
				Model.find({_id:object._id}, function(err, doc)
				{
					if(err) callback({success:0, error:1, result: err});
					else callback({success:1, error:0, result:doc});
				});
			}
		});
	}
	this.getBuilding = function(filter, callback)
	{
		if(filter=='all')
			return Model.find(function(err, doc)
			{
				if(err) callback({success:0, error:1, result: err});
				else callback({success:1, error:0, result:doc});
			});
		else
			Model.find(filter, function(err, doc)
			{
				if(err)callback({success:0, error:1, result: err});
				else callback({success:1, error:0, result:doc});
			});
	}
	this.updateBuilding = function(building,  callback)
	{
		Model.findById(building._id, function(err, doc)
		{
			if(err) callback({success:0, error:1, result: err});
			else if(!doc || doc.lenght==0) callback({success:0, error:1});
			else
			{
				if(building.address)  	doc.address		= building.address;
				if(building.city)  		doc.city		= building.city;
				if(building.ZIP_code)  	doc.ZIP_code	= building.ZIP_code;
				if(building.province)  	doc.province	= building.province;
				if(building.name)  		doc.name		= building.name;
				if(building.cleanTurn)	doc.cleanTurn	= building.cleanTurn;
				if(building.flats && building.flats instanceof Array)	doc.flats = building.flats;
				if(building.flat)  		doc.flats.push(building.flat);
				if(building.usersOnFlat)doc.usersOnFlat.push(building.usersOnFlat);
				doc.save(function(err)
				{
					if(err)callback({success:0, error:1, result: err});
					else callback({success:1, error:0, result:doc});
				});
			}
		});
	}
	this.removeBuilding = function(buildings,  callback)
	{
		Model.remove(buildings, function(err)
		{
			callback(err)
		});
	}
	
	return this;
}
module.exports = BuildingModel;