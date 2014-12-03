var Model;
var UserModel = function(initialModel)
{
	Model = initialModel;
	this.insertNewUser= function(user, callback)
	{
		var object = new Model(user);
		object.save (function (err) 
		{
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
	this.getUser = function(filter, callback)
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
	this.getFieldsUser = function(filter, field, callback)
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
	this.updateUser = function(user,  callback)
	{
		Model.findById(user._id, function(err, doc)
		{
			if(err) callback({success:0, error:1, result: err});
			else if(!doc || doc.lenght==0) callback({success:0, error:1});
			else
			{
				if(user.email)		doc.email	 = user.email;
				if(user.password)	doc.password = user.password;
				if(user.rol)		doc.rol		 = user.rol;
				if(user.lang)		doc.lang	 = user.lang;
				doc.save(function(err)
				{
					if(err)callback({success:0, error:1, result: err});
					else callback({success:1, error:0, result:doc});
				});
			}
		});
	}
	/*this.removeUser = function(user,  callback)
	{
		Model.remove(user._id, function()
		{
			callback();
		});
	}*/
	return this;
}
module.exports = UserModel;