var mongoose	= require('mongoose');

/*mongoose.connect('mongodb://localhost/cleanStela', function(err, res) 
{
	if(err) {console.log('ERROR: connecting to Database. ' + err);} 
	else 	{console.log('Connected to Database');}
});*/
mongoose.connect('mongodb://heroku_app32169453:a54ffjp9066cdrqmg539fmtr5d@ds051980.mongolab.com:51980/heroku_app32169453', function(err, res) 
{
	if(err) {console.log('ERROR: connecting to Database. ' + err);} 
	else 	{console.log('Connected to Database');}
});
var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var Address		= {
	address:{ type:String, required: true},
	city:{ type:String, required: true },
	ZIP_code:{ type:String },
	province:{ type:String },
	state:{ type:String }
};
var FlatVsUserModel	= new Schema({
	user_id:{ type:Schema.Types.ObjectId, ref:'User', required: true},
	building_id:{ type:Schema.Types.ObjectId, ref:'Building', required: true},
	flat:{type: String, required: true}
});
var BuildingModel	= new Schema({
	address:{type:Address, required: true, index: { unique: true }},
	flats:[],
	cleanTurn:{type: String},
	name: {type: String},
	admin_id:{ type:Schema.Types.ObjectId, ref:'User', required: true}
});

var UserModel		= new Schema({
	name:{ type: String, required: true, index: { unique: true }},
	email:{ type: String, required: true, index: { unique: true }},
	password:{ type: String, required: true},
	rol:{type:String,  enum: ['pedroPicapiedra', 'Admin', 'finalUser'] , required: true,  default:'finalUser'},
	lang:String
});

var Answer			={
	user_name:{type:String, required: true},
	message:{type: String, required: true},
	date:{ type: Date, required: true, default: Date.now}
}
var MessagesModel 	= new Schema({
	user_name:{ type:String, required: true},
	building_id:{ type:Schema.Types.ObjectId, ref:'Building', required: true},
	answers:[Answer],
	title:{type: String, required: true},
	message:{type: String, required: true},
	date:{ type: Date, required: true, default: Date.now}
});

var LOG_reg		= new Schema({
	day:String, 
	month:String, 
	year:String, 
	text:String, 
	type: String
});

var Building	= mongoose.model('Building', BuildingModel);
var User		= mongoose.model('User', UserModel);
var FlatVsUser	= mongoose.model('FlatVsUser', FlatVsUserModel);
var Messages	= mongoose.model('Messages', MessagesModel);
var LOG_reg		= mongoose.model('LOG_reg', LOG_reg);


exports.getLOG_reg = function()
{
	return LOG_reg;
}
exports.getBuilding = function()
{
	return Building;
}
exports.getUser = function()
{
	return User;
}
exports.getMessages = function()
{
	return Messages;
}
exports.getSchema = function()
{
	return Schema;
}
exports.getFlatVSUser = function()
{
	return FlatVsUser;
}