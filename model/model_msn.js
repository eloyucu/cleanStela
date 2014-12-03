var Model;
var MsnModel = function(initialModel)
{
	Model		= initialModel;
	this.insertNewMsn= function(msn, callback)
	{
		var object = new Model(msn);
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
	this.getMsn = function(filter, callback)
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
	this.updateMsn = function(msn,  callback)
	{
		console.log("La id de los buildgins: " + msn._id);
		Model.findById(msn._id, function(err, doc)
		{
			if(err) callback({success:0, error:1, result: err});
			else if(!doc || doc.lenght==0) callback({success:0, error:1});
			else
			{
				doc.date = new Date();
				if(msn.answers && msn.answers instanceof Array)		doc.answers	 = msn.answers;
				if(msn.answer)		doc.answers.push(msn.answer);
				doc.save(function(err)
				{
					if(err)callback({success:0, error:1, result: err});
					else callback({success:1, error:0, result:doc});
				});
			}
		});
	}
	this.remove=function()
	{
		Model.remove();
	}
	return this;
}
module.exports = MsnModel;