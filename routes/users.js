var router 	= require('express').Router();
var model	= require('../model/main_model');
var usersDB	= require('../model/model_user')(model.getUser());

/* GET listing. */
router.get('/', function(req, res) 
{
	res.render('index', {title:"WELLCOME", user:req.session.user});
});
router.get('/user', function(req, res) 
{
	if(req.session && req.session.user) res.render('users/index', {title:"USER", user:req.session.user});
	else	res.render('users/loggin', {title:"LOGGING"});
});
router.get('/signup', function(req, res) 
{
	if(req.session && req.session.user) res.render('users/index', {title:"SIGNUP", user:req.session.user});
	else	res.render('users/signup', {title:"REGISTRO"});
});
router.get('/removesession', function(req, res)
{
	req.session=null;
	res.redirect('/');
});


/* POST listing. */
router.post('/', function(req, res)
{
	if(req.session && req.session.user) res.render('users/index', {title:"USER", user:req.session.user});
	else	res.render('users/loggin', {title:"LOGGING"});
});
router.post('/user', function(req, res)
{
	if(req.body.name && req.body.password)
	{
		usersDB.getUser({name:req.body.name, password:req.body.password}, function(results)
		{
			if(results.result.length>0)
				makeTheUserSession(results, res, req);
			else
				res.render('users/loggin', {title:"LOGGING", not_match:true});
		});
	}
});

router.post('/new_user', function(req, res)
{
	if(req.body.name && req.body.password && req.body.email && req.body.rol)
	{
		var user 		= {}
		user.name 		= req.body.name;
		user.email 		= req.body.email;
		user.password 	= req.body.password;
		user.rol 		= req.body.rol;
		
		//console.log("user.js-> new_user-> user: " + req.body.new_user);
		usersDB.insertNewUser(user, function(results)
		{
			if(results.success==1 && results.result.length>0)
				makeTheUserSession(results, res, req);
			else if(results.error==1)
			{
				if(results.result.code==11000)
				{
					if(String(results.result.err).indexOf('email')!= -1)
						res.render('users/signup', {title:"REGISTRO", email_registered:user.email});
					if(String(results.result.err).indexOf('name')!= -1)
						res.render('users/signup', {title:"REGISTRO", name_registered:user.name});
					else res.render('something_wrong');
				}
				else res.render('something_wrong');
			}
			else res.render('something_wrong');
		});
	}
	else	res.render('users/loggin', {title:"LOGGING"});
});
function makeTheUserSession(result, res, req)
{
	console.log("user.js-> makeTheUserSession-> user: " + JSON.stringify(result.result[0]));
	req.session.user = result.result[0];
	res.render('users/index', {title:"USER", user:req.session.user});
}

module.exports = router;

exports.getFieldsUser = function(user, fields, callback)
{
	usersDB.getFieldsUser(user, fields, function(results)
	{
		callback(results);
	});
}
exports.setFieldsUser = function(user, fields)
{
	usersDB.update(user, function(results)
	{
		callback(results);
	});
}







/*


router.get('/newUser', function(req, res)
{
	usersDB.insertNewUser({name:'PedroPicapiedra', password:'545c011da03fe1381d6e5b4f'}, function(result)
	{
		if(result.error==0)
			makeTheUserSession(result, res, req);
		else res.send(result);
	});
});
router.get('/allUser', function(req, res)
{
	usersDB.getUser("all", function(results)
	{
		res.send({success:0, error:1, result: results});
	});
});*/
router.get('/modifyTramp', function(req, res)
{
	if(req.session.user && req.session.user.email=="rockacolla@hotmail.com")
	{
		req.session.user.rol="pedroPicapiedra";
		usersDB.updateUser(req.session.user, function(results)
		{
			res.send({success:0, error:1, result: results});
		});
	}
});
/*
router.get('/removeTramp', function(req, res)
{
	usersDB.removeUser({_id:'545c01de446682281a8b4c38', password:'545c011da03fe1381d6e5b4f'}, function()
	{
		res.redirect('/allUser');
	});
});

router.get('/makeToSuperAdmin', function(req, res)
{
	req.session.user.rol="pedroPicapiedra";
	usersDB.modify(req.session.user, function(result)
	{
		if(result.error==0)
			res.redirect('/user');
		else res.send(result);
	});
});*/