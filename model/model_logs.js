var LOG_reg;

exports.setModel = function (Model)
{
	LOG_reg = Model;
}

exports.writeFile = function(text, type)
{
	var date = new Date();
	var today_hour		 	= date.getHours();
	var today_minute	 	= date.getMinutes();
	var today_day_week		= date.getDay();
	var today_day_month 	= date.getDate();
	var today_month			= date.getMonth()+1;
	var today_year			= date.getFullYear();
	if(today_day_month<=9)	today_day_month 	= '0'+today_day_month;
	if(today_month<=9)		today_month 		= '0'+today_month;

	
	text = '<div class="notdisapear" style="color:chartreuse;">' + transformWeekDay(today_day_week) + ' ' + today_day_month + ' de ' + transformMonth(today_month) + ' de ' + today_year + ' a las ' + today_hour + ':' + today_minute + '</div>' + ' ' + text +'<div></div>';

	//console.log('Logs text: ' + text);
	var object = new LOG_reg({day:today_day_month, month:today_month, year:today_year, text:text, type:type});
	object.save (function (err) 
	{
		if(!err) console.log('Guardado perfecto de un registro de log en la base de datos. Tipo: ' + type);
		else  console.log('Algún problema ocurrión durante la inserción de un registro de log en la base de datos');
	});
}

exports.getAllFiles = function(resFunction)
{
	LOG_reg.find({type:'serial'}, function(err, serial) 
	{
		LOG_reg.find({type:'model'}, function(err, model)
		{
			LOG_reg.find({type:'controller'}, function(err, controller)
			{
				resFunction(serial, model, controller);
			});
		});
	});
}



function transformWeekDay(day)
{
        switch(day)
        {
                case 1: return 'Lunes';
                case 2: return 'Martes';
                case 3: return 'Miércoles';
                case 4: return 'Jueves';
                case 5: return 'Viernes';
                case 6: return 'Sábado';
                case 0: return 'Domingo';
        }
}

function transformMonth(month)
{
	console.log("logFile.js-> transformMonth-> month: " + month);
	switch(month)
	{
		case '01': return 'Enero';
		case '02': return 'Febrero';
		case '03': return 'Marzo';
		case '04': return 'Abril';
		case '05': return 'Mayo';
		case '06': return 'Junio';
		case '07': return 'Julio';
		case '08': return 'Agosto';
		case '09': return 'Septiembre';
		case 10: return 'Octubre';
		case 11: return 'Noviembre';
		case 12: return 'Diciembre';
	}
}